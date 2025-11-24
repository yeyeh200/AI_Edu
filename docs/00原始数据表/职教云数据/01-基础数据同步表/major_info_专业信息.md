# major_info 专业信息表

## 基本信息

- **表名**：`major_info`
- **中文名称**：专业信息
- **用途**：存储专业信息，包括专业名称、编码、所属院系、专业分类等，用于基础数据同步
- **字段数量**：14个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| major_name | varchar | 200 | NO | - | 专业名称 |
| major_code | varchar | 50 | NO | - | 专业编码 |
| faculty_code | varchar | 50 | YES | - | 院系编码 |
| belong_major_one_code | varchar | 50 | YES | - | 所属专业大类编码 |
| belong_major_one_name | varchar | 50 | YES | - | 所属专业大类名称 |
| belong_major_two_code | varchar | 50 | YES | - | 所属专业类编码 |
| belong_major_two_name | varchar | 50 | YES | - | 所属专业类名称 |
| belong_major_three_code | varchar | 50 | YES | - | 所属专业编码 |
| belong_major_three_name | varchar | 50 | YES | - | 所属专业名称 |
| is_valid | int | - | YES | - | 是否在用：1=是，0=否 |
| del_flag | varchar | 255 | YES | - | 删除状态：0=正常，2=删除 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：专业唯一标识符，主键，varchar类型，最大长度50字符

### 基本业务字段
- **major_name**：专业的完整名称，如"计算机科学与技术"，必填
- **major_code**：专业编码，用于系统内部识别和关联，必填
- **faculty_code**：所属院系编码，关联院系信息表
- **is_valid**：专业状态标识，1表示专业正常使用，0表示停用
- **del_flag**：逻辑删除标记，0表示正常状态，2表示已删除

### 专业分类字段（三级分类体系）
- **belong_major_one_code**：所属专业大类编码（一级分类）
- **belong_major_one_name**：所属专业大类名称（一级分类）
- **belong_major_two_code**：所属专业类编码（二级分类）
- **belong_major_two_name**：所属专业类名称（二级分类）
- **belong_major_three_code**：所属专业编码（三级分类）
- **belong_major_three_name**：所属专业名称（三级分类）

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 专业分类说明

本表支持三级专业分类体系：
1. **一级分类（专业大类）**：如工学、理学、文学等
2. **二级分类（专业类）**：如计算机类、电子信息类等
3. **三级分类（专业）**：具体的本科或专科专业

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`major_code` - 建议创建唯一索引，确保专业编码唯一性
- **关联索引**：`faculty_code` - 外键索引，用于关联查询院系信息
- **状态索引**：`is_valid, del_flag` - 复合索引，用于快速查询有效专业

## 数据关联关系

### 外键关联
- **faculty_info**：通过 `faculty_code` 字段关联院系信息表

### 作为主表关联的表
- **class_info**：通过 `major_code` 字段关联班级信息
- **student_info**：通过 `major_code` 字段关联学生信息
- **base_course**：通过 `major_id` 字段关联课程信息

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`major_code` 应保持唯一性
3. **非空约束**：`major_name` 和 `major_code` 为必填字段
4. **检查约束**：`is_valid` 只能是 0 或 1
5. **检查约束**：`del_flag` 只能是 0 或 2
6. **外键约束**：`faculty_code` 应引用院系表中的有效记录

## 使用示例

### SQL插入示例
```sql
INSERT INTO major_info (
    id,
    major_name,
    major_code,
    faculty_code,
    belong_major_one_code,
    belong_major_one_name,
    belong_major_two_code,
    belong_major_two_name,
    belong_major_three_code,
    belong_major_three_name,
    is_valid,
    del_flag,
    create_time,
    update_time
) VALUES (
    'MAJ001',
    '计算机科学与技术',
    'CS_MAJOR',
    'CS_DEPT',
    '08',
    '工学',
    '0809',
    '计算机类',
    '080901',
    '计算机科学与技术',
    1,
    '0',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询某院系下的所有有效专业
SELECT * FROM major_info
WHERE faculty_code = 'CS_DEPT'
  AND is_valid = 1
  AND del_flag = '0';

-- 查询特定专业大类专业
SELECT * FROM major_info
WHERE belong_major_one_code = '08'
  AND is_valid = 1
  AND del_flag = '0';
```

### 关联查询示例
```sql
-- 查询专业及其院系信息
SELECT
    m.major_name,
    m.major_code,
    f.faculty_name,
    m.belong_major_one_name,
    m.belong_major_two_name
FROM major_info m
LEFT JOIN faculty_info f ON m.faculty_code = f.faculty_code
WHERE m.is_valid = 1
  AND m.del_flag = '0'
  AND f.is_valid = 1
  AND f.del_flag = '0';
```

## 同步注意事项

1. **层级一致性**：专业分类的三级编码应保持逻辑一致性
2. **编码规范**：专业编码应遵循国家或行业标准编码规范
3. **关联完整性**：`faculty_code` 必须引用有效的院系记录
4. **状态同步**：专业的启用/停用状态变更需要及时同步
5. **分类更新**：专业分类信息的变更需要同步更新相关字段

## 专业编码规范建议

建议采用国家标准专业编码体系：
- 一级分类：2位数字编码
- 二级分类：4位数字编码
- 三级分类：6位数字编码

---

**数据来源**：校方数字化校园系统
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步