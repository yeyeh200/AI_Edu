# COMPETITION_APPLICATION 竞赛申报参赛表

## 基本信息

- **表名**：`COMPETITION_APPLICATION`（原表名：`t_approve_data_6586_112770_1729113909046_end`）
- **中文名称**：竞赛申报参赛
- **用途**：记录学校申报参加各类竞赛项目的信息，包括竞赛基本信息、负责人、参赛目标等
- **字段数量**：36个
- **数据类别**：竞赛系统 - 竞赛申报模块

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
| academic_year | 1 | varchar | 65533 | YES | NO | - | 学年 |
| competition_category | 25 | varchar | 65533 | YES | NO | - | 竞赛类别 |
| competition_name | 38 | varchar | 65533 | YES | NO | - | 赛项名称 |
| competition_name_2 | 47 | varchar | 65533 | YES | NO | - | 赛项名称（重复） |
| competition_name_3 | 48 | varchar | 65533 | YES | NO | - | 赛项名称（重复） |
| sub_competition_name | 37 | varchar | 1048576 | YES | NO | - | 分赛项名称 |
| competition_classification | 6 | varchar | 65533 | YES | NO | - | 竞赛分类 |
| competition_type | 28 | varchar | 65533 | YES | NO | - | 竞赛类型 |
| competition_track | 44 | varchar | 65533 | YES | NO | - | 竞赛赛道 |
| competition_level | 39 | varchar | 65533 | YES | NO | - | 竞赛级别 |
| is_specialized | 42 | varchar | 65533 | YES | NO | - | 是否为一专一赛赛项 |
| competition_time | 13 | varchar | 65533 | YES | NO | - | 竞赛时间 |
| related_major | 36 | varchar | 65533 | YES | NO | - | 所属专业 |
| organizer | 41 | varchar | 1048576 | YES | NO | - | 主办单位 |
| department | 34 | varchar | 1048576 | YES | NO | - | 所属学院（部） |
| award_target | 19 | varchar | 1048576 | YES | NO | - | 获奖目标 |
| responsible_person | 8 | varchar | 1048576 | YES | NO | - | 赛项负责人 |
| contact_info | 9 | varchar | 1048576 | YES | NO | - | 赛项负责人联系方式 |
| participant_count | 31 | varchar | 1048576 | YES | NO | - | 参赛人数、队伍数 |

## 字段详细说明

### 主键字段
- **id**：表单数据ID，竞赛申报记录的唯一标识符

### 系统字段
- **form_id**：表单ID，系统内部表单标识
- **form_name**：表单名称，表单的显示名称
- **submitter_name**：提交人姓名，提交申报的用户姓名
- **submitter_id**：表单创建者用户ID，提交申报的用户ID
- **insert_time**：提交时间戳，申报记录创建时间
- **update_time**：修改时间戳，申报记录最后修改时间
- **sync_time**：数据同步时间戳，数据同步到数据仓库的时间
- **title**：标题，申报记录的标题
- **complete_time**：审批完成时间，审批流程完成的时间

### 审批流程字段
- **approval_status**：审批状态，当前审批状态
- **approval_status_id**：审批状态ID，审批状态的标识ID
- **approvers**：审批人，审批流程中的审批人员列表
- **cc_users**：抄送人，需要抄送的人员列表

### 组织字段
- **department_id**：单位ID，申报单位或学院的ID
- **page_url**：页面地址，申报页面的访问地址

### 竞赛基本信息字段
- **academic_year**：学年，申报竞赛所属的学年
- **competition_category**：竞赛类别，竞赛的大类别分类
- **competition_name**：赛项名称，具体的竞赛项目名称
- **competition_name_2/competition_name_3**：重复的赛项名称字段，可能用于不同显示场景
- **sub_competition_name**：分赛项名称，主竞赛下的分项赛名称
- **competition_classification**：竞赛分类，竞赛的具体分类
- **competition_type**：竞赛类型，竞赛的类型标识
- **competition_track**：竞赛赛道，竞赛的赛道分类
- **competition_level**：竞赛级别，竞赛的级别（校级、省级、国家级等）
- **is_specialized**：是否为一专一赛赛项，标识是否为专业特定赛项
- **competition_time**：竞赛时间，竞赛举办的具体时间

### 关联信息字段
- **related_major**：所属专业，竞赛相关的专业
- **organizer**：主办单位，竞赛的主办单位
- **department**：所属学院（部），申报学院或部门
- **responsible_person**：赛项负责人，负责该赛项的人员
- **contact_info**：赛项负责人联系方式，负责人的联系信息

### 参赛目标字段
- **award_target**：获奖目标，预期的获奖目标
- **participant_count**：参赛人数、队伍数，计划参赛的人数或队伍数量

## 竞赛分类说明

### 竞赛类别（competition_category）
- **学科竞赛**：各学科领域的专业竞赛
- **技能竞赛**：职业技能类竞赛
- **创新创业**：创新创业类竞赛
- **文体竞赛**：文化艺术体育类竞赛

### 竞赛分类（competition_classification）
- **A类竞赛**：国家级重点竞赛
- **B类竞赛**：省级重点竞赛
- **C类竞赛**：校级竞赛
- **D类竞赛**：其他类别竞赛

### 竞赛类型（competition_type）
- **个人赛**：以个人为单位参赛
- **团体赛**：以团队为单位参赛
- **混合赛**：个人和团体混合参赛

