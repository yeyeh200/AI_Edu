# 课程信息实体 (Course)

---

**实体编号：** DM-COURSE-001
**实体名称：** 课程信息实体
**所属域：** 教学资源域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

课程信息实体是AI助评应用教学管理的核心实体，存储课程的基本信息、分类、属性和状态等。该实体整合了职教云平台和教务系统的课程数据，为教学质量评价、课程安排、教学分析等业务提供基础数据支撑。

## 实体定义

### 表名
- **物理表名：** `dim_course`
- **业务表名：** 课程信息表
- **数据类型：** 维度表

### 主要用途
- 统一课程信息管理
- 支持课程分类管理
- 提供课程基础数据
- 支持课程统计分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 课程唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| course_code | VARCHAR | 50 | NOT NULL | '' | 课程编号（系统内唯一） |
| course_no | VARCHAR | 30 | NULL | NULL | 原始课程编号 |
| course_name | VARCHAR | 200 | NOT NULL | '' | 课程名称 |
| course_name_en | VARCHAR | 300 | NULL | NULL | 课程英文名称 |
| course_alias | VARCHAR | 100 | NULL | NULL | 课程别名/简称 |

### 分类信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| category_id | BIGINT | 20 | NULL | NULL | 课程分类ID |
| category_name | VARCHAR | 100 | NULL | NULL | 课程分类名称 |
| course_type | ENUM | - | NOT NULL | 'REQUIRED' | 课程类型 |
| course_nature | ENUM | - | NOT NULL | 'THEORY' | 课程性质 |
| difficulty_level | ENUM | - | NULL | 'MEDIUM' | 难度等级 |
| credit_hours | DECIMAL | 4,1 | NULL | NULL | 学分 |
| theory_hours | INT | 11 | NULL | 0 | 理论学时 |
| practice_hours | INT | 11 | NULL | 0 | 实践学时 |
| total_hours | INT | 11 | NULL | 0 | 总学时 |

### 开课信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| faculty_id | BIGINT | 20 | NULL | NULL | 开课院系ID |
| faculty_name | VARCHAR | 200 | NULL | NULL | 开课院系名称 |
| major_id | BIGINT | 20 | NULL | NULL | 开课专业ID |
| major_name | VARCHAR | 200 | NULL | NULL | 开课专业名称 |
| target_grade | VARCHAR | 20 | NULL | NULL | 目标年级 |
| target_majors | TEXT | - | NULL | NULL | 适用专业（JSON数组） |

### 属性信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| course_description | TEXT | - | NULL | NULL | 课程描述 |
| course_objective | TEXT | - | NULL | NULL | 课程目标 |
| prerequisite_courses | TEXT | - | NULL | NULL | 先修课程（JSON数组） |
| textbook_info | TEXT | - | NULL | NULL | 教材信息 |
| assessment_method | ENUM | - | NULL | 'NORMAL' | 考核方式 |
| is_online_course | TINYINT | 1 | NOT NULL | 0 | 是否在线课程 |
| is_bilingual_course | TINYINT | 1 | NOT NULL | 0 | 是否双语课程 |
| is_first_class_course | TINYINT | 1 | NOT NULL | 0 | 是否一流课程 |

