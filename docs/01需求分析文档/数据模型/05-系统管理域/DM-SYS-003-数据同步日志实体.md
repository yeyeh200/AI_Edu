# 数据同步日志实体 (DataSyncLog)

---

**实体编号：** DM-SYS-003
**实体名称：** 数据同步日志实体
**所属域：** 系统管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

数据同步日志实体是AI助评应用系统管理域的核心操作实体，定义了系统间数据同步的详细记录。该实体描述了数据同步任务的基础信息、同步配置、执行结果、异常处理等，为数据集成、系统监控、故障排查、质量保证等提供同步维度支撑。

## 实体定义

### 表名
- **物理表名：** `dwd_data_sync_log`
- **业务表名：** 数据同步日志表
- **数据类型：** 事实表

### 主要用途
- 记录数据同步执行过程
- 监控同步任务状态
- 跟踪数据传输质量
- 支持故障诊断分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 同步日志唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| sync_batch_id | VARCHAR | 50 | NOT NULL | '' | 同步批次ID |
| task_name | VARCHAR | 200 | NOT NULL | '' | 任务名称 |
| task_code | VARCHAR | 100 | NOT NULL | '' | 任务编码 |
| task_type | ENUM | - | NOT NULL | 'INCREMENTAL' | 任务类型 |
| sync_mode | ENUM | - | NOT NULL | 'AUTO' | 同步模式 |
| priority_level | ENUM | - | NULL | 'MEDIUM' | 优先级别 |
| execution_type | ENUM | - | NOT NULL | 'SCHEDULED' | 执行类型 |

### 数据源字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| source_system | VARCHAR | 100 | NOT NULL | '' | 源系统 |
| source_system_code | VARCHAR | 50 | NOT NULL | '' | 源系统编码 |
| source_host | VARCHAR | 200 | NULL | NULL | 源系统主机 |
| source_database | VARCHAR | 100 | NULL | NULL | 源数据库 |
| source_table | VARCHAR | 100 | NULL | NULL | 源表名 |
| source_schema | VARCHAR | 100 | NULL | NULL | 源模式 |
| source_connection | TEXT | - | NULL | NULL | 源连接信息 |
| source_credentials | VARCHAR | 500 | NULL | NULL | 源认证信息 |

### 目标系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| target_system | VARCHAR | 100 | NOT NULL | '' | 目标系统 |
| target_system_code | VARCHAR | 50 | NOT NULL | '' | 目标系统编码 |
| target_host | VARCHAR | 200 | NULL | NULL | 目标系统主机 |
| target_database | VARCHAR | 100 | NULL | NULL | 目标数据库 |
| target_table | VARCHAR | 100 | NULL | NULL | 目标表名 |
| target_schema | VARCHAR | 100 | NULL | NULL | 目标模式 |
| target_connection | TEXT | - | NULL | NULL | 目标连接信息 |
| target_credentials | VARCHAR | 500 | NULL | NULL | 目标认证信息 |

### 时间调度字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| scheduled_time | DATETIME | - | NULL | NULL | 计划执行时间 |
| start_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 开始时间 |
| end_time | DATETIME | - | NULL | NULL | 结束时间 |
| duration_seconds | INT | 11 | NULL | 0 | 执行时长（秒） |
| schedule_expression | VARCHAR | 200 | NULL | NULL | 调度表达式 |
| timezone | VARCHAR | 50 | NULL | 'Asia/Shanghai' | 时区 |
| retry_count | INT | 11 | NULL | 0 | 重试次数 |
| next_retry_time | DATETIME | - | NULL | NULL | 下次重试时间 |

### 执行状态字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| sync_status | ENUM | - | NOT NULL | 'RUNNING' | 同步状态 |
| execution_result | ENUM | - | NULL | NULL | 执行结果 |
| success_flag | TINYINT | 1 | NOT NULL | 0 | 成功标志 |
| completion_rate | DECIMAL | 5,2 | NULL | 0.00 | 完成率 |
| progress_percentage | DECIMAL | 5,2 | NULL | 0.00 | 进度百分比 |
| current_phase | VARCHAR | 100 | NULL | NULL | 当前阶段 |
| total_phases | INT | 11 | NULL | 0 | 总阶段数 |
| completed_phases | INT | 11 | NULL | 0 | 已完成阶段数 |

