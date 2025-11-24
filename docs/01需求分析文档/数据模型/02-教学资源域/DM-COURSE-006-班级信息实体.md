# 班级信息实体 (Class)

---

**实体编号：** DM-COURSE-006
**实体名称：** 班级信息实体
**所属域：** 教学资源域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

班级信息实体是AI助评应用教学资源管理的重要实体，定义了学校的学生班级组织。该实体与院系、专业、学生等实体关联，为教学管理、学生管理、考勤统计、质量评估等提供班级维度支撑。

## 实体定义

### 表名
- **物理表名：** `dim_class`
- **业务表名：** 班级信息表
- **数据类型：** 维度表

### 主要用途
- 定义班级基本信息
- 管理班级学生数据
- 支持班级统计分析
- 提供班级质量评估

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 班级记录唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| class_code | VARCHAR | 50 | NOT NULL | '' | 班级编码（系统唯一） |
| class_name | VARCHAR | 100 | NOT NULL | '' | 班级名称 |
| class_type | ENUM | - | NOT NULL | 'REGULAR' | 班级类型 |
| education_level | ENUM | - | NOT NULL | 'UNDERGRADUATE' | 教育层次 |
| enrollment_year | VARCHAR | 10 | NOT NULL | '' | 入学年份 |
| graduation_year | VARCHAR | 10 | NOT NULL | '' | 毕业年份 |

### 关联信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| faculty_id | BIGINT | 20 | NOT NULL | 0 | 所属院系ID |
| faculty_name | VARCHAR | 200 | NOT NULL | '' | 所属院系名称 |
| major_id | BIGINT | 20 | NOT NULL | 0 | 所属专业ID |
| major_name | VARCHAR | 200 | NOT NULL | '' | 所属专业名称 |
| department | VARCHAR | 200 | NULL | NULL | 所属教研室 |

### 班级属性字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| class_category | ENUM | - | NOT NULL | 'FULL_TIME' | 班级类别 |
| training_mode | ENUM | - | NOT NULL | 'FULL_TIME' | 培养模式 |
| study_duration | INT | 11 | NOT NULL | 4 | 学制年限 |
| class_capacity | INT | 11 | NOT NULL | 40 | 班级容量 |
| current_student_count | INT | 11 | NOT NULL | 0 | 在校学生数 |
| is_experimental | TINYINT | 1 | NOT NULL | 0 | 是否实验班 |
| is_international | TINYINT | 1 | NOT NULL | 0 | 是否国际班 |
| is_excellent_class | TINYINT | 1 | NOT NULL | 0 | 是否优秀班 |

### 管理信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| head_teacher_id | BIGINT | 20 | NULL | NULL | 班主任ID |
| head_teacher_name | VARCHAR | 100 | NULL | NULL | 班主任姓名 |
| head_teacher_phone | VARCHAR | 20 | NULL | NULL | 班主任电话 |
| counselor_id | BIGINT | 20 | NULL | NULL | 辅导员ID |
| counselor_name | VARCHAR | 100 | NULL | NULL | 辅导员姓名 |
| monitor_student_id | BIGINT | 20 | NULL | NULL | 班长ID |
| monitor_student_name | VARCHAR | 100 | NULL | NULL | 班长姓名 |

### 联系方式字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| classroom_location | VARCHAR | 200 | NULL | NULL | 教室地点 |
| class_meeting_room | VARCHAR | 200 | NULL | NULL | 班会地点 |
| class_phone | VARCHAR | 20 | NULL | NULL | 班级电话 |
| class_email | VARCHAR | 100 | NULL | NULL | 班级邮箱 |
| qq_group | VARCHAR | 50 | NULL | NULL | QQ群号 |
| wechat_group | VARCHAR | 100 | NULL | NULL | 微信群 |

### 统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| male_student_count | INT | 11 | NOT NULL | 0 | 男生人数 |
| female_student_count | INT | 11 | NOT NULL | 0 | 女生人数 |
 enrollment_count | INT | 11 | NOT NULL | 0 | 录取人数 |
