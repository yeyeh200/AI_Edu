# 教材信息实体 (Textbook)

---

**实体编号：** DM-COURSE-008
**实体名称：** 教材信息实体
**所属域：** 教学资源域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

教材信息实体是AI助评应用教学资源管理的重要实体，定义了课程教材和教学资源的基本信息。该实体包含教材基本信息、版本管理、库存管理、使用统计等，为课程资源配备、教材管理、教学支持、成本控制等提供教材维度支撑。

## 实体定义

### 表名
- **物理表名：** `dim_textbook`
- **业务表名：** 教材信息表
- **数据类型：** 维度表

### 主要用途
- 定义教材基本信息
- 管理教材版本库存
- 支持教材使用统计
- 提供教材采购管理

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 教材唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| textbook_code | VARCHAR | 50 | NOT NULL | '' | 教材编码（系统唯一） |
| isbn | VARCHAR | 20 | NULL | NULL | ISBN号码 |
| title | VARCHAR | 300 | NOT NULL | '' | 教材标题 |
| subtitle | VARCHAR | 200 | NULL | NULL | 副标题 |
| textbook_type | ENUM | - | NOT NULL | 'REQUIRED' | 教材类型 |
| subject_category | VARCHAR | 100 | NOT NULL | '' | 学科分类 |
| knowledge_category | VARCHAR | 100 | NULL | NULL | 知识分类 |
| language | VARCHAR | 20 | NOT NULL | '中文' | 教材语言 |
| original_title | VARCHAR | 300 | NULL | NULL | 原版标题 |

### 版本信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| edition | VARCHAR | 50 | NOT NULL | '第1版' | 版次 |
| revision | VARCHAR | 50 | NULL | NULL | 修订版次 |
| publication_year | INT | 11 | NULL | NULL | 出版年份 |
| publication_month | INT | 11 | NULL | NULL | 出版月份 |
| publication_date | DATE | - | NULL | NULL | 出版日期 |
| reprint_count | INT | 11 | NULL | 0 | 重印次数 |
| latest_reprint_date | DATE | - | NULL | NULL | 最新重印日期 |
| is_latest_edition | TINYINT | 1 | NOT NULL | 1 | 是否最新版次 |
| version_status | ENUM | - | NOT NULL | 'CURRENT' | 版本状态 |

### 作者信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| primary_author | VARCHAR | 100 | NOT NULL | '' | 主要作者 |
| secondary_authors | JSON | - | NULL | NULL | 其他作者 |
| editor | VARCHAR | 100 | NULL | NULL | 编辑 |
| translator | VARCHAR | 100 | NULL | NULL | 译者 |
| reviewer | VARCHAR | 100 | NULL | NULL | 审校者 |
| author_institution | VARCHAR | 200 | NULL | NULL | 作者机构 |
| author_affiliation | JSON | - | NULL | NULL | 作者单位 |
| contributor_count | INT | 11 | NULL | 0 | 贡献者数量 |

### 出版信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| publisher_id | BIGINT | 20 | NULL | NULL | 出版社ID |
| publisher_name | VARCHAR | 200 | NULL | NULL | 出版社名称 |
| imprint | VARCHAR | 100 | NULL | NULL | 出版品牌 |
| publication_place | VARCHAR | 100 | NULL | NULL | 出版地 |
| distribution_area | VARCHAR | 200 | NULL | NULL | 发行区域 |
| copyright_info | TEXT | - | NULL | NULL | 版权信息 |
| license_type | ENUM | - | NULL | NULL | 许可类型 |
| usage_rights | TEXT | - | NULL | NULL | 使用权限 |

### 物理属性字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| format_type | ENUM | - | NOT NULL | 'PAPERBACK' | 装帧类型 |
| page_count | INT | 11 | NULL | 0 | 页数 |
| word_count | INT | 11 | NULL | 0 | 字数 |
| dimensions | VARCHAR | 50 | NULL | NULL | 开本尺寸 |
| weight | DECIMAL | 8,2 | NULL | 0.00 | 重量（千克） |
| paper_quality | VARCHAR | 50 | NULL | NULL | 纸张质量 |
| binding_type | VARCHAR | 50 | NULL | NULL | 装订方式 |
| cover_type | VARCHAR | 50 | NULL | NULL | 封面类型 |
| color_printing | TINYINT | 1 | NULL | 0 | 彩色印刷 |
| has_cd_rom | TINYINT | 1 | NULL | 0 | 附带光盘 |

