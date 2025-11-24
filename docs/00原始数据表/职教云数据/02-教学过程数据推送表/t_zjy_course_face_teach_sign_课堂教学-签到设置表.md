# t_zjy_course_face_teach_sign 课堂教学-签到设置表

## 基本信息

- **表名**：`t_zjy_course_face_teach_sign`
- **中文名称**：课堂教学-签到设置表
- **用途**：课堂签到活动设置，包括签到类型、时间、统计信息等
- **字段数量**：27个
- **数据类别**：教学过程数据推送表 - 课堂教学活动类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| id | varchar | 50 | NO | - | 主键 |
| course_id | varchar | 50 | NO | - | 课程id |
| course_info_id | varchar | 50 | YES | - | 开课id |
| class_id | mediumtext | 16777215 | NO | - | 班级id |
| teach_id | varchar | 50 | NO | - | 课堂教学id |
| title | varchar | 500 | NO | - | 签到标题 |
| auto_end | char | 1 | YES | - | 自动结束（1：自动，0：不自动） |
| sign_type | char | 2 | YES | - | 签到类型（1：一键签到，2：手势签到，3：扫码签到，4：拍照签到） |
| gesture | varchar | 255 | YES | - | 手势 |
| qr_code | longtext | 4294967295 | YES | - | 二维码base64 |
| qr_code_number | bigint | - | YES | - | 验证二维码是否有效值 |
| photo_url | text | 65535 | YES | - | 照片url |
| start_time | datetime | - | YES | - | 开始时间 |
| end_time | datetime | - | YES | - | 结束时间 |
| class_count | int | - | YES | - | 班级人数 |
| absence_count | int | - | YES | - | 缺勤人数 |
| sign_count | int | - | YES | - | 签到人数 |
| late_count | int | - | YES | - | 迟到人数 |
| personal_count | int | - | YES | - | 事假人数 |
| early_count | int | - | YES | - | 早退人数 |
| sick_count | int | - | YES | - | 病假人数 |
| public_count | int | - | YES | - | 公假人数 |
| require_type | char | 1 | NO | - | 类型（1：课前，2：课中，3：课后） |
| create_by | varchar | 50 | YES | - | 创建人 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_by | varchar | 50 | YES | - | 修改人 |
| update_time | datetime | - | NO | - | 修改时间 |
| state | char | 1 | NO | - | 状态：0未开始，1进行中，2已结束 |
| error_number | int | - | YES | - | 最高错误次数 |
| set_error_number | char | 1 | YES | - | 0 表示不设置最高错误次数，1 表示设置 |
| source | varchar | 50 | YES | - | 来源 |
| is_merge | char | 1 | YES | - | 是否合并（0：未合并 1：已合并） |
| redis_state | char | 1 | YES | - | 0:未同步，1同步 |
| is_delete | char | 1 | YES | - | 是否删除 0未删除，1删除 |
| del_flag | char | 2 | YES | - | 删除标识0未删除2已删除 |

## 字段详细说明

### 主键和关联字段
- **id**：签到设置记录唯一标识符，主键
- **course_id**：课程ID，关联课程信息
- **course_info_id**：开课ID，关联开课信息
- **class_id**：班级ID，支持多个班级（mediumtext）
- **teach_id**：课堂教学ID，关联具体课堂教学活动

### 基本签到设置
- **title**：签到标题
- **require_type**：签到时段类型（1：课前，2：课中，3：课后）
- **auto_end**：是否自动结束签到（1：自动，0：不自动）
- **state**：签到状态（0未开始，1进行中，2已结束）

### 签到类型和方式
- **sign_type**：签到类型
  - 1：一键签到
  - 2：手势签到
  - 3：扫码签到
  - 4：拍照签到
- **gesture**：手势设置（手势签到时使用）
- **qr_code**：二维码图片（base64编码）
- **qr_code_number**：二维码验证数值
- **photo_url**：照片URL（拍照签到时使用）

### 时间设置
- **start_time**：签到开始时间
- **end_time**：签到结束时间

### 统计信息
- **class_count**：班级总人数
- **absence_count**：缺勤人数
- **sign_count**：实际签到人数
- **late_count**：迟到人数
- **personal_count**：事假人数
- **early_count**：早退人数
- **sick_count**：病假人数
- **public_count**：公假人数

### 安全和验证设置
- **error_number**：最高错误次数
- **set_error_number**：是否设置最高错误次数（0：不设置，1：设置）

### 系统管理字段
- **create_by**：创建人
- **update_by**：修改人
- **create_time**：创建时间
- **update_time**：修改时间（必填）
- **source**：来源标识
- **is_merge**：是否合并标识
- **redis_state**：Redis同步状态
- **is_delete**：是否删除
- **del_flag**：删除标识（0未删除，2已删除）

## 签到类型说明

| sign_type值 | 类型说明 | 使用场景 |
|-------------|----------|----------|
| 1 | 一键签到 | 简单快速的签到方式 |
| 2 | 手势签到 | 学生输入特定手势进行签到 |
| 3 | 扫码签到 | 扫描教师显示的二维码签到 |
| 4 | 拍照签到 | 需要拍照验证身份的签到 |

## 签到状态说明

| state值 | 状态说明 | 学生操作 |
|----------|----------|----------|
| 0 | 未开始 | 签到尚未开始，学生无法签到 |
| 1 | 进行中 | 签到进行中，学生可以签到 |
| 2 | 已结束 | 签到已结束，学生无法签到 |

## 数据约束

1. **主键约束**：`id` 字段必须唯一且非空
2. **外键约束**：`course_id`、`course_info_id`、`teach_id` 应引用相应表的有效记录
3. **检查约束**：`sign_type` 只能是 1-4
4. **检查约束**：`require_type` 只能是 1-3
5. **检查约束**：`state` 只能是 0-2

## 索引建议

- **主键索引**：`id` - 主键自动创建唯一索引
- **关联索引**：`course_id` - 外键索引
- **关联索引**：`course_info_id` - 外键索引
- **关联索引**：`teach_id` - 外键索引
- **状态索引**：`state, del_flag` - 复合索引
- **时间索引**：`start_time, end_time` - 时间索引

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_course_face_teach_sign (
    id, course_id, course_info_id, class_id, teach_id, title,
    sign_type, start_time, end_time, require_type, state,
    create_time, update_time
) VALUES (
    'SIGN001', 'COURSE001', 'INFO001', 'CLASS001', 'TEACH001',
    '第一次课堂签到', '3', '2024-03-01 08:55:00', '2024-03-01 09:05:00',
    '2', '0', '2024-03-01 08:50:00', '2024-03-01 08:50:00'
);
```

### 查询示例
```sql
-- 查询某课程的签到设置
SELECT * FROM t_zjy_course_face_teach_sign
WHERE course_id = 'COURSE001'
ORDER BY create_time DESC;

-- 查询进行中的签到
SELECT * FROM t_zjy_course_face_teach_sign
WHERE state = '1' AND del_flag = '0';
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送