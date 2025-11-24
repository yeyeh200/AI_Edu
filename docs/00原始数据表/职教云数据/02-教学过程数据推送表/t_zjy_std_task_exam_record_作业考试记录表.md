# t_zjy_std_task_exam_record 作业考试记录表

## 基本信息

- **表名**：`t_zjy_std_task_exam_record`
- **中文名称**：作业考试记录表
- **用途**：学生作业考试完成记录，包含提交信息、成绩、状态等
- **字段数量**：30个
- **数据类别**：教学过程数据推送表 - 学习活动记录类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 100 | NO | - | 主键id |
| user_id | varchar | 50 | YES | - | 用户id |
| course_id | varchar | 50 | YES | - | 课程id |
| course_info_id | varchar | 50 | YES | - | 开课id |
| class_id | varchar | 50 | YES | - | 所属班级id |
| class_group_id | varchar | 50 | YES | - | 所属班级小组id |
| student_no | varchar | 100 | YES | - | 学号 |
| student_name | varchar | 100 | YES | - | 姓名 |
| exam_id | varchar | 50 | YES | - | 试卷id |
| exam_name | varchar | 255 | YES | - | 试卷名称 |
| group_id | int | - | YES | - | 具体哪套试卷的索引 |
| category_id | int | - | YES | - | 类型（1作业，2考试，3测验） |
| exam_time | int | - | YES | - | 考试用时单位秒 |
| status | int | - | YES | - | 状态 |
| score | decimal | - | YES | - | 得分 |
| is_resit_last | int | - | YES | - | 重考，补考是否是最后一次 |
| is_exam_last | int | - | YES | - | 正常考试，是否是最后一次 |
| is_last | int | - | YES | - | 是否是最后一次提交0否，1是 |
| question_order | longtext | 4294967295 | YES | - | 题目顺序 |
| create_time | datetime | - | YES | - | 提交时间 |
| update_time | datetime | - | NO | - | 修改时间 |
| update_by | varchar | 50 | YES | - | 修改人，审批人 |
| review_time | datetime | - | YES | - | 批阅时间 |
| is_top | int | - | YES | - | 是否置顶（0：未置顶，1：已置顶） |
| device | char | 1 | YES | - | 设备1pc,2,安卓，3ios |
| user_agent | varchar | 500 | YES | - | user_agent |
| ip_address | varchar | 50 | YES | - | IP地址 |
| package_file_url | varchar | 255 | YES | - | 附件url |
| resit_id | varchar | 50 | YES | - | 重做id |
| file_info | longtext | 4294967295 | YES | - | 提交文件 |
| invalid_reason | varchar | 500 | YES | - | 无效理由 |
| teacher_file | longtext | 4294967295 | YES | - | 教师批阅附件 |
| del_flag | char | 2 | YES | - | 删除标识0未删除2已删除 |

## 字段详细说明

### 主键和关联字段
- **id**：记录唯一标识符，主键
- **user_id**：学生用户ID
- **course_id**：课程ID，关联课程信息
- **course_info_id**：开课ID，关联开课信息
- **class_id**：班级ID，关联班级信息
- **exam_id**：试卷ID，关联考试设置表

### 学生信息字段
- **student_no**：学生学号
- **student_name**：学生姓名
- **class_group_id**：所属班级小组ID

### 考试基本信息
- **exam_name**：试卷名称
- **category_id**：考试类型（1作业，2考试，3测验）
- **group_id**：具体哪套试卷的索引（随机出题时使用）
- **exam_time**：考试用时（单位：秒）

### 考试状态和提交
- **status**：考试状态
  - 0：未提交
  - 1：待批阅
  - 2：已批阅
  - 3：历史记录
  - 4：无效
  - -1：退回重做
- **is_last**：是否是最后一次提交（0否，1是）
- **is_resit_last**：重考/补考是否是最后一次
- **is_exam_last**：正常考试是否是最后一次
- **create_time**：提交时间
- **resit_id**：重做ID（补考时关联原考试）

### 成绩信息
- **score**：得分
- **is_top**：是否置顶（0未置顶，1已置顶）

### 技术信息
- **device**：提交设备类型
  - 1：PC
  - 2：安卓
  - 3：iOS
- **user_agent**：浏览器用户代理信息
- **ip_address**：提交时的IP地址

