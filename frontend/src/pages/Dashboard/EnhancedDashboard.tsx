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
  ArrowTrendingDownIcon,
  SparklesIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  PerformanceGauge,
  ParticipationGauge,
  ComparisonBarChart,
  RankingChart,
  TrendChart,
} from '@/components/Charts';
import { useRealTimeStats, useRealTimeEvaluations } from '@/hooks/useRealTimeData';

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
  monthlyTrends: Array<{
    month: string;
    evaluations: number;
    averageScore: number;
    participants: number;
    completedRate: number;
  }>;
  topPerformers: Array<{
    name: string;
    department: string;
    score: number;
    evaluations: number;
  }>;
  courseCategories: Array<{
    category: string;
    count: number;
    averageScore: number;
  }>;
}

export const EnhancedDashboard: React.FC = () => {
  // Real-time data hooks
  const { data: stats, isLoading, error, isConnected, lastUpdated } = useRealTimeStats();
  const { data: recentEvaluations } = useRealTimeEvaluations();

  // Additional data for enhanced visualizations
  const { data: trendsData } = useQuery({
    queryKey: ['dashboard-trends'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/trends');
      if (!response.ok) {
        throw new Error('获取趋势数据失败');
      }
      return response.json();
    },
    refetchInterval: isConnected ? undefined : 60000, // Only poll if WebSocket is disconnected
  });

  const { data: performanceData } = useQuery({
    queryKey: ['dashboard-performance'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/performance');
      if (!response.ok) {
        throw new Error('获取表现数据失败');
      }
      return response.json();
    },
    refetchInterval: isConnected ? undefined : 60000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow h-80"></div>
            <div className="bg-white p-6 rounded-lg shadow h-80"></div>
          </div>
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

  // Sample data for enhanced charts (in real implementation, this would come from API)
  const monthlyTrends = stats?.monthlyTrends || [
    { month: '1月', evaluations: 45, averageScore: 4.2, participants: 320, completedRate: 85 },
    { month: '2月', evaluations: 52, averageScore: 4.3, participants: 380, completedRate: 88 },
    { month: '3月', evaluations: 61, averageScore: 4.1, participants: 420, completedRate: 82 },
    { month: '4月', evaluations: 58, averageScore: 4.4, participants: 410, completedRate: 90 },
    { month: '5月', evaluations: 67, averageScore: 4.5, participants: 450, completedRate: 92 },
    { month: '6月', evaluations: 72, averageScore: 4.3, participants: 480, completedRate: 87 },
  ];

  const topPerformers = stats?.topPerformers || [
    { name: '张教授', department: '计算机系', score: 4.8, evaluations: 12 },
    { name: '李老师', department: '数学系', score: 4.7, evaluations: 15 },
    { name: '王副教授', department: '物理系', score: 4.6, evaluations: 10 },
    { name: '陈讲师', department: '化学系', score: 4.5, evaluations: 8 },
  ];

  const courseCategories = stats?.courseCategories || [
    { category: '专业课程', count: 45, averageScore: 4.3 },
    { category: '公共基础', count: 32, averageScore: 4.1 },
    { category: '实验课程', count: 28, averageScore: 4.4 },
    { category: '选修课程', count: 38, averageScore: 4.2 },
  ];

  const enhancedStatCards = [
    {
      name: '教师总数',
      value: stats?.totalTeachers || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      trend: '+12%',
      trendDirection: 'up' as const,
      description: '相比上月增长'
    },
    {
      name: '课程总数',
      value: stats?.totalCourses || 0,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      trend: '+8%',
      trendDirection: 'up' as const,
      description: '本学期新增课程'
    },
    {
      name: '班级总数',
      value: stats?.totalClasses || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500',
      trend: '+5%',
      trendDirection: 'up' as const,
      description: '活跃班级数量'
    },
    {
      name: '评价总数',
      value: stats?.totalEvaluations || 0,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
      trend: '+15%',
      trendDirection: 'up' as const,
      description: '累计完成评价'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">智能仪表盘</h1>
          <div className="mt-1 flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              实时监控教学评价系统运行状况
            </p>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">
                {isConnected ? '实时连接' : '离线模式'}
              </span>
              {lastUpdated && (
                <span className="text-xs text-gray-400">
                  更新: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-600">AI分析已启用</span>
        </div>
      </div>

      {/* Enhanced Stats Grid with Trend Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enhancedStatCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className={`flex flex-col items-end ${stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <div className="flex items-center">
                    {stat.trendDirection === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-semibold">{stat.trend}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Performance Indicators with Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">整体评分</h3>
            <ChartBarIcon className="h-5 w-5 text-blue-500" />
          </div>
          <PerformanceGauge
            value={stats?.averageScore || 0}
            maxValue={5}
            height={200}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">完成率</h3>
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>
          <ParticipationGauge
            value={stats?.completedEvaluations ? (stats.completedEvaluations / (stats.completedEvaluations + (stats?.pendingEvaluations || 0))) * 100 : 0}
            height={200}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">待处理</h3>
            <ClockIcon className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="text-4xl font-bold text-gray-900">{stats?.pendingEvaluations || 0}</div>
            <div className="text-sm text-gray-500 mt-2">待评价任务</div>
            <div className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              需要关注
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">月度趋势分析</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>评价数量</span>
              <div className="h-2 w-2 bg-green-500 rounded-full ml-2"></div>
              <span>平均分数</span>
            </div>
          </div>
          <TrendChart
            data={monthlyTrends.map(item => ({
              name: item.month,
              value: item.evaluations,
              target: item.averageScore * 10, // Scale for better visualization
            }))}
            height={250}
            showArea
            gradient
          />
        </div>

        {/* Department Performance Comparison */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">部门表现对比</h3>
            <BuildingOfficeIcon className="h-5 w-5 text-purple-500" />
          </div>
          <ComparisonBarChart
            data={stats?.departmentPerformance?.map(dept => ({
              name: dept.department,
              series1: dept.averageScore,
              series2: (dept.evaluationCount / 10), // Scale for better visualization
            })) || []}
            height={250}
            bars={[
              { dataKey: 'series1', fill: '#3b82f6', name: '平均分' },
              { dataKey: 'series2', fill: '#8b5cf6', name: '评价数(÷10)' }
            ]}
          />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">优秀教师排行</h3>
            <UsersIcon className="h-5 w-5 text-yellow-500" />
          </div>
          <RankingChart
            data={topPerformers.map((teacher, index) => ({
              name: teacher.name,
              value: teacher.score * 20, // Scale to 100 for better visualization
            }))}
            height={200}
            showDataLabels
          />
          <div className="mt-4 space-y-2">
            {topPerformers.slice(0, 3).map((teacher, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-900">{teacher.name}</span>
                <span className="text-gray-600">{teacher.department}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Categories Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">课程分类分布</h3>
            <BookOpenIcon className="h-5 w-5 text-green-500" />
          </div>
          <PieChart
            data={courseCategories.map(cat => ({
              name: cat.category,
              value: cat.count,
            }))}
            height={200}
            showLabels
            colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
          />
        </div>

        {/* Score Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">评分分布</h3>
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-500" />
          </div>
          <BarChart
            data={stats?.scoreDistribution?.map(item => ({
              name: item.range,
              count: item.count,
            })) || []}
            height={200}
            colors={['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']}
            showDataLabels
            dataLabelPosition="center"
          />
        </div>
      </div>

      {/* Recent Activity with Real-time Updates */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">实时活动</h3>
            <div className="flex items-center space-x-2">
              {recentEvaluations && recentEvaluations.length > 0 && (
                <span className="flex items-center text-xs text-green-600">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  新增 {recentEvaluations.length} 项活动
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {[...(stats?.recentActivity || []), ...(recentEvaluations || [])]
                .slice(0, 8)
                .map((activity, activityIdx) => (
                  <li key={activity.id || activityIdx}>
                    <div className="relative pb-8">
                      {activityIdx < 7 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.status === 'success' || activity.type === 'evaluation' ? 'bg-green-500' :
                            activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}>
                            <CheckCircleIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(activity.timestamp || Date.now()).toLocaleString()}
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
  );
};