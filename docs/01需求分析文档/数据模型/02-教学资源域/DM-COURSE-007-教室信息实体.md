# 教室信息实体 (Classroom)

---

**实体编号：** DM-COURSE-007
**实体名称：** 教室信息实体
**所属域：** 教学资源域
**创建日期：** 2025-11-23
**版本：** V1.0
**维护人：** 数据建模团队

---

## 实体概述

教室信息实体是AI助评应用教学资源管理的重要实体，定义了学校的教学场所资源。该实体包含教室基本信息、设施配置、使用安排、维护记录等，为课程安排、教室调度、资源管理、教学活动等提供教室维度支撑。

## 实体定义

### 表名
- **物理表名：** `dim_classroom`
- **业务表名：** 教室信息表
- **数据类型：** 维度表

### 主要用途
- 定义教室基本信息
- 管理教室设施配置
- 支持教室使用调度
- 提供教室统计分析

## 字段定义

### 主键字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| id | BIGINT | 20 | NOT NULL | AUTO_INCREMENT | 教室唯一标识ID |

### 基础信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| classroom_code | VARCHAR | 50 | NOT NULL | '' | 教室编码（系统唯一） |
| classroom_name | VARCHAR | 100 | NOT NULL | '' | 教室名称 |
| classroom_type | ENUM | - | NOT NULL | 'REGULAR' | 教室类型 |
| building_code | VARCHAR | 20 | NOT NULL | '' | 楼栋编码 |
| building_name | VARCHAR | 100 | NOT NULL | '' | 楼栋名称 |
| floor_number | INT | 11 | NOT NULL | 1 | 楼层号 |
| room_number | VARCHAR | 20 | NOT NULL | '' | 房间号 |
| area_size | DECIMAL | 8,2 | NOT NULL | 0.00 | 面积（平方米） |
| capacity | INT | 11 | NOT NULL | 40 | 标准容量 |

### 位置信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| campus_id | BIGINT | 20 | NULL | NULL | 校区ID |
| campus_name | VARCHAR | 100 | NULL | NULL | 校区名称 |
| faculty_id | BIGINT | 20 | NULL | NULL | 所属院系ID |
| faculty_name | VARCHAR | 200 | NULL | NULL | 所属院系名称 |
| department_id | BIGINT | 20 | NULL | NULL | 所属教研室ID |
| department_name | VARCHAR | 200 | NULL | NULL | 所属教研室名称 |
| location_description | VARCHAR | 300 | NULL | NULL | 位置描述 |
| coordinates_lat | DECIMAL | 10,8 | NULL | NULL | 纬度坐标 |
| coordinates_lng | DECIMAL | 11,8 | NULL | NULL | 经度坐标 |

### 设施配置字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| seating_type | ENUM | - | NOT NULL | 'FIXED' | 座位类型 |
| seat_count | INT | 11 | NOT NULL | 0 | 座位数量 |
| seating_arrangement | VARCHAR | 100 | NULL | NULL | 座位布局 |
| podium_equipment | JSON | - | NULL | NULL | 讲台设备 |
| projection_equipment | JSON | - | NULL | NULL | 投影设备 |
| audio_equipment | JSON | - | NULL | NULL | 音响设备 |
| network_equipment | JSON | - | NULL | NULL | 网络设备 |
| lighting_equipment | JSON | - | NULL | NULL | 照明设备 |
| air_conditioning | TINYINT | 1 | NOT NULL | 0 | 空调设备 |
| heating_system | TINYINT | 1 | NOT NULL | 0 | 供暖系统 |
| ventilation_system | TINYINT | 1 | NOT NULL | 0 | 通风系统 |

