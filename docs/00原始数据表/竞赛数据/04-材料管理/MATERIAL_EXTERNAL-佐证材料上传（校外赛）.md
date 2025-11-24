# MATERIAL_EXTERNAL 佐证材料上传（校外赛）数据字典

## 1. 基本信息

| 项目 | 内容 |
|------|------|
| 标准表名 | MATERIAL_EXTERNAL |
| 原表名 | t_approve_data_6586_112771_1729113909046_end |
| 表用途 | 佐证材料上传（校外赛），存储校外竞赛项目的各类证明材料和获奖证书 |
| 字段数量 | 28个字段 |
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
| 17 | 1 | awardAcademicYear | 获奖学年 | varchar | 65533 | 否 | |
| 18 | 48 | competitionCategory | 竞赛类别 | varchar | 65533 | 否 | |
| 19 | 31 | competitionName | 赛项名称 | varchar | 65533 | 否 | |
| 20 | 49 | competitionNameEnglish | 赛项名称英文 | varchar | 65533 | 否 | |
| 21 | 33 | subCompetitionName | 分赛项名称 | varchar | 1048576 | 否 | |
| 22 | 44 | attachmentAwardFile | 上传附件（获奖发文文件） | varchar | 1048576 | 否 | |
| 23 | 47 | competitionVideo | 上传竞赛视频 | varchar | 1048576 | 否 | |
| 24 | 42 | supportingMaterials | 上传佐证材料（比赛照片、报道、总结） | varchar | 1048576 | 否 | |
| 25 | 43 | certificateFile | 上传佐证材料(获奖证书) | varchar | 1048576 | 否 | |
| 26 | 46 | collegeName | 所属学院 | varchar | 65533 | 否 | |
| 27 | 30 | majorName | 所属专业 | varchar | 65533 | 否 | |
| 28 | 28 | awardLevel | 获奖等级 | varchar | 65533 | 否 | |
| 29 | 25 | awardMonth | 获奖月份 | varchar | 65533 | 否 | |
| 30 | 6 | competitionClass | 竞赛分类 | varchar | 65533 | 否 | |
| 31 | 5 | organizer | 主办单位 | varchar | 1048576 | 否 | |
| 32 | 35 | competitionType | 竞赛类型 | varchar | 65533 | 否 | |
| 33 | 27 | competitionLevel | 竞赛级别 | varchar | 65533 | 否 | |
| 34 | 38 | isSpecialtyCompetition | 是否为一专一赛赛项 | varchar | 65533 | 否 | |

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

### 3.2 竞赛基本信息字段

- **awardAcademicYear**: 获奖学年，记录获奖所属的学年
- **competitionCategory**: 竞赛类别，如：学科竞赛、创新创业竞赛等
- **competitionName**: 赛项名称，具体的竞赛名称
- **competitionNameEnglish**: 赛项名称英文，用于国际交流
- **subCompetitionName**: 分赛项名称，大型竞赛的子项目
- **organizer**: 主办单位，竞赛的组织机构
- **competitionLevel**: 竞赛级别，如：国家级、省级、市级等
- **competitionType**: 竞赛类型，如：个人赛、团体赛等
- **competitionClass**: 竞赛分类，按学科或领域分类
- **isSpecialtyCompetition**: 是否为一专一赛赛项，标志是否为专业对口竞赛

### 3.3 获奖信息字段

- **awardLevel**: 获奖等级，如：一等奖、二等奖、三等奖等
- **awardMonth**: 获奖月份，记录获奖的具体时间

### 3.4 院系专业信息字段

- **collegeName**: 所属学院，学生或团队所在的学院
- **majorName**: 所属专业，学生所学的专业

### 3.5 材料上传字段

- **attachmentAwardFile**: 上传附件（获奖发文文件），官方发布的获奖通知文件
- **competitionVideo**: 上传竞赛视频，比赛过程的视频记录
- **supportingMaterials**: 上传佐证材料（比赛照片、报道、总结），相关的证明材料
- **certificateFile**: 上传佐证材料(获奖证书)，获奖证书扫描件或照片

## 4. 业务逻辑说明

### 4.1 数据流转
1. 用户为校外赛项目上传佐证材料
2. 系统生成唯一formUserId作为主键
3. 填写竞赛基本信息和获奖情况
4. 上传各类证明材料（证书、视频、照片等）
5. 进入审批流程，验证材料的真实性和完整性
6. 审批完成后材料正式归档
7. 数据同步到材料管理系统

### 4.2 材料分类逻辑
- **获奖证书文件**: 官方颁发的获奖证书
- **获奖发文文件**: 主办单位发布的正式获奖通知
- **竞赛视频**: 比赛过程或成果展示视频
- **佐证材料**: 包括比赛照片、新闻报道、参赛总结等

