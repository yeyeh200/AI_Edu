# 评价指标实体 (EvaluationIndicator)

---

**实体编号：** DM-EVAL-003
**实体名称：** 评价指标实体
**所属域：** 评价分析域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

评价指标实体是AI助评应用评价分析域的核心维度实体，定义了教学质量评价的具体指标体系。该实体描述了评价的分类、维度、指标、标准、权重等，为教学质量评价提供标准化的评价体系和量化指标，支持多维度、多层次的教学质量评价和分析。

## 实体定义

### 表名
- **物理表名：** `dim_evaluation_indicator`
- **业务表名：** 评价指标表
- **数据类型：** 维度表

### 主要用途
- 定义评价指标体系
- 管理评价标准规范
- 支持评价权重配置
- 提供评价维度分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 评价指标唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| indicator_code | VARCHAR | 50 | NOT NULL | '' | 评价指标编码 |
| indicator_name | VARCHAR | 200 | NOT NULL | '' | 评价指标名称 |
| indicator_alias | VARCHAR | 100 | NULL | NULL | 评价指标别名 |
| indicator_category | ENUM | - | NOT NULL | 'TEACHING' | 指标类别 |
| indicator_dimension | ENUM | - | NOT NULL | 'CONTENT' | 指标维度 |
| indicator_type | ENUM | - | NOT NULL | 'QUANTITATIVE' | 指标类型 |
| evaluation_level | ENUM | - | NOT NULL | 'MICRO' | 评价层级 |

### 层级结构字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| parent_id | BIGINT | 20 | NULL | NULL | 父指标ID |
| parent_code | VARCHAR | 50 | NULL | NULL | 父指标编码 |
| level | INT | 11 | NOT NULL | 1 | 指标层级 |
| path | VARCHAR | 500 | NOT NULL | '' | 指标路径 |
| sort_order | INT | 11 | NOT NULL | 0 | 排序顺序 |
| is_leaf | TINYINT | 1 | NOT NULL | 1 | 是否叶子节点 |

### 指标描述字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| indicator_description | TEXT | - | NOT NULL | '' | 指标描述 |
| evaluation_objective | TEXT | - | NULL | NULL | 评价目标 |
| measurement_method | TEXT | - | NULL | NULL | 测量方法 |
| data_source | VARCHAR | 200 | NULL | NULL | 数据来源 |
| evaluation_basis | TEXT | - | NULL | NULL | 评价依据 |
| calculation_formula | TEXT | - | NULL | NULL | 计算公式 |
| scoring_rules | TEXT | - | NULL | NULL | 评分规则 |
| quality_standards | TEXT | - | NULL | NULL | 质量标准 |

### 评分标准字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| score_type | ENUM | - | NOT NULL | 'PERCENTAGE' | 分值类型 |
| min_score | DECIMAL | 8,2 | NOT NULL | 0.00 | 最低分 |
| max_score | DECIMAL | 8,2 | NOT NULL | 100.00 | 最高分 |
| default_score | DECIMAL | 8,2 | NULL | 0.00 | 默认分 |
| passing_score | DECIMAL | 8,2 | NULL | 60.00 | 及格分 |
| excellent_score | DECIMAL | 8,2 | NULL | 90.00 | 优秀分 |
| score_levels | JSON | - | NULL | NULL | 分数等级定义 |
| scoring_criteria | JSON | - | NULL | NULL | 评分标准详情 |

### 权重配置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| weight_type | ENUM | - | NOT NULL | 'FIXED' | 权重类型 |
| default_weight | DECIMAL | 5,2 | NOT NULL | 0.00 | 默认权重 |
| min_weight | DECIMAL | 5,2 | NULL | 0.00 | 最小权重 |
| max_weight | DECIMAL | 5,2 | NULL | 100.00 | 最大权重 |
| weight_calculation | VARCHAR | 200 | NULL | NULL | 权重计算方式 |
| is_optional | TINYINT | 1 | NOT NULL | 0 | 是否可选指标 |
| mandatory_weight | DECIMAL | 5,2 | NULL | 0.00 | 强制权重 |

