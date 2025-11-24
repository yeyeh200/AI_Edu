# t_zjy_question 课程题库表

## 基本信息

- **表名**：`t_zjy_question`
- **中文名称**：课程题库表
- **用途**：课程题库和试题管理，存储各种类型的题目和答案
- **字段数量**：20个
- **数据类别**：教学过程数据推送表 - 学习资源类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键 |
| course_id | varchar | 50 | NO | - | 课程id |
| course_info_id | varchar | 50 | NO | - | 开课id |
| knowledge_points_id | varchar | 50 | YES | - | 知识点id |
| type_id | char | 2 | NO | - | 题型（字典） |
| difficulty_id | char | 10 | NO | - | 难度（字典） |
| title | mediumtext | 16777215 | YES | - | 题干内容 |
| title_text | mediumtext | 16777215 | YES | - | 题干内容纯文本 |
| file_url | text | 65535 | YES | - | 上传附件 |
| source | char | 10 | YES | - | 题目来源类型 |
| in_answer_order | char | 1 | YES | - | 是否严格按照标准答案顺序1是0否 |
| data_json | mediumtext | 16777215 | YES | - | 选项json |
| answer | mediumtext | 16777215 | YES | - | 参考答案 |
| analysis | mediumtext | 16777215 | YES | - | 答案解析 |
| user_id | varchar | 50 | NO | - | 用户id |
| user_name | varchar | 50 | YES | - | 用户姓名 |
| del_flag | char | 1 | YES | - | 删除标志（0代表存在 2代表删除） |
| create_by | varchar | 64 | YES | - | 创建者 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_by | varchar | 64 | YES | - | 更新者 |
| update_time | datetime | - | NO | - | 修改时间 |
| remark | varchar | 255 | YES | - | 备注 |
| is_disable | char | 1 | YES | - | 禁用标识 0-可用 1-禁用 |
| sort_order | bigint | - | YES | - | 排序 |

## 字段详细说明

### 主键和关联字段
- **id**：题目唯一标识符，主键
- **course_id**：课程ID，关联课程管理表
- **course_info_id**：开课ID，关联开课信息表
- **knowledge_points_id**：知识点ID，关联知识点信息
- **user_id**：题目创建者用户ID
- **user_name**：题目创建者姓名

### 题目基本信息
- **type_id**：题型（字典值）
  - 1：单选题
  - 2：多选题
  - 3：判断题
  - 4：填空题
  - 5：简答题
  - 6：论述题
  - 7：计算题
  - 8：编程题
- **difficulty_id**：难度等级（字典值）
  - 1：非常简单
  - 2：简单
  - 3：一般
  - 4：困难
  - 5：非常困难

### 题目内容
- **title**：题干内容（支持富文本格式）
- **title_text**：题干内容纯文本（用于搜索和分析）
- **file_url**：题目附件（图片、音频、视频等）
- **data_json**：选项JSON数据（选择题的选项列表）

### 答案和解析
- **answer**：参考答案
- **analysis**：答案解析
- **in_answer_order**：是否严格按照标准答案顺序（1是，0否）

### 题目属性
- **source**：题目来源类型
  - 1：ykt2.0平台创建
  - 2：ykt2.0平台excel导入
  - 3：资源库导入
  - 4：ykt1.0同步
  - 5：学校库导入
  - 6：mooc
  - 7：复制课程
  - 8：平台word导入
  - 9：专业群导入
  - 10：导入职教云课程
  - 11：无答案试题导入

### 系统管理
- **del_flag**：删除标志（0代表存在，2代表删除）
- **is_disable**：禁用标识（0可用，1禁用）
- **sort_order**：排序顺序
- **create_by**：创建者
- **update_by**：更新者
- **create_time**：创建时间
- **update_time**：修改时间（必填）
- **remark**：备注信息

## 题型说明

### 选择题
- **单选题（1）**：只有一个正确答案
- **多选题（2）**：有一个或多个正确答案

### 主观题
- **判断题（3）**：判断对错
- **填空题（4）**：填写空白处内容
- **简答题（5）**：简要回答问题
- **论述题（6）**：详细阐述观点

### 实践题
- **计算题（7）**：进行数学计算
- **编程题（8）：编写代码解决问题

## 难度等级说明

| difficulty_id值 | 难度等级 | 适用场景 |
|-----------------|----------|----------|
| 1 | 非常简单 | 基础知识点检测 |
| 2 | 简单 | 日常练习和作业 |
| 3 | 一般 | 期中考试、单元测试 |
| 4 | 困难 | 期末考试、综合测试 |
| 5 | 非常困难 | 竞赛、高阶测试 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`course_id`、`course_info_id`、`user_id` 应引用相应表的有效记录
3. **检查约束**：`type_id` 应符合预设题型
4. **检查约束**：`difficulty_id` 只能是 1-5
5. **检查约束**：`del_flag` 只能是 '0' 或 '2'
6. **检查约束**：`is_disable` 只能是 '0' 或 '1'

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **关联索引**：`course_id` - 外键索引
- **关联索引**：`course_info_id` - 外键索引
- **类型索引**：`type_id` - 用于按题型筛选
- **难度索引**：`difficulty_id` - 用于按难度筛选
- **状态索引**：`del_flag, is_disable` - 复合索引，过滤有效题目
- **文本索引**：`title_text` - 全文索引，支持题目搜索

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_question (
    id, course_id, course_info_id, type_id, difficulty_id,
    title, title_text, data_json, answer, analysis,
    user_id, user_name, create_time, update_time
) VALUES (
    'Q001', 'COURSE001', 'INFO001', '1', '3',
    '<p>以下哪个是面向对象的编程语言？</p>',
    '以下哪个是面向对象的编程语言？',
    '[{"id":"A","text":"C语言"},{"id":"B","text":"Java"},{"id":"C","text":"汇编语言"},{"id":"D","text":"机器语言"}]',
    'B', 'Java是一种纯粹的面向对象编程语言，支持封装、继承、多态等特性。',
    'USER001', '张老师', '2024-03-01 10:00:00', '2024-03-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询某课程的所有题目
SELECT * FROM t_zjy_question
WHERE course_id = 'COURSE001' AND del_flag = '0'
ORDER BY difficulty_id, sort_order;

-- 查询特定难度的题目
SELECT * FROM t_zjy_question
WHERE difficulty_id = '3' AND type_id = '1' AND del_flag = '0'
ORDER BY create_time DESC;

-- 按题型统计题目数量
SELECT
    type_id,
    CASE type_id
        WHEN '1' THEN '单选题'
        WHEN '2' THEN '多选题'
        WHEN '3' THEN '判断题'
        WHEN '4' THEN '填空题'
        WHEN '5' THEN '简答题'
    END as type_name,
    COUNT(*) as question_count
FROM t_zjy_question
WHERE course_id = 'COURSE001' AND del_flag = '0'
GROUP BY type_id;
```

## 业务逻辑说明

### 题目管理
1. **创建题目**：支持多种题型和富文本编辑
2. **题目分类**：按课程、知识点、难度进行分类
3. **版本控制**：记录题目修改历史
4. **批量导入**：支持从Excel、Word等文件批量导入

### 质量控制
1. **难度评估**：根据题目内容自动评估难度
2. **答案验证**：验证选择类题目的答案格式
3. **内容审核**：支持题目内容的审核流程
4. **重复检测**：通过文本相似度检测重复题目

### 使用场景
1. **作业布置**：选择题目作为课后作业
2. **考试组卷**：按规则自动组卷
3. **练习测试**：学生自主练习
4. **知识点巩固**：针对特定知识点的强化练习

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送