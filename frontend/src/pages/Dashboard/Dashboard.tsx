import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  totalEvaluations: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageScore: number;
  recentActivity: Array<{
    id: string;
    type: 'evaluation' | 'teacher' | 'course' | 'class';
    title: string;
    description: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  departmentPerformance: Array<{
    department: string;
    averageScore: number;
    evaluationCount: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('获取仪表盘数据失败');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">加载失败</h3>
            <div className="mt-2 text-sm text-red-700">
              无法加载仪表盘数据，请刷新页面重试。
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: '教师总数',
      value: stats?.totalTeachers || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      trend: '+12%',
      trendDirection: 'up' as const
    },
    {
      name: '课程总数',
      value: stats?.totalCourses || 0,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      trend: '+8%',
      trendDirection: 'up' as const
    },
    {
      name: '班级总数',
      value: stats?.totalClasses || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500',
      trend: '+5%',
      trendDirection: 'up' as const
    },
    {
      name: '评价总数',
      value: stats?.totalEvaluations || 0,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
      trend: '+15%',
      trendDirection: 'up' as const
    },
  ];

  const evaluationStats = [
    {
      name: '待评价',
      value: stats?.pendingEvaluations || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: '已完成',
      value: stats?.completedEvaluations || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: '平均分',
      value: stats?.averageScore ? stats.averageScore.toFixed(1) : '0.0',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      isScore: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-600">
          查看教学评价系统的整体情况和关键指标
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value.toLocaleString()}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trendDirection === 'up' ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {stat.trend}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evaluation Stats */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">评价统计</h3>
            <div className="space-y-4">
              {evaluationStats.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${item.color} mr-3`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                  <span className={`text-lg font-semibold ${
                    item.isScore ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {item.isScore && item.value !== '0.0' ? item.value + '分' : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">最近活动</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {stats?.recentActivity?.slice(0, 5).map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== stats.recentActivity.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.status === 'success' ? 'bg-green-500' :
                            activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Score Distribution and Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">分数分布</h3>
          <div className="space-y-3">
            {stats?.scoreDistribution?.map((item) => (
              <div key={item.range}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{item.range}</span>
                  <span className="text-gray-500">{item.count}人 ({item.percentage}%)</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">部门表现</h3>
          <div className="space-y-3">
            {stats?.departmentPerformance?.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{dept.averageScore.toFixed(1)}分</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        dept.trend === 'up' ? 'bg-green-100 text-green-800' :
                        dept.trend === 'down' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {dept.trend === 'up' ? '↑' : dept.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {dept.evaluationCount} 次评价
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};