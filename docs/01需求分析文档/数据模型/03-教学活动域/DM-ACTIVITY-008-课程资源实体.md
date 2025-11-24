# 课程资源实体 (CourseResource)

---

**实体编号：** DM-ACTIVITY-008
**实体名称：** 课程资源实体
**所属域：** 教学活动域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

课程资源实体是AI助评应用教学活动的核心事实实体，记录课程相关的教学资源信息。该实体关联课程、教师、资源类型等，记录教学资料、多媒体资源、实验材料、参考资料等，为教学活动、资源管理、学习支持、资源共享等提供资源维度支撑。

## 实体定义

### 表名
- **物理表名：** `fact_course_resource`
- **业务表名：** 课程资源表
- **数据类型：** 事实表

### 主要用途
- 记录课程资源信息
- 管理资源使用统计
- 支持资源分享交流
- 提供资源质量评价

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 课程资源唯一标识ID |

### 关联字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| course_id | BIGINT | 20 | NOT NULL | 0 | 课程ID |
| course_name | VARCHAR | 200 | NOT NULL | '' | 课程名称 |
| course_code | VARCHAR | 50 | NOT NULL | '' | 课程编码 |
| teacher_id | BIGINT | 20 | NOT NULL | 0 | 教师ID |
| teacher_name | VARCHAR | 100 | NOT NULL | '' | 教师姓名 |
| class_id | BIGINT | 20 | NULL | NULL | 班级ID |
| class_name | VARCHAR | 100 | NULL | NULL | 班级名称 |
| creator_id | BIGINT | 20 | NOT NULL | 0 | 创建者ID |
| creator_name | VARCHAR | 100 | NOT NULL | '' | 创建者姓名 |

### 资源基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| resource_code | VARCHAR | 50 | NOT NULL | '' | 资源编码 |
| resource_title | VARCHAR | 300 | NOT NULL | '' | 资源标题 |
| resource_type | ENUM | - | NOT NULL | 'DOCUMENT' | 资源类型 |
| resource_category | VARCHAR | 100 | NOT NULL | '' | 资源分类 |
| resource_subcategory | VARCHAR | 100 | NULL | NULL | 资源子分类 |
| subject_matter | VARCHAR | 200 | NULL | NULL | 学科主题 |
| difficulty_level | ENUM | - | NOT NULL | 'MEDIUM' | 难度等级 |
| target_audience | VARCHAR | 200 | NULL | NULL | 目标受众 |
| language | VARCHAR | 20 | NOT NULL | '中文' | 资源语言 |
| version | VARCHAR | 20 | NULL | NULL | 资源版本 |

### 内容信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| content_description | TEXT | - | NULL | NULL | 内容描述 |
| abstract_summary | TEXT | - | NULL | NULL | 内容摘要 |
| key_concepts | JSON | - | NULL | NULL | 关键概念 |
| learning_objectives | TEXT | - | NULL | NULL | 学习目标 |
| prerequisite_knowledge | TEXT | - | NULL | NULL | 前置知识 |
| learning_outcomes | TEXT | - | NULL | NULL | 学习成果 |
| teaching_notes | TEXT | - | NULL | NULL | 教学笔记 |
| duration_estimate | INT | 11 | NULL | NULL | 预计时长（分钟） |
| page_count | INT | 11 | NULL | NULL | 页数统计 |
| word_count | INT | 11 | NULL | NULL | 字数统计 |

### 文件信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| file_format | VARCHAR | 20 | NULL | NULL | 文件格式 |
| file_size | BIGINT | 20 | NULL | NULL | 文件大小（字节） |
| file_path | VARCHAR | 500 | NULL | NULL | 文件路径 |
| file_url | VARCHAR | 500 | NULL | NULL | 文件URL |
| download_count | INT | 11 | NOT NULL | 0 | 下载次数 |
| view_count | INT | 11 | NOT NULL | 0 | 浏览次数 |
| has_preview | TINYINT | 1 | NOT NULL | 0 | 是否有预览 |
| preview_url | VARCHAR | 500 | NULL | NULL | 预览URL |
| thumbnail_url | VARCHAR | 500 | NULL | NULL | 缩略图URL |
| file_integrity | TINYINT | 1 | NULL | 1 | 文件完整性 |
| virus_scan_status | ENUM | - | NULL | NULL | 病毒扫描状态 |
| copyright_info | TEXT | - | NULL | NULL | 版权信息 |

