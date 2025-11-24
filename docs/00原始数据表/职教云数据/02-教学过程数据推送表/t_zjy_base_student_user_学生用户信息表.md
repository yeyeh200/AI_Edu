# t_zjy_base_student_user 学生用户信息表

## 基本信息

- **表名**：`t_zjy_base_student_user`
- **中文名称**：学生用户信息表
- **用途**：存储学生的详细用户信息和学籍状态，用于职教云平台用户管理和教学过程数据推送
- **字段数量**：32个
- **数据类别**：教学过程数据推送表 - 用户管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| user_name | varchar | 100 | YES | - | 用户名 |
| student_name | varchar | 100 | YES | - | 姓名 |
| remark | mediumtext | 16777215 | YES | - | 备注 |
| date_birth | date | - | YES | - | 出生日期 |
| telephone | varchar | 100 | YES | - | 固定电话 |
| school_number | varchar | 100 | YES | - | 学号 |
| sex | varchar | 10 | YES | - | 性别 |
| email | varchar | 100 | YES | - | 邮箱 |
| password | varchar | 100 | YES | - | 密码 |
| avatarUrl | varchar | 255 | YES | - | 头像 |
| document_type | varchar | 20 | YES | - | 证件类型 |
| card_no | varchar | 50 | YES | - | 证件号码 |
| phone_number | varchar | 50 | YES | - | 手机号 |
| is_valid | varchar | 1 | YES | - | 是否可用0否1是 |
| user_type | varchar | 5 | YES | - | 用户类型 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_by | varchar | 50 | YES | - | 修改人 |
| update_time | datetime | - | YES | - | 修改时间 |
| faculty_id | varchar | 50 | YES | - | 院系id |
| faculty_name | varchar | 200 | YES | - | 院系名称 |
| major_id | varchar | 50 | YES | - | 专业id |
| majoe_name | varchar | 100 | YES | - | 专业名称 |
| label | mediumtext | 16777215 | YES | - | 标签 |
| student_type | varchar | 20 | YES | - | 学生类型 |
| grade_id | varchar | 50 | YES | - | 年级id |
| grade_name | varchar | 50 | YES | - | 年级名称 |
| classes_id | varchar | 50 | YES | - | 行政班id |
| classes_name | varchar | 100 | YES | - | 行政班名称 |
| status | varchar | 10 | YES | - | 学籍状态 |
| create_by | varchar | 50 | YES | - | 创建人 |
| merge_id | longtext | 4294967295 | YES | - | 合并id |
| new_id | varchar | 50 | YES | - | 国家平台检测id |
| del_flag | varchar | 255 | YES | - | 删除标记 |
| nationality | varchar | 200 | YES | - | 国家代码 |
| is_register | int | - | YES | - | 是否注册 |
| is_submit_apply | int | - | YES | - | 是否提交申请 |

## 字段详细说明

### 主键字段
- **id**：学生用户唯一标识符，主键，varchar类型，最大长度50字符

### 基本用户信息
- **user_name**：登录用户名，系统内部唯一标识
- **student_name**：学生真实姓名
- **password**：用户密码，通常加密存储
- **avatarUrl**：头像图片URL地址
- **is_valid**：账户状态，'0'表示不可用，'1'表示可用

### 个人信息字段
- **date_birth**：出生日期
- **sex**：性别，如"男"、"女"
- **document_type**：证件类型，如身份证、护照等
- **card_no**：证件号码
- **nationality**：国家代码，格式为(id:名称)
- **phone_number**：手机号码
- **telephone**：固定电话
- **email**：电子邮箱

### 学籍信息字段
- **school_number**：学号，学校内部唯一标识
- **student_type**：学生类型（1:应届普通高中毕业生，2:应届中职毕业生，3:退役军人，4:下岗职工，5:农民工，6:新型职业农民，7:其他）
- **status**：学籍状态（1:在籍，2:毕业，3:休学，4:退学）

