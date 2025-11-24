# SCORE_STUDENT_EXTERNAL 校外赛参赛学生信息数据字典

## 1. 基本信息

| 项目 | 内容 |
|------|------|
| 标准表名 | SCORE_STUDENT_EXTERNAL |
| 原表名 | t_approve_data_6586_118264_1729113909047_end_47 |
| 表用途 | 校外赛参赛学生信息（子表），存储校外竞赛中学生个人的参赛信息和获奖情况 |
| 字段数量 | 8个字段 |
| 数据类别 | 成绩管理数据 |
| 所属模块 | 03-成绩管理 |

## 2. 字段定义

| 序号 | 原字段名 | 标准字段名 | 字段说明 | 字段类型 | 长度 | 主键 | 约束 |
|------|----------|------------|----------|----------|------|------|------|
| 1 | id | id | 自增主键ID | bigint | 20 | 是 | NOT NULL |
| 2 | formUserId | formUserId | 关联主表的表单数据ID | bigint | 20 | 是 | NOT NULL |
| 3 | formId | formId | 关联的表单ID | bigint | 20 | 否 | |
| 4 | 48 | awardLevel | 获奖等级 | varchar | 1048576 | 否 | |
| 5 | 49 | studentName | 学生姓名 | varchar | 1048576 | 否 | |
| 6 | 50 | studentNumber | 学号 | varchar | 1048576 | 否 | |
| 7 | 51 | collegeName | 所属学院 | varchar | 1048576 | 否 | |
| 8 | 52 | majorName | 所属专业 | varchar | 1048576 | 否 | |
| 9 | 53 | className | 班级 | varchar | 1048576 | 否 | |
| 10 | 54 | instructorName | 指导教师 | varchar | 1048576 | 否 | |

## 3. 字段详细说明

### 3.1 系统关联字段

- **id**: 表的自增主键，确保记录唯一性
- **formUserId**: 关联主表SCORE_EXTERNAL的formUserId，建立主从关系
- **formId**: 关联的表单ID，与主表保持一致

### 3.2 学生基本信息字段

- **studentName**: 参赛学生的真实姓名
- **studentNumber**: 学生学号，作为学生身份的唯一标识
- **collegeName**: 学生所属的学院名称
- **majorName**: 学生所学专业名称
- **className**: 学生所在班级名称

### 3.3 获奖与指导信息字段

- **awardLevel**: 获奖等级，如：一等奖、二等奖、三等奖、优秀奖等
- **instructorName**: 指导教师姓名，记录指导学生参赛的教师信息

## 4. 业务逻辑说明

### 4.1 数据关系
- 本表作为SCORE_EXTERNAL的子表，通过formUserId建立关联
- 一个校外赛成绩记录可以对应多个学生参赛记录
- 学生参与校外竞赛可以是个人赛或团体赛

### 4.2 业务规则
- 每个学生参赛记录必须关联到有效的校外赛成绩主表记录
- 学号应为学生的唯一标识，避免重复记录
- 获奖等级应与主表的竞赛信息相对应
- 指导教师信息有助于追踪教学质量

### 4.3 数据完整性
- formUserId必须存在于主表SCORE_EXTERNAL中
- 学生基本信息（姓名、学号、学院等）应保持完整性
- 获奖等级信息应与主表竞赛级别相匹配

## 5. 数据约束

### 5.1 主键约束
- PRIMARY KEY (id) - 自增主键，确保记录唯一性

### 5.2 复合主键约束
- PRIMARY KEY (id, formUserId) - 业务上的复合主键

### 5.3 外键约束
- FOREIGN KEY (formUserId) REFERENCES SCORE_EXTERNAL(formUserId)

### 5.4 业务约束
- studentName 学生姓名不能为空
- studentNumber 学号不能为空，且应格式规范
- awardLevel 获奖等级应在预定义等级列表内

### 5.5 数据质量约束
- 学号应在学籍系统中存在对应记录
- 学院名称应与学院信息表保持一致
- 专业名称应与专业信息表保持一致

## 6. 索引建议

### 6.1 主键索引
- PRIMARY KEY (id)
- PRIMARY KEY (id, formUserId)

