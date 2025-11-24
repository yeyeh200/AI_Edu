# 课程安排实体 (Schedule)

---

**实体编号：** DM-ACTIVITY-001
**实体名称：** 课程安排实体
**所属域：** 教学活动域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

课程安排实体是AI助评应用教学管理的核心事实实体，存储课程的具体时间安排、地点分配、教师分配等信息。该实体整合了教务系统的课表数据和职教云的开课数据，为教学质量分析、出勤统计、资源利用率分析等提供基础数据。

## 实体定义

### 表名
- **物理表名：** `fact_schedule`
- **业务表名：** 课程安排表
- **数据类型：** 事实表

### 主要用途
- 存储课程时间安排信息
- 支持课表查询和管理
- 提供教学资源利用率分析
- 支持冲突检测和优化

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 安排记录唯一标识ID |

### 关联维度字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| course_id | BIGINT | 20 | NOT NULL | 0 | 课程ID |
| course_code | VARCHAR | 50 | NOT NULL | '' | 课程编号 |
| course_name | VARCHAR | 200 | NOT NULL | '' | 课程名称 |
| teacher_id | BIGINT | 20 | NOT NULL | 0 | 授课教师ID |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 授课教师姓名 |
| teacher_no | VARCHAR | 50 | NOT NULL | '' | 教师工号 |
| classroom_id | BIGINT | 20 | NULL | NULL | 教室ID |
| classroom_name | VARCHAR | 100 | NULL | NULL | 教室名称 |
| classroom_type | VARCHAR | 50 | NULL | NULL | 教室类型 |

### 时间信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| academic_year | VARCHAR | 10 | NOT NULL | '' | 学年（如：2023-2024） |
| semester | ENUM | - | NOT NULL | 'FIRST' | 学期 |
| week_number | INT | 11 | NOT NULL | 1 | 周次（1-20周） |
| weekday | TINYINT | 1 | NOT NULL | 1 | 星期几（1-7） |
| start_time | TIME | - | NOT NULL | '08:00:00' | 开始时间 |
| end_time | TIME | - | NOT NULL | '08:45:00' | 结束时间 |
| duration_minutes | INT | 11 | NOT NULL | 45 | 课时时长（分钟） |
| schedule_date | DATE | - | NOT NULL | CURRENT_DATE | 具体日期 |

### 班级信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| class_id | BIGINT | 20 | NULL | NULL | 班级ID |
| class_name | VARCHAR | 100 | NULL | NULL | 班级名称 |
| student_count | INT | 11 | NULL | 0 | 学生人数 |
| faculty_id | BIGINT | 20 | NULL | NULL | 院系ID |
| faculty_name | VARCHAR | 200 | NULL | NULL | 院系名称 |

### 教学安排字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| lesson_type | ENUM | - | NOT NULL | 'THEORY' | 课时类型 |
| teaching_mode | ENUM | - | NOT NULL | 'OFFLINE' | 教学模式 |
| session_number | TINYINT | 1 | NULL | 1 | 课时序号（第几节课） |
| total_sessions | TINYINT | 1 | NULL | 1 | 总课时数 |
| is_double_session | TINYINT | 1 | NOT NULL | 0 | 是否连堂课 |
| is_lab_session | TINYINT | 1 | NOT NULL | 0 | 是否实验课 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| schedule_status | ENUM | - | NOT NULL | 'SCHEDULED' | 安排状态 |
| attendance_status | ENUM | - | NULL | NULL | 考勤状态 |
| completion_status | ENUM | - | NULL | NULL | 完成状态 |
| is_cancelled | TINYINT | 1 | NOT NULL | 0 | 是否取消 |
| is_moved | TINYINT | 1 | NOT NULL | 0 | 是否调课 |
| original_classroom_id | BIGINT | 20 | NULL | NULL | 原教室ID（调课后） |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |

