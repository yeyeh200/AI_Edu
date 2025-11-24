import { Hono } from 'hono'
import { ApiResponse } from '@/types'

const analysis = new Hono()

// 获取分析结果列表
analysis.get('/results', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: [],
    message: '分析结果列表获取成功',
  }

  return c.json(response, 200)
})

// 创建分析任务
analysis.post('/tasks', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: null,
    message: '分析任务创建成功',
  }

  return c.json(response, 201)
})

// 获取评价规则列表
analysis.get('/rules', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: [],
    message: '评价规则列表获取成功',
  }

  return c.json(response, 200)
})

// 创建评价规则
analysis.post('/rules', async (c) => {
  const response: ApiResponse = {
    success: true,
    data: null,
    message: '评价规则创建成功',
  }

  return c.json(response, 201)
})

export { analysis as analysisRoutes }