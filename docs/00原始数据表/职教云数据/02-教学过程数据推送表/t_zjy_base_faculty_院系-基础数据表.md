# t_zjy_base_faculty 院系-基础数据表

## 基本信息

- **表名**：`t_zjy_base_faculty`
- **中文名称**：院系-基础数据表
- **用途**：职教云平台内部院系信息管理，与基础数据同步表中的院系信息相对应
- **字段数量**：10个
- **数据类别**：教学过程数据推送表 - 用户管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| faculty_name | varchar | 200 | YES | - | 院系名称 |
| faculty_code | varchar | 200 | YES | - | 院系code |
| serial_no | int | - | YES | - | 序号 |
| is_valid | int | - | YES | - | 是否在用 1：是 0：否 |
| remark | varchar | 255 | YES | - | 备注 |
| merge_id | longtext | 4294967295 | YES | - | 合并id |
| create_time | datetime | - | YES | - | 创建时间 |
| create_by | varchar | 50 | YES | - | 创建id |
| update_time | datetime | - | YES | - | 修改时间 |
| update_by | varchar | 50 | YES | - | 修改人 |

## 字段详细说明

### 主键字段
- **id**：院系记录唯一标识符，主键，varchar类型，最大长度50字符

### 基本业务字段
- **faculty_name**：院系完整名称
- **faculty_code**：院系编码，系统内部唯一标识
- **serial_no**：院系排序序号，用于显示排序
- **is_valid**：院系状态，1表示在用，0表示停用

### 描述字段
- **remark**：院系相关备注信息，可存储特殊说明或附加信息

### 系统管理字段
- **merge_id**：合并ID，用于数据合并场景
- **create_by**：创建人ID
- **update_by**：最后修改人ID
- **create_time**：创建时间
- **update_time**：修改时间

## 院系状态说明

| is_valid值 | 状态说明 | 处理方式 |
|------------|----------|----------|
| 1 | 在用 | 正常显示和使用 |
| 0 | 停用 | 不显示但保留历史数据 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`faculty_code` 应保持唯一性
3. **检查约束**：`is_valid` 只能是 0 或 1

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`faculty_code` - 建议创建唯一索引，确保院系编码唯一性
- **状态索引**：`is_valid` - 用于快速查询有效院系
- **排序索引**：`serial_no` - 用于院系排序显示

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_base_faculty (
    id, faculty_name, faculty_code, serial_no, is_valid, remark,
    create_time, create_by, update_time, update_by
) VALUES (
    'FAC001', '计算机科学与技术学院', 'CS_DEPT', 1, 1,
    '计算机相关专业的教学科研单位',
    '2024-01-01 10:00:00', 'ADMIN', '2024-01-01 10:00:00', 'ADMIN'
);
```

### 查询示例
```sql
-- 查询所有有效院系
SELECT * FROM t_zjy_base_faculty
WHERE is_valid = 1
ORDER BY serial_no;

-- 根据院系编码查询
SELECT * FROM t_zjy_base_faculty
WHERE faculty_code = 'CS_DEPT';
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送