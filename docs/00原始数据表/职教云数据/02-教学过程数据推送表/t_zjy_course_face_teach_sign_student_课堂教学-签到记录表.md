# t_zjy_course_face_teach_sign_student 课堂教学-签到记录表

## 基本信息

- **表名**：`t_zjy_course_face_teach_sign_student`
- **中文名称**：课堂教学-签到记录表
- **用途**：学生课堂签到记录，记录学生的签到状态和详细信息
- **字段数量**：15个
- **数据类别**：教学过程数据推送表 - 课堂教学活动类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键 |
| course_id | varchar | 50 | NO | - | 课程id |
| course_info_id | varchar | 50 | YES | - | 开课id |
| teach_id | varchar | 50 | NO | - | 课堂教学id |
| class_id | varchar | 50 | NO | - | 班级id |
| sign_id | varchar | 50 | NO | - | 签到id |
| sign_result_type | char | 2 | YES | - | 签到结果种类 |
| student_id | varchar | 50 | NO | - | 学生id |
| student_no | varchar | 100 | YES | - | 学生学号 |
| student_name | varchar | 100 | YES | - | 学生姓名 |
| student_avatar | varchar | 255 | YES | - | 学生头像 |
| photo_url | varchar | 255 | YES | - | 照片url |
| device | char | 2 | YES | - | 设备1pc,2,安卓，3ios |
| create_time | datetime | - | YES | - | 创建时间 |
| sign_count | int | - | YES | - | 签到次数 |
| score | decimal | - | YES | - | 分数 |
| update_time | datetime | - | NO | - | 修改时间 |
| del_flag | char | 2 | YES | - | 删除标识0未删除2已删除 |

## 字段详细说明

### 主键和关联字段
- **id**：签到记录唯一标识符，主键
- **course_id**：课程ID，关联课程信息
- **course_info_id**：开课ID，关联开课信息
- **teach_id**：课堂教学ID，关联具体课堂教学活动
- **class_id**：班级ID，关联班级信息
- **sign_id**：签到设置ID，关联签到设置表
- **student_id**：学生ID，关联学生信息

### 签到结果字段
- **sign_result_type**：签到结果种类
  - 0：缺勤
  - 1：已签到
  - 2：迟到
  - 3：事假
  - 4：早退
  - 5：病假
  - 6：公假

### 学生信息字段
- **student_no**：学生学号
- **student_name**：学生姓名
- **student_avatar**：学生头像URL

### 签到详情字段
- **photo_url**：签到照片URL（拍照签到时）
- **device**：签到设备类型
  - 1：PC
  - 2：安卓
  - 3：iOS
- **sign_count**：签到次数（可能用于多次签到场景）
- **score**：签到得分（课堂活动积分）

### 系统管理字段
- **create_time**：签到记录创建时间
- **update_time**：记录修改时间（必填）
- **del_flag**：删除标识（0未删除，2已删除）

## 签到结果说明

| sign_result_type值 | 结果说明 | 考勤处理 |
|---------------------|----------|----------|
| 0 | 缺勤 | 未参加签到 |
| 1 | 已签到 | 正常出勤 |
| 2 | 迟到 | 超时签到 |
| 3 | 事假 | 请事假 |
| 4 | 早退 | 提前离开 |
| 5 | 病假 | 请病假 |
| 6 | 公假 | 公务请假 |

## 设备类型说明

| device值 | 设备类型 | 说明 |
|----------|----------|------|
| 1 | PC | 电脑端签到 |
| 2 | 安卓 | 安卓手机/平板签到 |
| 3 | iOS | 苹果手机/平板签到 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`course_id`、`course_info_id`、`teach_id`、`sign_id`、`student_id` 应引用相应表的有效记录
3. **唯一约束**：`sign_id + student_id` 组合应唯一，防止重复签到
4. **检查约束**：`sign_result_type` 只能是 0-6
5. **检查约束**：`device` 只能是 1-3

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **复合索引**：`sign_id, student_id` - 确保签到记录唯一性
- **关联索引**：`course_id` - 外键索引
- **关联索引**：`teach_id` - 外键索引
- **关联索引**：`student_id` - 外键索引
- **结果索引**：`sign_result_type` - 用于按签到结果统计
- **时间索引**：`create_time` - 用于按时间查询

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_course_face_teach_sign_student (
    id, course_id, teach_id, class_id, sign_id, sign_result_type,
    student_id, student_no, student_name, device, create_time, update_time
) VALUES (
    'SIGN_STU001', 'COURSE001', 'TEACH001', 'CLASS001', 'SIGN001', '1',
    'STU001', '202401001', '张三', '2',
    '2024-03-01 09:00:00', '2024-03-01 09:00:00'
);
```

### 查询示例
```sql
-- 查询某签到的学生记录
SELECT * FROM t_zjy_course_face_teach_sign_student
WHERE sign_id = 'SIGN001' AND del_flag = '0';

-- 查询某学生的签到记录
SELECT * FROM t_zjy_course_face_teach_sign_student
WHERE student_id = 'STU001' AND del_flag = '0'
ORDER BY create_time DESC;

-- 统计签到结果
SELECT sign_result_type, COUNT(*) as count
FROM t_zjy_course_face_teach_sign_student
WHERE sign_id = 'SIGN001' AND del_flag = '0'
GROUP BY sign_result_type;
```

### 关联查询示例
```sql
-- 查询签到详细统计信息
SELECT
    s.sign_result_type,
    CASE s.sign_result_type
        WHEN '0' THEN '缺勤'
        WHEN '1' THEN '已签到'
        WHEN '2' THEN '迟到'
        WHEN '3' THEN '事假'
        WHEN '4' THEN '早退'
        WHEN '5' THEN '病假'
        WHEN '6' THEN '公假'
    END as result_name,
    COUNT(*) as student_count
FROM t_zjy_course_face_teach_sign_student s
WHERE s.sign_id = 'SIGN001' AND s.del_flag = '0'
GROUP BY s.sign_result_type;
```

## 业务逻辑说明

### 签到流程
1. **教师发起签到**：在签到设置表中创建签到活动
2. **学生签到**：学生在指定时间内进行签到操作
3. **结果记录**：系统记录签到结果和详细信息
4. **统计分析**：根据签到记录进行考勤统计

### 签到结果判定
- **正常签到**：在规定时间内完成签到
- **迟到**：超过开始时间但仍在允许范围内签到
- **缺勤**：未在规定时间内签到
- **请假**：教师手动设置为请假状态

### 数据完整性
1. **关联完整性**：确保所有关联ID的有效性
2. **结果准确性**：签到结果应与实际操作一致
3. **时间准确性**：签到时间应准确记录

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送