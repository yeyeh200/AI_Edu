# 考试成绩实体 (ExamResult)

---

**实体编号：** DM-ACTIVITY-007
**实体名称：** 考试成绩实体
**所属域：** 教学活动域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

考试成绩实体是AI助评应用教学活动的核心事实实体，记录学生考试的详细成绩信息。该实体关联考试、学生、课程等，记录分数、等级、答题情况、错题分析、成绩统计等，为考试管理、学习评价、教学分析、成绩管理等提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_exam_result`
- **业务表名：** 考试成绩表
- **数据类型：** 事实表

### 主要用途
- 记录考试成绩信息
- 管理成绩统计分析
- 支持成绩等级评定
- 提供学习效果分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 考试成绩唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| exam_id | BIGINT | 20 | NOT NULL | 0 | 考试ID |
| exam_code | VARCHAR | 50 | NOT NULL | '' | 考试编码 |
| exam_name | VARCHAR | 200 | NOT NULL | '' | 考试名称 |
| exam_type | ENUM | - | NOT NULL | 'MIDTERM' | 考试类型 |
| course_id | BIGINT | 20 | NOT NULL | 0 | 课程ID |
| course_name | VARCHAR | 200 | NOT NULL | '' | 课程名称 |
| student_id | BIGINT | 20 | NOT NULL | 0 | 学生ID |
| student_name | VARCHAR | 100 | NOT NULL | '' | 学生姓名 |
| student_no | VARCHAR | 50 | NOT NULL | '' | 学号 |
| class_id | BIGINT | 20 | NOT NULL | 0 | 班级ID |
| class_name | VARCHAR | 100 | NOT NULL | '' | 班级名称 |
| teacher_id | BIGINT | 20 | NOT NULL | 0 | 教师ID |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 教师姓名 |

### 基础成绩字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_score | DECIMAL | 6,2 | NOT NULL | 0.00 | 总分 |
| max_score | DECIMAL | 6,2 | NOT NULL | 100.00 | 满分 |
| passing_score | DECIMAL | 6,2 | NOT NULL | 60.00 | 及格分 |
| score_percentage | DECIMAL | 5,2 | NOT NULL | 0.00 | 得分率（百分比） |
| grade_level | ENUM | - | NULL | NULL | 成绩等级 |
| gpa_points | DECIMAL | 3,2 | NULL | 0.00 | GPA绩点 |
| percentile_rank | DECIMAL | 5,2 | NULL | NULL | 百分位排名 |
| class_rank | INT | 11 | NULL | NULL | 班级排名 |
| grade_rank | INT | 11 | NULL | NULL | 年级排名 |
| is_passed | TINYINT | 1 | NOT NULL | 0 | 是否及格 |
| is_excellent | TINYINT | 1 | NOT NULL | 0 | 是否优秀 |

### 分项成绩字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| objective_score | DECIMAL | 6,2 | NULL | NULL | 客观题得分 |
| subjective_score | DECIMAL | 6,2 | NULL | NULL | 主观题得分 |
| practical_score | DECIMAL | 6,2 | NULL | NULL | 实践题得分 |
| theory_score | DECIMAL | 6,2 | NULL | NULL | 理论题得分 |
| bonus_score | DECIMAL | 6,2 | NULL | NULL | 加分分数 |
| penalty_score | DECIMAL | 6,2 | NULL | NULL | 扣分分数 |
| adjusted_score | DECIMAL | 6,2 | NULL | NULL | 调整分数 |
| curve_adjustment | DECIMAL | 6,2 | NULL | NULL | 曲线调整 |
| special_adjustment | DECIMAL | 6,2 | NULL | NULL | 特殊调整 |
| section_scores | JSON | - | NULL | NULL | 各部分得分详情 |

### 答题情况字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_questions | INT | 11 | NOT NULL | 0 | 总题数 |
| answered_questions | INT | 11 | NOT NULL | 0 | 答题数 |
| correct_answers | INT | 11 | NOT NULL | 0 | 正确题数 |
| wrong_answers | INT | 11 | NOT NULL | 0 | 错误题数 |
| skipped_questions | INT | 11 | NOT NULL | 0 | 跳过题数 |
| partial_credit_questions | INT | 11 | NULL | 0 | 部分分题数 |
| accuracy_rate | DECIMAL | 5,2 | NOT NULL | 0.00 | 正确率（百分比） |
| completion_rate | DECIMAL | 5,2 | NOT NULL | 0.00 | 完成率（百分比） |
| answer_details | JSON | - | NULL | NULL | 答题详情 |
| time_spent | INT | 11 | NULL | 0 | 用时（分钟） |
| time_per_question | DECIMAL | 8,2 | NULL | 0.00 | 平均每题用时（秒） |

### 知识点分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| knowledge_point_scores | JSON | - | NULL | NULL | 知识点得分 |
| weak_knowledge_points | JSON | - | NULL | NULL | 薄弱知识点 |
| strong_knowledge_points | JSON | - | NULL | NULL | 优势知识点 |
| mastery_level | DECIMAL | 5,2 | NULL | 0.00 | 掌握水平 |
| knowledge_gap_analysis | TEXT | - | NULL | NULL | 知识差距分析 |
| learning_suggestions | TEXT | - | NULL | NULL | 学习建议 |
| improvement_areas | JSON | - | NULL | NULL | 改进领域 |
| strength_areas | JSON | - | NULL | NULL | 优势领域 |
| topic_mastery_distribution | JSON | - | NULL | NULL | 主题掌握分布 |

### 考试表现字段

| 字种名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| performance_level | ENUM | - | NULL | NULL | 表现水平 |
| improvement_trend | ENUM | - | NULL | NULL | 改进趋势 |
| consistency_level | DECIMAL | 5,2 | NULL | 0.00 | 稳定性水平 |
| effort_rating | DECIMAL | 5,2 | NULL | 0.00 | 努力程度评分 |
| preparation_level | DECIMAL | 5,2 | NULL | 0.00 | 准备水平评分 |
| time_management | DECIMAL | 5,2 | NULL | 0.00 | 时间管理评分 |
| stress_performance | DECIMAL | 5,2 | NULL | 0.00 | 压力表现评分 |
| concentration_level | DECIMAL | 5,2 | NULL | 0.00 | 专注水平评分 |
| test_taking_skills | DECIMAL | 5,2 | NULL | 0.00 | 考试技巧评分 |
| confidence_level | DECIMAL | 5,2 | NULL | 0.00 | 自信水平评分 |

### 评价反馈字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teacher_comments | TEXT | - | NULL | NULL | 教师评语 |
| detailed_feedback | TEXT | - | NULL | NULL | 详细反馈 |
| strengths_feedback | TEXT | - | NULL | NULL | 优势反馈 |
| weaknesses_feedback | TEXT | - | NULL | NULL | 不足反馈 |
| improvement_feedback | TEXT | - | NULL | NULL | 改进反馈 |
| learning_guidance | TEXT | - | NULL | NULL | 学习指导 |
| study_plan | TEXT | - | NULL | NULL | 学习计划 |
| remedial_actions | TEXT | - | NULL | NULL | 补救措施 |
| encouragement_notes | TEXT | - | NULL | NULL | 鼓励说明 |
| peer_comparison | TEXT | - | NULL | NULL | 同学对比 |

### 异常情况字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| has_irregularity | TINYINT | 1 | NOT NULL | 0 | 是否有异常 |
| irregularity_type | ENUM | - | NULL | NULL | 异常类型 |
| irregularity_description | TEXT | - | NULL | NULL | 异常描述 |
| investigation_required | TINYINT | 1 | NOT NULL | 0 | 需要调查 |
| investigation_result | TEXT | - | NULL | NULL | 调查结果 |
| score_adjustment_reason | TEXT | - | NULL | NULL | 分数调整原因 |
| appeal_status | ENUM | - | NULL | NULL | 申诉状态 |
| appeal_request | TEXT | - | NULL | NULL | 申诉请求 |
| appeal_decision | TEXT | - | NULL | NULL | 申诉决定 |
| special_circumstances | TEXT | - | NULL | NULL | 特殊情况 |

### 统计分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| z_score | DECIMAL | 8,4 | NULL | NULL | Z分数 |
| t_score | DECIMAL | 6,2 | NULL | NULL | T分数 |
| stanine | INT | 11 | NULL | NULL | 标准九分 |
| quartile | INT | 11 | NULL | NULL | 四分位数 |
| decile | INT | 11 | NULL | NULL | 十分位数 |
| standard_deviation | DECIMAL | 8,4 | NULL | NULL | 标准差 |
| variance | DECIMAL | 8,4 | NULL | NULL | 方差 |
| correlation_with_attendance | DECIMAL | 5,2 | NULL | NULL | 与出勤相关性 |
| correlation_with_assignments | DECIMAL | 5,2 | NULL | NULL | 与作业相关性 |
| predictive_performance | TEXT | - | NULL | NULL | 预测性表现 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| result_status | ENUM | - | NOT NULL | 'TENTATIVE' | 成绩状态 |
| verification_status | ENUM | - | NULL | NULL | 验证状态 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| publication_status | ENUM | - | NULL | NULL | 发布状态 |
| is_confirmed | TINYINT | 1 | NOT NULL | 0 | 是否确认 |
| is_published | TINYINT | 1 | NOT NULL | 0 | 是否发布 |
| requires_review | TINYINT | 1 | NOT NULL | 0 | 需要复核 |
| review_deadline | DATETIME | - | NULL | NULL | 复核截止时间 |
| archive_status | ENUM | - | NULL | NULL | 归档状态 |
| last_modified_time | DATETIME | - | NULL | NULL | 最后修改时间 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| external_reference | VARCHAR | 100 | NULL | NULL | 外部参考号 |
| source_system | ENUM | - | NOT NULL | 'MANUAL' | 数据来源系统 |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |
| batch_id | VARCHAR | 100 | NULL | NULL | 批次ID |
| audit_trail | JSON | - | NULL | NULL | 审计轨迹 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_exam_student (exam_id, student_id)
UNIQUE KEY uk_exam_code_student (exam_code, student_no)
```

