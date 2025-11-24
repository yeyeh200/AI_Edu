import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  FunnelIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'teacher' | 'course' | 'class' | 'department' | 'system';
  format: 'pdf' | 'excel' | 'word';
  category: 'performance' | 'analysis' | 'summary' | 'detailed';
  parameters: Array<{
    key: string;
    label: string;
    type: 'select' | 'date' | 'multiselect';
    options?: string[];
    required: boolean;
  }>;
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  title: string;
  parameters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: string;
  fileSize?: number;
  downloadUrl?: string;
  generatedBy: string;
  generatedAt: string;
  expiresAt?: string;
}

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [reportParameters, setReportParameters] = useState<Record<string, any>>({});

  const { data: templates, isLoading: templatesLoading } = useQuery<ReportTemplate[]>({
    queryKey: ['report-templates'],
    queryFn: async () => {
      const response = await fetch('/api/reports/templates');
      if (!response.ok) {
        throw new Error('获取报表模板失败');
      }
      return response.json();
    },
  });

  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = useQuery<GeneratedReport[]>({
    queryKey: ['generated-reports'],
    queryFn: async () => {
      const response = await fetch('/api/reports/generated');
      if (!response.ok) {
        throw new Error('获取报表历史失败');
      }
      return response.json();
    },
  });

  const { data: filterOptions } = useQuery({
    queryKey: ['report-filters'],
    queryFn: async () => {
      const response = await fetch('/api/reports/filters');
      if (!response.ok) {
        throw new Error('获取筛选选项失败');
      }
      return response.json();
    },
  });

  const generateReport = async () => {
    if (!selectedTemplate) {
      alert('请选择报表模板');
      return;
    }

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          parameters: reportParameters,
        }),
      });

      if (!response.ok) {
        throw new Error('生成报表失败');
      }

      const result = await response.json();

      // Refresh reports list
      refetchReports();

      // Show success message
      alert(`报表 "${result.title}" 已开始生成，请稍后在历史记录中查看。`);

      // Reset form
      setSelectedTemplate(null);
      setReportParameters({});
    } catch (error) {
      alert('生成报表失败，请重试');
    }
  };

  const downloadReport = async (reportId: string, downloadUrl: string) => {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('下载失败');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadUrl.split('/').pop() || `report_${reportId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('下载报表失败，请重试');
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'teacher':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'course':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'class':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'department':
        return <ChartBarIcon className="h-5 w-5" />;
      default:
        return <DocumentArrowDownIcon className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'course':
        return 'bg-green-100 text-green-800';
      case 'class':
        return 'bg-purple-100 text-purple-800';
      case 'department':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '等待中';
      case 'processing':
        return '生成中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      default:
        return '未知';
    }
  };

  if (templatesLoading || reportsLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white shadow rounded-lg mb-6 h-16"></div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">数据报表</h1>
          <p className="mt-1 text-sm text-gray-600">
            生成和下载各类教学评价数据报表
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              报表模板
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              历史记录
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">选择报表模板</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates?.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-md ${getTypeColor(template.type)}`}>
                          {getTemplateIcon(template.type)}
                        </div>
                        <span className="text-xs text-gray-500 uppercase">{template.format}</span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                          {template.type}
                        </span>
                        <span className="text-xs text-gray-400">{template.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parameter Configuration */}
              {selectedTemplate && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">配置报表参数</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    {templates?.find(t => t.id === selectedTemplate)?.parameters.map((param) => (
                      <div key={param.key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {param.label}
                          {param.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {param.type === 'select' && (
                          <select
                            value={reportParameters[param.key] || ''}
                            onChange={(e) => setReportParameters({
                              ...reportParameters,
                              [param.key]: e.target.value
                            })}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            required={param.required}
                          >
                            <option value="">请选择...</option>
                            {param.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                        {param.type === 'date' && (
                          <input
                            type="date"
                            value={reportParameters[param.key] || ''}
                            onChange={(e) => setReportParameters({
                              ...reportParameters,
                              [param.key]: e.target.value
                            })}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            required={param.required}
                          />
                        )}
                        {param.type === 'multiselect' && (
                          <select
                            multiple
                            value={reportParameters[param.key] || []}
                            onChange={(e) => {
                              const values = Array.from(e.target.selectedOptions, option => option.value);
                              setReportParameters({
                                ...reportParameters,
                                [param.key]: values
                              });
                            }}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            required={param.required}
                          >
                            {param.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              {selectedTemplate && (
                <div className="flex justify-end">
                  <button
                    onClick={generateReport}
                    className="btn-primary"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    生成报表
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        报表信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        生成时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        文件大小
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports?.map((report) => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {report.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {report.templateName}
                            </div>
                            <div className="text-xs text-gray-400">
                              生成者: {report.generatedBy}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {report.format.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.generatedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.fileSize ? `${(report.fileSize / 1024 / 1024).toFixed(2)} MB` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {report.status === 'completed' && report.downloadUrl && (
                              <button
                                onClick={() => downloadReport(report.id, report.downloadUrl!)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="下载"
                              >
                                <DocumentArrowDownIcon className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="查看详情"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(!reports || reports.length === 0) && (
                <div className="text-center py-12">
                  <DocumentArrowDownIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">暂无报表记录</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    开始生成您的第一份报表吧
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};