# t_zjy_base_major 专业信息-基础数据表

## 基本信息

- **表名**：`t_zjy_base_major`
- **中文名称**：专业信息-基础数据表
- **用途**：职教云平台内部专业信息管理，与基础数据同步表中的专业信息相对应
- **字段数量**：14个
- **数据类别**：教学过程数据推送表 - 用户管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | id |
| major_name | varchar | 200 | YES | - | 专业名称 |
| major_code | varchar | 50 | YES | - | 专业编码 |
| merge_id | longtext | 4294967295 | YES | - | 合并id |
| faculty_id | varchar | 50 | YES | - | 院系id |
| belong_major_one_id | varchar | 50 | YES | - | 所属专业大类id |
| belong_major_one_name | varchar | 50 | YES | - | 所属专业大类名称 |
| belong_major_two_id | varchar | 50 | YES | - | 所属专业类id |
| belong_major_two_name | varchar | 50 | YES | - | 所属专业类名称 |
| belong_major_three_id | varchar | 50 | YES | - | 所属专业id |
| belong_major_three_name | varchar | 50 | YES | - | 所属专业名称 |
| is_valid | int | - | YES | - | 是否在用 1：是 0：否 |
| create_time | datetime | - | YES | - | 创建时间 |
| create_by | varchar | 50 | YES | - | 创建人 |
| update_time | datetime | - | YES | - | 修改时间 |
| update_by | varchar | 50 | YES | - | 修改人 |

## 字段详细说明

### 主键字段
- **id**：专业记录唯一标识符，主键，varchar类型，最大长度50字符

### 基本业务字段
- **major_name**：专业完整名称
- **major_code**：专业编码，系统内部唯一标识
- **faculty_id**：所属院系ID
- **is_valid**：专业状态，1表示在用，0表示停用

### 专业分类字段（三级分类体系）
- **belong_major_one_id**：所属专业大类ID（一级分类）
- **belong_major_one_name**：所属专业大类名称（一级分类）
- **belong_major_two_id**：所属专业类ID（二级分类）
- **belong_major_two_name**：所属专业类名称（二级分类）
- **belong_major_three_id**：所属专业ID（三级分类）
- **belong_major_three_name**：所属专业名称（三级分类）

### 系统管理字段
- **merge_id**：合并ID，用于数据合并场景
- **create_by**：创建人
- **update_by**：最后修改人
- **create_time**：创建时间
- **update_time**：修改时间

## 专业分类说明

本表支持三级专业分类体系，与基础数据同步表保持一致：
1. **一级分类（专业大类）**：如工学、理学、文学等
2. **二级分类（专业类）**：如计算机类、电子信息类等
3. **三级分类（专业）**：具体的本科或专科专业

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`major_code` 应保持唯一性
3. **检查约束**：`is_valid` 只能是 0 或 1
4. **外键约束**：`faculty_id` 应引用院系表中的有效记录

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`major_code` - 建议创建唯一索引，确保专业编码唯一性
- **关联索引**：`faculty_id` - 外键索引，用于关联查询院系信息
- **分类索引**：`belong_major_one_id` - 用于按大类查询
- **状态索引**：`is_valid` - 用于快速查询有效专业

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_base_major (
    id, major_name, major_code, faculty_id,
    belong_major_one_id, belong_major_one_name,
    belong_major_two_id, belong_major_two_name,
    belong_major_three_id, belong_major_three_name,
    is_valid, create_time, create_by, update_time, update_by
) VALUES (
    'MAJ001', '计算机科学与技术', 'CS_MAJOR', 'FAC001',
    '08', '工学', '0809', '计算机类', '080901', '计算机科学与技术',
    1, '2024-01-01 10:00:00', 'ADMIN', '2024-01-01 10:00:00', 'ADMIN'
);
```

### 查询示例
```sql
-- 查询所有有效专业
SELECT * FROM t_zjy_base_major
WHERE is_valid = 1
ORDER BY major_code;

-- 查询某院系下的专业
SELECT * FROM t_zjy_base_major
WHERE faculty_id = 'FAC001' AND is_valid = 1;
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送