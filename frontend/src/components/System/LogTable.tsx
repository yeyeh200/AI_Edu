import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

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

// Props接口
interface LogTableProps {
  logs: LogItem[];
  pagination: Pagination;
  loading: boolean;
  onViewDetail: (log: LogItem) => void;
  onExport: () => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  userRole?: string;
}

export function LogTable({
  logs,
  pagination,
  loading,
  onViewDetail,
  onExport,
  onRefresh,
  onPageChange,
  userRole
}: LogTableProps) {
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '成功';
      case 'warning':
        return '警告';
      case 'error':
        return '错误';
      default:
        return '未知';
    }
  };

  // 格式化时间
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return timeString;
    }
  };

  // 处理选择/取消选择日志
  const handleSelectLog = (logId: string) => {
    setSelectedLogs(prev =>
      prev.includes(logId)
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedLogs.length === logs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(logs.map(log => log.id));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* 表格操作栏 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={logs.length > 0 && selectedLogs.length === logs.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                全选 ({selectedLogs.length})
              </span>
            </label>

            {selectedLogs.length > 0 && userRole === 'admin' && (
              <button
                onClick={() => {
                  // TODO: 实现批量删除功能
                  console.log('批量删除:', selectedLogs);
                }}
                className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
              >
                <TrashIcon className="w-4 h-4" />
                <span>批量删除</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-1 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>刷新</span>
            </button>

            <button
              onClick={onExport}
              disabled={loading}
              className="text-primary-600 hover:text-primary-800 text-sm flex items-center space-x-1 disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>

      {/* 表格内容 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={logs.length > 0 && selectedLogs.length === logs.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                活动名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                耗时
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP地址
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-gray-500">加载中...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  暂无日志数据
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedLogs.includes(log.id)}
                      onChange={() => handleSelectLog(log.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(log.activity_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {log.activity_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    <div title={log.description}>
                      <div className="font-medium">{log.activity_name}</div>
                      <div className="text-gray-500 text-xs truncate">{log.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.username ? (
                      <div>
                        <div className="font-medium">{log.username}</div>
                        {log.user_role && (
                          <div className="text-gray-500 text-xs">{log.user_role}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(log.status)}`}>
                      {getStatusText(log.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.duration ? `${log.duration}ms` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.ip_address || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => onViewDetail(log)}
                      className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>详情</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination.total_pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              显示第 {((pagination.page - 1) * pagination.page_size) + 1} 到{' '}
              {Math.min(pagination.page * pagination.page_size, pagination.total)} 条，
              共 {pagination.total} 条记录
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        pageNum === pagination.page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.total_pages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}