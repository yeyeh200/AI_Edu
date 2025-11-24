# 用户详细档案实体 (UserProfile)

---

**实体编号：** DM-USER-002
**实体名称：** 用户详细档案实体
**所属域：** 用户管理域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

用户详细档案实体是AI助评应用用户管理的扩展实体，存储用户的详细档案信息、资质认证、工作经历等补充信息。该实体为教师专业发展评估、学生综合素质分析、人才画像等业务提供数据支撑。

## 实体定义

### 表名
- **物理表名：** `dim_user_profile`
- **业务表名：** 用户详细档案表
- **数据类型：** 维度表

### 主要用途
- 存储用户详细档案信息
- 支持教师资质管理
- 提供学生综合素质数据
- 支持用户画像分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 档案记录唯一标识ID |
| user_id | BIGINT | 20 | NOT NULL | 0 | 关联用户ID |

### 基本档案信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| avatar_url | VARCHAR | 500 | NULL | NULL | 头像照片URL |
| avatar_path | VARCHAR | 200 | NULL | NULL | 头像照片存储路径 |
| photo_data | LONGBLOB | - | NULL | NULL | 照片二进制数据（可选） |
| introduction | TEXT | - | NULL | NULL | 个人简介 |
| bio | TEXT | - | NULL | NULL | 个人履历 |
| specialty | VARCHAR | 200 | NULL | NULL | 专业特长 |
| research_interests | TEXT | - | NULL | NULL | 研究兴趣 |
| personal_motto | VARCHAR | 200 | NULL | NULL | 个人座右铭 |

### 教师专用字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| title | VARCHAR | 50 | NULL | NULL | 职称 |
| title_level | ENUM | - | NULL | 'LECTURER' | 职称级别 |
| education_background | ENUM | - | NULL | 'BACHELOR' | 学历 |
| degree | VARCHAR | 100 | NULL | NULL | 学位 |
| graduate_school | VARCHAR | 200 | NULL | NULL | 毕业院校 |
| major_field | VARCHAR | 100 | NULL | NULL | 专业领域 |
| work_experience | TEXT | - | NULL | NULL | 工作经历 |
| teaching_experience_years | INT | 11 | NULL | 0 | 教学年限 |
| research_experience_years | INT | 11 | NULL | 0 | 科研年限 |
| professional_certifications | TEXT | - | NULL | NULL | 专业资格证书（JSON） |

### 学生专用字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| student_category | ENUM | - | NULL | 'REGULAR' | 学生类别 |
| enrollment_type | ENUM | - | NULL | 'NATIONAL' | 招生类型 |
| education_level | ENUM | - | NULL | 'UNDERGRADUATE' | 培养层次 |
| academic_status | ENUM | - | NULL | 'NORMAL' | 学籍状态 |
| scholarship_info | TEXT | - | NULL | NULL | 奖学金信息（JSON） |
| awards_honors | TEXT | - | NULL | NULL | 获奖荣誉（JSON） |
| internship_experience | TEXT | - | NULL | NULL | 实习经历 |
| social_practice | TEXT | - | NULL | NULL | 社会实践 |
| skills_certificates | TEXT | - | NULL | NULL | 技能证书（JSON） |
| career_planning | TEXT | - | NULL | NULL | 职业规划 |

### 联系方式字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| office_address | VARCHAR | 200 | NULL | NULL | 办公地址 |
| office_phone | VARCHAR | 20 | NULL | NULL | 办公电话 |
| personal_website | VARCHAR | 200 | NULL | NULL | 个人网站 |
| blog_url | VARCHAR | 200 | NULL | NULL | 个人博客 |
| social_media | TEXT | - | NULL | NULL | 社交媒体账号（JSON） |
| emergency_contact | VARCHAR | 100 | NULL | NULL | 紧急联系人 |
| emergency_phone | VARCHAR | 20 | NULL | NULL | 紧急联系电话 |

