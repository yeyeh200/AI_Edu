# CERTIFICATE_MANAGEMENT 竞赛证书管理数据字典

## 1. 基本信息

| 项目 | 内容 |
|------|------|
| 标准表名 | CERTIFICATE_MANAGEMENT |
| 原表名 | t_approve_data_6586_116532_1729113909047_end |
| 表用途 | 竞赛过程数据上传（比赛证书），管理竞赛获奖学生的证书信息 |
| 字段数量 | 15个字段 |
| 数据类别 | 证书管理数据 |
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
| 19 | 37 | certificateFile | 比赛证书上传 | varchar | 1048576 | 否 | |
| 20 | 39 | studentNumber | 学号 | varchar | 1048576 | 否 | |
| 21 | 40 | studentName | 姓名 | varchar | 1048576 | 否 | |

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
- **title**: 证书上传的标题，通常包含学生姓名和赛项名称

### 3.2 业务基本字段

- **academicYear**: 学年信息，如"2024-2025"
- **competitionName**: 赛项名称，具体的竞赛名称

### 3.3 学生信息字段

- **studentName**: 获奖学生姓名
- **studentNumber**: 获奖学生学号，作为学生身份的唯一标识

### 3.4 证书文件字段

- **certificateFile**: 比赛证书上传，存储获奖证书的文件路径或URL

## 4. 业务逻辑说明

### 4.1 数据流转
1. 用户为获奖学生上传比赛证书
2. 系统生成唯一formUserId作为主键
3. 填写学生基本信息和竞赛信息
4. 上传获奖证书文件
5. 进入审批流程，验证证书的真实性和完整性
6. 审批完成后证书正式归档管理
7. 数据同步到证书管理系统

### 4.2 证书管理特点
- 以学生为单位管理证书信息
- 每条记录对应一个学生的一个获奖证书
- 证书文件需要经过审批流程验证
- 支持证书的数字化存储和管理

### 4.3 关联关系
- 与SCORE_EXTERNAL、SCORE_STUDENT_EXTERNAL表形成关联关系
- 与SCORE_TEAM_SCHOOL、SCORE_STUDENT_TEAM表形成关联关系
- 与MATERIAL_EXTERNAL表共享证书文件信息

## 5. 数据约束

### 5.1 主键约束
- formUserId 表单数据唯一标识，作为主键

### 5.2 非空约束
- formUserId 必须不为空
- formId 必须不为空
- studentName 学生姓名不能为空
- studentNumber 学号不能为空
- competitionName 赛项名称不能为空

### 5.3 业务约束
- academicYear 学年信息必须符合学年格式规范
- studentNumber 学号必须符合学号格式规范
- certificateFile 证书文件路径不能为空

### 5.4 文件约束
- certificateFile 字段应包含有效的文件路径或URL
- 证书文件格式应符合系统要求（如：pdf, jpg, png等）
- 文件大小应在允许范围内
- 文件应包含可读的证书信息

### 5.5 唯一性约束
- 同一学号、学年、赛项名称的组合应保持唯一
- 避免同一证书的重复上传

### 5.6 枚举约束
- approvalStatus 审批状态必须在预定义状态列表内

## 6. 索引建议

### 6.1 主键索引
- PRIMARY KEY (formUserId)

### 6.2 业务索引
- INDEX idx_student_info (studentNumber, studentName) - 用于学生信息查询
- INDEX idx_competition_info (competitionName, academicYear) - 用于竞赛信息查询
- INDEX idx_certificate_file (certificateFile) - 用于证书文件查询

### 6.3 复合索引
- INDEX idx_student_competition (studentNumber, competitionName, academicYear) - 用于学生竞赛证书查询
- INDEX idx_academic_year_student (academicYear, studentNumber) - 用于学年学生证书查询

### 6.4 状态索引
- INDEX idx_approval_status (approvalStatusId) - 用于按审批状态筛选
- INDEX idx_submitter (submitterId) - 用于按提交人查询
- INDEX idx_organization (organizationId) - 用于按单位查询

### 6.5 时间索引
- INDEX idx_insert_time (insertTimestamp) - 用于按提交时间排序
- INDEX idx_approval_complete (approvalCompleteTime) - 用于按审批完成时间排序

## 7. 数据关联关系

