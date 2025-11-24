import { Context } from 'hono'

import { ApiResponse, AppError } from '@/types'

// 全局错误处理中间件
export const errorHandler = (err: Error, c: Context) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: err.stack,
    url: c.req.url,
    method: c.req.method,
    headers: c.req.header(),
  })

  // 默认错误响应
  const defaultResponse: ApiResponse = {
    success: false,
    message: '服务器内部错误',
    error: 'INTERNAL_SERVER_ERROR',
  }

  // 根据错误类型返回不同的响应
  if (err.name === 'ValidationError') {
    const response: ApiResponse = {
      success: false,
      message: '数据验证失败',
      error: 'VALIDATION_ERROR',
    }
    return c.json(response, 400)
  }

  if (err.name === 'UnauthorizedError') {
    const response: ApiResponse = {
      success: false,
      message: '认证失败',
      error: 'UNAUTHORIZED',
    }
    return c.json(response, 401)
  }

  if (err.name === 'ForbiddenError') {
    const response: ApiResponse = {
      success: false,
      message: '权限不足',
      error: 'FORBIDDEN',
    }
    return c.json(response, 403)
  }

  if (err.name === 'NotFoundError') {
    const response: ApiResponse = {
      success: false,
      message: '资源不存在',
      error: 'NOT_FOUND',
    }
    return c.json(response, 404)
  }

  if (err.name === 'ConflictError') {
    const response: ApiResponse = {
      success: false,
      message: '资源冲突',
      error: 'CONFLICT',
    }
    return c.json(response, 409)
  }

  // 数据库错误
  if (err.message.includes('database') || err.message.includes('connection')) {
    const response: ApiResponse = {
      success: false,
      message: '数据库连接错误',
      error: 'DATABASE_ERROR',
    }
    return c.json(response, 500)
  }

  // JWT相关错误
  if (err.message.includes('jwt') || err.message.includes('token')) {
    const response: ApiResponse = {
      success: false,
      message: '认证令牌无效',
      error: 'INVALID_TOKEN',
    }
    return c.json(response, 401)
  }

  // 开发环境返回详细错误信息
  if (process.env.NODE_ENV === 'development') {
    const response: ApiResponse = {
      success: false,
      message: err.message,
      error: err.name || 'UNKNOWN_ERROR',
    }
    return c.json(response, 500)
  }

  return c.json(defaultResponse, 500)
}

// 自定义错误类
export class AppErrorImpl extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, code: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

// 预定义错误类
export class ValidationError extends AppErrorImpl {
  constructor(message: string = '数据验证失败') {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class UnauthorizedError extends AppErrorImpl {
  constructor(message: string = '认证失败') {
    super(message, 'UNAUTHORIZED', 401)
  }
}

export class ForbiddenError extends AppErrorImpl {
  constructor(message: string = '权限不足') {
    super(message, 'FORBIDDEN', 403)
  }
}

export class NotFoundError extends AppErrorImpl {
  constructor(message: string = '资源不存在') {
    super(message, 'NOT_FOUND', 404)
  }
}

export class ConflictError extends AppErrorImpl {
  constructor(message: string = '资源冲突') {
    super(message, 'CONFLICT', 409)
  }
}

export class DatabaseError extends AppErrorImpl {
  constructor(message: string = '数据库错误') {
    super(message, 'DATABASE_ERROR', 500)
  }
}

export class ExternalServiceError extends AppErrorImpl {
  constructor(message: string = '外部服务错误') {
    super(message, 'EXTERNAL_SERVICE_ERROR', 502)
  }
}

// 错误处理工具函数
export const handleError = (error: any): AppError => {
  if (error instanceof AppErrorImpl) {
    return error
  }

  if (error.name === 'ValidationError') {
    return new ValidationError(error.message)
  }

  if (error.name === 'UnauthorizedError') {
    return new UnauthorizedError(error.message)
  }

  if (error.name === 'ForbiddenError') {
    return new ForbiddenError(error.message)
  }

  if (error.name === 'NotFoundError') {
    return new NotFoundError(error.message)
  }

  if (error.name === 'ConflictError') {
    return new ConflictError(error.message)
  }

  if (error.message.includes('database')) {
    return new DatabaseError(error.message)
  }

  return new AppErrorImpl(
    error.message || '未知错误',
    error.code || 'UNKNOWN_ERROR',
    error.statusCode || 500,
  )
}