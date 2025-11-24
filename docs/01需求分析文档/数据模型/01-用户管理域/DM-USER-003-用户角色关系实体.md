# 用户角色关系实体 (UserRole)

---

**实体编号：** DM-USER-003
**实体名称：** 用户角色关系实体
**所属域：** 用户管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

用户角色关系实体是AI助评应用权限管理的关联实体，用于建立用户与角色之间的多对多关系。该实体支持用户拥有多个角色、角色分配给多个用户的关系模式，是实现基于角色的访问控制（RBAC）的核心组件。

## 实体定义

### 表名
- **物理表名：** `dim_user_role`
- **业务表名：** 用户角色关系表
- **数据类型：** 关联表

### 主要用途
- 建立用户与角色的关联关系
- 支持用户多角色管理
- 控制角色生效时间
- 记录角色分配历史

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 关系记录唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| user_id | BIGINT | 20 | NOT NULL | 0 | 用户ID |
| role_id | BIGINT | 20 | NOT NULL | 0 | 角色ID |
| user_no | VARCHAR | 50 | NOT NULL | '' | 用户编号（冗余字段） |
| user_name | VARCHAR | 100 | NOT NULL | '' | 用户姓名（冗余字段） |
| role_code | VARCHAR | 50 | NOT NULL | '' | 角色编码（冗余字段） |
| role_name | VARCHAR | 100 | NOT NULL | '' | 角色名称（冗余字段） |

### 时间管理字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| start_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 角色生效开始时间 |
| end_time | DATETIME | - | NULL | NULL | 角色生效结束时间 |
| is_permanent | TINYINT | 1 | NOT NULL | 1 | 是否永久生效 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| status | ENUM | - | NOT NULL | 'ACTIVE' | 关系状态 |
| is_primary | TINYINT | 1 | NOT NULL | 0 | 是否主角色 |
| is_default | TINYINT | 1 | NOT NULL | 0 | 是否默认角色 |
| is_temporary | TINYINT | 1 | NOT NULL | 0 | 是否临时角色 |

### 授权信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| granted_by | BIGINT | 20 | NOT NULL | 0 | 授权人ID |
| granted_reason | VARCHAR | 500 | NULL | NULL | 授权原因 |
| approval_status | ENUM | - | NOT NULL | 'APPROVED' | 审批状态 |
| approved_by | BIGINT | 20 | NULL | NULL | 审批人ID |
| approved_time | DATETIME | - | NULL | NULL | 审批时间 |
| approval_comments | TEXT | - | NULL | NULL | 审批意见 |

