# 预警记录实体 (AlertRecord)

---

**实体编号：** DM-SYS-005
**实体名称：** 预警记录实体
**所属域：** 系统管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

预警记录实体是AI助评应用系统管理域的核心事实实体，定义了预警系统产生的详细告警记录。该实体描述了预警记录的基础信息、触发条件、执行过程、处理结果等，为告警监控、问题追踪、故障分析、应急处理等提供预警记录维度支撑。

## 实体定义

### 表名
- **物理表名：** `dwd_alert_record`
- **业务表名：** 预警记录表
- **数据类型：** 事实表

### 主要用途
- 记录预警触发详情
- 追踪告警处理过程
- 分析预警效果数据
- 支持故障溯源分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 预警记录唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| alert_id | VARCHAR | 50 | NOT NULL | '' | 预警ID（系统唯一） |
| alert_batch_id | VARCHAR | 50 | NULL | NULL | 预警批次ID |
| rule_id | BIGINT | 20 | NOT NULL | 0 | 关联规则ID |
| rule_code | VARCHAR | 50 | NOT NULL | '' | 规则编码 |
| rule_name | VARCHAR | 200 | NOT NULL | '' | 规则名称 |
| alert_type | ENUM | - | NOT NULL | 'SYSTEM' | 预警类型 |
| alert_category | ENUM | - | NOT NULL | 'WARNING' | 预警分类 |
| severity_level | ENUM | - | NOT NULL | 'WARNING' | 严重级别 |
| priority_level | ENUM | - | NOT NULL | 'MEDIUM' | 优先级别 |

### 触发信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| trigger_source | VARCHAR | 100 | NOT NULL | '' | 触发源 |
| trigger_target | VARCHAR | 100 | NOT NULL | '' | 触发目标 |
| trigger_object | VARCHAR | 100 | NULL | NULL | 触发对象 |
| trigger_metric | VARCHAR | 100 | NOT NULL | '' | 触发指标 |
| current_value | DECIMAL | 12,2 | NULL | NULL | 当前值 |
| threshold_value | DECIMAL | 12,2 | NULL | NULL | 阈值 |
| trigger_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 触发时间 |
| trigger_logic | TEXT | - | NULL | NULL | 触发逻辑 |
| trigger_conditions | JSON | - | NULL | NULL | 触发条件 |
| data_source | VARCHAR | 100 | NULL | NULL | 数据源 |
| raw_data | JSON | - | NULL | NULL | 原始数据 |

### 状态演进字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| alert_status | ENUM | - | NOT NULL | 'NEW' | 预警状态 |
| processing_status | ENUM | - | NULL | NULL | 处理状态 |
| resolution_status | ENUM | - | NULL | NULL | 解决状态 |
| acknowledgement_status | ENUM | - | NULL | NULL | 确认状态 |
| escalation_status | ENUM | - | NULL | NULL | 升级状态 |
| suppression_status | ENUM | - | NULL | NULL | 抑制状态 |
| lifecycle_stage | ENUM | - | NULL | NULL | 生命周期阶段 |
| status_change_history | JSON | - | NULL | NULL | 状态变更历史 |

### 执行过程字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| execution_start_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 执行开始时间 |
| execution_end_time | DATETIME | - | NULL | NULL | 执行结束时间 |
| execution_duration | INT | 11 | NULL | 0 | 执行时长（毫秒） |
| execution_result | ENUM | - | NULL | NULL | 执行结果 |
| actions_taken | JSON | - | NULL | NULL | 已执行动作 |
| notification_sent | TINYINT | 1 | NULL | 0 | 通知已发送 |
| notifications_count | INT | 11 | NULL | 0 | 通知次数 |
| escalation_triggered | TINYINT | 1 | NULL | 0 | 升级已触发 |
| auto_actions_executed | TINYINT | 1 | NULL | 0 | 自动动作已执行 |

