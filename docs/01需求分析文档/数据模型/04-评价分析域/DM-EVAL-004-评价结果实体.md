# 评价结果实体 (EvaluationResult)

---

**实体编号：** DM-EVAL-004
**实体名称：** 评价结果实体
**所属域：** 评价分析域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

评价结果实体是AI助评应用评价分析域的核心事实实体，记录具体的评价结果数据和详细信息。该实体关联评价记录、评价模板、评价指标等，存储各指标的具体评分、评价意见、改进建议等，为教学质量分析、教学改进、绩效考核等提供详细的数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_evaluation_result`
- **业务表名：** 评价结果表
- **数据类型：** 事实表

### 主要用途
- 存储评价结果数据
- 记录详细评分信息
- 支持结果分析统计
- 提供改进建议数据

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 评价结果唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_record_id | BIGINT | 20 | NOT NULL | 0 | 评价记录ID |
| template_id | BIGINT | 20 | NOT NULL | 0 | 评价模板ID |
| template_name | VARCHAR | 200 | NOT NULL | '' | 评价模板名称 |
| indicator_id | BIGINT | 20 | NOT NULL | 0 | 评价指标ID |
| indicator_code | VARCHAR | 50 | NOT NULL | '' | 评价指标编码 |
| indicator_name | VARCHAR | 200 | NOT NULL | '' | 评价指标名称 |
| evaluator_id | BIGINT | 20 | NOT NULL | 0 | 评价人ID |
| evaluator_name | VARCHAR | 100 | NOT NULL | '' | 评价人姓名 |
| target_id | BIGINT | 20 | NOT NULL | 0 | 被评价对象ID |
| target_name | VARCHAR | 100 | NOT NULL | '' | 被评价对象名称 |

### 评分信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| indicator_weight | DECIMAL | 5,2 | NOT NULL | 0.00 | 指标权重 |
| original_score | DECIMAL | 8,2 | NULL | NULL | 原始评分 |
| normalized_score | DECIMAL | 8,2 | NOT NULL | 0.00 | 标准化评分 |
| weighted_score | DECIMAL | 8,2 | NOT NULL | 0.00 | 加权评分 |
| score_level | ENUM | - | NULL | NULL | 评分等级 |
| percentile_rank | DECIMAL | 5,2 | NULL | NULL | 百分位排名 |
| z_score | DECIMAL | 8,4 | NULL | NULL | Z分数 |
| t_score | DECIMAL | 8,2 | NULL | NULL | T分数 |
| deviation_degree | ENUM | - | NULL | NULL | 偏差程度 |

### 评价详情字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_comments | TEXT | - | NULL | NULL | 评价意见 |
| detailed_feedback | TEXT | - | NULL | NULL | 详细反馈 |
| evidence_description | TEXT | - | NULL | NULL | 证据描述 |
| supporting_materials | JSON | - | NULL | NULL | 支撑材料 |
| observation_notes | TEXT | - | NULL | NULL | 观察记录 |
| specific_examples | TEXT | - | NULL | NULL | 具体事例 |
| strengths_identified | TEXT | - | NULL | NULL | 识别优势 |
| weaknesses_identified | TEXT | - | NULL | NULL | 识别不足 |

### 改进建议字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| improvement_suggestions | TEXT | - | NULL | NULL | 改进建议 |
| action_plan | TEXT | - | NULL | NULL | 行动计划 |
| priority_level | ENUM | - | NULL | NULL | 优先级别 |
| implementation_timeline | VARCHAR | 200 | NULL | NULL | 实施时间表 |
| resource_requirements | TEXT | - | NULL | NULL | 资源需求 |
| expected_outcomes | TEXT | - | NULL | NULL | 预期效果 |
| follow_up_actions | TEXT | - | NULL | NULL | 后续行动 |
| support_needs | TEXT | - | NULL | NULL | 支持需求 |

### 质量评价字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_quality | DECIMAL | 5,2 | NULL | 0.00 | 评价质量 |
| comment_quality | DECIMAL | 5,2 | NULL | 0.00 | 意见质量 |
| evidence_quality | DECIMAL | 5,2 | NULL | 0.00 | 证据质量 |
| constructiveness | DECIMAL | 5,2 | NULL | 0.00 | 建设性 |
| objectivity_rating | DECIMAL | 5,2 | NULL | 0.00 | 客观性评分 |
| fairness_rating | DECIMAL | 5,2 | NULL | 0.00 | 公平性评分 |
| reliability_rating | DECIMAL | 5,2 | NULL | 0.00 | 可靠性评分 |
| validity_rating | DECIMAL | 5,2 | NULL | 0.00 | 有效性评分 |

### 对比分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| historical_average | DECIMAL | 8,2 | NULL | NULL | 历史平均分 |
| peer_average | DECIMAL | 8,2 | NULL | NULL | 同行平均分 |
| department_average | DECIMAL | 8,2 | NULL | NULL | 院系平均分 |
| benchmark_score | DECIMAL | 8,2 | NULL | NULL | 基准分数 |
| target_score | DECIMAL | 8,2 | NULL | NULL | 目标分数 |
| improvement_trend | ENUM | - | NULL | NULL | 改进趋势 |
| performance_gap | DECIMAL | 8,2 | NULL | NULL | 绩效差距 |
| ranking_position | INT | 11 | NULL | NULL | 排名位置 |
| ranking_percentile | DECIMAL | 5,2 | NULL | NULL | 排名百分位 |

### 时间信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_start_time | DATETIME | - | NULL | NULL | 评价开始时间 |
| evaluation_end_time | DATETIME | - | NULL | NULL | 评价结束时间 |
| evaluation_duration | INT | 11 | NULL | 0 | 评价耗时（分钟） |
| submission_time | DATETIME | - | NULL | NULL | 提交时间 |
| review_start_time | DATETIME | - | NULL | NULL | 审核开始时间 |
| review_end_time | DATETIME | - | NULL | NULL | 审核结束时间 |
| finalization_time | DATETIME | - | NULL | NULL | 定稿时间 |
| feedback_time | DATETIME | - | NULL | NULL | 反馈时间 |

### 状态信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| result_status | ENUM | - | NOT NULL | 'DRAFT' | 结果状态 |
| review_status | ENUM | - | NULL | NULL | 审核状态 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| publication_status | ENUM | - | NULL | NULL | 发布状态 |
| is_final_result | TINYINT | 1 | NOT NULL | 0 | 是否最终结果 |
| is_appealed | TINYINT | 1 | NOT NULL | 0 | 是否申诉 |
| appeal_reason | TEXT | - | NULL | NULL | 申诉原因 |
| appeal_result | TEXT | - | NULL | NULL | 申诉结果 |

### 数据来源字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| data_source | ENUM | - | NOT NULL | 'MANUAL' | 数据来源 |
| collection_method | VARCHAR | 100 | NULL | NULL | 收集方式 |
| observation_method | VARCHAR | 100 | NULL | NULL | 观察方法 |
| measurement_tool | VARCHAR | 100 | NULL | NULL | 测量工具 |
| calibration_method | VARCHAR | 100 | NULL | NULL | 校准方法 |
| verification_method | VARCHAR | 100 | NULL | NULL | 验证方法 |
| quality_assurance | TEXT | - | NULL | NULL | 质量保证措施 |
| data_quality_score | DECIMAL | 5,2 | NULL | 0.00 | 数据质量评分 |

### 元数据字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_context | JSON | - | NULL | NULL | 评价背景 |
| environmental_factors | JSON | - | NULL | NULL | 环境因素 |
| situational_factors | JSON | - | NULL | NULL | 情境因素 |
| external_constraints | TEXT | - | NULL | NULL | 外部约束 |
| special_circumstances | TEXT | - | NULL | NULL | 特殊情况 |
| limitations_disclosure | TEXT | - | NULL | NULL | 局限性披露 |
| confidence_level | DECIMAL | 5,2 | NULL | 95.00 | 置信水平 |
| margin_of_error | DECIMAL | 5,2 | NULL | 0.00 | 误差范围 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NOT NULL | 0 | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| audit_trail | JSON | - | NULL | NULL | 审计轨迹 |
| external_reference | VARCHAR | 100 | NULL | NULL | 外部参考号 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_evaluation_indicator (evaluation_record_id, indicator_id)
UNIQUE KEY uk_result_code (evaluation_record_id, indicator_code)
```

