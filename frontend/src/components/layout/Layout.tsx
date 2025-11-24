import React, { useState } from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  console.log('Layout rendering');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: '仪表盘', href: '/dashboard', icon: HomeIcon },
    { name: '教师管理', href: '/teachers', icon: UserGroupIcon },
    { name: '课程管理', href: '/courses', icon: AcademicCapIcon },
    { name: '班级管理', href: '/classes', icon: BuildingOfficeIcon },
    { name: '评价分析', href: '/evaluations', icon: ChartBarIcon },
    { name: '数据报表', href: '/reports', icon: DocumentTextIcon },
    { name: '系统设置', href: '/settings', icon: Cog6ToothIcon, adminOnly: true },
  ];

  const filteredNavigation = navigation.filter(item =>
    !item.adminOnly || user?.role === 'admin'
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">AI教学评价系统</h1>
            </div>
            <nav className="mt-8 px-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex-shrink-0 p-1 text-gray-400 hover:text-gray-500"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">AI教学评价系统</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex-shrink-0 p-1 text-gray-400 hover:text-gray-500"
                title="退出登录"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">AI教学评价系统</h1>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};