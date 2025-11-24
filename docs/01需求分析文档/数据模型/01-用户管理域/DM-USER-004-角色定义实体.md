# 角色定义实体 (Role)

---

**实体编号：** DM-USER-004
**实体名称：** 角色定义实体
**所属域：** 用户管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

角色定义实体是AI助评应用权限管理的核心实体，定义了系统中的各种角色及其权限配置。该实体基于RBAC（基于角色的访问控制）模型设计，支持灵活的权限分配和管理，确保系统安全和数据访问控制。

## 实体定义

### 表名
- **物理表名：** `dim_role`
- **业务表名：** 角色定义表
- **数据类型：** 维度表

### 主要用途
- 定义系统角色
- 配置角色权限
- 支持权限继承
- 提供角色管理

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 角色唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| role_code | VARCHAR | 50 | NOT NULL | '' | 角色编码（系统唯一） |
| role_name | VARCHAR | 100 | NOT NULL | '' | 角色名称 |
| role_display_name | VARCHAR | 200 | NOT NULL | '' | 角色显示名称 |
| role_description | TEXT | - | NULL | NULL | 角色描述 |
| role_type | ENUM | - | NOT NULL | 'CUSTOM' | 角色类型 |

### 层级关系字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| parent_id | BIGINT | 20 | NULL | NULL | 父角色ID（支持角色继承） |
| role_level | INT | 11 | NOT NULL | 1 | 角色层级（1-5级） |
| sort_order | INT | 11 | NOT NULL | 0 | 排序顺序 |

