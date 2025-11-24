# 作业提交实体 (AssignmentSubmission)

---

**实体编号：** DM-ACTIVITY-005
**实体名称：** 作业提交实体
**所属域：** 教学活动域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

作业提交实体是AI助评应用教学活动的核心事实实体，记录学生作业的详细提交信息。该实体关联作业、学生、课程等，记录提交时间、内容、文件、评分、反馈等全生命周期信息，为作业管理、学习评价、教学分析、抄袭检测等提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_assignment_submission`
- **业务表名：** 作业提交表
- **数据类型：** 事实表

### 主要用途
- 记录作业提交信息
- 管理作业评分反馈
- 支持作业统计分析
- 提供学习效果分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 作业提交唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| assignment_id | BIGINT | 20 | NOT NULL | 0 | 作业ID |
| assignment_title | VARCHAR | 300 | NOT NULL | '' | 作业标题 |
| assignment_code | VARCHAR | 50 | NOT NULL | '' | 作业编码 |
| course_id | BIGINT | 20 | NOT NULL | 0 | 课程ID |
| course_name | VARCHAR | 200 | NOT NULL | '' | 课程名称 |
| student_id | BIGINT | 20 | NOT NULL | 0 | 学生ID |
| student_name | VARCHAR | 100 | NOT NULL | '' | 学生姓名 |
| student_no | VARCHAR | 50 | NOT NULL | '' | 学号 |
| class_id | BIGINT | 20 | NOT NULL | 0 | 班级ID |
| class_name | VARCHAR | 100 | NOT NULL | '' | 班级名称 |
| teacher_id | BIGINT | 20 | NOT NULL | 0 | 教师ID |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 教师姓名 |

### 提交信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| submission_type | ENUM | - | NOT NULL | 'ONLINE' | 提交类型 |
| submission_method | VARCHAR | 50 | NULL | NULL | 提交方式 |
| submission_time | DATETIME | - | NULL | NULL | 提交时间 |
| submission_ip | VARCHAR | 45 | NULL | NULL | 提交IP地址 |
| submission_device | VARCHAR | 100 | NULL | NULL | 提交设备 |
| submission_location | VARCHAR | 200 | NULL | NULL | 提交地点 |
| is_late_submission | TINYINT | 1 | NOT NULL | 0 | 是否迟交 |
| late_duration | INT | 11 | NULL | 0 | 迟交时长（分钟） |
| late_penalty_rate | DECIMAL | 5,2 | NULL | 0.00 | 迟交扣分率 |
| attempt_number | INT | 11 | NOT NULL | 1 | 提交尝试次数 |
| is_final_submission | TINYINT | 1 | NOT NULL | 1 | 是否最终提交 |

### 内容信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| text_content | TEXT | - | NULL | NULL | 文本内容 |
| word_count | INT | 11 | NULL | 0 | 字数统计 |
| character_count | INT | 11 | NULL | 0 | 字符统计 |
| page_count | INT | 11 | NULL | 0 | 页数统计 |
| content_summary | TEXT | - | NULL | NULL | 内容摘要 |
| key_points | TEXT | - | NULL | NULL | 关键要点 |
| content_structure | JSON | - | NULL | NULL | 内容结构 |
| submission_format | VARCHAR | 50 | NULL | NULL | 提交格式 |
| content_quality | ENUM | - | NULL | NULL | 内容质量 |

### 文件信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| has_attachments | TINYINT | 1 | NOT NULL | 0 | 是否有附件 |
| attachment_count | INT | 11 | NULL | 0 | 附件数量 |
| total_file_size | BIGINT | 20 | NULL | 0 | 文件总大小（字节） |
| attachment_files | JSON | - | NULL | NULL | 附件文件信息 |
| file_types | JSON | - | NULL | NULL | 文件类型分布 |
| upload_time | DATETIME | - | NULL | NULL | 上传时间 |
| scan_status | ENUM | - | NULL | NULL | 扫描状态 |
| virus_scan_result | VARCHAR | 50 | NULL | NULL | 病毒扫描结果 |
| file_integrity | TINYINT | 1 | NULL | 1 | 文件完整性 |

### 评分信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| grading_status | ENUM | - | NOT NULL | 'NOT_GRADED' | 评分状态 |
| grader_id | BIGINT | 20 | NULL | NULL | 评分人ID |
| grader_name | VARCHAR | 100 | NULL | NULL | 评分人姓名 |
| grader_type | ENUM | - | NULL | NULL | 评分人类型 |
| grading_start_time | DATETIME | - | NULL | NULL | 评分开始时间 |
| grading_end_time | DATETIME | - | NULL | NULL | 评分结束时间 |
| grading_duration | INT | 11 | NULL | 0 | 评分耗时（秒） |
| original_score | DECIMAL | 8,2 | NULL | NULL | 原始评分 |
| final_score | DECIMAL | 8,2 | NULL | NULL | 最终评分 |
| max_score | DECIMAL | 8,2 | NULL | 100.00 | 满分 |
| grade_level | ENUM | - | NULL | NULL | 等级评定 |
| percentile_rank | DECIMAL | 5,2 | NULL | NULL | 百分位排名 |

### 详细评分字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| rubric_scores | JSON | - | NULL | NULL | 评分细则得分 |
| rubric_feedback | JSON | - | NULL | NULL | 评分细则反馈 |
| auto_score | DECIMAL | 8,2 | NULL | NULL | 自动评分 |
| manual_score | DECIMAL | 8,2 | NULL | NULL | 手动评分 |
| peer_score | DECIMAL | 8,2 | NULL | NULL | 同行评分 |
| peer_review_count | INT | 11 | NULL | 0 | 同行评议数 |
| peer_average_score | DECIMAL | 8,2 | NULL | NULL | 同行平均分 |
| adjustment_score | DECIMAL | 8,2 | NULL | 0.00 | 调整分数 |
| adjustment_reason | TEXT | - | NULL | NULL | 调整原因 |

### 反馈信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teacher_feedback | TEXT | - | NULL | NULL | 教师反馈 |
| detailed_comments | TEXT | - | NULL | NULL | 详细评语 |
| strength_comments | TEXT | - | NULL | NULL | 优点评价 |
| improvement_suggestions | TEXT | - | NULL | NULL | 改进建议 |
| learning_guidance | TEXT | - | NULL | NULL | 学习指导 |
| rubric_feedback | JSON | - | NULL | NULL | 评分标准反馈 |
| audio_feedback_url | VARCHAR | 500 | NULL | NULL | 音频反馈地址 |
| video_feedback_url | VARCHAR | 500 | NULL | NULL | 视频反馈地址 |
| feedback_files | JSON | - | NULL | NULL | 反馈文件 |

### 质量分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| content_originality | DECIMAL | 5,2 | NULL | 0.00 | 内容原创性 |
| plagiarism_score | DECIMAL | 5,2 | NULL | 0.00 | 抄袭检测分数 |
| similarity_sources | JSON | - | NULL | NULL | 相似来源 |
| academic_integrity | ENUM | - | NULL | NULL | 学术诚信 |
| content_completeness | DECIMAL | 5,2 | NULL | 0.00 | 内容完整性 |
| requirement_fulfillment | DECIMAL | 5,2 | NULL | 0.00 | 要求满足度 |
| writing_quality | DECIMAL | 5,2 | NULL | 0.00 | 写作质量 |
| technical_accuracy | DECIMAL | 5,2 | NULL | 0.00 | 技术准确性 |
| creative_level | DECIMAL | 5,2 | NULL | 0.00 | 创新水平 |

### 学习分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| time_spent | INT | 11 | NULL | 0 | 完成用时（分钟） |
| revision_count | INT | 11 | NULL | 0 | 修改次数 |
| draft_saves | INT | 11 | NULL | 0 | 草稿保存次数 |
| help_requests | INT | 11 | NULL | 0 | 求助次数 |
| resource_usage | JSON | - | NULL | NULL | 资源使用情况 |
| collaboration_log | JSON | - | NULL | NULL | 协作记录 |
| engagement_level | DECIMAL | 5,2 | NULL | 0.00 | 参与度水平 |
| effort_rating | DECIMAL | 5,2 | NULL | 0.00 | 努力程度评分 |
| progress_made | TEXT | - | NULL | NULL | 进步情况 |
| learning_outcomes | TEXT | - | NULL | NULL | 学习成果 |

### 系统检测字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| ai_analysis_score | DECIMAL | 5,2 | NULL | 0.00 | AI分析评分 |
| automated_feedback | TEXT | - | NULL | NULL | 自动反馈 |
| pattern_detection | JSON | - | NULL | NULL | 模式检测结果 |
| anomaly_flags | JSON | - | NULL | NULL | 异常标记 |
| risk_indicators | JSON | - | NULL | NULL | 风险指标 |
| confidence_level | DECIMAL | 5,2 | NULL | 0.00 | 置信水平 |
| ai_suggestions | TEXT | - | NULL | NULL | AI建议 |
| improvement_recommendations | JSON | - | NULL | NULL | 改进推荐 |
| learning_pathway | TEXT | - | NULL | NULL | 学习路径建议 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| submission_status | ENUM | - | NOT NULL | 'SUBMITTED' | 提交状态 |
| review_status | ENUM | - | NULL | NULL | 审核状态 |
| appeal_status | ENUM | - | NULL | NULL | 申诉状态 |
| is_published | TINYINT | 1 | NOT NULL | 0 | 是否已发布 |
| is_archived | TINYINT | 1 | NOT NULL | 0 | 是否已归档 |
| requires_resubmission | TINYINT | 1 | NOT NULL | 0 | 需要重新提交 |
| resubmission_deadline | DATETIME | - | NULL | NULL | 重交截止时间 |
| has_appeal | TINYINT | 1 | NOT NULL | 0 | 是否有申诉 |
| appeal_reason | TEXT | - | NULL | NULL | 申诉原因 |
| appeal_result | TEXT | - | NULL | NULL | 申诉结果 |

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
| audit_log | JSON | - | NULL | NULL | 审计日志 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_assignment_student (assignment_id, student_id, attempt_number)
UNIQUE KEY uk_submission_code (assignment_code, student_no, submission_time)
```

