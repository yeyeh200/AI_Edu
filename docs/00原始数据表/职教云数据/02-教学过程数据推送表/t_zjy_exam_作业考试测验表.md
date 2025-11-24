# t_zjy_exam 作业考试测验表

## 基本信息

- **表名**：`t_zjy_exam`
- **中文名称**：作业考试测验表
- **用途**：作业考试测验的设置和配置，包括题目类型、考试时间、评分规则等
- **字段数量**：25个
- **数据类别**：教学过程数据推送表 - 其他教学过程表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键 |
| course_id | varchar | 50 | NO | - | 课程id |
| course_info_id | varchar | 50 | NO | - | 开课id |
| name | varchar | 255 | NO | - | 名称 |
| category_id | char | 1 | NO | - | 类型（1作业，2考试，3测验） |
| type_id | char | 1 | YES | - | 类型（1题库，2登分，3附件） |
| file_exam_type_id | char | 2 | YES | - | 附件作业具体类型（1个人作业、2小组作业） |
| duration | char | 5 | YES | - | 考试时长（0-300分钟） |
| frequency | char | 10 | YES | - | 作答次数 |
| content | mediumtext | 16777215 | YES | - | 要求 |
| title_disorder | char | 1 | YES | - | 题目乱序（1是，0否） |
| option_disorder | char | 1 | YES | - | 选项乱序（1是，0否） |
| multi_choice_scoring_method | char | 1 | YES | - | 多选题计分方式 |
| question_setting_method | char | 1 | YES | - | 出题方式（1手动出题，2随机出题） |
| difficultly_levels | varchar | 10 | YES | - | 难易程度 |
| knowledge_points_ids | longtext | 4294967295 | YES | - | 知识点ids |
| paper_count | char | 3 | YES | - | 随机出题（套） |
| start_time | datetime | - | YES | - | 开始时间 |
| end_time | datetime | - | YES | - | 结束时间 |
| answer_release_time | datetime | - | YES | - | 答案公布时间 |
| is_resit | char | 1 | YES | - | 是否补考（0否，1是） |
| del_flag | char | 1 | YES | - | 删除标志（0代表存在 2代表删除） |
| create_by | varchar | 64 | YES | - | 创建者 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_by | varchar | 64 | YES | - | 更新者 |
| update_time | datetime | - | NO | - | 修改时间 |
| remark | mediumtext | 16777215 | YES | - | 备注 |
| package_file_url | varchar | 255 | YES | - | 附件压缩包url |
| operation_materials | longtext | 4294967295 | YES | - | 作业材料 |
| reference_answer | longtext | 4294967295 | YES | - | 参考答案 |
| exam_rule_id | varchar | 50 | YES | - | 出卷规则 |
| total_score | int | - | YES | - | 总分 |

## 字段详细说明

### 主键和关联字段
- **id**：考试记录唯一标识符，主键
- **course_id**：课程ID，关联课程信息
- **course_info_id**：开课ID，关联开课信息

### 基本考试信息
- **name**：考试/作业/测验名称
- **category_id**：类型
  - 1：作业
  - 2：考试
  - 3：测验
- **total_score**：总分

### 考试类型设置
- **type_id**：出题类型
  - 1：题库出题
  - 2：登分（手动录入成绩）
  - 3：附件作业
- **file_exam_type_id**：附件作业类型
  - 1：个人作业
  - 2：小组作业

### 时间设置
- **duration**：考试时长（0-300分钟）
- **start_time**：开始时间
- **end_time**：结束时间
- **answer_release_time**：答案公布时间
- **frequency**：作答次数限制

### 题目设置
- **question_setting_method**：出题方式
  - 1：手动出题
  - 2：随机出题
- **title_disorder**：题目乱序（1是，0否）
- **option_disorder**：选项乱序（1是，0否）
- **paper_count**：随机出题套数
- **exam_rule_id**：出卷规则ID

### 题目属性
- **difficultly_levels**：难易程度
  - 1：非常简单
  - 2：简单
  - 3：一般
  - 4：困难
  - 5：非常困难
- **knowledge_points_ids**：关联的知识点ID列表
- **multi_choice_scoring_method**：多选题计分方式
  - 1：多选、少选、错选不得分
  - 2：少选时，按照选项个数计分
  - 3：少选时，得一半分数

### 内容和资源
- **content**：考试要求说明
- **operation_materials**：作业材料
- **reference_answer**：参考答案
- **package_file_url**：附件压缩包URL

### 状态和管理
- **is_resit**：是否补考（0否，1是）
- **del_flag**：删除标志（0代表存在，2代表删除）
- **create_by**：创建者
- **update_by**：更新者
- **create_time**：创建时间
- **update_time**：修改时间（必填）
- **remark**：备注信息

## 考试类型说明

### 按category_id分类
- **作业（1）**：平时作业，通常有较长完成时间
- **考试（2）**：正式考试，有时间限制和严格监考
- **测验（3）**：小测验，用于检查学习效果

### 按type_id分类
- **题库（1）**：从题库中随机或手动选择题目
- **登分（2）**：手动录入成绩，如实践课、作品评分
- **附件（3）**：提交文件形式的作业

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`course_id`、`course_info_id` 应引用相应表的有效记录
3. **检查约束**：`category_id` 只能是 1-3
4. **检查约束**：`type_id` 只能是 1-3
5. **检查约束**：`del_flag` 只能是 '0' 或 '2'

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **关联索引**：`course_id` - 外键索引
- **关联索引**：`course_info_id` - 外键索引
- **类型索引**：`category_id, type_id` - 复合索引
- **时间索引**：`start_time, end_time` - 时间索引
- **状态索引**：`del_flag` - 过滤有效记录

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_exam (
    id, course_id, course_info_id, name, category_id, type_id,
    duration, start_time, end_time, total_score, create_time, update_time
) VALUES (
    'EXAM001', 'COURSE001', 'INFO001', '期中考试', '2', '1',
    '120', '2024-03-15 09:00:00', '2024-03-15 11:00:00', 100,
    '2024-03-01 10:00:00', '2024-03-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询某课程的所有考试
SELECT * FROM t_zjy_exam
WHERE course_id = 'COURSE001' AND del_flag = '0'
ORDER BY create_time DESC;

-- 查询即将开始的考试
SELECT * FROM t_zjy_exam
WHERE start_time > NOW() AND del_flag = '0'
ORDER BY start_time;
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送