# faculty_info 院系信息表

## 基本信息

- **表名**：`faculty_info`
- **中文名称**：院系信息
- **用途**：存储学校院系的基本信息，包括院系名称、编码等，用于基础数据同步
- **字段数量**：8个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| faculty_name | varchar | 200 | NO | - | 院系名称 |
| faculty_code | varchar | 200 | NO | - | 院系code |
| is_valid | int | - | YES | - | 是否在用：1=是，0=否 |
| del_flag | varchar | 255 | YES | - | 删除状态：0=正常，2=删除 |
| remark | varchar | 255 | YES | - | 备注 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：院系唯一标识符，主键，varchar类型，最大长度50字符

### 业务字段
- **faculty_name**：院系的完整名称，如"计算机科学与技术学院"，必填
- **faculty_code**：院系编码，用于系统内部识别和关联，必填
- **is_valid**：院系状态标识，1表示院系正常使用，0表示停用
- **del_flag**：逻辑删除标记，0表示正常状态，2表示已删除

### 扩展字段
- **remark**：院系相关备注信息，可存储特殊说明或附加信息

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`faculty_code` - 建议创建唯一索引，确保院系编码唯一性
- **状态索引**：`is_valid, del_flag` - 复合索引，用于快速查询有效院系

## 数据关联关系

### 作为主表关联的表
- **major_info**：通过 `faculty_code` 字段关联专业信息
- **class_info**：通过 `faculty_code` 字段关联班级信息
- **teacher_info**：通过 `faculty_code` 字段关联教师信息
- **student_info**：通过 `faculty_code` 字段关联学生信息

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`faculty_code` 应保持唯一性
3. **非空约束**：`faculty_name` 和 `faculty_code` 为必填字段
4. **检查约束**：`is_valid` 只能是 0 或 1
5. **检查约束**：`del_flag` 只能是 0 或 2

## 使用示例

### SQL插入示例
```sql
INSERT INTO faculty_info (
    id,
    faculty_name,
    faculty_code,
    is_valid,
    del_flag,
    remark,
    create_time,
    update_time
) VALUES (
    'FAC001',
    '计算机科学与技术学院',
    'CS_DEPT',
    1,
    '0',
    '计算机相关专业的教学科研单位',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询所有有效院系
SELECT * FROM faculty_info
WHERE is_valid = 1 AND del_flag = '0';

-- 根据院系编码查询
SELECT * FROM faculty_info
WHERE faculty_code = 'CS_DEPT';
```

## 同步注意事项

1. **数据一致性**：同步时需确保 `faculty_code` 与其他表中的引用保持一致
2. **状态同步**：`is_valid` 和 `del_flag` 字段的变更需要及时同步
3. **时间戳**：`update_time` 字段应反映最新的数据修改时间
4. **编码规范**：`faculty_code` 建议使用统一的编码规范，便于维护

---

**数据来源**：校方数字化校园系统
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步