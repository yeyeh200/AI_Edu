# course_info_student 课程开课班级学生表

## 基本信息

- **表名**：`course_info_student`
- **中文名称**：课程开课班级学生
- **用途**：存储课程开课班级的学生名单，用于基础数据同步和选课管理
- **字段数量**：8个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| course_info_code | varchar | 50 | NO | - | 课程开课编码 |
| class_code | varchar | 50 | NO | - | 开课班级code |
| student_name | varchar | 50 | NO | - | 姓名 |
| school_number | varchar | 50 | NO | - | 学号 |
| column1 | varchar | 255 | YES | - | 扩展1 |
| column2 | varchar | 255 | YES | - | 扩展2 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：选课记录唯一标识符，主键，varchar类型，最大长度50字符

### 关联字段
- **course_info_code**：课程开课编码，关联课程开课表，必填
- **class_code**：开课班级编码，关联班级信息表，必填

### 学生信息字段
- **student_name**：学生姓名，冗余存储便于查询，必填
- **school_number**：学生学号，关联学生信息表，必填

### 扩展字段
- **column1**：扩展字段1，可根据业务需要存储额外信息
- **column2**：扩展字段2，可根据业务需要存储额外信息

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 扩展字段使用建议

### column1 用途建议
- **选课状态**：已选课、待确认、已取消、已完成等
- **选课时间**：学生选课的具体时间
- **选课方式**：正常选课、补选、退选后重选等
- **成绩状态**：未评定、已评定、需重修等

### column2 用途建议
- **学习进度**：课程学习进度百分比
- **活跃度**：学生参与课堂活动的活跃程度
- **特殊标记**：助教、班长、学习委员等身份标记
- **备注信息**：特殊情况说明、请假记录等

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`course_info_code + class_code + school_number` 组合应唯一
3. **非空约束**：除扩展字段外，其他字段均为必填字段
4. **外键约束**：`course_info_code` 应引用课程开课表中的有效记录
5. **外键约束**：`class_code` 应引用班级信息表中的有效记录
6. **外键约束**：`school_number` 应引用学生信息表中的有效记录

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **复合索引**：`course_info_code, class_code, school_number` - 确保选课记录的唯一性
- **学生索引**：`school_number` - 用于按学生查询选课情况
- **关联索引**：`course_info_code` - 外键索引，用于关联查询开课信息
- **关联索引**：`class_code` - 外键索引，用于关联查询班级信息

## 数据关联关系

### 外键关联
- **course_info**：通过 `course_info_code` 字段关联课程开课表
- **class_info**：通过 `class_code` 字段关联班级信息表
- **student_info**：通过 `school_number` 字段关联学生信息表

### 业务关联
- 与 **course_info_class** 表形成关联：开课班级 → 学生名单
- 与教学过程数据表关联：学生参与各种教学活动的记录

## 使用示例

### SQL插入示例
```sql
INSERT INTO course_info_student (
    id,
    course_info_code,
    class_code,
    student_name,
    school_number,
    column1,
    column2,
    create_time,
    update_time
) VALUES (
    'CIS001',
    'CI_CS101_202401',
    'CS202401',
    '张三',
    '202401001',
    '选课状态:已选课,选课时间:2024-02-15 10:30:00',
    '学习进度:75%,活跃度:高,备注:学习认真',
    '2024-02-15 10:30:00',
    '2024-02-15 10:30:00'
);
```

### 查询示例
```sql
-- 查询所有选课学生
SELECT * FROM course_info_student
ORDER BY course_info_code, class_code, student_name;

-- 查询某开课的学生名单
SELECT * FROM course_info_student
WHERE course_info_code = 'CI_CS101_202401'
ORDER BY student_name;

-- 查询某班级的选课学生
SELECT * FROM course_info_student
WHERE class_code = 'CS202401'
ORDER BY student_name;

-- 查询某学生的选课情况
SELECT * FROM course_info_student
WHERE school_number = '202401001'
ORDER BY course_info_code;
```

