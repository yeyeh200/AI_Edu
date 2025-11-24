# 预警规则实体 (AlertRule)

---

**实体编号：** DM-SYS-004
**实体名称：** 预警规则实体
**所属域：** 系统管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

预警规则实体是AI助评应用系统管理域的核心配置实体，定义了系统监控和预警的业务规则。该实体描述了预警规则的基础信息、触发条件、执行动作、处理策略等，为实时监控、异常检测、自动告警、风险控制等提供预警维度支撑。

## 实体定义

### 表名
- **物理表名：** `dim_alert_rule`
- **业务表名：** 预警规则表
- **数据类型：** 维度表

### 主要用途
- 定义预警业务规则
- 配置监控触发条件
- 设置预警执行动作
- 管理预警处理策略

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 预警规则唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| rule_code | VARCHAR | 50 | NOT NULL | '' | 规则编码（系统唯一） |
| rule_name | VARCHAR | 200 | NOT NULL | '' | 规则名称 |
| rule_alias | VARCHAR | 100 | NULL | NULL | 规则别名 |
| rule_category | ENUM | - | NOT NULL | 'SYSTEM' | 规则分类 |
| rule_type | ENUM | - | NOT NULL | 'THRESHOLD' | 规则类型 |
| rule_description | TEXT | - | NULL | NULL | 规则描述 |
| business_scenario | VARCHAR | 200 | NULL | NULL | 业务场景 |
| priority_level | ENUM | - | NOT NULL | 'MEDIUM' | 优先级别 |
| severity_level | ENUM | - | NOT NULL | 'WARNING' | 严重级别 |

### 监控配置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| monitor_target | VARCHAR | 100 | NOT NULL | '' | 监控目标 |
| monitor_object | VARCHAR | 100 | NOT NULL | '' | 监控对象 |
| monitor_metric | VARCHAR | 100 | NOT NULL | '' | 监控指标 |
| monitor_frequency | ENUM | - | NOT NULL | 'MINUTELY' | 监控频率 |
| monitor_interval | INT | 11 | NOT NULL | 5 | 监控间隔（分钟） |
| evaluation_window | INT | 11 | NULL | 0 | 评估窗口（分钟） |
| data_source | VARCHAR | 100 | NOT NULL | '' | 数据源 |
| query_statement | TEXT | - | NULL | NULL | 查询语句 |
| filter_conditions | JSON | - | NULL | NULL | 过滤条件 |

### 触发条件字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| trigger_logic | TEXT | - | NOT NULL | '' | 触发逻辑 |
| threshold_type | ENUM | - | NOT NULL | 'ABSOLUTE' | 阈值类型 |
| threshold_value | DECIMAL | 12,2 | NULL | NULL | 阈值数值 |
| threshold_min | DECIMAL | 12,2 | NULL | NULL | 最小阈值 |
| threshold_max | DECIMAL | 12,2 | NULL | NULL | 最大阈值 |
| comparison_operator | ENUM | - | NOT NULL | 'GREATER_THAN' | 比较操作符 |
| trend_analysis | ENUM | - | NULL | NULL | 趋势分析 |
| anomaly_detection | ENUM | - | NULL | NULL | 异常检测 |
| statistical_method | VARCHAR | 100 | NULL | NULL | 统计方法 |
| confidence_level | DECIMAL | 5,2 | NULL | 95.00 | 置信水平 |

### 时间条件字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| effective_time_start | DATETIME | - | NULL | NULL | 生效开始时间 |
| effective_time_end | DATETIME | - | NULL | NULL | 生效结束时间 |
| active_periods | JSON | - | NULL | NULL | 生效时段 |
| business_hours_only | TINYINT | 1 | NOT NULL | 0 | 仅工作时间 |
| weekdays_only | TINYINT | 1 | NOT NULL | 0 | 仅工作日 |
| exclude_holidays | TINYINT | 1 | NOT NULL | 0 | 排除节假日 |
| timezone | VARCHAR | 50 | NULL | 'Asia/Shanghai' | 时区 |
| seasonal_adjustment | TINYINT | 1 | NOT NULL | 0 | 季节性调整 |
| date_exclusions | JSON | - | NULL | NULL | 日期排除 |

