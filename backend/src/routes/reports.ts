import { Hono } from 'hono'
import { ApiResponse } from '@/types'
import { DatabaseService } from '@/services/databaseService.ts'

const reports = new Hono()
const dbService = new DatabaseService()

// 获取报表模板列表
reports.get('/templates', async (c) => {
    try {
        const templates = [
            {
                id: '1',
                name: '教师评价综合报表',
                description: '包含教师评价的各维度统计和趋势分析',
                category: 'teacher',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: '课程质量分析报表',
                description: '分析课程的整体质量和学生反馈',
                category: 'course',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: '学期总结报表',
                description: '学期内所有教学活动的总结分析',
                category: 'summary',
                createdAt: new Date().toISOString()
            }
        ]

        const response: ApiResponse = {
            success: true,
            data: { templates },
            message: '报表模板列表获取成功',
        }

        return c.json(response, 200)
    } catch (error: any) {
        console.error('❌ 获取报表模板失败:', error)

        const response: ApiResponse = {
            success: false,
            message: error.message || '获取报表模板失败',
            error: 'GET_TEMPLATES_FAILED',
        }

        return c.json(response, 500)
    }
})

// 获取已生成的报表列表
reports.get('/generated', async (c) => {
    try {
        // 查询评价记录作为示例报表
        const reportsResult = await dbService.query(`
      SELECT 
        er.id,
        er.created_at,
        t.name as teacher_name,
        er.overall_score,
        'teacher_evaluation' as type
      FROM evaluation_records er
      LEFT JOIN teachers t ON er.teacher_id = t.id::VARCHAR
      ORDER BY er.created_at DESC
      LIMIT 20
    `)

        const generatedReports = reportsResult.map((report: any) => ({
            id: report.id,
            name: `${report.teacher_name || '未知教师'} - 评价报表`,
            type: report.type,
            createdAt: report.created_at,
            status: 'completed',
            score: report.overall_score
        }))

        const response: ApiResponse = {
            success: true,
            data: { reports: generatedReports },
            message: '已生成报表列表获取成功',
        }

        return c.json(response, 200)
    } catch (error: any) {
        console.error('❌ 获取已生成报表失败:', error)

        const response: ApiResponse = {
            success: false,
            message: error.message || '获取已生成报表失败',
            error: 'GET_GENERATED_REPORTS_FAILED',
        }

        return c.json(response, 500)
    }
})

// 获取报表筛选选项
reports.get('/filters', async (c) => {
    try {
        // 获取所有教师列表
        const teachersResult = await dbService.query('SELECT id, name FROM teachers LIMIT 50')

        const filters = {
            teachers: teachersResult.map((t: any) => ({
                id: t.id,
                name: t.name
            })),
            dateRanges: [
                { id: 'week', name: '最近一周' },
                { id: 'month', name: '最近一月' },
                { id: 'semester', name: '本学期' },
                { id: 'year', name: '本学年' },
                { id: 'custom', name: '自定义' }
            ],
            reportTypes: [
                { id: 'teacher', name: '教师评价' },
                { id: 'course', name: '课程质量' },
                { id: 'summary', name: '综合总结' }
            ]
        }

        const response: ApiResponse = {
            success: true,
            data: filters,
            message: '报表筛选选项获取成功',
        }

        return c.json(response, 200)
    } catch (error: any) {
        console.error('❌ 获取报表筛选选项失败:', error)

        const response: ApiResponse = {
            success: false,
            message: error.message || '获取报表筛选选项失败',
            error: 'GET_FILTERS_FAILED',
        }

        return c.json(response, 500)
    }
})

// 生成新报表
reports.post('/generate', async (c) => {
    try {
        const body = await c.req.json()

        const response: ApiResponse = {
            success: true,
            data: {
                id: crypto.randomUUID(),
                status: 'processing',
                message: '报表生成任务已创建，正在处理中...'
            },
            message: '报表生成任务创建成功',
        }

        return c.json(response, 201)
    } catch (error: any) {
        console.error('❌ 生成报表失败:', error)

        const response: ApiResponse = {
            success: false,
            message: error.message || '生成报表失败',
            error: 'GENERATE_REPORT_FAILED',
        }

        return c.json(response, 500)
    }
})

export { reports as reportsRoutes }
// 报表下载
reports.get('/download/:reportId', async (c) => {
  try {
    const reportId = c.req.param('reportId')
    const rows = await dbService.query(`
      SELECT er.id, er.created_at, t.name as teacher_name, er.overall_score
      FROM evaluation_records er
      LEFT JOIN teachers t ON er.teacher_id = t.id::VARCHAR
      WHERE er.id = $1
    `, [reportId])

    if (!rows.length) {
      const response: ApiResponse = {
        success: false,
        message: '报表不存在',
        error: 'REPORT_NOT_FOUND',
      }
      return c.json(response, 404)
    }

    const r: any = rows[0]
    const payload = {
      id: r.id,
      teacher: r.teacher_name || '未知教师',
      score: r.overall_score,
      createdAt: r.created_at,
    }

    const response: ApiResponse = {
      success: true,
      data: payload,
      message: '报表下载数据生成成功',
    }
    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '报表下载失败',
      error: 'DOWNLOAD_REPORT_FAILED',
    }
    return c.json(response, 500)
  }
})