### 文件和内容
- **package_file_url**：附件URL
- **file_info**：提交文件信息
- **question_order**：题目顺序
- **teacher_file**：教师批阅附件

### 批阅和审核
- **update_by**：修改人（批阅人）
- **review_time**：批阅时间
- **invalid_reason**：无效理由（当status=4时）

### 系统管理
- **del_flag**：删除标识（0未删除，2已删除）
- **update_time**：修改时间（必填）

## 考试状态说明

| status值 | 状态说明 | 学生操作 | 教师操作 |
|----------|----------|----------|----------|
| 0 | 未提交 | 可以继续答题 | 可以查看进度 |
| 1 | 待批阅 | 已提交，等待批阅 | 需要进行批阅 |
| 2 | 已批阅 | 可以查看成绩和反馈 | 批阅完成 |
| 3 | 历史记录 | 只读访问 | 查看历史记录 |
| 4 | 无效 | 需要重新提交 | 标记为无效 |
| -1 | 退回重做 | 需要重新完成 | 退回给学生 |

## 设备类型说明

| device值 | 设备类型 | 说明 |
|----------|----------|------|
| 1 | PC | 电脑端提交 |
| 2 | 安卓 | 安卓设备提交 |
| 3 | iOS | 苹果设备提交 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`user_id`、`course_id`、`exam_id` 应引用相应表的有效记录
3. **检查约束**：`category_id` 只能是 1-3
4. **检查约束**：`status` 应符合预设状态值
5. **检查约束**：`device` 只能是 1-3

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **复合索引**：`exam_id + user_id` - 确保考试记录唯一性
- **关联索引**：`user_id` - 外键索引，用于查询学生考试记录
- **关联索引**：`course_id` - 外键索引
- **关联索引**：`exam_id` - 外键索引
- **状态索引**：`status` - 用于按状态筛选
- **时间索引**：`create_time, review_time` - 时间索引

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_std_task_exam_record (
    id, user_id, course_id, exam_id, student_no, student_name,
    category_id, exam_time, status, score, create_time, update_time
) VALUES (
    'RECORD001', 'STU001', 'COURSE001', 'EXAM001', '202401001', '张三',
    2, 5400, 1, 85.5, '2024-03-15 11:00:00', '2024-03-15 11:00:00'
);
```

### 查询示例
```sql
-- 查询某学生的考试记录
SELECT * FROM t_zjy_std_task_exam_record
WHERE user_id = 'STU001' AND del_flag = '0'
ORDER BY create_time DESC;

-- 查询某考试的提交记录
SELECT * FROM t_zjy_std_task_exam_record
WHERE exam_id = 'EXAM001' AND del_flag = '0'
ORDER BY score DESC;

-- 查询待批阅的考试
SELECT * FROM t_zjy_std_task_exam_record
WHERE status = 1 AND del_flag = '0';
```

### 统计查询示例
```sql
-- 统计考试成绩分布
SELECT
    CASE
        WHEN score >= 90 THEN '优秀'
        WHEN score >= 80 THEN '良好'
        WHEN score >= 70 THEN '中等'
        WHEN score >= 60 THEN '及格'
        ELSE '不及格'
    END as grade_level,
    COUNT(*) as student_count,
    AVG(score) as avg_score
FROM t_zjy_std_task_exam_record
WHERE exam_id = 'EXAM001' AND status = 2 AND del_flag = '0'
GROUP BY
    CASE
        WHEN score >= 90 THEN '优秀'
        WHEN score >= 80 THEN '良好'
        WHEN score >= 70 THEN '中等'
        WHEN score >= 60 THEN '及格'
        ELSE '不及格'
    END;
```

## 业务逻辑说明

### 考试提交流程
1. **学生开始考试**：创建考试记录（status=0）
2. **完成考试**：提交答案（status=1）
3. **教师批阅**：批改试卷（status=2）
4. **成绩公布**：学生查看成绩

### 重考和补考
- **is_resit_last**：标识是否为最后一次补考机会
- **is_exam_last**：标识是否为最后一次正常考试
- **resit_id**：关联原考试记录

### 成绩管理
- **score**：最终得分
- **is_top**：置顶显示优秀或特殊作业
- **invalid_reason**：标记无效作业的原因

### 数据完整性
1. **关联完整性**：确保所有关联ID的有效性
2. **状态一致性**：考试状态应与实际进度一致
3. **时间准确性**：各时间字段应准确记录

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送