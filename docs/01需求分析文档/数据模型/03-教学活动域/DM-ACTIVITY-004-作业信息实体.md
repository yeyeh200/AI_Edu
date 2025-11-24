# 作业信息实体 (Assignment)

---

**实体编号：** DM-ACTIVITY-004
**实体名称：** 作业信息实体
**所属域：** 教学活动域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

作业信息实体是AI助评应用教学活动的核心事实实体，记录课程作业的基本信息、内容要求、时间安排、评分标准等。该实体关联课程、教师、学生等，支持作业的创建、发布、提交、批改、反馈等全流程管理，为教学质量评价、学生学习分析、教学改进等提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_assignment`
- **业务表名：** 作业信息表
- **数据类型：** 事实表

### 主要用途
- 记录作业基本信息
- 管理作业生命周期
- 支持作业评分反馈
- 提供作业统计分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 作业唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| course_id | BIGINT | 20 | NOT NULL | 0 | 课程ID |
| course_name | VARCHAR | 200 | NOT NULL | '' | 课程名称 |
| teacher_id | BIGINT | 20 | NOT NULL | 0 | 教师ID |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 教师姓名 |
| class_id | BIGINT | 20 | NOT NULL | 0 | 班级ID |
| class_name | VARCHAR | 100 | NOT NULL | '' | 班级名称 |
| teaching_activity_id | BIGINT | 20 | NULL | NULL | 关联教学活动ID |

### 作业基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| assignment_code | VARCHAR | 50 | NOT NULL | '' | 作业编码 |
| assignment_title | VARCHAR | 300 | NOT NULL | '' | 作业标题 |
| assignment_type | ENUM | - | NOT NULL | 'HOMEWORK' | 作业类型 |
| assignment_category | ENUM | - | NOT NULL | 'INDIVIDUAL' | 作业类别 |
| difficulty_level | ENUM | - | NOT NULL | 'MEDIUM' | 难度等级 |
| assignment_description | TEXT | - | NOT NULL | '' | 作业描述 |
| assignment_objectives | TEXT | - | NULL | NULL | 作业目标 |
| assignment_instructions | TEXT | - | NULL | NULL | 作业说明 |

### 时间信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| publish_time | DATETIME | - | NULL | NULL | 发布时间 |
| start_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 开始时间 |
| deadline_time | DATETIME | - | NOT NULL | DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY) | 截止时间 |
| extended_deadline | DATETIME | - | NULL | NULL | 延期截止时间 |
| close_time | DATETIME | - | NULL | NULL | 关闭时间 |
| grading_deadline | DATETIME | - | NULL | NULL | 批改截止时间 |

### 作业要求字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| content_requirements | TEXT | - | NULL | NULL | 内容要求 |
| format_requirements | TEXT | - | NULL | NULL | 格式要求 |
| submission_format | ENUM | - | NOT NULL | 'ONLINE' | 提交格式 |
| max_file_size | INT | 11 | NULL | 10485760 | 最大文件大小（字节） |
| allowed_file_types | JSON | - | NULL | NULL | 允许文件类型 |
| word_count_min | INT | 11 | NULL | NULL | 最少字数 |
| word_count_max | INT | 11 | NULL | NULL | 最多字数 |
| page_count_min | INT | 11 | NULL | NULL | 最少页数 |
| page_count_max | INT | 11 | NULL | NULL | 最多页数 |

### 评分标准字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_score | DECIMAL | 5,2 | NOT NULL | 100.00 | 总分 |
| passing_score | DECIMAL | 5,2 | NOT NULL | 60.00 | 及格分 |
| grading_method | ENUM | - | NOT NULL | 'MANUAL' | 评分方式 |
| scoring_criteria | JSON | - | NULL | NULL | 评分标准 |
| rubric_details | JSON | - | NULL | NULL | 评分细则 |
| auto_grading_config | JSON | - | NULL | NULL | 自动评分配置 |
| peer_review_enabled | TINYINT | 1 | NOT NULL | 0 | 是否开启同行评议 |
| peer_review_weight | DECIMAL | 5,2 | NULL | 0.00 | 同行评议权重 |
| teacher_review_weight | DECIMAL | 5,2 | NULL | 100.00 | 教师评分权重 |

### 参与统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_students | INT | 11 | NOT NULL | 0 | 总学生数 |
| submitted_count | INT | 11 | NOT NULL | 0 | 提交人数 |
| graded_count | INT | 11 | NOT NULL | 0 | 已批改人数 |
| passing_count | INT | 11 | NULL | 0 | 及格人数 |
| excellent_count | INT | 11 | NULL | 0 | 优秀人数 |
| late_submission_count | INT | 11 | NULL | 0 | 迟交人数 |
| plagiarism_count | INT | 11 | NULL | 0 | 作弊人数 |
| submission_rate | DECIMAL | 5,2 | NULL | 0.00 | 提交率（百分比） |
| passing_rate | DECIMAL | 5,2 | NULL | 0.00 | 及格率（百分比） |
| average_score | DECIMAL | 5,2 | NULL | 0.00 | 平均分 |
| highest_score | DECIMAL | 5,2 | NULL | 0.00 | 最高分 |
| lowest_score | DECIMAL | 5,2 | NULL | 0.00 | 最低分 |

### 作业资源字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| attachment_files | JSON | - | NULL | NULL | 附件文件 |
| reference_materials | JSON | - | NULL | NULL | 参考资料 |
| template_files | JSON | - | NULL | NULL | 模板文件 |
| example_files | JSON | - | NULL | NULL | 示例文件 |
| video_resources | JSON | - | NULL | NULL | 视频资源 |
| reading_materials | JSON | - | NULL | NULL | 阅读材料 |

### 控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| assignment_status | ENUM | - | NOT NULL | 'DRAFT' | 作业状态 |
| publish_status | ENUM | - | NOT NULL | 'UNPUBLISHED' | 发布状态 |
| allow_late_submission | TINYINT | 1 | NOT NULL | 0 | 允许迟交 |
| late_penalty_rate | DECIMAL | 5,2 | NULL | 0.00 | 迟交扣分率 |
| allow_resubmission | TINYINT | 1 | NOT NULL | 0 | 允许重新提交 |
| max_resubmissions | INT | 11 | NULL | 0 | 最大提交次数 |
| require_confirmation | TINYINT | 1 | NOT NULL | 0 | 需要确认 |
| show_correct_answer | TINYINT | 1 | NOT NULL | 0 | 显示正确答案 |
| show_statistics | TINYINT | 1 | NOT NULL | 0 | 显示统计信息 |
| is_published_in_gradebook | TINYINT | 1 | NOT NULL | 0 | 是否发布成绩册 |

### 质量评价字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| difficulty_rating | DECIMAL | 5,2 | NULL | 0.00 | 难度评分 |
| time_required_estimate | INT | 11 | NULL | 0 | 预计所需时间（分钟） |
| actual_average_time | INT | 11 | NULL | 0 | 实际平均时间（分钟） |
| student_satisfaction | DECIMAL | 5,2 | NULL | 0.00 | 学生满意度 |
| assignment_effectiveness | DECIMAL | 5,2 | NULL | 0.00 | 作业有效性 |
| learning_outcome_achievement | DECIMAL | 5,2 | NULL | 0.00 | 学习目标达成度 |

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
UNIQUE KEY uk_assignment_code (assignment_code)
UNIQUE KEY uk_course_title_time (course_id, assignment_title, create_time)
```

