# 用户基本信息实体 (User)

---

**实体编号：** DM-USER-001
**实体名称：** 用户基本信息实体
**所属域：** 用户管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

用户基本信息实体是AI助评应用的核心基础实体，存储系统中所有用户的基本身份信息。该实体支持教师、学生、管理员、督导专家等多种用户类型，是整个系统用户身份管理和权限控制的基础。

## 实体定义

### 表名
- **物理表名：** `dim_user`
- **业务表名：** 用户基本信息表
- **数据类型：** 维度表

### 主要用途
- 统一用户身份管理
- 支持多种用户类型
- 提供用户基本信息查询
- 支持用户统计分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 用户唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| user_no | VARCHAR | 50 | NOT NULL | '' | 用户编号（工号/学号） |
| username | VARCHAR | 100 | NOT NULL | '' | 用户登录名 |
| user_name | VARCHAR | 100 | NOT NULL | '' | 用户真实姓名 |
| user_type | ENUM | - | NOT NULL | 'STUDENT' | 用户类型 |
| gender | ENUM | - | NULL | 'UNKNOWN' | 性别 |
| birth_date | DATE | - | NULL | NULL | 出生日期 |
| id_card | VARCHAR | 18 | NULL | NULL | 身份证号（加密存储） |
| phone | VARCHAR | 20 | NULL | NULL | 联系电话 |
| email | VARCHAR | 100 | NULL | NULL | 电子邮箱 |

### 组织信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| faculty_id | BIGINT | 20 | NULL | NULL | 所属院系ID |
| faculty_name | VARCHAR | 200 | NULL | NULL | 所属院系名称 |
| major_id | BIGINT | 20 | NULL | NULL | 所属专业ID |
| major_name | VARCHAR | 200 | NULL | NULL | 所属专业名称 |
| class_id | BIGINT | 20 | NULL | NULL | 所属班级ID |
| class_name | VARCHAR | 200 | NULL | NULL | 所属班级名称 |
| grade | VARCHAR | 20 | NULL | NULL | 年级 |
| enrollment_date | DATE | - | NULL | NULL | 入学/入职日期 |

### 状态信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| status | ENUM | - | NOT NULL | 'ACTIVE' | 用户状态 |
| is_active | TINYINT | 1 | NOT NULL | 1 | 是否激活（1-是，0-否） |
| is_deleted | TINYINT | 1 | NOT NULL | 0 | 是否删除（1-是，0-否） |
| last_login_time | DATETIME | - | NULL | NULL | 最后登录时间 |
| last_login_ip | VARCHAR | 50 | NULL | NULL | 最后登录IP |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_user_no (user_no)
UNIQUE KEY uk_username (username)
```

### 普通索引
```sql
INDEX idx_user_type (user_type)
INDEX idx_status (status)
INDEX idx_faculty_id (faculty_id)
INDEX idx_major_id (major_id)
INDEX idx_class_id (class_id)
INDEX idx_create_time (create_time)
```

### 检查约束
```sql
CHECK (user_type IN ('TEACHER', 'STUDENT', 'ADMIN', 'EXPERT'))
CHECK (gender IN ('MALE', 'FEMALE', 'UNKNOWN'))
CHECK (status IN ('ACTIVE', 'INACTIVE', 'GRADUATED', 'RESIGNED'))
CHECK (is_active IN (0, 1))
CHECK (is_deleted IN (0, 1))
```

## 枚举值定义

### 用户类型 (user_type)
| 值 | 说明 | 备注 |
|----|------|------|
| TEACHER | 教师 | 教学人员 |
| STUDENT | 学生 | 在校学生 |
| ADMIN | 管理员 | 系统管理员 |
| EXPERT | 督导专家 | 教学督导 |

### 性别 (gender)
| 值 | 说明 | 备注 |
|----|------|------|
| MALE | 男 | 男性 |
| FEMALE | 女 | 女性 |
| UNKNOWN | 未知 | 未填写或不愿透露 |

### 用户状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 激活 | 正常使用状态 |
| INACTIVE | 未激活 | 待激活或停用 |
| GRADUATED | 已毕业 | 学生毕业状态 |
| RESIGNED | 已离职 | 教师离职状态 |

## 关联关系

### 一对多关系（作为主表）
- **User → UserProfile**：一个用户有一个详细档案
- **User → UserRole**：一个用户有多个角色
- **User → OperationLog**：一个用户产生多条操作日志
- **User → EvaluationRecord**：一个用户参与多个评价记录

### 多对一关系（作为从表）
- **User ← Faculty**：用户属于一个院系
- **User ← Major**：用户属于一个专业
- **User ← Class**：用户属于一个班级

### 自关联关系
- 无

## 数据来源

### 主要数据源
1. **教务系统 (EDU_TEACHER、EDU_STUDENT_INFO)**
   - 教师基本信息
   - 学生基本信息
   - 院系专业班级信息

2. **职教云平台 (t_zjy_base_teacher_user、t_zjy_base_student_user)**
   - 平台用户账号信息
   - 用户权限信息

3. **统一身份认证系统**
   - 用户认证信息
   - 用户状态同步

### 数据同步策略
- **增量同步**：每5分钟同步一次状态变更
- **全量同步**：每日凌晨3点全量同步
- **实时同步**：关键字段变更实时同步

## 业务规则

### 用户编号规则
- 教师编号：T + 年份 + 4位序号（如：T20230001）
- 学生编号：S + 入学年份 + 4位序号（如：S20230001）
- 管理员编号：A + 年份 + 4位序号（如：A20230001）

### 状态转换规则
- 新用户创建后状态为INACTIVE
- 首次登录后状态变为ACTIVE
- 学生毕业时状态变为GRADUATED
- 教师离职时状态变为RESIGNED

### 数据完整性规则
- 所有用户必须有user_no和user_name
- 用户编号必须唯一
- 联系方式至少填写一种（phone或email）

## 使用示例

### 查询示例

#### 1. 查询指定院系的所有教师
```sql
SELECT id, user_no, user_name, faculty_name
FROM dim_user
WHERE user_type = 'TEACHER'
  AND faculty_id = 1001
  AND status = 'ACTIVE'
