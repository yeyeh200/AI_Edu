/**
 * 评价指标计算服务
 * 实现教学评价各种指标的计算逻辑和统计算法
 */

import { DatabaseService } from './databaseService.ts'
import { AIAnalysisEngine } from './aiAnalysisEngine.ts'
import { config } from '@/config/config'
import {
  EvaluationMetric,
  CalculationContext,
  CalculationResult,
  OverallEvaluationResult,
  DimensionResult,
  WeightConfiguration,
  CalculationMethod,
  AggregationLevel,
  WeightingStrategy,
  TimeSeriesType,
  RawData,
  ComponentResult,
  TrendAnalysis,
  ComparisonResult,
  ScoreDistribution,
  StatisticalTest,
  ReliabilityAnalysis,
  ValidityAnalysis,
  FairnessAnalysis,
  CalculationConfiguration,
  BatchCalculationTask,
  HistogramBin,
  ValidationRule,
  TimePoint,
  ForecastData,
  GroupFairnessResult,
  ItemReliability,
  ValidationEvidence
} from '@/types/evaluationMetrics'
import {
  EvaluationRecord,
  EvaluationDimension,
  Teacher,
  Course,
  Class
} from '@/types/database'

export class EvaluationCalculator {
  private dbService: DatabaseService
  private aiEngine: AIAnalysisEngine
  private metrics: Map<string, EvaluationMetric>
  private weightConfigs: Map<string, WeightConfiguration>
  private calculationConfigs: Map<string, CalculationConfiguration>

  constructor() {
    this.dbService = new DatabaseService()
    this.aiEngine = new AIAnalysisEngine()
    this.metrics = new Map()
    this.weightConfigs = new Map()
    this.calculationConfigs = new Map()

    // 初始化默认指标
    this.initializeDefaultMetrics()

    // 初始化默认权重配置
    this.initializeDefaultWeightConfigs()

    // 初始化默认计算配置
    this.initializeDefaultCalculationConfigs()
  }

