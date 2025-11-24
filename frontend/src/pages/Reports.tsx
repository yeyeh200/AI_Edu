import { useEffect, useState } from 'react'
import { apiClient } from '@/utils/apiClient'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  createdAt: string
}

interface GeneratedReport {
  id: string
  name: string
  type: string
  createdAt: string
  status: string
  score?: number
}

export function Reports() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'templates' | 'generated'>('templates')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 获取报表模板
        const templatesResponse = await apiClient.get('/reports/templates')
        console.log('📋 Templates Response:', templatesResponse.data)

        if (templatesResponse.data.success) {
          const templatesData = templatesResponse.data.data?.templates
          if (Array.isArray(templatesData)) {
            setTemplates(templatesData)
          } else {
            console.warn('Templates data is not an array:', templatesData)
            setTemplates([])
          }
        }

        // 获取已生成的报表
        const generatedResponse = await apiClient.get('/reports/generated')
        console.log('📊 Generated Reports Response:', generatedResponse.data)

        if (generatedResponse.data.success) {
          const reportsData = generatedResponse.data.data?.reports
          if (Array.isArray(reportsData)) {
            setGeneratedReports(reportsData)
          } else {
            console.warn('Reports data is not an array:', reportsData)
            setGeneratedReports([])
          }
        }
      } catch (err: any) {
        console.error('❌ 获取Reports数据失败:', err)
        setError(err.message || '获取报表数据失败')
        // 确保即使出错也设置为空数组
        setTemplates([])
        setGeneratedReports([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">报表中心</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">报表中心</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">报表中心</h1>

      {/* Tab切换 */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'templates'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            报表模板 ({Array.isArray(templates) ? templates.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('generated')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'generated'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            已生成报表 ({Array.isArray(generatedReports) ? generatedReports.length : 0})
          </button>
        </nav>
      </div>

      {/* 报表模板列表 */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(templates) && templates.length > 0 ? (
            templates.map((template) => (
              <div key={template.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {template.category}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    使用模板
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              暂无报表模板
            </div>
          )}
        </div>
      )}

      {/* 已生成报表列表 */}
      {activeTab === 'generated' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  报表名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  生成时间
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
              {Array.isArray(generatedReports) && generatedReports.length > 0 ? (
                generatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{report.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">查看</button>
                      <button className="text-gray-600 hover:text-gray-900">下载</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    暂无已生成的报表
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}