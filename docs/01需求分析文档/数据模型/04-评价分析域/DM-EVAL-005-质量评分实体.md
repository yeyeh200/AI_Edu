# 质量评分实体 (QualityScore)

---

**实体编号：** DM-EVAL-005
**实体名称：** 质量评分实体
**所属域：** 评价分析域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

质量评分实体是AI助评应用教学质量评价的核心事实实体，存储教师教学质量的多维度评分结果。该实体基于多源数据（职教云、教务系统、学生评教等）计算生成，为教学质量分析、排名、改进建议提供量化依据。

## 实体定义

### 表名
- **物理表名：** `fact_quality_score`
- **业务表名：** 教学质量评分表
- **数据类型：** 事实表

### 主要用途
- 存储教学质量评分结果
- 支持多维度质量评价
- 提供历史评分趋势分析
- 支持质量排名和对比

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 评分记录唯一标识ID |

### 关联维度字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| teacher_id | BIGINT | 20 | NOT NULL | 0 | 教师ID |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 教师姓名 |
| teacher_no | VARCHAR | 50 | NOT NULL | '' | 教师工号 |
| course_id | BIGINT | 20 | NULL | NULL | 课程ID |
| course_name | VARCHAR | 200 | NULL | NULL | 课程名称 |
| course_code | VARCHAR | 50 | NULL | NULL | 课程编号 |
| class_id | BIGINT | 20 | NULL | NULL | 班级ID |
| class_name | VARCHAR | 200 | NULL | NULL | 班级名称 |
| faculty_id | BIGINT | 20 | NOT NULL | 0 | 院系ID |
| faculty_name | VARCHAR | 200 | NOT NULL | '' | 院系名称 |
| major_id | BIGINT | 20 | NULL | NULL | 专业ID |
| major_name | VARCHAR | 200 | NULL | NULL | 专业名称 |

### 评价周期字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| evaluation_period | ENUM | - | NOT NULL | 'MONTHLY' | 评价周期 |
| academic_year | VARCHAR | 10 | NOT NULL | '' | 学年（如：2023-2024） |
| semester | ENUM | - | NOT NULL | 'FIRST' | 学期 |
| start_date | DATE | - | NOT NULL | CURRENT_DATE | 统计开始日期 |
| end_date | DATE | - | NOT NULL | CURRENT_DATE | 统计结束日期 |
| evaluation_date | DATE | - | NOT NULL | CURRENT_DATE | 评价计算日期 |

### 多维度评分字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| activity_score | DECIMAL | 5,2 | NULL | 0.00 | 教学活跃度评分（0-100） |
| participation_score | DECIMAL | 5,2 | NULL | 0.00 | 学生参与度评分（0-100） |
| effectiveness_score | DECIMAL | 5,2 | NULL | 0.00 | 教学效果评分（0-100） |
| innovation_score | DECIMAL | 5,2 | NULL | 0.00 | 教学创新评分（0-100） |
| total_score | DECIMAL | 5,2 | NOT NULL | 0.00 | 综合评分（0-100） |

### 排名和对比字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| rank_in_class | INT | 11 | NULL | NULL | 班级内排名 |
| total_in_class | INT | 11 | NULL | NULL | 班级总人数 |
| rank_in_major | INT | 11 | NULL | NULL | 专业内排名 |
| total_in_major | INT | 11 | NULL | NULL | 专业总人数 |
| rank_in_faculty | INT | 11 | NULL | NULL | 院系内排名 |
| total_in_faculty | INT | 11 | NULL | NULL | 院系总人数 |
| rank_in_school | INT | 11 | NULL | NULL | 全校排名 |
| total_in_school | INT | 11 | NULL | NULL | 全校总人数 |

### 统计指标字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_classes | INT | 11 | NULL | 0 | 总课时数 |
| attendance_rate | DECIMAL | 5,2 | NULL | 0.00 | 平均出勤率 |
| assignment_rate | DECIMAL | 5,2 | NULL | 0.00 | 作业提交率 |
| interaction_count | INT | 11 | NULL | 0 | 师生互动次数 |
| resource_count | INT | 11 | NULL | 0 | 资源发布数量 |
| evaluation_count | INT | 11 | NULL | 0 | 评价数据数量 |
| student_satisfaction | DECIMAL | 5,2 | NULL | 0.00 | 学生满意度 |

