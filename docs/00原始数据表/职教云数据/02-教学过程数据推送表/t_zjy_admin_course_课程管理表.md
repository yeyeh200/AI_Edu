# t_zjy_admin_course 课程管理表

## 基本信息

- **表名**：`t_zjy_admin_course`
- **中文名称**：课程管理表
- **用途**：管理课程的基本信息和设置，记录职教云平台中创建的课程信息，用于教学过程数据推送
- **字段数量**：16个
- **数据类别**：教学过程数据推送表 - 用户管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | id |
| course_name | varchar | 255 | YES | - | 课程名称 |
| course_code | varchar | 255 | YES | - | 课程编码 |
| faculty_id | varchar | 500 | YES | - | 所属院系id |
| faculty_code | varchar | 255 | YES | - | 所属院系code |
| faculty_name | varchar | 500 | YES | - | 所属院系名称 |
| major_id | varchar | 3000 | YES | - | 所属专业id |
| major_code | varchar | 255 | YES | - | 所属专业code |
| major_name | varchar | 3000 | YES | - | 所属专业名称 |
| user_id | varchar | 50 | YES | - | 用户id |
| user_name | varchar | 255 | YES | - | 用户姓名 |
| create_by | varchar | 255 | YES | - | 创建人 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_by | varchar | 10 | YES | - | 修改人 |
| update_time | datetime | - | NO | - | 修改时间 |
| del_flag | char | 1 | YES | - | 删除标记 '0'在用 '2'删除 |
| excel_start | char | 1 | YES | - | Excel导入 1:是 2:否 |

## 字段详细说明

### 主键字段
- **id**：课程记录唯一标识符，主键，varchar类型，最大长度50字符

### 基本业务字段
- **course_name**：课程完整名称
- **course_code**：课程编码，系统内部识别码
- **user_id**：课程创建者或负责人ID
- **user_name**：课程创建者或负责人姓名

### 院系专业关联字段
- **faculty_id**：所属院系ID，关联院系信息
- **faculty_code**：所属院系编码
- **faculty_name**：所属院系名称，冗余存储便于查询
- **major_id**：所属专业ID，支持多个专业（最多3000字符）
- **major_code**：所属专业编码
- **major_name**：所属专业名称，支持多个专业名称（最多3000字符）

### 管理字段
- **create_by**：课程创建人标识
- **update_by**：最后修改人标识
- **del_flag**：删除标记，'0'表示在用，'2'表示已删除
- **excel_start**：Excel导入标记，'1'表示通过Excel导入，'2'表示其他方式创建

### 时间戳字段
- **create_time**：课程创建时间
- **update_time**：课程最后修改时间，必填

## 删除标记说明

| del_flag值 | 状态说明 | 处理方式 |
|------------|----------|----------|
| 0 | 在用 | 正常显示和使用 |
| 2 | 删除 | 逻辑删除，不显示但保留数据 |

## Excel导入标记说明

| excel_start值 | 创建方式 | 说明 |
|---------------|----------|------|
| 1 | Excel导入 | 通过Excel批量导入创建 |
| 2 | 其他方式 | 手动创建或其他方式导入 |

## 多专业支持

本表支持课程关联多个专业：
- **major_id**：可存储多个专业ID，用特定分隔符分隔
- **major_name**：可存储多个专业名称，与ID对应
- **存储格式**：建议使用逗号、分号等分隔符
- **长度限制**：major字段最大支持3000字符，可存储大量专业信息

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **非空约束**：`update_time` 为必填字段
3. **检查约束**：`del_flag` 只能是 '0' 或 '2'
4. **检查约束**：`excel_start` 只能是 '1' 或 '2'

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`course_code` - 用于按课程编码查询
- **关联索引**：`user_id` - 用于按创建者查询
- **关联索引**：`faculty_id` - 用于按院系查询
- **关联索引**：`major_id` - 用于按专业查询
- **状态索引**：`del_flag` - 用于过滤有效记录
- **时间索引**：`create_time, update_time` - 用于时间范围查询

## 数据关联关系

### 与基础数据的关联
- 通过 `faculty_code` 和 `faculty_id` 与院系基础数据关联
- 通过 `major_code` 和 `major_id` 与专业基础数据关联
- 通过 `user_id` 与用户信息关联

