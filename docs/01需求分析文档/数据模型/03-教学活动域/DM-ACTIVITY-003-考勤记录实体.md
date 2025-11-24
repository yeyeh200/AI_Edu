# 考勤记录实体 (Attendance)

---

**实体编号：** DM-ACTIVITY-003
**实体名称：** 考勤记录实体
**所属域：** 教学活动域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

考勤记录实体是AI助评应用教学活动的核心事实实体，记录学生的课堂考勤情况。该实体支持多种考勤方式，记录出勤、迟到、早退、请假等状态，为教学质量评价、学生管理、出勤统计等提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `fact_attendance`
- **业务表名：** 考勤记录表
- **数据类型：** 事实表

### 主要用途
- 记录学生考勤情况
- 支持多种考勤方式
- 提供出勤统计分析
- 支持教学质量评估

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 考勤记录唯一标识ID |

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
| student_id | BIGINT | 20 | NOT NULL | 0 | 学生ID |
| student_name | VARCHAR | 100 | NOT NULL | '' | 学生姓名 |
| student_no | VARCHAR | 50 | NOT NULL | '' | 学号 |

### 时间信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| attendance_date | DATE | - | NOT NULL | CURRENT_DATE | 考勤日期 |
| start_time | TIME | - | NOT NULL | '08:00:00' | 课程开始时间 |
| end_time | TIME | - | NOT NULL | '08:45:00' | 课程结束时间 |
| attendance_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 考勤记录时间 |
| week_number | INT | 11 | NOT NULL | 1 | 周次 |
| session_number | TINYINT | 1 | NOT NULL | 1 | 课时序号 |

### 考勤状态字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| attendance_status | ENUM | - | NOT NULL | 'PRESENT' | 考勤状态 |
| check_in_time | TIME | - | NULL | NULL | 签到时间 |
| check_out_time | TIME | - | NULL | NULL | 签退时间 |
| check_in_location | VARCHAR | 100 | NULL | NULL | 签到地点 |
| check_in_method | ENUM | - | NULL | NULL | 签到方式 |
| is_late | TINYINT | 1 | NOT NULL | 0 | 是否迟到 |
| late_minutes | INT | 11 | NULL | 0 | 迟到分钟数 |
| is_early_leave | TINYINT | 1 | NOT NULL | 0 | 是否早退 |
| early_leave_minutes | INT | 11 | NULL | 0 | 早退分钟数 |
| absence_reason | VARCHAR | 500 | NULL | NULL | 缺勤原因 |
| leave_type | ENUM | - | NULL | NULL | 请假类型 |
| leave_start_time | DATETIME | - | NULL | NULL | 请假开始时间 |
| leave_end_time | DATETIME | - | NULL | NULL | 请假结束时间 |
| leave_approver_id | BIGINT | 20 | NULL | NULL | 请假审批人ID |

### 扩展信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| device_type | VARCHAR | 50 | NULL | NULL | 考勤设备类型 |
| device_id | VARCHAR | 100 | NULL | NULL | 设备ID |
| ip_address | VARCHAR | 45 | NULL | NULL | IP地址 |
| location_coordinates | VARCHAR | 100 | NULL | NULL | 地理坐标 |
| photo_url | VARCHAR | 500 | NULL | NULL | 考勤照片URL |
| remarks | TEXT | - | NULL | NULL | 备注信息 |