### 数据规则字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| data_type | ENUM | - | NOT NULL | 'NUMERIC' | 数据类型 |
| value_type | ENUM | - | NOT NULL | 'ABSOLUTE' | 数值类型 |
| data_unit | VARCHAR | 20 | NULL | NULL | 数据单位 |
| precision_digits | INT | 11 | NULL | 2 | 精度位数 |
| decimal_places | INT | 11 | NULL | 2 | 小数位数 |
| value_range | JSON | - | NULL | NULL | 取值范围 |
| validation_rules | JSON | - | NULL | NULL | 验证规则 |
| aggregation_method | ENUM | - | NULL | NULL | 聚合方法 |
| comparison_method | ENUM | - | NULL | NULL | 对比方法 |

### 适用范围字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| apply_to_teaching_type | JSON | - | NULL | NULL | 适用教学类型 |
| apply_to_course_type | JSON | - | NULL | NULL | 适用课程类型 |
| apply_to_teacher_level | JSON | - | NULL | NULL | 适用教师层级 |
| apply_to_student_type | JSON | - | NULL | NULL | 适用学生类型 |
| apply_to_class_level | JSON | - | NULL | NULL | 适用班级层次 |
| apply_to_evaluation_period | JSON | - | NULL | NULL | 适用评价周期 |
|适用场景描述 | TEXT | - | NULL | NULL | 适用场景说明 |

### 关联配置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| related_indicators | JSON | - | NULL | NULL | 关联指标 |
| dependent_indicators | JSON | - | NULL | NULL | 依赖指标 |
| exclusive_indicators | JSON | - | NULL | NULL | 互斥指标 |
| prerequisite_indicators | JSON | - | NULL | NULL | 前置指标 |
| template_usage | JSON | - | NULL | NULL | 模板使用情况 |
| evaluation_methods | JSON | - | NULL | NULL | 评价方法 |

### 质量控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| reliability_criterion | DECIMAL | 5,2 | NULL | 0.80 | 信度标准 |
| validity_criterion | DECIMAL | 5,2 | NULL | 0.80 | 效度标准 |
| discrimination_index | DECIMAL | 5,2 | NULL | 0.00 | 区分度指标 |
| difficulty_index | DECIMAL | 5,2 | NULL | 0.00 | 难度指数 |
| correlation_coefficient | DECIMAL | 5,2 | NULL | 0.00 | 相关系数 |
| standard_deviation | DECIMAL | 8,2 | NULL | 0.00 | 标准差 |
| quality_level | ENUM | - | NULL | NULL | 质量等级 |