### 竞赛级别（competition_level）
- **国际级**：国际性竞赛
- **国家级**：全国性竞赛
- **省级**：省市级竞赛
- **校级**：校内竞赛
- **院级**：院内竞赛

## 竞赛赛道说明

### 常见赛道分类
- **主赛道**：常规竞赛赛道
- **产业赛道**：面向产业应用的竞赛
- **国际赛道**：国际竞赛项目
- **专项赛道**：特定主题或领域的竞赛

## 审批状态说明

### 常见审批状态
- **草稿**：申报信息正在编辑
- **待审批**：提交后等待审批
- **审批中**：正在审批流程中
- **已通过**：审批通过
- **已驳回**：审批被驳回
- **已取消**：申报被取消

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`submitter_id` 应引用用户表的有效记录
3. **外键约束**：`department_id` 应引用部门表的有效记录
4. **检查约束**：`approval_status` 应符合预设的审批状态值
5. **时间约束**：时间戳字段应为有效的时间值

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **用户索引**：`submitter_id` - 用于查询用户提交的申报
- **部门索引**：`department_id` - 用于按部门查询申报
- **学年索引**：`academic_year` - 用于按学年查询
- **状态索引**：`approval_status` - 用于按审批状态筛选
- **竞赛名称索引**：`competition_name` - 用于按竞赛查询
- **时间索引**：`insert_time` - 用于按时间排序查询

## 数据关联关系

### 主要外键关联
- **用户信息表**：通过 `submitter_id` 关联提交申报的用户信息
- **部门信息表**：通过 `department_id` 关联申报部门信息
- **专业信息表**：通过 `related_major` 关联专业信息

### 业务关联
- **竞赛承办表**：关联竞赛承办申报信息
- **成绩管理表**：关联竞赛成绩信息
- **学生参赛表**：关联学生参赛信息
- **材料管理表**：关联竞赛材料信息

## 使用示例

### SQL查询示例

```sql
-- 查询某学年的竞赛申报情况
SELECT id, competition_name, competition_category, competition_level,
       department, responsible_person, approval_status
FROM COMPETITION_APPLICATION
WHERE academic_year = '2024'
ORDER BY insert_time DESC;

-- 查询某学院的申报项目
SELECT id, competition_name, competition_type, competition_time,
       participant_count, award_target, approval_status
FROM COMPETITION_APPLICATION
WHERE department_id = 'DEPT001' AND approval_status = '已通过'
ORDER BY competition_name;

-- 查询国家级竞赛申报
SELECT id, competition_name, organizer, competition_time,
       responsible_person, contact_info, insert_time
FROM COMPETITION_APPLICATION
WHERE competition_level = '国家级'
ORDER BY insert_time DESC;

-- 统计各类竞赛申报数量
SELECT
    competition_category,
    COUNT(*) as application_count,
    COUNT(CASE WHEN approval_status = '已通过' THEN 1 END) as approved_count
FROM COMPETITION_APPLICATION
WHERE academic_year = '2024'
GROUP BY competition_category
ORDER BY application_count DESC;

-- 查询待审批的申报项目
SELECT id, competition_name, department, submitter_name,
       insert_time, responsible_person
FROM COMPETITION_APPLICATION
WHERE approval_status = '待审批'
ORDER BY insert_time ASC;
```

### 数据插入示例

```sql
INSERT INTO COMPETITION_APPLICATION (
    form_id, form_name, submitter_name, submitter_id,
    academic_year, competition_category, competition_name,
    competition_type, competition_level, competition_time,
    related_major, organizer, department, responsible_person,
    contact_info, participant_count, award_target
) VALUES (
    1001, '竞赛申报表', '张老师', 2001,
    '2024', '学科竞赛', '全国大学生数学建模竞赛',
    '团体赛', '国家级', '2024年9月',
    '数学与应用数学', '教育部、中国工业与应用数学学会',
    '数学学院', '李教授', '13800138000',
    '3队', '目标获得国家级一等奖'
);
```

## 业务逻辑说明

### 申报流程
1. **信息录入**：填写竞赛基本信息、负责人、参赛目标等
2. **信息提交**：提交申报信息进入审批流程
3. **部门审核**：所属部门进行初步审核
4. **学校审批**：学校相关部门进行最终审批
5. **结果通知**：通知申报结果

### 申报管理
1. **申报审核**：对申报信息进行审核把关
2. **信息管理**：维护申报信息的准确性
3. **进度跟踪**：跟踪申报进度和审批状态
4. **统计分析**：统计申报情况和分析申报效果

### 质量控制
1. **信息完整**：确保申报信息完整准确
2. **格式规范**：保证申报格式规范统一
3. **权限控制**：控制申报的权限范围
4. **流程监控**：监控申报流程的执行情况

## 数据维护建议

### 定期维护
1. **信息更新**：及时更新申报信息
2. **状态维护**：维护审批状态的准确性
3. **用户信息**：维护申报用户信息
4. **竞赛信息**：维护竞赛基础信息

### 异常处理
1. **重复申报**：检查并处理重复申报记录
2. **信息错误**：纠正申报信息中的错误
3. **状态异常**：处理审批状态异常情况
4. **权限异常**：处理申报权限异常问题

### 质量控制
1. **完整性检查**：确保申报信息完整
2. **准确性检查**：确保申报信息准确
3. **一致性检查**：确保相关数据一致
4. **及时性检查**：确保申报信息及时更新

---

**数据来源**：竞赛管理系统
**维护单位**：教务处、各院系
**更新频率**：申报信息变更时实时更新，定期统计分析