### 教学支持字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| blackboard_type | ENUM | - | NULL | NULL | 黑板类型 |
| whiteboard_count | INT | 11 | NULL | 0 | 白板数量 |
| smart_board | TINYINT | 1 | NOT NULL | 0 | 智能黑板 |
| computer_count | INT | 11 | NULL | 0 | 电脑数量 |
| internet_access | TINYINT | 1 | NOT NULL | 0 | 网络接入 |
| wifi_available | TINYINT | 1 | NOT NULL | 0 | WiFi覆盖 |
| power_outlets | INT | 11 | NULL | 0 | 电源插座数 |
| usb_ports | INT | 11 | NULL | 0 | USB端口数 |
| hdmi_ports | INT | 11 | NULL | 0 | HDMI端口数 |

### 特殊用途字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| special_purpose | ENUM | - | NULL | NULL | 特殊用途 |
| lab_equipment | JSON | - | NULL | NULL | 实验设备 |
| safety_facilities | JSON | - | NULL | NULL | 安全设施 |
| accessibility_features | JSON | - | NULL | NULL | 无障碍设施 |
| recording_equipment | TINYINT | 1 | NOT NULL | 0 | 录音录像设备 |
| surveillance_system | TINYINT | 1 | NOT NULL | 0 | 监控系统 |
| emergency_exit | TINYINT | 1 | NOT NULL | 0 | 紧急出口 |
| fire_safety | JSON | - | NULL | NULL | 消防安全 |

### 使用管理字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| usage_status | ENUM | - | NOT NULL | 'AVAILABLE' | 使用状态 |
| booking_status | ENUM | - | NOT NULL | 'OPEN' | 预订状态 |
| manager_id | BIGINT | 20 | NULL | NULL | 管理员ID |
| manager_name | VARCHAR | 100 | NULL | NULL | 管理员姓名 |
| contact_phone | VARCHAR | 20 | NULL | NULL | 联系电话 |
| usage_rules | TEXT | - | NULL | NULL | 使用规则 |
| booking_rules | TEXT | - | NULL | NULL | 预订规则 |
| maintenance_schedule | JSON | - | NULL | NULL | 维护计划 |

### 时间信息字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| available_time_start | TIME | - | NULL | '08:00:00' | 可用开始时间 |
| available_time_end | TIME | - | NULL | '22:00:00' | 可用结束时间 |
| unavailable_periods | JSON | - | NULL | NULL | 不可用时段 |
| last_maintenance_time | DATETIME | - | NULL | NULL | 最后维护时间 |
| next_maintenance_time | DATETIME | - | NULL | NULL | 下次维护时间 |
| inspection_frequency | INT | 11 | NULL | 30 | 检查频率（天） |
| last_inspection_time | DATETIME | - | NULL | NULL | 最后检查时间 |

### 统计字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| total_usage_hours | INT | 11 | NULL | 0 | 总使用时长（小时） |
| monthly_usage_hours | INT | 11 | NULL | 0 | 月使用时长 |
| weekly_usage_hours | INT | 11 | NULL | 0 | 周使用时长 |
| utilization_rate | DECIMAL | 5,2 | NULL | 0.00 | 利用率（百分比） |
| booking_count | INT | 11 | NULL | 0 | 预订次数 |
| actual_usage_count | INT | 11 | NULL | 0 | 实际使用次数 |
| cancellation_count | INT | 11 | NULL | 0 | 取消次数 |
| maintenance_count | INT | 11 | NULL | 0 | 维护次数 |
| equipment_failure_count | INT | 11 | NULL | 0 | 设备故障次数 |
| user_satisfaction | DECIMAL | 5,2 | NULL | 0.00 | 用户满意度 |

### 状态控制字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| classroom_status | ENUM | - | NOT NULL | 'ACTIVE' | 教室状态 |
| equipment_status | ENUM | - | NULL | NULL | 设备状态 |
| safety_status | ENUM | - | NULL | NULL | 安全状态 |
| cleanliness_status | ENUM | - | NULL | NULL | 清洁状态 |
| is_accessible | TINYINT | 1 | NOT NULL | 0 | 是否可用 |
| is_bookable | TINYINT | 1 | NOT NULL | 1 | 是否可预订 |
| requires_approval | TINYINT | 1 | NOT NULL | 0 | 需要审批 |
| priority_level | ENUM | - | NULL | NULL | 优先级别 |