### 7.1 与成绩管理表的关联
- 与SCORE_EXTERNAL表：通过studentNumber、competitionName等字段
- 与SCORE_STUDENT_EXTERNAL表：通过学生学号和赛项信息直接关联
- 与SCORE_TEAM_SCHOOL表：通过competitionName、academicYear等字段
- 与SCORE_STUDENT_TEAM表：通过学生学号和团队赛项信息关联

### 7.2 与材料管理表的关联
- 与MATERIAL_EXTERNAL表：共享certificateFile字段信息
- 与MATERIAL_SCHOOL表：可能通过赛项信息关联

### 7.3 外部关联
- 与学生信息表关联：studentNumber
- 与用户表关联：submitterId
- 与表单管理表关联：formId
- 与组织表关联：organizationId

### 7.4 文件系统关联
- 与文件存储系统关联：certificateFile字段
- 与证书模板系统关联：证书格式和内容验证

## 8. SQL使用示例

### 8.1 查询示例

```sql
-- 查询特定学年的所有证书
SELECT
    formUserId,
    studentName,
    studentNumber,
    competitionName,
    academicYear,
    certificateFile,
    approvalStatus,
    submitterName,
    insertTimestamp
FROM CERTIFICATE_MANAGEMENT
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
ORDER BY insertTimestamp DESC;

-- 查询某个学生的所有获奖证书
SELECT
    formUserId,
    competitionName,
    academicYear,
    certificateFile,
    approvalCompleteTime,
    submitterName
FROM CERTIFICATE_MANAGEMENT
WHERE studentNumber = '2021001234'
    AND approvalStatus = '已通过'
ORDER BY academicYear DESC, insertTimestamp DESC;

-- 按赛项统计证书颁发情况
SELECT
    competitionName,
    academicYear,
    COUNT(*) as certificate_count,
    COUNT(DISTINCT studentNumber) as unique_students,
    COUNT(CASE WHEN certificateFile LIKE '%.pdf%' THEN 1 END) as pdf_count,
    COUNT(CASE WHEN certificateFile LIKE '%.jpg%' OR certificateFile LIKE '%.jpeg%' THEN 1 END) as jpg_count
FROM CERTIFICATE_MANAGEMENT
WHERE approvalStatus = '已通过'
GROUP BY competitionName, academicYear
ORDER BY academicYear DESC, certificate_count DESC;

-- 查询证书文件缺失或无效的情况
SELECT
    formUserId,
    studentName,
    studentNumber,
    competitionName,
    academicYear,
    certificateFile,
    CASE
        WHEN certificateFile IS NULL OR certificateFile = '' THEN '证书文件缺失'
        ELSE '证书文件存在'
    END as file_status
FROM CERTIFICATE_MANAGEMENT
WHERE academicYear = '2024-2025'
    AND approvalStatus = '已通过'
    AND (certificateFile IS NULL OR certificateFile = '');
```

### 8.2 数据统计示例

```sql
-- 统计各学年证书颁发情况
SELECT
    academicYear,
    COUNT(*) as total_certificates,
    COUNT(DISTINCT studentNumber) as unique_students,
    COUNT(DISTINCT competitionName) as competition_diversity,
    COUNT(CASE WHEN approvalStatus = '已通过' THEN 1 END) as approved_certificates
FROM CERTIFICATE_MANAGEMENT
GROUP BY academicYear
ORDER BY academicYear DESC;

-- 分析证书文件格式分布
SELECT
    'PDF格式' as file_format,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM CERTIFICATE_MANAGEMENT WHERE approvalStatus = '已通过'), 2) as percentage
FROM CERTIFICATE_MANAGEMENT
WHERE approvalStatus = '已通过' AND certificateFile LIKE '%.pdf%'
UNION ALL
SELECT
    'JPG格式' as file_format,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM CERTIFICATE_MANAGEMENT WHERE approvalStatus = '已通过'), 2) as percentage
FROM CERTIFICATE_MANAGEMENT
WHERE approvalStatus = '已通过' AND (certificateFile LIKE '%.jpg%' OR certificateFile LIKE '%.jpeg%')
UNION ALL
SELECT
    'PNG格式' as file_format,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM CERTIFICATE_MANAGEMENT WHERE approvalStatus = '已通过'), 2) as percentage
FROM CERTIFICATE_MANAGEMENT
WHERE approvalStatus = '已通过' AND certificateFile LIKE '%.png%';

-- 统计学生获奖证书数量分布
SELECT
    certificate_count,
    student_count
FROM (
    SELECT
        COUNT(*) as certificate_count,
        COUNT(DISTINCT studentNumber) as student_count
    FROM CERTIFICATE_MANAGEMENT
    WHERE approvalStatus = '已通过'
        AND academicYear = '2024-2025'
    GROUP BY studentNumber
) as student_stats
GROUP BY certificate_count
ORDER BY certificate_count;
```