### 趋势分析字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| last_period_score | DECIMAL | 5,2 | NULL | NULL | 上一周期评分 |
| score_change | DECIMAL | 5,2 | NULL | 0.00 | 评分变化值 |
| score_change_rate | DECIMAL | 5,2 | NULL | 0.00 | 评分变化率 |
| trend_direction | ENUM | - | NULL | 'STABLE' | 趋势方向 |

### 质量等级字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| quality_level | ENUM | - | NOT NULL | 'C' | 质量等级 |
| performance_level | ENUM | - | NOT NULL | 'AVERAGE' | 表现水平 |
| is_excellent | TINYINT | 1 | NOT NULL | 0 | 是否优秀 |
| is_need_improvement | TINYINT | 1 | NOT NULL | 0 | 是否需要改进 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| calculated_by | BIGINT | 20 | NULL | NULL | 计算人/系统ID |
| calculation_method | ENUM | - | NOT NULL | 'AUTO' | 计算方式 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_evaluation_period (
    teacher_id, course_id, evaluation_period,
    academic_year, semester, start_date, end_date
)
```

### 普通索引
```sql
INDEX idx_teacher_id (teacher_id)
INDEX idx_course_id (course_id)
INDEX idx_faculty_id (faculty_id)
INDEX idx_evaluation_period (evaluation_period)
INDEX idx_academic_year (academic_year)
INDEX idx_total_score (total_score)
INDEX idx_quality_level (quality_level)
INDEX idx_evaluation_date (evaluation_date)
INDEX idx_create_time (create_time)
```

### 检查约束
```sql
CHECK (evaluation_period IN ('WEEKLY', 'MONTHLY', 'SEMESTER', 'YEARLY'))
CHECK (semester IN ('FIRST', 'SECOND', 'SUMMER'))
CHECK (activity_score BETWEEN 0 AND 100)
CHECK (participation_score BETWEEN 0 AND 100)
CHECK (effectiveness_score BETWEEN 0 AND 100)
CHECK (innovation_score BETWEEN 0 AND 100)
CHECK (total_score BETWEEN 0 AND 100)
CHECK (attendance_rate BETWEEN 0 AND 100)
CHECK (assignment_rate BETWEEN 0 AND 100)
CHECK (student_satisfaction BETWEEN 0 AND 100)
CHECK (trend_direction IN ('UP', 'DOWN', 'STABLE'))
CHECK (quality_level IN ('A', 'B', 'C', 'D'))
CHECK (performance_level IN ('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR'))
CHECK (is_excellent IN (0, 1))
CHECK (is_need_improvement IN (0, 1))
CHECK (calculation_method IN ('AUTO', 'MANUAL', 'HYBRID'))
```

## 枚举值定义

### 评价周期 (evaluation_period)
| 值 | 说明 | 备注 |
|----|------|------|
| WEEKLY | 周评价 | 每周计算一次 |
| MONTHLY | 月评价 | 每月计算一次 |
| SEMESTER | 学期评价 | 每学期计算一次 |
| YEARLY | 年评价 | 每学年计算一次 |

### 学期 (semester)
| 值 | 说明 | 备注 |
|----|------|------|
| FIRST | 第一学期 | 秋季学期 |
| SECOND | 第二学期 | 春季学期 |
| SUMMER | 夏季学期 | 夏季学期 |

### 趋势方向 (trend_direction)
| 值 | 说明 | 判断条件 |
|----|------|----------|
| UP | 上升 | 评分增长 > 2% |
| DOWN | 下降 | 评分下降 > 2% |
| STABLE | 稳定 | 变化在 ±2% 以内 |

### 质量等级 (quality_level)
| 值 | 说明 | 评分范围 |
|----|------|----------|
| A | 优秀 | 90-100分 |
| B | 良好 | 80-89分 |
| C | 合格 | 60-79分 |
| D | 不合格 | 0-59分 |

### 表现水平 (performance_level)
| 值 | 说明 | 排名范围 |
|----|------|----------|
| EXCELLENT | 优秀 | 前10% |
| GOOD | 良好 | 10%-30% |
| AVERAGE | 平均 | 30%-70% |
| POOR | 较差 | 后30% |

### 计算方式 (calculation_method)
| 值 | 说明 | 备注 |
|----|------|------|
| AUTO | 自动计算 | 系统自动计算 |
| MANUAL | 手动计算 | 手动录入 |
| HYBRID | 混合计算 | 系统计算+人工调整 |

## 评分计算规则

### 权重配置
```json
{
  "weights": {
    "activity_score": 0.25,      // 教学活跃度 25%
    "participation_score": 0.30,  // 学生参与度 30%
    "effectiveness_score": 0.35,  // 教学效果 35%
    "innovation_score": 0.10      // 教学创新 10%
  }
}
```

### 综合评分计算公式
```
total_score = activity_score * 0.25
            + participation_score * 0.30
            + effectiveness_score * 0.35
            + innovation_score * 0.10