### 资源属性字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| is_mandatory | TINYINT | 1 | NOT NULL | 0 | 是否必选 |
| is_supplementary | TINYINT | 1 | NOT NULL | 0 | 是否补充材料 |
| is_interactive | TINYINT | 1 | NOT NULL | 0 | 是否交互式 |
| is_multimedia | TINYINT | 1 | NOT NULL | 0 | 是否多媒体 |
| is_accessible | TINYINT | 1 | NOT NULL | 1 | 是否可访问 |
| is_downloadable | TINYINT | 1 | NOT NULL | 1 | 是否可下载 |
| is_shareable | TINYINT | 1 | NOT NULL | 1 | 是否可分享 |
| requires_auth | TINYINT | 1 | NOT NULL | 0 | 需要授权 |
| auth_level | ENUM | - | NULL | NULL | 授权级别 |
| usage_rights | TEXT | - | NULL | NULL | 使用权限 |
| license_type | ENUM | - | NULL | NULL | 许可类型 |

### 多媒体特性字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| media_type | VARCHAR | 50 | NULL | NULL | 媒体类型 |
| duration | TIME | - | NULL | NULL | 播放时长 |
| resolution | VARCHAR | 20 | NULL | NULL | 分辨率 |
| frame_rate | DECIMAL | 5,2 | NULL | NULL | 帧率 |
| audio_quality | VARCHAR | 20 | NULL | NULL | 音频质量 |
| video_quality | VARCHAR | 20 | NULL | NULL | 视频质量 |
    字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| subtitle_languages | JSON | - | NULL | NULL | 字幕语言 |
| closed_captions | TINYINT | 1 | NULL | 0 | 隐藏字幕 |
| interactive_elements | JSON | - | NULL | NULL | 交互元素 |
| compatible_devices | JSON | - | NULL | NULL | 兼容设备 |
| streaming_formats | JSON | - | NULL | NULL | 流媒体格式 |

### 使用统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_usage_time | BIGINT | 20 | NULL | 0 | 总使用时长（秒） |
| average_session_time | INT | 11 | NULL | 0 | 平均使用时长 |
| unique_users | INT | 11 | NOT NULL | 0 | 独立用户数 |
| usage_frequency | DECIMAL | 8,2 | NULL | 0.00 | 使用频率 |
| peak_usage_time | TIME | - | NULL | NULL | 高峰使用时间 |
| usage_days | INT | 11 | NULL | 0 | 使用天数 |
| last_accessed_time | DATETIME | - | NULL | NULL | 最后访问时间 |
| engagement_rate | DECIMAL | 5,2 | NULL | 0.00 | 参与率 |
| completion_rate | DECIMAL | 5,2 | NULL | 0.00 | 完成率 |
| abandonment_rate | DECIMAL | 5,2 | NULL | 0.00 | 放弃率 |

### 质量评价字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| quality_rating | DECIMAL | 5,2 | NULL | 0.00 | 质量评分 |
| accuracy_rating | DECIMAL | 5,2 | NULL | 0.00 | 准确性评分 |
| relevance_rating | DECIMAL | 5,2 | NULL | 0.00 | 相关性评分 |
| clarity_rating | DECIMAL | 5,2 | NULL | 0.00 | 清晰度评分 |
| completeness_rating | DECIMAL | 5,2 | NULL | 0.00 | 完整性评分 |
| usefulness_rating | DECIMAL | 5,2 | NULL | 0.00 | 实用性评分 |
| technical_quality | DECIMAL | 5,2 | NULL | 0.00 | 技术质量 |
| pedagogical_effectiveness | DECIMAL | 5,2 | NULL | 0.00 | 教学有效性 |
| overall_rating | DECIMAL | 5,2 | NULL | 0.00 | 总体评分 |
| review_count | INT | 11 | NOT NULL | 0 | 评价数量 |

