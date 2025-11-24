# t_zjy_base_teacher_user 教师用户信息表

## 基本信息

- **表名**：`t_zjy_base_teacher_user`
- **中文名称**：教师用户信息表
- **用途**：存储教师的详细用户信息和权限设置，用于职教云平台用户管理和教学过程数据推送
- **字段数量**：28个
- **数据类别**：教学过程数据推送表 - 用户管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| teacher_name | varchar | 50 | YES | - | 老师姓名 |
| user_name | varchar | 50 | YES | - | 用户名 |
| avatarUrl | varchar | 255 | YES | - | 头像 |
| password | varchar | 100 | YES | - | 密码 |
| job_no | varchar | 200 | YES | - | 工号 |
| sex | varchar | 5 | YES | - | 性别 |
| document_type | varchar | 20 | YES | - | 证件类型 |
| card_no | varchar | 30 | YES | - | 证件号 |
| email | varchar | 50 | YES | - | 邮箱 |
| phone_number | varchar | 30 | YES | - | 手机号 |
| school_leader | bit | - | YES | - | 是否为校领导 |
| is_valid | int | - | YES | - | 是否有效0否1是 |
| create_by | varchar | 50 | YES | - | 创建人 |
| create_time | datetime | - | YES | - | 创建时间 |
| user_type | varchar | 2 | YES | - | 用户类型 |
| update_by | varchar | 50 | YES | - | 修改人 |
| update_time | datetime | - | YES | - | 修改时间 |
| faculty_id | varchar | 50 | YES | - | 院系id |
| faculty_name | varchar | 200 | YES | - | 院系名称 |
| is_contest | varchar | 10 | YES | - | 是否参赛老师 |
| merge_id | longtext | 4294967295 | YES | - | 合并id |
| date_birth | date | - | YES | - | 出生日期 |
| remark | mediumtext | 16777215 | YES | - | 备注 |
| telephone | varchar | 50 | YES | - | 手机号 |
| new_id | varchar | 50 | YES | - | 国家检测平台用到的id |
| del_flag | varchar | 255 | YES | - | 删除标记 |
| is_specialist | varchar | 255 | YES | - | 是否为专家评审 |
| nationality | varchar | 200 | YES | - | 国家代码 |
| is_register | int | - | YES | - | 是否注册 |
| is_submit_apply | int | - | YES | - | 是否提交申请 |

## 字段详细说明

### 主键字段
- **id**：教师用户唯一标识符，主键，varchar类型，最大长度50字符

### 基本用户信息
- **teacher_name**：教师真实姓名
- **user_name**：登录用户名，系统内部唯一标识
- **password**：用户密码，通常加密存储
- **avatarUrl**：头像图片URL地址
- **is_valid**：账户状态，0表示不可用，1表示可用

### 个人信息字段
- **job_no**：教师工号，学校内部唯一标识
- **sex**：性别，如"男"、"女"
- **date_birth**：出生日期
- **document_type**：证件类型，如身份证、护照等
- **card_no**：证件号码
- **nationality**：国家代码，格式为(id:名称)
- **phone_number**：手机号码
- **telephone**：固定电话
- **email**：电子邮箱

### 职务和权限字段
- **school_leader**：是否为校领导，bit类型（0否，1是）
- **is_contest**：是否参赛老师，'0'否，'1'是
- **is_specialist**：是否为专家评审，'0'否，'1'是
- **user_type**：用户类型（1:学生，2:老师，3:社会学习者，4:企业用户，5:管理员，6:编辑，7:访客）

### 院系关联字段
- **faculty_id**：所属院系ID
- **faculty_name**：所属院系名称

### 系统管理字段
- **create_by**：创建人
- **update_by**：最后修改人
- **create_time**：创建时间
- **update_time**：修改时间
- **del_flag**：删除标记，'0'代表存在，'2'代表删除

### 扩展和集成字段
- **remark**：备注信息
- **merge_id**：合并ID，用于数据合并场景
- **new_id**：国家检测平台用到的ID
- **is_register**：是否注册标识
- **is_submit_apply**：是否提交申请标识

## 用户权限说明

| user_type值 | 类型说明 | 权限说明 |
|-------------|----------|----------|
| 2 | 老师 | 教学权限，创建和管理课程 |
| 5 | 管理员 | 系统管理权限 |
| 6 | 编辑 | 内容编辑权限 |

## 特殊身份说明

| 字段 | 值 | 说明 |
|------|----|----- |
| school_leader | 0/1 | 是否为校领导，影响系统管理权限 |
| is_contest | 0/1 | 是否参与教学竞赛活动 |
| is_specialist | 0/1 | 是否为专家评审，影响评审权限 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`user_name` 和 `job_no` 应保持唯一性
3. **检查约束**：`is_valid` 只能是 0 或 1
4. **检查约束**：`school_leader` 只能是 0 或 1
5. **检查约束**：`del_flag` 只能是 '0' 或 '2'
6. **检查约束**：`user_type` 应符合预设类型

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`user_name` - 建议创建唯一索引，确保用户名唯一性
- **业务索引**：`job_no` - 建议创建唯一索引，确保工号唯一性
- **关联索引**：`faculty_id` - 外键索引，用于关联查询院系信息
- **权限索引**：`is_valid, school_leader, is_specialist` - 复合索引，用于权限查询

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_base_teacher_user (
    id, teacher_name, user_name, job_no, sex, email, phone_number, school_leader,
    is_valid, user_type, faculty_id, faculty_name, is_specialist,
    create_time, update_time, del_flag
) VALUES (
    'TCH001', '张教授', 'zhang_prof', 'T2024001', '男',
    'zhang@university.edu.cn', '13900139000', 0, 1, '2', 'FAC001',
    '计算机科学与技术学院', '1', '2024-01-01 10:00:00',
    '2024-01-01 10:00:00', '0'
);
```

### 查询示例
```sql
-- 查询所有有效教师
SELECT * FROM t_zjy_base_teacher_user
WHERE user_type = '2' AND is_valid = 1 AND del_flag = '0';

-- 查询校领导
SELECT * FROM t_zjy_base_teacher_user
WHERE school_leader = 1 AND is_valid = 1;

-- 查询专家评审
SELECT * FROM t_zjy_base_teacher_user
WHERE is_specialist = '1' AND is_valid = 1;
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送