### 外键约束
```sql
FOREIGN KEY (assignment_id) REFERENCES fact_assignment(id) ON DELETE CASCADE
FOREIGN KEY (course_id) REFERENCES dim_course(id) ON DELETE CASCADE
FOREIGN KEY (student_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (class_id) REFERENCES dim_class(id) ON DELETE CASCADE
FOREIGN KEY (teacher_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (grader_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_assignment_id (assignment_id)
INDEX idx_student_id (student_id)
INDEX idx_course_id (course_id)
INDEX idx_class_id (class_id)
INDEX idx_teacher_id (teacher_id)
INDEX idx_grader_id (grader_id)
INDEX idx_submission_time (submission_time)
INDEX idx_grading_status (grading_status)
INDEX idx_submission_status (submission_status)
INDEX idx_final_score (final_score)
INDEX idx_grade_level (grade_level)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_assignment_student (assignment_id, student_id)
INDEX idx_course_score (course_id, final_score)
INDEX idx_class_status (class_id, grading_status)
INDEX idx_score_time (final_score, submission_time)
INDEX idx_status_score (grading_status, final_score)
```

### 检查约束
```sql
CHECK (submission_type IN ('ONLINE', 'OFFLINE', 'EMAIL', 'PAPER', 'PRESENTATION'))
CHECK (grading_status IN ('NOT_GRADED', 'GRADING', 'GRADED', 'REVIEWED', 'APPEALED'))
CHECK (grader_type IN ('TEACHER', 'TA', 'PEER', 'AUTO', 'EXTERNAL'))
CHECK (submission_status IN ('DRAFT', 'SUBMITTED', 'RETURNED', 'APPROVED', 'REJECTED', 'REQUIRES_RESUBMISSION'))
CHECK (review_status IN ('PENDING', 'UNDER_REVIEW', 'COMPLETED', 'RETURNED'))
CHECK (appeal_status IN ('NONE', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'))
CHECK (grade_level IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'PASS', 'FAIL'))
CHECK (scan_status IN ('NOT_SCANNED', 'SCANNING', 'COMPLETED', 'FAILED'))
CHECK (academic_integrity IN ('CLEAN', 'SUSPICIOUS', 'PLAGIARIZED', 'REVIEW_REQUIRED'))
CHECK (content_quality IN ('EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'))
CHECK (is_late_submission IN (0, 1))
CHECK (is_final_submission IN (0, 1))
CHECK (has_attachments IN (0, 1))
CHECK (is_published IN (0, 1))
CHECK (is_archived IN (0, 1))
CHECK (requires_resubmission IN (0, 1))
CHECK (has_appeal IN (0, 1))
CHECK (late_duration >= 0)
CHECK (late_penalty_rate BETWEEN 0 AND 100)
CHECK (attempt_number >= 1)
CHECK (attachment_count >= 0)
CHECK (total_file_size >= 0)
CHECK (word_count >= 0)
CHECK (character_count >= 0)
CHECK (page_count >= 0)
CHECK (grading_duration >= 0)
CHECK (original_score IS NULL OR original_score >= 0)
CHECK (final_score IS NULL OR final_score >= 0)
CHECK (max_score > 0)
CHECK (auto_score IS NULL OR auto_score >= 0)
CHECK (manual_score IS NULL OR manual_score >= 0)
CHECK (peer_score IS NULL OR peer_score >= 0)
CHECK (peer_review_count >= 0)
CHECK (content_originality BETWEEN 0 AND 100)
CHECK (plagiarism_score BETWEEN 0 AND 100)
CHECK (content_completeness BETWEEN 0 AND 100)
CHECK (requirement_fulfillment BETWEEN 0 AND 100)
CHECK (writing_quality BETWEEN 0 AND 100)
CHECK (technical_accuracy BETWEEN 0 AND 100)
CHECK (creative_level BETWEEN 0 AND 100)
CHECK (time_spent >= 0)
CHECK (revision_count >= 0)
CHECK (draft_saves >= 0)
CHECK (help_requests >= 0)
CHECK (engagement_level BETWEEN 0 AND 100)
CHECK (effort_rating BETWEEN 0 AND 100)
CHECK (ai_analysis_score BETWEEN 0 AND 100)
CHECK (confidence_level BETWEEN 0 AND 100)
CHECK (source_system IN ('MANUAL', 'ZJY', 'SYSTEM', 'API', 'IMPORT'))
```