### 6.2 外键索引
- INDEX idx_form_user_id (formUserId) - 用于与主表关联查询

### 6.3 业务查询索引
- INDEX idx_student_number (studentNumber) - 用于按学号查询学生信息
- INDEX idx_college_major (collegeName, majorName) - 用于按学院专业统计
- INDEX idx_award_level (awardLevel) - 用于按获奖等级查询
- INDEX idx_instructor (instructorName) - 用于按指导教师查询
- INDEX idx_student_info (studentName, studentNumber) - 用于学生信息查询

### 6.4 复合索引
- INDEX idx_college_award (collegeName, awardLevel) - 用于学院获奖统计
- INDEX idx_major_instructor (majorName, instructorName) - 用于专业指导教师统计

## 7. 数据关联关系

### 7.1 多对一关系
- SCORE_STUDENT_EXTERNAL → SCORE_EXTERNAL (N:1)
  - 关联字段：formUserId
  - 说明：多个学生参赛记录对应一个校外赛成绩记录

### 7.2 外部关联
- 与学生信息表关联：studentNumber
- 与学院信息表关联：collegeName
- 与专业信息表关联：majorName
- 与班级信息表关联：className
- 与教师信息表关联：instructorName

### 7.3 统计关联
- 同一指导教师可以指导多个学生参赛
- 同一学院、专业的学生可以参加多个校外竞赛
- 学生可以获得不同等级的奖项

## 8. SQL使用示例

### 8.1 查询示例

```sql
-- 查询特定校外赛的所有参赛学生
SELECT
    studentName,
    studentNumber,
    collegeName,
    majorName,
    className,
    awardLevel,
    instructorName
FROM SCORE_STUDENT_EXTERNAL
WHERE formUserId = '123456'
ORDER BY awardLevel, studentName;

-- 查询某个学生的所有校外赛获奖记录
SELECT
    e.competitionName,
    e.competitionLevel,
    e.organizer,
    e.awardMonth,
    s.awardLevel,
    s.instructorName
FROM SCORE_STUDENT_EXTERNAL s
INNER JOIN SCORE_EXTERNAL e ON s.formUserId = e.formUserId
WHERE s.studentNumber = '2021001234'
    AND e.approvalStatus = '已通过'
ORDER BY e.awardMonth DESC;

-- 统计各学院校外赛获奖情况
SELECT
    collegeName,
    majorName,
    awardLevel,
    COUNT(*) as student_count,
    COUNT(DISTINCT instructorName) as instructor_count
FROM SCORE_STUDENT_EXTERNAL s
INNER JOIN SCORE_EXTERNAL e ON s.formUserId = e.formUserId
WHERE e.approvalStatus = '已通过'
    AND e.academicYear = '2024-2025'
    AND s.awardLevel IS NOT NULL
GROUP BY collegeName, majorName, awardLevel
ORDER BY collegeName, majorName,
    CASE awardLevel
        WHEN '一等奖' THEN 1
        WHEN '二等奖' THEN 2
        WHEN '三等奖' THEN 3
        WHEN '优秀奖' THEN 4
        ELSE 5
    END;

-- 查询指导教师的指导成效
SELECT
    instructorName,
    COUNT(*) as total_students,
    COUNT(DISTINCT collegeName) as college_count,
    COUNT(DISTINCT majorName) as major_count,
    COUNT(CASE WHEN awardLevel = '一等奖' THEN 1 END) as first_prize_count,
    COUNT(CASE WHEN awardLevel = '二等奖' THEN 1 END) as second_prize_count,
    COUNT(CASE WHEN awardLevel = '三等奖' THEN 1 END) as third_prize_count
FROM SCORE_STUDENT_EXTERNAL
WHERE formUserId IN (
    SELECT formUserId
    FROM SCORE_EXTERNAL
    WHERE academicYear = '2024-2025'
        AND approvalStatus = '已通过'
)
    AND instructorName IS NOT NULL
GROUP BY instructorName
HAVING COUNT(*) >= 3  -- 指导至少3名学生
ORDER BY total_students DESC;
```

### 8.2 数据统计示例

