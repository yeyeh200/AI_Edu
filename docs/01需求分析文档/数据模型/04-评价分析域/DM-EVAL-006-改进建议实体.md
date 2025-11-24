# 改进建议实体 (ImprovementSuggestion)

---

**实体编号：** DM-EVAL-006
**实体名称：** 改进建议实体
**所属域：** 评价分析域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

改进建议实体是AI助评应用评价分析域的核心事实实体，记录基于评价结果生成的改进建议和行动计划。该实体关联评价结果、评价记录、用户等，记录建议内容、优先级、执行状态、效果评估等，为教学质量改进、教师发展、学习优化等提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_improvement_suggestion`
- **业务表名：** 改进建议表
- **数据类型：** 事实表

### 主要用途
- 记录改进建议信息
- 管理建议执行状态
- 支持建议效果评估
- 提供改进决策支持

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 改进建议唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_record_id | BIGINT | 20 | NOT NULL | 0 | 评价记录ID |
| evaluation_result_id | BIGINT | 20 | NULL | NULL | 评价结果ID |
| evaluation_code | VARCHAR | 50 | NOT NULL | '' | 评价编码 |
| evaluation_title | VARCHAR | 200 | NOT NULL | '' | 评价标题 |
| indicator_id | BIGINT | 20 | NULL | NULL | 指标ID |
| indicator_name | VARCHAR | 200 | NULL | NULL | 指标名称 |
| target_id | BIGINT | 20 | NOT NULL | 0 | 目标对象ID |
| target_name | VARCHAR | 100 | NOT NULL | '' | 目标对象名称 |
| target_type | ENUM | - | NOT NULL | 'TEACHER' | 目标类型 |
| evaluator_id | BIGINT | 20 | NOT NULL | 0 | 评价人ID |
| evaluator_name | VARCHAR | 100 | NOT NULL | '' | 评价人姓名 |

### 建议内容字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| suggestion_type | ENUM | - | NOT NULL | 'GENERAL' | 建议类型 |
| suggestion_category | VARCHAR | 100 | NOT NULL | '' | 建议分类 |
| suggestion_title | VARCHAR | 300 | NOT NULL | '' | 建议标题 |
| suggestion_description | TEXT | - | NOT NULL | '' | 建议描述 |
| detailed_guidance | TEXT | - | NULL | NULL | 详细指导 |
| specific_actions | TEXT | - | NULL | NULL | 具体行动 |
| implementation_steps | JSON | - | NULL | NULL | 实施步骤 |
| success_criteria | TEXT | - | NULL | NULL | 成功标准 |
| expected_outcomes | TEXT | - | NULL | NULL | 预期成果 |
| required_resources | TEXT | - | NULL | NULL | 所需资源 |
| timeline_estimate | VARCHAR | 200 | NULL | NULL | 预估时间 |
| priority_level | ENUM | - | NOT NULL | 'MEDIUM' | 优先级别 |
| difficulty_level | ENUM | - | NOT NULL | 'MEDIUM' | 难度等级 |

### 执行计划字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| action_plan | TEXT | - | NULL | NULL | 行动计划 |
| short_term_goals | TEXT | - | NULL | NULL | 短期目标 |
| long_term_goals | TEXT | - | NULL | NULL | 长期目标 |
| key_milestones | JSON | - | NULL | NULL | 关键里程碑 |
| responsible_parties | JSON | - | NULL | NULL | 责任方 |
| coordination_requirements | TEXT | - | NULL | NULL | 协调要求 |
| monitoring_methods | TEXT | - | NULL | NULL | 监控方法 |
| support_systems | TEXT - | NULL | NULL | 支持系统 |
| risk_assessment | TEXT - | NULL | NULL | 风险评估 |
| mitigation_strategies | TEXT - | NULL | NULL | 缓解策略 |

### 执行状态字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| execution_status | ENUM | - | NOT NULL | 'NOT_STARTED' | 执行状态 |
| progress_status | ENUM | - | NOT NULL | 'PENDING' | 进度状态 |
| completion_status | ENUM | - | NULL | NULL | 完成状态 |
| acceptance_status | ENUM | - | NULL | NULL | 接受状态 |
| is_mandatory | TINYINT | 1 | NOT NULL | 0 | 是否强制执行 |
| requires_approval | TINYINT | 1 | NOT NULL | 0 | 需要审批 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| approved_by | BIGINT | 20 | NULL | NULL | 审批人ID |
| approved_time | DATETIME | - | NULL | NULL | 审批时间 |
| implementation_deadline | DATE | - | NULL | NULL | 实施截止日期 |

### 时间信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| creation_time | DATETIME | - | NULL | NULL | 创建时间 |
| start_time | DATETIME | - | NULL | NULL | 开始时间 |
| planned_end_time | DATE | - | NULL | NULL | 计划结束时间 |
| actual_end_time | DATE | - | NULL | NULL | 实际结束时间 |
| last_update_time | DATETIME | - | NULL | NULL | 最后更新时间 |
| next_review_date | DATE | - | NULL | NULL | 下次审查日期 |
| completion_percentage | DECIMAL | 5,2 | NULL | 0.00 | 完成百分比 |
| time_spent | INT | 11 | NULL | NULL | 耗时（小时） |
| estimated_time | INT | 11 | NULL | NULL | 预估时间（小时） |

### 效果评估字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| effectiveness_score | DECIMAL | 5,2 | NULL | 0.00 | 有效性评分 |
| feasibility_rating | DECIMAL | 5,2 | NULL | 0.00 | 可行性评分 |
| impact_level | ENUM | - | NULL | NULL | 影响级别 |
| outcome_rating | DECIMAL | 5,2 | NULL | 0.00 | 成果评分 |
| satisfaction_rating | DECIMAL | 5,2 | NULL | 0.00 | 满意度评分 |
| roi_measurement | TEXT | - | NULL | NULL | ROI测量 |
| quality_improvement | DECIMAL | 5,2 | NULL | 0.00 | 质量改进 |
| performance_enhancement | DECIMAL | 5,2 | NULL | 0.00 | 绩效提升 |
| cost_benefit_ratio | DECIMAL | 8,2 | NULL | 0.00 | 成本效益比 |
| sustainability_rating | DECIMAL | 5,2 | NULL | 0.00 | 可持续性评分 |

### 跟踪记录字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| implementation_log | JSON | - | NULL | NULL | 实施日志 |
| progress_updates | JSON | - | NULL | NULL | 进展更新 |
| milestone_achievements | JSON | - | NULL | NULL | 里程碑成就 |
| obstacles_challenges | TEXT - | NULL | NULL | 障碍挑战 |
| lessons_learned | TEXT - | NULL | NULL | 经验教训 |
| best_practices | TEXT - | NULL | NULL | 最佳实践 |
| success_factors | TEXT | - | NULL | NULL | 成功因素 |
| improvement_metrics | JSON - | NULL | NULL | 改进指标 |
| follow_up_actions | JSON - | NULL | NULL | 后续行动 |

### 证据支撑字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evidence_data | JSON | - | NULL | NULL | 证据数据 |
| supporting_documents | JSON - - | NULL | NULL | 支撑文档 |
| reference_materials | TEXT - | NULL | NULL | 参考资料 |
| case_studies | TEXT - | NULL | NULL | 案例研究 |
| benchmark_data | JSON - | NULL | NULL | 基准数据 |
| comparison_analysis | TEXT - NULL - NULL | 对比分析 |
| expert_opinions | JSON - | NULL | NULL | 专家意见 |
| peer_feedback | TEXT - | NULL | NULL | 同行反馈 |
| stakeholder_input | TEXT - NULL - NULL | 利益相关者输入 |

### 智能分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| ai_relevance_score | DECIMAL | 5,2 | NULL | 0.00 | AI相关性评分 |
| ai_priority_score | DECIMAL | 5,2 | NULL | 0.00 | AI优先级评分 |
| prediction_accuracy | DECIMAL | 5,2 | NULL | 0.00 | 预测准确性 |
| recommended_actions | JSON - - | NULL | NULL | 推荐行动 |
| optimization_suggestions | TEXT - | NULL | NULL | 优化建议 |
| pattern_recognition | JSON - | NULL | NULL | 模式识别 |
| trend_analysis | TEXT - | NULL | NULL | 趋势分析 |
| success_probability | DECIMAL | 5,2 | NULL | 0.00 | 成功概率 |
| risk_indicators | JSON - | NULL | NULL | 风险指标 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| suggestion_status | ENUM | - | NOT NULL | 'ACTIVE' | 建议状态 |
| visibility_level | ENUM | - | NOT NULL | 'NORMAL' | 可见级别 |
| confidentiality_level | ENUM | - | NOT NULL | 'NORMAL' | 保密级别 |
| is_public | TINYINT | 1 | NOT NULL | 0 | 是否公开 |
| is_shareable | TINYINT | 1 | NOT NULL | 1 | 是否可分享 |
| is_archived | TINYINT | 1 | NOT NULL | 0 | 是否归档 |
| archive_date | DATE | - | NULL | NULL | 归档日期 |
| expiry_date | DATE | - | NULL | NULL | 过期日期 |
| reminder_frequency | ENUM | - | NULL | NULL | 提醒频率 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| source_system | ENUM | - | NOT NULL | 'MANUAL' | 数据来源系统 |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |
| external_reference | VARCHAR | 100 | NULL | NULL | 外部参考号 |
| tags | JSON | - | NULL | NULL | 标签 |
| metadata | JSON | - | NULL | NULL | 元数据 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_suggestion_record (evaluation_record_id, indicator_id, target_id)
UNIQUE KEY uk_suggestion_code (evaluation_code, suggestion_title, target_id)
```

