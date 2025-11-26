import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  ServerIcon,
  CloudIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ConfigForm } from '@/components/System/ConfigForm';
import { systemService, type SystemConfig, type ConfigCategory, type CreateConfigRequest, type UpdateConfigRequest } from '@/services/systemService';

export function SystemConfigPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('system');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [categories, setCategories] = useState<ConfigCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // 状态管理
  const [isConfigFormOpen, setIsConfigFormOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // 加载配置数据
  const loadConfigs = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await systemService.getConfigs({
        category: selectedCategory,
        search: searchTerm,
        page: pagination.page,
        limit: pagination.limit,
        includePrivate: true
      });

      if (response.success && response.data) {
        setConfigs(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.total_pages || 0
        }));
      }
    } catch (error: any) {
      setError(error.message || '加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载分类数据
  const loadCategories = async () => {
    try {
      const response = await systemService.getConfigCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      console.error('加载分类失败:', error);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadCategories();
  }, []);

  // 当分类或搜索条件变化时重新加载
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    loadConfigs();
  }, [selectedCategory, searchTerm, pagination.page]);

  // 获取当前分类信息
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  // 事件处理器
  const handleCreateConfig = () => {
    setEditingConfig(null);
    setFormMode('create');
    setIsConfigFormOpen(true);
  };

  const handleEditConfig = (config: SystemConfig) => {
    setEditingConfig(config);
    setFormMode('edit');
    setIsConfigFormOpen(true);
  };

  const handleDeleteConfig = async (config: SystemConfig) => {
    if (window.confirm(`确定要删除配置 "${config.key}" 吗？此操作不可恢复。`)) {
      try {
        await systemService.deleteConfig(config.key);
        await loadConfigs(); // 重新加载配置列表
      } catch (error: any) {
        setError(error.message || '删除配置失败');
      }
    }
  };

  const handleConfigSubmit = async (data: CreateConfigRequest) => {
    try {
      if (formMode === 'create') {
        await systemService.createConfig(data);
      } else if (editingConfig) {
        const updateData: UpdateConfigRequest = {
          name: data.name,
          description: data.description,
          value: data.value,
          isPublic: data.isPublic,
          isEditable: data.isEditable
        };
        await systemService.updateConfig(editingConfig.key, updateData);
      }

      setIsConfigFormOpen(false);
      await loadConfigs(); // 重新加载配置列表
    } catch (error: any) {
      throw error; // 让表单组件处理错误显示
    }
  };

  const handleExportConfigs = async () => {
    try {
      const blob = await systemService.exportConfigs('json', selectedCategory);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `configs_${selectedCategory}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error.message || '导出配置失败');
    }
  };

  const formatValue = (value: any, dataType: string) => {
    if (value === null || value === undefined) return '-';

    switch (dataType) {
      case 'boolean':
        return value ? '是' : '否';
      case 'json':
      case 'array':
        try {
          return JSON.stringify(value).substring(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '');
        } catch {
          return String(value);
        }
      default:
        return String(value);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">系统配置管理</h2>
          <p className="mt-1 text-sm text-gray-600">
            管理系统参数、数据源配置和分析规则
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportConfigs}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>导出配置</span>
          </button>
          <button
            onClick={handleCreateConfig}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>新建配置</span>
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">操作失败</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 配置分类卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const getIcon = (categoryId: string) => {
            switch (categoryId) {
              case 'system': return Cog6ToothIcon;
              case 'database': return CloudIcon;
              case 'analysis': return ChartBarIcon;
              case 'monitoring': return ServerIcon;
              default: return Cog6ToothIcon;
            }
          };

          const getColor = (categoryId: string) => {
            switch (categoryId) {
              case 'system': return 'bg-blue-100 text-blue-800';
              case 'database': return 'bg-green-100 text-green-800';
              case 'analysis': return 'bg-purple-100 text-purple-800';
              case 'monitoring': return 'bg-orange-100 text-orange-800';
              default: return 'bg-gray-100 text-gray-800';
            }
          };

          const Icon = getIcon(category.id);
          const color = getColor(category.id);

          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                selectedCategory === category.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.configCount || 0} 项配置
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                {category.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="搜索配置项..."
              />
            </div>
            <button className="btn-secondary flex items-center space-x-2">
              <FunnelIcon className="h-4 w-4" />
              <span>筛选</span>
            </button>
          </div>
          <div className="text-sm text-gray-600">
            共 {pagination.total} 个配置项
          </div>
        </div>
      </div>

      {/* 配置项列表 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {currentCategory?.name || '系统'} 配置
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {currentCategory?.description || '管理系统配置参数'}
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载配置中...</p>
          </div>
        ) : configs.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Cog6ToothIcon />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无配置项</h3>
            <p className="text-gray-600">
              {searchTerm ? '没有找到匹配的配置项' : '该分类下暂无配置项'}
            </p>
            <button
              onClick={handleCreateConfig}
              className="mt-4 btn-primary"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              创建第一个配置
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    配置名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    配置键
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    当前值
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后修改
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {configs.map((config) => (
                  <tr key={config.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {config.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {config.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {config.key}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {formatValue(config.value, config.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        config.type === 'string' ? 'bg-blue-100 text-blue-800' :
                        config.type === 'number' ? 'bg-green-100 text-green-800' :
                        config.type === 'boolean' ? 'bg-purple-100 text-purple-800' :
                        config.type === 'json' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {config.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{formatTime(config.updated_at)}</div>
                        <div className="text-xs">{config.updated_by}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditConfig(config)}
                          className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>编辑</span>
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDeleteConfig(config)}
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>删除</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          {config.is_public ? (
                            <span className="text-xs text-green-600">公开</span>
                          ) : (
                            <span className="text-xs text-gray-500">私有</span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      显示第 <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> 至{' '}
                      <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> 条，
                      共 <span className="font-medium">{pagination.total}</span> 条记录
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={pagination.page <= 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-primary-500 text-sm font-medium text-primary-600 bg-primary-50">
                        {pagination.page}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                        disabled={pagination.page >= pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 配置表单弹窗 */}
      <ConfigForm
        isOpen={isConfigFormOpen}
        onClose={() => setIsConfigFormOpen(false)}
        config={editingConfig}
        categories={categories}
        onSubmit={handleConfigSubmit}
        mode={formMode}
      />
    </div>
  );
}