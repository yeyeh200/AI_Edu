# 考试信息实体 (Exam)

---

**实体编号：** DM-ACTIVITY-006
**实体名称：** 考试信息实体
**所属域：** 教学活动域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

考试信息实体是AI助评应用教学活动的核心事实实体，记录课程考试的基本信息、考试安排、考试内容、评分标准等。该实体关联课程、教师、学生、教室等，支持考试的创建、安排、实施、阅卷、成绩发布等全流程管理，为教学质量评价、学习效果评估、教学改进等提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_exam`
- **业务表名：** 考试信息表
- **数据类型：** 事实表

### 主要用途
- 记录考试基本信息
- 管理考试安排实施
- 支持考试成绩管理
- 提供考试统计分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 考试唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| course_id | BIGINT | 20 | NOT NULL | 0 | 课程ID |
| course_name | VARCHAR | 200 | NOT NULL | '' | 课程名称 |
| teacher_id | BIGINT | 20 | NOT NULL | 0 | 教师ID |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 教师姓名 |
| class_id | BIGINT | 20 | NOT NULL | 0 | 班级ID |
| class_name | VARCHAR | 100 | NOT NULL | '' | 班级名称 |
| classroom_id | BIGINT | 20 | NULL | NULL | 教室ID |
| classroom_name | VARCHAR | 100 | NULL | NULL | 教室名称 |

### 考试基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| exam_code | VARCHAR | 50 | NOT NULL | '' | 考试编码 |
| exam_name | VARCHAR | 200 | NOT NULL | '' | 考试名称 |
| exam_type | ENUM | - | NOT NULL | 'MIDTERM' | 考试类型 |
| exam_category | ENUM | - | NOT NULL | 'WRITTEN' | 考试类别 |
| exam_level | ENUM | - | NOT NULL | 'COURSE' | 考试级别 |
| exam_description | TEXT | - | NULL | NULL | 考试描述 |
| exam_objectives | TEXT | - | NULL | NULL | 考试目标 |
| exam_scope | TEXT | - | NULL | NULL | 考试范围 |
| reference_materials | TEXT | - | NULL | NULL | 参考材料 |

### 时间安排字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| announce_time | DATETIME | - | NULL | NULL | 公布时间 |
| registration_start | DATETIME | - | NULL | NULL | 报名开始时间 |
| registration_end | DATETIME | - | NULL | NULL | 报名结束时间 |
| exam_date | DATE | - | NOT NULL | CURRENT_DATE | 考试日期 |
| start_time | TIME | - | NOT NULL | '09:00:00' | 开始时间 |
| end_time | TIME | - | NOT NULL | '11:00:00' | 结束时间 |
| duration_minutes | INT | 11 | NOT NULL | 120 | 考试时长（分钟） |
| make_up_date | DATE | - | NULL | NULL | 补考日期 |
| make_up_time | TIME | - | NULL | NULL | 补考时间 |
| result_release_time | DATETIME | - | NULL | NULL | 成绩发布时间 |

### 考试内容字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| question_types | JSON | - | NULL | NULL | 题型分布 |
| total_questions | INT | 11 | NOT NULL | 0 | 总题数 |
| question_count_detail | JSON | - | NULL | NULL | 各题型题数 |
| knowledge_points | JSON | - | NULL | NULL | 知识点分布 |
| difficulty_distribution | JSON | - | NULL | NULL | 难度分布 |
| content_weight | JSON | - | NULL | NULL | 内容权重 |
| exam_outline | TEXT | - | NULL | NULL | 考试大纲 |
| question_bank_id | BIGINT | 20 | NULL | NULL | 题库ID |
| random_questions | TINYINT | 1 | NOT NULL | 0 | 是否随机抽题 |

### 评分标准字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_score | DECIMAL | 6,2 | NOT NULL | 100.00 | 总分 |
| passing_score | DECIMAL | 6,2 | NOT NULL | 60.00 | 及格分 |
| excellent_score | DECIMAL | 6,2 | NULL | 90.00 | 优秀分 |
| scoring_method | ENUM | - | NOT NULL | 'MANUAL' | 评分方式 |
| auto_scoring_enabled | TINYINT | 1 | NOT NULL | 0 | 是否启用自动评分 |
| auto_scoring_weight | DECIMAL | 5,2 | NULL | 0.00 | 自动评分权重 |
| manual_scoring_weight | DECIMAL | 5,2 | NULL | 100.00 | 手动评分权重 |
| scoring_criteria | JSON | - | NULL | NULL | 评分标准 |
| rubric_details | JSON | - | NULL | NULL | 评分细则 |
| partial_scoring_rules | JSON | - | NULL | NULL | 部分分规则 |

### 考试规则字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| exam_mode | ENUM | - | NOT NULL | 'OFFLINE' | 考试模式 |
| access_type | ENUM | - | NOT NULL | 'CLOSED' | 开放方式 |
| attempt_limit | INT | 11 | NULL | 1 | 尝试次数 |
| allow_retake | TINYINT | 1 | NOT NULL | 0 | 允许重考 |
| retake_policy | TEXT | - | NULL | NULL | 重考政策 |
| allow_review | TINYINT | 1 | NOT NULL | 0 | 允许回顾 |
| review_start_time | DATETIME | - | NULL | NULL | 回顾开始时间 |
| review_end_time | DATETIME | - | NULL | NULL | 回顾结束时间 |
| time_limit_enforced | TINYINT | 1 | NOT NULL | 1 | 强制时间限制 |
| auto_submit_enabled | TINYINT | 1 | NOT NULL | 0 | 自动提交 |
| late_submission_policy | ENUM | - | NULL | NULL | 迟交政策 |

### 监考安全字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| invigilation_required | TINYINT | 1 | NOT NULL | 1 | 需要监考 |
| invigilator_count | INT | 11 | NULL | 2 | 监考人数 |
| invigilator_ids | JSON | - | NULL | NULL | 监考教师ID |
| camera_monitoring | TINYINT | 1 | NOT NULL | 0 | 摄像监控 |
| screen_monitoring | TINYINT | 1 | NOT NULL | 0 | 屏幕监控 |
| plagiarism_detection | TINYINT | 1 | NOT NULL | 0 | 作弊检测 |
| ip_restriction | TINYINT | 1 | NOT NULL | 0 | IP限制 |
| allowed_ip_ranges | JSON | - | NULL | NULL | 允许IP范围 |
| secure_browser | TINYINT | 1 | NOT NULL | 0 | 安全浏览器 |
| identity_verification | TINYINT | 1 | NOT NULL | 0 | 身份验证 |

### 参与统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_students | INT | 11 | NOT NULL | 0 | 总学生数 |
| registered_students | INT | 11 | NOT NULL | 0 | 报名学生数 |
| attended_students | INT | 11 | NOT NULL | 0 | 实考学生数 |
| completed_students | INT | 11 | NOT NULL | 0 | 完成学生数 |
| passed_students | INT | 11 | NULL | 0 | 及格学生数 |
| excellent_students | INT | 11 | NULL | 0 | 优秀学生数 |
| absent_students | INT | 11 | NULL | 0 | 缺考学生数 |
| cheating_students | INT | 11 | NULL | 0 | 作弊学生数 |
| registration_rate | DECIMAL | 5,2 | NULL | 0.00 | 报名率（百分比） |
| attendance_rate | DECIMAL | 5,2 | NULL | 0.00 | 出考率（百分比） |
| completion_rate | DECIMAL | 5,2 | NULL | 0.00 | 完成率（百分比） |
| passing_rate | DECIMAL | 5,2 | NULL | 0.00 | 及格率（百分比） |
| excellent_rate | DECIMAL | 5,2 | NULL | 0.00 | 优秀率（百分比） |
| average_score | DECIMAL | 6,2 | NULL | 0.00 | 平均分 |
| highest_score | DECIMAL | 6,2 | NULL | 0.00 | 最高分 |
| lowest_score | DECIMAL | 6,2 | NULL | 0.00 | 最低分 |
| score_variance | DECIMAL | 8,2 | NULL | 0.00 | 分数方差 |

### 资源配置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| exam_materials | JSON | - | NULL | NULL | 考试材料 |
| permitted_items | JSON | - | NULL | NULL | 允许携带物品 |
| prohibited_items | JSON | - | NULL | NULL | 禁止物品 |
| equipment_requirements | JSON | - | NULL | NULL | 设备要求 |
| software_requirements | JSON | - | NULL | NULL | 软件要求 |
| special_arrangements | JSON | - | NULL | NULL | 特殊安排 |
| accessibility_support | JSON | - | NULL | NULL | 无障碍支持 |

### 质量评价字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| difficulty_rating | DECIMAL | 5,2 | NULL | 0.00 | 难度评分 |
| discrimination_index | DECIMAL | 5,2 | NULL | 0.00 | 区分度指标 |
| reliability_coefficent | DECIMAL | 5,2 | NULL | 0.00 | 信度系数 |
| validity_coefficient | DECIMAL | 5,2 | NULL | 0.00 | 效度系数 |
| item_analysis | JSON | - | NULL | NULL | 项目分析 |
| student_satisfaction | DECIMAL | 5,2 | NULL | 0.00 | 学生满意度 |
| teacher_satisfaction | DECIMAL | 5,2 | NULL | 0.00 | 教师满意度 |
| exam_effectiveness | DECIMAL | 5,2 | NULL | 0.00 | 考试有效性 |
| fairness_rating | DECIMAL | 5,2 | NULL | 0.00 | 公平性评分 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| exam_status | ENUM | - | NOT NULL | 'DRAFT' | 考试状态 |
| publish_status | ENUM | - | NOT NULL | 'UNPUBLISHED' | 发布状态 |
| grading_status | ENUM | - | NULL | NULL | 阅卷状态 |
| results_status | ENUM | - | NULL | NULL | 成绩状态 |
| is_published | TINYINT | 1 | NOT NULL | 0 | 是否已发布 |
| is_archived | TINYINT | 1 | NOT NULL | 0 | 是否已归档 |
| requires_approval | TINYINT | 1 | NOT NULL | 0 | 需要审批 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| approved_by | BIGINT | 20 | NULL | NULL | 审批人ID |
| approved_time | DATETIME | - | NULL | NULL | 审批时间 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_by | BIGINT | 20 | NOT NULL | 0 | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| source_system | ENUM | - | NOT NULL | 'MANUAL' | 数据来源系统 |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |
| external_id | VARCHAR | 100 | NULL | NULL | 外部系统ID |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_exam_code (exam_code)
UNIQUE KEY uk_course_name_time (course_id, exam_name, exam_date)
```

