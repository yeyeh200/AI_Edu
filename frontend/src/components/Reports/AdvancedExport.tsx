import React, { useState, useRef } from 'react';
import {
  DocumentArrowDownIcon,
  CloudArrowUpIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  CalendarIcon,
  FunnelIcon,
  TableCellsIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ExportConfiguration {
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'xml' | 'sql';
  compression: boolean;
  encryption: boolean;
  password?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  filters: Record<string, any>;
  columns: Array<{
    key: string;
    title: string;
    include: boolean;
    format?: string;
  }>;
  template?: {
    layout: string;
    theme: string;
    includeHeader: boolean;
    includeFooter: boolean;
  };
  delivery?: {
    type: 'download' | 'email' | 'ftp' | 'api' | 'cloud';
    recipients?: string[];
    schedule?: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly';
      time: string;
    };
  };
}

interface AdvancedExportProps {
  data: any[];
  title?: string;
  description?: string;
  availableColumns?: Array<{
    key: string;
    title: string;
    type: 'string' | 'number' | 'date' | 'boolean';
  }>;
  onExport?: (config: ExportConfiguration) => Promise<void>;
  className?: string;
}

export const AdvancedExport: React.FC<AdvancedExportProps> = ({
  data,
  title = '数据导出',
  description,
  availableColumns,
  onExport,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<ExportConfiguration>({
    format: 'excel',
    compression: false,
    encryption: false,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
    },
    filters: {},
    columns: availableColumns?.map(col => ({
      ...col,
      include: true,
    })) || [],
    template: {
      layout: 'single-column',
      theme: 'professional',
      includeHeader: true,
      includeFooter: true,
    },
  });

  const formatOptions = [
    { id: 'excel', name: 'Excel文件', ext: 'xlsx', icon: DocumentDuplicateIcon, description: '适用于数据分析' },
    { id: 'csv', name: 'CSV文件', ext: 'csv', icon: TableCellsIcon, description: '通用数据格式' },
    { id: 'pdf', name: 'PDF文件', ext: 'pdf', icon: DocumentArrowDownIcon, description: '打印友好格式' },
    { id: 'json', name: 'JSON文件', ext: 'json', icon: CloudArrowUpIcon, description: '结构化数据格式' },
    { id: 'xml', name: 'XML文件', ext: 'xml', icon: DocumentDuplicateIcon, description: '标准数据交换格式' },
    { id: 'sql', name: 'SQL脚本', ext: 'sql', icon: DocumentDuplicateIcon, description: '数据库导入格式' },
  ];

  const deliveryOptions = [
    { id: 'download', name: '直接下载', icon: DocumentArrowDownIcon },
    { id: 'email', name: '邮件发送', icon: EnvelopeIcon },
    { id: 'cloud', name: '云存储', icon: CloudArrowUpIcon },
    { id: 'ftp', name: 'FTP传输', icon: DocumentDuplicateIcon },
    { id: 'api', name: 'API接口', icon: CloudArrowUpIcon },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await onExport?.(config);

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setIsOpen(false);
        setCurrentStep(1);
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
      alert('导出失败，请重试');
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleColumnToggle = (columnKey: string) => {
    setConfig(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.key === columnKey ? { ...col, include: !col.include } : col
      ),
    }));
  };

  const addFilter = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...config.filters };
    delete newFilters[key];
    setConfig(prev => ({
      ...prev,
      filters: newFilters,
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">选择导出格式</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formatOptions.map(format => (
            <button
              key={format.id}
              onClick={() => setConfig(prev => ({ ...prev, format: format.id as any }))}
              className={`relative rounded-lg border-2 p-4 text-left hover:border-blue-500 transition-colors ${
                config.format === format.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <format.icon className={`h-6 w-6 mr-3 ${
                  config.format === format.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div>
                  <div className="font-medium text-gray-900">{format.name}</div>
                  <div className="text-sm text-gray-500">{format.description}</div>
                </div>
              </div>
              {config.format === format.id && (
                <div className="absolute top-2 right-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">数据范围</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始日期
            </label>
            <input
              type="date"
              value={config.dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: new Date(e.target.value) }
              }))}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束日期
            </label>
            <input
              type="date"
              value={config.dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: new Date(e.target.value) }
              }))}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">选择要导出的列</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {config.columns.map(column => (
            <div key={column.key} className="flex items-center justify-between p-3 hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={column.key}
                  checked={column.include}
                  onChange={() => handleColumnToggle(column.key)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={column.key} className="ml-3 text-sm font-medium text-gray-900">
                  {column.title}
                </label>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {column.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">数据筛选</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(config.filters).map(([key, value]) => (
              <div key={key} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>{key}: {value}</span>
                <button
                  onClick={() => removeFilter(key)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="筛选条件..."
              className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  addFilter('custom', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
              添加筛选
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">导出选项</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              数据压缩
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.compression}
                onChange={(e) => setConfig(prev => ({ ...prev, compression: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              加密保护
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.encryption}
                onChange={(e) => setConfig(prev => ({ ...prev, encryption: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {config.encryption && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                加密密码
              </label>
              <input
                type="password"
                value={config.password || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                placeholder="设置导出文件密码"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">交付方式</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setConfig(prev => ({
                ...prev,
                delivery: { ...prev.delivery, type: option.id as any }
              }))}
              className={`relative rounded-lg border-2 p-4 text-left hover:border-blue-500 transition-colors ${
                config.delivery?.type === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <option.icon className={`h-5 w-5 mr-3 ${
                  config.delivery?.type === option.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div className="font-medium text-gray-900">{option.name}</div>
              </div>
              {config.delivery?.type === option.id && (
                <div className="absolute top-2 right-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {config.delivery?.type === 'email' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            收件人邮箱
          </label>
          <input
            type="email"
            value={config.delivery?.recipients?.join(', ') || ''}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              delivery: {
                ...prev.delivery,
                recipients: e.target.value.split(',').map(email => email.trim())
              }
            }))}
            placeholder="多个邮箱用逗号分隔"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">导出预览</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-700">格式</dt>
              <dd className="text-sm text-gray-900">
                {formatOptions.find(f => f.id === config.format)?.name}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-700">数据行数</dt>
              <dd className="text-sm text-gray-900">{data.length} 行</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-700">选定列数</dt>
              <dd className="text-sm text-gray-900">
                {config.columns.filter(col => col.include).length} 列
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-700">数据范围</dt>
              <dd className="text-sm text-gray-900">
                {config.dateRange.start.toLocaleDateString()} - {config.dateRange.end.toLocaleDateString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-700">交付方式</dt>
              <dd className="text-sm text-gray-900">
                {deliveryOptions.find(d => d.id === config.delivery?.type)?.name}
              </dd>
            </div>
            {config.compression && (
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-700">压缩</dt>
                <dd className="text-sm text-gray-900">已启用</dd>
              </div>
            )}
            {config.encryption && (
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-700">加密</dt>
                <dd className="text-sm text-gray-900">已启用</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">导出说明</h3>
            <div className="mt-2 text-sm text-yellow-700">
              点击"开始导出"按钮后，系统将根据您的配置生成数据文件。
              大数据量导出可能需要较长时间，请耐心等待。
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      >
        <DocumentArrowDownIcon className="h-5 w-5" />
        <span>高级导出</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                    {description && (
                      <p className="mt-1 text-sm text-gray-600">{description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">关闭</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="mb-8">
                  <nav aria-label="Progress">
                    <ol className="flex items-center justify-between">
                      {[1, 2, 3, 4].map((step) => (
                        <li key={step} className="flex items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            currentStep >= step
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {step}
                          </div>
                          <span className={`ml-2 text-sm font-medium ${
                            currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {step === 1 && '格式'}
                            {step === 2 && '数据'}
                            {step === 3 && '选项'}
                            {step === 4 && '预览'}
                          </span>
                          {step < 4 && (
                            <div className={`ml-4 w-12 h-1 ${
                              currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>

                {/* Step Content */}
                <div className="min-h-96">
                  {renderStep()}
                </div>
              </div>

              {/* Progress Bar */}
              {isExporting && (
                <div className="px-4 py-4 bg-gray-50 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">导出进度</span>
                    <span className="text-sm text-gray-500">{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      导出中...
                    </>
                  ) : currentStep === 4 ? (
                    '开始导出'
                  ) : (
                    '下一步'
                  )}
                </button>
                {currentStep > 1 && (
                  <button
                    onClick={() => handleStepChange(currentStep - 1)}
                    disabled={isExporting}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    上一步
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isExporting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};