### 价格信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| list_price | DECIMAL | 10,2 | NULL | 0.00 | 定价 |
| purchase_price | DECIMAL | 10,2 | NULL | 0.00 | 采购价 |
| selling_price | DECIMAL | 10,2 | NULL | 0.00 | 销售价 |
| discount_rate | DECIMAL | 5,2 | NULL | 0.00 | 折扣率 |
| currency | VARCHAR | 10 | NULL | 'CNY' | 货币单位 |
| price_status | ENUM | - | NULL | NULL | 价格状态 |
| price_effective_date | DATE | - | NULL | NULL | 价格生效日期 |
| bulk_discount | JSON | - | NULL | NULL | 批量折扣 |
| special_pricing | JSON | - | NULL | NULL | 特殊定价 |

### 库存管理字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_stock | INT | 11 | NOT NULL | 0 | 总库存量 |
| available_stock | INT | 11 | NOT NULL | 0 | 可用库存 |
| reserved_stock | INT | 11 | NULL | 0 | 预留库存 |
| damaged_stock | INT | 11 | NULL | 0 | 损坏库存 |
| reorder_level | INT | 11 | NULL | 10 | 重订水平 |
| max_stock_level | INT | 11 | NULL | 100 | 最大库存 |
| average_monthly_usage | DECIMAL | 8,2 | NULL | 0.00 | 月均使用量 |
| stock_turnover_rate | DECIMAL | 5,2 | NULL | 0.00 | 库存周转率 |
| warehouse_location | VARCHAR | 100 | NULL | NULL | 仓库位置 |

### 使用统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| course_usage_count | INT | 11 | NULL | 0 | 课程使用次数 |
| student_usage_count | INT | 11 | NULL | 0 | 学生使用数量 |
| total_distributed | INT | 11 | NULL | 0 | 总发放数量 |
| current_semester_usage | INT | 11 | NULL | 0 | 本学期使用量 |
| last_semester_usage | INT | 11 | NULL | 0 | 上学期使用量 |
| usage_trend | ENUM | - | NULL | NULL | 使用趋势 |
| popular_rating | DECIMAL | 5,2 | NULL | 0.00 | 受欢迎度评分 |
| satisfaction_rate | DECIMAL | 5,2 | NULL | 0.00 | 满意度 |
| recommended_rate | DECIMAL | 5,2 | NULL | 0.00 | 推荐率 |

### 数字资源字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| has_ebook | TINYINT | 1 | NULL | 0 | 是否有电子版 |
| ebook_url | VARCHAR | 500 | NULL | NULL | 电子版地址 |
| ebook_format | JSON | - | NULL | NULL | 电子版格式 |
| has_online_resources | TINYINT | 1 | NULL | 0 | 是否有在线资源 |
| resource_urls | JSON | - | NULL | NULL | 资源地址 |
| companion_website | VARCHAR | 300 | NULL | NULL | 配套网站 |
| mobile_app_available | TINYINT | 1 | NULL | 0 | 是否有手机应用 |
| interactive_content | TINYINT | 1 | NULL | 0 | 是否有交互内容 |
| multimedia_resources | JSON | - | NULL | NULL | 多媒体资源 |

