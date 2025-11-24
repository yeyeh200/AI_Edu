# 院系信息实体 (Faculty)

---

**实体编号：** DM-COURSE-004
**实体名称：** 院系信息实体
**所属域：** 教学资源域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

院系信息实体是AI助评应用组织架构管理的核心实体，定义了学校的教学组织结构。该实体支持多级院系管理，存储院系的基本信息、负责人、联系方式等，为教学管理、质量评估、统计分析等提供组织维度支撑。

## 实体定义

### 表名
- **物理表名：** `dim_faculty`
- **业务表名：** 院系信息表
- **数据类型：** 维度表

### 主要用途
- 定义教学组织架构
- 支持多级院系管理
- 提供院统计分析
- 支持组织结构管理

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 院系记录唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| faculty_code | VARCHAR | 50 | NOT NULL | '' | 院系编码（系统唯一） |
| faculty_name | VARCHAR | 200 | NOT NULL | '' | 院系名称 |
| faculty_name_en | VARCHAR | 300 | NULL | NULL | 院系英文名称 |
| faculty_short_name | VARCHAR | 50 | NULL | NULL | 院系简称 |
| faculty_type | ENUM | - | NOT NULL | 'ACADEMIC' | 院系类型 |
| establishment_date | DATE | - | NULL | NULL | 建院日期 |

### 层级关系字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| parent_id | BIGINT | 20 | NULL | NULL | 上级院系ID |
| faculty_level | INT | 11 | NOT NULL | 1 | 院系层级（1-3级） |
| faculty_path | VARCHAR | 500 | NOT NULL | '' | 院系路径（如：1/2/3） |
| sort_order | INT | 11 | NOT NULL | 0 | 排序顺序 |
| is_leaf | TINYINT | 1 | NOT NULL | 1 | 是否叶子节点 |

### 负责人信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| dean_id | BIGINT | 20 | NULL | NULL | 院系负责人ID |
| dean_name | VARCHAR | 100 | NULL | NULL | 院系负责人姓名 |
| dean_phone | VARCHAR | 20 | NULL | NULL | 院系负责人电话 |
| dean_email | VARCHAR | 100 | NULL | NULL | 院系负责人邮箱 |
| vice_dean_id | BIGINT | 20 | NULL | NULL | 副负责人ID |
| vice_dean_name | VARCHAR | 100 | NULL | NULL | 副负责人姓名 |
| secretary_id | BIGINT | 20 | NULL | NULL | 行政秘书ID |
| secretary_name | VARCHAR | 100 | NULL | NULL | 行政秘书姓名 |

### 联系方式字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| office_address | VARCHAR | 300 | NULL | NULL | 办公地址 |
| office_phone | VARCHAR | 50 | NULL | NULL | 办公电话 |
| fax_number | VARCHAR | 20 | NULL | NULL | 传真号码 |
| website_url | VARCHAR | 200 | NULL | NULL | 官方网站 |
| email_address | VARCHAR | 100 | NULL | NULL | 院系邮箱 |
| zip_code | VARCHAR | 10 | NULL | NULL | 邮政编码 |

### 统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teacher_count | INT | 11 | NOT NULL | 0 | 教师人数 |
| student_count | INT | 11 | NOT NULL | 0 | 学生人数 |
| class_count | INT | 11 | NOT NULL | 0 | 班级数量 |
| major_count | INT | 11 | NOT NULL | 0 | 专业数量 |
| course_count | INT | 11 | NOT NULL | 0 | 开设课程数 |
| research_project_count | INT | 11 | NULL | 0 | 科研项目数 |
| publication_count | INT | 11 | NULL | 0 | 发表论文数 |
| average_quality_score | DECIMAL | 5,2 | NULL | 0.00 | 平均教学质量评分 |