### 4.3 关联关系
- 与SCORE_EXTERNAL表形成关联关系，可能通过赛项名称、获奖时间等字段
- 与CERTIFICATE_MANAGEMENT表形成关联，共享证书文件信息

## 5. 数据约束

### 5.1 主键约束
- formUserId 表单数据唯一标识，作为主键

### 5.2 非空约束
- formUserId 必须不为空
- formId 必须不为空
- competitionName 赛项名称不能为空
- awardLevel 获奖等级不能为空
- organizer 主办单位不能为空

### 5.3 业务约束
- awardAcademicYear 获奖学年必须符合学年格式规范
- awardMonth 获奖月份必须符合月份格式
- competitionLevel 竞赛级别必须在预定义级别列表内
- competitionType 竞赛类型必须在预定义类型列表内

### 5.4 文件约束
- 所有上传文件字段应包含有效的文件路径或URL
- 文件格式应符合系统要求（如：pdf, jpg, mp4等）
- 文件大小应在允许范围内

### 5.5 枚举约束
- approvalStatus 审批状态必须在预定义状态列表内
- isSpecialtyCompetition 是否为一专一赛赛项（是/否）

## 6. 索引建议

### 6.1 主键索引
- PRIMARY KEY (formUserId)

### 6.2 业务索引
- INDEX idx_competition_info (competitionName, competitionLevel, awardAcademicYear) - 用于竞赛信息查询
- INDEX idx_award_info (awardLevel, awardMonth, awardAcademicYear) - 用于获奖信息查询
- INDEX idx_college_major (collegeName, majorName) - 用于院系专业查询
- INDEX idx_organizer_level (organizer, competitionLevel) - 用于按主办单位和级别查询
- INDEX idx_material_files (certificateFile, attachmentAwardFile) - 用于文件材料查询

### 6.3 状态索引
- INDEX idx_approval_status (approvalStatusId) - 用于按审批状态筛选
- INDEX idx_submitter (submitterId) - 用于按提交人查询
- INDEX idx_organization (organizationId) - 用于按单位查询

### 6.4 时间索引
- INDEX idx_insert_time (insertTimestamp) - 用于按提交时间排序
- INDEX idx_award_time (awardMonth, awardAcademicYear) - 用于按获奖时间排序

## 7. 数据关联关系

### 7.1 与成绩管理表的关联
- 与SCORE_EXTERNAL表：通过competitionName、organizer、awardMonth等字段
- 与SCORE_STUDENT_EXTERNAL表：通过学院专业信息关联

### 7.2 外部关联
- 与组织表关联：organizationId
- 与用户表关联：submitterId
- 与表单管理表关联：formId
- 与主办单位表关联：organizer
- 与学院专业表关联：collegeName, majorName

### 7.3 文件系统关联
- 与文件存储系统关联：所有上传文件字段
- 与证书管理系统关联：certificateFile字段

## 8. SQL使用示例

### 8.1 查询示例

```sql
-- 查询特定学年的所有佐证材料
SELECT
    formUserId,
    competitionName,
    competitionLevel,
    awardLevel,
    organizer,
    awardMonth,
    collegeName,
    majorName,
    approvalStatus,
    submitterName
FROM MATERIAL_EXTERNAL
WHERE awardAcademicYear = '2024-2025'
    AND approvalStatus = '已通过'
ORDER BY awardMonth DESC;

-- 按竞赛级别统计材料上传情况
SELECT
    competitionLevel,
    competitionType,
    COUNT(*) as total_records,
    COUNT(CASE WHEN certificateFile IS NOT NULL AND certificateFile != '' THEN 1 END) as certificate_count,
    COUNT(CASE WHEN attachmentAwardFile IS NOT NULL AND attachmentAwardFile != '' THEN 1 END) as award_file_count,
    COUNT(CASE WHEN competitionVideo IS NOT NULL AND competitionVideo != '' THEN 1 END) as video_count,
    COUNT(CASE WHEN supportingMaterials IS NOT NULL AND supportingMaterials != '' THEN 1 END) as supporting_count
FROM MATERIAL_EXTERNAL
WHERE awardAcademicYear = '2024-2025'
    AND approvalStatus = '已通过'
GROUP BY competitionLevel, competitionType
ORDER BY
    CASE competitionLevel
        WHEN '国家级' THEN 1
        WHEN '省级' THEN 2
        WHEN '市级' THEN 3
        ELSE 4
    END;

-- 查询材料缺失的情况
SELECT
    formUserId,
    competitionName,
    collegeName,
    majorName,
    CASE
        WHEN certificateFile IS NULL OR certificateFile = '' THEN '缺少获奖证书'
        WHEN attachmentAwardFile IS NULL OR attachmentAwardFile = '' THEN '缺少获奖发文文件'
        WHEN supportingMaterials IS NULL OR supportingMaterials = '' THEN '缺少佐证材料'
        ELSE '材料完整'
    END as material_status
FROM MATERIAL_EXTERNAL
WHERE awardAcademicYear = '2024-2025'
    AND approvalStatus = '已通过'
    AND (certificateFile IS NULL OR certificateFile = ''
         OR attachmentAwardFile IS NULL OR attachmentAwardFile = ''
         OR supportingMaterials IS NULL OR supportingMaterials = '');

-- 统计各院系材料上传情况
SELECT
    collegeName,
    majorName,
    COUNT(*) as total_competitions,
    COUNT(DISTINCT competitionLevel) as level_diversity,
    COUNT(DISTINCT organizer) as organizer_count,
    COUNT(CASE WHEN certificateFile IS NOT NULL AND certificateFile != '' THEN 1 END) as certificate_complete
FROM MATERIAL_EXTERNAL
WHERE awardAcademicYear = '2024-2025'
    AND approvalStatus = '已通过'
GROUP BY collegeName, majorName
ORDER BY total_competitions DESC;
```