```sql
-- 统计各获奖等级的学生分布
SELECT
    awardLevel,
    COUNT(*) as student_count,
    COUNT(DISTINCT studentNumber) as unique_students,
    COUNT(DISTINCT collegeName) as college_count,
    COUNT(DISTINCT instructorName) as instructor_count
FROM SCORE_STUDENT_EXTERNAL
WHERE awardLevel IS NOT NULL
    AND formUserId IN (
        SELECT formUserId FROM SCORE_EXTERNAL WHERE approvalStatus = '已通过'
    )
GROUP BY awardLevel
ORDER BY
    CASE awardLevel
        WHEN '一等奖' THEN 1
        WHEN '二等奖' THEN 2
        WHEN '三等奖' THEN 3
        WHEN '优秀奖' THEN 4
        ELSE 5
    END;

-- 分析专业获奖情况
SELECT
    collegeName,
    majorName,
    COUNT(*) as total_awards,
    COUNT(DISTINCT studentNumber) as unique_students,
    COUNT(CASE WHEN awardLevel IN ('一等奖', '二等奖') THEN 1 END) as high_level_awards,
    ROUND(COUNT(CASE WHEN awardLevel IN ('一等奖', '二等奖') THEN 1 END) * 100.0 / COUNT(*), 2) as high_level_percentage
FROM SCORE_STUDENT_EXTERNAL
WHERE formUserId IN (
    SELECT formUserId FROM SCORE_EXTERNAL
    WHERE academicYear = '2024-2025'
        AND approvalStatus = '已通过'
)
GROUP BY collegeName, majorName
ORDER BY high_level_awards DESC, total_awards DESC;
```

### 8.3 数据维护示例

```sql
-- 检查数据完整性
-- 查找孤立的子表记录（没有对应主表记录）
SELECT
    s.formUserId,
    s.studentName,
    s.studentNumber
FROM SCORE_STUDENT_EXTERNAL s
LEFT JOIN SCORE_EXTERNAL e ON s.formUserId = e.formUserId
WHERE e.formUserId IS NULL;

-- 查找学号重复的记录（可能的数据质量问题）
SELECT
    studentNumber,
    studentName,
    COUNT(*) as duplicate_count,
    GROUP_CONCAT(DISTINCT collegeName) as colleges
FROM SCORE_STUDENT_EXTERNAL
WHERE studentNumber IS NOT NULL
GROUP BY studentNumber, studentName
HAVING COUNT(*) > 1;

-- 查找缺少必要信息的记录
SELECT
    COUNT(*) as missing_name_count
FROM SCORE_STUDENT_EXTERNAL
WHERE studentName IS NULL OR studentName = ''
UNION ALL
SELECT
    COUNT(*) as missing_number_count
FROM SCORE_STUDENT_EXTERNAL
WHERE studentNumber IS NULL OR studentNumber = ''
UNION ALL
SELECT
    COUNT(*) as missing_college_count
FROM SCORE_STUDENT_EXTERNAL
WHERE collegeName IS NULL OR collegeName = '';
```

## 9. 数据维护建议

### 9.1 数据质量管理
- 定期检查formUserId的外键完整性
- 验证studentNumber字段的唯一性和格式规范性
- 监控awardLevel字段的数据规范性
- 检查instructorName字段的完整性

### 9.2 性能优化建议
- 为频繁查询的字段组合建立复合索引
- 考虑对大数据量进行分区，如按学年或学院分区
- 定期分析查询模式，优化索引策略
- 对历史数据进行归档处理

### 9.3 数据清洗建议
- 定期清理无效或重复的学生参赛记录
- 标准化学院、专业、班级名称的格式
- 验证获奖等级与主表竞赛级别的对应关系
- 统一指导教师姓名的格式规范

### 9.4 数据安全建议
- 对学生学号等敏感信息进行加密或脱敏处理
- 限制对学生个人信息的访问权限
- 记录数据修改的详细审计日志
- 建立数据访问的权限控制机制

### 9.5 业务监控建议
- 监控各学院、专业的校外赛参与情况
- 跟踪指导教师的指导效果统计
- 分析获奖等级分布和变化趋势
- 统计学生重复参赛和获奖情况