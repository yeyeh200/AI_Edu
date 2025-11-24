import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ChartBarIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Evaluation {
  id: string;
  title: string;
  description?: string;
  teacher: {
    id: string;
    name: string;
    username: string;
  };
  course: {
    id: string;
    name: string;
    code: string;
  };
  class: {
    id: string;
    name: string;
    code: string;
  };
  evaluator: {
    id: string;
    name: string;
    type: 'student' | 'peer' | 'self' | 'admin';
  };
  type: 'formative' | 'summative' | 'peer' | 'self';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  responseCount: number;
  totalParticipants: number;
  averageScore?: number;
  aiAnalysis?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    confidence: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface EvaluationsResponse {
  evaluations: Evaluation[];
  total: number;
  page: number;
  pageSize: number;
}

export const Evaluations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: evaluationsData, isLoading, error } = useQuery<EvaluationsResponse>({
    queryKey: ['evaluations', currentPage, searchTerm, selectedType, selectedStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedType && { type: selectedType }),
        ...(selectedStatus && { status: selectedStatus }),
      });

      const response = await fetch(`/api/evaluations?${params}`);
      if (!response.ok) {
        throw new Error('获取评价数据失败');
      }
      return response.json();
    },
  });

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '草稿';
      case 'active':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'formative':
        return 'bg-purple-100 text-purple-800';
      case 'summative':
        return 'bg-orange-100 text-orange-800';
      case 'peer':
        return 'bg-blue-100 text-blue-800';
      case 'self':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'formative':
        return '形成性评价';
      case 'summative':
        return '总结性评价';
      case 'peer':
        return '同行评价';
      case 'self':
        return '自我评价';
      default:
        return '未知';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white shadow rounded-lg mb-6 h-24"></div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">加载失败</h3>
            <div className="mt-2 text-sm text-red-700">
              无法加载评价数据，请刷新页面重试。
            </div>
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
          <h1 className="text-2xl font-semibold text-gray-900">评价分析</h1>
          <p className="mt-1 text-sm text-gray-600">
            查看和管理教学评价活动及AI分析结果
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          创建评价
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-500">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    评价总数
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {evaluationsData?.total || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-green-500">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    进行中评价
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {evaluationsData?.evaluations?.filter(e => e.status === 'active').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-purple-500">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    已完成评价
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {evaluationsData?.evaluations?.filter(e => e.status === 'completed').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-orange-500">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    总参与人数
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {evaluationsData?.evaluations?.reduce((sum, evaluation) => sum + evaluation.totalParticipants, 0) || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索评价标题、教师或课程..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">所有类型</option>
                <option value="formative">形成性评价</option>
                <option value="summative">总结性评价</option>
                <option value="peer">同行评价</option>
                <option value="self">自我评价</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">所有状态</option>
                <option value="draft">草稿</option>
                <option value="active">进行中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-secondary"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              搜索
            </button>
          </div>
        </form>
      </div>

      {/* Evaluations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  评价信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  教师/课程
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型/状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  进度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI分析
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {evaluationsData?.evaluations?.map((evaluation) => {
                const progress = evaluation.totalParticipants > 0
                  ? (evaluation.responseCount / evaluation.totalParticipants) * 100
                  : 0;

                return (
                  <tr key={evaluation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {evaluation.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(evaluation.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        {evaluation.description && (
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {evaluation.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {evaluation.teacher.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {evaluation.course.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {evaluation.class.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(evaluation.type)}`}>
                          {getTypeText(evaluation.type)}
                        </span>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(evaluation.status)}`}>
                            {getStatusText(evaluation.status)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {evaluation.responseCount}/{evaluation.totalParticipants}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${getProgressColor(progress)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {evaluation.averageScore && (
                        <div className="text-xs text-gray-500 mt-1">
                          平均分: {evaluation.averageScore.toFixed(1)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {evaluation.aiAnalysis ? (
                        <div>
                          <div className="text-sm text-green-600 font-medium">
                            已分析
                          </div>
                          <div className="text-xs text-gray-500">
                            置信度: {(evaluation.aiAnalysis.confidence * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-400 max-w-xs truncate mt-1">
                            {evaluation.aiAnalysis.summary}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">
                          待分析
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          title="查看详情"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="查看分析"
                        >
                          <ChartBarIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {evaluationsData && evaluationsData.total > pageSize && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(evaluationsData.total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(evaluationsData.total / pageSize)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, evaluationsData.total)}
                  </span>{' '}
                  条，共 <span className="font-medium">{evaluationsData.total}</span> 条记录
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  {[...Array(Math.ceil(evaluationsData.total / pageSize))].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const isNearCurrent = Math.abs(page - currentPage) <= 1 || page === 1 || page === Math.ceil(evaluationsData.total / pageSize);

                    if (!isNearCurrent && page !== 1 && page !== Math.ceil(evaluationsData.total / pageSize)) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          isCurrentPage
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(Math.ceil(evaluationsData.total / pageSize), currentPage + 1))}
                    disabled={currentPage >= Math.ceil(evaluationsData.total / pageSize)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    下一页
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};