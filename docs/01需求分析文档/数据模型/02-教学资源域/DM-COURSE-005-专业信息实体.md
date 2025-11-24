# 专业信息实体 (Major)

---

**实体编号：** DM-COURSE-005
**实体名称：** 专业信息实体
**所属域：** 教学资源域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

专业信息实体是AI助评应用教学资源管理的重要实体，定义了学校开设的专业信息。该实体与院系、班级、课程等实体关联，为专业建设、学生管理、课程安排、质量评估等提供专业维度支撑。

## 实体定义

### 表名
- **物理表名：** `dim_major`
- **业务表名：** 专业信息表
- **数据类型：** 维度表

### 主要用途
- 定义专业基本信息
- 管理专业建设数据
- 支持专业统计分析
- 提供专业质量评估

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 专业记录唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| major_code | VARCHAR | 50 | NOT NULL | '' | 专业编码（系统唯一） |
| major_name | VARCHAR | 200 | NOT NULL | '' | 专业名称 |
| major_name_en | VARCHAR | 300 | NULL | NULL | 专业英文名称 |
| major_short_name | VARCHAR | 50 | NULL | NULL | 专业简称 |
| major_category | ENUM | - | NOT NULL | 'UNDERGRADUATE' | 专业类别 |
| discipline_category | VARCHAR | 100 | NULL | NULL | 学科门类 |
| education_level | ENUM | - | NOT NULL | 'UNDERGRADUATE' | 培养层次 |
| study_duration | INT | 11 | NOT NULL | 4 | 学制年限 |
| degree_type | ENUM | - | NOT NULL | 'BACHELOR' | 学位类型 |

### 关联信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| faculty_id | BIGINT | 20 | NOT NULL | 0 | 所属院系ID |
| faculty_name | VARCHAR | 200 | NOT NULL | '' | 所属院系名称 |
| department | VARCHAR | 200 | NULL | NULL | 所属教研室 |
| parent_major_id | BIGINT | 20 | NULL | NULL | 父专业ID（方向专业） |

### 专业属性字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| major_type | ENUM | - | NOT NULL | 'REGULAR' | 专业类型 |
| enrollment_type | ENUM | - | NOT NULL | 'NATIONAL' | 招生类型 |
| training_mode | ENUM | - | NULL | 'FULL_TIME' | 培养模式 |
| is_key_major | TINYINT | 1 | NOT NULL | 0 | 是否重点专业 |
| is_first_class_major | TINYINT | 1 | NOT NULL | 0 | 是否一流专业 |
| is特色_major | TINYINT | 1 | NOT NULL | 0 | 是否特色专业 |
| is_experimental | TINYINT | 1 | NOT NULL | 0 | 是否实验班 |

### 培养信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| training_objective | TEXT | - | NULL | NULL | 培养目标 |
| core_courses | TEXT | - | NULL | NULL | 核心课程（JSON数组） |
| required_credits | DECIMAL | 5,2 | NULL | 0.00 | 必修学分要求 |
| elective_credits | DECIMAL | 5,2 | NULL | 0.00 | 选修学分要求 |
| total_credits | DECIMAL | 5,2 | NULL | 0.00 | 总学分要求 |
| practice_weeks | INT | 11 | NULL | 0 | 实践周数 |
| graduation_requirements | TEXT | - | NULL | NULL | 毕业要求 |

### 就业信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| employment_direction | TEXT | - | NULL | NULL | 就业方向 |
| employment_rate | DECIMAL | 5,2 | NULL | 0.00 | 就业率 |
| average_salary | DECIMAL | 10,2 | NULL | 0.00 | 平均起薪 |
| top_employers | TEXT | - | NULL | NULL | 主要雇主（JSON数组） |
| industry_distribution | TEXT | - | NULL | NULL | 行业分布（JSON） |

### 统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| current_student_count | INT | 11 | NOT NULL | 0 | 在校学生数 |
| graduate_count | INT | 11 | NOT NULL | 0 | 毕业生总数 |
| enrollment_quota | INT | 11 | NULL | 0 | 招生名额 |
| current_enrollment | INT | 11 | NULL | 0 | 当前招生数 |
| class_count | INT | 11 | NOT NULL | 0 | 班级数量 |
| average_quality_score | DECIMAL | 5,2 | NULL | 0.00 | 平均教学质量评分 |
| satisfaction_rate | DECIMAL | 5,2 | NULL | 0.00 | 学生满意度 |

