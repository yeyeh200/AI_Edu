/**
 * 数据清洗和质量控制相关类型定义
 */

// 数据质量问题类型
export enum DataQualityIssueType {
  MISSING_VALUE = 'missing_value',           // 缺失值
  INVALID_FORMAT = 'invalid_format',         // 格式错误
  DUPLICATE_RECORD = 'duplicate_record',     // 重复记录
  OUTLIER = 'outlier',                      // 异常值
  INCONSISTENT_DATA = 'inconsistent_data',   // 不一致数据
  INVALID_RANGE = 'invalid_range',           // 超出范围
  REFERENCE_INTEGRITY = 'reference_integrity', // 引用完整性
  TEMPORAL_INCONSISTENCY = 'temporal_inconsistency', // 时间不一致
  BUSINESS_RULE_VIOLATION = 'business_rule_violation' // 业务规则违反
}

// 数据质量问题严重程度
export enum IssueSeverity {
  LOW = 'low',         // 低：轻微问题，可以忽略
  MEDIUM = 'medium',   // 中：需要处理
  HIGH = 'high',       // 高：必须处理
  CRITICAL = 'critical' // 严重：立即处理
}

// 清洗操作类型
export enum CleaningOperation {
  REMOVE_RECORD = 'remove_record',           // 删除记录
  FILL_DEFAULT = 'fill_default',             // 填充默认值
  FILL_MEAN = 'fill_mean',                   // 填充平均值
  FILL_MEDIAN = 'fill_median',               // 填充中位数
  FILL_MODE = 'fill_mode',                   // 填充众数
  FILL_INTERPOLATION = 'fill_interpolation', // 插值填充
  CORRECT_FORMAT = 'correct_format',         // 格式修正
  NORMALIZE = 'normalize',                   // 标准化
  REMOVE_DUPLICATE = 'remove_duplicate',     // 删除重复
  CAP_OUTLIER = 'cap_outlier',               // 限制异常值
  TRANSFORM = 'transform',                   // 数据转换
  VALIDATE = 'validate',                     // 验证
  MANUAL_REVIEW = 'manual_review'             // 人工审核
}

// 字段定义
export interface FieldDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'phone' | 'array' | 'object'
  required: boolean
  nullable: boolean
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
  pattern?: string // 正则表达式
  allowedValues?: any[] // 允许的值列表
  unique?: boolean // 是否唯一
  reference?: {
    table: string
    field: string
  } // 引用其他表字段
  validationRules?: ValidationRule[]
}

// 验证规则
export interface ValidationRule {
  name: string
  description: string
  condition: (value: any) => boolean
  errorMessage: string
}

// 数据质量问题
export interface DataQualityIssue {
  id: string
  type: DataQualityIssueType
  severity: IssueSeverity
  fieldName: string
  recordId?: string
  description: string
  currentValue?: any
  expectedValue?: any
  suggestedAction?: CleaningOperation
  autoFixable: boolean
  detectedAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolution?: string
}

// 清洗任务
export interface CleaningTask {
  id: string
  name: string
  description: string
  tableName: string
  fieldDefinitions: FieldDefinition[]
  cleaningRules: CleaningRule[]
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  progress: number // 0-100
  startTime?: string
  endTime?: string
  duration?: number
  totalRecords: number
  processedRecords: number
  issuesFound: number
  issuesResolved: number
  errors: string[]
  warnings: string[]
  statistics: CleaningStatistics
  createdAt: string
  updatedAt: string
}

// 清洗规则
export interface CleaningRule {
  id: string
  name: string
  description: string
  fieldName: string
  condition: string // SQL WHERE条件或JavaScript表达式
  operation: CleaningOperation
  parameters?: Record<string, any>
  priority: number // 优先级，数字越大优先级越高
  enabled: boolean
  autoApply: boolean // 是否自动应用
  requireReview: boolean // 是否需要人工审核
}

// 清洗统计信息
export interface CleaningStatistics {
  totalRecords: number
  processedRecords: number
  skippedRecords: number
  issuesFound: {
    [key in DataQualityIssueType]: number
  }
  issuesResolved: {
    [key in DataQualityIssueType]: number
  }
  operationsApplied: {
    [key in CleaningOperation]: number
  }
  qualityScore: {
    before: number
    after: number
    improvement: number
  }
}

// 数据质量报告
export interface DataQualityReport {
  id: string
  tableName: string
  reportDate: string
  totalRecords: number
  qualityScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  issuesByType: {
    [key in DataQualityIssueType]: {
      count: number
      percentage: number
      severity: {
        [key in IssueSeverity]: number
      }
    }
  }
  issuesByField: {
    [fieldName: string]: {
      totalIssues: number
      issues: DataQualityIssue[]
    }
  }
  trends: {
    scoreHistory: Array<{
      date: string
      score: number
    }>
    issueCountHistory: Array<{
      date: string
      count: number
    }>
  }
  recommendations: string[]
  generatedAt: string
}

// 清洗配置
export interface CleaningConfiguration {
  enableAutoFix: boolean
  requireManualReview: boolean
  maxRecordsPerBatch: number
  timeoutPerRecord: number
  enableLogging: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  backupOriginalData: boolean
  retentionDays: number
  qualityThresholds: {
    acceptable: number
    good: number
    excellent: number
  }
}

// 字段统计信息
export interface FieldStatistics {
  fieldName: string
  fieldType: string
  totalValues: number
  nullCount: number
  uniqueCount: number
  duplicates: number
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
  meanValue?: number
  medianValue?: number
  modeValue?: any
  standardDeviation?: number
  outliers: Array<{
    value: any
    score: number
    reason: string
  }>
  patterns: Array<{
    pattern: string
    count: number
    percentage: number
  }>
}

// 数据质量规则
export interface DataQualityRule {
  id: string
  name: string
  description: string
  tableName: string
  fieldName?: string
  ruleType: DataQualityIssueType
  condition: string
  severity: IssueSeverity
  enabled: boolean
  autoFixable: boolean
  suggestedFix: CleaningOperation
  parameters?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// 清洗建议
export interface CleaningSuggestion {
  issueId: string
  fieldName: string
  recordId?: string
  issueType: DataQualityIssueType
  severity: IssueSeverity
  currentValue: any
  suggestedValue?: any
  suggestedOperation: CleaningOperation
  confidence: number // 0-100
  reason: string
  examples?: Array<{
    before: any
    after: any
  }>
}

// 批量清洗结果
export interface BatchCleaningResult {
  taskId: string
  batchId: string
  success: boolean
  startTime: string
  endTime: string
  recordCount: number
  processedCount: number
  issueCount: number
  resolvedCount: number
  errors: string[]
  warnings: string[]
  statistics: CleaningStatistics
}

// 数据质量趋势
export interface QualityTrend {
  timeRange: string // 'day' | 'week' | 'month' | 'year'
  dataPoints: Array<{
    timestamp: string
    qualityScore: number
    totalIssues: number
    resolvedIssues: number
  }>
  trend: 'improving' | 'declining' | 'stable'
  changeRate: number
  forecast?: Array<{
    timestamp: string
    predictedScore: number
  }>
}

// 异常检测结果
export interface OutlierDetectionResult {
  fieldName: string
  method: 'z_score' | 'iqr' | 'isolation_forest' | 'dbscan'
  outliers: Array<{
    recordId: string
    value: number
    score: number
    threshold: number
    reason: string
  }>
  statistics: {
    mean: number
    stdDev: number
    q1: number
    q3: number
    iqr: number
  }
  parameters: {
    threshold: number
    method: string
  }
}