/**
 * AI分析引擎类型定义
 * 定义教学评价AI分析相关的数据结构
 */

import { EvaluationRecord, EvaluationDimension, Teacher, Course, Class, Student, Assignment, ExamScore } from '@/types/database'

/**
 * 分析规则类型
 */
export enum AnalysisRuleType {
  TEACHING_EFFECTIVENESS = 'teaching_effectiveness',       // 教学效果
  STUDENT_ENGAGEMENT = 'student_engagement',             // 学生参与度
  KNOWLEDGE_MASTERY = 'knowledge_mastery',               // 知识掌握度
  COMPLETION_RATE = 'completion_rate',                   // 完成率
  IMPROVEMENT_TREND = 'improvement_trend',               // 进步趋势
  PEER_COMPARISON = 'peer_comparison',                   // 同行比较
  HISTORICAL_COMPARISON = 'historical_comparison',       // 历史比较
  COURSE_DIFFICULTY = 'course_difficulty',               // 课程难度
  ATTENDANCE_IMPACT = 'attendance_impact',               // 出勤影响
  ASSIGNMENT_QUALITY = 'assignment_quality',             // 作业质量
  EXAM_PERFORMANCE = 'exam_performance',                 // 考试表现
  INTERACTION_FREQUENCY = 'interaction_frequency',       // 互动频率
  RESOURCE_UTILIZATION = 'resource_utilization',         // 资源利用
  FEEDBACK_RESPONSIVENESS = 'feedback_responsiveness',   // 反馈响应
  INNOVATIVE_TEACHING = 'innovative_teaching'            // 创新教学
}

/**
 * 聚合方式
 */
export enum AggregationMethod {
  AVERAGE = 'average',           // 平均值
  WEIGHTED_AVERAGE = 'weighted_average', // 加权平均
  MEDIAN = 'median',             // 中位数
  MAX = 'max',                   // 最大值
  MIN = 'min',                   // 最小值
  SUM = 'sum',                   // 求和
  STD_DEV = 'std_dev',           // 标准差
  PERCENTILE = 'percentile'      // 百分位数
}

/**
 * 比较操作符
 */
export enum ComparisonOperator {
  GREATER_THAN = '>',
  LESS_THAN = '<',
  EQUAL = '==',
  GREATER_EQUAL = '>=',
  LESS_EQUAL = '<=',
  NOT_EQUAL = '!='
}

/**
 * 时间窗口
 */
export interface TimeWindow {
  startDate: string
  endDate: string
  type: 'semester' | 'quarter' | 'month' | 'year' | 'custom'
}

/**
 * 分析权重配置
 */
export interface WeightConfig {
  dimension: EvaluationDimension
  weight: number
  enabled: boolean
  description?: string
}

/**
 * 分析规则条件
 */
export interface RuleCondition {
  metric: string
  operator: ComparisonOperator
  value: number | string
  weight?: number
  aggregationMethod?: AggregationMethod
  timeWindow?: TimeWindow
}

/**
 * 分析规则定义
 */
export interface AnalysisRule {
  id: string
  name: string
  description: string
  type: AnalysisRuleType
  category: 'core' | 'optional' | 'custom'
  enabled: boolean
  priority: number
  conditions: RuleCondition[]
  weights: WeightConfig[]
  thresholds: {
    excellent: number
    good: number
    average: number
    poor: number
  }
  parameters: Record<string, any>
  createdAt: string
  updatedAt: string
}

/**
 * 分析指标值
 */
export interface AnalysisMetric {
  name: string
  value: number
  displayName: string
  unit?: string
  description?: string
  source: string
  lastUpdated: string
}

/**
 * 评价维度结果
 */
