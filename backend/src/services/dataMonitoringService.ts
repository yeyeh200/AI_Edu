/**
 * 数据监控服务
 * 负责监控系统健康状况、数据质量和性能指标
 */

import { DatabaseService } from './databaseService.ts'
import { ZhijiaoyunService } from './zhijiaoyunService.ts'
import { config } from '@/config/config'
import {
  SystemMetrics,
  DataQualityResult,
  DataSourceStatus,
  AlertRule,
  AlertEvent,
  PerformanceMetrics,
  DataType,
  QualityIssue
} from '@/types/dataCollection'

export class DataMonitoringService {
  private dbService: DatabaseService
  private zhijiaoyunService: ZhijiaoyunService
  private alertRules: Map<string, AlertRule>
  private activeAlerts: Map<string, AlertEvent>
  private monitoringInterval?: number

  constructor() {
    this.dbService = new DatabaseService()
    this.zhijiaoyunService = new ZhijiaoyunService()
    this.alertRules = new Map()
    this.activeAlerts = new Map()

    // 初始化默认预警规则
    this.initializeDefaultAlertRules()
  }

  /**
   * 初始化默认预警规则
   */
  private initializeDefaultAlertRules(): void {
    // CPU使用率预警
    this.addAlertRule({
      id: 'cpu-high',
      name: 'CPU使用率过高',
      description: '当CPU使用率超过80%时触发预警',
      enabled: true,
      condition: {
        metric: 'cpu.usage',
        operator: '>',
        threshold: 80,
        duration: 300 // 持续5分钟
      },
      actions: [
        { type: 'log', config: {} },
        { type: 'notification', config: { level: 'warning' } }
      ],
      severity: 'high',
      cooldownPeriod: 900, // 15分钟冷却期
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 内存使用率预警
    this.addAlertRule({
      id: 'memory-high',
      name: '内存使用率过高',
      description: '当内存使用率超过85%时触发预警',
      enabled: true,
      condition: {
        metric: 'memory.usage',
        operator: '>',
        threshold: 85,
        duration: 180 // 持续3分钟
      },
      actions: [
        { type: 'log', config: {} },
        { type: 'notification', config: { level: 'critical' } }
      ],
      severity: 'critical',
      cooldownPeriod: 600, // 10分钟冷却期
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // API错误率预警
    this.addAlertRule({
      id: 'api-error-rate',
      name: 'API错误率过高',
      description: '当API错误率超过5%时触发预警',
      enabled: true,
      condition: {
        metric: 'api.errorRate',
        operator: '>',
        threshold: 5,
        duration: 120 // 持续2分钟
      },
      actions: [
        { type: 'log', config: {} },
        { type: 'notification', config: { level: 'warning' } }
      ],
      severity: 'medium',
      cooldownPeriod: 300, // 5分钟冷却期
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 数据质量预警
    this.addAlertRule({
      id: 'data-quality-low',
      name: '数据质量评分过低',
      description: '当数据质量评分低于70分时触发预警',
      enabled: true,
      condition: {
        metric: 'qualityScore',
        operator: '<',
        threshold: 70,
        duration: 60 // 持续1分钟
      },
      actions: [
        { type: 'log', config: {} },
        { type: 'notification', config: { level: 'medium' } }
      ],
      severity: 'medium',
      cooldownPeriod: 600, // 10分钟冷却期
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * 开始监控
   */
  startMonitoring(intervalMs: number = 60000): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }

    console.log('📊 开始数据监控服务')

    this.monitoringInterval = setInterval(async () => {
      try {
        await this.performHealthCheck()
      } catch (error: any) {
        console.error('监控检查失败:', error)
      }
    }, intervalMs)
  }

  /**
   * 停止监控
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = undefined
      console.log('📊 停止数据监控服务')
    }
  }

  /**
   * 执行健康检查
   */
  async performHealthCheck(): Promise<void> {
    const metrics = await this.collectSystemMetrics()
    await this.checkAlertRules(metrics)
  }

  /**
   * 收集系统指标
   */
  async collectSystemMetrics(): Promise<SystemMetrics> {
    const timestamp = new Date().toISOString()

    // 获取系统资源使用情况
    const cpuInfo = await this.getCpuInfo()
    const memoryInfo = await this.getMemoryInfo()
    const diskInfo = await this.getDiskInfo()
    const networkInfo = await this.getNetworkInfo()
    const dbInfo = await this.getDatabaseInfo()
    const apiInfo = await this.getApiInfo()

    return {
      timestamp,
      cpu: cpuInfo,
      memory: memoryInfo,
      disk: diskInfo,
      network: networkInfo,
      database: dbInfo,
      api: apiInfo
    }
  }

  /**
   * 获取CPU信息
   */
  private async getCpuInfo(): Promise<{ usage: number; loadAverage: number[] }> {
    // 这里应该使用实际的系统监控库
    // 由于在Deno环境中，我们返回模拟数据
    return {
      usage: Math.random() * 100,
      loadAverage: [
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      ]
    }
  }

  /**
   * 获取内存信息
   */
  private async getMemoryInfo(): Promise<{ total: number; used: number; free: number; usage: number }> {
    // 模拟内存信息
    const total = 8 * 1024 * 1024 * 1024 // 8GB
    const used = total * (Math.random() * 0.8)
    const free = total - used

    return {
      total,
      used,
      free,
      usage: (used / total) * 100
    }
  }

  /**
   * 获取磁盘信息
   */
  private async getDiskInfo(): Promise<{ total: number; used: number; free: number; usage: number }> {
    // 模拟磁盘信息
    const total = 100 * 1024 * 1024 * 1024 // 100GB
    const used = total * (Math.random() * 0.6)
    const free = total - used

    return {
      total,
      used,
      free,
      usage: (used / total) * 100
    }
  }

  /**
   * 获取网络信息
   */
  private async getNetworkInfo(): Promise<{ bytesIn: number; bytesOut: number; connections: number }> {
    // 模拟网络信息
    return {
      bytesIn: Math.floor(Math.random() * 1000000),
      bytesOut: Math.floor(Math.random() * 1000000),
      connections: Math.floor(Math.random() * 100)
    }
  }

  /**
   * 获取数据库信息
   */
  private async getDatabaseInfo(): Promise<{ connections: number; queryTime: number; errorCount: number }> {
    try {
      // 这里应该查询实际的数据库状态
      return {
        connections: Math.floor(Math.random() * 20),
        queryTime: Math.random() * 100,
        errorCount: Math.floor(Math.random() * 5)
      }
    } catch (error) {
      return {
        connections: 0,
        queryTime: 0,
        errorCount: 1
      }
    }
  }

  /**
   * 获取API性能信息
   */
  private async getApiInfo(): Promise<{ requestsPerSecond: number; averageResponseTime: number; errorRate: number }> {
    // 模拟API性能信息
    const requestCount = Math.floor(Math.random() * 1000)
    const errorCount = Math.floor(Math.random() * 50)

    return {
      requestsPerSecond: requestCount / 60,
      averageResponseTime: Math.random() * 500,
      errorRate: (errorCount / requestCount) * 100
    }
  }

  /**
   * 检查预警规则
   */
  private async checkAlertRules(metrics: SystemMetrics): Promise<void> {
    for (const [ruleId, rule] of this.alertRules) {
      if (!rule.enabled) continue

      try {
        const shouldTrigger = await this.evaluateAlertCondition(rule.condition, metrics)

        if (shouldTrigger) {
          await this.triggerAlert(rule, metrics)
        } else {
          await this.resolveAlert(ruleId)
        }
      } catch (error: any) {
        console.error(`预警规则检查失败 (${ruleId}):`, error)
      }
    }
  }

  /**
   * 评估预警条件
   */
  private async evaluateAlertCondition(condition: any, metrics: SystemMetrics): Promise<boolean> {
    // 获取指标值
    const metricValue = this.getMetricValue(condition.metric, metrics)

    if (metricValue === undefined) {
      return false
    }

    // 比较操作符
    switch (condition.operator) {
      case '>':
        return metricValue > condition.threshold
      case '<':
        return metricValue < condition.threshold
      case '>=':
        return metricValue >= condition.threshold
      case '<=':
        return metricValue <= condition.threshold
      case '==':
        return metricValue === condition.threshold
      case '!=':
        return metricValue !== condition.threshold
      case 'in':
        return Array.isArray(condition.threshold) && condition.threshold.includes(metricValue)
      case 'not_in':
        return Array.isArray(condition.threshold) && !condition.threshold.includes(metricValue)
      default:
        return false
    }
  }

  /**
   * 获取指标值
   */
  private getMetricValue(metricPath: string, metrics: SystemMetrics): number | undefined {
    const parts = metricPath.split('.')
    let value: any = metrics

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part]
      } else {
        return undefined
      }
    }

    return typeof value === 'number' ? value : undefined
  }

  /**
   * 触发预警
   */
  private async triggerAlert(rule: AlertRule, metrics: SystemMetrics): Promise<void> {
    const alertId = rule.id

    // 检查是否在冷却期内
    const existingAlert = this.activeAlerts.get(alertId)
    if (existingAlert && existingAlert.status === 'active') {
      const timeSinceLastTrigger = Date.now() - new Date(existingAlert.triggeredAt).getTime()
      if (timeSinceLastTrigger < rule.cooldownPeriod * 1000) {
        return
      }
    }

    const metricValue = this.getMetricValue(rule.condition.metric, metrics)
    const message = `${rule.name}: ${rule.condition.metric} = ${metricValue} (阈值: ${rule.condition.threshold})`

    const alertEvent: AlertEvent = {
      id: crypto.randomUUID(),
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      message,
      details: {
        metric: rule.condition.metric,
        currentValue: metricValue,
        threshold: rule.condition.threshold,
        operator: rule.condition.operator,
        metrics
      },
      status: 'active',
      triggeredAt: new Date().toISOString()
    }

    this.activeAlerts.set(alertId, alertEvent)

    // 执行预警动作
    for (const action of rule.actions) {
      await this.executeAlertAction(action, alertEvent)
    }

    console.warn(`🚨 预警触发: ${alertEvent.message}`)
  }

  /**
   * 解决预警
   */
  private async resolveAlert(ruleId: string): Promise<void> {
    const alert = this.activeAlerts.get(ruleId)
    if (alert && alert.status === 'active') {
      alert.status = 'resolved'
      alert.resolvedAt = new Date().toISOString()
      console.log(`✅ 预警已解决: ${alert.ruleName}`)
    }
  }

  /**
   * 执行预警动作
   */
  private async executeAlertAction(action: any, alert: AlertEvent): Promise<void> {
    switch (action.type) {
      case 'log':
        console.error(`[ALERT] ${alert.severity.toUpperCase()}: ${alert.message}`)
        break

      case 'notification':
        // 这里应该实现通知发送逻辑
        console.log(`[NOTIFICATION] ${alert.message}`)
        break

      case 'email':
        // 这里应该实现邮件发送逻辑
        console.log(`[EMAIL] 发送预警邮件: ${alert.message}`)
        break

      case 'webhook':
        // 这里应该实现webhook调用逻辑
        console.log(`[WEBHOOK] 调用webhook: ${alert.message}`)
        break

      default:
        console.warn(`未知的预警动作类型: ${action.type}`)
    }
  }

  /**
   * 检查数据源状态
   */
  async checkDataSourceStatus(): Promise<DataSourceStatus[]> {
    const statuses: DataSourceStatus[] = []

    // 检查职教云API状态
    try {
      const startTime = Date.now()
      const zhijiaoyunHealth = await this.zhijiaoyunService.healthCheck()
      const responseTime = Date.now() - startTime

      statuses.push({
        name: '职教云API',
        type: 'zhijiaoyun',
        status: zhijiaoyunHealth.status === 'healthy' ? 'connected' : 'error',
        lastCheckTime: new Date().toISOString(),
        responseTime,
        errorMessage: zhijiaoyunHealth.status !== 'healthy' ? zhijiaoyunHealth.error : undefined,
        configuration: {
          baseUrl: config.zhijiaoyun.baseUrl,
          timeout: config.zhijiaoyun.timeout
        }
      })
    } catch (error: any) {
      statuses.push({
        name: '职教云API',
        type: 'zhijiaoyun',
        status: 'error',
        lastCheckTime: new Date().toISOString(),
        errorMessage: error.message,
        configuration: {
          baseUrl: config.zhijiaoyun.baseUrl,
          timeout: config.zhijiaoyun.timeout
        }
      })
    }

    // 检查数据库状态
    try {
      const startTime = Date.now()
      const dbConnected = await this.dbService.testConnection()
      const responseTime = Date.now() - startTime

      statuses.push({
        name: '数据库',
        type: 'database',
        status: dbConnected ? 'connected' : 'error',
        lastCheckTime: new Date().toISOString(),
        responseTime,
        configuration: {
          host: config.database.host,
          port: config.database.port,
          database: config.database.name
        }
      })
    } catch (error: any) {
      statuses.push({
        name: '数据库',
        type: 'database',
        status: 'error',
        lastCheckTime: new Date().toISOString(),
        errorMessage: error.message,
        configuration: {
          host: config.database.host,
          port: config.database.port,
          database: config.database.name
        }
      })
    }

    return statuses
  }

  /**
   * 执行数据质量检查
   */
  async performDataQualityCheck(dataType: DataType): Promise<DataQualityResult> {
    const startTime = Date.now()

    try {
      // 这里应该实现实际的数据质量检查逻辑
      // 目前返回模拟结果
      const totalRecords = Math.floor(Math.random() * 1000) + 100
      const validRecords = Math.floor(totalRecords * (0.8 + Math.random() * 0.15))
      const invalidRecords = totalRecords - validRecords
      const duplicateRecords = Math.floor(Math.random() * 50)

      const issues: QualityIssue[] = []

      if (invalidRecords > 0) {
        issues.push({
          type: 'missing_data',
          severity: 'medium',
          description: '发现缺失数据字段',
          affectedRecords: invalidRecords
        })
      }

      if (duplicateRecords > 0) {
        issues.push({
          type: 'duplicate',
          severity: 'low',
          description: '发现重复数据记录',
          affectedRecords: duplicateRecords
        })
      }

      const qualityScore = Math.max(0, Math.min(100, (validRecords / totalRecords) * 100))

      return {
        dataType,
        totalRecords,
        validRecords,
        invalidRecords,
        duplicateRecords,
        missingFields: [],
        qualityScore,
        issues,
        checkedAt: new Date().toISOString()
      }
    } catch (error: any) {
      console.error('数据质量检查失败:', error)

      return {
        dataType,
        totalRecords: 0,
        validRecords: 0,
        invalidRecords: 0,
        duplicateRecords: 0,
        missingFields: [],
        qualityScore: 0,
        issues: [{
          type: 'invalid_format',
          severity: 'critical',
          description: '数据质量检查失败',
          affectedRecords: 0
        }],
        checkedAt: new Date().toISOString()
      }
    }
  }

  /**
   * 获取性能指标
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const timestamp = new Date().toISOString()

    // 获取实时性能数据
    const systemMetrics = await this.collectSystemMetrics()

    // 模拟采集任务统计
    const collectionTasks = {
      total: 10,
      running: 2,
      completed: 7,
      failed: 1
    }

    // 模拟数据质量指标
    const dataQuality = {
      overallScore: 85 + Math.random() * 10,
      validRecords: 800 + Math.floor(Math.random() * 200),
      invalidRecords: Math.floor(Math.random() * 50),
      duplicateRecords: Math.floor(Math.random() * 20)
    }

    // 系统健康度
    const systemHealth = {
      cpu: systemMetrics.cpu.usage,
      memory: systemMetrics.memory.usage,
      disk: systemMetrics.disk.usage,
      network: (systemMetrics.network.bytesIn + systemMetrics.network.bytesOut) / 1000000 // MB
    }

    // API性能
    const apiPerformance = {
      requestCount: Math.floor(Math.random() * 1000),
      averageResponseTime: systemMetrics.api.averageResponseTime,
      errorRate: systemMetrics.api.errorRate
    }

    return {
      timestamp,
      collectionTasks,
      dataQuality,
      systemHealth,
      apiPerformance
    }
  }

  /**
   * 添加预警规则
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, { ...rule, updatedAt: new Date().toISOString() })
  }

  /**
   * 删除预警规则
   */
  removeAlertRule(ruleId: string): boolean {
    return this.alertRules.delete(ruleId)
  }

  /**
   * 获取所有预警规则
   */
  getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values())
  }

  /**
   * 获取活跃预警
   */
  getActiveAlerts(): AlertEvent[] {
    return Array.from(this.activeAlerts.values()).filter(alert => alert.status === 'active')
  }

  /**
   * 确认预警
   */
  acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    for (const alert of this.activeAlerts.values()) {
      if (alert.id === alertId && alert.status === 'active') {
        alert.status = 'acknowledged'
        alert.acknowledgedAt = new Date().toISOString()
        alert.acknowledgedBy = acknowledgedBy
        return true
      }
    }
    return false
  }
}