### 院系专业班级信息
- **faculty_id**：所属院系ID
- **faculty_name**：所属院系名称
- **major_id**：所属专业ID
- **majoe_name**：所属专业名称
- **grade_id**：所属年级ID
- **grade_name**：所属年级名称
- **classes_id**：所属行政班ID
- **classes_name**：所属行政班名称

### 系统管理字段
- **user_type**：用户类型（1:学生，2:老师，3:社会学习者，4:企业用户，5:管理员，6:编辑，7:访客）
- **create_by**：创建人
- **update_by**：最后修改人
- **create_time**：创建时间
- **update_time**：修改时间
- **del_flag**：删除标记，'0'代表存在，'2'代表删除

### 扩展和集成字段
- **remark**：备注信息
- **label**：标签信息，支持多个标签
- **merge_id**：合并ID，用于数据合并场景
- **new_id**：国家平台检测ID
- **is_register**：是否注册标识
- **is_submit_apply**：是否提交申请标识

## 用户类型说明

| user_type值 | 类型说明 | 权限说明 |
|-------------|----------|----------|
| 1 | 学生 | 学习权限，参与课程和活动 |
| 2 | 老师 | 教学权限，创建和管理课程 |
| 3 | 社会学习者 | 学习权限，面向社会学员 |
| 4 | 企业用户 | 企业培训权限 |
| 5 | 管理员 | 系统管理权限 |
| 6 | 编辑 | 内容编辑权限 |
| 7 | 访客 | 只读权限 |

## 学生类型说明

| student_type值 | 类型说明 |
|----------------|----------|
| 1 | 应届普通高中毕业生 |
| 2 | 应届中职毕业生 |
| 3 | 退役军人 |
| 4 | 下岗职工 |
| 5 | 农民工 |
| 6 | 新型职业农民 |
| 7 | 其他 |

## 学籍状态说明

| status值 | 状态说明 | 系统权限 |
|----------|----------|----------|
| 1 | 在籍 | 正常学习权限 |
| 2 | 毕业 | 只读权限，查看历史记录 |
| 3 | 休学 | 限制权限，暂停学习 |
| 4 | 退学 | 禁用权限 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`user_name` 和 `school_number` 应保持唯一性
3. **检查约束**：`is_valid` 只能是 '0' 或 '1'
4. **检查约束**：`del_flag` 只能是 '0' 或 '2'
5. **检查约束**：`user_type` 只能是 1-7
6. **检查约束**：`student_type` 只能是 1-7
7. **检查约束**：`status` 只能是 1-4

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`user_name` - 建议创建唯一索引，确保用户名唯一性
- **业务索引**：`school_number` - 建议创建唯一索引，确保学号唯一性
- **关联索引**：`faculty_id` - 外键索引
- **关联索引**：`major_id` - 外键索引
- **关联索引**：`grade_id` - 外键索引
- **关联索引**：`classes_id` - 外键索引
- **状态索引**：`is_valid, del_flag, status` - 复合索引，用于快速查询有效学生

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_base_student_user (
    id, user_name, student_name, date_birth, school_number, sex, email, phone_number,
    is_valid, user_type, faculty_id, faculty_name, major_id, majoe_name,
    grade_id, grade_name, classes_id, classes_name, status, student_type,
    create_time, update_time, del_flag
) VALUES (
    'STU001', 'zhangsan', '张三', '2000-01-01', '202401001', '男',
    'zhangsan@student.edu.cn', '13800138000', '1', '1', 'FAC001',
    '计算机科学与技术学院', 'MAJ001', '计算机科学与技术', 'GRD001', '2024级',
    'CLS001', '计算机科学与技术2024级1班', '1', '1',
    '2024-01-01 10:00:00', '2024-01-01 10:00:00', '0'
);
```

### 查询示例
```sql
-- 查询所有有效学生
SELECT * FROM t_zjy_base_student_user
WHERE user_type = '1' AND is_valid = '1' AND del_flag = '0';

-- 根据学号查询
SELECT * FROM t_zjy_base_student_user
WHERE school_number = '202401001';

-- 查询某院系学生
SELECT * FROM t_zjy_base_student_user
WHERE faculty_id = 'FAC001' AND status = '1';
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送