### 关联查询示例
```sql
-- 查询学生选课完整信息
SELECT
    cis.student_name,
    cis.school_number,
    ci.course_name,
    c.class_name,
    f.faculty_name,
    m.major_name,
    cic.term_name
FROM course_info_student cis
LEFT JOIN course_info ci ON cis.course_info_code = ci.course_code
LEFT JOIN course_info_class cic ON cis.course_info_code = cic.course_info_code
                           AND cis.class_code = cic.class_code
LEFT JOIN class_info c ON cis.class_code = c.classes_code
LEFT JOIN faculty_info f ON c.faculty_code = f.faculty_code
LEFT JOIN major_info m ON c.major_code = m.major_code
WHERE cis.school_number = '202401001'
ORDER BY ci.course_name;
```

### 统计查询示例
```sql
-- 统计每门课程的选课人数
SELECT
    course_info_code,
    COUNT(*) as student_count
FROM course_info_student
GROUP BY course_info_code
ORDER BY student_count DESC;

-- 统计每个学生的选课数量
SELECT
    school_number,
    student_name,
    COUNT(*) as course_count
FROM course_info_student
GROUP BY school_number, student_name
ORDER BY course_count DESC;
```

## 学生选课管理业务逻辑

### 选课流程
1. **选课开放**：系统开放选课功能
2. **学生选课**：学生选择心仪的课程
3. **选课确认**：系统确认选课有效性
4. **名单生成**：生成最终的选课学生名单

### 选课状态管理
1. **待确认**：学生已提交选课申请，等待确认
2. **已选课**：选课已确认，学生正式加入课程
3. **已取消**：学生主动退选或管理员取消
4. **已完成**：课程已结束，学生完成学习

### 名额管理
1. **容量限制**：根据教室容量限制选课人数
2. **优先级**：按年级、专业等因素设置选课优先级
3. **抽签机制**：超员时采用抽签方式确定选课学生
4. **补选阶段**：开放补选满足学生需求

## 数据同步注意事项

### 选课数据同步
1. **实时性**：选课操作需要实时同步到系统
2. **一致性**：确保选课数据与学生信息的一致性
3. **容量控制**：同步时需要考虑课程容量限制
4. **冲突处理**：处理选课冲突和重复选课问题

### 学生信息同步
1. **姓名一致性**：学生姓名应与学生信息表保持一致
2. **学号准确性**：学号是学生唯一标识，必须准确
3. **班级关联**：确保学生与班级的关联关系正确

### 时间戳管理
1. **选课时间**：记录学生选课的准确时间
2. **更新时间**：及时更新选课状态变更时间
3. **审计追踪**：通过时间戳追踪选课操作历史

## 扩展字段配置

### column1 配置示例
```
格式：属性1:值1,属性2:值2
示例：选课状态:已选课,选课时间:2024-02-15 10:30:00,选课方式:正常选课
```

### column2 配置示例
```
格式：属性1:值1,属性2:值2
示例：学习进度:75%,活跃度:高,角色:班长,备注:学习认真，积极参与
```

## 常见选课场景示例

| course_info_code | class_code | student_name | school_number | column1 | column2 | 说明 |
|------------------|------------|--------------|---------------|---------|---------|------|
| CI_CS101_202401 | CS202401 | 张三 | 202401001 | 已选课,2024-02-15 | 学习进度:80%,活跃度:高 | 正常选课学生 |
| CI_CS201_202401 | CS202401 | 李四 | 202401002 | 已选课,2024-02-16 | 学习进度:65%,活跃度:中 | 正常选课学生 |
| CI_EN101_202401 | CS202401 | 王五 | 202401003 | 待确认,2024-02-17 | 学习进度:0%,活跃度:低 | 新选课待确认 |

## 性能优化建议

### 索引优化
1. **复合索引**：创建 `course_info_code + class_code` 的复合索引
2. **学生索引**：创建 `school_number` 索引优化学生查询
3. **时间索引**：如果按时间查询，可添加时间相关索引

### 数据分区
1. **按学期分区**：可根据学期对数据进行分区管理
2. **按课程分区**：大规模数据可按课程进行分区
3. **归档策略**：历史选课数据可进行归档处理

---

**数据来源**：校方教务管理系统（选课模块）
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步