### 外键约束
```sql
FOREIGN KEY (exam_id) REFERENCES fact_exam(id) ON DELETE CASCADE
FOREIGN KEY (course_id) REFERENCES dim_course(id) ON DELETE CASCADE
FOREIGN KEY (student_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (class_id) REFERENCES dim_class(id) ON DELETE CASCADE
FOREIGN KEY (teacher_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_exam_id (exam_id)
INDEX idx_student_id (student_id)
INDEX idx_course_id (course_id)
INDEX idx_class_id (class_id)
INDEX idx_teacher_id (teacher_id)
INDEX idx_exam_type (exam_type)
INDEX idx_total_score (total_score)
INDEX idx_grade_level (grade_level)
INDEX idx_is_passed (is_passed)
INDEX idx_is_excellent (is_excellent)
INDEX idx_result_status (result_status)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_exam_student_score (exam_id, student_id, total_score)
INDEX idx_course_score (course_id, total_score)
INDEX idx_class_rank (class_id, class_rank)
INDEX idx_grade_level_score (grade_level, total_score)
INDEX idx_status_time (result_status, create_time)
```

### 检查约束
```sql
CHECK (exam_type IN ('QUIZ', 'MIDTERM', 'FINAL', 'MAKEUP', 'PRACTICAL', 'ORAL', 'THESIS', 'QUALIFICATION'))
CHECK (grade_level IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'PASS', 'FAIL', 'EXCELLENT', 'GOOD', 'SATISFACTORY', 'POOR'))
CHECK (result_status IN ('TENTATIVE', 'FINAL', 'UNDER_REVIEW', 'ADJUSTED', 'CANCELLED', 'VOID'))
CHECK (verification_status IN ('NOT_VERIFIED', 'VERIFIED', 'REQUIRES_REVIEW', 'VERIFICATION_FAILED'))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVIEW'))
CHECK (publication_status IN ('DRAFT', 'INTERNAL', 'PUBLISHED', 'WITHHELD'))
CHECK (appeal_status IN ('NONE', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'))
CHECK (irregularity_type IN ('NONE', 'ABSENCE', 'CHEATING', 'TECHNICAL', 'MEDICAL', 'ADMINISTRATIVE'))
CHECK (archive_status IN ('ACTIVE', 'ARCHIVED', 'DELETED'))
CHECK (performance_level IN ('OUTSTANDING', 'EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'))
CHECK (improvement_trend IN ('IMPROVING', 'STABLE', 'DECLINING', 'FLUCTUATING'))
CHECK (total_score >= 0)
CHECK (max_score > 0)
CHECK (passing_score >= 0)
CHECK (passing_score <= max_score)
CHECK (total_score <= max_score)
CHECK (score_percentage BETWEEN 0 AND 100)
CHECK (gpa_points BETWEEN 0 AND 4.0)
CHECK (percentile_rank BETWEEN 0 AND 100)
CHECK (class_rank >= 1)
CHECK (grade_rank >= 1)
CHECK (is_passed IN (0, 1))
CHECK (is_excellent IN (0, 1))
CHECK (objective_score IS NULL OR objective_score >= 0)
CHECK (subjective_score IS NULL OR subjective_score >= 0)
CHECK (practical_score IS NULL OR practical_score >= 0)
CHECK (theory_score IS NULL OR theory_score >= 0)
CHECK (bonus_score IS NULL OR bonus_score >= 0)
CHECK (penalty_score IS NULL OR penalty_score >= 0)
CHECK (total_questions >= 0)
CHECK (answered_questions >= 0)
CHECK (correct_answers >= 0)
CHECK (wrong_answers >= 0)
CHECK (skipped_questions >= 0)
CHECK (partial_credit_questions >= 0)
CHECK (accuracy_rate BETWEEN 0 AND 100)
CHECK (completion_rate BETWEEN 0 AND 100)
CHECK (time_spent >= 0)
CHECK (time_per_question >= 0)
CHECK (mastery_level BETWEEN 0 AND 100)
CHECK (effort_rating BETWEEN 0 AND 100)
CHECK (preparation_level BETWEEN 0 AND 100)
CHECK (time_management BETWEEN 0 AND 100)
CHECK (stress_performance BETWEEN 0 AND 100)
CHECK (concentration_level BETWEEN 0 AND 100)
CHECK (test_taking_skills BETWEEN 0 AND 100)
CHECK (confidence_level BETWEEN 0 AND 100)
CHECK (has_irregularity IN (0, 1))
CHECK (investigation_required IN (0, 1))
CHECK (is_confirmed IN (0, 1))
CHECK (is_published IN (0, 1))
CHECK (requires_review IN (0, 1))
CHECK (stanine BETWEEN 1 AND 9)
CHECK (quartile BETWEEN 1 AND 4)
CHECK (decile BETWEEN 1 AND 10)
CHECK (correlation_with_attendance BETWEEN -1 AND 1)
CHECK (correlation_with_assignments BETWEEN -1 AND 1)
CHECK (source_system IN ('MANUAL', 'ZJY', 'SYSTEM', 'API', 'IMPORT'))
```

