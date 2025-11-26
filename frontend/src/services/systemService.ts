import { apiClient } from './api'

// 配置项接口
export interface SystemConfig {
  id: string
  category: string
  key: string
  value: any
  description: string
  type: 'string' | 'number' | 'boolean' | 'json' | 'array'
  is_public: boolean
  updated_by: string
  created_at: string
  updated_at: string
}

// 配置分类接口
export interface ConfigCategory {
  id: string
  name: string
  description: string
  icon?: string
  configCount?: number
  color?: string
}

// 创建配置请求接口
export interface CreateConfigRequest {
  key: string
  name: string
  description: string
  category: string
  value: any
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array'
  isPublic?: boolean
  isEditable?: boolean
}

// 更新配置请求接口
export interface UpdateConfigRequest {
  name?: string
  description?: string
  value?: any
  isPublic?: boolean
  isEditable?: boolean
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
  timestamp?: string
}

// 分页响应接口
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

// 查询参数接口
export interface ConfigQueryParams {
  category?: string
  page?: number
  limit?: number
  search?: string
  includePrivate?: boolean
}

// 日志查询参数接口
export interface LogQueryParams {
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

// 日志导出参数接口
export interface LogExportParams {
  format?: 'csv' | 'json' | 'xlsx'
  activityType?: string
  status?: string
  startDate?: string
  endDate?: string
  includeMetadata?: boolean
}

// 日志统计查询参数接口
export interface LogStatisticsParams {
  startDate?: string
  endDate?: string
  activityType?: string
}

// 日志项接口
export interface LogItem {
  id: string
  activity_type: string
  activity_name: string
  description: string
  username?: string
  user_role?: string
  status: 'success' | 'warning' | 'error'
  activity_time: string
  duration?: number
  ip_address?: string
  request_method?: string
  request_url?: string
  response_status?: number
  user_agent?: string
  metadata?: Record<string, any>
  request_parameters?: Record<string, any>
}

// 日志统计接口
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

// 日志导出响应接口
export interface LogExportResponse {
  downloadUrl: string
  filename: string
  size: number
  format: string
}

// ===== 监控相关接口 =====

// 系统状态接口
export interface SystemStatus {
  overall: 'healthy' | 'warning' | 'error'
  uptime: string
  version: string
  environment: string
  timestamp: string
  services: ServiceStatus[]
}

// 服务状态接口
export interface ServiceStatus {
  name: string
  status: 'healthy' | 'warning' | 'error'
  responseTime: number
  lastCheck: string
  details?: Record<string, any>
}

// 性能指标接口
export interface SystemMetrics {
  system: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    networkLatency: number
  }
  application: {
    activeConnections: number
    requestsPerMinute: number
    averageResponseTime: number
    errorRate: number
  }
  database: {
    connectionPool: number
    queryTime: number
    deadlocks: number
  }
}

// 数据采集状态接口
export interface CollectionStatus {
  dataSources: DataSourceStatus[]
  tasks: CollectionTaskSummary[]
  quality: DataQualityMetrics
}

// 数据源状态接口
export interface DataSourceStatus {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync: string
  totalRecords: number
  successRate: number
  avgResponseTime: number
  errorMessage?: string
}

// 采集任务摘要接口
export interface CollectionTaskSummary {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startTime?: string
  endTime?: string
  recordsProcessed: number
  totalRecords: number
}

// 数据质量指标接口
export interface DataQualityMetrics {
  completeness: number
  accuracy: number
  consistency: number
  timeliness: number
  lastCheck: string
  issues?: QualityIssue[]
}

// 质量问题接口
export interface QualityIssue {
  type: 'error' | 'warning' | 'info'
  description: string
  count: number
  affectedRecords: number
}

// 历史监控数据接口
export interface HistoricalMetrics {
  period: 'hour' | 'day' | 'week' | 'month'
  startTime: string
  endTime: string
  metrics: Array<{
    timestamp: string
    cpu_usage: number
    memory_usage: number
    disk_usage: number
    requests_per_minute: number
    average_response_time: number
    error_rate: number
  }>
}

class SystemService {
  private baseUrl = '/api/system'

