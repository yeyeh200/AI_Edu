# 教师信息实体 (Teacher)

---

**实体编号：** DM-COURSE-003
**实体名称：** 教师信息实体
**所属域：** 教学资源域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

教师信息实体是AI助评应用教学资源管理的核心实体，存储教师的详细信息、资质认证、教学经历等。该实体与用户基本信息实体关联，扩展了教师特有的属性和业务字段，为教学质量评价、师资分析、教师画像等业务提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `dim_teacher`
- **业务表名：** 教师信息表
- **数据类型：** 维度表

### 主要用途
- 存储教师详细信息
- 管理教师资质认证
- 跟踪教师发展轨迹
- 支持教师画像分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 教师记录唯一标识ID |
| user_id | BIGINT | 20 | NOT NULL | 0 | 关联用户ID（唯一） |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teacher_no | VARCHAR | 50 | NOT NULL | '' | 教师工号（系统唯一） |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 教师姓名 |
| teacher_name_en | VARCHAR | 200 | NULL | NULL | 教师英文姓名 |
| gender | ENUM | - | NOT NULL | 'UNKNOWN' | 性别 |
| birth_date | DATE | - | NULL | NULL | 出生日期 |
| id_card | VARCHAR | 18 | NULL | NULL | 身份证号（加密存储） |
| phone | VARCHAR | 20 | NULL | NULL | 联系电话 |
| email | VARCHAR | 100 | NULL | NULL | 电子邮箱 |
| photo_url | VARCHAR | 500 | NULL | NULL | 教师照片URL |

### 工作信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| faculty_id | BIGINT | 20 | NOT NULL | 0 | 所属院系ID |
| faculty_name | VARCHAR | 200 | NOT NULL | '' | 所属院系名称 |
| department | VARCHAR | 200 | NULL | NULL | 所属教研室 |
| office_address | VARCHAR | 200 | NULL | NULL | 办公地址 |
| office_phone | VARCHAR | 20 | NULL | NULL | 办公电话 |
| hire_date | DATE | - | NULL | NULL | 入职日期 |
| work_years | INT | 11 | NULL | 0 | 工作年限 |
| teaching_years | INT | 11 | NULL | 0 | 教学年限 |

### 职称学历字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| title | VARCHAR | 50 | NULL | NULL | 职称 |
| title_level | ENUM | - | NULL | 'LECTURER' | 职称级别 |
| title_date | DATE | - | NULL | NULL | 职称获得日期 |
| education_background | ENUM | - | NULL | 'BACHELOR' | 学历 |
| degree | VARCHAR | 100 | NULL | NULL | 学位 |
| graduate_school | VARCHAR | 200 | NULL | NULL | 毕业院校 |
| major | VARCHAR | 100 | NULL | NULL | 专业 |
| research_direction | TEXT | - | NULL | NULL | 研究方向 |

### 教学能力字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teaching_specialty | TEXT | - | NULL | NULL | 教学专长 |
| main_courses | TEXT | - | NULL | NULL | 主讲课程（JSON数组） |
| max_courses_per_semester | INT | 11 | NULL | 4 | 每学期最大授课门数 |
| max_hours_per_week | INT | 11 | NULL | 20 | 每周最大授课学时 |
| teaching_load_coefficient | DECIMAL | 3,2 | NULL | 1.00 | 教学负荷系数 |
| is_mentor | TINYINT | 1 | NOT NULL | 0 | 是否指导教师 |
| mentor_students | INT | 11 | NULL | 0 | 指导学生数量 |

### 资质认证字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| professional_certifications | TEXT | - | NULL | NULL | 专业资格证书（JSON数组） |
| teaching_certifications | TEXT | - | NULL | NULL | 教学资格证书（JSON数组） |
| awards_honors | TEXT | - | NULL | NULL | 获奖荣誉（JSON数组） |
| research_projects | TEXT | - | NULL | NULL | 科研项目（JSON数组） |
| publications | TEXT | - | NULL | NULL | 发表论文（JSON数组） |
| patents | TEXT | - | NULL | NULL | 专利成果（JSON数组） |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| employment_status | ENUM | - | NOT NULL | 'ACTIVE' | 在职状态 |
| teacher_type | ENUM | - | NOT NULL | 'FULL_TIME' | 教师类型 |
| is_key_teacher | TINYINT | 1 | NOT NULL | 0 | 是否骨干教师 |
| is_outstanding | TINYINT | 1 | NOT NULL | 0 | 是否优秀教师 |
| is_participating_evaluation | TINYINT | 1 | NOT NULL | 1 | 是否参与教学质量评价 |

