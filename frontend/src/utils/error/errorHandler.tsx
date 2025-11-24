import React from 'react';

// Comprehensive error handling and logging system

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  component?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: string;
  userId?: string;
  sessionId: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private sessionId: string;
  private errorQueue: ErrorInfo[] = [];
  private logQueue: LogEntry[] = [];
  private isOnline = navigator.onLine;
  private maxQueueSize = 100;
  private flushInterval = 30000; // 30 seconds
  private apiEndpoint = '/api/logs';
  private retryAttempts = 3;
  private currentRetryCount = 0;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeEventListeners();
    this.startPeriodicFlush();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeEventListeners() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        component: 'window',
        action: 'uncaught-error',
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        component: 'promise',
        action: 'unhandled-rejection',
        additionalData: {
          reason: event.reason,
        },
      });
    });

    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueues();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.flushQueues(true);
    });

    // Monitor resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const element = event.target as HTMLElement;
        this.handleError({
          message: 'Resource loading failed',
          component: 'resource',
          action: 'load-error',
          additionalData: {
            tagName: element.tagName,
            src: (element as HTMLImageElement).src || (element as HTMLScriptElement).src,
          },
        });
      }
    }, true);
  }

  // Main error handling method
  handleError(errorInfo: Partial<ErrorInfo>) {
    const fullErrorInfo: ErrorInfo = {
      message: errorInfo.message || 'Unknown error',
      stack: errorInfo.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      component: errorInfo.component,
      action: errorInfo.action,
      additionalData: errorInfo.additionalData,
    };

    // Add to queue
    this.errorQueue.push(fullErrorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorHandler]', fullErrorInfo);
    }

    // Try to flush immediately for critical errors
    if (this.isCriticalError(fullErrorInfo)) {
      this.flushErrorQueue();
    }

    // Prevent queue from growing too large
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  // Logging methods
  log(level: LogLevel, message: string, data?: any, context?: string) {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
    };

    this.logQueue.push(logEntry);

    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      const levelName = LogLevel[level];
      const consoleMethod = this.getConsoleMethod(level);
      consoleMethod(`[${levelName}] ${message}`, data || '');
    }

    // Prevent queue from growing too large
    if (this.logQueue.length > this.maxQueueSize) {
      this.logQueue = this.logQueue.slice(-this.maxQueueSize);
    }
  }

  debug(message: string, data?: any, context?: string) {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: any, context?: string) {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: any, context?: string) {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, data?: any, context?: string) {
    this.log(LogLevel.ERROR, message, data, context);
  }

  fatal(message: string, data?: any, context?: string) {
    this.log(LogLevel.FATAL, message, data, context);
  }

  // Get appropriate console method
  private getConsoleMethod(level: LogLevel): Console['log'] {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error;
      default:
        return console.log;
    }
  }

  // Check if error is critical
  private isCriticalError(errorInfo: ErrorInfo): boolean {
    const criticalKeywords = ['critical', 'fatal', 'security', 'authentication'];
    return criticalKeywords.some(keyword =>
      errorInfo.message.toLowerCase().includes(keyword) ||
      errorInfo.action?.toLowerCase().includes(keyword)
    );
  }

  // Get current user ID
  private getCurrentUserId(): string | undefined {
    try {
      // Try to get from auth store or localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch (error) {
      // Silently fail
    }
    return undefined;
  }

  // Flush methods
  private startPeriodicFlush() {
    setInterval(() => {
      this.flushQueues();
    }, this.flushInterval);
  }

  private async flushQueues(isSync = false) {
    if (!this.isOnline && !isSync) {
      return;
    }

    if (this.errorQueue.length > 0) {
      await this.flushErrorQueue(isSync);
    }

    if (this.logQueue.length > 0) {
      await this.flushLogQueue(isSync);
    }
  }

  private async flushErrorQueue(isSync = false) {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.sendToServer(`${this.apiEndpoint}/errors`, { errors }, isSync);
      this.currentRetryCount = 0;
    } catch (error) {
      console.warn('Failed to send errors to server:', error);
      // Re-add to queue for retry
      this.errorQueue.unshift(...errors);
      this.scheduleRetry();
    }
  }

  private async flushLogQueue(isSync = false) {
    if (this.logQueue.length === 0) return;

    const logs = [...this.logQueue];
    this.logQueue = [];

    try {
      await this.sendToServer(`${this.apiEndpoint}/logs`, { logs }, isSync);
      this.currentRetryCount = 0;
    } catch (error) {
      console.warn('Failed to send logs to server:', error);
      // Re-add to queue for retry
      this.logQueue.unshift(...logs);
      this.scheduleRetry();
    }
  }

  private async sendToServer(url: string, data: any, isSync = false): Promise<void> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      // Use keepalive for sync requests during page unload
      keepalive: isSync,
    };

    if (isSync) {
      // For sync requests, use sendBeacon if available
      if ('sendBeacon' in navigator) {
        const success = navigator.sendBeacon(url, JSON.stringify(data));
        if (!success) {
          throw new Error('sendBeacon failed');
        }
        return;
      }
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  private scheduleRetry() {
    if (this.currentRetryCount >= this.retryAttempts) {
      console.warn('Max retry attempts reached, giving up');
      return;
    }

    this.currentRetryCount++;
    const delay = Math.pow(2, this.currentRetryCount) * 1000; // Exponential backoff

    setTimeout(() => {
      if (this.isOnline) {
        this.flushQueues();
      }
    }, delay);
  }

  // Public methods for manual flushing
  public flushErrors() {
    return this.flushErrorQueue();
  }

  public flushLogs() {
    return this.flushLogQueue();
  }

  public flushAll() {
    return this.flushQueues();
  }

  // Get statistics
  public getStats() {
    return {
      sessionId: this.sessionId,
      errorQueueSize: this.errorQueue.length,
      logQueueSize: this.logQueue.length,
      isOnline: this.isOnline,
      retryCount: this.currentRetryCount,
    };
  }

  // Clear queues
  public clearQueues() {
    this.errorQueue = [];
    this.logQueue = [];
  }

  // Set user context
  public setUserId(userId: string) {
    localStorage.setItem('currentUserId', userId);
  }

  // Custom error boundary support
  public captureReactError(error: Error, errorInfo: any) {
    this.handleError({
      message: error.message,
      stack: error.stack,
      component: 'react',
      action: 'error-boundary',
      additionalData: {
        componentStack: errorInfo.componentStack,
      },
    });
  }
}

// Create singleton instance
const errorHandler = ErrorHandler.getInstance();

// Export convenience methods
export const handleGlobalError = errorHandler.handleError.bind(errorHandler);
export const logDebug = errorHandler.debug.bind(errorHandler);
export const logInfo = errorHandler.info.bind(errorHandler);
export const logWarn = errorHandler.warn.bind(errorHandler);
export const logError = errorHandler.error.bind(errorHandler);
export const logFatal = errorHandler.fatal.bind(errorHandler);

// React error boundary
export class ErrorBoundaryHandler extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; resetError: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorHandler.captureReactError(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.props.fallback) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export default errorHandler;