### 处理信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| assigned_to_id | BIGINT | 20 | NULL | NULL | 分配给ID |
| assigned_to_name | VARCHAR | 100 | NULL | NULL | 分配给姓名 |
| handler_id | BIGINT | 20 | NULL | NULL | 处理人ID |
| handler_name | VARCHAR | 100 | NULL | NULL | 处理人姓名 |
| first_ack_time | DATETIME | - | NULL | NULL | 首次确认时间 |
| response_time | INT | 11 | NULL | 0 | 响应时间（秒） |
| resolution_time | DATETIME | - | NULL | NULL | 解决时间 |
| resolution_duration | INT | 11 | NULL | 0 | 解决时长（分钟） |
| impact_assessment | TEXT | - | NULL | NULL | 影响评估 |
| root_cause_analysis | TEXT | - | NULL | NULL | 根因分析 |

### 通知记录字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| notification_channels | JSON | - | NULL | NULL | 通知渠道 |
| notification_recipients | JSON | - | NULL | NULL | 通知接收人 |
| notification_details | JSON | - | NULL | NULL | 通知详情 |
| email_notifications | JSON | - | NULL | NULL | 邮件通知记录 |
| sms_notifications | JSON | - | NULL | NULL | 短信通知记录 |
| webhook_calls | JSON | - | NULL | NULL | Webhook调用记录 |
| api_notifications | JSON | - | NULL | NULL | API通知记录 |
| notification_failures | JSON | - | NULL | NULL | 通知失败记录 |

### 影响评估字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| business_impact | ENUM | - | NULL | NULL | 业务影响 |
| affected_systems | JSON | - | NULL | NULL | 影响系统 |
| affected_services | JSON | - | NULL | NULL | 影响服务 |
| affected_users | BIGINT | 20 | NULL | 0 | 影响用户数 |
| affected_transactions | BIGINT | 20 | NULL | 0 | 影响交易数 |
| financial_impact | DECIMAL | 12,2 | NULL | 0.00 | 财务影响 |
| sla_impact | ENUM | - | NULL | NULL | SLA影响 |
| compliance_impact | ENUM | - | NULL | NULL | 合规影响 |
| risk_level | ENUM | - | NULL | NULL | 风险级别 |

### 关联分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| related_alerts | JSON | - | NULL | NULL | 关联预警 |
| parent_alert_id | VARCHAR | 50 | NULL | NULL | 父预警ID |
| child_alerts | JSON | - | NULL | NULL | 子预警 |
| similar_alerts | JSON | - | NULL | NULL | 相似预警 |
| duplicate_alerts | JSON | - | NULL | NULL | 重复预警 |
| correlation_group | VARCHAR | 100 | NULL | NULL | 关联分组 |
| correlation_score | DECIMAL | 5,2 | NULL | 0.00 | 关联评分 |
| incident_id | VARCHAR | 50 | NULL | NULL | 关联事件ID |

### 抑制信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| is_suppressed | TINYINT | 1 | NOT NULL | 0 | 是否被抑制 |
| suppression_reason | VARCHAR | 500 | NULL | NULL | 抑制原因 |
| suppression_rule | VARCHAR | 100 | NULL | NULL | 抑制规则 |
| suppression_start_time | DATETIME | - | NULL | NULL | 抑制开始时间 |
| suppression_end_time | DATETIME | - | NULL | NULL | 抑制结束时间 |
| suppression_duration | INT | 11 | NULL | 0 | 抑制时长（分钟） |
| manual_suppression | TINYINT | 1 | NOT NULL | 0 | 手动抑制 |
| auto_suppression | TINYINT | 1 | NOT NULL | 0 | 自动抑制 |
| suppression_authority | VARCHAR | 100 | NULL | NULL | 抑制权限 |

### 升级处理字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| escalation_level | INT | 11 | NULL | 0 | 升级级别 |
| max_escalation_level | INT | 11 | NULL | 0 | 最大升级级别 |
| escalation_time | DATETIME | - | NULL | NULL | 升级时间 |
| escalation_rules_applied | JSON | - | NULL | NULL | 应用的升级规则 |
| escalated_to | JSON | - | NULL | NULL | 升级到 |
| escalation_actions | JSON | - | NULL | NULL | 升级动作 |
| escalation_results | JSON | - | NULL | NULL | 升级结果 |
| escalation_approval | ENUM | - | NULL | NULL | 升级审批 |