### 系统字段

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|----------|------|----------|--------|------|
| create_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| update_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | NULL | NULL | 创建人ID |
| update_by | BIGINT | 20 | NULL | NULL | 更新人ID |
| version | INT | 11 | NOT NULL | 1 | 版本号（乐观锁） |
| qr_code | VARCHAR | 200 | NULL | NULL | 二维码 |
| external_id | VARCHAR | 100 | NULL | NULL | 外部系统ID |
| sync_time | DATETIME | - | NULL | NULL | 同步时间 |

## 约束定义

### 主键约束
```sql
PRIMARY KEY (id)
```

### 唯一约束
```sql
UNIQUE KEY uk_classroom_code (classroom_code)
UNIQUE KEY uk_building_floor_room (building_code, floor_number, room_number)
```

### 外键约束
```sql
FOREIGN KEY (campus_id) REFERENCES dim_campus(id) ON DELETE SET NULL
FOREIGN KEY (faculty_id) REFERENCES dim_faculty(id) ON DELETE SET NULL
FOREIGN KEY (department_id) REFERENCES dim_department(id) ON DELETE SET NULL
FOREIGN KEY (manager_id) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (create_by) REFERENCES dim_user(id) ON DELETE SET NULL
FOREIGN KEY (update_by) REFERENCES dim_user(id) ON DELETE SET NULL
```

### 普通索引
```sql
INDEX idx_building_code (building_code)
INDEX idx_floor_number (floor_number)
INDEX idx_classroom_type (classroom_type)
INDEX idx_usage_status (usage_status)
INDEX idx_booking_status (booking_status)
INDEX idx_classroom_status (classroom_status)
INDEX idx_capacity (capacity)
INDEX idx_area_size (area_size)
INDEX idx_utilization_rate (utilization_rate)
INDEX idx_create_time (create_time)
```

### 复合索引
```sql
INDEX idx_status_type (usage_status, classroom_type)
INDEX idx_building_capacity (building_code, capacity)
INDEX idx_utilization_status (utilization_rate, usage_status)
```

### 检查约束
```sql
CHECK (classroom_type IN ('REGULAR', 'LECTURE', 'LAB', 'COMPUTER', 'MULTIMEDIA', 'SEMINAR', 'CONFERENCE', 'STUDIO', 'WORKSHOP', 'EXAM'))
CHECK (seating_type IN ('FIXED', 'MOVABLE', 'FLEXIBLE', 'THEATER', 'CLASSROOM', 'U_SHAPE', 'CONFERENCE'))
CHECK (blackboard_type IN ('TRADITIONAL', 'WHITE', 'GREEN', 'NONE'))
CHECK (special_purpose IN ('NONE', 'COMPUTER_LAB', 'LANGUAGE_LAB', 'SCIENCE_LAB', 'ART_STUDIO', 'MUSIC_ROOM', 'GYMNASIUM', 'LIBRARY'))
CHECK (usage_status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'UNDER_REPAIR', 'CLOSED', 'RESERVED'))
CHECK (booking_status IN ('OPEN', 'CLOSED', 'RESTRICTED', 'APPROVAL_REQUIRED'))
CHECK (classroom_status IN ('ACTIVE', 'INACTIVE', 'UNDER_CONSTRUCTION', 'RENOVATION', 'DECOMMISSIONED'))
CHECK (equipment_status IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'MAINTENANCE_REQUIRED'))
CHECK (safety_status IN ('SAFE', 'CAUTION', 'UNSAFE', 'INSPECTION_REQUIRED'))
CHECK (cleanliness_status IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CLEANING_REQUIRED'))
CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'))
CHECK (is_accessible IN (0, 1))
CHECK (is_bookable IN (0, 1))
CHECK (requires_approval IN (0, 1))
CHECK (floor_number > 0)
CHECK (area_size > 0)
CHECK (capacity > 0)
CHECK (seat_count >= 0)
CHECK (utilization_rate BETWEEN 0 AND 100)
CHECK (user_satisfaction BETWEEN 0 AND 100)
```

