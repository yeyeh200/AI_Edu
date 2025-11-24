# 权限定义实体 (Permission)

---

**实体编号：** DM-USER-005
**实体名称：** 权限定义实体
**所属域：** 用户管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

权限定义实体是AI助评应用权限管理的原子实体，定义了系统中的所有操作权限。该实体基于资源-操作模型设计，支持细粒度的权限控制，是实现基于角色的访问控制（RBAC）的基础组件。

## 实体定义

### 表名
- **物理表名：** `dim_permission`
- **业务表名：** 权限定义表
- **数据类型：** 维度表

### 主要用途
- 定义系统操作权限
- 支持权限分类管理
- 提供权限查询接口
- 支持权限审计

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 权限唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| permission_code | VARCHAR | 100 | NOT NULL | '' | 权限编码（系统唯一） |
| permission_name | VARCHAR | 200 | NOT NULL | '' | 权限名称 |
| permission_display_name | VARCHAR | 300 | NOT NULL | '' | 权限显示名称 |
| permission_description | TEXT | - | NULL | NULL | 权限描述 |
| permission_category | ENUM | - | NOT NULL | 'FUNCTION' | 权限类别 |

### 权限结构字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| resource_type | VARCHAR | 50 | NOT NULL | '' | 资源类型 |
| resource_path | VARCHAR | 200 | NOT NULL | '' | 资源路径 |
| action_type | VARCHAR | 50 | NOT NULL | '' | 操作类型 |
| action_name | VARCHAR | 100 | NOT NULL | '' | 操作名称 |
| full_permission_code | VARCHAR | 500 | NOT NULL | '' | 完整权限编码 |

### 层级关系字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| parent_id | BIGINT | 20 | NULL | NULL | 父权限ID |
| permission_level | INT | 11 | NOT NULL | 1 | 权限层级 |
| sort_order | INT | 11 | NOT NULL | 0 | 排序顺序 |
| is_leaf | TINYINT | 1 | NOT NULL | 1 | 是否叶子节点 |

### 控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| is_system | TINYINT | 1 | NOT NULL | 0 | 是否系统权限 |
| is_builtin | TINYINT | 1 | NOT NULL | 0 | 是否内置权限 |
| is_sensitive | TINYINT | 1 | NOT NULL | 0 | 是否敏感权限 |
| is_required | TINYINT | 1 | NOT NULL | 0 | 是否必需权限 |
| status | ENUM | - | NOT NULL | 'ACTIVE' | 权限状态 |