## 枚举值定义

### 提交类型 (submission_type)
| 值 | 说明 | 备注 |
|----|------|------|
| ONLINE | 在线提交 | 系统在线提交 |
| OFFLINE | 离线提交 | 线下提交 |
| EMAIL | 邮件提交 | 邮件附件提交 |
| PAPER | 纸质提交 | 纸质版提交 |
| PRESENTATION | 展示提交 | 演讲展示提交 |

### 评分状态 (grading_status)
| 值 | 说明 | 备注 |
|----|------|------|
| NOT_GRADED | 未评分 | 尚未评分 |
| GRADING | 评分中 | 正在评分 |
| GRADED | 已评分 | 评分完成 |
| REVIEWED | 已审核 | 审核完成 |
| APPEALED | 已申诉 | 提出申诉 |

### 评分人类型 (grader_type)
| 值 | 说明 | 备注 |
|----|------|------|
| TEACHER | 教师 | 主讲教师 |
| TA | 助教 | 教学助理 |
| PEER | 同行 | 学生互评 |
| AUTO | 自动 | 系统自动 |
| EXTERNAL | 外部 | 外部专家 |

### 提交状态 (submission_status)
| 值 | 说明 | 备注 |
|----|------|------|
| DRAFT | 草稿 | 保存草稿 |
| SUBMITTED | 已提交 | 提交完成 |
| RETURNED | 已退回 | 退回修改 |
| APPROVED | 已批准 | 审核通过 |
| REJECTED | 已拒绝 | 审核拒绝 |
| REQUIRES_RESUBMISSION | 需重交 | 需要重新提交 |

