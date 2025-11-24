/**
 * 数据采集和监控相关类型定义
 */

// 数据采集任务状态
export type CollectionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused'

// 数据类型枚举
export enum DataType {
  USERS = 'users',
  COURSES = 'courses',
  ATTENDANCE = 'attendance',
  ASSIGNMENTS = 'assignments',
  EXAM_SCORES = 'exam_scores',
  EVALUATIONS = 'evaluations',
  TEACHING_ACTIVITIES = 'teaching_activities',
  CLASSES = 'classes'
}

// 采集任务配置
export interface CollectionTask {
  id: string
  name: string
  description: string
  dataType: DataType
  schedule: string // cron表达式
  enabled: boolean
  status: CollectionStatus
  lastRunAt?: string
  nextRunAt?: string
  duration?: number // 执行时长（毫秒）
  recordCount: number
  successCount: number
  errorCount: number
  errors?: CollectionError[]
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

// 采集错误信息
export interface CollectionError {
  timestamp: string
  error: string
  details?: any
  retryCount: number
}

// 数据质量检查结果
export interface DataQualityResult {
  dataType: DataType
  totalRecords: number
  validRecords: number
  invalidRecords: number
  duplicateRecords: number
  missingFields: MissingFieldStats[]
  dataRange?: DataRange
  qualityScore: number // 0-100
  issues: QualityIssue[]
  checkedAt: string
}

// 缺失字段统计
export interface MissingFieldStats {
  fieldName: string
  count: number
  percentage: number
}

// 数据范围信息
export interface DataRange {
  startDate: string
  endDate: string
  minDate?: string
  maxDate?: string
}

// 质量问题
export interface QualityIssue {
  type: 'missing_data' | 'invalid_format' | 'duplicate' | 'out_of_range' | 'inconsistent'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  affectedRecords: number
  examples?: any[]
}

// 采集统计信息
export interface CollectionStatistics {
  today: {
    totalTasks: number
    completedTasks: number
    failedTasks: number
    totalRecords: number
    successRate: number
  }
  thisWeek: {
    totalTasks: number
    completedTasks: number
    failedTasks: number
    totalRecords: number
    successRate: number
  }
  thisMonth: {
    totalTasks: number
    completedTasks: number
    failedTasks: number
    totalRecords: number
    successRate: number
  }
  overall: {
    totalTasks: number
    completedTasks: number
    failedTasks: number
    totalRecords: number
    successRate: number
    averageDuration: number
  }
}

// 系统监控指标
export interface SystemMetrics {
  timestamp: string
  cpu: {
    usage: number
    loadAverage: number[]
  }
  memory: {
    total: number
    used: number
    free: number
    usage: number
  }
  disk: {
    total: number
    used: number
    free: number
    usage: number
  }
  network: {
    bytesIn: number
    bytesOut: number
    connections: number
  }
  database: {
    connections: number
    queryTime: number
    errorCount: number
  }
  api: {
    requestsPerSecond: number
    averageResponseTime: number
    errorRate: number
  }
}

// 数据采集配置
export interface CollectionConfig {
  batchSize: number
  retryAttempts: number
  retryDelay: number
  timeout: number
  enableDataValidation: boolean
  enableDeduplication: boolean
  enableQualityCheck: boolean
  retentionPeriod: number // 数据保留天数
  maxConcurrentTasks: number
}

// 采集日志
export interface CollectionLog {
  id: string
  taskId: string
  taskName: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  details?: any
  timestamp: string
  duration?: number
}

// 数据同步状态
export interface SyncStatus {
  dataType: DataType
  lastSyncTime: string
  lastSuccessfulSync: string
  totalRecords: number
  syncedRecords: number
  pendingRecords: number
  errorRecords: number
  status: 'idle' | 'syncing' | 'completed' | 'failed'
  progress: number // 0-100
  errorMessage?: string
}

// 采集任务执行结果
export interface TaskExecutionResult {
  taskId: string
  success: boolean
  startTime: string
  endTime: string
  duration: number
  recordCount: number
  successCount: number
  errorCount: number
  errors: string[]
  warnings: string[]
  metadata: Record<string, any>
}

// 数据源连接状态
export interface DataSourceStatus {
  name: string
  type: 'zhijiaoyun' | 'database' | 'file' | 'api'
  status: 'connected' | 'disconnected' | 'error'
  lastCheckTime: string
  responseTime?: number
  errorMessage?: string
  configuration: Record<string, any>
}

// 预警规则
export interface AlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  condition: AlertCondition
  actions: AlertAction[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  cooldownPeriod: number // 冷却期（秒）
  createdAt: string
  updatedAt: string
}

// 预警条件
export interface AlertCondition {
  metric: string
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'in' | 'not_in'
  threshold: number | string | Array<number | string>
  duration?: number // 持续时间（秒）
}

// 预警动作
export interface AlertAction {
  type: 'email' | 'webhook' | 'log' | 'notification'
  config: Record<string, any>
}

// 预警事件
export interface AlertEvent {
  id: string
  ruleId: string
  ruleName: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  details: Record<string, any>
  status: 'active' | 'resolved' | 'acknowledged'
  triggeredAt: string
  resolvedAt?: string
  acknowledgedAt?: string
  acknowledgedBy?: string
}

// 性能指标
export interface PerformanceMetrics {
  timestamp: string
  collectionTasks: {
    total: number
    running: number
    completed: number
    failed: number
  }
  dataQuality: {
    overallScore: number
    validRecords: number
    invalidRecords: number
    duplicateRecords: number
  }
  systemHealth: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
  apiPerformance: {
    requestCount: number
    averageResponseTime: number
    errorRate: number
  }
}