### 隐私设置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| profile_visibility | ENUM | - | NOT NULL | 'PUBLIC' | 档案可见性 |
| contact_visibility | ENUM | - | NOT NULL | 'FRIENDS' | 联系方式可见性 |
| allow_search | TINYINT | 1 | NOT NULL | 1 | 允许搜索 |
| allow_recommendation | TINYINT | 1 | NOT NULL | 1 | 允许推荐 |
| data_usage_consent | TINYINT | 1 | NOT NULL | 1 | 数据使用同意 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| last_active_time | TIMESTAMP | - | NULL | NULL | 最后活跃时间 |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_user_id (user_id)
```

### 外键约束
```sql
FOREIGN KEY (user_id) REFERENCES dim_user(id) ON DELETE CASCADE
```

### 普通索引
```sql
INDEX idx_title (title)
INDEX idx_education_background (education_background)
INDEX idx_academic_status (academic_status)
INDEX idx_profile_visibility (profile_visibility)
INDEX idx_create_time (create_time)
```

### 检查约束
```sql
CHECK (title_level IN ('PROFESSOR', 'ASSOCIATE_PROFESSOR', 'LECTURER', 'ASSISTANT', 'OTHER'))
CHECK (education_background IN ('HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD', 'POST_DOCTOR'))
CHECK (student_category IN ('REGULAR', 'TRANSFER', 'INTERNATIONAL', 'PART_TIME'))
CHECK (enrollment_type IN ('NATIONAL', 'INTERNATIONAL', 'COOPERATIVE', 'SELF_FUNDED'))
CHECK (education_level IN ('UNDERGRADUATE', 'GRADUATE', 'POSTGRADUATE'))
CHECK (academic_status IN ('NORMAL', 'SUSPENDED', 'PROBATION', 'GRADUATED'))
CHECK (profile_visibility IN ('PUBLIC', 'FRIENDS', 'PRIVATE', 'TEAM'))
CHECK (contact_visibility IN ('PUBLIC', 'FRIENDS', 'PRIVATE', 'TEAM'))
CHECK (allow_search IN (0, 1))
CHECK (allow_recommendation IN (0, 1))
CHECK (data_usage_consent IN (0, 1))
```

## 枚举值定义

### 职称级别 (title_level)
| 值 | 说明 | 备注 |
|----|------|------|
| PROFESSOR | 教授 | 教授职称 |
| ASSOCIATE_PROFESSOR | 副教授 | 副教授职称 |
| LECTURER | 讲师 | 讲师职称 |
| ASSISTANT | 助教 | 助教职称 |
| OTHER | 其他 | 其他职称 |

### 学历 (education_background)
| 值 | 说明 | 备注 |
|----|------|------|
| HIGH_SCHOOL | 高中 | 高中学历 |
| BACHELOR | 本科 | 本科学历 |
| MASTER | 硕士 | 硕士学历 |
| PHD | 博士 | 博士学历 |
| POST_DOCTOR | 博士后 | 博士后经历 |

### 学生类别 (student_category)
| 值 | 说明 | 备注 |
|----|------|------|
| REGULAR | 普通生 | 普通全日制学生 |
| TRANSFER | 转学生 | 转入学生 |
| INTERNATIONAL | 国际生 | 国际学生 |
| PART_TIME | 在职生 | 在职学习学生 |

### 招生类型 (enrollment_type)
| 值 | 说明 | 备注 |
|----|------|------|
| NATIONAL | 国家统招 | 国家统招学生 |
| INTERNATIONAL | 国际招生 | 国际招生学生 |
| COOPERATIVE | 合作办学 | 合作办学学生 |
| SELF_FUNDED | 自费生 | 自费学生 |

### 培养层次 (education_level)
| 值 | 说明 | 备注 |
|----|------|------|
| UNDERGRADUATE | 本科生 | 本科教育层次 |
| GRADUATE | 研究生 | 研究生教育层次 |
| POSTGRADUATE | 研究生 | 研究生教育层次（同上） |

### 学籍状态 (academic_status)
| 值 | 说明 | 备注 |
|----|------|------|
| NORMAL | 正常 | 正常学籍状态 |
| SUSPENDED | 休学 | 休学状态 |
| PROBATION | 试读 | 试读状态 |
| GRADUATED | 毕业 | 已毕业状态 |

### 可见性设置
| 值 | 说明 | 范围 |
|----|------|------|
| PUBLIC | 公开 | 所有人可见 |
| FRIENDS | 好友 | 好友可见 |
| PRIVATE | 私密 | 仅自己可见 |
| TEAM | 团队 | 团队成员可见 |

## 关联关系

### 一对一关系
- **UserProfile → User**：一个用户有一个详细档案

### 业务关联
- **UserProfile → EvaluationRecord**：档案信息影响评价结果
- **UserProfile → ImprovementSuggestion**：基于档案生成改进建议

## JSON字段格式示例

### 专业资格证书 (professional_certifications)
```json
[
  {
    "certificate_name": "高级工程师",
    "issuing_organization": "人力资源和社会保障部",
    "issue_date": "2020-06-01",
    "expiry_date": "2025-06-01",
    "certificate_number": "GJ2020001234"
  },
  {
    "certificate_name": "教师资格证",
    "issuing_organization": "教育部",
    "issue_date": "2018-09-01",
    "certificate_number": "JS2018123456"
  }
]
```

### 奖学金信息 (scholarship_info)
```json
[
  {
    "scholarship_name": "国家奖学金",
    "award_year": "2023",
    "amount": "8000",
    "award_level": "national"
  },
  {
    "scholarship_name": "校级一等奖学金",
    "award_year": "2022",
    "amount": "2000",
    "award_level": "school"
  }
]
```

### 技能证书 (skills_certificates)
```json
[
  {
    "skill_name": "计算机二级",
    "certificate_name": "全国计算机等级考试二级证书",
    "issuing_organization": "教育部考试中心",
    "issue_date": "2022-03-01"
  },
  {
    "skill_name": "英语六级",
    "certificate_name": "大学英语六级证书",
    "score": "520",
    "issue_date": "2021-12-01"
  }
]
```

## 使用示例

### 查询示例

#### 1. 查询教师详细信息
```sql
SELECT
    u.user_name,
    u.user_no,
    p.title,
    p.education_background,
    p.graduate_school,
    p.teaching_experience_years,
    p.research_interests
FROM dim_user u
JOIN dim_user_profile p ON u.id = p.user_id
WHERE u.user_type = 'TEACHER'
  AND u.faculty_id = 1001
  AND p.title_level = 'PROFESSOR';
```

#### 2. 查询学生综合素质
```sql
SELECT
    u.user_name,
    u.class_name,
    p.education_level,
    p.academic_status,
    JSON_LENGTH(p.awards_honors) as awards_count,
    JSON_LENGTH(p.skills_certificates) as certificates_count
FROM dim_user u
JOIN dim_user_profile p ON u.id = p.user_id
WHERE u.user_type = 'STUDENT'
  AND u.class_id = 2001
  AND p.academic_status = 'NORMAL';
```

#### 3. 查询档案完善度
```sql
SELECT
    u.user_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN p.avatar_url IS NOT NULL THEN 1 END) as has_avatar,
    COUNT(CASE WHEN p.introduction IS NOT NULL THEN 1 END) as has_introduction,
    COUNT(CASE WHEN p.education_background IS NOT NULL THEN 1 END) as has_education,
    AVG(
        (CASE WHEN p.avatar_url IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN p.introduction IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN p.education_background IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN p.work_experience IS NOT NULL THEN 1 ELSE 0 END)
    ) / 4 * 100 as profile_completion_rate
