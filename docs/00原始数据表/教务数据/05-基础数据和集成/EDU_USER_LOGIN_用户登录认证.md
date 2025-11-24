# EDU_USER_LOGIN 用户登录认证表

## 基本信息

- **表名**：`EDU_USER_LOGIN`（根据教务系统需求推导）
- **中文名称**：用户登录认证
- **用途**：存储用户登录认证信息，包括用户账号、密码、权限、登录日志等安全认证数据
- **字段数量**：约15个（根据系统安全需求推导）
- **数据类别**：教务系统 - 基础数据和集成模块

## 字段定义

| 字段名 | 数据类型 | 长度 | 是否为空 | 主键 | 默认值 | 备注 |
|--------|----------|------|----------|------|--------|------|
| user_id | 用户ID | varchar | 50 | NO | YES | - | 用户唯一标识 |
| username | 用户名 | varchar | 50 | NO | NO | - | 登录用户名 |
| password | 密码 | varchar | 255 | NO | NO | - | 加密存储密码 |
| user_type | 用户类型 | char | 2 | YES | NO | - | 用户分类 |
| real_name | 真实姓名 | varchar | 100 | YES | NO | - | 用户真实姓名 |
| email | 邮箱 | varchar | 100 | YES | NO | - | 用户邮箱 |
| phone | 手机号 | varchar | 20 | YES | NO | - | 联系电话 |
| status | 状态 | char | 1 | YES | NO | - | 账号状态 |
| last_login | 最后登录时间 | datetime | - | YES | NO | - | 最后登录时间 |
| login_count | 登录次数 | int | - | YES | NO | - | 累计登录次数 |
| create_time | 创建时间 | datetime | - | YES | NO | - | 账号创建时间 |
| update_time | 更新时间 | datetime | - | YES | NO | - | 信息更新时间 |
| fail_count | 失败次数 | int | - | YES | NO | - | 连续登录失败次数 |
| lock_time | 锁定时间 | datetime | - | YES | NO | - | 账号锁定时间 |
| remark | 备注 | varchar | 255 | YES | NO | - | 备注信息 |

## 字段详细说明

### 主键字段
- **user_id**：用户ID，用户的唯一标识符

### 认证信息字段
- **username**：用户名，登录系统使用的用户名
- **password**：密码，加密存储的用户密码
- **user_type**：用户类型，用户的角色分类

### 基本信息字段
- **real_name**：真实姓名，用户的真实姓名
- **email**：邮箱，用户的电子邮箱
- **phone**：手机号，用户的联系电话

### 状态和统计字段
- **status**：状态，账号的当前状态
- **last_login**：最后登录时间，用户最近一次登录时间
- **login_count**：登录次数，累计登录次数
- **fail_count**：失败次数，连续登录失败次数

### 安全控制字段
- **lock_time**：锁定时间，账号被锁定的时间

### 时间和备注字段
- **create_time**：创建时间，账号创建的时间
- **update_time**：更新时间，信息最后更新时间
- **remark**：备注，其他需要说明的信息

## 用户类型说明

### 用户类型分类（user_type）
| 类型代码 | 类型名称 | 说明 | 主要权限 |
|----------|----------|------|----------|
| ST | 学生 | 在校学生 | 选课、成绩查询、课表查询 |
| TC | 教师 | 任课教师 | 课程管理、成绩录入、课表查看 |
| AD | 管理员 | 系统管理员 | 系统管理、用户管理、数据维护 |
| SE | 教务人员 | 教务管理 | 课程安排、成绩管理、学籍管理 |
| DE | 院系人员 | 院系管理 | 院系内课程管理、学生管理 |
| EX | 外部用户 | 外部访问者 | 有限的信息查询权限 |

### 权限说明
1. **学生权限**：选课、查成绩、看课表、个人信息管理
2. **教师权限**：课程管理、成绩录入、课表查看、教学资源
3. **管理员权限**：系统配置、用户管理、数据维护、系统监控
4. **教务权限**：课程安排、成绩管理、学籍管理、考试安排
5. **院系权限**：院系内教学管理、学生管理、资源分配

## 账号状态说明

### 状态分类（status）
| 状态代码 | 状态名称 | 说明 | 登录权限 |
|----------|----------|------|----------|
| A | 激活 | 账号正常可用 | 允许登录 |
| D | 禁用 | 账号被禁用 | 禁止登录 |
| L | 锁定 | 账号被临时锁定 | 禁止登录 |
| E | 过期 | 账号已过期 | 禁止登录 |
| P | 待激活 | 新账号待激活 | 禁止登录 |

### 状态转换
1. **待激活→激活**：完成账号激活流程
2. **激活→禁用**：管理员禁用账号
3. **激活→锁定**：连续登录失败触发锁定
4. **锁定→激活**：解锁后恢复正常
5. **激活→过期**：账号有效期结束

## 密码安全说明

### 密码存储
- **加密算法**：使用安全的哈希算法（如bcrypt）
- **加盐处理**：每个密码使用独立的盐值
- **不可逆**：存储的是哈希值，无法反向解密
- **定期更新**：建议用户定期更新密码

### 密码策略
- **长度要求**：至少8位字符
- **复杂度要求**：包含大小写字母、数字、特殊字符
- **历史密码**：不能使用最近几次的密码
- **有效期**：密码定期过期需要更新

### 登录安全
- **失败限制**：连续失败5次后锁定账号
- **锁定时间**：首次锁定30分钟，后续递增
- **验证码**：异常登录时需要验证码
- **IP限制**：限制异常IP地址访问

