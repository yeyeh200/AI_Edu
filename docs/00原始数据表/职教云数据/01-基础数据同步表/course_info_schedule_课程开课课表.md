# course_info_schedule 课程开课课表表

## 基本信息

- **表名**：`course_info_schedule`
- **中文名称**：课程开课课表
- **用途**：存储具体的上课时间安排，包括授课时间、地点、节次等，用于基础数据同步
- **字段数量**：9个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| course_info_code | varchar | 50 | NO | - | 课程开课编码 |
| class_code | varchar | 50 | NO | - | 开课班级code |
| teach_date | datetime | - | NO | - | 授课时间（例如：yyyy-MM-dd 00:00:00） |
| teach_address | varchar | 50 | NO | - | 授课地点 |
| teach_section | varchar | 50 | NO | - | 授课节次 |
| column1 | varchar | 255 | YES | - | 扩展1 |
| column2 | varchar | 255 | YES | - | 扩展2 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：课表记录唯一标识符，主键，varchar类型，最大长度50字符

### 关联字段
- **course_info_code**：课程开课编码，关联课程开课表，必填
- **class_code**：开课班级编码，关联班级信息表，必填

### 时间地点字段
- **teach_date**：授课日期时间，精确到日期部分，必填
- **teach_address**：授课地点，如教室号、实验室号，必填
- **teach_section**：授课节次，如"第1-2节"、"上午1-2节"，必填

### 扩展字段
- **column1**：扩展字段1，可根据业务需要存储额外信息
- **column2**：扩展字段2，可根据业务需要存储额外信息

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 授课节次规范建议

建议采用以下授课节次规范：
- **连续节次**：第1-2节、第3-4节、第5-6节等
- **时间段**：上午1-2节、下午3-4节、晚上7-8节等
- **具体时间**：08:00-09:30、10:00-11:30、14:00-15:30等

## 授课地点规范建议

建议采用以下授课地点规范：
- **教学楼+教室号**：如A101、B201、C305等
- **实验室标识**：如LAB01、LAB02、计算机实验室等
- **特殊场地**：如体育馆、音乐厅、实训基地等

## 扩展字段使用建议

### column1 用途建议
- **教师信息**：当节授课教师工号或姓名
- **课程类型**：理论课、实验课、实训课、讨论课等
- **课时信息**：单次课时长、连续课时数
- **设备需求**：投影仪、电脑、实验设备等

### column2 用途建议
- **课表状态**：正常、调课、停课、补课等
- **特殊安排**：分组教学、在线教学、校外实践等
- **备注信息**：课程调整说明、注意事项等
- **联系人信息**：助教联系方式、实验室管理员等

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`course_info_code + class_code + teach_date + teach_section` 组合应唯一
3. **非空约束**：除扩展字段外，其他字段均为必填字段
4. **外键约束**：`course_info_code` 应引用课程开课表中的有效记录
5. **外键约束**：`class_code` 应引用班级信息表中的有效记录
6. **时间约束**：`teach_date` 必须是有效的日期时间格式

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **复合索引**：`course_info_code, class_code, teach_date` - 用于按开课和班级查询
- **时间索引**：`teach_date` - 用于按日期查询
- **地点索引**：`teach_address` - 用于按地点查询
- **节次索引**：`teach_section` - 用于按节次查询
- **关联索引**：`course_info_code` - 外键索引
- **关联索引**：`class_code` - 外键索引

## 数据关联关系

### 外键关联
- **course_info**：通过 `course_info_code` 字段关联课程开课表
- **class_info**：通过 `class_code` 字段关联班级信息表

### 业务关联
- 与 **course_info_class** 表形成层级关系：开课 → 开课班级 → 具体课表
- 与 **teacher_info** 表通过扩展字段关联教师信息

## 使用示例

### SQL插入示例
```sql
INSERT INTO course_info_schedule (
    id,
    course_info_code,
    class_code,
    teach_date,
    teach_address,
    teach_section,
    column1,
    column2,
    create_time,
    update_time
) VALUES (
    'SCH001',
    'CI_CS101_202401',
    'CS202401',
    '2024-03-01 08:00:00',
    'A101',
    '第1-2节',
    '理论课,2课时,教师:T2024001',
    '状态:正常,备注:投影仪',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询所有课表
SELECT * FROM course_info_schedule
ORDER BY teach_date, teach_section;

-- 查询某开课的课表
SELECT * FROM course_info_schedule
WHERE course_info_code = 'CI_CS101_202401'
ORDER BY teach_date, teach_section;

-- 查询某班级的课表
SELECT * FROM course_info_schedule
WHERE class_code = 'CS202401'
ORDER BY teach_date, teach_section;

-- 查询某日期的课表
SELECT * FROM course_info_schedule
WHERE DATE(teach_date) = '2024-03-01'
ORDER BY teach_section;
```