### 学术诚信 (academic_integrity)
| 值 | 说明 | 备注 |
|----|------|------|
| CLEAN | 清洁 | 无问题 |
| SUSPICIOUS | 可疑 | 疑似抄袭 |
| PLAGIARIZED | 抄袭 | 确认抄袭 |
| REVIEW_REQUIRED | 需审查 | 需要人工审查 |

### 内容质量 (content_quality)
| 值 | 说明 | 备注 |
|----|------|------|
| EXCELLENT | 优秀 | 质量优秀 |
| GOOD | 良好 | 质量良好 |
| SATISFACTORY | 满意 | 基本满意 |
| NEEDS_IMPROVEMENT | 需改进 | 需要改进 |
| POOR | 差 | 质量较差 |

### 等级评定 (grade_level)
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
| FAIL | 失败 | 未通过 |

## 关联关系

### 多对一关系（作为从表）
- **AssignmentSubmission → Assignment**：作业提交属于作业
- **AssignmentSubmission → Course**：作业提交属于课程
- **AssignmentSubmission → Student**：作业提交属于学生
- **AssignmentSubmission → Class**：作业提交属于班级
- **AssignmentSubmission → User（teacher）**：作业提交关联教师
- **AssignmentSubmission → User（grader）**：作业提交关联评分人