### 验证字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| is_verified | TINYINT | 1 | NOT NULL | 0 | 是否已验证 |
| verify_time | DATETIME | - | NULL | NULL | 验证时间 |
| verify_by | BIGINT | 20 | NULL | NULL | 验证人ID |
| verify_method | ENUM | - | NULL | NULL | 验证方式 |
| is_exception | TINYINT | 1 | NOT NULL | 0 | 是否异常考勤 |
| exception_reason | VARCHAR | 500 | NULL | NULL | 异常原因 |
| manual_correction | TINYINT | 1 | NOT NULL | 0 | 是否手动修正 |
| correction_by | BIGINT | 20 | NULL | NULL | 修正人ID |
| correction_time | DATETIME | - | NULL | NULL | 修正时间 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| source_system | ENUM | - | NOT NULL | 'MANUAL' | 数据来源系统 |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_schedule_student (schedule_id, student_id, attendance_date)
```

### 外键约束
```sql
FOREIGN KEY (schedule_id) REFERENCES fact_schedule(id) ON DELETE CASCADE
FOREIGN KEY (course_id) REFERENCES dim_course(id) ON DELETE CASCADE
FOREIGN KEY (teacher_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (class_id) REFERENCES dim_class(id) ON DELETE CASCADE
FOREIGN KEY (student_id) REFERENCES dim_user(id) ON DELETE CASCADE
```

### 普通索引
```sql
INDEX idx_student_id (student_id)
INDEX idx_course_id (course_id)
INDEX idx_teacher_id (teacher_id)
INDEX idx_class_id (class_id)
INDEX idx_attendance_date (attendance_date)
INDEX idx_attendance_status (attendance_status)
INDEX idx_is_late (is_late)
INDEX idx_is_verified (is_verified)
```

### 检查约束
```sql
CHECK (attendance_status IN ('PRESENT', 'ABSENT', 'LATE', 'EARLY_LEAVE', 'LEAVE', 'EXCUSED'))
CHECK (check_in_method IN ('MANUAL', 'FACE_RECOGNITION', 'QR_CODE', 'CARD', 'GPS', 'BIOMETRIC'))
CHECK (leave_type IN ('SICK_LEAVE', 'PERSONAL_LEAVE', 'OFFICIAL_LEAVE', 'MATERNITY_LEAVE', 'OTHER'))
CHECK (is_late IN (0, 1))
CHECK (is_early_leave IN (0, 1))
CHECK (is_verified IN (0, 1))
CHECK (is_exception IN (0, 1))
CHECK (manual_correction IN (0, 1))
CHECK (source_system IN ('MANUAL', 'ZJY', 'SYSTEM', 'API'))
```

## 枚举值定义

### 考勤状态 (attendance_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PRESENT | 出勤 | 正常出勤 |
| ABSENT | 缺勤 | 无故缺勤 |
| LATE | 迟到 | 迟到上课 |
| EARLY_LEAVE | 早退 | 提早下课 |
| LEAVE | 请假 | 请假缺勤 |
| EXCUSED | 免考 | 免考勤 |

### 签到方式 (check_in_method)
| 值 | 说明 | 备注 |
|----|------|------|
| MANUAL | 手动 | 人工签到 |
| FACE_RECOGNITION | 人脸识别 | 人脸识别签到 |
| QR_CODE | 二维码 | 二维码签到 |
| CARD | 刷卡 | 刷卡签到 |
| GPS | 定位 | GPS定位签到 |
| BIOMETRIC | 生物识别 | 指纹等生物识别 |

### 请假类型 (leave_type)
| 值 | 说明 | 备注 |
|----|------|------|
| SICK_LEAVE | 病假 | 生病请假 |
| PERSONAL_LEAVE | 事假 | 个人事务请假 |
| OFFICIAL_LEAVE | 公假 | 公务请假 |
| MATERNITY_LEAVE | 产假 | 生育请假 |
| OTHER | 其他 | 其他请假 |

### 数据来源系统 (source_system)
| 值 | 说明 | 备注 |
|----|------|------|
| MANUAL | 手动录入 | 手工录入 |
| ZJY | 职教云 | 职教云平台 |
| SYSTEM | 系统 | 系统自动 |
| API | 接口 | API接口 |

## 考勤规则

### 出勤判定规则
1. **正常出勤**：在课程开始时间前10分钟内签到
2. **迟到**：在课程开始时间后10分钟内签到
3. **缺勤**：课程结束前未签到且未请假
4. **早退**：在课程结束前10分钟内签退

### 请假规则
1. **病假**：需要提供医生证明
2. **事假**：需要提前申请批准
3. **公假**：学校安排的公假活动
4. **产假**：符合国家规定

### 统计规则
1. **出勤率**：实际出勤次数 / 应出勤次数 × 100%
2. **迟到率**：迟到次数 / 应出勤次数 × 100%
3. **缺勤率**：缺勤次数 / 应出勤次数 × 100%

## 关联关系

### 多对一关系（作为从表）
- **Attendance → Schedule**：考勤记录属于课程安排
- **Attendance → Course**：考勤记录属于课程
- **Attendance → Teacher**：考勤记录关联教师
- **Attendance → Class**：考勤记录属于班级
- **Attendance → Student**：考勤记录关联学生

## 使用示例

### 查询示例

#### 1. 查询学生考勤统计
```sql
SELECT
    u.student_no,
    u.user_name as student_name,
    c.class_name,
    COUNT(*) as total_sessions,
    SUM(CASE WHEN a.attendance_status = 'PRESENT' THEN 1 END) as present_count,
    SUM(CASE WHEN a.attendance_status = 'ABSENT' THEN 1 END) as absent_count,
    SUM(CASE WHEN a.attendance_status = 'LATE' THEN 1 END) as late_count,
    SUM(CASE WHEN a.attendance_status = 'LEAVE' THEN 1 END) as leave_count,
    ROUND(
        SUM(CASE WHEN a.attendance_status = 'PRESENT' THEN 1 END) * 100.0 / COUNT(*), 2
    ) as attendance_rate
FROM fact_attendance a
JOIN dim_user u ON a.student_id = u.id
JOIN dim_class c ON a.class_id = c.id
WHERE a.attendance_date BETWEEN '2023-09-01' AND '2023-10-31'
  AND u.user_type = 'STUDENT'
GROUP BY u.id, u.student_no, u.user_name, c.class_name
ORDER BY attendance_rate DESC;
```

#### 2. 查询班级考勤情况
```sql
SELECT
    c.class_name,
    a.attendance_date,
    COUNT(*) as total_students,
    SUM(CASE WHEN a.attendance_status = 'PRESENT' THEN 1 END) as present_count,
    SUM(CASE WHEN a.attendance_status = 'ABSENT' THEN 1 END) as absent_count,
    SUM(CASE WHEN a.attendance_status = 'LATE' THEN 1 END) as late_count,
    ROUND(
        SUM(CASE WHEN a.attendance_status = 'PRESENT' THEN 1 END) * 100.0 / COUNT(*), 2
    ) as attendance_rate
FROM fact_attendance a
JOIN dim_class c ON a.class_id = c.id
WHERE a.attendance_date = CURRENT_DATE()
  AND a.course_id IS NOT NULL
GROUP BY c.class_id, c.class_name, a.attendance_date
ORDER BY attendance_rate DESC;
```

#### 3. 查询教师课程考勤统计
```sql
SELECT
    t.user_name as teacher_name,
    co.course_name,
    COUNT(*) as total_sessions,
    COUNT(DISTINCT a.student_id) as unique_students,
    SUM(CASE WHEN a.attendance_status = 'PRESENT' THEN 1 END) as total_attendances,
    AVG(
        SUM(CASE WHEN a.attendance_status = 'PRESENT' THEN 1 END) * 100.0 /
        SUM(CASE WHEN a.attendance_status IS NOT NULL THEN 1 END)
    ) as avg_attendance_rate
FROM fact_attendance a
JOIN dim_user t ON a.teacher_id = t.id
JOIN dim_course co ON a.course_id = co.id
WHERE a.attendance_date BETWEEN '2023-09-01' AND '2023-10-31'
  AND t.user_type = 'TEACHER'
GROUP BY t.id, t.user_name, co.course_name
ORDER BY avg_attendance_rate DESC;
```

#### 4. 查询异常考勤记录
```sql
SELECT
    a.id,
    a.student_name,
    a.student_no,
    a.course_name,
    a.attendance_date,
    a.attendance_status,
    a.absence_reason,
    a.is_exception,
    a.exception_reason,
    a.check_in_time,
    a.late_minutes
FROM fact_attendance a
WHERE a.is_exception = 1
  OR a.attendance_status IN ('ABSENT', 'LATE', 'EARLY_LEAVE')
ORDER BY a.attendance_date DESC, a.student_name;
```

### 插入示例

#### 1. 正常出勤记录
```sql
INSERT INTO fact_attendance (
    schedule_id, course_id, course_name,
    teacher_id, teacher_name, class_id, class_name,
    student_id, student_name, student_no,
    attendance_date, start_time, end_time,
    attendance_status, check_in_time, check_in_method,
    is_late, is_verified,
    source_system
) VALUES (
    12345, 1001, '数据结构与算法',
    23456, '张老师', 34567, '软件工程2023-1班',
    45678, '李四', 'S20230001',
    '2023-10-23', '08:00:00', '08:45:00',
    'PRESENT', '08:05:00', 'FACE_RECOGNITION',
    0, 1,
    'SYSTEM'
);
```

#### 2. 迟到记录
```sql
INSERT INTO fact_attendance (
    schedule_id, course_id, course_name,
    teacher_id, teacher_name, class_id, class_name,
    student_id, student_name, student_no,
    attendance_date, start_time, end_time,
    attendance_status, check_in_time, check_in_method,
    is_late, late_minutes, is_verified,
    source_system
) VALUES (
    12345, 1001, '数据结构与算法',
    23456, '张老师', 34567, '软件工程2023-1班',
    45679, '王五', 'S20230002',
    '2023-10-23', '08:00:00', '08:45:00',
    'LATE', '08:12:00', 'QR_CODE',
    1, 12, 1,
    'SYSTEM'
);
```

### 更新示例

#### 1. 修正考勤记录
```sql
UPDATE fact_attendance
SET attendance_status = 'PRESENT',
    check_in_time = '08:08:00',
    is_late = 0,
    late_minutes = 0,
    manual_correction = 1,
    correction_by = 12345,
    correction_time = NOW(),
    update_time = NOW()
WHERE id = 67890;
```

#### 2. 标记异常考勤
```sql
UPDATE fact_attendance
SET is_exception = 1,
    exception_reason = '学生反馈签到设备故障',
    update_time = NOW()
WHERE id = 67890
  AND attendance_status = 'ABSENT';
```

## 数据质量

### 质量检查规则
1. **完整性检查**：学生、课程等关键字段不能为空
2. **一致性检查**：考勤时间必须在课程时间范围内
3. **逻辑检查**：签到时间不能晚于签退时间
4. **唯一性检查**：同一学生同一课程同一日期不能重复考勤

### 数据清洗规则
1. **重复数据处理**：删除重复的考勤记录
2. **异常数据处理**：识别和处理异常考勤
3. **时间修正**：修正不合理的时间记录
4. **状态修正**：统一考勤状态标准

## 性能优化

### 索引优化
- 学生ID、课程ID建立复合索引
- 考勤日期建立索引支持时间范围查询
- 考勤状态建立索引支持状态过滤

### 分区策略
- 按月份进行表分区
- 提高大数据量查询性能

### 查询优化
- 使用覆盖索引优化统计查询
- 避免全表扫描
- 合理使用时间范围过滤

## 安全考虑

### 数据保护
- 考勤照片等敏感信息访问控制
- 地理位置信息脱敏处理
- 学生隐私数据保护

### 权限控制
- 考勤记录修改需要特殊权限
- 教师只能查看自己课程的考勤
- 学生只能查看自己的考勤记录

## 扩展说明

### 未来扩展方向
1. **AI分析**：基于考勤数据的智能分析
2. **预测模型**：出勤率和学习效果预测
3. **多维度统计**：更丰富的统计分析功能
4. **移动端支持**：移动端考勤功能

### 兼容性说明
- 支持与职教云考勤系统对接
- 支持多种考勤设备集成
- 支持标准考勤数据格式

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*