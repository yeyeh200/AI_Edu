import React, { useState, useRef } from 'react';
import {
  DocumentArrowDownIcon,
  ShareIcon,
  PrinterIcon,
  CloudArrowDownIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useClickOutside } from '@/hooks/useClickOutside';
import { DataExporter } from '@/utils/dataExport';

interface ExportButtonProps {
  data: any[];
  columns?: Array<{
    key: string;
    title: string;
    format?: (value: any) => string;
    exportHidden?: boolean;
  }>;
  title?: string;
  subtitle?: string;
  filename?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  position?: 'left' | 'right' | 'center';
  showTooltip?: boolean;
}

type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf' | 'png' | 'print' | 'email' | 'share';

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  columns,
  title,
  subtitle,
  filename,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'primary',
  position = 'right',
  showTooltip = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const exportFormats: Array<{
    key: ExportFormat;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => Promise<void>;
    description?: string;
  }> = [
    {
      key: 'csv',
      label: 'CSV格式',
      icon: DocumentArrowDownIcon,
      description: '适用于Excel编辑',
      action: async () => {
        await DataExporter.exportToCSV(data, columns, {
          filename: filename ? `${filename}.csv` : undefined,
          title,
          subtitle,
        });
      },
    },
    {
      key: 'excel',
      label: 'Excel格式',
      icon: DocumentArrowDownIcon,
      description: 'Microsoft Excel文件',
      action: async () => {
        await DataExporter.exportToExcel(data, columns, {
          filename: filename ? `${filename}.xlsx` : undefined,
          title,
          subtitle,
        });
      },
    },
    {
      key: 'json',
      label: 'JSON格式',
      icon: CloudArrowDownIcon,
      description: '结构化数据格式',
      action: async () => {
        await DataExporter.exportToJSON(data, {
          filename: filename ? `${filename}.json` : undefined,
          title,
          subtitle,
        });
      },
    },
    {
      key: 'pdf',
      label: 'PDF格式',
      icon: DocumentArrowDownIcon,
      description: '打印友好的PDF文件',
      action: async () => {
        await DataExporter.exportToPDF(data, columns, {
          filename: filename ? `${filename}.pdf` : undefined,
          title,
          subtitle,
        });
      },
    },
    {
      key: 'png',
      label: 'PNG图片',
      icon: CloudArrowDownIcon,
      description: '导出为图片格式',
      action: async () => {
        // This would need the element ID of the chart/table to export
        alert('图片导出功能需要指定要导出的元素ID');
      },
    },
    {
      key: 'print',
      label: '打印',
      icon: PrinterIcon,
      description: '直接打印数据',
      action: async () => {
        await DataExporter.printData(data, columns, {
          title,
          subtitle,
        });
      },
    },
    {
      key: 'email',
      label: '邮件发送',
      icon: EnvelopeIcon,
      description: '通过邮件发送',
      action: async () => {
        setEmailModalOpen(true);
        setIsOpen(false);
      },
    },
    {
      key: 'share',
      label: '分享链接',
      icon: ShareIcon,
      description: '生成分享链接',
      action: async () => {
        const link = await DataExporter.generateShareLink(data, {
          title: title || '数据分享',
          description: subtitle,
          expiryDays: 7,
          allowDownload: true,
        });
        setShareLink(link);
        setShareModalOpen(true);
        setIsOpen(false);
      },
    },
  ];

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(format);
    try {
      const exportFormat = exportFormats.find(f => f.key === format);
      if (exportFormat) {
        await exportFormat.action();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleEmailSend = async () => {
    if (!emailAddress) {
      alert('请输入邮件地址');
      return;
    }

    setIsExporting('email');
    try {
      await DataExporter.sendViaEmail(
        data,
        emailAddress,
        title || '数据导出',
        {
          filename,
          title,
          subtitle,
        }
      );
      setEmailModalOpen(false);
      setEmailAddress('');
      alert('邮件发送成功');
    } catch (error) {
      console.error('Email send failed:', error);
      alert('邮件发送失败');
    } finally {
      setIsExporting(null);
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert('分享链接已复制到剪贴板');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('复制失败');
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
      case 'outline':
        return 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500';
      default:
        return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'origin-top-left left-0';
      case 'center':
        return 'origin-top-left left-1/2 transform -translate-x-1/2';
      default:
        return 'origin-top-right right-0';
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isExporting !== null}
          className={`inline-flex items-center space-x-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getSizeClasses()} ${getVariantClasses()}`}
          title={showTooltip ? '导出数据' : undefined}
        >
          {isExporting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <DocumentArrowDownIcon className="h-4 w-4" />
          )}
          <span>导出</span>
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${getPositionClasses()}`}
          >
            <div className="py-1" role="menu">
              {exportFormats.map((format) => (
                <button
                  key={format.key}
                  onClick={() => handleExport(format.key)}
                  disabled={isExporting !== null}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                  role="menuitem"
                >
                  <format.icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{format.label}</div>
                    {format.description && (
                      <div className="text-xs text-gray-500">{format.description}</div>
                    )}
                  </div>
                  {isExporting === format.key && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 ml-auto"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setEmailModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      发送邮件
                    </h3>
                    <div className="mt-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        邮件地址
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="请输入邮件地址"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        数据将以CSV格式作为附件发送
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleEmailSend}
                  disabled={!emailAddress || isExporting === 'email'}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isExporting === 'email' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      发送中...
                    </>
                  ) : (
                    '发送'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShareModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      分享数据
                    </h3>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        分享链接
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={shareLink}
                          readOnly
                          className="flex-1 block border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                        />
                        <button
                          onClick={copyShareLink}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                        >
                          复制
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        链接将在7天后失效，只有拥有链接的人可以访问数据
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};