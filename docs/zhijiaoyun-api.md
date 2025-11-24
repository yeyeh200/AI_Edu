# 职教云API集成文档

## 概述

本文档描述了AI助评系统与职教云平台的API集成方案，包括配置、使用方法和技术细节。

## 🔧 配置说明

### 环境变量配置

在 `.env` 文件中添加以下配置：

```bash
# 职教云API配置
ZJIJAOYUN_BASE_URL=https://api.zhijiaoyun.com
ZJIJAOYUN_API_KEY=your_api_key_here
ZJIJAOYUN_API_SECRET=your_api_secret_here
```

### 配置参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `ZJIJAOYUN_BASE_URL` | string | 是 | 职教云API基础URL |
| `ZJIJAOYUN_API_KEY` | string | 是 | API密钥 |
| `ZJIJAOYUN_API_SECRET` | string | 是 | API密钥 |

### 高级配置

在 `backend/src/config/config.ts` 中可以调整以下参数：

```typescript
zhijiaoyun: {
  baseUrl: Deno.env.get('ZJIJAOYUN_BASE_URL') || 'https://api.zhijiaoyun.com',
  apiKey: Deno.env.get('ZJIJAOYUN_API_KEY') || '',
  apiSecret: Deno.env.get('ZJIJAOYUN_API_SECRET') || '',
  timeout: 30000,          // 请求超时时间（毫秒）
  retryAttempts: 3,        // 重试次数
  retryDelay: 1000,        // 重试延迟（毫秒）
}
```

## 📡 API接口

### 认证

所有API请求都需要在请求头中包含JWT令牌：

```bash
Authorization: Bearer <your_jwt_token>
```

### 健康检查

检查职教云API连接状态：

```http
GET /api/zhijiaoyun/health
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "connection": true,
    "lastSyncTime": "2024-01-20T10:30:00.000Z"
  },
  "message": "API连接正常"
}
```

### 用户管理

#### 获取用户列表

```http
GET /api/zhijiaoyun/users?page=1&pageSize=20&keyword=张&role=teacher
```

**查询参数：**
- `page`: 页码（默认：1）
- `pageSize`: 每页数量（默认：20，最大：100）
- `keyword`: 搜索关键词（可选）
- `role`: 用户角色（可选：admin/teacher/student）
- `departmentId`: 部门ID（可选）
- `status`: 用户状态（可选：active/inactive/suspended）

#### 获取单个用户

```http
GET /api/zhijiaoyun/users/{userId}
```

### 课程管理

#### 获取课程列表

```http
GET /api/zhijiaoyun/courses?page=1&pageSize=20&teacherId=123
```

**查询参数：**
- `page`: 页码
- `pageSize`: 每页数量
- `keyword`: 搜索关键词
- `teacherId`: 教师ID
- `departmentId`: 部门ID
- `semester`: 学期
- `academicYear`: 学年
- `status`: 课程状态

#### 获取课程详情

```http
GET /api/zhijiaoyun/courses/{courseId}
```

### 教学数据

#### 获取出勤记录

```http
GET /api/zhijiaoyun/attendance?startDate=2024-01-01&endDate=2024-01-31
```

**查询参数：**
- `startDate`: 开始日期（ISO 8601格式）
- `endDate`: 结束日期（ISO 8601格式）
- `classId`: 班级ID
- `studentId`: 学生ID
- `status`: 出勤状态

#### 获取考试成绩

```http
GET /api/zhijiaoyun/exam-scores?courseId=123&startDate=2024-01-01
```

#### 获取学生评价

```http
GET /api/zhijiaoyun/evaluations?teacherId=123&courseId=456
```

#### 获取教学活动

```http
GET /api/zhijiaoyun/teaching-activities?teacherId=123
```

### 数据同步

#### 手动同步（管理员权限）

```http
POST /api/zhijiaoyun/sync
Content-Type: application/json

{
  "syncType": "incremental"  // "full" | "incremental"
}
```

#### 获取教师评价数据（管理员权限）