| actual_enrollment | INT | 11 | NOT NULL | 0 | 实际报到人数 |
| graduate_count | INT | 11 | NOT NULL | 0 | 毕业人数 |
| dropout_count | INT | 11 | NOT NULL | 0 | 退学人数 |
| transfer_count | INT | 11 | NOT NULL | 0 | 转专业人数 |
| average_score | DECIMAL | 5,2 | NULL | 0.00 | 班级平均成绩 |
| attendance_rate | DECIMAL | 5,2 | NULL | 0.00 | 平均出勤率 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| class_status | ENUM | - | NOT NULL | 'ACTIVE' | 班级状态 |
| academic_status | ENUM | - | NOT NULL | 'STUDYING' | 学籍状态 |
| is_active | TINYINT | 1 | NOT NULL | 1 | 是否激活 |
| end_date | DATE | - | NULL | NULL | 班级结束日期 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_class_code (class_code)
UNIQUE KEY uk_faculty_major_year (faculty_id, major_id, enrollment_year)
```

### 外键约束
```sql
FOREIGN KEY (faculty_id) REFERENCES dim_faculty(id) ON DELETE CASCADE
FOREIGN KEY (major_id) REFERENCES dim_major(id) ON DELETE CASCADE
FOREIGN KEY (head_teacher_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (counselor_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (monitor_student_id) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_faculty_id (faculty_id)
INDEX idx_major_id (major_id)
INDEX idx_enrollment_year (enrollment_year)
INDEX idx_class_type (class_type)
INDEX idx_class_status (class_status)
INDEX idx_academic_status (academic_status)
```

### 检查约束
```sql
CHECK (class_type IN ('REGULAR', 'EXPERIMENTAL', 'INTERNATIONAL', 'CONTINUING', 'ONLINE'))
CHECK (education_level IN ('UNDERGRADUATE', 'GRADUATE', 'POSTGRADUATE', 'VOCATIONAL'))
CHECK (class_category IN ('FULL_TIME', 'PART_TIME', 'ONLINE', 'HYBRID'))
CHECK (training_mode IN ('FULL_TIME', 'PART_TIME', 'ONLINE', 'HYBRID'))
CHECK (study_duration BETWEEN 1 AND 8)
CHECK (class_capacity BETWEEN 1 AND 200)
CHECK (is_experimental IN (0, 1))
CHECK (is_international IN (0, 1))
CHECK (class_status IN ('ACTIVE', 'SUSPENDED', 'GRADUATED', 'DISBANDED'))
CHECK (academic_status IN ('STUDYING', 'SUSPENDED', 'GRADUATED', 'DROPOUT'))
CHECK (is_active IN (0, 1))
CHECK (current_student_count >= 0)
CHECK (current_student_count <= class_capacity)
```

## 枚举值定义

### 班级类型 (class_type)
| 值 | 说明 | 备注 |
|----|------|------|
| REGULAR | 普通班 | 常规教学班级 |
| EXPERIMENTAL | 实验班 | 教学实验班级 |
| INTERNATIONAL | 国际班 | 国际学生班级 |
| CONTINUING | 继续教育班 | 继续教育班级 |
| ONLINE | 在线班 | 在线教学班级 |

### 教育层次 (education_level)
| 值 | 说明 | 备注 |
|----|------|------|
| UNDERGRADUATE | 本科 | 本科教育 |
| GRADUATE | 研究生 | 研究生教育 |
| POSTGRADUATE | 研究生 | 研究生教育（同上） |
| VOCATIONAL | 职业教育 | 职业教育 |

### 班级类别 (class_category)
| 值 | 说明 | 备注 |
|----|------|------|
| FULL_TIME | 全日制 | 全日制教学 |
| PART_TIME | 非全日制 | 非全日制教学 |
| ONLINE | 在线 | 在线教学 |
| HYBRID | 混合 | 混合教学 |

### 班级状态 (class_status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 正常 | 正常教学 |
| SUSPENDED | 暂停 | 暂停教学 |
| GRADUATED | 已毕业 | 已毕业 |
| DISBANDED | 已解散 | 已解散 |

### 学籍状态 (academic_status)
| 值 | 说明 | 备注 |
|----|------|------|
| STUDYING | 在读 | 正在学习 |
| SUSPENDED | 休学 | 休学状态 |
| GRADUATED | 毕业 | 已毕业 |
| DROPOUT | 退学 | 已退学 |

## 关联关系

### 多对一关系（作为从表）
- **Class → Faculty**：班级属于一个院系
- **Class → Major**：班级属于一个专业

### 一对多关系（作为主表）
- **Class → Student**：一个班级包含多个学生
- **Class → Schedule**：一个班级有多个课程安排
- **Class → Attendance**：一个班级有多次考勤记录

### 一对一关系
- **Class → User（作为班主任）**：班级与班主任的关系

## 使用示例

### 查询示例

#### 1. 查询院系班级统计
```sql
SELECT
    f.faculty_name,
    m.major_name,
    COUNT(c.id) as class_count,
    SUM(c.current_student_count) as total_students,
    SUM(c.male_student_count) as male_students,
    SUM(c.female_student_count) as female_students,
    AVG(c.average_score) as avg_score,
    AVG(c.attendance_rate) as avg_attendance
FROM dim_class c
JOIN dim_faculty f ON c.faculty_id = f.id
JOIN dim_major m ON c.major_id = m.id
WHERE c.class_status = 'ACTIVE'
  AND f.status = 'ACTIVE'
GROUP BY f.faculty_id, f.faculty_name, m.major_id, m.major_name
ORDER BY total_students DESC;
```

#### 2. 查询班级详细信息
```sql
SELECT
    class_name,
    class_type,
    enrollment_year,
    current_student_count,
    class_capacity,
    head_teacher_name,
    counselor_name,
    average_score,
    attendance_rate,
    is_experimental,
    is_international
FROM dim_class
WHERE class_status = 'ACTIVE'
  AND academic_status = 'STUDYING'
ORDER BY enrollment_year DESC, class_name;
```

#### 3. 查询实验班信息
```sql
SELECT
    class_name,
    faculty_name,
    major_name,
    enrollment_year,
    current_student_count,
    average_score,
    class_status,
    head_teacher_name
FROM dim_class c
JOIN dim_faculty f ON c.faculty_id = f.id
JOIN dim_major m ON c.major_id = m.id
WHERE c.is_experimental = 1
  AND c.class_status = 'ACTIVE'
ORDER BY c.enrollment_year DESC, c.average_score DESC;
```

#### 4. 查询班级学籍统计
```sql
SELECT
    enrollment_year,
    COUNT(*) as total_classes,
    SUM(CASE WHEN academic_status = 'STUDYING' THEN 1 END) as studying_classes,
    SUM(CASE WHEN academic_status = 'GRADUATED' THEN 1 END) as graduated_classes,
    SUM(CASE WHEN academic_status = 'DROPOUT' THEN 1 END) as dropout_classes,
    SUM(enrollment_count) as total_enrolled,
    SUM(current_student_count) as current_students,
    SUM(graduate_count) as total_graduates
FROM dim_class
WHERE class_status IN ('ACTIVE', 'GRADUATED')
GROUP BY enrollment_year
ORDER BY enrollment_year DESC;
```

### 插入示例

#### 1. 创建班级
```sql
INSERT INTO dim_class (
    class_code, class_name, class_type, education_level,
    enrollment_year, graduation_year,
    faculty_id, faculty_name, major_id, major_name,
    study_duration, class_capacity,
    head_teacher_id, head_teacher_name,
    create_by
) VALUES (
    'CS2023001', '软件工程2023-1班', 'REGULAR', 'UNDERGRADUATE',
    '2023', '2027',
    1, '计算机学院', 1001, '软件工程',
    4, 45,
    12345, '李老师',
    1
);
```

### 更新示例

#### 1. 更新班级统计信息
```sql
UPDATE dim_class c
SET current_student_count = (
    SELECT COUNT(*)
    FROM dim_user u
    WHERE u.class_id = c.id
      AND u.user_type = 'STUDENT'
      AND u.status = 'ACTIVE'
),
male_student_count = (
    SELECT COUNT(*)
    FROM dim_user u
    WHERE u.class_id = c.id
      AND u.user_type = 'STUDENT'
      AND u.gender = 'MALE'
      AND u.status = 'ACTIVE'
),
female_student_count = (
    SELECT COUNT(*)
    FROM dim_user u
    WHERE u.class_id = c.id
      AND u.user_type = 'STUDENT'
      AND u.gender = 'FEMALE'
      AND u.status = 'ACTIVE'
),
update_time = NOW()
WHERE c.id = 1001;
```

#### 2. 更新班级状态
```sql
UPDATE dim_class
SET academic_status = 'GRADUATED',
    class_status = 'GRADUATED',
    end_date = '2027-06-30',
    update_time = NOW(),
    version = version + 1
WHERE class_code = 'CS2023001'
  AND enrollment_year = '2023';
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：班级编码必须唯一
2. **完整性检查**：院系、专业等关键字段不能为空
3. **逻辑检查**：实际学生数不能超过班级容量
4. **关联检查**：院系、专业ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的班级定义
2. **数据标准化**：统一班级编码格式
3. **统计修正**：更新学生人数统计
4. **状态同步**：同步班级学籍状态

## 性能优化

### 索引优化
- 班级编码建立唯一索引
- 院系、专业ID建立复合索引
- 入学年份建立索引支持时间查询

### 查询优化
- 使用覆盖索引优化统计查询
- 避免大字段的全表扫描
- 合理使用分组和排序

### 存储优化
- 定期更新统计字段
- 合理设计班级编码规则
- 避免频繁的班级结构调整

## 扩展说明

### 未来扩展方向
1. **班级画像**：增加班级特色和画像分析
2. **班级管理**：增强班级管理功能
3. **班级评价**：增加班级评价体系
4. **班级协作**：支持班级间协作关系

### 兼容性说明
- 支持与教务系统班级数据对接
- 支持国家班级管理标准
- 支持多校区班级管理

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*