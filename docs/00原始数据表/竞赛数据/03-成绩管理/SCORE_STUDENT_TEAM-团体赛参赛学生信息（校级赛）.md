# SCORE_STUDENT_TEAM 团体赛参赛学生信息（校级赛）数据字典

## 1. 基本信息

| 项目 | 内容 |
|------|------|
| 标准表名 | SCORE_STUDENT_TEAM |
| 原表名 | t_approve_data_6586_124117_1729113877063_end_17 |
| 表用途 | 团体赛参赛学生信息（校级赛）子表，存储校级团体赛中学生个人的参赛信息和成绩 |
| 字段数量 | 11个字段 |
| 数据类别 | 成绩管理数据 |
| 所属模块 | 03-成绩管理 |

## 2. 字段定义

| 序号 | 原字段名 | 标准字段名 | 字段说明 | 字段类型 | 长度 | 主键 | 约束 |
|------|----------|------------|----------|----------|------|------|------|
| 1 | id | id | 自增主键ID | bigint | 20 | 是 | NOT NULL |
| 2 | formUserId | formUserId | 关联主表的表单数据ID | bigint | 20 | 是 | NOT NULL |
| 3 | formId | formId | 关联的表单ID | bigint | 20 | 否 | |
| 4 | 18 | studentName | 学生姓名 | varchar | 1048576 | 否 | |
| 5 | 19 | studentNumber | 学号 | varchar | 1048576 | 否 | |
| 6 | 20 | collegeName | 所属学院 | varchar | 1048576 | 否 | |
| 7 | 21 | className | 班级 | varchar | 1048576 | 否 | |
| 8 | 26 | teamName | 团队名称 | varchar | 1048576 | 否 | |
| 9 | 25 | preliminaryScore | 初赛成绩 | varchar | 1048576 | 否 | |
| 10 | 24 | finalScore | 决赛成绩 | varchar | 1048576 | 否 | |
| 11 | 23 | awardLevel | 获奖等级 | varchar | 1048576 | 否 | |

## 3. 字段详细说明

### 3.1 系统关联字段

- **id**: 表的自增主键，确保记录唯一性
- **formUserId**: 关联主表SCORE_TEAM_SCHOOL的formUserId，建立主从关系
- **formId**: 关联的表单ID，与主表保持一致

### 3.2 学生基本信息字段

- **studentName**: 参赛学生的真实姓名
- **studentNumber**: 学生学号，作为学生身份的唯一标识
- **collegeName**: 学生所属的学院名称
- **className**: 学生所在班级名称

### 3.3 团队信息字段

- **teamName**: 参赛团队名称，同一团队的所有学生记录此字段值相同

### 3.4 成绩与获奖信息字段

- **preliminaryScore**: 初赛成绩，可能为数值或文字描述
- **finalScore**: 决赛成绩，记录最终比赛成绩
- **awardLevel**: 获奖等级，如：一等奖、二等奖、三等奖、优秀奖等

## 4. 业务逻辑说明

### 4.1 数据关系
- 本表作为SCORE_TEAM_SCHOOL的子表，通过formUserId建立关联
- 一个团体赛成绩记录可以对应多个学生参赛记录
- 同一团队的学生记录具有相同的teamName和formUserId

### 4.2 业务规则
- 每个学生参赛记录必须关联到有效的团体赛成绩主表记录
- 团队名称在同一赛事中应保持一致
- 学号应为学生的唯一标识，避免重复记录
- 获奖等级应与成绩记录相对应

### 4.3 数据完整性
- formUserId必须存在于主表SCORE_TEAM_SCHOOL中
- 同一团队的所有学生记录应具有相同的参赛信息

## 5. 数据约束

### 5.1 主键约束
- PRIMARY KEY (id) - 自增主键，确保记录唯一性

### 5.2 复合主键约束
- PRIMARY KEY (id, formUserId) - 业务上的复合主键

### 5.3 外键约束
- FOREIGN KEY (formUserId) REFERENCES SCORE_TEAM_SCHOOL(formUserId)

### 5.4 业务约束
- studentName 学生姓名不能为空
- studentNumber 学号不能为空，且应格式规范
- teamName 同一赛事中团队名称应保持一致

## 6. 索引建议

### 6.1 主键索引
- PRIMARY KEY (id)
- PRIMARY KEY (id, formUserId)

### 6.2 外键索引
- INDEX idx_form_user_id (formUserId) - 用于与主表关联查询

### 6.3 业务查询索引
- INDEX idx_student_number (studentNumber) - 用于按学号查询学生信息
- INDEX idx_team_name (teamName, formUserId) - 用于按团队名称查询
- INDEX idx_college_class (collegeName, className) - 用于按学院班级统计
- INDEX idx_award_level (awardLevel) - 用于按获奖等级查询
- INDEX idx_team_student (teamName, studentName) - 用于团队内学生查询

## 7. 数据关联关系

