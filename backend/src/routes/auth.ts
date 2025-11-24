import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { AuthService } from '@/services/authService'
import { ApiResponse } from '@/types'

const auth = new Hono()
const authService = new AuthService()

// 登录验证schema
const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
})


// 登录
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { username, password } = c.req.valid('json')
    const result = await authService.login({ username, password })

    const response: ApiResponse = {
      success: result.success,
      data: result.data,
      message: result.message,
      ...(result.error && { error: result.error })
    }

    if (!result.success) {
      return c.json(response, 401)
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '登录失败',
      error: 'LOGIN_FAILED',
    }

    return c.json(response, 401)
  }
})


// 登出
auth.post('/logout', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (token) {
      const result = await authService.logout(token)

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        ...(result.error && { error: result.error })
      }

      if (!result.success) {
        return c.json(response, 400)
      }

      return c.json(response, 200)
    }

    // 如果没有token，也返回成功（客户端可能已经清除token）
    const response: ApiResponse = {
      success: true,
      message: '登出成功',
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '登出失败',
      error: 'LOGOUT_FAILED',
    }

    return c.json(response, 400)
  }
})

// 刷新token
auth.post('/refresh', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: '缺少认证令牌',
        error: 'MISSING_TOKEN',
      }
      return c.json(response, 401)
    }

    const result = await authService.refreshToken(token)

    const response: ApiResponse = {
      success: result.success,
      data: result.data,
      message: result.message,
      ...(result.error && { error: result.error })
    }

    if (!result.success) {
      return c.json(response, 401)
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || 'Token刷新失败',
      error: 'REFRESH_FAILED',
    }

    return c.json(response, 401)
  }
})

// 获取当前用户信息
auth.get('/me', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: '缺少认证令牌',
        error: 'MISSING_TOKEN',
      }
      return c.json(response, 401)
    }

    const result = await authService.getCurrentUser(token)

    const response: ApiResponse = {
      success: result.success,
      data: result.data,
      message: result.message,
      ...(result.error && { error: result.error })
    }

    if (!result.success) {
      return c.json(response, 401)
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '获取用户信息失败',
      error: 'GET_USER_FAILED',
    }

    return c.json(response, 401)
  }
})

// 修改密码
auth.post('/change-password', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: '缺少认证令牌',
        error: 'MISSING_TOKEN',
      }
      return c.json(response, 401)
    }

    const { currentPassword, newPassword } = await c.req.json()

    if (!currentPassword || !newPassword) {
      const response: ApiResponse = {
        success: false,
        message: '请提供当前密码和新密码',
        error: 'MISSING_PASSWORDS',
      }
      return c.json(response, 400)
    }

    const result = await authService.changePassword(token, currentPassword, newPassword)

    const response: ApiResponse = {
      success: result.success,
      message: result.message,
      ...(result.error && { error: result.error })
    }

    if (!result.success) {
      return c.json(response, 400)
    }

    return c.json(response, 200)
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: error.message || '密码修改失败',
      error: 'CHANGE_PASSWORD_FAILED',
    }

    return c.json(response, 400)
  }
})

export { auth as authRoutes }