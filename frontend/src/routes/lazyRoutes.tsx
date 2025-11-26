import { lazy } from 'react';

// Inline fallback components for missing pages
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50" >
    <div className="text-center" >
      <h1 className="text-4xl font-bold text-gray-900 mb-4" > 404 </h1>
      < p className="text-gray-600" > Page Not Found </p>
    </div>
  </div>
);

const ErrorPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50" >
    <div className="text-center" >
      <h1 className="text-4xl font-bold text-red-600 mb-4" > Error </h1>
      < p className="text-gray-600" > Something went wrong </p>
    </div>
  </div>
);

// Lazy loaded components for code splitting
const EnhancedDashboard = lazy(() => import('@/pages/Dashboard/EnhancedDashboard').then(module => ({
  default: module.EnhancedDashboard
})));

const LoginPage = lazy(() => import('@/pages/Login/Login').then(module => ({
  default: module.Login
})));

const DataPage = lazy(() => import('@/pages/Data/DataPage').then(module => ({
  default: module.DataPage
})));

const AnalyticsPage = lazy(() => import('@/pages/Analytics/Analytics').then(module => ({
  default: module.Analytics
})));

const ReportsPage = lazy(() => import('@/pages/Reports/Reports').then(module => ({
  default: module.Reports
})));

const ReportBuilder = lazy(() => import('@/pages/Reports/ReportBuilder').then(module => ({
  default: module.ReportBuilder
})));

const ReportViewer = lazy(() => import('@/pages/Reports/ReportViewer').then(module => ({
  default: module.ReportViewer
})));

// Preloading functions for critical routes
export const preloadDashboard = () => {
  import('@/pages/Dashboard/EnhancedDashboard');
};

export const preloadReports = () => {
  import('@/pages/Reports/Reports');
};

export const preloadAnalytics = () => {
  import('@/pages/Analytics/Analytics');
};

// Route definitions with lazy loading
export const lazyRoutes = [
  {
    path: '/',
    element: EnhancedDashboard,
    loader: () => {
      preloadDashboard();
      return null;
    },
  },
  {
    path: '/dashboard',
    element: EnhancedDashboard,
    loader: () => {
      preloadDashboard();
      return null;
    },
  },
  {
    path: '/login',
    element: LoginPage,
  },
  {
    path: '/data',
    element: DataPage,
  },
  {
    path: '/analytics',
    element: AnalyticsPage,
    loader: () => {
      preloadAnalytics();
      return null;
    },
  },
  {
    path: '/reports',
    element: ReportsPage,
    children: [
      {
        path: 'builder',
        element: ReportBuilder,
      },
      {
        path: ':reportId',
        element: ReportViewer,
      },
    ],
    loader: () => {
      preloadReports();
      return null;
    },
  },
  {
    path: '/404',
    element: NotFoundPage,
  },
  {
    path: '/error',
    element: ErrorPage,
  },
];

// Chunk loading utilities
export const chunkLoader = {
  loadDashboard: () => import(/* webpackChunkName: "dashboard" */ '@/pages/Dashboard/EnhancedDashboard'),
  loadData: () => import(/* webpackChunkName: "data" */ '@/pages/Data/DataPage'),
  loadReports: () => import(/* webpackChunkName: "reports" */ '@/pages/Reports/Reports'),
  loadAnalytics: () => import(/* webpackChunkName: "analytics" */ '@/pages/Analytics/Analytics'),
};

// Prefetching strategies
export const prefetchStrategies = {
  prefetchOnHover: (chunkName: string, delay = 100) => {
    let timeoutId: NodeJS.Timeout;

    return {
      onMouseEnter: () => {
        timeoutId = setTimeout(() => {
          chunkLoader[chunkName as keyof typeof chunkLoader]?.();
        }, delay);
      },
      onMouseLeave: () => {
        clearTimeout(timeoutId);
      },
    };
  },

  prefetchOnIdle: (chunkLoader: () => Promise<any>) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        chunkLoader();
      });
    } else {
      setTimeout(chunkLoader, 2000);
    }
  },

  prefetchLikelyRoutes: () => {
    setTimeout(() => {
      chunkLoader.loadReports();
      chunkLoader.loadAnalytics();
    }, 3000);
  },
};

export default lazyRoutes;
