import React, { useState, useCallback } from 'react';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  ArrowPathIcon,
  ShareIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface DrillDownLevel {
  id: string;
  title: string;
  data: any[];
  type: 'overview' | 'department' | 'teacher' | 'course' | 'class' | 'evaluation';
  parent?: string;
  metadata?: Record<string, any>;
}

interface DataDrillDownProps {
  initialData: any[];
  levels: Array<{
    id: string;
    title: string;
    type: DrillDownLevel['type'];
    fetchFunction?: (parentId: string, filters?: any) => Promise<any[]>;
    component: React.ComponentType<{ data: any[]; onDrillDown: (item: any) => void; level: DrillDownLevel }>;
    backComponent?: React.ComponentType<{ data: any[]; onBack: () => void; level: DrillDownLevel }>;
  }>;
  onLevelChange?: (level: DrillDownLevel) => void;
  className?: string;
  maxDepth?: number;
  enableExport?: boolean;
  enableShare?: boolean;
  enableRefresh?: boolean;
}

interface DrillDownContext {
  levels: DrillDownLevel[];
  currentLevelIndex: number;
  currentLevel: DrillDownLevel;
  navigateTo: (item: any, targetLevel?: string) => Promise<void>;
  navigateBack: () => void;
  navigateToRoot: () => void;
  refresh: () => Promise<void>;
  exportData: (format?: 'csv' | 'json' | 'excel') => Promise<void>;
  shareData: () => Promise<string>;
}