### 外键约束
```sql
FOREIGN KEY (evaluation_record_id) REFERENCES fact_evaluation_record(id) ON DELETE CASCADE
FOREIGN KEY (evaluation_result_id) REFERENCES fact_evaluation_result(id) ON DELETE CASCADE
FOREIGN KEY (indicator_id) REFERENCES dim_evaluation_indicator(id) ON DELETE SET NULL
FOREIGN KEY (target_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (evaluator_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (approved_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_evaluation_record_id (evaluation_record_id)
INDEX idx_evaluation_result_id (evaluation_result_id)
INDEX idx_indicator_id (indicator_id)
INDEX idx_target_id (target_id)
INDEX idx_evaluator_id (evaluator_id)
INDEX idx_suggestion_type (suggestion_type)
INDEX s_idx_priority_level (priority_level)
INDEX idx_execution_status (execution_status)
INDEX idx_completion_status (completion_status)
INDEX idx_effectiveness_score (effectiveness_score)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_record_target (evaluation_record_id, target_id)
INDEX idx_type_priority (suggestion_type, priority_level)
INDEX idx_status_effectiveness (execution_status, effectiveness_score)
INDEX idx_target_status (target_id, execution_status)
```

### 检查约束
```sql
CHECK (suggestion_type IN ('GENERAL', 'SPECIFIC', 'URGENT', 'LONG_TERM', 'SHORT_TERM', 'PREVENTIVE', 'CORRECTIVE'))
CHECK (priority_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'ROUTINE'))
CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'DIFFICULT', 'VERY_DIFFICULT'))
CHECK (execution_status IN ('NOT_STARTED', 'PLANNED', 'IN_PROGRESS', 'SUSPENDED', 'COMPLETED', 'FAILED', 'CANCELLED'))
CHECK (progress_status IN ('PENDING', 'IN_PROGRESS', 'ON_TRACK', 'BEHIND_SCHEDULE', 'AHEAD_OF_SCHEDULE', 'BLOCKED'))
CHECK (completion_status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'PARTIALLY_COMPLETED', 'ABANDONED'))
CHECK (acceptance_status IN ('NOT_SUBMITTED', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'REQUIRES_REVISION'))
CHECK (approval_status IN ('NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED', 'RETURNED'))
CHECK (suggestion_status IN ('ACTIVE', 'COMPLETED', 'CANCELLED', 'SUPERSEDED', 'EXPIRED'))
CHECK (visibility_level IN ('PUBLIC', 'INTERNAL', 'PRIVATE', 'RESTRICTED', 'CONFIDENTIAL'))
CHECK (confidentiality_level IN ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'SECRET'))
CHECK (impact_level IN ('STRATEGIC', 'TACTICAL', 'OPERATIONAL', 'INDIVIDUAL'))
CHECK (is_mandatory IN (0, 1))
CHECK (requires_approval IN (0, 1))
CHECK (completion_percentage BETWEEN 0 AND 100)
CHECK (time_spent >= 0)
CHECK (estimated_time >= 0)
CHECK (effectiveness_score BETWEEN 0 AND 100)
CHECK (feasibility_rating BETWEEN 0 AND 100)
CHECK (outcome_rating BETWEEN 0 AND 100)
CHECK (satisfaction_rating BETWEEN 0 AND 100)
CHECK (quality_improvement BETWEEN -100 AND 100)
CHECK (performance_enhancement BETWEEN -100 AND 100)
CHECK (sustainability_rating BETWEEN 0 AND 100)
CHECK (is_public IN (0, 1))
CHECK (is_shareable IN (0, 1))
CHECK (is_archived IN (0, 1))
CHECK (ai_relevance_score BETWEEN 0 AND 100)
CHECK (ai_priority_score BETWEEN 0 AND 100)
CHECK (prediction_accuracy BETWEEN 0 AND 100)
CHECK (success_probability BETWEEN 0 AND 100)
CHECK (source_system IN ('MANUAL', 'ZJY', 'SYSTEM', 'API', 'IMPORT'))
```

