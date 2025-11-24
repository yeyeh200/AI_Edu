// Enhanced API client with comprehensive error handling and retry mechanisms

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { logApiCall, logError, logDebug, logWarn } from '@/utils/error/logger';
import errorHandler from '@/utils/error/errorHandler';

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
  config?: AxiosRequestConfig;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition?: (error: ApiError) => boolean;
  onRetry?: (error: ApiError, retryCount: number) => void;
}

export interface RequestConfig extends AxiosRequestConfig {
  retry?: RetryConfig;
  timeout?: number;
  skipErrorHandler?: boolean;
  customErrorHandler?: (error: ApiError) => void;
}

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
      // Retry on network errors, 5xx server errors, and specific 4xx errors
      return !error.status ||
        error.status >= 500 ||
        error.status === 408 ||
        error.status === 429;
    },
  };

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/api',
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const requestId = this.generateRequestId();
        config.metadata = { requestId, startTime: Date.now() };

        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request
        logDebug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          requestId,
          data: config.data,
          headers: this.sanitizeHeaders(config.headers),
        });

        return config;
      },
      (error) => {
        logError('API Request interceptor error', { error });
        return Promise.reject(this.transformError(error));
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const { requestId, startTime } = response.config.metadata || {};
        const duration = startTime ? Date.now() - startTime : undefined;

        // Log successful response
        logApiCall(
          response.config.method?.toUpperCase() || 'UNKNOWN',
          response.config.url || '',
          response.status,
          duration || 0,
          {
            requestId,
            data: response.data,
            headers: this.sanitizeHeaders(response.headers),
          }
        );

        return response;
      },
      (error) => {
        const transformedError = this.transformError(error);
        const { config } = error;

        if (!config?.metadata) {
          config.metadata = { requestId: this.generateRequestId(), startTime: Date.now() };
        }

        const { requestId, startTime } = config.metadata;
        const duration = startTime ? Date.now() - startTime : undefined;

        // Log error response
        logApiCall(
          config.method?.toUpperCase() || 'UNKNOWN',
          config.url || '',
          error.response?.status || 0,
          duration || 0,
          {
            requestId,
            error: {
              message: transformedError.message,
              status: transformedError.status,
              code: transformedError.code,
            },
          }
        );

        // Handle authentication errors
        if (transformedError.status === 401) {
          this.handleAuthError(transformedError);
        }

        return Promise.reject(transformedError);
      }
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAuthToken(): string | null {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.token || parsed.access_token;
      }
    } catch (error) {
      logDebug('Failed to get auth token', { error });
    }
    return null;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    delete sanitized.Authorization;
    delete sanitized.authorization;
    return sanitized;
  }

  private transformError(error: any): ApiError {
    const apiError: ApiError = new Error(error.message || 'Unknown API error') as ApiError;

    if (error.response) {
      // Server responded with error status
      apiError.status = error.response.status;
      apiError.code = error.response.data?.code || 'SERVER_ERROR';
      apiError.details = error.response.data;
      apiError.config = error.config;
      apiError.message = error.response.data?.message || `HTTP ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      apiError.status = 0;
      apiError.code = 'NETWORK_ERROR';
      apiError.message = 'Network error - no response received';
      apiError.config = error.config;
    } else {
      // Other error
      apiError.code = 'UNKNOWN_ERROR';
      apiError.config = error.config;
    }

    return apiError;
  }

  private handleAuthError(error: ApiError) {
    logWarn('Authentication error detected', {
      status: error.status,
      message: error.message
    });

    // Clear auth token
    localStorage.removeItem('auth');
    localStorage.removeItem('user');

    // Redirect to login if not already there
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  // Main request method with retry logic
  async request<T = any>(config: RequestConfig): Promise<AxiosResponse<T>> {
    const { retry = this.defaultRetryConfig, customErrorHandler, skipErrorHandler } = config;

    try {
      const response = await this.axiosInstance.request<T>(config);
      return response;
    } catch (error) {
      const apiError = error as ApiError;

      // Custom error handling
      if (customErrorHandler && !skipErrorHandler) {
        customErrorHandler(apiError);
      }

      // Retry logic
      if (retry && retry.retryCondition?.(apiError) && retry.maxRetries > 0) {
        return this.retryRequest({ ...config, retry: { ...retry, maxRetries: retry.maxRetries - 1 } }, apiError);
      }

      // Global error handling
      if (!skipErrorHandler) {
        this.handleGlobalError(apiError, config);
      }

      throw apiError;
    }
  }

  private async retryRequest<T>(config: RequestConfig, originalError: ApiError): Promise<AxiosResponse<T>> {
    const { retry } = config;
    if (!retry || retry.maxRetries <= 0) {
      throw originalError;
    }

    const retryCount = (this.defaultRetryConfig.maxRetries - retry.maxRetries) + 1;

    // Log retry attempt
    logDebug(`API retry attempt ${retryCount}`, {
      url: config.url,
      method: config.method,
      originalError: originalError.message,
      retryCount,
    });

    // Call retry callback
    if (retry.onRetry) {
      retry.onRetry(originalError, retryCount);
    }

    // Wait before retrying
    await this.delay(retry.retryDelay * retryCount); // Exponential backoff

    try {
      const response = await this.axiosInstance.request<T>(config);

      // Log successful retry
      logDebug(`API retry successful`, {
        url: config.url,
        method: config.method,
        retryCount,
      });

      return response;
    } catch (error) {
      // Recursive retry
      return this.retryRequest(
        { ...config, retry: { ...retry, maxRetries: retry.maxRetries - 1 } },
        error as ApiError
      );
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleGlobalError(error: ApiError, config: RequestConfig) {
    // Don't log certain expected errors
    const skipGlobalHandling = error.status === 401 || // Auth errors handled separately
      error.status === 403 || // Permission errors are expected
      config.skipErrorHandler;

    if (!skipGlobalHandling) {
      logError('API request failed', {
        url: config.url,
        method: config.method,
        status: error.status,
        message: error.message,
        details: error.details,
      });

      // Report to global error handler
      errorHandler.handleError({
        message: `API Error: ${error.message}`,
        stack: error.stack,
        component: 'api-client',
        action: `${config.method?.toUpperCase()} ${config.url}`,
        additionalData: {
          status: error.status,
          code: error.code,
          details: error.details,
        },
      });
    }
  }

  // Convenience methods
  async get<T = any>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // File upload with progress tracking
  async upload<T = any>(
    url: string,
    file: File | FormData,
    config?: RequestConfig & { onProgress?: (progress: number) => void }
  ): Promise<AxiosResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      onUploadProgress: config?.onProgress ? (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        config.onProgress!(progress);
      } : undefined,
    });
  }

  // Download file
  async download(
    url: string,
    filename?: string,
    config?: RequestConfig
  ): Promise<void> {
    const response = await this.request<Blob>({
      ...config,
      method: 'GET',
      url,
      responseType: 'blob',
    });

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Request cancellation
  createCancelToken() {
    return axios.CancelToken.source();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', { timeout: 5000, skipErrorHandler: true });
      return true;
    } catch (error) {
      logDebug('Health check failed', { error });
      return false;
    }
  }

  // Get instance for external use
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create and export singleton instance
const apiClient = ApiClient.getInstance();

export default apiClient;

// Export convenience functions
export const {
  get,
  post,
  put,
  patch,
  delete: del,
  upload,
  download,
  request,
  createCancelToken,
  healthCheck,
  getAxiosInstance,
} = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  upload: apiClient.upload.bind(apiClient),
  download: apiClient.download.bind(apiClient),
  request: apiClient.request.bind(apiClient),
  createCancelToken: apiClient.createCancelToken.bind(apiClient),
  healthCheck: apiClient.healthCheck.bind(apiClient),
  getAxiosInstance: apiClient.getAxiosInstance.bind(apiClient),
};