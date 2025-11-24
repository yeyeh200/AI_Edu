# 评价记录实体 (EvaluationRecord)

---

**实体编号：** DM-EVAL-002
**实体名称：** 评价记录实体
**所属域：** 评价分析域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

评价记录实体是AI助评应用评价分析域的核心事实实体，存储教学评价活动的基本信息和过程记录。该实体关联评价模板、被评价对象、评价者、评价时间等关键信息，为评价结果生成、质量分析、改进建议等提供数据基础。

## 实体定义

### 表名
- **物理表名：** `fact_evaluation_record`
- **业务表名：** 评价记录表
- **数据类型：** 事实表

### 主要用途
- 存储评价活动的基本信息
- 关联评价模板和评价结果
- 支持评价过程追踪
- 提供评价统计分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 评价记录唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| template_id | BIGINT | 20 | NOT NULL | 0 | 评价模板ID |
| template_name | VARCHAR | 200 | NOT NULL | '' | 评价模板名称 |
| template_code | VARCHAR | 50 | NOT NULL | '' | 评价模板编码 |
| evaluation_type | ENUM | - | NOT NULL | 'TEACHING' | 评价类型 |
| target_id | BIGINT | 20 | NOT NULL | 0 | 被评价对象ID |
| target_type | ENUM | - | NOT NULL | 'TEACHER' | 被评价对象类型 |
| target_name | VARCHAR | 100 | NOT NULL | '' | 被评价对象名称 |
| target_code | VARCHAR | 50 | NOT NULL | '' | 被评价对象编号 |
| evaluator_id | BIGINT | 20 | NOT NULL | 0 | 评价人ID |
| evaluator_name | VARCHAR | 100 | NOT NULL | '' | 评价人姓名 |
| evaluator_code | VARCHAR | 50 | NOT NULL | '' | 评价人编号 |
| evaluator_type | ENUM | - | NOT NULL | 'EXPERT' | 评价人类型 |

### 时间信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_period | ENUM | - | NOT NULL | 'SEMESTER' | 评价周期 |
| academic_year | VARCHAR | 10 | NOT NULL | '' | 学年 |
| semester | ENUM | - | NOT NULL | 'FIRST' | 学期 |
| start_date | DATE | - | NOT NULL | CURRENT_DATE | 评价开始日期 |
| end_date | DATE | - | NOT NULL | CURRENT_DATE | 评价结束日期 |
| evaluation_date | DATE | NOT NULL | CURRENT_DATE | 评价创建日期 |
| evaluation_deadline | DATE | NULL | NULL | 评价截止日期 |

### 状态信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_status | ENUM | - | NOT NULL | 'CREATED' | 评价状态 |
| progress_status | ENUM | - | NOT NULL | 'NOT_STARTED' | 进度状态 |
| completion_rate | DECIMAL | 5,2 | NULL | 0.00 | 完成率（百分比） |
| is_published | TINYINT | 1 | NOT NULL | 0 | 是否已发布 |
| publish_time | DATETIME | - | NULL | NULL | 发布时间 |
| is_locked | TINYINT | 1 | NOT NULL | 0 | 是否锁定 |

### 审批信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| approval_status | ENUM | - | NULL | 'PENDING' | 审批状态 |
| approval_level | ENUM | - | NULL | 'NORMAL' | 审批级别 |
| submit_time | DATETIME | - | NULL | NULL | 提交审批时间 |
| approve_time | DATETIME | - | NULL | NULL | 审批时间 |
| approver_id | BIGINT | 20 | NULL | NULL | 审批人ID |
| approver_name | VARCHAR | 100 | NULL | NULL | 审批人姓名 |
| approval_comments | TEXT | - | NULL | NULL | 审批意见 |

### 配置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_scope | JSON | - | NULL | NULL | 评价范围配置 |
| weight_config | JSON | - | NULL | NULL | 权重配置 |
| notification_config | JSON | - | NULL | NULL | 通知配置 |
| auto_generate | TINYINT | 1 | NOT NULL | 0 | 是否自动生成结果 |
| allow_reedit | TINYINT | 1 | NOT NULL | 0 | 是否允许重新编辑 |

