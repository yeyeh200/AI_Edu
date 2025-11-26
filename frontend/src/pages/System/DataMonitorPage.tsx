import React, { useState, useEffect } from 'react';
import {
  ServerIcon,
  CloudIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlayIcon,
  StopIcon,
  XCircleIcon,
  CogIcon,
  ActivityIcon
} from '@heroicons/react/24/outline';
import { systemService, SystemStatus, SystemMetrics, CollectionStatus, DataSourceStatus, CollectionTaskSummary } from '@/services/systemService.ts';

export function DataMonitorPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // 加载所有监控数据
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statusResponse, metricsResponse, collectionResponse] = await Promise.all([
        systemService.getSystemStatus(),
        systemService.getSystemMetrics(),
        systemService.getDataCollectionStatus()
      ]);

      if (statusResponse.success) {
        setSystemStatus(statusResponse.data);
      }

      if (metricsResponse.success) {
        setSystemMetrics(metricsResponse.data);
      }

      if (collectionResponse.success) {
        setCollectionStatus(collectionResponse.data);
      }

    } catch (err: any) {
      console.error('加载监控数据失败:', err);
      setError(err.message || '加载监控数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 手动刷新
  const handleRefresh = () => {
    loadAllData();
  };

  // 触发数据同步
  const handleSyncData = async (dataSourceId: string, syncType: 'full' | 'incremental' = 'incremental') => {
    try {
      const result = await systemService.triggerDataSync(dataSourceId, syncType);
      if (result.success) {
        // 刷新数据以显示新任务
        setTimeout(loadAllData, 1000);
      }
    } catch (err: any) {
      console.error('触发数据同步失败:', err);
      setError(err.message || '触发数据同步失败');
    }
  };

  // 取消采集任务
  const handleCancelTask = async (taskId: string) => {
    try {
      const result = await systemService.cancelCollectionTask(taskId);
      if (result.success) {
        // 刷新数据
        setTimeout(loadAllData, 1000);
      }
    } catch (err: any) {
      console.error('取消任务失败:', err);
      setError(err.message || '取消任务失败');
    }
  };

  // 切换自动刷新
  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      setAutoRefresh(false);
    } else {
      const interval = setInterval(loadAllData, 30000); // 30秒刷新一次
      setRefreshInterval(interval);
      setAutoRefresh(true);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadAllData();
  }, []);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // 获取状态图标和颜色
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return { icon: CheckCircleIcon, color: 'text-green-500', bgColor: 'bg-green-100', text: '正常' };
      case 'disconnected':
        return { icon: XCircleIcon, color: 'text-gray-500', bgColor: 'bg-gray-100', text: '断开' };
      case 'warning':
        return { icon: ExclamationTriangleIcon, color: 'text-yellow-500', bgColor: 'bg-yellow-100', text: '警告' };
      case 'error':
        return { icon: ExclamationTriangleIcon, color: 'text-red-500', bgColor: 'bg-red-100', text: '错误' };
      case 'syncing':
      case 'running':
        return { icon: ArrowPathIcon, color: 'text-blue-500', bgColor: 'bg-blue-100', text: '运行中' };
      case 'pending':
        return { icon: ClockIcon, color: 'text-gray-500', bgColor: 'bg-gray-100', text: '等待中' };
      case 'completed':
        return { icon: CheckCircleIcon, color: 'text-green-500', bgColor: 'bg-green-100', text: '完成' };
      case 'failed':
        return { icon: XCircleIcon, color: 'text-red-500', bgColor: 'bg-red-100', text: '失败' };
      default:
        return { icon: ClockIcon, color: 'text-gray-500', bgColor: 'bg-gray-100', text: '未知' };
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'zhijiaoyun':
        return { icon: CloudIcon, color: 'text-blue-500', bgColor: 'bg-blue-100' };
      case 'database':
        return { icon: ServerIcon, color: 'text-purple-500', bgColor: 'bg-purple-100' };
      case 'api':
        return { icon: ChartBarIcon, color: 'text-green-500', bgColor: 'bg-green-100' };
      default:
        return { icon: ServerIcon, color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };

  // 格式化时间
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('zh-CN');
  };

  // 获取时间间隔描述
  const getTimeAgo = (timeString: string) => {
    const now = new Date();
    const past = new Date(timeString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  // 获取性能状态颜色
  const getPerformanceColor = (value: number, type: 'cpu' | 'memory' | 'disk') => {
    const thresholds = {
      cpu: { good: 50, warning: 80 },
      memory: { good: 60, warning: 85 },
      disk: { good: 70, warning: 90 }
    };

    const threshold = thresholds[type];
    if (value <= threshold.good) return 'bg-green-600';
    if (value <= threshold.warning) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  // 计算整体健康分数
  const calculateHealthScore = () => {
    if (!systemStatus || !systemMetrics || !collectionStatus) return 0;

    let score = 100;

    // 系统状态影响
    if (systemStatus.overall === 'warning') score -= 20;
    if (systemStatus.overall === 'error') score -= 50;

    // 数据源状态影响
    const disconnectedSources = collectionStatus.dataSources.filter(ds => ds.status === 'disconnected' || ds.status === 'error').length;
    score -= disconnectedSources * 10;

    // 性能影响
    if (systemMetrics.system.cpuUsage > 80) score -= 10;
    if (systemMetrics.system.memoryUsage > 85) score -= 10;
    if (systemMetrics.application.errorRate > 5) score -= 15;

    return Math.max(0, score);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="btn-primary"
        >
          重新加载
        </button>
      </div>
    );
  }

  const healthScore = calculateHealthScore();

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">数据采集监控</h2>
          <p className="mt-1 text-sm text-gray-600">
            实时监控数据源状态、系统性能和数据质量
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={toggleAutoRefresh}
            className={`btn-secondary flex items-center space-x-2 ${
              autoRefresh ? 'bg-blue-50 text-blue-700 border-blue-200' : ''
            }`}
          >
            <ActivityIcon className="h-4 w-4" />
            <span>{autoRefresh ? '停止自动刷新' : '开启自动刷新'}</span>
          </button>
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>刷新数据</span>
          </button>
        </div>
      </div>

      {/* 系统概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 整体健康状态 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">系统健康度</h3>
            <ActivityIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-center">
            <div className={`relative inline-flex items-center justify-center w-24 h-24 rounded-full ${
              healthScore >= 80 ? 'bg-green-100' : healthScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <span className={`text-2xl font-bold ${
                healthScore >= 80 ? 'text-green-600' : healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {healthScore}
              </span>
              <span className="text-xs text-gray-500 absolute -bottom-1">分</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className={`text-sm font-medium ${
              healthScore >= 80 ? 'text-green-600' : healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {healthScore >= 80 ? '运行良好' : healthScore >= 60 ? '需要关注' : '存在问题'}
            </span>
          </div>
        </div>

        {/* 系统性能 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">系统性能</h3>
            <ServerIcon className="h-5 w-5 text-gray-400" />
          </div>
          {systemMetrics && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CPU</span>
                  <span className="font-medium">{systemMetrics.system.cpuUsage}%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getPerformanceColor(systemMetrics.system.cpuUsage, 'cpu')} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${systemMetrics.system.cpuUsage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">内存</span>
                  <span className="font-medium">{systemMetrics.system.memoryUsage}%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getPerformanceColor(systemMetrics.system.memoryUsage, 'memory')} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${systemMetrics.system.memoryUsage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">磁盘</span>
                  <span className="font-medium">{systemMetrics.system.diskUsage}%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getPerformanceColor(systemMetrics.system.diskUsage, 'disk')} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${systemMetrics.system.diskUsage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 数据质量 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">数据质量</h3>
            <CheckCircleIcon className="h-5 w-5 text-gray-400" />
          </div>
          {collectionStatus && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">完整性</span>
                <span className="font-medium text-green-600">{collectionStatus.quality.completeness}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">准确性</span>
                <span className="font-medium text-blue-600">{collectionStatus.quality.accuracy}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">一致性</span>
                <span className="font-medium text-purple-600">{collectionStatus.quality.consistency}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">及时性</span>
                <span className="font-medium text-orange-600">{collectionStatus.quality.timeliness}%</span>
              </div>
            </div>
          )}
        </div>

        {/* 活动统计 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">活动统计</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          {systemMetrics && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">活跃连接</span>
                <span className="font-medium">{systemMetrics.application.activeConnections}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">请求/分钟</span>
                <span className="font-medium">{systemMetrics.application.requestsPerMinute}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">响应时间</span>
                <span className="font-medium">{systemMetrics.application.averageResponseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">错误率</span>
                <span className="font-medium text-red-600">{systemMetrics.application.errorRate}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 采集任务状态 */}
      {collectionStatus && collectionStatus.tasks.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">采集任务</h3>
            <p className="mt-1 text-sm text-gray-600">
              当前正在运行的数据采集任务
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {collectionStatus.tasks.map((task) => {
                const statusConfig = getStatusIcon(task.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                      <div>
                        <div className="font-medium text-gray-900">{task.name}</div>
                        <div className="text-sm text-gray-500">
                          {task.startTime ? `开始于: ${formatTime(task.startTime)}` : '等待开始'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">进度</div>
                        <div className="font-medium">{task.progress}%</div>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">记录</div>
                        <div className="font-medium">
                          {task.recordsProcessed.toLocaleString()}/{task.totalRecords.toLocaleString()}
                        </div>
                      </div>
                      {task.status === 'running' && (
                        <button
                          onClick={() => handleCancelTask(task.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="取消任务"
                        >
                          <StopIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 数据源状态 */}
      {collectionStatus && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">数据源状态</h3>
            <p className="mt-1 text-sm text-gray-600">
              监控各个数据源的连接状态和数据同步情况
            </p>
          </div>

          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数据源
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后同步
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    记录数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    成功率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    响应时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {collectionStatus.dataSources.map((source) => {
                  const statusConfig = getStatusIcon(source.status);
                  const StatusIcon = statusConfig.icon;
                  const typeConfig = getTypeIcon(source.type);
                  const TypeIcon = typeConfig.icon;

                  return (
                    <tr key={source.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-md ${typeConfig.bgColor} mr-3`}>
                            <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {source.name}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {source.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className={`h-4 w-4 mr-2 ${statusConfig.color}`} />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            {statusConfig.text}
                          </span>
                        </div>
                        {source.errorMessage && (
                          <div className="text-xs text-red-600 mt-1">
                            {source.errorMessage}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{getTimeAgo(source.lastSync)}</div>
                        <div className="text-xs text-gray-400">
                          {formatTime(source.lastSync)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {source.totalRecords.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 mr-2">
                            {source.successRate}%
                          </div>
                          {source.successRate >= 95 ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              source.successRate >= 95 ? 'bg-green-600' : 'bg-yellow-600'
                            }`}
                            style={{ width: `${source.successRate}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {source.avgResponseTime}ms
                        </div>
                        <div className={`text-xs ${
                          source.avgResponseTime < 100 ? 'text-green-600' :
                          source.avgResponseTime < 300 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {source.avgResponseTime < 100 ? '快速' :
                           source.avgResponseTime < 300 ? '正常' : '较慢'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {source.status === 'connected' && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleSyncData(source.id, 'incremental')}
                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                title="增量同步"
                              >
                                <PlayIcon className="h-4 w-4" />
                                <span>增量</span>
                              </button>
                              <button
                                onClick={() => handleSyncData(source.id, 'full')}
                                className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                                title="全量同步"
                              >
                                <ArrowPathIcon className="h-4 w-4" />
                                <span>全量</span>
                              </button>
                            </div>
                          )}
                          <button className="text-gray-600 hover:text-gray-800 flex items-center space-x-1">
                            <EyeIcon className="h-4 w-4" />
                            <span>详情</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 实时监控图表占位符 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">数据采集趋势</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
              <p>图表组件将在后续阶段实现</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">性能趋势</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ActivityIcon className="h-12 w-12 mx-auto mb-2" />
              <p>性能图表将在后续阶段实现</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}