### 统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_courses_taught | INT | 11 | NULL | 0 | 累计授课门数 |
| total_students_taught | INT | 11 | NULL | 0 | 累计授课学生数 |
| total_teaching_hours | INT | 11 | NULL | 0 | 累计教学学时 |
| average_quality_score | DECIMAL | 5,2 | NULL | 0.00 | 平均教学质量评分 |
| last_evaluation_score | DECIMAL | 5,2 | NULL | 0.00 | 最近评价得分 |
| evaluation_count | INT | 11 | NULL | 0 | 被评价次数 |

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
UNIQUE KEY uk_user_id (user_id)
UNIQUE KEY uk_teacher_no (teacher_no)
```

### 外键约束
```sql
FOREIGN KEY (user_id) REFERENCES dim_user(id) ON DELETE CASCADE
```

### 普通索引
```sql
INDEX idx_teacher_name (teacher_name)
INDEX idx_faculty_id (faculty_id)
INDEX idx_title (title)
INDEX idx_education_background (education_background)
INDEX idx_employment_status (employment_status)
INDEX idx_teacher_type (teacher_type)
INDEX idx_is_key_teacher (is_key_teacher)
```

### 检查约束
```sql
CHECK (gender IN ('MALE', 'FEMALE', 'UNKNOWN'))
CHECK (title_level IN ('PROFESSOR', 'ASSOCIATE_PROFESSOR', 'LECTURER', 'ASSISTANT', 'OTHER'))
CHECK (education_background IN ('HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD', 'POST_DOCTOR'))
CHECK (employment_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'RESIGNED', 'RETIRED'))
CHECK (teacher_type IN ('FULL_TIME', 'PART_TIME', 'VISITING', 'GUEST', 'EMERITUS'))
CHECK (is_mentor IN (0, 1))
CHECK (is_key_teacher IN (0, 1))
CHECK (is_outstanding IN (0, 1))
CHECK (is_participating_evaluation IN (0, 1))
CHECK (max_courses_per_semester BETWEEN 1 AND 10)
CHECK (max_hours_per_week BETWEEN 1 AND 40)
CHECK (total_courses_taught >= 0)
CHECK (average_quality_score BETWEEN 0 AND 100)
```

## 枚举值定义

### 性别 (gender)
| 值 | 说明 | 备注 |
|----|------|------|
| MALE | 男 | 男性教师 |
| FEMALE | 女 | 女性教师 |
| UNKNOWN | 未知 | 未填写或不愿透露 |

### 职称级别 (title_level)
| 值 | 说明 | 级别 |
|----|------|------|
| PROFESSOR | 教授 | 正高级 |
| ASSOCIATE_PROFESSOR | 副教授 | 副高级 |
| LECTURER | 讲师 | 中级 |
| ASSISTANT | 助教 | 初级 |
| OTHER | 其他 | 其他职称 |

### 学历 (education_background)
| 值 | 说明 | 层次 |
|----|------|------|
| HIGH_SCHOOL | 高中 | 中学学历 |
| BACHELOR | 本科 | 本科学历 |
| MASTER | 硕士 | 研究生学历 |
| PHD | 博士 | 博士研究生学历 |
| POST_DOCTOR | 博士后 | 博士后经历 |

### 在职状态 (employment_status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 在职 | 正常工作状态 |
| INACTIVE | 待岗 | 暂时待岗 |
| SUSPENDED | 停职 | 暂时停职 |
| RESIGNED | 离职 | 已离职 |
| RETIRED | 退休 | 已退休 |

### 教师类型 (teacher_type)
| 值 | 说明 | 备注 |
|----|------|------|
| FULL_TIME | 全职 | 全职教师 |
| PART_TIME | 兼职 | 兼职教师 |
| VISITING | 访问 | 访问学者 |
| GUEST | 客座 | 客座教师 |
| EMERITUS | 荣休 | 荣休教师 |

## JSON字段格式示例

### 主讲课程 (main_courses)
```json
[
  {
    "course_id": 1001,
    "course_code": "CS2023001",
    "course_name": "数据结构与算法",
    "teaching_years": 3
  },
  {
    "course_id": 1002,
    "course_code": "CS2023002",
    "course_name": "算法设计与分析",
    "teaching_years": 2
  }
]
```

### 专业资格证书 (professional_certifications)
```json
[
  {
    "certificate_name": "高级工程师",
    "issuing_organization": "人力资源和社会保障部",
    "issue_date": "2020-06-01",
    "certificate_number": "GJ2020001234",
    "valid_until": "2025-06-01"
  }
]
```

### 获奖荣誉 (awards_honors)
```json
[
  {
    "award_name": "校级优秀教师",
    "award_year": "2023",
    "award_level": "school",
    "issuing_organization": "XX大学"
  },
  {
    "award_name": "教学成果一等奖",
    "award_year": "2022",
    "award_level": "provincial",
    "issuing_organization": "XX省教育厅"
  }
]
```

## 关联关系

### 一对一关系
- **Teacher → User**：一个教师信息对应一个用户基本信息

### 一对多关系（作为主表）
- **Teacher → Schedule**：一个教师可以有多门课程安排
- **Teacher → Course**：一个教师可以教授多门课程
- **Teacher → QualityScore**：一个教师有多个质量评分记录
- **Teacher → EvaluationRecord**：一个教师参与多个评价记录

### 多对一关系（作为从表）
- **Teacher ← Faculty**：教师属于一个院系

## 使用示例

### 查询示例

#### 1. 查询院系教师统计
```sql
SELECT
    faculty_name,
    COUNT(*) as total_teachers,
    COUNT(CASE WHEN title_level = 'PROFESSOR' THEN 1 END) as professor_count,
    COUNT(CASE WHEN title_level = 'ASSOCIATE_PROFESSOR' THEN 1 END) as associate_professor_count,
    COUNT(CASE WHEN title_level = 'LECTURER' THEN 1 END) as lecturer_count,
    AVG(teaching_years) as avg_teaching_years,
    AVG(average_quality_score) as avg_quality_score