### 外键约束
```sql
FOREIGN KEY (course_id) REFERENCES dim_course(id) ON DELETE CASCADE
FOREIGN KEY (teacher_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (class_id) REFERENCES dim_class(id) ON DELETE CASCADE
FOREIGN KEY (teaching_activity_id) REFERENCES fact_teaching_activity(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_course_id (course_id)
INDEX idx_teacher_id (teacher_id)
INDEX idx_class_id (class_id)
INDEX idx_teaching_activity_id (teaching_activity_id)
INDEX idx_assignment_type (assignment_type)
INDEX idx_assignment_status (assignment_status)
INDEX idx_publish_status (publish_status)
INDEX idx_deadline_time (deadline_time)
INDEX idx_create_time (create_time)
INDEX idx_difficulty_level (difficulty_level)
```

### 复合索引
```sql
INDEX idx_course_status (course_id, assignment_status)
INDEX idx_teacher_deadline (teacher_id, deadline_time)
INDEX idx_class_deadline (class_id, deadline_time)
INDEX idx_status_deadline (assignment_status, deadline_time)
```

### 检查约束
```sql
CHECK (assignment_type IN ('HOMEWORK', 'PROJECT', 'EXPERIMENT', 'REPORT', 'PRESENTATION', 'QUIZ', 'EXAM', 'PRACTICE'))
CHECK (assignment_category IN ('INDIVIDUAL', 'GROUP', 'TEAM', 'PAIR', 'CLASS'))
CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD', 'VERY_HARD'))
CHECK (submission_format IN ('ONLINE', 'OFFLINE', 'EMAIL', 'PAPER', 'PRESENTATION'))
CHECK (grading_method IN ('MANUAL', 'AUTO', 'PEER', 'MIXED'))
CHECK (assignment_status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'CLOSED', 'CANCELLED', 'ARCHIVED'))
CHECK (publish_status IN ('UNPUBLISHED', 'PUBLISHED', 'SCHEDULED', 'WITHDRAWN'))
CHECK (total_score > 0)
CHECK (passing_score >= 0)
CHECK (passing_score <= total_score)
CHECK (late_penalty_rate BETWEEN 0 AND 100)
CHECK (peer_review_weight BETWEEN 0 AND 100)
CHECK (teacher_review_weight BETWEEN 0 AND 100)
CHECK (max_resubmissions >= 0)
CHECK (submission_rate BETWEEN 0 AND 100)
CHECK (passing_rate BETWEEN 0 AND 100)
CHECK (average_score BETWEEN 0 AND total_score)
CHECK (highest_score BETWEEN 0 AND total_score)
CHECK (lowest_score BETWEEN 0 AND total_score)
CHECK (difficulty_rating BETWEEN 0 AND 5)
CHECK (student_satisfaction BETWEEN 0 AND 100)
CHECK (assignment_effectiveness BETWEEN 0 AND 100)
CHECK (learning_outcome_achievement BETWEEN 0 AND 100)
CHECK (total_students >= 0)
CHECK (submitted_count >= 0)
CHECK (submitted_count <= total_students)
CHECK (graded_count >= 0)
CHECK (graded_count <= submitted_count)
CHECK (passing_count >= 0)
CHECK (passing_count <= graded_count)
CHECK (excellent_count >= 0)
CHECK (excellent_count <= graded_count)
CHECK (late_submission_count >= 0)
CHECK (plagiarism_count >= 0)
CHECK (source_system IN ('MANUAL', 'ZJY', 'SYSTEM', 'API'))
```

