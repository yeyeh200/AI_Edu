import { Hono } from 'hono'
import { ApiResponse } from '@/types'

const dashboard = new Hono()

// 获取仪表盘统计信息
dashboard.get('/stats', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: {
      totalTeachers: 0,
      totalCourses: 0,
      totalStudents: 0,
      totalAnalysisResults: 0,
      averageScore: 0,
      dataCollectionStatus: {
        active: 0,
        inactive: 0,
        error: 0,
      },
      recentActivities: [],
    },
    message: '仪表盘统计数据获取成功',
  }

  return c.json(response, 200)
})

// 获取图表数据
dashboard.get('/charts/:type', async (c) => {
  const chartType = c.req.param('type')

  const response: ApiResponse = {
    success: true,
    data: [],
    message: `${chartType}图表数据获取成功`,
  }

  return c.json(response, 200)
})

export { dashboard as dashboardRoutes }