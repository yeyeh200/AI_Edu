import React, { useState } from 'react';
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
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
  user_agent?: string;
  metadata?: Record<string, any>;
  request_parameters?: Record<string, any>;
}

// Props接口
interface LogDetailProps {
  log: LogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LogDetail({ log, isOpen, onClose }: LogDetailProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));

  if (!isOpen || !log) return null;

  // 切换章节展开状态
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
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
        second: '2-digit',
        timeZoneName: 'short'
      });
    } catch (error) {
      return timeString;
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // TODO: 显示复制成功提示
      console.log('复制成功');
    });
  };

  // 渲染JSON数据
  const renderJsonData = (data: any, title: string) => {
    if (!data || Object.keys(data).length === 0) {
      return <span className="text-gray-400">暂无数据</span>;
    }

    const jsonString = JSON.stringify(data, null, 2);

    return (
      <div className="relative">
        <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-x-auto max-h-64">
          <code>{jsonString}</code>
        </pre>
        <button
          onClick={() => copyToClipboard(jsonString)}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 bg-white rounded-md shadow-sm"
          title="复制JSON"
        >
          <ClipboardDocumentIcon className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // 可折叠章节组件
  const CollapsibleSection = ({
    id,
    title,
    children,
    defaultExpanded = false
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections.has(id);

    return (
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
        >
          <span className="font-medium text-gray-900">{title}</span>
          {isExpanded ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isExpanded && (
          <div className="p-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* 对话框 */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 py-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                {getStatusIcon(log.status)}
                <span>日志详情</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(log.status)}`}>
                  {getStatusText(log.status)}
                </span>
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 基础信息 */}
              <CollapsibleSection id="basic" title="基础信息" defaultExpanded>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">日志ID</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {log.id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(log.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="复制ID"
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">活动时间</label>
                    <div className="text-sm text-gray-900">
                      {formatTime(log.activity_time)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">活动类型</label>
                    <div className="text-sm text-gray-900">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {log.activity_type}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
                    <div className="text-sm text-gray-900 font-medium">
                      {log.activity_name}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <div className="text-sm text-gray-900">
                      {log.description}
                    </div>
                  </div>

                  {log.duration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">执行耗时</label>
                      <div className="text-sm text-gray-900">
                        {log.duration}ms
                      </div>
                    </div>
                  )}

                  {log.ip_address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IP地址</label>
                      <div className="text-sm text-gray-900">
                        {log.ip_address}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleSection>

              {/* 用户信息 */}
              {(log.username || log.user_role) && (
                <CollapsibleSection id="user" title="用户信息">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {log.username && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                        <div className="text-sm text-gray-900">
                          {log.username}
                        </div>
                      </div>
                    )}

                    {log.user_role && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">用户角色</label>
                        <div className="text-sm text-gray-900">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {log.user_role}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              )}

              {/* 请求信息 */}
              {(log.request_method || log.request_url || log.response_status || log.user_agent) && (
                <CollapsibleSection id="request" title="请求信息">
                  <div className="space-y-4">
                    {log.request_method && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">请求方法</label>
                        <div className="text-sm text-gray-900">
                          <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800 font-mono">
                            {log.request_method}
                          </span>
                        </div>
                      </div>
                    )}

                    {log.request_url && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">请求URL</label>
                        <div className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded break-all">
                          {log.request_url}
                        </div>
                      </div>
                    )}

                    {log.response_status && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">响应状态</label>
                        <div className="text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs rounded-md font-mono ${
                            log.response_status >= 200 && log.response_status < 300
                              ? 'bg-green-100 text-green-800'
                              : log.response_status >= 400
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {log.response_status}
                          </span>
                        </div>
                      </div>
                    )}

                    {log.user_agent && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">用户代理</label>
                        <div className="text-sm text-gray-900 bg-gray-100 p-2 rounded break-all">
                          {log.user_agent}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              )}

              {/* 请求参数 */}
              {log.request_parameters && (
                <CollapsibleSection id="parameters" title="请求参数">
                  {renderJsonData(log.request_parameters, '请求参数')}
                </CollapsibleSection>
              )}

              {/* 元数据 */}
              {log.metadata && (
                <CollapsibleSection id="metadata" title="元数据">
                  {renderJsonData(log.metadata, '元数据')}
                </CollapsibleSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}