### 质量评价字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| content_quality | DECIMAL | 5,2 | NULL | 0.00 | 内容质量评分 |
| accuracy_rating | DECIMAL | 5,2 | NULL | 0.00 | 准确性评分 |
| completeness_rating | DECIMAL | 5,2 | NULL | 0.00 | 完整性评分 |
| readability_rating | DECIMAL | 5,2 | NULL | 0.00 | 可读性评分 |
| technical_quality | DECIMAL | 5,2 | NULL | 0.00 | 技术质量评分 |
| pedagogical_effectiveness | DECIMAL | 5,2 | NULL | 0.00 | 教学有效性 |
| review_status | ENUM | - | NULL | NULL | 审核状态 |
| review_summary | TEXT | - | NULL | NULL | 审核总结 |
| expert_reviews | JSON | - | NULL | NULL | 专家评价 |
| user_reviews | JSON | - | NULL | NULL | 用户评价 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| textbook_status | ENUM | - | NOT NULL | 'ACTIVE' | 教材状态 |
| availability_status | ENUM | - | NULL | NULL | 可用性状态 |
| procurement_status | ENUM | - | NULL | NULL | 采购状态 |
| adoption_status | ENUM | - | NULL | NULL | 选用状态 |
| is_recommended | TINYINT | 1 | NOT NULL | 0 | 是否推荐教材 |
| is_mandatory | TINYINT | 1 | NOT NULL | 0 | 是否必选教材 |
| requires_approval | TINYINT | 1 | NOT NULL | 0 | 需要审批 |
| approval_status | ENUM | - | NULL | NULL | 审批状态 |
| archive_date | DATE | - | NULL | NULL | 归档日期 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| external_code | VARCHAR | 100 | NULL | NULL | 外部编码 |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |
| barcode | VARCHAR | 100 | NULL | NULL | 条形码 |
| qr_code | VARCHAR | 200 | NULL | NULL | 二维码 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_textbook_code (textbook_code)
UNIQUE KEY uk_isbn (isbn)
UNIQUE KEY uk_title_edition (title, edition, publication_year)
```

### 外键约束
```sql
FOREIGN KEY (publisher_id) REFERENCES dim_publisher(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_subject_category (subject_category)
INDEX idx_textbook_type (textbook_type)
INDEX idx_textbook_status (textbook_status)
INDEX idx_primary_author (primary_author)
INDEX idx_publisher_name (publisher_name)
INDEX idx_publication_year (publication_year)
INDEX idx_list_price (list_price)
INDEX idx_total_stock (total_stock)
INDEX idx_course_usage_count (course_usage_count)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_subject_status (subject_category, textbook_status)
INDEX idx_author_year (primary_author, publication_year)
INDEX idx_stock_usage (total_stock, course_usage_count)
INDEX idx_quality_status (content_quality, review_status)
```

### 检查约束
```sql
CHECK (textbook_type IN ('REQUIRED', 'OPTIONAL', 'REFERENCE', 'SUPPLEMENTARY', 'DIGITAL', 'LAB_MANUAL', 'WORKBOOK'))
CHECK (version_status IN ('CURRENT', 'SUPERSEDED', 'OUTDATED', 'WITHDRAWN'))
CHECK (format_type IN ('HARDCOVER', 'PAPERBACK', 'SPIRAL', 'LOOSE_LEAF', 'EBOOK', 'DIGITAL'))
CHECK (price_status IN ('ACTIVE', 'INACTIVE', 'PROMOTIONAL', 'DISCOUNTED'))
CHECK (textbook_status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'REPLACED', 'UNDER_REVIEW'))
CHECK (availability_status IN ('AVAILABLE', 'OUT_OF_STOCK', 'LIMITED', 'DISCONTINUED'))
CHECK (procurement_status IN ('PLANNED', 'ORDERED', 'RECEIVED', 'DELAYED', 'CANCELLED'))
CHECK (adoption_status IN ('ADOPTED', 'CONSIDERING', 'REJECTED', 'EXPIRED'))
CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'REVIEW'))
CHECK (review_status IN ('NOT_REVIEWED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_REQUIRED'))
CHECK (usage_trend IN ('INCREASING', 'STABLE', 'DECREASING', 'FLUCTUATING'))
CHECK (is_recommended IN (0, 1))
CHECK (is_mandatory IN (0, 1))
CHECK (requires_approval IN (0, 1))
CHECK (page_count >= 0)
CHECK (word_count >= 0)
CHECK (weight >= 0)
CHECK (list_price >= 0)
CHECK (purchase_price >= 0)
CHECK (selling_price >= 0)
CHECK (discount_rate BETWEEN 0 AND 100)
CHECK (total_stock >= 0)
CHECK (available_stock >= 0)
CHECK (reserved_stock >= 0)
CHECK (damaged_stock >= 0)
CHECK (reorder_level >= 0)
CHECK (max_stock_level >= reorder_level)
CHECK (average_monthly_usage >= 0)
CHECK (stock_turnover_rate >= 0)
CHECK (course_usage_count >= 0)
CHECK (student_usage_count >= 0)
CHECK (total_distributed >= 0)
CHECK (content_quality BETWEEN 0 AND 100)
CHECK (accuracy_rating BETWEEN 0 AND 100)
CHECK (completeness_rating BETWEEN 0 AND 100)
CHECK (readability_rating BETWEEN 0 AND 100)
CHECK (technical_quality BETWEEN 0 AND 100)
CHECK (pedagogical_effectiveness BETWEEN 0 AND 100)
CHECK (popular_rating BETWEEN 0 AND 100)
CHECK (satisfaction_rate BETWEEN 0 AND 100)
CHECK (recommended_rate BETWEEN 0 AND 100)
```

## 枚举值定义

### 教材类型 (textbook_type)
| 值 | 说明 | 备注 |
|----|------|------|
| REQUIRED | 必修教材 | 课程必选教材 |
| OPTIONAL | 选修教材 | 课程可选教材 |
| REFERENCE | 参考教材 | 参考资料 |
| SUPPLEMENTARY | 补充教材 | 补充材料 |
| DIGITAL | 数字教材 | 电子教材 |
| LAB_MANUAL | 实验手册 | 实验指导 |
| WORKBOOK | 练习册 | 习题集 |

### 版本状态 (version_status)
| 值 | 说明 | 备注 |
|----|------|------|
| CURRENT | 当前版 | 现行使用版本 |
| SUPERSEDED | 已被替代 | 有新版本替代 |
| OUTDATED | 过时版本 | 内容已过时 |
| WITHDRAWN | 已撤回 | 停止发行 |

### 装帧类型 (format_type)
| 值 | 说明 | 备注 |
|----|------|------|
| HARDCOVER | 精装 | 精装本 |
| PAPERBACK | 平装 | 平装本 |
| SPIRAL | 螺旋 | 螺旋装订 |
| LOOSE_LEAF | 活页 | 活页本 |
| EBOOK | 电子书 | 电子版 |
| DIGITAL | 数字版 | 数字资源 |

### 价格状态 (price_status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 有效 | 正常价格 |
| INACTIVE | 无效 | 停用价格 |
| PROMOTIONAL | 促销 | 促销价格 |
| DISCOUNTED | 折扣 | 折扣价格 |

### 教材状态 (textbook_status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 活跃 | 正常使用 |
| INACTIVE | 非活跃 | 暂停使用 |
| DISCONTINUED | 已停产 | 不再出版 |
| REPLACED | 已替换 | 被新版替换 |
| UNDER_REVIEW | 审核中 | 正在审核 |

### 可用性状态 (availability_status)
| 值 | 说明 | 备注 |
|----|------|------|
| AVAILABLE | 可用 | 有库存 |
| OUT_OF_STOCK | 缺货 | 无库存 |
| LIMITED | 有限 | 库存有限 |
| DISCONTINUED | 停产 | 不再供应 |

### 审核状态 (review_status)
| 值 | 说明 | 备注 |
|----|------|------|
| NOT_REVIEWED | 未审核 | 尚未审核 |
| UNDER_REVIEW | 审核中 | 正在审核 |
| APPROVED | 已通过 | 审核通过 |
| REJECTED | 已拒绝 | 审核拒绝 |
| REVISION_REQUIRED | 需修订 | 需要修改 |

## 关联关系

### 多对一关系（作为从表）
- **Textbook → Publisher**：教材属于出版社
- **Textbook → User（creator）**：教材创建者关联

### 一对多关系（作为主表）
- **Textbook → CourseTextbook**：一个教材可用于多个课程
- **Textbook → TextbookStock**：一个教材有多个库存记录
- **Textbook → TextbookReview**：一个教材有多个评价记录

### 多对多关系
- **Textbook ↔ Course**：通过中间表关联

## 使用示例

### 查询示例

#### 1. 查询教材库存状况
```sql
SELECT
    t.title,
    t.textbook_code,
    t.isbn,
    t.author,
    t.publisher_name,
    t.edition,
    t.total_stock,
    t.available_stock,
    t.reserved_stock,
    t.reorder_level,
    t.stock_turnover_rate,
    t.usage_trend,
    t.textbook_status