### 外键约束
```sql
FOREIGN KEY (course_id) REFERENCES dim_course(id) ON DELETE CASCADE
FOREIGN KEY (teacher_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (class_id) REFERENCES dim_class(id) ON DELETE CASCADE
FOREIGN KEY (classroom_id) REFERENCES dim_classroom(id) ON DELETE SET NULL
FOREIGN KEY (question_bank_id) REFERENCES dim_question_bank(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (approved_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_course_id (course_id)
INDEX idx_teacher_id (teacher_id)
INDEX idx_class_id (class_id)
INDEX idx_classroom_id (classroom_id)
INDEX idx_exam_type (exam_type)
INDEX idx_exam_status (exam_status)
INDEX idx_publish_status (publish_status)
INDEX idx_exam_date (exam_date)
INDEX idx_start_time (start_time)
INDEX idx_create_time (create_time)
INDEX idx_result_release_time (result_release_time)
```

### 复合索引
```sql
INDEX idx_course_status (course_id, exam_status)
INDEX idx_teacher_date (teacher_id, exam_date)
INDEX idx_class_date (class_id, exam_date)
INDEX idx_status_date (exam_status, exam_date)
```

### 检查约束
```sql
CHECK (exam_type IN ('QUIZ', 'MIDTERM', 'FINAL', 'MAKEUP', 'PRACTICAL', 'ORAL', 'THESIS', 'QUALIFICATION'))
CHECK (exam_category IN ('WRITTEN', 'ORAL', 'PRACTICAL', 'ONLINE', 'MIXED'))
CHECK (exam_level IN ('COURSE', 'MODULE', 'PROGRAM', 'INSTITUTION'))
CHECK (exam_mode IN ('OFFLINE', 'ONLINE', 'HYBRID', 'HOME'))
CHECK (access_type IN ('OPEN', 'CLOSED', 'RESTRICTED'))
CHECK (scoring_method IN ('MANUAL', 'AUTO', 'MIXED', 'PEER'))
CHECK (late_submission_policy IN ('NOT_ALLOWED', 'PENALTY', 'ALLOWED'))
CHECK (exam_status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ARCHIVED'))
CHECK (publish_status IN ('UNPUBLISHED', 'PUBLISHED', 'SCHEDULED', 'WITHDRAWN'))
CHECK (grading_status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))
CHECK (results_status IN ('NOT_RELEASED', 'PARTIALLY_RELEASED', 'RELEASED'))
CHECK (requires_approval IN (0, 1))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVIEW'))
CHECK (is_published IN (0, 1))
CHECK (is_archived IN (0, 1))
CHECK (total_score > 0)
CHECK (passing_score >= 0)
CHECK (passing_score <= total_score)
CHECK (excellent_score >= passing_score)
CHECK (excellent_score <= total_score)
CHECK (duration_minutes > 0)
CHECK (attempt_limit > 0)
CHECK (auto_scoring_weight >= 0)
CHECK (auto_scoring_weight <= 100)
CHECK (manual_scoring_weight >= 0)
CHECK (manual_scoring_weight <= 100)
CHECK (auto_scoring_weight + manual_scoring_weight = 100)
CHECK (total_students >= 0)
CHECK (registered_students >= 0)
CHECK (registered_students <= total_students)
CHECK (attended_students >= 0)
CHECK (attended_students <= registered_students)
CHECK (completed_students >= 0)
CHECK (completed_students <= attended_students)
CHECK (passed_students >= 0)
CHECK (passed_students <= completed_students)
CHECK (excellent_students >= 0)
CHECK (excellent_students <= passed_students)
CHECK (absent_students >= 0)
CHECK (cheating_students >= 0)
CHECK (registration_rate BETWEEN 0 AND 100)
CHECK (attendance_rate BETWEEN 0 AND 100)
CHECK (completion_rate BETWEEN 0 AND 100)
CHECK (passing_rate BETWEEN 0 AND 100)
CHECK (excellent_rate BETWEEN 0 AND 100)
CHECK (average_score BETWEEN 0 AND total_score)
CHECK (highest_score BETWEEN 0 AND total_score)
CHECK (lowest_score BETWEEN 0 AND total_score)
CHECK (score_variance >= 0)
CHECK (difficulty_rating BETWEEN 0 AND 5)
CHECK (discrimination_index BETWEEN -1 AND 1)
CHECK (reliability_coefficent BETWEEN 0 AND 1)
CHECK (validity_coefficient BETWEEN 0 AND 1)
CHECK (student_satisfaction BETWEEN 0 AND 100)
CHECK (teacher_satisfaction BETWEEN 0 AND 100)
CHECK (exam_effectiveness BETWEEN 0 AND 100)
CHECK (fairness_rating BETWEEN 0 AND 100)
CHECK (source_system IN ('MANUAL', 'ZJY', 'SYSTEM', 'API'))
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
| THESIS | 论文 | 毕业论文答辩 |
| QUALIFICATION | 资格 | 资格认证考试 |

### 考试类别 (exam_category)
| 值 | 说明 | 备注 |
|----|------|------|
| WRITTEN | 笔试 | 书面考试 |
| ORAL | 口试 | 口头考试 |
| PRACTICAL | 实践 | 实践操作考试 |
| ONLINE | 在线 | 在线考试 |
| MIXED | 混合 | 多种形式结合 |

### 考试级别 (exam_level)
| 值 | 说明 | 备注 |
|----|------|------|
| COURSE | 课程级 | 单门课程考试 |
| MODULE | 模块级 | 教学模块考试 |
| PROGRAM | 专业级 | 专业综合考试 |
| INSTITUTION | 院校级 | 院级统一考试 |

### 考试模式 (exam_mode)
| 值 | 说明 | 备注 |
|----|------|------|
| OFFLINE | 线下 | 传统教室考试 |
| ONLINE | 在线 | 网络在线考试 |
| HYBRID | 混合 | 线上线下结合 |
| HOME | 居家 | 居家在线考试 |

### 开放方式 (access_type)
| 值 | 说明 | 备注 |
|----|------|------|
| OPEN | 开放 | 完全开放访问 |
| CLOSED | 封闭 | 需要授权访问 |
| RESTRICTED | 受限 | 受条件限制访问 |

### 评分方式 (scoring_method)
| 值 | 说明 | 备注 |
|----|------|------|
| MANUAL | 手动 | 教师手动评分 |
| AUTO | 自动 | 系统自动评分 |
| MIXED | 混合 | 手动自动结合 |
| PEER | 同行 | 学生互评 |

### 考试状态 (exam_status)
| 值 | 说明 | 备注 |
|----|------|------|
| DRAFT | 草稿 | 考试草稿状态 |
| PUBLISHED | 已发布 | 已发布给学生 |
| ACTIVE | 活跃 | 正在进行报名 |
| IN_PROGRESS | 进行中 | 考试正在进行 |
| COMPLETED | 已完成 | 考试已完成 |
| CANCELLED | 已取消 | 考试取消 |
| ARCHIVED | 已归档 | 考试已归档 |

### 发布状态 (publish_status)
| 值 | 说明 | 备注 |
|----|------|------|
| UNPUBLISHED | 未发布 | 学生不可见 |
| PUBLISHED | 已发布 | 学生可见 |
| SCHEDULED | 定时发布 | 预定时间发布 |
| WITHDRAWN | 已撤回 | 已撤回发布 |

### 迟交政策 (late_submission_policy)
| 值 | 说明 | 备注 |
|----|------|------|
| NOT_ALLOWED | 不允许 | 不允许迟交 |
| PENALTY | 扣分 | 迟交扣分 |
| ALLOWED | 允许 | 允许迟交 |

## 关联关系

### 多对一关系（作为从表）
- **Exam → Course**：考试属于课程
- **Exam → Teacher**：考试关联教师
- **Exam → Class**：考试属于班级
- **Exam → Classroom**：考试使用教室
- **Exam → QuestionBank**：考试关联题库

### 一对多关系（作为主表）
- **Exam → ExamResult**：一个考试对应多个成绩记录
- **Exam → ExamQuestion**：一个考试对应多个题目
- **Exam → ExamRegistration**：一个考试对应多个报名记录

## 使用示例

### 查询示例

#### 1. 查询课程考试统计
```sql
SELECT
    c.course_name,
    c.course_code,
    COUNT(*) as total_exams,
    SUM(CASE WHEN e.exam_type = 'MIDTERM' THEN 1 END) as midterm_count,
    SUM(CASE WHEN e.exam_type = 'FINAL' THEN 1 END) as final_count,
    SUM(CASE WHEN e.exam_status = 'COMPLETED' THEN 1 END) as completed_count,
    AVG(e.average_score) as avg_score,
    AVG(e.passing_rate) as avg_passing_rate,
    AVG(e.attendance_rate) as avg_attendance,
    AVG(e.student_satisfaction) as avg_satisfaction
