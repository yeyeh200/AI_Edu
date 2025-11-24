# 数据字典实体 (DataDictionary)

---

**实体编号：** DM-SYS-006
**实体名称：** 数据字典实体
**所属域：** 系统管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

数据字典实体是AI助评应用系统管理域的基础配置实体，定义了系统全局的数据字典和代码表。该实体描述了数据字典的基础信息、字典项配置、代码值定义、业务规则等，为系统配置、代码管理、数据标准化、业务规则配置等提供数据字典维度支撑。

## 实体定义

### 表名
- **物理表名：** `dim_data_dictionary`
- **业务表名：** 数据字典表
- **数据类型：** 维度表

### 主要用途
- 定义系统数据字典
- 管理代码表配置
- 维护业务规则代码
- 提供数据标准化支持

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 字典项唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| dict_code | VARCHAR | 50 | NOT NULL | '' | 字典编码（系统唯一） |
| dict_name | VARCHAR | 200 | NOT NULL | '' | 字典名称 |
| dict_alias | VARCHAR | 100 | NULL | NULL | 字典别名 |
| dict_category | ENUM | - | NOT NULL | 'BUSINESS' | 字典分类 |
| dict_type | ENUM | - | NOT NULL | 'CODE_TABLE' | 字典类型 |
| dict_level | ENUM | - | NOT NULL | 'SYSTEM' | 字典级别 |
| dict_description | TEXT | - | NULL | NULL | 字典描述 |
| business_domain | VARCHAR | 100 | NULL | NULL | 业务域 |
| module_name | VARCHAR | 100 | NULL | NULL | 模块名称 |
| function_name | VARCHAR | 100 | NULL | NULL | 功能名称 |

### 字典项字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| item_code | VARCHAR | 100 | NOT NULL | '' | 字典项编码 |
| item_name | VARCHAR | 200 | NOT NULL | '' | 字典项名称 |
| item_alias | VARCHAR | 100 | NULL | NULL | 字典项别名 |
| item_value | VARCHAR | 500 | NULL | NULL | 字典项值 |
| item_order | INT | 11 | NOT NULL | 0 | 排序序号 |
| parent_code | VARCHAR | 100 | NULL | NULL | 父项编码 |
| item_level | INT | 11 | NULL | 1 | 项级别 |
| item_path | VARCHAR | 500 | NULL | NULL | 项路径 |
| is_leaf | TINYINT | 1 | NOT NULL | 1 | 是否叶子节点 |
| is_enabled | TINYINT | 1 | NOT NULL | 1 | 是否启用 |
| is_default | TINYINT | 1 | NOT NULL | 0 | 是否默认项 |

### 数据特征字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| data_type | ENUM | - | NOT NULL | 'STRING' | 数据类型 |
| data_length | INT | 11 | NULL | 0 | 数据长度 |
| data_precision | INT | 11 | NULL | 0 | 数据精度 |
| data_scale | INT | 11 | NULL | 0 | 数据小数位 |
| value_format | VARCHAR | 100 | NULL | NULL | 值格式 |
| value_pattern | VARCHAR | 200 | NULL | NULL | 值模式 |
| value_min | VARCHAR | 100 | NULL | NULL | 最小值 |
| value_max | VARCHAR | 100 | NULL | NULL | 最大值 |
| allowed_values | JSON | - | NULL | NULL | 允许值列表 |
| validation_rule | VARCHAR | 500 | NULL | NULL | 验证规则 |

### 业务规则字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| business_rule | TEXT | - | NULL | NULL | 业务规则 |
| constraint_rule | TEXT | - | NULL | NULL | 约束规则 |
| transformation_rule | TEXT | - | NULL | NULL | 转换规则 |
| mapping_rule | TEXT | - | NULL | NULL | 映射规则 |
| calculation_rule | TEXT | - | NULL | NULL | 计算规则 |
| validation_logic | TEXT | - | NULL | NULL | 验证逻辑 |
| business_condition | TEXT | - | NULL | NULL | 业务条件 |
| exception_handling | TEXT | - | NULL | NULL | 异常处理 |

