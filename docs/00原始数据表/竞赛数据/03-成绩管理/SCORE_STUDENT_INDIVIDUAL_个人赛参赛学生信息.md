# SCORE_STUDENT_INDIVIDUAL 个人赛参赛学生信息表

## 基本信息

- **表名**：`SCORE_STUDENT_INDIVIDUAL`（原表名：`t_approve_data_6586_118185_1729113909047_end_17`）
- **中文名称**：个人赛参赛学生信息（子表单）
- **用途**：存储校级个人赛参赛学生的详细信息，包括学生基本信息、成绩、获奖等级等
- **字段数量**：11个
- **数据类别**：竞赛系统 - 成绩管理模块

## 字段定义

| 字段名 | 原字段名 | 数据类型 | 长度 | 是否为空 | 主键 | 默认值 | 备注 |
|--------|----------|----------|------|----------|------|--------|------|
| id | id | bigint | 20 | NO | YES | - | 自增ID，主键 |
| form_id | formUserId | bigint | 20 | NO | YES | - | 表单数据ID，关联主表 |
| form_data_id | formId | bigint | 20 | YES | NO | - | 表单ID |
| student_name | 18 | varchar | 1048576 | YES | NO | - | 姓名 |
| student_number | 19 | varchar | 1048576 | YES | NO | - | 学号 |
| college | 20 | varchar | 1048576 | YES | NO | - | 所属学院 |
| class_name | 21 | varchar | 1048576 | YES | NO | - | 班级 |
| preliminary_score | 24 | varchar | 1048576 | YES | NO | - | 初赛成绩 |
| final_score | 23 | varchar | 1048576 | YES | NO | - | 决赛成绩 |
| award_level | 22 | varchar | 1048576 | YES | NO | - | 获奖等级 |

## 字段详细说明

### 主键字段
- **id**：自增ID，子表记录的唯一标识符，主键

### 关联字段
- **form_id**：表单数据ID，关联个人赛成绩录入主表的formUserId
- **form_data_id**：表单ID，系统内部表单标识

### 学生基本信息字段
- **student_name**：姓名，参赛学生的真实姓名
- **student_number**：学号，参赛学生的学号
- **college**：所属学院，学生所在的学院
- **class_name**：班级，学生所在的班级

### 成绩信息字段
- **preliminary_score**：初赛成绩，学生在初赛阶段获得的成绩
- **final_score**：决赛成绩，学生在决赛阶段获得的成绩
- **award_level**：获奖等级，根据成绩评定的获奖等级

## 关联关系说明

### 与主表的关系
- **关联字段**：`form_id` 字段与主表 `SCORE_INDIVIDUAL_SCHOOL` 的 `id` 字段关联
- **关系类型**：一对多关系，一个主表记录可以对应多个子表记录
- **关联作用**：通过主表关联查询竞赛基本信息，通过子表查询学生详细信息

### 学生信息关联
- **学生信息表**：通过 `student_number` 可以关联学生基本信息表
- **学院信息表**：通过 `college` 可以关联学院详细信息
- **班级信息表**：通过 `class_name` 可以关联班级详细信息

## 成绩数据说明

### 成绩类型
1. **初赛成绩**：
   - 初赛阶段的原始成绩
   - 用于筛选进入决赛的参赛者
   - 可能包含笔试、面试等环节成绩

2. **决赛成绩**：
   - 决赛阶段的最终成绩
   - 用于最终排名和获奖等级评定
   - 可能包含实操、答辩等环节成绩

### 成绩格式
- **数值型**：直接记录分数（如：85.5）
- **等级型**：记录等级或评价（如：优秀）
- **文本型**：记录评价描述（如：表现突出）

## 获奖等级说明

### 等级分类
- **一等奖**：成绩最优秀的参赛者，通常按比例确定
- **二等奖**：成绩优秀的参赛者，通常按比例确定
- **三等奖**：成绩良好的参赛者，通常按比例确定
- **优秀奖**：表现突出但未进入等级奖的参赛者
- **参与奖**：完成竞赛但未获奖的参赛者
- **无奖项**：未完成竞赛或表现不佳的参赛者

### 等级评定标准
1. **比例分配**：按参赛人数比例分配获奖名额
2. **分数线**：根据成绩分数线确定获奖等级
3. **综合评定**：综合考虑多个环节的表现
4. **评委评定**：由评委组综合评定决定

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`form_id` 应引用主表的有效记录
3. **非空约束**：`form_id`, `student_name`, `student_number` 字段必须非空
4. **唯一约束**：同一 `form_id` 下，`student_number` 应保持唯一
5. **检查约束**：成绩值应在合理范围内

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **关联索引**：`form_id` - 用于关联主表查询
- **学号索引**：`student_number` - 用于按学号查询
- **学院索引**：`college` - 用于按学院统计
- **班级索引**：`class_name` - 用于按班级统计
- **成绩索引**：`final_score` - 用于按成绩排序
- **等级索引**：`award_level` - 用于按获奖等级统计

## 数据关联关系

### 主要外键关联
- **个人赛成绩录入主表**：通过 `form_id` 关联主表记录
- **学生信息表**：通过 `student_number` 关联学生基本信息
- **学院信息表**：通过 `college` 关联学院详细信息
- **班级信息表**：通过 `class_name` 关联班级详细信息

### 业务关联
- **竞赛申报表**：关联竞赛申报参赛信息
- **报名审核表**：关联竞赛报名审核信息
- **证书管理表**：关联竞赛证书信息
- **材料管理表**：关联竞赛佐证材料

## 使用示例

### SQL查询示例

