import React, { useState, useEffect } from 'react';
import { DocumentArrowDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { LogTable } from '@/components/System/LogTable.tsx';
import { LogFilter } from '@/components/System/LogFilter.tsx';
import { LogDetail } from '@/components/System/LogDetail.tsx';
import { LogStatistics } from '@/components/System/LogStatistics.tsx';
import { systemService } from '@/services/systemService.ts';
import { useAuthStore } from '@/stores/authStore.ts';

// 日志项接口
interface LogItem {
  id: string;
  activity_type: string;
  activity_name: string;
  description: string;
  username?: string;
  user_role?: string;
  status: 'success' | 'warning' | 'error';
  activity_time: string;
  duration?: number;
  ip_address?: string;
  request_method?: string;
  request_url?: string;
  response_status?: number;
  user_agent?: string;
  metadata?: Record<string, any>;
  request_parameters?: Record<string, any>;
}

// 分页接口
interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

// 过滤条件接口
interface FilterOptions {
  activityType?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  userRole?: string;
}

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

export function SystemLogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0
  });
  const [statistics, setStatistics] = useState<LogStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'statistics'>('logs');
  const [filters, setFilters] = useState<FilterOptions>({});

  const { user } = useAuthStore();

  // 加载日志数据
  const loadLogs = async (page: number = 1, newFilters?: FilterOptions) => {
    setLoading(true);
    try {
      const response = await systemService.getLogs({
        page,
        limit: pagination.page_size,
        ...newFilters || filters
      });

      if (response.success && response.data) {
        setLogs(response.data.data || []);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('加载日志失败:', error);
      // TODO: 显示错误提示
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStatistics = async () => {
    setStatisticsLoading(true);
    try {
      const response = await systemService.getLogStatistics({
        startDate: filters.startDate,
        endDate: filters.endDate,
        activityType: filters.activityType
      });

      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
      // TODO: 显示错误提示
    } finally {
      setStatisticsLoading(false);
    }
  };

  // 处理过滤条件变化
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // 重置到第一页
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // 查看日志详情
  const handleViewDetail = async (log: LogItem) => {
    try {
      const response = await systemService.getLogById(log.id);
      if (response.success && response.data) {
        setSelectedLog(response.data);
        setIsDetailOpen(true);
      }
    } catch (error) {
      console.error('获取日志详情失败:', error);
      // 如果获取详情失败，使用列表中的数据
      setSelectedLog(log);
      setIsDetailOpen(true);
    }
  };

  // 导出日志
  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await systemService.exportLogs({
        activityType: filters.activityType,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        format: 'csv'
      });

      if (response.success && response.data) {
        // 创建下载链接
        const downloadUrl = response.data.downloadUrl;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = response.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('导出日志失败:', error);
      // TODO: 显示错误提示
    } finally {
      setLoading(false);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    loadLogs(pagination.page);
    if (activeTab === 'statistics') {
      loadStatistics();
    }
  };

  // 初始化加载
  useEffect(() => {
    loadLogs();
  }, [pagination.page]);

  // 当过滤条件变化时重新加载数据
  useEffect(() => {
    if (pagination.page === 1) {
      loadLogs(1);
    } else {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [filters]);

  // 切换标签页时加载对应数据
  useEffect(() => {
    if (activeTab === 'statistics') {
      loadStatistics();
    }
  }, [activeTab, filters]);

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">日志管理</h2>
          <p className="mt-1 text-sm text-gray-600">
            查看系统操作日志、API调用记录和统计分析
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>导出日志</span>
          </button>
        </div>
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            日志列表
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ml-8 flex items-center space-x-2 ${
              activeTab === 'statistics'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>统计分析</span>
          </button>
        </nav>
      </div>

      {/* 日志列表标签页 */}
      {activeTab === 'logs' && (
        <>
          {/* 过滤器 */}
          <LogFilter
            onFilterChange={handleFilterChange}
            loading={loading}
          />

          {/* 日志表格 */}
          <LogTable
            logs={logs}
            pagination={pagination}
            loading={loading}
            onViewDetail={handleViewDetail}
            onExport={handleExport}
            onRefresh={handleRefresh}
            onPageChange={handlePageChange}
            userRole={user?.role}
          />
        </>
      )}

      {/* 统计分析标签页 */}
      {activeTab === 'statistics' && (
        <LogStatistics
          statistics={statistics}
          loading={statisticsLoading}
        />
      )}

      {/* 日志详情弹窗 */}
      <LogDetail
        log={selectedLog}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedLog(null);
        }}
      />
    </div>
  );
}