### 国际化字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| language_code | VARCHAR | 10 | NOT NULL | 'zh-CN' | 语言代码 |
| i18n_key | VARCHAR | 200 | NULL | NULL | 国际化键 |
| display_name | VARCHAR | 200 | NULL | NULL | 显示名称 |
| display_name_en | VARCHAR | 200 | NULL | NULL | 英文显示名 |
| display_name_zh | VARCHAR | 200 | NULL | NULL | 中文显示名 |
| description_i18n | JSON | - | NULL | NULL | 多语言描述 |
| tooltip_text | TEXT | - | NULL | NULL | 提示文本 |
| help_text | TEXT | - | NULL | NULL | 帮助文本 |
| comment_text | TEXT | - | NULL | NULL | 注释文本 |

### 扩展属性字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| ext_attributes | JSON | - | NULL | NULL | 扩展属性 |
| custom_properties | JSON | - | NULL | NULL | 自定义属性 |
| metadata | JSON | - | NULL | NULL | 元数据 |
| config_parameters | JSON | - | NULL | NULL | 配置参数 |
| runtime_properties | JSON | - | NULL | NULL | 运行时属性 |
| environment_specific | JSON | - | NULL | NULL | 环境特定属性 |
| version_specific | JSON | - | NULL | NULL | 版本特定属性 |
| feature_flags | JSON | - | NULL | NULL | 功能标志 |

### 关联关系字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| related_dicts | JSON | - | NULL | NULL | 关联字典 |
| reference_tables | JSON | - | NULL | NULL | 引用表 |
| foreign_keys | JSON | - | NULL | NULL | 外键关系 |
| lookup_tables | JSON | - | NULL | NULL | 查找表 |
| dependency_rules | JSON | - | NULL | NULL | 依赖规则 |
| cascade_rules | JSON | - | NULL | NULL | 级联规则 |
| sync_rules | JSON | - | NULL | NULL | 同步规则 |
| integration_points | JSON | - | NULL | NULL | 集成点 |

### 使用统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| usage_count | BIGINT | 20 | NOT NULL | 0 | 使用次数 |
| reference_count | BIGINT | 20 | NOT NULL | 0 | 引用次数 |
| last_access_time | DATETIME | - | NULL | NULL | 最后访问时间 |
| access_frequency | DECIMAL | 8,2 | NULL | 0.00 | 访问频率 |
| hit_rate | DECIMAL | 5,2 | NULL | 0.00 | 命中率 |
| cache_hit_count | BIGINT | 20 | NULL | 0 | 缓存命中次数 |
| performance_metrics | JSON | - | NULL | NULL | 性能指标 |
| optimization_suggestions | JSON | - | NULL | NULL | 优化建议 |

### 版本管理字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| version | VARCHAR | 20 | NOT NULL | 'V1.0' | 版本号 |
| version_description | VARCHAR | 500 | NULL | NULL | 版本描述 |
| version_type | ENUM | - | NULL | 'MAJOR' | 版本类型 |
| release_date | DATE | - | NULL | NULL | 发布日期 |
| deprecation_date | DATE | - | NULL | NULL | 弃用日期 |
| retirement_date | DATE | - | NULL | NULL | 停用日期 |
| compatibility_version | VARCHAR | 20 | NULL | NULL | 兼容版本 |
| migration_rules | JSON | - | NULL | NULL | 迁移规则 |
| change_history | JSON | - | NULL | NULL | 变更历史 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| dict_status | ENUM | - | NOT NULL | 'ACTIVE' | 字典状态 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| publication_status | ENUM | - | NULL | NULL | 发布状态 |
| validation_status | ENUM | - | NULL | NULL | 验证状态 |
| sync_status | ENUM | - | NULL | NULL | 同步状态 |
| is_standardized | TINYINT | 1 | NOT NULL | 0 | 是否标准化 |
| is_deprecated | TINYINT | 1 | NOT NULL | 0 | 是否弃用 |
| is_experimental | TINYINT | 1 | NOT NULL | 0 | 是否实验性 |
| is_readonly | TINYINT | 1 | NOT NULL | 0 | 是否只读 |

