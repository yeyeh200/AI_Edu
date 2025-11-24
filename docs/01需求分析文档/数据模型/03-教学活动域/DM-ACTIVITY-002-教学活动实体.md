# 教学活动实体 (TeachingActivity)

---

**实体编号：** DM-ACTIVITY-002
**实体名称：** 教学活动实体
**所属域：** 教学活动域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

教学活动实体是AI助评应用教学活动的核心事实实体，记录教学过程中的各种教学活动和教学行为。该实体关联课程安排、教师、学生、资源等，记录教学活动的类型、内容、过程、效果等，为教学质量评价、教学过程分析、教学改进等提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_teaching_activity`
- **业务表名：** 教学活动表
- **数据类型：** 事实表

### 主要用途
- 记录教学活动信息
- 支持教学过程管理
- 提供教学质量分析
- 支持教学改进建议

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 教学活动唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| schedule_id | BIGINT | 20 | NOT NULL | 0 | 课程安排ID |
| course_id | BIGINT | 20 | NOT NULL | 0 | 课程ID |
| course_name | VARCHAR | 200 | NOT NULL | '' | 课程名称 |
| teacher_id | BIGINT | 20 | NOT NULL | 0 | 教师ID |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 教师姓名 |
| class_id | BIGINT | 20 | NOT NULL | 0 | 班级ID |
| class_name | VARCHAR | 100 | NOT NULL | '' | 班级名称 |
| classroom_id | BIGINT | 20 | NULL | NULL | 教室ID |
| classroom_name | VARCHAR | 100 | NULL | NULL | 教室名称 |

### 活动基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| activity_type | ENUM | - | NOT NULL | 'LECTURE' | 活动类型 |
| activity_theme | VARCHAR | 200 | NULL | NULL | 活动主题 |
| activity_title | VARCHAR | 300 | NOT NULL | '' | 活动标题 |
| activity_description | TEXT | - | NULL | NULL | 活动描述 |
| activity_objectives | TEXT | - | NULL | NULL | 教学目标 |
| activity_outline | TEXT | - | NULL | NULL | 教学大纲 |
| teaching_method | ENUM | - | NOT NULL | 'LECTURE' | 教学方法 |
| interactive_mode | ENUM | - | NULL | NULL | 互动模式 |

### 时间信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| activity_date | DATE | - | NOT NULL | CURRENT_DATE | 活动日期 |
| start_time | TIME | - | NOT NULL | '08:00:00' | 开始时间 |
| end_time | TIME | - | NOT NULL | '09:00:00' | 结束时间 |
| duration_minutes | INT | 11 | NOT NULL | 60 | 持续时间（分钟） |
| actual_start_time | DATETIME | - | NULL | NULL | 实际开始时间 |
| actual_end_time | DATETIME | - | NULL | NULL | 实际结束时间 |
| actual_duration | INT | 11 | NULL | 0 | 实际持续时间 |
| week_number | INT | 11 | NOT NULL | 1 | 周次 |
| session_number | TINYINT | 1 | NOT NULL | 1 | 课时序号 |

### 学生参与信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_students | INT | 11 | NOT NULL | 0 | 应到学生数 |
| actual_students | INT | 11 | NOT NULL | 0 | 实到学生数 |
| participation_rate | DECIMAL | 5,2 | NULL | 0.00 | 参与率（百分比） |
| interactive_students | INT | 11 | NULL | 0 | 互动学生数 |
| question_count | INT | 11 | NULL | 0 | 提问次数 |
| answer_count | INT | 11 | NULL | 0 | 回答次数 |
| group_activities | INT | 11 | NULL | 0 | 小组活动数 |

### 教学资源字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teaching_materials | JSON | - | NULL | NULL | 教学材料 |
| teaching_tools | JSON | - | NULL | NULL | 教学工具 |
| multimedia_resources | JSON | - | NULL | NULL | 多媒体资源 |
| reference_materials | JSON | - | NULL | NULL | 参考资料 |
| experiment_devices | JSON | - | NULL | NULL | 实验设备 |
| software_platforms | JSON | - | NULL | NULL | 软件平台 |

### 教学内容字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teaching_content | TEXT | - | NULL | NULL | 教学内容 |
| key_points | TEXT | - | NULL | NULL | 教学重点 |
| difficult_points | TEXT | - | NULL | NULL | 教学难点 |
| practical_exercises | TEXT | - | NULL | NULL | 实践练习 |
| case_studies | TEXT | - | NULL | NULL | 案例分析 |
| homework_assigned | TEXT | - | NULL | NULL | 布置作业 |

### 教学效果字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teaching_effectiveness | DECIMAL | 5,2 | NULL | 0.00 | 教学效果评分 |
| student_satisfaction | DECIMAL | 5,2 | NULL | 0.00 | 学生满意度 |
| knowledge_mastery | DECIMAL | 5,2 | NULL | 0.00 | 知识掌握度 |
| skill_development | DECIMAL | 5,2 | NULL | 0.00 | 技能发展度 |
| participation_level | ENUM | - | NULL | NULL | 参与水平 |
| interaction_quality | ENUM | - | NULL | NULL | 互动质量 |
| completion_status | ENUM | - | NOT NULL | 'COMPLETED' | 完成状态 |

### 评价反馈字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teacher_self_evaluation | TEXT | - | NULL | NULL | 教师自评 |
| student_feedback | TEXT | - | NULL | NULL | 学生反馈 |
| peer_review | TEXT | - | NULL | NULL | 同行评议 |
| expert_comment | TEXT | - | NULL | NULL | 专家点评 |
| improvement_suggestions | TEXT | - | NULL | NULL | 改进建议 |
| best_practices | TEXT | - | NULL | NULL | 最佳实践 |
| issues_identified | TEXT | - | NULL | NULL | 发现问题 |

### 环境条件字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| weather_condition | VARCHAR | 50 | NULL | NULL | 天气情况 |
| classroom_condition | VARCHAR | 200 | NULL | NULL | 教室环境 |
| equipment_status | VARCHAR | 200 | NULL | NULL | 设备状态 |
| network_condition | VARCHAR | 100 | NULL | NULL | 网络状况 |
| technical_issues | TEXT | - | NULL | NULL | 技术问题 |
| interruptions | TEXT | - | NULL | NULL | 中断情况 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| source_system | ENUM | - | NOT NULL | 'MANUAL' | 数据来源系统 |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_schedule_session (schedule_id, session_number)
```

