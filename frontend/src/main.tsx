console.log('Main.tsx executing');
import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

// Performance monitoring
import '@/utils/performance/monitor'

// Error handling and logging
import '@/utils/error/errorHandler'
import logger, { setLogContext } from '@/utils/error/logger'
import { ErrorBoundary } from '@/components/Error/ErrorBoundary'

// Lazy loaded routes for code splitting
import { lazyRoutes } from '@/routes/lazyRoutes'
import { usePerformanceOptimization } from '@/hooks/usePerformance'

// Lazy load components
const Layout = React.lazy(() => import('@/components/layout/Layout').then(module => ({ default: module.Layout })))

// Performance-optimized QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Custom retry logic based on error type
        if (error instanceof Error && error.message.includes('404')) {
          return false; // Don't retry 404 errors
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      // Prefetching optimization
    },
    mutations: {
      retry: 1,
    },
  },
});

// App component with performance optimizations
const App: React.FC = () => {
  const { bundleInfo, networkInfo, isSlowNetwork } = usePerformanceOptimization();

  useEffect(() => {
    // Set application context for logging
    setLogContext({
      component: 'App',
      version: '1.0.0', // Hardcoded for now to avoid TS error
      environment: process.env.NODE_ENV || 'development',
    });

    // Log application start
    logger.info('Application started', {
      bundleSize: bundleInfo.totalSize,
      networkType: (networkInfo as any)?.effectiveType,
      isSlowNetwork,
      timestamp: new Date().toISOString(),
    });

    // Initialize performance optimizations
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          logger.info('Service Worker registered successfully', { registration });
        })
        .catch((error) => {
          logger.warn('Service Worker registration failed', { error });
        });
    }

    // Prefetch critical routes when idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const prefetchStrategies = {
        prefetchOnIdle: (fn: () => Promise<any>) => {
          window.requestIdleCallback(() => {
            fn().catch(console.error);
          });
        }
      };

      prefetchStrategies.prefetchOnIdle(async () => {
        await import('@/pages/Dashboard/Dashboard');
        await import('@/pages/Analytics/Analytics');
      });
    }

    // Monitor performance
    const performanceData = {
      bundleSize: bundleInfo.totalSize,
      networkType: (networkInfo as any)?.effectiveType,
      isSlowNetwork,
      isSlowNetwork,
    };

    logger.debug('Performance metrics initialized', performanceData);
  }, [bundleInfo, networkInfo, isSlowNetwork]);

  // Create root route
  const rootRoute = createRootRoute({
    component: Layout,
    notFoundComponent: () => <div className="p-4">Page Not Found</div>,
  });

  // Helper to map plain route objects to TanStack Router routes
  const mapRoutes = (routes: any[], parent: any): any[] => {
    return routes.map(route => {
      const routeOptions: any = {
        getParentRoute: () => parent,
        path: route.path,
        component: route.element,
      };

      if (route.loader) {
        routeOptions.loader = route.loader;
      }

      const newRoute = createRoute(routeOptions);

      if (route.children) {
        newRoute.addChildren(mapRoutes(route.children, newRoute));
      }

      return newRoute;
    });
  };

  // Build route tree
  console.log('LazyRoutes:', lazyRoutes);
  const routeChildren = mapRoutes(lazyRoutes, rootRoute);
  console.log('RouteChildren:', routeChildren);
  const routeTree = rootRoute.addChildren(routeChildren);

  const router = createRouter({
    routeTree,
    defaultPreload: isSlowNetwork ? 'intent' : false,
    // Optimize for slow networks
    defaultComponent: () => (
      <Suspense fallback={<div>Loading...</div>}>
        <div>Default route component</div>
      </Suspense>
    ),
  });

  console.log('Router created:', router);

  return (
    <RouterProvider router={router} />
  );
};

// Enhanced error boundary with performance tracking
const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Application error:', event.error);
      setError(event.error);
      setHasError(true);

      // Report performance and error metrics
      if (window.performanceMonitor) {
        window.performanceMonitor.recordMetric('application-error', 1, 'custom', {
          message: event.error?.message,
          stack: event.error?.stack,
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">应用出现错误</h1>
            <p className="text-gray-600 mb-4">抱歉，应用程序遇到了意外错误。</p>
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">查看错误详情</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                重新加载
              </button>
              <button
                onClick={() => {
                  setHasError(false);
                  setError(null);
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                继续使用
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">正在加载应用...</p>
    </div>
  </div>
);

// Render app with performance optimizations and error handling
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <ErrorBoundary context="AppRoot">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </QueryClientProvider>
      </ErrorBoundary>
    </AppErrorBoundary>
  </React.StrictMode>
)