## 枚举值定义

### 建议类型 (suggestion_type)
| 值 | 说明 | 备注 |
|----|------|------|
| GENERAL | 通用 | 通用建议 |
| SPECIFIC | 具体 | 具体建议 |
| URGENT | 紧急 | 紧急建议 |
| LONG_TERM | 长期 | 长期建议 |
| SHORT_TERM | 短期 | 短期建议 |
| PREVENTIVE | 预防 | 预防性建议 |
| CORRECTIVE | 纠正 | 纠正性建议 |

### 优先级别 (priority_level)
| 值 | 说明 | 备注 |
|----|------|------|
| CRITICAL | 关键 | 关键建议，必须执行 |
| HIGH | 高 | 高优先级建议 |
| MEDIUM | 中等 | 中等优先级 |
| LOW | 低 | 低优先级建议 |
| ROUTINE | 常规 | 常规性建议 |

### 难度等级 (difficulty_level)
| 值 | 说明 | 备注 |
|----|------|------|
| EASY | 简单 | 容易实施 |
| MEDIUM | 中等 | 中等难度 |
| DIFFICULT | 困难 | 实施困难 |
| VERY_DIFFICULT | 很难 | 非常困难 |

### 执行状态 (execution_status)
| 值 | 说明 | 备注 |
|----|------|------|
| NOT_STARTED | 未开始 | 尚未开始 |
| PLANNED | 已计划 | 已制定计划 |
| IN_PROGRESS | 进行中 | 正在执行 |
| SUSPENDED | 已暂停 | 暂时停止 |
| COMPLETED | 已完成 | 已完成执行 |
| FAILED | 失败 | 执行失败 |
| CANCELLED | 已取消 | 已取消 |