### 权限配置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| permission_scope | ENUM | - | NOT NULL | 'ALL' | 权限范围 |
| data_scope | ENUM | - | NOT NULL | 'ALL' | 数据访问范围 |
| function_permissions | TEXT | - | NULL | NULL | 功能权限JSON |
| data_permissions | TEXT | - | NULL | NULL | 数据权限JSON |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| status | ENUM | - | NOT NULL | 'ACTIVE' | 角色状态 |
| is_system | TINYINT | 1 | NOT NULL | 0 | 是否系统角色 |
| is_default | TINYINT | 1 | NOT NULL | 0 | 是否默认角色 |
| is_builtin | TINYINT | 1 | NOT NULL | 0 | 是否内置角色 |

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
UNIQUE KEY uk_role_code (role_code)
UNIQUE KEY uk_role_name (role_name)
```

### 普通索引
```sql
INDEX idx_role_type (role_type)
INDEX idx_status (status)
INDEX idx_parent_id (parent_id)
INDEX idx_is_system (is_system)
```

### 检查约束
```sql
CHECK (role_type IN ('SYSTEM', 'CUSTOM', 'TEMP'))
CHECK (status IN ('ACTIVE', 'INACTIVE', 'DELETED'))
CHECK (permission_scope IN ('ALL', 'DEPARTMENT', 'FACULTY', 'CLASS', 'PERSONAL'))
CHECK (data_scope IN ('ALL', 'DEPARTMENT', 'FACULTY', 'CLASS', 'PERSONAL'))
CHECK (is_system IN (0, 1))
CHECK (is_default IN (0, 1))
CHECK (is_builtin IN (0, 1))
```

## 枚举值定义

### 角色类型 (role_type)
| 值 | 说明 | 备注 |
|----|------|------|
| SYSTEM | 系统角色 | 系统预定义角色，不可删除 |
| CUSTOM | 自定义角色 | 用户自定义角色 |
| TEMP | 临时角色 | 临时授权角色 |

### 角色状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 激活 | 角色正常使用 |
| INACTIVE | 未激活 | 角色暂时停用 |
| DELETED | 已删除 | 角色已删除（逻辑删除） |

### 权限范围 (permission_scope)
| 值 | 说明 | 备注 |
|----|------|------|
| ALL | 全部权限 | 拥有所有功能权限 |
| DEPARTMENT | 部门权限 | 部门范围内的权限 |
| FACULTY | 院系权限 | 院系范围内的权限 |
| CLASS | 班级权限 | 班级范围内的权限 |
| PERSONAL | 个人权限 | 仅个人数据权限 |

### 数据访问范围 (data_scope)
| 值 | 说明 | 备注 |
|----|------|------|
| ALL | 全部数据 | 可访问所有数据 |
| DEPARTMENT | 部门数据 | 仅可访问部门数据 |
| FACULTY | 院系数据 | 仅可访问院系数据 |
| CLASS | 班级数据 | 仅可访问班级数据 |
| PERSONAL | 个人数据 | 仅可访问个人数据 |

## 关联关系

### 一对多关系（作为主表）
- **Role → UserRole**：一个角色可以被多个用户拥有
- **Role → RolePermission**：一个角色拥有多个权限
- **Role（parent_id） → Role**：支持角色继承关系

### 多对一关系（作为从表）
- **Role（parent_id） ← Role**：父角色关系

### 自关联关系
- **parent_id**：指向自身，支持无限层级角色继承

## 默认角色定义

### 系统内置角色

#### 1. 超级管理员 (SUPER_ADMIN)
```json
{
  "role_code": "SUPER_ADMIN",
  "role_name": "超级管理员",
  "role_description": "系统超级管理员，拥有所有权限",
  "role_type": "SYSTEM",
  "is_system": 1,
  "is_builtin": 1,
  "permission_scope": "ALL",
  "data_scope": "ALL"
}
```

#### 2. 院系管理员 (FACULTY_ADMIN)
```json
{
  "role_code": "FACULTY_ADMIN",
  "role_name": "院系管理员",
  "role_description": "院系管理员，管理本院系数据和用户",
  "role_type": "SYSTEM",
  "is_system": 1,
  "is_builtin": 1,
  "permission_scope": "DEPARTMENT",
  "data_scope": "FACULTY"
}
```

#### 3. 教师 (TEACHER)
```json
{
  "role_code": "TEACHER",
  "role_name": "教师",
  "role_description": "教师用户，可查看个人教学数据",
  "role_type": "SYSTEM",
  "is_system": 1,
  "is_builtin": 1,
  "permission_scope": "PERSONAL",
  "data_scope": "PERSONAL"
}
```

#### 4. 学生 (STUDENT)
```json
{
  "role_code": "STUDENT",
  "role_name": "学生",
  "role_description": "学生用户，可参与评价和查看个人数据",
  "role_type": "SYSTEM",
  "is_system": 1,
  "is_builtin": 1,
  "permission_scope": "PERSONAL",
  "data_scope": "PERSONAL"
}
```

#### 5. 督导专家 (EXPERT)
```json
{
  "role_code": "EXPERT",
  "role_name": "督导专家",
  "role_description": "教学督导专家，可进行教学评价和分析",
  "role_type": "SYSTEM",
  "is_system": 1,
  "is_builtin": 1,
  "permission_scope": "FACULTY",
  "data_scope": "FACULTY"
}
```

## 权限配置示例

### 功能权限JSON格式
```json
{
  "modules": [
    {
      "module": "evaluation",
      "permissions": ["read", "create", "update"]
    },
    {
      "module": "report",
      "permissions": ["read", "generate", "download"]
    },
    {
      "module": "dashboard",
      "permissions": ["read"]
    }
  ]
}
```

### 数据权限JSON格式
```json
{
  "data_filters": [
    {
      "table": "evaluation_result",
      "scope": "faculty",
      "conditions": ["faculty_id = :current_faculty_id"]
    },
    {
      "table": "user_info",
      "scope": "class",
      "conditions": ["class_id = :current_class_id"]
    }
  ]
}
```

## 使用示例

### 查询示例

#### 1. 查询所有系统角色
```sql
SELECT id, role_code, role_name, role_description
FROM dim_role
WHERE is_system = 1
  AND status = 'ACTIVE'
ORDER BY role_level, sort_order;
```

#### 2. 查询用户的角色信息
```sql
SELECT r.role_code, r.role_name, r.role_description
FROM dim_role r
JOIN dim_user_role ur ON r.id = ur.role_id
WHERE ur.user_id = 12345
  AND r.status = 'ACTIVE'
  AND ur.status = 'ACTIVE';
```

#### 3. 查询角色层级关系
```sql
SELECT
    parent.role_name as parent_role,
    child.role_name as child_role,
    child.role_level