```

### 各维度评分规则

#### 1. 教学活跃度评分 (activity_score)
- **出勤率** (20%): (实际出勤人数 / 应到人数) * 100
- **资源发布** (30%): min(资源发布数量 / 目标数量 * 100, 100)
- **作业布置** (30%): min(作业布置数量 / 目标数量 * 100, 100)
- **互动频率** (20%): min(师生互动次数 / 目标次数 * 100, 100)

#### 2. 学生参与度评分 (participation_score)
- **课堂参与** (25%): 参与课堂互动的学生比例
- **作业完成** (35%): 按时完成作业的学生比例
- **在线学习** (20%): 平均在线学习时长达标率
- **讨论活跃** (20%): 学生主动发起讨论的频率

#### 3. 教学效果评分 (effectiveness_score)
- **成绩提升** (30%): 学生成绩提升幅度
- **学生满意度** (40%): 学生评教满意度
- **知识掌握** (20%): 考试成绩合格率
- **能力培养** (10%): 能力评估提升幅度

#### 4. 教学创新评分 (innovation_score)
- **方法创新** (30%): 新教学方法使用情况
- **资源创新** (25%): 教学资源质量和多样性
- **模式改革** (25%): 教学模式改革程度
- **技术应用** (20%): 信息技术应用效果

## 使用示例

### 查询示例

#### 1. 查询教师教学质量评分趋势
```sql
SELECT
    teacher_name,
    academic_year,
    semester,
    evaluation_period,
    total_score,
    quality_level,
    rank_in_faculty,
    total_in_faculty,
    LAG(total_score) OVER (PARTITION BY teacher_id ORDER BY academic_year, semester) as prev_score
FROM fact_quality_score
WHERE teacher_id = 12345
  AND evaluation_period = 'SEMESTER'
ORDER BY academic_year, semester;
```

#### 2. 查询院系教学质量统计
```sql
SELECT
    faculty_name,
    academic_year,
    semester,
    COUNT(*) as teacher_count,
    AVG(total_score) as avg_score,
    MAX(total_score) as max_score,
    MIN(total_score) as min_score,
    COUNT(CASE WHEN quality_level = 'A' THEN 1 END) as excellent_count,
    COUNT(CASE WHEN quality_level = 'D' THEN 1 END) as poor_count
FROM fact_quality_score
WHERE faculty_id = 1001
  AND evaluation_period = 'SEMESTER'
  AND academic_year = '2023-2024'
GROUP BY faculty_name, academic_year, semester;
```

#### 3. 查询教学质量排名
```sql
SELECT
    teacher_name,
    course_name,
    total_score,
    quality_level,
    rank_in_faculty,
    total_in_faculty,
    CASE
        WHEN rank_in_faculty <= total_in_faculty * 0.1 THEN 'TOP_10%'
        WHEN rank_in_faculty <= total_in_faculty * 0.3 THEN 'TOP_30%'
        WHEN rank_in_faculty <= total_in_faculty * 0.7 THEN 'AVERAGE'
        ELSE 'BOTTOM_30%'
    END as performance_tier
FROM fact_quality_score
WHERE faculty_id = 1001
  AND academic_year = '2023-2024'
  AND semester = 'FIRST'
  AND evaluation_period = 'SEMESTER'
ORDER BY total_score DESC;
```

#### 4. 查询需要改进的教师
```sql
SELECT
    teacher_name,
    faculty_name,
    course_name,
    total_score,
    quality_level,
    activity_score,
    participation_score,
    effectiveness_score,
    innovation_score,
    score_change,
    trend_direction
