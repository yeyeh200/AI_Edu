/**
 * 评价指标计算相关类型定义
 * 定义教学评价各种指标的计算逻辑和数据结构
 */

import { EvaluationRecord, EvaluationDimension } from '@/types/index.ts'

/**
 * 指标计算方法
 */
export enum CalculationMethod {
  AVERAGE = 'average',                    // 算术平均
  WEIGHTED_AVERAGE = 'weighted_average', // 加权平均
  MEDIAN = 'median',                     // 中位数
  MODE = 'mode',                         // 众数
  STANDARD_DEVIATION = 'std_dev',        // 标准差
  VARIANCE = 'variance',                 // 方差
  PERCENTILE = 'percentile',             // 百分位数
  Z_SCORE = 'z_score',                  // Z分数
  T_SCORE = 't_score',                  // T分数
  NORMALIZATION = 'normalization',       // 标准化
  MIN_MAX_SCALING = 'min_max_scaling',  // 最小-最大缩放
  ROBUST_SCALING = 'robust_scaling'      // 鲁棒缩放
}

/**
 * 聚合级别
 */
export enum AggregationLevel {
  INDIVIDUAL = 'individual',    // 个人级别
  CLASS = 'class',             // 班级级别
  COURSE = 'course',           // 课程级别
  DEPARTMENT = 'department',   // 院系级别
  SCHOOL = 'school',           // 学校级别
  SYSTEM = 'system'            // 系统级别
}

/**
 * 权重分配策略
 */
export enum WeightingStrategy {
  EQUAL = 'equal',              // 等权重
  EXPERT_JUDGMENT = 'expert_judgment', // 专家判断
  STATISTICAL = 'statistical',  // 统计方法
  AHP = 'ahp',                  // 层次分析法
  ENTROPY = 'entropy',          // 熵权法
  PCA = 'pca',                  // 主成分分析
  MACHINE_LEARNING = 'ml'       // 机器学习
}

/**
 * 时间序列类型
 */
export enum TimeSeriesType {
  CROSS_SECTIONAL = 'cross_sectional',   // 横截面数据
  TIME_SERIES = 'time_series',          // 时间序列数据
  PANEL_DATA = 'panel_data'             // 面板数据
}

/**
 * 指标定义
 */
export interface EvaluationMetric {
  id: string
  name: string
  displayName: string
  description: string
  category: 'input' | 'process' | 'output' | 'outcome'
  dimension: EvaluationDimension
  dataType: 'numeric' | 'categorical' | 'ordinal' | 'boolean'
  scale: 'nominal' | 'ordinal' | 'interval' | 'ratio'
  unit?: string
  range: {
    min: number
    max: number
  }
  calculationMethod: CalculationMethod
  aggregationMethod: CalculationMethod
  weight: number
  enabled: boolean
  required: boolean
  source: string
  validationRules: ValidationRule[]
  createdAt: string
  updatedAt: string
}

/**
 * 验证规则
 */
export interface ValidationRule {
  type: 'range' | 'pattern' | 'required' | 'unique' | 'consistency'
  rule: string
  message: string
  severity: 'error' | 'warning' | 'info'
}

/**
 * 权重配置
 */