### 外部系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| source_system | ENUM | - | NOT NULL | 'MERGE' | 数据来源系统 |
| source_id | VARCHAR | 100 | NULL | NULL | 源系统ID |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |
| sync_status | ENUM | - | NOT NULL | 'SYNCED' | 同步状态 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_schedule_unique (
    teacher_id, classroom_id, schedule_date,
    start_time, end_time
)
```

### 普通索引
```sql
INDEX idx_course_id (course_id)
INDEX idx_teacher_id (teacher_id)
INDEX idx_classroom_id (classroom_id)
INDEX idx_schedule_date (schedule_date)
INDEX idx_academic_year (academic_year)
INDEX idx_semester (semester)
INDEX idx_weekday (weekday)
INDEX idx_lesson_type (lesson_type)
INDEX idx_schedule_status (schedule_status)
```

### 检查约束
```sql
CHECK (semester IN ('FIRST', 'SECOND', 'SUMMER'))
CHECK (weekday BETWEEN 1 AND 7)
CHECK (duration_minutes > 0)
CHECK (lesson_type IN ('THEORY', 'PRACTICE', 'LAB', 'EXAM', 'SEMINAR'))
CHECK (teaching_mode IN ('OFFLINE', 'ONLINE', 'HYBRID'))
CHECK (session_number BETWEEN 1 AND 20)
CHECK (total_sessions BETWEEN 1 AND 20)
CHECK (is_double_session IN (0, 1))
CHECK (is_lab_session IN (0, 1))
CHECK (schedule_status IN ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'))
CHECK (completion_status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABSENT'))
CHECK (is_cancelled IN (0, 1))
CHECK (is_moved IN (0, 1))
CHECK (source_system IN ('EDU', 'ZJY', 'MANUAL', 'MERGE'))
CHECK (sync_status IN ('SYNCED', 'PENDING', 'FAILED'))
```

## 枚举值定义

### 学期 (semester)
| 值 | 说明 | 备注 |
|----|------|------|
| FIRST | 第一学期 | 秋季学期（9-1月） |
| SECOND | 第二学期 | 春季学期（2-7月） |
| SUMMER | 夏季学期 | 夏季学期（7-8月） |

### 课时类型 (lesson_type)
| 值 | 说明 | 备注 |
|----|------|------|
| THEORY | 理论课 | 理论教学课时 |
| PRACTICE | 实践课 | 实践教学课时 |
| LAB | 实验课 | 实验教学课时 |
| EXAM | 考试课 | 考试课时 |
| SEMINAR | 研讨课 | 研讨教学课时 |

### 教学模式 (teaching_mode)
| 值 | 说明 | 备注 |
|----|------|------|
| OFFLINE | 线下 | 传统课堂教学 |
| ONLINE | 线上 | 线上教学 |
| HYBRID | 混合 | 线上线下混合教学 |

### 安排状态 (schedule_status)
| 值 | 说明 | 备注 |
|----|------|------|
| SCHEDULED | 已安排 | 正常安排状态 |
| ONGOING | 进行中 | 正在上课 |
| COMPLETED | 已完成 | 课程结束 |
| CANCELLED | 已取消 | 课程取消 |

### 完成状态 (completion_status)
| 值 | 说明 | 备注 |
|----|------|------|
| NOT_STARTED | 未开始 | 课程未开始 |
| IN_PROGRESS | 进行中 | 课程正在进行 |
| COMPLETED | 已完成 | 课程已完成 |
| ABSENT | 缺席 | 教师或学生缺席 |

## 时间安排规范

### 标准课时安排
```
第1-2节课：08:00-09:30（90分钟）
第3-4节课：10:00-11:30（90分钟）
第5-6节课：14:00-15:30（90分钟）
第7-8节课：16:00-17:30（90分钟）
第9-10节课：19:00-20:30（90分钟）
```

### 周次安排
- 教学周：1-16周
- 复习周：17-18周
- 考试周：19-20周

### 星期对应
| 数字 | 星期 |
|------|------|
| 1 | 星期一 |
| 2 | 星期二 |
| 3 | 星期三 |
| 4 | 星期四 |
| 5 | 星期五 |
| 6 | 星期六 |
| 7 | 星期日 |

## 关联关系

### 多对一关系（作为从表）
- **Schedule ← Course**：多个安排属于一门课程
- **Schedule ← Teacher**：多个安排由一名教师授课
- **Schedule ← Classroom**：多个安排使用一个教室
- **Schedule ← Class**：多个安排面向一个班级

### 一对多关系（作为主表）
- **Schedule → Attendance**：一个安排对应多次考勤
- **Schedule → TeachingActivity**：一个安排包含多个教学活动

## 使用示例

### 查询示例

#### 1. 查询教师课表
```sql
SELECT
    schedule_date,
    WEEKDAY(schedule_date) + 1 as weekday,
    start_time,
    end_time,
    course_name,
    classroom_name,
    lesson_type,
    student_count
FROM fact_schedule
WHERE teacher_id = 12345
  AND academic_year = '2023-2024'
  AND semester = 'FIRST'
  AND schedule_status != 'CANCELLED'
  AND WEEK(schedule_date) BETWEEN 1 AND 20
ORDER BY schedule_date, start_time;
```

#### 2. 查询教室使用情况
```sql
SELECT
    classroom_name,
    schedule_date,
    start_time,
    end_time,
    course_name,
    teacher_name,
    teaching_mode
FROM fact_schedule
WHERE classroom_id = 1001
  AND schedule_date = '2023-10-23'
  AND schedule_status != 'CANCELLED'
ORDER BY start_time;
```

#### 3. 检测时间冲突
```sql
SELECT
    s1.id as schedule1_id,
    s2.id as schedule2_id,
    s1.teacher_name,
    s2.teacher_name,
    s1.start_time as time1_start,
    s1.end_time as time1_end,
    s2.start_time as time2_start,
    s2.end_time as time2_end
FROM fact_schedule s1
JOIN fact_schedule s2 ON (
    s1.teacher_id = s2.teacher_id
    AND s1.id != s2.id
    AND s1.schedule_date = s2.schedule_date
    AND s1.schedule_status != 'CANCELLED'
    AND s2.schedule_status != 'CANCELLED'
    AND (
        (s1.start_time BETWEEN s2.start_time AND s2.end_time)
        OR (s1.end_time BETWEEN s2.start_time AND s2.end_time)
        OR (s2.start_time BETWEEN s1.start_time AND s1.end_time)
        OR (s2.end_time BETWEEN s1.start_time AND s1.end_time)
    )
);
```

#### 4. 统计教学时长
```sql
SELECT
    teacher_name,
    academic_year,
    semester,
    COUNT(*) as total_sessions,
    SUM(duration_minutes) as total_minutes,
    SUM(duration_minutes) / 60 as total_hours,
    COUNT(DISTINCT course_id) as course_count
FROM fact_schedule
WHERE schedule_status = 'COMPLETED'
  AND academic_year = '2023-2024'
GROUP BY teacher_id, teacher_name, academic_year, semester
ORDER BY total_hours DESC;
```

### 插入示例

#### 1. 创建课程安排
```sql
INSERT INTO fact_schedule (
    course_id, course_code, course_name,
    teacher_id, teacher_name, teacher_no,
    classroom_id, classroom_name, classroom_type,
    academic_year, semester, week_number, weekday,
    start_time, end_time, duration_minutes,
    schedule_date, class_id, class_name, student_count,
    lesson_type, teaching_mode,
    schedule_status, create_by
) VALUES (
    1001, 'CS2023001', '数据结构与算法',
    12345, '张老师', 'T20230001',
    2001, '计算机101实验室', 'LAB',
    '2023-2024', 'FIRST', 5, 1,
    '08:00:00', '09:30:00', 90,
    '2023-10-23', 3001, '软件工程2023-1班', 45,
    'LAB', 'OFFLINE',
    'SCHEDULED', 1
);
```

### 更新示例

#### 1. 调课处理
```sql
UPDATE fact_schedule
SET is_moved = 1,
    original_classroom_id = classroom_id,
    classroom_id = 2002,
    classroom_name = '计算机102实验室',
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

#### 2. 取消课程
```sql
UPDATE fact_schedule
SET schedule_status = 'CANCELLED',
    is_cancelled = 1,
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

## 数据质量

### 质量检查规则
1. **完整性检查**：课程、教师、时间等关键字段不能为空
2. **一致性检查**：时间安排逻辑必须正确
3. **冲突检查**：教师、教室时间不能冲突
4. **范围检查**：时间、周次等数值必须在合理范围

### 数据清洗规则
1. **冲突处理**：识别并处理时间冲突
2. **重复数据处理**：删除重复的安排记录
3. **异常数据处理**：处理异常的时间安排
4. **数据同步**：保持与源系统数据一致性

## 性能优化

### 索引优化
- 复合索引支持常用查询组合
- 时间字段建立索引支持时间范围查询
- 教师、教室字段建立索引支持冲突检查

### 分区策略
- 按学年进行表分区
- 按学期进行子分区
- 提高历史数据查询性能

### 查询优化
- 使用覆盖索引减少回表
- 合理使用分页查询
- 避免全表扫描

## 业务规则

### 安排规则
1. 教师同一时间不能安排两门课程
2. 教室同一时间不能安排两门课程
3. 学生班级同一时间不能安排两门课程
4. 实验课必须在实验室进行

### 调课规则
1. 调课需要提前申请
2. 调课需要通知相关教师和学生
3. 调课需要记录原安排信息
4. 频繁调课需要特殊审批

### 完成规则
1. 课程结束后自动标记为已完成
2. 教师可以手动标记课程状态
3. 缺席课程需要特殊标记
4. 异常情况需要记录原因

## 扩展说明

### 未来扩展方向
1. **智能排课**：基于算法的自动排课
2. **资源优化**：教室和教师资源优化配置
3. **时间冲突检测**：增强的冲突检测算法
4. **移动端课表**：支持移动端课表查询

### 兼容性说明
- 支持与教务系统课表数据同步
- 支持与职教云开课数据对接
- 支持多种课表格式导入导出

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*