import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';

// 过滤条件接口
interface LogFilterOptions {
  activityType?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  userRole?: string;
}

// Props接口
interface LogFilterProps {
  onFilterChange: (filters: LogFilterOptions) => void;
  loading?: boolean;
}

// 活动类型选项
const ACTIVITY_TYPES = [
  { value: 'user_login', label: '用户登录' },
  { value: 'user_logout', label: '用户登出' },
  { value: 'config_view', label: '配置查看' },
  { value: 'config_create', label: '配置创建' },
  { value: 'config_update', label: '配置更新' },
  { value: 'config_delete', label: '配置删除' },
  { value: 'data_sync', label: '数据同步' },
  { value: 'data_export', label: '数据导出' },
  { value: 'analysis_run', label: '分析执行' },
  { value: 'system_monitor', label: '系统监控' },
  { value: 'error_report', label: '错误报告' }
];

// 状态选项
const STATUS_OPTIONS = [
  { value: 'success', label: '成功' },
  { value: 'warning', label: '警告' },
  { value: 'error', label: '错误' }
];

export function LogFilter({ onFilterChange, loading }: LogFilterProps) {
  const [filters, setFilters] = useState<LogFilterOptions>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 处理过滤条件变化
  const handleFilterChange = (key: keyof LogFilterOptions, value: string | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined
    };

    // 清空相关字段
    if (key === 'search' && !value) {
      delete newFilters.search;
    }
    if (key === 'activityType' && !value) {
      delete newFilters.activityType;
    }
    if (key === 'status' && !value) {
      delete newFilters.status;
    }
    if (key === 'startDate' && !value) {
      delete newFilters.startDate;
    }
    if (key === 'endDate' && !value) {
      delete newFilters.endDate;
    }
    if (key === 'userRole' && !value) {
      delete newFilters.userRole;
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // 重置所有过滤条件
  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  // 获取活动过滤数量
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== '').length;
  };

  // 快速时间范围选择
  const setQuickDateRange = (range: 'today' | 'yesterday' | 'week' | 'month') => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let startDate: Date;
    let endDate: Date = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 明天

    switch (range) {
      case 'today':
        startDate = today;
        break;
      case 'yesterday':
        startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }

    const newFilters = {
      ...filters,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span>日志过滤</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()} 个条件
              </span>
            )}
          </h3>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
            >
              <span>{showAdvanced ? '简化' : '高级'}过滤</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {getActiveFilterCount() > 0 && (
              <button
                onClick={handleReset}
                className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>清除</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* 基础过滤 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="搜索日志内容..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* 活动类型 */}
            <div>
              <select
                value={filters.activityType || ''}
                onChange={(e) => handleFilterChange('activityType', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">所有活动类型</option>
                {ACTIVITY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 状态 */}
            <div>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">所有状态</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 高级过滤 */}
          {showAdvanced && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 用户角色 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户角色
                  </label>
                  <select
                    value={filters.userRole || ''}
                    onChange={(e) => handleFilterChange('userRole', e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">所有角色</option>
                    <option value="admin">管理员</option>
                    <option value="teacher">教师</option>
                    <option value="student">学生</option>
                  </select>
                </div>

                {/* 开始日期 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  />
                </div>

                {/* 结束日期 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期
                  </label>
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    min={filters.startDate}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  />
                </div>

                {/* 快速时间范围 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    快速选择
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setQuickDateRange('today')}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      今天
                    </button>
                    <button
                      onClick={() => setQuickDateRange('yesterday')}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      昨天
                    </button>
                    <button
                      onClick={() => setQuickDateRange('week')}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      近7天
                    </button>
                    <button
                      onClick={() => setQuickDateRange('month')}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      近30天
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}