### 控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| is_active | TINYINT | 1 | NOT NULL | 1 | 是否激活 |
| is_key_faculty | TINYINT | 1 | NOT NULL | 0 | 是否重点院系 |
| is_teaching_unit | TINYINT | 1 | NOT NULL | 1 | 是否教学单位 |
| is_research_unit | TINYINT | 1 | NOT NULL | 0 | 是否科研单位 |
| status | ENUM | - | NOT NULL | 'ACTIVE' | 院系状态 |

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
UNIQUE KEY uk_faculty_code (faculty_code)
UNIQUE KEY uk_parent_name (parent_id, faculty_name)
```

### 外键约束
```sql
FOREIGN KEY (parent_id) REFERENCES dim_faculty(id) ON DELETE SET NULL
FOREIGN KEY (dean_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (vice_dean_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (secretary_id) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_parent_id (parent_id)
INDEX idx_faculty_level (faculty_level)
INDEX idx_faculty_path (faculty_path)
INDEX idx_faculty_type (faculty_type)
INDEX idx_is_active (is_active)
INDEX idx_status (status)
INDEX idx_sort_order (sort_order)
```

### 检查约束
```sql
CHECK (faculty_type IN ('ACADEMIC', 'ADMINISTRATIVE', 'RESEARCH', 'SUPPORT'))
CHECK (faculty_level BETWEEN 1 AND 3)
CHECK (is_leaf IN (0, 1))
CHECK (is_active IN (0, 1))
CHECK (is_key_faculty IN (0, 1))
CHECK (is_teaching_unit IN (0, 1))
CHECK (is_research_unit IN (0, 1))
CHECK (status IN ('ACTIVE', 'INACTIVE', 'MERGED', 'DISBANDED'))
CHECK (teacher_count >= 0)
CHECK (student_count >= 0)
CHECK (average_quality_score BETWEEN 0 AND 100)
```

## 枚举值定义

### 院系类型 (faculty_type)
| 值 | 说明 | 备注 |
|----|------|------|
| ACADEMIC | 教学院系 | 教学单位 |
| ADMINISTRATIVE | 行政部门 | 行政管理单位 |
| RESEARCH | 科研机构 | 研究院所 |
| SUPPORT | 支撑单位 | 教辅部门 |

### 院系状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 正常 | 正常运行状态 |
| INACTIVE | 未激活 | 暂停运行 |
| MERGED | 合并 | 已合并到其他院系 |
| DISBANDED | 撤销 | 已撤销 |

## 院系层级结构

### 一级院系（学院级别）
1. **计算机学院**
2. **电子信息工程学院**
3. **机械工程学院**
4. **经济管理学院**
5. **外国语学院**
6. **理学院**
7. **人文社会科学学院**
8. **艺术设计学院**
9. **继续教育学院**
10. **国际教育学院**

### 二级院系（系/研究所级别）
以计算机学院为例：
1. **软件工程系**
2. **计算机科学系**
3. **网络工程系**
4. **人工智能系**
5. **数据科学系**

### 三级院系（教研室/实验室级别）
以软件工程系为例：
1. **软件理论教研室**
2. **软件工程教研室**
3. **软件测试实验室**
4. **软件开发实验室**

## 关联关系

### 自关联关系
- **Faculty（parent_id） → Faculty**：支持无限层级院系结构

### 一对多关系（作为主表）
- **Faculty → Major**：一个院系包含多个专业
- **Faculty → Class**：一个院系包含多个班级
- **Faculty → Teacher**：一个院系包含多个教师
- **Faculty → Course**：一个院系开设多门课程

### 一对多关系（作为从表）
- **Faculty（parent_id） ← Faculty**：下级院系属于上级院系

## 使用示例

### 查询示例

#### 1. 查询完整院系树
```sql
WITH RECURSIVE faculty_tree AS (
    SELECT
        id, faculty_code, faculty_name, parent_id,
        faculty_level, sort_order, 0 as depth
    FROM dim_faculty
    WHERE parent_id IS NULL
      AND status = 'ACTIVE'

    UNION ALL

    SELECT
        f.id, f.faculty_code, f.faculty_name, f.parent_id,
        f.faculty_level, f.sort_order, ft.depth + 1
    FROM dim_faculty f
    JOIN faculty_tree ft ON f.parent_id = ft.id
    WHERE f.status = 'ACTIVE'
)
SELECT
    faculty_code,
    faculty_name,
    faculty_level,
    depth,
    REPEAT('  ', depth) || faculty_name as display_name,
    teacher_count,
    student_count,
    is_key_faculty
FROM faculty_tree
ORDER BY faculty_level, sort_order;
```

#### 2. 查询院系教学统计
```sql
SELECT
    faculty_name,
    teacher_count,
    student_count,
    class_count,
    major_count,
    course_count,
    average_quality_score,
    ROUND(student_count / NULLIF(teacher_count, 0), 2) as student_teacher_ratio
FROM dim_faculty
WHERE is_teaching_unit = 1
  AND status = 'ACTIVE'
  AND faculty_level = 1
ORDER BY average_quality_score DESC;
```

#### 3. 查询重点院系
```sql
SELECT
    faculty_name,
    dean_name,
    teacher_count,
    student_count,
    research_project_count,
    publication_count,
    average_quality_score
FROM dim_faculty
WHERE is_key_faculty = 1
  AND status = 'ACTIVE'
ORDER BY average_quality_score DESC, research_project_count DESC;
```

#### 4. 查询院系负责人信息
```sql
SELECT
    f.faculty_name,
    f.faculty_type,
    f.dean_name,
    f.dean_phone,
    f.dean_email,
    f.vice_dean_name,
    f.secretary_name,
    f.office_address,
    f.office_phone
FROM dim_faculty f
WHERE f.status = 'ACTIVE'
  AND f.faculty_level = 1
ORDER BY f.sort_order;
```

### 插入示例

#### 1. 创建一级院系
```sql
INSERT INTO dim_faculty (
    faculty_code, faculty_name, faculty_name_en,
    faculty_type, establishment_date,
    parent_id, faculty_level, faculty_path,
    is_teaching_unit, is_research_unit,
    dean_id, dean_name, dean_phone,
    office_address, office_phone,
    create_by
) VALUES (
    'CS', '计算机学院', 'School of Computer Science',
    'ACADEMIC', '2000-09-01',
    NULL, 1, '1',
    1, 1,
    12345, '李院长', '13800138000',
    '计算机楼A座', '010-12345678',
    1
);
```

#### 2. 创建二级院系
```sql
INSERT INTO dim_faculty (
    faculty_code, faculty_name, faculty_type,
    parent_id, faculty_level, faculty_path,
    is_teaching_unit, sort_order,
    dean_id, dean_name,
    create_by
) VALUES (
    'CS_SE', '软件工程系', 'ACADEMIC',
    1, 2, '1/2',
    1, 1,
    12346, '王主任',
    1
);
```

### 更新示例

#### 1. 更新统计信息
```sql
UPDATE dim_faculty f
SET teacher_count = (
    SELECT COUNT(*)
    FROM dim_teacher t
    WHERE t.faculty_id = f.id
      AND t.employment_status = 'ACTIVE'
),
student_count = (
    SELECT COUNT(*)
    FROM dim_user u
    WHERE u.faculty_id = f.id
      AND u.user_type = 'STUDENT'
      AND u.status = 'ACTIVE'
),
class_count = (
    SELECT COUNT(*)
    FROM dim_class c
    WHERE c.faculty_id = f.id
      AND c.status = 'ACTIVE'
),
update_time = NOW()
WHERE f.id = 1;
```

#### 2. 更新院系负责人
```sql
UPDATE dim_faculty
SET dean_id = 12347,
    dean_name = '张院长',
    dean_phone = '13800138001',
    dean_email = 'zhang@school.edu.cn',
    update_time = NOW(),
    version = version + 1
WHERE id = 1;
```

### 删除示例

#### 1. 逻辑删除院系
```sql
UPDATE dim_faculty
SET status = 'DISBANDED',
    is_active = 0,
    update_time = NOW()
WHERE id = 999;
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：院系编码必须唯一
2. **层级检查**：院系层级不能超过3级
3. **循环检查**：不能出现循环引用
4. **完整性检查**：关键信息不能为空

### 数据清洗规则
1. **重复数据处理**：合并重复的院系定义
2. **层级修正**：修复院系层级关系
3. **路径修正**：更新院系路径信息
4. **统计修正**：修正人员数量统计

## 性能优化

### 索引优化
- 院系编码建立唯一索引
- 父院系ID建立索引支持层级查询
- 院系级别建立索引支持层级过滤

### 查询优化
- 使用递归CTE查询院系树
- 避免过深的层级查询
- 合理使用索引和排序

### 存储优化
- 院系路径使用字符串存储
- 统计字段定期更新
- 避免频繁的组织结构调整

## 扩展说明

### 未来扩展方向
1. **组织架构**：支持更复杂的组织架构
2. **历史版本**：记录院系变更历史
3. **绩效评估**：增加院系绩效评估
4. **协作关系**：记录院系间协作关系

### 兼容性说明
- 支持与组织架构系统集成
- 支持国家教育部门组织标准
- 支持多校区院系管理

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*