FROM dim_teacher
WHERE employment_status = 'ACTIVE'
  AND is_participating_evaluation = 1
GROUP BY faculty_id, faculty_name
ORDER BY total_teachers DESC;
```

#### 2. 查询教师教学质量排名
```sql
SELECT
    teacher_name,
    faculty_name,
    title,
    average_quality_score,
    total_courses_taught,
    evaluation_count,
    is_key_teacher,
    is_outstanding
FROM dim_teacher
WHERE employment_status = 'ACTIVE'
  AND is_participating_evaluation = 1
  AND evaluation_count >= 3
ORDER BY average_quality_score DESC
LIMIT 20;
```

#### 3. 查询教师工作负荷
```sql
SELECT
    teacher_name,
    teaching_years,
    total_courses_taught,
    total_teaching_hours,
    current_semester_courses,
    current_weekly_hours,
    teaching_load_coefficient,
    CASE
        WHEN current_weekly_hours > max_hours_per_week THEN 'OVERLOADED'
        WHEN current_weekly_hours >= max_hours_per_week * 0.8 THEN 'OPTIMAL'
        ELSE 'UNDERLOADED'
    END as load_status
FROM dim_teacher t
LEFT JOIN (
    SELECT
        teacher_id,
        COUNT(DISTINCT course_id) as current_semester_courses,
        SUM(duration_minutes) / 60 as current_weekly_hours
    FROM fact_schedule
    WHERE academic_year = '2023-2024'
      AND semester = 'FIRST'
      AND schedule_status != 'CANCELLED'
      AND WEEK(schedule_date) BETWEEN 1 AND 16
    GROUP BY teacher_id
) s ON t.id = s.teacher_id
WHERE t.employment_status = 'ACTIVE';
```

#### 4. 查询教师资质情况
```sql
SELECT
    title,
    education_background,
    COUNT(*) as teacher_count,
    COUNT(CASE WHEN JSON_LENGTH(professional_certifications) > 0 THEN 1 END) as has_certification,
    COUNT(CASE WHEN JSON_LENGTH(awards_honors) > 0 THEN 1 END) as has_awards,
    COUNT(CASE WHEN is_key_teacher = 1 THEN 1 END) as key_teacher_count