### 自引用关系
- **AssignmentSubmission → AssignmentSubmission（appeal）**：申诉关联原提交

## 使用示例

### 查询示例

#### 1. 查询作业提交统计
```sql
SELECT
    a.assignment_title,
    a.assignment_code,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN asub.is_late_submission = 1 THEN 1 END) as late_count,
    AVG(asub.final_score) as avg_score,
    MAX(asub.final_score) as max_score,
    MIN(asub.final_score) as min_score,
    AVG(asub.word_count) as avg_word_count,
    SUM(CASE WHEN asub.has_attachments = 1 THEN 1 END) as attachment_count,
    AVG(asub.content_quality) as avg_content_quality,
    AVG(asub.plagiarism_score) as avg_plagiarism_score
FROM fact_assignment_submission asub
JOIN fact_assignment a ON asub.assignment_id = a.id
WHERE asub.submission_status = 'SUBMITTED'
  AND asub.grading_status = 'GRADED'
GROUP BY asub.assignment_id, a.assignment_title, a.assignment_code
ORDER BY total_submissions DESC;
```

#### 2. 查询学生作业表现
```sql
SELECT
    u.student_no,
    u.user_name as student_name,
    c.class_name,
    COUNT(*) as assignment_count,
    AVG(asub.final_score) as avg_score,
    MAX(asub.final_score) as best_score,
    MIN(asub.final_score) as worst_score,
    SUM(CASE WHEN asub.is_late_submission = 1 THEN 1 END) as late_count,
    AVG(asub.effort_rating) as avg_effort,
    AVG(asub.engagement_level) as avg_engagement,
    SUM(CASE WHEN asub.final_score >= 90 THEN 1 END) as excellent_count,
    SUM(CASE WHEN asub.final_score < 60 THEN 1 END) as fail_count
FROM fact_assignment_submission asub
JOIN dim_user u ON asub.student_id = u.id
JOIN dim_class c ON asub.class_id = c.id
WHERE asub.grading_status = 'GRADED'
  AND asub.submission_time >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
GROUP BY asub.student_id, u.student_no, u.user_name, c.class_name
ORDER BY avg_score DESC;
```

#### 3. 查询作业质量分析
```sql
SELECT
    a.assignment_title,
    COUNT(*) as submission_count,
    AVG(asub.content_completeness) as avg_completeness,
    AVG(asub.requirement_fulfillment) as avg_fulfillment,
    AVG(asub.writing_quality) as avg_writing_quality,
    AVG(asub.technical_accuracy) as avg_accuracy,
    AVG(asub.creative_level) as avg_creativity,
    AVG(asub.content_originality) as avg_originality,
    AVG(asub.plagiarism_score) as avg_plagiarism,
    COUNT(CASE WHEN asub.academic_integrity = 'CLEAN' THEN 1 END) as clean_count,
    COUNT(CASE WHEN asub.academic_integrity = 'SUSPICIOUS' THEN 1 END) as suspicious_count,
    COUNT(CASE WHEN asub.academic_integrity = 'PLAGIARIZED' THEN 1 END) as plagiarized_count
FROM fact_assignment_submission asub
JOIN fact_assignment a ON asub.assignment_id = a.id
WHERE asub.grading_status = 'GRADED'
  AND asub.content_quality IS NOT NULL
GROUP BY asub.assignment_id, a.assignment_title
ORDER BY avg_completeness DESC;
```

