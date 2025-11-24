import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  Cog6ToothIcon,
  TableCellsIcon,
  ChartBarIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
} from '@/components/Charts';

interface ChartInteraction {
  zoom: {
    enabled: boolean;
    level: number;
    min: number;
    max: number;
  };
  selection: {
    enabled: boolean;
    selectedData: any[];
    range?: { start: number; end: number };
  };
  filters: Record<string, any>;
  viewMode: 'chart' | 'table' | 'both';
}

interface InteractiveChartProps {
  type: 'line' | 'bar' | 'pie' | 'gauge';
  data: any[];
  width?: number | string;
  height?: number;
  title?: string;
  subtitle?: string;
  config?: any;
  onInteraction?: (interaction: ChartInteraction) => void;
  onExport?: (format: 'png' | 'svg' | 'csv' | 'json') => void;
  onShare?: () => Promise<string>;
  enableZoom?: boolean;
  enableSelection?: boolean;
  enableFilter?: boolean;
  enableExport?: boolean;
  enableShare?: boolean;
  enableTableView?: boolean;
  className?: string;
  showControls?: boolean;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  type,
  data,
  width = '100%',
  height = 400,
  title,
  subtitle,
  config = {},
  onInteraction,
  onExport,
  onShare,
  enableZoom = true,
  enableSelection = true,
  enableFilter = true,
  enableExport = true,
  enableShare = true,
  enableTableView = true,
  className = '',
  showControls = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState<ChartInteraction>({
    zoom: { enabled: false, level: 1, min: 0, max: 100 },
    selection: { enabled: false, selectedData: [] },
    filters: {},
    viewMode: 'chart',
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle zoom
  const handleZoomIn = useCallback(() => {
    if (!enableZoom) return;

    setInteraction(prev => {
      const newLevel = Math.min(prev.zoom.level + 0.5, 3);
      return {
        ...prev,
        zoom: {
          ...prev.zoom,
          level: newLevel,
          enabled: newLevel > 1,
        },
      };
    });
    onInteraction?.(interaction);
  }, [enableZoom, onInteraction, interaction]);

  const handleZoomOut = useCallback(() => {
    if (!enableZoom) return;

    setInteraction(prev => {
      const newLevel = Math.max(prev.zoom.level - 0.5, 1);
      return {
        ...prev,
        zoom: {
          ...prev.zoom,
          level: newLevel,
          enabled: newLevel > 1,
        },
      };
    });
    onInteraction?.(interaction);
  }, [enableZoom, onInteraction, interaction]);

  const handleResetZoom = useCallback(() => {
    setInteraction(prev => ({
      ...prev,
      zoom: { enabled: false, level: 1, min: 0, max: 100 },
    }));
    onInteraction?.(interaction);
  }, [onInteraction, interaction]);

  // Handle data selection
  const handleDataSelect = useCallback((selectedItem: any, isSelected: boolean) => {
    if (!enableSelection) return;

    setInteraction(prev => ({
      ...prev,
      selection: {
        enabled: true,
        selectedData: isSelected
          ? [...prev.selection.selectedData, selectedItem]
          : prev.selection.selectedData.filter(item => item.id !== selectedItem.id),
      },
    }));
    onInteraction?.(interaction);
  }, [enableSelection, onInteraction, interaction]);

  // Handle view mode toggle
  const toggleViewMode = useCallback(() => {
    if (!enableTableView) return;

    setInteraction(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'chart' ? 'table' : 'chart',
    }));
  }, [enableTableView]);

