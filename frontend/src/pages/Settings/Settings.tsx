import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SystemSettings {
  general: {
    systemName: string;
    systemVersion: string;
    adminEmail: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
  };
  evaluation: {
    defaultScoringScale: number;
    minParticipantsForAnalysis: number;
    autoAnalysisEnabled: boolean;
    analysisConfidenceThreshold: number;
    evaluationRetentionDays: number;
  };
  notifications: {
    emailEnabled: boolean;
    emailHost: string;
    emailPort: number;
    emailUsername: string;
    emailPassword: string;
    notificationThresholds: {
      lowScore: number;
      lowParticipation: number;
      negativeFeedback: number;
    };
  };
  ai: {
    analysisEnabled: boolean;
    modelProvider: string;
    apiKey: string;
    confidenceThreshold: number;
    maxAnalysisRetries: number;
  };
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<SystemSettings>({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('获取系统设置失败');
      }
      return response.json();
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<SystemSettings>) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('更新设置失败');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      setHasChanges(false);
      alert('设置已保存');
    },
    onError: (error) => {
      alert('保存设置失败: ' + error.message);
    },
  });

  const handleSettingChange = (category: string, field: string, value: any) => {
    setHasChanges(true);
    // This would typically update a form state
    // For now, we'll just mark that changes exist
  };

  const saveSettings = () => {
    if (hasChanges) {
      updateSettingsMutation.mutate(settings!);
    }
  };

  const tabs = [
    { id: 'general', name: '基本设置', icon: Cog6ToothIcon },
    { id: 'evaluation', name: '评价设置', icon: ChartBarIcon },
    { id: 'notifications', name: '通知设置', icon: BellIcon },
    { id: 'ai', name: 'AI设置', icon: ShieldCheckIcon },
    { id: 'users', name: '用户管理', icon: UserGroupIcon },
    { id: 'courses', name: '课程管理', icon: AcademicCapIcon },
    { id: 'departments', name: '部门管理', icon: BuildingOfficeIcon },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-semibold text-gray-900">系统设置</h1>
          <p className="mt-1 text-sm text-gray-600">
            配置系统参数和管理各项设置
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={saveSettings}
            disabled={updateSettingsMutation.isPending}
            className="btn-primary"
          >
            {updateSettingsMutation.isPending ? '保存中...' : '保存更改'}
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">基本设置</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    系统名称
                  </label>
                  <input
                    type="text"
                    defaultValue={settings?.general.systemName}
                    onChange={(e) => handleSettingChange('general', 'systemName', e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    管理员邮箱
                  </label>
                  <input
                    type="email"
                    defaultValue={settings?.general.adminEmail}
                    onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenance-mode"
                    defaultChecked={settings?.general.maintenanceMode}
                    onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="maintenance-mode" className="ml-2 block text-sm text-gray-900">
                    维护模式
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-registration"
                    defaultChecked={settings?.general.allowRegistration}
                    onChange={(e) => handleSettingChange('general', 'allowRegistration', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allow-registration" className="ml-2 block text-sm text-gray-900">
                    允许用户注册
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">评价设置</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    默认评分标准
                  </label>
                  <select
                    defaultValue={settings?.evaluation.defaultScoringScale}
                    onChange={(e) => handleSettingChange('evaluation', 'defaultScoringScale', parseInt(e.target.value))}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="5">5分制</option>
                    <option value="10">10分制</option>
                    <option value="100">100分制</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI分析最少参与人数
                  </label>
                  <input
                    type="number"
                    defaultValue={settings?.evaluation.minParticipantsForAnalysis}
                    onChange={(e) => handleSettingChange('evaluation', 'minParticipantsForAnalysis', parseInt(e.target.value))}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-analysis"
                    defaultChecked={settings?.evaluation.autoAnalysisEnabled}
                    onChange={(e) => handleSettingChange('evaluation', 'autoAnalysisEnabled', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-analysis" className="ml-2 block text-sm text-gray-900">
                    启用自动AI分析
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">通知设置</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email-enabled"
                    defaultChecked={settings?.notifications.emailEnabled}
                    onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email-enabled" className="ml-2 block text-sm text-gray-900">
                    启用邮件通知
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP服务器
                  </label>
                  <input
                    type="text"
                    defaultValue={settings?.notifications.emailHost}
                    onChange={(e) => handleSettingChange('notifications', 'emailHost', e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP端口
                  </label>
                  <input
                    type="number"
                    defaultValue={settings?.notifications.emailPort}
                    onChange={(e) => handleSettingChange('notifications', 'emailPort', parseInt(e.target.value))}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">AI分析设置</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ai-enabled"
                    defaultChecked={settings?.ai.analysisEnabled}
                    onChange={(e) => handleSettingChange('ai', 'analysisEnabled', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ai-enabled" className="ml-2 block text-sm text-gray-900">
                    启用AI分析功能
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI模型提供商
                  </label>
                  <select
                    defaultValue={settings?.ai.modelProvider}
                    onChange={(e) => handleSettingChange('ai', 'modelProvider', e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="azure">Azure OpenAI</option>
                    <option value="claude">Claude</option>
                    <option value="local">本地模型</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API密钥
                  </label>
                  <input
                    type="password"
                    defaultValue={settings?.ai.apiKey}
                    onChange={(e) => handleSettingChange('ai', 'apiKey', e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">用户管理</h3>
              <div className="text-center py-12">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">用户管理功能</h3>
                <p className="mt-1 text-sm text-gray-500">
                  此功能将允许管理员管理系统用户、角色和权限
                </p>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">课程管理</h3>
              <div className="text-center py-12">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">课程管理功能</h3>
                <p className="mt-1 text-sm text-gray-500">
                  此功能将允许管理员管理系统课程和相关信息
                </p>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">部门管理</h3>
              <div className="text-center py-12">
                <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">部门管理功能</h3>
                <p className="mt-1 text-sm text-gray-500">
                  此功能将允许管理员管理系统部门和机构结构
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};