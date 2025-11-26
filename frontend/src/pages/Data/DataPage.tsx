import React from 'react';

export function DataPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">数据管理</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">数据集成管理</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 数据源管理 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">职教云数据源</h3>
            <p className="text-sm text-gray-600 mb-3">
              管理职教云平台的数据采集配置和API对接
            </p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              配置数据源
            </button>
          </div>

          {/* 采集监控 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">数据采集监控</h3>
            <p className="text-sm text-gray-600 mb-3">
              实时监控数据采集状态和质量
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>采集状态</span>
                <span className="text-green-600">运行中</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>数据完整率</span>
                <span className="text-blue-600">98.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>最后更新</span>
                <span className="text-gray-500">2分钟前</span>
              </div>
            </div>
          </div>

          {/* 数据质量管理 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">数据质量</h3>
            <p className="text-sm text-gray-600 mb-3">
              数据清洗、验证和质量控制
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>数据清洗规则</span>
                <span className="text-green-600">已启用</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>数据验证</span>
                <span className="text-green-600">通过</span>
              </div>
              <button className="w-full border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50">
                查看详情
              </button>
            </div>
          </div>
        </div>

        {/* 采集历史 */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">采集历史</h3>
          <div className="border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    采集时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数据类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    记录数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2025-01-25 10:30:00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    教师数据
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    156
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      成功
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">查看</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2025-01-25 09:15:00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    课程数据
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    48
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      成功
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">查看</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}