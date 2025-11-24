# COMPETITION_HOSTING 竞赛承办申报表

## 基本信息

- **表名**：`COMPETITION_HOSTING`（原表名：`t_approve_data_6586_112765_1729113909045_end`）
- **中文名称**：竞赛承办申报
- **用途**：记录学校申请承办各类竞赛项目的信息，包括承办学院、校企合作、赛程安排、负责人等
- **字段数量**：40个
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
| competition_name | 2 | varchar | 1048576 | YES | NO | - | 赛项名称 |
| host_college | 43 | varchar | 1048576 | YES | NO | - | 承办学院 |
| cooperation_type | 4 | varchar | 65533 | YES | NO | - | 校企合作类型 |
| cooperative_enterprise | 5 | varchar | 1048576 | YES | NO | - | 协办企业 |
| competition_classification | 33 | varchar | 65533 | YES | NO | - | 竞赛分类 |
| target_competition | 6 | varchar | 65533 | YES | NO | - | 对接一类竞赛赛项 |
| competition_type | 29 | varchar | 65533 | YES | NO | - | 赛项类型 |
| related_major | 25 | varchar | 65533 | YES | NO | - | 所属专业 |
| responsible_person | 8 | varchar | 1048576 | YES | NO | - | 赛项负责人 |
| contact_info | 9 | varchar | 1048576 | YES | NO | - | 赛项负责人联系方式 |
| host_organization | 10 | varchar | 1048576 | YES | NO | - | 承办社团 |
| student_leader | 11 | varchar | 1048576 | YES | NO | - | 学生负责人 |
| student_contact | 12 | varchar | 1048576 | YES | NO | - | 学生负责人联系方式 |
| preliminary_time | 13 | varchar | 65533 | YES | NO | - | 初赛时间 |
| preliminary_location | 15 | varchar | 1048576 | YES | NO | - | 初赛地点 |
| final_time | 14 | varchar | 65533 | YES | NO | - | 决赛时间 |
| final_location | 16 | varchar | 1048576 | YES | NO | - | 决赛地点 |
| participant_count | 30 | varchar | 65533 | YES | NO | - | 参赛人数 |
| team_count | 18 | varchar | 1048576 | YES | NO | - | 队伍数 |
| is_specialized | 32 | varchar | 65533 | YES | NO | - | 是否为一专一赛赛项（校赛） |
| award_target | 34 | varchar | 1048576 | YES | NO | - | 省赛、国赛获奖目标 |
| application_form | 40 | varchar | 1048576 | YES | NO | - | 承办校级技能大赛申请表 |

## 字段详细说明

### 主键字段
- **id**：表单数据ID，承办申报记录的唯一标识符

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

### 承办基本信息字段
- **academic_year**：学年，承办竞赛所属的学年
- **competition_name**：赛项名称，具体要承办的竞赛项目名称
- **host_college**：承办学院，承办该竞赛的学院
- **host_organization**：承办社团，承办该竞赛的学生社团
- **related_major**：所属专业，竞赛相关的专业

### 校企合作字段
- **cooperation_type**：校企合作类型，与企业的合作方式
- **cooperative_enterprise**：协办企业，合作的企业名称

### 竞赛分类字段
- **competition_classification**：竞赛分类，竞赛的具体分类
- **target_competition**：对接一类竞赛赛项，对接的一类竞赛项目
- **competition_type**：赛项类型，竞赛的类型标识
- **is_specialized**：是否为一专一赛赛项，是否为专业特定赛项

### 负责人信息字段
- **responsible_person**：赛项负责人，主要负责的教师
- **contact_info**：赛项负责人联系方式，教师的联系信息
- **student_leader**：学生负责人，主要负责的学生
- **student_contact**：学生负责人联系方式，学生的联系信息

### 赛程安排字段
- **preliminary_time**：初赛时间，初赛举办的时间
- **preliminary_location**：初赛地点，初赛举办的地点
- **final_time**：决赛时间，决赛举办的时间
- **final_location**：决赛地点，决赛举办的地点

### 参赛规模字段
- **participant_count**：参赛人数，预计参赛的人数
- **team_count**：队伍数，预计参赛的队伍数量

### 目标和文档字段
- **award_target**：省赛、国赛获奖目标，在省级和国家级竞赛中的获奖目标
- **application_form**：承办校级技能大赛申请表，申请表的具体内容

## 校企合作类型说明

### 合作类型分类
- **产学研合作**：产业、学术、研究一体化合作
- **企业赞助**：企业提供资金或物资支持
- **技术支持**：企业提供技术指导或设备支持
- **实习实训**：企业提供实习或实训机会
- **就业合作**：企业提供就业机会或招聘支持

### 合作企业分类
- **行业龙头企业**：行业内知名大型企业
- **高新科技企业**：技术创新型企业
- **传统制造企业**：传统制造业企业
- **互联网企业**：互联网相关企业
- **国有企业**：国有控股企业

## 竞赛分类说明

### 竞赛分类（competition_classification）
- **一类竞赛**：国家级重点竞赛项目
- **二类竞赛**：省级重点竞赛项目
- **三类竞赛**：校级竞赛项目
- **其他竞赛**：其他类别竞赛

### 赛项类型（competition_type）
- **学科竞赛**：各学科领域的专业竞赛
- **技能竞赛**：职业技能类竞赛
- **创新竞赛**：创新创业类竞赛
- **综合竞赛**：综合能力类竞赛

