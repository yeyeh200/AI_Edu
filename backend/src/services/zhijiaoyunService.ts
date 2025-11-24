/**
 * 职教云API适配器服务
 * 负责与职教云平台进行数据交互
 */

import { config } from '@/config/config'
import {
  ZhijiaoyunApiResponse,
  ZhijiaoyunUser,
  ZhijiaoyunCourse,
  ZhijiaoyunClass,
  ZhijiaoyunAttendance,
  ZhijiaoyunAssignment,
  ZhijiaoyunSubmission,
  ZhijiaoyunExamScore,
  ZhijiaoyunEvaluation,
  ZhijiaoyunTeachingActivity,
  ZhijiaoyunApiParams,
  UserQueryParams,
  CourseQueryParams,
  AttendanceQueryParams,
  ScoreQueryParams,
  ZhijiaoyunApiError,
  SyncStatus,
  ZhijiaoyunStatistics
} from '@/types/zhijiaoyun'

export class ZhijiaoyunService {
  private baseUrl: string
  private apiKey: string
  private apiSecret: string
  private timeout: number
  private retryAttempts: number
  private retryDelay: number

  constructor() {
    this.baseUrl = config.zhijiaoyun.baseUrl
    this.apiKey = config.zhijiaoyun.apiKey
    this.apiSecret = config.zhijiaoyun.apiSecret
    this.timeout = config.zhijiaoyun.timeout
    this.retryAttempts = config.zhijiaoyun.retryAttempts
    this.retryDelay = config.zhijiaoyun.retryDelay
  }

  /**
   * 生成API签名
   */
  private generateSignature(params: ZhijiaoyunApiParams, timestamp: number): string {
    // 按照职教云API规范生成签名
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')

    const signString = `${this.apiKey}${timestamp}${sortedParams}${this.apiSecret}`

    // 使用SHA-256生成签名
    const encoder = new TextEncoder()
    const data = encoder.encode(signString)
    const hash = crypto.subtle.digest('SHA-256', data)

    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toLowerCase()
  }

  /**
   * 发送HTTP请求
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    params: ZhijiaoyunApiParams = {}
  ): Promise<ZhijiaoyunApiResponse<T>> {
    const timestamp = Date.now()
    const signature = this.generateSignature(params, timestamp)

    const url = new URL(endpoint, this.baseUrl)

    // 添加认证参数
    const authParams = {
      apiKey: this.apiKey,
      timestamp,
      signature,
      ...params
    }

    if (method === 'GET') {
      Object.entries(authParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Evaluation-System/1.0.0'
      },
      signal: AbortSignal.timeout(this.timeout)
    }

    if (method === 'POST') {
      requestOptions.body = JSON.stringify(authParams)
    }

    let lastError: Error | null = null

    // 重试机制
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url.toString(), requestOptions)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result: ZhijiaoyunApiResponse<T> = await response.json()

        if (result.code !== 200) {
          throw new Error(`API Error ${result.code}: ${result.message}`)
        }

        return result
      } catch (error) {
        lastError = error as Error
        console.error(`职教云API请求失败 (尝试 ${attempt}/${this.retryAttempts}):`, error)

        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt))
        }
      }
    }

    throw lastError || new Error('API请求失败')
  }

  /**
   * 测试API连接
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request('/api/v1/system/ping')
      return true
    } catch (error) {
      console.error('职教云API连接测试失败:', error)
      return false
    }
  }

  /**
   * 获取用户列表
   */
  async getUsers(params: UserQueryParams = {}): Promise<{
    users: ZhijiaoyunUser[]
    total: number
    page: number
    pageSize: number
  }> {
    const response = await this.request<{
      list: ZhijiaoyunUser[]
      total: number
      page: number
      pageSize: number
    }>('/api/v1/users', 'GET', {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      keyword: params.keyword || '',
      role: params.role || '',
      departmentId: params.departmentId || '',
      status: params.status || ''
    })

    return {
      users: response.data.list,
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize
    }
  }

  /**
   * 获取单个用户信息
   */
  async getUser(userId: string): Promise<ZhijiaoyunUser | null> {
    try {
      const response = await this.request<ZhijiaoyunUser>(`/api/v1/users/${userId}`)
      return response.data
    } catch (error) {
      console.error(`获取用户信息失败 (${userId}):`, error)
      return null
    }
  }

  /**
   * 获取课程列表
   */
  async getCourses(params: CourseQueryParams = {}): Promise<{
    courses: ZhijiaoyunCourse[]
    total: number
    page: number
    pageSize: number
  }> {
    const response = await this.request<{
      list: ZhijiaoyunCourse[]
      total: number
      page: number
      pageSize: number
    }>('/api/v1/courses', 'GET', {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      keyword: params.keyword || '',
      teacherId: params.teacherId || '',
      departmentId: params.departmentId || '',
      semester: params.semester || '',
      academicYear: params.academicYear || '',
      status: params.status || ''
    })

    return {
      courses: response.data.list,
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize
    }
  }

  /**
   * 获取课程详情
   */
  async getCourse(courseId: string): Promise<ZhijiaoyunCourse | null> {
    try {
      const response = await this.request<ZhijiaoyunCourse>(`/api/v1/courses/${courseId}`)
      return response.data
    } catch (error) {
      console.error(`获取课程详情失败 (${courseId}):`, error)
      return null
    }
  }

  /**
   * 获取班级列表
   */
  async getClasses(courseId?: string): Promise<ZhijiaoyunClass[]> {
    const params: ZhijiaoyunApiParams = {}
    if (courseId) {
      params.courseId = courseId
    }

    const response = await this.request<ZhijiaoyunClass[]>('/api/v1/classes', 'GET', params)
    return response.data
  }