## 枚举值定义

### 教室类型 (classroom_type)
| 值 | 说明 | 备注 |
|----|------|------|
| REGULAR | 普通教室 | 常规教学教室 |
| LECTURE | 讲堂 | 大型演讲教室 |
| LAB | 实验室 | 实验教学教室 |
| COMPUTER | 机房 | 计算机教室 |
| MULTIMEDIA | 多媒体 | 多功能教室 |
| SEMINAR | 研讨室 | 小组研讨教室 |
| CONFERENCE | 会议室 | 会议室 |
| STUDIO | 工作室 | 专业工作室 |
| WORKSHOP | 实训室 | 实训教室 |
| EXAM | 考场 | 专用考场 |

### 座位类型 (seating_type)
| 值 | 说明 | 备注 |
|----|------|------|
| FIXED | 固定 | 固定座位 |
| MOVABLE | 活动 | 活动座位 |
| FLEXIBLE | 灵活 | 灵活布局 |
| THEATER | 剧场 | 阶梯式座位 |
| CLASSROOM | 教室 | 传统教室布局 |
| U_SHAPE | U形 | U形布局 |
| CONFERENCE | 会议 | 会议式布局 |

### 黑板类型 (blackboard_type)
| 值 | 说明 | 备注 |
|----|------|------|
| TRADITIONAL | 传统黑板 | 粉笔黑板 |
| WHITE | 白板 | 白板 |
| GREEN | 绿板 | 绿板 |
| NONE | 无黑板 | 无黑板设备 |

### 特殊用途 (special_purpose)
| 值 | 说明 | 备注 |
|----|------|------|
| NONE | 无特殊用途 | 普通教室 |
| COMPUTER_LAB | 计算机实验室 | 电脑教室 |
| LANGUAGE_LAB | 语言实验室 | 语言教室 |
| SCIENCE_LAB | 科学实验室 | 理科实验室 |
| ART_STUDIO | 艺术工作室 | 艺术教室 |
| MUSIC_ROOM | 音乐教室 | 音乐教室 |
| GYMNASIUM | 体育馆 | 体育教室 |
| LIBRARY | 图书馆 | 自习教室 |

### 使用状态 (usage_status)
| 值 | 说明 | 备注 |
|----|------|------|
| AVAILABLE | 可用 | 可以使用 |
| OCCUPIED | 使用中 | 正在使用 |
| MAINTENANCE | 维护中 | 维护状态 |
| UNDER_REPAIR | 维修中 | 设备维修 |
| CLOSED | 关闭 | 暂时关闭 |
| RESERVED | 预订 | 已被预订 |

### 教室状态 (classroom_status)
| 值 | 说明 | 备注 |
|----|------|------|
| ACTIVE | 活跃 | 正常使用 |
| INACTIVE | 非活跃 | 暂停使用 |
| UNDER_CONSTRUCTION | 建设中 | 新建教室 |
| RENOVATION | 装修中 | 装修改造 |
| DECOMMISSIONED | 废弃 | 不再使用 |

## 关联关系

### 多对一关系（作为从表）
- **Classroom → Campus**：教室属于校区
- **Classroom → Faculty**：教室属于院系
- **Classroom → Department**：教室属于教研室
- **Classroom → User（manager）**：教室有管理员

### 一对多关系（作为主表）
- **Classroom → Schedule**：一个教室有多个课程安排
- **Classroom → TeachingActivity**：一个教室有多个教学活动
- **Classroom → Exam**：一个教室有多个考试安排
- **Classroom → ClassroomBooking**：一个教室有多个预订记录

## 使用示例

### 查询示例

