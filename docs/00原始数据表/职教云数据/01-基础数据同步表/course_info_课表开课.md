# course_info 课表开课表

## 基本信息

- **表名**：`course_info`
- **中文名称**：课表开课
- **用途**：存储课表开课信息，关联教师和课程，用于基础数据同步和课表管理
- **字段数量**：11个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| base_course_code | varchar | 50 | NO | - | 学校课程编码 |
| course_name | varchar | 50 | NO | - | 课程名称 |
| course_code | varchar | 50 | NO | - | 课程编码 |
| teacher_name | varchar | 50 | NO | - | 教师姓名 |
| teacher_no | varchar | 50 | NO | - | 教师工号 |
| faculty_code | varchar | 50 | YES | - | 院系code |
| major_code | varchar | 50 | YES | - | 专业code |
| column1 | varchar | 255 | YES | - | 扩展1 |
| column2 | varchar | 255 | YES | - | 扩展2 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：开课记录唯一标识符，主键，varchar类型，最大长度50字符

### 课程关联字段
- **base_course_code**：学校课程编码，关联基础课程表，必填
- **course_name**：课程名称，冗余存储便于查询，必填
- **course_code**：课程编码，系统内部开课编码，必填

### 教师关联字段
- **teacher_name**：授课教师姓名，必填
- **teacher_no**：授课教师工号，关联教师信息表，必填

### 院系专业关联字段
- **faculty_code**：开课院系编码，关联院系信息表
- **major_code**：开课专业编码，关联专业信息表

### 扩展字段
- **column1**：扩展字段1，可根据业务需要存储额外信息
- **column2**：扩展字段2，可根据业务需要存储额外信息

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 开课编码规范建议

建议采用以下开课编码规范：
- **学期 + 课程编码 + 班级序号 + 教师工号**：如202401_CS101_01_T001
- **年份 + 学期 + 课程编码 + 序号**：如20241_CS101_01
- **自定义规范**：根据学校实际情况制定统一编码规则

## 扩展字段使用建议

### column1 用途建议
- **开课类型**：必修课、选修课、实践课等
- **学分信息**：课程学分
- **学时信息**：总学时数、理论学时、实践学时
- **课程性质**：公共课、专业课、基础课等

### column2 用途建议
- **教室信息**：默认教室或实验室
- **开课状态**：已确认、待确认、已取消等
- **课程容量**：最大选课人数
- **当前人数**：已选课人数

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`course_code` 应保持唯一性
3. **非空约束**：`base_course_code`、`course_name`、`course_code`、`teacher_name`、`teacher_no` 为必填字段
4. **外键约束**：`base_course_code` 应引用基础课程表中的有效记录
5. **外键约束**：`teacher_no` 应引用教师表中的有效记录
6. **外键约束**：`faculty_code` 应引用院系表中的有效记录
7. **外键约束**：`major_code` 应引用专业表中的有效记录

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`course_code` - 建议创建唯一索引，确保开课编码唯一性
- **关联索引**：`base_course_code` - 外键索引，用于关联查询课程信息
- **关联索引**：`teacher_no` - 外键索引，用于关联查询教师信息
- **关联索引**：`faculty_code` - 外键索引，用于关联查询院系信息
- **关联索引**：`major_code` - 外键索引，用于关联查询专业信息

## 数据关联关系

### 外键关联
- **base_course**：通过 `base_course_code` 字段关联基础课程表
- **teacher_info**：通过 `teacher_no` 字段关联教师信息表
- **faculty_info**：通过 `faculty_code` 字段关联院系信息表
- **major_info**：通过 `major_code` 字段关联专业信息表

### 被其他表引用
- **course_info_class**：课程开课班级表，通过 `course_info_code` 关联
- **course_info_schedule**：课程开课课表表，通过 `course_info_code` 关联
- **course_info_student**：课程开课班级学生表，通过 `course_info_code` 关联

## 使用示例

### SQL插入示例
```sql
INSERT INTO course_info (
    id,
    base_course_code,
    course_name,
    course_code,
    teacher_name,
    teacher_no,
    faculty_code,
    major_code,
    column1,
    column2,
    create_time,
    update_time
) VALUES (
    'CI001',
    'CS101',
    '计算机科学导论',
    'CI_CS101_202401',
    '张老师',
    'T2024001',
    'CS_DEPT',
    'CS_MAJOR',
    '必修课,4学分',
    '最大人数:60',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询所有开课信息
SELECT * FROM course_info
ORDER BY course_code;

-- 根据开课编码查询
SELECT * FROM course_info
WHERE course_code = 'CI_CS101_202401';

-- 查询某教师的开课
SELECT * FROM course_info
WHERE teacher_no = 'T2024001'
ORDER BY course_name;

-- 查询某课程的开课
SELECT * FROM course_info
WHERE base_course_code = 'CS101'
ORDER BY course_code;
```

### 关联查询示例
```sql
-- 查询开课完整信息
SELECT
    ci.course_code,
    ci.course_name,
    ci.teacher_name,
    bc.name as base_course_name,
    f.faculty_name,
    m.major_name
FROM course_info ci
LEFT JOIN base_course bc ON ci.base_course_code = bc.code
LEFT JOIN faculty_info f ON ci.faculty_code = f.faculty_code
LEFT JOIN major_info m ON ci.major_code = m.major_code
ORDER BY ci.course_code;
```

## 开课管理业务逻辑

### 开课创建
1. **课程关联**：必须关联有效的基础课程
2. **教师分配**：必须指定授课教师，教师需具备相应资质
3. **院系归属**：明确开课的所属院系和专业
4. **编码规范**：开课编码应遵循统一的编码规范

### 开课信息维护
1. **基本信息**：确保课程名称、教师信息准确
2. **关联信息**：院系、专业关联信息需要完整
3. **扩展信息**：利用扩展字段存储学时、学分等额外信息
4. **状态管理**：通过扩展字段管理开课状态

### 数据一致性
1. **课程信息**：开课信息应与基础课程信息保持一致
2. **教师信息**：授课教师信息应与教师表保持一致
3. **院系信息**：开课院系应与课程归属院系保持一致

## 数据同步注意事项

### 教务数据同步
1. **课表信息**：开课信息来源于教务管理系统课表
2. **教师安排**：教师授课安排需要及时同步更新
3. **课程调整**：课程信息变更需要同步反映到开课信息

### 编码管理
1. **唯一性**：确保开课编码在学期内唯一
2. **规范性**：开课编码应遵循统一的编码规范
3. **可读性**：编码设计应便于识别和管理

### 关联完整性
1. **基础课程**：必须关联有效的基础课程记录
2. **教师资质**：授课教师必须存在且有效
3. **院系专业**：开课院系专业信息必须准确

## 扩展字段配置

### column1 配置示例
```
格式：属性1:值1,属性2:值2
示例：课程类型:必修课,学分:4,学时:64,理论学时:48,实践学时:16
```

### column2 配置示例
```
格式：属性1:值1,属性2:值2
示例：最大容量:60,当前人数:45,教室:A101,状态:已确认
```

## 常见开课场景

### 理论课开课
- base_course_code: 基础课程编码
- teacher_no: 授课教师工号
- column1: 必修课,4学分,64学时
- column2: 最大人数:60,教室:A101

### 实验课开课
- base_course_code: 实验课程编码
- teacher_no: 实验指导教师工号
- column1: 实验课,2学分,32学时
- column2: 最大人数:30,实验室:B201

---

**数据来源**：校方教务管理系统（课表模块）
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步