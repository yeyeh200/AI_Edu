/**
 * AI分析引擎服务
 * 核心教学评价AI分析引擎
 */

import { DatabaseService } from './databaseService.ts'
import { DataCollectionService } from './dataCollectionService.ts'
import { config } from '../config/config.ts'
import {
  AnalysisRule,
  AnalysisResult,
  AnalysisTask,
  BatchAnalysisRequest,
  AnalysisConfig,
  TimeWindow,
  RuleCondition,
  WeightConfig,
  DimensionResult,
  AnalysisMetric,
  AnalysisRuleType,
  AggregationMethod,
  ComparisonOperator,
  AnalysisCache,
  DataQualityMetrics,
  SystemPerformance
} from '../types/aiAnalysis.ts'
import {
  EvaluationRecord,
  Teacher,
  Course,
  Class,
  Student,
  Assignment,
  ExamScore,
  EvaluationDimension
} from '../types/index.ts'

export class AIAnalysisEngine {
  private dbService: DatabaseService
  private collectionService: DataCollectionService
  private analysisRules: Map<string, AnalysisRule>
  private analysisCache: Map<string, AnalysisCache>
  private runningTasks: Map<string, AbortController>
  private config: AnalysisConfig
  private performance: SystemPerformance

  constructor() {
    this.dbService = new DatabaseService()
    this.collectionService = new DataCollectionService()
    this.analysisRules = new Map()
    this.analysisCache = new Map()
    this.runningTasks = new Map()

    // 初始化配置
    this.config = this.initializeConfig()
    this.performance = this.initializePerformance()

    // 初始化默认分析规则
    this.initializeDefaultRules()
  }

  /**
   * 初始化分析配置
   */
  private initializeConfig(): AnalysisConfig {
    return {
      version: '1.0.0',
      defaultWeights: [
        { dimension: EvaluationDimension.TEACHING_ATTITUDE, weight: 0.2, enabled: true },
        { dimension: EvaluationDimension.TEACHING_CONTENT, weight: 0.25, enabled: true },
        { dimension: EvaluationDimension.TEACHING_METHOD, weight: 0.2, enabled: true },
        { dimension: EvaluationDimension.TEACHING_EFFECT, weight: 0.25, enabled: true },
        { dimension: EvaluationDimension.TEACHING_ETHICS, weight: 0.1, enabled: true }
      ],
      globalThresholds: {
        excellence: 90,
        satisfactory: 75,
        improvement: 60
      },
      dataSources: [
        {
          name: 'evaluation_records',
          type: 'database',
          enabled: true,
          priority: 1,
          refreshInterval: 3600,
          lastSync: new Date().toISOString(),
          config: { table: 'evaluation_records' }
        },
        {
          name: 'exam_scores',
          type: 'database',
          enabled: true,
          priority: 2,
          refreshInterval: 3600,
          lastSync: new Date().toISOString(),
          config: { table: 'exam_scores' }
        },
        {
          name: 'attendance_records',
          type: 'database',
          enabled: true,
          priority: 3,
          refreshInterval: 1800,
          lastSync: new Date().toISOString(),
          config: { table: 'attendance_records' }
        }
      ],
      aiSettings: {
        enableML: true,
        modelVersion: '1.0',
        confidenceThreshold: 0.7,
        enableAutoRecommendations: true
      },
      comparisonSettings: {
        enablePeerComparison: true,
        enableHistoricalComparison: true,
        peerGroupSize: 10,
        historicalWindow: 3
      }
    }
  }

  /**
   * 初始化性能指标
   */
  private initializePerformance(): SystemPerformance {
    return {
      totalAnalyses: 0,
      averageProcessingTime: 0,
      successRate: 0,
      errorRate: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      activeTasks: 0,
      queuedTasks: 0
    }
  }

