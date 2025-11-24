# COMPETITION_REGISTRATION 校级赛报名审核表

## 基本信息

- **表名**：`COMPETITION_REGISTRATION`（原表名：`t_approve_data_6586_115048_1729113971132_end`）
- **中文名称**：校级赛报名审核
- **用途**：记录学生参加校级竞赛的报名信息和审核状态，包括学生基本信息、竞赛项目、联系方式等
- **字段数量**：26个
- **数据类别**：竞赛系统 - 竞赛报名模块

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
| academic_year | 50 | varchar | 65533 | YES | NO | - | 学年 |
| competition_name | 48 | varchar | 65533 | YES | NO | - | 赛项名称 |
| student_name | 2 | varchar | 1048576 | YES | NO | - | 姓名 |
| student_number | 46 | varchar | 1048576 | YES | NO | - | 学号 |
| college | 9 | varchar | 1048576 | YES | NO | - | 所属学院 |
| major | 44 | varchar | 1048576 | YES | NO | - | 所属专业 |
| class_name | 43 | varchar | 1048576 | YES | NO | - | 所属班级 |
| phone | 47 | varchar | 1048576 | YES | NO | - | 联系电话 |
| competition_type | 29 | varchar | 65533 | YES | NO | - | 个人赛/团体赛 |

## 字段详细说明

### 主键字段
- **id**：表单数据ID，报名记录的唯一标识符

### 系统字段
- **form_id**：表单ID，系统内部表单标识
- **form_name**：表单名称，表单的显示名称
- **submitter_name**：提交人姓名，提交报名的用户姓名
- **submitter_id**：表单创建者用户ID，提交报名的用户ID
- **insert_time**：提交时间戳，报名记录创建时间
- **update_time**：修改时间戳，报名记录最后修改时间
- **sync_time**：数据同步时间戳，数据同步到数据仓库的时间
- **title**：标题，报名记录的标题
- **complete_time**：审批完成时间，报名审批完成的时间

### 审批流程字段
- **approval_status**：审批状态，当前报名审批状态
- **approval_status_id**：审批状态ID，审批状态的标识ID
- **approvers**：审批人，审批流程中的审批人员列表
- **cc_users**：抄送人，需要抄送的人员列表

### 组织字段
- **department_id**：单位ID，学生所属院系的ID
- **page_url**：页面地址，报名页面的访问地址

### 竞赛信息字段
- **academic_year**：学年，报名竞赛所属的学年
- **competition_name**：赛项名称，报名参加的竞赛项目名称
- **competition_type**：个人赛/团体赛，竞赛的参与形式

### 学生基本信息字段
- **student_name**：姓名，报名学生的真实姓名
- **student_number**：学号，报名学生的学号
- **college**：所属学院，学生所在的学院
- **major**：所属专业，学生所学的专业
- **class_name**：所属班级，学生所在的班级

### 联系方式字段
- **phone**：联系电话，学生的联系电话

## 竞赛类型说明

### 参赛形式分类
- **个人赛**：以个人为单位参加竞赛
- **团体赛**：以团队为单位参加竞赛
- **混合赛**：个人和团体混合参赛

### 参赛形式特点
1. **个人赛特点**：
   - 独立完成比赛任务
   - 个人成绩单独评定
   - 体现个人专业能力

2. **团体赛特点**：
   - 团队协作完成比赛
   - 团队成绩共同评定
   - 体现团队协作能力

## 审批状态说明

### 常见审批状态
- **待审核**：报名提交后等待审核
- **审核中**：报名信息正在审核
- **审核通过**：报名审核通过，可参加竞赛
- **审核驳回**：报名审核未通过
- **已取消**：报名被取消
- **已结束**：竞赛已结束

### 审批流程
1. **学生报名**：学生在线提交报名申请
2. **班级审核**：班主任或辅导员进行初步审核
3. **学院审核**：学院进行资格审核
4. **教务审核**：教务部门进行最终审核
5. **结果通知**：通知学生审核结果

## 学生信息关联说明

### 与学生信息系统的关联
- **学号唯一性**：通过学号与学生信息表关联
- **班级管理**：通过班级名称关联班级信息
- **专业管理**：通过专业名称关联专业信息
- **学院管理**：通过学院名称关联学院信息

### 信息一致性要求
1. **基本信息一致**：姓名、学号等基本信息与学生信息一致
2. **在校状态**：学生应处于正常在校状态
3. **资格符合**：学生应符合竞赛报名的资格要求
4. **信息准确**：联系信息应准确有效

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`submitter_id` 应引用用户表的有效记录
3. **外键约束**：`department_id` 应引用部门表的有效记录
4. **唯一约束**：同一学生、同一竞赛、同一学年只能有一条报名记录
5. **检查约束**：`approval_status` 应符合预设的审批状态值

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **学号索引**：`student_number` - 用于查询学生报名记录
- **竞赛名称索引**：`competition_name` - 用于按竞赛查询
- **学年索引**：`academic_year` - 用于按学年查询
- **状态索引**：`approval_status` - 用于按审批状态筛选
- **学院索引**：`college` - 用于按学院统计
- **时间索引**：`insert_time` - 用于按时间排序查询

