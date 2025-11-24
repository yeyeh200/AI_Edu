import { Context, Next } from 'hono'
import { verify } from 'jwt'
import { config } from '@/config/config.ts'
import { AuthService } from '@/services/authService.ts'
import { AuthContext } from '@/types/index.ts'

const authService = new AuthService()

// JWT认证中间件
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        message: '缺少认证令牌',
        error: 'MISSING_TOKEN',
      }, 401)
    }

    const token = authHeader.replace('Bearer ', '')

    // 验证JWT令牌
    const encoder = new TextEncoder()
    const keyData = encoder.encode(config.jwt.secret)
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-512' },
      true,
      ['sign', 'verify']
    )
    const payload = await verify(token, key)

    if (!payload) {
      return c.json({
        success: false,
        message: '无效的认证令牌',
        error: 'INVALID_TOKEN',
      }, 401)
    }

    // 获取用户信息
    const user = await authService.getUserById(payload.userId as number)
    if (!user || !user.is_active) {
      return c.json({
        success: false,
        message: '用户不存在或已被禁用',
        error: 'USER_INACTIVE',
      }, 401)
    }

    // 设置认证上下文
    const authContext: AuthContext = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    }

    c.set('auth', authContext)

    await next()
  } catch (error: any) {
    console.error('Auth middleware error:', error)
    return c.json({
      success: false,
      message: '认证失败',
      error: 'AUTH_FAILED',
    }, 401)
  }
}

// 角色权限中间件
export const roleMiddleware = (requiredRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const auth = c.get('auth') as AuthContext

    if (!auth || !auth.user) {
      return c.json({
        success: false,
        message: '需要认证',
        error: 'AUTHENTICATION_REQUIRED',
      }, 401)
    }

    if (!requiredRoles.includes(auth.user.role)) {
      return c.json({
        success: false,
        message: '权限不足',
        error: 'INSUFFICIENT_PERMISSIONS',
      }, 403)
    }

    await next()
  }
}

// 管理员权限中间件
export const adminMiddleware = roleMiddleware(['admin'])

// 管理员或教师权限中间件
export const staffMiddleware = roleMiddleware(['admin', 'teacher'])

// 可选认证中间件（不强制要求登录）
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')

      const encoder = new TextEncoder()
      const keyData = encoder.encode(config.jwt.secret)
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-512' },
        true,
        ['sign', 'verify']
      )
      const payload = await verify(token, key)

      if (payload) {
        const user = await authService.getUserById(payload.userId as number)
        if (user && user.is_active) {
          const authContext: AuthContext = {
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              name: user.name,
              avatar: user.avatar,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
            token,
          }
          c.set('auth', authContext)
        }
      }
    }
  } catch (error) {
    // 可选认证失败时不阻止请求继续
    console.warn('Optional auth failed:', error)
  }

  await next()
}