## 枚举值定义

### 考试类型 (exam_type)
| 值 | 说明 | 备注 |
|----|------|------|
| QUIZ | 小测 | 随堂小测验 |
| MIDTERM | 期中 | 期中考试 |
| FINAL | 期末 | 期末考试 |
| MAKEUP | 补考 | 补考考试 |
| PRACTICAL | 实践 | 实践操作考试 |
| ORAL | 口试 | 口头答辩考试 |
| THESIS | 论文 | 毕业论文 |
| QUALIFICATION | 资格 | 资格认证考试 |

### 成绩等级 (grade_level)
| 值 | 说明 | 备注 |
|----|------|------|
| A+ | 优秀+ | 95-100分 |
| A | 优秀 | 90-94分 |
| A- | 优秀- | 85-89分 |
| B+ | 良好+ | 80-84分 |
| B | 良好 | 75-79分 |
| B- | 良好- | 70-74分 |
| C+ | 及格+ | 65-69分 |
| C | 及格 | 60-64分 |
| C- | 及格- | 55-59分 |
| D | 勉强 | 50-54分 |
| F | 不及格 | 0-49分 |
| PASS | 通过 | 通过制 |
| FAIL | 失败 | 不通过 |
| EXCELLENT | 优秀 | 综合优秀 |
| GOOD | 良好 | 综合良好 |
| SATISFACTORY | 满意 | 基本满意 |
| POOR | 差 | 综合较差 |