### 数据统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| source_record_count | BIGINT | 20 | NULL | 0 | 源记录数 |
| target_record_count | BIGINT | 20 | NULL | 0 | 目标记录数 |
| inserted_count | BIGINT | 20 | NULL | 0 | 插入记录数 |
| updated_count | BIGINT | 20 | NULL | 0 | 更新记录数 |
| deleted_count | BIGINT | 20 | NULL | 0 | 删除记录数 |
| skipped_count | BIGINT | 20 | NULL | 0 | 跳过记录数 |
| error_count | BIGINT | 20 | NULL | 0 | 错误记录数 |
| duplicate_count | BIGINT | 20 | NULL | 0 | 重复记录数 |

### 性能指标字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| throughput_records | DECIMAL | 12,2 | NULL | 0.00 | 吞吐量（记录/秒） |
| throughput_bytes | DECIMAL | 12,2 | NULL | 0.00 | 吞吐量（字节/秒） |
| data_volume_bytes | BIGINT | 20 | NULL | 0 | 数据量（字节） |
| compression_ratio | DECIMAL | 5,2 | NULL | 0.00 | 压缩比率 |
| cpu_usage_percent | DECIMAL | 5,2 | NULL | 0.00 | CPU使用率 |
| memory_usage_mb | DECIMAL | 10,2 | NULL | 0.00 | 内存使用量 |
| network_usage_mb | DECIMAL | 10,2 | NULL | 0.00 | 网络使用量 |
| disk_io_mb | DECIMAL | 10,2 | NULL | 0.00 | 磁盘IO量 |

### 质量检查字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| data_quality_score | DECIMAL | 5,2 | NULL | 0.00 | 数据质量评分 |
| integrity_check | ENUM | - | NULL | NULL | 完整性检查 |
| consistency_check | ENUM | - | NULL | NULL | 一致性检查 |
| validity_check | ENUM | - | NULL | NULL | 有效性检查 |
| completeness_rate | DECIMAL | 5,2 | NULL | 0.00 | 完整性比率 |
| accuracy_rate | DECIMAL | 5,2 | NULL | 0.00 | 准确性比率 |
| consistency_rate | DECIMAL | 5,2 | NULL | 0.00 | 一致性比率 |
| validation_passed | BIGINT | 20 | NULL | 0 | 验证通过数 |

### 错误处理字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| error_code | VARCHAR | 50 | NULL | NULL | 错误代码 |
| error_message | TEXT | - | NULL | NULL | 错误信息 |
| error_stack_trace | TEXT | - | NULL | NULL | 错误堆栈 |
| error_type | ENUM | - | NULL | NULL | 错误类型 |
| error_category | VARCHAR | 100 | NULL | NULL | 错误分类 |
| error_severity | ENUM | - | NULL | NULL | 错误严重性 |
| recovery_action | VARCHAR | 200 | NULL | NULL | 恢复操作 |
| error_resolution | TEXT | - | NULL | NULL | 错误解决方案 |

### 配置信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| sync_config | JSON | - | NULL | NULL | 同步配置 |
| filter_conditions | JSON | - | NULL | NULL | 过滤条件 |
| mapping_rules | JSON | - | NULL | NULL | 映射规则 |
| transformation_rules | JSON | - | NULL | NULL | 转换规则 |
| validation_rules | JSON | - | NULL | NULL | 验证规则 |
| retry_config | JSON | - | NULL | NULL | 重试配置 |
| alert_config | JSON | - | NULL | NULL | 告警配置 |
| performance_config | JSON | - | NULL | NULL | 性能配置 |

