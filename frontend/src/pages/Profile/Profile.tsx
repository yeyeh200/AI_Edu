import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UserIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';

const profileSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().optional(),
  department: z.string().min(1, '部门不能为空'),
  title: z.string().min(1, '职称不能为空'),
  specialization: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '请输入当前密码'),
  newPassword: z.string().min(6, '新密码至少6位'),
  confirmPassword: z.string().min(1, '请确认新密码'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      title: user?.title || '',
      specialization: user?.specialization || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('更新个人信息失败');
      }

      return response.json();
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      alert('个人信息已更新');
    },
    onError: (error) => {
      alert('更新失败: ' + error.message);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('更新密码失败');
      }

      return response.json();
    },
    onSuccess: () => {
      alert('密码已更新');
      resetPassword();
    },
    onError: (error) => {
      alert('更新密码失败: ' + error.message);
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    updatePasswordMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">个人资料</h1>
        <p className="mt-1 text-sm text-gray-600">
          管理您的个人信息和账户设置
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Profile Header */}
        <div className="bg-primary-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-primary-300" />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg hover:bg-gray-50"
                >
                  <CameraIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-primary-200 capitalize">{user?.role}</p>
              {user?.department && (
                <p className="text-primary-200">{user?.department}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              基本信息
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              修改密码
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名
                  </label>
                  <div className="relative">
                    <input
                      {...registerProfile('name')}
                      type="text"
                      className={`block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        profileErrors.name ? 'border-red-300' : ''
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <div className="relative">
                    <input
                      {...registerProfile('email')}
                      type="email"
                      className={`block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        profileErrors.email ? 'border-red-300' : ''
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    电话
                  </label>
                  <div className="relative">
                    <input
                      {...registerProfile('phone')}
                      type="tel"
                      className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    部门
                  </label>
                  <div className="relative">
                    <input
                      {...registerProfile('department')}
                      type="text"
                      className={`block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        profileErrors.department ? 'border-red-300' : ''
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {profileErrors.department && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.department.message}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    职称
                  </label>
                  <div className="relative">
                    <input
                      {...registerProfile('title')}
                      type="text"
                      className={`block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        profileErrors.title ? 'border-red-300' : ''
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {profileErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.title.message}</p>
                  )}
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    专业方向
                  </label>
                  <input
                    {...registerProfile('specialization')}
                    type="text"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="例如：软件工程、人工智能等"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="btn-primary"
                >
                  {updateProfileMutation.isPending ? '保存中...' : '保存更改'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
              <div className="max-w-md">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    当前密码
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('currentPassword')}
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        passwordErrors.currentPassword ? 'border-red-300' : ''
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新密码
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('newPassword')}
                      type={showNewPassword ? 'text' : 'password'}
                      className={`block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        passwordErrors.newPassword ? 'border-red-300' : ''
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    确认新密码
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        passwordErrors.confirmPassword ? 'border-red-300' : ''
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="btn-primary"
                >
                  {updatePasswordMutation.isPending ? '更新中...' : '更新密码'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">账户信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">用户名：</span>
            <span className="text-gray-900 ml-2">{user?.username}</span>
          </div>
          <div>
            <span className="text-gray-500">角色：</span>
            <span className="text-gray-900 ml-2 capitalize">{user?.role}</span>
          </div>
          <div>
            <span className="text-gray-500">注册时间：</span>
            <span className="text-gray-900 ml-2">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">最后更新：</span>
            <span className="text-gray-900 ml-2">
              {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};