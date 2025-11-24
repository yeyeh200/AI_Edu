import { User, ActivityLog } from '@/types'

export class DatabaseService {
  private connectionString: string

  constructor() {
    // 从环境变量或配置文件获取数据库连接字符串
    this.connectionString = Deno.env.get('DATABASE_URL') ||
      'postgresql://postgres:postgres123@localhost:5432/ai_evaluation'
  }

  /**
   * 执行数据库查询
   */
  private async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const result = await this.executeSql(sql, params)
      return result.rows || []
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }

  /**
   * 执行单个SQL语句
   */
  private async executeSql(sql: string, params: any[] = []) {
    // 这里应该使用实际的PostgreSQL客户端
    // 由于在Deno环境中，我们模拟数据库操作
    console.log(`Executing SQL: ${sql}`)
    if (params.length > 0) {
      console.log('Parameters:', params)
    }

    // 模拟返回结果
    return {
      rows: [],
      rowCount: 0
    }
  }

  /**
   * 根据用户名获取用户信息
   */
  async getUserByUsername(username: string): Promise<User | null> {
    const sql = `
      SELECT
        id, username, email, password_hash, name, role, avatar,
        is_active, is_verified, created_at, updated_at, last_login_at
      FROM users
      WHERE username = $1 AND deleted_at IS NULL
    `

    const users = await this.query<User>(sql, [username])
    return users.length > 0 ? users[0] : null
  }

  /**
   * 根据用户ID获取用户信息
   */
  async getUserById(id: number): Promise<User | null> {
    const sql = `
      SELECT
        id, username, email, password_hash, name, role, avatar,
        is_active, is_verified, created_at, updated_at, last_login_at
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
    `

    const users = await this.query<User>(sql, [id])
    return users.length > 0 ? users[0] : null
  }

  /**
   * 更新用户最后登录时间
   */
  async updateUserLastLogin(userId: number): Promise<void> {
    const sql = `
      UPDATE users
      SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `

    await this.executeSql(sql, [userId])
  }

  /**
   * 更新用户密码
   */
  async updateUserPassword(userId: number, passwordHash: string): Promise<void> {
    const sql = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `

    await this.executeSql(sql, [passwordHash, userId])
  }

  /**
   * 创建活动日志
   */
  async createActivityLog(logData: {
    activityType: string
    activityName: string
    description: string
    userId: number | null
    username: string | null
    userRole: string | null
    status: string
    ipAddress?: string
    userAgent?: string
    requestMethod?: string
    requestUrl?: string
    metadata?: any
  }): Promise<void> {
    const sql = `
      INSERT INTO activity_logs (
        activity_type, activity_name, description, user_id, username, user_role,
        status, ip_address, user_agent, request_method, request_url, metadata, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP
      )
    `

    const params = [
      logData.activityType,
      logData.activityName,
      logData.description,
      logData.userId,
      logData.username,
      logData.userRole,
      logData.status,
      logData.ipAddress || '',
      logData.userAgent || '',
      logData.requestMethod || '',
      logData.requestUrl || '',
      JSON.stringify(logData.metadata || {})
    ]

    await this.executeSql(sql, params)
  }

  /**
   * 获取用户活动日志
   */
  async getUserActivityLogs(
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<ActivityLog[]> {
    const sql = `
      SELECT
        id, activity_type, activity_name, description, user_id, username, user_role,
        status, ip_address, user_agent, request_method, request_url, metadata, created_at
      FROM activity_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `

    return await this.query<ActivityLog>(sql, [userId, limit, offset])
  }

  /**
   * 获取所有活动日志
   */
  async getAllActivityLogs(
    limit: number = 100,
    offset: number = 0,
    activityType?: string
  ): Promise<ActivityLog[]> {
    let sql = `
      SELECT
        id, activity_type, activity_name, description, user_id, username, user_role,
        status, ip_address, user_agent, request_method, request_url, metadata, created_at
      FROM activity_logs
    `

    const params: any[] = []

    if (activityType) {
      sql += ` WHERE activity_type = $1 `
      params.push(activityType)
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2} `
    params.push(limit, offset)

    return await this.query<ActivityLog>(sql, params)
  }

  /**
   * 创建用户
   */
  async createUser(userData: {
    username: string
    email: string
    passwordHash: string
    name: string
    role: string
    avatar?: string
    isVerified?: boolean
    createdBy?: number
  }): Promise<User> {
    const sql = `
      INSERT INTO users (
        username, email, password_hash, name, role, avatar, is_active, is_verified, created_by, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING
        id, username, email, name, role, avatar, is_active, is_verified, created_at, updated_at, last_login_at
    `

    const params = [
      userData.username,
      userData.email,
      userData.passwordHash,
      userData.name,
      userData.role,
      userData.avatar || null,
      true, // is_active
      userData.isVerified || false,
      userData.createdBy || null
    ]

    const result = await this.query<User>(sql, params)
    return result[0]
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId: number, updateData: {
    email?: string
    name?: string
    avatar?: string
    isActive?: boolean
    isVerified?: boolean
  }): Promise<void> {
    const fields: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (updateData.email !== undefined) {
      fields.push(`email = $${paramIndex++}`)
      params.push(updateData.email)
    }
    if (updateData.name !== undefined) {
      fields.push(`name = $${paramIndex++}`)
      params.push(updateData.name)
    }
    if (updateData.avatar !== undefined) {
      fields.push(`avatar = $${paramIndex++}`)
      params.push(updateData.avatar)
    }
    if (updateData.isActive !== undefined) {
      fields.push(`is_active = $${paramIndex++}`)
      params.push(updateData.isActive)
    }
    if (updateData.isVerified !== undefined) {
      fields.push(`is_verified = $${paramIndex++}`)
      params.push(updateData.isVerified)
    }

    if (fields.length === 0) {
      return // 没有需要更新的字段
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)
    params.push(userId)

    const sql = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
    `

    await this.executeSql(sql, params)
  }

  /**
   * 获取用户列表
   */
  async getUserList(
    limit: number = 50,
    offset: number = 0,
    role?: string,
    isActive?: boolean
  ): Promise<User[]> {
    let sql = `
      SELECT
        id, username, email, name, role, avatar, is_active, is_verified,
        created_at, updated_at, last_login_at
      FROM users
      WHERE deleted_at IS NULL
    `

    const params: any[] = []
    let paramIndex = 1

    if (role) {
      sql += ` AND role = $${paramIndex++} `
      params.push(role)
    }
    if (isActive !== undefined) {
      sql += ` AND is_active = $${paramIndex++} `
      params.push(isActive)
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`
    params.push(limit, offset)

    return await this.query<User>(sql, params)
  }

  /**
   * 删除用户（软删除）
   */
  async deleteUser(userId: number): Promise<void> {
    const sql = `
      UPDATE users
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `

    await this.executeSql(sql, [userId])
  }

  /**
   * 验证数据库连接
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as test')
      return result.length > 0
    } catch (error) {
      console.error('Database connection test failed:', error)
      return false
    }
  }

  /**
   * 获取数据库统计信息
   */
  async getStats(): Promise<{
    userCount: number
    activeUserCount: number
    adminCount: number
    teacherCount: number
    todayActivityCount: number
  }> {
    const userCountSql = `SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL`
    const activeUserCountSql = `SELECT COUNT(*) as count FROM users WHERE is_active = true AND deleted_at IS NULL`
    const adminCountSql = `SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND deleted_at IS NULL`
    const teacherCountSql = `SELECT COUNT(*) as count FROM users WHERE role = 'teacher' AND deleted_at IS NULL`
    const todayActivityCountSql = `
      SELECT COUNT(*) as count FROM activity_logs
      WHERE created_at >= CURRENT_DATE
    `

    const [userCount, activeUserCount, adminCount, teacherCount, todayActivityCount] = await Promise.all([
      this.query<{ count: string }>(userCountSql),
      this.query<{ count: string }>(activeUserCountSql),
      this.query<{ count: string }>(adminCountSql),
      this.query<{ count: string }>(teacherCountSql),
      this.query<{ count: string }>(todayActivityCountSql)
    ])

    return {
      userCount: parseInt(userCount[0]?.count || '0'),
      activeUserCount: parseInt(activeUserCount[0]?.count || '0'),
      adminCount: parseInt(adminCount[0]?.count || '0'),
      teacherCount: parseInt(teacherCount[0]?.count || '0'),
      todayActivityCount: parseInt(todayActivityCount[0]?.count || '0')
    }
  }
}