### 审计信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| operator_id | BIGINT | 20 | NULL | NULL | 操作人ID |
| operator_name | VARCHAR | 100 | NULL | NULL | 操作人姓名 |
| trigger_source | ENUM | - | NULL | NULL | 触发来源 |
| trigger_reason | VARCHAR | 500 | NULL | NULL | 触发原因 |
| business_impact | ENUM | - | NULL | NULL | 业务影响 |
| risk_level | ENUM | - | NULL | NULL | 风险级别 |
| compliance_check | ENUM | - | NULL | NULL | 合规检查 |
| audit_trail | TEXT | - | NULL | NULL | 审计跟踪 |
| change_summary | TEXT | - | NULL | NULL | 变更摘要 |

### 环境信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| execution_environment | ENUM | - | NOT NULL | 'PRODUCTION' | 执行环境 |
| server_hostname | VARCHAR | 200 | NULL | NULL | 服务器主机名 |
| server_ip | VARCHAR | 50 | NULL | NULL | 服务器IP |
| application_version | VARCHAR | 50 | NULL | NULL | 应用版本 |
| framework_version | VARCHAR | 50 | NULL | NULL | 框架版本 |
| os_version | VARCHAR | 100 | NULL | NULL | 操作系统版本 |
| java_version | VARCHAR | 50 | NULL | NULL | Java版本 |
| database_version | VARCHAR | 50 | NULL | NULL | 数据库版本 |