FROM fact_quality_score
WHERE is_need_improvement = 1
  AND academic_year = '2023-2024'
  AND semester = 'FIRST'
  AND evaluation_period = 'SEMESTER'
ORDER BY total_score ASC;
```

### 插入示例

#### 1. 生成月度质量评分
```sql
INSERT INTO fact_quality_score (
    teacher_id, teacher_name, teacher_no,
    course_id, course_name, course_code,
    faculty_id, faculty_name,
    evaluation_period, academic_year, semester,
    start_date, end_date,
    activity_score, participation_score,
    effectiveness_score, innovation_score, total_score,
    quality_level, performance_level,
    calculation_method, calculated_by
) VALUES (
    12345, '张老师', 'T20230001',
    1001, '数据结构与算法', 'CS2023001',
    1001, '计算机学院',
    'MONTHLY', '2023-2024', 'FIRST',
    '2023-10-01', '2023-10-31',
    85.5, 78.2, 82.1, 76.8, 81.4,
    'B', 'GOOD',
    'AUTO', 0
);
```

### 更新示例

#### 1. 更新排名信息
```sql
UPDATE fact_quality_score fqs1
SET rank_in_faculty = (
    SELECT COUNT(*) + 1
    FROM fact_quality_score fqs2
    WHERE fqs2.faculty_id = fqs1.faculty_id
      AND fqs2.academic_year = fqs1.academic_year
      AND fqs2.semester = fqs1.semester
      AND fqs2.evaluation_period = fqs1.evaluation_period
      AND fqs2.total_score > fqs1.total_score
),
total_in_faculty = (
    SELECT COUNT(*)
    FROM fact_quality_score fqs3
    WHERE fqs3.faculty_id = fqs1.faculty_id
      AND fqs3.academic_year = fqs1.academic_year
      AND fqs3.semester = fqs1.semester
      AND fqs3.evaluation_period = fqs1.evaluation_period
),
update_time = NOW()
WHERE faculty_id = 1001
  AND academic_year = '2023-2024'
  AND semester = 'FIRST'
  AND evaluation_period = 'SEMESTER';
```

## 数据质量

### 质量检查规则
1. **完整性检查**：教师ID、评分周期等关键字段不能为空
2. **范围检查**：评分值必须在0-100范围内
3. **逻辑检查**：综合评分必须等于各维度加权得分
4. **一致性检查**：同一教师同周期不应有重复记录

### 数据清洗规则
1. **异常值处理**：识别并处理异常的评分数据
2. **缺失值处理**：对缺失的维度评分进行插值或默认值处理
3. **重复数据处理**：删除重复的评分记录
4. **数据标准化**：统一评分计算标准和口径

## 性能优化

### 索引优化
- 复合索引支持常用查询组合
- 评分字段建立索引支持排序查询
- 时间字段建立索引支持时间范围查询

### 分区策略
- 按学年进行表分区
- 按院系进行子分区
- 提高大数据量查询性能

### 查询优化
- 使用覆盖索引减少回表
- 合理使用分页查询
- 避免全表扫描

## 业务规则

### 评分计算规则
1. 每日凌晨自动计算前一天的评分数据
2. 每月1日计算上月评分数据
3. 每学期结束后计算学期评分数据
4. 评分数据需要经过人工审核确认

### 排名更新规则
1. 评分计算完成后自动更新排名
2. 排名按院系、专业、班级分别计算
3. 同分情况下按教师工号排序
4. 排名数据支持历史查询

### 质量等级规则
1. 90分以上为A级（优秀）
2. 80-89分为B级（良好）
3. 60-79分为C级（合格）
4. 60分以下为D级（不合格）

## 扩展说明

### 未来扩展方向
1. **评价维度扩展**：增加更多评价维度和指标
2. **对比分析**：增加跨学期、跨院系对比分析
3. **预测分析**：基于历史数据预测教学质量趋势
4. **个性化权重**：支持不同课程类型的权重配置

### 兼容性说明
- 支持多种评价标准和指标体系
- 支持与其他教学质量评价系统数据对接
- 支持国家教学质量评估标准

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*