### 使用统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| usage_count | INT | 11 | NOT NULL | 0 | 使用次数 |
| last_used_time | DATETIME | - | NULL | NULL | 最后使用时间 |
| average_score | DECIMAL | 5,2 | NULL | 0.00 | 平均得分 |
| score_variance | DECIMAL | 8,2 | NULL | 0.00 | 得分方差 |
| completion_rate | DECIMAL | 5,2 | NULL | 0.00 | 完成率 |
| satisfaction_rate | DECIMAL | 5,2 | NULL | 0.00 | 满意度 |
| improvement_suggestions | TEXT | - | NULL | NULL | 改进建议 |
| best_practices | TEXT | - | NULL | NULL | 最佳实践 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| indicator_status | ENUM | - | NOT NULL | 'ACTIVE' | 指标状态 |
| publish_status | ENUM | - | NOT NULL | 'PUBLISHED' | 发布状态 |
| version_status | ENUM | - | NULL | NULL | 版本状态 |
| is_system_indicator | TINYINT | 1 | NOT NULL | 0 | 是否系统指标 |
| is_custom_indicator | TINYINT | 1 | NOT NULL | 0 | 是否自定义指标 |
| enable_ai_analysis | TINYINT | 1 | NOT NULL | 0 | 启用AI分析 |
| enable_auto_scoring | TINYINT | 1 | NOT NULL | 0 | 启用自动评分 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NOT NULL | 0 | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| approval_status | ENUM | - | NULL | 'PENDING' | 审批状态 |
| approval_by | BIGINT | 20 | NULL | NULL | 审批人ID |
| approval_time | DATETIME | - | NULL | NULL | 审批时间 |
| external_code | VARCHAR | 100 | NULL | NULL | 外部编码 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_indicator_code (indicator_code)
UNIQUE KEY uk_parent_code_name (parent_id, indicator_name)
```

### 外键约束
```sql
FOREIGN KEY (parent_id) REFERENCES dim_evaluation_indicator(id) ON DELETE CASCADE
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (approval_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_parent_id (parent_id)
INDEX idx_indicator_category (indicator_category)
INDEX idx_indicator_dimension (indicator_dimension)
INDEX idx_indicator_type (indicator_type)
INDEX idx_evaluation_level (evaluation_level)
INDEX idx_indicator_status (indicator_status)
INDEX idx_publish_status (publish_status)
INDEX idx_level (level)
INDEX idx_is_leaf (is_leaf)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_category_dimension (indicator_category, indicator_dimension)
INDEX idx_status_level (indicator_status, level)
INDEX idx_parent_level (parent_id, level)
```

### 检查约束
```sql
CHECK (indicator_category IN ('TEACHING', 'COURSE', 'STUDENT', 'TEACHER', 'RESOURCE', 'MANAGEMENT', 'INNOVATION'))
CHECK (indicator_dimension IN ('CONTENT', 'METHOD', 'EFFECTIVENESS', 'PARTICIPATION', 'INNOVATION', 'ETHICS', 'PROFESSIONALISM'))
CHECK (indicator_type IN ('QUANTITATIVE', 'QUALITATIVE', 'MIXED'))
CHECK (evaluation_level IN ('MICRO', 'MESO', 'MACRO'))
CHECK (level BETWEEN 1 AND 5)
CHECK (sort_order >= 0)
CHECK (is_leaf IN (0, 1))
CHECK (score_type IN ('PERCENTAGE', 'POINTS', 'LEVEL', 'GRADE'))
CHECK (min_score >= 0)
CHECK (max_score > min_score)
CHECK (default_score BETWEEN min_score AND max_score)
CHECK (passing_score BETWEEN min_score AND max_score)
CHECK (excellent_score BETWEEN passing_score AND max_score)
CHECK (weight_type IN ('FIXED', 'VARIABLE', 'DYNAMIC', 'CALCULATED'))
CHECK (default_weight >= 0)
CHECK (default_weight <= 100)
CHECK (min_weight >= 0)
CHECK (max_weight <= 100)
CHECK (min_weight <= max_weight)
CHECK (is_optional IN (0, 1))
CHECK (mandatory_weight BETWEEN 0 AND max_weight)
CHECK (data_type IN ('NUMERIC', 'TEXT', 'BOOLEAN', 'DATE', 'FILE'))
CHECK (value_type IN ('ABSOLUTE', 'RELATIVE', 'RANKING', 'RATING'))
CHECK (precision_digits BETWEEN 0 AND 10)
CHECK (decimal_places BETWEEN 0 AND 10)
CHECK (aggregation_method IN ('SUM', 'AVERAGE', 'WEIGHTED_AVERAGE', 'MAX', 'MIN', 'COUNT'))
CHECK (comparison_method IN ('ABSOLUTE', 'RELATIVE', 'RANKING', 'PERCENTILE'))
CHECK (reliability_criterion BETWEEN 0 AND 1)
CHECK (validity_criterion BETWEEN 0 AND 1)
CHECK (discrimination_index BETWEEN -1 AND 1)
CHECK (difficulty_index BETWEEN 0 AND 1)
CHECK (correlation_coefficient BETWEEN -1 AND 1)
CHECK (standard_deviation >= 0)
CHECK (usage_count >= 0)
CHECK (average_score BETWEEN min_score AND max_score)
CHECK (score_variance >= 0)
CHECK (completion_rate BETWEEN 0 AND 100)
CHECK (satisfaction_rate BETWEEN 0 AND 100)
CHECK (indicator_status IN ('ACTIVE', 'INACTIVE', 'DEPRECATED', 'UNDER_REVIEW'))
CHECK (publish_status IN ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'WITHDRAWN'))
CHECK (version_status IN ('DRAFT', 'TESTING', 'RELEASED', 'DEPRECATED'))
CHECK (is_system_indicator IN (0, 1))
CHECK (is_custom_indicator IN (0, 1))
CHECK (enable_ai_analysis IN (0, 1))
CHECK (enable_auto_scoring IN (0, 1))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVIEW'))
```

## 枚举值定义

### 指标类别 (indicator_category)
| 值 | 说明 | 备注 |
|----|------|------|
| TEACHING | 教学类 | 教学过程指标 |
| COURSE | 课程类 | 课程建设指标 |
| STUDENT | 学生类 | 学习效果指标 |
| TEACHER | 教师类 | 教师发展指标 |
| RESOURCE | 资源类 | 教学资源指标 |
| MANAGEMENT | 管理类 | 教学管理指标 |
| INNOVATION | 创新类 | 教学创新指标 |

### 指标维度 (indicator_dimension)
| 值 | 说明 | 备注 |
|----|------|------|
| CONTENT | 内容维度 | 教学内容质量 |
| METHOD | 方法维度 | 教学方法创新 |
| EFFECTIVENESS | 效果维度 | 教学效果评价 |
| PARTICIPATION | 参与维度 | 学生参与度 |
| INNOVATION | 创新维度 | 教学创新性 |
| ETHICS | 伦理维度 | 教学伦理规范 |
| PROFESSIONALISM | 专业维度 | 专业素养 |

### 指标类型 (indicator_type)
| 值 | 说明 | 备注 |
|----|------|------|
| QUANTITATIVE | 定量指标 | 可量化指标 |
| QUALITATIVE | 定性指标 | 质性评价指标 |
| MIXED | 混合指标 | 定量定性结合 |

### 评价层级 (evaluation_level)
| 值 | 说明 | 备注 |
|----|------|------|
| MICRO | 微观层面 | 单次教学活动 |
| MESO | 中观层面 | 课程/班级层面 |
| MACRO | 宏观层面 | 专业/院系层面 |

### 分值类型 (score_type)
| 值 | 说明 | 备注 |
|----|------|------|
| PERCENTAGE | 百分制 | 0-100分 |
| POINTS | 积分制 | 积分累计 |
| LEVEL | 等级制 | A/B/C等级 |
| GRADE | 等第制 | 优/良/中/差 |

### 权重类型 (weight_type)
| 值 | 说明 | 备注 |
|----|------|------|
| FIXED | 固定权重 | 预设固定权重 |
| VARIABLE | 可变权重 | 根据情况调整 |
| DYNAMIC | 动态权重 | 动态计算权重 |
| CALCULATED | 计算权重 | 基于公式计算 |

### 数据类型 (data_type)
| 值 | 说明 | 备注 |
|----|------|------|
| NUMERIC | 数值型 | 数值数据 |
| TEXT | 文本型 | 文本描述 |
| BOOLEAN | 布尔型 | 是/否选择 |
| DATE | 日期型 | 时间数据 |
| FILE | 文件型 | 文件上传 |

### 指标状态 (indicator_status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 激活 | 正常使用 |
| INACTIVE | 未激活 | 暂不使用 |
| DEPRECATED | 已弃用 | 不再使用 |
| UNDER_REVIEW | 审核中 | 正在审核 |

## 关联关系

### 自引用关系
- **EvaluationIndicator → EvaluationIndicator（parent）**：指标支持层级结构

### 一对多关系（作为主表）
- **EvaluationIndicator → EvaluationTemplateIndicator**：一个指标可在多个模板中使用
- **EvaluationIndicator → EvaluationResult**：一个指标对应多个评价结果

### 多对多关系
- **EvaluationIndicator ↔ EvaluationTemplate**：通过中间表关联

## 使用示例

### 查询示例

#### 1. 查询评价指标体系结构
```sql
SELECT
    i.indicator_code,
    i.indicator_name,
    i.indicator_category,
    i.indicator_dimension,
    i.level,
    i.parent_code,
    i.sort_order,
    i.default_weight,
    i.score_type,
    i.min_score,
    i.max_score,
    i.indicator_status
