/**
 * 职教云API路由
 * 提供与职教云平台集成的API接口
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { ZhijiaoyunService } from '@/services/zhijiaoyunService'
import { authMiddleware, adminMiddleware } from '@/middleware/auth'
import { ApiResponse } from '@/types'

const zhijiaoyun = new Hono()
const zhijiaoyunService = new ZhijiaoyunService()

// 查询参数验证schemas
const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
})

const userQuerySchema = paginationSchema.extend({
  keyword: z.string().optional(),
  role: z.enum(['admin', 'teacher', 'student']).optional(),
  departmentId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
})

const courseQuerySchema = paginationSchema.extend({
  keyword: z.string().optional(),
  teacherId: z.string().optional(),
  departmentId: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
  status: z.enum(['active', 'inactive', 'completed']).optional(),
})

const attendanceQuerySchema = paginationSchema.extend({
  classId: z.string().optional(),
  studentId: z.string().optional(),
  status: z.enum(['present', 'absent', 'late', 'early_leave']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

const scoreQuerySchema = paginationSchema.extend({
  courseId: z.string().optional(),
  studentId: z.string().optional(),
  examType: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

const syncSchema = z.object({
  syncType: z.enum(['full', 'incremental']).default('incremental'),
})

// 获取职教云API连接状态
zhijiaoyun.get('/health', authMiddleware, async (c) => {
  try {
    const healthStatus = await zhijiaoyunService.healthCheck()

    const response: ApiResponse = {
      success: true,
      data: healthStatus,
      message: healthStatus.status === 'healthy' ? 'API连接正常' : 'API连接异常',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '健康检查失败',
      error: 'HEALTH_CHECK_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取用户列表
zhijiaoyun.get('/users', authMiddleware, zValidator('query', userQuerySchema), async (c) => {
  try {
    const params = c.req.valid('query')
    const result = await zhijiaoyunService.getUsers(params)

    const response: ApiResponse = {
      success: true,
      data: result,
      message: '获取用户列表成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取用户列表失败',
      error: 'GET_USERS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取单个用户信息
zhijiaoyun.get('/users/:userId', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId')
    const user = await zhijiaoyunService.getUser(userId)

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: '用户不存在',
        error: 'USER_NOT_FOUND',
      }
      return c.json(response, 404)
    }

    const response: ApiResponse = {
      success: true,
      data: user,
      message: '获取用户信息成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取用户信息失败',
      error: 'GET_USER_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取课程列表
zhijiaoyun.get('/courses', authMiddleware, zValidator('query', courseQuerySchema), async (c) => {
  try {
    const params = c.req.valid('query')
    const result = await zhijiaoyunService.getCourses(params)

    const response: ApiResponse = {
      success: true,
      data: result,
      message: '获取课程列表成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取课程列表失败',
      error: 'GET_COURSES_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取课程详情
zhijiaoyun.get('/courses/:courseId', authMiddleware, async (c) => {
  try {
    const courseId = c.req.param('courseId')
    const course = await zhijiaoyunService.getCourse(courseId)

    if (!course) {
      const response: ApiResponse = {
        success: false,
        message: '课程不存在',
        error: 'COURSE_NOT_FOUND',
      }
      return c.json(response, 404)
    }

    const response: ApiResponse = {
      success: true,
      data: course,
      message: '获取课程详情成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取课程详情失败',
      error: 'GET_COURSE_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取班级列表
zhijiaoyun.get('/classes', authMiddleware, async (c) => {
  try {
    const courseId = c.req.query('courseId')
    const classes = await zhijiaoyunService.getClasses(courseId)

    const response: ApiResponse = {
      success: true,
      data: { classes },
      message: '获取班级列表成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取班级列表失败',
      error: 'GET_CLASSES_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取出勤记录
zhijiaoyun.get('/attendance', authMiddleware, zValidator('query', attendanceQuerySchema), async (c) => {
  try {
    const params = c.req.valid('query')
    const result = await zhijiaoyunService.getAttendanceRecords(params)

    const response: ApiResponse = {
      success: true,
      data: result,
      message: '获取出勤记录成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取出勤记录失败',
      error: 'GET_ATTENDANCE_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取作业列表
zhijiaoyun.get('/assignments', authMiddleware, async (c) => {
  try {
    const courseId = c.req.query('courseId')
    const assignments = await zhijiaoyunService.getAssignments(courseId)

    const response: ApiResponse = {
      success: true,
      data: { assignments },
      message: '获取作业列表成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取作业列表失败',
      error: 'GET_ASSIGNMENTS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取作业提交记录
zhijiaoyun.get('/assignments/:assignmentId/submissions', authMiddleware, async (c) => {
  try {
    const assignmentId = c.req.param('assignmentId')
    const submissions = await zhijiaoyunService.getSubmissions(assignmentId)

    const response: ApiResponse = {
      success: true,
      data: { submissions },
      message: '获取作业提交记录成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取作业提交记录失败',
      error: 'GET_SUBMISSIONS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取考试成绩
zhijiaoyun.get('/exam-scores', authMiddleware, zValidator('query', scoreQuerySchema), async (c) => {
  try {
    const params = c.req.valid('query')
    const result = await zhijiaoyunService.getExamScores(params)

    const response: ApiResponse = {
      success: true,
      data: result,
      message: '获取考试成绩成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取考试成绩失败',
      error: 'GET_EXAM_SCORES_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取学生评价数据
zhijiaoyun.get('/evaluations', authMiddleware, async (c) => {
  try {
    const teacherId = c.req.query('teacherId')
    const courseId = c.req.query('courseId')
    const evaluations = await zhijiaoyunService.getEvaluations(teacherId, courseId)

    const response: ApiResponse = {
      success: true,
      data: { evaluations },
      message: '获取评价数据成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取评价数据失败',
      error: 'GET_EVALUATIONS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取教学活动记录
zhijiaoyun.get('/teaching-activities', authMiddleware, async (c) => {
  try {
    const teacherId = c.req.query('teacherId')
    const courseId = c.req.query('courseId')
    const activities = await zhijiaoyunService.getTeachingActivities(teacherId, courseId)

    const response: ApiResponse = {
      success: true,
      data: { activities },
      message: '获取教学活动成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取教学活动失败',
      error: 'GET_ACTIVITIES_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取统计数据
zhijiaoyun.get('/statistics', authMiddleware, async (c) => {
  try {
    const statistics = await zhijiaoyunService.getStatistics()

    const response: ApiResponse = {
      success: true,
      data: statistics,
      message: '获取统计数据成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取统计数据失败',
      error: 'GET_STATISTICS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 数据同步（仅管理员）
zhijiaoyun.post('/sync', adminMiddleware, zValidator('json', syncSchema), async (c) => {
  try {
    const { syncType } = c.req.valid('json')
    const syncStatus = await zhijiaoyunService.syncData(syncType)

    const response: ApiResponse = {
      success: true,
      data: syncStatus,
      message: '数据同步成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '数据同步失败',
      error: 'SYNC_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取教师评价数据（用于AI分析）
zhijiaoyun.post('/teacher-data', adminMiddleware, async (c) => {
  try {
    const { teacherIds } = await c.req.json()

    if (!Array.isArray(teacherIds) || teacherIds.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: '请提供有效的教师ID列表',
        error: 'INVALID_TEACHER_IDS',
      }
      return c.json(response, 400)
    }

    const teacherData = await zhijiaoyunService.getTeacherDataForEvaluation(teacherIds)

    const response: ApiResponse = {
      success: true,
      data: teacherData,
      message: '获取教师数据成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取教师数据失败',
      error: 'GET_TEACHER_DATA_FAILED',
    }

    return c.json(response, 500)
  }
})

export { zhijiaoyun as zhijiaoyunRoutes }