FROM dim_user u
LEFT JOIN dim_user_profile p ON u.id = p.user_id
GROUP BY u.user_type;
```

### 插入示例

#### 1. 新增教师档案
```sql
INSERT INTO dim_user_profile (
    user_id, title, title_level, education_background, degree,
    graduate_school, major_field, work_experience,
    teaching_experience_years, research_interests,
    introduction, profile_visibility
) VALUES (
    12345,
    '教授',
    'PROFESSOR',
    'PHD',
    '工学博士',
    '清华大学',
    '计算机科学与技术',
    '2010年至今在XX大学任教，主讲数据结构、算法设计等课程',
    13,
    '人工智能、机器学习、大数据分析',
    '从事计算机教学和科研工作13年，发表学术论文20余篇',
    'PUBLIC'
);
```

#### 2. 新增学生档案
```sql
INSERT INTO dim_user_profile (
    user_id, student_category, enrollment_type, education_level,
    academic_status, scholarship_info, awards_honors,
    skills_certificates, career_planning,
    profile_visibility
) VALUES (
    67890,
    'REGULAR',
    'NATIONAL',
    'UNDERGRADUATE',
    'NORMAL',
    '[{"scholarship_name": "校级一等奖学金", "award_year": "2023", "amount": "2000", "award_level": "school"}]',
    '[{"award_name": "全国大学生数学建模竞赛二等奖", "award_year": "2023", "award_level": "national"}]',
    '[{"skill_name": "计算机二级", "certificate_name": "全国计算机等级考试二级证书", "issue_date": "2022-03-01"}]',
    '希望毕业后从事软件工程师工作，继续深造攻读硕士学位',
    'FRIENDS'
);
```

### 更新示例

#### 1. 更新教师职称
```sql
UPDATE dim_user_profile
SET title = '副教授',
    title_level = 'ASSOCIATE_PROFESSOR',
    update_time = NOW(),
    version = version + 1
WHERE user_id = 12345;
```

#### 2. 更新学生获奖信息
```sql
UPDATE dim_user_profile
SET awards_honors = JSON_ARRAY_APPEND(
    awards_honors,
    '$',
    JSON_OBJECT(
        'award_name', '校级三好学生',
        'award_year', '2023',
        'award_level', 'school'
    )
),
update_time = NOW(),
version = version + 1
WHERE user_id = 67890;
```

## 数据质量

### 质量检查规则
1. **完整性检查**：用户ID必须存在且唯一
2. **一致性检查**：教师档案应包含职称字段，学生档案应包含学籍状态
3. **格式检查**：JSON字段格式必须正确
4. **逻辑检查**：教学年限不能小于参加工作年限

### 数据清洗规则
1. **空值处理**：关键字段缺失时设置默认值
2. **格式标准化**：统一日期格式、文本格式
3. **重复数据处理**：检查并处理重复档案记录
4. **数据验证**：验证学号、工号等关键字段

## 性能优化

### 索引优化
- 用户ID建立唯一索引
- 职称、学历等常用查询字段建立索引
- 状态字段建立索引支持过滤查询

### 存储优化
- 头像等大文件使用外部存储，只保存URL
- JSON字段合理设计，避免嵌套过深
- 定期清理过期数据

### 查询优化
- 使用JSON函数进行字段查询
- 避免大字段的全表扫描
- 合理使用索引覆盖查询

## 安全考虑

### 数据隐私
- 敏感信息访问权限控制
- 隐私设置严格验证
- 数据脱敏处理

### 数据保护
- 个人信息加密存储
- 访问日志记录
- 数据备份和恢复

## 扩展说明

### 未来扩展方向
1. **多媒体档案**：支持视频、音频等多媒体资料
2. **社交档案**：集成社交媒体信息
3. **能力模型**：增加能力评估模型
4. **发展轨迹**：记录职业发展轨迹

### 兼容性说明
- 支持与人事系统档案数据对接
- 支持与学生管理系统数据同步
- 支持国家标准档案格式

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*