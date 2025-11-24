/**
 * 数据采集服务
 * 负责从职教云平台采集数据并进行初步处理
 */

import { ZhijiaoyunService } from './zhijiaoyunService.ts'
import { ZhijiaoyunMockProvider } from './zhijiaoyunMockProvider.ts'
import { DatabaseService } from './databaseService.ts'
import { config } from '@/config/config'
import {
  CollectionTask,
  CollectionStatus,
  DataType,
  CollectionError,
  TaskExecutionResult,
  CollectionConfig,
  SyncStatus,
  CollectionLog
} from '@/types/dataCollection'
import {
  ZhijiaoyunUser,
  ZhijiaoyunCourse,
  ZhijiaoyunClass,
  ZhijiaoyunAttendance,
  ZhijiaoyunAssignment,
  ZhijiaoyunExamScore,
  ZhijiaoyunEvaluation,
  ZhijiaoyunTeachingActivity
} from '@/types/zhijiaoyun'

export class DataCollectionService {
  private zhijiaoyunService: any
  private dbService: DatabaseService
  private config: CollectionConfig
  private runningTasks: Map<string, AbortController>
  private logs: CollectionLog[]

  constructor() {
    this.zhijiaoyunService = config.zhijiaoyun.mode === 'mock' ? new ZhijiaoyunMockProvider() : new ZhijiaoyunService()
    this.dbService = new DatabaseService()
    this.runningTasks = new Map()
    this.logs = []

    // 配置采集参数
    this.config = {
      batchSize: 100,
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 300000, // 5分钟
      enableDataValidation: true,
      enableDeduplication: true,
      enableQualityCheck: true,
      retentionPeriod: 365, // 保留1年数据
      maxConcurrentTasks: 3
    }
  }

  /**
   * 获取采集配置
   */
  getConfig(): CollectionConfig {
    return { ...this.config }
  }

  /**
   * 更新采集配置
   */
  updateConfig(newConfig: Partial<CollectionConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * 记录日志
   */
  private async log(taskId: string, taskName: string, level: CollectionLog['level'], message: string, details?: any): Promise<void> {
    const logEntry: CollectionLog = {
      id: crypto.randomUUID(),
      taskId,
      taskName,
      level,
      message,
      details,
      timestamp: new Date().toISOString()
    }

    this.logs.push(logEntry)
    console.log(`[${level.toUpperCase()}] ${taskName}: ${message}`)

    // 保持日志数量在合理范围内
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-5000)
    }