#### 4. 查询迟交情况分析
```sql
SELECT
    a.assignment_title,
    COUNT(*) as total_submissions,
    SUM(CASE WHEN asub.is_late_submission = 1 THEN 1 END) as late_count,
    ROUND(SUM(CASE WHEN asub.is_late_submission = 1 THEN 1 END) * 100.0 / COUNT(*), 2) as late_rate,
    AVG(asub.late_duration) as avg_late_duration,
    AVG(asub.final_score) as overall_avg_score,
    AVG(CASE WHEN asub.is_late_submission = 0 THEN asub.final_score END) as on_time_avg_score,
    AVG(CASE WHEN asub.is_late_submission = 1 THEN asub.final_score END) as late_avg_score,
    MAX(asub.late_duration) as max_late_duration
FROM fact_assignment_submission asub
JOIN fact_assignment a ON asub.assignment_id = a.id
WHERE asub.submission_status = 'SUBMITTED'
GROUP BY asub.assignment_id, a.assignment_title
HAVING late_count > 0
ORDER BY late_rate DESC;
```

#### 5. 查询评分效率分析
```sql
SELECT
    u.user_name as grader_name,
    COUNT(*) as graded_count,
    AVG(asub.grading_duration) as avg_grading_time,
    SUM(asub.grading_duration) as total_grading_time,
    AVG(asub.final_score) as avg_score_given,
    COUNT(CASE WHEN asub.detailed_comments IS NOT NULL AND LENGTH(asub.detailed_comments) > 50 THEN 1 END) as detailed_feedback_count,
    AVG(CASE WHEN asub.has_appeal = 1 THEN 1 END) * 100 as appeal_rate
FROM fact_assignment_submission asub
JOIN dim_user u ON asub.grader_id = u.id
WHERE asub.grading_status = 'GRADED'
  AND asub.grading_duration > 0
  AND asub.grading_start_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
GROUP BY asub.grader_id, u.user_name
ORDER BY graded_count DESC;
```

### 插入示例

#### 1. 创建在线作业提交
```sql
INSERT INTO fact_assignment_submission (
    assignment_id, assignment_title, assignment_code,
    course_id, course_name,
    student_id, student_name, student_no,
    class_id, class_name, teacher_id, teacher_name,
    submission_type, submission_time, submission_ip,
    text_content, word_count, page_count,
    has_attachments, attachment_count, total_file_size,
    grading_status, submission_status,
    create_by, source_system
) VALUES (
    12345, '数据结构作业三：二叉树实现', 'HW2023003',
    1001, '数据结构与算法',
    45678, '李四', 'S20230001',
    34567, '软件工程2023-1班', 23456, '张老师',
    'ONLINE', '2023-11-22 23:45:30', '192.168.1.100',
    '实现二叉树的前序、中序、后序遍历算法，并测试正确性', 1200, 8,
    1, 2, 2048576,
    'NOT_GRADED', 'SUBMITTED',
    45678, 'MANUAL'
);
```

#### 2. 创建带AI分析的作业提交
```sql
INSERT INTO fact_assignment_submission (
    assignment_id, assignment_title, assignment_code,
    course_id, course_name,
    student_id, student_name, student_no,
    class_id, class_name, teacher_id, teacher_name,
    submission_type, submission_time,
    text_content, word_count,
    has_attachments, attachment_count,
    content_originality, plagiarism_score, academic_integrity,
    ai_analysis_score, automated_feedback, ai_suggestions,
    grading_status, submission_status,
    create_by, source_system
) VALUES (
    12346, '计算机网络实验报告', 'LAB2023002',
    1002, '计算机网络',
    45679, '王五', 'S20230002',
    34567, '软件工程2023-1班', 23457, '李老师',
    'ONLINE', '2023-11-22 22:30:15',
    'TCP协议分析与网络性能测试实验报告', 2500,
    1, 3,
    95.2, 3.8, 'CLEAN',
    87.5, '实验设计合理，数据分析充分，建议增加更多测试场景', '可以尝试不同的网络环境进行对比测试',
    'NOT_GRADED', 'SUBMITTED',
    45679, 'SYSTEM'
);
```

