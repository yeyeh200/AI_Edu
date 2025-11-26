import { Hono } from 'hono'
import { ApiResponse } from '@/types'
import { SystemService } from '@/services/systemService.ts'
import { LogService } from '@/services/logService.ts'
// import { MonitoringService } from '@/services/monitoringService.ts'
import { authMiddleware } from '@/middleware/auth.ts'

const system = new Hono()
const systemService = new SystemService()
const logService = new LogService()
// const monitoringService = new MonitoringService()

// 应用认证中间件到所有路由
system.use('*', authMiddleware)

// ===== 系统配置管理 API =====

// 获取系统配置列表
system.get('/config', async (c) => {
  try {
    const { category, page, limit, search, includePrivate } = c.req.query()
    const auth = c.get('auth')
    const user = auth?.user

    const result = await systemService.getConfigs({
      category,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      includePrivate: includePrivate === 'true' || user?.role === 'admin'
    })

    if (result.success && result.data) {
      return c.json(result.data, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 获取系统配置失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取系统配置失败',
      error: 'GET_CONFIG_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取单个系统配置
system.get('/config/:key', async (c) => {
  try {
    const configKey = c.req.param('key')

    const result = await systemService.getConfigByKey(configKey)

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, result.error === 'CONFIG_NOT_FOUND' ? 404 : 500)
    }
  } catch (error: any) {
    console.error('❌ 获取系统配置详情失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取系统配置详情失败',
      error: 'GET_CONFIG_DETAIL_FAILED',
    }

    return c.json(response, 500)
  }
})

// 创建系统配置
system.post('/config', async (c) => {
  try {
    const body = await c.req.json()
    const auth = c.get('auth')
    const user = auth?.user

    // 检查管理员权限
    if (user?.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        message: '权限不足，仅管理员可以创建配置',
        error: 'INSUFFICIENT_PERMISSIONS',
      }
      return c.json(response, 403)
    }

    const result = await systemService.createConfig(body, user.id)

    if (result.success) {
      return c.json(result, 201)
    } else {
      const statusCode = result.error === 'CONFIG_KEY_EXISTS' ? 409 : 400
      return c.json(result, statusCode)
    }
  } catch (error: any) {
    console.error('❌ 创建系统配置失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '创建系统配置失败',
      error: 'CREATE_CONFIG_FAILED',
    }

    return c.json(response, 500)
  }
})

// 更新系统配置
system.put('/config/:key', async (c) => {
  try {
    const configKey = c.req.param('key')
    const body = await c.req.json()
    const auth = c.get('auth')
    const user = auth?.user

    // 检查管理员权限
    if (user?.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        message: '权限不足，仅管理员可以更新配置',
        error: 'INSUFFICIENT_PERMISSIONS',
      }
      return c.json(response, 403)
    }

    const result = await systemService.updateConfig(configKey, body, user.id)

    if (result.success) {
      return c.json(result, 200)
    } else {
      const statusCode = result.error === 'CONFIG_NOT_FOUND' ? 404 : 400
      return c.json(result, statusCode)
    }
  } catch (error: any) {
    console.error('❌ 更新系统配置失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '更新系统配置失败',
      error: 'UPDATE_CONFIG_FAILED',
    }

    return c.json(response, 500)
  }
})

// 删除系统配置
system.delete('/config/:key', async (c) => {
  try {
    const configKey = c.req.param('key')
    const auth = c.get('auth')
    const user = auth?.user

    // 检查管理员权限
    if (user?.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        message: '权限不足，仅管理员可以删除配置',
        error: 'INSUFFICIENT_PERMISSIONS',
      }
      return c.json(response, 403)
    }

    const result = await systemService.deleteConfig(configKey, user.id)

    if (result.success) {
      return c.json(result, 200)
    } else {
      const statusCode = result.error === 'CONFIG_NOT_FOUND' ? 404 : 500
      return c.json(result, statusCode)
    }
  } catch (error: any) {
    console.error('❌ 删除系统配置失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '删除系统配置失败',
      error: 'DELETE_CONFIG_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取配置分类
system.get('/config/categories', async (c) => {
  try {
    const result = await systemService.getConfigCategories()

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 获取配置分类失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取配置分类失败',
      error: 'GET_CATEGORIES_FAILED',
    }

    return c.json(response, 500)
  }
})

// ===== 日志管理 API =====

// 获取系统日志
system.get('/logs', async (c) => {
  try {
    const {
      activityType,
      status,
      page,
      limit,
      search,
      startDate,
      endDate,
      userId,
      userRole
    } = c.req.query()

    const auth = c.get('auth')
    const user = auth?.user

    const result = await logService.getLogs({
      activityType,
      status,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      startDate,
      endDate,
      userId: userId ? parseInt(userId) : undefined,
      userRole
    })

    if (result.success && result.data) {
      return c.json(result.data, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 获取系统日志失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取系统日志失败',
      error: 'GET_LOGS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取单个日志详情
system.get('/logs/:id', async (c) => {
  try {
    const logId = c.req.param('id')

    const result = await logService.getLogById(logId)

    if (result.success) {
      return c.json(result, 200)
    } else {
      const statusCode = result.error === 'LOG_NOT_FOUND' ? 404 : 500
      return c.json(result, statusCode)
    }
  } catch (error: any) {
    console.error('❌ 获取日志详情失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取日志详情失败',
      error: 'GET_LOG_DETAIL_FAILED',
    }

    return c.json(response, 500)
  }
})

// 导出日志
system.post('/logs/export', async (c) => {
  try {
    const body = await c.req.json()
    const auth = c.get('auth')
    const user = auth?.user

    // 检查管理员权限
    if (user?.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        message: '权限不足，仅管理员可以导出日志',
        error: 'INSUFFICIENT_PERMISSIONS',
      }
      return c.json(response, 403)
    }

    const result = await logService.exportLogs(body)

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 导出日志失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '导出日志失败',
      error: 'EXPORT_LOGS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取日志统计
system.get('/logs/statistics', async (c) => {
  try {
    const { startDate, endDate, activityType } = c.req.query()

    const result = await logService.getLogStatistics({
      startDate,
      endDate,
      activityType
    })

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 获取日志统计失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取日志统计失败',
      error: 'GET_LOG_STATISTICS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 清理过期日志
system.delete('/logs/cleanup', async (c) => {
  try {
    const { daysToKeep = 90 } = c.req.query()
    const auth = c.get('auth')
    const user = auth?.user

    // 检查管理员权限
    if (user?.role !== 'admin') {
      const response: ApiResponse = {
        success: false,
        message: '权限不足，仅管理员可以清理日志',
        error: 'INSUFFICIENT_PERMISSIONS',
      }
      return c.json(response, 403)
    }

    const result = await logService.cleanupOldLogs(parseInt(daysToKeep))

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 清理日志失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '清理日志失败',
      error: 'CLEANUP_LOGS_FAILED',
    }

    return c.json(response, 500)
  }
})

// ===== 系统监控 API =====

// 获取系统状态
system.get('/monitor/status', async (c) => {
  try {
    const result = await monitoringService.getSystemStatus()

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 获取系统状态失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取系统状态失败',
      error: 'GET_SYSTEM_STATUS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取性能指标
system.get('/monitor/metrics', async (c) => {
  try {
    const result = await monitoringService.getSystemMetrics()

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 获取性能指标失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取性能指标失败',
      error: 'GET_METRICS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取数据采集状态
system.get('/monitor/collection', async (c) => {
  try {
    const result = await monitoringService.getCollectionStatus()

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 获取数据采集状态失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取数据采集状态失败',
      error: 'GET_COLLECTION_STATUS_FAILED',
    }

    return c.json(response, 500)
  }
})

// 触发数据同步
system.post('/monitor/collection/:dataSourceId/sync', async (c) => {
  try {
    const dataSourceId = c.req.param('dataSourceId')
    const body = await c.req.json()
    const syncType = body.syncType || 'incremental'

    const result = await monitoringService.triggerDataSync(dataSourceId, syncType)

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 400)
    }
  } catch (error: any) {
    console.error('❌ 触发数据同步失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '触发数据同步失败',
      error: 'TRIGGER_SYNC_FAILED',
    }

    return c.json(response, 500)
  }
})

// 取消采集任务
system.post('/monitor/collection/tasks/:taskId/cancel', async (c) => {
  try {
    const taskId = c.req.param('taskId')

    const result = await monitoringService.cancelCollectionTask(taskId)

    if (result.success) {
      return c.json(result, 200)
    } else {
      const statusCode = result.error === 'TASK_NOT_CANCELLED' ? 404 : 400
      return c.json(result, statusCode)
    }
  } catch (error: any) {
    console.error('❌ 取消采集任务失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '取消采集任务失败',
      error: 'CANCEL_TASK_FAILED',
    }

    return c.json(response, 500)
  }
})

// 获取历史监控数据
system.get('/monitor/history', async (c) => {
  try {
    const { period = 'day' } = c.req.query()

    const result = await monitoringService.getHistoricalMetrics(period as 'hour' | 'day' | 'week' | 'month')

    if (result.success) {
      return c.json(result, 200)
    } else {
      return c.json(result, 500)
    }
  } catch (error: any) {
    console.error('❌ 获取历史监控数据失败:', error)

    const response: ApiResponse = {
      success: false,
      message: error.message || '获取历史监控数据失败',
      error: 'GET_HISTORY_FAILED',
    }

    return c.json(response, 500)
  }
})

export { system as systemRoutes }