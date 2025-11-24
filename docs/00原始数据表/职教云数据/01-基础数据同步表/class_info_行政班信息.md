# class_info 行政班信息表

## 基本信息

- **表名**：`class_info`
- **中文名称**：行政班信息
- **用途**：存储行政班级信息，关联院系、专业、年级信息，用于基础数据同步
- **字段数量**：10个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| classes_name | varchar | 100 | NO | - | 班级名称 |
| classes_code | varchar | 100 | NO | - | 班级编码 |
| faculty_code | varchar | 50 | YES | - | 院系编码 |
| major_code | varchar | 50 | YES | - | 专业编码 |
| grade_code | varchar | 50 | YES | - | 年级编码 |
| is_valid | int | - | YES | - | 是否在用：1=是，0=否 |
| del_flag | varchar | 255 | YES | - | 删除状态：0=正常，2=删除 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：班级唯一标识符，主键，varchar类型，最大长度50字符

### 基本业务字段
- **classes_name**：班级的完整名称，如"计算机科学与技术2024级1班"，必填
- **classes_code**：班级编码，用于系统内部识别和关联，必填
- **is_valid**：班级状态标识，1表示班级正常使用，0表示停用
- **del_flag**：逻辑删除标记，0表示正常状态，2表示已删除

### 关联字段
- **faculty_code**：所属院系编码，关联院系信息表
- **major_code**：所属专业编码，关联专业信息表
- **grade_code**：所属年级编码，关联年级信息表

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 班级命名规范建议

建议采用以下班级命名规范：
- **专业名称 + 年级 + 班级序号**：如"计算机科学与技术2024级1班"
- **专业简称 + 年级 + 班级类型 + 序号**：如"计科2024本1"
- **自定义规范**：根据学校实际情况制定统一的命名规则

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`classes_code` - 建议创建唯一索引，确保班级编码唯一性
- **关联索引**：`faculty_code` - 外键索引，用于关联查询院系信息
- **关联索引**：`major_code` - 外键索引，用于关联查询专业信息
- **关联索引**：`grade_code` - 外键索引，用于关联查询年级信息
- **状态索引**：`is_valid, del_flag` - 复合索引，用于快速查询有效班级

## 数据关联关系

### 外键关联
- **faculty_info**：通过 `faculty_code` 字段关联院系信息表
- **major_info**：通过 `major_code` 字段关联专业信息表
- **base_grade_info**：通过 `grade_code` 字段关联年级信息表

### 作为主表关联的表
- **student_info**：通过 `classes_code` 字段关联学生信息
- **course_info_class**：通过班级编码关联课程开课班级信息

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`classes_code` 应保持唯一性
3. **非空约束**：`classes_name` 和 `classes_code` 为必填字段
4. **检查约束**：`is_valid` 只能是 0 或 1
5. **检查约束**：`del_flag` 只能是 0 或 2
6. **外键约束**：`faculty_code` 应引用院系表中的有效记录
7. **外键约束**：`major_code` 应引用专业表中的有效记录
8. **外键约束**：`grade_code` 应引用年级表中的有效记录

## 使用示例

### SQL插入示例
```sql
INSERT INTO class_info (
    id,
    classes_name,
    classes_code,
    faculty_code,
    major_code,
    grade_code,
    is_valid,
    del_flag,
    create_time,
    update_time
) VALUES (
    'CLS001',
    '计算机科学与技术2024级1班',
    'CS202401',
    'CS_DEPT',
    'CS_MAJOR',
    '2024',
    1,
    '0',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询所有有效班级
SELECT * FROM class_info
WHERE is_valid = 1 AND del_flag = '0'
ORDER BY grade_code DESC, classes_name;

-- 查询某院系下的班级
SELECT * FROM class_info
WHERE faculty_code = 'CS_DEPT'
  AND is_valid = 1
  AND del_flag = '0';

-- 查询某专业某年级的班级
SELECT * FROM class_info
WHERE major_code = 'CS_MAJOR'
  AND grade_code = '2024'
  AND is_valid = 1
  AND del_flag = '0';
```

### 关联查询示例
```sql
-- 查询班级及其关联信息
SELECT
    c.classes_name,
    c.classes_code,
    f.faculty_name,
    m.major_name,
    g.grade_name
FROM class_info c
LEFT JOIN faculty_info f ON c.faculty_code = f.faculty_code
LEFT JOIN major_info m ON c.major_code = m.major_code
LEFT JOIN base_grade_info g ON c.grade_code = g.grade_code
WHERE c.is_valid = 1
  AND c.del_flag = '0'
ORDER BY g.grade_code DESC, c.classes_name;
```

## 业务逻辑说明

### 班级管理
1. **班级创建**：通常按专业、年级创建班级，如"计算机科学与技术2024级1班"
2. **班级状态**：通过 `is_valid` 字段控制班级的启用/停用状态
3. **关联完整性**：班级必须关联有效的院系、专业和年级

### 数据层级关系
```
院系 → 专业 → 年级 → 班级 → 学生
```

### 班级编码规范
建议采用：专业编码 + 年级 + 班级序号
例如：CS202401（计算机专业2024级1班）

## 同步注意事项

1. **关联一致性**：班级的院系、专业、年级编码必须在各自表中存在且有效
2. **编码唯一性**：确保 `classes_code` 在系统内唯一
3. **状态同步**：班级的启用/停用状态变更需要及时同步
4. **级联更新**：当专业或年级信息变更时，需要同步更新相关的班级信息
5. **数据完整性**：同步前验证关联数据的完整性和一致性

## 常见班级示例

| classes_name | classes_code | major_code | grade_code | 说明 |
|--------------|--------------|------------|------------|------|
| 计算机科学与技术2024级1班 | CS202401 | CS_MAJOR | 2024 | 计算机专业2024级1班 |
| 软件工程2024级2班 | SE202402 | SE_MAJOR | 2024 | 软件工程专业2024级2班 |
| 计算机科学与技术2023级3班 | CS202303 | CS_MAJOR | 2023 | 计算机专业2023级3班 |

---

**数据来源**：校方数字化校园系统
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步