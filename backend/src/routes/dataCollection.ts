/**
 * 数据采集和监控路由
 * 提供数据采集任务管理、监控和配置接口
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { DataCollectionService } from '@/services/dataCollectionService.ts'
import { DataMonitoringService } from '@/services/dataMonitoringService.ts'
import { authMiddleware, adminMiddleware } from '@/middleware/auth'
import { ApiResponse } from '@/types'
import { CollectionTask, DataType, AlertRule } from '@/types/dataCollection'

const dataCollection = new Hono()
const collectionService = new DataCollectionService()
const monitoringService = new DataMonitoringService()

// 查询参数验证schemas
const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
})

const taskQuerySchema = paginationSchema.extend({
  dataType: z.enum(['users', 'courses', 'classes', 'attendance', 'assignments', 'exam_scores', 'evaluations', 'teaching_activities']).optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'paused']).optional(),
  enabled: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
})

const logQuerySchema = paginationSchema.extend({
  taskId: z.string().optional(),
  level: z.enum(['debug', 'info', 'warn', 'error']).optional(),
})

// 创建任务验证schema
const createTaskSchema = z.object({
  name: z.string().min(1, '任务名称不能为空'),
  description: z.string().optional(),
  dataType: z.enum(['users', 'courses', 'classes', 'attendance', 'assignments', 'exam_scores', 'evaluations', 'teaching_activities']),
  schedule: z.string().min(1, '调度配置不能为空'),
  enabled: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
})

// 更新任务验证schema
const updateTaskSchema = z.object({
  name: z.string().min(1, '任务名称不能为空').optional(),
  description: z.string().optional(),
  schedule: z.string().min(1, '调度配置不能为空').optional(),
  enabled: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
})

// 预警规则验证schema
const alertRuleSchema = z.object({
  name: z.string().min(1, '规则名称不能为空'),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  condition: z.object({
    metric: z.string().min(1, '指标名称不能为空'),
    operator: z.enum(['>', '<', '>=', '<=', '==', '!=', 'in', 'not_in']),
    threshold: z.union([z.number(), z.string(), z.array(z.union([z.number(), z.string()]))]),
    duration: z.number().optional(),
  }),
  actions: z.array(z.object({
    type: z.enum(['log', 'notification', 'email', 'webhook']),
    config: z.record(z.any()),
  })),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  cooldownPeriod: z.number().min(0).default(300),
})

// 数据采集配置路由
dataCollection.get('/config', authMiddleware, async (c) => {
  try {
    const config = collectionService.getConfig()

    const response: ApiResponse = {
      success: true,
      data: config,
      message: '获取采集配置成功',
      code: 200,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取采集配置失败',
      error: 'GET_CONFIG_FAILED',
      code: 500,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 500)
  }
})

dataCollection.put('/config', adminMiddleware, async (c) => {
  try {
    const configData = await c.req.json()
    collectionService.updateConfig(configData)

    const response: ApiResponse = {
      success: true,
      message: '更新采集配置成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '更新采集配置失败',
      error: 'UPDATE_CONFIG_FAILED',
    }

    return c.json(response, 500)
  }
})

// 采集任务路由
dataCollection.get('/tasks', authMiddleware, zValidator('query', taskQuerySchema), async (c) => {
  try {
    const params = c.req.valid('query')
    const { tasks, total } = await collectionService.listTasks({
      page: params.page,
      pageSize: params.pageSize,
      dataType: params.dataType,
      status: params.status,
      enabled: params.enabled,
    })

    const response: ApiResponse = {
      success: true,
      data: {
        tasks,
        total,
        page: params.page,
        pageSize: params.pageSize
      },
      message: '获取采集任务列表成功',
      code: 200,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取采集任务列表失败',
      error: 'GET_TASKS_FAILED',
      code: 500,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 500)
  }
})

dataCollection.post('/tasks', adminMiddleware, zValidator('json', createTaskSchema), async (c) => {
  try {
    const taskData = c.req.valid('json')

    const task: CollectionTask = {
      id: crypto.randomUUID(),
      ...taskData,
      status: 'pending',
      recordCount: 0,
      successCount: 0,
      errorCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await collectionService.createTask(task)

    const response: ApiResponse = {
      success: true,
      data: task,
      message: '创建采集任务成功',
      code: 201,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 201)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '创建采集任务失败',
      error: 'CREATE_TASK_FAILED',
      code: 400,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 400)
  }
})

dataCollection.get('/tasks/:taskId', authMiddleware, async (c) => {
  try {
    const taskId = c.req.param('taskId')
    const task = await collectionService.getTask(taskId)

    if (!task) {
      const response: ApiResponse = {
        success: false,
        message: '采集任务不存在',
        error: 'TASK_NOT_FOUND',
        code: 404,
        timestamp: new Date().toISOString(),
      }
      return c.json(response, 404)
    }

    const response: ApiResponse = {
      success: true,
      data: task,
      message: '获取采集任务成功',
      code: 200,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取采集任务失败',
      error: 'GET_TASK_FAILED',
      code: 500,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 500)
  }
})

dataCollection.put('/tasks/:taskId', adminMiddleware, zValidator('json', updateTaskSchema), async (c) => {
  try {
    const taskId = c.req.param('taskId')
    const updateData = c.req.valid('json')

    const ok = await collectionService.updateTask(taskId, updateData)

    if (!ok) {
      const response: ApiResponse = {
        success: false,
        message: '采集任务不存在',
        error: 'TASK_NOT_FOUND',
        code: 404,
        timestamp: new Date().toISOString(),
      }
      return c.json(response, 404)
    }

    const task = await collectionService.getTask(taskId)

    const response: ApiResponse = {
      success: true,
      data: task,
      message: '更新采集任务成功',
      code: 200,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '更新采集任务失败',
      error: 'UPDATE_TASK_FAILED',
      code: 400,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 400)
  }
})

dataCollection.delete('/tasks/:taskId', adminMiddleware, async (c) => {
  try {
    const taskId = c.req.param('taskId')
    const ok = await collectionService.deleteTask(taskId)

    if (!ok) {
      const response: ApiResponse = {
        success: false,
        message: '采集任务不存在',
        error: 'TASK_NOT_FOUND',
        code: 404,
        timestamp: new Date().toISOString(),
      }
      return c.json(response, 404)
    }

    const response: ApiResponse = {
      success: true,
      message: '删除采集任务成功',
      code: 200,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '删除采集任务失败',
      error: 'DELETE_TASK_FAILED',
      code: 500,
      timestamp: new Date().toISOString(),
    }

    return c.json(response, 500)
  }
})

// 执行采集任务
dataCollection.post('/tasks/:taskId/execute', adminMiddleware, async (c) => {
  try {
    const taskId = c.req.param('taskId')

    // TODO: 查找任务并执行
    const result = await collectionService.executeTask({
      id: taskId,
      name: '测试任务',
      description: '测试数据采集',
      dataType: DataType.USERS,
      schedule: '0 0 * * *',
      enabled: true,
      status: 'pending',
      recordCount: 0,
      successCount: 0,
      errorCount: 0,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    const response: ApiResponse = {
      success: true,
      data: result,
      message: '执行采集任务成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '执行采集任务失败',
      error: 'EXECUTE_TASK_FAILED',
    }

    return c.json(response, 500)
  }
})

// 取消正在运行的任务
dataCollection.post('/tasks/:taskId/cancel', adminMiddleware, async (c) => {
  try {
    const taskId = c.req.param('taskId')
    const success = collectionService.cancelTask(taskId)

    if (!success) {
      const response: ApiResponse = {
        success: false,
        message: '任务不存在或未在运行',
        error: 'CANNOT_CANCEL_TASK',
      }
      return c.json(response, 400)
    }

    const response: ApiResponse = {
      success: true,
      message: '取消任务成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '取消任务失败',
      error: 'CANCEL_TASK_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取正在运行的任务
dataCollection.get('/tasks/running', authMiddleware, async (c) => {
  try {
    const runningTasks = collectionService.getRunningTasks()

    const response: ApiResponse = {
      success: true,
      data: { runningTasks },
      message: '获取正在运行的任务成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取正在运行的任务失败',
      error: 'GET_RUNNING_TASKS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 采集日志路由
dataCollection.get('/logs', authMiddleware, zValidator('query', logQuerySchema), async (c) => {
  try {
    const params = c.req.valid('query')
    const logs = collectionService.getLogs(params.taskId, params.level, params.pageSize)

    const response: ApiResponse = {
      success: true,
      data: {
        logs,
        total: logs.length
      },
      message: '获取采集日志成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取采集日志失败',
      error: 'GET_LOGS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 监控相关路由
dataCollection.get('/monitoring/health', authMiddleware, async (c) => {
  try {
    const metrics = await monitoringService.collectSystemMetrics()

    const response: ApiResponse = {
      success: true,
      data: metrics,
      message: '获取系统健康状态成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取系统健康状态失败',
      error: 'GET_HEALTH_FAILED',
    }

    return c.json(response, 500)
  }
})

dataCollection.get('/monitoring/data-sources', authMiddleware, async (c) => {
  try {
    const dataSources = await monitoringService.checkDataSourceStatus()

    const response: ApiResponse = {
      success: true,
      data: { dataSources },
      message: '获取数据源状态成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取数据源状态失败',
      error: 'GET_DATA_SOURCES_FAILED',
    }

    return c.json(response, 500)
  }
})

dataCollection.get('/monitoring/performance', authMiddleware, async (c) => {
  try {
    const performance = await monitoringService.getPerformanceMetrics()

    const response: ApiResponse = {
      success: true,
      data: performance,
      message: '获取性能指标成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取性能指标失败',
      error: 'GET_PERFORMANCE_FAILED',
    }

    return c.json(response, 500)
  }
})

dataCollection.post('/monitoring/data-quality/:dataType', authMiddleware, async (c) => {
  try {
    const dataType = c.req.param('dataType') as DataType

    const qualityResult = await monitoringService.performDataQualityCheck(dataType)

    const response: ApiResponse = {
      success: true,
      data: qualityResult,
      message: '数据质量检查完成',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '数据质量检查失败',
      error: 'DATA_QUALITY_CHECK_FAILED',
    }

    return c.json(response, 500)
  }
})

// 预警管理路由
dataCollection.get('/alerts/rules', authMiddleware, async (c) => {
  try {
    const alertRules = monitoringService.getAlertRules()

    const response: ApiResponse = {
      success: true,
      data: { alertRules },
      message: '获取预警规则成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取预警规则失败',
      error: 'GET_ALERT_RULES_FAILED',
    }

    return c.json(response, 500)
  }
})

dataCollection.post('/alerts/rules', adminMiddleware, zValidator('json', alertRuleSchema), async (c) => {
  try {
    const ruleData = c.req.valid('json')

    const alertRule: AlertRule = {
      id: crypto.randomUUID(),
      ...ruleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    monitoringService.addAlertRule(alertRule)

    const response: ApiResponse = {
      success: true,
      data: alertRule,
      message: '创建预警规则成功',
    }

    return c.json(response, 201)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '创建预警规则失败',
      error: 'CREATE_ALERT_RULE_FAILED',
    }

    return c.json(response, 400)
  }
})

dataCollection.delete('/alerts/rules/:ruleId', adminMiddleware, async (c) => {
  try {
    const ruleId = c.req.param('ruleId')
    const success = monitoringService.removeAlertRule(ruleId)

    if (!success) {
      const response: ApiResponse = {
        success: false,
        message: '预警规则不存在',
        error: 'ALERT_RULE_NOT_FOUND',
      }
      return c.json(response, 404)
    }

    const response: ApiResponse = {
      success: true,
      message: '删除预警规则成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '删除预警规则失败',
      error: 'DELETE_ALERT_RULE_FAILED',
    }

    return c.json(response, 500)
  }
})

dataCollection.get('/alerts/active', authMiddleware, async (c) => {
  try {
    const activeAlerts = monitoringService.getActiveAlerts()

    const response: ApiResponse = {
      success: true,
      data: { activeAlerts },
      message: '获取活跃预警成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取活跃预警失败',
      error: 'GET_ACTIVE_ALERTS_FAILED',
    }

    return c.json(response, 500)
  }
})

dataCollection.post('/alerts/:alertId/acknowledge', authMiddleware, async (c) => {
  try {
    const alertId = c.req.param('alertId')
    const { acknowledgedBy } = await c.req.json()

    if (!acknowledgedBy) {
      const response: ApiResponse = {
        success: false,
        message: '确认人信息不能为空',
        error: 'MISSING_ACKNOWLEDGED_BY',
      }
      return c.json(response, 400)
    }

    const success = monitoringService.acknowledgeAlert(alertId, acknowledgedBy)

    if (!success) {
      const response: ApiResponse = {
        success: false,
        message: '预警不存在或状态不支持确认',
        error: 'CANNOT_ACKNOWLEDGE_ALERT',
      }
      return c.json(response, 400)
    }

    const response: ApiResponse = {
      success: true,
      message: '确认预警成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '确认预警失败',
      error: 'ACKNOWLEDGE_ALERT_FAILED',
    }

    return c.json(response, 500)
  }
})

export { dataCollection as dataCollectionRoutes }
