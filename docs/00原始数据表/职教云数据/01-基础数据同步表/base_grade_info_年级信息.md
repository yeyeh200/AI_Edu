# base_grade_info 年级信息表

## 基本信息

- **表名**：`base_grade_info`
- **中文名称**：年级信息
- **用途**：存储年级信息，包括年级名称和编码，用于基础数据同步和班级管理
- **字段数量**：8个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| grade_name | varchar | 50 | NO | - | 年级名称 |
| grade_code | varchar | 50 | NO | - | 年级code |
| is_valid | int | - | YES | - | 是否在用：1=是，0=否 |
| del_flag | varchar | 255 | YES | - | 删除状态：0=正常，2=删除 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：年级唯一标识符，主键，varchar类型，最大长度50字符

### 业务字段
- **grade_name**：年级的完整名称，如"2024级"、"2023级"等，必填
- **grade_code**：年级编码，用于系统内部识别和关联，必填
- **is_valid**：年级状态标识，1表示年级正常使用，0表示停用
- **del_flag**：逻辑删除标记，0表示正常状态，2表示已删除

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 年级编码规范建议

建议采用以下编码规范：
- **4位年份 + 1位级别**：如20241表示2024级本科，20242表示2024级专科
- **纯年份编码**：如2024、2023等
- **自定义编码**：根据学校实际情况制定

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`grade_code` - 建议创建唯一索引，确保年级编码唯一性
- **状态索引**：`is_valid, del_flag` - 复合索引，用于快速查询有效年级

## 数据关联关系

### 作为主表关联的表
- **class_info**：通过 `grade_code` 字段关联班级信息
- **student_info**：通过 `grade_code` 字段关联学生信息

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`grade_code` 应保持唯一性
3. **非空约束**：`grade_name` 和 `grade_code` 为必填字段
4. **检查约束**：`is_valid` 只能是 0 或 1
5. **检查约束**：`del_flag` 只能是 0 或 2

## 使用示例

### SQL插入示例
```sql
INSERT INTO base_grade_info (
    id,
    grade_name,
    grade_code,
    is_valid,
    del_flag,
    create_time,
    update_time
) VALUES (
    'GRD001',
    '2024级',
    '2024',
    1,
    '0',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询所有有效年级
SELECT * FROM base_grade_info
WHERE is_valid = 1 AND del_flag = '0'
ORDER BY grade_code DESC;

-- 根据年级编码查询
SELECT * FROM base_grade_info
WHERE grade_code = '2024';
```

### 关联查询示例
```sql
-- 查询年级及其班级数量
SELECT
    g.grade_name,
    g.grade_code,
    COUNT(c.id) as class_count
FROM base_grade_info g
LEFT JOIN class_info c ON g.grade_code = c.grade_code
                    AND c.is_valid = 1
                    AND c.del_flag = '0'
WHERE g.is_valid = 1
  AND g.del_flag = '0'
GROUP BY g.id, g.grade_name, g.grade_code;
```

## 业务逻辑说明

### 年级管理
1. **年级创建**：通常每年创建新年级，如"2024级"、"2023级"
2. **年级状态**：通过 `is_valid` 字段控制年级的启用/停用状态
3. **历史保留**：已毕业年级不建议物理删除，通过 `del_flag` 进行逻辑删除

### 数据完整性
1. **编码唯一性**：确保 `grade_code` 在系统内唯一
2. **名称规范**：年级名称应保持统一的命名规范
3. **时间同步**：`update_time` 字段应反映最新的数据修改时间

## 同步注意事项

1. **编码一致性**：年级编码在所有相关表中应保持一致
2. **状态同步**：年级的启用/停用状态变更需要及时同步
3. **时间戳维护**：确保 `create_time` 和 `update_time` 的准确性
4. **数据完整性**：同步前验证数据的完整性和一致性
5. **历史数据**：已毕业年级的数据应保留，仅做逻辑删除

## 常见年级示例

| grade_name | grade_code | 说明 |
|------------|------------|------|
| 2024级 | 2024 | 2024年入学年级 |
| 2023级 | 2023 | 2023年入学年级 |
| 2022级 | 2022 | 2022年入学年级 |
| 2021级 | 2021 | 2021年入学年级（可能已毕业） |

---

**数据来源**：校方数字化校园系统
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步