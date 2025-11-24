# course_info_class 课程开课班级表

## 基本信息

- **表名**：`course_info_class`
- **中文名称**：课程开课班级
- **用途**：存储课程开课班级信息，包含学期信息、教师团队等，用于基础数据同步
- **字段数量**：12个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| course_info_code | varchar | 50 | NO | - | 课程开课编码 |
| class_name | varchar | 50 | NO | - | 班级名称 |
| class_code | varchar | 50 | NO | - | 班级编码 |
| teacher_name | varchar | 50 | NO | - | 主持教师姓名 |
| teacher_no | varchar | 50 | NO | - | 主持教师工号 |
| teacher_nos | varchar | 500 | NO | - | 授课教师工号(多个逗号拼接) |
| term_name | varchar | 50 | NO | - | 学期名称(例如：2024春，2024秋) |
| term_code | varchar | 50 | NO | - | 学期编码(例如：202401) |
| column1 | varchar | 255 | YES | - | 扩展1 |
| column2 | varchar | 255 | YES | - | 扩展2 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：开课班级记录唯一标识符，主键，varchar类型，最大长度50字符

### 关联字段
- **course_info_code**：课程开课编码，关联课表开课表，必填
- **class_name**：班级名称，冗余存储便于查询，必填
- **class_code**：班级编码，关联班级信息表，必填

### 教师团队字段
- **teacher_name**：主持教师姓名，必填
- **teacher_no**：主持教师工号，关联教师信息表，必填
- **teacher_nos**：授课教师工号列表，多个教师工号用逗号分隔，必填

### 学期信息字段
- **term_name**：学期名称，如"2024春"、"2024秋"，必填
- **term_code**：学期编码，如"202401"、"202402"，必填

### 扩展字段
- **column1**：扩展字段1，可根据业务需要存储额外信息
- **column2**：扩展字段2，可根据业务需要存储额外信息

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 学期编码规范建议

建议采用以下学期编码规范：
- **年份 + 学期序号**：如202401（2024年春季）、202402（2024年秋季）
- **年份 + 季节标识**：如2024S（Spring）、2024F（Fall）
- **年份 + 月份范围**：如202402（2月开学）

## 教师团队管理

### 教师类型说明
1. **主持教师**：课程的主要负责人和主讲教师
2. **授课教师**：参与课程教学的教师团队
3. **助教教师**：协助课程教学和管理的教师或研究生

### 教师工号格式
```
teacher_nos 格式：工号1,工号2,工号3
示例：T2024001,T2024002,T2024003
```

## 扩展字段使用建议

### column1 用途建议
- **班级容量**：最大选课人数、当前选课人数
- **上课地点**：教室、实验室信息
- **上课时间**：具体的上课时间安排
- **课程类型**：理论课、实验课、实训课等

### column2 用途建议
- **开课状态**：已确认、待确认、已取消
- **选课状态**：开放选课、选课结束、已满员
- **特殊安排**：调课、补课等特殊安排信息
- **联系方式**：教师联系方式、答疑时间等

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **非空约束**：除扩展字段外，其他字段均为必填字段
3. **外键约束**：`course_info_code` 应引用课表开课表中的有效记录
4. **外键约束**：`class_code` 应引用班级信息表中的有效记录
5. **外键约束**：`teacher_no` 应引用教师表中的有效记录
6. **数据格式约束**：`teacher_nos` 必须是有效的工号列表，用逗号分隔

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **复合索引**：`course_info_code, class_code` - 确保开课班级的唯一性
- **关联索引**：`course_info_code` - 外键索引，用于关联查询开课信息
- **关联索引**：`class_code` - 外键索引，用于关联查询班级信息
- **关联索引**：`teacher_no` - 外键索引，用于关联查询教师信息
- **学期索引**：`term_code` - 用于按学期查询

## 数据关联关系

### 外键关联
- **course_info**：通过 `course_info_code` 字段关联课表开课表
- **class_info**：通过 `class_code` 字段关联班级信息表
- **teacher_info**：通过 `teacher_no` 和 `teacher_nos` 字段关联教师信息表

### 被其他表引用
- **course_info_schedule**：课程开课课表表
- **course_info_student**：课程开课班级学生表

## 使用示例

