# 教学质量报告实体 (TeachingQualityReport)

---

**实体编号：** DM-EVAL-007
**实体名称：** 教学质量报告实体
**所属域：** 评价分析域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

教学质量报告实体是AI助评应用评价分析域的核心汇总实体，定义了教学质量综合报告的生成、存储和管理。该实体描述了教学质量报告的基础信息、评价维度、成绩分析、改进建议等，为教学质量监控、管理决策、持续改进等提供报告维度支撑。

## 实体定义

### 表名
- **物理表名：** `dws_teaching_quality_report`
- **业务表名：** 教学质量报告表
- **数据类型：** 汇总表

### 主要用途
- 汇总教学质量评价结果
- 生成教学质量分析报告
- 支持教学质量趋势分析
- 提供教学质量决策支持

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 报告唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| report_code | VARCHAR | 50 | NOT NULL | '' | 报告编码（系统唯一） |
| report_name | VARCHAR | 200 | NOT NULL | '' | 报告名称 |
| report_type | ENUM | - | NOT NULL | 'COURSE' | 报告类型 |
| report_period | ENUM | - | NOT NULL | 'SEMESTER' | 报告周期 |
| academic_year | VARCHAR | 20 | NOT NULL | '' | 学年 |
| semester | VARCHAR | 20 | NOT NULL | '' | 学期 |
| report_date | DATE | - | NOT NULL | CURRENT_DATE | 报告日期 |

### 评价对象字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| target_type | ENUM | - | NOT NULL | 'TEACHER' | 评价对象类型 |
| target_id | BIGINT | 20 | NOT NULL | 0 | 评价对象ID |
| target_code | VARCHAR | 50 | NOT NULL | '' | 评价对象编码 |
| target_name | VARCHAR | 100 | NOT NULL | '' | 评价对象名称 |
| target_dept_id | BIGINT | 20 | NULL | NULL | 所属部门ID |
| target_dept_name | VARCHAR | 200 | NULL | NULL | 所属部门名称 |
| target_faculty_id | BIGINT | 20 | NULL | NULL | 所属院系ID |
| target_faculty_name | VARCHAR | 200 | NULL | NULL | 所属院系名称 |

### 评价范围字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_scope | VARCHAR | 200 | NULL | NULL | 评价范围 |
| course_count | INT | 11 | NULL | 0 | 涉及课程数量 |
| class_count | INT | 11 | NULL | 0 | 涉及班级数量 |
| student_count | INT | 11 | NULL | 0 | 涉及学生数量 |
| evaluation_count | INT | 11 | NULL | 0 | 评价记录数量 |
| response_rate | DECIMAL | 5,2 | NULL | 0.00 | 回复率 |
| valid_response_count | INT | 11 | NULL | 0 | 有效回复数量 |
| participation_rate | DECIMAL | 5,2 | NULL | 0.00 | 参与率 |

### 评价框架字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| template_id | BIGINT | 20 | NULL | NULL | 评价模板ID |
| template_name | VARCHAR | 200 | NULL | NULL | 评价模板名称 |
| framework_model | VARCHAR | 100 | NULL | NULL | 框架模型 |
| evaluation_dimensions | JSON | - | NULL | NULL | 评价维度 |
| dimension_weights | JSON | - | NULL | NULL | 维度权重 |
| scoring_methods | JSON | - | NULL | NULL | 评分方法 |
| calculation_rules | TEXT | - | NULL | NULL | 计算规则 |

### 综合评分字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| overall_score | DECIMAL | 5,2 | NULL | 0.00 | 综合评分 |
| overall_level | ENUM | - | NULL | NULL | 综合等级 |
| overall_ranking | INT | 11 | NULL | NULL | 综合排名 |
| percentile_ranking | DECIMAL | 5,2 | NULL | 0.00 | 百分位排名 |
| historical_comparison | ENUM | - | NULL | NULL | 历史对比 |
| peer_comparison | ENUM | - | NULL | NULL | 同行对比 |
| benchmark_comparison | ENUM | - | NULL | NULL | 基准对比 |
| improvement_rate | DECIMAL | 5,2 | NULL | 0.00 | 改进率 |

