import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.username, data.password);
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      setError(err.message || '登录失败，请检查用户名和密码');
    }
  };

  // Demo accounts for testing
  const demoAccounts = [
    { username: 'admin', password: 'admin123', role: '管理员', description: '系统管理员账户' },
    { username: 'teacher', password: 'teacher123', role: '教师', description: '教师账户' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">AI教学评价系统</h1>
          <p className="mt-2 text-sm text-gray-600">
            智能化教学质量分析与评估平台
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">登录失败</h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名
              </label>
              <div className="mt-1">
                <input
                  {...register('username')}
                  id="username"
                  type="text"
                  autoComplete="username"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入用户名"
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    登录中...
                  </div>
                ) : (
                  '登录'
                )}
              </button>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600 mb-3">
              <strong>演示账户：</strong>
            </div>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-md p-3 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {account.role}
                    </span>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {account.username}
                    </code>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {account.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    密码：<code className="bg-gray-200 px-1 rounded">{account.password}</code>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              💡 提示：可以直接点击上方账户信息快速登录
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="mt-4 space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  // Fill form and submit
                  const form = document.querySelector('form') as HTMLFormElement;
                  const usernameInput = form.querySelector('#username') as HTMLInputElement;
                  const passwordInput = form.querySelector('#password') as HTMLInputElement;

                  usernameInput.value = account.username;
                  passwordInput.value = account.password;

                  handleSubmit(onSubmit)();
                }}
                disabled={isLoading}
                className={`w-full text-left px-3 py-2 text-sm border rounded-md transition-colors ${
                  isLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                快速登录：{account.role} ({account.username})
              </button>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>AI教学评价系统 v1.0.0</p>
          <p className="mt-1">© 2024 智慧教育. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};