### 质量保证字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| data_quality_score | DECIMAL | 5,2 | NULL | 0.00 | 数据质量评分 |
| completeness_score | DECIMAL | 5,2 | NULL | 0.00 | 完整性评分 |
| accuracy_score | DECIMAL | 5,2 | NULL | 0.00 | 准确性评分 |
| consistency_score | DECIMAL | 5,2 | NULL | 0.00 | 一致性评分 |
| validation_results | JSON | - | NULL | NULL | 验证结果 |
| quality_checks | JSON | - | NULL | NULL | 质量检查 |
| compliance_level | ENUM | - | NULL | NULL | 合规级别 |
| certification_status | ENUM | - | NULL | NULL | 认证状态 |

### 权限控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| owner_id | BIGINT | 20 | NOT NULL | 0 | 所有者ID |
| owner_name | VARCHAR | 100 | NOT NULL | '' | 所有者姓名 |
| maintainer_id | BIGINT | 20 | NULL | NULL | 维护人ID |
| maintainer_name | VARCHAR | 100 | NULL | NULL | 维护人姓名 |
| access_level | ENUM | - | NULL | 'PUBLIC' | 访问级别 |
| modify_permission | JSON | - | NULL | NULL | 修改权限 |
| view_permission | JSON | - | NULL | NULL | 查看权限 |
| export_permission | JSON | - | NULL | NULL | 导出权限 |
| security_classification | ENUM | - | NULL | 'INTERNAL' | 安全分类 |

