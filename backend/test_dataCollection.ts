#!/usr/bin/env deno run

/**
 * 数据采集和监控服务测试脚本
 * 用于验证数据采集和监控功能是否正常工作
 */

import { DataCollectionService } from './src/services/dataCollectionService.ts'
import { DataMonitoringService } from './src/services/dataMonitoringService.ts'

console.log('📊 数据采集和监控服务测试')
console.log('============================\n')

const collectionService = new DataCollectionService()
const monitoringService = new DataMonitoringService()

async function testCollectionConfig() {
  console.log('⚙️ 测试采集配置...')

  try {
    const config = collectionService.getConfig()
    console.log('✅ 获取采集配置成功')
    console.log('📊 配置信息:')
    console.log(`  批处理大小: ${config.batchSize}`)
    console.log(`  重试次数: ${config.retryAttempts}`)
    console.log(`  超时时间: ${config.timeout}ms`)
    console.log(`  数据验证: ${config.enableDataValidation ? '启用' : '禁用'}`)
    console.log(`  去重检查: ${config.enableDeduplication ? '启用' : '禁用'}`)
    console.log(`  质量检查: ${config.enableQualityCheck ? '启用' : '禁用'}`)
    console.log(`  最大并发任务: ${config.maxConcurrentTasks}`)

    // 测试更新配置
    const newConfig = { batchSize: 50, retryAttempts: 5 }
    collectionService.updateConfig(newConfig)
    const updatedConfig = collectionService.getConfig()

    if (updatedConfig.batchSize === 50 && updatedConfig.retryAttempts === 5) {
      console.log('✅ 更新采集配置成功')
    } else {
      console.log('❌ 更新采集配置失败')
      return false
    }

    return true
  } catch (error: any) {
    console.log('❌ 采集配置测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testMonitoringService() {
  console.log('\n📈 测试监控服务...')

  try {
    console.log('📝 收集系统指标...')
    const metrics = await monitoringService.collectSystemMetrics()
    console.log('✅ 系统指标收集成功')
    console.log('📊 系统指标:')
    console.log(`  🕐 时间戳: ${metrics.timestamp}`)
    console.log(`  💻 CPU使用率: ${metrics.cpu.usage.toFixed(1)}%`)
    console.log(`  🧠 内存使用率: ${metrics.memory.usage.toFixed(1)}%`)
    console.log(`  💾 磁盘使用率: ${metrics.disk.usage.toFixed(1)}%`)
    console.log(`  🌐 网络连接: ${metrics.network.connections}`)
    console.log(`  🗄️ 数据库连接: ${metrics.database.connections}`)
    console.log(`  🚀 API响应时间: ${metrics.api.averageResponseTime.toFixed(0)}ms`)
    console.log(`  ⚠️ API错误率: ${metrics.api.errorRate.toFixed(1)}%`)

    return true
  } catch (error: any) {
    console.log('❌ 监控服务测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testDataSourceStatus() {
  console.log('\n🔌 测试数据源状态...')

  try {
    console.log('📝 检查数据源连接状态...')
    const dataSources = await monitoringService.checkDataSourceStatus()

    console.log('✅ 数据源状态检查完成')
    console.log('📊 数据源状态:')

    dataSources.forEach((source, index) => {
      console.log(`  ${index + 1}. ${source.name} (${source.type})`)
      console.log(`     状态: ${source.status}`)
      console.log(`     检查时间: ${source.lastCheckTime}`)
      if (source.responseTime) {
        console.log(`     响应时间: ${source.responseTime}ms`)
      }
      if (source.errorMessage) {
        console.log(`     错误信息: ${source.errorMessage}`)
      }
    })

    return true
  } catch (error: any) {
    console.log('❌ 数据源状态检查失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testDataQualityCheck() {
  console.log('\n🔍 测试数据质量检查...')

  try {
    console.log('📝 执行数据质量检查...')

    const dataTypes = ['users', 'courses', 'attendance', 'evaluations'] as const

    for (const dataType of dataTypes) {
      console.log(`\n🔍 检查 ${dataType} 数据质量...`)
      const qualityResult = await monitoringService.performDataQualityCheck(dataType)

      console.log(`✅ ${dataType} 数据质量检查完成`)
      console.log(`📊 质量评分: ${qualityResult.qualityScore.toFixed(1)}分`)
      console.log(`📊 总记录数: ${qualityResult.totalRecords}`)
      console.log(`✅ 有效记录: ${qualityResult.validRecords}`)
      console.log(`❌ 无效记录: ${qualityResult.invalidRecords}`)
      console.log(`🔄 重复记录: ${qualityResult.duplicateRecords}`)

      if (qualityResult.issues.length > 0) {
        console.log('⚠️ 发现质量问题:')
        qualityResult.issues.forEach((issue, index) => {
          console.log(`  ${index + 1}. ${issue.description} (${issue.severity})`)
          console.log(`     影响记录: ${issue.affectedRecords}`)
        })
      } else {
        console.log('✅ 未发现质量问题')
      }
    }

    return true
  } catch (error: any) {
    console.log('❌ 数据质量检查失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testAlertRules() {
  console.log('\n🚨 测试预警规则...')

  try {
    console.log('📝 获取预警规则...')
    const alertRules = monitoringService.getAlertRules()

    console.log(`✅ 获取到 ${alertRules.length} 个预警规则`)
    console.log('📊 预警规则列表:')

    alertRules.forEach((rule, index) => {
      console.log(`  ${index + 1}. ${rule.name}`)
      console.log(`     描述: ${rule.description}`)
      console.log(`     状态: ${rule.enabled ? '启用' : '禁用'}`)
      console.log(`     指标: ${rule.condition.metric} ${rule.condition.operator} ${rule.condition.threshold}`)
      console.log(`     严重程度: ${rule.severity}`)
      console.log(`     动作数量: ${rule.actions.length}`)
    })

    // 测试添加预警规则
    console.log('\n📝 添加测试预警规则...')
    const testRule = {
      id: 'test-rule',
      name: '测试预警规则',
      description: '这是一个测试预警规则',
      enabled: true,
      condition: {
        metric: 'test.metric',
        operator: '>' as const,
        threshold: 100,
        duration: 60
      },
      actions: [
        { type: 'log' as const, config: {} }
      ],
      severity: 'medium' as const,
      cooldownPeriod: 300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    monitoringService.addAlertRule(testRule)

    // 验证规则是否添加成功
    const updatedRules = monitoringService.getAlertRules()
    if (updatedRules.length > alertRules.length) {
      console.log('✅ 添加预警规则成功')

      // 删除测试规则
      monitoringService.removeAlertRule('test-rule')
      console.log('✅ 删除测试预警规则成功')
    } else {
      console.log('❌ 添加预警规则失败')
      return false
    }

    return true
  } catch (error: any) {
    console.log('❌ 预警规则测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testPerformanceMetrics() {
  console.log('\n📊 测试性能指标...')

  try {
    console.log('📝 获取性能指标...')
    const performance = await monitoringService.getPerformanceMetrics()

    console.log('✅ 性能指标获取成功')
    console.log('📊 性能指标:')
    console.log(`  📈 采集任务: 总计 ${performance.collectionTasks.total}, 运行中 ${performance.collectionTasks.running}, 完成 ${performance.collectionTasks.completed}, 失败 ${performance.collectionTasks.failed}`)
    console.log(`  🔍 数据质量: 总体评分 ${performance.dataQuality.overallScore.toFixed(1)}分, 有效记录 ${performance.dataQuality.validRecords}, 无效记录 ${performance.dataQuality.invalidRecords}`)
    console.log(`  💻 系统健康: CPU ${performance.systemHealth.cpu.toFixed(1)}%, 内存 ${performance.systemHealth.memory.toFixed(1)}%, 磁盘 ${performance.systemHealth.disk.toFixed(1)}%`)
    console.log(`  🚀 API性能: 请求 ${performance.apiPerformance.requestCount}, 响应时间 ${performance.apiPerformance.averageResponseTime.toFixed(0)}ms, 错误率 ${performance.apiPerformance.errorRate.toFixed(1)}%`)

    return true
  } catch (error: any) {
    console.log('❌ 性能指标测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testTaskExecution() {
  console.log('\n⚡ 测试任务执行...')

  try {
    console.log('📝 模拟执行数据采集任务...')

    // 创建测试任务
    const testTask = {
      id: crypto.randomUUID(),
      name: '测试用户数据采集',
      description: '测试用户数据采集功能',
      dataType: 'users' as const,
      schedule: '0 0 * * *',
      enabled: true,
      status: 'pending' as const,
      recordCount: 0,
      successCount: 0,
      errorCount: 0,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('🚀 开始执行测试任务...')
    const result = await collectionService.executeTask(testTask)

    console.log('✅ 任务执行完成')
    console.log('📊 执行结果:')
    console.log(`  成功: ${result.success}`)
    console.log(`  记录数: ${result.recordCount}`)
    console.log(`  成功数: ${result.successCount}`)
    console.log(`  错误数: ${result.errorCount}`)
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

    return result.success
  } catch (error: any) {
    console.log('❌ 任务执行测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function testLogging() {
  console.log('\n📝 测试日志功能...')

  try {
    console.log('📝 生成测试日志...')
    const taskId = crypto.randomUUID()
    const taskName = '测试任务'

    // 生成不同级别的日志
    collectionService.log(taskId, taskName, 'debug', '调试信息测试', { test: true })
    collectionService.log(taskId, taskName, 'info', '信息日志测试')
    collectionService.log(taskId, taskName, 'warn', '警告日志测试', { warning: true })
    collectionService.log(taskId, taskName, 'error', '错误日志测试', { error: 'test error' })

    console.log('📝 获取日志...')
    const logs = collectionService.getLogs(taskId, undefined, 10)

    console.log(`✅ 获取到 ${logs.length} 条日志`)
    console.log('📊 最近日志:')
    logs.forEach((log, index) => {
      console.log(`  ${index + 1}. [${log.level.toUpperCase()}] ${log.message}`)
      console.log(`     时间: ${log.timestamp}`)
      if (log.details) {
        console.log(`     详情: ${JSON.stringify(log.details)}`)
      }
    })

    return true
  } catch (error: any) {
    console.log('❌ 日志功能测试失败')
    console.log(`🔍 错误信息: ${error.message}`)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 开始数据采集和监控服务全面测试...\n')

  const tests = [
    { name: '采集配置测试', func: testCollectionConfig },
    { name: '监控服务测试', func: testMonitoringService },
    { name: '数据源状态测试', func: testDataSourceStatus },
    { name: '数据质量检查测试', func: testDataQualityCheck },
    { name: '预警规则测试', func: testAlertRules },
    { name: '性能指标测试', func: testPerformanceMetrics },
    { name: '任务执行测试', func: testTaskExecution },
    { name: '日志功能测试', func: testLogging },
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
    console.log('\n🎉 所有测试通过！数据采集和监控服务工作正常')
    console.log('💡 提示：可以开始监控数据采集和系统健康状况')
  } else {
    console.log('\n⚠️ 部分测试失败，请检查：')
    console.log('1. 系统配置是否正确')
    console.log('2. 职教云API连接是否正常')
    console.log('3. 数据库连接是否正常')
    console.log('4. 权限设置是否正确')
  }

  console.log('\n📞 如需帮助，请查看相关文档')
}

// 启动监控服务（用于测试）
monitoringService.startMonitoring(5000) // 每5秒检查一次

// 运行测试
runAllTests().catch((error) => {
  console.error('测试执行失败:', error)
}).finally(() => {
  // 停止监控服务
  monitoringService.stopMonitoring()
})