### 外键约束
```sql
FOREIGN KEY (evaluation_record_id) REFERENCES fact_evaluation_record(id) ON DELETE CASCADE
FOREIGN KEY (template_id) REFERENCES dim_evaluation_template(id) ON DELETE CASCADE
FOREIGN KEY (indicator_id) REFERENCES dim_evaluation_indicator(id) ON DELETE CASCADE
FOREIGN KEY (evaluator_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (target_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_evaluation_record_id (evaluation_record_id)
INDEX idx_template_id (template_id)
INDEX idx_indicator_id (indicator_id)
INDEX idx_evaluator_id (evaluator_id)
INDEX idx_target_id (target_id)
INDEX idx_normalized_score (normalized_score)
INDEX idx_weighted_score (weighted_score)
INDEX idx_score_level (score_level)
INDEX idx_result_status (result_status)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_record_indicator (evaluation_record_id, indicator_id)
INDEX idx_target_score (target_id, normalized_score)
INDEX idx_evaluator_score (evaluator_id, normalized_score)
INDEX idx_status_time (result_status, create_time)
```

### 检查约束
```sql
CHECK (indicator_weight >= 0)
CHECK (indicator_weight <= 100)
CHECK (original_score IS NULL OR original_score >= 0)
CHECK (normalized_score >= 0)
CHECK (weighted_score >= 0)
CHECK (score_level IN ('EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'))
CHECK (percentile_rank BETWEEN 0 AND 100)
CHECK (evaluation_quality BETWEEN 0 AND 100)
CHECK (comment_quality BETWEEN 0 AND 100)
CHECK (evidence_quality BETWEEN 0 AND 100)
CHECK (constructiveness BETWEEN 0 AND 100)
CHECK (objectivity_rating BETWEEN 0 AND 100)
CHECK (fairness_rating BETWEEN 0 AND 100)
CHECK (reliability_rating BETWEEN 0 AND 100)
CHECK (validity_rating BETWEEN 0 AND 100)
CHECK (improvement_trend IN ('IMPROVING', 'STABLE', 'DECLINING', 'FLUCTUATING'))
CHECK (ranking_position >= 1)
CHECK (ranking_percentile BETWEEN 0 AND 100)
CHECK (evaluation_duration >= 0)
CHECK (result_status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED'))
CHECK (review_status IN ('PENDING', 'IN_REVIEW', 'COMPLETED', 'RETURNED'))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'BYPASSED'))
CHECK (publication_status IN ('DRAFT', 'INTERNAL', 'PUBLIC', 'RESTRICTED'))
CHECK (is_final_result IN (0, 1))
CHECK (is_appealed IN (0, 1))
CHECK (data_source IN ('MANUAL', 'SYSTEM', 'API', 'IMPORT', 'INTEGRATED'))
CHECK (confidence_level BETWEEN 0 AND 100)
CHECK (margin_of_error >= 0)
CHECK (data_quality_score BETWEEN 0 AND 100)
```