#### 1. 查询教室使用统计
```sql
SELECT
    c.classroom_name,
    c.building_name,
    c.classroom_type,
    c.capacity,
    c.total_usage_hours,
    c.utilization_rate,
    c.booking_count,
    c.actual_usage_count,
    c.user_satisfaction,
    c.equipment_status
FROM dim_classroom c
WHERE c.classroom_status = 'ACTIVE'
  AND c.usage_status = 'AVAILABLE'
ORDER BY c.utilization_rate DESC;
```

#### 2. 查询教室设施配置
```sql
SELECT
    classroom_name,
    classroom_type,
    seating_type,
    seat_count,
    smart_board,
    computer_count,
    internet_access,
    wifi_available,
    air_conditioning,
    projection_equipment,
    audio_equipment,
    network_equipment
FROM dim_classroom
WHERE classroom_type IN ('MULTIMEDIA', 'COMPUTER', 'LAB')
  AND classroom_status = 'ACTIVE'
ORDER BY capacity DESC;
```

#### 3. 查询教室维护情况
```sql
SELECT
    c.classroom_name,
    c.building_name,
    c.equipment_status,
    c.safety_status,
    c.cleanliness_status,
    c.last_maintenance_time,
    c.next_maintenance_time,
    c.maintenance_count,
    c.equipment_failure_count,
    CASE
        WHEN c.next_maintenance_time <= DATE_ADD(NOW(), INTERVAL 7 DAY) THEN 'IMMEDIATE'
        WHEN c.next_maintenance_time <= DATE_ADD(NOW(), INTERVAL 30 DAY) THEN 'SOON'
        ELSE 'NORMAL'
    END as maintenance_priority
FROM dim_classroom c
WHERE c.classroom_status = 'ACTIVE'
  AND (c.equipment_status IN ('POOR', 'MAINTENANCE_REQUIRED')
       OR c.safety_status != 'SAFE'
       OR c.next_maintenance_time <= DATE_ADD(NOW(), INTERVAL 30 DAY))
ORDER BY maintenance_priority DESC;
```

#### 4. 查询教室预订情况
```sql
SELECT
    c.classroom_name,
    c.classroom_type,
    c.capacity,
    c.booking_status,
    c.booking_count,
    c.cancellation_count,
    c.requires_approval,
    c.utilization_rate,
    c.monthly_usage_hours,
    CASE
        WHEN c.utilization_rate >= 80 THEN 'HIGH_UTILIZATION'
        WHEN c.utilization_rate >= 50 THEN 'MEDIUM_UTILIZATION'
        ELSE 'LOW_UTILIZATION'
    END as utilization_level
FROM dim_classroom c
WHERE c.classroom_status = 'ACTIVE'
  AND c.is_bookable = 1
ORDER BY c.utilization_rate DESC;
```

#### 5. 查询无障碍教室
```sql
SELECT
    c.classroom_name,
    c.building_name,
    c.classroom_type,
    c.capacity,
    c.accessibility_features,
    c.emergency_exit,
    c.safety_facilities,
    c.location_description,
    c.contact_phone
FROM dim_classroom c
WHERE c.is_accessible = 1
  AND c.classroom_status = 'ACTIVE'
  AND c.safety_status = 'SAFE'
ORDER BY c.building_name, c.classroom_name;
```

### 插入示例

#### 1. 创建普通教室
```sql
INSERT INTO dim_classroom (
    classroom_code, classroom_name, classroom_type,
    building_code, building_name, floor_number, room_number,
    area_size, capacity, seating_type, seat_count,
    smart_board, computer_count, internet_access, wifi_available,
    air_conditioning, projection_equipment, audio_equipment,
    usage_status, booking_status, classroom_status,
    create_by
) VALUES (
    'A栋101', 'A栋101教室', 'REGULAR',
    'A', 'A栋教学楼', 1, '101',
    80.50, 60, 'FIXED', 60,
    1, 1, 1, 1,
    1, '{"projector": 1, "screen": 1}', '{"speakers": 4, "microphone": 2}',
    'AVAILABLE', 'OPEN', 'ACTIVE',
    12345
);
```