### 审计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| approve_by | BIGINT | 20 | NULL | NULL | 审批人ID |
| approve_time | DATETIME | - | NULL | NULL | 审批时间 |
| last_review_time | DATETIME | - | NULL | NULL | 最后审查时间 |
| audit_trail | JSON | - | NULL | NULL | 审计跟踪 |
| change_log | TEXT | - | NULL | NULL | 变更日志 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| version_lock | INT | 11 | NOT NULL | 1 | 版本锁（乐观锁） |
| checksum | VARCHAR | 64 | NULL | NULL | 数据校验码 |
| external_id | VARCHAR | 100 | NULL | NULL | 外部系统ID |
| source_system | VARCHAR | 100 | NULL | NULL | 来源系统 |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |
| etl_batch_id | VARCHAR | 50 | NULL | NULL | ETL批次ID |
| tags | JSON | - | NULL | NULL | 标签 |
| searchable_text | TEXT | - | NULL | NULL | 可搜索文本 |
| index_fields | JSON | - | NULL | NULL | 索引字段 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_dict_code (dict_code, item_code, language_code)
UNIQUE KEY uk_item_unique (dict_code, item_name, parent_code)
```

### 外键约束
```sql
FOREIGN KEY (owner_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (maintainer_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (approve_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_dict_code (dict_code)
INDEX idx_item_code (item_code)
INDEX idx_dict_category (dict_category)
INDEX idx_dict_type (dict_type)
INDEX idx_dict_level (dict_level)
INDEX idx_dict_status (dict_status)
INDEX idx_parent_code (parent_code)
INDEX idx_item_level (item_level)
INDEX idx_is_enabled (is_enabled)
INDEX idx_language_code (language_code)
INDEX idx_version (version)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_dict_item_status (dict_code, item_code, dict_status)
INDEX idx_category_status (dict_category, dict_status)
INDEX idx_parent_enabled (parent_code, is_enabled)
INDEX idx_level_order (item_level, item_order)
INDEX idx_owner_status (owner_id, dict_status)
```

### 全文索引
```sql
FULLTEXT INDEX idx_search_text (searchable_text, item_name, dict_description)
```

### 检查约束
```sql
CHECK (dict_category IN ('BUSINESS', 'SYSTEM', 'TECHNICAL', 'UI', 'SECURITY', 'COMPLIANCE', 'INTEGRATION', 'REFERENCE'))
CHECK (dict_type IN ('CODE_TABLE', 'ENUMERATION', 'CLASSIFICATION', 'LOOKUP', 'CONFIGURATION', 'METADATA', 'CONSTRAINT', 'VALIDATION'))
CHECK (dict_level IN ('SYSTEM', 'APPLICATION', 'MODULE', 'FUNCTION', 'BUSINESS'))
CHECK (data_type IN ('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'DATE', 'DATETIME', 'JSON', 'BLOB'))
CHECK (version_type IN ('MAJOR', 'MINOR', 'PATCH', 'HOTFIX'))
CHECK (dict_status IN ('ACTIVE', 'INACTIVE', 'DRAFT', 'PENDING', 'DEPRECATED', 'ARCHIVED'))
CHECK (approval_status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'))
CHECK (publication_status IN ('NOT_PUBLISHED', 'PUBLISHED', 'RETRACTED'))
CHECK (validation_status IN ('NOT_VALIDATED', 'VALIDATING', 'VALID', 'INVALID', 'ERROR'))
CHECK (sync_status IN ('NOT_SYNCED', 'SYNCING', 'SYNCED', 'FAILED'))
CHECK (access_level IN ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL'))
CHECK (security_classification IN ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'SECRET'))
CHECK (compliance_level IN ('NONE', 'BASIC', 'STANDARD', 'ENHANCED', 'CRITICAL'))
CHECK (certification_status IN ('NOT_CERTIFIED', 'IN_PROGRESS', 'CERTIFIED', 'EXPIRED'))
CHECK (is_enabled IN (0, 1))
CHECK (is_default IN (0, 1))
CHECK (is_leaf IN (0, 1))
CHECK (is_standardized IN (0, 1))
CHECK (is_deprecated IN (0, 1))
CHECK (is_experimental IN (0, 1))
CHECK (is_readonly IN (0, 1))
CHECK (item_order >= 0)
CHECK (item_level > 0)
CHECK (data_length >= 0)
CHECK (data_precision >= 0)
CHECK (data_scale >= 0)
CHECK (usage_count >= 0)
CHECK (reference_count >= 0)
CHECK (cache_hit_count >= 0)
CHECK (hit_rate BETWEEN 0 AND 100)
CHECK (data_quality_score BETWEEN 0 AND 100)
CHECK (completeness_score BETWEEN 0 AND 100)
CHECK (accuracy_score BETWEEN 0 AND 100)
CHECK (consistency_score BETWEEN 0 AND 100)
```

## 枚举值定义

### 字典分类 (dict_category)
| 值 | 说明 | 备注 |
|----|------|------|
| BUSINESS | 业务 | 业务相关字典 |
| SYSTEM | 系统 | 系统相关字典 |
| TECHNICAL | 技术 | 技术相关字典 |
| UI | 界面 | 界面相关字典 |
| SECURITY | 安全 | 安全相关字典 |
| COMPLIANCE | 合规 | 合规相关字典 |
| INTEGRATION | 集成 | 集成相关字典 |
| REFERENCE | 参考 | 参考数据字典 |

### 字典类型 (dict_type)
| 值 | 说明 | 备注 |
|----|------|------|
| CODE_TABLE | 代码表 | 系统代码表 |
| ENUMERATION | 枚举 | 枚举值定义 |
| CLASSIFICATION | 分类 | 分类标准 |
| LOOKUP | 查找 | 查找表 |
| CONFIGURATION | 配置 | 配置参数 |
| METADATA | 元数据 | 元数据定义 |
| CONSTRAINT | 约束 | 约束规则 |
| VALIDATION | 验证 | 验证规则 |

### 字典状态 (dict_status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 活跃 | 正常使用中 |
| INACTIVE | 非活跃 | 暂停使用 |
| DRAFT | 草稿 | 草稿状态 |
| PENDING | 待定 | 等待审批 |
| DEPRECATED | 已弃用 | 已弃用但仍可用 |
| ARCHIVED | 已归档 | 已归档不可用 |

## 关联关系

### 多对一关系（作为从表）
- **DataDictionary → User（owner）**：数据字典属于所有者
- **DataDictionary → User（maintainer）**：数据字典有关联维护人
- **DataDictionary → User（creator）**：数据字典关联创建人
- **DataDictionary → User（updater）**：数据字典关联更新人
- **DataDictionary → User（approver）**：数据字典有审批人

### 自关联关系
- **DataDictionary → DataDictionary（parent）**：字典项可以有父项

### 一对多关系（作为主表）
- **DataDictionary → DictionaryUsage**：一个字典项有多个使用记录
- **DataDictionary → DictionaryValidation**：一个字典项有多个验证记录

### 多对多关系
- **DataDictionary ↔ Module**：通过中间表关联模块
- **DataDictionary ↔ SystemConfig**：通过中间表关联系统配置

## 使用示例

### 查询示例

#### 1. 查询用户状态字典
```sql
SELECT
    d.dict_code,
    d.item_code,
    d.item_name,
    d.item_value,
    d.item_order,
    d.is_default,
    d.is_enabled,
    d.dict_status,
    d.description_i18n
FROM dim_data_dictionary d
WHERE d.dict_code = 'USER_STATUS'
  AND d.is_enabled = 1
  AND d.dict_status = 'ACTIVE'
  AND d.language_code = 'zh-CN'
ORDER BY d.item_order;
```

#### 2. 查询系统配置字典
```sql
SELECT
    d.dict_code,
    d.dict_name,
    d.dict_category,
    d.dict_type,
    d.item_code,
    d.item_name,
    d.item_value,
    d.data_type,
    d.default_value,
    d.validation_rule,
    d.description_i18n,
    d.config_parameters
FROM dim_data_dictionary d
WHERE d.dict_category = 'SYSTEM'
  AND d.dict_type = 'CONFIGURATION'
  AND d.is_enabled = 1
  AND d.dict_status = 'ACTIVE'
ORDER BY d.dict_code, d.item_order;
```

#### 3. 查询树形结构字典
```sql
SELECT
    d.item_code,
    d.item_name,
    d.parent_code,
    d.item_level,
    d.item_path,
    d.is_leaf,
    d.item_order,
    d.is_enabled,
    d.ext_attributes
FROM dim_data_dictionary d
WHERE d.dict_code = 'ORGANIZATION_STRUCTURE'
  AND d.is_enabled = 1
  AND d.dict_status = 'ACTIVE'
ORDER BY d.item_level, d.item_order;
```

#### 4. 查询国际化字典
```sql
SELECT
    d.dict_code,
    d.item_code,
    d.item_name,
    d.item_value,
    d.language_code,
    d.display_name,
    d.display_name_en,
    d.display_name_zh,
    d.tooltip_text,
    d.help_text
FROM dim_data_dictionary d
WHERE d.dict_code = 'SYSTEM_MESSAGES'
  AND d.is_enabled = 1
  AND d.dict_status = 'ACTIVE'
ORDER BY d.item_code, d.language_code;
```

#### 5. 查询字典使用统计
```sql
SELECT
    d.dict_code,
    d.dict_name,
    d.dict_category,
    COUNT(*) as item_count,
    SUM(d.usage_count) as total_usage,
    AVG(d.hit_rate) as avg_hit_rate,
    MAX(d.last_access_time) as last_access,
    d.dict_status,
    d.version
FROM dim_data_dictionary d
GROUP BY d.dict_code, d.dict_name, d.dict_category, d.dict_status, d.version
ORDER BY total_usage DESC, item_count DESC;
```

### 插入示例

#### 1. 创建用户状态字典
```sql
INSERT INTO dim_data_dictionary (
    dict_code, dict_name, dict_category, dict_type,
    dict_description, business_domain,
    item_code, item_name, item_value,
    item_order, is_default, is_enabled,
    language_code, display_name,
    dict_status, is_standardized,
    owner_id, owner_name,
    create_by
) VALUES (
    'USER_STATUS', '用户状态', 'BUSINESS', 'ENUMERATION',
    '系统用户状态定义', 'USER_MANAGEMENT',
    'ACTIVE', '活跃', '1',
    1, 1, 1,
    'zh-CN', '正常活跃用户',
    'ACTIVE', 1,
    10001, '系统管理员',
    10001
),
(
    'USER_STATUS', '用户状态', 'BUSINESS', 'ENUMERATION',
    '系统用户状态定义', 'USER_MANAGEMENT',
    'INACTIVE', '非活跃', '0',
    2, 0, 1,
    'zh-CN', '非活跃用户',
    'ACTIVE', 1,
    10001, '系统管理员',
    10001
);
```

#### 2. 创建系统配置字典
```sql
INSERT INTO dim_data_dictionary (
    dict_code, dict_name, dict_category, dict_type,
    item_code, item_name, item_value,
    data_type, validation_rule,
    description_i18n, config_parameters,
    dict_status, access_level,
    create_by
) VALUES (
    'SYSTEM_CONFIG', '系统配置', 'SYSTEM', 'CONFIGURATION',
    'MAX_LOGIN_ATTEMPTS', '最大登录尝试次数', '5',
    'INTEGER', 'value >= 1 AND value <= 10',
    '{"zh-CN": "用户登录最大尝试次数配置"}',
    '{"min": 1, "max": 10, "default": 5}',
    'ACTIVE', 'INTERNAL',
    10001
);
```

#### 3. 创建树形组织结构字典
```sql
INSERT INTO dim_data_dictionary (
    dict_code, dict_name, dict_category, dict_type,
    item_code, item_name, parent_code, item_level,
    item_path, item_order, is_leaf, is_enabled,
    ext_attributes, dict_status,
    create_by
) VALUES (
    'ORGANIZATION', '组织架构', 'BUSINESS', 'CLASSIFICATION',
    'ROOT', '根组织', NULL, 1,
    '/ROOT', 1, 0, 1,
    '{"type": "root", "level": "company"}',
    'ACTIVE', 10001
),
(
    'ORGANIZATION', '组织架构', 'BUSINESS', 'CLASSIFICATION',
    'FACULTY_001', '计算机学院', 'ROOT', 2,
    '/ROOT/FACULTY_001', 1, 0, 1,
    '{"type": "faculty", "code": "CS"}',
    'ACTIVE', 10001
);
```

### 更新示例

#### 1. 更新字典项使用统计
```sql
UPDATE dim_data_dictionary
SET usage_count = usage_count + 1,
    last_access_time = NOW(),
    hit_rate = ROUND((cache_hit_count + 1) * 100.0 / (usage_count + 1), 2),
    performance_metrics = JSON_OBJECT(
        'last_access', NOW(),
        'avg_response_time', 15.5,
        'cache_efficiency', 95.2
    ),
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE dict_code = 'USER_STATUS'
  AND item_code = 'ACTIVE'
  AND id = 1001;
```

#### 2. 更新字典版本
```sql
UPDATE dim_data_dictionary
SET version = 'V2.0',
    version_description = '新增SUSPENDED状态项',
    version_type = 'MINOR',
    release_date = CURDATE(),
    change_history = JSON_ARRAY(
        '{"version": "V2.0", "change": "新增SUSPENDED状态", "date": "2024-01-23"}'
    ),
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE dict_code = 'USER_STATUS'
  AND dict_status = 'ACTIVE';
```

#### 3. 更新字典状态
```sql
UPDATE dim_data_dictionary
SET dict_status = 'DEPRECATED',
    is_deprecated = 1,
    deprecation_date = CURDATE(),
    retirement_date = DATE_ADD(CURDATE(), INTERVAL 6 MONTH),
    approval_status = 'APPROVED',
    approve_by = 20001,
    approve_time = NOW(),
    update_time = NOW(),
    version_lock = version_lock + 1
WHERE dict_code = 'OLD_STATUS_CODES'
  AND dict_status = 'ACTIVE';
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：字典编码+项编码+语言必须唯一
2. **完整性检查**：基础信息、编码名称等关键字段不能为空
3. **逻辑检查**：层级关系合理，父子关系一致
4. **关联检查**：所有者、维护人ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的字典项
2. **层级修正**：修正错误的层级关系
3. **编码标准化**：统一字典编码格式
4. **国际化同步**：同步多语言数据

## 性能优化

### 索引优化
- 字典编码和项编码建立复合唯一索引
- 状态和启用标志建立复合索引
- 层级和排序建立复合索引

### 查询优化
- 使用覆盖索引优化字典查询
- 按分类和状态分区存储
- 建立全文索引支持模糊搜索

### 存储优化
- JSON配置字段压缩存储
- 多语言数据分离存储
- 定期清理过期数据

## 安全考虑

### 数据保护
- 敏感字典数据加密存储
- 配置参数访问控制
- 变更记录安全保护

### 权限控制
- 字典创建需要管理员权限
- 敏感字典修改需要审批
- 生产字典访问需要授权

## 扩展说明

### 未来扩展方向
1. **动态字典**：支持运行时动态字典
2. **版本管理**：完整的字典版本控制
3. **智能推荐**：基于使用数据的智能推荐
4. **可视化配置**：图形化字典配置界面

### 兼容性说明
- 支持标准数据字典格式
- 支持多种编码格式
- 支持第三方字典系统集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*