FROM dim_textbook t
WHERE t.textbook_status = 'ACTIVE'
  AND t.availability_status = 'AVAILABLE'
ORDER BY t.stock_turnover_rate DESC;
```

#### 2. 查询高使用率教材
```sql
SELECT
    t.title,
    t.primary_author,
    t.subject_category,
    t.course_usage_count,
    t.student_usage_count,
    t.total_distributed,
    t.popular_rating,
    t.satisfaction_rate,
    t.recommended_rate,
    t.is_recommended,
    t.is_mandatory
FROM dim_textbook t
WHERE t.course_usage_count >= 10
  AND t.satisfaction_rate >= 80
ORDER BY t.course_usage_count DESC, t.satisfaction_rate DESC;
```

#### 3. 查询教材质量评价
```sql
SELECT
    t.title,
    t.primary_author,
    t.publisher_name,
    t.content_quality,
    t.accuracy_rating,
    t.completeness_rating,
    t.readability_rating,
    t.technical_quality,
    t.pedagogical_effectiveness,
    t.review_status,
    CASE
        WHEN t.content_quality >= 90 THEN 'EXCELLENT'
        WHEN t.content_quality >= 80 THEN 'GOOD'
        WHEN t.content_quality >= 70 THEN 'SATISFACTORY'
        ELSE 'NEEDS_IMPROVEMENT'
    END as quality_level
