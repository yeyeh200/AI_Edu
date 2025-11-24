# 系统配置实体 (SystemConfig)

---

**实体编号：** DM-SYS-001
**实体名称：** 系统配置实体
**所属域：** 系统管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

系统配置实体是AI助评应用系统管理的核心实体，存储系统的各类配置参数、业务规则、系统设置等信息。该实体支持动态配置管理，为系统的灵活配置、参数调优、业务规则管理等提供基础支撑。

## 实体定义

### 表名
- **物理表名：** `dim_system_config`
- **业务表名：** 系统配置表
- **数据类型：** 维度表

### 主要用途
- 存储系统配置参数
- 支持动态配置管理
- 提供配置查询接口
- 支持配置变更审计

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 配置记录唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| config_key | VARCHAR | 200 | NOT NULL | '' | 配置键（系统唯一） |
| config_name | VARCHAR | 200 | NOT NULL | '' | 配置名称 |
| config_group | VARCHAR | 100 | NOT NULL | '' | 配置分组 |
| config_category | ENUM | - | NOT NULL | 'SYSTEM' | 配置类别 |
| config_description | TEXT | - | NULL | NULL | 配置描述 |

### 配置值字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| config_value | TEXT | - | NOT NULL | '' | 配置值 |
| config_type | ENUM | - | NOT NULL | 'STRING' | 配置值类型 |
| default_value | TEXT | - | NULL | NULL | 默认值 |
| min_value | DECIMAL | 20,8 | NULL | NULL | 最小值（数值类型） |
| max_value | DECIMAL | 20,8 | NULL | NULL | 最大值（数值类型） |
| value_options | TEXT | - | NULL | NULL | 可选值（JSON数组） |
| validation_rule | VARCHAR | 500 | NULL | NULL | 验证规则（正则表达式） |

