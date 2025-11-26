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
                type: 'teacher',
                format: 'excel',
                category: 'performance',
                parameters: [
                    {
                        key: 'timeRange',
                        label: '时间范围',
                        type: 'select',
                        options: ['最近一周', '最近一月', '本学期', '本学年'],
                        required: true
                    },
                    {
                        key: 'departments',
                        label: '部门筛选',
                        type: 'multiselect',
                        options: ['信息工程学院', '计算机学院', '理学院', '外语学院'],
                        required: false
                    }
                ]
            },
            {
                id: '2',
                name: '课程质量分析报表',
                description: '分析课程的整体质量和学生反馈',
                type: 'course',
                format: 'pdf',
                category: 'analysis',
                parameters: [
                    {
                        key: 'startDate',
                        label: '开始日期',
                        type: 'date',
                        required: true
                    },
                    {
                        key: 'endDate',
                        label: '结束日期',
                        type: 'date',
                        required: true
                    }
                ]
            },
            {
                id: '3',
                name: '学期总结报表',
                description: '学期内所有教学活动的总结分析',
                type: 'system',
                format: 'word',
                category: 'summary',
                parameters: [
                    {
                        key: 'semester',
                        label: '学期',
                        type: 'select',
                        options: ['春季学期', '秋季学期'],
                        required: true
                    }
                ]
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
        // 查询学生评价记录作为示例报表
        const reportsResult = await dbService.query(`
      SELECT
        se.id,
        se.created_at,
        t.name as teacher_name,
        se.rating as overall_score,
        'teacher_evaluation' as type
      FROM student_evaluations se
      LEFT JOIN teachers t ON se.teacher_id = t.teacher_code
      ORDER BY se.created_at DESC
      LIMIT 20
    `)

        const generatedReports = reportsResult.map((report: any) => ({
            id: report.id,
            name: `${report.teacher_name || '未知教师'} - 评价报表`,
            templateId: '1',
            templateName: '教师评价综合报表',
            title: `${report.teacher_name || '未知教师'} - 评价报表`,
            parameters: {},
            type: report.type,
            format: 'excel',
            status: 'completed',
            score: report.overall_score,
            fileSize: Math.floor(Math.random() * 1024 * 1024), // 随机文件大小
            downloadUrl: `/api/reports/download/${report.id}`,
            generatedBy: '系统管理员',
            generatedAt: report.created_at,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天后过期
        }))

        const response: ApiResponse = {
            success: true,
            data: generatedReports,
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
      SELECT se.id, se.created_at, t.name as teacher_name, se.rating as overall_score
      FROM student_evaluations se
      LEFT JOIN teachers t ON se.teacher_id = t.teacher_code
      WHERE se.id = $1
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
