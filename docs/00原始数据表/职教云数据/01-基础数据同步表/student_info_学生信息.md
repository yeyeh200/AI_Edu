# student_info 学生信息表

## 基本信息

- **表名**：`student_info`
- **中文名称**：学生信息
- **用途**：存储学生详细信息，包括学号、班级、专业、联系方式、学籍状态等，用于基础数据同步
- **字段数量**：19个
- **数据类别**：基础数据同步表

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键id |
| user_name | varchar | 100 | NO | - | 用户名 |
| student_name | varchar | 100 | NO | - | 姓名 |
| school_number | varchar | 100 | NO | - | 学号 |
| sex | varchar | 10 | YES | - | 性别 |
| email | varchar | 100 | YES | - | 邮箱 |
| phone_number | varchar | 50 | YES | - | 手机号 |
| faculty_code | varchar | 50 | YES | - | 院系编码 |
| faculty_name | varchar | 200 | YES | - | 院系名称 |
| major_code | varchar | 50 | YES | - | 专业编码 |
| majoe_name | varchar | 100 | YES | - | 专业名称 |
| grade_code | varchar | 50 | YES | - | 年级编码 |
| grade_name | varchar | 50 | YES | - | 年级名称 |
| classes_code | varchar | 50 | YES | - | 行政班编码 |
| classes_name | varchar | 100 | YES | - | 行政班名称 |
| status | varchar | 10 | YES | - | 学籍状态 |
| student_type | varchar | 20 | YES | - | 学生类型 |
| remark | mediumtext | - | YES | - | 备注 |
| is_valid | int | - | YES | - | 是否在用：1=是，0=否 |
| del_flag | varchar | 255 | YES | - | 删除状态：0=正常，2=删除 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_time | datetime | - | YES | - | 修改时间 |

## 字段详细说明

### 主键字段
- **id**：学生唯一标识符，主键，varchar类型，最大长度50字符

### 基本信息字段
- **user_name**：系统用户名，用于登录和系统识别，必填
- **student_name**：学生真实姓名，必填
- **school_number**：学生学号，学校内部唯一标识，必填
- **sex**：性别，如"男"、"女"或其他标识

### 联系方式字段
- **email**：电子邮箱地址
- **phone_number**：手机号码，用于联系和验证

### 院系专业关联字段
- **faculty_code**：所属院系编码，关联院系信息表
- **faculty_name**：所属院系名称，冗余存储便于查询
- **major_code**：所属专业编码，关联专业信息表
- **majoe_name**：所属专业名称，冗余存储便于查询

### 班级年级关联字段
- **grade_code**：所属年级编码，关联年级信息表
- **grade_name**：所属年级名称，冗余存储便于查询
- **classes_code**：所属行政班编码，关联班级信息表
- **classes_name**：所属行政班名称，冗余存储便于查询

### 学籍信息字段
- **status**：学籍状态（1:在籍，2:毕业，3:休学，4:退学）
- **student_type**：学生类型（1:应届普通高中毕业生，2:应届中职毕业生，3:退役军人，4:下岗职工，5:农民工，6:新型职业农民，7:其他）

### 状态和备注字段
- **is_valid**：学生状态标识，1表示正常在籍，0表示其他状态
- **del_flag**：逻辑删除标记，0表示正常状态，2表示已删除
- **remark**：学生相关备注信息，可存储特殊说明或附加信息

### 时间戳字段
- **create_time**：记录创建时间，用于数据追踪
- **update_time**：记录最后修改时间，用于数据版本控制

## 学籍状态说明

| status值 | 状态说明 | 权限说明 |
|----------|----------|----------|
| 1 | 在籍 | 正常学习，拥有完整系统权限 |
| 2 | 毕业 | 只读权限，查看历史学习记录 |
| 3 | 休学 | 限制权限，暂停学习活动 |
| 4 | 退学 | 禁用权限，终止学习活动 |

## 学生类型说明

| student_type值 | 类型说明 |
|----------------|----------|
| 1 | 应届普通高中毕业生 |
| 2 | 应届中职毕业生 |
| 3 | 退役军人 |
| 4 | 下岗职工 |
| 5 | 农民工 |
| 6 | 新型职业农民 |
| 7 | 其他 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **唯一约束**：`user_name` 和 `school_number` 应保持唯一性
3. **非空约束**：`user_name`、`student_name`、`school_number` 为必填字段
4. **检查约束**：`is_valid` 只能是 0 或 1
5. **检查约束**：`del_flag` 只能是 0 或 2
6. **检查约束**：`status` 只能是 1、2、3、4
7. **检查约束**：`student_type` 只能是 1-7
8. **外键约束**：`faculty_code` 应引用院系表中的有效记录
9. **外键约束**：`major_code` 应引用专业表中的有效记录
10. **外键约束**：`grade_code` 应引用年级表中的有效记录
11. **外键约束**：`classes_code` 应引用班级表中的有效记录

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **业务索引**：`user_name` - 建议创建唯一索引，确保用户名唯一性
- **业务索引**：`school_number` - 建议创建唯一索引，确保学号唯一性
- **关联索引**：`faculty_code` - 外键索引，用于关联查询院系信息
- **关联索引**：`major_code` - 外键索引，用于关联查询专业信息
- **关联索引**：`grade_code` - 外键索引，用于关联查询年级信息
- **关联索引**：`classes_code` - 外键索引，用于关联查询班级信息
- **状态索引**：`is_valid, del_flag, status` - 复合索引，用于快速查询有效学生

