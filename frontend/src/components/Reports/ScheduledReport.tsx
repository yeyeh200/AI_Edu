import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  CalendarIcon,
  BellIcon,
  TrashIcon,
  PencilIcon,
  PauseIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  templateId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  status: 'active' | 'paused' | 'error';
  lastRun?: string;
  nextRun?: string;
  config: {
    filters: Record<string, any>;
    compression: boolean;
    encryption: boolean;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ScheduledReportProps {
  onCreateNew?: () => void;
  className?: string;
}

export const ScheduledReport: React.FC<ScheduledReportProps> = ({
  onCreateNew,
  className = '',
}) => {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports/scheduled');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    try {
      const response = await fetch(`/api/reports/scheduled/${reportId}/toggle`, {
        method: 'POST',
      });

      if (response.ok) {
        setReports(prev => prev.map(r =>
          r.id === reportId
            ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
            : r
        ));
      }
    } catch (error) {
      console.error('Failed to toggle report status:', error);
      alert('操作失败，请重试');
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!window.confirm('确定要删除这个定时报表吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/reports/scheduled/${reportId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReports(prev => prev.filter(r => r.id !== reportId));
      }
    } catch (error) {
      console.error('Failed to delete scheduled report:', error);
      alert('删除失败，请重试');
    }
  };

  const handleRunNow = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/scheduled/${reportId}/run`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('报告已开始生成');
      }
    } catch (error) {
      console.error('Failed to run scheduled report:', error);
      alert('运行失败，请重试');
    }
  };

  const getFrequencyText = (frequency: string) => {
    const frequencies = {
      daily: '每日',
      weekly: '每周',
      monthly: '每月',
    };
    return frequencies[frequency as keyof typeof frequencies] || frequency;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'paused':
        return <PauseIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statuses = {
      active: '运行中',
      paused: '已暂停',
      error: '错误',
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">定时报表</h2>
              <p className="text-sm text-gray-600">自动化生成和发送定期报告</p>
            </div>
          </div>
          <button
            onClick={() => onCreateNew?.()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            新建定时报表
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="px-6 py-4">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">暂无定时报表</h3>
            <p className="text-sm text-gray-500">
              创建您的第一个定时报表，自动获取最新数据
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(report.status)}
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm">
                      <div className="text-gray-900">{getFrequencyText(report.frequency)}</div>
                      <div className="text-gray-500">{report.time}</div>
                      {report.lastRun && (
                        <div className="text-xs text-gray-400 mt-1">
                          上次: {new Date(report.lastRun).toLocaleDateString()}
                        </div>
                      )}
                      {report.nextRun && (
                        <div className="text-xs text-blue-600 mt-1">
                          下次: {new Date(report.nextRun).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 border-l pl-2">
                      <button
                        onClick={() => handleRunNow(report.id)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="立即运行"
                      >
                        <PlayIcon className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(report.id)}
                        className="p-2 text-gray-400 hover:text-yellow-600"
                        title={report.status === 'active' ? '暂停' : '启用'}
                      >
                        {report.status === 'active' ? (
                          <PauseIcon className="h-4 w-4" />
                        ) : (
                          <PlayIcon className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="编辑"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="删除"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Report Details */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">格式:</span>
                    <span className="font-medium text-gray-900 uppercase">{report.format}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">收件人:</span>
                    <span className="font-medium text-gray-900">
                      {report.recipients.length} 个邮箱
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">创建者:</span>
                    <span className="font-medium text-gray-900">{report.createdBy}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">创建时间:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Recipients Preview */}
                {report.recipients.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">收件人:</div>
                    <div className="flex flex-wrap gap-2">
                      {report.recipients.slice(0, 3).map((email, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          {email}
                        </span>
                      ))}
                      {report.recipients.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          +{report.recipients.length - 3} 更多
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            共 {reports.length} 个定时报表
            {reports.filter(r => r.status === 'active').length > 0 && (
              <span className="text-green-600 ml-2">
                ({reports.filter(r => r.status === 'active').length} 个运行中)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <BellIcon className="h-4 w-4" />
            <span>系统将按配置自动生成和发送报告</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledReport;