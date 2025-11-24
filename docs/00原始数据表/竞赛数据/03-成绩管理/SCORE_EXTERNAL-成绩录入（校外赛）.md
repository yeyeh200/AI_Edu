# SCORE_EXTERNAL 成绩录入（校外赛）数据字典

## 1. 基本信息

| 项目 | 内容 |
|------|------|
| 标准表名 | SCORE_EXTERNAL |
| 原表名 | t_approve_data_6586_118264_1729113909047_end |
| 表用途 | 成绩录入（校外赛）主表，存储校外竞赛项目的基本信息和获奖情况 |
| 字段数量 | 23个字段 |
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
| 17 | 36 | academicYear | 学年 | varchar | 65533 | 否 | |
| 18 | 37 | competitionCategory | 竞赛类别 | varchar | 65533 | 否 | |
| 19 | 39 | competitionName | 赛项名称 | varchar | 65533 | 否 | |
| 20 | 44 | competitionNameLevel | 赛项名称等级 | varchar | 65533 | 否 | |
| 21 | 45 | competitionNameEnglish | 赛项名称英文 | varchar | 65533 | 否 | |
| 22 | 24 | subCompetitionName | 分赛项名称 | varchar | 1048576 | 否 | |
| 23 | 20 | awardMonth | 获奖月份 | varchar | 1048576 | 否 | |
| 24 | 13 | organizer | 主办单位 | varchar | 1048576 | 否 | |
| 25 | 40 | competitionLevel | 竞赛级别 | varchar | 65533 | 否 | |
| 26 | 41 | competitionType | 竞赛类型 | varchar | 65533 | 否 | |
| 27 | 42 | competitionClass | 竞赛分类 | varchar | 65533 | 否 | |
| 28 | 43 | isSpecialtyCompetition | 是否为一专一赛赛项 | varchar | 65533 | 否 | |
| 29 | 10 | competitionTrack | 竞赛赛道 | varchar | 65533 | 否 | |

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
- **title**: 成绩录入的标题，通常包含赛事名称等关键信息

### 3.2 基本业务字段

- **academicYear**: 学年信息，如"2024-2025"
- **awardMonth**: 获奖月份，记录获奖的具体时间

### 3.3 竞赛信息字段

- **competitionCategory**: 竞赛类别，如：学科竞赛、创新创业竞赛等
- **competitionName**: 赛项名称，具体的竞赛名称
- **competitionNameLevel**: 赛项名称等级，记录赛项的级别信息
- **competitionNameEnglish**: 赛项名称英文，用于国际交流
- **subCompetitionName**: 分赛项名称，大型竞赛的子项目
- **organizer**: 主办单位，竞赛的组织机构
- **competitionLevel**: 竞赛级别，如：国家级、省级、市级等
- **competitionType**: 竞赛类型，如：个人赛、团体赛等
- **competitionClass**: 竞赛分类，按学科或领域分类
- **isSpecialtyCompetition**: 是否为一专一赛赛项，标志是否为专业对口竞赛
- **competitionTrack**: 竞赛赛道，区分不同方向或类别的竞赛

## 4. 业务逻辑说明

### 4.1 数据流转
1. 用户提交校外赛成绩录入申请
2. 系统生成唯一formUserId作为主键
3. 记录提交人信息和提交时间
4. 填写详细的竞赛信息（主办单位、级别、类型等）
5. 进入审批流程，记录审批相关信息
6. 审批完成后更新审批状态和时间
7. 数据同步到数据仓库

### 4.2 竞赛分类逻辑
- **competitionLevel**: 竞赛级别（国家级/省级/市级/校级）
- **competitionType**: 竞赛类型（个人赛/团体赛/混合赛）
- **competitionClass**: 竞赛分类（学科竞赛/技能竞赛/创新竞赛）
- **competitionCategory**: 竞赛类别（按学科或行业分类）

### 4.3 关联关系
- 与SCORE_STUDENT_EXTERNAL表形成主从关系
- 通过formUserId关联参赛学生的详细信息

## 5. 数据约束

### 5.1 主键约束
- formUserId 表单数据唯一标识，作为主键

### 5.2 非空约束
- formUserId 必须不为空
- formId 必须不为空
- competitionName 赛项名称不能为空
- organizer 主办单位不能为空

### 5.3 业务约束
- academicYear 学年信息必须符合学年格式规范
- competitionLevel 竞赛级别必须在预定义级别列表内
- competitionType 竞赛类型必须在预定义类型列表内
- awardMonth 获奖月份必须符合月份格式

### 5.4 枚举约束
- approvalStatus 审批状态必须在预定义状态列表内
- competitionLevel 竞赛级别（国家级、省级、市级、校级等）
- competitionType 竞赛类型（个人赛、团体赛、混合赛）
- isSpecialtyCompetition 是否为一专一赛赛项（是/否）

## 6. 索引建议

### 6.1 主键索引
- PRIMARY KEY (formUserId)

### 6.2 业务索引
- INDEX idx_competition_info (competitionName, competitionLevel, academicYear) - 用于竞赛信息查询
- INDEX idx_organizer_level (organizer, competitionLevel) - 用于按主办单位和级别查询
- INDEX idx_award_month (awardMonth, academicYear) - 用于按获奖时间查询
- INDEX idx_approval_status (approvalStatusId) - 用于按审批状态筛选
- INDEX idx_submitter (submitterId) - 用于按提交人查询
- INDEX idx_organization (organizationId) - 用于按单位查询
- INDEX idx_insert_time (insertTimestamp) - 用于按提交时间排序

### 6.3 复合索引
- INDEX idx_search_combination (academicYear, competitionLevel, competitionCategory, approvalStatus) - 用于多条件搜索