### 成绩状态 (result_status)
| 值 | 说明 | 备注 |
|----|------|------|
| TENTATIVE | 暂定 | 暂定成绩 |
| FINAL | 最终 | 最终成绩 |
| UNDER_REVIEW | 复核中 | 正在复核 |
| ADJUSTED | 已调整 | 调整后成绩 |
| CANCELLED | 已取消 | 成绩取消 |
| VOID | 无效 | 成绩无效 |

### 表现水平 (performance_level)
| 值 | 说明 | 备注 |
|----|------|------|
| OUTSTANDING | 突出 | 表现突出 |
| EXCELLENT | 优秀 | 表现优秀 |
| GOOD | 良好 | 表现良好 |
| SATISFACTORY | 满意 | 表现满意 |
| NEEDS_IMPROVEMENT | 需改进 | 需要改进 |
| POOR | 差 | 表现较差 |

### 改进趋势 (improvement_trend)
| 值 | 说明 | 备注 |
|----|------|------|
| IMPROVING | 进步 | 持续进步 |
| STABLE | 稳定 | 保持稳定 |
| DECLINING | 下降 | 成绩下降 |
| FLUCTUATING | 波动 | 有波动 |

### 异常类型 (irregularity_type)
| 值 | 说明 | 备注 |
|----|------|------|
| NONE | 无 | 无异常 |
| ABSENCE | 缺考 | 缺考情况 |
| CHEATING | 作弊 | 作弊行为 |
| TECHNICAL | 技术 | 技术问题 |
| MEDICAL | 医疗 | 医疗原因 |
| ADMINISTRATIVE | 行政 | 行政原因 |