### 业务关联
- 与 `t_zjy_course_info`（开课信息表）关联
- 与 `t_zjy_course_design_cell`（课件表）关联
- 与 `t_zjy_question`（题库表）关联

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_admin_course (
    id,
    course_name,
    course_code,
    faculty_id,
    faculty_code,
    faculty_name,
    major_id,
    major_code,
    major_name,
    user_id,
    user_name,
    create_by,
    create_time,
    update_by,
    update_time,
    del_flag,
    excel_start
) VALUES (
    'COURSE001',
    '计算机科学导论',
    'CS_INTRO_2024',
    'FAC001',
    'CS_DEPT',
    '计算机科学与技术学院',
    'MAJ001,MAJ002',
    'CS_MAJOR,SE_MAJOR',
    '计算机科学与技术,软件工程',
    'USER001',
    '张老师',
    'USER001',
    '2024-01-01 10:00:00',
    'USER001',
    '2024-01-01 10:00:00',
    '0',
    '2'
);
```

### 查询示例
```sql
-- 查询所有有效课程
SELECT * FROM t_zjy_admin_course
WHERE del_flag = '0'
ORDER BY create_time DESC;

-- 查询某院系课程
SELECT * FROM t_zjy_admin_course
WHERE faculty_code = 'CS_DEPT'
  AND del_flag = '0'
ORDER BY course_name;

-- 查询某用户创建的课程
SELECT * FROM t_zjy_admin_course
WHERE user_id = 'USER001'
  AND del_flag = '0'
ORDER BY create_time DESC;

-- 查询Excel导入的课程
SELECT * FROM t_zjy_admin_course
WHERE excel_start = '1'
  AND del_flag = '0';
```

### 关联查询示例
```sql
-- 查询课程及关联信息
SELECT
    ac.course_name,
    ac.course_code,
    ac.user_name,
    ac.faculty_name,
    ac.major_name,
    ac.create_time,
    CASE ac.excel_start
        WHEN '1' THEN 'Excel导入'
        WHEN '2' THEN '手动创建'
        ELSE '其他'
    END as create_method
FROM t_zjy_admin_course ac
WHERE ac.del_flag = '0'
ORDER BY ac.create_time DESC;
```

## 课程管理业务逻辑

### 课程创建
1. **手动创建**：教师通过界面手动创建课程
2. **Excel导入**：通过Excel文件批量导入课程信息
3. **模板复制**：基于现有课程模板创建新课程
4. **系统导入**：从其他系统导入课程数据

### 课程状态管理
1. **创建状态**：课程刚创建，待完善信息
2. **编辑状态**：课程信息正在编辑中
3. **发布状态**：课程已发布，学生可见
4. **归档状态**：课程已结束，进行归档
5. **删除状态**：课程删除，通过del_flag标记

### 课程关联管理
1. **单专业课程**：课程关联一个专业
2. **多专业课程**：课程关联多个专业，面向多个专业学生
3. **公共课程**：面向全校或多个院系的公共课程

## 数据推送注意事项

### 数据完整性
1. **基础信息**：确保课程名称、编码等基础信息完整
2. **关联信息**：院系、专业关联信息需要准确
3. **责任人信息**：课程创建者和负责人信息需要准确

### 状态同步
1. **删除状态**：课程删除需要通过del_flag进行逻辑删除
2. **修改时间**：update_time需要准确反映最后修改时间
3. **创建方式**：正确标识课程的创建来源

### 多专业处理
1. **ID对应**：major_id和major_name需要正确对应
2. **分隔规范**：多个专业之间使用统一的分隔符
3. **长度控制**：注意多专业字段的长度限制

## 数据统计分析

### 课程创建统计
```sql
-- 按创建方式统计课程数量
SELECT
    excel_start,
    CASE excel_start
        WHEN '1' THEN 'Excel导入'
        WHEN '2' THEN '手动创建'
    END as create_method,
    COUNT(*) as course_count
FROM t_zjy_admin_course
WHERE del_flag = '0'
GROUP BY excel_start;
```

### 按院系统计课程
```sql
-- 按院系统计课程数量
SELECT
    faculty_name,
    COUNT(*) as course_count
FROM t_zjy_admin_course
WHERE del_flag = '0'
GROUP BY faculty_code, faculty_name
ORDER BY course_count DESC;
```

## 性能优化建议

### 索引优化
1. **复合索引**：创建 `del_flag + create_time` 的复合索引
2. **全文索引**：如果需要按课程名称搜索，可创建全文索引
3. **覆盖索引**：为常用查询创建覆盖索引

### 数据归档
1. **历史归档**：定期将已删除的课程进行归档
2. **分区策略**：大数据量时可按时间进行分区
3. **清理策略**：定期清理无效的测试数据

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送