## 数据关联关系

### 主要外键关联
- **学生信息表**：通过 `student_number` 关联学生基本信息
- **学院信息表**：通过 `college` 关联学院详细信息
- **专业信息表**：通过 `major` 关联专业详细信息
- **班级信息表**：通过 `class_name` 关联班级详细信息

### 业务关联
- **竞赛申报表**：关联竞赛申报参赛信息
- **成绩管理表**：关联竞赛成绩信息
- **材料管理表**：关联竞赛材料信息
- **证书管理表**：关联竞赛证书信息

## 使用示例

### SQL查询示例

```sql
-- 查询某学年的报名情况
SELECT id, student_name, student_number, college, major,
       competition_name, competition_type, approval_status
FROM COMPETITION_REGISTRATION
WHERE academic_year = '2024'
ORDER BY insert_time DESC;

-- 查询某竞赛的报名学生
SELECT student_name, student_number, college, class_name,
       phone, competition_type, approval_status
FROM COMPETITION_REGISTRATION
WHERE competition_name = '校级数学建模竞赛'
  AND approval_status = '审核通过'
ORDER BY student_number;

-- 查询某学院的报名统计
SELECT
    college,
    COUNT(*) as total_registrations,
    COUNT(CASE WHEN approval_status = '审核通过' THEN 1 END) as approved_count,
    COUNT(DISTINCT competition_name) as competition_count,
    COUNT(DISTINCT student_number) as student_count
FROM COMPETITION_REGISTRATION
WHERE academic_year = '2024'
GROUP BY college
ORDER BY total_registrations DESC;

-- 查询个人赛和团体赛分布
SELECT
    competition_type,
    COUNT(*) as registration_count,
    COUNT(CASE WHEN approval_status = '审核通过' THEN 1 END) as approved_count
FROM COMPETITION_REGISTRATION
WHERE academic_year = '2024'
GROUP BY competition_type;

-- 查询待审核的报名申请
SELECT id, student_name, student_number, competition_name,
       college, class_name, insert_time, submitter_name
FROM COMPETITION_REGISTRATION
WHERE approval_status = '待审核'
ORDER BY insert_time ASC;

-- 查询学生的报名历史
SELECT student_name, student_number, competition_name,
       academic_year, competition_type, approval_status
FROM COMPETITION_REGISTRATION
WHERE student_number = '2024001'
ORDER BY academic_year DESC, insert_time DESC;
```

### 数据插入示例

```sql
INSERT INTO COMPETITION_REGISTRATION (
    form_id, form_name, submitter_name, submitter_id,
    academic_year, competition_name, student_name, student_number,
    college, major, class_name, phone, competition_type
) VALUES (
    3001, '校级竞赛报名表', '张同学', 4001,
    '2024', '校级计算机编程大赛', '李明', '202401001',
    '计算机学院', '计算机科学与技术', '计科2024级1班',
    '13800138000', '个人赛'
);
```

## 业务逻辑说明

### 报名流程
1. **信息填写**：学生填写基本信息和竞赛选择
2. **信息提交**：提交报名申请进入审核流程
3. **资格审核**：系统自动检查基本资格条件
4. **人工审核**：班主任、学院、教务逐级审核
5. **结果通知**：通知学生审核结果

### 报名资格管理
1. **在校状态**：检查学生是否正常在校
2. **年级限制**：部分竞赛有年级要求
3. **专业限制**：部分竞赛有专业要求
4. **成绩要求**：部分竞赛有成绩要求

### 审核管理
1. **多级审核**：建立班级、学院、教务三级审核机制
2. **资格验证**：验证学生报名资格
3. **信息确认**：确认报名信息的准确性
4. **结果反馈**：及时反馈审核结果

## 数据维护建议

### 定期维护
1. **信息更新**：及时更新报名信息
2. **状态维护**：维护审批状态的准确性
3. **学生信息同步**：同步学生基本信息变更
4. **竞赛信息更新**：维护竞赛基础信息

### 异常处理
1. **重复报名**：检查并处理重复报名记录
2. **信息错误**：纠正报名信息中的错误
3. **资格异常**：处理报名资格异常情况
4. **状态异常**：处理审批状态异常问题

### 质量控制
1. **完整性检查**：确保报名信息完整
2. **准确性检查**：确保报名信息准确
3. **一致性检查**：确保与学生信息一致
4. **及时性检查**：确保报名信息及时更新

---

**数据来源**：竞赛管理系统
**维护单位**：教务处、各院系、学生处
**更新频率**：报名信息变更时实时更新，定期统计分析