FROM dim_teacher
WHERE employment_status = 'ACTIVE'
GROUP BY title, education_background
ORDER BY title, education_background;
```

### 插入示例

#### 1. 新增教师信息
```sql
INSERT INTO dim_teacher (
    user_id, teacher_no, teacher_name, gender,
    faculty_id, faculty_name, department,
    hire_date, work_years, teaching_years,
    title, title_level, education_background, degree,
    graduate_school, major, research_direction,
    teaching_specialty, main_courses,
    employment_status, teacher_type,
    create_by
) VALUES (
    12345, 'T20230001', '张三', 'MALE',
    1001, '计算机学院', '软件教研室',
    '2015-09-01', 8, 8,
    '副教授', 'ASSOCIATE_PROFESSOR', 'PHD', '工学博士',
    '清华大学', '计算机科学与技术', '人工智能、机器学习',
    '数据结构、算法设计、软件工程',
    '[{"course_id": 1001, "course_code": "CS2023001", "course_name": "数据结构与算法", "teaching_years": 5}]',
    'ACTIVE', 'FULL_TIME',
    1
);
```

### 更新示例

#### 1. 更新教师职称
```sql
UPDATE dim_teacher
SET title = '教授',
    title_level = 'PROFESSOR',
    title_date = '2023-09-01',
    update_time = NOW(),
    version = version + 1
WHERE id = 12345;
```

#### 2. 更新统计信息
```sql
UPDATE dim_teacher t
SET total_courses_taught = (
    SELECT COUNT(DISTINCT course_id)
    FROM fact_schedule
    WHERE teacher_id = t.id
      AND schedule_status = 'COMPLETED'
),
total_students_taught = (
    SELECT SUM(DISTINCT student_count)
    FROM fact_schedule
    WHERE teacher_id = t.id
      AND schedule_status = 'COMPLETED'
),
total_teaching_hours = (
    SELECT SUM(duration_minutes) / 60
    FROM fact_schedule
    WHERE teacher_id = t.id
      AND schedule_status = 'COMPLETED'
),
update_time = NOW()
WHERE t.id = 12345;
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：用户ID和教师工号必须唯一
2. **完整性检查**：院系、姓名等关键字段不能为空
3. **一致性检查**：职称与学历匹配度检查
4. **逻辑检查**：教学年限不能大于工作年限

### 数据清洗规则
1. **重复数据处理**：合并重复的教师记录
2. **数据标准化**：统一职称、学历等标准
3. **异常值处理**：处理异常的年限和统计数据
4. **关联验证**：验证与用户信息的关联关系

## 性能优化

### 索引优化
- 教师工号建立唯一索引
- 院系ID建立索引支持分组统计
- 职称、学历建立索引支持过滤查询

### 查询优化
- 使用覆盖索引优化统计查询
- 避免大字段的全表扫描
- 合理使用JSON函数

### 存储优化
- 教师照片使用外部存储
- JSON字段合理设计结构
- 定期更新统计字段

## 安全考虑

### 数据保护
- 身份证号等敏感信息加密存储
- 教师隐私信息访问权限控制
- 个人信息脱敏处理

### 权限控制
- 教师信息修改需要本人或管理员权限
- 薪资等敏感信息特殊保护
- 操作日志完整记录

## 扩展说明

### 未来扩展方向
1. **教学评价**：增加学生评教、同行评议等评价信息
2. **发展轨迹**：记录教师职业发展轨迹
3. **能力模型**：建立教师能力评估模型
4. **培训管理**：增加教师培训和发展记录

### 兼容性说明
- 支持与人事系统数据对接
- 支持与教师资格认证系统集成
- 支持国家标准职称体系

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*