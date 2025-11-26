import React from 'react';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// 日志统计接口
interface LogStatistics {
  overview: {
    totalLogs: number;
    successCount: number;
    errorCount: number;
    warningCount: number;
  };
  trends: {
    dailyStats: Array<{
      date: string;
      count: number;
      successCount: number;
      errorCount: number;
      warningCount: number;
    }>;
    topActivities: Array<{
      activityName: string;
      count: number;
    }>;
    userActivity: Array<{
      username: string;
      count: number;
    }>;
  };
  performance: {
    averageResponseTime: number;
    slowestOperations: Array<{
      activityName: string;
      averageTime: number;
      count: number;
    }>;
    errorRates: Array<{
      activityType: string;
      errorRate: number;
    }>;
  };
}

// Props接口
interface LogStatisticsProps {
  statistics: LogStatistics | null;
  loading: boolean;
}

export function LogStatistics({ statistics, loading }: LogStatisticsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12 text-gray-500">
        暂无统计数据
      </div>
    );
  }

  // 计算错误率
  const errorRate = statistics.overview.totalLogs > 0
    ? (statistics.overview.errorCount / statistics.overview.totalLogs * 100).toFixed(1)
    : '0.0';

  // 处理每日统计数据，格式化日期
  const chartData = statistics.trends.dailyStats.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  })).reverse(); // 反转使日期从左到右递增

  return (
    <div className="space-y-6">
      {/* 概览统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 总日志数 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <DocumentIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">总日志数</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.overview.totalLogs.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 成功日志 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">成功</p>
              <p className="text-2xl font-semibold text-green-600">
                {statistics.overview.successCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {statistics.overview.totalLogs > 0
                  ? ((statistics.overview.successCount / statistics.overview.totalLogs * 100).toFixed(1))
                  : '0.0'}%
              </p>
            </div>
          </div>
        </div>

        {/* 警告日志 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">警告</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {statistics.overview.warningCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {statistics.overview.totalLogs > 0
                  ? ((statistics.overview.warningCount / statistics.overview.totalLogs * 100).toFixed(1))
                  : '0.0'}%
              </p>
            </div>
          </div>
        </div>

        {/* 错误日志 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">错误</p>
              <p className="text-2xl font-semibold text-red-600">
                {statistics.overview.errorCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {errorRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 每日日志趋势图 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUpIcon className="h-5 w-5 text-gray-500 mr-2" />
            每日日志趋势
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="successCount"
                  stroke="#10b981"
                  name="成功"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="warningCount"
                  stroke="#f59e0b"
                  name="警告"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="errorCount"
                  stroke="#ef4444"
                  name="错误"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 活动类型分布 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
            热门活动类型
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statistics.trends.topActivities} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="activityName" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 用户活跃度排行 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2" />
            用户活跃度 TOP 10
          </h3>
          <div className="space-y-3">
            {statistics.trends.userActivity.map((user, index) => (
              <div key={user.username} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.username}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {user.count.toLocaleString()} 次
                </span>
              </div>
            ))}
            {statistics.trends.userActivity.length === 0 && (
              <p className="text-center text-gray-500 py-4">暂无数据</p>
            )}
          </div>
        </div>

        {/* 性能指标 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
            性能指标
          </h3>
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-blue-600">
                {statistics.performance.averageResponseTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-500">平均响应时间</div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">最慢操作 TOP 5</div>
              {statistics.performance.slowestOperations.slice(0, 5).map((operation, index) => (
                <div key={operation.activityName} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-xs font-medium text-red-600">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-900 truncate max-w-[120px]">
                      {operation.activityName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {operation.averageTime.toFixed(0)}ms
                  </span>
                </div>
              ))}
              {statistics.performance.slowestOperations.length === 0 && (
                <p className="text-center text-gray-500 py-4">暂无数据</p>
              )}
            </div>
          </div>
        </div>

        {/* 错误率分析 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-gray-500 mr-2" />
            错误率分析
          </h3>
          <div className="space-y-3">
            {statistics.performance.errorRates.map((rate, index) => (
              <div key={rate.activityType} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {rate.activityType}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  rate.errorRate > 5 ? 'text-red-600' :
                  rate.errorRate > 1 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {rate.errorRate.toFixed(1)}%
                </span>
              </div>
            ))}
            {statistics.performance.errorRates.length === 0 && (
              <p className="text-center text-gray-500 py-4">暂无数据</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}