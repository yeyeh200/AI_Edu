# SCORE_TEAM_SCHOOL 团体赛成绩录入（校级赛）数据字典

## 1. 基本信息

| 项目 | 内容 |
|------|------|
| 标准表名 | SCORE_TEAM_SCHOOL |
| 原表名 | t_approve_data_6586_124117_1729113877063_end |
| 表用途 | 团体赛成绩录入（校级赛）主表，存储校级团体赛项目的基本信息和获奖情况 |
| 字段数量 | 15个字段 |
| 数据类别 | 成绩管理数据 |
| 所属模块 | 03-成绩管理 |

## 2. 字段定义

| 序号 | 原字段名 | 标准字段名 | 字段说明 | 字段类型 | 长度 | 主键 | 约束 |
|------|----------|------------|----------|----------|------|------|------|
| 1 | formUserId | formUserId | 表单数据唯一标识 | bigint | 20 | 是 | NOT NULL |
| 2 | formId | formId | 表单ID | bigint | 20 | 否 | NOT NULL |
| 3 | formName | formName | 表单名称 | varchar | 765 | 否 | |
| 4 | uname | submitterName | 提交人姓名 | varchar | 90 | 否 | |
| 5 | uid | submitterId | 表单创建者PUID | bigint | 20 | 否 | |
| 6 | inserttime | insertTimestamp | 提交时间戳 | bigint | 20 | 否 | |
| 7 | updatetime | updateTimestamp | 修改时间戳 | bigint | 20 | 否 | |
| 8 | opUpdTime | syncTimestamp | 数据同步到仓库变动时间戳 | bigint | 20 | 否 | |
| 9 | title | title | 标题 | varchar | 765 | 否 | |
| 10 | completetime | approvalCompleteTime | 审批完成时间 | bigint | 20 | 否 | |
| 11 | aprvStatus | approvalStatus | 审批状态 | varchar | 60 | 否 | |
| 12 | aprvStatusId | approvalStatusId | 审批状态ID | bigint | 20 | 否 | |
| 13 | ApprovalProcess | approvalProcess | 审批人 | varchar | 1048576 | 否 | |
| 14 | CCUsers | ccUsers | 抄送人 | varchar | 1048576 | 否 | |
| 15 | fid | organizationId | 单位ID | bigint | 20 | 否 | |
| 16 | pageLinkUrl | pageLinkUrl | 页面地址 | varchar | 765 | 否 | |
| 17 | 14 | academicYear | 学年 | varchar | 65533 | 否 | |
| 18 | 15 | competitionName | 赛项名称 | varchar | 65533 | 否 | |

## 3. 字段详细说明

### 3.1 系统字段

- **formUserId**: 表单数据的唯一标识符，作为主键使用
- **formId**: 关联的表单ID，用于表单管理
- **formName**: 表单名称，用于业务识别
- **submitterName**: 提交表单的用户姓名
- **submitterId**: 提交表单的用户唯一标识
- **insertTimestamp**: 记录创建时的时间戳
- **updateTimestamp**: 记录最后修改时的时间戳
- **syncTimestamp**: 数据同步到数据仓库的时间戳
- **approvalCompleteTime**: 审批流程完成的时间戳
- **approvalStatus**: 当前审批状态（如：待审批、已通过、已驳回等）
- **approvalStatusId**: 审批状态的数字化ID
- **approvalProcess**: 审批人列表和流程信息
- **ccUsers**: 抄送人员列表
- **organizationId**: 所属组织单位的ID
- **pageLinkUrl**: 关联页面的链接地址

### 3.2 业务字段

- **title**: 成绩录入的标题，通常包含赛事名称等关键信息
- **academicYear**: 学年信息，如"2024-2025"
- **competitionName**: 具体的赛项名称，如"数学建模竞赛"

## 4. 业务逻辑说明

### 4.1 数据流转
1. 用户提交团体赛成绩录入申请
2. 系统生成唯一formUserId作为主键
3. 记录提交人信息（submitterName, submitterId）
4. 记录提交时间（insertTimestamp）
5. 进入审批流程，记录审批相关信息
6. 审批完成后更新审批状态和时间
7. 数据同步到数据仓库，记录同步时间

