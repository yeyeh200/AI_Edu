/**
 * 数据质量规则服务
 * 管理和应用数据质量规则
 */

import { DatabaseService } from './databaseService.ts'
import { DataQualityRule, DataQualityIssueType, IssueSeverity } from '@/types/dataCleaning'

export class DataQualityRulesService {
  private dbService: DatabaseService
  private defaultRules: Map<string, DataQualityRule>

  constructor() {
    this.dbService = new DatabaseService()
    this.defaultRules = new Map()
    this.initializeDefaultRules()
  }

  /**
   * 初始化默认数据质量规则
   */
  private initializeDefaultRules(): void {
    // 用户名规则
    this.defaultRules.set('username_validation', {
      id: 'username_validation',
      name: '用户名验证规则',
      description: '验证用户名的格式和长度',
      tableName: 'users',
      fieldName: 'username',
      ruleType: DataQualityIssueType.INVALID_FORMAT,
      condition: 'username IS NOT NULL AND (LENGTH(username) < 3 OR LENGTH(username) > 50 OR NOT username ~ \'^[a-zA-Z0-9_]+$\')',
      severity: IssueSeverity.MEDIUM,
      enabled: true,
      autoFixable: false,
      suggestedFix: 'normalize',
      parameters: {
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_]+$'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 邮箱规则
    this.defaultRules.set('email_validation', {
      id: 'email_validation',
      name: '邮箱格式验证规则',
      description: '验证邮箱地址格式的有效性',
      tableName: 'users',
      fieldName: 'email',
      ruleType: DataQualityIssueType.INVALID_FORMAT,
      condition: 'email IS NOT NULL AND email !~ \'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\'',
      severity: IssueSeverity.HIGH,
      enabled: true,
      autoFixable: false,
      suggestedFix: 'manual_review',
      parameters: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 电话号码规则
    this.defaultRules.set('phone_validation', {
      id: 'phone_validation',
      name: '电话号码验证规则',
      description: '验证电话号码格式的有效性',
      tableName: 'users',
      fieldName: 'phone',
      ruleType: DataQualityIssueType.INVALID_FORMAT,
      condition: 'phone IS NOT NULL AND phone !~ \'^[+]?[1-9][\\d]{0,15}$\'',
      severity: IssueSeverity.MEDIUM,
      enabled: true,
      autoFixable: true,
      suggestedFix: 'normalize',
      parameters: {
        pattern: '^[+]?[1-9][\\d]{0,15}$',
        removeSpaces: true,
        removeNonDigits: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 年龄规则
    this.defaultRules.set('age_validation', {
      id: 'age_validation',
      name: '年龄范围验证规则',
      description: '验证年龄是否在合理范围内',
      tableName: 'users',
      fieldName: 'age',
      ruleType: DataQualityIssueType.INVALID_RANGE,
      condition: 'age IS NOT NULL AND (age < 16 OR age > 100)',
      severity: IssueSeverity.HIGH,
      enabled: true,
      autoFixable: true,
      suggestedFix: 'cap_outlier',
      parameters: {
        minValue: 16,
        maxValue: 100
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 课程学分规则
    this.defaultRules.set('course_credits_validation', {
      id: 'course_credits_validation',
      name: '课程学分验证规则',
      description: '验证课程学分的合理性',
      tableName: 'courses',
      fieldName: 'credits',
      ruleType: DataQualityIssueType.INVALID_RANGE,
      condition: 'credits IS NOT NULL AND (credits < 0.5 OR credits > 10)',
      severity: IssueSeverity.HIGH,
      enabled: true,
      autoFixable: true,
      suggestedFix: 'cap_outlier',
      parameters: {
        minValue: 0.5,
        maxValue: 10
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 出勤率规则
    this.defaultRules.set('attendance_rate_validation', {
      id: 'attendance_rate_validation',
      name: '出勤率验证规则',
      description: '验证出勤率是否在合理范围内',
      tableName: 'attendance_summary',
      fieldName: 'attendance_rate',
      ruleType: DataQualityIssueType.INVALID_RANGE,
      condition: 'attendance_rate IS NOT NULL AND (attendance_rate < 0 OR attendance_rate > 100)',
      severity: IssueSeverity.HIGH,
      enabled: true,
      autoFixable: true,
      suggestedFix: 'cap_outlier',
      parameters: {
        minValue: 0,
        maxValue: 100
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 成绩规则
    this.defaultRules.set('score_validation', {
      id: 'score_validation',
      name: '成绩范围验证规则',
      description: '验证考试成绩是否在合理范围内',
      tableName: 'exam_scores',
      fieldName: 'student_score',
      ruleType: DataQualityIssueType.INVALID_RANGE,
      condition: 'student_score IS NOT NULL AND (student_score < 0 OR student_score > 100)',
      severity: IssueSeverity.HIGH,
      enabled: true,
      autoFixable: true,
      suggestedFix: 'cap_outlier',
      parameters: {
        minValue: 0,
        maxValue: 100
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 评价分数规则
    this.defaultRules.set('evaluation_score_validation', {
      id: 'evaluation_score_validation',
      name: '评价分数验证规则',
      description: '验证评价分数是否在合理范围内',
      tableName: 'evaluations',
      fieldName: 'score',
      ruleType: DataQualityIssueType.INVALID_RANGE,
      condition: 'score IS NOT NULL AND (score < 1 OR score > 5)',
      severity: IssueSeverity.MEDIUM,
      enabled: true,
      autoFixable: true,
      suggestedFix: 'cap_outlier',
      parameters: {
        minValue: 1,
        maxValue: 5
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 教学时长规则
    this.defaultRules.set('teaching_hours_validation', {
      id: 'teaching_hours_validation',
      name: '教学时长验证规则',
      description: '验证教学时长是否合理',
      tableName: 'teaching_activities',
      fieldName: 'duration',
      ruleType: DataQualityIssueType.INVALID_RANGE,
      condition: 'duration IS NOT NULL AND (duration < 5 OR duration > 480)',
      severity: IssueSeverity.MEDIUM,
      enabled: true,
      autoFixable: true,
      suggestedFix: 'cap_outlier',
      parameters: {
        minValue: 5,   // 5分钟
        maxValue: 480 // 8小时
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // 日期一致性规则
    this.defaultRules.set('date_consistency_validation', {
      id: 'date_consistency_validation',
      name: '日期一致性验证规则',
      description: '验证日期的逻辑一致性',
      tableName: 'all',
      fieldName: 'created_at',
      ruleType: DataQualityIssueType.TEMPORAL_INCONSISTENCY,
      condition: 'created_at > CURRENT_DATE OR created_at < \'2000-01-01\'',
      severity: IssueSeverity.HIGH,
      enabled: true,
      autoFixable: false,
      suggestedFix: 'manual_review',
      parameters: {
        minDate: '2000-01-01',
        maxDate: 'CURRENT_DATE'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    console.log(`📋 已加载 ${this.defaultRules.size} 个默认数据质量规则`)
  }

  /**
   * 获取所有默认规则
   */
  getDefaultRules(): DataQualityRule[] {
    return Array.from(this.defaultRules.values())
  }

  /**
   * 获取指定表的默认规则
   */
  getDefaultRulesForTable(tableName: string): DataQualityRule[] {
    return Array.from(this.defaultRules.values())
      .filter(rule => rule.tableName === tableName || rule.tableName === 'all')
  }

  /**
   * 添加自定义规则
   */
  addCustomRule(rule: Omit<DataQualityRule, 'id' | 'createdAt' | 'updatedAt'>): DataQualityRule {
    const newRule: DataQualityRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // TODO: 保存到数据库
    console.log(`✅ 添加自定义规则: ${newRule.name}`)
    return newRule
  }

  /**
   * 更新规则
   */
  updateRule(ruleId: string, updates: Partial<DataQualityRule>): DataQualityRule | null {
    const rule = this.defaultRules.get(ruleId)
    if (!rule) {
      // TODO: 尝试从数据库获取
      return null
    }

    const updatedRule = {
      ...rule,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.defaultRules.set(ruleId, updatedRule)
    // TODO: 更新数据库

    console.log(`✅ 更新规则: ${updatedRule.name}`)
    return updatedRule
  }

  /**
   * 删除规则
   */
  removeRule(ruleId: string): boolean {
    const deleted = this.defaultRules.delete(ruleId)
    if (deleted) {
      // TODO: 从数据库删除
      console.log(`✅ 删除规则: ${ruleId}`)
    }
    return deleted
  }

  /**
   * 启用/禁用规则
   */
  toggleRule(ruleId: string, enabled: boolean): DataQualityRule | null {
    const rule = this.updateRule(ruleId, { enabled })
    if (rule) {
      console.log(`${enabled ? '✅ 启用' : '❌ 禁用'}规则: ${rule.name}`)
    }
    return rule
  }

  /**
   * 验证数据是否符合规则
   */
  async validateDataAgainstRules(
    tableName: string,
    data: any[]
  ): Promise<Array<{
      rule: DataQualityRule
      violations: Array<{
        recordIndex: number
        record: any
        message: string
        severity: IssueSeverity
      }>
    }>> {
    console.log(`🔍 使用规则验证 ${data.length} 条 ${tableName} 数据`)

    const rules = this.getDefaultRulesForTable(tableName)
    const results = []

    for (const rule of rules) {
      if (!rule.enabled) continue

      const violations = []

      for (let i = 0; i < data.length; i++) {
        const record = data[i]
        const fieldValue = record[rule.fieldName]

        if (await this.evaluateRuleCondition(rule, record, fieldValue)) {
          violations.push({
            recordIndex: i,
            record,
            message: this.getRuleViolationMessage(rule, fieldValue),
            severity: rule.severity
          })
        }
      }

      if (violations.length > 0) {
        results.push({
          rule,
          violations
        })
      }
    }

    console.log(`📊 规则验证完成，发现 ${results.reduce((sum, r) => sum + r.violations.length, 0)} 个违规`)
    return results
  }

  /**
   * 评估规则条件
   */
  private async evaluateRuleCondition(
    rule: DataQualityRule,
    record: any,
    fieldValue: any
  ): Promise<boolean> {
    try {
      // 简化的条件评估逻辑
      switch (rule.ruleType) {
        case DataQualityIssueType.MISSING_VALUE:
          return fieldValue === null || fieldValue === undefined || fieldValue === ''

        case DataQualityIssueType.INVALID_FORMAT:
          if (rule.parameters?.pattern) {
            const pattern = new RegExp(rule.parameters.pattern)
            return typeof fieldValue === 'string' && !pattern.test(fieldValue)
          }
          return false

        case DataQualityIssueType.INVALID_RANGE:
          if (typeof fieldValue !== 'number') return false
          const min = rule.parameters?.minValue
          const max = rule.parameters?.maxValue
          if (min !== undefined && fieldValue < min) return true
          if (max !== undefined && fieldValue > max) return true
          return false

        case DataQualityIssueType.TEMPORAL_INCONSISTENCY:
          if (fieldValue instanceof Date) {
            const now = new Date()
            const minDate = rule.parameters?.minDate ? new Date(rule.parameters.minDate) : null
            const maxDate = rule.parameters?.maxDate === 'CURRENT_DATE' ? now :
                           (rule.parameters?.maxDate ? new Date(rule.parameters.maxDate) : null)

            if (minDate && fieldValue < minDate) return true
            if (maxDate && fieldValue > maxDate) return true
          }
          return false

        default:
          return false
      }
    } catch (error) {
      console.warn(`规则条件评估失败: ${rule.name}`, error)
      return false
    }
  }

  /**
   * 获取规则违规消息
   */
  private getRuleViolationMessage(rule: DataQualityRule, fieldValue: any): string {
    const fieldName = rule.fieldName
    const value = String(fieldValue)

    switch (rule.ruleType) {
      case DataQualityIssueType.MISSING_VALUE:
        return `字段 ${fieldName} 不能为空`

      case DataQualityIssueType.INVALID_FORMAT:
        return `字段 ${fieldName} 的值 "${value}" 格式无效`

      case DataQualityIssueType.INVALID_RANGE:
        const min = rule.parameters?.minValue
        const max = rule.parameters?.maxValue
        if (min !== undefined && max !== undefined) {
          return `字段 ${fieldName} 的值 ${value} 超出范围 [${min}, ${max}]`
        } else if (min !== undefined) {
          return `字段 ${fieldName} 的值 ${value} 小于最小值 ${min}`
        } else if (max !== undefined) {
          return `字段 ${fieldName} 的值 ${value} 大于最大值 ${max}`
        }
        return `字段 ${fieldName} 的值 ${value} 超出有效范围`

      case DataQualityIssueType.TEMPORAL_INCONSISTENCY:
        return `字段 ${fieldName} 的日期值不合理`

      default:
        return `字段 ${fieldName} 违反了数据质量规则`
    }
  }

  /**
   * 自动修复数据
   */
  async autoFixData(
    tableName: string,
    data: any[],
    ruleIds?: string[]
  ): Promise<{
      fixedData: any[]
      fixedCount: number
      errors: string[]
    }> {
    console.log(`🔧 自动修复 ${data.length} 条 ${tableName} 数据`)

    const rules = ruleIds
      ? ruleIds.map(id => this.defaultRules.get(id)).filter(Boolean) as DataQualityRule[]
      : this.getDefaultRulesForTable(tableName)

    const autoFixableRules = rules.filter(rule => rule.enabled && rule.autoFixable)
    const fixedData = [...data]
    let fixedCount = 0
    const errors: string[] = []

    for (const rule of autoFixableRules) {
      for (let i = 0; i < fixedData.length; i++) {
        const record = fixedData[i]
        const fieldValue = record[rule.fieldName]

        if (await this.evaluateRuleCondition(rule, record, fieldValue)) {
          try {
            const fixed = await this.applyAutoFix(record, rule)
            if (fixed) {
              fixedData[i] = record
              fixedCount++
            }
          } catch (error: any) {
            errors.push(`修复记录 ${i} 时出错: ${error.message}`)
          }
        }
      }
    }

    console.log(`✅ 自动修复完成，修复了 ${fixedCount} 个问题`)
    if (errors.length > 0) {
      console.warn(`⚠️ 修复过程中出现 ${errors.length} 个错误`)
    }

    return { fixedData, fixedCount, errors }
  }

  /**
   * 应用自动修复
   */
  private async applyAutoFix(record: any, rule: DataQualityRule): Promise<boolean> {
    const fieldName = rule.fieldName
    let fixed = false

    switch (rule.suggestedFix) {
      case 'normalize':
        if (rule.ruleType === DataQualityIssueType.INVALID_FORMAT) {
          fixed = this.normalizeFieldValue(record, fieldName, rule.parameters)
        }
        break

      case 'fill_default':
        if (rule.ruleType === DataQualityIssueType.MISSING_VALUE) {
          const defaultValue = rule.parameters?.defaultValue
          if (defaultValue !== undefined) {
            record[fieldName] = defaultValue
            fixed = true
          }
        }
        break

      case 'cap_outlier':
        if (rule.ruleType === DataQualityIssueType.INVALID_RANGE) {
          const value = record[fieldName]
          const minValue = rule.parameters?.minValue
          const maxValue = rule.parameters?.maxValue

          if (typeof value === 'number') {
            if (minValue !== undefined && value < minValue) {
              record[fieldName] = minValue
              fixed = true
            } else if (maxValue !== undefined && value > maxValue) {
              record[fieldName] = maxValue
              fixed = true
            }
          }
        }
        break

      default:
        console.warn(`不支持自动修复操作: ${rule.suggestedFix}`)
    }

    return fixed
  }

  /**
   * 标准化字段值
   */
  private normalizeFieldValue(record: any, fieldName: string, parameters?: any): boolean {
    const value = record[fieldName]
    if (typeof value !== 'string') return false

    let normalizedValue = value

    if (parameters?.trim) {
      normalizedValue = normalizedValue.trim()
    }

    if (parameters?.toLowerCase) {
      normalizedValue = normalizedValue.toLowerCase()
    }

    if (parameters?.toUpperCase) {
      normalizedValue = normalizedValue.toUpperCase()
    }

    if (parameters?.removeSpaces) {
      normalizedValue = normalizedValue.replace(/\s/g, '')
    }

    if (normalizedValue !== value) {
      record[fieldName] = normalizedValue
      return true
    }

    return false
  }

  /**
   * 获取规则统计信息
   */
  getRuleStatistics(): {
    totalRules: number
    enabledRules: number
    autoFixableRules: number
    rulesByType: Record<DataQualityIssueType, number>
    rulesByTable: Record<string, number>
    rulesBySeverity: Record<IssueSeverity, number>
  } {
    const rules = this.getDefaultRules()

    const statistics = {
      totalRules: rules.length,
      enabledRules: rules.filter(r => r.enabled).length,
      autoFixableRules: rules.filter(r => r.autoFixable).length,
      rulesByType: {} as Record<DataQualityIssueType, number>,
      rulesByTable: {} as Record<string, number>,
      rulesBySeverity: {} as Record<IssueSeverity, number>
    }

    // 按类型统计
    for (const type of Object.values(DataQualityIssueType)) {
      statistics.rulesByType[type] = rules.filter(r => r.ruleType === type).length
    }

    // 按表统计
    for (const rule of rules) {
      const table = rule.tableName
      statistics.rulesByTable[table] = (statistics.rulesByTable[table] || 0) + 1
    }

    // 按严重程度统计
    for (const severity of Object.values(IssueSeverity)) {
      statistics.rulesBySeverity[severity] = rules.filter(r => r.severity === severity).length
    }

    return statistics
  }

  /**
   * 导入规则配置
   */
  importRules(rules: DataQualityRule[]): {
    imported: number
    errors: string[]
  } {
    console.log(`📥 导入 ${rules.length} 个数据质量规则`)

    let imported = 0
    const errors: string[] = []

    for (const rule of rules) {
      try {
        // 验证规则格式
        this.validateRuleFormat(rule)

        // 检查是否已存在
        if (this.defaultRules.has(rule.id)) {
          this.defaultRules.set(rule.id, {
            ...rule,
            updatedAt: new Date().toISOString()
          })
        } else {
          this.defaultRules.set(rule.id, rule)
        }

        imported++
      } catch (error: any) {
        errors.push(`规则 ${rule.name} 导入失败: ${error.message}`)
      }
    }

    console.log(`✅ 规则导入完成: 成功 ${imported} 个，失败 ${errors.length} 个`)
    return { imported, errors }
  }

  /**
   * 导出规则配置
   */
  exportRules(ruleIds?: string[]): DataQualityRule[] {
    const rules = ruleIds
      ? ruleIds.map(id => this.defaultRules.get(id)).filter(Boolean) as DataQualityRule[]
      : this.getDefaultRules()

    console.log(`📤 导出 ${rules.length} 个数据质量规则`)
    return rules
  }

  /**
   * 验证规则格式
   */
  private validateRuleFormat(rule: DataQualityRule): void {
    if (!rule.id) throw new Error('规则ID不能为空')
    if (!rule.name) throw new Error('规则名称不能为空')
    if (!rule.tableName) throw new Error('表名不能为空')
    if (!rule.ruleType) throw new Error('规则类型不能为空')
    if (!rule.severity) throw new Error('严重程度不能为空')
    if (!rule.condition) throw new Error('条件不能为空')
  }
}