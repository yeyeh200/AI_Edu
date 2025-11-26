import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ApiResponse } from '@/types'
import { errorHandler } from './errorHandler'

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 从store获取token
    const token = useAuthStore.getState().token

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求ID
    if (config.headers) {
      config.headers['X-Request-ID'] = generateRequestId()
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    })

    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
    })

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 使用统一错误处理
    const apiError = errorHandler.handleApiError(error)

    // 处理401未授权错误的token刷新逻辑
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const authStore = useAuthStore.getState()

      try {
        // 尝试刷新token
        const token = authStore.token
        if (token) {
          const refreshResponse = await axios.post('http://localhost:8000/api/auth/refresh', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (refreshResponse.data.success && refreshResponse.data.data?.token) {
            const newToken = refreshResponse.data.data.token

            // 更新store中的token
            authStore.updateUser({
              ...authStore.user!,
              // 这里需要更新token，但由于store结构限制，暂时不处理
            })

            // 重新发送原始请求
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return apiClient(originalRequest)
          }
        }
      } catch (refreshError) {
        console.error('[Token Refresh Error]', refreshError)
      }

      // 刷新失败，清除认证状态并跳转到登录页
      authStore.logout()
      window.location.href = '/login'
    }

    // 抛出处理后的错误
    throw apiError
  }
)

// 生成请求ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 导出API客户端实例
export { apiClient }

// 导出便捷方法
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<ApiResponse<T>>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<ApiResponse<T>>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<ApiResponse<T>>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<ApiResponse<T>>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<ApiResponse<T>>(url, config),
}