```http
POST /api/zhijiaoyun/teacher-data
Content-Type: application/json

{
  "teacherIds": ["teacher1", "teacher2", "teacher3"]
}
```

## 🔒 权限控制

| 接口 | 所需权限 | 说明 |
|------|----------|------|
| `/health` | 任意用户 | 检查API连接状态 |
| `/users` | 任意用户 | 获取用户列表 |
| `/courses` | 任意用户 | 获取课程列表 |
| `/attendance` | 任意用户 | 获取出勤记录 |
| `/evaluations` | 任意用户 | 获取评价数据 |
| `/sync` | 管理员 | 数据同步 |
| `/teacher-data` | 管理员 | 获取教师评价数据 |

## 📊 数据格式

### 用户信息

```json
{
  "userId": "string",
  "username": "string",
  "realName": "string",
  "email": "string",
  "phone": "string",
  "avatar": "string",
  "departmentId": "string",
  "departmentName": "string",
  "role": "teacher|student|admin",
  "status": "active|inactive|suspended",
  "createTime": "2024-01-20T10:30:00.000Z"
}
```

### 课程信息

```json
{
  "courseId": "string",
  "courseCode": "string",
  "courseName": "string",
  "description": "string",
  "teacherId": "string",
  "teacherName": "string",
  "departmentId": "string",
  "departmentName": "string",
  "credits": 4,
  "totalHours": 64,
  "theoryHours": 48,
  "practiceHours": 16,
  "semester": "2024春季",
  "academicYear": "2023-2024",
  "startTime": "2024-02-26T00:00:00.000Z",
  "endTime": "2024-06-30T00:00:00.000Z",
  "maxStudents": 50,
  "currentStudents": 45,
  "status": "active|inactive|completed"
}
```

### 出勤记录

```json
{
  "attendanceId": "string",
  "classId": "string",
  "studentId": "string",
  "studentName": "string",
  "date": "2024-01-20",
  "startTime": "09:00",
  "endTime": "10:30",
  "status": "present|absent|late|early_leave",
  "checkInTime": "2024-01-20T09:02:00.000Z",
  "checkOutTime": "2024-01-20T10:28:00.000Z"
}
```

## 🚀 使用示例

### JavaScript/TypeScript

```typescript
// 获取教师列表
const response = await fetch('/api/zhijiaoyun/users?role=teacher&page=1&pageSize=10', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})

const result = await response.json()
if (result.success) {
  console.log('教师列表:', result.data.users)
}
```

### cURL

```bash
# 获取课程列表
curl -X GET "http://localhost:8000/api/zhijiaoyun/courses?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# 数据同步
curl -X POST "http://localhost:8000/api/zhijiaoyun/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"syncType": "incremental"}'
```

## 🛠️ 开发和测试

### 本地测试

1. 配置环境变量
2. 启动后端服务：`deno task dev`
3. 使用测试脚本验证连接

```bash
# 运行测试脚本
deno task test:zhijiaoyun
```

### 错误处理

API使用标准HTTP状态码和统一的错误响应格式：

```json
{
  "success": false,
  "message": "错误描述",
  "error": "ERROR_CODE"
}
```

常见错误码：
- `HEALTH_CHECK_FAILED`: 健康检查失败
- `GET_USERS_FAILED`: 获取用户列表失败
- `GET_COURSES_FAILED`: 获取课程列表失败
- `SYNC_FAILED`: 数据同步失败
- `INVALID_TEACHER_IDS`: 无效的教师ID列表

## 📈 性能优化

### 缓存策略

- 用户信息：缓存1小时
- 课程信息：缓存30分钟
- 统计数据：缓存15分钟

### 限流控制

- 每个用户每分钟最多100次请求
- 数据同步接口每分钟最多5次请求

## 🔍 监控和日志

### 关键指标

- API响应时间
- 成功率
- 数据同步状态
- 错误率

### 日志级别

- `ERROR`: API请求失败
- `WARN`: 重试请求
- `INFO`: 成功的API调用
- `DEBUG`: 详细的请求参数

---

**更新时间**: 2024年
**文档版本**: v1.0.0