  /**
   * 获取出勤记录
   */
  async getAttendanceRecords(params: AttendanceQueryParams = {}): Promise<{
    records: ZhijiaoyunAttendance[]
    total: number
    page: number
    pageSize: number
  }> {
    const response = await this.request<{
      list: ZhijiaoyunAttendance[]
      total: number
      page: number
      pageSize: number
    }>('/api/v1/attendance', 'GET', {
      page: params.page || 1,
      pageSize: params.pageSize || 50,
      classId: params.classId || '',
      studentId: params.studentId || '',
      status: params.status || '',
      startDate: params.startDate || '',
      endDate: params.endDate || ''
    })

    return {
      records: response.data.list,
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize
    }
  }

  /**
   * 获取作业列表
   */
  async getAssignments(
    courseId?: string,
    params: ZhijiaoyunApiParams = {}
  ): Promise<ZhijiaoyunAssignment[]> {
    const requestParams: ZhijiaoyunApiParams = { ...params }
    if (courseId) {
      requestParams.courseId = courseId
    }

    const response = await this.request<ZhijiaoyunAssignment[]>('/api/v1/assignments', 'GET', requestParams)
    return response.data
  }

  /**
   * 获取作业提交记录
   */
  async getSubmissions(assignmentId: string): Promise<ZhijiaoyunSubmission[]> {
    const response = await this.request<ZhijiaoyunSubmission[]>(`/api/v1/assignments/${assignmentId}/submissions`)
    return response.data
  }

  /**
   * 获取考试成绩
   */
  async getExamScores(params: ScoreQueryParams = {}): Promise<{
    scores: ZhijiaoyunExamScore[]
    total: number
    page: number
    pageSize: number
  }> {
    const response = await this.request<{
      list: ZhijiaoyunExamScore[]
      total: number
      page: number
      pageSize: number
    }>('/api/v1/exam-scores', 'GET', {
      page: params.page || 1,
      pageSize: params.pageSize || 50,
      courseId: params.courseId || '',
      studentId: params.studentId || '',
      examType: params.examType || '',
      startDate: params.startDate || '',
      endDate: params.endDate || ''
    })

    return {
      scores: response.data.list,
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize
    }
  }

  /**
   * 获取学生评价数据
   */
  async getEvaluations(
    teacherId?: string,
    courseId?: string
  ): Promise<ZhijiaoyunEvaluation[]> {
    const params: ZhijiaoyunApiParams = {}
    if (teacherId) params.teacherId = teacherId
    if (courseId) params.courseId = courseId

    const response = await this.request<ZhijiaoyunEvaluation[]>('/api/v1/evaluations', 'GET', params)
    return response.data
  }

  /**
   * 获取教学活动记录
   */
  async getTeachingActivities(
    teacherId?: string,
    courseId?: string
  ): Promise<ZhijiaoyunTeachingActivity[]> {
    const params: ZhijiaoyunApiParams = {}
    if (teacherId) params.teacherId = teacherId
    if (courseId) params.courseId = courseId

    const response = await this.request<ZhijiaoyunTeachingActivity[]>('/api/v1/teaching-activities', 'GET', params)
    return response.data
  }

  /**
   * 获取统计数据
   */
  async getStatistics(): Promise<ZhijiaoyunStatistics> {
    const response = await this.request<ZhijiaoyunStatistics>('/api/v1/statistics')
    return response.data
  }

  /**
   * 数据同步
   */
  async syncData(syncType: 'full' | 'incremental' = 'incremental'): Promise<SyncStatus> {
    try {
      const response = await this.request<SyncStatus>('/api/v1/sync/data', 'POST', {
        syncType,
        lastSyncTime: syncType === 'incremental' ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() : undefined
      })

      return response.data
    } catch (error) {
      console.error('数据同步失败:', error)
      throw error
    }
  }

  /**
   * 批量获取教师数据（用于评价分析）
   */
  async getTeacherDataForEvaluation(teacherIds: string[]): Promise<{
    teachers: Array<{
      user: ZhijiaoyunUser
      courses: ZhijiaoyunCourse[]
      classes: ZhijiaoyunClass[]
      activities: ZhijiaoyunTeachingActivity[]
      evaluations: ZhijiaoyunEvaluation[]
      attendance: ZhijiaoyunAttendance[]
      scores: ZhijiaoyunExamScore[]
    }>
  }> {
    const results = []

    for (const teacherId of teacherIds) {
      try {
        const [user, courses, activities, evaluations, attendanceData, scoreData] = await Promise.all([
          this.getUser(teacherId),
          this.getCourses({ teacherId, pageSize: 100 }),
          this.getTeachingActivities(teacherId),
          this.getEvaluations(teacherId),
          this.getAttendanceRecords({ pageSize: 1000 }),
          this.getExamScores({ pageSize: 1000 })
        ])

        if (user) {
          results.push({
            user,
            courses: courses.courses,
            classes: [], // 可以根据需要获取班级数据
            activities,
            evaluations,
            attendance: attendanceData.records,
            scores: scoreData.scores
          })
        }
      } catch (error) {
        console.error(`获取教师数据失败 (${teacherId}):`, error)
      }
    }

    return { teachers: results }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    connection: boolean
    lastSyncTime?: string
    error?: string
  }> {
    try {
      const connection = await this.testConnection()
      const statistics = await this.getStatistics()

      return {
        status: connection ? 'healthy' : 'unhealthy',
        connection,
        lastSyncTime: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        connection: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }
}