FROM dim_textbook t
WHERE t.review_status = 'APPROVED'
  AND t.textbook_status = 'ACTIVE'
ORDER BY t.content_quality DESC;
```

#### 4. 查询需要重订的教材
```sql
SELECT
    t.title,
    t.textbook_code,
    t.available_stock,
    t.reorder_level,
    t.average_monthly_usage,
    t.procurement_status,
    t.availability_status,
    CASE
        WHEN t.available_stock <= t.reorder_level THEN 'URGENT'
        WHEN t.available_stock <= t.reorder_level * 1.5 THEN 'SOON'
        ELSE 'NORMAL'
    END as reorder_priority
FROM dim_textbook t
WHERE t.textbook_status = 'ACTIVE'
  AND (t.available_stock <= t.reorder_level * 2
       OR t.availability_status = 'LIMITED')
ORDER BY reorder_priority DESC, t.available_stock ASC;
```

#### 5. 查询教材价格分析
```sql
SELECT
    t.subject_category,
    COUNT(*) as textbook_count,
    AVG(t.list_price) as avg_list_price,
    AVG(t.selling_price) as avg_selling_price,
    AVG(t.discount_rate) as avg_discount_rate,
    MIN(t.list_price) as min_price,
    MAX(t.list_price) as max_price,
    SUM(t.course_usage_count) as total_usage
FROM dim_textbook t
WHERE t.textbook_status = 'ACTIVE'
  AND t.price_status = 'ACTIVE'