### 维度评分字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| dimension_scores | JSON | - | NULL | NULL | 维度评分 |
| teaching_content_score | DECIMAL | 5,2 | NULL | 0.00 | 教学内容评分 |
| teaching_method_score | DECIMAL | 5,2 | NULL | 0.00 | 教学方法评分 |
| teaching_effectiveness_score | DECIMAL | 5,2 | NULL | 0.00 | 教学效果评分 |
| professional_quality_score | DECIMAL | 5,2 | NULL | 0.00 | 师德师风评分 |
| innovation_practice_score | DECIMAL | 5,2 | NULL | 0.00 | 创新实践评分 |
| dimension_rankings | JSON | - | NULL | NULL | 维度排名 |

### 数据统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| score_distribution | JSON | - | NULL | NULL | 分数分布 |
| score_statistics | JSON | - | NULL | NULL | 分数统计 |
| high_score_rate | DECIMAL | 5,2 | NULL | 0.00 | 高分率 |
| pass_rate | DECIMAL | 5,2 | NULL | 0.00 | 及格率 |
| excellent_rate | DECIMAL | 5,2 | NULL | 0.00 | 优秀率 |
| average_score | DECIMAL | 5,2 | NULL | 0.00 | 平均分 |
| median_score | DECIMAL | 5,2 | NULL | 0.00 | 中位数 |
| standard_deviation | DECIMAL | 5,2 | NULL | 0.00 | 标准差 |
| score_variance | DECIMAL | 8,2 | NULL | 0.00 | 分数方差 |

### 评价分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| strength_analysis | TEXT | - | NULL | NULL | 优势分析 |
| weakness_analysis | TEXT | - | NULL | NULL | 不足分析 |
| trend_analysis | TEXT | - | NULL | NULL | 趋势分析 |
| factor_analysis | TEXT | - | NULL | NULL | 因素分析 |
| correlation_analysis | JSON | - | NULL | NULL | 相关性分析 |
| outlier_analysis | JSON | - | NULL | NULL | 异常值分析 |
| statistical_significance | ENUM | - | NULL | NULL | 统计显著性 |
| confidence_interval | JSON | - | NULL | NULL | 置信区间 |

### 改进建议字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| improvement_suggestions | JSON | - | NULL | NULL | 改进建议 |
| priority_issues | JSON | - | NULL | NULL | 优先问题 |
| action_plans | JSON | - | NULL | NULL | 行动计划 |
| development_goals | JSON | - | NULL | NULL | 发展目标 |
| resource_needs | JSON | - | NULL | NULL | 资源需求 |
| timeline_recommendations | JSON | - | NULL | NULL | 时间建议 |
| support_measures | JSON | - | NULL | NULL | 支持措施 |
| success_indicators | JSON | - | NULL | NULL | 成功指标 |

### 对比分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| historical_scores | JSON | - | NULL | NULL | 历史评分 |
| peer_averages | JSON | - | NULL | NULL | 同行平均 |
| department_averages | JSON | - | NULL | NULL | 院系平均 |
| faculty_averages | JSON | - | NULL | NULL | 学院平均 |
| university_averages | JSON | - | NULL | NULL | 全校平均 |
| industry_benchmarks | JSON | - | NULL | NULL | 行业基准 |
| national_benchmarks | JSON | - | NULL | NULL | 国家基准 |
| international_benchmarks | JSON | - | NULL | NULL | 国际基准 |

### 趋势分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| monthly_trends | JSON | - | NULL | NULL | 月度趋势 |
| quarterly_trends | JSON | - | NULL | NULL | 季度趋势 |
| yearly_trends | JSON | - | NULL | NULL | 年度趋势 |
| trend_directions | JSON | - | NULL | NULL | 趋势方向 |
| trend_magnitudes | JSON | - | NULL | NULL | 趋势幅度 |
| trend_stability | ENUM | - | NULL | NULL | 趋势稳定性 |
| forecast_scores | JSON | - | NULL | NULL | 预测评分 |
| trend_confidence | DECIMAL | 5,2 | NULL | 0.00 | 趋势置信度 |

