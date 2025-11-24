# t_zjy_course_info_student 开课学生表

## 基本信息

- **表名**：`t_zjy_course_info_student`
- **中文名称**：开课学生表
- **用途**：课程开课学生信息和成绩管理，记录学生学习进度和成绩
- **字段数量**：33个
- **数据类别**：教学过程数据推送表 - 课程与班级管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键 |
| course_id | varchar | 50 | NO | - | 课程id |
| course_name | varchar | 100 | YES | - | 课程名称 |
| course_info_name | varchar | 100 | YES | - | 开课名称 |
| course_info_id | varchar | 50 | YES | - | 开课id |
| class_id | varchar | 50 | YES | - | 班级id |
| class_name | varchar | 200 | YES | - | 班级名称 |
| group_id | varchar | 50 | YES | - | 分组id |
| student_id | varchar | 50 | NO | - | 学生id |
| student_use_name | varchar | 100 | YES | - | 学生用户名 |
| student_no | varchar | 100 | YES | - | 学号 |
| student_name | varchar | 100 | YES | - | 学生姓名 |
| student_avatar | varchar | 255 | YES | - | 学生头像 |
| phone_number | varchar | 20 | YES | - | 手机号 |
| study_time | int | - | YES | - | 学习时长 |
| study_speed | int | - | YES | - | 学习进度百分比 |
| final_score | decimal | - | YES | - | 最终得分 |
| final_actual_score | decimal | - | YES | - | 最终实际得分 |
| activity_score | decimal | - | YES | - | 课堂活动得分 |
| activity_actual_score | decimal | - | YES | - | 课堂活动实际得分 |
| courseware_score | decimal | - | YES | - | 课件得分 |
| courseware_actual_score | decimal | - | YES | - | 课件实际得分 |
| task_score | decimal | - | YES | - | 作业得分 |
| task_actual_score | decimal | - | YES | - | 作业实际得分 |
| exam_score | decimal | - | YES | - | 考试得分 |
| exam_actual_score | decimal | - | YES | - | 考试实际得分 |
| is_adopt | char | 1 | YES | - | 是否通过，0否，1是 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | NO | - | 修改时间 |
| test_score | decimal | - | YES | - | 测验得分 |
| test_actual_score | decimal | - | YES | - | 测验实际得分 |
| faculty_id | varchar | 50 | YES | - | 所属院系id |
| faculty_name | varchar | 255 | YES | - | 院系名称 |
| major_id | varchar | 50 | YES | - | 所属专业id |
| major_name | varchar | 255 | YES | - | 专业名称 |
| student_sex | varchar | 10 | YES | - | 性别 |
| student_grade | varchar | 255 | YES | - | 年级 |
| is_entry | char | 1 | YES | - | 是否参赛学生 0未参赛、1参赛 |
| join_way | char | 1 | YES | - | 加入班级方式 |
| del_flag | char | 2 | YES | - | 删除标识0未删除2已删除 |

## 字段详细说明

### 主键和关联字段
- **id**：记录唯一标识符，主键
- **course_id**：课程ID，关联课程管理表
- **course_info_id**：开课ID，关联开课信息表
- **class_id**：班级ID，关联班级信息
- **student_id**：学生ID，关联学生用户信息

### 课程和班级信息
- **course_name**：课程名称
- **course_info_name**：开课名称
- **class_name**：班级名称
- **group_id**：分组ID（小组学习时使用）

### 学生基本信息
- **student_use_name**：学生用户名
- **student_no**：学生学号
- **student_name**：学生姓名
- **student_avatar**：学生头像URL
- **phone_number**：学生手机号
- **student_sex**：学生性别
- **student_grade**：学生年级
- **faculty_id**：所属院系ID
- **faculty_name**：院系名称
- **major_id**：所属专业ID
- **major_name**：专业名称

### 学习进度和统计
- **study_time**：学习时长（单位：分钟）
- **study_speed**：学习进度百分比（整数）

### 成绩管理
#### 综合成绩
- **final_score**：最终得分（计划分数）
- **final_actual_score**：最终实际得分（实际获得分数）

#### 分项成绩
- **activity_score**：课堂活动得分（计划）
- **activity_actual_score**：课堂活动实际得分
- **courseware_score**：课件学习得分（计划）
- **courseware_actual_score**：课件学习实际得分
- **task_score**：作业得分（计划）
- **task_actual_score**：作业实际得分
- **exam_score**：考试得分（计划）
- **exam_actual_score**：考试实际得分
- **test_score**：测验得分（计划）
- **test_actual_score**：测验实际得分

### 状态和方式
- **is_adopt**：是否通过（0否，1是）
- **is_entry**：是否参赛学生（0未参赛，1参赛）
- **join_way**：加入班级方式
- **del_flag**：删除标识（0未删除，2已删除）

### 时间字段
- **create_time**：创建时间
- **update_time**：修改时间（必填）

## 成绩计算说明

### 最终成绩组成
通常最终成绩由多个部分组成：
- **课堂活动**：签到、讨论、互动等参与度
- **课件学习**：课程资源的学习完成情况
- **作业完成**：平时作业的质量和完成度
- **考试成绩**：期中、期末等考试成绩
- **测验成绩**：平时测验和小测试

### 计划得分vs实际得分
- **计划得分**：该部分在总成绩中的计划分值
- **实际得分**：学生实际获得的分数

## 加入班级方式说明

| join_way值 | 加入方式 | 说明 |
|------------|----------|------|
| 0 | 邀请码 | 通过邀请码加入 |
| 1 | 学校库 | 从学校库导入 |
| 2 | Excel | 通过Excel批量导入 |
| 3 | 教学班 | 从教学班导入 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`course_info_id + student_id` 组合应唯一
3. **外键约束**：所有关联ID应引用相应表的有效记录
4. **检查约束**：`is_adopt` 只能是 0 或 1
5. **检查约束**：`del_flag` 只能是 '0' 或 '2'

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **复合索引**：`course_info_id, student_id` - 确保选课记录唯一性
- **关联索引**：`student_id` - 外键索引
- **关联索引**：`course_info_id` - 外键索引
- **成绩索引**：`final_actual_score, is_adopt` - 用于成绩统计
- **进度索引**：`study_speed` - 用于学习进度分析

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_course_info_student (
    id, course_id, course_info_id, class_id, student_id, student_no,
    student_name, study_time, study_speed, final_actual_score,
    create_time, update_time
) VALUES (
    'STU_CRS001', 'COURSE001', 'INFO001', 'CLASS001', 'STU001',
    '202401001', '张三', 3600, 75, 85.5,
    '2024-01-01 10:00:00', '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询某开课的学生列表
SELECT * FROM t_zjy_course_info_student
WHERE course_info_id = 'INFO001' AND del_flag = '0'
ORDER BY final_actual_score DESC;

-- 查询某学生的课程学习情况
SELECT * FROM t_zjy_course_info_student
WHERE student_id = 'STU001' AND del_flag = '0'
ORDER BY create_time DESC;

-- 统计课程通过率
SELECT
    COUNT(*) as total_students,
    SUM(CASE WHEN is_adopt = '1' THEN 1 ELSE 0 END) as passed_students,
    ROUND(AVG(final_actual_score), 2) as avg_score
FROM t_zjy_course_info_student
WHERE course_info_id = 'INFO001' AND del_flag = '0';
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送