export const DataDrillDown: React.FC<DataDrillDownProps> = ({
  initialData,
  levels,
  onLevelChange,
  className = '',
  maxDepth = 5,
  enableExport = true,
  enableShare = true,
  enableRefresh = true,
}) => {
  const [drillLevels, setDrillLevels] = useState<DrillDownLevel[]>([
    {
      id: levels[0].id,
      title: levels[0].title,
      data: initialData,
      type: levels[0].type,
    }
  ]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentLevel = drillLevels[currentLevelIndex];

  const navigateTo = useCallback(async (item: any, targetLevelId?: string) => {
    if (currentLevelIndex >= maxDepth - 1) {
      setError('已达到最大钻取深度');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const targetLevelId = targetLevelId || levels[currentLevelIndex + 1].id;
      const targetLevel = levels.find(l => l.id === targetLevelId);

      if (!targetLevel) {
        throw new Error('找不到目标层级');
      }

      let data: any[] = [];

      if (targetLevel.fetchFunction) {
        data = await targetLevel.fetchFunction(item.id, item);
      } else if (item.children) {
        data = item.children;
      } else {
        // Generate mock data if no fetch function provided
        data = generateMockData(targetLevel.type, item);
      }

      const newLevel: DrillDownLevel = {
        id: targetLevelId,
        title: `${targetLevel.title} - ${item.name || item.title}`,
        data,
        type: targetLevel.type,
        parent: currentLevel.id,
        metadata: item,
      };

      const newLevels = [...drillLevels.slice(0, currentLevelIndex + 1), newLevel];
      setDrillLevels(newLevels);
      setCurrentLevelIndex(currentLevelIndex + 1);
      onLevelChange?.(newLevel);

    } catch (err) {
      setError(err instanceof Error ? err.message : '导航失败');
    } finally {
      setIsLoading(false);
    }
  }, [currentLevel, currentLevelIndex, drillLevels, levels, maxDepth, onLevelChange]);

  const navigateBack = useCallback(() => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
      onLevelChange?.(drillLevels[currentLevelIndex - 1]);
      setError(null);
    }
  }, [currentLevelIndex, drillLevels, onLevelChange]);

  const navigateToRoot = useCallback(() => {
    setCurrentLevelIndex(0);
    onLevelChange?.(drillLevels[0]);
    setError(null);
  }, [drillLevels, onLevelChange]);

  const refresh = useCallback(async () => {
    if (!enableRefresh) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentLevelConfig = levels.find(l => l.id === currentLevel.id);
      let data: any[] = [];

      if (currentLevelIndex === 0) {
        data = initialData;
      } else if (currentLevelConfig?.fetchFunction && currentLevel.metadata) {
        data = await currentLevelConfig.fetchFunction(currentLevel.metadata.id, currentLevel.metadata);
      } else {
        data = currentLevel.data;
      }

      const updatedLevels = [...drillLevels];
      updatedLevels[currentLevelIndex] = {
        ...currentLevel,
        data,
      };

      setDrillLevels(updatedLevels);
      onLevelChange?.(updatedLevels[currentLevelIndex]);

    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新失败');
    } finally {
      setIsLoading(false);
    }
  }, [currentLevel, currentLevelIndex, drillLevels, levels, enableRefresh, initialData, onLevelChange]);

  const exportData = useCallback(async (format: 'csv' | 'json' | 'excel' = 'csv') => {
    if (!enableExport) return;

    try {
      const dataStr = JSON.stringify(currentLevel.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drill-down-data-${currentLevel.id}-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败');
    }
  }, [currentLevel, enableExport]);

  const shareData = useCallback(async (): Promise<string> => {
    if (!enableShare) throw new Error('分享功能未启用');

    const shareData = {
      level: currentLevel.id,
      title: currentLevel.title,
      data: currentLevel.data,
      timestamp: Date.now(),
    };

    const shareUrl = `${window.location.origin}/shared-data?data=${encodeURIComponent(JSON.stringify(shareData))}`;
    return shareUrl;
  }, [currentLevel, enableShare]);

  const context: DrillDownContext = {
    levels: drillLevels,
    currentLevelIndex,
    currentLevel,
    navigateTo,
    navigateBack,
    navigateToRoot,
    refresh,
    exportData,
    shareData,
  };

  // Generate mock data helper
  const generateMockData = (type: string, parentItem: any): any[] => {
    const mockCount = Math.floor(Math.random() * 10) + 5;
    return Array.from({ length: mockCount }, (_, index) => ({
      id: `${parentItem.id}-${index}`,
      name: `${type === 'teacher' ? '教师' : type === 'course' ? '课程' : '项目'} ${index + 1}`,
      value: Math.floor(Math.random() * 100),
      score: (Math.random() * 2 + 3).toFixed(1),
      count: Math.floor(Math.random() * 50) + 10,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
    }));
  };

  const CurrentComponent = levels.find(l => l.id === currentLevel.id)?.component;

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-2">
            {drillLevels.slice(0, currentLevelIndex + 1).map((level, index) => (
              <div key={level.id} className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                )}
                <button
                  onClick={() => {
                    if (index < currentLevelIndex) {
                      setCurrentLevelIndex(index);
                      onLevelChange?.(level);
                    }
                  }}
                  className={`text-sm font-medium ${
                    index === currentLevelIndex
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {level.title}
                </button>
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {enableRefresh && (
              <button
                onClick={refresh}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                title="刷新数据"
              >
                <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}

            {enableShare && (
              <button
                onClick={() => {
                  shareData().then(url => {
                    navigator.clipboard.writeText(url);
                    alert('分享链接已复制到剪贴板');
                  }).catch(err => {
                    setError(err.message);
                  });
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="分享数据"
              >
                <ShareIcon className="h-4 w-4" />
              </button>
            )}

            {enableExport && (
              <button
                onClick={() => exportData('csv')}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="导出数据"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">错误</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : CurrentComponent ? (
          <CurrentComponent
            data={currentLevel.data}
            onDrillDown={navigateTo}
            level={currentLevel}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            暂无可显示的数据
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {currentLevelIndex > 0 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={navigateBack}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span>返回上一级</span>
            </button>

            <button
              onClick={navigateToRoot}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              返回首页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Context provider for child components
export const DrillDownContext = React.createContext<DrillDownContext | null>(null);

export const useDrillDown = (): DrillDownContext => {
  const context = React.useContext(DrillDownContext);
  if (!context) {
    throw new Error('useDrillDown must be used within a DataDrillDown component');
  }
  return context;
};

// Higher-order component for drill-down enabled components
export const withDrillDown = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const context = useDrillDown();
    return <Component {...props} drillDownContext={context} ref={ref} />;
  });
};