FROM fact_exam e
JOIN dim_course c ON e.course_id = c.id
WHERE e.exam_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  AND e.exam_status != 'CANCELLED'
GROUP BY e.course_id, c.course_name, c.course_code
ORDER BY total_exams DESC;
```

#### 2. 查询教师考试管理情况
```sql
SELECT
    t.user_name as teacher_name,
    t.user_no,
    COUNT(*) as total_exams,
    SUM(CASE WHEN e.exam_status = 'COMPLETED' THEN 1 END) as completed_count,
    SUM(CASE WHEN e.exam_type = 'FINAL' THEN 1 END) as final_count,
    SUM(e.total_students) as total_students_assigned,
    SUM(e.attended_students) as total_attended,
    AVG(e.attendance_rate) as avg_attendance_rate,
    AVG(e.passing_rate) as avg_passing_rate,
    AVG(e.average_score) as avg_score,
    AVG(e.student_satisfaction) as avg_satisfaction,
    COUNT(DISTINCT e.course_id) as course_count
FROM fact_exam e
JOIN dim_user t ON e.teacher_id = t.id
WHERE e.exam_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
  AND t.user_type = 'TEACHER'
GROUP BY t.id, t.user_name, t.user_no
ORDER BY total_exams DESC;
```

#### 3. 查询考试质量分析
```sql
SELECT
    exam_type,
    exam_category,
    COUNT(*) as exam_count,
    AVG(total_score) as avg_total_score,
    AVG(average_score) as avg_student_score,
    AVG(passing_rate) as avg_passing_rate,
    AVG(difficulty_rating) as avg_difficulty,
    AVG(discrimination_index) as avg_discrimination,
    AVG(reliability_coefficent) as avg_reliability,
    AVG(exam_effectiveness) as avg_effectiveness,
    AVG(fairness_rating) as avg_fairness,
    AVG(student_satisfaction) as avg_satisfaction