export interface WeightConfiguration {
  id: string
  name: string
  description: string
  strategy: WeightingStrategy
  dimensions: DimensionWeight[]
  criteria: CriterionWeight[]
  totalWeight: number
  normalized: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 维度权重
 */
export interface DimensionWeight {
  dimension: EvaluationDimension
  weight: number
  description?: string
  justification?: string
  adjusted: boolean
}

/**
 * 标准权重
 */
export interface CriterionWeight {
  criterionId: string
  criterionName: string
  weight: number
  subCriteria: SubCriterionWeight[]
}

/**
 * 子标准权重
 */
export interface SubCriterionWeight {
  id: string
  name: string
  weight: number
  parentId: string
}

/**
 * 计算上下文
 */
export interface CalculationContext {
  evaluationId: string
  evaluatorId: string
  evaluateeId: string
  evaluationType: 'self' | 'peer' | 'student' | 'expert' | 'admin'
  timeWindow: {
    startDate: string
    endDate: string
  }
  aggregationLevel: AggregationLevel
  weightingStrategy: WeightingStrategy
  calculationMethod: CalculationMethod
  exclusionCriteria: string[]
  inclusionCriteria: string[]
  parameters: Record<string, any>
}

/**
 * 原始数据
 */
export interface RawData {
  id: string
  metricId: string
  value: number | string | boolean
  source: string
  timestamp: string
  quality: number
  metadata: Record<string, any>
}

/**
 * 计算结果
 */
export interface CalculationResult {
  metricId: string
  metricName: string
  rawValue: number | string | boolean
  normalizedValue: number
  weightedValue: number
  score: number
  level: 'excellent' | 'good' | 'average' | 'poor'
  confidence: number
  sampleSize: number
  validity: boolean
  explanation: string
  components: ComponentResult[]
  metadata: {
    calculationMethod: CalculationMethod
    processingTime: number
    dataQuality: number
    outlierCount: number
    missingCount: number
  }
}

/**
 * 组件结果
 */
export interface ComponentResult {
  name: string
  value: number
  weight: number
  contribution: number
  description: string
}

/**
 * 评价维度结果
 */
export interface DimensionResult {
  dimension: EvaluationDimension
  score: number
  level: 'excellent' | 'good' | 'average' | 'poor'
  weight: number
  contribution: number
  metrics: CalculationResult[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

/**
 * 综合评价结果
 */
export interface OverallEvaluationResult {
  id: string
  evaluateeId: string
  evaluateeType: 'teacher' | 'course' | 'class'
  evaluationPeriod: string
  overallScore: number
  overallLevel: 'excellent' | 'good' | 'average' | 'poor'
  dimensionResults: DimensionResult[]
  metricResults: CalculationResult[]
  summary: {
    totalMetrics: number
    validMetrics: number
    responseRate: number
    dataCompleteness: number
    reliability: number
    validity: number
    fairness: number
  }
  insights: {
    keyStrengths: string[]
    improvementAreas: string[]
    recommendations: string[]
    trends: TrendAnalysis[]
  }
  comparisons: ComparisonResult[]
  distribution: ScoreDistribution
  metadata: {
    calculationEngine: string
    algorithmVersion: string
    processingTime: number
    timestamp: string
    dataSource: string[]
  }
}

/**
 * 趋势分析
 */
export interface TrendAnalysis {
  metric: string
  direction: 'improving' | 'declining' | 'stable'
  changeRate: number
  significance: number
  timePoints: TimePoint[]
  forecast: ForecastData[]
}

/**
 * 时间点数据
 */
export interface TimePoint {
  timestamp: string
  value: number
  sampleSize: number
  confidence: number
}

/**
 * 预测数据
 */
export interface ForecastData {
  timestamp: string
  predictedValue: number
  confidenceInterval: {
    lower: number
    upper: number
  }
  probability: number
}

/**
 * 比较结果
 */
export interface ComparisonResult {
  type: 'peer' | 'historical' | 'benchmark' | 'standard'
  referenceGroup: string
  referenceScore: number
  relativeScore: number
  percentile: number
  rank: number
  totalSize: number
  significance: number
  effectSize: number
}

/**
 * 分数分布
 */
export interface ScoreDistribution {
  mean: number
  median: number
  mode: number
  standardDeviation: number
  variance: number
  skewness: number
  kurtosis: number
  range: {
    min: number
    max: number
    interquartile: number
  }
  percentiles: {
    p25: number
    p50: number
    p75: number
    p90: number
    p95: number
    p99: number
  }
  histogram: HistogramBin[]
}

/**
 * 直方图分箱
 */
export interface HistogramBin {
  range: [number, number]
  frequency: number
  percentage: number
  cumulative: number
}

/**
 * 统计检验结果
 */
export interface StatisticalTest {
  testType: 't_test' | 'chi_square' | 'anova' | 'mann_whitney' | 'kruskal_wallis'
  statistic: number
  pValue: number
  criticalValue: number
  significant: boolean
  effectSize: number
  confidenceInterval: {
    lower: number
    upper: number
  }
  interpretation: string
}

/**
 * 可靠性分析
 */
export interface ReliabilityAnalysis {
  type: 'cronbach_alpha' | 'split_half' | 'test_retest' | 'inter_rater'
  coefficient: number
  interpretation: 'excellent' | 'good' | 'acceptable' | 'questionable' | 'poor'
  items: ItemReliability[]
  confidenceInterval: {
    lower: number
    upper: number
  }
  recommendations: string[]
}

/**
 * 项目可靠性
 */
export interface ItemReliability {
  itemId: string
  itemName: string
  correctedTotalCorrelation: number
  cronbachAlphaIfDeleted: number
  contribution: number
}

/**
 * 效度分析
 */
export interface ValidityAnalysis {
  type: 'content' | 'criterion' | 'construct' | 'convergent' | 'discriminant'
  coefficient: number
  interpretation: string
  evidence: ValidationEvidence[]
  limitations: string[]
  recommendations: string[]
}

/**
 * 验证证据
 */
export interface ValidationEvidence {
  evidenceType: string
  description: string
  strength: 'strong' | 'moderate' | 'weak'
  source: string
  date: string
}

/**
 * 公平性分析
 */
export interface FairnessAnalysis {
  dimension: 'gender' | 'age' | 'ethnicity' | 'discipline' | 'experience'
  groupResults: GroupFairnessResult[]
  overallFairness: number
  biasDetected: boolean
  mitigation: string[]
}

/**
 * 组公平性结果
 */
export interface GroupFairnessResult {
  groupName: string
  groupSize: number
  meanScore: number
  standardDeviation: number
  difference: number
  effectSize: number
  significance: number
}

/**
 * 计算配置
 */
export interface CalculationConfiguration {
  id: string
  name: string
  description: string
  version: string
  metrics: EvaluationMetric[]
  weightConfiguration: WeightConfiguration
  calculationSettings: {
    defaultMethod: CalculationMethod
    aggregationMethod: CalculationMethod
    normalizationMethod: 'z_score' | 'min_max' | 'robust'
    outlierDetection: {
      method: 'iqr' | 'z_score' | 'isolation_forest'
      threshold: number
      action: 'remove' | 'adjust' | 'flag'
    }
    missingData: {
      method: 'listwise' | 'pairwise' | 'imputation'
      threshold: number
    }
    reliability: {
      minimumAlpha: number
      testMethod: string
    }
  }
  validation: {
    dataQuality: number
    minimumSampleSize: number
    responseRate: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 批量计算任务
 */
export interface BatchCalculationTask {
  id: string
  name: string
  description: string
  targetIds: string[]
  targetType: 'teacher' | 'course' | 'class'
  configurationId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  results: OverallEvaluationResult[]
  errors: CalculationError[]
  warnings: string[]
  statistics: TaskStatistics
  createdAt: string
  updatedAt: string
  startedAt?: string
  completedAt?: string
}

/**
 * 计算错误
 */
export interface CalculationError {
  id: string
  targetId: string
  errorType: 'data_quality' | 'calculation' | 'validation' | 'system'
  errorMessage: string
  errorDetails: Record<string, any>
  severity: 'error' | 'warning' | 'info'
  resolved: boolean
  resolution?: string
  timestamp: string
}

/**
 * 任务统计
 */
export interface TaskStatistics {
  totalTargets: number
  processedTargets: number
  successfulCalculations: number
  failedCalculations: number
  averageProcessingTime: number
  averageScore: number
  scoreDistribution: ScoreDistribution
  dataQualitySummary: {
    averageQuality: number
    qualityDistribution: Record<string, number>
  }
}

/**
 * 计算模板
 */
export interface CalculationTemplate {
  id: string
  name: string
  description: string
  category: 'formal_evaluation' | 'informal_feedback' | 'peer_review' | 'self_assessment'
  targetType: 'teacher' | 'course' | 'class'
  configurationId: string
  defaultSettings: Record<string, any>
  isPublic: boolean
  usageCount: number
  rating: number
  createdBy: string
  createdAt: string
  updatedAt: string
}