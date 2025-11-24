import { User, LoginRequest, LoginResponse, AuthResponse } from '@/types/index.ts'
import { DatabaseService } from '@/services/databaseService.ts'
import { create, verify, decode, getNumericDate } from 'jwt'
import { config } from '@/config/config.ts'

export class AuthService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = new DatabaseService()
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginRequest): Promise<AuthResponse<LoginResponse>> {
    const { username, password } = credentials

    try {
      // 查询用户信息
      const user = await this.dbService.getUserByUsername(username)

      if (!user) {
        throw new Error('用户不存在')
      }

      if (!user.is_active) {
        throw new Error('账户已被禁用')
      }

      // 验证密码
      const isValidPassword = await this.verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        throw new Error('用户名或密码错误')
      }

      // 生成JWT令牌
      const token = await this.generateToken(user)

      // 更新最后登录时间
      await this.updateLastLogin(user.id)

      // 移除敏感信息并转换BigInt
      const { password_hash, ...userWithoutPassword } = user
      const safeUser = {
        ...userWithoutPassword,
        id: String(user.id),
        created_by: user.created_by ? String(user.created_by) : undefined,
        updated_by: user.updated_by ? String(user.updated_by) : undefined
      }

      const response: LoginResponse = {
        user: safeUser as any,
        token: token,
        expiresIn: config.jwt.expiresInNumber
      }

      // 记录登录活动日志
      await this.logActivity('login', '用户登录成功', user.id, username, user.role)

      return {
        success: true,
        data: response,
        message: '登录成功'
      }

    } catch (error: any) {
      // 记录登录失败活动日志
      await this.logActivity('login_failed', `登录失败: ${error.message}`, null, username, null)

      return {
        success: false,
        message: error.message || '登录失败',
        error: 'LOGIN_FAILED'
      }
    }
  }

  /**
   * 用户登出
   */
  async logout(token: string): Promise<AuthResponse> {
    try {
      // 验证令牌
      const payload = await this.verifyToken(token)
      if (!payload) {
        throw new Error('无效的令牌')
      }

      // 记录登出活动日志
      await this.logActivity('logout', '用户登出', payload.userId as number, payload.username, payload.role)

      // JWT是无状态的，无需服务端处理令牌失效
      // 客户端删除令牌即可

      return {
        success: true,
        message: '登出成功'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '登出失败',
        error: 'LOGOUT_FAILED'
      }
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(token: string): Promise<AuthResponse<User>> {
    try {
      // 验证令牌
      const payload = await this.verifyToken(token)
      if (!payload) {
        throw new Error('无效的令牌')
      }

      // 查询用户信息
      const user = await this.dbService.getUserById(payload.userId as number)

      if (!user || !user.is_active) {
        throw new Error('用户不存在或已被禁用')
      }

      // 移除敏感信息并转换BigInt
      const { password_hash, ...userWithoutPassword } = user
      const safeUser = {
        ...userWithoutPassword,
        id: String(user.id),
        created_by: user.created_by ? String(user.created_by) : undefined,
        updated_by: user.updated_by ? String(user.updated_by) : undefined
      }

      return {
        success: true,
        data: safeUser as any,
        message: '获取用户信息成功'
      }

    } catch (error: any) {
      return {
        success: false,
        message: error.message || '获取用户信息失败',
        error: 'GET_USER_FAILED'
      }
    }
  }

  /**
   * 刷新令牌
   */
  async refreshToken(token: string): Promise<AuthResponse<LoginResponse>> {
    try {
      // 验证当前令牌
      const payload = await this.verifyToken(token)
      if (!payload) {
        throw new Error('无效的令牌')
      }

      // 检查令牌是否在有效期内（还有1小时过期）
      const now = Math.floor(Date.now() / 1000)
      const expirationTime = payload.exp as number
      const timeUntilExpiry = expirationTime - now

      if (timeUntilExpiry < 3600) { // 小于1小时
        throw new Error('令牌即将过期，请重新登录')
      }

      // 查询用户信息
      const user = await this.dbService.getUserById(payload.userId as number)
      if (!user || !user.is_active) {
        throw new Error('用户不存在或已被禁用')
      }

      // 生成新的令牌
      const newToken = await this.generateToken(user)

      // 更新最后登录时间
      await this.updateLastLogin(user.id)

      // 移除敏感信息并转换BigInt
      const { password_hash, ...userWithoutPassword } = user
      const safeUser = {
        ...userWithoutPassword,
        id: String(user.id),
        created_by: user.created_by ? String(user.created_by) : undefined,
        updated_by: user.updated_by ? String(user.updated_by) : undefined
      }

      const response: LoginResponse = {
        user: safeUser as any,
        token: newToken,
        expiresIn: config.jwt.expiresInNumber
      }

      return {
        success: true,
        data: response,
        message: '令牌刷新成功'
      }

    } catch (error: any) {
      return {
        success: false,
        message: error.message || '令牌刷新失败',
        error: 'REFRESH_FAILED'
      }
    }
  }

  /**
   * 修改密码
   */
  async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      // 验证令牌
      const payload = await this.verifyToken(token)
      if (!payload) {
        throw new Error('无效的令牌')
      }

      // 查询用户信息
      const user = await this.dbService.getUserById(payload.userId as number)
      if (!user) {
        throw new Error('用户不存在')
      }

      // 验证当前密码
      const isValidPassword = await this.verifyPassword(currentPassword, user.password_hash)
      if (!isValidPassword) {
        throw new Error('当前密码不正确')
      }

      // 验证新密码强度
      this.validatePassword(newPassword)

      // 加密新密码
      const newPasswordHash = await this.hashPassword(newPassword)

      // 更新密码
      await this.dbService.updateUserPassword(user.id, newPasswordHash)

      // 记录密码修改活动日志
      await this.logActivity('password_change', '用户修改密码', user.id, user.username, user.role)

      return {
        success: true,
        message: '密码修改成功'
      }

    } catch (error: any) {
      return {
        success: false,
        message: error.message || '密码修改失败',
        error: 'CHANGE_PASSWORD_FAILED'
      }
    }
  }

  /**
   * 获取用户权限
   */
  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.dbService.getUserById(userId)
    if (!user) {
      return []
    }

    // 根据角色返回权限
    const rolePermissions = this.getRolePermissions(user.role)
    return rolePermissions
  }

  /**
   * 检查用户权限
   */
  async checkPermission(userId: number, permission: string): Promise<boolean> {
    const user = await this.dbService.getUserById(userId)
    if (!user || !user.is_active) {
      return false
    }

    const permissions = this.getRolePermissions(user.role)
    return permissions.includes(permission)
  }

  /**
   * 获取用户完整信息（供中间件使用）
   */
  async getUserById(userId: number): Promise<User | null> {
    return await this.dbService.getUserById(userId)
  }

  /**
   * 验证JWT令牌
   */
  private async verifyToken(token: string): Promise<any> {
    try {
      const key = await this.getKey()
      const payload = await verify(token, key)
      return payload
    } catch (error) {
      return null
    }
  }

  /**
   * 生成JWT令牌
   */
  private async generateToken(user: User): Promise<string> {
    const payload = {
      userId: Number(user.id),
      username: user.username,
      email: user.email,
      role: user.role,
      iss: config.jwt.issuer,
      aud: config.jwt.audience,
      exp: getNumericDate(config.jwt.expiresInNumber)
    }

    const key = await this.getKey()
    return await create({ alg: 'HS512', typ: 'JWT' }, payload, key)
  }

  private async getKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(config.jwt.secret)
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-512' },
      true,
      ['sign', 'verify']
    )
  }

  /**
   * 验证密码
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      // 使用与数据库种子数据相同的哈希算法 (SHA-256 hex)
      const computedHash = await this.hashPassword(password)
      return hash === computedHash
    } catch (error) {
      console.error('Password verification error:', error)
      return false
    }
  }

  /**
   * 加密密码
   */
  private async hashPassword(password: string): Promise<string> {
    try {
      // 使用Web Crypto API进行密码哈希，与PostgreSQL的encode(digest(password, 'sha256'), 'hex')兼容
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hash = await crypto.subtle.digest(
        { name: 'SHA-256' },
        data
      )
      // 转换为小写十六进制字符串，匹配PostgreSQL的hex编码
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase()
    } catch (error) {
      console.error('Password hashing error:', error)
      // 降级处理：使用简单的字符串哈希
      return btoa(password).split('').reverse().join('')
    }
  }

  /**
   * 验证密码强度
   */
  private validatePassword(password: string): void {
    if (password.length < config.security.passwordPolicy.minLength) {
      throw new Error(`密码长度不能少于${config.security.passwordPolicy.minLength}位`)
    }

    if (config.security.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      throw new Error('密码必须包含大写字母')
    }

    if (config.security.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      throw new Error('密码必须包含小写字母')
    }

    if (config.security.passwordPolicy.requireNumbers && !/[0-9]/.test(password)) {
      throw new Error('密码必须包含数字')
    }

    if (config.security.passwordPolicy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new Error('密码必须包含特殊字符')
    }
  }

  /**
   * 根据角色获取权限
   */
  private getRolePermissions(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      admin: [
        'user:read', 'user:write', 'user:delete',
        'system:read', 'system:write',
        'data:read', 'data:write', 'data:delete',
        'analysis:read', 'analysis:write', 'analysis:delete',
        'report:read', 'report:write', 'report:delete',
        'config:read', 'config:write'
      ],
      teacher: [
        'profile:read', 'profile:write',
        'data:read', 'data:limited-write',
        'analysis:read', 'analysis:self',
        'report:read', 'report:self',
        'course:read', 'course:limited-write'
      ]
    }

    return rolePermissions[role] || []
  }

  /**
   * 更新最后登录时间
   */
  private async updateLastLogin(userId: number): Promise<void> {
    await this.dbService.updateUserLastLogin(userId)
  }

  /**
   * 记录活动日志
   */
  private async logActivity(
    activityType: string,
    description: string,
    userId: number | null,
    username: string | null,
    userRole: string | null
  ): Promise<void> {
    try {
      await this.dbService.createActivityLog({
        activityType,
        activityName: activityType,
        description,
        userId,
        username,
        userRole,
        status: 'success',
        ipAddress: '', // 可以从请求头获取
        userAgent: '', // 可以从请求头获取
        requestMethod: '',
        requestUrl: '',
        metadata: {}
      })
    } catch (error) {
      // 记录日志失败不应该影响主要功能
      console.error('记录活动日志失败:', error)
    }
  }
}