FROM dim_evaluation_indicator i
WHERE i.indicator_status = 'ACTIVE'
ORDER BY i.level, i.sort_order;
```

#### 2. 查询某类别的所有指标
```sql
SELECT
    indicator_code,
    indicator_name,
    indicator_dimension,
    indicator_type,
    default_weight,
    score_type,
    description,
    evaluation_objective
FROM dim_evaluation_indicator
WHERE indicator_category = 'TEACHING'
  AND indicator_status = 'ACTIVE'
  AND level = 2
ORDER BY sort_order;
```

#### 3. 查询指标使用统计
```sql
SELECT
    i.indicator_name,
    i.indicator_category,
    i.usage_count,
    i.average_score,
    i.completion_rate,
    i.satisfaction_rate,
    i.last_used_time,
    CASE
        WHEN i.usage_count >= 100 THEN 'HIGH_USAGE'
        WHEN i.usage_count >= 50 THEN 'MEDIUM_USAGE'
        WHEN i.usage_count >= 10 THEN 'LOW_USAGE'
        ELSE 'RARELY_USED'
    END as usage_level
FROM dim_evaluation_indicator i
WHERE i.indicator_status = 'ACTIVE'
  AND i.usage_count > 0
ORDER BY i.usage_count DESC;
```

#### 4. 查询指标质量分析
```sql
SELECT
    indicator_category,
    COUNT(*) as total_indicators,
    AVG(reliability_criterion) as avg_reliability,
    AVG(validity_criterion) as avg_validity,
    AVG(discrimination_index) as avg_discrimination,
    AVG(difficulty_index) as avg_difficulty,
    COUNT(CASE WHEN quality_level = 'EXCELLENT' THEN 1 END) as excellent_count,
    COUNT(CASE WHEN quality_level = 'GOOD' THEN 1 END) as good_count,
    COUNT(CASE WHEN quality_level = 'FAIR' THEN 1 END) as fair_count