### 质量评估字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| alert_quality_score | DECIMAL | 5,2 | NULL | 0.00 | 预警质量评分 |
| is_false_positive | TINYINT | 1 | NOT NULL | 0 | 是否误报 |
| false_positive_reason | VARCHAR | 500 | NULL | NULL | 误报原因 |
| accuracy_rating | ENUM | - | NULL | NULL | 准确性评级 |
| relevance_rating | ENUM | - | NULL | NULL | 相关性评级 |
| timeliness_rating | ENUM | - | NULL | NULL | 及时性评级 |
| effectiveness_rating | ENUM | - | NULL | NULL | 有效性评级 |
| user_feedback | TEXT | - | NULL | NULL | 用户反馈 |
| feedback_score | DECIMAL | 5,2 | NULL | 0.00 | 反馈评分 |

### 上下文信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| system_context | JSON | - | NULL | NULL | 系统上下文 |
| business_context | JSON | - | NULL | NULL | 业务上下文 |
| environment_context | ENUM | - | NULL | NULL | 环境上下文 |
| time_context | JSON | - | NULL | NULL | 时间上下文 |
| historical_data | JSON | - | NULL | NULL | 历史数据 |
| trend_analysis | JSON | - | NULL | NULL | 趋势分析 |
| predictive_data | JSON | - | NULL | NULL | 预测数据 |
| anomaly_indicators | JSON | - | NULL | NULL | 异常指标 |

### 事件关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| event_type | VARCHAR | 100 | NULL | NULL | 事件类型 |
| event_category | VARCHAR | 100 | NULL | NULL | 事件分类 |
| incident_created | TINYINT | 1 | NOT NULL | 0 | 事件已创建 |
| incident_id | VARCHAR | 50 | NULL | NULL | 事件ID |
| incident_severity | ENUM | - | NULL | NULL | 事件严重性 |
| incident_priority | ENUM | - | NULL | NULL | 事件优先级 |
| incident_status | ENUM | - | NULL | NULL | 事件状态 |
| incident_resolution | TEXT | - | NULL | NULL | 事件解决方案 |

### 学习分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| ml_model_score | DECIMAL | 5,2 | NULL | 0.00 | ML模型评分 |
| pattern_recognition | JSON | - | NULL | NULL | 模式识别 |
| anomaly_detection_result | JSON | - | NULL | NULL | 异常检测结果 |
| prediction_accuracy | DECIMAL | 5,2 | NULL | 0.00 | 预测准确性 |
| learning_feedback | JSON | - | NULL | NULL | 学习反馈 |
| model_version | VARCHAR | 50 | NULL | NULL | 模型版本 |
| confidence_level | DECIMAL | 5,2 | NULL | 0.00 | 置信水平 |
| probability_score | DECIMAL | 5,2 | NULL | 0.00 | 概率评分 |