### 7.1 多对一关系
- SCORE_STUDENT_TEAM → SCORE_TEAM_SCHOOL (N:1)
  - 关联字段：formUserId
  - 说明：多个学生参赛记录对应一个团体赛成绩记录

### 7.2 外部关联
- 与学生信息表关联：studentNumber
- 与学院信息表关联：collegeName
- 与班级信息表关联：className

### 7.3 聚合关系
- 同一teamName下可以有多条学生记录
- 相同学生可以参与不同团队的竞赛

## 8. SQL使用示例

### 8.1 查询示例

```sql
-- 查询特定团队的所有参赛学生
SELECT
    studentName,
    studentNumber,
    collegeName,
    className,
    preliminaryScore,
    finalScore,
    awardLevel
FROM SCORE_STUDENT_TEAM
WHERE teamName = '数学建模团队A'
    AND formUserId = '123456'
ORDER BY studentName;

-- 查询某个学生的所有参赛记录
SELECT
    t.competitionName,
    s.teamName,
    s.preliminaryScore,
    s.finalScore,
    s.awardLevel
FROM SCORE_STUDENT_TEAM s
INNER JOIN SCORE_TEAM_SCHOOL t ON s.formUserId = t.formUserId
WHERE s.studentNumber = '2021001234'
ORDER BY t.insertTimestamp DESC;

-- 统计各学院获奖情况
SELECT
    collegeName,
    awardLevel,
    COUNT(*) as student_count,
    COUNT(DISTINCT teamName) as team_count
FROM SCORE_STUDENT_TEAM s
INNER JOIN SCORE_TEAM_SCHOOL t ON s.formUserId = t.formUserId
WHERE t.approvalStatus = '已通过'
    AND t.academicYear = '2024-2025'
    AND s.awardLevel IS NOT NULL
GROUP BY collegeName, awardLevel
ORDER BY collegeName, awardLevel;

-- 查询团队规模分析
SELECT
    teamName,
    COUNT(*) as team_size,
    collegeName,
    awardLevel
FROM SCORE_STUDENT_TEAM
WHERE formUserId IN (
    SELECT formUserId
    FROM SCORE_TEAM_SCHOOL
    WHERE academicYear = '2024-2025'
        AND approvalStatus = '已通过'
)
GROUP BY teamName, collegeName, awardLevel
ORDER BY team_size DESC;
```

### 8.2 数据统计示例

```sql
-- 统计各获奖等级的学生分布
SELECT
    awardLevel,
    COUNT(*) as student_count,
    COUNT(DISTINCT teamName) as team_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM SCORE_STUDENT_TEAM), 2) as percentage
FROM SCORE_STUDENT_TEAM
WHERE awardLevel IS NOT NULL
    AND formUserId IN (
        SELECT formUserId FROM SCORE_TEAM_SCHOOL WHERE approvalStatus = '已通过'
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

-- 分析参赛学生的学院分布
SELECT
    collegeName,
    COUNT(DISTINCT studentNumber) as unique_students,
    COUNT(*) as total_participations,
    COUNT(DISTINCT teamName) as teams_count
FROM SCORE_STUDENT_TEAM
WHERE formUserId IN (
    SELECT formUserId FROM SCORE_TEAM_SCHOOL
    WHERE academicYear = '2024-2025'
        AND approvalStatus = '已通过'
)
GROUP BY collegeName
ORDER BY unique_students DESC;
```

### 8.3 数据维护示例

```sql
-- 检查数据完整性
-- 查找孤立的子表记录（没有对应主表记录）
SELECT
    s.formUserId,
    s.teamName,
    s.studentName
FROM SCORE_STUDENT_TEAM s
LEFT JOIN SCORE_TEAM_SCHOOL t ON s.formUserId = t.formUserId
WHERE t.formUserId IS NULL;

-- 查找同一团队中学号重复的记录
SELECT
    teamName,
    formUserId,
    studentNumber,
    COUNT(*) as duplicate_count
FROM SCORE_STUDENT_TEAM
GROUP BY teamName, formUserId, studentNumber
HAVING COUNT(*) > 1;
```

## 9. 数据维护建议

### 9.1 数据质量管理
- 定期检查formUserId的外键完整性
- 验证studentNumber字段的唯一性和格式规范性
- 监控teamName在同一赛事中的一致性
- 检查awardLevel字段的数据规范性

### 9.2 性能优化建议
- 为频繁查询的字段组合建立复合索引
- 考虑对大数据量进行分区，如按学年或学院分区
- 定期分析查询模式，优化索引策略

### 9.3 数据清洗建议
- 定期清理无效或重复的学生参赛记录
- 标准化学院和班级名称的格式
- 验证获奖等级与成绩的对应关系

### 9.4 数据安全建议
- 对学生学号等敏感信息进行加密或脱敏处理
- 限制对学生个人信息的访问权限
- 记录数据修改的详细审计日志

### 9.5 数据备份建议
- 按学年对参赛学生数据进行备份
- 重要数据变更前应进行完整备份
- 建立数据恢复的测试流程