### 外键约束
```sql
FOREIGN KEY (schedule_id) REFERENCES fact_schedule(id) ON DELETE CASCADE
FOREIGN KEY (course_id) REFERENCES dim_course(id) ON DELETE CASCADE
FOREIGN KEY (teacher_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (class_id) REFERENCES dim_class(id) ON DELETE CASCADE
FOREIGN KEY (classroom_id) REFERENCES dim_classroom(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_course_id (course_id)
INDEX idx_teacher_id (teacher_id)
INDEX idx_class_id (class_id)
INDEX idx_classroom_id (classroom_id)
INDEX idx_activity_date (activity_date)
INDEX idx_activity_type (activity_type)
INDEX idx_teaching_method (teaching_method)
INDEX idx_completion_status (completion_status)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_teacher_date (teacher_id, activity_date)
INDEX idx_course_date (course_id, activity_date)
INDEX idx_class_date (class_id, activity_date)
```

### 检查约束
```sql
CHECK (activity_type IN ('LECTURE', 'EXPERIMENT', 'SEMINAR', 'PRACTICE', 'DISCUSSION', 'PRESENTATION', 'FIELD_TRIP', 'ONLINE', 'HYBRID'))
CHECK (teaching_method IN ('LECTURE', 'DEMONSTRATION', 'DISCUSSION', 'COLLABORATIVE', 'PROBLEM_BASED', 'PROJECT_BASED', 'FLIPPED_CLASSROOM'))
CHECK (interactive_mode IN ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'))
CHECK (duration_minutes BETWEEN 1 AND 480)
CHECK (actual_duration BETWEEN 0 AND 480)
CHECK (participation_rate BETWEEN 0 AND 100)
CHECK (teaching_effectiveness BETWEEN 0 AND 100)
CHECK (student_satisfaction BETWEEN 0 AND 100)
CHECK (knowledge_mastery BETWEEN 0 AND 100)
CHECK (skill_development BETWEEN 0 AND 100)
CHECK (participation_level IN ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'))
CHECK (interaction_quality IN ('POOR', 'FAIR', 'GOOD', 'EXCELLENT', 'OUTSTANDING'))
CHECK (completion_status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED'))
CHECK (total_students >= 0)
CHECK (actual_students >= 0)
CHECK (actual_students <= total_students)
CHECK (interactive_students >= 0)
CHECK (interactive_students <= actual_students)
CHECK (question_count >= 0)
CHECK (answer_count >= 0)
CHECK (source_system IN ('MANUAL', 'ZJY', 'SYSTEM', 'API'))
```