## 枚举值定义

### 评分等级 (score_level)
| 值 | 说明 | 备注 |
|----|------|------|
| EXCELLENT | 优秀 | 表现突出 |
| GOOD | 良好 | 表现良好 |
| SATISFACTORY | 满意 | 基本满意 |
| NEEDS_IMPROVEMENT | 需改进 | 需要改进 |
| POOR | 差 | 表现不佳 |

### 偏差程度 (deviation_degree)
| 值 | 说明 | 备注 |
|----|------|------|
| SIGNIFICANTLY_HIGH | 显著偏高 | 远高于平均水平 |
| SLIGHTLY_HIGH | 略高 | 略高于平均水平 |
| WITHIN_RANGE | 正常范围 | 在正常范围内 |
| SLIGHTLY_LOW | 略低 | 略低于平均水平 |
| SIGNIFICANTLY_LOW | 显著偏低 | 远低于平均水平 |

### 优先级别 (priority_level)
| 值 | 说明 | 备注 |
|----|------|------|
| CRITICAL | 关键 | 紧急重要 |
| HIGH | 高 | 重要但不紧急 |
| MEDIUM | 中 | 一般重要 |
| LOW | 低 | 次要问题 |

### 改进趋势 (improvement_trend)
| 值 | 说明 | 备注 |
|----|------|------|
| IMPROVING | 改进中 | 持续改进 |
| STABLE | 稳定 | 保持稳定 |
| DECLINING | 下降 | 质量下降 |
| FLUCTUATING | 波动 | 有波动 |