## 枚举值定义

### 作业类型 (assignment_type)
| 值 | 说明 | 备注 |
|----|------|------|
| HOMEWORK | 课后作业 | 常规课后作业 |
| PROJECT | 项目作业 | 项目实践作业 |
| EXPERIMENT | 实验作业 | 实验操作作业 |
| REPORT | 报告作业 | 报告撰写作业 |
| PRESENTATION | 展示作业 | 演讲展示作业 |
| QUIZ | 小测作业 | 随堂小测作业 |
| EXAM | 考试作业 | 期末考试作业 |
| PRACTICE | 练习作业 | 技能练习作业 |

### 作业类别 (assignment_category)
| 值 | 说明 | 备注 |
|----|------|------|
| INDIVIDUAL | 个人作业 | 学生独立完成 |
| GROUP | 小组作业 | 小组合作完成 |
| TEAM | 团队作业 | 团队协作完成 |
| PAIR | 配对作业 | 两人配对完成 |
| CLASS | 班级作业 | 全班共同作业 |

### 难度等级 (difficulty_level)
| 值 | 说明 | 备注 |
|----|------|------|
| EASY | 简单 | 容易完成 |
| MEDIUM | 中等 | 难度适中 |
| HARD | 困难 | 具有挑战性 |
| VERY_HARD | 很难 | 非常困难 |