export interface DimensionResult {
  dimension: EvaluationDimension
  score: number
  level: 'excellent' | 'good' | 'average' | 'poor'
  metrics: AnalysisMetric[]
  weight: number
  contribution: number
  details: {
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
}

/**
 * AI分析结果
 */
export interface AnalysisResult {
  id: string
  teacherId: string
  teacherInfo: Pick<Teacher, 'id' | 'name' | 'employeeId'>
  courseId?: string
  courseInfo?: Pick<Course, 'id' | 'name' | 'code'>
  classId?: string
  classInfo?: Pick<Class, 'id' | 'name'>
  timeWindow: TimeWindow
  overallScore: number
  overallLevel: 'excellent' | 'good' | 'average' | 'poor'
  dimensionResults: DimensionResult[]
  metrics: AnalysisMetric[]
  summary: {
    totalStudents: number
    responseRate: number
    dataCompleteness: number
    confidenceLevel: number
  }
  insights: {
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    trends: {
      metric: string
      direction: 'improving' | 'declining' | 'stable'
      change: number
    }[]
  }
  comparisons: {
    peerRank: number
    peerTotal: number
    departmentRank: number
    departmentTotal: number
    historicalRank: number
    historicalTotal: number
  }
  metadata: {
    analysisVersion: string
    rulesApplied: string[]
    dataSources: string[]
    processingTime: number
    generatedAt: string
  }
}

/**
 * 分析任务
 */
export interface AnalysisTask {
  id: string
  name: string
  description: string
  targetTeacherIds: string[]
  targetCourseIds?: string[]
  targetClassIds?: string[]
  timeWindow: TimeWindow
  rules: string[]
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  results: AnalysisResult[]
  errors: string[]
  warnings: string[]
  createdAt: string
  updatedAt: string
  startedAt?: string
  completedAt?: string
}

/**
 * 批量分析请求
 */
export interface BatchAnalysisRequest {
  name: string
  description?: string
  scope: {
    teacherIds?: string[]
    departmentIds?: string[]
    courseIds?: string[]
    classIds?: string[]
    semester?: string
  }
  timeWindow: TimeWindow
  rules: string[]
  options: {
    includeComparisons: boolean
    includeTrends: boolean
    includeRecommendations: boolean
    confidenceThreshold: number
  }
}

/**
 * 数据源配置
 */
export interface DataSourceConfig {
  name: string
  type: 'database' | 'api' | 'file'
  enabled: boolean
  priority: number
  refreshInterval: number
  lastSync: string
  config: Record<string, any>
}

/**
 * 分析配置
 */
export interface AnalysisConfig {
  version: string
  defaultWeights: WeightConfig[]
  globalThresholds: {
    excellence: number
    satisfactory: number
    improvement: number
  }
  dataSources: DataSourceConfig[]
  aiSettings: {
    enableML: boolean
    modelVersion: string
    confidenceThreshold: number
    enableAutoRecommendations: boolean
  }
  comparisonSettings: {
    enablePeerComparison: boolean
    enableHistoricalComparison: boolean
    peerGroupSize: number
    historicalWindow: number
  }
}

/**
 * 分析报告
 */
export interface AnalysisReport {
  id: string
  taskId: string
  type: 'individual' | 'batch' | 'summary'
  format: 'json' | 'pdf' | 'excel'
  parameters: Record<string, any>
  generatedAt: string
  fileUrl?: string
  size: number
  downloadCount: number
}

/**
 * 规则执行统计
 */
export interface RuleExecutionStats {
  ruleId: string
  ruleName: string
  executionCount: number
  averageScore: number
  scoreDistribution: Record<string, number>
  executionTime: number
  lastExecuted: string
  errorCount: number
}

/**
 * 系统性能指标
 */
export interface SystemPerformance {
  totalAnalyses: number
  averageProcessingTime: number
  successRate: number
  errorRate: number
  cacheHitRate: number
  memoryUsage: number
  cpuUsage: number
  activeTasks: number
  queuedTasks: number
}

/**
 * 分析缓存项
 */
export interface AnalysisCache {
  key: string
  result: AnalysisResult
  expiresAt: string
  hitCount: number
  lastAccessed: string
}

/**
 * 数据质量指标
 */
export interface DataQualityMetrics {
  completeness: number
  accuracy: number
  consistency: number
  timeliness: number
  validity: number
  overall: number
  issues: {
    type: string
    count: number
    severity: 'low' | 'medium' | 'high'
  }[]
}

/**
 * 分析模板
 */
export interface AnalysisTemplate {
  id: string
  name: string
  description: string
  category: 'formal' | 'informal' | 'peer' | 'self' | 'custom'
  rules: string[]
  weights: WeightConfig[]
  thresholds: {
    excellent: number
    good: number
    average: number
    poor: number
  }
  isDefault: boolean
  usageCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
}