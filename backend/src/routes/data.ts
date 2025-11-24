import { Hono } from 'hono'
import { ApiResponse } from '@/types'

const data = new Hono()

// 获取数据源列表
data.get('/sources', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: [],
    message: '数据源列表获取成功',
  }

  return c.json(response, 200)
})

// 创建数据源
data.post('/sources', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: null,
    message: '数据源创建成功',
  }

  return c.json(response, 201)
})

// 启动数据采集
data.post('/collect', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: null,
    message: '数据采集已启动',
  }

  return c.json(response, 200)
})

// 获取采集历史
data.get('/collections', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: [],
    message: '采集历史获取成功',
  }

  return c.json(response, 200)
})

export { data as dataRoutes }