### 权限限制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| data_scope_limit | ENUM | - | NULL | NULL | 数据范围限制 |
| faculty_scope | TEXT | - | NULL | NULL | 院系权限范围（JSON数组） |
| class_scope | TEXT | - | NULL | NULL | 班级权限范围（JSON数组） |
| permission_override | TEXT | - | NULL | NULL | 权限覆盖配置（JSON） |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| last_login_time | DATETIME | - | NULL | NULL | 最后使用角色登录时间 |
| usage_count | INT | 11 | NOT NULL | 0 | 使用次数统计 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_user_role (user_id, role_id, status)
```

### 外键约束
```sql
FOREIGN KEY (user_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (role_id) REFERENCES dim_role(id) ON DELETE CASCADE
FOREIGN KEY (granted_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (approved_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_user_id (user_id)
INDEX idx_role_id (role_id)
INDEX idx_status (status)
INDEX idx_start_time (start_time)
INDEX idx_end_time (end_time)
INDEX idx_granted_by (granted_by)
INDEX idx_approval_status (approval_status)
```

### 检查约束
```sql
CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED', 'REVOKED'))
CHECK (is_permanent IN (0, 1))
CHECK (is_primary IN (0, 1))
CHECK (is_default IN (0, 1))
CHECK (is_temporary IN (0, 1))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED'))
CHECK (data_scope_limit IN ('ALL', 'FACULTY', 'CLASS', 'PERSONAL'))
CHECK (usage_count >= 0)
```

## 枚举值定义

### 关系状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 激活 | 角色关系正常生效 |
| INACTIVE | 未激活 | 角色关系暂时停用 |
| EXPIRED | 已过期 | 角色关系已过期 |
| REVOKED | 已撤销 | 角色关系被撤销 |

### 审批状态 (approval_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PENDING | 待审批 | 等待审批 |
| APPROVED | 已批准 | 审批通过 |
| REJECTED | 已拒绝 | 审批拒绝 |

### 数据范围限制 (data_scope_limit)
| 值 | 说明 | 备注 |
|----|------|------|
| ALL | 全部范围 | 无限制 |
| FACULTY | 院系范围 | 限制在指定院系 |
| CLASS | 班级范围 | 限制在指定班级 |
| PERSONAL | 个人范围 | 仅个人数据 |

## 关联关系

### 多对多关系
- **User ↔ Role**：用户和角色的多对多关系

### 关联查询
- 用户查询其拥有的所有角色
- 角色查询所有分配的用户
- 查询用户的有效角色（考虑时间限制）

## 业务规则

### 角色分配规则
1. 一个用户可以拥有多个角色
2. 一个角色可以分配给多个用户
3. 同一用户不能重复分配相同角色
4. 主角色只能有一个

### 时间生效规则
1. 永久角色不需要设置结束时间
2. 临时角色必须设置开始和结束时间
3. 过期角色自动变为EXPIRED状态
4. 超前设置的角色不会立即生效

### 审批流程规则
1. 系统角色自动审批通过
2. 自定义角色需要审批流程
3. 高权限角色分配需要高级别管理员审批
4. 角色撤销不需要审批

### 权限限制规则
1. 数据范围限制基于角色配置
2. 可进一步限制角色的数据访问范围
3. 院系、班级限制支持多选
4. 权限覆盖需要特殊授权

## 使用示例

### 查询示例

#### 1. 查询用户的所有有效角色
```sql
SELECT
    ur.role_code,
    ur.role_name,
    ur.is_primary,
    ur.is_default,
    ur.data_scope_limit,
    r.role_description
FROM dim_user_role ur
JOIN dim_role r ON ur.role_id = r.id
WHERE ur.user_id = 12345
  AND ur.status = 'ACTIVE'
  AND (ur.is_permanent = 1 OR ur.end_time > NOW())
ORDER BY ur.is_primary DESC, ur.create_time ASC;
```

#### 2. 查询角色的所有用户
```sql
SELECT
    u.user_no,
    u.user_name,
    u.user_type,
    u.faculty_name,
    ur.is_primary,
    ur.granted_time
FROM dim_user_role ur
JOIN dim_user u ON ur.user_id = u.id
WHERE ur.role_id = 1001
  AND ur.status = 'ACTIVE'
  AND (ur.is_permanent = 1 OR ur.end_time > NOW())
ORDER BY u.user_no;
```

#### 3. 查询待审批的角色分配
```sql
SELECT
    ur.id,
    u.user_name,
    r.role_name,
    ur.granted_reason,
    ur.create_time,
    ur.granted_by_name
FROM dim_user_role ur
JOIN dim_user u ON ur.user_id = u.id
JOIN dim_role r ON ur.role_id = r.id
WHERE ur.approval_status = 'PENDING'
ORDER BY ur.create_time DESC;
```

#### 4. 查询过期的角色分配
```sql
SELECT
    u.user_name,
    r.role_name,
    ur.end_time,
    DATEDIFF(NOW(), ur.end_time) as expired_days
FROM dim_user_role ur
JOIN dim_user u ON ur.user_id = u.id
JOIN dim_role r ON ur.role_id = r.id
WHERE ur.status = 'ACTIVE'
  AND ur.is_permanent = 0
  AND ur.end_time < NOW()
ORDER BY ur.end_time;
```

### 插入示例

#### 1. 分配系统角色
```sql
INSERT INTO dim_user_role (
    user_id, role_id, user_no, user_name,
    role_code, role_name,
    start_time, is_permanent,
    status, is_default,
    granted_by, granted_reason,
    approval_status, approved_by, approved_time
) VALUES (
    12345, 1001, 'T20230001', '张老师',
    'TEACHER', '教师',
    NOW(), 1,
    'ACTIVE', 1,
    1, '教师用户默认角色',
    'APPROVED', 1, NOW()
);
```

#### 2. 分配临时角色
```sql
INSERT INTO dim_user_role (
    user_id, role_id, user_no, user_name,
    role_code, role_name,
    start_time, end_time, is_permanent,
    is_temporary, status,
    granted_by, granted_reason,
    data_scope_limit, faculty_scope
) VALUES (
    12345, 1002, 'T20230001', '张老师',
    'TEMP_ADMIN', '临时管理员',
    NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 0,
    1, 'ACTIVE',
    1, '系统维护期间临时管理权限',
    'FACULTY', '[1001]'
);
```

### 更新示例

#### 1. 设置主角色
```sql
UPDATE dim_user_role
SET is_primary = 1,
    update_time = NOW()
WHERE user_id = 12345
  AND role_id = 1001;

UPDATE dim_user_role
SET is_primary = 0,
    update_time = NOW()
WHERE user_id = 12345
  AND role_id != 1001;
```

#### 2. 审批角色分配
```sql
UPDATE dim_user_role
SET approval_status = 'APPROVED',
    approved_by = 1001,
    approved_time = NOW(),
    status = 'ACTIVE',
    approval_comments = '审批通过，角色分配合理',
    update_time = NOW()
WHERE id = 12345;
```

#### 3. 撤销角色分配
```sql
UPDATE dim_user_role
SET status = 'REVOKED',
    end_time = NOW(),
    update_time = NOW()
WHERE user_id = 12345
  AND role_id = 1002;
```

### 删除示例

#### 1. 删除无效的角色关系
```sql
DELETE FROM dim_user_role
WHERE status = 'EXPIRED'
  AND end_time < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

## 数据质量

### 质量检查规则
1. **完整性检查**：用户ID和角色ID不能为空
2. **一致性检查**：用户和角色必须存在
3. **逻辑检查**：结束时间不能早于开始时间
4. **唯一性检查**：同一用户不能有重复的活跃角色

### 数据清洗规则
1. **过期数据处理**：定期清理过期的角色关系
2. **孤儿数据处理**：处理用户或角色被删除后的关系数据
3. **重复数据处理**：删除重复的角色分配记录
4. **状态同步**：保持角色状态与时间限制的一致性

## 性能优化

### 索引优化
- 复合索引优化常用查询组合
- 时间字段索引支持过期检查
- 状态字段索引支持状态过滤

### 查询优化
- 使用覆盖索引减少回表
- 避免大结果集查询
- 合理使用分页查询

### 数据归档
- 定期归档历史角色关系数据
- 保持在线表的数据量在合理范围
- 建立历史数据查询机制

## 安全考虑

### 权限控制
- 角色分配操作需要管理员权限
- 高权限角色分配需要特殊审批
- 操作日志完整记录

### 数据保护
- 敏感角色关系加密存储
- 定期审计角色分配情况
- 异常分配自动告警

## 扩展说明

### 未来扩展方向
1. **条件角色**：基于条件的自动角色分配
2. **角色继承**：支持角色的自动继承
3. **动态权限**：支持动态权限扩展
4. **角色模板**：支持角色分配模板

### 兼容性说明
- 支持与外部身份系统集成
- 支持LDAP/AD角色映射
- 支持单点登录角色同步

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*