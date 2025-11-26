import { Hono } from 'hono'
import { ApiResponse } from '@/types'
import { DatabaseService } from '@/services/databaseService.ts'

const dashboard = new Hono()
const dbService = new DatabaseService()

// 获取仪表盘统计信息
dashboard.get('/stats', async (c) => {
  try {
    // 查询教师总数
    const teachersResult = await dbService.query('SELECT COUNT(*) as count FROM teachers')
    const totalTeachers = teachersResult[0]?.count || 0

    // 查询课程总数
    const coursesResult = await dbService.query('SELECT COUNT(*) as count FROM courses')
    const totalCourses = coursesResult[0]?.count || 0

    // 查询学生总数
    const studentsResult = await dbService.query('SELECT COUNT(*) as count FROM students')
    const totalStudents = studentsResult[0]?.count || 0

    // 查询评价结果总数（作为分析结果的近似值）
    const evaluationsResult = await dbService.query('SELECT COUNT(*) as count FROM evaluation_results')
    const totalAnalysisResults = evaluationsResult[0]?.count || 0

    // 查询平均评分（使用学生评价表）
    const avgScoreResult = await dbService.query('SELECT AVG(rating) as avg_score FROM student_evaluations WHERE rating IS NOT NULL')
    const averageScore = avgScoreResult[0]?.avg_score || 0

    // 查询最近活动（最近10条评价记录）
    const recentActivitiesResult = await dbService.query(`
      SELECT
        se.id,
        se.created_at,
        t.name as teacher_name,
        se.rating as overall_score
      FROM student_evaluations se
      LEFT JOIN teachers t ON se.teacher_id = t.teacher_code
      ORDER BY se.created_at DESC
      LIMIT 10
    `)

    const response: ApiResponse = {
      success: true,
      data: {
        totalTeachers: Number(totalTeachers),
        totalCourses: Number(totalCourses),
        totalStudents: Number(totalStudents),
        totalAnalysisResults: Number(totalAnalysisResults),
        averageScore: Number(averageScore).toFixed(2),
        dataCollectionStatus: {
          active: totalCourses > 0 ? 1 : 0,
          inactive: 0,
          error: 0,
        },
        recentActivities: recentActivitiesResult.map((activity: any) => ({
          id: activity.id,
          timestamp: activity.created_at,
          teacherName: activity.teacher_name || '未知教师',
          score: activity.overall_score,
          type: 'evaluation'
        })),
      },
      message: '仪表盘统计数据获取成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    console.error('❌ Dashboard统计数据查询失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取统计数据失败',
      error: 'STATS_QUERY_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取图表数据
dashboard.get('/charts/:type', async (c) => {
  const chartType = c.req.param('type')
  try {
    let data: any = []
    switch (chartType) {
      case 'scores-over-time': {
        const rows = await dbService.query(`
          SELECT date_trunc('day', created_at) AS day, AVG(rating) AS avg_score
          FROM student_evaluations
          WHERE created_at >= NOW() - INTERVAL '30 days'
          GROUP BY day
          ORDER BY day ASC
        `)
        data = rows.map((r: any) => ({ day: r.day, avgScore: Number(r.avg_score || 0) }))
        break
      }
      case 'pass-rate-by-course': {
        const rows = await dbService.query(`
          SELECT course_id, AVG(CASE WHEN score >= 60 THEN 1 ELSE 0 END) * 100 AS pass_rate
          FROM exam_scores
          WHERE exam_date >= NOW() - INTERVAL '90 days'
          GROUP BY course_id
          ORDER BY pass_rate DESC
        `)
        data = rows.map((r: any) => ({ courseId: r.course_id, passRate: Number(r.pass_rate || 0) }))
        break
      }
      default: {
        data = []
      }
    }

    const response: ApiResponse = {
      success: true,
      data,
      message: `${chartType}图表数据获取成功`,
      code: 200,
      timestamp: new Date().toISOString(),
    }
    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '图表数据获取失败',
      error: 'GET_CHART_FAILED',
      code: 500,
      timestamp: new Date().toISOString(),
    }
    return c.json(response, 500)
  }
})

// 获取趋势数据
dashboard.get('/trends', async (c) => {
  try {
    // 获取过去30天的评价趋势
    const trendsData = await dbService.query(`
      SELECT
        date_trunc('day', created_at) AS day,
        COUNT(*) as evaluation_count,
        AVG(rating) as avg_score
      FROM student_evaluations
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC
    `)

    const response: ApiResponse = {
      success: true,
      data: trendsData.map((trend: any) => ({
        date: trend.day,
        evaluations: Number(trend.evaluation_count),
        averageScore: Number(trend.avg_score || 0).toFixed(2)
      })),
      message: '趋势数据获取成功'
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '趋势数据获取失败',
      error: 'TRENDS_QUERY_FAILED'
    }

    return c.json(response, 500)
  }
})

// 获取绩效数据
dashboard.get('/performance', async (c) => {
  try {
    // 获取教师绩效数据
    const performanceData = await dbService.query(`
      SELECT
        t.name as teacher_name,
        t.teacher_code,
        COUNT(se.id) as evaluation_count,
        AVG(se.rating) as avg_score,
        MAX(se.rating) as max_score,
        MIN(se.rating) as min_score
      FROM teachers t
      LEFT JOIN student_evaluations se ON t.teacher_code = se.teacher_id
      GROUP BY t.id, t.name, t.teacher_code
      ORDER BY avg_score DESC NULLS LAST
      LIMIT 10
    `)

    const response: ApiResponse = {
      success: true,
      data: performanceData.map((perf: any) => ({
        teacherName: perf.teacher_name,
        teacherId: perf.teacher_code,
        evaluationCount: Number(perf.evaluation_count),
        averageScore: Number(perf.avg_score || 0).toFixed(2),
        maxScore: Number(perf.max_score || 0),
        minScore: Number(perf.min_score || 0)
      })),
      message: '绩效数据获取成功'
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '绩效数据获取失败',
      error: 'PERFORMANCE_QUERY_FAILED'
    }

    return c.json(response, 500)
  }
})

export { dashboard as dashboardRoutes }
