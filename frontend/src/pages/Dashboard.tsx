import { useEffect, useState } from 'react'
import { apiClient } from '@/utils/apiClient'

interface DashboardStats {
  totalTeachers: number
  totalCourses: number
  totalStudents: number
  totalAnalysisResults: number
  averageScore: string
  dataCollectionStatus: {
    active: number
    inactive: number
    error: number
  }
  recentActivities: Array<{
    id: string
    timestamp: string
    teacherName: string
    score: number
    type: string
  }>
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/dashboard/stats')
        if (response.data.success) {
          setStats(response.data.data)
        } else {
          setError(response.data.message || '获取统计数据失败')
        }
      } catch (err: any) {
        console.error('获取Dashboard数据失败:', err)
        setError(err.message || '获取统计数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">教师总数</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalTeachers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">课程总数</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalCourses || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">学生总数</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">评价记录</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalAnalysisResults || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">系统概览</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">平均评分</span>
              <span className="text-xl font-bold text-blue-600">{stats?.averageScore || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">数据采集状态</span>
              <span className="text-green-600 font-medium">
                {stats?.dataCollectionStatus.active || 0} 个活跃
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h2>
          {stats?.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.teacherName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {activity.score?.toFixed(1) || 'N/A'}分
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">暂无最近活动</p>
          )}
        </div>
      </div>
    </div>
  )
}