### 8.3 数据质量检查示例

```sql
-- 检查数据完整性
SELECT
    '缺少学生姓名' as issue,
    COUNT(*) as count
FROM CERTIFICATE_MANAGEMENT
WHERE studentName IS NULL OR studentName = ''
UNION ALL
SELECT
    '缺少学号' as issue,
    COUNT(*) as count
FROM CERTIFICATE_MANAGEMENT
WHERE studentNumber IS NULL OR studentNumber = ''
UNION ALL
SELECT
    '缺少赛项名称' as issue,
    COUNT(*) as count
FROM CERTIFICATE_MANAGEMENT
WHERE competitionName IS NULL OR competitionName = ''
UNION ALL
SELECT
    '缺少证书文件' as issue,
    COUNT(*) as count
FROM CERTIFICATE_MANAGEMENT
WHERE certificateFile IS NULL OR certificateFile = '';

-- 查找可能的重复证书记录
SELECT
    studentNumber,
    studentName,
    competitionName,
    academicYear,
    COUNT(*) as duplicate_count
FROM CERTIFICATE_MANAGEMENT
GROUP BY studentNumber, studentName, competitionName, academicYear
HAVING COUNT(*) > 1;

-- 检查学号格式规范性
SELECT
    formUserId,
    studentNumber,
    studentName,
    '学号格式异常' as issue
FROM CERTIFICATE_MANAGEMENT
WHERE studentNumber NOT REGEXP '^[0-9]{10,12}$'  -- 假设学号为10-12位数字
    AND studentNumber IS NOT NULL
    AND studentNumber != '';
```

### 8.4 关联查询示例

```sql
-- 关联成绩表查询证书信息
SELECT
    c.formUserId as certificate_id,
    c.studentName,
    c.studentNumber,
    c.competitionName,
    e.competitionLevel,
    e.organizer,
    s.awardLevel,
    c.certificateFile,
    c.approvalStatus
FROM CERTIFICATE_MANAGEMENT c
LEFT JOIN SCORE_EXTERNAL e ON c.competitionName = e.competitionName
    AND c.studentNumber = (SELECT studentNumber FROM SCORE_STUDENT_EXTERNAL WHERE formUserId = e.formUserId LIMIT 1)
LEFT JOIN SCORE_STUDENT_EXTERNAL s ON e.formUserId = s.formUserId
    AND c.studentNumber = s.studentNumber
WHERE c.academicYear = '2024-2025'
    AND c.approvalStatus = '已通过'
ORDER BY c.studentName, c.competitionName;
```

## 9. 数据维护建议

### 9.1 数据质量管理
- 定期检查各字段的数据完整性和规范性
- 验证学号字段的格式规范性和唯一性
- 监控证书文件的有效性和可访问性
- 检查学生姓名与学号的一致性

### 9.2 证书文件管理
- 定期检查证书文件的完整性和可读性
- 建立证书文件备份和恢复机制
- 监控证书文件存储空间使用情况
- 对损坏或无效的证书文件进行及时修复

### 9.3 性能优化建议
- 为常用查询组合建立复合索引
- 考虑对大字段（证书文件路径）进行单独优化
- 定期分析查询模式，优化索引策略
- 对历史证书数据进行归档处理

### 9.4 数据安全建议
- 对证书文件进行安全扫描，防止恶意文件
- 建立证书文件访问权限控制机制
- 限制证书文件的下载和分享权限
- 记录证书操作的详细审计日志

### 9.5 业务监控建议
- 监控证书上传的及时性和完整性
- 跟踪证书审批流程的效率
- 分析证书文件格式的使用趋势
- 统计学生证书获取情况和分布

### 9.6 合规性建议
- 确保证书管理符合相关法律法规要求
- 定期备份重要证书数据
- 建立证书数据的长期保存机制
- 制定证书数据的销毁和更新政策