### 状态信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| status | ENUM | - | NOT NULL | 'ACTIVE' | 课程状态 |
| is_approved | TINYINT | 1 | NOT NULL | 0 | 是否已审核 |
| approved_by | BIGINT | 20 | NULL | NULL | 审核人ID |
| approved_time | DATETIME | - | NULL | NULL | 审核时间 |
| is_deleted | TINYINT | 1 | NOT NULL | 0 | 是否删除（逻辑删除） |

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
UNIQUE KEY uk_course_code (course_code)
```

### 普通索引
```sql
INDEX idx_course_name (course_name)
INDEX idx_category_id (category_id)
INDEX idx_course_type (course_type)
INDEX idx_faculty_id (faculty_id)
INDEX idx_major_id (major_id)
INDEX idx_status (status)
INDEX idx_is_approved (is_approved)
INDEX idx_create_time (create_time)
```

### 检查约束
```sql
CHECK (course_type IN ('REQUIRED', 'ELECTIVE', 'PRACTICE', 'INTERNSHIP'))
CHECK (course_nature IN ('THEORY', 'PRACTICE', 'THEORY_PRACTICE'))
CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD'))
CHECK (assessment_method IN ('NORMAL', 'EXAM', 'PRACTICE', 'THESIS', 'DESIGN'))
CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'))
CHECK (is_approved IN (0, 1))
CHECK (is_deleted IN (0, 1))
CHECK (is_online_course IN (0, 1))
CHECK (is_bilingual_course IN (0, 1))
CHECK (is_first_class_course IN (0, 1))
CHECK (source_system IN ('EDU', 'ZJY', 'MANUAL', 'MERGE'))
CHECK (sync_status IN ('SYNCED', 'PENDING', 'FAILED'))
```

## 枚举值定义

### 课程类型 (course_type)
| 值 | 说明 | 备注 |
|----|------|------|
| REQUIRED | 必修课 | 专业必修课程 |
| ELECTIVE | 选修课 | 专业选修课程 |
| PRACTICE | 实践课 | 实践教学课程 |
| INTERNSHIP | 实习课 | 顶岗实习课程 |

### 课程性质 (course_nature)
| 值 | 说明 | 备注 |
|----|------|------|
| THEORY | 理论课 | 纯理论教学 |
| PRACTICE | 实践课 | 纯实践教学 |
| THEORY_PRACTICE | 理论实践课 | 理论与实践结合 |

### 难度等级 (difficulty_level)
| 值 | 说明 | 备注 |
|----|------|------|
| EASY | 简单 | 基础课程 |
| MEDIUM | 中等 | 中级课程 |
| HARD | 困难 | 高级课程 |

### 考核方式 (assessment_method)
| 值 | 说明 | 备注 |
|----|------|------|
| NORMAL | 平时考核 | 平时成绩为主 |
| EXAM | 考试 | 期末考试 |
| PRACTICE | 实践考核 | 实践操作考核 |
| THESIS | 论文 | 课程论文 |
| DESIGN | 设计 | 课程设计 |

### 课程状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 正常开课 | 正常开设课程 |
| INACTIVE | 暂停开课 | 暂时停止开课 |
| SUSPENDED | 停开 | 停止开课 |
| DELETED | 已删除 | 已删除课程 |

### 数据来源系统 (source_system)
| 值 | 说明 | 备注 |
|----|------|------|
| EDU | 教务系统 | 来自教务系统 |
| ZJY | 职教云 | 来自职教云平台 |
| MANUAL | 手动录入 | 手动添加 |
| MERGE | 数据合并 | 多系统合并 |

## 关联关系

### 一对多关系（作为主表）
- **Course → Schedule**：一门课程可以有多个安排
- **Course → TeachingActivity**：一门课程有多个教学活动
- **Course → Assignment**：一门课程有多个作业
- **Course → Exam**：一门课程有多个考试
- **Course → EvaluationRecord**：一门课程有多个评价记录

### 多对一关系（作为从表）
- **Course ← CourseCategory**：课程属于一个分类
- **Course ← Faculty**：课程属于一个院系
- **Course ← Major**：课程属于一个专业

### 多对多关系
- **Course ↔ Teacher**：课程与教师多对多关系（通过授课表）
- **Course ↔ Student**：课程与学生多对多关系（通过选课表）

## 课程分类体系

### 一级分类
1. **公共基础课**
   - 思想政治类
   - 大学外语类
   - 体育健康类
   - 计算机基础类

2. **专业基础课**
   - 专业导论类
   - 专业基础理论类
   - 专业基础技能类

3. **专业核心课**
   - 专业理论类
   - 专业技能类
   - 专业实践类

4. **专业拓展课**
   - 专业选修类
   - 跨专业选修类
   - 创新创业类

5. **实践教学环节**
   - 认识实习
   - 生产实习
   - 毕业设计
   - 社会实践

## 使用示例

### 查询示例

#### 1. 查询指定院系的课程统计
```sql
SELECT
    faculty_name,
    COUNT(*) as total_courses,
    COUNT(CASE WHEN course_type = 'REQUIRED' THEN 1 END) as required_courses,
    COUNT(CASE WHEN course_type = 'ELECTIVE' THEN 1 END) as elective_courses,
    SUM(credit_hours) as total_credits
FROM dim_course
WHERE faculty_id = 1001
  AND status = 'ACTIVE'
  AND is_deleted = 0
GROUP BY faculty_name;
```

#### 2. 查询一流课程信息
```sql
SELECT
    course_code,
    course_name,
    faculty_name,
    course_type,
    credit_hours,
    difficulty_level
