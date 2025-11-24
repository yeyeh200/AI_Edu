# 课程分类实体 (CourseCategory)

---

**实体编号：** DM-COURSE-002
**实体名称：** 课程分类实体
**所属域：** 教学资源域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

课程分类实体是AI助评应用课程管理的分类实体，定义了课程的分类体系和层次结构。该实体支持多层级分类管理，为课程组织、统计分析、质量评估等业务提供分类依据。

## 实体定义

### 表名
- **物理表名：** `dim_course_category`
- **业务表名：** 课程分类表
- **数据类型：** 维度表

### 主要用途
- 定义课程分类体系
- 支持多层级分类结构
- 提供课程分类查询
- 支持分类统计分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 分类唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| category_code | VARCHAR | 50 | NOT NULL | '' | 分类编码（系统唯一） |
| category_name | VARCHAR | 100 | NOT NULL | '' | 分类名称 |
| category_display_name | VARCHAR | 200 | NOT NULL | '' | 分类显示名称 |
| category_description | TEXT | - | NULL | NULL | 分类描述 |
| category_icon | VARCHAR | 100 | NULL | NULL | 分类图标 |
| category_color | VARCHAR | 20 | NULL | NULL | 分类颜色（十六进制） |

### 层级关系字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| parent_id | BIGINT | 20 | NULL | NULL | 父分类ID |
| category_path | VARCHAR | 500 | NOT NULL | '' | 分类路径（如：1/2/3） |
| category_level | INT | 11 | NOT NULL | 1 | 分类层级（1-5级） |
| sort_order | INT | 11 | NOT NULL | 0 | 排序顺序 |
| is_leaf | TINYINT | 1 | NOT NULL | 1 | 是否叶子节点 |

### 分类属性字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| category_type | ENUM | - | NOT NULL | 'ACADEMIC' | 分类类型 |
| subject_area | VARCHAR | 100 | NULL | NULL | 学科领域 |
| education_level | ENUM | - | NULL | 'UNDERGRADUATE' | 教育层次 |
| course_nature | ENUM | - | NULL | 'THEORY' | 课程性质 |
| difficulty_level | ENUM | - | NULL | 'MEDIUM' | 难度等级 |

### 统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| course_count | INT | 11 | NOT NULL | 0 | 课程数量 |
| active_course_count | INT | 11 | NOT NULL | 0 | 活跃课程数量 |
| student_count | INT | 11 | NOT NULL | 0 | 学生数量（累计） |
| teacher_count | INT | 11 | NOT NULL | 0 | 教师数量（累计） |