### 统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_indicators | INT | 11 | NOT NULL | 0 | 总指标数 |
| completed_indicators | INT | 11 | NOT NULL | 0 | 已完成指标数 |
| total_participants | INT | 11 | NULL | 0 | 参与评价人数 |
| valid_participants | INT | 11 | NULL | 0 | 有效参与人数 |
| response_rate | DECIMAL | 5,2 | NULL | 0.00 | 响应率 |
| average_score | DECIMAL | 5,2 | NULL | 0.00 | 平均得分 |

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

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_evaluation_unique (target_id, template_id, evaluation_period, academic_year, semester)
```

### 外键约束
```sql
FOREIGN KEY (template_id) REFERENCES dim_evaluation_template(id) ON DELETE CASCADE
FOREIGN KEY (target_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (evaluator_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (approver_id) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_template_id (template_id)
INDEX idx_target_id (target_id)
INDEX target_type (target_type)
INDEX idx_evaluator_id (evaluator_id)
INDEX idx_evaluation_type (evaluation_type)
INDEX idx_evaluation_period (evaluation_period)
INDEX idx_academic_year (academic_year)
INDEX idx_semester (semester)
INDEX idx_evaluation_status (evaluation_status)
INDEX idx_approval_status (approval_status)
INDEX idx_create_time (create_time)
```

### 检查约束
```sql
CHECK (evaluation_type IN ('TEACHING', 'COURSE', 'CLASS', 'SCHOOL', 'SELF', 'PEER'))
CHECK (target_type IN ('TEACHER', 'STUDENT', 'COURSE', 'CLASS', 'FACULTY', 'SCHOOL'))
CHECK (evaluator_type IN ('EXPERT', 'ADMIN', 'PEER', 'SELF', 'SYSTEM'))
CHECK (evaluation_period IN ('WEEKLY', 'MONTHLY', 'SEMESTER', 'YEARLY'))
CHECK (semester IN ('FIRST', 'SECOND', 'SUMMER'))
CHECK (evaluation_status IN ('CREATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PUBLISHED', 'EXPIRED'))
CHECK (progress_status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED', 'FAILED'))
CHECK (approval_status IN ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'SKIPPED'))
CHECK (approval_level IN ('NORMAL', 'SPECIAL', 'URGENT', 'EMERGENCY'))
CHECK (is_published IN (0, 1))
CHECK (is_locked IN (0, 1))
CHECK (completion_rate BETWEEN 0 AND 100)
CHECK (total_indicators >= 0)
CHECK (completed_indicators BETWEEN 0 AND total_indicators)
CHECK (response_rate BETWEEN 0 AND 100)
CHECK (average_score BETWEEN 0 AND 100)
CHECK (auto_generate IN (0, 1))
CHECK (source_system IN ('MANUAL', 'IMPORT', 'API', 'SYSTEM', 'BATCH'))
```

## 枚举值定义

### 评价类型 (evaluation_type)
| 值 | 说明 | 备注 |
|----|------|------|
| TEACHING | 教学评价 | 教师教学质量评价 |
| COURSE | 课程评价 | 课程质量评价 |
| CLASS | 班级评价 | 班级管理评价 |
| SCHOOL | 学校评价 | 学校整体评价 |
| SELF | 自我评价 | 自我反思评价 |
| PEER | 同行评价 | 同行评议 |

### 被评价对象类型 (target_type)
| 值 | 说明 | 备注 |
|----|------|------|
| TEACHER | 教师 | 教师个人 |
| STUDENT | 学生 | 学生个人 |
| COURSE | 课程 | 课程实体 |
| CLASS | 班级 | 班级实体 |
| FACULTY | 院系 | 院系实体 |
| SCHOOL | 学校 | 学校实体 |

### 评价人类型 (evaluator_type)
| 值 | 说明 | 备注 |
|----|------|------|
| EXPERT | 专家 | 教学督导专家 |
| ADMIN | 管理员 | 系统管理员 |
| PEER | 同行 | 同行教师 |
| SELF | 本人 | 自我评价 |
| SYSTEM | 系统 | 系统自动 |

### 评价状态 (evaluation_status)
| 值 | 说明 | 备注 |
|----|------|------|
| CREATED | 已创建 | 评价任务已创建 |
| IN_PROGRESS | 进行中 | 评价正在进行 |
| COMPLETED | 已完成 | 评价已完成 |
| CANCELLED | 已取消 | 评价任务取消 |
| PUBLISHED | 已发布 | 评价结果已发布 |
| EXPIRED | 已过期 | 评价已过期 |

### 进度状态 (progress_status)
| 值 | 说明 | 备注 |
|----|------|------|
| NOT_STARTED | 未开始 | 评价还未开始 |
| IN_PROGRESS | 进行中 | 评价正在进行 |
| COMPLETED | 已完成 | 评价已完成 |
| SUSPENDED | 已暂停 | 评价暂时暂停 |
| FAILED | 失败 | 评价失败 |

### 审批状态 (approval_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PENDING | 待审批 | 等待审批 |
| IN_REVIEW | 审核中 | 正在审核 |
| APPROVED | 已批准 | 审批通过 |
| REJECTED | 已拒绝 | 审批拒绝 |
| SKIPPED | 跳过审批 | 无需审批 |

### 审批级别 (approval_level)
| 值 | 说明 | 备注 |
|----|------|------|
| NORMAL | 普通 | 常规审批 |
| SPECIAL | 特殊 | 特殊审批 |
| URGENT | 紧急 | 紧急审批 |
| EMERGENCY | 紧急 | 紧急审批 |

### 评价周期 (evaluation_period)
| 值 | 说明 | 备注 |
|----|------|------|
| WEEKLY | 周评价 | 每周评价 |
| MONTHLY | 月评价 | 每月评价 |
| SEMESTER | 学期评价 | 每学期评价 |
| YEARLY | 年评价 | 每年评价 |

### 学期 (semester)
| 值 | 说明 | 备注 |
|----|------|------|
| FIRST | 第一学期 | 秋季学期（9-1月） |
| SECOND | 第二学期 | 春季学期（2-7月） |
| SUMMER | 夏季学期 | 夏季学期（7-8月） |

## 关联关系

### 多对一关系（作为从表）
- **EvaluationRecord → EvaluationTemplate**：评价记录属于一个评价模板
- **EvaluationRecord → User（target_id）**：评价记录关联被评价用户
- **EvaluationRecord → User（evaluator_id）**：评价记录关联评价用户

### 一对多关系（作为主表）
- **EvaluationRecord → EvaluationResult**：一个评价记录包含多个评价结果
- **EvaluationRecord → QualityScore**：一个评价记录生成一个质量评分
- **EvaluationRecord → ImprovementSuggestion**：一个评价记录生成多个改进建议

## 使用示例

### 查询示例

#### 1. 查询教师评价统计
```sql
SELECT
    u.user_name as teacher_name,
    u.user_no,
    COUNT(*) as total_evaluations,
    COUNT(CASE WHEN er.evaluation_status = 'COMPLETED' THEN 1 END) as completed_count,
    AVG(er.average_score) as avg_score,
    MAX(er.evaluation_date) as latest_evaluation,
    COUNT(CASE WHEN er.average_score >= 90 THEN 1 END) as excellent_count
FROM fact_evaluation_record er
JOIN dim_user u ON er.target_id = u.id
WHERE er.target_type = 'TEACHER'
  AND er.evaluation_type = 'TEACHING'
GROUP BY u.id, u.user_name, u.user_no
ORDER BY avg_score DESC;
```

#### 2. 查询评价进度情况
```sql
SELECT
    template_name,
    evaluation_period,
    academic_year,
    semester,
    COUNT(*) as total_records,
    COUNT(CASE WHEN progress_status = 'COMPLETED' THEN 1 END) as completed_count,
    COUNT(CASE WHEN evaluation_status = 'IN_PROGRESS' THEN 1 END) as in_progress_count,
    AVG(completion_rate) as avg_completion_rate,
    AVG(response_rate) as avg_response_rate
FROM fact_evaluation_record
GROUP BY template_id, template_name, evaluation_period, academic_year, semester
ORDER BY academic_year DESC, semester;
```

#### 3. 查询待审批的评价
```sql
SELECT
    er.id,
    er.template_name,
    er.target_name,
    er.evaluation_type,
    er.academic_year,
    er.semester,
    er.create_time,
    er.submit_time,
    er.approval_status,
    er.approval_level
FROM fact_evaluation_record er
WHERE er.approval_status = 'PENDING'
  AND er.evaluation_status IN ('COMPLETED', 'PUBLISHED')
ORDER BY er.submit_time ASC;
```

#### 4. 查询评价参与度
```sql
SELECT
    er.target_name,
    er.evaluation_type,
    er.total_participants,
    er.valid_participants,
    er.response_rate,
    CASE
        WHEN er.response_rate >= 90 THEN 'HIGH'
        WHEN er.response_rate >= 70 THEN 'MEDIUM'
        WHEN er.response_rate >= 50 THEN 'LOW'
        ELSE 'VERY_LOW'
    END as participation_level
FROM fact_evaluation_record er
WHERE er.evaluation_status = 'COMPLETED'
  AND er.total_participants > 0
ORDER BY er.response_rate DESC;
```

### 插入示例

#### 1. 创建教学评价记录
```sql
INSERT INTO fact_evaluation_record (
    template_id, template_name, template_code,
    evaluation_type, target_id, target_type, target_name, target_code,
    evaluator_id, evaluator_name, evaluator_code, evaluator_type,
    evaluation_period, academic_year, semester,
    start_date, end_date, evaluation_date,
    total_indicators, total_participants,
    evaluation_status, progress_status,
    create_by, source_system
) VALUES (
    1001, '教师教学质量评价', 'TEACHING_QUALITY',
    'TEACHING', 12345, 'TEACHER', '张老师', 'T20230001',
    23456, '李督导', 'T20001', 'EXPERT',
    'SEMESTER', '2023-2024', 'FIRST',
    '2023-09-01', '2024-01-15', '2023-11-23',
    10, 5,
    'CREATED', 'NOT_STARTED',
    1, 'MANUAL'
);
```

### 更新示例

#### 1. 更新评价进度
```sql
UPDATE fact_evaluation_record
SET progress_status = 'IN_PROGRESS',
    completion_rate = 60.5,
    completed_indicators = 6,
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

#### 2. 完成评价
```sql
UPDATE fact_evaluation_record
SET evaluation_status = 'COMPLETED',
    progress_status = 'COMPLETED',
    completion_rate = 100.0,
    completed_indicators = 10,
    valid_participants = 4,
    response_rate = 85.0,
    average_score = 87.5,
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

#### 3. 发布评价结果
```sql
UPDATE fact_evaluation_record
SET is_published = 1,
    publish_time = NOW(),
    evaluation_status = 'PUBLISHED',
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

#### 4. 审批通过
```sql
UPDATE fact_evaluation_record
SET approval_status = 'APPROVED',
    approval_level = 'NORMAL',
    approve_time = NOW(),
    approver_id = 34567,
    approver_name = '王院长',
    approval_comments = '评价内容完整，数据准确，同意发布',
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：同一评价周期内，同一对象不能重复评价
2. **完整性检查**：关键字段不能为空
3. **一致性检查**：评价进度和完成率逻辑一致
4. **范围检查**：评分范围必须在0-100之间

### 数据清洗规则
1. **重复数据处理**：删除重复的评价记录
2. **进度修正**：根据实际完成情况更新进度
3. **统计修正**：更新参与者数量和响应率
4. **状态同步**：同步评价状态和进度状态

## 性能优化

### 索引优化
- 模板ID建立索引支持模板查询
- 被评价对象ID建立索引支持对象查询
- 评价状态建立索引支持状态过滤

### 分区策略
- 按学年进行表分区
- 提高历史数据查询性能

### 查询优化
- 使用覆盖索引优化统计查询
- 避免大字段的全表扫描
- 合理使用时间范围过滤

## 安全考虑

### 数据保护
- 评价记录访问权限控制
- 敏感评价内容加密存储
- 评价结果发布权限管理

### 权限控制
- 评价记录修改需要管理员权限
- 评价结果查看需要相应权限
- 审批流程需要完整记录

## 扩展说明

### 未来扩展方向
1. **AI评价**：集成AI评价结果
2. **实时评价**：支持实时评价功能
3. **批量评价**：支持批量评价操作
4. **评价历史**：评价结果历史对比

### 兼容性说明
- 支持多种评价标准对接
- 支持评价结果导出
- 支持评价模板定制

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*