import React from 'react';
import {
  DocumentIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ReportSection {
  id: string;
  type: 'header' | 'summary' | 'chart' | 'table' | 'text' | 'footer';
  title?: string;
  content?: React.ReactNode;
  data?: any;
  config?: any;
  order: number;
  visible?: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'analysis' | 'summary' | 'detailed';
  type: 'teacher' | 'course' | 'class' | 'department' | 'system';
  sections: ReportSection[];
  layout: 'single-column' | 'two-column' | 'three-column' | 'custom';
  style: {
    theme: 'default' | 'professional' | 'modern' | 'minimal';
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    fontSize?: string;
    headerSize?: string;
    pageSize?: 'A4' | 'A3' | 'Letter';
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
    author: string;
    tags: string[];
  };
}

interface ReportTemplateProps {
  template: ReportTemplate;
  data?: any;
  preview?: boolean;
  onEdit?: (section: ReportSection) => void;
  className?: string;
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({
  template,
  data,
  preview = false,
  onEdit,
  className = '',
}) => {
  const { sections, layout, style } = template;

  const getLayoutClasses = () => {
    switch (layout) {
      case 'two-column':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'three-column':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      case 'custom':
        return 'grid grid-cols-12 gap-4';
      default:
        return 'space-y-6';
    }
  };

  const getSectionSpan = (section: ReportSection) => {
    if (layout === 'custom' && section.config?.span) {
      return `col-span-${section.config.span}`;
    }
    return '';
  };

  const renderSection = (section: ReportSection) => {
    if (!section.visible) return null;

    const sectionClass = `bg-white rounded-lg shadow p-6 ${getSectionSpan(section)}`;

    switch (section.type) {
      case 'header':
        return (
          <div key={section.id} className={sectionClass}>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {section.title || template.name}
              </h1>
              {section.content && (
                <div className="text-gray-600 mt-2">{section.content}</div>
              )}
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  生成时间: {new Date().toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  生成者: {template.metadata.author}
                </div>
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div key={section.id} className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
              {section.title || '数据概览'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.data?.metrics?.map((metric: any, index: number) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
                  {metric.change && (
                    <div className={`text-xs mt-2 ${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'chart':
        return (
          <div key={section.id} className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              {section.content || (
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">图表区域</p>
                  <p className="text-sm text-gray-400 mt-1">配置: {section.config?.type || '未指定'}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={section.id} className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="overflow-x-auto">
              {section.content || (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">表格区域</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={section.id} className={sectionClass}>
            {section.title && (
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {section.title}
              </h2>
            )}
            <div className="prose max-w-none">
              {section.content || (
                <div className="text-gray-600">
                  <p>这是文本内容区域。在这里可以放置详细的分析、说明或备注信息。</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'footer':
        return (
          <div key={section.id} className={`${sectionClass} border-t`}>
            <div className="text-center text-sm text-gray-500">
              <p>© 2024 AI教学评价系统 - {template.name}</p>
              <p className="mt-1">报告版本: {template.metadata.version}</p>
              <p>生成时间: {new Date().toLocaleString()}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`report-template ${className}`} style={{ fontFamily: style.fontFamily }}>
      {!preview && (
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{template.name}</h2>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {template.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {template.type}
            </span>
          </div>
        </div>
      )}

      <div className={getLayoutClasses()}>
        {sections
          .filter(section => section.visible !== false)
          .sort((a, b) => a.order - b.order)
          .map(section => renderSection(section))}
      </div>

      {preview && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>模板ID: {template.id}</span>
            <span>版本: {template.metadata.version}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Predefined report templates
export const predefinedTemplates: ReportTemplate[] = [
  {
    id: 'teacher-performance',
    name: '教师表现报告',
    description: '综合分析教师教学表现和评价数据',
    category: 'performance',
    type: 'teacher',
    sections: [
      {
        id: 'header',
        type: 'header',
        title: '教师教学表现分析报告',
        order: 0,
        visible: true,
      },
      {
        id: 'summary',
        type: 'summary',
        title: '关键指标概览',
        order: 1,
        visible: true,
        data: {
          metrics: [
            { label: '评价次数', value: 45, change: 12 },
            { label: '平均得分', value: '4.2', change: 0.1 },
            { label: '学生参与度', value: '87%', change: 5 },
            { label: '完成率', value: '92%', change: -2 }
          ]
        }
      },
      {
        id: 'trend-chart',
        type: 'chart',
        title: '表现趋势分析',
        order: 2,
        visible: true,
        config: { type: 'line', dataSource: 'teacher-trends' }
      },
      {
        id: 'details-table',
        type: 'table',
        title: '详细评价数据',
        order: 3,
        visible: true,
        config: { columns: ['课程', '评分', '学生数', '日期'] }
      },
      {
        id: 'footer',
        type: 'footer',
        order: 4,
        visible: true,
      }
    ],
    layout: 'single-column',
    style: {
      theme: 'professional',
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: 20, right: 20, bottom: 20, left: 20 }
    },
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      author: 'System',
      tags: ['teacher', 'performance', 'evaluation']
    }
  },
  {
    id: 'course-analysis',
    name: '课程分析报告',
    description: '深入分析课程教学效果和学生学习成果',
    category: 'analysis',
    type: 'course',
    sections: [
      {
        id: 'header',
        type: 'header',
        title: '课程教学效果分析报告',
        order: 0,
        visible: true,
      },
      {
        id: 'course-summary',
        type: 'summary',
        title: '课程指标总览',
        order: 1,
        visible: true,
        data: {
          metrics: [
            { label: '学生总数', value: 120, change: 8 },
            { label: '平均出勤率', value: '94%', change: 2 },
            { label: '作业完成率', value: '88%', change: 5 },
            { label: '考试通过率', value: '91%', change: -1 }
          ]
        }
      },
      {
        id: 'performance-chart',
        type: 'chart',
        title: '学习表现分布',
        order: 2,
        visible: true,
        config: { type: 'pie', dataSource: 'grade-distribution' }
      },
      {
        id: 'trend-analysis',
        type: 'chart',
        title: '学习进度趋势',
        order: 3,
        visible: true,
        config: { type: 'area', dataSource: 'progress-trends' }
      },
      {
        id: 'detailed-analysis',
        type: 'text',
        title: '分析说明',
        order: 4,
        visible: true,
        content: '基于本学期的教学数据，课程整体表现良好，学生参与度较高，建议继续保持当前教学策略。'
      },
      {
        id: 'footer',
        type: 'footer',
        order: 5,
        visible: true,
      }
    ],
    layout: 'two-column',
    style: {
      theme: 'modern',
      primaryColor: '#3b82f6',
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: 15, right: 15, bottom: 15, left: 15 }
    },
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      author: 'System',
      tags: ['course', 'analysis', 'performance']
    }
  },
  {
    id: 'system-overview',
    name: '系统概览报告',
    description: '全面展示教学评价系统运行状况和统计数据',
    category: 'summary',
    type: 'system',
    sections: [
      {
        id: 'header',
        type: 'header',
        title: '教学评价系统概览报告',
        order: 0,
        visible: true,
      },
      {
        id: 'system-metrics',
        type: 'summary',
        title: '系统关键指标',
        order: 1,
        visible: true,
        data: {
          metrics: [
            { label: '注册教师', value: 150, change: 15 },
            { label: '活跃课程', value: 280, change: 22 },
            { label: '总评价数', value: 3500, change: 450 },
            { label: '系统可用性', value: '99.8%', change: 0.1 }
          ]
        }
      },
      {
        id: 'department-comparison',
        type: 'chart',
        title: '部门表现对比',
        order: 2,
        visible: true,
        config: { type: 'bar', span: 8, dataSource: 'department-comparison' }
      },
      {
        id: 'top-performers',
        type: 'table',
        title: '优秀教师榜单',
        order: 3,
        visible: true,
        config: { type: 'ranking', span: 4, dataSource: 'top-teachers' }
      },
      {
        id: 'monthly-trends',
        type: 'chart',
        title: '月度发展趋势',
        order: 4,
        visible: true,
        config: { type: 'multi-line', span: 12, dataSource: 'monthly-trends' }
      },
      {
        id: 'footer',
        type: 'footer',
        order: 5,
        visible: true,
      }
    ],
    layout: 'custom',
    style: {
      theme: 'professional',
      primaryColor: '#1f2937',
      pageSize: 'A3',
      orientation: 'landscape',
      margins: { top: 25, right: 25, bottom: 25, left: 25 }
    },
    metadata: {
      version: '2.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      author: 'System Administrator',
      tags: ['system', 'overview', 'statistics', 'monthly']
    }
  }
];

export default ReportTemplate;