  /**
   * 初始化默认评价指标
   */
  private initializeDefaultMetrics(): void {
    // 教学态度指标
    this.addMetric({
      id: 'teaching_attitude_preparation',
      name: '教学态度-备课充分',
      displayName: '备课充分程度',
      description: '教师课前准备工作的充分性和系统性',
      category: 'input',
      dimension: EvaluationDimension.TEACHING_ATTITUDE,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_attitude_responsibility',
      name: '教学态度-责任心',
      displayName: '教学责任心',
      description: '教师对教学工作的责任心和投入程度',
      category: 'input',
      dimension: EvaluationDimension.TEACHING_ATTITUDE,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_attitude_patience',
      name: '教学态度-耐心细致',
      displayName: '耐心细致程度',
      description: '教师在教学过程中的耐心程度和对细节的关注',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_ATTITUDE,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_attitude_fairness',
      name: '教学态度-公平公正',
      displayName: '公平公正程度',
      description: '教师对待所有学生的公平性和公正性',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_ATTITUDE,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 教学内容指标
    this.addMetric({
      id: 'teaching_content_accuracy',
      name: '教学内容-准确性',
      displayName: '内容准确性',
      description: '教学内容的科学性、准确性和前沿性',
      category: 'input',
      dimension: EvaluationDimension.TEACHING_CONTENT,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.3,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_content_depth',
      name: '教学内容-深度广度',
      displayName: '内容深度与广度',
      description: '教学内容的深度和广度是否适当',
      category: 'input',
      dimension: EvaluationDimension.TEACHING_CONTENT,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_content_organization',
      name: '教学内容-组织性',
      displayName: '内容组织性',
      description: '教学内容的组织结构是否清晰合理',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_CONTENT,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_content_relevance',
      name: '教学内容-实用性',
      displayName: '内容实用性',
      description: '教学内容与实践应用的结合程度',
      category: 'output',
      dimension: EvaluationDimension.TEACHING_CONTENT,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.2,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 教学方法指标
    this.addMetric({
      id: 'teaching_method_clarity',
      name: '教学方法-表达清晰',
      displayName: '表达清晰度',
      description: '教师的语言表达是否清晰易懂',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_METHOD,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_method_interaction',
      name: '教学方法-互动性',
      displayName: '课堂互动性',
      description: '课堂互动氛围和师生交流情况',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_METHOD,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_method_innovation',
      name: '教学方法-创新性',
      displayName: '方法创新性',
      description: '教学方法的创新性和多样性',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_METHOD,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: false,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_method_technology',
      name: '教学方法-技术应用',
      displayName: '技术应用水平',
      description: '现代教学技术的运用情况',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_METHOD,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: false,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 教学效果指标
    this.addMetric({
      id: 'teaching_effect_learning',
      name: '教学效果-学习效果',
      displayName: '学生学习效果',
      description: '学生的学习成果和能力提升情况',
      category: 'outcome',
      dimension: EvaluationDimension.TEACHING_EFFECT,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.3,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_effect_interest',
      name: '教学效果-兴趣激发',
      displayName: '学习兴趣激发',
      description: '对学生学习兴趣的激发程度',
      category: 'outcome',
      dimension: EvaluationDimension.TEACHING_EFFECT,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_effect_ability',
      name: '教学效果-能力培养',
      displayName: '能力培养效果',
      description: '学生综合能力的培养效果',
      category: 'outcome',
      dimension: EvaluationDimension.TEACHING_EFFECT,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.25,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_effect_satisfaction',
      name: '教学效果-满意度',
      displayName: '教学满意度',
      description: '学生对教学效果的总体满意度',
      category: 'outcome',
      dimension: EvaluationDimension.TEACHING_EFFECT,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.2,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 教书育人指标
    this.addMetric({
      id: 'teaching_ethics_role_model',
      name: '教书育人-为人师表',
      displayName: '为人师表',
      description: '教师的品德修养和表率作用',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_ETHICS,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.3,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_ethics_care',
      name: '教书育人-关爱学生',
      displayName: '关爱学生',
      description: '教师对学生的关心和帮助程度',
      category: 'process',
      dimension: EvaluationDimension.TEACHING_ETHICS,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.35,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    this.addMetric({
      id: 'teaching_ethics_guidance',
      name: '教书育人-思想引导',
      displayName: '思想引导',
      description: '对学生思想成长的引导和帮助',
      category: 'outcome',
      dimension: EvaluationDimension.TEACHING_ETHICS,
      dataType: 'numeric',
      scale: 'ratio',
      unit: '分',
      range: { min: 0, max: 100 },
      calculationMethod: CalculationMethod.AVERAGE,
      aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
      weight: 0.35,
      enabled: true,
      required: true,
      source: 'student_evaluation',
      validationRules: [
        { type: 'range', rule: 'value >= 0 && value <= 100', message: '分数必须在0-100之间', severity: 'error' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * 初始化默认权重配置
   */
  private initializeDefaultWeightConfigs(): void {
    const defaultWeightConfig: WeightConfiguration = {
      id: 'default_weight_config',
      name: '默认权重配置',
      description: '系统默认的教学评价权重分配',
      strategy: WeightingStrategy.EXPERT_JUDGMENT,
      dimensions: [
        {
          dimension: EvaluationDimension.TEACHING_ATTITUDE,
          weight: 0.15,
          description: '教学态度包括备课充分、责任心、耐心细致、公平公正',
          justification: '基于教育理论和专家意见，教学态度是基础要素',
          adjusted: false
        },
        {
          dimension: EvaluationDimension.TEACHING_CONTENT,
          weight: 0.25,
          description: '教学内容包括准确性、深度广度、组织性、实用性',
          justification: '教学内容是教学的核心，占较大权重',
          adjusted: false
        },
        {
          dimension: EvaluationDimension.TEACHING_METHOD,
          weight: 0.25,
          description: '教学方法包括表达清晰、互动性、创新性、技术应用',
          justification: '教学方法直接影响教学效果，权重较高',
          adjusted: false
        },
        {
          dimension: EvaluationDimension.TEACHING_EFFECT,
          weight: 0.30,
          description: '教学效果包括学习效果、兴趣激发、能力培养、满意度',
          justification: '教学效果是最终目标，权重最高',
          adjusted: false
        },
        {
          dimension: EvaluationDimension.TEACHING_ETHICS,
          weight: 0.05,
          description: '教书育人包括为人师表、关爱学生、思想引导',
          justification: '教书育人是重要但难以量化的方面',
          adjusted: false
        }
      ],
      criteria: [],
      totalWeight: 1.0,
      normalized: true,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.weightConfigs.set(defaultWeightConfig.id, defaultWeightConfig)
  }

  /**
   * 初始化默认计算配置
   */
  private initializeDefaultCalculationConfigs(): void {
    const defaultConfig: CalculationConfiguration = {
      id: 'default_calculation_config',
      name: '默认计算配置',
      description: '系统默认的评价指标计算配置',
      version: '1.0.0',
      metrics: Array.from(this.metrics.values()),
      weightConfiguration: this.weightConfigs.get('default_weight_config')!,
      calculationSettings: {
        defaultMethod: CalculationMethod.WEIGHTED_AVERAGE,
        aggregationMethod: CalculationMethod.WEIGHTED_AVERAGE,
        normalizationMethod: 'z_score',
        outlierDetection: {
          method: 'iqr',
          threshold: 1.5,
          action: 'adjust'
        },
        missingData: {
          method: 'listwise',
          threshold: 0.2
        },
        reliability: {
          minimumAlpha: 0.7,
          testMethod: 'cronbach_alpha'
        }
      },
      validation: {
        dataQuality: 0.8,
        minimumSampleSize: 10,
        responseRate: 0.6
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.calculationConfigs.set(defaultConfig.id, defaultConfig)
  }

  /**
   * 计算综合评价结果
   */
  async calculateOverallEvaluation(
    evaluateeId: string,
    evaluateeType: 'teacher' | 'course' | 'class',
    context: CalculationContext
  ): Promise<OverallEvaluationResult> {
    const startTime = Date.now()

    try {
      // 获取配置
      const config = this.calculationConfigs.get(context.parameters.configId || 'default_calculation_config')
      if (!config) {
        throw new Error('计算配置不存在')
      }

      // 获取原始数据
      const rawData = await this.collectRawData(evaluateeId, evaluateeType, context)

      // 数据质量检查
      const dataQuality = this.assessDataQuality(rawData)
      if (dataQuality.overall < config.validation.dataQuality) {
        throw new Error('数据质量不满足计算要求')
      }

      // 计算各指标结果
      const metricResults: CalculationResult[] = []
      for (const metric of config.metrics) {
        if (metric.enabled) {
          const result = await this.calculateMetric(metric, rawData, context)
          metricResults.push(result)
        }
      }

      // 按维度聚合结果
      const dimensionResults = await this.aggregateByDimensions(metricResults, config.weightConfiguration)

      // 计算总体分数
      const overallScore = this.calculateOverallScore(dimensionResults)
      const overallLevel = this.getScoreLevel(overallScore)

      // 生成洞察分析
      const insights = await this.generateInsights(dimensionResults, rawData, context)

      // 执行比较分析
      const comparisons = await this.performComparisons(evaluateeId, overallScore, context)

      // 计算分数分布
      const distribution = await this.calculateScoreDistribution(metricResults)

      // 计算总结统计
      const summary = this.calculateSummary(metricResults, rawData)

      const result: OverallEvaluationResult = {
        id: crypto.randomUUID(),
        evaluateeId,
        evaluateeType,
        evaluationPeriod: `${context.timeWindow.startDate} - ${context.timeWindow.endDate}`,
        overallScore,
        overallLevel,
        dimensionResults,
        metricResults,
        summary,
        insights,
        comparisons,
        distribution,
        metadata: {
          calculationEngine: 'EvaluationCalculator v1.0.0',
          algorithmVersion: config.version,
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          dataSource: [...new Set(rawData.map(d => d.source))]
        }
      }

      return result
    } catch (error: any) {
      console.error('综合评价计算失败:', error)
      throw error
    }
  }

  /**
   * 计算单个指标
   */
  async calculateMetric(
    metric: EvaluationMetric,
    rawData: RawData[],
    context: CalculationContext
  ): Promise<CalculationResult> {
    // 获取该指标的原始数据
    const metricData = rawData.filter(d => d.metricId === metric.id)

    if (metricData.length === 0) {
      throw new Error(`指标 ${metric.name} 没有数据`)
    }

    // 数据预处理
    const processedData = this.preprocessData(metricData, metric)

    // 计算原始值
    const rawValue = this.calculateRawValue(processedData, metric.calculationMethod)

    // 标准化处理
    const normalizedValue = this.normalizeValue(rawValue, metric)

    // 应用权重
    const weightedValue = normalizedValue * metric.weight

    // 转换为评分
    const score = this.convertToScore(weightedValue, metric)

    // 确定等级
    const level = this.getScoreLevel(score)

    // 计算置信度
    const confidence = this.calculateConfidence(processedData)

    // 生成解释
    const explanation = this.generateExplanation(metric, processedData, score)

    // 分解计算组件
    const components = this.decalcComponents(processedData, metric)

    return {
      metricId: metric.id,
      metricName: metric.name,
      rawValue,
      normalizedValue,
      weightedValue,
      score,
      level,
      confidence,
      sampleSize: processedData.length,
      validity: this.validateResult(score, metric),
      explanation,
      components,
      metadata: {
        calculationMethod: metric.calculationMethod,
        processingTime: 0,
        dataQuality: this.assessDataQuality(processedData).overall,
        outlierCount: this.detectOutliers(processedData).length,
        missingCount: metricData.filter(d => d.value === null || d.value === undefined).length
      }
    }
  }

  /**
   * 收集原始数据
   */
  private async collectRawData(
    evaluateeId: string,
    evaluateeType: 'teacher' | 'course' | 'class',
    context: CalculationContext
  ): Promise<RawData[]> {
    const rawData: RawData[] = []

    try {
      // 从数据库获取评价记录
      const evaluationRecords = await this.dbService.query(`
        SELECT * FROM evaluation_records
        WHERE ${this.getEvaluateeField(evaluateeType)} = $1
          AND created_at >= $2
          AND created_at <= $3
      `, [evaluateeId, context.timeWindow.startDate, context.timeWindow.endDate])

      // 转换为原始数据格式
      for (const record of evaluationRecords.rows) {
        if (record.dimension_scores) {
          const dimensionScores = typeof record.dimension_scores === 'string'
            ? JSON.parse(record.dimension_scores)
            : record.dimension_scores

          for (const [metricId, score] of Object.entries(dimensionScores)) {
            rawData.push({
              id: crypto.randomUUID(),
              metricId,
              value: Number(score),
              source: 'evaluation_records',
              timestamp: record.created_at,
              quality: 1.0,
              metadata: {
                evaluatorId: record.evaluator_id,
                evaluationType: record.evaluation_type,
                recordId: record.id
              }
            })
          }
        }
      }

      // 获取其他数据源的数据（如考试成绩、出勤率等）
      const additionalData = await this.collectAdditionalData(evaluateeId, evaluateeType, context)
      rawData.push(...additionalData)

    } catch (error: any) {
      console.error('收集原始数据失败:', error)
      throw new Error(`数据收集失败: ${error.message}`)
    }

    return rawData
  }

  /**
   * 收集额外数据
   */
  private async collectAdditionalData(
    evaluateeId: string,
    evaluateeType: 'teacher' | 'course' | 'class',
    context: CalculationContext
  ): Promise<RawData[]> {
    const additionalData: RawData[] = []

    try {
      // 根据评价对象类型获取不同的数据
      if (evaluateeType === 'teacher') {
        // 获取教师相关的数据
        const courseData = await this.getCourseEvaluationData(evaluateeId, context)
        additionalData.push(...courseData)

        const studentPerformanceData = await this.getStudentPerformanceData(evaluateeId, context)
        additionalData.push(...studentPerformanceData)

      } else if (evaluateeType === 'course') {
        // 获取课程相关的数据
        const courseStats = await this.getCourseStatistics(evaluateeId, context)
        additionalData.push(...courseStats)

      } else if (evaluateeType === 'class') {
        // 获取班级相关的数据
        const classStats = await this.getClassStatistics(evaluateeId, context)
        additionalData.push(...classStats)
      }

    } catch (error: any) {
      console.warn('收集额外数据失败:', error.message)
    }

    return additionalData
  }

  /**
   * 获取课程评价数据
   */
  private async getCourseEvaluationData(
    teacherId: string,
    context: CalculationContext
  ): Promise<RawData[]> {
    const data: RawData[] = []

    try {
      // 获取教师所授课程的学生成绩数据
      const examScores = await this.dbService.query(`
        SELECT c.course_id, c.name as course_name,
               AVG(es.score) as avg_score,
               COUNT(*) as student_count,
               COUNT(CASE WHEN es.score >= 60 THEN 1 END) as pass_count
        FROM exam_scores es
        JOIN courses c ON es.course_id = c.id
        WHERE c.teacher_id = $1
          AND es.exam_date >= $2
          AND es.exam_date <= $3
        GROUP BY c.course_id, c.name
      `, [teacherId, context.timeWindow.startDate, context.timeWindow.endDate])

      for (const course of examScores.rows) {
        const passRate = (course.pass_count / course.student_count) * 100

        // 添加考试平均分指标
        data.push({
          id: crypto.randomUUID(),
          metricId: 'exam_average_score',
          value: course.avg_score,
          source: 'exam_scores',
          timestamp: new Date().toISOString(),
          quality: 0.9,
          metadata: {
            courseId: course.course_id,
            courseName: course.course_name,
            studentCount: course.student_count
          }
        })

        // 添加考试通过率指标
        data.push({
          id: crypto.randomUUID(),
          metricId: 'exam_pass_rate',
          value: passRate,
          source: 'exam_scores',
          timestamp: new Date().toISOString(),
          quality: 0.9,
          metadata: {
            courseId: course.course_id,
            courseName: course.course_name,
            studentCount: course.student_count
          }
        })
      }

    } catch (error: any) {
      console.warn('获取课程评价数据失败:', error.message)
    }

    return data
  }

  /**
   * 获取学生表现数据
   */
  private async getStudentPerformanceData(
    teacherId: string,
    context: CalculationContext
  ): Promise<RawData[]> {
    const data: RawData[] = []

    try {
      // 获取学生出勤数据
      const attendanceData = await this.dbService.query(`
        SELECT c.course_id,
               COUNT(*) as total_sessions,
               COUNT(CASE WHEN ar.status = 'present' THEN 1 END) as present_sessions
        FROM attendance_records ar
        JOIN courses c ON ar.course_id = c.id
        WHERE c.teacher_id = $1
          AND ar.date >= $2
          AND ar.date <= $3
        GROUP BY c.course_id
      `, [teacherId, context.timeWindow.startDate, context.timeWindow.endDate])

      let totalSessions = 0
      let totalPresent = 0

      for (const attendance of attendanceData.rows) {
        totalSessions += attendance.total_sessions
        totalPresent += attendance.present_sessions
      }

      if (totalSessions > 0) {
        const attendanceRate = (totalPresent / totalSessions) * 100
        data.push({
          id: crypto.randomUUID(),
          metricId: 'attendance_rate',
          value: attendanceRate,
          source: 'attendance_records',
          timestamp: new Date().toISOString(),
          quality: 0.85,
          metadata: {
            totalSessions,
            totalPresent
          }
        })
      }

    } catch (error: any) {
      console.warn('获取学生表现数据失败:', error.message)
    }

    return data
  }

  /**
   * 获取课程统计数据
   */
  private async getCourseStatistics(
    courseId: string,
    context: CalculationContext
  ): Promise<RawData[]> {
    const data: RawData[] = []

    try {
      // 获取课程的基本统计信息
      const stats = await this.dbService.query(`
        SELECT
          COUNT(DISTINCT s.id) as total_students,
          COUNT(DISTINCT er.evaluator_id) as evaluator_count,
          AVG(er.overall_score) as avg_overall_score
        FROM courses c
        LEFT JOIN course_students cs ON c.id = cs.course_id
        LEFT JOIN students s ON cs.student_id = s.id
        LEFT JOIN evaluation_records er ON c.id = er.course_id
          AND er.created_at >= $1
          AND er.created_at <= $2
        WHERE c.id = $3
      `, [context.timeWindow.startDate, context.timeWindow.endDate, courseId])

      const stat = stats.rows[0]

      if (stat) {
        data.push({
          id: crypto.randomUUID(),
          metricId: 'course_student_count',
          value: stat.total_students || 0,
          source: 'course_statistics',
          timestamp: new Date().toISOString(),
          quality: 1.0,
          metadata: { courseId }
        })

        if (stat.avg_overall_score) {
          data.push({
            id: crypto.randomUUID(),
            metricId: 'course_avg_score',
            value: stat.avg_overall_score,
            source: 'course_statistics',
            timestamp: new Date().toISOString(),
            quality: 0.9,
            metadata: {
              courseId,
              evaluatorCount: stat.evaluator_count
            }
          })
        }
      }

    } catch (error: any) {
      console.warn('获取课程统计数据失败:', error.message)
    }

    return data
  }

  /**
   * 获取班级统计数据
   */
  private async getClassStatistics(
    classId: string,
    context: CalculationContext
  ): Promise<RawData[]> {
    const data: RawData[] = []

    try {
      // 获取班级的基本统计信息
      const stats = await this.dbService.query(`
        SELECT
          COUNT(s.id) as student_count,
          AVG(er.overall_score) as avg_evaluation_score
        FROM classes c
        JOIN students s ON s.class_id = c.id
        LEFT JOIN evaluation_records er ON s.id = er.evaluatee_id
          AND er.evaluatee_type = 'student'
          AND er.created_at >= $1
          AND er.created_at <= $2
        WHERE c.id = $3
      `, [context.timeWindow.startDate, context.timeWindow.endDate, classId])

      const stat = stats.rows[0]

      if (stat) {
        data.push({
          id: crypto.randomUUID(),
          metricId: 'class_student_count',
          value: stat.student_count || 0,
          source: 'class_statistics',
          timestamp: new Date().toISOString(),
          quality: 1.0,
          metadata: { classId }
        })

        if (stat.avg_evaluation_score) {
          data.push({
            id: crypto.randomUUID(),
            metricId: 'class_avg_evaluation_score',
            value: stat.avg_evaluation_score,
            source: 'class_statistics',
            timestamp: new Date().toISOString(),
            quality: 0.85,
            metadata: { classId }
          })
        }
      }

    } catch (error: any) {
      console.warn('获取班级统计数据失败:', error.message)
    }

    return data
  }

  /**
   * 数据预处理
   */
  private preprocessData(data: RawData[], metric: EvaluationMetric): RawData[] {
    let processedData = [...data]

    // 应用验证规则
    processedData = processedData.filter(d => this.validateDataPoint(d, metric))

    // 检测和处理异常值
    const outliers = this.detectOutliers(processedData)
    if (outliers.length > 0) {
      processedData = this.handleOutliers(processedData, outliers, metric)
    }

    // 处理缺失值
    processedData = this.handleMissingValues(processedData, metric)

    return processedData
  }

  /**
   * 验证数据点
   */
  private validateDataPoint(dataPoint: RawData, metric: EvaluationMetric): boolean {
    const value = dataPoint.value

    // 基本类型检查
    if (typeof value !== 'number' || isNaN(value)) {
      return false
    }

    // 范围检查
    if (value < metric.range.min || value > metric.range.max) {
      return false
    }

    // 质量检查
    if (dataPoint.quality < 0.5) {
      return false
    }

    // 应用自定义验证规则
    for (const rule of metric.validationRules) {
      if (!this.applyValidationRule(value, rule)) {
        return false
      }
    }

    return true
  }

  /**
   * 应用验证规则
   */
  private applyValidationRule(value: number, rule: ValidationRule): boolean {
    try {
      switch (rule.type) {
        case 'range':
          // 简单的范围验证，实际应该解析规则字符串
          return true
        case 'required':
          return value !== null && value !== undefined
        default:
          return true
      }
    } catch {
      return false
    }
  }

  /**
   * 检测异常值
   */
  private detectOutliers(data: RawData[]): RawData[] {
    if (data.length < 4) return []

    const values = data.map(d => d.value as number).sort((a, b) => a - b)
    const q1Index = Math.floor(values.length * 0.25)
    const q3Index = Math.floor(values.length * 0.75)
    const q1 = values[q1Index]
    const q3 = values[q3Index]
    const iqr = q3 - q1

    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr

    return data.filter(d => {
      const value = d.value as number
      return value < lowerBound || value > upperBound
    })
  }

  /**
   * 处理异常值
   */
  private handleOutliers(
    data: RawData[],
    outliers: RawData[],
    metric: EvaluationMetric
  ): RawData[] {
    const outlierIds = new Set(outliers.map(o => o.id))

    return data.map(d => {
      if (outlierIds.has(d.id)) {
        // 将异常值调整到合理范围内
        const value = d.value as number
        const range = metric.range

        if (value < range.min) {
          return { ...d, value: range.min, quality: d.quality * 0.5 }
        } else if (value > range.max) {
          return { ...d, value: range.max, quality: d.quality * 0.5 }
        }
      }
      return d
    })
  }

  /**
   * 处理缺失值
   */
  private handleMissingValues(data: RawData[], metric: EvaluationMetric): RawData[] {
    // 对于数值型指标，暂不处理缺失值，后续在聚合时处理
    return data.filter(d => d.value !== null && d.value !== undefined)
  }

  /**
   * 计算原始值
   */
  private calculateRawValue(data: RawData[], method: CalculationMethod): number {
    const values = data.map(d => d.value as number)

    if (values.length === 0) return 0

    switch (method) {
      case CalculationMethod.AVERAGE:
        return values.reduce((sum, val) => sum + val, 0) / values.length

      case CalculationMethod.WEIGHTED_AVERAGE:
        const totalWeight = data.reduce((sum, d) => sum + d.quality, 0)
        if (totalWeight === 0) return 0
        return data.reduce((sum, d) => sum + (d.value as number) * d.quality, 0) / totalWeight

      case CalculationMethod.MEDIAN:
        const sorted = [...values].sort((a, b) => a - b)
        const mid = Math.floor(sorted.length / 2)
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid]

      case CalculationMethod.MODE:
        const frequency: Record<number, number> = {}
        values.forEach(val => {
          frequency[val] = (frequency[val] || 0) + 1
        })
        return Object.entries(frequency)
          .sort(([,a], [,b]) => b - a)[0][0] as number

      case CalculationMethod.STANDARD_DEVIATION:
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
        return Math.sqrt(variance)

      default:
        return values.reduce((sum, val) => sum + val, 0) / values.length
    }
  }

  /**
   * 标准化数值
   */
  private normalizeValue(value: number, metric: EvaluationMetric): number {
    // 使用最小-最大标准化将值转换到0-1范围
    const range = metric.range.max - metric.range.min
    if (range === 0) return 1

    return (value - metric.range.min) / range
  }

  /**
   * 转换为评分
   */
  private convertToScore(value: number, metric: EvaluationMetric): number {
    // 将标准化的值(0-1)转换为评分(0-100)
    return Math.min(100, Math.max(0, value * 100))
  }

  /**
   * 获取分数等级
   */
  private getScoreLevel(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 90) return 'excellent'
    if (score >= 80) return 'good'
    if (score >= 70) return 'average'
    return 'poor'
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(data: RawData[]): number {
    if (data.length === 0) return 0

    // 基于样本量和数据质量计算置信度
    const sampleSize = data.length
    const avgQuality = data.reduce((sum, d) => sum + d.quality, 0) / data.length

    // 样本量因子
    const sampleSizeFactor = Math.min(sampleSize / 30, 1) // 30个样本为满分

    // 数据质量因子
    const qualityFactor = avgQuality

    // 综合置信度
    return (sampleSizeFactor * 0.6 + qualityFactor * 0.4)
  }

  /**
   * 生成解释
   */
  private generateExplanation(
    metric: EvaluationMetric,
    data: RawData[],
    score: number
  ): string {
    const sampleSize = data.length
    const avgQuality = data.reduce((sum, d) => sum + d.quality, 0) / data.length

    let explanation = `${metric.displayName}: ${score.toFixed(1)}分`

    if (sampleSize > 0) {
      explanation += ` (基于${sampleSize}个数据点`
      if (avgQuality < 0.8) {
        explanation += `, 数据质量${(avgQuality * 100).toFixed(1)}%`
      }
      explanation += ')'
    }

    return explanation
  }

  /**
   * 分解计算组件
   */
  private decalcComponents(data: RawData[], metric: EvaluationMetric): ComponentResult[] {
    // 根据数据源分解组件
    const sourceGroups: Record<string, RawData[]> = {}
    data.forEach(d => {
      if (!sourceGroups[d.source]) {
        sourceGroups[d.source] = []
      }
      sourceGroups[d.source].push(d)
    })

    const components: ComponentResult[] = []

    for (const [source, sourceData] of Object.entries(sourceGroups)) {
      if (sourceData.length > 0) {
        const value = this.calculateRawValue(sourceData, metric.calculationMethod)
        const weight = sourceData.reduce((sum, d) => sum + d.quality, 0) / data.reduce((sum, d) => sum + d.quality, 0)

        components.push({
          name: this.getSourceDisplayName(source),
          value,
          weight,
          contribution: value * weight,
          description: `来自${this.getSourceDisplayName(source)}的数据贡献`
        })
      }
    }

    return components
  }

  /**
   * 获取数据源显示名称
   */
  private getSourceDisplayName(source: string): string {
    const nameMap: Record<string, string> = {
      'evaluation_records': '学生评价',
      'exam_scores': '考试成绩',
      'attendance_records': '出勤记录',
      'course_statistics': '课程统计',
      'class_statistics': '班级统计'
    }

    return nameMap[source] || source
  }

  /**
   * 验证结果
   */
  private validateResult(score: number, metric: EvaluationMetric): boolean {
    // 检查分数是否在合理范围内
    return score >= 0 && score <= 100
  }

  /**
   * 按维度聚合结果
   */
  private async aggregateByDimensions(
    metricResults: CalculationResult[],
    weightConfig: WeightConfiguration
  ): Promise<DimensionResult[]> {
    const dimensionMap: Record<EvaluationDimension, CalculationResult[]> = {}

    // 按维度分组指标结果
    metricResults.forEach(result => {
      const metric = this.metrics.get(result.metricId)
      if (metric) {
        if (!dimensionMap[metric.dimension]) {
          dimensionMap[metric.dimension] = []
        }
        dimensionMap[metric.dimension].push(result)
      }
    })

    const dimensionResults: DimensionResult[] = []

    // 计算每个维度的结果
    for (const [dimension, results] of Object.entries(dimensionMap)) {
      if (results.length > 0) {
        const dimensionWeight = weightConfig.dimensions.find(d => d.dimension === dimension)?.weight || 0.2

        // 计算维度分数（加权平均）
        const totalWeight = results.reduce((sum, r) => sum + (r.weightedValue || 0), 0)
        const weightedSum = results.reduce((sum, r) => {
          const metric = this.metrics.get(r.metricId)
          const metricWeight = metric?.weight || 0.2
          return sum + r.score * metricWeight
        }, 0)

        const dimensionScore = totalWeight > 0 ? weightedSum / totalWeight : 0
        const dimensionLevel = this.getScoreLevel(dimensionScore)

        // 生成维度分析
        const { strengths, weaknesses, recommendations } = await this.analyzeDimension(dimension as EvaluationDimension, results)

        dimensionResults.push({
          dimension: dimension as EvaluationDimension,
          score: dimensionScore,
          level: dimensionLevel,
          weight: dimensionWeight,
          contribution: dimensionScore * dimensionWeight,
          metrics: results,
          strengths,
          weaknesses,
          recommendations
        })
      }
    }

    return dimensionResults
  }

  /**
   * 分析维度
   */
  private async analyzeDimension(
    dimension: EvaluationDimension,
    results: CalculationResult[]
  ): Promise<{
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }> {
    const strengths: string[] = []
    const weaknesses: string[] = []
    const recommendations: string[] = []

    for (const result of results) {
      const metric = this.metrics.get(result.metricId)
      if (!metric) continue

      if (result.level === 'excellent' || result.level === 'good') {
        strengths.push(`${metric.displayName}表现${result.level === 'excellent' ? '优秀' : '良好'}(${result.score.toFixed(1)}分)`)
      } else {
        weaknesses.push(`${metric.displayName}需要提升(${result.score.toFixed(1)}分)`)

        // 根据指标类型生成建议
        if (metric.dimension === EvaluationDimension.TEACHING_METHOD) {
          recommendations.push(`建议改进${metric.displayName}，可尝试更多互动式教学方法`)
        } else if (metric.dimension === EvaluationDimension.TEACHING_CONTENT) {
          recommendations.push(`建议加强${metric.displayName}，增加内容的实用性和前沿性`)
        } else {
          recommendations.push(`建议重点关注${metric.displayName}的改进`)
        }
      }
    }

    return {
      strengths: strengths.length > 0 ? strengths : ['暂无突出优势'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['暂无明显不足'],
      recommendations: recommendations.length > 0 ? recommendations : ['继续保持当前表现']
    }
  }

  /**
   * 计算总体分数
   */
  private calculateOverallScore(dimensionResults: DimensionResult[]): number {
    if (dimensionResults.length === 0) return 0

    const weightedSum = dimensionResults.reduce((sum, result) => {
      return sum + (result.score * result.weight)
    }, 0)

    const totalWeight = dimensionResults.reduce((sum, result) => sum + result.weight, 0)

    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  /**
   * 生成洞察分析
   */
  private async generateInsights(
    dimensionResults: DimensionResult[],
    rawData: RawData[],
    context: CalculationContext
  ): Promise<{
    keyStrengths: string[]
    improvementAreas: string[]
    recommendations: string[]
    trends: TrendAnalysis[]
  }> {
    const keyStrengths: string[] = []
    const improvementAreas: string[] = []
    const recommendations: string[] = []
    const trends: TrendAnalysis[] = []

    // 分析各维度的优势和改进点
    for (const dimension of dimensionResults) {
      if (dimension.level === 'excellent' || dimension.level === 'good') {
        keyStrengths.push(...dimension.strengths)
      } else {
        improvementAreas.push(...dimension.weaknesses)
        recommendations.push(...dimension.recommendations)
      }
    }

    // 生成趋势分析（如果有历史数据）
    // 这里简化实现，实际应该基于历史数据分析
    if (context.parameters.enableTrendAnalysis) {
      trends.push(...await this.generateTrendAnalysis(rawData))
    }

    return {
      keyStrengths: keyStrengths.length > 0 ? keyStrengths : ['整体表现稳定'],
      improvementAreas: improvementAreas.length > 0 ? improvementAreas : ['暂无明显改进需求'],
      recommendations: recommendations.length > 0 ? recommendations : ['继续保持当前状态'],
      trends
    }
  }

  /**
   * 生成趋势分析
   */
  private async generateTrendAnalysis(rawData: RawData[]): Promise<TrendAnalysis[]> {
    const trends: TrendAnalysis[] = []

    // 简化实现，实际应该基于时间序列数据分析
    const metricGroups: Record<string, RawData[]> = {}
    rawData.forEach(d => {
      if (!metricGroups[d.metricId]) {
        metricGroups[d.metricId] = []
      }
      metricGroups[d.metricId].push(d)
    })

    for (const [metricId, data] of Object.entries(metricGroups)) {
      if (data.length >= 3) {
        const metric = this.metrics.get(metricId)
        if (metric) {
          // 模拟趋势数据
          const directions = ['improving', 'declining', 'stable']
          const direction = directions[Math.floor(Math.random() * directions.length)] as any
          const changeRate = (Math.random() - 0.5) * 20 // -10% to +10%

          trends.push({
            metric: metric.displayName,
            direction,
            changeRate,
            significance: Math.random() * 0.1,
            timePoints: [],
            forecast: []
          })
        }
      }
    }

    return trends
  }

  /**
   * 执行比较分析
   */
  private async performComparisons(
    evaluateeId: string,
    overallScore: number,
    context: CalculationContext
  ): Promise<ComparisonResult[]> {
    const comparisons: ComparisonResult[] = []

    try {
      // 同行比较
      if (context.parameters.enablePeerComparison) {
        const peerComparison = await this.performPeerComparison(evaluateeId, overallScore, context)
        if (peerComparison) {
          comparisons.push(peerComparison)
        }
      }

      // 历史比较
      if (context.parameters.enableHistoricalComparison) {
        const historicalComparison = await this.performHistoricalComparison(evaluateeId, overallScore, context)
        if (historicalComparison) {
          comparisons.push(historicalComparison)
        }
      }

      // 基准比较
      if (context.parameters.enableBenchmarkComparison) {
        const benchmarkComparison = await this.performBenchmarkComparison(overallScore, context)
        if (benchmarkComparison) {
          comparisons.push(benchmarkComparison)
        }
      }

    } catch (error: any) {
      console.warn('比较分析失败:', error.message)
    }

    return comparisons
  }

  /**
   * 执行同行比较
   */
  private async performPeerComparison(
    evaluateeId: string,
    overallScore: number,
    context: CalculationContext
  ): Promise<ComparisonResult | null> {
    try {
      // 获取同行数据
      const peerData = await this.dbService.query(`
        SELECT er.overall_score
        FROM evaluation_records er
        WHERE er.evaluatee_id != $1
          AND er.evaluatee_type = 'teacher'
          AND er.created_at >= $2
          AND er.created_at <= $3
        LIMIT 100
      `, [evaluateeId, context.timeWindow.startDate, context.timeWindow.endDate])

      if (peerData.rows.length === 0) return null

      const peerScores = peerData.rows.map(row => row.overall_score).filter(s => s !== null)
      if (peerScores.length === 0) return null

      // 计算统计量
      const peerMean = peerScores.reduce((sum, score) => sum + score, 0) / peerScores.length
      const peerStdDev = Math.sqrt(
        peerScores.reduce((sum, score) => sum + Math.pow(score - peerMean, 2), 0) / peerScores.length
      )

      // 计算百分位排名
      const sortedScores = [...peerScores, overallScore].sort((a, b) => a - b)
      const rank = sortedScores.indexOf(overallScore) + 1
      const percentile = (rank / sortedScores.length) * 100

      // 计算效应量
      const effectSize = (overallScore - peerMean) / peerStdDev

      return {
        type: 'peer',
        referenceGroup: '同行教师',
        referenceScore: peerMean,
        relativeScore: overallScore - peerMean,
        percentile,
        rank,
        totalSize: sortedScores.length,
        significance: Math.abs(effectSize) > 0.5 ? 0.05 : 0.1,
        effectSize: Math.abs(effectSize)
      }

    } catch (error: any) {
      console.warn('同行比较失败:', error.message)
      return null
    }
  }

  /**
   * 执行历史比较
   */
  private async performHistoricalComparison(
    evaluateeId: string,
    overallScore: number,
    context: CalculationContext
  ): Promise<ComparisonResult | null> {
    try {
      // 获取历史数据（上一个评价周期）
      const historicalPeriod = {
        startDate: new Date(new Date(context.timeWindow.startDate).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(new Date(context.timeWindow.startDate).getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }

      const historicalData = await this.dbService.query(`
        SELECT AVG(overall_score) as avg_score
        FROM evaluation_records
        WHERE evaluatee_id = $1
          AND evaluatee_type = 'teacher'
          AND created_at >= $2
          AND created_at <= $3
      `, [evaluateeId, historicalPeriod.startDate, historicalPeriod.endDate])

      if (historicalData.rows.length === 0 || historicalData.rows[0].avg_score === null) {
        return null
      }

      const historicalScore = historicalData.rows[0].avg_score

      return {
        type: 'historical',
        referenceGroup: '历史表现',
        referenceScore: historicalScore,
        relativeScore: overallScore - historicalScore,
        percentile: overallScore > historicalScore ? 75 : 25,
        rank: overallScore > historicalScore ? 1 : 2,
        totalSize: 2,
        significance: Math.abs(overallScore - historicalScore) > 5 ? 0.05 : 0.1,
        effectSize: (overallScore - historicalScore) / 10 // 简化计算
      }

    } catch (error: any) {
      console.warn('历史比较失败:', error.message)
      return null
    }
  }

  /**
   * 执行基准比较
   */
  private async performBenchmarkComparison(
    overallScore: number,
    context: CalculationContext
  ): Promise<ComparisonResult | null> {
    // 使用预设基准分数
    const benchmarkScore = 80 // 假设基准为80分

    return {
      type: 'benchmark',
      referenceGroup: '标准基准',
      referenceScore: benchmarkScore,
      relativeScore: overallScore - benchmarkScore,
      percentile: overallScore > benchmarkScore ? 75 : 25,
      rank: overallScore > benchmarkScore ? 1 : 2,
      totalSize: 2,
      significance: Math.abs(overallScore - benchmarkScore) > 10 ? 0.05 : 0.1,
      effectSize: (overallScore - benchmarkScore) / 20
    }
  }

  /**
   * 计算分数分布
   */
  private async calculateScoreDistribution(metricResults: CalculationResult[]): Promise<ScoreDistribution> {
    const scores = metricResults.map(r => r.score).filter(s => s !== null && !isNaN(s))

    if (scores.length === 0) {
      return {
        mean: 0,
        median: 0,
        mode: 0,
        standardDeviation: 0,
        variance: 0,
        skewness: 0,
        kurtosis: 0,
        range: { min: 0, max: 0, interquartile: 0 },
        percentiles: { p25: 0, p50: 0, p75: 0, p90: 0, p95: 0, p99: 0 },
        histogram: []
      }
    }

    const sorted = [...scores].sort((a, b) => a - b)
    const n = sorted.length

    // 基本统计量
    const mean = scores.reduce((sum, score) => sum + score, 0) / n
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / n
    const standardDeviation = Math.sqrt(variance)

    // 中位数和众数
    const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)]

    // 计算众数
    const frequency: Record<number, number> = {}
    scores.forEach(score => {
      frequency[score] = (frequency[score] || 0) + 1
    })
    const mode = Number(Object.entries(frequency).sort(([,a], [,b]) => b - a)[0][0])

    // 偏度和峰度
    const skewness = this.calculateSkewness(scores, mean, standardDeviation)
    const kurtosis = this.calculateKurtosis(scores, mean, standardDeviation)

    // 百分位数
    const percentiles = {
      p25: this.getPercentile(sorted, 25),
      p50: median,
      p75: this.getPercentile(sorted, 75),
      p90: this.getPercentile(sorted, 90),
      p95: this.getPercentile(sorted, 95),
      p99: this.getPercentile(sorted, 99)
    }

    // 范围
    const range = {
      min: sorted[0],
      max: sorted[n - 1],
      interquartile: percentiles.p75 - percentiles.p25
    }

    // 直方图
    const histogram = this.createHistogram(scores, 10)

    return {
      mean,
      median,
      mode,
      standardDeviation,
      variance,
      skewness,
      kurtosis,
      range,
      percentiles,
      histogram
    }
  }

  /**
   * 计算偏度
   */
  private calculateSkewness(scores: number[], mean: number, stdDev: number): number {
    if (stdDev === 0) return 0

    const n = scores.length
    const sum = scores.reduce((acc, score) => {
      return acc + Math.pow((score - mean) / stdDev, 3)
    }, 0)

    return (n / ((n - 1) * (n - 2))) * sum
  }

  /**
   * 计算峰度
   */
  private calculateKurtosis(scores: number[], mean: number, stdDev: number): number {
    if (stdDev === 0) return 0

    const n = scores.length
    const sum = scores.reduce((acc, score) => {
      return acc + Math.pow((score - mean) / stdDev, 4)
    }, 0)

    return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * sum -
           3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3))
  }

  /**
   * 获取百分位数
   */
  private getPercentile(sortedScores: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedScores.length - 1)
    const lower = Math.floor(index)
    const upper = Math.ceil(index)

    if (lower === upper) {
      return sortedScores[lower]
    }

    const weight = index - lower
    return sortedScores[lower] * (1 - weight) + sortedScores[upper] * weight
  }

  /**
   * 创建直方图
   */
  private createHistogram(scores: number[], binCount: number): HistogramBin[] {
    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const binWidth = (max - min) / binCount

    const histogram: HistogramBin[] = []
    let cumulative = 0

    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth
      const binEnd = min + (i + 1) * binWidth

      const frequency = scores.filter(score =>
        score >= binStart && (i === binCount - 1 ? score <= binEnd : score < binEnd)
      ).length

      const percentage = (frequency / scores.length) * 100
      cumulative += frequency

      histogram.push({
        range: [binStart, binEnd],
        frequency,
        percentage,
        cumulative
      })
    }

    return histogram
  }

  /**
   * 计算总结统计
   */
  private calculateSummary(metricResults: CalculationResult[], rawData: RawData[]): OverallEvaluationResult['summary'] {
    const totalMetrics = metricResults.length
    const validMetrics = metricResults.filter(r => r.validity).length

    // 计算响应率（基于评价记录）
    const evaluationRecords = rawData.filter(d => d.source === 'evaluation_records')
    const uniqueEvaluators = new Set(evaluationRecords.map(d => d.metadata.evaluatorId)).size
    const totalStudents = 100 // 简化实现，实际应该查询学生总数
    const responseRate = totalStudents > 0 ? uniqueEvaluators / totalStudents : 0

    // 数据完整性
    const dataCompleteness = rawData.length > 0
      ? rawData.reduce((sum, d) => sum + d.quality, 0) / rawData.length
      : 0

    // 可靠性（简化计算）
    const reliability = validMetrics / totalMetrics

    // 效度（简化计算）
    const validity = dataCompleteness

    // 公平性（简化计算）
    const fairness = 0.8 // 假设公平性为80%

    return {
      totalMetrics,
      validMetrics,
      responseRate,
      dataCompleteness,
      reliability,
      validity,
      fairness
    }
  }

  /**
   * 评估数据质量
   */
  private assessDataQuality(data: RawData[]): { overall: number; details: Record<string, number> } {
    if (data.length === 0) {
      return { overall: 0, details: {} }
    }

    const avgQuality = data.reduce((sum, d) => sum + d.quality, 0) / data.length
    const completeness = 1 - (data.filter(d => d.value === null || d.value === undefined).length / data.length)
    const consistency = 0.9 // 简化实现
    const timeliness = 0.95 // 简化实现
    const validity = 0.9 // 简化实现

    const overall = (avgQuality + completeness + consistency + timeliness + validity) / 5

    return {
      overall,
      details: {
        avgQuality,
        completeness,
        consistency,
        timeliness,
        validity
      }
    }
  }

  /**
   * 获取评价对象字段名
   */
  private getEvaluateeField(evaluateeType: 'teacher' | 'course' | 'class'): string {
    switch (evaluateeType) {
      case 'teacher':
        return 'evaluatee_id'
      case 'course':
        return 'course_id'
      case 'class':
        return 'class_id'
      default:
        return 'evaluatee_id'
    }
  }

  /**
   * 批量计算任务
   */
  async executeBatchCalculation(task: BatchCalculationTask): Promise<void> {
    // 实现批量计算逻辑
    task.status = 'running'
    task.startedAt = new Date().toISOString()

    const results: OverallEvaluationResult[] = []
    const errors: any[] = []

    for (let i = 0; i < task.targetIds.length; i++) {
      const targetId = task.targetIds[i]

      try {
        const context: CalculationContext = {
          evaluationId: task.id,
          evaluatorId: 'system',
          evaluateeId: targetId,
          evaluationType: 'admin',
          timeWindow: {
            startDate: '2024-01-01',
            endDate: '2024-12-31'
          },
          aggregationLevel: AggregationLevel.INDIVIDUAL,
          weightingStrategy: WeightingStrategy.EXPERT_JUDGMENT,
          calculationMethod: CalculationMethod.WEIGHTED_AVERAGE,
          exclusionCriteria: [],
          inclusionCriteria: [],
          parameters: task.configurationId ? { configId: task.configurationId } : {}
        }

        const result = await this.calculateOverallEvaluation(
          targetId,
          task.targetType,
          context
        )

        results.push(result)
      } catch (error: any) {
        errors.push({
          id: crypto.randomUUID(),
          targetId,
          errorType: 'calculation',
          errorMessage: error.message,
          errorDetails: {},
          severity: 'error',
          resolved: false,
          timestamp: new Date().toISOString()
        })
      }

      // 更新进度
      task.progress = Math.round(((i + 1) / task.targetIds.length) * 100)
      task.updatedAt = new Date().toISOString()
    }

    task.results = results
    task.errors = errors
    task.status = errors.length > 0 ? 'completed' : 'completed'
    task.completedAt = new Date().toISOString()

    // 更新统计信息
    task.statistics = {
      totalTargets: task.targetIds.length,
      processedTargets: task.targetIds.length,
      successfulCalculations: results.length,
      failedCalculations: errors.length,
      averageProcessingTime: 0,
      averageScore: results.reduce((sum, r) => sum + r.overallScore, 0) / results.length,
      scoreDistribution: await this.calculateScoreDistribution(
        results.flatMap(r => r.metricResults)
      ),
      dataQualitySummary: {
        averageQuality: 0.85,
        qualityDistribution: {}
      }
    }
  }

  /**
   * 添加指标
   */
  addMetric(metric: EvaluationMetric): void {
    this.metrics.set(metric.id, { ...metric, updatedAt: new Date().toISOString() })
  }

  /**
   * 获取指标
   */
  getMetrics(): EvaluationMetric[] {
    return Array.from(this.metrics.values())
  }

  /**
   * 获取权重配置
   */
  getWeightConfigurations(): WeightConfiguration[] {
    return Array.from(this.weightConfigs.values())
  }

  /**
   * 获取计算配置
   */
  getCalculationConfigurations(): CalculationConfiguration[] {
    return Array.from(this.calculationConfigs.values())
  }
}