## 数据关联关系

### 外键关联
- **faculty_info**：通过 `faculty_code` 字段关联院系信息表
- **major_info**：通过 `major_code` 字段关联专业信息表
- **base_grade_info**：通过 `grade_code` 字段关联年级信息表
- **class_info**：通过 `classes_code` 字段关联班级信息表

### 在其他表中的引用
- **course_info_student**：开课学生表
- **course_info_class**：课程开课班级学生表
- **t_zjy_course_info_student**：开课学生表（教学过程）

## 使用示例

### SQL插入示例
```sql
INSERT INTO student_info (
    id,
    user_name,
    student_name,
    school_number,
    sex,
    email,
    phone_number,
    faculty_code,
    faculty_name,
    major_code,
    majoe_name,
    grade_code,
    grade_name,
    classes_code,
    classes_name,
    status,
    student_type,
    remark,
    is_valid,
    del_flag,
    create_time,
    update_time
) VALUES (
    'STU001',
    'zhang_san',
    '张三',
    '202401001',
    '男',
    'zhangsan@student.edu.cn',
    '13900139000',
    'CS_DEPT',
    '计算机科学与技术学院',
    'CS_MAJOR',
    '计算机科学与技术',
    '2024',
    '2024级',
    'CS202401',
    '计算机科学与技术2024级1班',
    '1',
    '1',
    '优秀学生',
    1,
    '0',
    '2024-01-01 10:00:00',
    '2024-01-01 10:00:00'
);
```

### 查询示例
```sql
-- 查询所有在籍学生
SELECT * FROM student_info
WHERE status = '1'
  AND is_valid = 1
  AND del_flag = '0'
ORDER BY school_number;

-- 根据学号查询学生
SELECT * FROM student_info
WHERE school_number = '202401001';

-- 查询某班级学生
SELECT * FROM student_info
WHERE classes_code = 'CS202401'
  AND is_valid = 1
  AND del_flag = '0';

-- 查询某专业某年级学生
SELECT * FROM student_info
WHERE major_code = 'CS_MAJOR'
  AND grade_code = '2024'
  AND status = '1'
  AND is_valid = 1
  AND del_flag = '0';
```

### 关联查询示例
```sql
-- 查询学生完整信息
SELECT
    s.student_name,
    s.school_number,
    s.email,
    s.phone_number,
    f.faculty_name,
    m.major_name,
    g.grade_name,
    c.classes_name
FROM student_info s
LEFT JOIN faculty_info f ON s.faculty_code = f.faculty_code
LEFT JOIN major_info m ON s.major_code = m.major_code
LEFT JOIN base_grade_info g ON s.grade_code = g.grade_code
LEFT JOIN class_info c ON s.classes_code = c.classes_code
WHERE s.status = '1'
  AND s.is_valid = 1
  AND s.del_flag = '0';
```

## 数据同步注意事项

### 学籍管理
1. **学号唯一性**：确保 `school_number` 在全校范围内唯一
2. **学籍状态同步**：学生入学、毕业、休学、退学状态需要及时同步
3. **班级变动**：学生转班、调专业等变动需要及时更新

### 关联数据一致性
1. **编码一致性**：院系、专业、年级、班级编码必须与对应表保持一致
2. **名称同步**：冗余存储的名称字段应与主表保持同步
3. **级联更新**：当关联信息变更时，需要同步更新学生信息

### 学生类型管理
1. **类型准确性**：根据招生信息正确设置 `student_type`
2. **政策适配**：不同类型学生可能有不同的学习政策和要求
3. **统计分析**：学生类型信息用于教学管理和统计分析

### 数据安全和隐私
1. **个人信息保护**：学生联系方式属于敏感信息，需要妥善保护
2. **访问控制**：严格控制学生信息的访问权限
3. **数据脱敏**：在统计分析时应对敏感信息进行脱敏处理

## 常见数据场景

### 新生入学
- `status` = '1'（在籍）
- `student_type` 根据生源地设置
- 关联班级、专业、年级信息

### 学生毕业
- `status` 从 '1' 更新为 '2'（毕业）
- 保持历史数据完整性
- 调整系统访问权限

### 学籍异动
- 休学：`status` = '3'
- 退学：`status` = '4'
- 复学：`status` = '1'

---

**数据来源**：校方学籍管理系统
**同步方向**：校方系统 → 中间数据库 → 职教云平台
**更新频率**：实时同步或定时批量同步