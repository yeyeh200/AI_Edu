# 操作日志实体 (OperationLog)

---

**实体编号：** DM-SYS-002
**实体名称：** 操作日志实体
**所属域：** 系统管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

操作日志实体是AI助评应用系统管理的核心事实实体，记录所有用户在系统中的操作行为。该实体支持详细的安全审计、操作追踪、异常检测等功能，为系统安全、用户行为分析、故障排查等提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_operation_log`
- **业务表名：** 操作日志表
- **数据类型：** 事实表

### 主要用途
- 记录用户操作行为
- 支持安全审计追踪
- 提供操作统计分析
- 支持异常行为检测

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 操作日志唯一标识ID |

### 用户信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| user_id | BIGINT | 20 | NULL | NULL | 操作用户ID |
| user_name | VARCHAR | 100 | NULL | NULL | 操作用户姓名 |
| user_no | VARCHAR | 50 | NULL | NULL | 操作用户编号 |
| user_type | ENUM | - | NULL | NULL | 用户类型 |
| session_id | VARCHAR | 100 | NULL | NULL | 会话ID |
| ip_address | VARCHAR | 45 | NOT NULL | '' | IP地址 |
| user_agent | VARCHAR | 500 | NULL | NULL | 用户代理信息 |

### 操作信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| operation_type | ENUM | - | NOT NULL | 'LOGIN' | 操作类型 |
| operation_action | VARCHAR | 100 | NOT NULL | '' | 操作动作 |
| operation_module | VARCHAR | 100 | NOT NULL | '' | 操作模块 |
| operation_function | VARCHAR | 100 | NULL | NULL | 操作功能 |
| operation_description | VARCHAR | 500 | NULL | NULL | 操作描述 |
| operation_url | VARCHAR | 500 | NULL | NULL | 操作URL |
| request_method | ENUM | - | NULL | NULL | 请求方法 |
| request_params | JSON | - | NULL | NULL | 请求参数 |
| response_data | JSON | - | NULL | NULL | 响应数据 |

### 资源信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| resource_type | VARCHAR | 50 | NULL | NULL | 资源类型 |
| resource_id | VARCHAR | 100 | NULL | NULL | 资源ID |
| resource_name | VARCHAR | 200 | NULL | NULL | 资源名称 |
| target_user_id | BIGINT | 20 | NULL | NULL | 目标用户ID |
| target_user_name | VARCHAR | 100 | NULL | NULL | 目标用户姓名 |

### 结果信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| operation_status | ENUM | - | NOT NULL | 'SUCCESS' | 操作状态 |
| error_code | VARCHAR | 50 | NULL | NULL | 错误码 |
| error_message | TEXT | - | NULL | NULL | 错误信息 |
| execution_time | INT | 11 | NULL | 0 | 执行时间（毫秒） |
| affected_rows | INT | 11 | NULL | 0 | 影响行数 |
| data_changes | JSON | - | NULL | NULL | 数据变更记录 |

### 环境信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| client_device | VARCHAR | 100 | NULL | NULL | 客户端设备 |
| client_platform | VARCHAR | 50 | NULL | NULL | 客户端平台 |
| client_version | VARCHAR | 20 | NULL | NULL | 客户端版本 |
| browser_type | VARCHAR | 50 | NULL | NULL | 浏览器类型 |
| browser_version | VARCHAR | 20 | NULL | NULL | 浏览器版本 |
| location_country | VARCHAR | 50 | NULL | NULL | 地理位置-国家 |
| location_region | VARCHAR | 100 | NULL | NULL | 地理位置-地区 |
| location_city | VARCHAR | 100 | NULL | NULL | 地理位置-城市 |

### 风险控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| risk_level | ENUM | - | NOT NULL | 'LOW' | 风险级别 |
| is_sensitive | TINYINT | 1 | NOT NULL | 0 | 是否敏感操作 |
| is_exception | TINYINT | 1 | NOT NULL | 0 | 是否异常操作 |
| exception_reason | VARCHAR | 500 | NULL | NULL | 异常原因 |
| security_event_id | BIGINT | 20 | NULL | NULL | 关联安全事件ID |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| operation_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 操作时间 |
| server_id | VARCHAR | 50 | NULL | NULL | 服务器ID |
| trace_id | VARCHAR | 100 | NULL | NULL | 链路追踪ID |
| batch_id | VARCHAR | 100 | NULL | NULL | 批次ID |
| source_system | ENUM | - | NOT NULL | 'AI_EVAL' | 来源系统 |
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 普通索引
```sql
INDEX idx_user_id (user_id)
INDEX idx_user_no (user_no)
INDEX idx_operation_time (operation_time)
INDEX idx_operation_type (operation_type)
INDEX idx_operation_status (operation_status)
INDEX idx_ip_address (ip_address)
INDEX idx_session_id (session_id)
INDEX idx_risk_level (risk_level)
INDEX idx_is_sensitive (is_sensitive)
INDEX idx_is_exception (is_exception)
INDEX idx_resource_type (resource_type)
INDEX idx_operation_module (operation_module)
INDEX idx_trace_id (trace_id)
```

### 复合索引
```sql
INDEX idx_user_time (user_id, operation_time)
INDEX idx_type_time (operation_type, operation_time)
INDEX idx_risk_time (risk_level, operation_time)
INDEX idx_session_time (session_id, operation_time)
```

### 检查约束
```sql
CHECK (user_type IN ('TEACHER', 'STUDENT', 'ADMIN', 'EXPERT', 'SYSTEM'))
CHECK (operation_type IN ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'IMPORT', 'APPROVE', 'REJECT', 'SEARCH', 'UPLOAD', 'DOWNLOAD'))
CHECK (request_method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH'))
CHECK (operation_status IN ('SUCCESS', 'FAILED', 'TIMEOUT', 'CANCELLED', 'UNAUTHORIZED'))
CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (is_sensitive IN (0, 1))
CHECK (is_exception IN (0, 1))
CHECK (execution_time >= 0)
CHECK (affected_rows >= 0)
```

## 枚举值定义

### 操作类型 (operation_type)
| 值 | 说明 | 备注 |
|----|------|------|
| LOGIN | 登录 | 用户登录系统 |
| LOGOUT | 登出 | 用户登出系统 |
| CREATE | 创建 | 创建数据 |
| UPDATE | 更新 | 更新数据 |
| DELETE | 删除 | 删除数据 |
| VIEW | 查看 | 查看数据 |
| EXPORT | 导出 | 导出数据 |
| IMPORT | 导入 | 导入数据 |
| APPROVE | 审批 | 审批操作 |
| REJECT | 拒绝 | 拒绝操作 |
| SEARCH | 搜索 | 搜索操作 |
| UPLOAD | 上传 | 上传文件 |
| DOWNLOAD | 下载 | 下载文件 |

### 请求方法 (request_method)
| 值 | 说明 | 备注 |
|----|------|------|
| GET | GET请求 | 查询请求 |
| POST | POST请求 | 创建请求 |
| PUT | PUT请求 | 更新请求 |
| DELETE | DELETE请求 | 删除请求 |
| PATCH | PATCH请求 | 部分更新请求 |

### 操作状态 (operation_status)
| 值 | 说明 | 备注 |
|----|------|------|
| SUCCESS | 成功 | 操作成功 |
| FAILED | 失败 | 操作失败 |
| TIMEOUT | 超时 | 操作超时 |
| CANCELLED | 取消 | 操作取消 |
| UNAUTHORIZED | 未授权 | 权限不足 |

### 风险级别 (risk_level)
| 值 | 说明 | 备注 |
|----|------|------|
| LOW | 低风险 | 常规操作 |
| MEDIUM | 中风险 | 敏感操作 |
| HIGH | 高风险 | 重要操作 |
| CRITICAL | 严重风险 | 关键操作 |

## 关联关系

### 多对一关系（作为从表）
- **OperationLog → User**：操作日志关联操作用户
- **OperationLog → User（target）**：操作日志关联目标用户
- **OperationLog → SecurityEvent**：操作日志关联安全事件

## 使用示例

### 查询示例

#### 1. 查询用户操作记录
```sql
SELECT
    user_name,
    user_no,
    operation_type,
    operation_action,
    operation_module,
    operation_description,
    operation_time,
    ip_address,
    operation_status
FROM fact_operation_log
WHERE user_id = 12345
  AND operation_time BETWEEN '2023-11-01' AND '2023-11-30'
ORDER BY operation_time DESC
LIMIT 100;
```

#### 2. 查询异常操作
```sql
SELECT
    user_name,
    user_no,
    operation_type,
    operation_action,
    ip_address,
    operation_time,
    error_message,
    exception_reason
FROM fact_operation_log
WHERE is_exception = 1
  OR operation_status = 'FAILED'
ORDER BY operation_time DESC
LIMIT 50;
```

#### 3. 查询敏感操作
```sql
SELECT
    user_name,
    operation_type,
    operation_action,
    resource_type,
    resource_name,
    target_user_name,
    operation_time,
    ip_address,
    risk_level
FROM fact_operation_log
WHERE is_sensitive = 1
  AND operation_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY operation_time DESC;
```

#### 4. 统计操作类型分布
```sql
SELECT
    operation_type,
    operation_action,
    COUNT(*) as operation_count,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(execution_time) as avg_execution_time,
    SUM(CASE WHEN operation_status = 'SUCCESS' THEN 1 END) as success_count,
    SUM(CASE WHEN operation_status = 'FAILED' THEN 1 END) as failed_count,
    ROUND(
        SUM(CASE WHEN operation_status = 'SUCCESS' THEN 1 END) * 100.0 / COUNT(*), 2
    ) as success_rate
FROM fact_operation_log
WHERE operation_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY operation_type, operation_action
ORDER BY operation_count DESC;
```

#### 5. 查询高频IP访问
```sql
SELECT
    ip_address,
    location_country,
    location_region,
    location_city,
    COUNT(*) as request_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    MAX(operation_time) as last_access,
    SUM(CASE WHEN operation_status = 'FAILED' THEN 1 END) as failed_count
FROM fact_operation_log
WHERE operation_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY ip_address, location_country, location_region, location_city
HAVING request_count > 100
ORDER BY request_count DESC;
```

#### 6. 查询用户行为模式
```sql
SELECT
    u.user_name,
    u.user_no,
    COUNT(*) as total_operations,
    COUNT(DISTINCT DATE(operation_time)) as active_days,
    AVG(execution_time) as avg_execution_time,
    COUNT(DISTINCT ip_address) as unique_ips,
    COUNT(DISTINCT session_id) as unique_sessions,
    SUM(CASE WHEN is_sensitive = 1 THEN 1 END) as sensitive_operations,
    SUM(CASE WHEN is_exception = 1 THEN 1 END) as exception_operations
FROM fact_operation_log ol
JOIN dim_user u ON ol.user_id = u.id
WHERE ol.operation_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY ol.user_id, u.user_name, u.user_no
ORDER BY total_operations DESC
LIMIT 50;
```

### 插入示例

#### 1. 登录操作记录
```sql
INSERT INTO fact_operation_log (
    user_id, user_name, user_no, user_type,
    ip_address, user_agent, session_id,
    operation_type, operation_action, operation_module,
    operation_description, operation_url, request_method,
    operation_status, risk_level, client_device,
    browser_type, browser_version
) VALUES (
    12345, '张老师', 'T20230001', 'TEACHER',
    '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'sess_abc123',
    'LOGIN', 'USER_LOGIN', 'AUTH',
    '用户登录系统', '/api/auth/login', 'POST',
    'SUCCESS', 'LOW', 'Windows',
    'Chrome', '119.0.0.0'
);
```

#### 2. 敏感操作记录
```sql
INSERT INTO fact_operation_log (
    user_id, user_name, user_no, user_type,
    ip_address, session_id,
    operation_type, operation_action, operation_module,
    operation_description, resource_type, resource_id,
    target_user_id, target_user_name,
    request_params, operation_status,
    is_sensitive, risk_level, execution_time
) VALUES (
    12345, '张老师', 'T20230001', 'TEACHER',
    '192.168.1.100', 'sess_abc123',
    'UPDATE', 'UPDATE_SCORE', 'EVALUATION',
    '修改教学质量评分', 'QUALITY_SCORE', '1001',
    23456, '李四',
    '{"score": 85.5, "comments": "教学效果良好"}',
    'SUCCESS',
    1, 'MEDIUM', 150
);
```

#### 3. 异常操作记录
```sql
INSERT INTO fact_operation_log (
    user_id, user_name, user_no, user_type,
    ip_address, session_id,
    operation_type, operation_action, operation_module,
    operation_description, operation_status,
    error_code, error_message, is_exception, exception_reason,
    risk_level, trace_id
) VALUES (
    67890, '未知用户', '', 'UNKNOWN',
    '10.0.0.100', 'sess_xyz789',
    'LOGIN', 'USER_LOGIN', 'AUTH',
    '非法登录尝试', 'FAILED',
    'AUTH_FAILED', '用户名或密码错误',
    1, '多次登录失败',
    'HIGH', 'trace_error_001'
);
```

### 更新示例

#### 1. 标记安全事件
```sql
UPDATE fact_operation_log
SET security_event_id = 1001,
    risk_level = 'CRITICAL',
    is_exception = 1,
    exception_reason = '疑似SQL注入攻击',
    update_time = NOW()
WHERE id = 12345
  AND trace_id = 'trace_suspicious_001';
```

## 数据质量

### 质量检查规则
1. **完整性检查**：操作时间、操作类型等关键字段不能为空
2. **一致性检查**：用户ID与用户信息逻辑一致
3. **时间检查**：操作时间不能是未来时间
4. **范围检查**：执行时间、影响行数不能为负数

### 数据清洗规则
1. **重复数据处理**：基于trace_id去除重复记录
2. **异常值处理**：识别和处理异常执行时间
3. **IP标准化**：统一IP地址格式
4. **用户代理清洗**：标准化浏览器信息

## 性能优化

### 索引优化
- 基于操作时间建立分区索引
- 用户ID和操作时间建立复合索引
- 风险级别和操作时间建立复合索引

### 分区策略
- 按月份进行表分区
- 提高大数据量查询性能
- 方便历史数据归档

### 查询优化
- 使用覆盖索引优化常用查询
- 避免大字段的全表扫描
- 合理使用时间范围过滤

### 存储优化
- JSON字段压缩存储
- 定期清理过期日志数据
- 使用压缩表减少存储空间

## 安全考虑

### 数据保护
- 敏感参数加密存储
- 用户隐私信息脱敏
- 日志数据传输加密

### 访问控制
- 日志查看需要审计权限
- 操作员不能删除自己的日志
- 敏感日志需要特殊授权

### 完整性保护
- 日志记录不可修改
- 数字签名防篡改
- 定期完整性校验

## 扩展说明

### 未来扩展方向
1. **AI分析**：基于日志数据的智能行为分析
2. **实时监控**：实时异常检测和告警
3. **链路追踪**：完整的微服务调用链路
4. **性能分析**：系统性能瓶颈分析

### 兼容性说明
- 支持与常见日志系统集成
- 支持ELK Stack日志分析
- 支持Splunk日志分析

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*