FROM fact_exam
WHERE exam_status = 'COMPLETED'
  AND grading_status = 'COMPLETED'
  AND exam_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY exam_type, exam_category
ORDER BY exam_count DESC;
```

#### 4. 查询即将进行的考试
```sql
SELECT
    e.exam_name,
    c.course_name,
    t.user_name as teacher_name,
    cl.class_name,
    e.exam_date,
    e.start_time,
    e.end_time,
    e.duration_minutes,
    e.exam_type,
    e.exam_mode,
    e.total_students,
    e.registered_students,
    e.registration_rate,
    e.publish_status
FROM fact_exam e
JOIN dim_course c ON e.course_id = c.id
JOIN dim_user t ON e.teacher_id = t.id
JOIN dim_class cl ON e.class_id = cl.id
WHERE e.exam_status IN ('PUBLISHED', 'ACTIVE')
  AND e.exam_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)
ORDER BY e.exam_date, e.start_time;
```

#### 5. 查询考试参与情况统计
```sql
SELECT
    e.exam_date,
    e.exam_type,
    COUNT(*) as exam_count,
    SUM(e.total_students) as total_planned,
    SUM(e.registered_students) as total_registered,
    SUM(e.attended_students) as total_attended,
    SUM(e.completed_students) as total_completed,
    SUM(e.passed_students) as total_passed,
    SUM(e.absent_students) as total_absent,
    SUM(e.cheating_students) as total_cheating,
    AVG(e.registration_rate) as avg_registration_rate,
    AVG(e.attendance_rate) as avg_attendance_rate,
    AVG(e.completion_rate) as avg_completion_rate,
    AVG(e.passing_rate) as avg_passing_rate
