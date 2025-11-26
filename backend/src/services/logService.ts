import { ApiResponse, PaginatedResponse } from '@/types/index.ts'
import { DatabaseService } from '@/services/databaseService.ts'

export interface ActivityLogQueryOptions {
  activityType?: string
  status?: string
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
  userId?: string
  userRole?: string
}

export interface CreateLogRequest {
  activityType: string
  activityName: string
  description: string
  userId?: number
  username?: string
  userRole?: string
  status: 'success' | 'warning' | 'error'
  ipAddress?: string
  userAgent?: string
  requestMethod?: string
  requestUrl?: string
  requestParameters?: Record<string, any>
  responseStatus?: number
  duration?: number
  metadata?: Record<string, any>
}

export interface LogStatistics {
  overview: {
    totalLogs: number
    successCount: number
    errorCount: number
    warningCount: number
  }
  trends: {
    dailyStats: Array<{
      date: string
      count: number
      successCount: number
      errorCount: number
      warningCount: number
    }>
    topActivities: Array<{
      activityName: string
      count: number
    }>
    userActivity: Array<{
      username: string
      count: number
    }>
  }
  performance: {
    averageResponseTime: number
    slowestOperations: Array<{
      activityName: string
      averageTime: number
      count: number
    }>
    errorRates: Array<{
      activityType: string
      errorRate: number
    }>
  }
}

export interface LogExportOptions {
  format?: 'csv' | 'json' | 'xlsx'
  activityType?: string
  status?: string
  startDate?: string
  endDate?: string
  includeMetadata?: boolean
}