### 业务规则字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| risk_level | ENUM | - | NOT NULL | 'LOW' | 风险等级 |
| audit_required | TINYINT | 1 | NOT NULL | 0 | 是否需要审计 |
| approval_required | TINYINT | 1 | NOT NULL | 0 | 是否需要审批 |
| max_concurrent | INT | 11 | NULL | NULL | 最大并发数 |
| rate_limit | INT | 11 | NULL | NULL | 速率限制（次/分钟） |

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
UNIQUE KEY uk_permission_code (permission_code)
UNIQUE KEY uk_full_permission_code (full_permission_code)
```

### 普通索引
```sql
INDEX idx_permission_category (permission_category)
INDEX idx_resource_type (resource_type)
INDEX idx_action_type (action_type)
INDEX idx_parent_id (parent_id)
INDEX idx_status (status)
INDEX idx_is_system (is_system)
```

### 检查约束
```sql
CHECK (permission_category IN ('FUNCTION', 'DATA', 'PAGE', 'API', 'MENU', 'BUTTON'))
CHECK (permission_level BETWEEN 1 AND 5)
CHECK (is_leaf IN (0, 1))
CHECK (is_system IN (0, 1))
CHECK (is_builtin IN (0, 1))
CHECK (is_sensitive IN (0, 1))
CHECK (is_required IN (0, 1))
CHECK (status IN ('ACTIVE', 'INACTIVE', 'DEPRECATED'))
CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
CHECK (audit_required IN (0, 1))
CHECK (approval_required IN (0, 1))
```

## 枚举值定义

### 权限类别 (permission_category)
| 值 | 说明 | 备注 |
|----|------|------|
| FUNCTION | 功能权限 | 业务功能操作权限 |
| DATA | 数据权限 | 数据访问权限 |
| PAGE | 页面权限 | 页面访问权限 |
| API | API权限 | 接口访问权限 |
| MENU | 菜单权限 | 菜单显示权限 |
| BUTTON | 按钮权限 | 按钮操作权限 |

### 权限状态 (status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 激活 | 权限正常使用 |
| INACTIVE | 未激活 | 权限暂时停用 |
| DEPRECATED | 已废弃 | 权限已废弃 |

### 风险等级 (risk_level)
| 值 | 说明 | 备注 |
|----|------|------|
| LOW | 低风险 | 普通操作权限 |
| MEDIUM | 中风险 | 重要操作权限 |
| HIGH | 高风险 | 敏感操作权限 |
| CRITICAL | 严重风险 | 核心操作权限 |

## 权限编码规范

### 编码格式
```
{category}:{resource_type}.{resource_path}:{action_type}
```

### 编码示例
- `FUNCTION:evaluation.create` - 创建评价功能权限
- `DATA:student.read:personal` - 读取个人学生数据权限
- `PAGE:dashboard.view` - 查看仪表盘页面权限
- `API:evaluation.get` - 获取评价API权限
- `MENU:system.config` - 系统配置菜单权限

### 常用资源类型
| 资源类型 | 说明 | 示例 |
|----------|------|------|
| evaluation | 评价管理 | evaluation, evaluation.record |
| user | 用户管理 | user, user.profile |
| course | 课程管理 | course, course.schedule |
| report | 报表管理 | report, report.export |
| system | 系统管理 | system, system.config |
| dashboard | 仪表盘 | dashboard, dashboard.view |

### 常用操作类型
| 操作类型 | 说明 | 示例 |
|----------|------|------|
| create | 创建 | create, add |
| read | 读取 | read, view, list |
| update | 更新 | update, edit |
| delete | 删除 | delete, remove |
| export | 导出 | export, download |
| import | 导入 | import, upload |
| approve | 审批 | approve, reject |

## 默认权限定义

### 系统管理权限
1. **用户管理**
   - `FUNCTION:user.create` - 创建用户
   - `FUNCTION:user.update` - 更新用户
   - `FUNCTION:user.delete` - 删除用户
   - `FUNCTION:user.role.assign` - 分配用户角色

2. **角色权限管理**
   - `FUNCTION:role.create` - 创建角色
   - `FUNCTION:role.update` - 更新角色
   - `FUNCTION:role.delete` - 删除角色
   - `FUNCTION:role.permission.assign` - 分配角色权限

3. **系统配置**
   - `FUNCTION:system.config.read` - 读取系统配置
   - `FUNCTION:system.config.update` - 更新系统配置
   - `FUNCTION:system.backup` - 系统备份
   - `FUNCTION:system.restore` - 系统恢复

### 教学管理权限
1. **课程管理**
   - `FUNCTION:course.create` - 创建课程
   - `FUNCTION:course.update` - 更新课程
   - `FUNCTION:course.delete` - 删除课程
   - `FUNCTION:course.schedule` - 课程安排

2. **评价管理**
   - `FUNCTION:evaluation.create` - 创建评价
   - `FUNCTION:evaluation.update` - 更新评价
   - `FUNCTION:evaluation.delete` - 删除评价
   - `FUNCTION:evaluation.publish` - 发布评价结果

3. **报表管理**
   - `FUNCTION:report.generate` - 生成报表
   - `FUNCTION:report.export` - 导出报表
   - `FUNCTION:report.view` - 查看报表
   - `FUNCTION:report.share` - 分享报表

### 数据访问权限
1. **个人数据**
   - `DATA:profile.read:personal` - 读取个人档案
   - `DATA:profile.update:personal` - 更新个人档案
   - `DATA:evaluation.read:personal` - 读取个人评价结果

2. **班级数据**
   - `DATA:student.read:class` - 读取班级学生数据
   - `DATA:attendance.read:class` - 读取班级考勤数据
   - `DATA:score.read:class` - 读取班级成绩数据

3. **院系数据**
   - `DATA:teacher.read:faculty` - 读取院系教师数据
   - `DATA:course.read:faculty` - 读取院系课程数据
   - `DATA:evaluation.read:faculty` - 读取院系评价数据

## 关联关系

### 多对多关系
- **Permission ↔ Role**：权限与角色的多对多关系（通过角色权限关联表）

### 层级关系
- **Permission（parent_id） → Permission**：权限层级关系

## 使用示例

### 查询示例

#### 1. 查询所有功能权限
```sql
SELECT
    permission_code,
    permission_display_name,
    resource_type,
    action_type,
    risk_level,
    audit_required
FROM dim_permission
WHERE permission_category = 'FUNCTION'
  AND status = 'ACTIVE'
ORDER BY resource_type, action_type;
```

#### 2. 查询敏感权限
```sql
SELECT
    permission_code,
    permission_display_name,
    permission_description,
    risk_level,
    approval_required
FROM dim_permission
WHERE is_sensitive = 1
  AND status = 'ACTIVE'
