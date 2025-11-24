# teacher_info 教师信息表

## 基本信息

- **表名**：`teacher_info`
- **中文名称**：教师信息
- **用途**：存储教师基本信息，包括姓名、工号、联系方式、所属院系等，用于基础数据同步
- **字段数量**：13个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| teacher_name | varchar | 50 | NO | - | 老师姓名 |
| user_name | varchar | 50 | NO | - | 用户名 |
| job_no | varchar | 200 | YES | - | 工号 |
| sex | varchar | 5 | YES | - | 性别 |
| email | varchar | 50 | YES | - | 邮箱 |
| phone_number | varchar | 30 | YES | - | 手机号 |
| faculty_name | varchar | 200 | YES | - | 院系名称 |
| faculty_code | varchar | 200 | YES | - | 院系编码 |
| is_valid | int | - | YES | - | 是否在用：1=是，0=否 |
| del_flag | varchar | 255 | YES | - | 删除状态：0=正常，2=删除 |
| remark | mediumtext | - | YES | - | 备注 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：教师唯一标识符，主键，varchar类型，最大长度50字符

### 基本信息字段
- **teacher_name**：教师真实姓名，必填
- **user_name**：系统用户名，用于登录和系统识别，必填
- **job_no**：教师工号，学校内部唯一标识，建议唯一
- **sex**：性别，如"男"、"女"或其他标识

### 联系方式字段
- **email**：电子邮箱地址
- **phone_number**：手机号码，用于联系和验证

### 院系关联字段
- **faculty_name**：所属院系名称，冗余存储便于查询
- **faculty_code**：所属院系编码，关联院系信息表

### 状态和备注字段
- **is_valid**：教师状态标识，1表示正常在职，0表示离职或其他状态
- **del_flag**：逻辑删除标记，0表示正常状态，2表示已删除
- **remark**：教师相关备注信息，可存储特殊说明或附加信息

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`user_name` 和 `job_no` 应保持唯一性
3. **非空约束**：`teacher_name` 和 `user_name` 为必填字段
4. **检查约束**：`is_valid` 只能是 0 或 1
5. **检查约束**：`del_flag` 只能是 0 或 2
6. **外键约束**：`faculty_code` 应引用院系表中的有效记录

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`user_name` - 建议创建唯一索引，确保用户名唯一性
- **业务索引**：`job_no` - 建议创建唯一索引，确保工号唯一性
- **关联索引**：`faculty_code` - 外键索引，用于关联查询院系信息
- **状态索引**：`is_valid, del_flag` - 复合索引，用于快速查询有效教师

## 数据关联关系

### 外键关联
- **faculty_info**：通过 `faculty_code` 字段关联院系信息表

### 在其他表中的引用
- **course_info**：通过教师工号关联课程信息
- **course_info_class**：通过教师信息关联班级课程
- **t_zjy_course_info_teacher**：开课教师团队表

## 使用示例

### SQL插入示例
```sql
INSERT INTO teacher_info (
    id,
    teacher_name,
    user_name,
    job_no,
    sex,
    email,
    phone_number,
    faculty_name,
    faculty_code,
    is_valid,
    del_flag,
    remark,
    create_time,
    update_time
) VALUES (
    'TCH001',
    '张老师',
    'zhang_teacher',
    'T2024001',
    '男',
    'zhang@university.edu.cn',
    '13800138000',
    '计算机科学与技术学院',
    'CS_DEPT',
    1,
    '0',
    '计算机专业骨干教师',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询所有有效教师
SELECT * FROM teacher_info
WHERE is_valid = 1 AND del_flag = '0'
ORDER BY teacher_name;

-- 根据工号查询教师
SELECT * FROM teacher_info
WHERE job_no = 'T2024001';

-- 查询某院系教师
SELECT * FROM teacher_info
WHERE faculty_code = 'CS_DEPT'
  AND is_valid = 1
  AND del_flag = '0';
```

### 关联查询示例
```sql
-- 查询教师及其院系信息
SELECT
    t.teacher_name,
    t.job_no,
    t.email,
    t.phone_number,
    f.faculty_name
FROM teacher_info t
LEFT JOIN faculty_info f ON t.faculty_code = f.faculty_code
WHERE t.is_valid = 1
  AND t.del_flag = '0'
  AND f.is_valid = 1
  AND f.del_flag = '0';
```

## 数据同步注意事项

### 身份信息同步
1. **工号唯一性**：确保 `job_no` 在全校范围内唯一
2. **用户名规范**：`user_name` 应遵循统一的命名规范
3. **姓名准确性**：教师姓名应与人事系统保持一致

### 院系关联
1. **编码一致性**：`faculty_code` 必须与院系表中的编码一致
2. **名称同步**：`faculty_name` 应与院系表中的名称同步更新
3. **变更同步**：教师调院系时需要及时更新相关字段

### 状态管理
1. **入职/离职**：通过 `is_valid` 字段标识教师在职状态
2. **逻辑删除**：使用 `del_flag` 进行逻辑删除，保留历史数据
3. **状态同步**：人事状态变更需要及时同步到系统

### 数据完整性
1. **联系方式**：邮箱和手机号用于系统通知和验证
2. **时间戳维护**：确保 `create_time` 和 `update_time` 的准确性
3. **备注信息**：`remark` 字段可存储教师职称、职务等附加信息

## 隐私和数据安全

1. **敏感信息**：教师联系方式属于敏感信息，需要妥善保护
2. **访问控制**：只有授权用户才能查看和修改教师信息
3. **数据加密**：建议对敏感字段进行加密存储
4. **审计日志**：记录教师信息的访问和修改历史

## 常见教师状态

| is_valid | 状态说明 | 处理方式 |
|----------|----------|----------|
| 1 | 正常在职 | 正常使用系统功能 |
| 0 | 离职/退休 | 限制系统访问权限 |
| 0 | 停职/请假 | 临时限制部分功能 |

---

**数据来源**：校方人事管理系统
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步