### 结果状态 (result_status)
| 值 | 说明 | 备注 |
|----|------|------|
| DRAFT | 草稿 | 评价草稿 |
| SUBMITTED | 已提交 | 已提交审核 |
| UNDER_REVIEW | 审核中 | 正在审核 |
| APPROVED | 已批准 | 审核通过 |
| REJECTED | 已拒绝 | 审核拒绝 |
| PUBLISHED | 已发布 | 结果发布 |
| ARCHIVED | 已归档 | 结果归档 |

### 审核状态 (review_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PENDING | 待审核 | 等待审核 |
| IN_REVIEW | 审核中 | 正在审核 |
| COMPLETED | 已完成 | 审核完成 |
| RETURNED | 已退回 | 退回修改 |

### 审批状态 (approval_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PENDING | 待审批 | 等待审批 |
| APPROVED | 已批准 | 审批通过 |
| REJECTED | 已拒绝 | 审批拒绝 |
| BYPASSED | 豁免 | 无需审批 |

### 发布状态 (publication_status)
| 值 | 说明 | 备注 |
|----|------|------|
| DRAFT | 草稿 | 草稿状态 |
| INTERNAL | 内部 | 仅内部可见 |
| PUBLIC | 公开 | 完全公开 |
| RESTRICTED | 受限 | 限制访问 |

## 关联关系

### 多对一关系（作为从表）
- **EvaluationResult → EvaluationRecord**：评价结果属于评价记录
- **EvaluationResult → EvaluationTemplate**：评价结果使用评价模板
- **EvaluationResult → EvaluationIndicator**：评价结果对应评价指标
- **EvaluationResult → User（evaluator）**：评价结果关联评价人
- **EvaluationResult → User（target）**：评价结果关联被评价对象

### 自引用关系
- **EvaluationResult → EvaluationResult（appeal）**：申诉关联原评价结果

## 使用示例

### 查询示例

#### 1. 查询评价结果汇总
```sql
SELECT
    er.evaluation_record_id,
    er.template_name,
    er.target_name,
    COUNT(*) as indicator_count,
    SUM(er.indicator_weight) as total_weight,
    AVG(er.normalized_score) as avg_score,
    SUM(er.weighted_score) as total_weighted_score,
    COUNT(CASE WHEN er.score_level = 'EXCELLENT' THEN 1 END) as excellent_count,
    COUNT(CASE WHEN er.score_level = 'GOOD' THEN 1 END) as good_count,
    COUNT(CASE WHEN er.score_level = 'SATISFACTORY' THEN 1 END) as satisfactory_count,
    AVG(er.evaluation_quality) as avg_quality,
    GROUP_CONCAT(DISTINCT er.score_level) as score_levels
FROM fact_evaluation_result er
WHERE er.evaluation_record_id = 12345
  AND er.result_status = 'APPROVED'
GROUP BY er.evaluation_record_id, er.template_name, er.target_name;
```

#### 2. 查询指标评价分析
```sql
SELECT
    ei.indicator_name,
    ei.indicator_category,
    COUNT(*) as evaluation_count,
    AVG(er.normalized_score) as avg_score,
    AVG(er.weighted_score) as avg_weighted_score,
    AVG(er.evaluation_quality) as avg_quality,
    COUNT(CASE WHEN er.score_level = 'EXCELLENT' THEN 1 END) as excellent_count,
    COUNT(CASE WHEN er.score_level = 'POOR' THEN 1 END) as poor_count,
    AVG(er.constructiveness) as avg_constructiveness,
    AVG(er.objectivity_rating) as avg_objectivity
FROM fact_evaluation_result er
JOIN dim_evaluation_indicator ei ON er.indicator_id = ei.id
WHERE er.create_time >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
  AND er.result_status = 'APPROVED'
GROUP BY er.indicator_id, ei.indicator_name, ei.indicator_category
ORDER BY avg_score DESC;
```