## 关联关系

### 多对一关系（作为从表）
- **ExamResult → Exam**：考试成绩属于考试
- **ExamResult → Course**：考试成绩属于课程
- **ExamResult → Student**：考试成绩属于学生
- **ExamResult → Class**：考试成绩属于班级
- **ExamResult → User（teacher）**：考试成绩关联教师

### 自引用关系
- **ExamResult → ExamResult（appeal）**：申诉关联原成绩

## 使用示例

### 查询示例

#### 1. 查询考试成绩统计
```sql
SELECT
    e.exam_name,
    e.exam_type,
    COUNT(*) as total_students,
    AVG(er.total_score) as avg_score,
    MAX(er.total_score) as max_score,
    MIN(er.total_score) as min_score,
    STDDEV(er.total_score) as score_stddev,
    SUM(CASE WHEN er.is_passed = 1 THEN 1 END) as passed_count,
    SUM(CASE WHEN er.is_excellent = 1 THEN 1 END) as excellent_count,
    ROUND(AVG(er.score_percentage), 2) as avg_percentage,
    COUNT(CASE WHEN er.has_irregularity = 1 THEN 1 END) as irregularity_count
FROM fact_exam_result er
JOIN fact_exam e ON er.exam_id = e.id
WHERE er.result_status = 'FINAL'
GROUP BY er.exam_id, e.exam_name, e.exam_type
ORDER BY avg_score DESC;
```

#### 2. 查询学生成绩表现
```sql
SELECT
    u.student_no,
    u.user_name as student_name,
    c.class_name,
    COUNT(*) as exam_count,
    AVG(er.total_score) as avg_score,
    MAX(er.total_score) as best_score,
    MIN(er.total_score) as worst_score,
    AVG(er.gpa_points) as avg_gpa,
    SUM(CASE WHEN er.is_passed = 1 THEN 1 END) as passed_count,
    SUM(CASE WHEN er.is_excellent = 1 THEN 1 END) as excellent_count,
    AVG(er.accuracy_rate) as avg_accuracy,
    AVG(er.time_management) as avg_time_management,
    er.improvement_trend,
    er.performance_level
FROM fact_exam_result er
JOIN dim_user u ON er.student_id = u.id
JOIN dim_class c ON er.class_id = c.id
WHERE er.result_status = 'FINAL'
  AND er.create_time >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY er.student_id, u.student_no, u.user_name, c.class_name
ORDER BY avg_score DESC;
```