### 评价反馈字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| user_reviews | JSON | - | NULL | NULL | 用户评价 |
| expert_reviews | JSON | - | NULL | NULL | 专家评价 |
| peer_reviews | JSON | - | NULL | NULL | 同行评价 |
| review_summary | TEXT | - | NULL | NULL | 评价总结 |
| improvement_suggestions | TEXT | - | NULL | NULL | 改进建议 |
| usage_feedback | TEXT | - | NULL | NULL | 使用反馈 |
| technical_issues | TEXT | - | NULL | NULL | 技术问题 |
| content_issues | TEXT | - | NULL | NULL | 内容问题 |
| reported_issues | JSON | - | NULL | NULL | 报告问题 |
| issue_resolution | TEXT | - | NULL | NULL | 问题解决 |

### 关联关系字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| related_resources | JSON | - | NULL | NULL | 相关资源 |
| prerequisite_resources | JSON | - | NULL | NULL | 前置资源 |
| follow_up_resources | JSON | - | NULL | NULL | 后续资源 |
| alternative_resources | JSON | - | NULL | NULL | 替代资源 |
| references_citations | JSON | - | NULL | NULL | 参考引用 |
| external_links | JSON | - | NULL | NULL | 外部链接 |
| supporting_materials | JSON | - | NULL | NULL | 支撑材料 |
| assessment_materials | JSON | - | NULL | NULL | 评估材料 |
| integration_points | JSON | - | NULL | NULL | 集成点 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| resource_status | ENUM | - | NOT NULL | 'DRAFT' | 资源状态 |
| publish_status | ENUM | - | NOT NULL | 'PRIVATE' | 发布状态 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| review_status | ENUM | - | NULL | NULL | 审核状态 |
| is_active | TINYINT | 1 | NOT NULL | 1 | 是否激活 |
| is_featured | TINYINT | 1 | NOT NULL | 0 | 是否推荐 |
| is_public | TINYINT | 1 | NOT NULL | 0 | 是否公开 |
| is_archived | TINYINT | 1 | NOT NULL | 0 | 是否归档 |
| archive_date | DATE | - | NULL | NULL | 归档日期 |
| expiration_date | DATE | - | NULL | NULL | 过期日期 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| source_system | ENUM | - | NOT NULL | 'MANUAL' | 数据来源系统 |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |
| external_id | VARCHAR | 100 | NULL | NULL | 外部ID |
| tags | JSON | - | NULL | NULL | 标签 |
| metadata | JSON | - | NULL | NULL | 元数据 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_resource_code (resource_code)
UNIQUE KEY uk_course_resource (course_id, resource_title)
```

### 外键约束
```sql
FOREIGN KEY (course_id) REFERENCES dim_course(id) ON DELETE CASCADE
FOREIGN KEY (teacher_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (class_id) REFERENCES dim_class(id) ON DELETE SET NULL
FOREIGN KEY (creator_id) REFERENCES dim_user(id) ON DELETE CASCADE
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_course_id (course_id)
INDEX idx_teacher_id (teacher_id)
INDEX idx_creator_id (creator_id)
INDEX idx_class_id (class_id)
INDEX idx_resource_type (resource_type)
INDEX idx_resource_category (resource_category)
INDEX idx_difficulty_level (difficulty_level)
INDEX idx_resource_status (resource_status)
INDEX idx_publish_status (publish_status)
INDEX idx_quality_rating (quality_rating)
INDEX idx_overall_rating (overall_rating)
INDEX idx_download_count (download_count)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_course_type (course_id, resource_type)
INDEX idx_status_rating (resource_status, overall_rating)
INDEX idx_usage_stats (download_count, view_count)
INDEX idx_quality_type (quality_rating, resource_type)
```

### 检查约束
```sql
CHECK (resource_type IN ('DOCUMENT', 'VIDEO', 'AUDIO', 'IMAGE', 'PRESENTATION', 'INTERACTIVE', 'SIMULATION', 'ASSESSMENT', 'REFERENCE', 'SOFTWARE', 'DATA'))
CHECK (difficulty_level IN ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'))
CHECK (auth_level IN ('PUBLIC', 'STUDENT', 'TEACHER', 'ADMIN', 'RESTRICTED'))
CHECK (license_type IN ('CREATIVE_COMMONS', 'OPEN_SOURCE', 'COMMERCIAL', 'EDUCATIONAL', 'CUSTOM'))
CHECK (virus_scan_status IN ('NOT_SCANNED', 'SCANNING', 'CLEAN', 'INFECTED', 'ERROR'))
CHECK (resource_status IN ('DRAFT', 'PUBLISHED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'))
CHECK (publish_status IN ('PRIVATE', 'INTERNAL', 'PUBLIC', 'RESTRICTED'))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVIEW'))
CHECK (review_status IN ('NOT_REVIEWED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'))
CHECK (is_mandatory IN (0, 1))
CHECK (is_supplementary IN (0, 1))
CHECK (is_interactive IN (0, 1))
CHECK (is_multimedia IN (0, 1))
CHECK (is_accessible IN (0, 1))
CHECK (is_downloadable IN (0, 1))
CHECK (is_shareable IN (0, 1))
CHECK (requires_auth IN (0, 1))
CHECK (has_preview IN (0, 1))
CHECK (file_integrity IN (0, 1))
CHECK (closed_captions IN (0, 1))
CHECK (download_count >= 0)
CHECK (view_count >= 0)
CHECK (unique_users >= 0)
CHECK (usage_frequency >= 0)
CHECK (usage_days >= 0)
CHECK (engagement_rate BETWEEN 0 AND 100)
CHECK (completion_rate BETWEEN 0 AND 100)
CHECK (abandonment_rate BETWEEN 0 AND 100)
CHECK (total_usage_time >= 0)
CHECK (average_session_time >= 0)
CHECK (quality_rating BETWEEN 0 AND 100)
CHECK (accuracy_rating BETWEEN 0 AND 100)
CHECK (relevance_rating BETWEEN 0 AND 100)
CHECK (clarity_rating BETWEEN 0 AND 100)
CHECK (completeness_rating BETWEEN 0 AND 100)
CHECK (usefulness_rating BETWEEN 0 AND 100)
CHECK (technical_quality BETWEEN 0 AND 100)
CHECK (pedagogical_effectiveness BETWEEN 0 AND 100)
CHECK (overall_rating BETWEEN 0 AND 100)
CHECK (review_count >= 0)
CHECK (page_count >= 0)
CHECK (word_count >= 0)
CHECK (duration_estimate >= 0)
CHECK (is_active IN (0, 1))
CHECK (is_featured IN (0, 1))
CHECK (is_public IN (0, 1))
CHECK (is_archived IN (0, 1))
CHECK (source_system IN ('MANUAL', 'ZJY', 'SYSTEM', 'API', 'IMPORT'))
```

## 枚举值定义

### 资源类型 (resource_type)
| 值 | 说明 | 备注 |
|----|------|------|
| DOCUMENT | 文档 | 文档资料 |
| VIDEO | 视频 | 视频资源 |
| AUDIO | 音频 | 音频资源 |
| IMAGE | 图片 | 图片资源 |
| PRESENTATION | 演示 | 演示文稿 |
| INTERACTIVE | 交互 | 交互式资源 |
| SIMULATION | 模拟 | 模拟资源 |
| ASSESSMENT | 评估 | 评估资源 |
| REFERENCE | 参考 | 参考资料 |
| SOFTWARE | 软件 | 软件工具 |
| DATA | 数据 | 数据资源 |

### 难度等级 (difficulty_level)
| 值 | 说明 | 备注 |
|----|------|------|
| BEGINNER | 初级 | 适合初学者 |
| ELEMENTARY | 基础 | 基础水平 |
| INTERMEDIATE | 中级 | 中等水平 |
| ADVANCED | 高级 | 高等水平 |
| EXPERT | 专家 | 专家水平 |

### 授权级别 (auth_level)
| 值 | 说明 | 备注 |
|----|------|------|
| PUBLIC | 公开 | 所有人可访问 |
| STUDENT | 学生 | 学生权限 |
| TEACHER | 教师 | 教师权限 |
| ADMIN | 管理员 | 管理员权限 |
| RESTRICTED | 受限 | 限制访问 |

### 许可类型 (license_type)
| 值 | 说明 | 备注 |
|----|------|------|
| CREATIVE_COMMONS | 创作共享 | CC许可 |
| OPEN_SOURCE | 开源 | 开源许可 |
| COMMERCIAL | 商业 | 商业许可 |
| EDUCATIONAL | 教育 | 教育许可 |
| CUSTOM | 自定义 | 自定义许可 |

### 病毒扫描状态 (virus_scan_status)
| 值 | 说明 | 备注 |
|----|------|------|
| NOT_SCANNED | 未扫描 | 尚未扫描 |
| SCANNING | 扫描中 | 正在扫描 |
| CLEAN | 清洁 | 无病毒 |
| INFECTED | 感染 | 有病毒 |
| ERROR | 错误 | 扫描错误 |

### 资源状态 (resource_status)
| 值 | 说明 | 备注 |
|----|------|------|
| DRAFT | 草稿 | 资源草稿 |
| PUBLISHED | 已发布 | 已发布 |
| UNDER_REVIEW | 审核中 | 正在审核 |
| APPROVED | 已批准 | 审核通过 |
| REJECTED | 已拒绝 | 审核拒绝 |
| ARCHIVED | 已归档 | 资源归档 |

### 发布状态 (publish_status)
| 值 | 说明 | 备注 |
|----|------|------|
| PRIVATE | 私有 | 私人可见 |
| INTERNAL | 内部 | 内部可见 |
| PUBLIC | 公开 | 公开发布 |
| RESTRICTED | 受限 | 限制访问 |

## 关联关系

### 多对一关系（作为从表）
- **CourseResource → Course**：课程资源属于课程
- **CourseResource → User（teacher）**：课程资源关联教师
- **CourseResource → User（creator）**：课程资源关联创建者
- **CourseResource → Class**：课程资源关联班级

### 一对多关系（作为主表）
- **CourseResource → ResourceUsage**：一个资源有多个使用记录
- **CourseResource → ResourceReview**：一个资源有多个评价记录

### 多对多关系
- **CourseResource ↔ User（students）**：通过中间表关联学生使用记录

## 使用示例

### 查询示例

#### 1. 查询课程资源统计
```sql
SELECT
    c.course_name,
    cr.resource_type,
    COUNT(*) as resource_count,
    SUM(cr.download_count) as total_downloads,
    SUM(cr.view_count) as total_views,
    AVG(cr.overall_rating) as avg_rating,
    AVG(cr.quality_rating) as avg_quality,
    SUM(CASE WHEN cr.is_mandatory = 1 THEN 1 END) as mandatory_count,
    SUM(CASE WHEN cr.is_featured = 1 THEN 1 END) as featured_count,
    SUM(cr.unique_users) as total_unique_users
FROM fact_course_resource cr
JOIN dim_course c ON cr.course_id = c.id
WHERE cr.resource_status = 'PUBLISHED'
  AND cr.is_active = 1
GROUP BY cr.course_id, c.course_name, cr.resource_type
ORDER BY resource_count DESC;
```

#### 2. 查询高质量资源
```sql
SELECT
    cr.resource_title,
    cr.resource_type,
    cr.difficulty_level,
    c.course_name,
    t.user_name as teacher_name,
    cr.overall_rating,
    cr.quality_rating,
    cr.usefulness_rating,
    cr.pedagogical_effectiveness,
    cr.download_count,
    cr.view_count,
    cr.unique_users,
    cr.is_featured
FROM fact_course_resource cr
JOIN dim_course c ON cr.course_id = c.id
JOIN dim_user t ON cr.teacher_id = t.id
WHERE cr.resource_status = 'PUBLISHED'
  AND cr.is_active = 1
  AND cr.overall_rating >= 4.5
  AND cr.review_count >= 10
ORDER BY cr.overall_rating DESC, cr.download_count DESC;
```

#### 3. 查询资源使用情况
```sql
SELECT
    cr.resource_title,
    cr.resource_type,
    cr.download_count,
    cr.view_count,
    cr.unique_users,
    cr.total_usage_time,
    cr.average_session_time,
    cr.engagement_rate,
    cr.completion_rate,
    cr.last_accessed_time,
    cr.usage_frequency,
    cr.usage_days,
    CASE
        WHEN cr.engagement_rate >= 80 THEN 'HIGH_ENGAGEMENT'
        WHEN cr.engagement_rate >= 60 THEN 'MEDIUM_ENGAGEMENT'
        ELSE 'LOW_ENGAGEMENT'
    END as engagement_level
FROM fact_course_resource cr
WHERE cr.resource_status = 'PUBLISHED'
  AND cr.is_active = 1
  AND cr.create_time >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
ORDER BY cr.engagement_rate DESC;
```

#### 4. 查询待审核资源
```sql
SELECT
    cr.resource_title,
    cr.resource_type,
    c.course_name,
    cr.creator_name,
    cr.create_time,
    cr.approval_status,
    cr.review_status,
    cr.quality_rating,
    cr.technical_quality,
    cr.content_issues,
    cr.technical_issues
FROM fact_course_resource cr
JOIN dim_course c ON cr.course_id = c.id
WHERE cr.resource_status IN ('UNDER_REVIEW', 'PUBLISHED')
  AND (cr.approval_status = 'PENDING' OR cr.review_status = 'UNDER_REVIEW')
  AND cr.is_active = 1
ORDER BY cr.create_time ASC;
```

#### 5. 查询热门资源
```sql
SELECT
    cr.resource_title,
    cr.resource_type,
    c.course_name,
    cr.download_count,
    cr.view_count,
    cr.unique_users,
    cr.overall_rating,
    cr.is_featured,
    cr.publish_status,
    DATEDIFF(NOW(), cr.create_time) as days_since_creation,
    ROUND(cr.download_count / DATEDIFF(NOW(), cr.create_time), 2) as daily_downloads
FROM fact_course_resource cr
JOIN dim_course c ON cr.course_id = c.id
WHERE cr.resource_status = 'PUBLISHED'
  AND cr.publish_status = 'PUBLIC'
  AND cr.is_active = 1
  AND cr.create_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY cr.download_count DESC, cr.view_count DESC;
```

### 插入示例

#### 1. 创建文档资源
```sql
INSERT INTO fact_course_resource (
    resource_code, resource_title, resource_type, resource_category,
    course_id, course_name, course_code,
    teacher_id, teacher_name,
    creator_id, creator_name,
    content_description, learning_objectives,
    file_format, file_size, file_path,
    difficulty_level, target_audience,
    is_mandatory, is_downloadable,
    resource_status, publish_status,
    create_by, source_system
) VALUES (
    'RES2023001', '数据结构与算法学习指南', 'DOCUMENT', '学习资料',
    1001, '数据结构与算法', 'CS301',
    23456, '张老师',
    23456, '张老师',
    '涵盖数据结构的基本概念、算法设计和实现方法，配合大量实例和练习', '掌握常用数据结构和算法，培养算法思维能力',
    'PDF', 5242880, '/resources/data_structure_guide.pdf',
    'INTERMEDIATE', '计算机专业学生',
    0, 1,
    'PUBLISHED', 'INTERNAL',
    23456, 'MANUAL'
);
```

#### 2. 创建视频资源
```sql
INSERT INTO fact_course_resource (
    resource_code, resource_title, resource_type, resource_category,
    course_id, course_name, course_code,
    teacher_id, teacher_name,
    creator_id, creator_name,
    content_description, learning_objectives,
    file_format, file_size, file_url,
    media_type, duration, resolution,
    subtitle_languages, closed_captions,
    difficulty_level, is_interactive, is_multimedia,
    has_preview, preview_url,
    resource_status, publish_status,
    create_by, source_system
) VALUES (
    'RES2023002', '计算机网络实验演示视频', 'VIDEO', '实验指导',
    1002, '计算机网络', 'CS302',
    23457, '李老师',
    23457, '李老师',
    '演示TCP协议实验的完整操作过程，包括配置、测试和分析', '掌握TCP协议实验的操作步骤和分析方法',
    'MP4', 104857600, 'https://video.example.com/tcp_demo.mp4',
    'VIDEO', '00:45:30', '1920x1080',
    '["中文", "英文"]', 1,
    'INTERMEDIATE', 0, 1,
    1, 'https://video.example.com/tcp_demo_preview.mp4',
    'PUBLISHED', 'PUBLIC',
    23457, 'SYSTEM'
);
```

### 更新示例

#### 1. 更新资源使用统计
```sql
UPDATE fact_course_resource
SET download_count = download_count + 1,
    view_count = view_count + 1,
    total_usage_time = total_usage_time + 300,
    average_session_time = ROUND((total_usage_time + 300) / unique_users, 0),
    last_accessed_time = NOW(),
    engagement_rate = ROUND(engagement_rate * 0.9 + 10 * 0.1, 2),
    update_time = NOW(),
    version = version + 1
WHERE resource_code = 'RES2023001';
```

#### 2. 更新质量评价
```sql
UPDATE fact_course_resource
SET quality_rating = ROUND((quality_rating * review_count + 4.2) / (review_count + 1), 2),
    accuracy_rating = ROUND((accuracy_rating * review_count + 4.5) / (review_count + 1), 2),
    relevance_rating = ROUND((relevance_rating * review_count + 4.0) / (review_count + 1), 2),
    overall_rating = ROUND((overall_rating * review_count + 4.3) / (review_count + 1), 2),
    review_count = review_count + 1,
    update_time = NOW(),
    version = version + 1
WHERE id = 1001;
```

#### 3. 更新资源状态
```sql
UPDATE fact_course_resource
SET resource_status = 'PUBLISHED',
    approval_status = 'APPROVED',
    review_status = 'APPROVED',
    publish_status = 'PUBLIC',
    is_active = 1,
    update_time = NOW(),
    version = version + 1
WHERE id = 1001
  AND resource_status = 'UNDER_REVIEW';
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：资源编码、课程+标题必须唯一
2. **完整性检查**：课程、创建者等关键字段不能为空
3. **逻辑检查**：评分范围合理，使用统计逻辑一致
4. **关联检查**：课程ID、创建人ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的资源记录
2. **评分修正**：修正不合理的评分数据
3. **使用统计更新**：定期更新使用统计数据
4. **状态同步**：同步资源状态和发布状态

## 性能优化

### 索引优化
- 课程ID和资源类型建立复合索引
- 评分和状态建立复合索引
- 下载量和浏览量建立复合索引

### 分区策略
- 按创建时间进行表分区
- 提高历史数据查询性能
- 方便数据归档管理

### 查询优化
- 使用覆盖索引优化统计查询
- 避免大字段的全表扫描
- 合理使用评分和类型过滤

## 安全考虑

### 数据保护
- 资源内容版权保护
- 下载记录隐私保护
- 评价数据安全管理

### 权限控制
- 资源上传需要教师权限
- 资源下载权限分级控制
- 资源删除需要管理员权限

## 扩展说明

### 未来扩展方向
1. **AI推荐**：基于学习历史的资源推荐
2. **自适应学习**：基于学习效果的资源适配
3. **协作平台**：师生协作资源创作平台
4. **资源市场**：教育资源交易和共享平台

### 兼容性说明
- 支持与LMS系统对接
- 支持多种资源格式集成
- 支持第三方内容管理系统

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*