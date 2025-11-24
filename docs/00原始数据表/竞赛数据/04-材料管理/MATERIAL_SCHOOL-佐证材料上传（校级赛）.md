# MATERIAL_SCHOOL 佐证材料上传（校级赛）数据字典

## 1. 基本信息

| 项目 | 内容 |
|------|------|
| 标准表名 | MATERIAL_SCHOOL |
| 原表名 | t_approve_data_6586_115054_1729113909046_end |
| 表用途 | 佐证材料上传（校级赛），存储校级竞赛项目的相关材料和赛事信息 |
| 字段数量 | 21个字段 |
| 数据类别 | 材料管理数据 |
| 所属模块 | 04-材料管理 |

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
| 17 | 1 | academicYear | 学年 | varchar | 65533 | 否 | |
| 18 | 38 | competitionName | 赛项名称 | varchar | 65533 | 否 | |
| 19 | 30 | collegeName | 所属学院 | varchar | 1048576 | 否 | |
| 20 | 34 | reviewExperts | 评审专家 | varchar | 1048576 | 否 | |
| 21 | 37 | attachmentFile1 | 附件上传1 | varchar | 1048576 | 否 | |
| 22 | 48 | attachmentFile2 | 附件上传2 | varchar | 1048576 | 否 | |
| 23 | 41 | competitionType | 竞赛类型 | varchar | 1048576 | 否 | |
| 24 | 46 | competitionClass | 竞赛分类 | varchar | 1048576 | 否 | |
| 25 | 47 | schoolEnterpriseCooperation | 校企合作类型 | varchar | 1048576 | 否 | |
| 26 | 40 | majorName | 所属专业 | varchar | 1048576 | 否 | |
| 27 | 42 | finalTime | 决赛时间 | varchar | 65533 | 否 | |
| 28 | 43 | finalLocation | 决赛地点 | varchar | 1048576 | 否 | |
| 29 | 44 | participantCount | 参赛人数 | varchar | 1048576 | 否 | |
| 30 | 45 | isSpecialtyCompetition | 是否为一专一赛赛项（校赛） | varchar | 1048576 | 否 | |

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
- **title**: 佐证材料上传的标题，通常包含赛事名称等关键信息

### 3.2 基本业务字段

- **academicYear**: 学年信息，如"2024-2025"
- **competitionName**: 赛项名称，具体的校级竞赛名称
- **collegeName**: 所属学院，组织或参与竞赛的学院
- **majorName**: 所属专业，相关专业信息

### 3.3 赛事组织信息字段

- **reviewExperts**: 评审专家，参与赛事评审的专家信息
- **finalTime**: 决赛时间，决赛阶段的举办时间
- **finalLocation**: 决赛地点，决赛阶段的举办地点
- **participantCount**: 参赛人数，参与竞赛的学生人数统计

### 3.4 竞赛分类信息字段

- **competitionType**: 竞赛类型，如：个人赛、团体赛等
- **competitionClass**: 竞赛分类，按学科或领域分类
- **schoolEnterpriseCooperation**: 校企合作类型，校企合作的相关信息
- **isSpecialtyCompetition**: 是否为一专一赛赛项（校赛），标志是否为专业对口竞赛

### 3.5 材料上传字段

- **attachmentFile1**: 附件上传1，第一类佐证材料文件
- **attachmentFile2**: 附件上传2，第二类佐证材料文件

## 4. 业务逻辑说明

### 4.1 数据流转
1. 用户为校级赛项目上传佐证材料
2. 系统生成唯一formUserId作为主键
3. 填写校级竞赛基本信息和赛事详情
4. 上传相关佐证材料附件
5. 进入审批流程，验证材料的完整性
6. 审批完成后材料正式归档
7. 数据同步到材料管理系统

### 4.2 校级赛特点
- 主要是校内组织的竞赛活动
- 可能涉及校企合作项目
- 评审专家多为校内教师
- 赛事规模相对较小，组织灵活

### 4.3 关联关系
- 与SCORE_TEAM_SCHOOL、SCORE_PERSONAL_SCHOOL表形成关联关系
- 通过赛项名称、学院等字段与成绩管理表关联
- 与CERTIFICATE_MANAGEMENT表可能存在关联

## 5. 数据约束

### 5.1 主键约束
- formUserId 表单数据唯一标识，作为主键

### 5.2 非空约束
- formUserId 必须不为空
- formId 必须不为空
- competitionName 赛项名称不能为空
- collegeName 所属学院不能为空