#### 3. 查询评价质量分析
```sql
SELECT
    u.user_name as evaluator_name,
    COUNT(*) as total_evaluations,
    AVG(er.normalized_score) as avg_score_given,
    AVG(er.evaluation_quality) as avg_evaluation_quality,
    AVG(er.comment_quality) as avg_comment_quality,
    AVG(er.evidence_quality) as avg_evidence_quality,
    AVG(er.constructiveness) as avg_constructiveness,
    AVG(er.objectivity_rating) as avg_objectivity,
    AVG(er.evaluation_duration) as avg_duration,
    COUNT(CASE WHEN er.is_appealed = 1 THEN 1 END) as appeal_count
FROM fact_evaluation_result er
JOIN dim_user u ON er.evaluator_id = u.id
WHERE er.create_time >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
  AND u.user_type = 'EXPERT'
GROUP BY er.evaluator_id, u.user_name
ORDER BY avg_evaluation_quality DESC;
```

#### 4. 查询改进建议分析
```sql
SELECT
    er.indicator_name,
    er.priority_level,
    COUNT(*) as suggestion_count,
    GROUP_CONCAT(DISTINCT er.improvement_suggestions) as suggestions,
    AVG(er.normalized_score) as avg_score,
    COUNT(CASE WHEN er.score_level IN ('NEEDS_IMPROVEMENT', 'POOR') THEN 1 END) as improvement_needed
FROM fact_evaluation_result er
WHERE er.improvement_suggestions IS NOT NULL
  AND er.result_status = 'APPROVED'
  AND er.create_time >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY er.indicator_id, er.indicator_name, er.priority_level
ORDER BY suggestion_count DESC;
```

#### 5. 查询趋势分析
```sql
SELECT
    DATE_FORMAT(er.create_time, '%Y-%m') as month,
    COUNT(*) as evaluation_count,
    AVG(er.normalized_score) as avg_score,
    AVG(er.historical_average) as avg_historical,
    COUNT(CASE WHEN er.improvement_trend = 'IMPROVING' THEN 1 END) as improving_count,
    COUNT(CASE WHEN er.improvement_trend = 'DECLINING' THEN 1 END) as declining_count,
    AVG(er.data_quality_score) as avg_data_quality
FROM fact_evaluation_result er
WHERE er.create_time >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  AND er.result_status = 'APPROVED'
GROUP BY DATE_FORMAT(er.create_time, '%Y-%m')
ORDER BY month;
```

#### 6. 查询对比分析
```sql
SELECT
    er.target_name,
    er.normalized_score,
    er.historical_average,
    er.peer_average,
    er.department_average,
    er.benchmark_score,
    er.ranking_position,
    er.ranking_percentile,
    er.improvement_trend,
    er.performance_gap,
    CASE
        WHEN er.normalized_score > er.peer_average THEN 'ABOVE_AVERAGE'
        WHEN er.normalized_score = er.peer_average THEN 'AVERAGE'
        ELSE 'BELOW_AVERAGE'
    END as performance_level
FROM fact_evaluation_result er
WHERE er.evaluation_record_id = 12345
  AND er.indicator_id = 1001
  AND er.result_status = 'APPROVED';
```

### 插入示例

#### 1. 创建评价结果
```sql
INSERT INTO fact_evaluation_result (
    evaluation_record_id, template_id, template_name,
    indicator_id, indicator_code, indicator_name,
    evaluator_id, evaluator_name, target_id, target_name,
    indicator_weight, normalized_score, weighted_score, score_level,
    evaluation_comments, improvement_suggestions, priority_level,
    evaluation_quality, constructiveness, objectivity_rating,
    result_status, create_by, data_source
) VALUES (
    12345, 1001, '教师教学质量评价模板',
    2001, 'TEACH_METHOD_001', '教学方法创新性',
    3001, '王督导', 4001, '张老师',
    15.00, 85.50, 12.83, 'GOOD',
    '教学方法多样，能有效激发学生学习兴趣，建议进一步探索项目式教学法', '探索项目式教学法，增加实践环节', 'MEDIUM',
    88.5, 85.2, 90.1,
    'DRAFT', 5001, 'MANUAL'
);
```

