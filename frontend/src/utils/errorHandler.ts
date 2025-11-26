import { AxiosError } from 'axios'

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorCallbacks: Array<(error: ApiError) => void> = []

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // 注册错误回调
  onError(callback: (error: ApiError) => void): () => void {
    this.errorCallbacks.push(callback)
    // 返回取消注册的函数
    return () => {
      const index = this.errorCallbacks.indexOf(callback)
      if (index > -1) {
        this.errorCallbacks.splice(index, 1)
      }
    }
  }

  // 触发错误回调
  private notifyError(error: ApiError): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error)
      } catch (e) {
        console.error('Error in error callback:', e)
      }
    })
  }

  // 处理API错误
  handleApiError(error: any): ApiError {
    const apiError: ApiError = {
      message: '未知错误',
      code: 'UNKNOWN_ERROR',
    }

    if (error?.response) {
      // Axios 响应错误
      const status = error.response.status
      const data = error.response.data

      apiError.status = status
      apiError.code = data?.error || `HTTP_${status}`
      apiError.message = data?.message || this.getDefaultErrorMessage(status)
      apiError.details = data?.details

      // 特殊处理认证错误
      if (status === 401) {
        this.handleAuthError(apiError)
      }
    } else if (error?.request) {
      // 网络错误
      apiError.code = 'NETWORK_ERROR'
      apiError.message = '网络连接失败，请检查网络设置'
    } else if (error instanceof Error) {
      // JavaScript 错误
      apiError.code = 'JAVASCRIPT_ERROR'
      apiError.message = error.message
    } else if (typeof error === 'string') {
      // 字符串错误
      apiError.code = 'STRING_ERROR'
      apiError.message = error
    }

    // 记录错误日志
    this.logError(apiError, error)

    // 通知错误回调
    this.notifyError(apiError)

    return apiError
  }

  // 处理前端运行时错误
  handleRuntimeError(error: Error, errorInfo?: any): ApiError {
    const apiError: ApiError = {
      message: error.message || '应用运行时错误',
      code: 'RUNTIME_ERROR',
      details: errorInfo,
    }

    this.logError(apiError, error)
    this.notifyError(apiError)

    return apiError
  }

  // 处理认证错误
  private handleAuthError(error: ApiError): void {
    // 清除本地存储的认证信息
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')

    // 如果不是在登录页面，则跳转到登录页
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
  }

  // 获取默认错误消息
  private getDefaultErrorMessage(status: number): string {
    const statusMessages: Record<number, string> = {
      400: '请求参数错误',
      401: '身份验证失败',
      403: '权限不足',
      404: '请求的资源不存在',
      429: '请求过于频繁，请稍后重试',
      500: '服务器内部错误',
      502: '服务器网关错误',
      503: '服务暂时不可用',
      504: '服务器响应超时',
    }

    return statusMessages[status] || '请求失败'
  }

  // 记录错误日志
  private logError(apiError: ApiError, originalError: any): void {
    const logData = {
      timestamp: new Date().toISOString(),
      error: apiError,
      original: originalError,
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    // 在开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 API Error Details')
      console.error('Processed Error:', apiError)
      console.error('Original Error:', originalError)
      console.log('Full Log:', logData)
      console.groupEnd()
    } else {
      // 在生产环境下可以发送到错误监控服务
      console.error('API Error:', logData)
      // 这里可以集成 Sentry 或其他错误监控服务
      // Sentry.captureException(originalError, { extra: logData })
    }
  }

  // 显示用户友好的错误消息
  showError(error: ApiError, showToast = true): void {
    if (showToast) {
      // 这里可以集成 toast 组件
      alert(`错误: ${error.message}`)
    }
  }

  // 重试机制
  async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error

        if (i === maxRetries) {
          // 最后一次重试失败，处理错误
          throw this.handleApiError(error)
        }

        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }

    throw lastError
  }
}

// 导出单例实例
export const errorHandler = ErrorHandler.getInstance()

// 导出便捷函数
export const handleApiError = (error: any) => errorHandler.handleApiError(error)
export const handleRuntimeError = (error: Error, errorInfo?: any) =>
  errorHandler.handleRuntimeError(error, errorInfo)

// React Hook for error handling
export const useErrorHandler = () => {
  const handleError = (error: any, showToast = true) => {
    const apiError = handleApiError(error)
    if (showToast) {
      errorHandler.showError(apiError)
    }
    return apiError
  }

  const addErrorCallback = (callback: (error: ApiError) => void) => {
    return errorHandler.onError(callback)
  }

  const retry = <T>(fn: () => Promise<T>, maxRetries?: number, delay?: number) => {
    return errorHandler.retry(fn, maxRetries, delay)
  }

  return {
    handleError,
    addErrorCallback,
    retry,
  }
}

// 高阶组件：为组件添加错误边界
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) => {
  return class ErrorBoundary extends React.Component<
    P,
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: P) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      handleRuntimeError(error, errorInfo)
    }

    resetError = () => {
      this.setState({ hasError: false, error: null })
    }

    render() {
      if (this.state.hasError && this.state.error) {
        const FallbackComponent = fallback || DefaultErrorFallback
        return React.createElement(FallbackComponent, {
          error: this.state.error,
          resetError: this.resetError
        })
      }

      return React.createElement(Component, this.props)
    }
  }
}

// 默认错误回退组件
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => {
  return React.createElement('div', {
    className: "min-h-screen flex items-center justify-center bg-gray-50"
  },
    React.createElement('div', {
      className: "text-center p-8"
    }, [
      React.createElement('div', {
        key: "icon",
        className: "text-6xl text-red-500 mb-4"
      }, '⚠️'),
      React.createElement('h1', {
        key: "title",
        className: "text-2xl font-bold text-gray-900 mb-2"
      }, '页面出错了'),
      React.createElement('p', {
        key: "message",
        className: "text-gray-600 mb-6"
      }, error.message || '应用遇到了意外错误，请刷新页面重试'),
      React.createElement('button', {
        key: "button",
        onClick: resetError,
        className: "bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
      }, '重新加载')
    ])
  )
}