### 控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| is_active | TINYINT | 1 | NOT NULL | 1 | 是否激活 |
| is_enrolling | TINYINT | 1 | NOT NULL | 1 | 是否招生 |
| status | ENUM | - | NOT NULL | 'ACTIVE' | 专业状态 |
| approval_status | ENUM | - | NULL | 'APPROVED' | 审批状态 |
| approval_date | DATE | - | NULL | NULL | 审批日期 |
| approval_authority | VARCHAR | 200 | NULL | NULL | 审批机关 |

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
UNIQUE KEY uk_major_code (major_code)
UNIQUE KEY uk_faculty_major (faculty_id, major_name)
```

### 外键约束
```sql
FOREIGN KEY (faculty_id) REFERENCES dim_faculty(id) ON DELETE CASCADE
FOREIGN KEY (parent_major_id) REFERENCES dim_major(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_faculty_id (faculty_id)
INDEX idx_major_category (major_category)
INDEX idx_education_level (education_level)
INDEX idx_major_type (major_type)
INDEX idx_is_key_major (is_key_major)
INDEX idx_is_active (is_active)
INDEX idx_status (status)
```

### 检查约束
```sql
CHECK (major_category IN ('UNDERGRADUATE', 'GRADUATE', 'VOCATIONAL', 'CONTINUING'))
CHECK (education_level IN ('UNDERGRADUATE', 'GRADUATE', 'POSTGRADUATE'))
CHECK (degree_type IN ('BACHELOR', 'MASTER', 'DOCTOR', 'DIPLOMA', 'CERTIFICATE'))
CHECK (major_type IN ('REGULAR', 'EXPERIMENTAL', 'INTERNATIONAL', 'COOPERATIVE', 'DUAL_DEGREE'))
CHECK (enrollment_type IN ('NATIONAL', 'INTERNATIONAL', 'COOPERATIVE', 'SELF_FUNDED'))
CHECK (training_mode IN ('FULL_TIME', 'PART_TIME', 'ONLINE', 'HYBRID'))
CHECK (is_key_major IN (0, 1))
CHECK (is_first_class_major IN (0, 1))
CHECK (is_enrolling IN (0, 1))
CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DISCONTINUED', 'MERGED'))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED'))
CHECK (study_duration BETWEEN 1 AND 8)
CHECK (current_student_count >= 0)
CHECK (average_quality_score BETWEEN 0 AND 100)
```

## 枚举值定义

### 专业类别 (major_category)
| 值 | 说明 | 备注 |
|----|------|------|
| UNDERGRADUATE | 本科 | 本科教育专业 |
| GRADUATE | 研究生 | 研究生教育专业 |
| VOCATIONAL | 职业教育 | 职业教育专业 |
| CONTINUING | 继续教育 | 继续教育专业 |

### 培养层次 (education_level)
| 值 | 说明 | 备注 |
|----|------|------|
| UNDERGRADUATE | 本科 | 本科教育层次 |
| GRADUATE | 研究生 | 研究生教育层次 |
| POSTGRADUATE | 研究生 | 研究生教育层次（同上） |

### 学位类型 (degree_type)
| 值 | 说明 | 备注 |
|----|------|------|
| BACHELOR | 学士 | 学士学位 |
| MASTER | 硕士 | 硕士学位 |
| DOCTOR | 博士 | 博士学位 |
| DIPLOMA | 专科 | 专科文凭 |
| CERTIFICATE | 证书 | 结业证书 |

### 专业类型 (major_type)
| 值 | 说明 | 备注 |
|----|------|------|
| REGULAR | 普通专业 | 常规专业 |
| EXPERIMENTAL | 实验专业 | 实验班专业 |
| INTERNATIONAL | 国际专业 | 国际合作专业 |
| COOPERATIVE | 合作专业 | 校企合作专业 |
| DUAL_DEGREE | 双学位 | 双学位专业 |

### 专业状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 正常 | 正常开设 |
| SUSPENDED | 暂停 | 暂停招生 |
| DISCONTINUED | 停办 | 停止开设 |
| MERGED | 合并 | 合并到其他专业 |

## JSON字段格式示例

### 核心课程 (core_courses)
```json
[
  {
    "course_id": 1001,
    "course_code": "CS101",
    "course_name": "计算机基础",
    "credits": 3.0,
    "is_required": true,
    "semester": 1
  },
  {
    "course_id": 1002,
    "course_code": "CS201",
    "course_name": "数据结构",
    "credits": 4.0,
    "is_required": true,
    "semester": 2
  }
]
```

### 主要雇主 (top_employers)
```json
[
  {
    "employer_name": "腾讯科技有限公司",
    "industry": "互联网",
    "percentage": 15.5
  },
  {
    "employer_name": "阿里巴巴集团",
    "industry": "电子商务",
    "percentage": 12.3
  }
]
```

### 行业分布 (industry_distribution)
```json
{
  "互联网": 35.5,
  "金融": 20.2,
  "制造业": 15.8,
  "政府机关": 12.5,
  "教育培训": 8.3,
  "其他": 7.7
}
```

## 关联关系

### 多对一关系（作为从表）
- **Major → Faculty**：专业属于一个院系
- **Major（parent_major_id） → Major**：专业方向关系

### 一对多关系（作为主表）
- **Major → Class**：一个专业包含多个班级
- **Major → Student**：一个专业包含多个学生
- **Major → Course**：一个专业开设多门课程

## 使用示例

### 查询示例

#### 1. 查询院系专业统计
```sql
SELECT
    f.faculty_name,
    COUNT(m.id) as major_count,
    COUNT(CASE WHEN m.is_key_major = 1 THEN 1 END) as key_major_count,
    COUNT(CASE WHEN m.is_first_class_major = 1 THEN 1 END) as first_class_count,
    SUM(m.current_student_count) as total_students,
    AVG(m.average_quality_score) as avg_quality_score