### 进度状态 (progress_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PENDING | 待定 | 等待开始 |
| IN_PROGRESS | 进行中 | 正在进行 |
| ON_TRACK | 按计划 | 按计划进行 |
| BEHIND_SCHEDULE | 延期 | 落后于计划 |
| AHEAD_OF_SCHEDULE | 提前 | 提前于计划 |
| BLOCKED | 受阻 | 遇到阻碍 |

### 影响级别 (impact_level)
| 值 | 说明 | 备注 |
|----|------|------|
| STRATEGIC | 战略 | 战略级影响 |
| TACTICAL | 战术 | 战术级影响 |
| OPERATIONAL | 操作 | 操作级影响 |
| INDIVIDUAL | 个人 | 个人级影响 |

### 建议状态 (suggestion_status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 活跃 | 当前有效建议 |
| COMPLETED | 完成 | 已完成建议 |
| CANCELLED | 已取消 | 已取消建议 |
| SUPERSEDED | 已替代 | 被新建议替代 |
| EXPIRED | 已过期 | 建议过期 |

### 可见级别 (visibility_level)
| 值 | 说明 | 备注 |
|----|------|------|
| PUBLIC | 公开 | 完全公开 |
| INTERNAL | 内部 | 仅内部可见 |
| PRIVATE | 私有 | 私有可见 |
| RESTRICTED | 受限 | 限制访问 |
| CONFIDENTIAL | 机密 | 高度机密 |