### 质量分级字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| quality_level | ENUM | - | NULL | NULL | 质量等级 |
| quality_score | DECIMAL | 5,2 | NULL | 0.00 | 质量评分 |
| quality_indicators | JSON | - | NULL | NULL | 质量指标 |
| quality_factors | JSON | - | NULL | NULL | 质量因素 |
| quality_improvements | JSON | - | NULL | NULL | 质量改进 |
| quality_recognition | JSON | - | NULL | NULL | 质量认可 |
| quality_awards | JSON | - | NULL | NULL | 质量奖励 |
| quality_certifications | JSON | - | NULL | NULL | 质量认证 |

### 数据质量字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| data_completeness | DECIMAL | 5,2 | NULL | 0.00 | 数据完整性 |
| data_accuracy | DECIMAL | 5,2 | NULL | 0.00 | 数据准确性 |
| data_consistency | DECIMAL | 5,2 | NULL | 0.00 | 数据一致性 |
| data_timeliness | DECIMAL | 5,2 | NULL | 0.00 | 数据及时性 |
| data_validity | DECIMAL | 5,2 | NULL | 0.00 | 数据有效性 |
| data_reliability | DECIMAL | 5,2 | NULL | 0.00 | 数据可靠性 |
| data_coverage | DECIMAL | 5,2 | NULL | 0.00 | 数据覆盖率 |
| quality_score | DECIMAL | 5,2 | NULL | 0.00 | 质量评分 |

### 审核状态字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| report_status | ENUM | - | NOT NULL | 'DRAFT' | 报告状态 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| review_status | ENUM | - | NULL | NULL | 审核状态 |
| verified_status | ENUM | - | NULL | NULL | 验证状态 |
| published_status | ENUM | - | NULL | NULL | 发布状态 |
| archived_status | ENUM | - | NULL | NULL | 归档状态 |
| quality_assurance | ENUM | - | NULL | NULL | 质量保证 |
| compliance_check | ENUM | - | NULL | NULL | 合规检查 |

### 审核流程字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| reviewer_id | BIGINT | 20 | NULL | NULL | 审核人ID |
| reviewer_name | VARCHAR | 100 | NULL | NULL | 审核人姓名 |
| review_time | DATETIME | - | NULL | NULL | 审核时间 |
| review_comments | TEXT | - | NULL | NULL | 审核意见 |
| approval_id | BIGINT | 20 | NULL | NULL | 审批人ID |
| approval_name | VARCHAR | 100 | NULL | NULL | 审批人姓名 |
| approval_time | DATETIME | - | NULL | NULL | 审批时间 |
| approval_comments | TEXT | - | NULL | NULL | 审批意见 |

