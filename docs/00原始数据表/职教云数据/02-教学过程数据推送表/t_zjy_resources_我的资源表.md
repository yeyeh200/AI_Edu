# t_zjy_resources 我的资源表

## 基本信息

- **表名**：`t_zjy_resources`
- **中文名称**：我的资源表
- **用途**：个人资源文件管理，存储用户上传的各种教学资源
- **字段数量**：17个
- **数据类别**：教学过程数据推送表 - 资源管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键 |
| user_id | varchar | 50 | NO | - | 用户id |
| name | varchar | 500 | NO | - | 资源名称 |
| parent_id | varchar | 50 | YES | - | 父级id |
| file_type | varchar | 10 | YES | - | 文件类型 |
| file_url | text | 65535 | YES | - | 文件 |
| link_url | text | 65535 | YES | - | 虚拟仿真链接 |
| size | varchar | 255 | YES | - | 文件大小 |
| oss_gen_url | varchar | 255 | YES | - | 查看url |
| oss_ori_url | varchar | 255 | YES | - | 下载url |
| del_flag | varchar | 255 | YES | - | 删除标志（0代表存在 2代表删除） |
| url_short | varchar | 255 | YES | - | 查看文件短网址 |
| create_by | varchar | 64 | YES | - | 创建者 |
| create_time | datetime | - | YES | - | 创建时间 |
| md5 | varchar | 100 | YES | - | 文件oss存储md5值 |
| update_time | datetime | - | YES | - | 修改时间 |
| from_id | varchar | 64 | YES | - | 来源id |
| from_source | smallint | - | YES | - | 来源分类（1：资源库） |

## 字段详细说明

### 主键和关联字段
- **id**：资源记录唯一标识符，主键
- **user_id**：资源所有者用户ID
- **parent_id**：父级资源ID（用于文件夹层级结构）
- **from_id**：来源ID（如从课程、课件等引用）
- **from_source**：来源分类（1：资源库）

### 基本资源信息
- **name**：资源名称
- **file_type**：文件类型（如pdf、doc、mp4等）
- **size**：文件大小

### 资源链接
- **file_url**：文件存储路径
- **link_url**：虚拟仿真链接（用于外部资源链接）
- **oss_gen_url**：查看URL（OSS生成的访问链接）
- **oss_ori_url**：下载URL（原始文件下载链接）
- **url_short**：查看文件短网址（便于分享）

### 技术和安全
- **md5**：文件OSS存储MD5值（用于文件完整性校验）

### 系统管理
- **create_by**：创建者
- **create_time**：创建时间
- **update_time**：修改时间
- **del_flag**：删除标志（0代表存在，2代表删除）

## 文件类型说明

常见的文件类型包括：
- **文档类**：pdf、doc、docx、ppt、pptx、txt
- **图片类**：jpg、jpeg、png、gif、bmp
- **音频类**：mp3、wav、aac、m4a
- **视频类**：mp4、avi、mov、wmv、flv
- **压缩包**：zip、rar、7z、tar
- **其他**：根据实际教学需要

## 资源层级结构

资源支持文件夹层级结构：
- **根目录**：parent_id 为 NULL 或空值
- **子目录**：parent_id 指向父级文件夹ID
- **文件**：parent_id 指向所在文件夹ID

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`user_id` 应引用用户表的有效记录
3. **外键约束**：`parent_id` 应引用同一表中的有效记录（如不为空）
4. **检查约束**：`del_flag` 只能是 '0' 或 '2'
5. **检查约束**：`from_source` 应符合预设分类

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **用户索引**：`user_id` - 用于查询用户资源
- **父级索引**：`parent_id` - 用于构建文件夹层级
- **类型索引**：`file_type` - 用于按文件类型筛选
- **状态索引**：`del_flag` - 过滤有效资源
- **时间索引**：`create_time` - 用于按时间排序

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_resources (
    id, user_id, name, parent_id, file_type, file_url,
    size, oss_gen_url, create_time, md5
) VALUES (
    'RES001', 'USER001', '教学课件.pdf', NULL, 'pdf',
    '/uploads/2024/03/01/teaching.pdf', '2.5MB',
    'https://oss.example.com/teaching.pdf',
    '2024-03-01 10:00:00', 'd41d8cd98f00b204e9800998ecf8427e'
);
```

### 查询示例
```sql
-- 查询用户的资源列表
SELECT * FROM t_zjy_resources
WHERE user_id = 'USER001' AND del_flag = '0'
ORDER BY create_time DESC;

-- 查询某文件夹下的资源
SELECT * FROM t_zjy_resources
WHERE user_id = 'USER001' AND parent_id = 'FOLDER001' AND del_flag = '0'
ORDER BY name;

-- 按文件类型统计
SELECT file_type, COUNT(*) as count, SUM(CAST(size AS DECIMAL(10,2))) as total_size
FROM t_zjy_resources
WHERE user_id = 'USER001' AND del_flag = '0'
GROUP BY file_type;
```

### 层级查询示例
```sql
-- 查询文件夹层级结构（使用递归查询）
WITH RECURSIVE folder_tree AS (
    SELECT id, name, parent_id, 0 as level
    FROM t_zjy_resources
    WHERE user_id = 'USER001' AND parent_id IS NULL AND del_flag = '0'

    UNION ALL

    SELECT r.id, r.name, r.parent_id, ft.level + 1
    FROM t_zjy_resources r
    JOIN folder_tree ft ON r.parent_id = ft.id
    WHERE r.user_id = 'USER001' AND r.del_flag = '0'
)
SELECT * FROM folder_tree
ORDER BY level, name;
```

## 业务逻辑说明

### 资源管理
1. **上传资源**：用户上传文件到系统，生成多个访问链接
2. **文件夹管理**：支持创建文件夹层级结构
3. **资源共享**：通过短网址分享资源
4. **版本控制**：通过MD5值检测重复文件

### 存储管理
1. **OSS存储**：文件存储在对象存储服务中
2. **多链接支持**：生成查看、下载等不同用途的链接
3. **文件校验**：使用MD5确保文件完整性
4. **大小限制**：根据不同文件类型设置大小限制

### 权限控制
1. **用户隔离**：每个用户只能访问自己的资源
2. **来源追踪**：记录资源的来源和用途
3. **删除管理**：使用逻辑删除，保护数据安全

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送