import { ZhijiaoyunApiParams, ZhijiaoyunUser, ZhijiaoyunCourse, ZhijiaoyunClass, ZhijiaoyunAttendance, ZhijiaoyunAssignment, ZhijiaoyunSubmission, ZhijiaoyunExamScore, ZhijiaoyunEvaluation, ZhijiaoyunTeachingActivity, ZhijiaoyunStatistics, SyncStatus, UserQueryParams, CourseQueryParams, AttendanceQueryParams, ScoreQueryParams } from '@/types/zhijiaoyun'

export class ZhijiaoyunMockProvider {
  /**
   * 测试API连接
   */
  async testConnection(): Promise<boolean> {
    return true
  }

  /**
   * 获取统计数据
   */
  async getStatistics(): Promise<ZhijiaoyunStatistics> {
    return {
      totalUsers: 1200,
      totalTeachers: 80,
      totalStudents: 1120,
      totalCourses: 180,
      totalClasses: 90,
      lastSyncTime: new Date().toISOString()
    } as any
  }

  /**
   * 获取用户列表
   */
  async getUsers(params: UserQueryParams = {}): Promise<{ users: ZhijiaoyunUser[]; total: number; page: number; pageSize: number; }> {
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const total = 200
    const users: ZhijiaoyunUser[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `${(page - 1) * pageSize + i + 1}`,
      username: `teacher_${(page - 1) * pageSize + i + 1}`,
      role: 'teacher',
      name: `教师${(page - 1) * pageSize + i + 1}`,
      email: `teacher${(page - 1) * pageSize + i + 1}@example.com`,
      status: 'active'
    } as any))
    return { users, total, page, pageSize }
  }

  /**
   * 获取单个用户信息
   */
  async getUser(userId: string): Promise<ZhijiaoyunUser | null> {
    return {
      id: userId,
      username: `teacher_${userId}`,
      role: 'teacher',
      name: `教师${userId}`,
      email: `teacher${userId}@example.com`,
      status: 'active'
    } as any
  }

  /**
   * 获取课程列表
   */
  async getCourses(params: CourseQueryParams = {}): Promise<{ courses: ZhijiaoyunCourse[]; total: number; page: number; pageSize: number; }> {
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const total = 300
    const courses: ZhijiaoyunCourse[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `${(page - 1) * pageSize + i + 1}`,
      name: `课程${(page - 1) * pageSize + i + 1}`,
      teacherId: params.teacherId || 't1',
      departmentId: 'd1',
      semester: params.semester || '2025-秋',
      academicYear: params.academicYear || '2025',
      status: 'active'
    } as any))
    return { courses, total, page, pageSize }
  }

  /**
   * 获取课程详情
   */
  async getCourse(courseId: string): Promise<ZhijiaoyunCourse | null> {
    return {
      id: courseId,
      name: `课程${courseId}`,
      teacherId: 't1',
      departmentId: 'd1',
      semester: '2025-秋',
      academicYear: '2025',
      status: 'active'
    } as any
  }

  /**
   * 获取班级列表
   */
  async getClasses(courseId?: string): Promise<ZhijiaoyunClass[]> {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      name: `班级${i + 1}`,
      courseId: courseId || '1',
      studentCount: 40
    } as any))
  }

  /**
   * 获取出勤记录
   */
  async getAttendanceRecords(params: AttendanceQueryParams = {}): Promise<{ records: ZhijiaoyunAttendance[]; total: number; page: number; pageSize: number; }> {
    const page = params.page || 1
    const pageSize = params.pageSize || 50
    const total = 1000
    const records: ZhijiaoyunAttendance[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `${(page - 1) * pageSize + i + 1}`,
      classId: params.classId || '1',
      studentId: `${i + 1}`,
      status: ['present', 'absent', 'late'][i % 3],
      date: new Date().toISOString()
    } as any))
    return { records, total, page, pageSize }
  }

  /**
   * 获取作业列表
   */
  async getAssignments(courseId?: string, params: ZhijiaoyunApiParams = {}): Promise<ZhijiaoyunAssignment[]> {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `作业${i + 1}`,
      courseId: courseId || '1',
      dueDate: new Date(Date.now() + i * 86400000).toISOString(),
      totalScore: 100
    } as any))
  }

  /**
   * 获取作业提交记录
   */
  async getSubmissions(assignmentId: string): Promise<ZhijiaoyunSubmission[]> {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `${assignmentId}-${i + 1}`,
      studentId: `${i + 1}`,
      score: Math.floor(60 + (i % 40)),
      submittedAt: new Date().toISOString()
    } as any))
  }

  /**
   * 获取考试成绩
   */
  async getExamScores(params: ScoreQueryParams = {}): Promise<{ scores: ZhijiaoyunExamScore[]; total: number; page: number; pageSize: number; }> {
    const page = params.page || 1
    const pageSize = params.pageSize || 50
    const total = 1000
    const scores: ZhijiaoyunExamScore[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `${(page - 1) * pageSize + i + 1}`,
      examId: 'midterm',
      examName: '期中考试',
      studentId: `${i + 1}`,
      courseId: params.courseId || '1',
      score: Math.floor(50 + (i % 50)),
      totalScore: 100,
      percentage: 0,
      examDate: new Date().toISOString()
    } as any))
    return { scores, total, page, pageSize }
  }

  /**
   * 获取学生评价数据
   */
  async getEvaluations(teacherId?: string, courseId?: string): Promise<ZhijiaoyunEvaluation[]> {
    return Array.from({ length: 30 }, (_, i) => ({
      id: `${i + 1}`,
      teacherId: teacherId || 't1',
      courseId: courseId || '1',
      overallScore: Math.floor(70 + (i % 30)),
      dimensionScores: { teaching_attitude: 80, teaching_content: 78, teaching_method: 76, teaching_effect: 82, teaching_ethics: 88 },
      evaluationDate: new Date().toISOString()
    } as any))
  }

  /**
   * 获取教学活动记录
   */
  async getTeachingActivities(teacherId?: string, courseId?: string): Promise<ZhijiaoyunTeachingActivity[]> {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      teacherId: teacherId || 't1',
      courseId: courseId || '1',
      activityType: ['lecture', 'discussion', 'quiz'][i % 3],
      activityDate: new Date().toISOString()
    } as any))
  }

  /**
   * 数据同步
   */
  async syncData(syncType: 'full' | 'incremental' = 'incremental'): Promise<SyncStatus> {
    return {
      status: 'ok',
      syncType,
      lastSyncTime: new Date().toISOString(),
      message: '模拟同步完成'
    } as any
  }

  /**
   * 批量获取教师数据（用于评价分析）
   */
  async getTeacherDataForEvaluation(teacherIds: string[]): Promise<{ teachers: Array<{ user: ZhijiaoyunUser; courses: ZhijiaoyunCourse[]; classes: ZhijiaoyunClass[]; activities: ZhijiaoyunTeachingActivity[]; evaluations: ZhijiaoyunEvaluation[]; attendance: ZhijiaoyunAttendance[]; scores: ZhijiaoyunExamScore[]; }>; }> {
    const teachers = await Promise.all(teacherIds.map(async (tid) => {
      const user = await this.getUser(tid)
      const courses = (await this.getCourses({ teacherId: tid, pageSize: 5 })).courses
      const activities = await this.getTeachingActivities(tid)
      const evaluations = await this.getEvaluations(tid)
      const attendance = (await this.getAttendanceRecords({ pageSize: 200 })).records
      const scores = (await this.getExamScores({ pageSize: 200 })).scores
      return { user: user as any, courses, classes: [], activities, evaluations, attendance, scores }
    }))
    return { teachers }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; connection: boolean; lastSyncTime?: string; error?: string; }> {
    return { status: 'healthy', connection: true, lastSyncTime: new Date().toISOString() }
  }
}