    // 持久化日志
    try {
      await this.dbService.executeSql(
        `INSERT INTO collection_logs (id, task_id, task_name, level, message, details, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [logEntry.id, logEntry.taskId, logEntry.taskName, logEntry.level, logEntry.message, JSON.stringify(logEntry.details || {}), logEntry.timestamp]
      )
    } catch (_) {
      // 忽略日志持久化失败，避免影响主流程
    }
  }

  /**
   * 获取日志
   */
  getLogs(taskId?: string, level?: CollectionLog['level'], limit: number = 100): CollectionLog[] {
    let filteredLogs = this.logs

    if (taskId) {
      filteredLogs = filteredLogs.filter(log => log.taskId === taskId)
    }

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level)
    }

    return filteredLogs.slice(-limit).reverse()
  }

  /**
   * 执行数据采集任务
   */
  async executeTask(task: CollectionTask): Promise<TaskExecutionResult> {
    const startTime = new Date().toISOString()
    const taskId = task.id
    const taskName = task.name

    await this.log(taskId, taskName, 'info', '开始执行采集任务', { dataType: task.dataType })

    // 检查是否有并发任务限制
    if (this.runningTasks.size >= this.config.maxConcurrentTasks) {
      const error = '已达到最大并发任务数限制'
      await this.log(taskId, taskName, 'error', error)
      return {
        taskId,
        success: false,
        startTime,
        endTime: new Date().toISOString(),
        duration: 0,
        recordCount: 0,
        successCount: 0,
        errorCount: 1,
        errors: [error],
        warnings: [],
        metadata: {}
      }
    }

    // 创建任务控制器
    const abortController = new AbortController()
    this.runningTasks.set(taskId, abortController)

    try {
      let result: TaskExecutionResult

      switch (task.dataType) {
        case DataType.USERS:
          result = await this.collectUsers(taskId, taskName, abortController.signal)
          break
        case DataType.COURSES:
          result = await this.collectCourses(taskId, taskName, abortController.signal)
          break
        case DataType.CLASSES:
          result = await this.collectClasses(taskId, taskName, abortController.signal)
          break
        case DataType.ATTENDANCE:
          result = await this.collectAttendance(taskId, taskName, abortController.signal)
          break
        case DataType.ASSIGNMENTS:
          result = await this.collectAssignments(taskId, taskName, abortController.signal)
          break
        case DataType.EXAM_SCORES:
          result = await this.collectExamScores(taskId, taskName, abortController.signal)
          break
        case DataType.EVALUATIONS:
          result = await this.collectEvaluations(taskId, taskName, abortController.signal)
          break
        case DataType.TEACHING_ACTIVITIES:
          result = await this.collectTeachingActivities(taskId, taskName, abortController.signal)
          break
        default:
          throw new Error(`不支持的数据类型: ${task.dataType}`)
      }

      await this.log(taskId, taskName, 'info', '采集任务完成', {
        success: result.success,
        recordCount: result.recordCount,
        duration: result.duration
      })

      return result
    } catch (error: any) {
      const errorMessage = error.message || '未知错误'
      await this.log(taskId, taskName, 'error', '采集任务失败', { error: errorMessage })

      return {
        taskId,
        success: false,
        startTime,
        endTime: new Date().toISOString(),
        duration: Date.now() - new Date(startTime).getTime(),
        recordCount: 0,
        successCount: 0,
        errorCount: 1,
        errors: [errorMessage],
        warnings: [],
        metadata: { stack: error.stack }
      }
    } finally {
      this.runningTasks.delete(taskId)
    }
  }

  /**
   * 创建采集任务
   */
  async createTask(task: CollectionTask): Promise<void> {
    await this.dbService.executeSql(
      `INSERT INTO collection_tasks (id, name, description, data_type, schedule, enabled, status, record_count, success_count, error_count, metadata, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
      [task.id, task.name, task.description || '', task.dataType, task.schedule, task.enabled, task.status, task.recordCount || 0, task.successCount || 0, task.errorCount || 0, JSON.stringify(task.metadata || {})]
    )
  }

  /**
   * 更新采集任务
   */
  async updateTask(taskId: string, updates: Partial<CollectionTask>): Promise<boolean> {
    const result = await this.dbService.executeSql(
      `UPDATE collection_tasks SET name = COALESCE($2, name), description = COALESCE($3, description), schedule = COALESCE($4, schedule), enabled = COALESCE($5, enabled), status = COALESCE($6, status), metadata = COALESCE($7, metadata), updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [taskId, updates.name || null, updates.description || null, updates.schedule || null, typeof updates.enabled === 'boolean' ? updates.enabled : null, updates.status || null, updates.metadata ? JSON.stringify(updates.metadata) : null]
    )
    return (result.rowCount || 0) > 0
  }

  /**
   * 删除采集任务
   */
  async deleteTask(taskId: string): Promise<boolean> {
    const result = await this.dbService.executeSql(`DELETE FROM collection_tasks WHERE id = $1`, [taskId])
    return (result.rowCount || 0) > 0
  }

  /**
   * 获取采集任务
   */
  async getTask(taskId: string): Promise<CollectionTask | null> {
    const rows = await this.dbService.query<any>(`SELECT * FROM collection_tasks WHERE id = $1`, [taskId])
    if (rows.length === 0) return null
    const r = rows[0]
    return {
      id: r.id,
      name: r.name,
      description: r.description,
      dataType: r.data_type,
      schedule: r.schedule,
      enabled: r.enabled,
      status: r.status,
      recordCount: r.record_count,
      successCount: r.success_count,
      errorCount: r.error_count,
      metadata: r.metadata || {},
      createdAt: r.created_at?.toISOString?.() || r.created_at,
      updatedAt: r.updated_at?.toISOString?.() || r.updated_at,
    }
  }

  /**
   * 列表查询采集任务
   */
  async listTasks(params: { page: number; pageSize: number; dataType?: string; status?: string; enabled?: boolean; }): Promise<{ tasks: CollectionTask[]; total: number; }> {
    const filters: string[] = []
    const values: any[] = []
    let idx = 1
    if (params.dataType) { filters.push(`data_type = $${idx++}`); values.push(params.dataType) }
    if (params.status) { filters.push(`status = $${idx++}`); values.push(params.status) }
    if (typeof params.enabled === 'boolean') { filters.push(`enabled = $${idx++}`); values.push(params.enabled) }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const offset = (params.page - 1) * params.pageSize
    const tasks = await this.dbService.query<any>(`SELECT * FROM collection_tasks ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`, [...values, params.pageSize, offset])
    const totalRows = await this.dbService.query<{ count: number }>(`SELECT COUNT(*)::int as count FROM collection_tasks ${where}`, values)
    return {
      tasks: tasks.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        dataType: r.data_type,
        schedule: r.schedule,
        enabled: r.enabled,
        status: r.status,
        recordCount: r.record_count,
        successCount: r.success_count,
        errorCount: r.error_count,
        metadata: r.metadata || {},
        createdAt: r.created_at?.toISOString?.() || r.created_at,
        updatedAt: r.updated_at?.toISOString?.() || r.updated_at,
      })),
      total: totalRows[0]?.count || 0
    }
  }

  /**
   * 采集用户数据
   */
  private async collectUsers(taskId: string, taskName: string, signal: AbortSignal): Promise<TaskExecutionResult> {
    const startTime = Date.now()
    let recordCount = 0
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []
    const warnings: string[] = []

    try {
      this.log(taskId, taskName, 'info', '开始采集用户数据')

      let page = 1
      let hasMoreData = true

      while (hasMoreData && !signal.aborted) {
        this.log(taskId, taskName, 'debug', `采集用户数据 - 第${page}页`)

        const result = await this.zhijiaoyunService.getUsers({
          page,
          pageSize: this.config.batchSize
        })

        if (result.users.length === 0) {
          hasMoreData = false
          break
        }

        recordCount += result.users.length

        // 处理用户数据
        for (const user of result.users) {
          try {
            // 数据验证
            if (this.config.enableDataValidation) {
              this.validateUserData(user)
            }

            // 去重检查
            if (this.config.enableDeduplication) {
              const exists = await this.checkUserExists(user.userId)
              if (exists) {
                await this.updateUserData(user)
                warnings.push(`用户 ${user.username} 已更新`)
              } else {
                await this.insertUserData(user)
              }
            } else {
              await this.insertUserData(user)
            }

            successCount++
          } catch (error: any) {
            errorCount++
            errors.push(`用户 ${user.username} 处理失败: ${error.message}`)
            this.log(taskId, taskName, 'warn', `用户数据处理失败`, { user: user.userId, error: error.message })
          }
        }

        page++

        // 检查是否还有更多数据
        hasMoreData = result.users.length === this.config.batchSize
      }

      if (signal.aborted) {
        throw new Error('任务被取消')
      }

      this.log(taskId, taskName, 'info', '用户数据采集完成', {
        recordCount,
        successCount,
        errorCount
      })

    } catch (error: any) {
      if (error.message !== '任务被取消') {
        errors.push(error.message)
      }
    }

    return {
      taskId,
      success: errorCount === 0,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: Date.now() - startTime,
      recordCount,
      successCount,
      errorCount,
      errors,
      warnings,
      metadata: { dataType: DataType.USERS }
    }
  }

  /**
   * 采集课程数据
   */
  private async collectCourses(taskId: string, taskName: string, signal: AbortSignal): Promise<TaskExecutionResult> {
    const startTime = Date.now()
    let recordCount = 0
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []
    const warnings: string[] = []

    try {
      this.log(taskId, taskName, 'info', '开始采集课程数据')

      let page = 1
      let hasMoreData = true

      while (hasMoreData && !signal.aborted) {
        const result = await this.zhijiaoyunService.getCourses({
          page,
          pageSize: this.config.batchSize
        })

        if (result.courses.length === 0) {
          hasMoreData = false
          break
        }

        recordCount += result.courses.length

        for (const course of result.courses) {
          try {
            if (this.config.enableDataValidation) {
              this.validateCourseData(course)
            }

            if (this.config.enableDeduplication) {
              const exists = await this.checkCourseExists(course.courseId)
              if (exists) {
                await this.updateCourseData(course)
                warnings.push(`课程 ${course.courseName} 已更新`)
              } else {
                await this.insertCourseData(course)
              }
            } else {
              await this.insertCourseData(course)
            }

            successCount++
          } catch (error: any) {
            errorCount++
            errors.push(`课程 ${course.courseName} 处理失败: ${error.message}`)
          }
        }

        page++
        hasMoreData = result.courses.length === this.config.batchSize
      }

      if (signal.aborted) {
        throw new Error('任务被取消')
      }

    } catch (error: any) {
      if (error.message !== '任务被取消') {
        errors.push(error.message)
      }
    }

    return {
      taskId,
      success: errorCount === 0,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: Date.now() - startTime,
      recordCount,
      successCount,
      errorCount,
      errors,
      warnings,
      metadata: { dataType: DataType.COURSES }
    }
  }

  /**
   * 采集班级数据
   */
  private async collectClasses(taskId: string, taskName: string, signal: AbortSignal): Promise<TaskExecutionResult> {
    const startTime = Date.now()
    let recordCount = 0
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []
    const warnings: string[] = []

    try {
      this.log(taskId, taskName, 'info', '开始采集班级数据')

      const classes = await this.zhijiaoyunService.getClasses()
      recordCount = classes.length

      for (const classInfo of classes) {
        if (signal.aborted) break

        try {
          if (this.config.enableDataValidation) {
            this.validateClassData(classInfo)
          }

          if (this.config.enableDeduplication) {
            const exists = await this.checkClassExists(classInfo.classId)
            if (exists) {
              await this.updateClassData(classInfo)
              warnings.push(`班级 ${classInfo.className} 已更新`)
            } else {
              await this.insertClassData(classInfo)
            }
          } else {
            await this.insertClassData(classInfo)
          }

          successCount++
        } catch (error: any) {
          errorCount++
          errors.push(`班级 ${classInfo.className} 处理失败: ${error.message}`)
        }
      }

      if (signal.aborted) {
        throw new Error('任务被取消')
      }

    } catch (error: any) {
      if (error.message !== '任务被取消') {
        errors.push(error.message)
      }
    }

    return {
      taskId,
      success: errorCount === 0,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: Date.now() - startTime,
      recordCount,
      successCount,
      errorCount,
      errors,
      warnings,
      metadata: { dataType: DataType.CLASSES }
    }
  }

  /**
   * 采集出勤数据
   */
  private async collectAttendance(taskId: string, taskName: string, signal: AbortSignal): Promise<TaskExecutionResult> {
    // 实现出勤数据采集逻辑
    // 这里是简化实现，实际应该支持日期范围查询
    const startTime = Date.now()

    try {
      this.log(taskId, taskName, 'info', '开始采集出勤数据')

      const result = await this.zhijiaoyunService.getAttendanceRecords({
        page: 1,
        pageSize: this.config.batchSize
      })

      // 处理出勤记录...

      return {
        taskId,
        success: true,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: result.records.length,
        successCount: result.records.length,
        errorCount: 0,
        errors: [],
        warnings: [],
        metadata: { dataType: DataType.ATTENDANCE }
      }
    } catch (error: any) {
      return {
        taskId,
        success: false,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: 0,
        successCount: 0,
        errorCount: 1,
        errors: [error.message],
        warnings: [],
        metadata: { dataType: DataType.ATTENDANCE }
      }
    }
  }

  /**
   * 采集作业数据
   */
  private async collectAssignments(taskId: string, taskName: string, signal: AbortSignal): Promise<TaskExecutionResult> {
    // 实现作业数据采集逻辑
    const startTime = Date.now()

    try {
      this.log(taskId, taskName, 'info', '开始采集作业数据')

      const assignments = await this.zhijiaoyunService.getAssignments()

      return {
        taskId,
        success: true,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: assignments.length,
        successCount: assignments.length,
        errorCount: 0,
        errors: [],
        warnings: [],
        metadata: { dataType: DataType.ASSIGNMENTS }
      }
    } catch (error: any) {
      return {
        taskId,
        success: false,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: 0,
        successCount: 0,
        errorCount: 1,
        errors: [error.message],
        warnings: [],
        metadata: { dataType: DataType.ASSIGNMENTS }
      }
    }
  }

  /**
   * 采集考试成绩
   */
  private async collectExamScores(taskId: string, taskName: string, signal: AbortSignal): Promise<TaskExecutionResult> {
    // 实现考试成绩采集逻辑
    const startTime = Date.now()

    try {
      this.log(taskId, taskName, 'info', '开始采集考试成绩')

      const result = await this.zhijiaoyunService.getExamScores({
        page: 1,
        pageSize: this.config.batchSize
      })

      return {
        taskId,
        success: true,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: result.scores.length,
        successCount: result.scores.length,
        errorCount: 0,
        errors: [],
        warnings: [],
        metadata: { dataType: DataType.EXAM_SCORES }
      }
    } catch (error: any) {
      return {
        taskId,
        success: false,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: 0,
        successCount: 0,
        errorCount: 1,
        errors: [error.message],
        warnings: [],
        metadata: { dataType: DataType.EXAM_SCORES }
      }
    }
  }

  /**
   * 采集评价数据
   */
  private async collectEvaluations(taskId: string, taskName: string, signal: AbortSignal): Promise<TaskExecutionResult> {
    // 实现评价数据采集逻辑
    const startTime = Date.now()

    try {
      this.log(taskId, taskName, 'info', '开始采集评价数据')

      const evaluations = await this.zhijiaoyunService.getEvaluations()

      return {
        taskId,
        success: true,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: evaluations.length,
        successCount: evaluations.length,
        errorCount: 0,
        errors: [],
        warnings: [],
        metadata: { dataType: DataType.EVALUATIONS }
      }
    } catch (error: any) {
      return {
        taskId,
        success: false,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: 0,
        successCount: 0,
        errorCount: 1,
        errors: [error.message],
        warnings: [],
        metadata: { dataType: DataType.EVALUATIONS }
      }
    }
  }

  /**
   * 采集教学活动数据
   */
  private async collectTeachingActivities(taskId: string, taskName: string, signal: AbortSignal): Promise<TaskExecutionResult> {
    // 实现教学活动采集逻辑
    const startTime = Date.now()

    try {
      this.log(taskId, taskName, 'info', '开始采集教学活动数据')

      const activities = await this.zhijiaoyunService.getTeachingActivities()

      return {
        taskId,
        success: true,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: activities.length,
        successCount: activities.length,
        errorCount: 0,
        errors: [],
        warnings: [],
        metadata: { dataType: DataType.TEACHING_ACTIVITIES }
      }
    } catch (error: any) {
      return {
        taskId,
        success: false,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        recordCount: 0,
        successCount: 0,
        errorCount: 1,
        errors: [error.message],
        warnings: [],
        metadata: { dataType: DataType.TEACHING_ACTIVITIES }
      }
    }
  }

  /**
   * 取消正在运行的任务
   */
  cancelTask(taskId: string): boolean {
    const controller = this.runningTasks.get(taskId)
    if (controller) {
      controller.abort()
      this.runningTasks.delete(taskId)
      return true
    }
    return false
  }

  /**
   * 获取正在运行的任务列表
   */
  getRunningTasks(): string[] {
    return Array.from(this.runningTasks.keys())
  }

  // 数据验证方法
  private validateUserData(user: ZhijiaoyunUser): void {
    if (!user.userId || !user.username || !user.realName) {
      throw new Error('用户数据缺少必要字段')
    }
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      throw new Error('用户邮箱格式无效')
    }
  }

  private validateCourseData(course: ZhijiaoyunCourse): void {
    if (!course.courseId || !course.courseName || !course.teacherId) {
      throw new Error('课程数据缺少必要字段')
    }
    if (course.credits < 0 || course.totalHours < 0) {
      throw new Error('课程学分或学时不能为负数')
    }
  }

  private validateClassData(classInfo: ZhijiaoyunClass): void {
    if (!classInfo.classId || !classInfo.className || !classInfo.courseId) {
      throw new Error('班级数据缺少必要字段')
    }
    if (classInfo.maxStudents < 0 || classInfo.studentCount < 0) {
      throw new Error('班级学生数不能为负数')
    }
  }

  // 数据库操作方法（这些方法需要在DatabaseService中实现）
  private async checkUserExists(userId: string): Promise<boolean> {
    // TODO: 实现用户存在性检查
    return false
  }

  private async insertUserData(user: ZhijiaoyunUser): Promise<void> {
    // TODO: 实现用户数据插入
  }

  private async updateUserData(user: ZhijiaoyunUser): Promise<void> {
    // TODO: 实现用户数据更新
  }

  private async checkCourseExists(courseId: string): Promise<boolean> {
    // TODO: 实现课程存在性检查
    return false
  }

  private async insertCourseData(course: ZhijiaoyunCourse): Promise<void> {
    // TODO: 实现课程数据插入
  }

  private async updateCourseData(course: ZhijiaoyunCourse): Promise<void> {
    // TODO: 实现课程数据更新
  }

  private async checkClassExists(classId: string): Promise<boolean> {
    // TODO: 实现班级存在性检查
    return false
  }

  private async insertClassData(classInfo: ZhijiaoyunClass): Promise<void> {
    // TODO: 实现班级数据插入
  }

  private async updateClassData(classInfo: ZhijiaoyunClass): Promise<void> {
    // TODO: 实现班级数据更新
  }
}
