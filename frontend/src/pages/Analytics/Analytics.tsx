import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalEvaluations: number;
    averageScore: number;
    participationRate: number;
    completionRate: number;
  };
  trends: {
    monthly: Array<{
      month: string;
      evaluations: number;
      averageScore: number;
      participants: number;
    }>;
    departments: Array<{
      department: string;
      averageScore: number;
      evaluations: number;
      trend: 'up' | 'down' | 'stable';
    }>;
    scoreDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
  topPerformers: Array<{
    teacherId: string;
    teacherName: string;
    department: string;
    averageScore: number;
    evaluationCount: number;
  }>;
  improvementAreas: Array<{
    aspect: string;
    averageScore: number;
    targetScore: number;
    gap: number;
    recommendation: string;
  }>;
}

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('semester');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const { data: analyticsData, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics', timeRange, selectedDepartment],
    queryFn: async () => {
      const params = new URLSearchParams({
        timeRange,
        ...(selectedDepartment && { department: selectedDepartment }),
      });

      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) {
        throw new Error('获取分析数据失败');
      }
      const result = await response.json();
      return result.data; // 提取ApiResponse中的data字段
    },
  });

  const { data: departments } = useQuery<string[]>({
    queryKey: ['analytics-departments'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/departments');
      if (!response.ok) {
        throw new Error('获取部门数据失败');
      }
      const result = await response.json();
      return result.data; // 提取ApiResponse中的data字段
    },
  });

  const exportReport = async () => {
    try {
      const params = new URLSearchParams({
        timeRange,
        ...(selectedDepartment && { department: selectedDepartment }),
      });

      const response = await fetch(`/api/analytics/export?${params}`);
      if (!response.ok) {
        throw new Error('导出失败');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `教学评价分析报告_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('导出报告失败，请重试');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
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
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">加载失败</h3>
            <div className="mt-2 text-sm text-red-700">
              无法加载分析数据，请刷新页面重试。
            </div>
          </div>
        </div>
      </div>
    );
  }

  const data = analyticsData || {
    overview: { totalEvaluations: 0, averageScore: 0, participationRate: 0, completionRate: 0 },
    trends: { monthly: [], departments: [], scoreDistribution: [] },
    topPerformers: [],
    improvementAreas: []
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">数据分析</h1>
          <p className="mt-1 text-sm text-gray-600">
            深入分析教学评价数据和趋势
          </p>
        </div>
        <button
          onClick={exportReport}
          className="btn-secondary"
        >
          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
          导出报告
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              时间范围
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="semester">本学期</option>
              <option value="year">本年度</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部门筛选
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">所有部门</option>
              {Array.isArray(departments) && departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-500">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    总评价数
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {data.overview?.totalEvaluations?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-green-500">
                  <TrendingUpIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    平均分
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {(data.overview?.averageScore || 0).toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-purple-500">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    参与率
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {((data.overview?.participationRate || 0) * 100).toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-orange-500">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    完成率
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {((data.overview?.completionRate || 0) * 100).toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">月度趋势</h3>
          <div className="space-y-3">
            {(data.trends?.monthly || []).map((item) => (
              <div key={item.month} className="border-b border-gray-200 pb-3 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.month}</span>
                  <span className="text-sm text-gray-500">{item.evaluations} 次评价</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">平均分</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(item.averageScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
                    {item.averageScore.toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  参与人数: {item.participants}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">部门表现</h3>
          <div className="space-y-3">
            {(data.trends?.departments || []).map((dept) => (
              <div key={dept.department} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{dept.averageScore.toFixed(1)}分</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${dept.trend === 'up' ? 'bg-green-100 text-green-800' :
                          dept.trend === 'down' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {dept.trend === 'up' ? '↑' : dept.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {dept.evaluations} 次评价
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">分数分布</h3>
          <div className="space-y-3">
            {(data.trends?.scoreDistribution || []).map((item) => (
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

        {/* Top Performers */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">优秀教师</h3>
          <div className="space-y-3">
            {(data.topPerformers || []).map((teacher, index) => (
              <div key={teacher.teacherId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                      }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{teacher.teacherName}</div>
                    <div className="text-xs text-gray-500">{teacher.department}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{teacher.averageScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">{teacher.evaluationCount} 次评价</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Areas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">改进建议</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.improvementAreas || []).map((area, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{area.aspect}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${area.gap > 1 ? 'bg-red-100 text-red-800' :
                    area.gap > 0.5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                  }`}>
                  差距: {area.gap.toFixed(1)}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">当前得分</span>
                  <span className="font-medium">{area.averageScore.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">目标得分</span>
                  <span className="font-medium">{area.targetScore.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary-600 h-1.5 rounded-full"
                    style={{ width: `${(area.averageScore / area.targetScore) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600">{area.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};