## 关联关系

### 多对一关系（作为从表）
- **ImprovementSuggestion → EvaluationRecord**：改进建议属于评价记录
- **ImprovementSuggestion → EvaluationResult**：改进建议属于评价结果
- **ImprovementSuggestion → EvaluationIndicator**：改进建议关联评价指标
- **ImprovementSuggestion → User（target）**：改进建议关联目标对象
- **ImprovementSuggestion → User（evaluator）**：改进建议关联评价人

### 自引用关系
- **ImprovementSuggestion → ImprovementSuggestion**：建议可关联其他建议

## 使用示例

### 查询示例

#### 1. 查询改进建议统计
```sql
SELECT
    er.evaluation_title,
    COUNT(*) as suggestion_count,
    SUM(CASE WHEN is.priority_level = 'CRITICAL' THEN 1 END) as critical_count,
    SUM(CASE WHEN is.priority_level = 'HIGH' THEN 1 END) as high_count,
    SUM(CASE WHEN is.priority_level = 'MEDIUM' THEN 1 END) as medium_count,
    AVG(is.effectiveness_score) as avg_effectiveness,
    SUM(CASE WHEN is.execution_status = 'COMPLETED' THEN 1 END) as completed_count,
    SUM(CASE WHEN is.execution_status = 'IN_PROGRESS' THEN 1 END) as in_progress_count,
    AVG(is.completion_percentage) as avg_completion,
    AVG(is.satisfaction_rating) as avg_satisfaction
FROM fact_improvement_suggestion is
JOIN fact_evaluation_record er ON is.evaluation_record_id = er.id
WHERE is.suggestion_status = 'ACTIVE'
  AND is.execution_status != 'CANCELLED'
GROUP BY is.evaluation_record_id, er.evaluation_title
ORDER BY critical_count DESC, avg_effectiveness DESC;
```

#### 2. 查询高优先级建议
```sql
SELECT
    is.suggestion_title,
    is.suggestion_description,
    er.evaluation_title,
    t.target_name,
    is.priority_level,
    is.difficulty_level,
    is.effectiveness_score,
    is.execution_status,
    is.completion_percentage,
    is.implementation_deadline,
    is.is_mandatory,
    is.requires_approval
FROM fact_improvement_suggestion is
JOIN fact_evaluation_record er ON is.evaluation_record_id = er.id
JOIN dim_user t ON is.target_id = t.id
WHERE is.suggestion_status = 'ACTIVE'
  AND is.priority_level IN ('CRITICAL', 'HIGH')
  AND is.execution_status IN ('NOT_STARTED', 'IN_PROGRESS')
ORDER BY is.priority_level DESC, is.effectiveness_score DESC;
```

