import { Context } from 'hono'
import { ApiResponse } from '@/types'

// 404 Not Found 处理中间件
export const notFoundHandler = (c: Context) => {
  const response: ApiResponse = {
    success: false,
    message: '请求的资源不存在',
    error: 'NOT_FOUND',
  }

  return c.json(response, 404)
}