### 更新示例

#### 1. 更新作业评分
```sql
UPDATE fact_assignment_submission
SET grading_status = 'GRADED',
    grader_id = 23456,
    grader_name = '张老师',
    grader_type = 'TEACHER',
    grading_start_time = '2023-11-23 09:00:00',
    grading_end_time = NOW(),
    grading_duration = 900,
    original_score = 88.5,
    final_score = 85.0,
    max_score = 100.0,
    grade_level = 'B+',
    percentile_rank = 78.5,
    rubric_scores = '{"算法实现": 22, "代码质量": 21, "测试用例": 19, "文档说明": 23}',
    rubric_feedback = '{"算法实现": "算法正确，效率良好", "代码质量": "代码规范，注释充分"}',
    teacher_feedback = '二叉树实现正确，代码质量良好，测试用例覆盖全面，建议优化时间复杂度',
    detailed_comments = '学生很好地掌握了二叉树的概念和实现方法，代码结构清晰，建议进一步学习平衡二叉树',
    improvement_suggestions = '可以尝试实现平衡二叉树，提高算法效率',
    content_quality = 'GOOD',
    update_time = NOW(),
    version = version + 1
WHERE id = 78901;
```

#### 2. 更新抄袭检测结果
```sql
UPDATE fact_assignment_submission
SET plagiarism_score = 15.2,
    content_originality = 84.8,
    similarity_sources = '{"来源1": "学生B作业", "相似度": 12.5, "来源2": "网络资源", "相似度": 2.7}',
    academic_integrity = 'REVIEW_REQUIRED',
    risk_indicators = '{"high_similarity": true, "source_mismatch": false}',
    confidence_level = 92.3,
    update_time = NOW(),
    version = version + 1
WHERE id = 78901;
```

#### 3. 处理申诉
```sql
UPDATE fact_assignment_submission
SET has_appeal = 1,
    appeal_status = 'SUBMITTED',
    appeal_reason = '认为评分过低，特别是算法实现部分应该得到更高分数',
    grading_status = 'APPEALED',
    update_time = NOW(),
    version = version + 1
WHERE id = 78901;
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：同一作业同一学生同一尝试次数唯一
2. **完整性检查**：作业、学生、课程等关键字段不能为空
3. **逻辑检查**：评分不能超过满分，时间逻辑一致
4. **关联检查**：作业ID、学生ID必须存在

### 数据清洗规则
1. **重复数据处理**：删除重复的提交记录
2. **评分修正**：修正不合理的评分数据
3. **时间修正**：修正不合理的时间记录
4. **状态同步**：同步提交状态和评分状态

## 性能优化

### 索引优化
- 作业ID和学生ID建立复合索引
- 评分状态和时间建立复合索引
- 分数和提交时间建立复合索引

### 分区策略
- 按提交时间进行表分区
- 提高历史数据查询性能
- 方便数据归档管理

### 查询优化
- 使用覆盖索引优化统计查询
- 避免大字段的全表扫描
- 合理使用时间范围过滤

## 安全考虑

### 数据保护
- 学生作业内容隐私保护
- 评分数据访问控制
- 抄袭检测信息安全

### 权限控制
- 作业查看权限分级控制
- 评分修改需要教师权限
- 抄袭检测结果需要特殊权限

## 扩展说明

### 未来扩展方向
1. **智能评分**：基于AI的自动评分系统
2. **个性化反馈**：基于学习风格的个性化反馈
3. **学习分析**：基于作业数据的学习行为分析
4. **协作评价**：多人协作作业的评价机制

### 兼容性说明
- 支持与在线学习平台对接
- 支持多种作业格式集成
- 支持第三方抄袭检测系统集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*