  // Export functions
  const exportChart = useCallback(async (format: 'png' | 'svg' | 'csv' | 'json' = 'png') => {
    if (!enableExport) return;

    try {
      if (format === 'png' || format === 'svg') {
        const element = chartRef.current;
        if (!element) throw new Error('图表元素未找到');

        if (format === 'png') {
          // Use html2canvas or similar library for PNG export
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('无法创建canvas上下文');

          // This is a simplified version - in production, use a proper library
          canvas.width = element.offsetWidth;
          canvas.height = element.offsetHeight;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw chart content (simplified)
          ctx.fillStyle = 'black';
          ctx.font = '16px Arial';
          ctx.fillText(title || 'Chart', 20, 30);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `chart-${Date.now()}.png`;
              a.click();
              URL.revokeObjectURL(url);
            }
          });
        }
      } else {
        // CSV/JSON export
        const dataStr = format === 'json'
          ? JSON.stringify(data, null, 2)
          : convertToCSV(data);

        const blob = new Blob([dataStr], {
          type: format === 'json' ? 'application/json' : 'text/csv'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chart-data-${Date.now()}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }

      onExport?.(format);
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败，请重试');
    }
  }, [data, title, enableExport, onExport]);

  // Share function
  const shareChart = useCallback(async () => {
    if (!enableShare) return;

    try {
      const shareData = {
        type,
        title,
        data: data.slice(0, 10), // Limit shared data
        config: interaction,
        timestamp: Date.now(),
      };

      if (onShare) {
        return await onShare();
      }

      // Default share behavior
      const shareUrl = `${window.location.origin}/shared-chart?data=${encodeURIComponent(JSON.stringify(shareData))}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('分享链接已复制到剪贴板');
      return shareUrl;
    } catch (err) {
      console.error('Share failed:', err);
      alert('分享失败，请重试');
      throw err;
    }
  }, [type, title, data, interaction, enableShare, onShare]);

  // CSV conversion helper
  const convertToCSV = (data: any[]): string => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!chartRef.current) return;

    if (!isFullscreen) {
      chartRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Render appropriate chart component
  const renderChart = () => {
    const chartProps = {
      data: interaction.filters.enabled ? filterData(data, interaction.filters) : data,
      width: interaction.zoom.enabled ? `calc(${width} * ${interaction.zoom.level})` : width,
      height: interaction.zoom.enabled ? height * interaction.zoom.level : height,
      title: title,
      subtitle: subtitle,
      ...config,
    };

    switch (type) {
      case 'line':
        return <LineChart {...chartProps} />;
      case 'bar':
        return <BarChart {...chartProps} />;
      case 'pie':
        return <PieChart {...chartProps} />;
      case 'gauge':
        return <GaugeChart {...chartProps} />;
      default:
        return <div>不支持的图表类型</div>;
    }
  };

  // Render table view
  const renderTable = () => {
    if (!data.length) return <div className="text-center py-8 text-gray-500">暂无数据</div>;

    const headers = Object.keys(data[0]);
    const filteredData = interaction.filters.enabled ? filterData(data, interaction.filters) : data;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${
                  interaction.selection.selectedData.some(item => item.id === row.id)
                    ? 'bg-primary-50'
                    : ''
                }`}
                onClick={() => enableSelection && handleDataSelect(row, !interaction.selection.selectedData.some(item => item.id === row.id))}
              >
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Filter data helper
  const filterData = (data: any[], filters: Record<string, any>) => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === '') return true;
        return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className} ${isFullscreen ? 'fixed inset-0 z-50 m-0' : ''}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>

          {showControls && (
            <div className="flex items-center space-x-2">
              {/* View mode toggle */}
              {enableTableView && (
                <button
                  onClick={toggleViewMode}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={interaction.viewMode === 'chart' ? '切换到表格视图' : '切换到图表视图'}
                >
                  {interaction.viewMode === 'chart' ? (
                    <TableCellsIcon className="h-4 w-4" />
                  ) : (
                    <ChartBarIcon className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* Zoom controls */}
              {enableZoom && (
                <>
                  <button
                    onClick={handleZoomIn}
                    disabled={interaction.zoom.level >= 3}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    title="放大"
                  >
                    <MagnifyingGlassPlusIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    disabled={interaction.zoom.level <= 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    title="缩小"
                  >
                    <MagnifyingGlassMinusIcon className="h-4 w-4" />
                  </button>
                  {interaction.zoom.enabled && (
                    <button
                      onClick={handleResetZoom}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="重置缩放"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="全屏"
              >
                {isFullscreen ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>

              {/* Export */}
              {enableExport && (
                <div className="relative group">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="导出"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => exportChart('png')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        导出为 PNG
                      </button>
                      <button
                        onClick={() => exportChart('csv')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        导出为 CSV
                      </button>
                      <button
                        onClick={() => exportChart('json')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        导出为 JSON
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Share */}
              {enableShare && (
                <button
                  onClick={shareChart}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="分享"
                >
                  <ShareIcon className="h-4 w-4" />
                </button>
              )}

              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="设置"
              >
                <Cog6ToothIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">图表设置</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {enableFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">快速筛选</label>
                <input
                  type="text"
                  placeholder="输入关键词筛选..."
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  onChange={(e) => {
                    setInteraction(prev => ({
                      ...prev,
                      filters: { ...prev.filters, search: e.target.value },
                    }));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart Content */}
      <div ref={chartRef} className="p-6">
        {interaction.viewMode === 'chart' ? renderChart() : renderTable()}
      </div>

      {/* Status Bar */}
      {(interaction.selection.selectedData.length > 0 || interaction.zoom.enabled) && (
        <div className="border-t border-gray-200 px-6 py-2 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              {interaction.selection.selectedData.length > 0 && (
                <span>已选择 {interaction.selection.selectedData.length} 项数据</span>
              )}
              {interaction.zoom.enabled && (
                <span className="ml-4">缩放: {Math.round(interaction.zoom.level * 100)}%</span>
              )}
            </div>
            <div>
              {data.length} 条记录
            </div>
          </div>
        </div>
      )}
    </div>
  );
};