  /**
   * 获取系统配置列表
   */
  async getConfigs(params?: ConfigQueryParams): Promise<PaginatedResponse<SystemConfig>> {
    try {
      const queryParams = new URLSearchParams()

      if (params?.category) queryParams.append('category', params.category)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.includePrivate) queryParams.append('includePrivate', params.includePrivate.toString())

      const url = queryParams.toString()
        ? `${this.baseUrl}/config?${queryParams.toString()}`
        : `${this.baseUrl}/config`

      const response = await apiClient.get<PaginatedResponse<SystemConfig>>(url)
      return response.data
    } catch (error: any) {
      console.error('获取系统配置失败:', error)
      throw error
    }
  }

  /**
   * 根据键获取单个配置
   */
  async getConfigByKey(key: string): Promise<ApiResponse<SystemConfig>> {
    try {
      const response = await apiClient.get<ApiResponse<SystemConfig>>(`${this.baseUrl}/config/${key}`)
      return response.data
    } catch (error: any) {
      console.error('获取系统配置详情失败:', error)
      throw error
    }
  }

  /**
   * 创建系统配置
   */
  async createConfig(data: CreateConfigRequest): Promise<ApiResponse<SystemConfig>> {
    try {
      const response = await apiClient.post<ApiResponse<SystemConfig>>(`${this.baseUrl}/config`, data)
      return response.data
    } catch (error: any) {
      console.error('创建系统配置失败:', error)
      throw error
    }
  }

  /**
   * 更新系统配置
   */
  async updateConfig(key: string, data: UpdateConfigRequest): Promise<ApiResponse<SystemConfig>> {
    try {
      const response = await apiClient.put<ApiResponse<SystemConfig>>(`${this.baseUrl}/config/${key}`, data)
      return response.data
    } catch (error: any) {
      console.error('更新系统配置失败:', error)
      throw error
    }
  }

  /**
   * 删除系统配置
   */
  async deleteConfig(key: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(`${this.baseUrl}/config/${key}`)
      return response.data
    } catch (error: any) {
      console.error('删除系统配置失败:', error)
      throw error
    }
  }

  /**
   * 获取配置分类
   */
  async getConfigCategories(): Promise<ApiResponse<ConfigCategory[]>> {
    try {
      const response = await apiClient.get<ApiResponse<ConfigCategory[]>>(`${this.baseUrl}/config/categories`)
      return response.data
    } catch (error: any) {
      console.error('获取配置分类失败:', error)
      throw error
    }
  }

  /**
   * 批量更新配置
   */
  async batchUpdateConfigs(updates: Array<{ key: string; value: any }>): Promise<ApiResponse<SystemConfig[]>> {
    try {
      const response = await apiClient.post<ApiResponse<SystemConfig[]>>(`${this.baseUrl}/config/batch`, { updates })
      return response.data
    } catch (error: any) {
      console.error('批量更新配置失败:', error)
      throw error
    }
  }

  /**
   * 测试配置连接
   */
  async testConfigConnection(key: string): Promise<ApiResponse<{ connected: boolean; message: string }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ connected: boolean; message: string }>>(`${this.baseUrl}/config/${key}/test`)
      return response.data
    } catch (error: any) {
      console.error('测试配置连接失败:', error)
      throw error
    }
  }

  /**
   * 导出配置
   */
  async exportConfigs(format: 'json' | 'yaml' = 'json', category?: string): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('format', format)
      if (category) queryParams.append('category', category)

      const url = `${this.baseUrl}/config/export?${queryParams.toString()}`
      const response = await apiClient.get(url, { responseType: 'blob' })
      return response.data
    } catch (error: any) {
      console.error('导出配置失败:', error)
      throw error
    }
  }

  /**
   * 导入配置
   */
  async importConfigs(file: File, category?: string): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (category) formData.append('category', category)

      const response = await apiClient.post<ApiResponse<{ imported: number; errors: string[] }>>(
        `${this.baseUrl}/config/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return response.data
    } catch (error: any) {
      console.error('导入配置失败:', error)
      throw error
    }
  }

  /**
   * 重置配置到默认值
   */
  async resetConfig(key: string): Promise<ApiResponse<SystemConfig>> {
    try {
      const response = await apiClient.post<ApiResponse<SystemConfig>>(`${this.baseUrl}/config/${key}/reset`)
      return response.data
    } catch (error: any) {
      console.error('重置配置失败:', error)
      throw error
    }
  }

  /**
   * 获取配置历史版本
   */
  async getConfigHistory(key: string): Promise<ApiResponse<Array<{
    id: string
    version: number
    value: any
    changed_by: string
    changed_at: string
    change_reason?: string
  }>>> {
    try {
      const response = await apiClient.get<ApiResponse<Array<{
        id: string
        version: number
        value: any
        changed_by: string
        changed_at: string
        change_reason?: string
      }>>>(`${this.baseUrl}/config/${key}/history`)
      return response.data
    } catch (error: any) {
      console.error('获取配置历史失败:', error)
      throw error
    }
  }

  /**
   * 回滚配置到指定版本
   */
  async rollbackConfig(key: string, version: number): Promise<ApiResponse<SystemConfig>> {
    try {
      const response = await apiClient.post<ApiResponse<SystemConfig>>(`${this.baseUrl}/config/${key}/rollback`, { version })
      return response.data
    } catch (error: any) {
      console.error('回滚配置失败:', error)
      throw error
    }
  }

  /**
   * 验证配置值
   */
  async validateConfigValue(key: string, value: any): Promise<ApiResponse<{ valid: boolean; error?: string }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ valid: boolean; error?: string }>>(`${this.baseUrl}/config/${key}/validate`, { value })
      return response.data
    } catch (error: any) {
      console.error('验证配置值失败:', error)
      throw error
    }
  }

  // ===== 日志管理方法 =====

  /**
   * 获取系统日志列表
   */
  async getLogs(params?: LogQueryParams): Promise<PaginatedResponse<LogItem>> {
    try {
      const queryParams = new URLSearchParams()

      if (params?.activityType) queryParams.append('activityType', params.activityType)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)
      if (params?.userId) queryParams.append('userId', params.userId)
      if (params?.userRole) queryParams.append('userRole', params.userRole)

      const url = queryParams.toString()
        ? `${this.baseUrl}/logs?${queryParams.toString()}`
        : `${this.baseUrl}/logs`

      const response = await apiClient.get<PaginatedResponse<LogItem>>(url)
      return response.data
    } catch (error: any) {
      console.error('获取系统日志失败:', error)
      throw error
    }
  }

  /**
   * 根据ID获取单个日志详情
   */
  async getLogById(id: string): Promise<ApiResponse<LogItem>> {
    try {
      const response = await apiClient.get<ApiResponse<LogItem>>(`${this.baseUrl}/logs/${id}`)
      return response.data
    } catch (error: any) {
      console.error('获取日志详情失败:', error)
      throw error
    }
  }

  /**
   * 获取日志统计数据
   */
  async getLogStatistics(params?: LogStatisticsParams): Promise<ApiResponse<LogStatistics>> {
    try {
      const queryParams = new URLSearchParams()

      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)
      if (params?.activityType) queryParams.append('activityType', params.activityType)

      const url = queryParams.toString()
        ? `${this.baseUrl}/logs/statistics?${queryParams.toString()}`
        : `${this.baseUrl}/logs/statistics`

      const response = await apiClient.get<ApiResponse<LogStatistics>>(url)
      return response.data
    } catch (error: any) {
      console.error('获取日志统计失败:', error)
      throw error
    }
  }

  /**
   * 导出日志
   */
  async exportLogs(params?: LogExportParams): Promise<ApiResponse<LogExportResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<LogExportResponse>>(`${this.baseUrl}/logs/export`, params || {})
      return response.data
    } catch (error: any) {
      console.error('导出日志失败:', error)
      throw error
    }
  }

  /**
   * 清理过期日志
   */
  async cleanupLogs(daysToKeep: number = 90): Promise<ApiResponse<{ deletedCount: number }>> {
    try {
      const response = await apiClient.delete<ApiResponse<{ deletedCount: number }>>(`${this.baseUrl}/logs/cleanup?daysToKeep=${daysToKeep}`)
      return response.data
    } catch (error: any) {
      console.error('清理日志失败:', error)
      throw error
    }
  }

  // ===== 系统监控方法 =====

  /**
   * 获取系统状态
   */
  async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    try {
      const response = await apiClient.get<ApiResponse<SystemStatus>>(`${this.baseUrl}/monitor/status`)
      return response.data
    } catch (error: any) {
      console.error('获取系统状态失败:', error)
      throw error
    }
  }

  /**
   * 获取性能指标
   */
  async getSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
    try {
      const response = await apiClient.get<ApiResponse<SystemMetrics>>(`${this.baseUrl}/monitor/metrics`)
      return response.data
    } catch (error: any) {
      console.error('获取性能指标失败:', error)
      throw error
    }
  }

  /**
   * 获取数据采集状态
   */
  async getDataCollectionStatus(): Promise<ApiResponse<CollectionStatus>> {
    try {
      const response = await apiClient.get<ApiResponse<CollectionStatus>>(`${this.baseUrl}/monitor/collection`)
      return response.data
    } catch (error: any) {
      console.error('获取数据采集状态失败:', error)
      throw error
    }
  }

  /**
   * 触发数据同步
   */
  async triggerDataSync(dataSourceId: string, syncType: 'full' | 'incremental' = 'incremental'): Promise<ApiResponse<{ taskId: string }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ taskId: string }>>(
        `${this.baseUrl}/monitor/collection/${dataSourceId}/sync`,
        { syncType }
      )
      return response.data
    } catch (error: any) {
      console.error('触发数据同步失败:', error)
      throw error
    }
  }

  /**
   * 取消采集任务
   */
  async cancelCollectionTask(taskId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(`${this.baseUrl}/monitor/collection/tasks/${taskId}/cancel`)
      return response.data
    } catch (error: any) {
      console.error('取消采集任务失败:', error)
      throw error
    }
  }

  /**
   * 获取历史监控数据
   */
  async getHistoricalMetrics(period: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<ApiResponse<HistoricalMetrics>> {
    try {
      const response = await apiClient.get<ApiResponse<HistoricalMetrics>>(`${this.baseUrl}/monitor/history?period=${period}`)
      return response.data
    } catch (error: any) {
      console.error('获取历史监控数据失败:', error)
      throw error
    }
  }
}

// 创建单例实例
export const systemService = new SystemService()

// 导出类（如果需要创建多个实例）
export { SystemService }