# t_zjy_course_info 开课信息表

## 基本信息

- **表名**：`t_zjy_course_info`
- **中文名称**：开课信息表
- **用途**：课程开课的详细信息，包含课程基本信息、教师信息、时间安排等
- **字段数量**：45个
- **数据类别**：教学过程数据推送表 - 课程与班级管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键 |
| course_id | varchar | 50 | NO | - | 所属课程id |
| name | varchar | 255 | NO | - | 开课名称 |
| credit | int | - | YES | - | 学分 |
| start_time | datetime | - | YES | - | 开始时间 |
| end_time | datetime | - | YES | - | 结束时间 |
| week | int | - | YES | - | 教学周 |
| learning_model | char | 1 | YES | - | 学习模式（字典） |
| type_id | char | 1 | YES | - | 开课类型（字典） |
| nature | char | 1 | YES | - | 开课性质（字典） |
| invitation_code | varchar | 20 | YES | - | 邀请码 |
| qq_group | varchar | 20 | YES | - | qq群 |
| joining_method | char | 1 | YES | - | 加入方式（0禁止加入，1邀请码或扫码加入，2自由加入） |
| description | mediumtext | 16777215 | YES | - | 课程简介 |
| course_guidance | varchar | 500 | YES | - | 课程导学附件 |
| design_notes | text | 65535 | YES | - | 设计备忘 |
| user_id | varchar | 50 | YES | - | 用户id（主持老师） |
| user_name | varchar | 100 | YES | - | 用户姓名（主持老师） |
| user_num | varchar | 200 | YES | - | - |
| avatar | varchar | 255 | YES | - | 用户头像（主持老师） |
| state | char | 1 | YES | - | 开课状态（0待提交，1审核中，2审核通过，3审核不通过） |
| status | char | 1 | YES | - | 上架状态（0待上架，1已上架，2已下架） |
| average_star | varchar | 10 | YES | - | 平均评价小星星数 |
| del_flag | char | 1 | YES | - | 删除标志（0代表存在 2代表删除） |
| create_by | varchar | 64 | YES | - | 创建者 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_by | varchar | 64 | YES | - | 更新者 |
| update_time | datetime | - | NO | - | 更新时间 |
| remark | varchar | 500 | YES | - | 备注 |
| people_number | int | - | YES | - | 人数 |
| recommendation_status | char | 1 | YES | - | 推荐状态（0待推荐，1推荐审核中，2推荐成功，3推荐失败） |
| submit_time | datetime | - | YES | - | 提交审核时间 |
| is_recovery | int | - | YES | - | 是否归档1.是，0.否 |
| original_cell_proportion | decimal | - | YES | - | 课程原创所占比例 |
| open_course_type | int | - | YES | - | 开课类型 |
| code | varchar | 255 | YES | - | 课程编码 |
| faculty_id | varchar | 255 | YES | - | 院系id |
| faculty_name | varchar | 255 | YES | - | 院系名称 |
| college_level | varchar | 50 | YES | - | 院校级别2 |
| major_id | varchar | 255 | YES | - | 专业大类 |
| major_name | varchar | 255 | YES | - | 专业名称 |
| image_url | varchar | 255 | YES | - | 课程封面 |
| overview_video | varchar | 500 | YES | - | 概述视频 |
| is_top | char | 1 | YES | - | 是否置顶 |
| course_info_valid_number | int | - | YES | - | 有效开课数 |
| is_open | char | 1 | YES | - | 开放范围（0不公开，1公开） |
| is_release | char | 1 | YES | - | 发布状态（0未发布，1发布） |
| is_teacher | char | 1 | YES | - | 老师来源（0当前用户添加自带，1选择输入） |
| is_exist_certificate | char | 1 | YES | - | 是否对应1+X证书（0否，1是） |
| sort | char | 10 | YES | - | 排序 |
| total_hours | varchar | 255 | YES | - | 总学时 |
| professional_level | varchar | 255 | YES | - | 专业层次 |
| professional_category | varchar | 255 | YES | - | 所属专业类 |
| professional_major | varchar | 255 | YES | - | 所属专业 |
| course_nature | varchar | 255 | YES | - | 课程性质 |
| course_property | varchar | 255 | YES | - | 专业属性 |
| professional_category_id | varchar | 255 | YES | - | 所属专业类id |
| professional_major_id | varchar | 255 | YES | - | 所属专业id |
| from_type | char | 2 | YES | - | 课程来源 |
| from_course_id | varchar | 100 | YES | - | 来源课程id |
| from_course_info_id | varchar | 100 | YES | - | 来源课程开课id |

