import { Hono } from 'hono'
import { ApiResponse } from '@/types'
import { DatabaseService } from '@/services/databaseService.ts'

const evaluations = new Hono()
const dbService = new DatabaseService()

// 获取评价列表
evaluations.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    // 查询评价列表
    const evaluationsResult = await dbService.query(`
      SELECT
        se.id,
        se.student_id,
        se.teacher_id,
        se.rating as score,
        se.comment as feedback,
        se.created_at,
        s.name as student_name,
        t.name as teacher_name
      FROM student_evaluations se
      LEFT JOIN students s ON se.student_id = s.student_id
      LEFT JOIN teachers t ON se.teacher_id = t.teacher_code
      ORDER BY se.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    // 查询总数
    const countResult = await dbService.query('SELECT COUNT(*) as total FROM student_evaluations')
    const total = countResult[0]?.total || 0

    const response: ApiResponse = {
      success: true,
      data: {
        evaluations: evaluationsResult.map((evaluation: any) => ({
          id: evaluation.id,
          studentId: evaluation.student_id,
          studentName: evaluation.student_name || '未知学生',
          teacherId: evaluation.teacher_id,
          teacherName: evaluation.teacher_name || '未知教师',
          score: Number(evaluation.score),
          feedback: evaluation.feedback,
          createdAt: evaluation.created_at
        })),
        pagination: {
          page,
          limit,
          total: Number(total),
          totalPages: Math.ceil(Number(total) / limit)
        }
      },
      message: '评价列表获取成功'
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '评价列表获取失败',
      error: 'EVALUATIONS_QUERY_FAILED'
    }

    return c.json(response, 500)
  }
})

// 获取单个评价详情
evaluations.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const evaluationResult = await dbService.query(`
      SELECT
        se.id,
        se.student_id,
        se.teacher_id,
        se.rating as score,
        se.comment as feedback,
        se.created_at,
        s.name as student_name,
        t.name as teacher_name
      FROM student_evaluations se
      LEFT JOIN students s ON se.student_id = s.student_id
      LEFT JOIN teachers t ON se.teacher_id = t.teacher_code
      WHERE se.id = ${id}
    `)

    if (evaluationResult.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: '评价不存在',
        error: 'EVALUATION_NOT_FOUND'
      }
      return c.json(response, 404)
    }

    const evaluation = evaluationResult[0]

    const response: ApiResponse = {
      success: true,
      data: {
        id: evaluation.id,
        studentId: evaluation.student_id,
        studentName: evaluation.student_name || '未知学生',
        teacherId: evaluation.teacher_id,
        teacherName: evaluation.teacher_name || '未知教师',
        score: Number(evaluation.score),
        feedback: evaluation.feedback,
        createdAt: evaluation.created_at
      },
      message: '评价详情获取成功'
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '评价详情获取失败',
      error: 'EVALUATION_QUERY_FAILED'
    }

    return c.json(response, 500)
  }
})

export { evaluations as evaluationsRoutes }