FROM dim_course
WHERE is_first_class_course = 1
  AND status = 'ACTIVE'
  AND is_deleted = 0
ORDER BY faculty_name, course_name;
```

#### 3. 查询课程先修关系
```sql
SELECT
    c1.course_name as course_name,
    c2.course_name as prerequisite_name
FROM dim_course c1
JOIN dim_course c2 ON JSON_CONTAINS(c1.prerequisite_courses, JSON_QUOTE(c2.course_code))
WHERE c1.status = 'ACTIVE'
  AND c1.is_deleted = 0
ORDER BY c1.course_name;
```

#### 4. 查询课程开课情况
```sql
SELECT
    course_name,
    COUNT(DISTINCT s.semester_id) as open_semesters,
    COUNT(DISTINCT s.teacher_id) as teacher_count,
    COUNT(DISTINCT s.class_id) as class_count
FROM dim_course c
LEFT JOIN fact_schedule s ON c.id = s.course_id
WHERE c.status = 'ACTIVE'
  AND c.is_deleted = 0
GROUP BY c.id, c.course_name
HAVING COUNT(DISTINCT s.semester_id) > 0
ORDER BY open_semesters DESC;
```

### 插入示例

#### 1. 新增课程
```sql
INSERT INTO dim_course (
    course_code, course_name, course_name_en, category_id, category_name,
    course_type, course_nature, difficulty_level, credit_hours,
    theory_hours, practice_hours, total_hours,
    faculty_id, faculty_name, major_id, major_name,
    course_description, course_objective,
    assessment_method, is_approved, create_by
) VALUES (
    'CS2023001', '数据结构与算法', 'Data Structures and Algorithms', 3001, '专业核心课',
    'REQUIRED', 'THEORY_PRACTICE', 'MEDIUM', 4.0,
    48, 16, 64,
    1001, '计算机学院', 2001, '软件工程',
    '本课程主要介绍常用数据结构和算法的设计与分析方法', '掌握基本数据结构和算法设计能力',
    'EXAM', 1, 1
);
```

### 更新示例

#### 1. 更新课程审核状态
```sql
UPDATE dim_course
SET is_approved = 1,
    approved_by = 1001,
    approved_time = NOW(),
    update_time = NOW(),
    version = version + 1
WHERE course_code = 'CS2023001';
```

#### 2. 更新课程一流课程标识
```sql
UPDATE dim_course
SET is_first_class_course = 1,
    update_time = NOW(),
    update_by = 1,
    version = version + 1
WHERE id IN (1001, 1002, 1003);
```

## 数据质量

### 质量检查规则
1. **完整性检查**：课程编号、名称不能为空
2. **唯一性检查**：课程编号必须唯一
3. **一致性检查**：学时、学分数据逻辑一致
4. **关联检查**：院系、专业ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复课程记录
2. **异常数据处理**：处理异常的学时学分数据
3. **标准化处理**：统一课程名称和编号格式
4. **补全数据**：补全缺失的课程分类信息

## 性能优化

### 索引优化
- 课程编号建立唯一索引
- 课程名称建立全文索引（如需要）
- 分类、院系、专业建立普通索引
- 状态字段建立索引

### 查询优化
- 使用覆盖索引优化常用查询
- 避免SELECT *，只查询必要字段
- 合理使用分页查询

### 存储优化
- JSON字段使用合理的存储格式
- 长文本字段考虑压缩存储
- 定期清理已删除课程数据

## 业务规则

### 课程编号规则
- 格式：学院代码 + 专业代码 + 序号 + 年份
- 示例：CS01SE2023001（计算机学院软件工程专业2023年第1门课）

### 学时分配规则
- 理论课：理论学时 >= 总学时的80%
- 实践课：实践学时 >= 总学时的80%
- 理论实践课：理论学时和实践学时比例在3:7到7:3之间

### 审核流程
1. 新增课程默认未审核状态
2. 需要院系管理员审核
3. 审核通过后方可正式开课
4. 审核记录保存在日志中

## 扩展说明

### 未来扩展方向
1. **课程版本管理**：支持课程多版本管理
2. **课程标签体系**：增加课程标签和关键词
3. **课程资源关联**：关联课程资源和教材
4. **课程评价体系**：增加课程评价和反馈

### 兼容性说明
- 支持与教务系统课程数据同步
- 支持与职教云平台课程映射
- 支持国家课程标准对接

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*