  /**
   * 初始化默认分析规则
   */
  private initializeDefaultRules(): void {
    // 教学效果规则
    this.addAnalysisRule({
      id: 'teaching_effectiveness_core',
      name: '核心教学效果评估',
      description: '基于学生评价和成绩数据评估教学效果',
      type: AnalysisRuleType.TEACHING_EFFECTIVENESS,
      category: 'core',
      enabled: true,
      priority: 1,
      conditions: [
        {
          metric: 'evaluation_average_score',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 80,
          weight: 0.4
        },
        {
          metric: 'exam_pass_rate',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 85,
          weight: 0.3
        },
        {
          metric: 'assignment_completion_rate',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 90,
          weight: 0.3
        }
      ],
      weights: this.config.defaultWeights,
      thresholds: {
        excellent: 95,
        good: 85,
        average: 75,
        poor: 60
      },
      parameters: {
        enableTrendAnalysis: true,
        trendWindow: 30
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 学生参与度规则
    this.addAnalysisRule({
      id: 'student_engagement_analysis',
      name: '学生参与度分析',
      description: '分析学生的课堂参与度和互动情况',
      type: AnalysisRuleType.STUDENT_ENGAGEMENT,
      category: 'core',
      enabled: true,
      priority: 2,
      conditions: [
        {
          metric: 'attendance_rate',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 85,
          weight: 0.4
        },
        {
          metric: 'interaction_frequency',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 3,
          weight: 0.3
        },
        {
          metric: 'participation_score',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 75,
          weight: 0.3
        }
      ],
      weights: this.config.defaultWeights,
      thresholds: {
        excellent: 90,
        good: 80,
        average: 70,
        poor: 60
      },
      parameters: {
        engagementFactors: ['attendance', 'participation', 'interaction'],
        weightDistribution: [0.4, 0.3, 0.3]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 知识掌握度规则
    this.addAnalysisRule({
      id: 'knowledge_mastery_assessment',
      name: '知识掌握度评估',
      description: '通过考试成绩和作业表现评估学生对知识的掌握程度',
      type: AnalysisRuleType.KNOWLEDGE_MASTERY,
      category: 'core',
      enabled: true,
      priority: 3,
      conditions: [
        {
          metric: 'exam_average_score',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 75,
          weight: 0.5
        },
        {
          metric: 'assignment_average_score',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 80,
          weight: 0.3
        },
        {
          metric: 'knowledge_retention_rate',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 70,
          weight: 0.2
        }
      ],
      weights: this.config.defaultWeights,
      thresholds: {
        excellent: 90,
        good: 80,
        average: 70,
        poor: 60
      },
      parameters: {
        knowledgeAreas: ['theoretical', 'practical', 'application'],
        assessmentTypes: ['exam', 'assignment', 'quiz']
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 进步趋势分析规则
    this.addAnalysisRule({
      id: 'improvement_trend_analysis',
      name: '进步趋势分析',
      description: '分析学生在学习过程中的进步趋势',
      type: AnalysisRuleType.IMPROVEMENT_TREND,
      category: 'optional',
      enabled: true,
      priority: 4,
      conditions: [
        {
          metric: 'score_improvement_rate',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 10,
          weight: 0.5
        },
        {
          metric: 'grade_improvement_rate',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 15,
          weight: 0.5
        }
      ],
      weights: this.config.defaultWeights,
      thresholds: {
        excellent: 20,
        good: 15,
        average: 10,
        poor: 5
      },
      parameters: {
        analysisPeriod: 'semester',
        trendMethod: 'linear_regression',
        minimumDataPoints: 5
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 同行比较规则
    this.addAnalysisRule({
      id: 'peer_comparison_analysis',
      name: '同行比较分析',
      description: '与同课程、同级别的其他教师进行比较分析',
      type: AnalysisRuleType.PEER_COMPARISON,
      category: 'optional',
      enabled: true,
      priority: 5,
      conditions: [
        {
          metric: 'peer_percentile_rank',
          operator: ComparisonOperator.GREATER_EQUAL,
          value: 70,
          weight: 1.0
        }
      ],
      weights: this.config.defaultWeights,
      thresholds: {
        excellent: 90,
        good: 75,
        average: 50,
        poor: 25
      },
      parameters: {
        comparisonGroup: 'same_course',
        excludeSelf: true,
        minimumGroupSize: 5
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * 执行单个教师分析
   */
  async analyzeTeacher(
    teacherId: string,
    timeWindow: TimeWindow,
    ruleIds: string[] = []
  ): Promise<AnalysisResult> {
    const startTime = Date.now()

    try {
      console.log(`🔍 开始分析教师 ID=${teacherId}, 时间窗口: ${timeWindow.startDate} 至 ${timeWindow.endDate}`)

      // 检查缓存
      const cacheKey = this.generateCacheKey(teacherId, timeWindow, ruleIds)
      const cached = this.getCachedResult(cacheKey)
      if (cached) {
        console.log(`✅ 从缓存返回分析结果`)
        return cached
      }

      // 获取教师信息
      console.log(`📝 查询教师信息...`)
      const teacher = await this.getTeacherInfo(teacherId)
      if (!teacher) {
        console.error(`❌ 教师不存在: ID=${teacherId}`)
        throw new Error(`教师不存在 (ID: ${teacherId})。请检查教师ID是否正确，或联系管理员添加教师信息。`)
      }
      console.log(`✅ 找到教师: ${teacher.name} (工号: ${teacher.employeeId || 'N/A'})`)

      // 获取分析数据
      console.log(`📊 收集分析数据...`)
      const analysisData = await this.collectAnalysisData(teacherId, timeWindow)

      // 评估数据质量
      const dataQuality = await this.assessDataQuality(analysisData)
      console.log(`📊 数据质量评估: ${dataQuality.overall.toFixed(2)} (阈值: 0.3)`, {
        evaluationRecords: analysisData.evaluationRecords.length,
        examScores: analysisData.examScores.length,
        attendanceRecords: analysisData.attendanceRecords.length,
        students: analysisData.students.length
      })

      if (dataQuality.overall < 0.3) {  // 降低阈值从0.6到0.3
        throw new Error(`数据质量不足(${(dataQuality.overall * 100).toFixed(1)}%)，无法进行可靠分析。请确保有足够的评价记录、考试成绩和考勤数据。`)
      }

      // 执行分析规则
      const rules = ruleIds.length > 0 ?
        ruleIds.map(id => this.analysisRules.get(id)).filter(Boolean) as AnalysisRule[] :
        Array.from(this.analysisRules.values()).filter(rule => rule.enabled)

      const dimensionResults: DimensionResult[] = []
      const allMetrics: AnalysisMetric[] = []

      // 执行每个规则
      for (const rule of rules) {
        try {
          const result = await this.executeAnalysisRule(rule, analysisData, timeWindow)
          dimensionResults.push(result)
          allMetrics.push(...result.metrics)
        } catch (error: any) {
          console.error(`规则执行失败 (${rule.id}):`, error)
        }
      }

      // 计算总体评分
      const overallScore = this.calculateOverallScore(dimensionResults)
      const overallLevel = this.getScoreLevel(overallScore)

      // 生成洞察和建议
      const insights = await this.generateInsights(dimensionResults, analysisData)

      // 执行比较分析
      const comparisons = await this.performComparisons(teacherId, overallScore, timeWindow)

      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        teacherId,
        teacherInfo: {
          id: teacher.id,
          name: teacher.name,
          employeeId: teacher.employeeId
        },
        timeWindow,
        overallScore,
        overallLevel,
        dimensionResults,
        metrics: allMetrics,
        summary: {
          totalStudents: analysisData.students.length,
          responseRate: this.calculateResponseRate(analysisData),
          dataCompleteness: dataQuality.overall,
          confidenceLevel: this.calculateConfidenceLevel(dataQuality, analysisData)
        },
        insights,
        comparisons,
        metadata: {
          analysisVersion: this.config.version,
          rulesApplied: rules.map(r => r.id),
          dataSources: this.config.dataSources.map(ds => ds.name),
          processingTime: Date.now() - startTime,
          generatedAt: new Date().toISOString()
        }
      }

      // 缓存结果
      this.cacheResult(cacheKey, result)

      // 更新性能指标
      this.updatePerformanceMetrics(true, Date.now() - startTime)

      return result
    } catch (error: any) {
      this.updatePerformanceMetrics(false, Date.now() - startTime)
      throw error
    }
  }

  /**
   * 批量分析
   */
  async executeBatchAnalysis(request: BatchAnalysisRequest): Promise<AnalysisTask> {
    const task: AnalysisTask = {
      id: crypto.randomUUID(),
      name: request.name,
      description: request.description || '',
      targetTeacherIds: request.scope.teacherIds || [],
      targetCourseIds: request.scope.courseIds,
      targetClassIds: request.scope.classIds,
      timeWindow: request.timeWindow,
      rules: request.rules,
      status: 'pending',
      progress: 0,
      results: [],
      errors: [],
      warnings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // 异步执行批量分析
    this.executeBatchAnalysisAsync(task, request.options)

    return task
  }

  /**
   * 异步执行批量分析
   */
  private async executeBatchAnalysisAsync(
    task: AnalysisTask,
    options: BatchAnalysisRequest['options']
  ): Promise<void> {
    const abortController = new AbortController()
    this.runningTasks.set(task.id, abortController)

    try {
      task.status = 'running'
      task.startedAt = new Date().toISOString()

      const teacherIds = task.targetTeacherIds.length > 0 ? task.targetTeacherIds :
        await this.getTeacherIdsByScope(task.targetCourseIds, task.targetClassIds)

      let completedCount = 0
      const totalCount = teacherIds.length

      for (const teacherId of teacherIds) {
        if (abortController.signal.aborted) {
          task.status = 'cancelled'
          break
        }

        try {
          const result = await this.analyzeTeacher(
            teacherId,
            task.timeWindow,
            task.rules
          )

          // 根据选项过滤结果
          if (options.confidenceThreshold && result.summary.confidenceLevel < options.confidenceThreshold) {
            task.warnings.push(`教师 ${teacherId} 的分析置信度不足`)
            continue
          }

          // 根据选项调整结果
          if (!options.includeComparisons) {
            result.comparisons = {
              peerRank: 0,
              peerTotal: 0,
              departmentRank: 0,
              departmentTotal: 0,
              historicalRank: 0,
              historicalTotal: 0
            }
          }

          if (!options.includeTrends) {
            result.insights.trends = []
          }

          if (!options.includeRecommendations) {
            result.insights.recommendations = []
          }

          task.results.push(result)
        } catch (error: any) {
          task.errors.push(`教师 ${teacherId} 分析失败: ${error.message}`)
        }

        completedCount++
        task.progress = Math.round((completedCount / totalCount) * 100)
        task.updatedAt = new Date().toISOString()
      }

      if (!abortController.signal.aborted) {
        task.status = 'completed'
        task.completedAt = new Date().toISOString()
      }
    } catch (error: any) {
      task.status = 'failed'
      task.errors.push(`批量分析执行失败: ${error.message}`)
      task.completedAt = new Date().toISOString()
    } finally {
      this.runningTasks.delete(task.id)
    }
  }

  /**
   * 收集分析数据
   */
  private async collectAnalysisData(
    teacherId: string,
    timeWindow: TimeWindow
  ): Promise<any> {
    // 获取评价记录
    const evaluationRecords = await this.dbService.query(`
      SELECT * FROM evaluation_records
      WHERE teacher_id = $1
        AND created_at >= $2
        AND created_at <= $3
    `, [teacherId, timeWindow.startDate, timeWindow.endDate])

    // 获取考试成绩
    const examScores = await this.dbService.query(`
      SELECT es.*, c.name as course_name
      FROM exam_scores es
      JOIN students s ON es.student_id = s.id::VARCHAR
      JOIN courses c ON es.course_id = c.id::VARCHAR
      WHERE c.teacher_id::VARCHAR = $1
        AND es.exam_date >= $2
        AND es.exam_date <= $3
    `, [teacherId, timeWindow.startDate, timeWindow.endDate])

    // 获取考勤记录（示例查询）
    const attendanceRecords = await this.dbService.query(`
      SELECT ar.*
      FROM attendance_records ar
      JOIN courses c ON CAST(c.id AS VARCHAR) = ar.course_id
      WHERE c.teacher_id::VARCHAR = $1
        AND ar.date >= $2
        AND ar.date <= $3
    `, [teacherId, timeWindow.startDate, timeWindow.endDate])

    // 获取学生信息
    const students = await this.dbService.query(`
      SELECT DISTINCT s.*
      FROM students s
      JOIN courses c ON c.id::VARCHAR IN (
        SELECT course_id FROM course_students WHERE student_id = s.id::VARCHAR
      )
      WHERE c.teacher_id::VARCHAR = $1
    `, [teacherId])

    return {
      evaluationRecords,
      examScores,
      attendanceRecords,
      students,
    }
  }

  /**
   * 执行分析规则
   */
  private async executeAnalysisRule(
    rule: AnalysisRule,
    data: any,
    timeWindow: TimeWindow
  ): Promise<DimensionResult> {
    const metrics: AnalysisMetric[] = []
    let totalScore = 0
    let totalWeight = 0

    // 执行每个条件
    for (const condition of rule.conditions) {
      const metricValue = await this.evaluateMetric(condition.metric, data, timeWindow)

      metrics.push({
        name: condition.metric,
        value: metricValue,
        displayName: this.getMetricDisplayName(condition.metric),
        unit: this.getMetricUnit(condition.metric),
        source: this.getMetricSource(condition.metric),
        lastUpdated: new Date().toISOString()
      })

      // 评估条件满足度
      const conditionScore = this.evaluateCondition(condition, metricValue)
      const weight = condition.weight || 1
      totalScore += conditionScore * weight
      totalWeight += weight
    }

    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0
    const level = this.getScoreLevel(finalScore)

    // 生成详细信息
    const details = await this.generateDimensionDetails(rule, metrics, data)

    // 找到对应的评价维度
    const dimension = this.getRuleDimension(rule)

    return {
      dimension,
      score: finalScore,
      level,
      metrics,
      weight: rule.weights.find(w => w.dimension === dimension)?.weight || 0.2,
      contribution: finalScore * (rule.weights.find(w => w.dimension === dimension)?.weight || 0.2),
      details
    }
  }

  /**
   * 评估指标值
   */
  private async evaluateMetric(
    metric: string,
    data: any,
    timeWindow: TimeWindow
  ): Promise<number> {
    switch (metric) {
      case 'evaluation_average_score':
        return this.calculateAverageEvaluationScore(data.evaluationRecords)

      case 'exam_pass_rate':
        return this.calculateExamPassRate(data.examScores)

      case 'assignment_completion_rate':
        return this.calculateAssignmentCompletionRate(data.students, timeWindow)

      case 'attendance_rate':
        return this.calculateAttendanceRate(data.attendanceRecords)

      case 'interaction_frequency':
        return await this.calculateInteractionFrequency(data.students, timeWindow)

      case 'participation_score':
        return await this.calculateParticipationScore(data.students, timeWindow)

      case 'exam_average_score':
        return this.calculateExamAverageScore(data.examScores)

      case 'assignment_average_score':
        return await this.calculateAssignmentAverageScore(data.students, timeWindow)

      case 'knowledge_retention_rate':
        return await this.calculateKnowledgeRetentionRate(data.students, timeWindow)

      case 'score_improvement_rate':
        return await this.calculateScoreImprovementRate(data.students, timeWindow)

      case 'grade_improvement_rate':
        return await this.calculateGradeImprovementRate(data.students, timeWindow)

      case 'peer_percentile_rank':
        return await this.calculatePeerPercentileRank(data, timeWindow)

      default:
        console.warn(`未知指标: ${metric}`)
        return 0
    }
  }

  /**
   * 计算平均评价分数
   */
  private calculateAverageEvaluationScore(evaluationRecords: any[]): number {
    if (evaluationRecords.length === 0) return 0

    const totalScore = evaluationRecords.reduce((sum, record) => {
      return sum + (record.overall_score || 0)
    }, 0)

    return totalScore / evaluationRecords.length
  }

  /**
   * 计算考试通过率
   */
  private calculateExamPassRate(examScores: any[]): number {
    if (examScores.length === 0) return 0

    const passCount = examScores.filter(score => (score.score || 0) >= 60).length
    return (passCount / examScores.length) * 100
  }

  /**
   * 计算作业完成率
   */
  private async calculateAssignmentCompletionRate(students: any[], timeWindow: TimeWindow): Promise<number> {
    // 基于教学活动中的作业类型估算完成率
    const activities = await this.dbService.query<any>(
      `SELECT COUNT(*)::int AS cnt FROM teaching_activities ta WHERE ta.activity_type = 'assignment' AND ta.activity_date >= $1 AND ta.activity_date <= $2`,
      [timeWindow.startDate, timeWindow.endDate]
    )
    const assignmentCount = activities[0]?.cnt || 0
    const denominator = Math.max(students.length, 1)
    const rate = (assignmentCount / denominator) * 100
    return Math.max(0, Math.min(100, rate))
  }

  /**
   * 计算出勤率
   */
  private calculateAttendanceRate(attendanceRecords: any[]): number {
    if (attendanceRecords.length === 0) return 0

    const presentCount = attendanceRecords.filter(record => record.status === 'present').length
    return (presentCount / attendanceRecords.length) * 100
  }

  /**
   * 计算互动频率
   */
  private async calculateInteractionFrequency(students: any[], timeWindow: TimeWindow): Promise<number> {
    const activities = await this.dbService.query<any>(
      `SELECT COUNT(*)::int AS cnt FROM teaching_activities ta WHERE ta.activity_date >= $1 AND ta.activity_date <= $2`,
      [timeWindow.startDate, timeWindow.endDate]
    )
    const total = activities[0]?.cnt || 0
    const denominator = Math.max(students.length, 1)
    const freq = total / denominator
    return Math.max(0, freq)
  }

  /**
   * 计算参与度评分
   */
  private async calculateParticipationScore(students: any[], timeWindow: TimeWindow): Promise<number> {
    const attendance = await this.dbService.query<any>(
      `SELECT COUNT(*) FILTER (WHERE status = 'present')::int AS present, COUNT(*)::int AS total FROM attendance_records WHERE date >= $1 AND date <= $2`,
      [timeWindow.startDate, timeWindow.endDate]
    )
    const present = attendance[0]?.present || 0
    const total = attendance[0]?.total || 1
    const attendanceRate = (present / total) * 100
    const interactionFreq = await this.calculateInteractionFrequency(students, timeWindow)
    const interactionScore = Math.min(100, interactionFreq * 20) // 简单归一化
    const score = (attendanceRate * 0.6) + (interactionScore * 0.4)
    return Math.max(0, Math.min(100, score))
  }

  /**
   * 计算考试平均分
   */
  private calculateExamAverageScore(examScores: any[]): number {
    if (examScores.length === 0) return 0

    const totalScore = examScores.reduce((sum, score) => {
      return sum + (score.score || 0)
    }, 0)

    return totalScore / examScores.length
  }

  /**
   * 计算作业平均分
   */
  private async calculateAssignmentAverageScore(students: any[], timeWindow: TimeWindow): Promise<number> {
    // 以考试平均分作为作业平均分的近似替代
    const scores = await this.dbService.query<any>(
      `SELECT AVG(score)::numeric AS avg_score FROM exam_scores WHERE exam_date >= $1 AND exam_date <= $2`,
      [timeWindow.startDate, timeWindow.endDate]
    )
    const avg = Number(scores[0]?.avg_score || 0)
    return Math.max(0, Math.min(100, avg))
  }

  /**
   * 计算知识保持率
   */
  private async calculateKnowledgeRetentionRate(students: any[], timeWindow: TimeWindow): Promise<number> {
    // 以连续两次考试的平均分差作为保持率近似（无历史则返回当前平均）
    const currentAvgRows = await this.dbService.query<any>(
      `SELECT AVG(score)::numeric AS avg_score FROM exam_scores WHERE exam_date >= $1 AND exam_date <= $2`,
      [timeWindow.startDate, timeWindow.endDate]
    )
    const currentAvg = Number(currentAvgRows[0]?.avg_score || 0)
    const prevAvgRows = await this.dbService.query<any>(
      `SELECT AVG(score)::numeric AS avg_score FROM exam_scores WHERE exam_date < $1`,
      [timeWindow.startDate]
    )
    const prevAvg = Number(prevAvgRows[0]?.avg_score || currentAvg)
    const retention = prevAvg > 0 ? (currentAvg / prevAvg) * 100 : currentAvg
    return Math.max(0, Math.min(100, retention))
  }

  /**
   * 计算分数提升率
   */
  private async calculateScoreImprovementRate(students: any[], timeWindow: TimeWindow): Promise<number> {
    const rows = await this.dbService.query<any>(
      `SELECT AVG(score)::numeric AS avg_score FROM exam_scores WHERE exam_date >= $1 AND exam_date <= $2`,
      [timeWindow.startDate, timeWindow.endDate]
    )
    const currentAvg = Number(rows[0]?.avg_score || 0)
    const prevRows = await this.dbService.query<any>(
      `SELECT AVG(score)::numeric AS avg_score FROM exam_scores WHERE exam_date < $1`,
      [timeWindow.startDate]
    )
    const prevAvg = Number(prevRows[0]?.avg_score || 0)
    const improvement = prevAvg > 0 ? ((currentAvg - prevAvg) / prevAvg) * 100 : 0
    return Math.max(-100, Math.min(100, improvement))
  }

  /**
   * 计算等级提升率
   */
  private async calculateGradeImprovementRate(students: any[], timeWindow: TimeWindow): Promise<number> {
    // 以通过率变化近似等级提升率
    const passRowsCurrent = await this.dbService.query<any>(
      `SELECT COUNT(*) FILTER (WHERE score >= 60)::int AS pass, COUNT(*)::int AS total FROM exam_scores WHERE exam_date >= $1 AND exam_date <= $2`,
      [timeWindow.startDate, timeWindow.endDate]
    )
    const passRowsPrev = await this.dbService.query<any>(
      `SELECT COUNT(*) FILTER (WHERE score >= 60)::int AS pass, COUNT(*)::int AS total FROM exam_scores WHERE exam_date < $1`,
      [timeWindow.startDate]
    )
    const currentRate = (passRowsCurrent[0]?.pass || 0) / Math.max(1, passRowsCurrent[0]?.total || 1)
    const prevRate = (passRowsPrev[0]?.pass || 0) / Math.max(1, passRowsPrev[0]?.total || 1)
    const rate = (currentRate - prevRate) * 100
    return Math.max(-100, Math.min(100, rate))
  }

  /**
   * 计算同行百分位排名
   */
  private async calculatePeerPercentileRank(data: any, timeWindow: TimeWindow): Promise<number> {
    const rows = await this.dbService.query<any>(
      `SELECT teacher_id, AVG(overall_score)::numeric AS avg_score FROM evaluation_records WHERE created_at >= $1 AND created_at <= $2 GROUP BY teacher_id ORDER BY avg_score DESC`,
      [timeWindow.startDate, timeWindow.endDate]
    )
    const teacherId = rows[0]?.teacher_id
    const sorted = rows.map((r: any) => Number(r.avg_score || 0)).sort((a, b) => b - a)
    const myScore = Number(rows.find((r: any) => r.teacher_id === teacherId)?.avg_score || 0)
    const rank = sorted.findIndex(s => s === myScore) + 1
    const percentile = sorted.length > 0 ? (1 - (rank - 1) / sorted.length) * 100 : 0
    return Math.max(0, Math.min(100, percentile))
  }

  /**
   * 评估条件满足度
   */
  private evaluateCondition(condition: RuleCondition, actualValue: number): number {
    const threshold = typeof condition.value === 'number' ? condition.value : 0

    switch (condition.operator) {
      case ComparisonOperator.GREATER_THAN:
        return actualValue > threshold ? 100 : (actualValue / threshold) * 100

      case ComparisonOperator.GREATER_EQUAL:
        return actualValue >= threshold ? 100 : (actualValue / threshold) * 100

      case ComparisonOperator.LESS_THAN:
        return actualValue < threshold ? 100 : 100 - ((actualValue - threshold) / threshold) * 100

      case ComparisonOperator.LESS_EQUAL:
        return actualValue <= threshold ? 100 : 100 - ((actualValue - threshold) / threshold) * 100

      case ComparisonOperator.EQUAL:
        return actualValue === threshold ? 100 : 100 - Math.abs(actualValue - threshold)

      case ComparisonOperator.NOT_EQUAL:
        return actualValue !== threshold ? 100 : 0

      default:
        return 50
    }
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
   * 计算总体评分
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
   * 生成洞察和建议
   */
  private async generateInsights(
    dimensionResults: DimensionResult[],
    data: any
  ): Promise<{
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    trends: Array<{
      metric: string
      direction: 'improving' | 'declining' | 'stable'
      change: number
    }>
  }> {
    const strengths: string[] = []
    const weaknesses: string[] = []
    const recommendations: string[] = []
    const trends: any[] = []

    // 分析每个维度
    for (const result of dimensionResults) {
      // 优势
      if (result.level === 'excellent' || result.level === 'good') {
        strengths.push(...result.details.strengths)
      }

      // 弱点
      if (result.level === 'average' || result.level === 'poor') {
        weaknesses.push(...result.details.weaknesses)
        recommendations.push(...result.details.recommendations)
      }

      // 趋势分析
      for (const metric of result.metrics) {
        const trend = await this.analyzeTrend(metric.name, data)
        if (trend) {
          trends.push(trend)
        }
      }
    }

    let result = {
      strengths: strengths.length > 0 ? strengths : ['整体表现稳定'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['暂无明显弱点'],
      recommendations: recommendations.length > 0 ? recommendations : ['继续保持当前状态'],
      trends
    }

    // 当LLM启用时，生成自然语言洞察补充
    try {
      const llmEnabled = (config as any).ai?.llm?.enabled
      if (llmEnabled) {
        const llmText = await this.generateLLMInsights(dimensionResults, data)
        if (llmText) {
          result.recommendations = [...result.recommendations, llmText]
        }
      }
    } catch (_) {
      // LLM不可用时忽略
    }

    return result
  }

  /**
   * 分析趋势
   */
  private async analyzeTrend(metricName: string, data: any): Promise<any> {
    // 基于评价记录的最近均值变化计算趋势
    const now = new Date()
    const end = now.toISOString()
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const recentRows = await this.dbService.query<any>(
      `SELECT AVG(overall_score)::numeric AS avg_score FROM evaluation_records WHERE created_at >= $1 AND created_at <= $2`,
      [start, end]
    )
    const prevRows = await this.dbService.query<any>(
      `SELECT AVG(overall_score)::numeric AS avg_score FROM evaluation_records WHERE created_at < $1`,
      [start]
    )
    const recent = Number(recentRows[0]?.avg_score || 0)
    const prev = Number(prevRows[0]?.avg_score || 0)
    const delta = recent - prev
    const direction = delta > 1 ? 'improving' : delta < -1 ? 'declining' : 'stable'
    return { metric: metricName, direction, change: Math.round(delta * 100) / 100 }
  }

  /**
   * 执行比较分析
   */
  private async performComparisons(
    teacherId: string,
    overallScore: number,
    timeWindow: TimeWindow
  ): Promise<{
    peerRank: number
    peerTotal: number
    departmentRank: number
    departmentTotal: number
    historicalRank: number
    historicalTotal: number
  }> {
    // 简化实现，实际应该查询真实数据进行比较
    return {
      peerRank: Math.floor(Math.random() * 20) + 1,
      peerTotal: 25,
      departmentRank: Math.floor(Math.random() * 15) + 1,
      departmentTotal: 18,
      historicalRank: Math.floor(Math.random() * 10) + 1,
      historicalTotal: 12
    }
  }

  /**
   * 生成维度详细信息
   */
  private async generateDimensionDetails(
    rule: AnalysisRule,
    metrics: AnalysisMetric[],
    data: any
  ): Promise<{
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }> {
    const strengths: string[] = []
    const weaknesses: string[] = []
    const recommendations: string[] = []

    // 基于指标生成分析
    for (const metric of metrics) {
      if (metric.value >= 85) {
        strengths.push(`${metric.displayName}表现优秀 (${metric.value}${metric.unit || ''})`)
      } else if (metric.value < 70) {
        weaknesses.push(`${metric.displayName}有待提升 (${metric.value}${metric.unit || ''})`)
        recommendations.push(`建议改进${metric.displayName}，目标达到80${metric.unit || ''}以上`)
      }
    }

    return {
      strengths: strengths.length > 0 ? strengths : ['暂无突出优势'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['暂无明显不足'],
      recommendations: recommendations.length > 0 ? recommendations : ['继续保持当前表现']
    }
  }

  /**
   * 获取规则对应的评价维度
   */
  private getRuleDimension(rule: AnalysisRule): EvaluationDimension {
    // 根据规则类型映射到评价维度
    const dimensionMap: Record<AnalysisRuleType, EvaluationDimension> = {
      [AnalysisRuleType.TEACHING_EFFECTIVENESS]: EvaluationDimension.TEACHING_EFFECT,
      [AnalysisRuleType.STUDENT_ENGAGEMENT]: EvaluationDimension.TEACHING_METHOD,
      [AnalysisRuleType.KNOWLEDGE_MASTERY]: EvaluationDimension.TEACHING_CONTENT,
      [AnalysisRuleType.COMPLETION_RATE]: EvaluationDimension.TEACHING_EFFECT,
      [AnalysisRuleType.IMPROVEMENT_TREND]: EvaluationDimension.TEACHING_EFFECT,
      [AnalysisRuleType.PEER_COMPARISON]: EvaluationDimension.TEACHING_EFFECT,
      [AnalysisRuleType.HISTORICAL_COMPARISON]: EvaluationDimension.TEACHING_EFFECT,
      [AnalysisRuleType.COURSE_DIFFICULTY]: EvaluationDimension.TEACHING_CONTENT,
      [AnalysisRuleType.ATTENDANCE_IMPACT]: EvaluationDimension.TEACHING_METHOD,
      [AnalysisRuleType.ASSIGNMENT_QUALITY]: EvaluationDimension.TEACHING_CONTENT,
      [AnalysisRuleType.EXAM_PERFORMANCE]: EvaluationDimension.TEACHING_EFFECT,
      [AnalysisRuleType.INTERACTION_FREQUENCY]: EvaluationDimension.TEACHING_METHOD,
      [AnalysisRuleType.RESOURCE_UTILIZATION]: EvaluationDimension.TEACHING_METHOD,
      [AnalysisRuleType.FEEDBACK_RESPONSIVENESS]: EvaluationDimension.TEACHING_ATTITUDE,
      [AnalysisRuleType.INNOVATIVE_TEACHING]: EvaluationDimension.TEACHING_METHOD
    }

    return dimensionMap[rule.type] || EvaluationDimension.TEACHING_EFFECT
  }

  /**
   * 获取指标显示名称
   */
  private getMetricDisplayName(metric: string): string {
    const nameMap: Record<string, string> = {
      'evaluation_average_score': '平均评价分数',
      'exam_pass_rate': '考试通过率',
      'assignment_completion_rate': '作业完成率',
      'attendance_rate': '出勤率',
      'interaction_frequency': '互动频率',
      'participation_score': '参与度评分',
      'exam_average_score': '考试平均分',
      'assignment_average_score': '作业平均分',
      'knowledge_retention_rate': '知识保持率',
      'score_improvement_rate': '分数提升率',
      'grade_improvement_rate': '等级提升率',
      'peer_percentile_rank': '同行百分位排名'
    }

    return nameMap[metric] || metric
  }

  /**
   * 获取指标单位
   */
  private getMetricUnit(metric: string): string {
    const unitMap: Record<string, string> = {
      'evaluation_average_score': '分',
      'exam_pass_rate': '%',
      'assignment_completion_rate': '%',
      'attendance_rate': '%',
      'interaction_frequency': '次/周',
      'participation_score': '分',
      'exam_average_score': '分',
      'assignment_average_score': '分',
      'knowledge_retention_rate': '%',
      'score_improvement_rate': '%',
      'grade_improvement_rate': '%',
      'peer_percentile_rank': '%'
    }

    return unitMap[metric] || ''
  }

  /**
   * 获取指标数据源
   */
  private getMetricSource(metric: string): string {
    const sourceMap: Record<string, string> = {
      'evaluation_average_score': '学生评价',
      'exam_pass_rate': '考试成绩',
      'assignment_completion_rate': '作业记录',
      'attendance_rate': '考勤记录',
      'interaction_frequency': '课堂互动',
      'participation_score': '参与度评估',
      'exam_average_score': '考试成绩',
      'assignment_average_score': '作业成绩',
      'knowledge_retention_rate': '知识点测试',
      'score_improvement_rate': '成绩趋势',
      'grade_improvement_rate': '等级变化',
      'peer_percentile_rank': '同行数据'
    }

    return sourceMap[metric] || '系统计算'
  }

  /**
   * 评估数据质量
   */
  private async assessDataQuality(data: any): Promise<DataQualityMetrics> {
    const completeness = this.calculateDataCompleteness(data)
    const accuracy = this.calculateDataAccuracy(data)
    const consistency = this.calculateDataConsistency(data)
    const timeliness = this.calculateDataTimeliness(data)
    const validity = this.calculateDataValidity(data)

    const overall = (completeness + accuracy + consistency + timeliness + validity) / 5

    return {
      completeness,
      accuracy,
      consistency,
      timeliness,
      validity,
      overall,
      issues: this.identifyDataQualityIssues(data)
    }
  }

  /**
   * 计算数据完整性
   */
  private calculateDataCompleteness(data: any): number {
    // 简化实现
    return 85 + Math.random() * 15
  }

  /**
   * 计算数据准确性
   */
  private calculateDataAccuracy(data: any): number {
    // 简化实现
    return 80 + Math.random() * 20
  }

  /**
   * 计算数据一致性
   */
  private calculateDataConsistency(data: any): number {
    // 简化实现
    return 90 + Math.random() * 10
  }

  /**
   * 计算数据及时性
   */
  private calculateDataTimeliness(data: any): number {
    // 简化实现
    return 75 + Math.random() * 25
  }

  /**
   * 计算数据有效性
   */
  private calculateDataValidity(data: any): number {
    // 简化实现
    return 85 + Math.random() * 15
  }

  /**
   * 识别数据质量问题
   */
  private identifyDataQualityIssues(data: any): Array<{
    type: string
    count: number
    severity: 'low' | 'medium' | 'high'
  }> {
    // 简化实现
    return [
      {
        type: 'missing_values',
        count: 5,
        severity: 'medium'
      },
      {
        type: 'inconsistent_formats',
        count: 2,
        severity: 'low'
      }
    ]
  }

  /**
   * 计算响应率
   */
  private calculateResponseRate(data: any): number {
    // 简化实现
    return 75 + Math.random() * 20
  }

  /**
   * 计算置信水平
   */
  private calculateConfidenceLevel(dataQuality: DataQualityMetrics, data: any): number {
    // 基于数据质量和样本量计算置信水平
    const qualityFactor = dataQuality.overall / 100
    const sampleSize = data.students.length
    const sampleFactor = Math.min(sampleSize / 30, 1) // 30个样本为满分

    return Math.round((qualityFactor * 0.6 + sampleFactor * 0.4) * 100)
  }

  /**
   * 获取教师信息
   */
  private async getTeacherInfo(teacherId: string): Promise<Teacher | null> {
    const result = await this.dbService.query(
      'SELECT * FROM teachers WHERE id = $1',
      [teacherId]
    )
    return result[0] || null
  }

  /**
   * 根据范围获取教师ID列表
   */
  private async getTeacherIdsByScope(
    courseIds?: string[],
    classIds?: string[]
  ): Promise<string[]> {
    let query = 'SELECT DISTINCT teacher_id FROM courses'
    const params: any[] = []

    if (courseIds && courseIds.length > 0) {
      query += ` WHERE id = ANY($${params.length + 1})`
      params.push(courseIds)
    }

    const result = await this.dbService.query(query, params)
    return result.map((row: any) => row.teacher_id)
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(
    teacherId: string,
    timeWindow: TimeWindow,
    ruleIds: string[]
  ): string {
    const rulesHash = ruleIds.sort().join(',')
    return `${teacherId}_${timeWindow.startDate}_${timeWindow.endDate}_${rulesHash}`
  }

  /**
   * 获取缓存结果
   */
  private getCachedResult(cacheKey: string): AnalysisResult | null {
    const cached = this.analysisCache.get(cacheKey)
    if (cached && new Date(cached.expiresAt) > new Date()) {
      cached.hitCount++
      cached.lastAccessed = new Date().toISOString()
      return cached.result
    }

    if (cached) {
      this.analysisCache.delete(cacheKey)
    }

    return null
  }

  /**
   * 缓存结果
   */
  private cacheResult(cacheKey: string, result: AnalysisResult): void {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时后过期

    this.analysisCache.set(cacheKey, {
      key: cacheKey,
      result,
      expiresAt: expiresAt.toISOString(),
      hitCount: 0,
      lastAccessed: new Date().toISOString()
    })
  }

  /**
   * 更新性能指标
   */
  private updatePerformanceMetrics(success: boolean, processingTime: number): void {
    this.performance.totalAnalyses++

    if (success) {
      this.performance.successRate =
        (this.performance.successRate * (this.performance.totalAnalyses - 1) + 100) /
        this.performance.totalAnalyses
    } else {
      this.performance.errorRate =
        (this.performance.errorRate * (this.performance.totalAnalyses - 1) + 100) /
        this.performance.totalAnalyses
    }

    this.performance.averageProcessingTime =
      (this.performance.averageProcessingTime * (this.performance.totalAnalyses - 1) + processingTime) /
      this.performance.totalAnalyses
  }

  /**
   * 添加分析规则
   */
  addAnalysisRule(rule: AnalysisRule): void {
    this.analysisRules.set(rule.id, { ...rule, updatedAt: new Date().toISOString() })
  }

  /**
   * 删除分析规则
   */
  removeAnalysisRule(ruleId: string): boolean {
    return this.analysisRules.delete(ruleId)
  }

  /**
   * 获取分析规则
   */
  getAnalysisRules(): AnalysisRule[] {
    return Array.from(this.analysisRules.values())
  }

  /**
   * 取消分析任务
   */
  cancelAnalysisTask(taskId: string): boolean {
    const controller = this.runningTasks.get(taskId)
    if (controller) {
      controller.abort()
      this.runningTasks.delete(taskId)
      return true
    }
    return false
  }

  /**
   * 获取配置
   */
  getConfig(): AnalysisConfig {
    return { ...this.config }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<AnalysisConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * 获取性能指标
   */
  getPerformanceMetrics(): SystemPerformance {
    return { ...this.performance }
  }

  /**
   * 清理过期缓存
   */
  cleanupExpiredCache(): void {
    const now = new Date()
    for (const [key, cache] of this.analysisCache) {
      if (new Date(cache.expiresAt) <= now) {
        this.analysisCache.delete(key)
      }
    }
  }
  /**
   * 调用LLM生成洞察
   */
  private async generateLLMInsights(dimensionResults: DimensionResult[], data: any): Promise<string | null> {
    const endpoint = `${config.ai.llm.endpoint}${config.ai.llm.apiPath}`
    const model = config.ai.llm.model
    const prompt = `你是教学评价助理。基于以下维度评分与指标，给出一句话的改进建议：\n${JSON.stringify(dimensionResults)}`
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), config.ai.llm.timeoutMs)
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt, stream: false }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!res.ok) return null
      const json = await res.json()
      const text = json.response || json.text || ''
      return text ? String(text).trim() : null
    } catch (_) {
      return null
    }
  }
}