### 5.3 业务约束
- academicYear 学年信息必须符合学年格式规范
- competitionType 竞赛类型必须在预定义类型列表内
- competitionClass 竞赛分类必须符合系统分类规范
- participantCount 参赛人数应为正整数

### 5.4 文件约束
- 所有附件上传字段应包含有效的文件路径或URL
- 文件格式应符合系统要求（如：pdf, doc, jpg等）
- 文件大小应在允许范围内

### 5.5 枚举约束
- approvalStatus 审批状态必须在预定义状态列表内
- isSpecialtyCompetition 是否为一专一赛赛项（是/否）
- competitionType 竞赛类型（个人赛/团体赛/混合赛）

## 6. 索引建议

### 6.1 主键索引
- PRIMARY KEY (formUserId)

### 6.2 业务索引
- INDEX idx_competition_info (competitionName, academicYear) - 用于竞赛信息查询
- INDEX idx_college_major (collegeName, majorName) - 用于院系专业查询
- INDEX idx_competition_type (competitionType, competitionClass) - 用于竞赛分类查询
- INDEX idx_final_info (finalTime, finalLocation) - 用于决赛信息查询

### 6.3 组织索引
- INDEX idx_approval_status (approvalStatusId) - 用于按审批状态筛选
- INDEX idx_submitter (submitterId) - 用于按提交人查询
- INDEX idx_organization (organizationId) - 用于按单位查询

### 6.4 时间索引
- INDEX idx_insert_time (insertTimestamp) - 用于按提交时间排序
- INDEX idx_academic_year (academicYear) - 用于按学年查询
- INDEX idx_final_time (finalTime) - 用于按决赛时间排序

### 6.5 复合索引
- INDEX idx_college_competition (collegeName, competitionName, academicYear) - 用于学院竞赛查询
- INDEX idx_type_cooperation (competitionType, schoolEnterpriseCooperation) - 用于类型合作查询

## 7. 数据关联关系

### 7.1 与成绩管理表的关联
- 与SCORE_TEAM_SCHOOL表：通过competitionName、academicYear等字段
- 与SCORE_PERSONAL_SCHOOL表：通过学院专业信息关联
- 与SCORE_STUDENT_TEAM表：通过赛项信息关联

### 7.2 外部关联
- 与组织表关联：organizationId
- 与用户表关联：submitterId
- 与表单管理表关联：formId
- 与学院专业表关联：collegeName, majorName
- 与教师专家表关联：reviewExperts

### 7.3 文件系统关联
- 与文件存储系统关联：attachmentFile1, attachmentFile2字段

## 8. SQL使用示例

### 8.1 查询示例

```sql
-- 查询特定学年的所有校级赛材料
SELECT
    formUserId,
    competitionName,
    collegeName,
    majorName,
    competitionType,
    competitionClass,
    finalTime,
    finalLocation,
    participantCount,
    approvalStatus,
    submitterName
FROM MATERIAL_SCHOOL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
ORDER BY finalTime DESC;

-- 按竞赛类型统计校级赛情况
SELECT
    competitionType,
    competitionClass,
    COUNT(*) as total_competitions,
    COUNT(CASE WHEN schoolEnterpriseCooperation IS NOT NULL AND schoolEnterpriseCooperation != '' THEN 1 END) as cooperation_count,
    SUM(CAST(participantCount AS SIGNED)) as total_participants,
    AVG(CAST(participantCount AS SIGNED)) as avg_participants
FROM MATERIAL_SCHOOL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
    AND participantCount REGEXP '^[0-9]+$'
GROUP BY competitionType, competitionClass
ORDER BY total_competitions DESC;

-- 查询校企合作竞赛情况
SELECT
    formUserId,
    competitionName,
    collegeName,
    schoolEnterpriseCooperation,
    participantCount,
    finalTime,
    reviewExperts
FROM MATERIAL_SCHOOL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
    AND schoolEnterpriseCooperation IS NOT NULL
    AND schoolEnterpriseCooperation != ''
ORDER BY finalTime DESC;

-- 统计各院系校级赛组织情况
SELECT
    collegeName,
    COUNT(*) as competition_count,
    COUNT(DISTINCT competitionType) as type_diversity,
    SUM(CAST(participantCount AS SIGNED)) as total_participants,
    COUNT(CASE WHEN isSpecialtyCompetition = '是' THEN 1 END) as specialty_competition_count
FROM MATERIAL_SCHOOL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
GROUP BY collegeName
ORDER BY competition_count DESC;
```