## 7. 数据关联关系

### 7.1 一对多关系
- SCORE_EXTERNAL → SCORE_STUDENT_EXTERNAL (1:N)
  - 关联字段：formUserId
  - 说明：一个校外赛成绩记录对应多个学生参赛记录

### 7.2 外部关联
- 与组织表关联：organizationId
- 与用户表关联：submitterId
- 与表单管理表关联：formId
- 与主办单位表关联：organizer

## 8. SQL使用示例

### 8.1 查询示例

```sql
-- 查询特定学年的所有校外赛成绩
SELECT
    formUserId,
    competitionName,
    competitionLevel,
    competitionCategory,
    organizer,
    awardMonth,
    approvalStatus,
    submitterName
FROM SCORE_EXTERNAL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
ORDER BY awardMonth DESC;

-- 按竞赛级别统计获奖情况
SELECT
    competitionLevel,
    competitionType,
    COUNT(*) as competition_count,
    COUNT(DISTINCT organizer) as organizer_count
FROM SCORE_EXTERNAL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
GROUP BY competitionLevel, competitionType
ORDER BY
    CASE competitionLevel
        WHEN '国家级' THEN 1
        WHEN '省级' THEN 2
        WHEN '市级' THEN 3
        ELSE 4
    END;

-- 查询一专一赛赛项情况
SELECT
    competitionName,
    competitionLevel,
    competitionCategory,
    organizer,
    awardMonth,
    COUNT(*) as student_count
FROM SCORE_EXTERNAL e
INNER JOIN SCORE_STUDENT_EXTERNAL s ON e.formUserId = s.formUserId
WHERE e.isSpecialtyCompetition = '是'
    AND e.academicYear = '2024-2025'
    AND e.approvalStatus = '已通过'
GROUP BY e.competitionName, e.competitionLevel, e.competitionCategory, e.organizer, e.awardMonth
ORDER BY e.competitionLevel, e.competitionName;

-- 统计各单位参与的校外赛情况
SELECT
    organizationId,
    COUNT(*) as total_competitions,
    COUNT(DISTINCT competitionLevel) as level_diversity,
    COUNT(DISTINCT organizer) as organizer_diversity
FROM SCORE_EXTERNAL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
GROUP BY organizationId
ORDER BY total_competitions DESC;
```

### 8.2 关联查询示例

```sql
-- 查询学生校外赛参赛情况
SELECT
    e.competitionName,
    e.competitionLevel,
    e.organizer,
    e.awardMonth,
    s.16 as student_name,  -- 从子表获取学生姓名
    s.17 as student_number,  -- 从子表获取学号
    s.21 as award_level  -- 从子表获取获奖等级
FROM SCORE_EXTERNAL e
INNER JOIN SCORE_STUDENT_EXTERNAL s ON e.formUserId = s.formUserId
WHERE e.academicYear = '2024-2025'
    AND e.approvalStatus = '已通过'
ORDER BY e.awardMonth DESC, e.competitionName;

-- 分析主办单位的竞赛影响力
SELECT
    organizer,
    COUNT(*) as competition_count,
    COUNT(DISTINCT competitionLevel) as level_coverage,
    COUNT(DISTINCT competitionCategory) as category_diversity,
    COUNT(DISTINCT organizationId) as participant_count
FROM SCORE_EXTERNAL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
GROUP BY organizer
ORDER BY competition_count DESC;
```

### 8.3 统计分析示例

```sql
-- 按月份统计获奖趋势
SELECT
    awardMonth,
    competitionLevel,
    COUNT(*) as award_count
FROM SCORE_EXTERNAL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
GROUP BY awardMonth, competitionLevel
ORDER BY
    CASE awardMonth
        WHEN '1月' THEN 1
        WHEN '2月' THEN 2
        WHEN '3月' THEN 3
        WHEN '4月' THEN 4
        WHEN '5月' THEN 5
        WHEN '6月' THEN 6
        WHEN '7月' THEN 7
        WHEN '8月' THEN 8
        WHEN '9月' THEN 9
        WHEN '10月' THEN 10
        WHEN '11月' THEN 11
        WHEN '12月' THEN 12
    END,
    competitionLevel;

-- 竞赛类别分布统计
SELECT
    competitionCategory,
    competitionType,
    competitionLevel,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SCORE_EXTERNAL WHERE approvalStatus = '已通过'), 2) as percentage
FROM SCORE_EXTERNAL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
GROUP BY competitionCategory, competitionType, competitionLevel
ORDER BY count DESC;
```

## 9. 数据维护建议

### 9.1 数据质量管理
- 定期检查competitionLevel、competitionType等枚举字段的数据规范性
- 验证academicYear和awardMonth字段的格式规范性
- 监控organizer字段的数据一致性和完整性
- 检查isSpecialtyCompetition字段的数据准确性

### 9.2 性能优化建议
- 为常用查询组合建立复合索引
- 考虑按学年或竞赛级别进行数据分区
- 定期分析查询模式，优化索引策略
- 对历史数据进行归档处理

### 9.3 数据清洗建议
- 标准化主办单位的命名规范
- 验证竞赛级别和类型的数据一致性
- 清理重复或无效的竞赛记录
- 统一赛项名称的格式规范

### 9.4 数据安全建议
- 对竞赛主办方和获奖信息进行适当的数据保护
- 限制对敏感审批数据的访问权限
- 记录所有数据修改操作的审计日志
- 对数据进行定期备份和恢复测试

### 9.5 业务监控建议
- 监控各类别竞赛的参与情况
- 跟踪一专一赛赛项的覆盖率
- 分析校外赛成绩的季度变化趋势
- 统计各主办单位的竞赛参与度