### 监控指标字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| performance_metrics | JSON | - | NULL | NULL | 性能指标 |
| system_metrics | JSON | - | NULL | NULL | 系统指标 |
| business_metrics | JSON | - | NULL | NULL | 业务指标 |
| health_check_results | JSON | - | NULL | NULL | 健康检查结果 |
| sla_compliance | ENUM | - | NULL | NULL | SLA合规性 |
| service_level_agreement | DECIMAL | 5,2 | NULL | 0.00 | 服务水平协议 |
| kpi_achievements | JSON | - | NULL | NULL | KPI达成情况 |
| benchmark_comparison | JSON | - | NULL | NULL | 基准对比 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| checksum | VARCHAR | 64 | NULL | NULL | 数据校验码 |
| encryption_key_id | VARCHAR | 100 | NULL | NULL | 加密密钥ID |
| backup_status | ENUM | - | NULL | NULL | 备份状态 |
| archive_status | ENUM | - | NULL | NULL | 归档状态 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_sync_batch_id (sync_batch_id)
```

### 外键约束
```sql
FOREIGN KEY (operator_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_task_code (task_code)
INDEX idx_task_type (task_type)
INDEX idx_sync_mode (sync_mode)
INDEX idx_source_system (source_system)
INDEX idx_target_system (target_system)
INDEX idx_sync_status (sync_status)
INDEX idx_execution_result (execution_result)
INDEX idx_success_flag (success_flag)
INDEX idx_start_time (start_time)
INDEX idx_end_time (end_time)
INDEX idx_error_code (error_code)
INDEX idx_operator_id (operator_id)
```

### 复合索引
```sql
INDEX idx_system_status (source_system, target_system, sync_status)
INDEX idx_time_status (start_time, sync_status)
INDEX idx_result_time (execution_result, end_time)
INDEX idx_task_status (task_code, sync_status, start_time)
INDEX idx_performance_index (throughput_records, duration_seconds)
```

### 分区索引
```sql
-- 按月分区索引
INDEX idx_monthly_partition (YEAR(start_time), MONTH(start_time), sync_status)
```

### 检查约束
```sql
CHECK (task_type IN ('FULL', 'INCREMENTAL', 'DELTA', 'SNAPSHOT', 'REAL_TIME', 'BATCH'))
CHECK (sync_mode IN ('AUTO', 'MANUAL', 'SCHEDULED', 'TRIGGERED', 'STREAMING'))
CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'))
CHECK (execution_type IN ('SCHEDULED', 'MANUAL', 'TRIGGERED', 'RECOVERY', 'RETRY'))
CHECK (sync_status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT', 'PAUSED'))
CHECK (execution_result IN ('SUCCESS', 'PARTIAL_SUCCESS', 'FAILURE', 'TIMEOUT', 'CANCELLED'))
CHECK (integrity_check IN ('PASSED', 'FAILED', 'WARNING', 'NOT_CHECKED'))
CHECK (consistency_check IN ('PASSED', 'FAILED', 'WARNING', 'NOT_CHECKED'))
CHECK (validity_check IN ('PASSED', 'FAILED', 'WARNING', 'NOT_CHECKED'))
CHECK (error_type IN ('SYSTEM_ERROR', 'DATA_ERROR', 'NETWORK_ERROR', 'CONFIGURATION_ERROR', 'BUSINESS_ERROR'))
CHECK (error_severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (trigger_source IN ('SCHEDULE', 'MANUAL', 'API', 'EVENT', 'ALERT', 'SYSTEM'))
CHECK (business_impact IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (compliance_check IN ('COMPLIANT', 'NON_COMPLIANT', 'PENDING'))
CHECK (execution_environment IN ('DEVELOPMENT', 'TESTING', 'STAGING', 'PRODUCTION'))
CHECK (sla_compliance IN ('COMPLIANT', 'NON_COMPLIANT', 'WARNING'))
CHECK (backup_status IN ('BACKED_UP', 'NOT_BACKED_UP', 'FAILED'))
CHECK (archive_status IN ('ACTIVE', 'ARCHIVED', 'PURGED'))
CHECK (success_flag IN (0, 1))
CHECK (duration_seconds >= 0)
CHECK (retry_count >= 0)
CHECK (completion_rate BETWEEN 0 AND 100)
CHECK (progress_percentage BETWEEN 0 AND 100)
CHECK (source_record_count >= 0)
CHECK (target_record_count >= 0)
CHECK (inserted_count >= 0)
CHECK (updated_count >= 0)
CHECK (deleted_count >= 0)
CHECK (skipped_count >= 0)
CHECK (error_count >= 0)
CHECK (duplicate_count >= 0)
CHECK (throughput_records >= 0)
CHECK (throughput_bytes >= 0)
CHECK (data_volume_bytes >= 0)
CHECK (compression_ratio >= 0)
CHECK (cpu_usage_percent BETWEEN 0 AND 100)
CHECK (memory_usage_mb >= 0)
CHECK (network_usage_mb >= 0)
CHECK (disk_io_mb >= 0)
CHECK (data_quality_score BETWEEN 0 AND 100)
CHECK (completeness_rate BETWEEN 0 AND 100)
CHECK (accuracy_rate BETWEEN 0 AND 100)
CHECK (consistency_rate BETWEEN 0 AND 100)
CHECK (validation_passed >= 0)
CHECK (service_level_agreement BETWEEN 0 AND 100)
```

## 枚举值定义

### 任务类型 (task_type)
| 值 | 说明 | 备注 |
|----|------|------|
| FULL | 全量同步 | 完整数据同步 |
| INCREMENTAL | 增量同步 | 基于变更的增量 |
| DELTA | 差异同步 | 只同步差异数据 |
| SNAPSHOT | 快照同步 | 时间点快照 |
| REAL_TIME | 实时同步 | 实时数据流 |
| BATCH | 批量同步 | 批处理方式 |

### 同步模式 (sync_mode)
| 值 | 说明 | 备注 |
|----|------|------|
| AUTO | 自动 | 系统自动执行 |
| MANUAL | 手动 | 手动触发执行 |
| SCHEDULED | 调度 | 按计划调度 |
| TRIGGERED | 触发 | 事件触发 |
| STREAMING | 流式 | 流处理方式 |

### 同步状态 (sync_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PENDING | 待执行 | 等待执行 |
| RUNNING | 运行中 | 正在执行 |
| COMPLETED | 已完成 | 执行完成 |
| FAILED | 失败 | 执行失败 |
| CANCELLED | 已取消 | 被取消 |
| TIMEOUT | 超时 | 执行超时 |
| PAUSED | 已暂停 | 暂停执行 |

### 执行结果 (execution_result)
| 值 | 说明 | 备注 |
|----|------|------|
| SUCCESS | 成功 | 完全成功 |
| PARTIAL_SUCCESS | 部分成功 | 部分成功 |
| FAILURE | 失败 | 完全失败 |
| TIMEOUT | 超时 | 执行超时 |
| CANCELLED | 取消 | 被取消 |

### 错误类型 (error_type)
| 值 | 说明 | 备注 |
|----|------|------|
| SYSTEM_ERROR | 系统错误 | 系统级错误 |
| DATA_ERROR | 数据错误 | 数据级错误 |
| NETWORK_ERROR | 网络错误 | 网络连接错误 |
| CONFIGURATION_ERROR | 配置错误 | 配置错误 |
| BUSINESS_ERROR | 业务错误 | 业务逻辑错误 |

### 触发来源 (trigger_source)
| 值 | 说明 | 备注 |
|----|------|------|
| SCHEDULE | 调度 | 定时调度触发 |
| MANUAL | 手动 | 手动触发 |
| API | API | API接口触发 |
| EVENT | 事件 | 事件触发 |
| ALERT | 告警 | 告警触发 |
| SYSTEM | 系统 | 系统触发 |

## 关联关系

### 多对一关系（作为从表）
- **DataSyncLog → User（operator）**：同步日志关联操作人
- **DataSyncLog → User（creator）**：同步日志关联创建人
- **DataSyncLog → User（updater）**：同步日志关联更新人

### 一对多关系（作为主表）
- **DataSyncLog → SyncErrorDetail**：一个同步日志有多个错误详情
- **DataSyncLog → SyncPerformanceMetric**：一个同步日志有多个性能指标
- **DataSyncLog → SyncAlert**：一个同步日志可触发多个告警

### 多对多关系
- **DataSyncLog ↔ DataSource**：通过中间表关联数据源
- **DataSyncLog ↔ BusinessRule**：通过中间表关联业务规则

## 使用示例

### 查询示例

#### 1. 查询同步任务执行状态
```sql
SELECT
    s.sync_batch_id,
    s.task_name,
    s.task_type,
    s.sync_mode,
    s.source_system,
    s.target_system,
    s.sync_status,
    s.execution_result,
    s.success_flag,
    s.start_time,
    s.end_time,
    s.duration_seconds,
    s.completion_rate,
    s.error_count,
    CASE
        WHEN s.sync_status = 'RUNNING' THEN '执行中'
        WHEN s.sync_status = 'COMPLETED' AND s.success_flag = 1 THEN '成功完成'
        WHEN s.sync_status = 'FAILED' THEN '执行失败'
        ELSE '其他状态'
    END as status_description
FROM dwd_data_sync_log s
WHERE s.start_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)
ORDER BY s.start_time DESC;
```

#### 2. 查询失败的同步任务
```sql
SELECT
    s.sync_batch_id,
    s.task_name,
    s.source_system,
    s.target_system,
    s.error_code,
    s.error_message,
    s.error_type,
    s.error_severity,
    s.start_time,
    s.end_time,
    s.retry_count,
    s.next_retry_time,
    s.operator_name
FROM dwd_data_sync_log s
WHERE s.sync_status = 'FAILED'
  OR (s.execution_result IN ('FAILURE', 'TIMEOUT'))
  AND s.start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY s.start_time DESC, s.error_severity DESC;
```

#### 3. 查询同步性能指标
```sql
SELECT
    s.task_name,
    s.source_system,
    s.target_system,
    s.source_record_count,
    s.target_record_count,
    s.inserted_count,
    s.updated_count,
    s.deleted_count,
    s.throughput_records,
    s.throughput_bytes,
    s.data_volume_bytes,
    s.duration_seconds,
    s.cpu_usage_percent,
    s.memory_usage_mb,
    s.network_usage_mb,
    CASE
        WHEN s.throughput_records >= 1000 THEN 'HIGH'
        WHEN s.throughput_records >= 500 THEN 'MEDIUM'
        ELSE 'LOW'
    END as performance_level
FROM dwd_data_sync_log s
WHERE s.execution_result = 'SUCCESS'
  AND s.start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY s.throughput_records DESC;
```

#### 4. 查询数据质量检查结果
```sql
SELECT
    s.task_name,
    s.sync_batch_id,
    s.data_quality_score,
    s.integrity_check,
    s.consistency_check,
    s.validity_check,
    s.completeness_rate,
    s.accuracy_rate,
    s.consistency_rate,
    s.validation_passed,
    s.error_count,
    CASE
        WHEN s.data_quality_score >= 95 THEN 'EXCELLENT'
        WHEN s.data_quality_score >= 85 THEN 'GOOD'
        WHEN s.data_quality_score >= 70 THEN 'SATISFACTORY'
        ELSE 'POOR'
    END as quality_level
FROM dwd_data_sync_log s
WHERE s.start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  AND s.execution_result = 'SUCCESS'
ORDER BY s.data_quality_score DESC;
```

#### 5. 查询操作审计信息
```sql
SELECT
    s.sync_batch_id,
    s.task_name,
    s.operator_name,
    s.trigger_source,
    s.trigger_reason,
    s.business_impact,
    s.risk_level,
    s.compliance_check,
    s.execution_environment,
    s.server_hostname,
    s.start_time,
    s.audit_trail
FROM dwd_data_sync_log s
WHERE s.operator_id IS NOT NULL
  AND s.start_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)
ORDER BY s.start_time DESC, s.risk_level DESC;
```

### 插入示例

#### 1. 创建全量同步日志
```sql
INSERT INTO dwd_data_sync_log (
    sync_batch_id, task_name, task_code, task_type,
    sync_mode, priority_level, execution_type,
    source_system, source_system_code, source_table,
    target_system, target_system_code, target_table,
    start_time, operator_id, operator_name,
    trigger_source, execution_environment,
    sync_config, retry_config,
    create_by
) VALUES (
    'SYNC20240123001', '职教云用户数据全量同步', 'ZJY_USER_FULL_SYNC', 'FULL',
    'SCHEDULED', 'HIGH', 'SCHEDULED',
    '职教云平台', 'ZJY', 'dim_user',
    'AI助评系统', 'AI_TEACHING_EVAL', 'dim_user',
    NOW(), 10001, '系统管理员',
    'SCHEDULE', 'PRODUCTION',
    '{"batch_size": 1000, "parallel_threads": 4, "timeout": 3600}',
    '{"max_retries": 3, "retry_interval": 300, "exponential_backoff": true}',
    10001
);
```

#### 2. 创建增量同步日志
```sql
INSERT INTO dwd_data_sync_log (
    sync_batch_id, task_name, task_code, task_type,
    sync_mode, source_system, source_table,
    target_system, target_table,
    start_time, sync_status,
    filter_conditions, mapping_rules,
    create_by
) VALUES (
    'SYNC20240123002', '教务系统课程增量同步', 'EDU_COURSE_INCR', 'INCREMENTAL',
    'TRIGGERED', '教务系统', 'course_info',
    'AI助评系统', 'dim_course',
    NOW(), 'RUNNING',
    '{"last_sync_time": "2024-01-22 18:00:00", "change_type": ["INSERT", "UPDATE"]}',
    '{"course_code": "course_no", "course_name": "course_title", "credit": "credit_hours"}',
    10001
);
```

### 更新示例

#### 1. 更新同步完成状态
```sql
UPDATE dwd_data_sync_log
SET sync_status = 'COMPLETED',
    execution_result = 'SUCCESS',
    success_flag = 1,
    end_time = NOW(),
    duration_seconds = TIMESTAMPDIFF(SECOND, start_time, NOW()),
    completion_rate = 100.00,
    progress_percentage = 100.00,
    source_record_count = 50000,
    target_record_count = 50000,
    inserted_count = 1200,
    updated_count = 150,
    deleted_count = 25,
    skipped_count = 15,
    error_count = 0,
    throughput_records = 833.33,
    data_volume_bytes = 524288000,
    data_quality_score = 98.50,
    integrity_check = 'PASSED',
    consistency_check = 'PASSED',
    validity_check = 'PASSED',
    update_time = NOW(),
    version = version + 1
WHERE sync_batch_id = 'SYNC20240123001'
  AND sync_status = 'RUNNING';
```

#### 2. 更新同步失败状态
```sql
UPDATE dwd_data_sync_log
SET sync_status = 'FAILED',
    execution_result = 'FAILURE',
    success_flag = 0,
    end_time = NOW(),
    duration_seconds = TIMESTAMPDIFF(SECOND, start_time, NOW()),
    completion_rate = 65.30,
    error_count = 156,
    error_code = 'CONN_TIMEOUT',
    error_message = '数据库连接超时，无法获取源数据',
    error_type = 'NETWORK_ERROR',
    error_severity = 'HIGH',
    error_stack_trace = 'java.sql.SQLException: Connection timeout...',
    recovery_action = '检查网络连接，增加连接超时时间',
    retry_count = retry_count + 1,
    next_retry_time = DATE_ADD(NOW(), INTERVAL 5 MINUTE),
    update_time = NOW(),
    version = version + 1
WHERE sync_batch_id = 'SYNC20240123002'
  AND sync_status = 'RUNNING';
```

#### 3. 更新性能指标
```sql
UPDATE dwd_data_sync_log
SET throughput_records = ROUND(source_record_count / duration_seconds, 2),
    throughput_bytes = ROUND(data_volume_bytes / duration_seconds, 2),
    cpu_usage_percent = 75.60,
    memory_usage_mb = 1024.50,
    network_usage_mb = 512.30,
    disk_io_mb = 256.80,
    performance_metrics = JSON_OBJECT(
        'avg_processing_time', 0.12,
        'max_processing_time', 2.50,
        'min_processing_time', 0.05,
        'p95_processing_time', 0.85
    ),
    system_metrics = JSON_OBJECT(
        'server_load', 65.4,
        'available_memory', 6144,
        'disk_usage', 45.2
    ),
    update_time = NOW(),
    version = version + 1
WHERE id = 1001
  AND sync_status = 'COMPLETED';
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：同步批次ID必须唯一
2. **完整性检查**：基础信息、执行状态等关键字段不能为空
3. **逻辑检查**：时间逻辑合理，统计数值有效
4. **关联检查**：操作人ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的同步批次
2. **时间修正**：修正不合理的时间记录
3. **状态同步**：同步执行状态和结果状态
4. **性能修正**：修正异常的性能指标

## 性能优化

### 索引优化
- 任务编码和状态建立复合索引
- 时间范围建立分区索引
- 源系统和目标系统建立复合索引

### 查询优化
- 使用覆盖索引优化监控查询
- 按时间分区提高查询效率
- 合理使用状态和时间过滤

### 存储优化
- JSON字段压缩存储
- 历史日志数据归档
- 定期清理过期日志

## 安全考虑

### 数据保护
- 连接信息加密存储
- 敏感配置信息保护
- 错误信息脱敏处理

### 权限控制
- 同步日志查看需要监控权限
- 操作信息访问需要审计权限
- 敏感数据修改需要管理员权限

## 扩展说明

### 未来扩展方向
1. **实时监控**：同步过程实时监控
2. **智能预警**：基于历史数据的预警机制
3. **自动恢复**：故障自动恢复机制
4. **性能优化**：自适应性能调优

### 兼容性说明
- 支持多种数据源类型
- 支持各类同步工具集成
- 支持分布式同步架构

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*