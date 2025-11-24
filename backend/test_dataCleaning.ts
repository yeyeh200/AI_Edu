#!/usr/bin/env deno run

/**
 * 数据清洗和质量控制测试脚本
 * 用于验证数据清洗和质量控制功能是否正常工作
 */

import { DataCleaningService } from './src/services/dataCleaningService.ts'
import { DataQualityRulesService } from './src/services/dataQualityRulesService.ts'

console.log('🧹 数据清洗和质量控制测试')
console.log('=========================\n')

const cleaningService = new DataCleaningService()
const rulesService = new DataQualityRulesService()

async function testCleaningConfiguration() {
  console.log('⚙️ 测试清洗配置...')

  try {
    const config = cleaningService.getConfiguration()
    console.log('✅ 获取清洗配置成功')
    console.log('📊 配置信息:')
    console.log(`  自动修复: ${config.enableAutoFix ? '启用' : '禁用'}`)
    console.log(`  人工审核: ${config.requireManualReview ? '启用' : '禁用'}`)
    console.log(`  批处理大小: ${config.maxRecordsPerBatch}`)
    console.log(`  超时时间: ${config.timeoutPerRecord}ms`)
    console.log(`  启用日志: ${config.enableLogging}`)
    console.log(`  日志级别: ${config.logLevel}`)
    console.log(`  备份数据: ${config.backupOriginalData ? '启用' : '禁用'}`)
    console.log(`  保留天数: ${config.retentionDays}`)
    console.log('  质量阈值:')
    console.log(`    可接受: ${config.qualityThresholds.acceptable}分`)
    console.log(`    良好: ${config.qualityThresholds.good}分`)
    console.log(`    优秀: ${config.qualityThresholds.excellent}分`)

    // 测试更新配置
    const newConfig = { enableAutoFix: true, maxRecordsPerBatch: 500 }
    cleaningService.updateConfiguration(newConfig)
    const updatedConfig = cleaningService.getConfiguration()

    if (updatedConfig.enableAutoFix && updatedConfig.maxRecordsPerBatch === 500) {
      console.log('✅ 更新清洗配置成功')
    } else {
      console.log('❌ 更新清洗配置失败')
      return false
    }

    return true
  } catch (error: any) {
    console.log('❌ 清洗配置测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testDataQualityRules() {
  console.log('\n📋 测试数据质量规则...')

  try {
    console.log('📝 获取默认质量规则...')
    const defaultRules = rulesService.getDefaultRules()

    console.log(`✅ 获取到 ${defaultRules.length} 个默认质量规则`)
    console.log('📊 规则列表:')

    defaultRules.forEach((rule, index) => {
      console.log(`  ${index + 1}. ${rule.name}`)
      console.log(`     表: ${rule.tableName}`)
      console.log(`     字段: ${rule.fieldName}`)
      console.log(`     类型: ${rule.ruleType}`)
      console.log(`     严重程度: ${rule.severity}`)
      console.log(`     状态: ${rule.enabled ? '启用' : '禁用'}`)
      console.log(`     自动修复: ${rule.autoFixable ? '支持' : '不支持'}`)
    })

    // 测试规则统计
    console.log('\n📊 规则统计信息...')
    const statistics = rulesService.getRuleStatistics()

    console.log(`  总规则数: ${statistics.totalRules}`)
    console.log(`  启用规则: ${statistics.enabledRules}`)
    console.log(`  可自动修复: ${statistics.autoFixableRules}`)
    console.log('  按类型统计:')
    Object.entries(statistics.rulesByType).forEach(([type, count]) => {
      console.log(`    ${type}: ${count}`)
    })
    console.log('  按表统计:')
    Object.entries(statistics.rulesByTable).forEach(([table, count]) => {
      console.log(`    ${table}: ${count}`)
    })
    console.log('  按严重程度统计:')
    Object.entries(statistics.rulesBySeverity).forEach(([severity, count]) => {
      console.log(`    ${severity}: ${count}`)
    })

    return true
  } catch (error: any) {
    console.log('❌ 数据质量规则测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testCustomRules() {
  console.log('\n➕ 测试自定义规则...')

  try {
    console.log('📝 添加自定义规则...')

    const customRule = {
      name: '测试自定义规则',
      description: '这是一个测试用的自定义数据质量规则',
      tableName: 'test_table',
      fieldName: 'test_field',
      ruleType: 'invalid_format' as const,
      condition: 'test_field IS NOT NULL AND LENGTH(test_field) < 5',
      severity: 'medium' as const,
      enabled: true,
      autoFixable: false,
      suggestedFix: 'manual_review' as const,
      parameters: {
        minLength: 5
      }
    }

    const addedRule = rulesService.addCustomRule(customRule)

    console.log('✅ 添加自定义规则成功')
    console.log('📊 规则信息:')
    console.log(`  ID: ${addedRule.id}`)
    console.log(`  名称: ${addedRule.name}`)
    console.log(`  表: ${addedRule.tableName}`)
    console.log(`  字段: ${addedRule.fieldName}`)

    // 测试更新规则
    console.log('\n📝 更新自定义规则...')
    const updatedRule = rulesService.updateRule(addedRule.id, {
      description: '更新后的测试规则描述',
      enabled: false
    })

    if (updatedRule && updatedRule.description === '更新后的测试规则描述' && !updatedRule.enabled) {
      console.log('✅ 更新自定义规则成功')
    } else {
      console.log('❌ 更新自定义规则失败')
      return false
    }

    // 测试切换规则状态
    console.log('\n📝 切换规则状态...')
    const toggledRule = rulesService.toggleRule(addedRule.id, true)

    if (toggledRule && toggledRule.enabled) {
      console.log('✅ 启用自定义规则成功')
    } else {
      console.log('❌ 启用自定义规则失败')
      return false
    }

    // 测试删除规则
    console.log('\n📝 删除自定义规则...')
    const deleted = rulesService.removeRule(addedRule.id)

    if (deleted) {
      console.log('✅ 删除自定义规则成功')
    } else {
      console.log('❌ 删除自定义规则失败')
      return false
    }

    return true
  } catch (error: any) {
    console.log('❌ 自定义规则测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testDataValidation() {
  console.log('\n🔍 测试数据验证...')

  try {
    // 创建测试数据
    const testData = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        age: 25,
        phone: '+8613813800001'
      },
      {
        id: 2,
        username: '', // 无效：必填字段为空
        email: 'invalid-email', // 无效：邮箱格式错误
        age: 150, // 无效：年龄过大
        phone: '123' // 无效：电话号码过短
      },
      {
        id: 3,
        username: 'valid_user123',
        email: 'valid.user@example.com',
        age: 30,
        phone: '+12345678901'
      }
    ]

    console.log('📝 创建了 3 条测试数据')
    console.log('📊 测试数据包含不同质量问题的记录')

    // 验证数据
    const violations = await rulesService.validateDataAgainstRules('users', testData)

    console.log(`✅ 数据验证完成，发现 ${violations.length} 个违规`)

    if (violations.length > 0) {
      console.log('📊 违规详情:')
      violations.forEach((ruleViolation, index) => {
        console.log(`  规则 ${index + 1}: ${ruleViolation.rule.name}`)
        console.log(`    违规数: ${ruleViolation.violations.length}`)
        console.log('    违规记录:')

        ruleViolation.violations.slice(0, 3).forEach((violation, violationIndex) => {
          console.log(`      ${violationIndex + 1}. 记录 ${violation.recordIndex}: ${violation.message}`)
          console.log(`         当前值: ${JSON.stringify(violation.currentValue)}`)
          console.log(`         严重程度: ${violation.severity}`)
        })
      })
    }

    return true
  } catch (error: any) {
    console.log('❌ 数据验证测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testAutoFix() {
  console.log('\n🔧 测试自动修复...')

  try {
    console.log('📝 创建包含问题的测试数据...')

    const testData = [
      {
        id: 1,
        username: 'valid_user123',
        email: 'user@example.com',
        age: 30,
        phone: '12345678901' // 需要格式化
      },
      {
        id: 2,
        username: 'short', // 太短
        email: 'test@example.com',
        age: 150, // 超出范围
        phone: '+86-138-0013-8001' // 需要格式化
      }
    ]

    console.log(`📊 创建了 ${testData.length} 条需要修复的数据`)

    // 应用自动修复
    const result = await rulesService.autoFixData('users', testData, [
      'username_validation', // 用户名验证规则ID
      'phone_validation'    // 电话号码验证规则ID
    ])

    console.log('✅ 自动修复完成')
    console.log('📊 修复结果:')
    console.log(`  修复数量: ${result.fixedCount}`)
    console.log(`  错误数量: ${result.errors.length}`)

    if (result.errors.length > 0) {
      console.log('⚠️ 修复过程中出现错误:')
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`)
      })
    }

    return result.errors.length === 0
  } catch (error: any) {
    console.log('❌ 自动修复测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testFieldStatistics() {
  console.log('\n📊 测试字段统计...')

  try {
    console.log('📝 获取字段统计信息...')
    const fieldName = 'username'
    const stats = await cleaningService.getFieldStatistics('users', fieldName)

    console.log('✅ 字段统计获取成功')
    console.log('📊 统计信息:')
    console.log(`  字段名: ${stats.fieldName}`)
    console.log(`  字段类型: ${stats.fieldType}`)
    console.log(`  总值数: ${stats.totalValues}`)
    console.log(`  空值数: ${stats.nullCount}`)
    console.log(`  唯一值数: ${stats.uniqueCount}`)
    console.log(`  重复数: ${stats.duplicates}`)

    return true
  } catch (error: any) {
    console.log('❌ 字段统计测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testOutlierDetection() {
  console.log('\n🎯 测试异常值检测...')

  try {
    console.log('📝 执行异常值检测...')
    const fieldName = 'score'
    const tableName = 'exam_scores'

    const result = await cleaningService.performOutlierDetection(tableName, fieldName, 'iqr')

    console.log('✅ 异常值检测完成')
    console.log('📊 检测结果:')
    console.log(`  字段: ${result.fieldName}`)
    console.log(`  方法: ${result.method}`)
    console.log(`  异常值数量: ${result.outliers.length}`)
    console.log('  统计信息:')
    console.log(`    平均值: ${result.statistics.mean.toFixed(2)}`)
    console.log(`    标准差: ${result.statistics.stdDev.toFixed(2)}`)
    console.log(`    四分位距: ${result.statistics.iqr.toFixed(2)}`)
    console.log(`    Q1: ${result.statistics.q1.toFixed(2)}`)
    console.log(`    Q3: ${result.statistics.q3.toFixed(2)}`)

    if (result.outliers.length > 0) {
      console.log('  检测到的异常值:')
      result.outliers.slice(0, 3).forEach((outlier, index) => {
        console.log(`    ${index + 1}. 值: ${outlier.value}, 分数: ${outlier.score.toFixed(2)}`)
        console.log(`       原因: ${outlier.reason}`)
        console.log(`       阈值: ${outlier.threshold}`)
      })
    }

    return true
  } catch (error: any) {
    console.log('❌ 异常值检测测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testCleaningTaskExecution() {
  console.log('\n⚡ 测试清洗任务执行...')

  try {
    console.log('📝 创建测试清洗任务...')

    const testTask = {
      id: crypto.randomUUID(),
      name: '测试数据清洗任务',
      description: '测试数据清洗功能的完整性',
      tableName: 'users',
      fieldDefinitions: [
        {
          name: 'username',
          type: 'string' as const,
          required: true,
          nullable: false,
          minLength: 3,
          maxLength: 50,
          pattern: '^[a-zA-Z0-9_]+$',
          unique: true
        },
        {
          name: 'email',
          type: 'email' as const,
          required: true,
          nullable: false,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        {
          name: 'age',
          type: 'number' as const,
          required: false,
          nullable: true,
          minValue: 16,
          maxValue: 100
        }
      ],
      cleaningRules: [
        {
          id: 'fill_missing_age',
          name: '填充缺失年龄',
          description: '为缺失的年龄字段填充默认值',
          fieldName: 'age',
          condition: 'age IS NULL',
          operation: 'fill_default' as const,
          parameters: { defaultValue: 25 },
          priority: 1,
          enabled: true,
          autoApply: false,
          requireReview: false
        }
      ],
      enabled: true,
      status: 'pending' as const,
      progress: 0,
      totalRecords: 0,
      processedRecords: 0,
      issuesFound: 0,
      issuesResolved: 0,
      errors: [],
      warnings: [],
      statistics: {
        totalRecords: 0,
        processedRecords: 0,
        skippedRecords: 0,
        issuesFound: {} as any,
        issuesResolved: {} as any,
        operationsApplied: {} as any,
        qualityScore: {
          before: 0,
          after: 0,
          improvement: 0
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('🚀 开始执行清洗任务...')
    const result = await cleaningService.executeCleaningTask(testTask)

    console.log('✅ 清洗任务执行完成')
    console.log('📊 执行结果:')
    console.log(`  状态: ${result.status}`)
    console.log(`  进度: ${result.progress}%`)
    console.log(`  总记录数: ${result.totalRecords}`)
    console.log(`  处理记录数: ${result.processedRecords}`)
    console.log(`  发现问题数: ${result.issuesFound}`)
    console.log(`  解决问题数: ${result.issuesResolved}`)
    console.log(`  执行时长: ${result.duration}ms`)

    if (result.errors.length > 0) {
      console.log('❌ 执行错误:')
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`)
      })
    }

    if (result.warnings.length > 0) {
      console.log('⚠️ 执行警告:')
      result.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`)
      })
    }

    console.log('📈 质量评分:')
    console.log(`  修复前: ${result.statistics.qualityScore.before.toFixed(1)}分`)
    console.log(`  修复后: ${result.statistics.qualityScore.after.toFixed(1)}分`)
    console.log(`  改善程度: +${result.statistics.qualityScore.improvement.toFixed(1)}分`)

    return result.status === 'completed'
  } catch (error: any) {
    console.log('❌ 清洗任务执行测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testTaskCancellation() {
  console.log('\n🛑 测试任务取消...')

  try {
    console.log('📝 创建长时间运行的测试任务...')

    const longRunningTask = {
      id: crypto.randomUUID(),
      name: '长时间运行任务',
      description: '用于测试任务取消功能的长时间运行任务',
      tableName: 'users',
      fieldDefinitions: [],
      cleaningRules: [],
      enabled: true,
      status: 'pending' as const,
      progress: 0,
      totalRecords: 0,
      processedRecords: 0,
      issuesFound: 0,
      issuesResolved: 0,
      errors: [],
      warnings: [],
      statistics: {
        totalRecords: 0,
        processedRecords: 0,
        skippedRecords: 0,
        issuesFound: {} as any,
        issuesResolved: {} as any,
        operationsApplied: {} as any,
        qualityScore: {
          before: 0,
          after: 0,
          improvement: 0
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('🚀 启动任务...')
    // 模拟启动任务但不等待完成
    const taskPromise = cleaningService.executeCleaningTask(longRunningTask)

    // 等待一小段时间后取消任务
    setTimeout(() => {
      console.log('🛑 取消任务...')
      const cancelled = cleaningService.cancelCleaningTask(longRunningTask.id)

      if (cancelled) {
        console.log('✅ 任务取消成功')
      } else {
        console.log('❌ 任务取消失败')
      }
    }, 1000)

    // 等待任务执行（可能会被取消）
    await taskPromise

    return true
  } catch (error: any) {
    console.log('❌ 任务取消测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testRuleImportExport() {
  console.log('\n📦 测试规则导入导出...')

  try {
    console.log('📤 测试规则导出...')
    const exportedRules = rulesService.exportRules()

    console.log(`✅ 导出 ${exportedRules.length} 个规则`)
    console.log('📊 导出的规则类型:')
    const ruleTypes = [...new Set(exportedRules.map(r => r.ruleType))]
    ruleTypes.forEach(type => {
      console.log(`  ${type}: ${exportedRules.filter(r => r.ruleType === type).length}`)
    })

    console.log('📥 测试规则导入...')
    const importResult = rulesService.importRules(exportedRules)

    console.log(`✅ 规则导入完成`)
    console.log('📊 导入结果:')
    console.log(`  成功导入: ${importResult.imported}`)
    console.log(`  导入失败: ${importResult.errors.length}`)

    if (importResult.errors.length > 0) {
      console.log('❌ 导入错误:')
      importResult.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`)
      })
    }

    return importResult.errors.length === 0
  } catch (error: any) {
    console.log('❌ 规则导入导出测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 开始数据清洗和质量控制全面测试...\n')

  const tests = [
    { name: '清洗配置测试', func: testCleaningConfiguration },
    { name: '数据质量规则测试', func: testDataQualityRules },
    { name: '自定义规则测试', func: testCustomRules },
    { name: '数据验证测试', func: testDataValidation },
    { name: '自动修复测试', func: testAutoFix },
    { name: '字段统计测试', func: testFieldStatistics },
    { name: '异常值检测测试', func: testOutlierDetection },
    { name: '清洗任务执行测试', func: testCleaningTaskExecution },
    { name: '任务取消测试', func: testTaskCancellation },
    { name: '规则导入导出测试', func: testRuleImportExport },
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
    console.log('\n🎉 所有测试通过！数据清洗和质量控制模块工作正常')
    console.log('💡 提示：可以开始处理实际的数据清洗任务了')
  } else {
    console.log('\n⚠️ 部分测试失败，请检查：')
    console.log('1. 数据清洗配置是否正确')
    console.log('2. 数据质量规则是否合理')
    console.log('3. 测试数据是否符合预期')
    console.log('4. 清洗算法是否正确实现')
  }

  console.log('\n📞 如需帮助，请查看相关文档')
}

// 运行测试
runAllTests().catch((error) => {
  console.error('测试执行失败:', error)
})