#### 3. 查询班级成绩分布
```sql
SELECT
    c.class_name,
    e.exam_name,
    e.exam_type,
    COUNT(*) as total_students,
    SUM(CASE WHEN er.grade_level IN ('A+', 'A', 'A-') THEN 1 END) as a_grade_count,
    SUM(CASE WHEN er.grade_level IN ('B+', 'B', 'B-') THEN 1 END) as b_grade_count,
    SUM(CASE WHEN er.grade_level IN ('C+', 'C', 'C-') THEN 1 END) as c_grade_count,
    SUM(CASE WHEN er.grade_level IN ('D', 'F') THEN 1 END) as d_f_grade_count,
    AVG(er.total_score) as avg_score,
    AVG(er.class_rank) as avg_class_rank,
    MAX(er.class_rank) as best_rank,
    MIN(er.class_rank) as worst_rank
FROM fact_exam_result er
JOIN fact_exam e ON er.exam_id = e.id
JOIN dim_class c ON er.class_id = c.id
WHERE er.result_status = 'FINAL'
  AND e.exam_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
GROUP BY er.class_id, c.class_name, er.exam_id, e.exam_name, e.exam_type
ORDER BY c.class_name, avg_score DESC;
```

#### 4. 查询知识点掌握情况
```sql
SELECT
    er.student_id,
    er.student_name,
    er.knowledge_point_scores,
    er.mastery_level,
    er.weak_knowledge_points,
    er.strong_knowledge_points,
    er.improvement_trend,
    er.learning_suggestions,
    er.improvement_areas
FROM fact_exam_result er
WHERE er.result_status = 'FINAL'
  AND er.knowledge_point_scores IS NOT NULL
  AND er.create_time >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
ORDER BY er.mastery_level DESC;
```

#### 5. 查询异常考试情况
```sql
SELECT
    e.exam_name,
    e.exam_date,
    er.student_name,
    er.student_no,
    er.total_score,
    er.has_irregularity,
    er.irregularity_type,
    er.irregularity_description,
    er.investigation_required,
    er.investigation_result,
    er.appeal_status,
    er.appeal_request,
    er.appeal_decision
FROM fact_exam_result er
JOIN fact_exam e ON er.exam_id = e.id
WHERE er.has_irregularity = 1
  OR er.appeal_status != 'NONE'
ORDER BY e.exam_date DESC, er.has_irregularity DESC;
```

### 插入示例

#### 1. 创建考试成绩记录
```sql
INSERT INTO fact_exam_result (
    exam_id, exam_code, exam_name, exam_type,
    course_id, course_name,
    student_id, student_name, student_no,
    class_id, class_name, teacher_id, teacher_name,
    total_score, max_score, passing_score, score_percentage,
    grade_level, gpa_points, class_rank,
    is_passed, is_excellent,
    total_questions, answered_questions, correct_answers,
    accuracy_rate, completion_rate,
    result_status, create_by, source_system
) VALUES (
    12345, 'MID2023001', '数据结构期中考试', 'MIDTERM',
    1001, '数据结构与算法',
    45678, '李四', 'S20230001',
    34567, '软件工程2023-1班', 23456, '张老师',
    85.5, 100.0, 60.0, 85.50,
    'B+', 3.5, 12,
    1, 0,
    50, 48, 42,
    87.5, 96.0,
    'TENTATIVE', 56789, 'MANUAL'
);
```