## 枚举值定义

### 活动类型 (activity_type)
| 值 | 说明 | 备注 |
|----|------|------|
| LECTURE | 讲授 | 课堂教学讲授 |
| EXPERIMENT | 实验 | 实验教学 |
| SEMINAR | 研讨 | 研讨教学 |
| PRACTICE | 实践 | 实践教学 |
| DISCUSSION | 讨论 | 讨论式教学 |
| PRESENTATION | 展示 | 学生展示 |
| FIELD_TRIP | 实地 | 实地教学 |
| ONLINE | 在线 | 在线教学 |
| HYBRID | 混合 | 混合式教学 |

### 教学方法 (teaching_method)
| 值 | 说明 | 备注 |
|----|------|------|
| LECTURE | 讲授法 | 传统讲授 |
| DEMONSTRATION | 演示法 | 教师演示 |
| DISCUSSION | 讨论法 | 讨论教学 |
| COLLABORATIVE | 合作法 | 合作学习 |
| PROBLEM_BASED | 问题导向 | PBL教学 |
| PROJECT_BASED | 项目导向 | 项目教学 |
| FLIPPED_CLASSROOM | 翻转课堂 | 翻转教学 |

### 互动模式 (interactive_mode)
| 值 | 说明 | 备注 |
|----|------|------|
| NONE | 无互动 | 单向讲授 |
| LOW | 低互动 | 少量互动 |
| MEDIUM | 中等互动 | 适度互动 |
| HIGH | 高互动 | 频繁互动 |
| VERY_HIGH | 极高互动 | 全程互动 |

### 参与水平 (participation_level)
| 值 | 说明 | 备注 |
|----|------|------|
| VERY_LOW | 极低 | 参与度很低 |
| LOW | 低 | 参与度偏低 |
| MEDIUM | 中等 | 参与度一般 |
| HIGH | 高 | 参与度较高 |
| VERY_HIGH | 极高 | 参与度很高 |

### 互动质量 (interaction_quality)
| 值 | 说明 | 备注 |
|----|------|------|
| POOR | 差 | 互动效果差 |
| FAIR | 一般 | 互动效果一般 |
| GOOD | 良好 | 互动效果良好 |
| EXCELLENT | 优秀 | 互动效果优秀 |
| OUTSTANDING | 卓越 | 互动效果卓越 |

### 完成状态 (completion_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PLANNED | 计划中 | 已计划未开始 |
| IN_PROGRESS | 进行中 | 正在进行 |
| COMPLETED | 已完成 | 正常完成 |
| CANCELLED | 已取消 | 活动取消 |
| POSTPONED | 已延期 | 活动延期 |

## 关联关系

### 多对一关系（作为从表）
- **TeachingActivity → Schedule**：教学活动属于课程安排
- **TeachingActivity → Course**：教学活动属于课程
- **TeachingActivity → Teacher**：教学活动关联教师
- **TeachingActivity → Class**：教学活动属于班级
- **TeachingActivity → Classroom**：教学活动使用教室

### 一对多关系（作为主表）
- **TeachingActivity → Attendance**：一个教学活动对应多次考勤记录
- **TeachingActivity → TeachingResource**：一个教学活动使用多个资源

## 使用示例

### 查询示例

#### 1. 查询教师教学活动统计
```sql
SELECT
    t.user_name as teacher_name,
    t.user_no,
    COUNT(*) as total_activities,
    SUM(CASE WHEN activity_type = 'LECTURE' THEN 1 END) as lecture_count,
    SUM(CASE WHEN activity_type = 'EXPERIMENT' THEN 1 END) as experiment_count,
    SUM(CASE WHEN activity_type = 'DISCUSSION' THEN 1 END) as discussion_count,
    AVG(actual_duration) as avg_duration,
    AVG(teaching_effectiveness) as avg_effectiveness,
    AVG(student_satisfaction) as avg_satisfaction,
    SUM(actual_students) as total_students,
    AVG(participation_rate) as avg_participation_rate
FROM fact_teaching_activity ta
JOIN dim_user t ON ta.teacher_id = t.id
WHERE ta.activity_date BETWEEN '2023-09-01' AND '2023-10-31'
  AND ta.completion_status = 'COMPLETED'
GROUP BY t.id, t.user_name, t.user_no
ORDER BY total_activities DESC;
```