### 控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| is_system | TINYINT | 1 | NOT NULL | 0 | 是否系统分类 |
| is_required | TINYINT | 1 | NOT NULL | 0 | 是否必修分类 |
| is_elective | TINYINT | 1 | NOT NULL | 0 | 是否选修分类 |
| status | ENUM | - | NOT NULL | 'ACTIVE' | 分类状态 |

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
UNIQUE KEY uk_category_code (category_code)
UNIQUE KEY uk_parent_name (parent_id, category_name)
```

### 普通索引
```sql
INDEX idx_parent_id (parent_id)
INDEX idx_category_path (category_path)
INDEX idx_category_level (category_level)
INDEX idx_category_type (category_type)
INDEX idx_status (status)
INDEX idx_sort_order (sort_order)
```

### 检查约束
```sql
CHECK (category_level BETWEEN 1 AND 5)
CHECK (is_leaf IN (0, 1))
CHECK (category_type IN ('ACADEMIC', 'PRACTICE', 'GENERAL', 'SPECIAL'))
CHECK (education_level IN ('UNDERGRADUATE', 'GRADUATE', 'POSTGRADUATE', 'ALL'))
CHECK (course_nature IN ('THEORY', 'PRACTICE', 'THEORY_PRACTICE', 'ALL'))
CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD', 'ALL'))
CHECK (is_system IN (0, 1))
CHECK (is_required IN (0, 1))
CHECK (is_elective IN (0, 1))
CHECK (status IN ('ACTIVE', 'INACTIVE', 'DEPRECATED'))
CHECK (course_count >= 0)
CHECK (active_course_count >= 0)
```

## 枚举值定义

### 分类类型 (category_type)
| 值 | 说明 | 备注 |
|----|------|------|
| ACADEMIC | 学术分类 | 按学科分类 |
| PRACTICE | 实践分类 | 按实践类型分类 |
| GENERAL | 通用分类 | 通用课程分类 |
| SPECIAL | 特殊分类 | 特殊课程分类 |

### 教育层次 (education_level)
| 值 | 说明 | 备注 |
|----|------|------|
| UNDERGRADUATE | 本科 | 本科教育层次 |
| GRADUATE | 研究生 | 研究生教育层次 |
| POSTGRADUATE | 研究生 | 研究生教育层次（同上） |
| ALL | 全部 | 适用于所有层次 |

### 课程性质 (course_nature)
| 值 | 说明 | 备注 |
|----|------|------|
| THEORY | 理论 | 理论课程分类 |
| PRACTICE | 实践 | 实践课程分类 |
| THEORY_PRACTICE | 理论实践 | 理论实践结合 |
| ALL | 全部 | 适用于所有性质 |

### 难度等级 (difficulty_level)
| 值 | 说明 | 备注 |
|----|------|------|
| EASY | 简单 | 基础课程分类 |
| MEDIUM | 中等 | 中级课程分类 |
| HARD | 困难 | 高级课程分类 |
| ALL | 全部 | 适用于所有难度 |

### 分类状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 激活 | 分类正常使用 |
| INACTIVE | 未激活 | 分类暂时停用 |
| DEPRECATED | 已废弃 | 分类已废弃 |

## 课程分类体系

### 一级分类（学科大类）
1. **公共基础课 (PUBLIC_BASIC)**
   - 思想政治类
   - 大学外语类
   - 体育健康类
   - 计算机基础类
   - 数学基础类

2. **专业基础课 (PROFESSIONAL_BASIC)**
   - 专业导论类
   - 专业基础理论类
   - 专业基础技能类
   - 学科基础类

3. **专业核心课 (PROFESSIONAL_CORE)**
   - 专业理论类
   - 专业技能类
   - 专业实践类
   - 专业设计类

4. **专业拓展课 (PROFESSIONAL_EXTEND)**
   - 专业选修类
   - 跨专业选修类
   - 创新创业类
   - 学科前沿类

5. **实践教学环节 (PRACTICE_TEACHING)**
   - 认识实习
   - 生产实习
   - 毕业设计
   - 社会实践
   - 实验实训

### 二级分类示例

#### 公共基础课子分类
1. **思想政治类**
   - 马克思主义基本原理
   - 毛泽东思想和中国特色社会主义理论
   - 思想道德修养与法律基础
   - 中国近现代史纲要
   - 形势与政策

2. **大学外语类**
   - 大学英语
   - 大学日语
   - 大学德语
   - 大学法语
   - 专业外语

#### 专业基础课子分类
1. **专业导论类**
   - 专业导论
   - 学科概论
   - 行业认知
   - 职业规划

2. **专业基础理论类**
   - 专业基础理论
   - 专业基础方法
   - 专业基础知识
   - 专业基础技能

## 关联关系

### 一对多关系（作为主表）
- **CourseCategory → Course**：一个分类包含多门课程

### 多对一关系（作为从表）
- **CourseCategory（parent_id） ← CourseCategory**：支持无限层级分类

### 自关联关系
- **parent_id**：指向自身，支持树形结构

## 使用示例

### 查询示例

#### 1. 查询完整分类树
```sql
WITH RECURSIVE category_tree AS (
    SELECT
        id, category_code, category_name, parent_id,
        category_level, sort_order, 0 as depth
    FROM dim_course_category
    WHERE parent_id IS NULL
      AND status = 'ACTIVE'

    UNION ALL

    SELECT
        c.id, c.category_code, c.category_name, c.parent_id,
        c.category_level, c.sort_order, ct.depth + 1
    FROM dim_course_category c
    JOIN category_tree ct ON c.parent_id = ct.id
    WHERE c.status = 'ACTIVE'
)
SELECT
    category_code,
    category_name,
    category_level,
    depth,
    REPEAT('  ', depth) || category_name as display_name,
    course_count,
    active_course_count
FROM category_tree
ORDER BY category_level, sort_order;
```

#### 2. 查询指定分类的子分类
```sql
SELECT
    id, category_code, category_name,
    category_level, sort_order,
    course_count, active_course_count