### 分发管理字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| distribution_list | JSON | - | NULL | NULL | 分发列表 |
| distribution_time | DATETIME | - | NULL | NULL | 分发时间 |
| distribution_channels | JSON | - | NULL | NULL | 分发渠道 |
| read_status | JSON | - | NULL | NULL | 阅读状态 |
| feedback_summary | JSON | - | NULL | NULL | 反馈汇总 |
| acknowledgment_status | JSON | - | NULL | NULL | 确认状态 |
| retention_policy | ENUM | - | NULL | NULL | 保留策略 |
| confidentiality_level | ENUM | - | NULL | NULL | 保密级别 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| batch_id | VARCHAR | 50 | NULL | NULL | 批次ID |
| data_source | VARCHAR | 100 | NULL | NULL | 数据来源 |
| etl_time | DATETIME | - | NULL | NULL | ETL时间 |
| checksum | VARCHAR | 64 | NULL | NULL | 数据校验码 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_report_code (report_code)
UNIQUE KEY uk_target_period (target_type, target_id, report_period, academic_year, semester)
```

### 外键约束
```sql
FOREIGN KEY (template_id) REFERENCES dim_evaluation_template(id) ON DELETE SET NULL
FOREIGN KEY (target_dept_id) REFERENCES dim_department(id) ON DELETE SET NULL
FOREIGN KEY (target_faculty_id) REFERENCES dim_faculty(id) ON DELETE SET NULL
FOREIGN KEY (reviewer_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (approval_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_report_type (report_type)
INDEX idx_report_period (report_period)
INDEX idx_academic_year (academic_year)
INDEX idx_target_type (target_type)
INDEX idx_target_id (target_id)
INDEX idx_overall_score (overall_score)
INDEX idx_overall_level (overall_level)
INDEX idx_report_status (report_status)
INDEX idx_approval_status (approval_status)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_target_period_score (target_type, target_id, report_period, overall_score)
INDEX idx_status_level (report_status, overall_level)
INDEX idx_year_semester (academic_year, semester)
INDEX dept_analysis_index (target_dept_id, overall_score, create_time)
```

### 检查约束
```sql
CHECK (report_type IN ('TEACHER', 'COURSE', 'CLASS', 'DEPARTMENT', 'FACULTY', 'UNIVERSITY'))
CHECK (report_period IN ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMESTER', 'YEARLY', 'ADHOC'))
CHECK (target_type IN ('TEACHER', 'COURSE', 'CLASS', 'DEPARTMENT', 'FACULTY', 'STUDENT'))
CHECK (overall_level IN ('EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'))
CHECK (historical_comparison IN ('IMPROVED', 'STABLE', 'DECLINED', 'NOT_APPLICABLE'))
CHECK (peer_comparison IN ('ABOVE_AVERAGE', 'AVERAGE', 'BELOW_AVERAGE', 'TOP_10', 'BOTTOM_10'))
CHECK (benchmark_comparison IN ('EXCEEDS', 'MEETS', 'BELOW', 'NOT_AVAILABLE'))
CHECK (statistical_significance IN ('HIGHLY_SIGNIFICANT', 'SIGNIFICANT', 'NOT_SIGNIFICANT'))
CHECK (trend_stability IN ('STABLE', 'VOLATILE', 'IMPROVING', 'DECLINING'))
CHECK (quality_level IN ('EXCELLENT', 'GOOD', 'SATISFACTORY', 'POOR', 'UNACCEPTABLE'))
CHECK (report_status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED', 'CANCELLED'))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVIEW'))
CHECK (review_status IN ('NOT_REVIEWED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'))
CHECK (verified_status IN ('NOT_VERIFIED', 'VERIFIED', 'FAILED'))
CHECK (published_status IN ('NOT_PUBLISHED', 'PUBLISHED', 'RETRACTED'))
CHECK (archived_status IN ('ACTIVE', 'ARCHIVED', 'PURGED'))
CHECK (quality_assurance IN ('PASSED', 'FAILED', 'PENDING'))
CHECK (compliance_check IN ('COMPLIANT', 'NON_COMPLIANT', 'PENDING'))
CHECK (retention_policy IN ('STANDARD', 'EXTENDED', 'PERMANENT', 'CUSTOM'))
CHECK (confidentiality_level IN ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'))
CHECK (overall_score BETWEEN 0 AND 100)
CHECK (response_rate BETWEEN 0 AND 100)
CHECK (participation_rate BETWEEN 0 AND 100)
CHECK (improvement_rate BETWEEN -100 AND 100)
CHECK (high_score_rate BETWEEN 0 AND 100)
CHECK (pass_rate BETWEEN 0 AND 100)
CHECK (excellent_rate BETWEEN 0 AND 100)
CHECK (trend_confidence BETWEEN 0 AND 100)
CHECK (course_count >= 0)
CHECK (class_count >= 0)
CHECK (student_count >= 0)
CHECK (evaluation_count >= 0)
CHECK (valid_response_count >= 0)
```

## 枚举值定义

### 报告类型 (report_type)
| 值 | 说明 | 备注 |
|----|------|------|
| TEACHER | 教师 | 教师教学质量报告 |
| COURSE | 课程 | 课程教学质量报告 |
| CLASS | 班级 | 班级学习质量报告 |
| DEPARTMENT | 部门 | 部门教学质量报告 |
| FACULTY | 院系 | 院系教学质量报告 |
| UNIVERSITY | 学校 | 学校教学质量报告 |

### 报告周期 (report_period)
| 值 | 说明 | 备注 |
|----|------|------|
| WEEKLY | 周报 | 每周报告 |
| MONTHLY | 月报 | 每月报告 |
| QUARTERLY | 季报 | 季度报告 |
| SEMESTER | 学期 | 学期报告 |
| YEARLY | 年报 | 年度报告 |
| ADHOC | 临时 | 临时报告 |

### 综合等级 (overall_level)
| 值 | 说明 | 备注 |
|----|------|------|
| EXCELLENT | 优秀 | 90-100分 |
| GOOD | 良好 | 80-89分 |
| SATISFACTORY | 合格 | 60-79分 |
| NEEDS_IMPROVEMENT | 需改进 | 40-59分 |
| POOR | 不合格 | 0-39分 |

### 历史对比 (historical_comparison)
| 值 | 说明 | 备注 |
|----|------|------|
| IMPROVED | 提升 | 相比历史提升 |
| STABLE | 稳定 | 相比历史稳定 |
| DECLINED | 下降 | 相比历史下降 |
| NOT_APPLICABLE | 不适用 | 无历史数据 |

### 同行对比 (peer_comparison)
| 值 | 说明 | 备注 |
|----|------|------|
| ABOVE_AVERAGE | 高于平均 | 超过同行平均 |
| AVERAGE | 平均水平 | 与同行平均持平 |
| BELOW_AVERAGE | 低于平均 | 低于同行平均 |
| TOP_10 | 前10% | 同行前10% |
| BOTTOM_10 | 后10% | 同行后10% |

### 报告状态 (report_status)
| 值 | 说明 | 备注 |
|----|------|------|
| DRAFT | 草稿 | 报告草稿 |
| REVIEW | 审核 | 审核中 |
| APPROVED | 已批准 | 审核通过 |
| PUBLISHED | 已发布 | 已发布 |
| ARCHIVED | 已归档 | 已归档 |
| CANCELLED | 已取消 | 已取消 |

## 关联关系

### 多对一关系（作为从表）
- **TeachingQualityReport → EvaluationTemplate**：报告基于评价模板
- **TeachingQualityReport → User（reviewer）**：报告有审核人
- **TeachingQualityReport → User（approver）**：报告有审批人
- **TeachingQualityReport → Department**：报告属于部门
- **TeachingQualityReport → Faculty**：报告属于院系

### 一对多关系（作为主表）
- **TeachingQualityReport → QualityImprovementPlan**：一个报告可产生多个改进计划
- **TeachingQualityReport → QualityMetrics**：一个报告包含多个质量指标
- **TeachingQualityReport → FeedbackRecord**：一个报告有多个反馈记录

### 多对多关系
- **TeachingQualityReport ↔ User（stakeholders）**：通过中间表关联相关利益者
- **TeachingQualityReport ↔ ImprovementSuggestion**：通过中间表关联改进建议

## 使用示例

### 查询示例

#### 1. 查询教师教学质量报告
```sql
SELECT
    r.report_name,
    r.overall_score,
    r.overall_level,
    r.overall_ranking,
    r.percentile_ranking,
    r.historical_comparison,
    r.peer_comparison,
    r.teaching_content_score,
    r.teaching_method_score,
    r.teaching_effectiveness_score,
    r.professional_quality_score,
    r.innovation_practice_score,
    r.report_status,
    r.approval_status
FROM dws_teaching_quality_report r
WHERE r.target_type = 'TEACHER'
  AND r.target_id = 12345
  AND r.report_period = 'SEMESTER'
  AND r.academic_year = '2023-2024'
  AND r.semester = '第一学期'
ORDER BY r.create_time DESC;
```

#### 2. 查询院系教学质量排名
```sql
SELECT
    r.target_name as faculty_name,
    r.overall_score,
    r.overall_level,
    r.overall_ranking,
    r.course_count,
    r.teacher_count,
    r.student_count,
    r.excellent_rate,
    r.pass_rate,
    r.average_score,
    r.standard_deviation,
    r.report_status
FROM dws_teaching_quality_report r
WHERE r.target_type = 'FACULTY'
  AND r.report_period = 'YEARLY'
  AND r.academic_year = '2023-2024'
  AND r.report_status = 'PUBLISHED'
ORDER BY r.overall_score DESC, r.excellent_rate DESC;
```

#### 3. 查询教学质量趋势分析
```sql
SELECT
    r.target_name,
    r.academic_year,
    r.semester,
    r.overall_score,
    r.overall_level,
    r.historical_comparison,
    r.improvement_rate,
    r.monthly_trends,
    r.quarterly_trends,
    r.trend_directions,
    r.trend_stability,
    r.trend_confidence
FROM dws_teaching_quality_report r
WHERE r.target_type = 'TEACHER'
  AND r.target_id = 12345
  AND r.report_period IN ('SEMESTER', 'YEARLY')
ORDER BY r.academic_year, r.semester;
```

#### 4. 查询质量分析报告
```sql
SELECT
    r.target_name,
    r.overall_score,
    r.strength_analysis,
    r.weakness_analysis,
    r.improvement_suggestions,
    r.priority_issues,
    r.action_plans,
    r.development_goals,
    r.resource_needs,
    r.support_measures,
    r.success_indicators
FROM dws_teaching_quality_report r
WHERE r.report_status = 'APPROVED'
  AND r.overall_score < 70
  AND r.target_type = 'TEACHER'
ORDER BY r.overall_score ASC;
```

#### 5. 查询对比分析数据
```sql
SELECT
    r.target_name,
    r.overall_score,
    r.peer_averages,
    r.department_averages,
    r.faculty_averages,
    r.university_averages,
    r.industry_benchmarks,
    r.national_benchmarks,
    r.benchmark_comparison,
    r.percentile_ranking,
    r.overall_ranking
FROM dws_teaching_quality_report r
WHERE r.report_period = 'YEARLY'
  AND r.academic_year = '2023-2024'
  AND r.benchmark_comparison IN ('EXCEEDS', 'MEETS')
ORDER BY r.percentile_ranking DESC;
```

### 插入示例

#### 1. 创建教师教学质量报告
```sql
INSERT INTO dws_teaching_quality_report (
    report_code, report_name, report_type, report_period,
    academic_year, semester,
    target_type, target_id, target_code, target_name,
    target_dept_id, target_dept_name,
    template_id, template_name,
    course_count, student_count, evaluation_count,
    overall_score, overall_level, overall_ranking,
    teaching_content_score, teaching_method_score,
    teaching_effectiveness_score, professional_quality_score,
    dimension_scores, score_statistics,
    strength_analysis, weakness_analysis,
    improvement_suggestions, priority_issues,
    report_status, approval_status,
    create_by
) VALUES (
    'TQR202401', '王教授2023-2024学年第一学期教学质量报告', 'TEACHER', 'SEMESTER',
    '2023-2024', '第一学期',
    'TEACHER', 12345, 'T2023001', '王教授',
    1001, '计算机科学系',
    2001, '教学质量综合评价模板',
    3, 120, 110,
    85.50, 'GOOD', 5,
    87.20, 84.80, 86.10, 88.20,
    '{"content": 87.2, "method": 84.8, "effectiveness": 86.1, "quality": 88.2}',
    '{"mean": 85.5, "median": 86.0, "std_dev": 5.2, "min": 75.0, "max": 95.0}',
    '教学内容丰富，理论与实践结合紧密，学生反馈良好',
    '教学方法需要更加多样化，互动环节可以增加',
    '[{"type": "method", "description": "增加互动教学", "priority": "HIGH"}]',
    '[{"issue": "教学方法单一", "severity": "MEDIUM", "impact": "学习体验"}]',
    'APPROVED', 'APPROVED',
    10001
);
```

#### 2. 创建院系教学质量年报
```sql
INSERT INTO dws_teaching_quality_report (
    report_code, report_name, report_type, report_period,
    academic_year,
    target_type, target_id, target_name,
    course_count, teacher_count, student_count,
    overall_score, overall_level,
    excellent_rate, pass_rate, average_score,
    score_distribution, peer_averages,
    trend_analysis, improvement_rate,
    report_status, published_status,
    create_by
) VALUES (
    'FQR202401', '计算机学院2023-2024学年教学质量报告', 'FACULTY', 'YEARLY',
    '2023-2024',
    'FACULTY', 1001, '计算机学院',
    156, 89, 2400,
    82.30, 'GOOD',
    25.60, 92.80, 82.30,
    '{"excellent": 256, "good": 520, "satisfactory": 180, "needs_improvement": 20, "poor": 4}',
    '{"dept_avg": 82.3, "university_avg": 79.8, "industry_avg": 80.5}',
    '整体教学质量稳步提升，创新实践能力突出',
    3.20,
    'PUBLISHED', 'PUBLISHED',
    10002
);
```

### 更新示例

#### 1. 更新报告审核状态
```sql
UPDATE dws_teaching_quality_report
SET report_status = 'REVIEW',
    reviewer_id = 20001,
    reviewer_name = '李主任',
    review_time = NOW(),
    review_comments = '报告内容完整，数据分析准确，建议批准发布',
    approval_status = 'PENDING',
    update_time = NOW(),
    version = version + 1
WHERE id = 1001
  AND report_status = 'DRAFT';
```

#### 2. 更新评分和排名信息
```sql
UPDATE dws_teaching_quality_report
SET overall_score = 87.50,
    overall_level = 'GOOD',
    overall_ranking = 3,
    percentile_ranking = 92.30,
    historical_comparison = 'IMPROVED',
    peer_comparison = 'ABOVE_AVERAGE',
    benchmark_comparison = 'EXCEEDS',
    improvement_rate = 4.20,
    update_time = NOW(),
    version = version + 1
WHERE report_code = 'TQR202401'
  AND target_type = 'TEACHER';
```

#### 3. 更新质量分析结果
```sql
UPDATE dws_teaching_quality_report
SET strength_analysis = '教学内容组织清晰，逻辑性强，案例丰富',
    weakness_analysis = '课堂互动有待加强，学生参与度需要提升',
    improvement_suggestions = JSON_ARRAY(
        '增加小组讨论环节',
        '引入实时互动工具',
        '设计更多实践案例'
    ),
    priority_issues = JSON_ARRAY(
        '{"issue": "课堂互动不足", "priority": "HIGH", "action": "增加互动环节"}'
    ),
    action_plans = JSON_ARRAY(
        '{"plan": "教学改革计划", "timeline": "3个月", "responsible": "教学组长"}'
    ),
    update_time = NOW(),
    version = version + 1
WHERE id = 1001;
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：报告编码、目标+周期必须唯一
2. **完整性检查**：评价对象、评分数据等关键字段不能为空
3. **逻辑检查**：评分范围合理，排名逻辑一致
4. **关联检查**：模板、审核人ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的报告记录
2. **评分修正**：修正不合理的评分数据
3. **排名更新**：更新动态排名信息
4. **状态同步**：同步报告状态和流程状态

## 性能优化

### 索引优化
- 目标对象和周期建立复合索引
- 评分和等级建立复合索引
- 状态和时间建立复合索引

### 查询优化
- 使用覆盖索引优化分析查询
- 避免JSON字段的全表扫描
- 合理使用评分和状态过滤

### 存储优化
- JSON字段压缩存储
- 历史报告数据归档
- 定期更新统计字段

## 安全考虑

### 数据保护
- 教学质量评价结果保护
- 个人评价数据隐私保护
- 审核意见信息安全

### 权限控制
- 报告查看需要相应权限
- 敏感数据访问需要审批
- 报告发布需要管理员权限

## 扩展说明

### 未来扩展方向
1. **AI预测**：基于历史数据的质量预测
2. **实时监控**：教学质量实时监控
3. **多维分析**：更细致的多维质量分析
4. **智能推荐**：个性化改进建议推荐

### 兼容性说明
- 支持与教学质量监控系统对接
- 支持多种评价框架集成
- 支持第三方数据分析平台

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*