### 提交格式 (submission_format)
| 值 | 说明 | 备注 |
|----|------|------|
| ONLINE | 在线提交 | 系统在线提交 |
| OFFLINE | 离线提交 | 纸质版提交 |
| EMAIL | 邮件提交 | 邮件附件提交 |
| PAPER | 纸质提交 | 纸质文档提交 |
| PRESENTATION | 展示提交 | 演讲展示提交 |

### 评分方式 (grading_method)
| 值 | 说明 | 备注 |
|----|------|------|
| MANUAL | 手动评分 | 教师手动评分 |
| AUTO | 自动评分 | 系统自动评分 |
| PEER | 同行评分 | 学生互评 |
| MIXED | 混合评分 | 多种方式结合 |

### 作业状态 (assignment_status)
| 值 | 说明 | 备注 |
|----|------|------|
| DRAFT | 草稿 | 未发布状态 |
| PUBLISHED | 已发布 | 已发布给学生 |
| ACTIVE | 进行中 | 学生正在做 |
| CLOSED | 已关闭 | 截止已到 |
| CANCELLED | 已取消 | 作业取消 |
| ARCHIVED | 已归档 | 作业归档 |

### 发布状态 (publish_status)
| 值 | 说明 | 备注 |
|----|------|------|
| UNPUBLISHED | 未发布 | 学生不可见 |
| PUBLISHED | 已发布 | 学生可见 |
| SCHEDULED | 定时发布 | 预定时间发布 |
| WITHDRAWN | 已撤回 | 已撤回发布 |

## 关联关系

### 多对一关系（作为从表）
- **Assignment → Course**：作业属于课程
- **Assignment → Teacher**：作业关联教师
- **Assignment → Class**：作业属于班级
- **Assignment → TeachingActivity**：作业关联教学活动

### 一对多关系（作为主表）
- **Assignment → AssignmentSubmission**：一个作业对应多个提交记录
- **Assignment → AssignmentGrade**：一个作业对应多个评分记录

## 使用示例

### 查询示例

#### 1. 查询课程作业统计
```sql
SELECT
    c.course_name,
    c.course_code,
    COUNT(*) as total_assignments,
    SUM(CASE WHEN a.assignment_type = 'HOMEWORK' THEN 1 END) as homework_count,
    SUM(CASE WHEN a.assignment_type = 'PROJECT' THEN 1 END) as project_count,
    SUM(CASE WHEN a.difficulty_level = 'EASY' THEN 1 END) as easy_count,
    SUM(CASE WHEN a.difficulty_level = 'HARD' THEN 1 END) as hard_count,
    AVG(a.total_score) as avg_total_score,
    AVG(a.average_score) as avg_student_score,
    AVG(a.submission_rate) as avg_submission_rate,
    AVG(a.passing_rate) as avg_passing_rate
FROM fact_assignment a
JOIN dim_course c ON a.course_id = c.id
WHERE a.create_time >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
  AND a.assignment_status != 'CANCELLED'
GROUP BY a.course_id, c.course_name, c.course_code
ORDER BY total_assignments DESC;
```

#### 2. 查询教师作业管理情况
```sql
SELECT
    t.user_name as teacher_name,
    t.user_no,
    COUNT(*) as total_assignments,
    SUM(CASE WHEN a.assignment_status = 'ACTIVE' THEN 1 END) as active_count,
    SUM(CASE WHEN a.assignment_status = 'CLOSED' THEN 1 END) as closed_count,
    SUM(a.total_students) as total_students_assigned,
    SUM(a.submitted_count) as total_submissions,
    AVG(a.submission_rate) as avg_submission_rate,
    AVG(a.passing_rate) as avg_passing_rate,
    AVG(a.student_satisfaction) as avg_satisfaction,
    COUNT(DISTINCT a.course_id) as course_count
FROM fact_assignment a
JOIN dim_user t ON a.teacher_id = t.id
WHERE a.create_time >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
  AND t.user_type = 'TEACHER'
GROUP BY t.id, t.user_name, t.user_no
ORDER BY total_assignments DESC;
```