### 审计追踪字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| audit_trail | JSON | - | NULL | NULL | 审计跟踪 |
| access_log | JSON | - | NULL | NULL | 访问日志 |
| modification_history | JSON | - | NULL | NULL | 修改历史 |
| compliance_check | ENUM | - | NULL | NULL | 合规检查 |
| regulatory_flag | TINYINT | 1 | NOT NULL | 0 | 监管标志 |
| data_retention_policy | ENUM | - | NULL | NULL | 数据保留策略 |
| archive_status | ENUM | - | NULL | NULL | 归档状态 |
| purge_date | DATE | - | NULL | NULL | 清除日期 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version_lock | INT | 11 | NOT NULL | 1 | 版本锁（乐观锁） |
| checksum | VARCHAR | 64 | NULL | NULL | 数据校验码 |
| external_system_id | VARCHAR | 100 | NULL | NULL | 外部系统ID |
| source_system | VARCHAR | 100 | NULL | NULL | 来源系统 |
| correlation_id | VARCHAR | 100 | NULL | NULL | 关联ID |
| tags | JSON | - | NULL | NULL | 标签 |
| metadata | JSON | - | NULL | NULL | 元数据 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_alert_id (alert_id)
```

### 外键约束
```sql
FOREIGN KEY (rule_id) REFERENCES dim_alert_rule(id) ON DELETE CASCADE
FOREIGN KEY (assigned_to_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (handler_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_rule_id (rule_id)
INDEX idx_rule_code (rule_code)
INDEX idx_alert_type (alert_type)
INDEX idx_alert_category (alert_category)
INDEX idx_severity_level (severity_level)
INDEX idx_priority_level (priority_level)
INDEX idx_alert_status (alert_status)
INDEX idx_processing_status (processing_status)
INDEX idx_trigger_source (trigger_source)
INDEX idx_trigger_time (trigger_time)
INDEX idx_handler_id (handler_id)
INDEX idx_assigned_to_id (assigned_to_id)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_status_severity (alert_status, severity_level)
INDEX idx_rule_status (rule_id, alert_status)
INDEX idx_time_status (trigger_time, alert_status)
INDEX idx_handler_time (handler_id, response_time)
INDEX idx_impact_severity (business_impact, severity_level)
```

### 分区索引
```sql
-- 按月分区索引
INDEX idx_monthly_trigger (YEAR(trigger_time), MONTH(trigger_time), alert_status)
```

### 检查约束
```sql
CHECK (alert_type IN ('SYSTEM', 'BUSINESS', 'SECURITY', 'PERFORMANCE', 'DATA_QUALITY', 'USER_ACTIVITY', 'INTEGRATION', 'COMPLIANCE'))
CHECK (alert_category IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL', 'EMERGENCY'))
CHECK (severity_level IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL', 'EMERGENCY'))
CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'))
CHECK (alert_status IN ('NEW', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED', 'SUPPRESSED'))
CHECK (processing_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'TIMEOUT', 'CANCELLED'))
CHECK (resolution_status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED', 'ESCALATED'))
CHECK (acknowledgement_status IN ('NOT_ACKNOWLEDGED', 'ACKNOWLEDGED', 'AUTO_ACKNOWLEDGED'))
CHECK (escalation_status IN ('NOT_ESCALATED', 'ESCALATED', 'ESCALATION_COMPLETE'))
CHECK (suppression_status IN ('NOT_SUPPRESSED', 'SUPPRESSED', 'SUPPRESSION_EXPIRED'))
CHECK (lifecycle_stage IN ('DETECTION', 'NOTIFICATION', 'ACKNOWLEDGMENT', 'INVESTIGATION', 'RESOLUTION', 'RECOVERY', 'CLOSED'))
CHECK (execution_result IN ('SUCCESS', 'PARTIAL_SUCCESS', 'FAILURE', 'TIMEOUT', 'CANCELLED'))
CHECK (business_impact IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (sla_impact IN ('NO_IMPACT', 'MINOR', 'MAJOR', 'CRITICAL'))
CHECK (compliance_impact IN ('NO_IMPACT', 'MINOR', 'MAJOR', 'CRITICAL'))
CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (environment_context IN ('PRODUCTION', 'STAGING', 'TESTING', 'DEVELOPMENT'))
CHECK (incident_severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (incident_priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'))
CHECK (incident_status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'MONITORING'))
CHECK (accuracy_rating IN ('POOR', 'FAIR', 'GOOD', 'EXCELLENT'))
CHECK (relevance_rating IN ('POOR', 'FAIR', 'GOOD', 'EXCELLENT'))
CHECK (timeliness_rating IN ('POOR', 'FAIR', 'GOOD', 'EXCELLENT'))
CHECK (effectiveness_rating IN ('POOR', 'FAIR', 'GOOD', 'EXCELLENT'))
CHECK (compliance_check IN ('COMPLIANT', 'NON_COMPLIANT', 'PENDING'))
CHECK (data_retention_policy IN ('STANDARD', 'EXTENDED', 'PERMANENT', 'REGULATORY'))
CHECK (archive_status IN ('ACTIVE', 'ARCHIVED', 'PURGED'))
CHECK (is_suppressed IN (0, 1))
CHECK (notification_sent IN (0, 1))
CHECK (escalation_triggered IN (0, 1))
CHECK (auto_actions_executed IN (0, 1))
CHECK (is_false_positive IN (0, 1))
CHECK (manual_suppression IN (0, 1))
CHECK (auto_suppression IN (0, 1))
CHECK (incident_created IN (0, 1))
CHECK (regulatory_flag IN (0, 1))
CHECK (execution_duration >= 0)
CHECK (notifications_count >= 0)
CHECK (response_time >= 0)
CHECK (resolution_duration >= 0)
CHECK (affected_users >= 0)
CHECK (affected_transactions >= 0)
CHECK (escalation_level >= 0)
CHECK (max_escalation_level >= 0)
CHECK (suppression_duration >= 0)
CHECK (alert_quality_score BETWEEN 0 AND 100)
CHECK (ml_model_score BETWEEN 0 AND 100)
CHECK (confidence_level BETWEEN 0 AND 100)
CHECK (probability_score BETWEEN 0 AND 100)
```

## 枚举值定义

### 预警状态 (alert_status)
| 值 | 说明 | 备注 |
|----|------|------|
| NEW | 新建 | 新创建的预警 |
| ACKNOWLEDGED | 已确认 | 已确认收到预警 |
| ASSIGNED | 已分配 | 已分配处理人 |
| IN_PROGRESS | 处理中 | 正在处理中 |
| RESOLVED | 已解决 | 问题已解决 |
| CLOSED | 已关闭 | 预警已关闭 |
| ESCALATED | 已升级 | 已升级处理 |
| SUPPRESSED | 已抑制 | 预警被抑制 |

### 处理状态 (processing_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PENDING | 待处理 | 等待处理 |
| PROCESSING | 处理中 | 正在处理 |
| COMPLETED | 已完成 | 处理完成 |
| FAILED | 失败 | 处理失败 |
| TIMEOUT | 超时 | 处理超时 |
| CANCELLED | 已取消 | 处理取消 |

### 解决状态 (resolution_status)
| 值 | 说明 | 备注 |
|----|------|------|
| OPEN | 开放 | 尚未解决 |
| IN_PROGRESS | 进行中 | 解决中 |
| RESOLVED | 已解决 | 问题已解决 |
| CLOSED | 已关闭 | 已关闭处理 |
| REOPENED | 重新开放 | 重新打开 |
| ESCALATED | 已升级 | 升级处理 |

### 严重级别 (severity_level)
| 值 | 说明 | 备注 |
|----|------|------|
| INFO | 信息 | 信息级别 |
| WARNING | 警告 | 警告级别 |
| ERROR | 错误 | 错误级别 |
| CRITICAL | 严重 | 严重级别 |
| EMERGENCY | 紧急 | 紧急级别 |

### 业务影响 (business_impact)
| 值 | 说明 | 备注 |
|----|------|------|
| LOW | 低 | 低影响 |
| MEDIUM | 中 | 中等影响 |
| HIGH | 高 | 高影响 |
| CRITICAL | 关键 | 关键影响 |

## 关联关系

### 多对一关系（作为从表）
- **AlertRecord → AlertRule**：预警记录关联规则
- **AlertRecord → User（assigned_to）**：预警记录分配给用户
- **AlertRecord → User（handler）**：预警记录由用户处理
- **AlertRecord → User（creator）**：预警记录创建者
- **AlertRecord → User（updater）**：预警记录更新者

### 一对多关系（作为主表）
- **AlertRecord → AlertNotification**：一个预警记录有多个通知记录
- **AlertRecord → AlertAction**：一个预警记录有多个执行动作
- **AlertRecord → AlertComment**：一个预警记录有多个评论

### 多对多关系
- **AlertRecord ↔ Incident**：通过中间表关联事件
- **AlertRecord ↔ Asset**：通过中间表关联资产

## 使用示例

### 查询示例

#### 1. 查询活跃的预警记录
```sql
SELECT
    a.alert_id,
    a.rule_name,
    a.alert_category,
    a.severity_level,
    a.priority_level,
    a.alert_status,
    a.trigger_source,
    a.trigger_metric,
    a.current_value,
    a.threshold_value,
    a.trigger_time,
    a.assigned_to_name,
    a.handler_name,
    a.response_time,
    a.resolution_duration,
    CASE
        WHEN a.alert_status = 'NEW' THEN '待处理'
        WHEN a.alert_status = 'IN_PROGRESS' THEN '处理中'
        WHEN a.alert_status = 'RESOLVED' THEN '已解决'
        ELSE a.alert_status
    END as status_description
FROM dwd_alert_record a
WHERE a.alert_status IN ('NEW', 'ASSIGNED', 'IN_PROGRESS')
  AND a.suppression_status != 'SUPPRESSED'
ORDER BY a.severity_level DESC, a.trigger_time DESC;
```

#### 2. 查询高严重性预警
```sql
SELECT
    a.alert_id,
    a.rule_name,
    a.alert_category,
    a.severity_level,
    a.business_impact,
    a.trigger_time,
    a.execution_duration,
    a.response_time,
    a.affected_systems,
    a.affected_users,
    a.financial_impact,
    a.sla_impact,
    a.handler_name,
    a.resolution_status
FROM dwd_alert_record a
WHERE a.severity_level IN ('CRITICAL', 'EMERGENCY')
  AND a.alert_status != 'CLOSED'
ORDER BY a.severity_level DESC, a.business_impact DESC, a.trigger_time ASC;
```

#### 3. 查询预警处理效率分析
```sql
SELECT
    a.rule_name,
    COUNT(*) as alert_count,
    AVG(a.response_time) as avg_response_time,
    AVG(a.resolution_duration) as avg_resolution_time,
    MAX(a.response_time) as max_response_time,
    MAX(a.resolution_duration) as max_resolution_time,
    SUM(CASE WHEN a.alert_status = 'RESOLVED' THEN 1 ELSE 0 END) as resolved_count,
    SUM(CASE WHEN a.is_false_positive = 1 THEN 1 ELSE 0 END) as false_positive_count,
    AVG(a.alert_quality_score) as avg_quality_score
FROM dwd_alert_record a
WHERE a.trigger_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY a.rule_name
ORDER BY alert_count DESC, avg_response_time ASC;
```

#### 4. 查询预警质量分析
```sql
SELECT
    a.alert_category,
    a.severity_level,
    COUNT(*) as total_alerts,
    SUM(CASE WHEN a.is_false_positive = 0 THEN 1 ELSE 0 END) as valid_alerts,
    SUM(CASE WHEN a.is_false_positive = 1 THEN 1 ELSE 0 END) as false_alerts,
    ROUND(SUM(CASE WHEN a.is_false_positive = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as false_positive_rate,
    AVG(a.alert_quality_score) as avg_quality_score,
    AVG(a.feedback_score) as avg_feedback_score,
    a.accuracy_rating
FROM dwd_alert_record a
WHERE a.trigger_time >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY a.alert_category, a.severity_level
ORDER BY total_alerts DESC, false_positive_rate ASC;
```

#### 5. 查询预警趋势分析
```sql
SELECT
    DATE(a.trigger_time) as alert_date,
    COUNT(*) as daily_alert_count,
    SUM(CASE WHEN a.severity_level = 'CRITICAL' THEN 1 ELSE 0 END) as critical_alerts,
    SUM(CASE WHEN a.severity_level = 'ERROR' THEN 1 ELSE 0 END) as error_alerts,
    SUM(CASE WHEN a.severity_level = 'WARNING' THEN 1 ELSE 0 END) as warning_alerts,
    AVG(a.execution_duration) as avg_execution_time,
    AVG(a.alert_quality_score) as avg_quality_score
FROM dwd_alert_record a
WHERE a.trigger_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(a.trigger_time)
ORDER BY alert_date DESC;
```

### 插入示例

#### 1. 创建系统性能预警记录
```sql
INSERT INTO dwd_alert_record (
    alert_id, rule_id, rule_code, rule_name,
    alert_type, alert_category, severity_level, priority_level,
    trigger_source, trigger_target, trigger_metric,
    current_value, threshold_value,
    trigger_time, trigger_logic,
    data_source, raw_data,
    alert_status, notification_sent,
    create_time, create_by
) VALUES (
    'ALT202401230001', 1001, 'SYS_PERF_CPU_HIGH', '系统CPU使用率过高预警',
    'SYSTEM', 'ERROR', 'ERROR', 'HIGH',
    'SYSTEM_MONITOR', 'SERVER_A', 'cpu_usage_percent',
    85.60, 80.00,
    NOW(), 'cpu_usage_percent > threshold_value',
    'system_monitoring', '{"cpu": 85.6, "memory": 45.2, "disk": 67.8}',
    'NEW', 1,
    NOW(), 10001
);
```

#### 2. 创建数据质量预警记录
```sql
INSERT INTO dwd_alert_record (
    alert_id, rule_id, rule_code, rule_name,
    alert_type, alert_category, severity_level,
    trigger_source, trigger_object, trigger_metric,
    current_value, threshold_value,
    trigger_time, trigger_conditions,
    alert_status, business_impact,
    create_by
) VALUES (
    'ALT202401230002', 1002, 'DATA_QUALITY_INTEGRITY', '数据完整性检查预警',
    'DATA_QUALITY', 'WARNING', 'WARNING',
    'DATA_VALIDATION', 'user_table', 'missing_data_rate',
    6.50, 5.00,
    NOW(), '{"missing_rate": 6.5, "total_records": 10000}',
    'NEW', 'MEDIUM',
    10002
);
```

### 更新示例

#### 1. 更新预警处理状态
```sql
UPDATE dwd_alert_record
SET alert_status = 'ASSIGNED',
    processing_status = 'PROCESSING',
    acknowledgement_status = 'ACKNOWLEDGED',
    assigned_to_id = 20001,
    assigned_to_name = '张工程师',
    handler_id = 20001,
    handler_name = '张工程师',
    first_ack_time = NOW(),
    response_time = TIMESTAMPDIFF(SECOND, trigger_time, NOW()),
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE alert_id = 'ALT202401230001'
  AND alert_status = 'NEW';
```

#### 2. 更新预警解决状态
```sql
UPDATE dwd_alert_record
SET alert_status = 'RESOLVED',
    processing_status = 'COMPLETED',
    resolution_status = 'RESOLVED',
    resolution_time = NOW(),
    resolution_duration = TIMESTAMPDIFF(MINUTE, trigger_time, NOW()),
    impact_assessment = 'CPU使用率已恢复正常，系统性能稳定',
    root_cause_analysis = '系统负载过高，已优化资源配置',
    alert_quality_score = 95.50,
    is_false_positive = 0,
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE alert_id = 'ALT202401230001'
  AND alert_status = 'IN_PROGRESS';
```

#### 3. 更新预警执行结果
```sql
UPDATE dwd_alert_record
SET execution_end_time = NOW(),
    execution_duration = 1500,
    execution_result = 'SUCCESS',
    actions_taken = JSON_ARRAY('发送邮件通知', '创建事件工单'),
    notification_sent = 1,
    notifications_count = 3,
    notification_details = JSON_OBJECT(
        'email_sent', 2,
        'sms_sent', 1,
        'webhook_calls', 0
    ),
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE alert_id = 'ALT202401230001'
  AND execution_end_time IS NULL;
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：预警ID必须唯一
2. **完整性检查**：基础信息、触发条件等关键字段不能为空
3. **逻辑检查**：时间逻辑合理，状态流转正确
4. **关联检查**：规则ID、处理人ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的预警记录
2. **状态修正**：修正不合理的预警状态
3. **时间同步**：同步触发时间和处理时间
4. **质量更新**：更新预警质量评分

## 性能优化

### 索引优化
- 预警ID建立唯一索引
- 状态和时间建立复合索引
- 规则和状态建立复合索引

### 查询优化
- 使用覆盖索引优化状态查询
- 按时间分区提高查询效率
- 合理使用状态和严重性过滤

### 存储优化
- JSON字段压缩存储
- 历史预警数据归档
- 定期清理已关闭记录

## 安全考虑

### 数据保护
- 预警详情信息加密存储
- 敏感系统信息脱敏处理
- 处理记录访问控制

### 权限控制
- 预警查看需要监控权限
- 处理操作需要相应权限
- 敏感预警需要特殊授权

## 扩展说明

### 未来扩展方向
1. **智能分析**：基于AI的预警智能分析
2. **预测预警**：基于趋势分析的预测性预警
3. **自动化处理**：完全自动化的预警处理流程
4. **可视化监控**：实时预警监控仪表板

### 兼容性说明
- 支持多种监控系统数据格式
- 支持标准化预警协议（如SNMP Trap）
- 支持第三方告警平台集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*