#### 3. 查询建议效果分析
```SELECT
    is.suggestion_category,
    COUNT(*) as suggestion_count,
    AVG(is.effectiveness_score) as avg_effectiveness,
    AVG(is.feasibility_rating) as avg_feasibility,
    AVG(is.outcome_rating) as avg_outcome,
    AVG(is.satisfaction_rating) as avg_satisfaction,
    SUM(CASE WHEN is.execution_status = 'COMPLETED' AND is.outcome_rating >= 80 THEN 1 END) as successful_count,
    SUM(CASE WHEN is.execution_status = 'COMPLETED' AND is.outcome_rating >= 80 THEN 1 END) / SUM(CASE WHEN is.execution_status = 'COMPLETED' THEN 1 END) * 100 as success_rate
FROM fact_improvement_suggestion is
WHERE is.suggestion_status = 'ACTIVE'
  AND is.execution_status = 'COMPLETED'
  AND is.effectiveness_score IS NOT NULL
GROUP BY is.suggestion_category
ORDER BY avg_effectiveness DESC, success_rate DESC;
```

#### 4. 查询建议执行状态
```sql
SELECT
    t.target_name,
    is.suggestion_title,
    is.suggestion_type,
    is.execution_status,
    is.completion_percentage,
    is.start_time,
    is.planned_end_time,
    is.actual_end_time,
    is.approval_status,
    is.approved_by,
    is.approved_time,
    DATEDIFF(CURDATE(), is.start_time) as days_since_start
FROM fact_improvement_suggestion is
JOIN dim_user t ON is.target_id = t.id
WHERE is.suggestion_status = 'ACTIVE'
  AND (is.execution_status != 'COMPLETED' OR is.completion_percentage < 100)
ORDER BY is.priority_level DESC, DATEDIFF(CURDATE(), is.start_time) ASC;
```

### 插入示例

#### 1. 创建教学改进建议
```sql
INSERT INTO fact_improvement_suggestion (
    evaluation_record_id, evaluation_code, evaluation_title,
    indicator_id, indicator_name,
    target_id, target_name, target_type,
    evaluator_id, evaluator_name,
    suggestion_type, suggestion_category, suggestion_title,
    suggestion_description, detailed_guidance,
    priority_level, difficulty_level,
    action_plan, success_criteria, expected_outcomes,
    timeline_estimate, is_mandatory,
    execution_status, suggestion_status,
    create_by, source_system
) VALUES (
    12345, 'EVAL2023001', '2023年春季教学质量评价',
    2001, '教学方法创新性',
    67890, '张老师', 'TEACHER',
    12345, '王督导',
    'SPECIFIC', 'METHOD_IMPROVEMENT', '教学方法多样化建议',
    '建议在教学中增加互动环节，采用案例教学和小组讨论方法', '具体建议：1. 每堂至少安排1-2个互动环节；2. 引入相关行业案例进行分析讨论；3. 组织学生进行小组项目实践；4. 定期收集中学生反馈并调整教学策略',
    'HIGH', 'MEDIUM',
    '短期：增加课堂互动（1个月内）；中期：引入案例教学（3个月内）；长期：建立项目导向教学模式（1年内）',
    '短期：课堂互动率提升30%；中期：学生参与度提升50%；长期：教学满意度提升20%',
    '改善课堂氛围，提高学生学习参与度',
    '3个月', 1,
    'NOT_STARTED', 'ACTIVE',
    67890, 'MANUAL'
);
```