### 属性控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| is_required | TINYINT | 1 | NOT NULL | 0 | 是否必填 |
| is_readonly | TINYINT | 1 | NOT NULL | 0 | 是否只读 |
| is_sensitive | TINYINT | 1 | NOT NULL | 0 | 是否敏感信息 |
| is_encrypted | TINYINT | 1 | NOT NULL | 0 | 是否加密存储 |
| is_system | TINYINT | 1 | NOT NULL | 0 | 是否系统配置 |
| is_hot_reload | TINYINT | 1 | NOT NULL | 0 | 是否支持热重载 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| status | ENUM | - | NOT NULL | 'ACTIVE' | 配置状态 |
| environment | ENUM | - | NOT NULL | 'ALL' | 适用环境 |
| version | INT | 11 | NOT NULL | 1 | 配置版本 |
| priority | INT | 11 | NOT NULL | 0 | 优先级（数值越大优先级越高） |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| last_access_time | TIMESTAMP | - | NULL | NULL | 最后访问时间 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_config_key (config_key)
```

### 普通索引
```sql
INDEX idx_config_group (config_group)
INDEX idx_config_category (config_category)
INDEX idx_status (status)
INDEX idx_environment (environment)
INDEX idx_is_system (is_system)
INDEX idx_is_hot_reload (is_hot_reload)
```

### 检查约束
```sql
CHECK (config_type IN ('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'JSON', 'ARRAY', 'DATE', 'TIME'))
CHECK (config_category IN ('SYSTEM', 'BUSINESS', 'UI', 'SECURITY', 'INTEGRATION', 'PERFORMANCE'))
CHECK (is_required IN (0, 1))
CHECK (is_readonly IN (0, 1))
CHECK (is_sensitive IN (0, 1))
CHECK (is_encrypted IN (0, 1))
CHECK (is_system IN (0, 1))
CHECK (is_hot_reload IN (0, 1))
CHECK (status IN ('ACTIVE', 'INACTIVE', 'DEPRECATED'))
CHECK (environment IN ('ALL', 'DEV', 'TEST', 'STAGING', 'PROD'))
CHECK (priority >= 0)
```

## 枚举值定义

### 配置值类型 (config_type)
| 值 | 说明 | 示例 |
|----|------|------|
| STRING | 字符串 | 配置文本信息 |
| INTEGER | 整数 | 配置数值参数 |
| DECIMAL | 小数 | 配置精度数值 |
| BOOLEAN | 布尔值 | 配置开关状态 |
| JSON | JSON对象 | 配置复杂结构 |
| ARRAY | 数组 | 配置列表数据 |
| DATE | 日期 | 配置日期信息 |
| TIME | 时间 | 配置时间信息 |

### 配置类别 (config_category)
| 值 | 说明 | 备注 |
|----|------|------|
| SYSTEM | 系统配置 | 系统基础配置 |
| BUSINESS | 业务配置 | 业务规则配置 |
| UI | 界面配置 | 用户界面配置 |
| SECURITY | 安全配置 | 安全相关配置 |
| INTEGRATION | 集成配置 | 外部系统集成配置 |
| PERFORMANCE | 性能配置 | 性能优化配置 |

### 配置状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 激活 | 配置正常使用 |
| INACTIVE | 未激活 | 配置暂时停用 |
| DEPRECATED | 已废弃 | 配置已废弃 |

### 适用环境 (environment)
| 值 | 说明 | 备注 |
|----|------|------|
| ALL | 所有环境 | 适用于所有环境 |
| DEV | 开发环境 | 仅开发环境 |
| TEST | 测试环境 | 仅测试环境 |
| STAGING | 预发布环境 | 仅预发布环境 |
| PROD | 生产环境 | 仅生产环境 |

## 默认配置定义

### 系统基础配置
```json
{
  "system": {
    "app.name": {
      "config_key": "app.name",
      "config_name": "应用名称",
      "config_group": "系统基础",
      "config_type": "STRING",
      "default_value": "AI助评应用",
      "is_system": 1,
      "is_required": 1
    },
    "app.version": {
      "config_key": "app.version",
      "config_name": "应用版本",
      "config_group": "系统基础",
      "config_type": "STRING",
      "default_value": "1.0.0",
      "is_system": 1,
      "is_readonly": 1
    }
  }
}
```

### 教学质量评估配置
```json
{
  "evaluation": {
    "quality.weights.activity": {
      "config_key": "quality.weights.activity",
      "config_name": "教学活跃度权重",
      "config_group": "质量评估",
      "config_type": "DECIMAL",
      "default_value": "0.25",
      "min_value": "0.1",
      "max_value": "0.5",
      "validation_rule": "^0\\.\\d{1,2}$"
    },
    "quality.weights.participation": {
      "config_key": "quality.weights.participation",
      "config_name": "学生参与度权重",
      "config_group": "质量评估",
      "config_type": "DECIMAL",
      "default_value": "0.30",
      "min_value": "0.1",
      "max_value": "0.5"
    },
    "quality.threshold.excellent": {
      "config_key": "quality.threshold.excellent",
      "config_name": "优秀教学质量阈值",
      "config_group": "质量评估",
      "config_type": "DECIMAL",
      "default_value": "90.0",
      "min_value": "80.0",
      "max_value": "100.0"
    }
  }
}
```

### 数据同步配置
```json
{
  "sync": {
    "data.zjy.interval": {
      "config_key": "data.zjy.interval",
      "config_name": "职教云数据同步间隔",
      "config_group": "数据同步",
      "config_type": "INTEGER",
      "default_value": "300",
      "min_value": "60",
      "max_value": "3600",
      "unit": "秒"
    },
    "data.edu.interval": {
      "config_key": "data.edu.interval",
      "config_name": "教务数据同步间隔",
      "config_group": "数据同步",
      "config_type": "INTEGER",
      "default_value": "600",
      "min_value": "60",
      "max_value": "3600",
      "unit": "秒"
    }
  }
}
```

### 安全配置
```json
{
  "security": {
    "auth.session.timeout": {
      "config_key": "auth.session.timeout",
      "config_name": "会话超时时间",
      "config_group": "安全配置",
      "config_type": "INTEGER",
      "default_value": "1800",
      "min_value": "300",
      "max_value": "7200",
      "unit": "秒"
    },
    "auth.password.min_length": {
      "config_key": "auth.password.min_length",
      "config_name": "密码最小长度",
      "config_group": "安全配置",
      "config_type": "INTEGER",
      "default_value": "8",
      "min_value": "6",
      "max_value": "20"
    }
  }
}
```

## 使用示例

### 查询示例

#### 1. 查询指定分组的配置
```sql
SELECT
    config_key,
    config_name,
    config_value,
    config_type,
    default_value,
    is_hot_reload
FROM dim_system_config
WHERE config_group = '质量评估'
  AND status = 'ACTIVE'
  AND environment IN ('ALL', 'PROD')
ORDER BY priority DESC;
```

#### 2. 查询支持热重载的配置
```sql
SELECT
    config_key,
    config_name,
    config_value,
    config_type,
    last_access_time
FROM dim_system_config
WHERE is_hot_reload = 1
  AND status = 'ACTIVE'
ORDER BY last_access_time DESC;
```

#### 3. 查询系统敏感配置
```sql
SELECT
    config_key,
    config_name,
    CASE
        WHEN is_encrypted = 1 THEN '***ENCRYPTED***'
        ELSE config_value
    END as config_value,
    is_sensitive,
    is_encrypted
FROM dim_system_config
WHERE is_sensitive = 1
  AND status = 'ACTIVE';
```

#### 4. 验证配置值
```sql
SELECT
    config_key,
    config_name,
    config_value,
    validation_rule,
    CASE
        WHEN config_value REGEXP COALESCE(validation_rule, '.*') THEN 'VALID'
        ELSE 'INVALID'
    END as validation_status
FROM dim_system_config
WHERE validation_rule IS NOT NULL
  AND status = 'ACTIVE';
```

### 插入示例

#### 1. 创建系统配置
```sql
INSERT INTO dim_system_config (
    config_key, config_name, config_group, config_category,
    config_description, config_value, config_type, default_value,
    is_system, is_required, is_hot_reload,
    status, environment, priority,
    create_by
) VALUES (
    'quality.weights.innovation',
    '教学创新权重',
    '质量评估',
    'BUSINESS',
    '教学质量评估中教学创新维度的权重配置',
    '0.10',
    'DECIMAL',
    '0.10',
    0, 1, 1,
    'ACTIVE', 'ALL', 100,
    1
);
```

#### 2. 创建枚举值配置
```sql
INSERT INTO dim_system_config (
    config_key, config_name, config_group,
    config_value, config_type, value_options,
    is_required, is_hot_reload,
    status, priority
) VALUES (
    'evaluation.default.period',
    '默认评价周期',
    '评价设置',
    'MONTHLY',
    'STRING',
    '["WEEKLY", "MONTHLY", "SEMESTER"]',
    1, 1,
    'ACTIVE', 50
);
```

### 更新示例

#### 1. 更新配置值
```sql
UPDATE dim_system_config
SET config_value = '0.35',
    update_time = NOW(),
    update_by = 1,
    version = version + 1
WHERE config_key = 'quality.weights.participation';
```

#### 2. 批量更新配置状态
```sql
UPDATE dim_system_config
SET status = 'INACTIVE',
    update_time = NOW()
WHERE config_group = '废弃配置'
  AND status = 'ACTIVE';
```

### 配置缓存实现

#### Redis缓存配置
```python
def get_config(config_key, default=None):
    # 先从缓存获取
    cache_key = f"sys_config:{config_key}"
    config_value = redis_client.get(cache_key)

    if config_value is None:
        # 从数据库获取
        config = db.query(
            "SELECT config_value FROM dim_system_config "
            "WHERE config_key = %s AND status = 'ACTIVE'",
            (config_key,)
        )
        if config:
            config_value = config[0]['config_value']
            # 缓存配置值
            redis_client.setex(cache_key, 3600, config_value)
        else:
            config_value = default

    return config_value
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：配置键必须唯一
2. **类型检查**：配置值必须符合定义类型
3. **范围检查**：数值配置必须在指定范围内
4. **格式检查**：配置值必须符合验证规则

### 数据清洗规则
1. **重复配置处理**：删除重复的配置键
2. **无效值处理**：修正或删除无效的配置值
3. **类型转换**：统一配置值的数据类型
4. **默认值填充**：为空值设置默认值

## 性能优化

### 缓存策略
- 热重载配置缓存到Redis
- 静态配置内存缓存
- 分层缓存提高访问性能

### 查询优化
- 配置键建立唯一索引
- 配置分组建立普通索引
- 避免频繁的配置查询

### 存储优化
- 敏感配置加密存储
- 大文本配置压缩存储
- 定期清理废弃配置

## 安全考虑

### 数据保护
- 敏感配置加密存储
- 配置访问权限控制
- 配置变更审计日志

### 访问控制
- 系统配置需要管理员权限
- 敏感配置查看需要特殊授权
- 配置修改需要二次确认

## 扩展说明

### 未来扩展方向
1. **配置模板**：支持配置模板和批量导入
2. **配置继承**：支持配置的继承和覆盖
3. **配置版本**：支持配置的版本管理
4. **配置分析**：增强配置使用分析功能

### 兼容性说明
- 支持配置文件导入导出
- 支持环境变量配置
- 支持配置中心集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*