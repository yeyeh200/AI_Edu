# SCORE_INDIVIDUAL_SCHOOL 个人赛成绩录入（校级赛）表

## 基本信息

- **表名**：`SCORE_INDIVIDUAL_SCHOOL`（原表名：`t_approve_data_6586_118185_1729113909047_end`）
- **中文名称**：个人赛成绩录入（校级赛）
- **用途**：记录校级个人赛成绩信息，包括学年、赛项名称、参赛学生成绩等
- **字段数量**：19个
- **数据类别**：竞赛系统 - 成绩管理模块

## 字段定义

| 字段名 | 原字段名 | 数据类型 | 长度 | 是否为空 | 主键 | 默认值 | 备注 |
|--------|----------|----------|------|----------|------|--------|------|
| id | formUserId | bigint | 20 | NO | YES | - | 表单数据ID，主键 |
| form_id | formId | bigint | 20 | NO | NO | - | 表单ID |
| form_name | formName | varchar | 765 | YES | NO | - | 表单名称 |
| submitter_name | uname | varchar | 90 | YES | NO | - | 提交人姓名 |
| submitter_id | uid | bigint | 20 | NO | NO | - | 表单创建者用户ID |
| insert_time | inserttime | bigint | 20 | NO | NO | - | 提交时间戳 |
| update_time | updatetime | bigint | 20 | NO | NO | - | 修改时间戳 |
| sync_time | opUpdTime | bigint | 20 | NO | NO | - | 数据同步到仓库变动时间戳 |
| title | title | varchar | 765 | YES | NO | - | 标题 |
| complete_time | completetime | bigint | 20 | YES | NO | - | 审批完成时间 |
| approval_status | aprvStatus | varchar | 60 | YES | NO | - | 审批状态 |
| approval_status_id | aprvStatusId | bigint | 20 | YES | NO | - | 审批状态ID |
| approvers | ApprovalProcess | varchar | 1048576 | YES | NO | - | 审批人 |
| cc_users | CCUsers | varchar | 1048576 | YES | NO | - | 抄送人 |
| department_id | fid | bigint | 20 | NO | NO | - | 单位ID |
| page_url | pageLinkUrl | varchar | 765 | YES | NO | - | 页面地址 |
| academic_year | 14 | varchar | 65533 | YES | NO | - | 学年 |
| competition_name | 15 | varchar | 65533 | YES | NO | - | 赛项名称 |

## 字段详细说明

### 主键字段
- **id**：表单数据ID，成绩录入记录的唯一标识符

### 系统字段
- **form_id**：表单ID，系统内部表单标识
- **form_name**：表单名称，表单的显示名称
- **submitter_name**：提交人姓名，提交成绩录入的用户姓名
- **submitter_id**：表单创建者用户ID，提交成绩录入的用户ID
- **insert_time**：提交时间戳，成绩录入记录创建时间
- **update_time**：修改时间戳，成绩录入记录最后修改时间
- **sync_time**：数据同步时间戳，数据同步到数据仓库的时间
- **title**：标题，成绩录入记录的标题
- **complete_time**：审批完成时间，成绩录入审批完成的时间

### 审批流程字段
- **approval_status**：审批状态，当前成绩录入审批状态
- **approval_status_id**：审批状态ID，审批状态的标识ID
- **approvers**：审批人，审批流程中的审批人员列表
- **cc_users**：抄送人，需要抄送的人员列表

### 组织字段
- **department_id**：单位ID，成绩录入部门或学院的ID
- **page_url**：页面地址，成绩录入页面的访问地址

### 竞赛信息字段
- **academic_year**：学年，成绩录入所属的学年
- **competition_name**：赛项名称，成绩录入对应的竞赛项目名称

## 关联子表说明

本表与以下子表形成主从关系：
- **SCORE_STUDENT_INDIVIDUAL** - 个人赛参赛学生信息子表
- 通过 `formUserId` 字段进行关联
- 子表包含学生的详细信息和成绩数据

## 成绩录入流程

### 录入流程
1. **创建记录**：创建成绩录入主记录
2. **添加学生**：添加参赛学生信息到子表
3. **录入成绩**：为每个学生录入初赛和决赛成绩
4. **评定等级**：根据成绩评定获奖等级
5. **提交审核**：提交成绩录入进行审核

### 审核流程
1. **教师审核**：任课教师或竞赛负责人审核
2. **学院审核**：学院相关部门审核
3. **教务审核**：教务部门最终审核
4. **结果确认**：确认成绩录入结果

## 成绩数据说明

### 成绩构成
- **初赛成绩**：初赛阶段的成绩
- **决赛成绩**：决赛阶段的成绩
- **获奖等级**：根据成绩评定的获奖等级

### 获奖等级分类
- **一等奖**：成绩最优秀的参赛者
- **二等奖**：成绩优秀的参赛者
- **三等奖**：成绩良好的参赛者
- **优秀奖**：表现突出的参赛者
- **参与奖**：完成竞赛但未获奖的参赛者

## 审批状态说明

