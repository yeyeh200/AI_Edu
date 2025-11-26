import React, { useState } from 'react';
import {
  CogIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// 子页面组件导入（后续实现）
const SystemConfigPage = React.lazy(() => import('./System/SystemConfigPage'));
const SystemLogsPage = React.lazy(() => import('./System/SystemLogsPage'));
const DataMonitorPage = React.lazy(() => import('./System/DataMonitorPage'));

// Tab配置
const tabs = [
  {
    id: 'config',
    name: '系统配置',
    icon: CogIcon,
    description: '管理系统参数和数据源配置'
  },
  {
    id: 'logs',
    name: '日志管理',
    icon: DocumentTextIcon,
    description: '查看操作日志和系统审计'
  },
  {
    id: 'monitor',
    name: '数据监控',
    icon: ChartBarIcon,
    description: '实时监控数据采集状态'
  }
];

// 空状态组件
const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="text-center py-12">
    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
      <ExclamationTriangleIcon />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// 子页面占位符组件
const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <EmptyState title={title} description={description} />
  </div>
);

export function System() {
  const [activeTab, setActiveTab] = useState('config');

  // 渲染当前活动Tab对应的页面组件
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'config':
        return (
          <React.Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
            <SystemConfigPage />
          </React.Suspense>
        );
      case 'logs':
        return (
          <React.Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
            <SystemLogsPage />
          </React.Suspense>
        );
      case 'monitor':
        return (
          <React.Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg" />}>
            <DataMonitorPage />
          </React.Suspense>
        );
      default:
        return (
          <PlaceholderPage
            title="功能开发中"
            description="该功能正在开发中，敬请期待..."
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">系统管理</h1>
            <p className="mt-1 text-sm text-gray-600">
              配置系统参数、查看操作日志、监控数据采集状态
            </p>
          </div>
        </div>
      </div>

      {/* Tab导航 */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon
                      className={`h-5 w-5 ${
                        activeTab === tab.id
                          ? 'text-primary-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </div>

                  {/* 激活状态指示器 */}
                  {activeTab === tab.id && (
                    <div
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab描述 */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab内容区域 */}
        <div className="p-6">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
}