FROM fact_exam e
WHERE e.exam_status = 'COMPLETED'
  AND e.exam_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY e.exam_date, e.exam_type
ORDER BY e.exam_date DESC;
```

#### 6. 查询考试成绩分布
```sql
SELECT
    e.exam_name,
    e.exam_date,
    e.average_score,
    e.highest_score,
    e.lowest_score,
    e.score_variance,
    e.passing_rate,
    e.excellent_rate,
    CASE
        WHEN e.average_score >= 90 THEN 'A'
        WHEN e.average_score >= 80 THEN 'B'
        WHEN e.average_score >= 70 THEN 'C'
        WHEN e.average_score >= 60 THEN 'D'
        ELSE 'F'
    END as grade_level,
    e.exam_effectiveness,
    e.fairness_rating
FROM fact_exam e
WHERE e.exam_status = 'COMPLETED'
  AND e.grading_status = 'COMPLETED'
  AND e.exam_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
ORDER BY e.exam_date DESC, e.average_score DESC;
```

### 插入示例

#### 1. 创建期中考试
```sql
INSERT INTO fact_exam (
    exam_code, exam_name, exam_type, exam_category, exam_level,
    course_id, course_name, teacher_id, teacher_name, class_id, class_name,
    exam_date, start_time, end_time, duration_minutes,
    total_score, passing_score, excellent_score, scoring_method,
    total_questions, question_types, difficulty_distribution,
    total_students, exam_status, publish_status, invigilation_required,
    create_by, source_system
) VALUES (
    'MID2023001', '数据结构期中考试', 'MIDTERM', 'WRITTEN', 'COURSE',
    1001, '数据结构与算法', 23456, '张老师', 34567, '软件工程2023-1班',
    '2023-11-15', '09:00:00', '11:00:00', 120,
    100.00, 60.00, 85.00, 'MANUAL',
    50, '{"选择题": 20, "填空题": 10, "编程题": 3, "简答题": 2}', '{"简单": 30, "中等": 50, "困难": 20}',
    45, 'PUBLISHED', 'PUBLISHED', 1,
    12345, 'MANUAL'
);
```

#### 2. 创建在线考试
```sql
INSERT INTO fact_exam (
    exam_code, exam_name, exam_type, exam_category, exam_mode,
    course_id, course_name, teacher_id, teacher_name, class_id, class_name,
    exam_date, start_time, end_time, duration_minutes,
    total_score, passing_score, scoring_method,
    auto_scoring_enabled, auto_scoring_weight, manual_scoring_weight,
    plagiarism_detection, camera_monitoring, secure_browser,
    total_students, exam_status, publish_status,
    create_by, source_system
) VALUES (
    'ONL2023001', '计算机网络在线测试', 'QUIZ', 'ONLINE', 'ONLINE',
    1002, '计算机网络', 23457, '李老师', 34567, '软件工程2023-1班',
    '2023-11-20', '14:00:00', '15:30:00', 90,
    100.00, 70.00, 'AUTO',
    1, 80.00, 20.00,
    1, 1, 1,
    45, 'PUBLISHED', 'PUBLISHED',
    12345, 'SYSTEM'
);
```

### 更新示例

#### 1. 更新考试参与统计
```sql
UPDATE fact_exam
SET registered_students = 43,
    attended_students = 42,
    completed_students = 40,
    passed_students = 35,
    excellent_students = 12,
    absent_students = 1,
    cheating_students = 0,
    registration_rate = 95.56,
    attendance_rate = 97.67,
    completion_rate = 95.24,
    passing_rate = 87.50,
    excellent_rate = 30.00,
    average_score = 78.5,
    highest_score = 96.0,
    lowest_score = 52.0,
    score_variance = 156.8,
    exam_status = 'COMPLETED',
    grading_status = 'IN_PROGRESS',
    update_time = NOW(),
    version = version + 1