### 执行动作字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| action_type | ENUM | - | NOT NULL | 'NOTIFICATION' | 动作类型 |
| notification_channels | JSON | - | NULL | NULL | 通知渠道 |
| notification_users | JSON | - | NULL | NULL | 通知用户 |
| notification_roles | JSON | - | NULL | NULL | 通知角色 |
| notification_template | VARCHAR | 200 | NULL | NULL | 通知模板 |
| email_recipients | JSON | - | NULL | NULL | 邮件收件人 |
| sms_recipients | JSON | - | NULL | NULL | 短信收件人 |
| webhook_endpoints | JSON | - | NULL | NULL | Webhook端点 |
| api_calls | JSON | - | NULL | NULL | API调用 |

### 动作配置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| execution_delay | INT | 11 | NULL | 0 | 执行延迟（秒） |
| retry_count | INT | 11 | NULL | 0 | 重试次数 |
| retry_interval | INT | 11 | NULL | 60 | 重试间隔（秒） |
| escalation_enabled | TINYINT | 1 | NOT NULL | 0 | 启用升级 |
| escalation_rules | JSON | - | NULL | NULL | 升级规则 |
| auto_recovery | TINYINT | 1 | NOT NULL | 0 | 自动恢复 |
| recovery_actions | JSON | - | NULL | NULL | 恢复动作 |
| max_executions_per_day | INT | 11 | NULL | 10 | 每日最大执行次数 |
| cooldown_period | INT | 11 | NULL | 300 | 冷却期（秒） |

### 抑制条件字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| suppression_enabled | TINYINT | 1 | NOT NULL | 0 | 启用抑制 |
| suppression_window | INT | 11 | NULL | 0 | 抑制窗口（分钟） |
| max_alerts_per_window | INT | 11 | NULL | 1 | 窗口最大告警数 |
| similar_alert_suppression | TINYINT | 1 | NOT NULL | 0 | 相似告警抑制 |
| dependency_suppression | TINYINT | 1 | NOT NULL | 0 | 依赖告警抑制 |
| maintenance_suppression | TINYINT | 1 | NOT NULL | 0 | 维护期抑制 |
| suppression_rules | JSON | - | NULL | NULL | 抑制规则 |
| grouping_strategy | ENUM | - | NULL | NULL | 分组策略 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| rule_status | ENUM | - | NOT NULL | 'ACTIVE' | 规则状态 |
| activation_status | ENUM | - | NULL | NULL | 激活状态 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| validation_status | ENUM | - | NULL | NULL | 验证状态 |
| last_test_time | DATETIME | - | NULL | NULL | 最后测试时间 |
| test_result | ENUM | - | NULL | NULL | 测试结果 |
| health_check_time | DATETIME | - | NULL | NULL | 健康检查时间 |
| performance_status | ENUM | - | NULL | NULL | 性能状态 |
| is_enabled | TINYINT | 1 | NOT NULL | 1 | 是否启用 |
| is_template | TINYINT | 1 | NOT NULL | 0 | 是否模板 |

### 统计分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_triggers | BIGINT | 20 | NOT NULL | 0 | 总触发次数 |
| successful_triggers | BIGINT | 20 | NOT NULL | 0 | 成功触发次数 |
| failed_triggers | BIGINT | 20 | NOT NULL | 0 | 失败触发次数 |
| suppressed_triggers | BIGINT | 20 | NOT NULL | 0 | 抑制触发次数 |
| last_trigger_time | DATETIME | - | NULL | NULL | 最后触发时间 |
| trigger_frequency | DECIMAL | 8,2 | NULL | 0.00 | 触发频率（次/天） |
| success_rate | DECIMAL | 5,2 | NULL | 0.00 | 成功率 |
| average_execution_time | DECIMAL | 8,2 | NULL | 0.00 | 平均执行时间（毫秒） |
| false_positive_rate | DECIMAL | 5,2 | NULL | 0.00 | 误报率 |