```sql
-- 查询某竞赛的所有参赛学生信息
SELECT student_name, student_number, college, class_name,
       preliminary_score, final_score, award_level
FROM SCORE_STUDENT_INDIVIDUAL
WHERE form_id = (SELECT id FROM SCORE_INDIVIDUAL_SCHOOL
                  WHERE competition_name = '校级数学建模竞赛'
                    AND academic_year = '2024')
ORDER BY CAST(final_score AS DECIMAL) DESC;

-- 查询某学院的学生获奖情况
SELECT student_name, student_number, class_name, award_level,
       final_score
FROM SCORE_STUDENT_INDIVIDUAL
WHERE form_id IN (SELECT id FROM SCORE_INDIVIDUAL_SCHOOL
                  WHERE college = '计算机学院'
                    AND academic_year = '2024'
                    AND approval_status = '审核通过')
  AND award_level IS NOT NULL
ORDER BY award_level, student_name;

-- 统计获奖等级分布
SELECT
    award_level,
    COUNT(*) as student_count,
    COUNT(CASE WHEN college = '计算机学院' THEN 1 END) as cs_count,
    COUNT(CASE WHEN college = '电子信息学院' THEN 1 END) as ee_count
FROM SCORE_STUDENT_INDIVIDUAL
WHERE form_id IN (SELECT id FROM SCORE_INDIVIDUAL_SCHOOL
                  WHERE academic_year = '2024'
                    AND approval_status = '审核通过')
  AND award_level IS NOT NULL AND award_level != ''
GROUP BY award_level
ORDER BY award_level;

-- 查询成绩前10名学生
SELECT student_name, student_number, college, class_name,
       final_score, award_level
FROM SCORE_STUDENT_INDIVIDUAL
WHERE form_id IN (SELECT id FROM SCORE_INDIVIDUAL_SCHOOL
                  WHERE competition_name = '校级编程竞赛'
                    AND academic_year = '2024'
                    AND approval_status = '审核通过')
ORDER BY CAST(final_score AS DECIMAL) DESC
LIMIT 10;

-- 查询无获奖记录的学生
SELECT student_name, student_number, college, class_name,
       final_score
FROM SCORE_STUDENT_INDIVIDUAL
WHERE form_id IN (SELECT id FROM SCORE_INDIVIDUAL_SCHOOL
                  WHERE academic_year = '2024'
                    AND approval_status = '审核通过')
  AND (award_level IS NULL OR award_level = '' OR award_level = '无奖项')
ORDER BY student_name;
```

### 关联查询示例（主表+子表）
```sql
-- 查询某竞赛的完整信息
SELECT
    main.competition_name,
    main.academic_year,
    main.approval_status,
    student.student_name,
    student.student_number,
    student.college,
    student.preliminary_score,
    student.final_score,
    student.award_level
FROM SCORE_INDIVIDUAL_SCHOOL main
JOIN SCORE_STUDENT_INDIVIDUAL student ON main.id = student.form_id
WHERE main.competition_name = '校级数学建模竞赛'
  AND main.academic_year = '2024'
  AND main.approval_status = '审核通过'
ORDER BY student.final_score DESC;
```

### 数据插入示例

```sql
INSERT INTO SCORE_STUDENT_INDIVIDUAL (
    form_id, form_data_id, student_name, student_number,
    college, class_name, preliminary_score, final_score, award_level
) VALUES (
    1001, 5001, '张三', '202401001',
    '计算机学院', '计科2024级1班', '85.5', '92.0', '一等奖'
);
```

### 数据更新示例

```sql
-- 更新学生获奖等级
UPDATE SCORE_STUDENT_INDIVIDUAL
SET award_level = '二等奖'
WHERE form_id = 1001 AND student_number = '202401001';

-- 批量更新获奖等级
UPDATE SCORE_STUDENT_INDIVIDUAL
SET award_level = CASE
    WHEN CAST(final_score AS DECIMAL) >= 90 THEN '一等奖'
    WHEN CAST(final_score AS DECIMAL) >= 80 THEN '二等奖'
    WHEN CAST(final_score AS DECIMAL) >= 70 THEN '三等奖'
    ELSE '优秀奖'
END
WHERE form_id = 1001
  AND final_score IS NOT NULL;
```

## 业务逻辑说明

### 成绩录入原则
1. **准确性原则**：确保成绩录入的准确无误
2. **完整性原则**：确保所有参赛学生都有成绩记录
3. **及时性原则**：及时完成成绩录入工作
4. **规范性原则**：按照统一标准录入成绩

### 等级评定规则
1. **比例控制**：按照预设比例控制各等级名额
2. **分数线**：设定各级别的最低分数线
3. **综合评定**：综合考虑初赛和决赛成绩
4. **评委决定**：由评委组最终确定获奖等级

### 数据一致性
1. **与报名信息一致**：确保学生信息与报名信息一致
2. **成绩逻辑一致**：确保成绩录入符合竞赛规则
3. **等级评定一致**：确保等级评定标准统一
4. **数据完整性**：确保数据录入完整无遗漏

## 数据维护建议

### 定期维护
1. **成绩更新**：及时更新学生成绩信息
2. **等级调整**：根据实际情况调整获奖等级
3. **数据核对**：定期核对成绩数据的准确性
4. **数据备份**：定期备份成绩数据

### 异常处理
1. **成绩错误**：处理成绩录入错误情况
2. **等级争议**：处理获奖等级争议
3. **重复记录**：检查并处理重复成绩记录
4. **缺失数据**：补充缺失的成绩信息

### 质量保证
1. **录入培训**：对成绩录入人员进行培训
2. **审核机制**：建立多级审核机制
3. **标准制定**：制定统一的录入和审核标准
4. **监督检查**：建立监督检查机制

---

**数据来源**：竞赛管理系统
**维护单位**：教务处、各院系
**更新频率**：成绩录入时实时更新，审核结束后定期维护