#### 2. 创建AI评价结果
```sql
INSERT INTO fact_evaluation_result (
    evaluation_record_id, template_id, template_name,
    indicator_id, indicator_code, indicator_name,
    evaluator_id, evaluator_name, target_id, target_name,
    indicator_weight, original_score, normalized_score, weighted_score,
    percentile_rank, z_score,
    evaluation_comments, evidence_description,
    data_source, collection_method, data_quality_score,
    confidence_level, margin_of_error,
    result_status, create_by
) VALUES (
    12346, 1002, '课程质量评价模板',
    2002, 'COURSE_CONTENT_001', '课程内容质量',
    0, 'AI助手', 5001, '数据结构课程',
    20.00, 87.3, 88.2, 17.64,
    75.3, 0.85,
    '基于课程大纲完整性、内容先进性、实践性等维度综合评价', '课程大纲完整，内容涵盖数据结构核心知识点，包含实践案例',
    'SYSTEM', 'AUTOMATIC_ANALYSIS', 92.5,
    95.0, 2.1,
    'SUBMITTED', 0
);
```

### 更新示例

#### 1. 更新评价审核状态
```sql
UPDATE fact_evaluation_result
SET result_status = 'UNDER_REVIEW',
    review_status = 'IN_REVIEW',
    review_start_time = NOW(),
    update_by = 6001,
    update_time = NOW(),
    version = version + 1
WHERE id = 78901;
```

#### 2. 更新评价质量评分
```sql
UPDATE fact_evaluation_result
SET evaluation_quality = 92.3,
    comment_quality = 88.7,
    evidence_quality = 95.2,
    constructiveness = 86.5,
    objectivity_rating = 91.8,
    fairness_rating = 94.1,
    reliability_rating = 89.6,
    validity_rating = 90.3,
    update_time = NOW(),
    version = version + 1
WHERE id = 78901;
```

#### 3. 批准评价结果
```sql
UPDATE fact_evaluation_result
SET result_status = 'APPROVED',
    review_status = 'COMPLETED',
    approval_status = 'APPROVED',
    review_end_time = NOW(),
    finalization_time = NOW(),
    update_time = NOW(),
    version = version + 1
WHERE id = 78901
  AND review_status = 'IN_REVIEW';
```

#### 4. 处理申诉
```sql
UPDATE fact_evaluation_result
SET is_appealed = 1,
    appeal_reason = '评分标准不够客观，希望重新评估',
    appeal_result = '经重新审核，维持原评价结果',
    update_time = NOW(),
    version = version + 1
WHERE id = 78901;
```

## 数据质量

### 质量检查规则
1. **完整性检查**：评价记录、指标、评价人等关键字段不能为空
2. **一致性检查**：权重和评分逻辑一致
3. **范围检查**：评分、百分比等字段范围合理
4. **关联检查**：评价记录与结果一一对应

### 数据清洗规则
1. **重复数据处理**：删除重复的评价结果
2. **评分修正**：修正不合理的评分数据
3. **权重调整**：调整权重分配不合理的情况
4. **状态同步**：同步结果状态和审核状态

## 性能优化

### 索引优化
- 评价记录ID和指标ID建立复合索引
- 被评价对象ID和评分建立复合索引
- 评价人ID和评价质量建立复合索引

### 分区策略
- 按创建时间进行表分区
- 提高大数据量查询性能
- 方便历史数据归档

### 查询优化
- 使用覆盖索引优化统计查询
- 避免TEXT字段的全表扫描
- 合理使用时间范围过滤

## 安全考虑

### 数据保护
- 评价结果访问权限控制
- 评价意见等敏感信息保护
- 申诉过程记录保密

### 权限控制
- 评价结果修改需要管理员权限
- 查看权限分级控制
- 申诉处理需要特殊权限

## 扩展说明

### 未来扩展方向
1. **AI辅助评价**：基于AI的评价建议生成
2. **实时反馈**：评价过程中的实时反馈
3. **多维度关联**：评价结果的多维度关联分析
4. **智能推荐**：基于结果的改进建议推荐

### 兼容性说明
- 支持多种评价结果数据格式
- 支持第三方评价系统集成
- 支持评价结果数据导出

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*