FROM dim_role child
LEFT JOIN dim_role parent ON child.parent_id = parent.id
WHERE child.status = 'ACTIVE'
ORDER BY child.role_level, child.sort_order;
```

#### 4. 查询角色权限配置
```sql
SELECT
    role_name,
    permission_scope,
    data_scope,
    function_permissions,
    data_permissions
FROM dim_role
WHERE role_code = 'TEACHER'
  AND status = 'ACTIVE';
```

### 插入示例

#### 1. 创建自定义角色
```sql
INSERT INTO dim_role (
    role_code, role_name, role_display_name, role_description,
    role_type, role_level, permission_scope, data_scope,
    function_permissions, data_permissions, create_by
) VALUES (
    'CLASS_MONITOR', '班级管理员', '班级管理员', '管理班级事务和班级学生数据',
    'CUSTOM', 3, 'CLASS', 'CLASS',
    '{"modules": [{"module": "student", "permissions": ["read", "update"]}]}',
    '{"data_filters": [{"table": "student_info", "scope": "class", "conditions": ["class_id = :current_class_id"]}]}',
    1
);
```

### 更新示例

#### 1. 更新角色权限配置
```sql
UPDATE dim_role
SET function_permissions = '{"modules": [{"module": "evaluation", "permissions": ["read", "create"]}, {"module": "report", "permissions": ["read"]}]}',
    update_time = NOW(),
    update_by = 1,
    version = version + 1
WHERE id = 1001;
```

## 权限验证流程

### 1. 用户权限检查
```sql
-- 检查用户是否具有指定权限
SELECT COUNT(*) as has_permission
FROM dim_user u
JOIN dim_user_role ur ON u.id = ur.user_id
JOIN dim_role r ON ur.role_id = r.id
WHERE u.id = :user_id
  AND r.status = 'ACTIVE'
  AND ur.status = 'ACTIVE'
  AND JSON_CONTAINS(r.function_permissions,
    JSON_OBJECT('module', :module, 'permissions', JSON_ARRAY(:permission)));
```

### 2. 数据访问范围检查
```sql
-- 检查用户数据访问范围
SELECT r.data_scope, r.data_permissions
FROM dim_user u
JOIN dim_user_role ur ON u.id = ur.user_id
JOIN dim_role r ON ur.role_id = r.id
WHERE u.id = :user_id
  AND r.status = 'ACTIVE'
  AND ur.status = 'ACTIVE';
```

## 业务规则

### 角色继承规则
1. 子角色自动继承父角色的所有权限
2. 子角色可以扩展父角色的权限
3. 子角色不能减少父角色的权限
4. 角色继承层级最多5级

### 权限范围规则
1. ALL权限包含所有其他权限范围
2. DEPARTMENT权限包含FACULTY权限
3. FACULTY权限包含CLASS权限
4. CLASS权限包含PERSONAL权限

### 角色分配规则
1. 用户可以同时拥有多个角色
2. 系统角色不能删除，只能停用
3. 自定义角色可以删除
4. 删除角色前需要解除所有用户绑定

## 性能优化

### 索引优化
- 角色编码建立唯一索引，支持快速查找
- 状态字段建立索引，支持状态过滤
- 父角色ID建立索引，支持层级查询

### 查询优化
- 权限检查使用缓存机制
- 角色关系查询使用递归CTE
- JSON字段查询使用虚拟列

### 缓存策略
- 角色权限信息缓存到Redis
- 用户角色关系缓存到内存
- 定时刷新缓存数据

## 安全考虑

### 权限控制
- 角色管理需要管理员权限
- 敏感角色操作需要二次确认
- 角色变更记录完整审计日志

### 数据保护
- 角色权限配置数据加密存储
- 权限验证过程安全防护
- 防止权限提升攻击

## 扩展说明

### 未来扩展方向
1. **动态权限**：支持基于条件的动态权限
2. **权限模板**：支持权限模板和快速配置
3. **权限审批**：支持权限申请和审批流程
4. **权限审计**：增强权限审计和分析功能

### 兼容性说明
- 支持与学校统一权限系统集成
- 支持LDAP/AD域用户角色映射
- 支持第三方系统角色同步

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*