FROM dim_course_category
WHERE parent_id = 1001
  AND status = 'ACTIVE'
ORDER BY sort_order;
```

#### 3. 查询分类统计信息
```sql
SELECT
    c1.category_name as first_level,
    c2.category_name as second_level,
    c1.course_count as first_level_courses,
    c2.course_count as second_level_courses,
    c1.student_count as first_level_students
FROM dim_course_category c1
LEFT JOIN dim_course_category c2 ON c2.parent_id = c1.id
WHERE c1.parent_id IS NULL
  AND c1.status = 'ACTIVE'
ORDER BY c1.sort_order, c2.sort_order;
```

#### 4. 查询课程的分类路径
```sql
SELECT
    c.course_name,
    cc.category_path,
    cc.category_level,
    cc.category_display_name
FROM dim_course c
JOIN dim_course_category cc ON c.category_id = cc.id
WHERE c.course_code = 'CS2023001';
```

### 插入示例

#### 1. 创建一级分类
```sql
INSERT INTO dim_course_category (
    category_code, category_name, category_display_name,
    category_description, category_type,
    parent_id, category_path, category_level,
    is_leaf, is_system,
    create_by
) VALUES (
    'PROFESSIONAL_CORE',
    '专业核心课',
    '专业核心课程',
    '各专业的核心理论和技能课程',
    'ACADEMIC',
    NULL,
    '1001',
    1,
    0, 1,
    1
);
```

#### 2. 创建二级分类
```sql
INSERT INTO dim_course_category (
    category_code, category_name, category_display_name,
    category_description, category_type,
    parent_id, category_path, category_level,
    category_type, education_level,
    is_leaf, sort_order,
    create_by
) VALUES (
    'PROFESSIONAL_THEORY',
    '专业理论类',
    '专业理论课程',
    '各专业的理论教学课程',
    'ACADEMIC',
    1001,
    '1001/1002',
    2,
    'ACADEMIC',
    'UNDERGRADUATE',
    0, 1,
    1
);
```

### 更新示例

#### 1. 更新分类统计信息
```sql
UPDATE dim_course_category cc
SET course_count = (
    SELECT COUNT(*)
    FROM dim_course c
    WHERE c.category_id = cc.id
      AND c.status = 'ACTIVE'
),
active_course_count = (
    SELECT COUNT(*)
    FROM dim_course c
    WHERE c.category_id = cc.id
      AND c.status = 'ACTIVE'
      AND c.is_approved = 1
),
update_time = NOW()
WHERE id = 1002;
```

#### 2. 更新分类路径
```sql
UPDATE dim_course_category
SET category_path = (
    SELECT CASE
        WHEN parent.category_path = '' THEN CAST(id AS CHAR)
        ELSE CONCAT(parent.category_path, '/', id)
    END
    FROM dim_course_category parent
    WHERE parent.id = dim_course_category.parent_id
),
update_time = NOW()
WHERE parent_id IS NOT NULL;
```

## 数据质量

### 质量检查规则
1. **完整性检查**：分类编码、名称不能为空
2. **唯一性检查**：同一父分类下分类名称不能重复
3. **层级检查**：分类层级不能超过5级
4. **循环检查**：不能出现循环引用

### 数据清洗规则
1. **重复数据处理**：合并重复的分类定义
2. **层级修正**：修复分类层级关系
3. **路径修正**：更新分类路径信息
4. **统计修正**：修正课程数量统计

## 性能优化

### 索引优化
- 父分类ID建立索引支持层级查询
- 分类路径建立索引支持路径查询
- 分类级别建立索引支持层级过滤

### 查询优化
- 使用递归CTE查询分类树
- 避免过深的分类层级查询
- 合理使用索引和排序

### 存储优化
- 分类路径使用字符串存储
- 统计字段定期更新
- 避免频繁的树形结构重组

## 扩展说明

### 未来扩展方向
1. **多维度分类**：支持多维度分类体系
2. **标签分类**：增加课程标签分类
3. **动态分类**：支持动态分类规则
4. **分类推荐**：基于分类的课程推荐

### 兼容性说明
- 支持国家课程分类标准
- 支持学科分类标准对接
- 支持自定义分类体系

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*