### 8.2 文件管理示例

```sql
-- 查询特定类型的文件
SELECT
    formUserId,
    competitionName,
    awardLevel,
    certificateFile,
    attachmentAwardFile
FROM MATERIAL_EXTERNAL
WHERE (certificateFile LIKE '%.pdf%' OR certificateFile LIKE '%.jpg%')
    AND awardAcademicYear = '2024-2025'
    AND approvalStatus = '已通过';

-- 统计文件类型分布
SELECT
    '证书文件' as file_type,
    COUNT(CASE WHEN certificateFile LIKE '%.pdf%' THEN 1 END) as pdf_count,
    COUNT(CASE WHEN certificateFile LIKE '%.jpg%' OR certificateFile LIKE '%.jpeg%' THEN 1 END) as jpg_count,
    COUNT(CASE WHEN certificateFile LIKE '%.png%' THEN 1 END) as png_count
FROM MATERIAL_EXTERNAL
WHERE awardAcademicYear = '2024-2025' AND approvalStatus = '已通过'
UNION ALL
SELECT
    '视频文件' as file_type,
    COUNT(CASE WHEN competitionVideo LIKE '%.mp4%' THEN 1 END) as mp4_count,
    COUNT(CASE WHEN competitionVideo LIKE '%.avi%' THEN 1 END) as avi_count,
    COUNT(CASE WHEN competitionVideo LIKE '%.mov%' THEN 1 END) as mov_count
FROM MATERIAL_EXTERNAL
WHERE awardAcademicYear = '2024-2025' AND approvalStatus = '已通过';
```

### 8.3 数据质量检查示例

```sql
-- 检查数据完整性
SELECT
    '缺少赛项名称' as issue,
    COUNT(*) as count
FROM MATERIAL_EXTERNAL
WHERE competitionName IS NULL OR competitionName = ''
UNION ALL
SELECT
    '缺少获奖等级' as issue,
    COUNT(*) as count
FROM MATERIAL_EXTERNAL
WHERE awardLevel IS NULL OR awardLevel = ''
UNION ALL
SELECT
    '缺少主办单位' as issue,
    COUNT(*) as count
FROM MATERIAL_EXTERNAL
WHERE organizer IS NULL OR organizer = '';

-- 检查获奖时间逻辑性
SELECT
    formUserId,
    competitionName,
    awardAcademicYear,
    awardMonth,
    '获奖时间与学年不匹配' as issue
FROM MATERIAL_EXTERNAL
WHERE awardAcademicYear = '2024-2025'
    AND awardMonth NOT IN ('1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月');
```

## 9. 数据维护建议

### 9.1 数据质量管理
- 定期检查各字段的数据完整性和规范性
- 验证文件路径或URL的有效性
- 监控获奖时间与学年的逻辑性
- 检查竞赛级别、类型等枚举字段的数据规范性

### 9.2 文件管理建议
- 定期检查上传文件的完整性和可访问性
- 建立文件备份和恢复机制
- 监控文件存储空间使用情况
- 对大文件进行压缩和优化处理

### 9.3 性能优化建议
- 为常用查询组合建立复合索引
- 考虑对大字段（文件路径）进行单独优化
- 定期分析查询模式，优化索引策略
- 对历史数据进行归档处理

### 9.4 数据安全建议
- 对上传文件进行安全扫描，防止恶意文件
- 限制文件类型和大小，确保系统安全
- 建立文件访问权限控制机制
- 记录文件操作的详细审计日志

### 9.5 业务监控建议
- 监控材料上传的及时性和完整性
- 跟踪各类型材料的上传情况
- 分析材料缺失的原因和模式
- 统计审批流程的效率和结果