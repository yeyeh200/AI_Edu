import { SystemConfig, ApiResponse, PaginatedResponse } from '@/types/index.ts'
import { DatabaseService } from '@/services/databaseService.ts'

export interface ConfigQueryOptions {
  category?: string
  page?: number
  limit?: number
  search?: string
  includePrivate?: boolean
}

export interface CreateConfigRequest {
  key: string
  name: string
  description: string
  category: string
  value: any
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array'
  isPublic?: boolean
  isEditable?: boolean
}

export interface UpdateConfigRequest {
  name?: string
  description?: string
  value?: any
  isPublic?: boolean
  isEditable?: boolean
}

export interface ConfigValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  enum?: any[]
}

export interface ConfigCategory {
  id: string
  name: string
  description: string
  icon?: string
  configCount?: number
  color?: string
}

export class SystemService {
  private dbService: DatabaseService
  private configCache: Map<string, SystemConfig> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.dbService = new DatabaseService()
  }

  /**
   * 获取系统配置列表
   */
  async getConfigs(options: ConfigQueryOptions = {}): Promise<ApiResponse<PaginatedResponse<SystemConfig>>> {
    const {
      category,
      page = 1,
      limit = 20,
      search,
      includePrivate = false
    } = options

    try {
      let whereClause = '1=1'
      const params: any[] = []
      let paramIndex = 1

      // 分类过滤
      if (category) {
        whereClause += ` AND category = $${paramIndex++}`
        params.push(category)
      }

      // 权限过滤
      if (!includePrivate) {
        whereClause += ` AND is_public = true`
      }

      // 搜索过滤
      if (search) {
        whereClause += ` AND (key ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`
        params.push(`%${search}%`, `%${search}%`)
      }

      // 获取总数
      const countSql = `SELECT COUNT(*) as total FROM system_configs WHERE ${whereClause}`
      const countResult = await this.dbService.query<{ total: number }>(countSql, params)
      const total = countResult[0]?.total || 0

      // 分页查询
      const offset = (page - 1) * limit
      const dataSql = `
        SELECT
          id, category, key, value, description, type,
          is_public, updated_by, created_at, updated_at
        FROM system_configs
        WHERE ${whereClause}
        ORDER BY category, key
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `
      params.push(limit, offset)

      const configs = await this.dbService.query<SystemConfig>(dataSql, params)

      // 转换BigInt为字符串
      const safeConfigs = configs.map(config => ({
        ...config,
        id: String(config.id),
        updated_by: config.updated_by ? String(config.updated_by) : undefined
      }))

      const pagination = {
        page,
        page_size: limit,
        total,
        total_pages: Math.ceil(total / limit)
      }

      // 更新缓存
      safeConfigs.forEach(config => {
        this.setCache(config.key, config)
      })

      return {
        success: true,
        data: {
          success: true,
          data: safeConfigs,
          message: '系统配置获取成功',
          pagination
        },
        message: '系统配置获取成功'
      }

    } catch (error: any) {
      console.error('❌ 获取系统配置失败:', error)
      return {
        success: false,
        message: error.message || '获取系统配置失败',
        error: 'GET_CONFIGS_FAILED'
      }
    }
  }

  /**
   * 获取单个系统配置
   */
  async getConfigByKey(key: string): Promise<ApiResponse<SystemConfig>> {
    try {
      // 先检查缓存
      const cached = this.getCache(key)
      if (cached) {
        return {
          success: true,
          data: cached,
          message: '系统配置获取成功'
        }
      }

      const sql = `
        SELECT
          id, category, key, value, description, type,
          is_public, updated_by, created_at, updated_at
        FROM system_configs
        WHERE key = $1
      `

      const configs = await this.dbService.query<SystemConfig>(sql, [key])

      if (configs.length === 0) {
        return {
          success: false,
          message: '配置不存在',
          error: 'CONFIG_NOT_FOUND'
        }
      }

      const config = {
        ...configs[0],
        id: String(configs[0].id),
        updated_by: configs[0].updated_by ? String(configs[0].updated_by) : undefined
      }

      // 更新缓存
      this.setCache(key, config)

      return {
        success: true,
        data: config,
        message: '系统配置获取成功'
      }

    } catch (error: any) {
      console.error('❌ 获取系统配置失败:', error)
      return {
        success: false,
        message: error.message || '获取系统配置失败',
        error: 'GET_CONFIG_FAILED'
      }
    }
  }

  /**
   * 创建系统配置
   */
  async createConfig(request: CreateConfigRequest, userId: string): Promise<ApiResponse<SystemConfig>> {
    try {
      // 验证配置键唯一性
      const existingConfig = await this.getConfigByKey(request.key)
      if (existingConfig.success) {
        return {
          success: false,
          message: '配置键已存在',
          error: 'CONFIG_KEY_EXISTS'
        }
      }

      // 验证配置值
      const validationResult = this.validateConfigValue(request.value, request.dataType)
      if (!validationResult.valid) {
        return {
          success: false,
          message: validationResult.error || '配置值验证失败',
          error: 'CONFIG_VALUE_INVALID'
        }
      }

      // 插入新配置
      const sql = `
        INSERT INTO system_configs (
          category, key, value, description, type,
          is_public, updated_by, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        ) RETURNING id, category, key, value, description, type,
                  is_public, updated_by, created_at, updated_at
      `

      const params = [
        request.category,
        request.key,
        JSON.stringify(request.value),
        request.description,
        request.dataType,
        request.isPublic !== false, // 默认为true
        userId
      ]

      const configs = await this.dbService.query<SystemConfig>(sql, params)

      if (configs.length === 0) {
        return {
          success: false,
          message: '创建配置失败',
          error: 'CREATE_CONFIG_FAILED'
        }
      }

      const config = {
        ...configs[0],
        id: String(configs[0].id),
        updated_by: configs[0].updated_by ? String(configs[0].updated_by) : undefined
      }

      // 更新缓存
      this.setCache(request.key, config)

      // 记录活动日志
      await this.logActivity('config_create', `创建配置: ${request.key}`, userId)

      return {
        success: true,
        data: config,
        message: '系统配置创建成功'
      }

    } catch (error: any) {
      console.error('❌ 创建系统配置失败:', error)
      return {
        success: false,
        message: error.message || '创建系统配置失败',
        error: 'CREATE_CONFIG_FAILED'
      }
    }
  }

  /**
   * 更新系统配置
   */
  async updateConfig(key: string, request: UpdateConfigRequest, userId: string): Promise<ApiResponse<SystemConfig>> {
    try {
      // 检查配置是否存在
      const existingConfig = await this.getConfigByKey(key)
      if (!existingConfig.success) {
        return {
          success: false,
          message: '配置不存在',
          error: 'CONFIG_NOT_FOUND'
        }
      }

      const config = existingConfig.data!

      // 构建更新语句
      const updateFields: string[] = []
      const params: any[] = []
      let paramIndex = 1

      if (request.name !== undefined) {
        updateFields.push(`description = $${paramIndex++}`)
        params.push(request.name)
      }

      if (request.description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`)
        params.push(request.description)
      }

      if (request.value !== undefined) {
        // 验证配置值
        const validationResult = this.validateConfigValue(request.value, config.type as any)
        if (!validationResult.valid) {
          return {
            success: false,
            message: validationResult.error || '配置值验证失败',
            error: 'CONFIG_VALUE_INVALID'
          }
        }

        updateFields.push(`value = $${paramIndex++}`)
        params.push(JSON.stringify(request.value))
      }

      if (request.isPublic !== undefined) {
        updateFields.push(`is_public = $${paramIndex++}`)
        params.push(request.isPublic)
      }

      if (updateFields.length === 0) {
        return {
          success: false,
          message: '没有要更新的字段',
          error: 'NO_FIELDS_TO_UPDATE'
        }
      }

      // 添加更新信息
      updateFields.push(`updated_by = $${paramIndex++}`)
      params.push(userId)
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

      // 添加WHERE条件参数
      params.push(key)

      const sql = `
        UPDATE system_configs
        SET ${updateFields.join(', ')}
        WHERE key = $${paramIndex}
        RETURNING id, category, key, value, description, type,
                  is_public, updated_by, created_at, updated_at
      `

      const configs = await this.dbService.query<SystemConfig>(sql, params)

      if (configs.length === 0) {
        return {
          success: false,
          message: '更新配置失败',
          error: 'UPDATE_CONFIG_FAILED'
        }
      }

      const updatedConfig = {
        ...configs[0],
        id: String(configs[0].id),
        updated_by: configs[0].updated_by ? String(configs[0].updated_by) : undefined
      }

      // 更新缓存
      this.setCache(key, updatedConfig)

      // 记录活动日志
      await this.logActivity('config_update', `更新配置: ${key}`, userId)

      return {
        success: true,
        data: updatedConfig,
        message: '系统配置更新成功'
      }

    } catch (error: any) {
      console.error('❌ 更新系统配置失败:', error)
      return {
        success: false,
        message: error.message || '更新系统配置失败',
        error: 'UPDATE_CONFIG_FAILED'
      }
    }
  }

  /**
   * 删除系统配置
   */
  async deleteConfig(key: string, userId: string): Promise<ApiResponse> {
    try {
      // 检查配置是否存在
      const existingConfig = await this.getConfigByKey(key)
      if (!existingConfig.success) {
        return {
          success: false,
          message: '配置不存在',
          error: 'CONFIG_NOT_FOUND'
        }
      }

      const sql = 'DELETE FROM system_configs WHERE key = $1'
      const result = await this.dbService.executeSql(sql, [key])

      if (result.rowCount === 0) {
        return {
          success: false,
          message: '删除配置失败',
          error: 'DELETE_CONFIG_FAILED'
        }
      }

      // 清除缓存
      this.clearCache(key)

      // 记录活动日志
      await this.logActivity('config_delete', `删除配置: ${key}`, userId)

      return {
        success: true,
        data: { key },
        message: '系统配置删除成功'
      }

    } catch (error: any) {
      console.error('❌ 删除系统配置失败:', error)
      return {
        success: false,
        message: error.message || '删除系统配置失败',
        error: 'DELETE_CONFIG_FAILED'
      }
    }
  }

  /**
   * 获取配置分类
   */
  async getConfigCategories(): Promise<ApiResponse<ConfigCategory[]>> {
    try {
      const sql = `
        SELECT
          category,
          COUNT(*) as config_count
        FROM system_configs
        GROUP BY category
        ORDER BY category
      `

      const results = await this.dbService.query<{ category: string; config_count: number }>(sql, [])

      const categories: ConfigCategory[] = [
        {
          id: 'system',
          name: '系统设置',
          description: '系统基础参数和通用配置',
          icon: 'cog',
          color: 'bg-blue-100 text-blue-800'
        },
        {
          id: 'database',
          name: '数据源配置',
          description: '职教云等外部数据源连接配置',
          icon: 'database',
          color: 'bg-green-100 text-green-800'
        },
        {
          id: 'analysis',
          name: '分析规则',
          description: 'AI分析引擎的评分规则和权重',
          icon: 'chart-bar',
          color: 'bg-purple-100 text-purple-800'
        },
        {
          id: 'monitoring',
          name: '监控配置',
          description: '系统监控和告警相关配置',
          icon: 'server',
          color: 'bg-orange-100 text-orange-800'
        }
      ]

      // 更新配置数量
      results.forEach(result => {
        const category = categories.find(cat => cat.id === result.category)
        if (category) {
          category.configCount = result.config_count
        }
      })

      return {
        success: true,
        data: categories,
        message: '配置分类获取成功'
      }

    } catch (error: any) {
      console.error('❌ 获取配置分类失败:', error)
      return {
        success: false,
        message: error.message || '获取配置分类失败',
        error: 'GET_CATEGORIES_FAILED'
      }
    }
  }

  /**
   * 批量更新配置
   */
  async batchUpdateConfigs(
    updates: Array<{ key: string; value: any }>,
    userId: string
  ): Promise<ApiResponse<SystemConfig[]>> {
    try {
      const results: SystemConfig[] = []
      const errors: string[] = []

      for (const update of updates) {
        const result = await this.updateConfig(update.key, { value: update.value }, userId)
        if (result.success && result.data) {
          results.push(result.data)
        } else {
          errors.push(`${update.key}: ${result.message}`)
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: `部分配置更新失败: ${errors.join('; ')}`,
          error: 'BATCH_UPDATE_FAILED'
        }
      }

      return {
        success: true,
        data: results,
        message: '批量更新配置成功'
      }

    } catch (error: any) {
      console.error('❌ 批量更新配置失败:', error)
      return {
        success: false,
        message: error.message || '批量更新配置失败',
        error: 'BATCH_UPDATE_FAILED'
      }
    }
  }

  /**
   * 验证配置值
   */
  private validateConfigValue(value: any, dataType: string): { valid: boolean; error?: string } {
    try {
      switch (dataType) {
        case 'string':
          if (typeof value !== 'string') {
            return { valid: false, error: '值必须是字符串类型' }
          }
          break

        case 'number':
          const numValue = Number(value)
          if (isNaN(numValue)) {
            return { valid: false, error: '值必须是数字类型' }
          }
          break

        case 'boolean':
          if (typeof value !== 'boolean') {
            return { valid: false, error: '值必须是布尔类型' }
          }
          break

        case 'json':
        case 'array':
          if (typeof value === 'string') {
            // 尝试解析JSON字符串
            JSON.parse(value)
          } else if (typeof value !== 'object' || value === null) {
            return { valid: false, error: '值必须是JSON对象或数组' }
          }
          break
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, error: 'JSON格式无效' }
    }
  }

  /**
   * 缓存管理
   */
  private setCache(key: string, config: SystemConfig): void {
    this.configCache.set(key, config)
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL)
  }

  private getCache(key: string): SystemConfig | null {
    const expiry = this.cacheExpiry.get(key)
    if (!expiry || Date.now() > expiry) {
      this.configCache.delete(key)
      this.cacheExpiry.delete(key)
      return null
    }
    return this.configCache.get(key) || null
  }

  private clearCache(key?: string): void {
    if (key) {
      this.configCache.delete(key)
      this.cacheExpiry.delete(key)
    } else {
      this.configCache.clear()
      this.cacheExpiry.clear()
    }
  }

  /**
   * 记录活动日志
   */
  private async logActivity(
    activityType: string,
    description: string,
    userId: string
  ): Promise<void> {
    try {
      await this.dbService.createActivityLog({
        activityType,
        activityName: activityType,
        description,
        userId: parseInt(userId),
        username: '', // 可以通过userId查询
        userRole: '', // 可以通过userId查询
        status: 'success',
        ipAddress: '',
        userAgent: '',
        requestMethod: '',
        requestUrl: '',
        metadata: {}
      })
    } catch (error) {
      console.error('记录活动日志失败:', error)
    }
  }

  /**
   * 热更新配置通知
   */
  async notifyConfigUpdate(key: string, value: any): Promise<void> {
    // 这里可以实现配置热更新机制
    // 例如：通知其他服务实例配置已更新
    console.log(`配置热更新通知: ${key} = ${JSON.stringify(value)}`)

    // 可以使用WebSocket、Redis发布订阅等方式
    // 通知所有服务实例更新配置缓存
  }
}