### 4.2 关联关系
- 与SCORE_STUDENT_TEAM表形成主从关系，通过formUserId关联
- 一个团体赛成绩记录可以包含多个学生参赛记录

## 5. 数据约束

### 5.1 主键约束
- formUserId 表单数据唯一标识，作为主键

### 5.2 非空约束
- formUserId 必须不为空
- formId 必须不为空

### 5.3 业务约束
- academicYear 学年信息必须符合学年格式规范
- competitionName 赛项名称不能为空
- approvalStatus 审批状态必须在预定义状态列表内

## 6. 索引建议

### 6.1 主键索引
- PRIMARY KEY (formUserId)

### 6.2 业务索引
- INDEX idx_competition_year (competitionName, academicYear) - 用于按赛项和学年查询
- INDEX idx_approval_status (approvalStatusId) - 用于按审批状态筛选
- INDEX idx_submitter (submitterId) - 用于按提交人查询
- INDEX idx_organization (organizationId) - 用于按单位查询
- INDEX idx_insert_time (insertTimestamp) - 用于按提交时间排序

## 7. 数据关联关系

### 7.1 一对多关系
- SCORE_TEAM_SCHOOL → SCORE_STUDENT_TEAM (1:N)
  - 关联字段：formUserId
  - 说明：一个团体赛成绩记录对应多个学生参赛记录

### 7.2 外部关联
- 与组织表关联：organizationId
- 与用户表关联：submitterId
- 与表单管理表关联：formId

## 8. SQL使用示例

### 8.1 查询示例

```sql
-- 查询特定学年的所有团体赛成绩
SELECT
    formUserId,
    competitionName,
    academicYear,
    approvalStatus,
    submitterName,
    title
FROM SCORE_TEAM_SCHOOL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
ORDER BY insertTimestamp DESC;

-- 查询某个赛项的获奖情况
SELECT
    competitionName,
    COUNT(*) as team_count,
    submitterName,
    approvalCompleteTime
FROM SCORE_TEAM_SCHOOL
WHERE competitionName LIKE '%数学建模%'
    AND approvalStatus = '已通过'
GROUP BY competitionName, submitterName, approvalCompleteTime
ORDER BY approvalCompleteTime DESC;

-- 统计各单位提交的团体赛成绩数量
SELECT
    organizationId,
    COUNT(*) as submission_count
FROM SCORE_TEAM_SCHOOL
WHERE academicYear = '2024-2025'
GROUP BY organizationId
ORDER BY submission_count DESC;
```

### 8.2 关联查询示例

```sql
-- 查询团体赛成绩及其包含的学生信息
SELECT
    t.competitionName,
    t.academicYear,
    t.title,
    s.18 as student_name,  -- 从子表获取学生姓名
    s.19 as student_number,  -- 从子表获取学号
    s.26 as team_name,  -- 从子表获取团队名称
    s.23 as award_level  -- 从子表获取获奖等级
FROM SCORE_TEAM_SCHOOL t
LEFT JOIN SCORE_STUDENT_TEAM s ON t.formUserId = s.formUserId
WHERE t.academicYear = '2024-2025'
    AND t.approvalStatus = '已通过'
ORDER BY t.competitionName, s.26;
```

## 9. 数据维护建议

### 9.1 数据质量管理
- 定期检查approvalStatus字段的数据一致性
- 验证academicYear字段格式的规范性
- 监控formUserId字段的唯一性约束

### 9.2 性能优化建议
- 定期分析查询模式，优化索引策略
- 对于大数据量查询，建议按时间范围或审批状态进行分区
- 考虑对历史数据进行归档处理

### 9.3 数据备份与恢复
- 建议按学年进行数据备份
- 重要审批状态变更应记录操作日志
- 建立数据恢复的应急预案

### 9.4 数据安全建议
- 对学生个人信息进行脱敏处理
- 限制对敏感审批数据的访问权限
- 记录所有数据修改操作的审计日志