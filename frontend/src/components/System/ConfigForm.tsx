import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// 配置项接口
interface ConfigItem {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  isPublic: boolean;
  isEditable: boolean;
  lastModified: string;
  modifiedBy: string;
}

// 配置分类接口
interface ConfigCategory {
  id: string;
  name: string;
  description: string;
}

// 表单数据接口
interface ConfigFormData {
  key: string;
  name: string;
  description: string;
  category: string;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  isPublic: boolean;
  isEditable: boolean;
}

// Props接口
interface ConfigFormProps {
  isOpen: boolean;
  onClose: () => void;
  config?: ConfigItem | null;
  categories: ConfigCategory[];
  onSubmit: (data: ConfigFormData) => Promise<void>;
  mode: 'create' | 'edit';
}

export function ConfigForm({
  isOpen,
  onClose,
  config,
  categories,
  onSubmit,
  mode
}: ConfigFormProps) {
  const [formData, setFormData] = useState<ConfigFormData>({
    key: '',
    name: '',
    description: '',
    category: 'system',
    value: '',
    dataType: 'string',
    isPublic: true,
    isEditable: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [jsonError, setJsonError] = useState<string>('');

  // 初始化表单数据
  useEffect(() => {
    if (config && mode === 'edit') {
      setFormData({
        key: config.key,
        name: config.name || config.description,
        description: config.description,
        category: config.category,
        value: config.value,
        dataType: config.dataType,
        isPublic: config.isPublic,
        isEditable: config.isEditable
      });
    } else {
      // 重置表单
      setFormData({
        key: '',
        name: '',
        description: '',
        category: categories[0]?.id || 'system',
        value: '',
        dataType: 'string',
        isPublic: true,
        isEditable: true
      });
    }
    setErrors({});
    setJsonError('');
  }, [config, mode, categories]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 必填字段验证
    if (!formData.key.trim()) {
      newErrors.key = '配置键不能为空';
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(formData.key)) {
      newErrors.key = '配置键格式不正确，应以字母开头，只能包含字母、数字和下划线';
    }

    if (!formData.name.trim()) {
      newErrors.name = '配置名称不能为空';
    }

    if (!formData.description.trim()) {
      newErrors.description = '配置描述不能为空';
    }

    // 值验证
    if (formData.value === undefined || formData.value === null || formData.value === '') {
      newErrors.value = '配置值不能为空';
    } else {
      // 根据数据类型验证值
      const valueValidation = validateValueByType(formData.value, formData.dataType);
      if (!valueValidation.valid) {
        newErrors.value = valueValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 根据数据类型验证值
  const validateValueByType = (value: any, dataType: string): { valid: boolean; error?: string } => {
    try {
      switch (dataType) {
        case 'string':
          if (typeof value !== 'string') {
            return { valid: false, error: '值必须是字符串类型' };
          }
          break;

        case 'number':
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return { valid: false, error: '值必须是有效的数字' };
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            return { valid: false, error: '值必须是布尔类型' };
          }
          break;

        case 'json':
        case 'array':
          if (typeof value === 'string') {
            JSON.parse(value);
          } else if (typeof value !== 'object' || value === null) {
            return { valid: false, error: '值必须是有效的JSON对象或数组' };
          }
          break;

        default:
          return { valid: false, error: '不支持的数据类型' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'JSON格式无效' };
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 处理不同数据类型的值
      let processedValue = formData.value;

      switch (formData.dataType) {
        case 'number':
          processedValue = Number(formData.value);
          break;
        case 'boolean':
          processedValue = Boolean(formData.value);
          break;
        case 'json':
        case 'array':
          if (typeof formData.value === 'string') {
            processedValue = JSON.parse(formData.value);
          }
          break;
      }

      const submitData = {
        ...formData,
        value: processedValue
      };

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      console.error('提交配置失败:', error);
      setErrors({ submit: error.message || '提交失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理值变化
  const handleValueChange = (value: any) => {
    setFormData(prev => ({ ...prev, value }));

    // 实时验证JSON格式
    if (formData.dataType === 'json' || formData.dataType === 'array') {
      try {
        if (typeof value === 'string') {
          JSON.parse(value);
        }
        setJsonError('');
      } catch (error) {
        setJsonError('JSON格式无效');
      }
    }
  };

  // 渲染值输入框
  const renderValueInput = () => {
    const { dataType, value } = formData;

    switch (dataType) {
      case 'string':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配置值
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.value ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入配置值"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配置值
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              step="any"
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.value ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入数字"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配置值
            </label>
            <select
              value={value.toString()}
              onChange={(e) => handleValueChange(e.target.value === 'true')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.value ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="true">是 (true)</option>
              <option value="false">否 (false)</option>
            </select>
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>
        );

      case 'json':
      case 'array':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配置值 {dataType === 'json' ? '(JSON对象)' : '(JSON数组)'}
            </label>
            <div className="relative">
              <textarea
                value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                onChange={(e) => handleValueChange(e.target.value)}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md font-mono text-sm focus:ring-primary-500 focus:border-primary-500 ${
                  errors.value || jsonError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={dataType === 'json'
                  ? '{\n  "key": "value"\n}'
                  : '[\n  "item1",\n  "item2"\n]'
                }
              />
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const formatted = JSON.stringify(
                        typeof value === 'string' ? JSON.parse(value) : value,
                        null,
                        2
                      );
                      handleValueChange(formatted);
                    } catch (error) {
                      // 忽略格式化错误
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  title="格式化JSON"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            {(errors.value || jsonError) && (
              <p className="mt-1 text-sm text-red-600">{errors.value || jsonError}</p>
            )}
            <div className="mt-2 flex items-start space-x-1">
              <InformationCircleIcon className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-xs text-gray-500">
                请输入有效的{dataType === 'json' ? 'JSON对象' : 'JSON数组'}格式
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配置值
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.value ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入配置值"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* 对话框 */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {mode === 'create' ? '新建配置' : '编辑配置'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 配置键 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  配置键 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                  disabled={mode === 'edit'} // 编辑时不能修改键
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''
                  } ${
                    errors.key ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="例如: system.name"
                />
                {errors.key && (
                  <p className="mt-1 text-sm text-red-600">{errors.key}</p>
                )}
              </div>

              {/* 配置名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  配置名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="例如: 系统名称"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* 配置描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  配置描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请描述该配置的用途"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* 配置分类 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  配置分类
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 数据类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  数据类型
                </label>
                <select
                  value={formData.dataType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dataType: e.target.value as any,
                    value: e.target.value === 'boolean' ? true : ''
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="string">字符串</option>
                  <option value="number">数字</option>
                  <option value="boolean">布尔值</option>
                  <option value="json">JSON对象</option>
                  <option value="array">JSON数组</option>
                </select>
              </div>

              {/* 配置值 */}
              {renderValueInput()}

              {/* 权限设置 */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                    公开配置（所有用户可见）
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isEditable"
                    checked={formData.isEditable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isEditable: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isEditable" className="ml-2 block text-sm text-gray-900">
                    允许编辑
                  </label>
                </div>
              </div>

              {/* 错误信息 */}
              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>处理中...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>{mode === 'create' ? '创建' : '保存'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}