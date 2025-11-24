import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Teacher {
  id: string;
  username: string;
  name: string;
  email: string;
  department: string;
  title: string;
  phone?: string;
  specialization?: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin?: string;
  evaluationCount: number;
  averageScore?: number;
  createdAt: string;
  updatedAt: string;
}

interface TeachersResponse {
  teachers: Teacher[];
  total: number;
  page: number;
  pageSize: number;
}

export const Teachers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: teachersData, isLoading, error } = useQuery<TeachersResponse>({
    queryKey: ['teachers', currentPage, searchTerm, selectedDepartment],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedDepartment && { department: selectedDepartment }),
      });

      const response = await fetch(`/api/teachers?${params}`);
      if (!response.ok) {
        throw new Error('获取教师数据失败');
      }
      return response.json();
    },
  });

  const { data: departments } = useQuery<string[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await fetch('/api/teachers/departments');
      if (!response.ok) {
        throw new Error('获取部门数据失败');
      }
      return response.json();
    },
  });

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDelete = async (teacherId: string) => {
    if (!window.confirm('确定要删除这位教师吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // Refresh the data
      window.location.reload();
    } catch (error) {
      alert('删除教师失败，请重试');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white shadow rounded-lg mb-6 h-24"></div>
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">加载失败</h3>
            <div className="mt-2 text-sm text-red-700">
              无法加载教师数据，请刷新页面重试。
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
          <h1 className="text-2xl font-semibold text-gray-900">教师管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            管理教师信息和查看教学评价数据
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          添加教师
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索教师姓名、邮箱或工号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">所有部门</option>
                {departments?.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
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

      {/* Teachers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  教师信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部门
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  职称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  评价数据
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachersData?.teachers?.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {teacher.username} • {teacher.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{teacher.department}</div>
                    {teacher.specialization && (
                      <div className="text-xs text-gray-500">{teacher.specialization}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {teacher.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      teacher.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {teacher.status === 'active' ? '在职' : '离职'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>评价次数: {teacher.evaluationCount}</div>
                    {teacher.averageScore && (
                      <div>平均分: {teacher.averageScore.toFixed(1)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="查看详情"
                      >
                        <AcademicCapIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="编辑"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-900"
                        title="删除"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {teachersData && teachersData.total > pageSize && (
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
                onClick={() => setCurrentPage(Math.min(Math.ceil(teachersData.total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(teachersData.total / pageSize)}
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
                    {Math.min(currentPage * pageSize, teachersData.total)}
                  </span>{' '}
                  条，共 <span className="font-medium">{teachersData.total}</span> 条记录
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  {[...Array(Math.ceil(teachersData.total / pageSize))].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const isNearCurrent = Math.abs(page - currentPage) <= 1 || page === 1 || page === Math.ceil(teachersData.total / pageSize);

                    if (!isNearCurrent && page !== 1 && page !== Math.ceil(teachersData.total / pageSize)) {
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
                    onClick={() => setCurrentPage(Math.min(Math.ceil(teachersData.total / pageSize), currentPage + 1))}
                    disabled={currentPage >= Math.ceil(teachersData.total / pageSize)}
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