FROM dim_major m
JOIN dim_faculty f ON m.faculty_id = f.id
WHERE m.status = 'ACTIVE'
  AND f.status = 'ACTIVE'
GROUP BY f.faculty_id, f.faculty_name
ORDER BY total_students DESC;
```

#### 2. 查询重点专业信息
```sql
SELECT
    major_name,
    major_type,
    education_level,
    study_duration,
    current_student_count,
    employment_rate,
    average_salary,
    average_quality_score
FROM dim_major
WHERE (is_key_major = 1 OR is_first_class_major = 1)
  AND status = 'ACTIVE'
ORDER BY average_quality_score DESC, employment_rate DESC;
```

#### 3. 查询专业就业情况
```sql
SELECT
    major_name,
    graduate_count,
    employment_rate,
    average_salary,
    satisfaction_rate,
    employment_direction
FROM dim_major
WHERE status = 'ACTIVE'
  AND graduate_count > 0
ORDER BY employment_rate DESC, average_salary DESC;
```

#### 4. 查询专业招生情况
```sql
SELECT
    major_name,
    education_level,
    enrollment_quota,
    current_enrollment,
    current_student_count,
    ROUND(current_enrollment * 100.0 / NULLIF(enrollment_quota, 0), 2) as enrollment_rate,
    is_enrolling
FROM dim_major
WHERE is_enrolling = 1
  AND status = 'ACTIVE'
ORDER BY enrollment_rate DESC;
```

### 插入示例

#### 1. 创建本科专业
```sql
INSERT INTO dim_major (
    major_code, major_name, major_name_en,
    major_category, discipline_category, education_level,
    study_duration, degree_type,
    faculty_id, faculty_name,
    training_objective, required_credits, total_credits,
    is_key_major, is_enrolling,
    create_by
) VALUES (
    '080902', '软件工程', 'Software Engineering',
    'UNDERGRADUATE', '工学', 'UNDERGRADUATE',
    4, 'BACHELOR',
    1, '计算机学院',
    '培养具备软件工程理论基础和实践能力的高级软件人才',
    120.0, 160.0,
    1, 1,
    1
);
```

### 更新示例

#### 1. 更新专业统计信息
```sql
UPDATE dim_major m
SET current_student_count = (
    SELECT COUNT(*)
    FROM dim_class c
    JOIN dim_user u ON c.id = u.class_id
    WHERE c.major_id = m.id
      AND u.status = 'ACTIVE'
),
class_count = (
    SELECT COUNT(*)
    FROM dim_class c
    WHERE c.major_id = m.id
      AND c.status = 'ACTIVE'
),
update_time = NOW()
WHERE m.id = 1001;
```

#### 2. 更新就业数据
```sql
UPDATE dim_major
SET employment_rate = 95.8,
    average_salary = 8500.00,
    employment_direction = '软件开发、系统架构、项目管理、技术顾问',
    update_time = NOW()
WHERE major_code = '080902';
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：专业编码必须唯一
2. **完整性检查**：院系、专业名称等关键字段不能为空
3. **逻辑检查**：学制年限必须符合培养层次要求
4. **关联检查**：院系ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的专业定义
2. **代码标准化**：统一专业编码格式
3. **层次修正**：修正专业培养层次
4. **统计修正**：更新学生数量等统计数据

## 性能优化

### 索引优化
- 专业编码建立唯一索引
- 院系ID建立索引支持分组统计
- 专业类别建立索引支持分类查询

### 查询优化
- 使用覆盖索引优化统计查询
- 避免大字段的全表扫描
- 合理使用JSON函数

### 存储优化
- JSON字段合理设计结构
- 定期更新统计字段
- 避免频繁的专业信息变更

## 扩展说明

### 未来扩展方向
1. **专业认证**：增加专业认证信息
2. **课程体系**：完善专业课程体系
3. **培养方案**：详细的培养方案管理
4. **国际认证**：国际专业认证对接

### 兼容性说明
- 支持与国家专业目录对接
- 支持教育部专业标准
- 支持专业评估标准

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*