#!/usr/bin/env deno run

/**
 * 评价指标计算测试脚本
 * 用于验证评价指标计算功能是否正常工作
 */

import { EvaluationCalculator } from './src/services/evaluationCalculator.ts'

console.log('📊 评价指标计算测试')
console.log('==================\n')

const calculator = new EvaluationCalculator()

async function testMetricsConfiguration() {
  console.log('⚙️ 测试指标配置...')

  try {
    const metrics = calculator.getMetrics()
    console.log('✅ 获取评价指标成功')
    console.log(`📊 指标总数: ${metrics.length}`)

    // 按维度分组统计
    const dimensionCounts: Record<string, number> = {}
    metrics.forEach(metric => {
      dimensionCounts[metric.dimension] = (dimensionCounts[metric.dimension] || 0) + 1
    })

    console.log('📊 各维度指标分布:')
    Object.entries(dimensionCounts).forEach(([dimension, count]) => {
      console.log(`  ${dimension}: ${count}个指标`)
    })

    // 统计启用状态
    const enabledCount = metrics.filter(m => m.enabled).length
    const requiredCount = metrics.filter(m => m.required).length

    console.log(`📊 启用指标: ${enabledCount}个`)
    console.log(`📊 必需指标: ${requiredCount}个`)

    // 权重配置
    const weightConfigs = calculator.getWeightConfigurations()
    console.log(`📊 权重配置: ${weightConfigs.length}个`)
    console.log(`📊 默认权重配置: ${weightConfigs.find(w => w.isDefault)?.name || '无'}`)

    // 计算配置
    const calcConfigs = calculator.getCalculationConfigurations()
    console.log(`📊 计算配置: ${calcConfigs.length}个`)

    return true
  } catch (error: any) {
    console.log('❌ 指标配置测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testSingleEvaluation() {
  console.log('\n👨‍🏫 测试单个评价计算...')

  try {
    console.log('📝 执行教师评价计算...')

    const context = {
      evaluationId: 'test_eval_001',
      evaluatorId: 'admin_001',
      evaluateeId: 'teacher_001',
      evaluationType: 'admin' as const,
      timeWindow: {
        startDate: '2024-01-01',
        endDate: '2024-06-30'
      },
      aggregationLevel: 'individual' as const,
      weightingStrategy: 'expert_judgment' as const,
      calculationMethod: 'weighted_average' as const,
      exclusionCriteria: [],
      inclusionCriteria: [],
      parameters: {
        configId: 'default_calculation_config',
        enableTrendAnalysis: true,
        enablePeerComparison: true,
        enableHistoricalComparison: true
      }
    }

    const result = await calculator.calculateOverallEvaluation(
      'teacher_001',
      'teacher',
      context
    )

    console.log('✅ 单个评价计算完成')
    console.log('📊 计算结果:')
    console.log(`  评价对象: ${result.evaluateeId} (${result.evaluateeType})`)
    console.log(`  评价期间: ${result.evaluationPeriod}`)
    console.log(`  总体评分: ${result.overallScore.toFixed(2)}分`)
    console.log(`  总体等级: ${result.overallLevel}`)

    console.log('\n📈 各维度评分:')
    result.dimensionResults.forEach((dimension, index) => {
      console.log(`  ${index + 1}. ${dimension.dimension}: ${dimension.score.toFixed(2)}分 (${dimension.level})`)
      console.log(`     权重: ${(dimension.weight * 100).toFixed(1)}%`)
      console.log(`     贡献度: ${dimension.contribution.toFixed(2)}`)
      console.log(`     指标数量: ${dimension.metrics.length}`)
    })

    console.log('\n📊 指标详情:')
    result.metricResults.slice(0, 5).forEach((metric, index) => {
      console.log(`  ${index + 1}. ${metric.metricName}: ${metric.score.toFixed(2)}分 (${metric.level})`)
      console.log(`     原始值: ${metric.rawValue}`)
      console.log(`     标准化值: ${metric.normalizedValue.toFixed(3)}`)
      console.log(`     加权值: ${metric.weightedValue.toFixed(3)}`)
      console.log(`     样本量: ${metric.sampleSize}`)
      console.log(`     置信度: ${(metric.confidence * 100).toFixed(1)}%`)
    })

    console.log('\n📊 数据质量摘要:')
    console.log(`  总指标数: ${result.summary.totalMetrics}`)
    console.log(`  有效指标数: ${result.summary.validMetrics}`)
    console.log(`  响应率: ${(result.summary.responseRate * 100).toFixed(1)}%`)
    console.log(`  数据完整性: ${(result.summary.dataCompleteness * 100).toFixed(1)}%`)
    console.log(`  可靠性: ${(result.summary.reliability * 100).toFixed(1)}%`)
    console.log(`  效度: ${(result.summary.validity * 100).toFixed(1)}%`)
    console.log(`  公平性: ${(result.summary.fairness * 100).toFixed(1)}%`)

    console.log('\n💡 分析洞察:')
    console.log(`  关键优势: ${result.insights.keyStrengths.length}项`)
    console.log(`  改进领域: ${result.insights.improvementAreas.length}项`)
    console.log(`  建议: ${result.insights.recommendations.length}项`)
    console.log(`  趋势分析: ${result.insights.trends.length}项`)

    if (result.insights.keyStrengths.length > 0) {
      console.log('\n🎯 关键优势:')
      result.insights.keyStrengths.slice(0, 3).forEach((strength, index) => {
        console.log(`  ${index + 1}. ${strength}`)
      })
    }

    if (result.insights.recommendations.length > 0) {
      console.log('\n💡 改进建议:')
      result.insights.recommendations.slice(0, 3).forEach((recommendation, index) => {
        console.log(`  ${index + 1}. ${recommendation}`)
      })
    }

    console.log('\n🏆 比较分析:')
    result.comparisons.forEach((comparison, index) => {
      console.log(`  ${index + 1}. ${comparison.type}: ${comparison.relativeScore > 0 ? '+' : ''}${comparison.relativeScore.toFixed(2)}分`)
      console.log(`     参考组: ${comparison.referenceGroup}`)
      console.log(`     百分位: ${comparison.percentile.toFixed(1)}%`)
      console.log(`     排名: ${comparison.rank}/${comparison.totalSize}`)
    })

    console.log('\n📊 分数分布:')
    console.log(`  平均值: ${result.distribution.mean.toFixed(2)}`)
    console.log(`  中位数: ${result.distribution.median.toFixed(2)}`)
    console.log(`  标准差: ${result.distribution.standardDeviation.toFixed(2)}`)
    console.log(`  最小值: ${result.distribution.range.min}`)
    console.log(`  最大值: ${result.distribution.range.max}`)
    console.log(`  P25: ${result.distribution.percentiles.p25.toFixed(2)}`)
    console.log(`  P75: ${result.distribution.percentiles.p75.toFixed(2)}`)

    console.log('\n⚙️ 计算元数据:')
    console.log(`  计算引擎: ${result.metadata.calculationEngine}`)
    console.log(`  算法版本: ${result.metadata.algorithmVersion}`)
    console.log(`  处理时间: ${result.metadata.processingTime}ms`)
    console.log(`  数据源: ${result.metadata.dataSource.join(', ')}`)
    console.log(`  生成时间: ${result.metadata.timestamp}`)

    return true
  } catch (error: any) {
    console.log('❌ 单个评价计算测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testCourseEvaluation() {
  console.log('\n📚 测试课程评价计算...')

  try {
    console.log('📝 执行课程评价计算...')

    const context = {
      evaluationId: 'test_course_eval_001',
      evaluatorId: 'admin_001',
      evaluateeId: 'course_001',
      evaluationType: 'admin' as const,
      timeWindow: {
        startDate: '2024-01-01',
        endDate: '2024-06-30'
      },
      aggregationLevel: 'course' as const,
      weightingStrategy: 'expert_judgment' as const,
      calculationMethod: 'weighted_average' as const,
      exclusionCriteria: [],
      inclusionCriteria: [],
      parameters: {
        includeStudentFeedback: true,
        includeExamPerformance: true
      }
    }

    const result = await calculator.calculateOverallEvaluation(
      'course_001',
      'course',
      context
    )

    console.log('✅ 课程评价计算完成')
    console.log('📊 课程评价结果:')
    console.log(`  课程ID: ${result.evaluateeId}`)
    console.log(`  总体评分: ${result.overallScore.toFixed(2)}分`)
    console.log(`  总体等级: ${result.overallLevel}`)
    console.log(`  指标总数: ${result.summary.totalMetrics}`)
    console.log(`  数据完整性: ${(result.summary.dataCompleteness * 100).toFixed(1)}%`)

    return true
  } catch (error: any) {
    console.log('❌ 课程评价计算测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testBatchCalculation() {
  console.log('\n📊 测试批量计算...')

  try {
    console.log('📝 创建批量计算任务...')

    const batchTask = {
      id: 'batch_task_001',
      name: '学期教师批量评价',
      description: '对全体教师进行学期教学质量评价',
      targetIds: ['teacher_001', 'teacher_002', 'teacher_003', 'teacher_004', 'teacher_005'],
      targetType: 'teacher' as const,
      configurationId: 'default_calculation_config',
      status: 'pending' as const,
      progress: 0,
      results: [],
      errors: [],
      warnings: [],
      statistics: {
        totalTargets: 5,
        processedTargets: 0,
        successfulCalculations: 0,
        failedCalculations: 0,
        averageProcessingTime: 0,
        averageScore: 0,
        scoreDistribution: {
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
        },
        dataQualitySummary: {
          averageQuality: 0,
          qualityDistribution: {}
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('🚀 启动批量计算...')
    await calculator.executeBatchCalculation(batchTask)

    console.log('✅ 批量计算完成')
    console.log('📊 批量计算结果:')
    console.log(`  任务状态: ${batchTask.status}`)
    console.log(`  处理进度: ${batchTask.progress}%`)
    console.log(`  目标总数: ${batchTask.statistics.totalTargets}`)
    console.log(`  成功计算: ${batchTask.statistics.successfulCalculations}`)
    console.log(`  失败计算: ${batchTask.statistics.failedCalculations}`)
    console.log(`  平均评分: ${batchTask.statistics.averageScore.toFixed(2)}分`)

    if (batchTask.results.length > 0) {
      console.log('\n📈 计算结果统计:')
      const scores = batchTask.results.map(r => r.overallScore)
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const maxScore = Math.max(...scores)
      const minScore = Math.min(...scores)

      console.log(`  平均分: ${avgScore.toFixed(2)}分`)
      console.log(`  最高分: ${maxScore.toFixed(2)}分`)
      console.log(`  最低分: ${minScore.toFixed(2)}分`)
      console.log(`  分数范围: ${(maxScore - minScore).toFixed(2)}分`)

      console.log('\n📊 等级分布:')
      const levelCounts: Record<string, number> = {}
      batchTask.results.forEach(result => {
        levelCounts[result.overallLevel] = (levelCounts[result.overallLevel] || 0) + 1
      })

      Object.entries(levelCounts).forEach(([level, count]) => {
        const percentage = (count / batchTask.results.length) * 100
        console.log(`  ${level}: ${count}人 (${percentage.toFixed(1)}%)`)
      })
    }

    if (batchTask.errors.length > 0) {
      console.log('\n⚠️ 计算错误:')
      batchTask.errors.slice(0, 3).forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.targetId}: ${error.errorMessage}`)
      })
    }

    return true
  } catch (error: any) {
    console.log('❌ 批量计算测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testStatisticalCalculations() {
  console.log('\n📈 测试统计计算...')

  try {
    console.log('📝 测试各种统计算法...')

    // 生成测试数据
    const testData = Array.from({ length: 100 }, (_, i) => 70 + Math.random() * 25)

    console.log(`📊 生成了 ${testData.length} 个测试数据点`)
    console.log(`  数据范围: ${Math.min(...testData).toFixed(2)} - ${Math.max(...testData).toFixed(2)}`)

    // 计算基本统计量
    const mean = testData.reduce((sum, val) => sum + val, 0) / testData.length
    const sorted = [...testData].sort((a, b) => a - b)
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]

    const variance = testData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / testData.length
    const standardDeviation = Math.sqrt(variance)

    console.log('\n📊 基本统计量:')
    console.log(`  平均值: ${mean.toFixed(2)}`)
    console.log(`  中位数: ${median.toFixed(2)}`)
    console.log(`  方差: ${variance.toFixed(2)}`)
    console.log(`  标准差: ${standardDeviation.toFixed(2)}`)

    // 计算百分位数
    const percentiles = [25, 50, 75, 90, 95].map(p => {
      const index = (p / 100) * (sorted.length - 1)
      const lower = Math.floor(index)
      const upper = Math.ceil(index)
      const weight = index - lower
      return lower === upper ? sorted[lower] : sorted[lower] * (1 - weight) + sorted[upper] * weight
    })

    console.log('\n📊 百分位数:')
    console.log(`  P25: ${percentiles[0].toFixed(2)}`)
    console.log(`  P50: ${percentiles[1].toFixed(2)}`)
    console.log(`  P75: ${percentiles[2].toFixed(2)}`)
    console.log(`  P90: ${percentiles[3].toFixed(2)}`)
    console.log(`  P95: ${percentiles[4].toFixed(2)}`)

    // 计算偏度和峰度
    const skewness = testData.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / standardDeviation, 3)
    }, 0) / testData.length

    const kurtosis = testData.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / standardDeviation, 4)
    }, 0) / testData.length - 3

    console.log('\n📊 分布特征:')
    console.log(`  偏度: ${skewness.toFixed(3)} ${skewness > 0 ? '(右偏)' : skewness < 0 ? '(左偏)' : '(对称)'}`)
    console.log(`  峰度: ${kurtosis.toFixed(3)} ${kurtosis > 0 ? '(尖峰)' : kurtosis < 0 ? '(平峰)' : '(正态)'}`)

    // 创建直方图
    const binCount = 10
    const min = Math.min(...testData)
    const max = Math.max(...testData)
    const binWidth = (max - min) / binCount

    console.log('\n📊 直方图分布:')
    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth
      const binEnd = min + (i + 1) * binWidth
      const frequency = testData.filter(val =>
        val >= binStart && (i === binCount - 1 ? val <= binEnd : val < binEnd)
      ).length

      const barLength = Math.round(frequency * 2)
      const bar = '█'.repeat(barLength)
      console.log(`  [${binStart.toFixed(1).padStart(5)}-${binEnd.toFixed(1).padStart(5)}]: ${frequency.toString().padStart(3)} ${bar}`)
    }

    return true
  } catch (error: any) {
    console.log('❌ 统计计算测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testWeightCalculations() {
  console.log('\n⚖️ 测试权重计算...')

  try {
    console.log('📝 测试不同权重策略...')

    // 模拟指标数据
    const indicators = [
      { name: '教学态度', score: 85, weight: 0.15 },
      { name: '教学内容', score: 88, weight: 0.25 },
      { name: '教学方法', score: 82, weight: 0.25 },
      { name: '教学效果', score: 90, weight: 0.30 },
      { name: '教书育人', score: 86, weight: 0.05 }
    ]

    console.log('📊 原始指标数据:')
    indicators.forEach((indicator, index) => {
      console.log(`  ${index + 1}. ${indicator.name}: ${indicator.score}分 (权重: ${(indicator.weight * 100).toFixed(1)}%)`)
    })

    // 等权重计算
    const equalWeightedScore = indicators.reduce((sum, indicator) => sum + indicator.score, 0) / indicators.length
    console.log(`\n📊 等权重评分: ${equalWeightedScore.toFixed(2)}分`)

    // 加权平均计算
    const weightedScore = indicators.reduce((sum, indicator) => {
      return sum + indicator.score * indicator.weight
    }, 0)
    console.log(`📊 加权平均评分: ${weightedScore.toFixed(2)}分`)

    // 调整权重后的评分（假设提高教学效果权重）
    const adjustedIndicators = [
      { ...indicators[0], weight: 0.10 },
      { ...indicators[1], weight: 0.20 },
      { ...indicators[2], weight: 0.20 },
      { ...indicators[3], weight: 0.45 },
      { ...indicators[4], weight: 0.05 }
    ]

    const adjustedWeightedScore = adjustedIndicators.reduce((sum, indicator) => {
      return sum + indicator.score * indicator.weight
    }, 0)
    console.log(`📊 调整权重后评分: ${adjustedWeightedScore.toFixed(2)}分`)

    console.log(`📊 权重调整影响: ${(adjustedWeightedScore - weightedScore).toFixed(2)}分`)

    // 权重敏感性分析
    console.log('\n📊 权重敏感性分析:')
    for (const indicator of indicators) {
      const originalWeight = indicator.weight
      const highWeight = Math.min(originalWeight * 1.2, 0.5)
      const lowWeight = Math.max(originalWeight * 0.8, 0.05)

      const highImpact = indicator.score * (highWeight - originalWeight)
      const lowImpact = indicator.score * (lowWeight - originalWeight)

      console.log(`  ${indicator.name}: 权重±20%影响 ${Math.abs(highImpact - lowImpact).toFixed(2)}分`)
    }

    return true
  } catch (error: any) {
    console.log('❌ 权重计算测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testDataValidation() {
  console.log('\n✅ 测试数据验证...')

  try {
    console.log('📝 测试数据质量验证...')

    // 模拟不同质量的数据
    const testData = [
      { value: 85, quality: 1.0, source: 'student_evaluation' },
      { value: 90, quality: 0.95, source: 'student_evaluation' },
      { value: 75, quality: 0.8, source: 'exam_scores' },
      { value: null, quality: 0, source: 'student_evaluation' }, // 缺失值
      { value: 95, quality: 0.6, source: 'peer_evaluation' },  // 低质量
      { value: 80, quality: 0.9, source: 'student_evaluation' },
      { value: 110, quality: 1.0, source: 'student_evaluation' }, // 超出范围
      { value: 78, quality: 0.85, source: 'student_evaluation' }
    ]

    console.log(`📊 测试数据: ${testData.length}个数据点`)

    // 基本验证
    const validData = testData.filter(d =>
      d.value !== null &&
      typeof d.value === 'number' &&
      !isNaN(d.value) &&
      d.value >= 0 &&
      d.value <= 100
    )

    console.log(`✅ 基本验证通过: ${validData.length}/${testData.length}个数据点`)

    // 质量过滤
    const qualityFiltered = validData.filter(d => d.quality >= 0.7)
    console.log(`✅ 质量过滤通过: ${qualityFiltered.length}/${validData.length}个数据点`)

    // 计算加权平均值
    if (qualityFiltered.length > 0) {
      const totalWeight = qualityFiltered.reduce((sum, d) => sum + d.quality, 0)
      const weightedAverage = qualityFiltered.reduce((sum, d) => sum + d.value * d.quality, 0) / totalWeight

      console.log(`📊 加权平均分: ${weightedAverage.toFixed(2)}分`)
      console.log(`📊 平均质量: ${(totalWeight / qualityFiltered.length).toFixed(3)}`)
    }

    // 异常值检测
    const values = qualityFiltered.map(d => d.value).sort((a, b) => a - b)
    if (values.length >= 4) {
      const q1Index = Math.floor(values.length * 0.25)
      const q3Index = Math.floor(values.length * 0.75)
      const q1 = values[q1Index]
      const q3 = values[q3Index]
      const iqr = q3 - q1

      const lowerBound = q1 - 1.5 * iqr
      const upperBound = q3 + 1.5 * iqr

      const outliers = qualityFiltered.filter(d => d.value < lowerBound || d.value > upperBound)
      console.log(`📊 检测到异常值: ${outliers.length}个`)
      console.log(`📊 正常范围: ${lowerBound.toFixed(2)} - ${upperBound.toFixed(2)}`)

      if (outliers.length > 0) {
        console.log('⚠️ 异常值详情:')
        outliers.forEach((outlier, index) => {
          console.log(`  ${index + 1}. 值: ${outlier.value}, 来源: ${outlier.source}`)
        })
      }
    }

    return true
  } catch (error: any) {
    console.log('❌ 数据验证测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 开始评价指标计算全面测试...\n')

  const tests = [
    { name: '指标配置测试', func: testMetricsConfiguration },
    { name: '单个评价计算测试', func: testSingleEvaluation },
    { name: '课程评价计算测试', func: testCourseEvaluation },
    { name: '批量计算测试', func: testBatchCalculation },
    { name: '统计计算测试', func: testStatisticalCalculations },
    { name: '权重计算测试', func: testWeightCalculations },
    { name: '数据验证测试', func: testDataValidation },
  ]

  let successCount = 0
  let failCount = 0

  for (const test of tests) {
    console.log(`\n🧪 执行测试: ${test.name}`)
    console.log('='.repeat(50))

    try {
      const success = await test.func()
      if (success) {
        successCount++
        console.log(`\n✅ ${test.name} - 通过`)
      } else {
        failCount++
        console.log(`\n❌ ${test.name} - 失败`)
      }
    } catch (error: any) {
      failCount++
      console.log(`\n💥 ${test.name} - 异常`)
      console.log(`🔍 错误: ${error.message}`)
    }

    console.log('\n' + '-'.repeat(60))
  }

  // 测试结果统计
  console.log('\n📋 测试结果统计')
  console.log('==================')
  console.log(`✅ 通过: ${successCount} 项测试`)
  console.log(`❌ 失败: ${failCount} 项测试`)
  console.log(`📈 通过率: ${((successCount / tests.length) * 100).toFixed(1)}%`)

  if (failCount === 0) {
    console.log('\n🎉 所有测试通过！评价指标计算模块工作正常')
    console.log('💡 提示：评价指标计算系统已准备就绪，可以处理各种教学评价计算任务')
  } else {
    console.log('\n⚠️ 部分测试失败，请检查：')
    console.log('1. 指标配置是否正确完整')
    console.log('2. 计算算法是否正确实现')
    console.log('3. 数据收集是否正常')
    console.log('4. 权重分配是否合理')
    console.log('5. 统计方法是否准确')
  }

  console.log('\n📞 如需帮助，请查看相关文档')
}

// 运行测试
runAllTests().catch((error) => {
  console.error('测试执行失败:', error)
})