# t_zjy_sys_notice 通知公告表

## 基本信息

- **表名**：`t_zjy_sys_notice`
- **中文名称**：通知公告表
- **用途**：系统通知和公告信息管理，用于职教云平台内部信息发布
- **字段数量**：10个
- **数据类别**：教学过程数据推送表 - 系统管理类

## 字段定义

| 字段名 | 数据类型 | 字段最大长度 | 是否为空 | 默认值 | 备注 |
|--------|----------|--------------|----------|--------|------|
| notice_id | int | - | NO | - | 公告ID |
| notice_title | varchar | 50 | NO | - | 公告标题 |
| notice_type | char | 1 | NO | - | 公告类型（1通知 2公告） |
| notice_content | longblob | 4294967295 | YES | - | 公告内容 |
| status | char | 1 | YES | - | 公告状态（0正常 1关闭） |
| create_by | varchar | 64 | YES | - | 创建者 |
| create_time | datetime | - | YES | - | 创建时间 |
| update_by | varchar | 64 | YES | - | 更新者 |
| update_time | datetime | - | YES | - | 更新时间 |
| remark | varchar | 255 | YES | - | 备注 |

## 字段详细说明

### 主键字段
- **notice_id**：公告唯一标识符，主键，int类型，自增

### 基本业务字段
- **notice_title**：公告标题，必填
- **notice_type**：公告类型，'1'表示通知，'2'表示公告
- **notice_content**：公告内容，longblob类型，支持大量内容存储
- **status**：公告状态，'0'表示正常显示，'1'表示关闭

### 管理字段
- **create_by**：公告创建者
- **update_by**：公告最后更新者
- **create_time**：公告创建时间
- **update_time**：公告最后更新时间
- **remark**：公告相关备注信息

## 公告类型说明

| notice_type值 | 类型说明 | 使用场景 |
|---------------|----------|----------|
| 1 | 通知 | 一般性通知信息 |
| 2 | 公告 | 重要公告事项 |

## 公告状态说明

| status值 | 状态说明 | 显示效果 |
|----------|----------|----------|
| 0 | 正常 | 正常显示给用户 |
| 1 | 关闭 | 不显示，已下线 |

## 数据约束

1. **主键约束**：`notice_id` 字段必须唯一且非空
2. **非空约束**：`notice_title` 和 `notice_type` 为必填字段
3. **检查约束**：`notice_type` 只能是 '1' 或 '2'
4. **检查约束**：`status` 只能是 '0' 或 '1'

## 索引建议

- **主键索引**：`notice_id` - 主键自动创建唯一索引
- **类型索引**：`notice_type` - 用于按公告类型查询
- **状态索引**：`status` - 用于过滤有效公告
- **时间索引**：`create_time` - 用于按时间排序查询

## 使用示例

### SQL插入示例
```sql
INSERT INTO t_zjy_sys_notice (
    notice_title, notice_type, notice_content, status,
    create_by, create_time, update_by, update_time, remark
) VALUES (
    '系统维护通知', '1', '系统将于今晚22:00进行维护，预计持续2小时', '0',
    'ADMIN', '2024-01-01 10:00:00', 'ADMIN', '2024-01-01 10:00:00', '定期维护'
);
```

### 查询示例
```sql
-- 查询所有正常公告
SELECT * FROM t_zjy_sys_notice
WHERE status = '0'
ORDER BY create_time DESC;

-- 查询通知类型公告
SELECT * FROM t_zjy_sys_notice
WHERE notice_type = '1' AND status = '0';
```

---

**数据来源**：职教云平台内部数据
**推送方向**：职教云平台 → 中间数据库 → 校方数据分析平台
**更新频率**：实时推送或定时批量推送