### 常见审批状态
- **草稿**：成绩信息正在录入
- **待审核**：提交后等待审核
- **审核中**：成绩正在审核
- **审核通过**：成绩审核通过
- **审核驳回**：成绩审核被驳回
- **已发布**：成绩已发布给学生

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`submitter_id` 应引用用户表的有效记录
3. **外键约束**：`department_id` 应引用部门表的有效记录
4. **检查约束**：`approval_status` 应符合预设的审批状态值
5. **关联约束**：主表与子表通过 `formUserId` 关联

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **用户索引**：`submitter_id` - 用于查询用户提交的记录
- **学年索引**：`academic_year` - 用于按学年查询
- **竞赛名称索引**：`competition_name` - 用于按竞赛查询
- **状态索引**：`approval_status` - 用于按审批状态筛选
- **时间索引**：`insert_time` - 用于按时间排序查询
- **关联索引**：`formUserId` - 用于关联子表查询

## 数据关联关系

### 主要外键关联
- **用户信息表**：通过 `submitter_id` 关联提交成绩录入的用户信息
- **学院信息表**：通过 `department_id` 关联学院详细信息
- **竞赛信息表**：通过 `competition_name` 关联竞赛详细信息

### 子表关联
- **个人赛参赛学生信息子表**：通过 `formUserId` 一对多关联，包含学生详细信息和成绩

### 业务关联
- **竞赛申报表**：关联竞赛申报参赛信息
- **报名审核表**：关联竞赛报名审核信息
- **证书管理表**：关联竞赛证书信息
- **材料管理表**：关联竞赛材料信息

## 使用示例

### SQL查询示例

```sql
-- 查询某学年的成绩录入记录
SELECT id, competition_name, academic_year, submitter_name,
       approval_status, insert_time, complete_time
FROM SCORE_INDIVIDUAL_SCHOOL
WHERE academic_year = '2024'
ORDER BY insert_time DESC;

-- 查询某竞赛的成绩录入情况
SELECT id, competition_name, submitter_name, approval_status,
       insert_time, complete_time
FROM SCORE_INDIVIDUAL_SCHOOL
WHERE competition_name = '校级数学建模竞赛'
ORDER BY insert_time DESC;

-- 查询已审核通过的成绩录入
SELECT id, competition_name, academic_year, submitter_name,
       complete_time, department_id
FROM SCORE_INDIVIDUAL_SCHOOL
WHERE approval_status = '审核通过'
ORDER BY complete_time DESC;

-- 查询某教师录入的成绩
SELECT id, competition_name, academic_year, approval_status,
       insert_time, complete_time
FROM SCORE_INDIVIDUAL_SCHOOL
WHERE submitter_id = 1001
ORDER BY insert_time DESC;

-- 统计各竞赛的成绩录入情况
SELECT
    competition_name,
    COUNT(*) as score_count,
    COUNT(CASE WHEN approval_status = '审核通过' THEN 1 END) as approved_count,
    COUNT(CASE WHEN approval_status = '待审核' THEN 1 END) as pending_count
FROM SCORE_INDIVIDUAL_SCHOOL
WHERE academic_year = '2024'
GROUP BY competition_name
ORDER BY score_count DESC;
```

### 关联查询示例（主表+子表）
```sql
-- 查询某竞赛的所有参赛学生成绩
SELECT
    main.competition_name,
    main.academic_year,
    student.name,
    student.student_number,
    student.college,
    student.preliminary_score,
    student.final_score,
    student.award_level
FROM SCORE_INDIVIDUAL_SCHOOL main
JOIN SCORE_STUDENT_INDIVIDUAL student ON main.id = student.formUserId
WHERE main.competition_name = '校级数学建模竞赛'
  AND main.approval_status = '审核通过'
ORDER BY student.final_score DESC;
```

### 数据插入示例

```sql
INSERT INTO SCORE_INDIVIDUAL_SCHOOL (
    form_id, form_name, submitter_name, submitter_id,
    academic_year, competition_name
) VALUES (
    5001, '个人赛成绩录入表', '王老师', 5001,
    '2024', '校级数学建模竞赛'
);
```

## 业务逻辑说明

### 成绩录入原则
1. **准确性原则**：确保成绩录入的准确性
2. **及时性原则**：及时完成成绩录入工作
3. **完整性原则**：确保所有参赛学生成绩都录入
4. **规范性原则**：按照统一规范录入成绩

### 成绩审核管理
1. **多层审核**：建立教师、学院、教务三级审核机制
2. **成绩核对**：核对成绩录入的正确性
3. **等级评定**：根据标准评定获奖等级
4. **结果确认**：确认最终成绩和获奖名单

### 数据质量控制
1. **成绩范围检查**：检查成绩是否在合理范围内
2. **等级一致性**：确保等级评定标准一致
3. **重复录入检查**：避免重复录入同一学生成绩
4. **完整性检查**：确保所有参赛学生都有成绩记录

## 数据维护建议

### 定期维护
1. **成绩更新**：及时更新成绩录入信息
2. **状态维护**：维护审批状态的准确性
3. **数据备份**：定期备份成绩数据
4. **数据归档**：定期归档历史成绩数据

### 异常处理
1. **成绩错误**：处理成绩录入错误情况
2. **等级争议**：处理获奖等级争议
3. **重复记录**：检查并处理重复成绩记录
4. **缺失数据**：补充缺失的学生成绩

### 质量保证
1. **录入培训**：对成绩录入人员进行培训
2. **审核指导**：提供详细的审核指导
3. **标准制定**：制定统一的录入和审核标准
4. **监督检查**：建立监督检查机制

---

**数据来源**：竞赛管理系统
**维护单位**：教务处、各院系
**更新频率**：成绩录入时实时更新，审核结束后定期维护