## 登录统计说明

### 登录次数统计
- **累计次数**：用户总的登录次数
- **成功次数**：登录成功的次数
- **失败次数**：登录失败的次数
- **最近登录**：最后一次成功登录的时间

### 登录分析
- **活跃用户**：定期登录的用户
- ** dormant用户**：长期未登录的用户
- **异常登录**：异常时间或地点的登录
- **使用频率**：用户使用系统的频率

## 数据约束

1. **主键约束**：`user_id` 字段必须唯一且非空
2. **唯一约束**：`username` 字段应保持唯一性
3. **非空约束**：`username`, `password` 字段必须非空
4. **检查约束**：`user_type` 应在有效类型范围内
5. **检查约束**：`status` 应在有效状态范围内

## 索引建议

- **主键索引**：`user_id` - 主键自动创建唯一索引
- **用户名索引**：`username` - 建议创建唯一索引，确保用户名唯一性
- **邮箱索引**：`email` - 用于邮箱登录和找回密码
- **手机号索引**：`phone` - 用于手机号登录和验证
- **状态索引**：`status` - 用于按状态筛选用户
- **类型索引**：`user_type` - 用于按用户类型查询
- **登录时间索引**：`last_login` - 用于按登录时间查询

## 数据关联关系

### 主要外键关联
- **学生信息表**：学生用户通过用户ID关联学生基本信息
- **教师信息表**：教师用户通过用户ID关联教师基本信息
- **权限表**：关联用户权限和角色信息

### 业务关联
- **登录日志表**：记录用户登录历史日志
- **操作日志表**：记录用户操作历史
- **权限变更表**：记录权限变更历史
- **密码重置表**：关联密码重置请求

## 使用示例

### SQL查询示例

```sql
-- 查询用户基本信息
SELECT user_id, username, real_name, user_type, email, status, last_login
FROM EDU_USER_LOGIN
WHERE username = 'student001';

-- 查询活跃用户（近30天登录）
SELECT user_id, username, real_name, user_type, login_count, last_login
FROM EDU_USER_LOGIN
WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY last_login DESC;

-- 按用户类型统计
SELECT
    user_type,
    CASE user_type
        WHEN 'ST' THEN '学生'
        WHEN 'TC' THEN '教师'
        WHEN 'AD' THEN '管理员'
        WHEN 'SE' THEN '教务人员'
    END as type_name,
    COUNT(*) as user_count,
    AVG(login_count) as avg_login_count
FROM EDU_USER_LOGIN
WHERE status = 'A'
GROUP BY user_type
ORDER BY user_count DESC;

-- 查询被锁定的账号
SELECT user_id, username, real_name, fail_count, lock_time
FROM EDU_USER_LOGIN
WHERE status = 'L' OR fail_count >= 5
ORDER BY lock_time DESC;

-- 查询新注册用户
SELECT user_id, username, real_name, user_type, create_time
FROM EDU_USER_LOGIN
WHERE create_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY create_time DESC;
```

### 数据插入示例

```sql
INSERT INTO EDU_USER_LOGIN (
    user_id, username, password, user_type, real_name,
    email, phone, status, create_time
) VALUES (
    'ST2024001', 'student001', '$2b$12$hashed_password_here',
    'ST', '张三', 'zhangsan@university.edu.cn',
    '13800138000', 'P', NOW()
);
```

### 用户状态更新示例

```sql
-- 激活用户账号
UPDATE EDU_USER_LOGIN
SET status = 'A', update_time = NOW()
WHERE user_id = 'ST2024001';

-- 锁定用户账号
UPDATE EDU_USER_LOGIN
SET status = 'L', lock_time = NOW(), fail_count = 5
WHERE username = 'student001';

-- 更新登录信息
UPDATE EDU_USER_LOGIN
SET last_login = NOW(), login_count = login_count + 1,
    fail_count = 0
WHERE user_id = 'ST2024001';
```

## 业务逻辑说明

### 用户注册流程
1. **信息填写**：用户填写基本信息
2. **身份验证**：验证用户身份信息
3. **账号创建**：创建用户账号
4. **密码设置**：设置初始密码
5. **邮件激活**：发送激活邮件
6. **账号激活**：用户激活账号

### 登录认证流程
1. **身份验证**：验证用户名和密码
2. **状态检查**：检查账号状态
3. **安全验证**：必要时进行二次验证
4. **登录记录**：记录登录信息
5. **权限获取**：获取用户权限
6. **会话建立**：建立用户会话

### 安全管理
1. **密码策略**：实施强密码策略
2. **登录监控**：监控异常登录行为
3. **账号锁定**：异常行为自动锁定
4. **权限控制**：严格控制用户权限
5. **审计日志**：记录关键操作日志

## 数据维护建议

### 定期维护
1. **密码更新**：提醒用户定期更新密码
2. **状态清理**：清理过期和无效账号
3. **日志清理**：定期清理历史日志
4. **安全审计**：定期进行安全审计

### 异常处理
1. **账号异常**：处理异常登录行为
2. **密码泄露**：处理密码泄露情况
3. **权限异常**：处理权限异常分配
4. **系统故障**：处理认证系统故障

### 安全措施
1. **数据加密**：敏感数据加密存储
2. **访问控制**：严格控制数据访问
3. **备份恢复**：定期备份认证数据
4. **监控告警**：建立安全监控告警

---

**数据来源**：用户认证系统、身份管理系统
**维护单位**：信息化办公室、网络中心
**更新频率**：用户信息变动时实时更新，安全策略定期更新