#### 3. 查询班级作业完成情况
```sql
SELECT
    c.class_name,
    a.assignment_title,
    a.assignment_type,
    a.difficulty_level,
    a.deadline_time,
    a.total_students,
    a.submitted_count,
    a.graded_count,
    a.passing_count,
    a.submission_rate,
    a.passing_rate,
    a.average_score,
    a.student_satisfaction,
    a.assignment_status
FROM fact_assignment a
JOIN dim_class c ON a.class_id = c.id
WHERE c.class_id = 1001
  AND a.create_time >= DATE_SUB(NOW(), INTERVAL 2 MONTH)
ORDER BY a.deadline_time DESC;
```

#### 4. 查询作业质量分析
```sql
SELECT
    assignment_type,
    difficulty_level,
    COUNT(*) as assignment_count,
    AVG(total_score) as avg_total_score,
    AVG(average_score) as avg_student_score,
    AVG(submission_rate) as avg_submission_rate,
    AVG(passing_rate) as avg_passing_rate,
    AVG(student_satisfaction) as avg_satisfaction,
    AVG(assignment_effectiveness) as avg_effectiveness,
    AVG(learning_outcome_achievement) as avg_outcome,
    AVG(actual_average_time) as avg_time_spent,
    AVG(late_submission_count) as avg_late_count
FROM fact_assignment
WHERE assignment_status = 'CLOSED'
  AND graded_count > 0
  AND create_time >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY assignment_type, difficulty_level
ORDER BY assignment_type, avg_student_score DESC;
```

#### 5. 查询即将到期的作业
```sql
SELECT
    a.assignment_title,
    c.course_name,
    t.user_name as teacher_name,
    cl.class_name,
    a.deadline_time,
    a.submission_rate,
    a.total_students,
    a.submitted_count,
    DATEDIFF(a.deadline_time, NOW()) as days_remaining
FROM fact_assignment a
JOIN dim_course c ON a.course_id = c.id
JOIN dim_user t ON a.teacher_id = t.id
JOIN dim_class cl ON a.class_id = cl.id
WHERE a.assignment_status = 'ACTIVE'
  AND a.deadline_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
ORDER BY a.deadline_time ASC;
```

#### 6. 查询作业类型分布
```sql
SELECT
    assignment_type,
    assignment_category,
    COUNT(*) as count,
    AVG(total_score) as avg_total_score,
    AVG(average_score) as avg_score,
    AVG(submission_rate) as avg_submission,
    AVG(difficulty_rating) as avg_difficulty,
    AVG(student_satisfaction) as avg_satisfaction
FROM fact_assignment
WHERE create_time >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY assignment_type, assignment_category
ORDER BY count DESC;
```

### 插入示例

#### 1. 创建家庭作业
```sql
INSERT INTO fact_assignment (
    assignment_code, assignment_title, assignment_type, assignment_category,
    course_id, course_name, teacher_id, teacher_name, class_id, class_name,
    assignment_description, difficulty_level,
    start_time, deadline_time, grading_method,
    total_score, passing_score,
    submission_format, max_file_size,
    total_students, assignment_status, publish_status,
    scoring_criteria, create_by
) VALUES (
    'HW2023001', '数据结构作业三：二叉树应用', 'HOMEWORK', 'INDIVIDUAL',
    1001, '数据结构与算法', 23456, '张老师', 34567, '软件工程2023-1班',
    '实现二叉树的遍历算法，包括前序、中序、后序遍历', 'MEDIUM',
    '2023-10-23 14:00:00', '2023-10-30 23:59:59', 'MANUAL',
    100.00, 60.00,
    'ONLINE', 10485760,
    45, 'PUBLISHED', 'PUBLISHED',
    '{"算法实现": 40, "代码质量": 30, "测试结果": 20, "文档说明": 10}',
    12345
);
```