#### 2. 创建AI智能建议
```sql
INSERT INTO fact_improvement_suggestion (
    evaluation_record_id, evaluation_code, evaluation_title,
    target_id, target_name, target_type,
    evaluator_id, evaluator_name,
    suggestion_type, suggestion_category, suggestion_title,
    suggestion_description, detailed_guidance,
    priority_level, difficulty_level,
    ai_relevance_score, ai_priority_score, prediction_accuracy,
    recommended_actions, optimization_suggestions,
    execution_status, suggestion_status,
    create_by, source_system
) VALUES (
    12346, 'EVAL3002', '学生学习效果分析',
    67891, '李四', 'STUDENT',
    0, 'AI助手', 'GENERAL', 'LEARNING_ENHANCE',
    '基于学习数据分析的个性化学习路径建议', '通过分析学生的学习模式、知识掌握情况和学习偏好，推荐个性化的学习资源和策略',
    'MEDIUM', 'EASY',
    85.5, 78.2, 92.1,
    '1. 推荐相关视频课程；2. 安排个性化练习；3. 提供学习指导；4. 定期跟踪学习进度',
    '建议优先学习高级算法课程，多做实践项目，参与学习社区讨论',
    'NOT_STARTED', 'ACTIVE',
    0, 'SYSTEM'
);
```

### 更新示例

#### 1. 更新建议执行状态
```sql
UPDATE fact_improvement_suggestion
SET execution_status = 'IN_PROGRESS',
    progress_status = 'ON_TRACK',
    start_time = NOW(),
    planned_end_time = DATE_ADD(NOW(), INTERVAL 3 MONTH),
    completion_percentage = 25.0,
    update_time = NOW(),
    version = version + 1
WHERE id = 78901
  AND execution_status = 'NOT_STARTED';
```

#### 2. 更新建议效果评价
```sql
UPDATE fact_improvement_suggestion
SET effectiveness_score = 88.5,
    feasibility_rating = 85.2,
    outcome_rating = 87.8,
    satisfaction_rating = 90.3,
    success_probability = 92.5,
    ai_relevance_score = 91.2,
    quality_improvement = 15.5,
    performance_enhancement = 12.3,
    update_time = NOW(),
    version = version + 1
WHERE id = 78901
  AND execution_status = 'COMPLETED';
```

#### 3. 完成建议
```sql
UPDATE fact_improvement_suggestion
SET execution_status = 'COMPLETED',
    progress_status = 'COMPLETED',
    completion_status = 'COMPLETED',
    actual_end_time = CURDATE(),
    completion_percentage = 100.0,
    effectiveness_score = 92.0,
    feasibility_rating = 90.0,
    outcome_rating = 95.0,
    acceptance_status = 'ACCEPTED',
    update_time = NOW(),
    version = version + 1
WHERE id = 78901
  AND execution_status = 'IN_PROGRESS';
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：同一评价记录、指标、目标组合唯一
2. **完整性检查**：评价记录、目标对象等关键字段不能为空
3. **逻辑检查**：进度百分比、完成率等逻辑一致
4. **关联检查**：评价记录、指标、目标ID必须存在

### 数据清洗规则
1. **重复数据处理**：删除重复的建议记录
2. **状态同步**：同步执行状态和进度状态
3. **时间修正**：修正不合理的时间记录
4. **评分修正**：修正不合理的评分数据

## 性能优化

### 索引优化
- 评价记录ID和目标ID建立复合索引
- 优先级和执行状态建立复合索引
- 效果评分和时间建立复合索引

### 分区策略
- 按创建时间进行表分区
- 提高历史数据查询性能
- 方便数据归档管理

### 查询优化
- 使用覆盖索引优化统计查询
- 避免大字段的全表扫描
- 合理使用状态和过滤条件

## 安全考虑

### 数据保护
- 敏感改进建议访问控制
- 个人隐私数据保护
- 建议执行记录保密

### 权限控制
- 建议修改需要相应权限
- 建议查看需要分级权限
- 审批流程需要完整记录

## 扩展说明

### 未来扩展方向
1. **智能推荐**：基于AI的改进建议推荐
2. **个性化定制**：基于用户特征的个性化建议
3. **预测分析**：基于历史数据的建议效果预测
4. **协作优化**：基于团队协作的建议优化

### 兼容性说明
- 支持多种评价框架集成
- 支持第三方建议系统对接
- 支持改进效果数据集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*