### SQL插入示例
```sql
INSERT INTO course_info_class (
    id,
    course_info_code,
    class_name,
    class_code,
    teacher_name,
    teacher_no,
    teacher_nos,
    term_name,
    term_code,
    column1,
    column2,
    create_time,
    update_time
) VALUES (
    'CIC001',
    'CI_CS101_202401',
    '计算机科学与技术2024级1班',
    'CS202401',
    '张老师',
    'T2024001',
    'T2024001,T2024002,T2024003',
    '2024春',
    '202401',
    '最大容量:60,当前人数:45,教室:A101',
    '状态:已确认,选课开放',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询所有开课班级
SELECT * FROM course_info_class
ORDER BY term_code DESC, course_info_code, class_name;

-- 根据开课编码查询班级
SELECT * FROM course_info_class
WHERE course_info_code = 'CI_CS101_202401';

-- 根据班级编码查询开课
SELECT * FROM course_info_class
WHERE class_code = 'CS202401'
ORDER BY term_code DESC;

-- 查询某教师主持的班级
SELECT * FROM course_info_class
WHERE teacher_no = 'T2024001'
ORDER BY term_code DESC;
```

### 关联查询示例
```sql
-- 查询开课班级完整信息
SELECT
    cic.id,
    cic.class_name,
    cic.teacher_name,
    cic.term_name,
    ci.course_name,
    f.faculty_name,
    m.major_name
FROM course_info_class cic
LEFT JOIN course_info ci ON cic.course_info_code = ci.course_code
LEFT JOIN class_info c ON cic.class_code = c.classes_code
LEFT JOIN faculty_info f ON c.faculty_code = f.faculty_code
LEFT JOIN major_info m ON c.major_code = m.major_code
WHERE cic.term_code = '202401'
ORDER BY cic.class_name;
```

### 教师团队查询示例
```sql
-- 解析教师工号并查询教师信息
SELECT
    cic.class_name,
    cic.course_info_code,
    t.teacher_name as main_teacher,
    GROUP_CONCAT(DISTINCT t2.teacher_name) as all_teachers
FROM course_info_class cic
LEFT JOIN teacher_info t ON cic.teacher_no = t.job_no
LEFT JOIN teacher_info t2 ON FIND_IN_SET(t2.job_no, cic.teacher_nos) > 0
WHERE cic.term_code = '202401'
GROUP BY cic.id, cic.class_name, cic.course_info_code, t.teacher_name;
```

## 开课班级管理业务逻辑

### 班级开课
1. **课程关联**：必须关联有效的课程开课记录
2. **班级分配**：明确授课的行政班级
3. **教师安排**：指定主持教师和授课教师团队
4. **学期确定**：明确开课的学期信息

### 教师团队管理
1. **主持教师**：负责课程整体安排和教学管理
2. **授课教师**：参与具体的教学活动
3. **团队协作**：多个教师的分工和协作安排

### 学期管理
1. **学期规范**：学期名称和编码应遵循统一规范
2. **时间安排**：明确学期的开始和结束时间
3. **选课管理**：选课时间和状态管理

## 数据同步注意事项

### 教务数据同步
1. **开课安排**：班级开课信息来源于教务管理系统
2. **教师安排**：教师授课安排需要及时同步
3. **学期信息**：学期信息需要与学校校历保持一致

### 数据完整性
1. **关联一致**：确保所有关联数据的一致性
2. **教师信息**：教师工号必须存在于教师表中
3. **班级信息**：班级编码必须存在于班级表中

### 团队管理
1. **工号格式**：teacher_nos 字段的工号格式必须正确
2. **角色区分**：明确区分主持教师和授课教师
3. **权限管理**：不同教师的权限和职责管理

## 常见开课班级示例

| course_info_code | class_name | term_name | teacher_name | teacher_nos | 说明 |
|------------------|------------|-----------|--------------|-------------|------|
| CI_CS101_202401 | 计算机科学与技术2024级1班 | 2024春 | 张老师 | T2024001,T2024002 | 张老师主持，李老师协助 |
| CI_CS201_202401 | 计算机科学与技术2024级2班 | 2024春 | 王老师 | T2024003,T2024004 | 王老师主持，赵老师协助 |
| CI_MA101_202401 | 软件工程2024级1班 | 2024春 | 刘老师 | T2024005 | 刘老师单独授课 |

---

**数据来源**：校方教务管理系统（选课和排课模块）
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步