FROM dim_evaluation_indicator
WHERE indicator_status = 'ACTIVE'
  AND reliability_criterion IS NOT NULL
GROUP BY indicator_category
ORDER BY total_indicators DESC;
```

#### 5. 查询指标层级结构
```sql
-- 递归查询指标层级关系（MySQL 8.0+ CTE）
WITH RECURSIVE indicator_tree AS (
    SELECT
        id, indicator_code, indicator_name, parent_id, level, sort_order,
        CAST(indicator_name AS CHAR(500)) as full_path
    FROM dim_evaluation_indicator
    WHERE parent_id IS NULL AND indicator_status = 'ACTIVE'

    UNION ALL

    SELECT
        child.id, child.indicator_code, child.indicator_name,
        child.parent_id, child.level, child.sort_order,
        CONCAT(parent.full_path, ' > ', child.indicator_name) as full_path
    FROM dim_evaluation_indicator child
    JOIN indicator_tree parent ON child.parent_id = parent.id
    WHERE child.indicator_status = 'ACTIVE'
)
SELECT
    indicator_code,
    indicator_name,
    level,
    sort_order,
    full_path
FROM indicator_tree
ORDER BY level, sort_order;
```

#### 6. 查询权重配置统计
```sql
SELECT
    weight_type,
    COUNT(*) as indicator_count,
    AVG(default_weight) as avg_weight,
    SUM(default_weight) as total_weight,
    COUNT(CASE WHEN is_optional = 0 THEN 1 END) as mandatory_count,
    COUNT(CASE WHEN is_optional = 1 THEN 1 END) as optional_count
FROM dim_evaluation_indicator
WHERE indicator_status = 'ACTIVE'
  AND default_weight > 0