export class LogService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = new DatabaseService()
  }

  /**
   * 获取系统日志列表
   */
  async getLogs(options: ActivityLogQueryOptions = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const {
        activityType,
        status,
        page = 1,
        limit = 20,
        search,
        startDate,
        endDate,
        userId,
        userRole
      } = options

      let whereClause = '1=1'
      const params: any[] = []
      let paramIndex = 1

      // 活动类型过滤
      if (activityType) {
        whereClause += ` AND activity_type = $${paramIndex++}`
        params.push(activityType)
      }

      // 状态过滤
      if (status) {
        whereClause += ` AND status = $${paramIndex++}`
        params.push(status)
      }

      // 时间范围过滤
      if (startDate) {
        whereClause += ` AND activity_time >= $${paramIndex++}`
        params.push(startDate)
      }

      if (endDate) {
        whereClause += ` AND activity_time <= $${paramIndex++}`
        params.push(endDate)
      }

      // 用户过滤
      if (userId) {
        whereClause += ` AND user_id = $${paramIndex++}`
        params.push(userId)
      }

      if (userRole) {
        whereClause += ` AND user_role = $${paramIndex++}`
        params.push(userRole)
      }

      // 搜索过滤
      if (search) {
        whereClause += ` AND (activity_name ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++} OR username ILIKE $${paramIndex++})`
        params.push(`%${search}%`, `%${search}%`, `%${search}%`)
      }

      // 获取总数
      const countSql = `SELECT COUNT(*) as total FROM activity_logs WHERE ${whereClause}`
      const countResult = await this.dbService.query<{ total: number }>(countSql, params)
      const total = countResult[0]?.total || 0

      // 分页查询
      const offset = (page - 1) * limit
      const dataSql = `
        SELECT
          id, activity_type, activity_name, description,
          username, user_role, status, activity_time,
          duration, ip_address, request_method, request_url,
          user_agent, request_parameters, response_status, metadata
        FROM activity_logs
        WHERE ${whereClause}
        ORDER BY activity_time DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `
      params.push(limit, offset)

      const logs = await this.dbService.query<any>(dataSql, params)

      // 转换数据格式
      const formattedLogs = logs.map(log => ({
        ...log,
        id: String(log.id),
        user_id: log.user_id ? String(log.user_id) : undefined,
        metadata: log.metadata || {},
        request_parameters: log.request_parameters || {}
      }))

      const pagination = {
        page,
        page_size: limit,
        total,
        total_pages: Math.ceil(total / limit)
      }

      return {
        success: true,
        data: {
          success: true,
          data: formattedLogs,
          message: '系统日志获取成功',
          pagination
        },
        message: '系统日志获取成功'
      }

    } catch (error: any) {
      console.error('❌ 获取系统日志失败:', error)
      return {
        success: false,
        message: error.message || '获取系统日志失败',
        error: 'GET_LOGS_FAILED'
      }
    }
  }

  /**
   * 获取单个日志详情
   */
  async getLogById(logId: string): Promise<ApiResponse<any>> {
    try {
      const sql = `
        SELECT
          id, activity_type, activity_name, description,
          username, user_role, status, activity_time,
          duration, ip_address, request_method, request_url,
          user_agent, request_parameters, response_status, metadata
        FROM activity_logs
        WHERE id = $1
      `

      const logs = await this.dbService.query<any>(sql, [logId])

      if (logs.length === 0) {
        return {
          success: false,
          message: '日志不存在',
          error: 'LOG_NOT_FOUND'
        }
      }

      const log = {
        ...logs[0],
        id: String(logs[0].id),
        user_id: logs[0].user_id ? String(logs[0].user_id) : undefined,
        metadata: logs[0].metadata || {},
        request_parameters: logs[0].request_parameters || {}
      }

      return {
        success: true,
        data: log,
        message: '日志详情获取成功'
      }

    } catch (error: any) {
      console.error('❌ 获取日志详情失败:', error)
      return {
        success: false,
        message: error.message || '获取日志详情失败',
        error: 'GET_LOG_DETAIL_FAILED'
      }
    }
  }

  /**
   * 创建活动日志
   */
  async createLog(request: CreateLogRequest): Promise<ApiResponse> {
    try {
      const sql = `
        INSERT INTO activity_logs (
          activity_type, activity_name, description, user_id, username, user_role,
          status, activity_time, duration, ip_address, request_method, request_url,
          user_agent, request_parameters, response_status, metadata
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9, $10, $11,
          $12, $13, $14, $15
        ) RETURNING id
      `

      const params = [
        request.activityType,
        request.activityName,
        request.description,
        request.userId || null,
        request.username || '',
        request.userRole || '',
        request.status,
        request.duration || 0,
        request.ipAddress || '',
        request.requestMethod || '',
        request.requestUrl || '',
        request.userAgent || '',
        JSON.stringify(request.requestParameters || {}),
        request.responseStatus || null,
        JSON.stringify(request.metadata || {})
      ]

      const result = await this.dbService.query<{ id: number }>(sql, params)

      return {
        success: true,
        data: { id: String(result[0].id) },
        message: '日志创建成功'
      }

    } catch (error: any) {
      console.error('❌ 创建日志失败:', error)
      return {
        success: false,
        message: error.message || '创建日志失败',
        error: 'CREATE_LOG_FAILED'
      }
    }
  }

  /**
   * 获取日志统计
   */
  async getLogStatistics(options: {
    startDate?: string
    endDate?: string
    activityType?: string
  } = {}): Promise<ApiResponse<LogStatistics>> {
    try {
      const { startDate, endDate, activityType } = options

      let whereClause = '1=1'
      const params: any[] = []

      if (startDate) {
        whereClause += ` AND activity_time >= $${params.length + 1}`
        params.push(startDate)
      }

      if (endDate) {
        whereClause += ` AND activity_time <= $${params.length + 1}`
        params.push(endDate)
      }

      if (activityType) {
        whereClause += ` AND activity_type = $${params.length + 1}`
        params.push(activityType)
      }

      // 基础统计
      const overviewSql = `
        SELECT
          COUNT(*) as totalLogs,
          COUNT(CASE WHEN status = 'success' THEN 1 END) as successCount,
          COUNT(CASE WHEN status = 'error' THEN 1 END) as errorCount,
          COUNT(CASE WHEN status = 'warning' THEN 1 END) as warningCount
        FROM activity_logs
        WHERE ${whereClause}
      `

      const overviewResult = await this.dbService.query<{
        totalLogs: number
        successCount: number
        errorCount: number
        warningCount: number
      }>(overviewSql, params)

      // 每日统计
      const dailyStatsSql = `
        SELECT
          DATE(activity_time) as date,
          COUNT(*) as count,
          COUNT(CASE WHEN status = 'success' THEN 1 END) as successCount,
          COUNT(CASE WHEN status = 'error' THEN 1 END) as errorCount,
          COUNT(CASE WHEN status = 'warning' THEN 1 END) as warningCount
        FROM activity_logs
        WHERE ${whereClause}
        GROUP BY DATE(activity_time)
        ORDER BY date DESC
        LIMIT 30
      `

      const dailyStatsResult = await this.dbService.query<{
        date: string
        count: number
        successCount: number
        errorCount: number
        warningCount: number
      }>(dailyStatsSql, params)

      // 活动统计
      const topActivitiesSql = `
        SELECT
          activity_name,
          COUNT(*) as count
        FROM activity_logs
        WHERE ${whereClause}
        GROUP BY activity_name
        ORDER BY count DESC
        LIMIT 10
      `

      const topActivitiesResult = await this.dbService.query<{
        activity_name: string
        count: number
      }>(topActivitiesSql, params)

      // 用户活动统计
      const userActivitySql = `
        SELECT
          username,
          COUNT(*) as count
        FROM activity_logs
        WHERE ${whereClause} AND username IS NOT NULL AND username != ''
        GROUP BY username
        ORDER BY count DESC
        LIMIT 10
      `

      const userActivityResult = await this.dbService.query<{
        username: string
        count: number
      }>(userActivitySql, params)

      // 性能统计
      const performanceSql = `
        SELECT
          activity_name,
          AVG(duration) as averageResponseTime,
          COUNT(*) as count
        FROM activity_logs
        WHERE ${whereClause} AND duration IS NOT NULL AND duration > 0
        GROUP BY activity_name
        HAVING COUNT(*) >= 3
        ORDER BY averageResponseTime DESC
        LIMIT 10
      `

      const performanceResult = await this.dbService.query<{
        activity_name: string
        averageResponseTime: number
        count: number
      }>(performanceSql, params)

      // 错误率统计
      const errorRatesSql = `
        SELECT
          activity_type,
          ROUND(
            COUNT(CASE WHEN status = 'error' THEN 1 END) * 100.0 /
            NULLIF(COUNT(*), 0), 2
          ) as errorRate
        FROM activity_logs
        WHERE ${whereClause}
        GROUP BY activity_type
        ORDER BY errorRate DESC
      `

      const errorRatesResult = await this.dbService.query<{
        activity_type: string
        errorRate: number
      }>(errorRatesSql, params)

      const statistics: LogStatistics = {
        overview: {
          totalLogs: overviewResult[0]?.totalLogs || 0,
          successCount: overviewResult[0]?.successCount || 0,
          errorCount: overviewResult[0]?.errorCount || 0,
          warningCount: overviewResult[0]?.warningCount || 0
        },
        trends: {
          dailyStats: dailyStatsResult,
          topActivities: topActivitiesResult.map(item => ({
            activityName: item.activity_name,
            count: item.count
          })),
          userActivity: userActivityResult
        },
        performance: {
          averageResponseTime: performanceResult.reduce((sum, item) => sum + item.averageResponseTime, 0) / (performanceResult.length || 1),
          slowestOperations: performanceResult,
          errorRates: errorRatesResult
        }
      }

      return {
        success: true,
        data: statistics,
        message: '日志统计获取成功'
      }

    } catch (error: any) {
      console.error('❌ 获取日志统计失败:', error)
      return {
        success: false,
        message: error.message || '获取日志统计失败',
        error: 'GET_LOG_STATISTICS_FAILED'
      }
    }
  }

  /**
   * 导出日志
   */
  async exportLogs(options: LogExportOptions = {}): Promise<ApiResponse<{
    downloadUrl: string
    filename: string
    size: number
    format: string
  }>> {
    try {
      const {
        format = 'csv',
        activityType,
        status,
        startDate,
        endDate,
        includeMetadata = false
      } = options

      // 生成导出文件
      const exportId = Date.now().toString()
      const filename = `logs_${new Date().toISOString().split('T')[0]}.${format}`
      const downloadUrl = `/api/system/logs/download/${exportId}.${format}`

      // 模拟导出过程（实际实现中会生成真实文件）
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = {
        success: true,
        data: {
          downloadUrl,
          filename,
          size: 1024 * 500, // 模拟文件大小
          format
        },
        message: '日志导出成功'
      }

      return response

    } catch (error: any) {
      console.error('❌ 导出日志失败:', error)
      return {
        success: false,
        message: error.message || '导出日志失败',
        error: 'EXPORT_LOGS_FAILED'
      }
    }
  }

  /**
   * 清理过期日志
   */
  async cleanupOldLogs(daysToKeep: number = 90): Promise<ApiResponse<{
    deletedCount: number
  }>> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const sql = `
        DELETE FROM activity_logs
        WHERE activity_time < $1
        RETURNING COUNT(*) as deletedCount
      `

      const result = await this.dbService.query<{ deletedCount: number }>(sql, [cutoffDate.toISOString()])
      const deletedCount = result[0]?.deletedCount || 0

      return {
        success: true,
        data: { deletedCount },
        message: `成功清理 ${deletedCount} 条过期日志`
      }

    } catch (error: any) {
      console.error('❌ 清理日志失败:', error)
      return {
        success: false,
        message: error.message || '清理日志失败',
        error: 'CLEANUP_LOGS_FAILED'
      }
    }
  }

  /**
   * 批量创建日志
   */
  async createLogsBatch(logs: CreateLogRequest[]): Promise<ApiResponse<{
    successCount: number
    errorCount: number
    errors: string[]
  }>> {
    try {
      let successCount = 0
      let errorCount = 0
      const errors: string[] = []

      for (const logData of logs) {
        try {
          await this.createLog(logData)
          successCount++
        } catch (error: any) {
          errorCount++
          errors.push(`创建日志失败: ${error.message}`)
        }
      }

      return {
        success: true,
        data: { successCount, errorCount, errors },
        message: `批量创建日志完成：成功 ${successCount} 条，失败 ${errorCount} 条`
      }

    } catch (error: any) {
      console.error('❌ 批量创建日志失败:', error)
      return {
        success: false,
        message: error.message || '批量创建日志失败',
        error: 'CREATE_LOGS_BATCH_FAILED'
      }
    }
  }
}