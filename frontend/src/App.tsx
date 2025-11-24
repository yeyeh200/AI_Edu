import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Login } from '@/pages/Login';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import lazyRoutes from '@/routes/lazyRoutes';
import { System } from '@/pages/System';

/**
 * 渲染路由
 * @param routes - 路由配置
 * @returns React 元素
 */
const renderRoutes = (routes: typeof lazyRoutes) => {
  return routes.map((route) => {
    const { path, element: Element, children } = route;
    return (
      <Route key={path} path={path} element={<Element />}>
        {children && renderRoutes(children as typeof lazyRoutes)}
      </Route>
    );
  });
};

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

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
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
  );
}

export default App;