## 字段详细说明

### 主键和关联字段
- **id**：开课记录唯一标识符，主键
- **course_id**：所属课程ID，关联课程管理表
- **user_id**：主持老师用户ID
- **user_name**：主持老师姓名
- **avatar**：主持老师头像URL

### 基本开课信息
- **name**：开课名称
- **credit**：学分
- **start_time**：开课开始时间
- **end_time**：开课结束时间
- **week**：教学周数
- **total_hours**：总学时

### 开课属性
- **learning_model**：学习模式（字典值）
- **type_id**：开课类型（字典值）
- **nature**：开课性质（字典值）
- **open_course_type**：开课类型（1.学校安排，2.教师自建，3.外部引入，4.教务对接等）

### 加入和管理方式
- **invitation_code**：邀请码
- **qq_group**：QQ群号
- **joining_method**：加入方式（0禁止加入，1邀请码或扫码加入，2自由加入）

### 课程内容和资源
- **description**：课程简介
- **course_guidance**：课程导学附件
- **design_notes**：设计备忘
- **image_url**：课程封面图片URL
- **overview_video**：概述视频URL

### 状态管理
- **state**：开课状态（0待提交，1审核中，2审核通过，3审核不通过）
- **status**：上架状态（0待上架，1已上架，2已下架）
- **is_release**：发布状态（0未发布，1发布）
- **is_recovery**：是否归档
- **del_flag**：删除标志

### 评价和推荐
- **average_star**：平均评价星级
- **recommendation_status**：推荐状态
- **is_top**：是否置顶

### 专业信息
- **faculty_id**：院系ID
- **faculty_name**：院系名称
- **major_id**：专业大类ID
- **major_name**：专业名称
- **professional_level**：专业层次
- **professional_category**：所属专业类
- **professional_major**：所属专业
- **course_nature**：课程性质
- **course_property**：专业属性

### 开放和权限
- **is_open**：开放范围（0不公开，1公开）
- **is_exist_certificate**：是否对应1+X证书
- **is_teacher**：老师来源

### 来源和追溯
- **from_type**：课程来源类型
- **from_course_id**：来源课程ID
- **from_course_info_id**：来源开课ID
- **original_cell_proportion**：课程原创所占比例

### 统计信息
- **people_number**：选课人数
- **course_info_valid_number**：有效开课数

### 系统管理
- **create_by**：创建者
- **update_by**：更新者
- **create_time**：创建时间
- **update_time**：更新时间（必填）
- **submit_time**：提交审核时间
- **remark**：备注
- **sort**：排序

## 状态说明

### 开课状态（state）
- 0：待提交
- 1：审核中
- 2：审核通过
- 3：审核不通过

### 上架状态（status）
- 0：待上架
- 1：已上架
- 2：已下架

### 加入方式（joining_method）
- 0：禁止加入
- 1：邀请码或扫码加入
- 2：自由加入

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`course_id` 应引用课程管理表中的有效记录
3. **外键约束**：`user_id` 应引用用户表中的有效记录
4. **非空约束**：多个关键字段为必填字段
5. **检查约束**：各种状态字段应符合预设值范围

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **关联索引**：`course_id` - 外键索引
- **关联索引**：`user_id` - 外键索引
- **状态索引**：`state, status, del_flag` - 复合索引
- **时间索引**：`start_time, end_time, create_time` - 时间索引

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_course_info (
    id, course_id, name, credit, start_time, end_time,
    user_id, user_name, state, status, create_time, update_time
) VALUES (
    'INFO001', 'COURSE001', '计算机科学导论-2024春季', 4,
    '2024-02-01 00:00:00', '2024-07-01 00:00:00',
    'USER001', '张老师', '2', '1',
    '2024-01-01 10:00:00', '2024-01-01 10:00:00'
);
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送