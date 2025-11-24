import { Hono } from 'hono'
import { ApiResponse } from '@/types'

const system = new Hono()

// 获取系统配置
system.get('/config', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: [],
    message: '系统配置获取成功',
  }

  return c.json(response, 200)
})

// 更新系统配置
system.put('/config/:key', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: null,
    message: '系统配置更新成功',
  }

  return c.json(response, 200)
})

// 获取系统日志
system.get('/logs', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: [],
    message: '系统日志获取成功',
  }

  return c.json(response, 200)
})

export { system as systemRoutes }