### 8.2 附件管理示例

```sql
-- 查询材料完整度
SELECT
    formUserId,
    competitionName,
    collegeName,
    CASE
        WHEN (attachmentFile1 IS NULL OR attachmentFile1 = '')
             AND (attachmentFile2 IS NULL OR attachmentFile2 = '') THEN '无附件'
        WHEN (attachmentFile1 IS NOT NULL AND attachmentFile1 != '')
             AND (attachmentFile2 IS NOT NULL AND attachmentFile2 != '') THEN '附件完整'
        ELSE '部分附件'
    END as attachment_status
FROM MATERIAL_SCHOOL
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
ORDER BY attachment_status;

-- 统计文件上传情况
SELECT
    '附件1' as file_type,
    COUNT(*) as total_records,
    COUNT(CASE WHEN attachmentFile1 IS NOT NULL AND attachmentFile1 != '' THEN 1 END) as uploaded_count,
    ROUND(COUNT(CASE WHEN attachmentFile1 IS NOT NULL AND attachmentFile1 != '' THEN 1 END) * 100.0 / COUNT(*), 2) as upload_rate
FROM MATERIAL_SCHOOL
WHERE academicYear = '2024-2025' AND approvalStatus = '已通过'
UNION ALL
SELECT
    '附件2' as file_type,
    COUNT(*) as total_records,
    COUNT(CASE WHEN attachmentFile2 IS NOT NULL AND attachmentFile2 != '' THEN 1 END) as uploaded_count,
    ROUND(COUNT(CASE WHEN attachmentFile2 IS NOT NULL AND attachmentFile2 != '' THEN 1 END) * 100.0 / COUNT(*), 2) as upload_rate
FROM MATERIAL_SCHOOL
WHERE academicYear = '2024-2025' AND approvalStatus = '已通过';
```

### 8.3 数据质量检查示例

```sql
-- 检查数据完整性
SELECT
    '缺少赛项名称' as issue,
    COUNT(*) as count
FROM MATERIAL_SCHOOL
WHERE competitionName IS NULL OR competitionName = ''
UNION ALL
SELECT
    '缺少学院信息' as issue,
    COUNT(*) as count
FROM MATERIAL_SCHOOL
WHERE collegeName IS NULL OR collegeName = ''
UNION ALL
SELECT
    '缺少参赛人数' as issue,
    COUNT(*) as count
FROM MATERIAL_SCHOOL
WHERE participantCount IS NULL OR participantCount = ''
UNION ALL
SELECT
    '参赛人数格式错误' as issue,
    COUNT(*) as count
FROM MATERIAL_SCHOOL
WHERE participantCount NOT REGEXP '^[0-9]+$';

-- 检查决赛时间逻辑性
SELECT
    formUserId,
    competitionName,
    academicYear,
    finalTime,
    '决赛时间超出学年范围' as issue
FROM MATERIAL_SCHOOL
WHERE academicYear = '2024-2025'
    AND (
        finalTime LIKE '%2023%'
        OR finalTime LIKE '%2026%'
        OR finalTime IS NULL
        OR finalTime = ''
    );
```

## 9. 数据维护建议

### 9.1 数据质量管理
- 定期检查各字段的数据完整性和规范性
- 验证参赛人数字段的数据格式和逻辑性
- 监控决赛时间与学年的对应关系
- 检查竞赛类型、分类等枚举字段的数据规范性

### 9.2 附件管理建议
- 定期检查上传附件的完整性和可访问性
- 建立附件备份和恢复机制
- 监控附件存储空间使用情况
- 对重复或无效附件进行清理

### 9.3 性能优化建议
- 为常用查询组合建立复合索引
- 考虑对大字段（附件路径）进行单独优化
- 定期分析查询模式，优化索引策略
- 对历史数据进行归档处理

### 9.4 数据安全建议
- 对上传附件进行安全扫描，防止恶意文件
- 限制文件类型和大小，确保系统安全
- 建立附件访问权限控制机制
- 记录附件操作的详细审计日志

### 9.5 业务监控建议
- 监控校级赛的组织频次和参与度
- 跟踪校企合作竞赛的发展趋势
- 分析一专一赛赛项的覆盖率
- 统计各院系校级赛的活跃度