### 关联查询示例
```sql
-- 查询课表完整信息
SELECT
    cs.teach_date,
    cs.teach_address,
    cs.teach_section,
    ci.course_name,
    c.class_name,
    f.faculty_name,
    m.major_name
FROM course_info_schedule cs
LEFT JOIN course_info ci ON cs.course_info_code = ci.course_code
LEFT JOIN course_info_class cic ON cs.course_info_code = cic.course_info_code
                             AND cs.class_code = cic.class_code
LEFT JOIN class_info c ON cs.class_code = c.classes_code
LEFT JOIN faculty_info f ON c.faculty_code = f.faculty_code
LEFT JOIN major_info m ON c.major_code = m.major_code
WHERE cs.teach_date BETWEEN '2024-03-01' AND '2024-03-07'
ORDER BY cs.teach_date, cs.teach_section;
```

### 按教室查询示例
```sql
-- 查询某教室的使用情况
SELECT
    teach_date,
    teach_section,
    course_info_code,
    teach_address
FROM course_info_schedule
WHERE teach_address = 'A101'
  AND teach_date BETWEEN '2024-03-01' AND '2024-03-07'
ORDER BY teach_date, teach_section;
```

## 课表管理业务逻辑

### 课表编排
1. **时间安排**：合理安排授课时间，避免冲突
2. **地点分配**：根据课程类型和人数分配合适的教学场地
3. **节次安排**：合理分配授课节次，考虑教学效果
4. **资源协调**：协调教室、设备等教学资源

### 课表维护
1. **信息更新**：及时更新课程调整信息
2. **冲突检测**：检测和解决时间地点冲突
3. **变更通知**：课表变更需要及时通知相关人员
4. **历史记录**：保留课表变更的历史记录

### 特殊安排处理
1. **调课处理**：记录调课的原因和新安排
2. **补课安排**：安排因特殊原因取消课程的补课时间
3. **临时调整**：处理临时的课程安排调整
4. **特殊教学**：记录在线教学、校外实践等特殊安排

## 数据同步注意事项

### 教务数据同步
1. **课表数据**：课表信息来源于教务管理系统
2. **实时更新**：课表调整需要实时同步更新
3. **数据一致性**：确保课表与开课信息的一致性
4. **冲突解决**：同步过程中需要检测和解决冲突

### 时间管理
1. **时间格式**：统一时间日期格式
2. **时区处理**：考虑时区对时间显示的影响
3. **节假日处理**：考虑节假日对课表安排的影响
4. **学期边界**：注意学期开始和结束的时间边界

### 资源管理
1. **教室资源**：教室使用情况需要合理安排
2. **设备资源**：多媒体设备、实验设备的使用协调
3. **教师资源**：教师时间安排的冲突检测
4. **容量限制**：教室容量与选课人数的匹配

## 扩展字段配置

### column1 配置示例
```
格式：属性1:值1,属性2:值2
示例：课程类型:理论课,课时:2,教师:T2024001,设备:投影仪+电脑
```

### column2 配置示例
```
格式：属性1:值1,属性2:值2
示例：状态:正常,备注:需要准备实验器材,联系人:助教T2024002
```

## 常见课表示例

| teach_date | teach_address | teach_section | course_info_code | 说明 |
|------------|----------------|----------------|------------------|------|
| 2024-03-01 08:00:00 | A101 | 第1-2节 | CI_CS101_202401 | 计算机导论理论课 |
| 2024-03-01 14:00:00 | LAB01 | 第5-6节 | CI_CS201_202401 | 数据结构实验课 |
| 2024-03-02 10:00:00 | B201 | 第3-4节 | CI_MA101_202401 | 高等数学理论课 |
| 2024-03-03 08:00:00 | A102 | 第1-2节 | CI_EN101_202401 | 大学英语听说课 |

---

**数据来源**：校方教务管理系统（课表编排模块）
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步