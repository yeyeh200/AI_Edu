import React, { Component, ReactNode } from 'react';
import errorHandler, { logError, logDebug } from '@/utils/error/errorHandler';
import { useLogger, setLogContext } from '@/utils/error/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  context?: string;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  retry: () => void;
  retryCount: number;
  maxRetries: number;
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  retry,
  retryCount,
  maxRetries,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.82 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">应用出现错误</h1>
          <p className="text-gray-600 mb-6">
            抱歉，应用程序遇到了意外错误。我们已经记录了这个问题，请稍后再试。
          </p>

          {/* Error Message */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800 font-medium">错误信息:</p>
            <p className="text-sm text-red-600 mt-1">{error.message}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={retry}
              disabled={retryCount >= maxRetries}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {retryCount >= maxRetries ? '重试次数已达上限' : `重试 (${retryCount}/${maxRetries})`}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              重新加载页面
            </button>

            {/* Error Details Toggle */}
            <details className="text-left">
              <summary
                className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDetails(!showDetails);
                }}
              >
                {showDetails ? '隐藏' : '查看'}错误详情
              </summary>

              {showDetails && (
                <div className="mt-3 space-y-3">
                  {/* Component Stack */}
                  {errorInfo?.componentStack && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-xs font-medium text-gray-700 mb-1">组件堆栈:</p>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-32">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}

                  {/* Error Stack */}
                  {error.stack && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-xs font-medium text-gray-700 mb-1">错误堆栈:</p>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-32">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {/* Error Info */}
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs font-medium text-gray-700 mb-1">错误信息:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>类型:</strong> {error.name}</p>
                      <p><strong>时间:</strong> {new Date().toLocaleString()}</p>
                      <p><strong>用户代理:</strong> {navigator.userAgent}</p>
                      <p><strong>URL:</strong> {window.location.href}</p>
                    </div>
                  </div>
                </div>
              )}
            </details>
          </div>

          {/* Support Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              如果问题持续存在，请联系技术支持。
            </p>
            <p className="text-xs text-gray-400 mt-1">
              错误ID: {error.name}-${Date.now()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Functional Error Boundary Hook
export const useErrorBoundary = (context: string) => {
  const [error, setError] = React.useState<Error | null>(null);
  const { error: logErrorHook } = useLogger(context);

  React.useEffect(() => {
    setLogContext({ context });
  }, [context]);

  const captureError = React.useCallback((error: Error, errorInfo?: any) => {
    setError(error);
    logErrorHook(error.message, { context, errorInfo });
    errorHandler.handleError({
      message: error.message,
      stack: error.stack,
      component: context,
      action: 'hook-captured',
      additionalData: { errorInfo },
    });
  }, [context, logErrorHook]);

  const reset = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, captureError, reset };
};

// Class-based Error Boundary Component
class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Set logging context
    if (this.props.context) {
      setLogContext({ component: this.props.context });
    }

    // Log the error
    logError('React Error Boundary caught an error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      context: this.props.context,
      retryCount: this.state.retryCount,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to global error handler
    errorHandler.captureReactError(error, errorInfo);
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));

      logDebug(`Error boundary retry attempt ${this.state.retryCount + 1}`, {
        context: this.props.context,
        retryCount: this.state.retryCount + 1,
      });
    }
  };

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state;
    const { children, fallback: Fallback, maxRetries = 3, context } = this.props;

    if (hasError && error) {
      const FallbackComponent = Fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={error}
          errorInfo={errorInfo}
          retry={this.handleRetry}
          retryCount={retryCount}
          maxRetries={maxRetries}
        />
      );
    }

    return children;
  }
}

// Export both components
export const ErrorBoundary = ErrorBoundaryClass;

// Hook-based error boundary for functional components
export const ErrorBoundaryProvider: React.FC<{
  children: ReactNode;
  context: string;
  fallback?: React.ComponentType<{ error: Error; reset: () => void; retryCount: number }>;
}> = ({ children, context, fallback }) => {
  const { error, captureError, reset } = useErrorBoundary(context);
  const [retryCount, setRetryCount] = React.useState(0);

  const handleReset = React.useCallback(() => {
    reset();
    setRetryCount(0);
  }, [reset]);

  if (error) {
    const FallbackComponent = fallback || DefaultErrorFallback;
    return (
      <FallbackComponent
        error={error}
        errorInfo={null}
        retry={handleReset}
        retryCount={retryCount}
        maxRetries={3}
      />
    );
  }

  return <>{children}</>;
};

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default ErrorBoundary;