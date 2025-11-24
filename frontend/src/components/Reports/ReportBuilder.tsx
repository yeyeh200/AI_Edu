import React, { useState, useCallback } from 'react';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TableCellsIcon,
  ViewColumnsIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { ReportTemplate, ReportSection } from './ReportTemplate';

interface ReportBuilderProps {
  template: ReportTemplate;
  onTemplateChange: (template: ReportTemplate) => void;
  onPreview?: (template: ReportTemplate) => void;
  onSave?: (template: ReportTemplate) => void;
  className?: string;
}

interface SectionConfig {
  id: string;
  title: string;
  type: ReportSection['type'];
  config: any;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({
  template,
  onTemplateChange,
  onPreview,
  onSave,
  className = '',
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  const sectionTypes = [
    { id: 'header', name: '标题页', icon: DocumentTextIcon },
    { id: 'summary', name: '数据概览', icon: ViewColumnsIcon },
    { id: 'chart', name: '图表', icon: ChartBarIcon },
    { id: 'table', name: '表格', icon: TableCellsIcon },
    { id: 'text', name: '文本', icon: DocumentTextIcon },
    { id: 'footer', name: '页脚', icon: SwatchIcon },
  ];

  const layoutOptions = [
    { id: 'single-column', name: '单列布局', preview: 'grid-cols-1' },
    { id: 'two-column', name: '双列布局', preview: 'grid-cols-2' },
    { id: 'three-column', name: '三列布局', preview: 'grid-cols-3' },
    { id: 'custom', name: '自定义布局', preview: 'grid-cols-12' },
  ];

  const themeOptions = [
    { id: 'default', name: '默认主题', preview: 'bg-white border-gray-200' },
    { id: 'professional', name: '专业主题', preview: 'bg-blue-50 border-blue-200' },
    { id: 'modern', name: '现代主题', preview: 'bg-gray-50 border-gray-300' },
    { id: 'minimal', name: '极简主题', preview: 'bg-white border-gray-100' },
  ];

  const addSection = useCallback((type: ReportSection['type']) => {
    const newSection: ReportSection = {
      id: `section-${Date.now()}`,
      type,
      title: getSectionTitle(type),
      order: template.sections.length,
      visible: true,
      config: getDefaultSectionConfig(type),
    };

    const updatedTemplate = {
      ...template,
      sections: [...template.sections, newSection],
    };

    onTemplateChange(updatedTemplate);
  }, [template, onTemplateChange]);

  const updateSection = useCallback((sectionId: string, updates: Partial<ReportSection>) => {
    const updatedTemplate = {
      ...template,
      sections: template.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    };

    onTemplateChange(updatedTemplate);
  }, [template, onTemplateChange]);

  const deleteSection = useCallback((sectionId: string) => {
    const updatedTemplate = {
      ...template,
      sections: template.sections
        .filter(section => section.id !== sectionId)
        .map((section, index) => ({ ...section, order: index })),
    };

    onTemplateChange(updatedTemplate);
    if (editingSection === sectionId) {
      setEditingSection(null);
    }
  }, [template, onTemplateChange, editingSection]);

  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    const sections = [...template.sections];
    const currentIndex = sections.findIndex(s => s.id === sectionId);

    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < sections.length - 1)
    ) {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];

      const updatedTemplate = {
        ...template,
        sections: sections.map((section, index) => ({ ...section, order: index })),
      };

      onTemplateChange(updatedTemplate);
    }
  }, [template, onTemplateChange]);

  const updateTemplateStyle = useCallback((styleUpdates: Partial<ReportTemplate['style']>) => {
    const updatedTemplate = {
      ...template,
      style: { ...template.style, ...styleUpdates },
    };

    onTemplateChange(updatedTemplate);
  }, [template, onTemplateChange]);

  const handleDragStart = useCallback((sectionId: string) => {
    setDraggedSection(sectionId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();

    if (!draggedSection || draggedSection === targetSectionId) return;

    const sections = [...template.sections];
    const draggedIndex = sections.findIndex(s => s.id === draggedSection);
    const targetIndex = sections.findIndex(s => s.id === targetSectionId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = sections.splice(draggedIndex, 1);
      sections.splice(targetIndex, 0, removed);

      const updatedTemplate = {
        ...template,
        sections: sections.map((section, index) => ({ ...section, order: index })),
      };

      onTemplateChange(updatedTemplate);
    }

    setDraggedSection(null);
  }, [draggedSection, template, onTemplateChange]);

  const getSectionTitle = (type: ReportSection['type']): string => {
    const titles = {
      header: '报告标题',
      summary: '数据概览',
      chart: '图表分析',
      table: '数据表格',
      text: '文本说明',
      footer: '页脚信息',
    };
    return titles[type] || '新章节';
  };

  const getDefaultSectionConfig = (type: ReportSection['type']) => {
    const configs = {
      header: { showDate: true, showAuthor: true },
      summary: { metrics: [], layout: 'grid' },
      chart: { type: 'line', dataSource: 'auto' },
      table: { columns: [], pageSize: 10 },
      text: { content: '', format: 'markdown' },
      footer: { showVersion: true, showTimestamp: true },
    };
    return configs[type] || {};
  };

  const renderSectionEditor = (section: ReportSection) => {
    if (editingSection !== section.id) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-2 border-blue-300">
        <h4 className="text-sm font-medium text-gray-900 mb-3">编辑章节: {section.title}</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">章节标题</label>
            <input
              type="text"
              value={section.title || ''}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {section.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">文本内容</label>
              <textarea
                value={section.config?.content || ''}
                onChange={(e) => updateSection(section.id, {
                  config: { ...section.config, content: e.target.value }
                })}
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}

          {section.type === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">图表类型</label>
              <select
                value={section.config?.type || 'line'}
                onChange={(e) => updateSection(section.id, {
                  config: { ...section.config, type: e.target.value }
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="line">折线图</option>
                <option value="bar">柱状图</option>
                <option value="pie">饼图</option>
                <option value="area">面积图</option>
              </select>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={section.visible !== false}
                onChange={(e) => updateSection(section.id, { visible: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">显示章节</span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  return <div>Report Builder</div>;
};

export default ReportBuilder;