ORDER BY risk_level DESC;
```

#### 3. 查询权限层级结构
```sql
WITH RECURSIVE permission_tree AS (
    SELECT
        id, permission_code, permission_display_name,
        parent_id, permission_level, 0 as depth
    FROM dim_permission
    WHERE parent_id IS NULL
      AND status = 'ACTIVE'

    UNION ALL

    SELECT
        p.id, p.permission_code, p.permission_display_name,
        p.parent_id, p.permission_level, pt.depth + 1
    FROM dim_permission p
    JOIN permission_tree pt ON p.parent_id = pt.id
    WHERE p.status = 'ACTIVE'
)
SELECT
    permission_code,
    permission_display_name,
    permission_level,
    depth,
    REPEAT('  ', depth) || permission_display_name as display_name
FROM permission_tree
ORDER BY permission_level, sort_order;
```

#### 4. 查询用户权限
```sql
SELECT DISTINCT
    p.permission_code,
    p.permission_display_name,
    p.permission_category,
    p.resource_type,
    p.action_type
FROM dim_permission p
JOIN dim_role_permission rp ON p.id = rp.permission_id
JOIN dim_user_role ur ON rp.role_id = ur.role_id
WHERE ur.user_id = 12345
  AND ur.status = 'ACTIVE'
  AND p.status = 'ACTIVE'
ORDER BY p.permission_category, p.resource_type;
```

### 插入示例

#### 1. 创建功能权限
```sql
INSERT INTO dim_permission (
    permission_code, permission_name, permission_display_name,
    permission_description, permission_category,
    resource_type, resource_path, action_type, action_name,
    full_permission_code,
    permission_level, is_leaf, is_system, is_builtin,
    risk_level, audit_required,
    create_by
) VALUES (
    'FUNCTION:evaluation.create',
    '创建评价',
    '创建教学质量评价',
    '创建新的教学质量评价记录',
    'FUNCTION',
    'evaluation',
    'evaluation',
    'create',
    '创建',
    'FUNCTION:evaluation.create',
    1, 1, 1, 1,
    'MEDIUM', 1,
    1
);
```

#### 2. 创建数据权限
```sql
INSERT INTO dim_permission (
    permission_code, permission_name, permission_display_name,
    permission_description, permission_category,
    resource_type, resource_path, action_type, action_name,
    full_permission_code,
    permission_level, is_leaf, is_system,
    risk_level, approval_required,
    create_by
) VALUES (
    'DATA:student.read:faculty',
    '读取院系学生数据',
    '读取本院系学生基础数据',
    '查看本院系所有学生的基本信息',
    'DATA',
    'student',
    'student',
    'read',
    '读取',
    'DATA:student.read:faculty',
    1, 1, 1,
    'MEDIUM', 0,
    1
);
```

### 更新示例

#### 1. 更新权限风险等级
```sql
UPDATE dim_permission
SET risk_level = 'HIGH',
    audit_required = 1,
    approval_required = 1,
    update_time = NOW(),
    version = version + 1
WHERE permission_code = 'FUNCTION:user.delete';
```

#### 2. 权限废弃
```sql
UPDATE dim_permission
SET status = 'DEPRECATED',
    update_time = NOW(),
    version = version + 1
WHERE permission_code IN (
    'FUNCTION:legacy.import',
    'FUNCTION:legacy.export'
);
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：权限编码必须唯一
2. **格式检查**：权限编码格式必须正确
3. **层级检查**：权限层级关系必须正确
4. **完整性检查**：必要字段不能为空

### 数据清洗规则
1. **重复数据处理**：删除重复的权限定义
2. **格式标准化**：统一权限编码格式
3. **层级修正**：修复权限层级关系
4. **状态同步**：保持权限状态一致性

## 性能优化

### 索引优化
- 权限编码建立唯一索引
- 资源类型和操作类型建立复合索引
- 父权限ID建立索引支持层级查询

### 查询优化
- 使用递归CTE查询权限层级
- 权限检查使用内存缓存
- 避免复杂的权限关联查询

### 缓存策略
- 权限定义信息缓存到Redis
- 用户权限关系缓存到内存
- 定时刷新权限缓存

## 安全考虑

### 权限控制
- 权限定义操作需要超级管理员权限
- 敏感权限修改需要审批流程
- 权限变更记录完整审计日志

### 数据保护
- 权限定义数据加密存储
- 权限验证过程安全防护
- 防止权限提升攻击

## 扩展说明

### 未来扩展方向
1. **动态权限**：支持基于条件的动态权限
2. **权限模板**：支持权限模板和批量分配
3. **权限继承**：支持权限自动继承机制
4. **权限分析**：增强权限使用分析和审计

### 兼容性说明
- 支持与外部权限系统集成
- 支持RBAC标准协议
- 支持OAuth2.0权限模型

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*