#### 2. 创建带详细分析的考试成绩
```sql
INSERT INTO fact_exam_result (
    exam_id, exam_code, exam_name, exam_type,
    course_id, course_name,
    student_id, student_name, student_no,
    class_id, class_name, teacher_id, teacher_name,
    total_score, max_score, passing_score, score_percentage,
    grade_level, gpa_points, percentile_rank, class_rank,
    is_passed, is_excellent,
    objective_score, subjective_score,
    total_questions, answered_questions, correct_answers,
    accuracy_rate, completion_rate,
    knowledge_point_scores, mastery_level,
    weak_knowledge_points, strong_knowledge_points,
    performance_level, improvement_trend,
    effort_rating, time_management,
    teacher_comments, detailed_feedback,
    result_status, create_by, source_system
) VALUES (
    12346, 'FINAL2023001', '计算机网络期末考试', 'FINAL',
    1002, '计算机网络',
    45679, '王五', 'S20230002',
    34567, '软件工程2023-1班', 23457, '李老师',
    92.0, 100.0, 60.0, 92.00,
    'A-', 3.7, 88.5, 5,
    1, 1,
    48.0, 44.0,
    60, 58, 55,
    94.8, 96.7,
    '{"TCP协议": 24, "UDP协议": 20, "网络层次": 22, "路由算法": 26}', 88.2,
    '["UDP协议", "路由算法"]', '["TCP协议", "网络层次"]',
    'EXCELLENT', 'IMPROVING',
    92.5, 88.0,
    '成绩优秀，特别是TCP协议和路由算法掌握很好，建议加强UDP协议学习', '学生展现了扎实的网络基础知识，实践能力强',
    'FINAL', 56789, 'SYSTEM'
);
```

### 更新示例

#### 1. 更新成绩确认状态
```sql
UPDATE fact_exam_result
SET result_status = 'FINAL',
    verification_status = 'VERIFIED',
    approval_status = 'APPROVED',
    is_confirmed = 1,
    publication_status = 'PUBLISHED',
    last_modified_time = NOW(),
    update_time = NOW(),
    version = version + 1
WHERE id = 78901
  AND result_status = 'TENTATIVE';
```

#### 2. 更新成绩等级和排名
```sql
UPDATE fact_exam_result
SET grade_level = 'A+',
    gpa_points = 4.0,
    percentile_rank = 95.5,
    class_rank = 1,
    grade_rank = 3,
    is_excellent = 1,
    update_time = NOW(),
    version = version + 1
WHERE id = 78901
  AND total_score >= 95;
```

#### 3. 处理申诉
```sql
UPDATE fact_exam_result
SET appeal_status = 'APPROVED',
    appeal_request = '认为主观题评分过低',
    appeal_decision = '经复核，调整主观题分数',
    subjective_score = subjective_score + 3.0,
    total_score = total_score + 3.0,
    score_percentage = (total_score + 3.0) * 100.0 / max_score,
    result_status = 'ADJUSTED',
    update_time = NOW(),
    version = version + 1
WHERE id = 78901
  AND appeal_status = 'SUBMITTED';
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：同一考试同一学生只能有一个成绩记录
2. **完整性检查**：考试、学生、课程等关键字段不能为空
3. **逻辑检查**：分数不能超过满分，排名逻辑一致
4. **关联检查**：考试ID、学生ID必须存在

### 数据清洗规则
1. **重复数据处理**：删除重复的成绩记录
2. **分数修正**：修正不合理的分数数据
3. **排名重算**：重新计算班级和年级排名
4. **状态同步**：同步成绩状态和发布状态

## 性能优化

### 索引优化
- 考试ID和学生ID建立复合索引
- 分数和等级建立复合索引
- 班级和排名建立复合索引

### 分区策略
- 按考试日期进行表分区
- 提高历史数据查询性能
- 方便数据归档管理

### 查询优化
- 使用覆盖索引优化统计查询
- 避免JSON字段的全表扫描
- 合理使用分数和等级过滤

## 安全考虑

### 数据保护
- 学生成绩隐私保护
- 敏感成绩信息脱敏
- 申诉过程记录保密

### 权限控制
- 成绩查看权限分级控制
- 成绩修改需要教师权限
- 申诉处理需要管理员权限

## 扩展说明

### 未来扩展方向
1. **智能分析**：基于AI的成绩预测和分析
2. **个性化评价**：基于学习风格的个性化评价
3. **学习诊断**：基于成绩的学习问题诊断
4. **成绩预测**：基于历史数据的成绩预测模型

### 兼容性说明
- 支持与教务系统成绩对接
- 支持多种评分标准集成
- 支持第三方考试系统集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*