GROUP BY t.subject_category
ORDER BY total_usage DESC;
```

### 插入示例

#### 1. 创建必修教材
```sql
INSERT INTO dim_textbook (
    textbook_code, isbn, title, subtitle,
    textbook_type, subject_category, language,
    edition, publication_year, publication_month, publication_date,
    primary_author, secondary_authors, publisher_name,
    format_type, page_count, dimensions, weight,
    list_price, purchase_price, selling_price,
    total_stock, available_stock, reorder_level,
    has_ebook, ebook_url,
    content_quality, accuracy_rating, review_status,
    textbook_status, is_recommended, is_mandatory,
    create_by
) VALUES (
    'TB2023001', '978-7-115-12345-6', '数据结构与算法', 'C语言实现',
    'REQUIRED', '计算机科学', '中文',
    '第3版', 2023, 3, '2023-03-15',
    '张明', '[{"name": "李华", "role": "副主编"}, {"name": "王强", "role": "编委"}]', '高等教育出版社',
    'PAPERBACK', 450, '185*260mm', 0.65,
    89.00, 67.00, 89.00,
    200, 180, 50,
    1, 'https://ebook.example.com/tb2023001',
    92.5, 95.2, 'APPROVED',
    'ACTIVE', 1, 1,
    12345
);
```

#### 2. 创建数字教材
```sql
INSERT INTO dim_textbook (
    textbook_code, title, subtitle,
    textbook_type, subject_category, language,
    edition, publication_date,
    primary_author, publisher_name,
    format_type, page_count, word_count,
    list_price, selling_price,
    has_ebook, ebook_url, ebook_format,
    has_online_resources, resource_urls,
    companion_website, mobile_app_available,
    interactive_content, multimedia_resources,
    textbook_status, is_recommended,
    create_by
) VALUES (
    'TB2023002', '计算机网络原理与实践', '数字教材',
    'DIGITAL', '计算机科学', '中文',
    '第2版', '2023-06-01',
    '刘芳', '电子工业出版社',
    'EBOOK', 380, 450000,
    79.00, 79.00,
    1, 'https://ebook.example.com/tb2023002', '["PDF", "EPUB", "MOBI"]',
    1, '["https://resources.example.com/network"]',
    'https://network.example.com', 1,
    1, '{"videos": 15, "animations": 8, "simulations": 5}',
    'ACTIVE', 1,
    12345
);
```

### 更新示例

#### 1. 更新库存信息
```sql
UPDATE dim_textbook
SET total_stock = total_stock - 50,
    available_stock = available_stock - 50,
    student_usage_count = student_usage_count + 50,
    total_distributed = total_distributed + 50,
    current_semester_usage = current_semester_usage + 50,
    stock_turnover_rate = ROUND((student_usage_count + 50) * 12.0 / total_stock, 2),
    update_time = NOW(),
    version = version + 1
WHERE textbook_code = 'TB2023001';
```

#### 2. 更新质量评价
```sql
UPDATE dim_textbook
SET content_quality = ROUND((content_quality * course_usage_count + 88.5) / (course_usage_count + 1), 2),
    accuracy_rating = ROUND((accuracy_rating * course_usage_count + 91.2) / (course_usage_count + 1), 2),
    satisfaction_rate = ROUND((satisfaction_rate * course_usage_count + 85.8) / (course_usage_count + 1), 2),
    recommended_rate = ROUND((recommended_rate * course_usage_count + 87.3) / (course_usage_count + 1), 2),
    review_status = 'APPROVED',
    update_time = NOW(),
    version = version + 1
WHERE id = 1001;
```

#### 3. 更新价格信息
```sql
UPDATE dim_textbook
SET list_price = 95.00,
    selling_price = 85.50,
    discount_rate = 10.00,
    price_status = 'PROMOTIONAL',
    price_effective_date = CURDATE(),
    update_time = NOW(),
    version = version + 1
WHERE textbook_code = 'TB2023001'
  AND publication_year >= 2020;
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：ISBN、教材编码必须唯一
2. **完整性检查**：标题、作者、出版社等关键字段不能为空
3. **逻辑检查**：采购价不能超过销售价，库存逻辑一致
4. **关联检查**：出版社、创建人ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的教材记录
2. **ISBN标准化**：统一ISBN格式
3. **价格修正**：修正不合理的价格信息
4. **库存同步**：同步实际库存和系统库存

## 性能优化

### 索引优化
- ISBN建立唯一索引
- 学科分类和状态建立复合索引
- 库存和使用量建立复合索引

### 查询优化
- 使用覆盖索引优化统计查询
- 避免JSON字段的全表扫描
- 合理使用价格和库存范围过滤

### 存储优化
- 评价数据压缩存储
- 历史库存记录归档
- 定期更新统计字段

## 安全考虑

### 数据保护
- 教材版权信息保护
- 价格信息访问控制
- 库存数据安全管理

### 权限控制
- 教材信息修改需要管理员权限
- 价格调整需要审批权限
- 库存操作需要仓库管理权限

## 扩展说明

### 未来扩展方向
1. **智能推荐**：基于课程和历史数据的教材推荐
2. **库存预测**：基于使用模式的库存需求预测
3. **价格优化**：基于市场分析的动态定价
4. **质量分析**：基于用户评价的质量分析模型

### 兼容性说明
- 支持与图书管理系统对接
- 支持多种教材数据格式
- 支持出版社数据集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*