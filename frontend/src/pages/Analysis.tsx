import { useState } from 'react'
import { aiAnalysisService, AnalysisResult } from '@/services/aiAnalysisService'

export function Analysis() {
  const [teacherId, setTeacherId] = useState('9')
  const [startDate, setStartDate] = useState('2025-01-01')
  const [endDate, setEndDate] = useState('2025-12-31')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await aiAnalysisService.analyzeTeacher({
        teacherId,
        timeWindow: {
          startDate,
          endDate,
          type: 'year',
        },
      })

      if (response.success && response.data) {
        setResult(response.data)
      } else {
        setError(response.message || '分析失败')
      }
    } catch (err: any) {
      setError(err.message || '分析请求失败')
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'text-green-600 bg-green-50'
      case 'good':
        return 'text-blue-600 bg-blue-50'
      case 'average':
        return 'text-yellow-600 bg-yellow-50'
      case 'poor':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'excellent':
        return '优秀'
      case 'good':
        return '良好'
      case 'average':
        return '中等'
      case 'poor':
        return '较差'
      default:
        return '未知'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI教师分析</h1>

      {/* Analysis Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">分析参数</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              教师ID
            </label>
            <input
              type="text"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入教师ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始日期
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束日期
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '分析中...' : '开始分析'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">分析概览</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">教师姓名</p>
                <p className="text-xl font-bold text-gray-900">{result.teacherInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">总体评级</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(result.overallLevel)}`}>
                  {getLevelText(result.overallLevel)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">学生总数</p>
                <p className="text-xl font-bold text-gray-900">{result.summary.totalStudents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">置信度</p>
                <p className="text-xl font-bold text-gray-900">{result.summary.confidenceLevel}%</p>
              </div>
            </div>
          </div>

          {/* Dimension Results */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">维度分析</h2>
            <div className="space-y-4">
              {result.dimensionResults.map((dim, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{dim.dimension}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        分数: {dim.score !== null ? dim.score.toFixed(2) : 'N/A'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(dim.level)}`}>
                        {getLevelText(dim.level)}
                      </span>
                    </div>
                  </div>
                  {dim.details.strengths.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-green-700">优势:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {dim.details.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dim.details.weaknesses.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-red-700">不足:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {dim.details.weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">综合洞察</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-700 mb-2">整体优势</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {result.insights.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-700 mb-2">改进建议</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {result.insights.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Metrics Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">详细指标</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      指标名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      数值
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      单位
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      数据源
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.metrics.map((metric, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {metric.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.value !== null ? metric.value.toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}