### 性能指标字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| execution_timeout | INT | 11 | NULL | 30 | 执行超时（秒） |
| resource_usage_limit | JSON | - | NULL | NULL | 资源使用限制 |
| cpu_threshold | DECIMAL | 5,2 | NULL | 80.00 | CPU阈值 |
| memory_threshold | DECIMAL | 5,2 | NULL | 80.00 | 内存阈值 |
| network_threshold | DECIMAL | 5,2 | NULL | 80.00 | 网络阈值 |
| disk_threshold | DECIMAL | 5,2 | NULL | 80.00 | 磁盘阈值 |
| performance_metrics | JSON | - | NULL | NULL | 性能指标 |
| optimization_suggestions | JSON | - | NULL | NULL | 优化建议 |

### 风险评估字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| risk_level | ENUM | - | NULL | NULL | 风险级别 |
| business_impact | ENUM | - | NULL | NULL | 业务影响 |
| compliance_requirement | VARCHAR | 200 | NULL | NULL | 合规要求 |
| audit_flag | TINYINT | 1 | NOT NULL | 0 | 审计标志 |
| security_flag | TINYINT | 1 | NOT NULL | 0 | 安全标志 |
| data_privacy_flag | TINYINT | 1 | NOT NULL | 0 | 数据隐私标志 |
| disaster_recovery | TINYINT | 1 | NOT NULL | 0 | 灾难恢复 |
| risk_mitigation | TEXT | - | NULL | NULL | 风险缓解措施 |

### 版本管理字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| version | VARCHAR | 20 | NULL | 'V1.0' | 规则版本 |
| version_description | VARCHAR | 500 | NULL | NULL | 版本描述 |
| parent_rule_id | BIGINT | 20 | NULL | NULL | 父规则ID |
| rule_history | JSON | - | NULL | NULL | 规则历史 |
| change_log | TEXT | - | NULL | NULL | 变更日志 |
| rollback_enabled | TINYINT | 1 | NOT NULL | 0 | 启用回滚 |
| rollback_version | VARCHAR | 20 | NULL | NULL | 回滚版本 |
| compatibility_check | TINYINT | 1 | NOT NULL | 1 | 兼容性检查 |