#### 2. 查询课程教学活动详情
```sql
SELECT
    course_name,
    activity_type,
    teaching_method,
    activity_date,
    start_time,
    end_time,
    actual_duration,
    total_students,
    actual_students,
    participation_rate,
    teaching_effectiveness,
    student_satisfaction,
    interaction_quality,
    completion_status
FROM fact_teaching_activity
WHERE course_id = 1001
  AND activity_date >= '2023-09-01'
ORDER BY activity_date, start_time;
```

#### 3. 查询班级教学参与情况
```sql
SELECT
    c.class_name,
    ta.activity_date,
    COUNT(*) as activity_count,
    SUM(ta.total_students) as total_planned,
    SUM(ta.actual_students) as total_attended,
    AVG(ta.participation_rate) as avg_participation,
    AVG(ta.teaching_effectiveness) as avg_effectiveness,
    SUM(ta.interactive_students) as total_interactive,
    SUM(ta.question_count) as total_questions
FROM fact_teaching_activity ta
JOIN dim_class c ON ta.class_id = c.id
WHERE ta.activity_date BETWEEN '2023-09-01' AND '2023-10-31'
  AND ta.completion_status = 'COMPLETED'
GROUP BY c.class_id, c.class_name, ta.activity_date
ORDER BY ta.activity_date DESC, avg_participation DESC;
```

#### 4. 查询教学方法效果分析
```sql
SELECT
    teaching_method,
    activity_type,
    COUNT(*) as activity_count,
    AVG(teaching_effectiveness) as avg_effectiveness,
    AVG(student_satisfaction) as avg_satisfaction,
    AVG(knowledge_mastery) as avg_mastery,
    AVG(skill_development) as avg_skill,
    AVG(participation_rate) as avg_participation,
    AVG(actual_duration) as avg_duration,
    SUM(CASE WHEN completion_status = 'COMPLETED' THEN 1 END) as completed_count
FROM fact_teaching_activity
WHERE activity_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
  AND completion_status IN ('COMPLETED', 'CANCELLED')
GROUP BY teaching_method, activity_type
ORDER BY avg_effectiveness DESC;
```

#### 5. 查询教学质量异常活动
```sql
SELECT
    ta.id,
    ta.course_name,
    ta.teacher_name,
    ta.class_name,
    ta.activity_date,
    ta.activity_type,
    ta.teaching_effectiveness,
    ta.student_satisfaction,
    ta.participation_rate,
    ta.completion_status,
    ta.teacher_self_evaluation,
    ta.issues_identified
FROM fact_teaching_activity ta
WHERE (ta.teaching_effectiveness < 60
    OR ta.student_satisfaction < 60
    OR ta.participation_rate < 50)
  AND ta.activity_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND ta.completion_status = 'COMPLETED'
ORDER BY ta.teaching_effectiveness ASC, ta.student_satisfaction ASC;
```

#### 6. 查询教学资源使用统计
```sql
SELECT
    activity_type,
    teaching_method,
    COUNT(*) as activity_count,
    SUM(CASE WHEN teaching_materials IS NOT NULL THEN 1 END) as material_count,
    SUM(CASE WHEN multimedia_resources IS NOT NULL THEN 1 END) as multimedia_count,
    SUM(CASE WHEN experiment_devices IS NOT NULL THEN 1 END) as device_count,
    SUM(CASE WHEN software_platforms IS NOT NULL THEN 1 END) as platform_count
FROM fact_teaching_activity
WHERE activity_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
  AND completion_status = 'COMPLETED'
GROUP BY activity_type, teaching_method
ORDER BY activity_count DESC;
```

### 插入示例