## 赛程安排说明

### 赛程阶段
- **初赛阶段**：竞赛的初步筛选阶段
- **决赛阶段**：竞赛的最终决胜阶段
- **备选阶段**：特殊情况下的备选赛程

### 时间安排原则
1. **时间合理**：初赛和决赛时间间隔合理
2. **场地确认**：确保场地可用性
3. **资源准备**：提前准备所需资源
4. **通知发布**：及时发布赛程信息

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
- **学院索引**：`host_college` - 用于按承办学院查询
- **学年索引**：`academic_year` - 用于按学年查询
- **状态索引**：`approval_status` - 用于按审批状态筛选
- **竞赛名称索引**：`competition_name` - 用于按竞赛查询
- **时间索引**：`insert_time` - 用于按时间排序查询

## 数据关联关系

### 主要外键关联
- **用户信息表**：通过 `submitter_id` 关联提交申报的用户信息
- **学院信息表**：通过 `host_college` 关联承办学院信息
- **专业信息表**：通过 `related_major` 关联专业信息
- **企业信息表**：通过 `cooperative_enterprise` 关联企业信息

### 业务关联
- **竞赛申报表**：关联竞赛申报参赛信息
- **成绩管理表**：关联竞赛成绩信息
- **材料管理表**：关联竞赛材料信息
- **学生参赛表**：关联学生参赛信息

## 使用示例

### SQL查询示例

```sql
-- 查询某学年的承办申报情况
SELECT id, competition_name, host_college, cooperation_type,
       responsible_person, approval_status
FROM COMPETITION_HOSTING
WHERE academic_year = '2024'
ORDER BY insert_time DESC;

-- 查询某学院的承办项目
SELECT id, competition_name, competition_type, preliminary_time,
       final_time, participant_count, approval_status
FROM COMPETITION_HOSTING
WHERE host_college = '计算机学院' AND approval_status = '已通过'
ORDER BY competition_name;

-- 查询校企合作承办项目
SELECT id, competition_name, cooperative_enterprise, cooperation_type,
       host_college, responsible_person, contact_info
FROM COMPETITION_HOSTING
WHERE cooperation_type IS NOT NULL AND cooperation_type != ''
ORDER BY competition_name;

-- 查询即将举办的竞赛
SELECT id, competition_name, host_college, preliminary_time,
       final_time, final_location, responsible_person
FROM COMPETITION_HOSTING
WHERE approval_status = '已通过'
  AND (preliminary_time >= NOW() OR final_time >= NOW())
ORDER BY preliminary_time;

-- 统计各学院承办项目数量
SELECT
    host_college,
    COUNT(*) as hosting_count,
    COUNT(CASE WHEN approval_status = '已通过' THEN 1 END) as approved_count,
    COUNT(CASE WHEN cooperation_type IS NOT NULL THEN 1 END) as cooperation_count
FROM COMPETITION_HOSTING
WHERE academic_year = '2024'
GROUP BY host_college
ORDER BY hosting_count DESC;
```

### 数据插入示例

```sql
INSERT INTO COMPETITION_HOSTING (
    form_id, form_name, submitter_name, submitter_id,
    academic_year, competition_name, host_college,
    cooperation_type, cooperative_enterprise, competition_type,
    related_major, responsible_person, contact_info,
    student_leader, preliminary_time, final_time,
    participant_count, award_target
) VALUES (
    2001, '竞赛承办申报表', '王老师', 3001,
    '2024', '全国大学生程序设计竞赛', '计算机学院',
    '企业赞助', '华为技术有限公司', '学科竞赛',
    '计算机科学与技术', '李教授', '13800138001',
    '张同学', '2024年10月15日', '2024年11月20日',
    '50人', '目标获得省级一等奖'
);
```

## 业务逻辑说明

### 承办申报流程
1. **信息录入**：填写承办信息、校企合作、赛程安排等
2. **信息提交**：提交承办申报进入审批流程
3. **学院审核**：承办学院进行初步审核
4. **学校审批**：学校相关部门进行最终审批
5. **结果通知**：通知承办申报结果

### 承办管理
1. **申报审核**：对承办申报信息进行审核把关
2. **资源协调**：协调承办所需的场地、设备等资源
3. **进度跟踪**：跟踪承办准备进度
4. **质量监控**：监控承办质量和效果

### 校企合作管理
1. **合作洽谈**：与协办企业洽谈合作细节
2. **协议签订**：签订校企合作协议
3. **资源整合**：整合企业提供的教育资源
4. **效果评估**：评估校企合作效果

## 数据维护建议

### 定期维护
1. **信息更新**：及时更新承办申报信息
2. **状态维护**：维护审批状态的准确性
3. **企业信息**：维护协办企业信息
4. **联系方式**：维护负责人联系方式

### 异常处理
1. **重复申报**：检查并处理重复申报记录
2. **信息错误**：纠正申报信息中的错误
3. **状态异常**：处理审批状态异常情况
4. **时间冲突**：处理赛程时间冲突问题

### 质量控制
1. **完整性检查**：确保承办信息完整
2. **准确性检查**：确保承办信息准确
3. **一致性检查**：确保相关数据一致
4. **及时性检查**：确保承办信息及时更新

---

**数据来源**：竞赛管理系统
**维护单位**：教务处、各院系、学生处
**更新频率**：承办信息变更时实时更新，定期统计分析