#### 2. 创建多媒体教室
```sql
INSERT INTO dim_classroom (
    classroom_code, classroom_name, classroom_type,
    building_code, building_name, floor_number, room_number,
    area_size, capacity, seating_type, seat_count,
    smart_board, computer_count, internet_access, wifi_available,
    hdmi_ports, usb_ports, audio_equipment,
    recording_equipment, network_equipment,
    usage_status, booking_status, classroom_status,
    create_by
) VALUES (
    'B栋201', 'B栋201多媒体教室', 'MULTIMEDIA',
    'B', 'B栋实验楼', 2, '201',
    120.00, 80, 'FLEXIBLE', 80,
    1, 0, 1, 1,
    4, 8, '{"speakers": 6, "microphone": 4, "mixer": 1}',
    1, '{"switch": 1, "access_points": 2}',
    'AVAILABLE', 'OPEN', 'ACTIVE',
    12345
);
```

### 更新示例

#### 1. 更新教室使用统计
```sql
UPDATE dim_classroom
SET total_usage_hours = total_usage_hours + 2,
    weekly_usage_hours = weekly_usage_hours + 2,
    monthly_usage_hours = monthly_usage_hours + 2,
    booking_count = booking_count + 1,
    actual_usage_count = actual_usage_count + 1,
    utilization_rate = ROUND((total_usage_hours + 2) * 100.0 / (40 * 5 * 4), 2),
    update_time = NOW(),
    version = version + 1
WHERE id = 1001;
```

#### 2. 更新设备状态
```sql
UPDATE dim_classroom
SET equipment_status = 'MAINTENANCE_REQUIRED',
    equipment_failure_count = equipment_failure_count + 1,
    maintenance_count = maintenance_count + 1,
    last_maintenance_time = NOW(),
    next_maintenance_time = DATE_ADD(NOW(), INTERVAL 3 DAY),
    update_time = NOW(),
    version = version + 1
WHERE id = 1001
  AND equipment_failure_count > 0;
```

#### 3. 更新用户满意度
```sql
UPDATE dim_classroom
SET user_satisfaction = ROUND((user_satisfaction * booking_count + 85.5) / (booking_count + 1), 2),
    update_time = NOW(),
    version = version + 1
WHERE id = 1001;
```

## 数据质量

### 质量检查规则
1. **唯一性检查**：教室编码、楼栋+楼层+房间号必须唯一
2. **完整性检查**：基础信息、位置信息等关键字段不能为空
3. **逻辑检查**：座位数不能超过容量，面积与容量匹配
4. **关联检查**：院系、管理员ID必须存在

### 数据清洗规则
1. **重复数据处理**：合并重复的教室定义
2. **编码标准化**：统一教室编码格式
3. **设施修正**：修正设施配置信息
4. **状态同步**：同步教室状态和使用状态

## 性能优化

### 索引优化
- 教室编码建立唯一索引
- 楼栋和容量建立复合索引
- 使用状态和教室类型建立复合索引

### 查询优化
- 使用覆盖索引优化统计查询
- 避免JSON字段的全表扫描
- 合理使用状态和时间过滤

### 存储优化
- JSON字段压缩存储
- 定期更新统计字段
- 历史预订数据归档

## 安全考虑

### 数据保护
- 教室安全设施信息保护
- 监控设备访问控制
- 维护记录隐私保护

### 权限控制
- 教室信息修改需要管理员权限
- 预订权限分级控制
- 安全检查记录特殊权限

## 扩展说明

### 未来扩展方向
1. **智能调度**：基于AI的教室智能调度
2. **实时监控**：教室使用状态实时监控
3. **能耗管理**：教室能源使用监控
4. **虚拟教室**：线上线下混合教室管理

### 兼容性说明
- 支持与教室管理系统对接
- 支持多种预订系统集成
- 支持设备监控平台集成

---

**文档维护：** 数据建模团队
**最后更新：** 2025-11-23
**审核状态：** 待审核

*此文档为AI助评应用数据模型的核心文档，如有疑问请联系数据建模团队。*