import { Routes, Route, Navigate, BrowserRouter, useRoutes } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Login } from '@/pages/Login/Login';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import lazyRoutes from '@/routes/lazyRoutes';
import { System } from '@/pages/System';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * 渲染路由
 * @param routes - 路由配置
 * @returns React 元素
 */
const renderRoutes = (routes: typeof lazyRoutes) => {
  return routes.map((route) => {
    const { path, element: Element, children } = route;
    const ElementComponent = Element as React.ComponentType;
    return (
      <Route key={path} path={path} element={<ElementComponent />}>
        {children && renderRoutes(children as typeof lazyRoutes)}
      </Route>
    );
  });
};

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {user ? (
          <Layout>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {renderRoutes(lazyRoutes)}
                {user.role === 'admin' && (
                  <Route path="/system" element={<System />} />
                )}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;