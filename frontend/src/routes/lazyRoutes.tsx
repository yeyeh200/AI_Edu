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
const DashboardPage = lazy(() => import('@/pages/Dashboard/Dashboard').then(module => ({
  default: module.Dashboard
})));

const EnhancedDashboard = lazy(() => import('@/pages/Dashboard/EnhancedDashboard').then(module => ({
  default: module.EnhancedDashboard
})));

const LoginPage = lazy(() => import('@/pages/Login').then(module => ({
  default: module.Login
})));

const TeachersPage = lazy(() => import('@/pages/Teachers/Teachers').then(module => ({
  default: module.Teachers
})));

const TeacherDetailPage = lazy(() => import('@/pages/Teachers/TeacherDetailPage').then(module => ({
  default: module.TeacherDetailPage
})));

const CoursesPage = lazy(() => import('@/pages/Courses/Courses').then(module => ({
  default: module.Courses
})));

const CourseDetailPage = lazy(() => import('@/pages/Courses/CourseDetailPage').then(module => ({
  default: module.CourseDetailPage
})));

const ClassesPage = lazy(() => import('@/pages/Classes/Classes').then(module => ({
  default: module.Classes
})));

const ClassDetailPage = lazy(() => import('@/pages/Classes/ClassDetailPage').then(module => ({
  default: module.ClassDetailPage
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

const SettingsPage = lazy(() => import('@/pages/Settings/Settings').then(module => ({
  default: module.Settings
})));

const ProfilePage = lazy(() => import('@/pages/Profile/Profile').then(module => ({
  default: module.Profile
})));

// Preloading functions for critical routes
export const preloadDashboard = () => {
  import('@/pages/Dashboard/Dashboard');
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
    element: DashboardPage,
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
    path: '/teachers',
    element: TeachersPage,
  },
  {
    path: '/teachers/:teacherId',
    element: TeacherDetailPage,
  },
  {
    path: '/courses',
    element: CoursesPage,
  },
  {
    path: '/courses/:courseId',
    element: CourseDetailPage,
  },
  {
    path: '/classes',
    element: ClassesPage,
  },
  {
    path: '/classes/:classId',
    element: ClassDetailPage,
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
    path: '/settings',
    element: SettingsPage,
  },
  {
    path: '/profile',
    element: ProfilePage,
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
  loadDashboard: () => import(/* webpackChunkName: "dashboard" */ '@/pages/Dashboard/Dashboard'),
  loadReports: () => import(/* webpackChunkName: "reports" */ '@/pages/Reports/Reports'),
  loadAnalytics: () => import(/* webpackChunkName: "analytics" */ '@/pages/Analytics/Analytics'),
  loadTeachers: () => import(/* webpackChunkName: "teachers" */ '@/pages/Teachers/Teachers'),
  loadCourses: () => import(/* webpackChunkName: "courses" */ '@/pages/Courses/Courses'),
  loadClasses: () => import(/* webpackChunkName: "classes" */ '@/pages/Classes/Classes'),
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
