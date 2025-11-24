#!/usr/bin/env deno run

/**
 * AI分析引擎测试脚本
 * 用于验证AI分析引擎功能是否正常工作
 */

import { AIAnalysisEngine } from './src/services/aiAnalysisEngine.ts'

console.log('🤖 AI分析引擎测试')
console.log('==================\n')

const analysisEngine = new AIAnalysisEngine()

async function testEngineConfiguration() {
  console.log('⚙️ 测试分析引擎配置...')

  try {
    const config = analysisEngine.getConfig()
    console.log('✅ 获取分析配置成功')
    console.log('📊 配置信息:')
    console.log(`  版本: ${config.version}`)
    console.log(`  启用ML: ${config.aiSettings.enableML ? '启用' : '禁用'}`)
    console.log(`  模型版本: ${config.aiSettings.modelVersion}`)
    console.log(`  置信阈值: ${config.aiSettings.confidenceThreshold}`)
    console.log(`  自动推荐: ${config.aiSettings.enableAutoRecommendations ? '启用' : '禁用'}`)
    console.log(`  启用同行比较: ${config.comparisonSettings.enablePeerComparison ? '启用' : '禁用'}`)
    console.log(`  启用历史比较: ${config.comparisonSettings.enableHistoricalComparison ? '启用' : '禁用'}`)
    console.log(`  同行组大小: ${config.comparisonSettings.peerGroupSize}`)
    console.log(`  历史窗口: ${config.comparisonSettings.historicalWindow}个周期`)
    console.log(`  数据源数量: ${config.dataSources.length}`)

    // 测试更新配置
    const newConfig = {
      aiSettings: {
        enableML: true,
        modelVersion: '1.1',
        confidenceThreshold: 0.8
      }
    }
    analysisEngine.updateConfig(newConfig)
    const updatedConfig = analysisEngine.getConfig()

    if (updatedConfig.aiSettings.modelVersion === '1.1' && updatedConfig.aiSettings.confidenceThreshold === 0.8) {
      console.log('✅ 更新分析配置成功')
    } else {
      console.log('❌ 更新分析配置失败')
      return false
    }

    return true
  } catch (error: any) {
    console.log('❌ 分析配置测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testAnalysisRules() {
  console.log('\n📋 测试分析规则...')

  try {
    console.log('📝 获取默认分析规则...')
    const defaultRules = analysisEngine.getAnalysisRules()

    console.log(`✅ 获取到 ${defaultRules.length} 个分析规则`)
    console.log('📊 规则列表:')

    defaultRules.forEach((rule, index) => {
      console.log(`  ${index + 1}. ${rule.name}`)
      console.log(`     ID: ${rule.id}`)
      console.log(`     类型: ${rule.type}`)
      console.log(`     类别: ${rule.category}`)
      console.log(`     状态: ${rule.enabled ? '启用' : '禁用'}`)
      console.log(`     优先级: ${rule.priority}`)
      console.log(`     条件数: ${rule.conditions.length}`)
      console.log(`     权重数: ${rule.weights.length}`)
    })

    return true
  } catch (error: any) {
    console.log('❌ 分析规则测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testCustomRules() {
  console.log('\n➕ 测试自定义规则...')

  try {
    console.log('📝 添加自定义分析规则...')

    const customRule = {
      id: 'test_custom_rule',
      name: '测试自定义分析规则',
      description: '这是一个测试用的自定义分析规则',
      type: 'teaching_effectiveness' as const,
      category: 'custom' as const,
      enabled: true,
      priority: 3,
      conditions: [
        {
          metric: 'test_metric',
          operator: '>' as const,
          value: 80,
          weight: 0.5
        }
      ],
      weights: [
        {
          dimension: 'teaching_effect' as const,
          weight: 0.4,
          enabled: true,
          description: '教学效果权重'
        }
      ],
      thresholds: {
        excellent: 95,
        good: 85,
        average: 75,
        poor: 60
      },
      parameters: {
        customParam: 'test_value'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    analysisEngine.addAnalysisRule(customRule)

    console.log('✅ 添加自定义分析规则成功')

    // 验证规则是否添加成功
    const updatedRules = analysisEngine.getAnalysisRules()
    const addedRule = updatedRules.find(r => r.id === 'test_custom_rule')

    if (addedRule) {
      console.log('✅ 验证自定义规则存在成功')

      // 测试删除规则
      const deleted = analysisEngine.removeAnalysisRule('test_custom_rule')
      if (deleted) {
        console.log('✅ 删除自定义分析规则成功')
      } else {
        console.log('❌ 删除自定义分析规则失败')
        return false
      }
    } else {
      console.log('❌ 验证自定义规则存在失败')
      return false
    }

    return true
  } catch (error: any) {
    console.log('❌ 自定义分析规则测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testTeacherAnalysis() {
  console.log('\n👨‍🏫 测试教师分析...')

  try {
    console.log('📝 执行教师教学分析...')

    const teacherId = 'test_teacher_001'
    const timeWindow = {
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      type: 'semester' as const
    }

    console.log(`📊 分析教师: ${teacherId}`)
    console.log(`📊 时间窗口: ${timeWindow.startDate} 至 ${timeWindow.endDate}`)

    // 模拟教师分析
    const result = await analysisEngine.analyzeTeacher(teacherId, timeWindow)

    console.log('✅ 教师分析完成')
    console.log('📊 分析结果:')
    console.log(`  教师ID: ${result.teacherId}`)
    console.log(`  教师姓名: ${result.teacherInfo.name}`)
    console.log(`  工号: ${result.teacherInfo.employeeId}`)
    console.log(`  总体评分: ${result.overallScore.toFixed(2)}分`)
    console.log(`  总体等级: ${result.overallLevel}`)
    console.log(`  评价维度数: ${result.dimensionResults.length}`)
    console.log(`  分析指标数: ${result.metrics.length}`)

    console.log('\n📈 各维度评分:')
    result.dimensionResults.forEach((dimension, index) => {
      console.log(`  ${index + 1}. ${dimension.dimension}: ${dimension.score.toFixed(2)}分 (${dimension.level})`)
      console.log(`     权重: ${(dimension.weight * 100).toFixed(1)}%`)
      console.log(`     贡献度: ${dimension.contribution.toFixed(2)}`)
    })

    console.log('\n📊 分析摘要:')
    console.log(`  学生总数: ${result.summary.totalStudents}`)
    console.log(`  响应率: ${result.summary.responseRate.toFixed(1)}%`)
    console.log(`  数据完整性: ${(result.summary.dataCompleteness * 100).toFixed(1)}%`)
    console.log(`  置信水平: ${(result.summary.confidenceLevel * 100).toFixed(1)}%`)

    console.log('\n💡 分析洞察:')
    console.log(`  优势数量: ${result.insights.strengths.length}`)
    console.log(`  劣势数量: ${result.insights.weaknesses.length}`)
    console.log(`  建议数量: ${result.insights.recommendations.length}`)
    console.log(`  趋势数量: ${result.insights.trends.length}`)

    if (result.insights.strengths.length > 0) {
      console.log('\n🎯 主要优势:')
      result.insights.strengths.slice(0, 3).forEach((strength, index) => {
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
    console.log(`  同行排名: ${result.comparisons.peerRank}/${result.comparisons.peerTotal}`)
    console.log(`  部门排名: ${result.comparisons.departmentRank}/${result.comparisons.departmentTotal}`)
    console.log(`  历史排名: ${result.comparisons.historicalRank}/${result.comparisons.historicalTotal}`)

    console.log('\n⚙️ 元数据:')
    console.log(`  分析版本: ${result.metadata.analysisVersion}`)
    console.log(`  应用的规则: ${result.metadata.rulesApplied.join(', ')}`)
    console.log(`  数据源: ${result.metadata.dataSources.join(', ')}`)
    console.log(`  处理时间: ${result.metadata.processingTime}ms`)
    console.log(`  生成时间: ${result.metadata.generatedAt}`)

    return true
  } catch (error: any) {
    console.log('❌ 教师分析测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testBatchAnalysis() {
  console.log('\n📊 测试批量分析...')

  try {
    console.log('📝 创建批量分析任务...')

    const batchRequest = {
      name: '测试批量分析任务',
      description: '测试AI分析引擎的批量处理能力',
      scope: {
        teacherIds: ['teacher_001', 'teacher_002', 'teacher_003'],
        departmentIds: ['dept_001'],
        courseIds: ['course_001']
      },
      timeWindow: {
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        type: 'semester' as const
      },
      rules: ['teaching_effectiveness_core', 'student_engagement_analysis'],
      options: {
        includeComparisons: true,
        includeTrends: true,
        includeRecommendations: true,
        confidenceThreshold: 0.7
      }
    }

    const task = await analysisEngine.executeBatchAnalysis(batchRequest)

    console.log('✅ 批量分析任务创建成功')
    console.log('📊 任务信息:')
    console.log(`  任务ID: ${task.id}`)
    console.log(`  任务名称: ${task.name}`)
    console.log(`  状态: ${task.status}`)
    console.log(`  目标教师数: ${task.targetTeacherIds.length}`)
    console.log(`  时间窗口: ${task.timeWindow.startDate} 至 ${task.timeWindow.endDate}`)
    console.log(`  应用规则数: ${task.rules.length}`)
    console.log(`  创建时间: ${task.createdAt}`)

    // 等待一段时间让任务开始执行
    console.log('\n⏳ 等待任务执行...')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 检查任务状态
    if (task.status === 'running' || task.status === 'completed') {
      console.log('✅ 批量分析任务执行正常')
      console.log(`📊 当前进度: ${task.progress}%`)
      console.log(`📊 完成结果数: ${task.results.length}`)
      console.log(`📊 错误数量: ${task.errors.length}`)
      console.log(`📊 警告数量: ${task.warnings.length}`)
    } else {
      console.log('⚠️ 批量分析任务状态异常')
    }

    return true
  } catch (error: any) {
    console.log('❌ 批量分析测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testPerformanceMetrics() {
  console.log('\n📈 测试性能指标...')

  try {
    console.log('📝 获取系统性能指标...')
    const performance = analysisEngine.getPerformanceMetrics()

    console.log('✅ 性能指标获取成功')
    console.log('📊 性能数据:')
    console.log(`  总分析数: ${performance.totalAnalyses}`)
    console.log(`  平均处理时间: ${performance.averageProcessingTime.toFixed(2)}ms`)
    console.log(`  成功率: ${performance.successRate.toFixed(1)}%`)
    console.log(`  错误率: ${performance.errorRate.toFixed(1)}%`)
    console.log(`  缓存命中率: ${performance.cacheHitRate.toFixed(1)}%`)
    console.log(`  内存使用: ${performance.memoryUsage}MB`)
    console.log(`  CPU使用: ${performance.cpuUsage}%`)
    console.log(`  活跃任务: ${performance.activeTasks}`)
    console.log(`  排队任务: ${performance.queuedTasks}`)

    return true
  } catch (error: any) {
    console.log('❌ 性能指标测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testCaching() {
  console.log('\n💾 测试缓存功能...')

  try {
    console.log('📝 测试结果缓存...')

    const teacherId = 'cache_test_teacher'
    const timeWindow = {
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      type: 'semester' as const
    }

    // 第一次分析 - 应该计算并缓存
    console.log('🚀 执行第一次分析...')
    const startTime1 = Date.now()
    const result1 = await analysisEngine.analyzeTeacher(teacherId, timeWindow)
    const duration1 = Date.now() - startTime1

    console.log(`✅ 第一次分析完成，耗时: ${duration1}ms`)

    // 第二次分析 - 应该从缓存获取
    console.log('🚀 执行第二次分析（缓存）...')
    const startTime2 = Date.now()
    const result2 = await analysisEngine.analyzeTeacher(teacherId, timeWindow)
    const duration2 = Date.now() - startTime2

    console.log(`✅ 第二次分析完成，耗时: ${duration2}ms`)

    // 比较结果
    if (JSON.stringify(result1) === JSON.stringify(result2)) {
      console.log('✅ 缓存结果与原始结果一致')
    } else {
      console.log('❌ 缓存结果与原始结果不一致')
      return false
    }

    // 检查缓存效果
    if (duration2 < duration1 * 0.5) {
      console.log('✅ 缓存显著提升了性能')
      console.log(`📊 性能提升: ${((duration1 - duration2) / duration1 * 100).toFixed(1)}%`)
    } else {
      console.log('⚠️ 缓存效果不明显')
    }

    // 测试缓存清理
    console.log('\n🧹 测试缓存清理...')
    analysisEngine.cleanupExpiredCache()
    console.log('✅ 缓存清理完成')

    return true
  } catch (error: any) {
    console.log('❌ 缓存功能测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testErrorHandling() {
  console.log('\n⚠️ 测试错误处理...')

  try {
    console.log('📝 测试无效教师ID...')
    try {
      await analysisEngine.analyzeTeacher('invalid_teacher_id', {
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        type: 'semester'
      })
      console.log('❌ 应该抛出错误但没有')
      return false
    } catch (error: any) {
      console.log('✅ 正确处理了无效教师ID')
    }

    console.log('📝 测试无效时间窗口...')
    try {
      await analysisEngine.analyzeTeacher('teacher_001', {
        startDate: '2024-06-30',
        endDate: '2024-01-01', // 开始日期晚于结束日期
        type: 'custom'
      })
      console.log('❌ 应该抛出错误但没有')
      return false
    } catch (error: any) {
      console.log('✅ 正确处理了无效时间窗口')
    }

    console.log('📝 测试任务取消...')
    const batchRequest = {
      name: '测试取消任务',
      scope: { teacherIds: ['teacher_001', 'teacher_002'] },
      timeWindow: {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        type: 'year' as const
      },
      rules: ['teaching_effectiveness_core']
    }

    const task = await analysisEngine.executeBatchAnalysis(batchRequest)

    // 尝试取消任务
    const cancelled = analysisEngine.cancelAnalysisTask(task.id)
    if (cancelled) {
      console.log('✅ 成功取消了分析任务')
    } else {
      console.log('⚠️ 任务取消可能失败（任务可能已完成）')
    }

    return true
  } catch (error: any) {
    console.log('❌ 错误处理测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 开始AI分析引擎全面测试...\n')

  const tests = [
    { name: '分析引擎配置测试', func: testEngineConfiguration },
    { name: '分析规则测试', func: testAnalysisRules },
    { name: '自定义规则测试', func: testCustomRules },
    { name: '教师分析测试', func: testTeacherAnalysis },
    { name: '批量分析测试', func: testBatchAnalysis },
    { name: '性能指标测试', func: testPerformanceMetrics },
    { name: '缓存功能测试', func: testCaching },
    { name: '错误处理测试', func: testErrorHandling },
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
    console.log('\n🎉 所有测试通过！AI分析引擎工作正常')
    console.log('💡 提示：AI分析引擎已准备就绪，可以开始处理教学评价分析任务')
  } else {
    console.log('\n⚠️ 部分测试失败，请检查：')
    console.log('1. 分析引擎配置是否正确')
    console.log('2. 分析规则是否合理')
    console.log('3. 数据源连接是否正常')
    console.log('4. 缓存机制是否正确实现')
    console.log('5. 错误处理逻辑是否完善')
  }

  console.log('\n📞 如需帮助，请查看相关文档')
}

// 运行测试
runAllTests().catch((error) => {
  console.error('测试执行失败:', error)
})