#### 2. 创建项目作业
```sql
INSERT INTO fact_assignment (
    assignment_code, assignment_title, assignment_type, assignment_category,
    course_id, course_name, teacher_id, teacher_name, class_id, class_name,
    assignment_description, difficulty_level,
    start_time, deadline_time, grading_method,
    total_score, passing_score,
    submission_format, allow_late_submission,
    peer_review_enabled, peer_review_weight, teacher_review_weight,
    total_students, assignment_status, publish_status,
    scoring_criteria, create_by
) VALUES (
    'PJ2023002', '学生管理系统设计项目', 'PROJECT', 'GROUP',
    1002, '软件工程', 23457, '李老师', 34567, '软件工程2023-1班',
    '设计并实现一个学生信息管理系统，包括前端界面和后端数据库', 'HARD',
    '2023-10-20 09:00:00', '2023-11-20 23:59:59', 'MIXED',
    200.00, 120.00,
    'PRESENTATION', 1,
    1, 30.00, 70.00,
    45, 'PUBLISHED', 'PUBLISHED',
    '{"系统设计": 30, "功能实现": 40, "代码质量": 20, "演示答辩": 10}',
    12345
);
```

### 更新示例

#### 1. 更新作业提交统计
```sql
UPDATE fact_assignment
SET submitted_count = 38,
    graded_count = 32,
    passing_count = 28,
    excellent_count = 8,
    late_submission_count = 3,
    plagiarism_count = 1,
    submission_rate = 84.44,
    passing_rate = 87.50,
    average_score = 78.5,
    highest_score = 95.0,
    lowest_score = 45.0,
    student_satisfaction = 82.3,
    update_time = NOW(),
    version = version + 1
WHERE id = 67890;
```

#### 2. 更新作业质量评价
```sql
UPDATE fact_assignment
SET difficulty_rating = 3.2,
    time_required_estimate = 120,
    actual_average_time = 135,
    assignment_effectiveness = 85.6,
    learning_outcome_achievement = 82.1,
    update_time = NOW(),
    version = version + 1
WHERE id = 67890;
```

#### 3. 更新作业状态
```sql
UPDATE fact_assignment
SET assignment_status = 'CLOSED',
    close_time = NOW(),
    update_time = NOW(),
    version = version + 1
WHERE id = 67890
  AND deadline_time <= NOW();
```

## 数据质量

### 质量检查规则
1. **完整性检查**：课程、教师、班级等关键字段不能为空
2. **一致性检查**：学生人数与班级人数逻辑一致
3. **时间检查**：截止时间不能早于开始时间
4. **范围检查**：评分、百分比等字段范围合理

### 数据清洗规则
1. **重复数据处理**：删除重复的作业记录
2. **时间修正**：修正不合理的时间设置
3. **统计修正**：重新计算提交率、及格率等
4. **状态同步**：同步作业状态和时间状态

## 性能优化

### 索引优化
- 课程ID和状态建立复合索引
- 教师ID和截止时间建立复合索引
- 班级ID和截止时间建立复合索引

### 分区策略
- 按创建时间进行表分区
- 提高历史数据查询性能
- 方便数据归档管理

### 查询优化
- 使用覆盖索引优化统计查询
- 避免JSON字段的全表扫描
- 合理使用时间范围过滤

## 安全考虑

### 数据保护
- 作业内容等知识产权保护
- 学生作业隐私数据保护
- 评分标准等敏感信息控制

### 权限控制
- 作业创建和修改需要教师权限
- 学生只能查看相关作业
- 评分数据需要特殊权限

## 扩展说明

### 未来扩展方向
1. **智能推荐**：基于历史数据的作业推荐
2. **自动评分**：AI辅助的作业自动评分
3. **抄袭检测**：作业抄袭智能检测
4. **个性化学习**：基于作业表现的个性化学习路径

### 兼容性说明
- 支持与职教云作业系统对接
- 支持多种作业提交格式
- 支持第三方评分系统集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*