GROUP BY weight_type
ORDER BY total_weight DESC;
```

### 插入示例

#### 1. 创建顶层指标
```sql
INSERT INTO dim_evaluation_indicator (
    indicator_code, indicator_name, indicator_category, indicator_dimension,
    indicator_type, evaluation_level, level, parent_id, path, sort_order,
    indicator_description, score_type, min_score, max_score, default_weight,
    indicator_status, publish_status, create_by
) VALUES (
    'TEACH_CONTENT_001', '教学内容质量', 'TEACHING', 'CONTENT',
    'QUANTITATIVE', 'MICRO', 1, NULL, '/TEACH_CONTENT_001', 1,
    '评价教学内容的科学性、先进性、适用性', 'PERCENTAGE', 0.00, 100.00, 25.00,
    'ACTIVE', 'PUBLISHED', 12345
);
```

#### 2. 创建子指标
```sql
INSERT INTO dim_evaluation_indicator (
    indicator_code, indicator_name, indicator_category, indicator_dimension,
    indicator_type, evaluation_level, level, parent_id, parent_code, path, sort_order,
    indicator_description, evaluation_objective, scoring_rules,
    score_type, min_score, max_score, passing_score, default_weight,
    indicator_status, publish_status, create_by
) VALUES (
    'TEACH_CONTENT_001_01', '内容科学性', 'TEACHING', 'CONTENT',
    'QUANTITATIVE', 'MICRO', 2, 1, 'TEACH_CONTENT_001', '/TEACH_CONTENT_001/TEACH_CONTENT_001_01', 1,
    '评价教学内容的科学性、准确性、前沿性', '确保教学内容无科学错误、符合学科发展', '90-100优秀，80-89良好，60-79及格，<60不及格',
    'PERCENTAGE', 0.00, 100.00, 70.00, 8.00,
    'ACTIVE', 'PUBLISHED', 12345
);
```

#### 3. 创建定性指标
```sql
INSERT INTO dim_evaluation_indicator (
    indicator_code, indicator_name, indicator_category, indicator_dimension,
    indicator_type, evaluation_level, level, parent_id, parent_code, path, sort_order,
    indicator_description, measurement_method, data_type, score_type,
    score_levels, scoring_criteria,
    default_weight, is_optional, indicator_status, publish_status, create_by
) VALUES (
    'TEACH_METHOD_001_01', '教学方法创新性', 'TEACHING', 'METHOD',
    'QUALITATIVE', 'MICRO', 2, 2, 'TEACH_METHOD_001', '/TEACH_METHOD_001/TEACH_METHOD_001_01', 3,
    '评价教学方法的创新性和适用性', '专家评议、学生反馈、同行评价', 'TEXT', 'LEVEL',
    '{"A": "95分", "B": "85分", "C": "75分", "D": "60分"}',
    '{"A": "方法创新、效果显著", "B": "方法较好、有效果", "C": "方法一般、效果一般", "D": "方法传统、效果差"}',
    6.00, 0, 'ACTIVE', 'PUBLISHED', 12345
);
```

### 更新示例

#### 1. 更新指标使用统计
```sql
UPDATE dim_evaluation_indicator
SET usage_count = usage_count + 1,
    last_used_time = NOW(),
    average_score = (average_score * usage_count + 85.5) / (usage_count + 1),
    completion_rate = (completion_rate * usage_count + 95.0) / (usage_count + 1),
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

#### 2. 更新指标质量参数
```sql
UPDATE dim_evaluation_indicator
SET reliability_criterion = 0.85,
    validity_criterion = 0.82,
    discrimination_index = 0.45,
    difficulty_index = 0.62,
    correlation_coefficient = 0.78,
    standard_deviation = 12.5,
    quality_level = 'GOOD',
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

#### 3. 更新指标状态
```sql
UPDATE dim_evaluation_indicator
SET indicator_status = 'DEPRECATED',
    publish_status = 'WITHDRAWN',
    update_time = NOW(),
    version = version + 1
WHERE id = 12345
  AND approval_status = 'APPROVED';
```

## 数据质量

### 质量检查规则
1. **层级检查**：指标层级关系正确，无循环依赖
2. **编码唯一**：指标编码在系统中唯一
3. **权重合理**：同级指标权重总和合理
4. **评分标准**：评分标准逻辑一致

### 数据清洗规则
1. **层级修正**：修复错误的层级关系
2. **编码规范**：统一指标编码格式
3. **权重优化**：调整不合理的权重配置
4. **描述完善**：完善指标描述和说明

## 性能优化

### 索引优化
- 建立层级结构的路径索引
- 建立类别和维度的复合索引
- 建立状态的复合索引

### 查询优化
- 使用CTE优化递归查询
- 避免深度递归查询
- 合理使用缓存机制

### 存储优化
- JSON字段压缩存储
- 历史版本归档
- 定期清理过期数据

## 安全考虑

### 数据保护
- 指标知识产权保护
- 评分标准访问控制
- 审批流程记录保护

### 权限控制
- 指标创建需要专家权限
- 指标修改需要审批权限
- 指标查询分级控制

## 扩展说明

### 未来扩展方向
1. **AI指标推荐**：基于历史数据的指标推荐
2. **动态权重调整**：基于效果的智能权重调整
3. **跨维度关联**：指标间关联分析
4. **质量预测**：指标质量预测模型

### 兼容性说明
- 支持国家标准评价指标体系
- 支持行业特色评价指标
- 支持国际通用评价标准

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*