#### 1. 创建课堂教学活动
```sql
INSERT INTO fact_teaching_activity (
    schedule_id, course_id, course_name,
    teacher_id, teacher_name, class_id, class_name,
    classroom_id, classroom_name,
    activity_type, activity_title, teaching_method,
    activity_date, start_time, end_time, duration_minutes,
    total_students, actual_students, participation_rate,
    teaching_effectiveness, student_satisfaction,
    teaching_content, key_points,
    completion_status, create_by, source_system
) VALUES (
    12345, 1001, '数据结构与算法',
    23456, '张老师', 34567, '软件工程2023-1班',
    8901, 'A栋101',
    'LECTURE', '二叉树的遍历算法', 'LECTURE',
    '2023-10-23', '08:00:00', '09:00:00', 60,
    45, 42, 93.33,
    85.5, 87.2,
    '介绍二叉树的前序、中序、后序遍历算法', '递归算法、栈实现',
    'COMPLETED', 12345, 'MANUAL'
);
```

#### 2. 创建实验教学活动
```sql
INSERT INTO fact_teaching_activity (
    schedule_id, course_id, course_name,
    teacher_id, teacher_name, class_id, class_name,
    classroom_id, classroom_name,
    activity_type, activity_title, teaching_method,
    activity_date, start_time, end_time, duration_minutes,
    total_students, actual_students, participation_rate,
    interactive_students, group_activities,
    teaching_effectiveness, student_satisfaction,
    experiment_devices, teaching_content,
    completion_status, create_by, source_system
) VALUES (
    12346, 1002, '计算机网络',
    23457, '李老师', 34567, '软件工程2023-1班',
    8902, '实验楼201',
    'EXPERIMENT', 'TCP/IP协议分析实验', 'DEMONSTRATION',
    '2023-10-23', '14:00:00', '16:00:00', 120,
    45, 44, 97.78,
    38, 8,
    88.0, 90.5,
    '["路由器", "交换机", "网线", "PC"]', '使用Wireshark分析TCP协议',
    'COMPLETED', 12345, 'MANUAL'
);
```

### 更新示例

#### 1. 更新活动完成信息
```sql
UPDATE fact_teaching_activity
SET actual_start_time = '2023-10-23 08:02:00',
    actual_end_time = '2023-10-23 08:58:00',
    actual_duration = 56,
    actual_students = 43,
    participation_rate = 95.56,
    interactive_students = 35,
    question_count = 8,
    answer_count = 12,
    teaching_effectiveness = 87.5,
    student_satisfaction = 89.2,
    completion_status = 'COMPLETED',
    teacher_self_evaluation = '学生参与度高，教学效果良好',
    update_time = NOW(),
    version = version + 1
WHERE id = 67890;
```

#### 2. 更新教学评价信息
```sql
UPDATE fact_teaching_activity
SET student_feedback = '课程内容充实，但节奏稍快',
    peer_review = '教学方法多样，互动效果好',
    expert_comment = '理论与实践结合较好',
    improvement_suggestions = '适当增加练习时间',
    knowledge_mastery = 82.5,
    skill_development = 78.8,
    update_time = NOW(),
    version = version + 1
WHERE id = 67890;
```

## 数据质量

### 质量检查规则
1. **完整性检查**：课程、教师、班级等关键字段不能为空
2. **一致性检查**：实际学生数不能超过计划学生数
3. **时间检查**：实际时间不能早于计划时间
4. **范围检查**：评分字段必须在0-100范围内

### 数据清洗规则
1. **重复数据处理**：删除重复的教学活动记录
2. **时间修正**：修正不合理的时间记录
3. **统计修正**：重新计算参与率等统计字段
4. **状态同步**：同步活动完成状态

## 性能优化

### 索引优化
- 教师ID和活动日期建立复合索引
- 课程ID和活动日期建立复合索引
- 班级ID和活动日期建立复合索引

### 分区策略
- 按活动日期进行表分区
- 提高历史数据查询性能
- 方便数据归档管理

### 查询优化
- 使用覆盖索引优化统计查询
- 避免大字段的全表扫描
- 合理使用时间范围过滤

## 安全考虑

### 数据保护
- 教学内容等敏感信息访问控制
- 学生反馈等评价信息脱敏处理
- 教师隐私数据保护

### 权限控制
- 教学活动查看需要相应权限
- 教学评价修改需要管理员权限
- 教师只能查看自己的活动

## 扩展说明

### 未来扩展方向
1. **AI分析**：基于活动数据的智能教学分析
2. **实时监控**：实时教学活动监控和反馈
3. **智能推荐**：基于历史数据的教学方法推荐
4. **质量预警**：教学质量异常预警系统

### 兼容性说明
- 支持与职教云教学系统对接
- 支持多种教学模式数据格式
- 支持教学设备集成数据

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*