ORDER BY user_no;
```

#### 2. 查询指定班级的学生统计
```sql
SELECT
    class_name,
    COUNT(*) as student_count,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_count
FROM dim_user
WHERE user_type = 'STUDENT'
  AND class_id = 2001
  AND is_deleted = 0
GROUP BY class_name;
```

#### 3. 查询用户登录统计
```sql
SELECT
    user_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN last_login_time >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as active_users_7d,
    COUNT(CASE WHEN last_login_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_users_30d
FROM dim_user
WHERE is_deleted = 0
GROUP BY user_type;
```

### 插入示例

#### 1. 新增学生用户
```sql
INSERT INTO dim_user (
    user_no, username, user_name, user_type, gender,
    faculty_id, faculty_name, major_id, major_name,
    class_id, class_name, grade, enrollment_date,
    phone, email, create_by
) VALUES (
    'S20230001', 'student001', '张三', 'STUDENT', 'MALE',
    1001, '计算机学院', 2001, '软件工程',
    3001, '软件工程2023-1班', '2023', '2023-09-01',
    '13800138000', 'zhangsan@example.com', 1
);
```

### 更新示例

#### 1. 更新用户最后登录信息
```sql
UPDATE dim_user
SET last_login_time = NOW(),
    last_login_ip = '192.168.1.100',
    update_time = NOW(),
    update_by = 1
WHERE id = 12345;
```

## 性能优化

### 索引优化
- 用户编号和登录名建立唯一索引，支持快速查找
- 院系、专业、班级建立普通索引，支持分组统计
- 状态字段建立索引，支持状态过滤查询

### 查询优化
- 避免SELECT *，只查询需要的字段
- 使用索引字段作为WHERE条件
- 分页查询使用LIMIT限制结果集

### 存储优化
- 身份证号等敏感信息加密存储
- 定期清理已删除用户的数据
- 使用分区表按时间范围分区

## 数据质量

### 质量检查规则
1. **完整性检查**：必填字段不能为空
2. **唯一性检查**：用户编号和登录名必须唯一
3. **格式检查**：邮箱、电话格式必须正确
4. **关联检查**：院系、专业、班级ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复用户记录
2. **异常数据处理**：标记并处理异常状态用户
3. **数据标准化**：统一用户命名规范
4. **缺失数据补全**：补全缺失的关联信息

## 安全考虑

### 数据加密
- 身份证号使用AES-256加密存储
- 密码字段使用bcrypt哈希存储
- 敏感信息传输使用HTTPS加密

### 访问控制
- 基于角色的数据访问控制
- 敏感字段需要特殊权限查看
- 数据操作记录完整审计日志

### 隐私保护
- 遵循《个人信息保护法》要求
- 最小化数据收集原则
- 用户数据使用授权管理

## 扩展说明

### 未来扩展方向
1. **多租户支持**：增加租户字段支持多校区
2. **用户标签**：增加用户标签体系支持精准画像
3. **社会化登录**：支持第三方账号登录集成
4. **生物识别**：集成指纹、人脸等生物识别信息

### 兼容性说明
- 支持与学校统一身份认证系统集成
- 支持与教务系统数据同步
- 支持与职教云平台用户映射

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*