### 权限控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| owner_id | BIGINT | 20 | NOT NULL | 0 | 所有者ID |
| owner_name | VARCHAR | 100 | NOT NULL | '' | 所有者姓名 |
| maintainer_id | BIGINT | 20 | NULL | NULL | 维护人ID |
| maintainer_name | VARCHAR | 100 | NULL | NULL | 维护人姓名 |
| approver_id | BIGINT | 20 | NULL | NULL | 审批人ID |
| approver_name | VARCHAR | 100 | NULL | NULL | 审批人姓名 |
| access_permissions | JSON | - | NULL | NULL | 访问权限 |
| modification_permissions | JSON | - | NULL | NULL | 修改权限 |
| notification_permissions | JSON | - | NULL | NULL | 通知权限 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version_lock | INT | 11 | NOT NULL | 1 | 版本锁（乐观锁） |
| checksum | VARCHAR | 64 | NULL | NULL | 规则校验码 |
| external_id | VARCHAR | 100 | NULL | NULL | 外部系统ID |
| source_system | VARCHAR | 100 | NULL | NULL | 来源系统 |
| tags | JSON | - | NULL | NULL | 标签 |
| metadata | JSON | - | NULL | NULL | 元数据 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_rule_code (rule_code)
UNIQUE KEY uk_rule_name (rule_name, version)
```

### 外键约束
```sql
FOREIGN KEY (owner_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (maintainer_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (approver_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_rule_category (rule_category)
INDEX idx_rule_type (rule_type)
INDEX idx_rule_status (rule_status)
INDEX idx_priority_level (priority_level)
INDEX idx_severity_level (severity_level)
INDEX idx_monitor_target (monitor_target)
INDEX idx_monitor_metric (monitor_metric)
INDEX idx_action_type (action_type)
INDEX idx_is_enabled (is_enabled)
INDEX idx_is_template (is_template)
INDEX idx_owner_id (owner_id)
INDEX idx_create_time (create_time)
INDEX idx_last_trigger_time (last_trigger_time)
```

### 复合索引
```sql
INDEX idx_status_enabled (rule_status, is_enabled)
INDEX idx_category_status (rule_category, rule_status)
INDEX idx_priority_severity (priority_level, severity_level)
INDEX idx_owner_status (owner_id, rule_status)
INDEX idx_trigger_frequency (last_trigger_time, total_triggers)
```

### 检查约束
```sql
CHECK (rule_category IN ('SYSTEM', 'BUSINESS', 'SECURITY', 'PERFORMANCE', 'DATA_QUALITY', 'USER_ACTIVITY', 'INTEGRATION', 'COMPLIANCE'))
CHECK (rule_type IN ('THRESHOLD', 'ANOMALY', 'PATTERN', 'TREND', 'COMPOSITE', 'MACHINE_LEARNING', 'RULE_BASED', 'STATISTICAL'))
CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'))
CHECK (severity_level IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL', 'EMERGENCY'))
CHECK (monitor_frequency IN ('REAL_TIME', 'SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND'))
CHECK (threshold_type IN ('ABSOLUTE', 'PERCENTAGE', 'RATE', 'COUNT', 'DURATION', 'RATIO', 'INDEX'))
CHECK (comparison_operator IN ('GREATER_THAN', 'LESS_THAN', 'EQUAL', 'NOT_EQUAL', 'GREATER_EQUAL', 'LESS_EQUAL', 'BETWEEN', 'NOT_BETWEEN', 'CONTAINS', 'NOT_CONTAINS'))
CHECK (trend_analysis IN ('INCREASING', 'DECREASING', 'STABLE', 'VOLATILE', 'SEASONAL', 'ANOMALOUS'))
CHECK (anomaly_detection IN ('STATISTICAL', 'MACHINE_LEARNING', 'RULE_BASED', 'HYBRID', 'NONE'))
CHECK (action_type IN ('NOTIFICATION', 'EMAIL', 'SMS', 'WEBHOOK', 'API_CALL', 'AUTOMATION', 'ESCALATION', 'INCIDENT'))
CHECK (grouping_strategy IN ('NONE', 'SIMILARITY', 'TIME_WINDOW', 'SEVERITY', 'SOURCE', 'RULE_GROUP'))
CHECK (rule_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DEPRECATED', 'ARCHIVED', 'TESTING'))
CHECK (activation_status IN ('ENABLED', 'DISABLED', 'PENDING', 'ERROR'))
CHECK (approval_status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'))
CHECK (validation_status IN ('NOT_VALIDATED', 'VALIDATING', 'VALID', 'INVALID', 'ERROR'))
CHECK (test_result IN ('NOT_TESTED', 'PASSED', 'FAILED', 'ERROR', 'TIMEOUT'))
CHECK (performance_status IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL'))
CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (business_impact IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (is_enabled IN (0, 1))
CHECK (is_template IN (0, 1))
CHECK (business_hours_only IN (0, 1))
CHECK (weekdays_only IN (0, 1))
CHECK (exclude_holidays IN (0, 1))
CHECK (seasonal_adjustment IN (0, 1))
CHECK (escalation_enabled IN (0, 1))
CHECK (auto_recovery IN (0, 1))
CHECK (suppression_enabled IN (0, 1))
CHECK (similar_alert_suppression IN (0, 1))
CHECK (dependency_suppression IN (0, 1))
CHECK (maintenance_suppression IN (0, 1))
CHECK (audit_flag IN (0, 1))
CHECK (security_flag IN (0, 1))
CHECK (data_privacy_flag IN (0, 1))
CHECK (disaster_recovery IN (0, 1))
CHECK (rollback_enabled IN (0, 1))
CHECK (compatibility_check IN (0, 1))
CHECK (monitor_interval > 0)
CHECK (evaluation_window >= 0)
CHECK (execution_delay >= 0)
CHECK (retry_count >= 0)
CHECK (retry_interval > 0)
CHECK (max_executions_per_day > 0)
CHECK (cooldown_period >= 0)
CHECK (suppression_window >= 0)
CHECK (max_alerts_per_window > 0)
CHECK (execution_timeout > 0)
CHECK (confidence_level BETWEEN 0 AND 100)
CHECK (cpu_threshold BETWEEN 0 AND 100)
CHECK (memory_threshold BETWEEN 0 AND 100)
CHECK (network_threshold BETWEEN 0 AND 100)
CHECK (disk_threshold BETWEEN 0 AND 100)
CHECK (success_rate BETWEEN 0 AND 100)
CHECK (false_positive_rate BETWEEN 0 AND 100)
```

## 枚举值定义

### 规则分类 (rule_category)
| 值 | 说明 | 备注 |
|----|------|------|
| SYSTEM | 系统 | 系统级预警 |
| BUSINESS | 业务 | 业务级预警 |
| SECURITY | 安全 | 安全级预警 |
| PERFORMANCE | 性能 | 性能级预警 |
| DATA_QUALITY | 数据质量 | 数据质量预警 |
| USER_ACTIVITY | 用户活动 | 用户活动预警 |
| INTEGRATION | 集成 | 系统集成预警 |
| COMPLIANCE | 合规 | 合规性预警 |

### 规则类型 (rule_type)
| 值 | 说明 | 备注 |
|----|------|------|
| THRESHOLD | 阈值 | 基于阈值的规则 |
| ANOMALY | 异常 | 异常检测规则 |
| PATTERN | 模式 | 模式匹配规则 |
| TREND | 趋势 | 趋势分析规则 |
| COMPOSITE | 复合 | 复合条件规则 |
| MACHINE_LEARNING | 机器学习 | ML模型规则 |
| RULE_BASED | 规则引擎 | 业务规则引擎 |
| STATISTICAL | 统计 | 统计分析规则 |

### 优先级别 (priority_level)
| 值 | 说明 | 备注 |
|----|------|------|
| LOW | 低 | 低优先级 |
| MEDIUM | 中 | 中等优先级 |
| HIGH | 高 | 高优先级 |
| URGENT | 紧急 | 紧急优先级 |
| CRITICAL | 关键 | 关键优先级 |

### 严重级别 (severity_level)
| 值 | 说明 | 备注 |
|----|------|------|
| INFO | 信息 | 信息级别 |
| WARNING | 警告 | 警告级别 |
| ERROR | 错误 | 错误级别 |
| CRITICAL | 严重 | 严重级别 |
| EMERGENCY | 紧急 | 紧急级别 |

### 动作类型 (action_type)
| 值 | 说明 | 备注 |
|----|------|------|
| NOTIFICATION | 通知 | 发送通知 |
| EMAIL | 邮件 | 发送邮件 |
| SMS | 短信 | 发送短信 |
| WEBHOOK | Webhook | 调用Webhook |
| API_CALL | API调用 | 调用API接口 |
| AUTOMATION | 自动化 | 执行自动化 |
| ESCALATION | 升级 | 升级处理 |
| INCIDENT | 事件 | 创建事件 |

## 关联关系

### 多对一关系（作为从表）
- **AlertRule → User（owner）**：预警规则属于所有者
- **AlertRule → User（maintainer）**：预警规则有关联维护人
- **AlertRule → User（approver）**：预警规则有审批人
- **AlertRule → User（creator）**：预警规则关联创建人
- **AlertRule → User（updater）**：预警规则关联更新人

### 一对多关系（作为主表）
- **AlertRule → AlertRecord**：一个规则产生多个预警记录
- **AlertRule → AlertExecution**：一个规则有多次执行记录
- **AlertRule → AlertSuppression**：一个规则有多个抑制记录

### 多对多关系
- **AlertRule ↔ User（notifications）**：通过中间表关联通知用户
- **AlertRule ↔ AlertTemplate**：通过中间表关联预警模板

## 使用示例

### 查询示例

#### 1. 查询活跃的预警规则
```sql
SELECT
    r.rule_code,
    r.rule_name,
    r.rule_category,
    r.rule_type,
    r.monitor_target,
    r.monitor_metric,
    r.priority_level,
    r.severity_level,
    r.action_type,
    r.rule_status,
    r.total_triggers,
    r.successful_triggers,
    r.success_rate,
    r.last_trigger_time,
    r.owner_name
FROM dim_alert_rule r
WHERE r.is_enabled = 1
  AND r.rule_status = 'ACTIVE'
  AND r.activation_status = 'ENABLED'
ORDER BY r.priority_level DESC, r.severity_level DESC;
```

#### 2. 查询高触发频率的规则
```sql
SELECT
    r.rule_name,
    r.rule_category,
    r.monitor_target,
    r.monitor_metric,
    r.total_triggers,
    r.successful_triggers,
    r.failed_triggers,
    r.trigger_frequency,
    r.success_rate,
    r.false_positive_rate,
    r.last_trigger_time,
    r.average_execution_time,
    CASE
        WHEN r.trigger_frequency > 100 THEN 'HIGH_FREQUENCY'
        WHEN r.trigger_frequency > 10 THEN 'MEDIUM_FREQUENCY'
        ELSE 'LOW_FREQUENCY'
    END as frequency_level
FROM dim_alert_rule r
WHERE r.total_triggers > 0
  AND r.is_enabled = 1
ORDER BY r.trigger_frequency DESC, r.total_triggers DESC;
```

#### 3. 查询性能问题规则
```sql
SELECT
    r.rule_name,
    r.monitor_target,
    r.average_execution_time,
    r.success_rate,
    r.failed_triggers,
    r.performance_status,
    r.execution_timeout,
    r.cpu_threshold,
    r.memory_threshold,
    r.optimization_suggestions,
    r.last_test_time,
    r.test_result
FROM dim_alert_rule r
WHERE r.performance_status IN ('POOR', 'CRITICAL')
  OR r.success_rate < 90
  OR r.average_execution_time > 1000
ORDER BY r.average_execution_time DESC, r.success_rate ASC;
```

#### 4. 查询特定目标的预警规则
```sql
SELECT
    r.rule_code,
    r.rule_name,
    r.rule_category,
    r.monitor_metric,
    r.threshold_type,
    r.threshold_value,
    r.comparison_operator,
    r.monitor_frequency,
    r.action_type,
    r.notification_channels,
    r.escalation_enabled,
    r.suppression_enabled,
    r.rule_status
FROM dim_alert_rule r
WHERE r.monitor_target = 'SYSTEM_PERFORMANCE'
  AND r.is_enabled = 1
  AND r.rule_status = 'ACTIVE'
ORDER BY r.priority_level DESC, r.monitor_frequency ASC;
```

#### 5. 查询需要审批的规则
```sql
SELECT
    r.rule_name,
    r.rule_category,
    r.rule_status,
    r.approval_status,
    r.owner_name,
    r.approver_name,
    r.version,
    r.create_time,
    r.update_time,
    r.version_description,
    r.change_log
FROM dim_alert_rule r
WHERE r.approval_status IN ('DRAFT', 'PENDING', 'REJECTED')
  OR r.rule_status = 'TESTING'
ORDER BY r.create_time DESC;
```

### 插入示例

#### 1. 创建系统性能预警规则
```sql
INSERT INTO dim_alert_rule (
    rule_code, rule_name, rule_category, rule_type,
    rule_description, priority_level, severity_level,
    monitor_target, monitor_metric, monitor_frequency,
    monitor_interval, data_source,
    trigger_logic, threshold_type, threshold_value,
    comparison_operator, action_type,
    notification_channels, notification_users,
    rule_status, is_enabled,
    owner_id, owner_name,
    create_by
) VALUES (
    'SYS_PERF_CPU_HIGH', '系统CPU使用率过高预警', 'SYSTEM', 'THRESHOLD',
    '当系统CPU使用率超过阈值时发送预警通知', 'HIGH', 'ERROR',
    'SYSTEM_PERFORMANCE', 'cpu_usage_percent', 'MINUTELY',
    1, 'system_monitoring',
    'cpu_usage_percent > threshold_value', 'PERCENTAGE', 80.00,
    'GREATER_THAN', 'NOTIFICATION',
    '["email", "sms"]', '[10001, 10002]',
    'ACTIVE', 1,
    10001, '系统管理员',
    10001
);
```

#### 2. 创建数据质量预警规则
```sql
INSERT INTO dim_alert_rule (
    rule_code, rule_name, rule_category, rule_type,
    monitor_target, monitor_object, monitor_metric,
    threshold_type, threshold_value,
    trigger_logic, action_type,
    email_recipients, escalation_enabled,
    rule_status, priority_level,
    owner_id, create_by
) VALUES (
    'DATA_QUALITY_INTEGRITY', '数据完整性检查预警', 'DATA_QUALITY', 'STATISTICAL',
    'DATABASE_INTEGRITY', 'user_data', 'missing_data_rate',
    'PERCENTAGE', 5.00,
    'missing_data_rate > threshold_value', 'EMAIL',
    '["data-admin@company.com", "dba@company.com"]', 1,
    'ACTIVE', 'HIGH',
    10002, 10002
);
```

### 更新示例

#### 1. 更新规则触发统计
```sql
UPDATE dim_alert_rule
SET total_triggers = total_triggers + 1,
    successful_triggers = successful_triggers + 1,
    last_trigger_time = NOW(),
    trigger_frequency = ROUND((total_triggers + 1) / DATEDIFF(NOW(), create_time), 2),
    success_rate = ROUND((successful_triggers + 1) * 100.0 / (total_triggers + 1), 2),
    average_execution_time = ROUND((average_execution_time * total_triggers + 150) / (total_triggers + 1), 2),
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE rule_code = 'SYS_PERF_CPU_HIGH'
  AND id = 1001;
```

#### 2. 更新规则状态
```sql
UPDATE dim_alert_rule
SET rule_status = 'SUSPENDED',
    activation_status = 'DISABLED',
    is_enabled = 0,
    approval_status = 'PENDING',
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE rule_code = 'DATA_QUALITY_INTEGRITY'
  AND rule_status = 'ACTIVE';
```

#### 3. 更新性能指标
```sql
UPDATE dim_alert_rule
SET average_execution_time = 85.60,
    success_rate = 98.50,
    failed_triggers = 2,
    false_positive_rate = 3.20,
    performance_status = 'EXCELLENT',
    performance_metrics = JSON_OBJECT(
        'avg_response_time', 85.6,
        'max_response_time', 320.5,
        'min_response_time', 12.3,
        'throughput_per_minute', 45.2
    ),
    optimization_suggestions = JSON_ARRAY(
        '考虑增加监控频率以提高响应速度',
        '当前性能表现优秀，保持现有配置'
    ),
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE id = 1001
  AND rule_status = 'ACTIVE';
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：规则编码、名称+版本必须唯一
2. **完整性检查**：基础信息、触发条件等关键字段不能为空
3. **逻辑检查**：阈值范围合理，优先级与严重性匹配
4. **关联检查**：所有者、维护人ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的预警规则
2. **阈值修正**：修正不合理的阈值设置
3. **状态同步**：同步规则状态和激活状态
4. **权限更新**：更新权限配置信息

## 性能优化

### 索引优化
- 规则编码建立唯一索引
- 状态和启用标志建立复合索引
- 监控目标和指标建立复合索引

### 查询优化
- 使用覆盖索引优化规则查询
- 按状态和优先级分区存储
- 合理使用状态和时间过滤

### 存储优化
- JSON配置字段压缩存储
- 历史执行数据归档
- 定期清理无效规则

## 安全考虑

### 数据保护
- 预警规则配置加密存储
- 敏感通知信息保护
- 权限配置信息访问控制

### 权限控制
- 规则创建需要管理员权限
- 规则修改需要所有者权限
- 生产环境规则需要审批权限

## 扩展说明

### 未来扩展方向
1. **AI增强**：基于机器学习的智能规则生成
2. **动态调整**：基于运行数据的参数自动调整
3. **规则链**：复杂业务规则的链式组合
4. **可视化配置**：图形化规则配置界面

### 兼容性说明
- 支持多种监控系统接入
- 支持标准化预警协议
- 支持第三方告警平台集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*