WHERE id = 67890;
```

#### 2. 更新考试质量评价
```sql
UPDATE fact_exam
SET difficulty_rating = 3.2,
    discrimination_index = 0.52,
    reliability_coefficent = 0.86,
    validity_coefficient = 0.81,
    exam_effectiveness = 88.5,
    fairness_rating = 92.3,
    student_satisfaction = 85.7,
    teacher_satisfaction = 89.2,
    grading_status = 'COMPLETED',
    results_status = 'RELEASED',
    result_release_time = NOW(),
    update_time = NOW(),
    version = version + 1
WHERE id = 67890;
```

#### 3. 发布考试成绩
```sql
UPDATE fact_exam
SET results_status = 'RELEASED',
    result_release_time = NOW(),
    is_published = 1,
    update_time = NOW(),
    version = version + 1
WHERE id = 67890
  AND grading_status = 'COMPLETED'
  AND approval_status = 'APPROVED';
```

## 数据质量

### 质量检查规则
1. **完整性检查**：课程、教师、班级等关键字段不能为空
2. **一致性检查**：学生人数与班级人数逻辑一致
3. **时间检查**：考试时间安排合理，无冲突
4. **范围检查**：评分、百分比等字段范围合理

### 数据清洗规则
1. **重复数据处理**：删除重复的考试记录
2. **时间修正**：修正不合理的考试时间安排
3. **统计修正**：重新计算参与率、及格率等
4. **状态同步**：同步考试状态和时间状态

## 性能优化

### 索引优化
- 课程ID和状态建立复合索引
- 教师ID和考试日期建立复合索引
- 班级ID和考试日期建立复合索引

### 分区策略
- 按考试日期进行表分区
- 提高历史数据查询性能
- 方便数据归档管理

### 查询优化
- 使用覆盖索引优化统计查询
- 避免JSON字段的全表扫描
- 合理使用时间范围过滤

## 安全考虑

### 数据保护
- 考试内容和答案严格保密
- 学生成绩隐私数据保护
- 监考记录访问控制

### 权限控制
- 考试创建和修改需要教师权限
- 成绩查看需要分级权限控制
- 考试监控记录需要特殊权限

## 扩展说明

### 未来扩展方向
1. **AI防作弊**：基于AI的智能作弊检测
2. **自适应考试**：基于能力的自适应考试
3. **多维度评价**：多元化的能力评价体系
4. **实时监控**：考试过程实时监控

### 兼容性说明
- 支持与职教云考试系统对接
- 支持多种考试模式集成
- 支持第三方监考系统集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*