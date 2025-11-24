# AI助评系统MVP API接口规范

---

**文档编号：** HKHR-MVP-API-001
**项目名称：** AI助力教学评价应用（MVP API规范）
**编制单位：** 教务处信息技术中心
**编制日期：** 2025年11月23日
**文档版本：** V1.0
**审阅人：** 项目技术组
**批准人：** 项目领导小组

---

## 文档修订记录

| 版本 | 修订日期 | 修订内容 | 修订人 |
|------|----------|----------|--------|
| V1.0 | 2025-11-23 | 初始版本创建 | 项目组 |

---

## 目录

1. [引言](#1-引言)
   1.1 [文档目的](#11-文档目的)
   1.2 [API设计原则](#12-api设计原则)
   1.3 [技术规范](#13-技术规范)

2. [API总体设计](#2-api总体设计)
   2.1 [RESTful设计](#21-restful设计)
   2.2 [版本控制](#22-版本控制)
   2.3 [统一响应格式](#23-统一响应格式)
   2.4 [错误处理](#24-错误处理)

3. [认证API设计](#3-认证api设计)
   3.1 [登录接口](#31-登录接口)
   3.2 [登出接口](#32-登出接口)
   3.3 [用户信息接口](#33-用户信息接口)
   3.4 [权限验证接口](#34-权限验证接口)

4. [数据采集API设计](#4-数据采集api设计)
   4.1 [数据源配置接口](#41-数据源配置接口)
   4.2 [数据采集接口](#42-数据采集接口)
   4.3 [采集状态接口](#43-采集状态接口)
   4.4 [数据质量接口](#44-数据质量接口)

5. [AI分析API设计](#5-ai分析api设计)
   5.1 [分析任务接口](#51-分析任务接口)
   5.2 [评价规则接口](#52-评价规则接口)
   5.3 [分析结果接口](#53-分析结果接口)
   5.4 [指标计算接口](#54-指标计算接口)

6. [可视化API设计](#6-可视化api设计)
   6.1 [仪表盘数据接口](#61-仪表盘数据接口)
   6.2 [图表数据接口](#62-图表数据接口)
   6.3 [报表生成接口](#63-报表生成接口)
   6.4 [数据导出接口](#64-数据导出接口)

7. [系统管理API设计](#7-系统管理api设计)
   7.1 [系统配置接口](#71-系统配置接口)
   7.2 [系统监控接口](#72-系统监控接口)
   7.3 [日志管理接口](#73-日志管理接口)
   7.4 [数据备份接口](#74-数据备份接口)

8. [API安全设计](#8-api安全设计)
   8.1 [认证安全](#81-认证安全)
   8.2 [授权安全](#82-授权安全)
   8.3 [输入验证](#83-输入验证)
   8.4 [输出过滤](#84-输出过滤)

---

## 1. 引言

### 1.1 文档目的

本文档定义了AI助评系统MVP版本的API接口设计规范，包括接口设计原则、技术规范、接口定义、安全设计等内容，为前后端开发提供统一的接口标准。

### 1.2 API设计原则

#### 1.2.1 RESTful原则
- **资源导向**：以资源为中心设计API
- **统一接口**：使用统一的接口约定
- **无状态**：API请求无状态，服务端不保存客户端状态
- **分层系统**：支持分层架构，客户端不知道是否直接连接到最终服务器

#### 1.2.2 设计一致性原则
- **命名一致**：URL、参数、响应字段命名一致
- **格式一致**：统一的请求和响应格式
- **行为一致**：相似功能的API行为一致
- **错误一致**：统一的错误处理和错误码

#### 1.2.3 易用性原则
- **直观易懂**：API设计直观，易于理解
- **文档完整**：提供完整的API文档
- **示例丰富**：提供丰富的使用示例
- **版本兼容**：向后兼容，平滑升级

### 1.3 技术规范

#### 1.3.1 HTTP协议规范
- **协议版本**：HTTP/1.1, HTTP/2
- **传输编码**：UTF-8
- **内容类型**：application/json
- **字符编码**：UTF-8

#### 1.3.2 安全协议规范
- **HTTPS强制**：所有API必须通过HTTPS访问
- **TLS版本**：TLS 1.2+
- **证书验证**：严格的证书验证
- **HSTS支持**：支持HTTP严格传输安全

#### 1.3.3 数据格式规范
- **请求格式**：JSON
- **响应格式**：JSON
- **日期格式**：ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
- **数字格式**：使用JSON原生数字类型

---

## 2. API总体设计

### 2.1 RESTful设计

#### 2.1.1 URL设计规范

```typescript
// API URL结构
https://api.ai-evaluation.com/{version}/{resource}/{id}?{parameters}

// 示例
https://api.ai-evaluation.com/v1/users/123
https://api.ai-evaluation.com/v1/data-collections?status=active
```

#### 2.1.2 HTTP方法使用

| HTTP方法 | 用途 | 幂等性 | 安全性 |
|----------|------|--------|--------|
| GET | 获取资源 | 是 | 是 |
| POST | 创建资源 | 否 | 否 |
| PUT | 完整更新资源 | 是 | 否 |
| PATCH | 部分更新资源 | 否 | 否 |
| DELETE | 删除资源 | 是 | 否 |

#### 2.1.3 状态码使用

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 请求成功，无返回内容 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 请求格式正确但语义错误 |
| 500 | Internal Server Error | 服务器内部错误 |

### 2.2 版本控制

#### 2.2.1 版本策略
- **URL版本控制**：在URL中包含版本号 `/v1/`, `/v2/`
- **向后兼容**：新版本保持对旧版本的兼容
- **废弃通知**：API废弃提前3个月通知
- **版本生命周期**：每个版本至少维护12个月

#### 2.2.2 版本示例

```typescript
// v1 API
GET /v1/users/123

// v2 API
GET /v2/users/123
```

### 2.3 统一响应格式

#### 2.3.1 成功响应格式

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  code: number;
  timestamp: string;
}
```

#### 2.3.2 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  code: number;
  timestamp: string;
}
```

#### 2.3.3 分页响应格式

```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  code: number;
  timestamp: string;
}
```

### 2.4 错误处理

#### 2.4.1 错误码定义

```typescript
enum ErrorCode {
  // 通用错误码 (1000-1999)
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',

  // 认证错误码 (2000-2999)
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // 业务错误码 (3000-3999)
  DATA_COLLECTION_FAILED = 'DATA_COLLECTION_FAILED',
  ANALYSIS_FAILED = 'ANALYSIS_FAILED',
  REPORT_GENERATION_FAILED = 'REPORT_GENERATION_FAILED'
}
```

#### 2.4.2 错误响应示例

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "用户名或密码错误",
    "details": {
      "field": "password",
      "reason": "密码不正确"
    }
  },
  "code": 401,
  "timestamp": "2025-11-23T10:30:00Z"
}
```

---

## 3. 认证API设计

### 3.1 登录接口

#### 3.1.1 接口定义

```http
POST /api/v1/auth/login
Content-Type: application/json
```

#### 3.1.2 请求参数

```typescript
interface LoginRequest {
  username: string;    // 用户名
  password: string;    // 密码
  remember?: boolean;  // 记住我（可选）
}
```

#### 3.1.3 响应数据

```typescript
interface LoginResponse {
  user: {
    id: number;
    username: string;
    role: 'admin' | 'teacher';
    fullName: string;
  };
  token: string;       // JWT令牌
  expiresIn: number;   // 令牌过期时间（秒）
}
```

#### 3.1.4 示例

**请求**：
```json
{
  "username": "admin",
  "password": "password123",
  "remember": true
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "fullName": "系统管理员"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  },
  "code": 200,
  "timestamp": "2025-11-23T10:30:00Z"
}
```

### 3.2 登出接口

#### 3.2.1 接口定义

```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

#### 3.2.2 响应数据

```typescript
interface LogoutResponse {
  message: string;
}
```

### 3.3 用户信息接口

#### 3.3.1 接口定义

```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

#### 3.3.2 响应数据

```typescript
interface UserInfoResponse {
  id: number;
  username: string;
  role: 'admin' | 'teacher';
  fullName: string;
  permissions: string[];
  lastLogin: string;
}
```

### 3.4 权限验证接口

#### 3.4.1 接口定义

```http
GET /api/v1/auth/permissions
Authorization: Bearer {token}
```

#### 3.4.2 响应数据

```typescript
interface PermissionsResponse {
  permissions: string[];
  roles: string[];
}
```

---

## 4. 数据采集API设计

### 4.1 数据源配置接口

#### 4.1.1 获取数据源配置

```http
GET /api/v1/data-sources
Authorization: Bearer {token}
```

**响应**：
```typescript
interface DataSourceConfig {
  id: number;
  name: string;
  type: 'zhijiaoyun';
  status: 'active' | 'inactive';
  config: {
    apiUrl: string;
    apiKey: string;
    syncInterval: number;
  };
  lastSync: string;
}
```

#### 4.1.2 更新数据源配置

```http
PUT /api/v1/data-sources/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface UpdateDataSourceRequest {
  name?: string;
  status?: 'active' | 'inactive';
  config?: {
    apiUrl: string;
    apiKey: string;
    syncInterval: number;
  };
}
```

### 4.2 数据采集接口

#### 4.2.1 触发数据采集

```http
POST /api/v1/data-collection/trigger
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface TriggerCollectionRequest {
  sourceId: number;
  dataType?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}
```

**响应**：
```typescript
interface TriggerCollectionResponse {
  taskId: string;
  status: 'started' | 'failed';
  message: string;
}
```

### 4.3 采集状态接口

#### 4.3.1 获取采集状态

```http
GET /api/v1/data-collection/status/{taskId}
Authorization: Bearer {token}
```

**响应**：
```typescript
interface CollectionStatusResponse {
  taskId: string;
  status: 'running' | 'completed' | 'failed';
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  startTime: string;
  endTime?: string;
  recordsCollected: number;
  errorMessage?: string;
}
```

### 4.4 数据质量接口

#### 4.4.1 获取数据质量报告

```http
GET /api/v1/data-quality/report
Authorization: Bearer {token}
```

**响应**：
```typescript
interface DataQualityReport {
  reportId: string;
  generatedAt: string;
  summary: {
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    duplicateRecords: number;
    completeness: number;
  };
  details: {
    dataType: string;
    issues: Array<{
      type: string;
      count: number;
      description: string;
    }>;
  }[];
}
```

---

## 5. AI分析API设计

### 5.1 分析任务接口

#### 5.1.1 创建分析任务

```http
POST /api/v1/analysis/tasks
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface CreateAnalysisTaskRequest {
  name: string;
  description?: string;
  dataSourceIds: number[];
  ruleIds: number[];
  parameters?: {
    dateRange: {
      startDate: string;
      endDate: string;
    };
    filters?: Record<string, any>;
  };
}
```

**响应**：
```typescript
interface CreateAnalysisTaskResponse {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
}
```

#### 5.1.2 获取分析任务列表

```http
GET /api/v1/analysis/tasks
Authorization: Bearer {token}
```

**查询参数**：
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）
- `status`: 状态过滤
- `dateFrom`: 开始日期过滤
- `dateTo`: 结束日期过滤

**响应**：
```typescript
interface AnalysisTask {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  resultCount?: number;
}
```

### 5.2 评价规则接口

#### 5.2.1 获取评价规则

```http
GET /api/v1/analysis/rules
Authorization: Bearer {token}
```

**响应**：
```typescript
interface EvaluationRule {
  id: number;
  name: string;
  description: string;
  category: string;
  weight: number;
  formula: string;
  parameters: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}
```

#### 5.2.2 更新评价规则

```http
PUT /api/v1/analysis/rules/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface UpdateRuleRequest {
  name?: string;
  description?: string;
  weight?: number;
  formula?: string;
  parameters?: Record<string, any>;
  isActive?: boolean;
}
```

### 5.3 分析结果接口

#### 5.3.1 获取分析结果

```http
GET /api/v1/analysis/results/{taskId}
Authorization: Bearer {token}
```

**响应**：
```typescript
interface AnalysisResult {
  taskId: string;
  status: 'completed' | 'failed';
  summary: {
    totalScore: number;
    dimensionScores: Record<string, number>;
    ranking: number;
    recommendation: string;
  };
  details: {
    ruleId: number;
    ruleName: string;
    score: number;
    weight: number;
    contribution: number;
  }[];
  generatedAt: string;
}
```

### 5.4 指标计算接口

#### 5.4.1 获取指标定义

```http
GET /api/v1/analysis/metrics
Authorization: Bearer {token}
```

**响应**：
```typescript
interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  formula: string;
  parameters: Record<string, any>;
}
```

#### 5.4.2 计算指标

```http
POST /api/v1/analysis/metrics/calculate
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface CalculateMetricsRequest {
  metricIds: string[];
  filters?: Record<string, any>;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}
```

**响应**：
```typescript
interface CalculateMetricsResponse {
  metrics: {
    id: string;
    name: string;
    value: number;
    unit: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
  calculatedAt: string;
}
```

---

## 6. 可视化API设计

### 6.1 仪表盘数据接口

#### 6.1.1 获取仪表盘概览数据

```http
GET /api/v1/dashboard/overview
Authorization: Bearer {token}
```

**响应**：
```typescript
interface DashboardOverview {
  summary: {
    totalUsers: number;
    totalCourses: number;
    totalAnalyses: number;
    avgScore: number;
  };
  trends: {
    dailyUsers: Array<{ date: string; count: number }>;
    weeklyAnalyses: Array<{ week: string; count: number }>;
    monthlyScores: Array<{ month: string; score: number }>;
  };
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
}
```

#### 6.1.2 获取个人仪表盘数据

```http
GET /api/v1/dashboard/personal
Authorization: Bearer {token}
```

**响应**：
```typescript
interface PersonalDashboard {
  userInfo: {
    name: string;
    role: string;
    department: string;
  };
  performance: {
    overallScore: number;
    ranking: number;
    improvement: number;
  };
  recentAnalyses: Array<{
    id: string;
    name: string;
    score: number;
    date: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}
```

### 6.2 图表数据接口

#### 6.2.1 获取图表数据

```http
GET /api/v1/charts/{chartType}
Authorization: Bearer {token}
```

**路径参数**：
- `chartType`: 图表类型（line, bar, pie, radar）

**查询参数**：
- `metric`: 指标ID
- `dimension`: 维度
- `dateRange`: 时间范围
- `filters`: 过滤条件

**响应**：
```typescript
interface ChartData {
  type: string;
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
    }>;
  };
  options: Record<string, any>;
}
```

### 6.3 报表生成接口

#### 6.3.1 生成报表

```http
POST /api/v1/reports/generate
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface GenerateReportRequest {
  type: 'summary' | 'detailed' | 'comparison';
  template?: string;
  parameters: {
    dateRange: {
      startDate: string;
      endDate: string;
    };
    filters?: Record<string, any>;
    format: 'pdf' | 'excel';
  };
}
```

**响应**：
```typescript
interface GenerateReportResponse {
  reportId: string;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  estimatedTime?: number;
}
```

#### 6.3.2 获取报表状态

```http
GET /api/v1/reports/{reportId}/status
Authorization: Bearer {token}
```

**响应**：
```typescript
interface ReportStatusResponse {
  reportId: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  errorMessage?: string;
  generatedAt?: string;
}
```

### 6.4 数据导出接口

#### 6.4.1 导出分析结果

```http
POST /api/v1/export/analysis-results
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface ExportAnalysisRequest {
  taskIds: string[];
  format: 'excel' | 'csv' | 'json';
  includeDetails: boolean;
}
```

**响应**：
```typescript
interface ExportResponse {
  exportId: string;
  status: 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
}
```

---

## 7. 系统管理API设计

### 7.1 系统配置接口

#### 7.1.1 获取系统配置

```http
GET /api/v1/system/config
Authorization: Bearer {token}
```

**响应**：
```typescript
interface SystemConfig {
  general: {
    systemName: string;
    version: string;
    environment: 'development' | 'production';
  };
  features: {
    dataCollection: boolean;
    aiAnalysis: boolean;
    reportGeneration: boolean;
  };
  limits: {
    maxFileSize: number;
    maxConcurrentTasks: number;
    dataRetentionDays: number;
  };
}
```

#### 7.1.2 更新系统配置

```http
PUT /api/v1/system/config
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface UpdateSystemConfigRequest {
  general?: Partial<SystemConfig['general']>;
  features?: Partial<SystemConfig['features']>;
  limits?: Partial<SystemConfig['limits']>;
}
```

### 7.2 系统监控接口

#### 7.2.1 获取系统状态

```http
GET /api/v1/system/status
Authorization: Bearer {token}
```

**响应**：
```typescript
interface SystemStatus {
  overall: 'healthy' | 'warning' | 'error';
  services: {
    api: 'up' | 'down';
    database: 'up' | 'down';
    cache: 'up' | 'down';
    storage: 'up' | 'down';
  };
  metrics: {
    uptime: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
  lastCheck: string;
}
```

#### 7.2.2 获取性能指标

```http
GET /api/v1/system/metrics
Authorization: Bearer {token}
```

**查询参数**：
- `period`: 时间周期（1h, 24h, 7d, 30d）
- `metric`: 指标类型（cpu, memory, disk, network）

**响应**：
```typescript
interface SystemMetrics {
  period: string;
  metrics: {
    timestamp: string;
    value: number;
  }[];
  summary: {
    min: number;
    max: number;
    avg: number;
    current: number;
  };
}
```

### 7.3 日志管理接口

#### 7.3.1 获取系统日志

```http
GET /api/v1/system/logs
Authorization: Bearer {token}
```

**查询参数**：
- `level`: 日志级别（error, warn, info, debug）
- `dateFrom`: 开始日期
- `dateTo`: 结束日期
- `page`: 页码
- `limit`: 每页数量

**响应**：
```typescript
interface SystemLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  module: string;
  userId?: number;
  metadata?: Record<string, any>;
}
```

### 7.4 数据备份接口

#### 7.4.1 创建数据备份

```http
POST /api/v1/system/backup
Authorization: Bearer {token}
Content-Type: application/json
```

**请求**：
```typescript
interface CreateBackupRequest {
  type: 'full' | 'incremental';
  include: string[];
  exclude?: string[];
}
```

**响应**：
```typescript
interface CreateBackupResponse {
  backupId: string;
  status: 'started' | 'completed' | 'failed';
  estimatedTime?: number;
}
```

#### 7.4.2 获取备份列表

```http
GET /api/v1/system/backups
Authorization: Bearer {token}
```

**响应**：
```typescript
interface BackupInfo {
  id: string;
  type: 'full' | 'incremental';
  status: 'completed' | 'failed';
  size: number;
  createdAt: string;
  expiresAt: string;
}
```

---

## 8. API安全设计

### 8.1 认证安全

#### 8.1.1 JWT令牌安全

```typescript
// JWT令牌结构
interface JWTPayload {
  sub: string;        // 用户ID
  username: string;   // 用户名
  role: string;       // 用户角色
  iat: number;        // 签发时间
  exp: number;        // 过期时间
  jti: string;        // 令牌ID
}
```

#### 8.1.2 令牌管理策略
- **令牌有效期**：访问令牌24小时，刷新令牌7天
- **令牌轮换**：定期轮换令牌签名密钥
- **令牌撤销**：支持令牌主动撤销
- **令牌存储**：服务端记录令牌状态

### 8.2 授权安全

#### 8.2.1 权限验证中间件

```typescript
// 权限验证中间件示例
async function authorize(permissions: string[]) {
  return async (c: Context, next: Next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED' } }, 401);
    }

    if (!hasPermissions(user, permissions)) {
      return c.json({ success: false, error: { code: 'FORBIDDEN' } }, 403);
    }

    c.set('user', user);
    await next();
  };
}
```

#### 8.2.2 资源级权限控制
- **资源所有权**：验证用户对资源的所有权
- **操作权限**：验证用户对资源的操作权限
- **数据范围**：限制用户可访问的数据范围

### 8.3 输入验证

#### 8.3.1 参数验证

```typescript
// 参数验证示例
const loginSchema = {
  username: {
    type: 'string',
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  password: {
    type: 'string',
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  }
};
```

#### 8.3.2 数据清理
- **SQL注入防护**：使用参数化查询
- **XSS防护**：输出数据编码
- **CSRF防护**：CSRF令牌验证
- **文件上传安全**：文件类型和大小限制

### 8.4 输出过滤

#### 8.4.1 敏感数据过滤

```typescript
// 敏感数据过滤示例
function filterSensitiveData(user: any) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    // 不返回密码、盐值等敏感信息
  };
}
```

#### 8.4.2 数据脱敏
- **个人隐私信息**：对个人隐私信息进行脱敏
- **敏感业务数据**：对敏感业务数据进行适当保护
- **日志脱敏**：日志中的敏感信息进行脱敏处理

---

## 附录

### A. API接口清单

| 模块 | 接口 | 方法 | 路径 | 认证 | 权限 |
|------|------|------|------|------|------|
| 认证 | 登录 | POST | `/api/v1/auth/login` | 否 | 无 |
| 认证 | 登出 | POST | `/api/v1/auth/logout` | 是 | 无 |
| 认证 | 用户信息 | GET | `/api/v1/auth/me` | 是 | 无 |
| 认证 | 权限验证 | GET | `/api/v1/auth/permissions` | 是 | 无 |
| 数据采集 | 数据源配置 | GET | `/api/v1/data-sources` | 是 | admin |
| 数据采集 | 更新配置 | PUT | `/api/v1/data-sources/{id}` | 是 | admin |
| 数据采集 | 触发采集 | POST | `/api/v1/data-collection/trigger` | 是 | admin |
| 数据采集 | 采集状态 | GET | `/api/v1/data-collection/status/{taskId}` | 是 | admin |
| 数据采集 | 质量报告 | GET | `/api/v1/data-quality/report` | 是 | admin |
| AI分析 | 创建任务 | POST | `/api/v1/analysis/tasks` | 是 | admin |
| AI分析 | 任务列表 | GET | `/api/v1/analysis/tasks` | 是 | admin,teacher |
| AI分析 | 分析结果 | GET | `/api/v1/analysis/results/{taskId}` | 是 | admin,teacher |
| AI分析 | 评价规则 | GET | `/api/v1/analysis/rules` | 是 | admin |
| AI分析 | 更新规则 | PUT | `/api/v1/analysis/rules/{id}` | 是 | admin |
| 可视化 | 仪表盘概览 | GET | `/api/v1/dashboard/overview` | 是 | admin |
| 可视化 | 个人仪表盘 | GET | `/api/v1/dashboard/personal` | 是 | admin,teacher |
| 可视化 | 图表数据 | GET | `/api/v1/charts/{chartType}` | 是 | admin,teacher |
| 可视化 | 生成报表 | POST | `/api/v1/reports/generate` | 是 | admin,teacher |
| 系统管理 | 系统配置 | GET | `/api/v1/system/config` | 是 | admin |
| 系统管理 | 系统状态 | GET | `/api/v1/system/status` | 是 | admin |
| 系统管理 | 系统日志 | GET | `/api/v1/system/logs` | 是 | admin |
| 系统管理 | 数据备份 | POST | `/api/v1/system/backup` | 是 | admin |

### B. 错误码对照表

| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| INVALID_REQUEST | 400 | 请求参数错误 |
| UNAUTHORIZED | 401 | 未认证或认证失败 |
| FORBIDDEN | 403 | 无权限访问 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突 |
| UNPROCESSABLE_ENTITY | 422 | 请求格式正确但语义错误 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| INVALID_CREDENTIALS | 401 | 用户名或密码错误 |
| TOKEN_EXPIRED | 401 | 令牌已过期 |
| TOKEN_INVALID | 401 | 令牌无效 |
| DATA_COLLECTION_FAILED | 500 | 数据采集失败 |
| ANALYSIS_FAILED | 500 | 分析失败 |
| REPORT_GENERATION_FAILED | 500 | 报表生成失败 |

### C. API使用示例

#### C.1 完整的用户登录和数据分析流程

```typescript
// 1. 用户登录
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'teacher',
    password: 'password123'
  })
});

const { data: { token } } = await loginResponse.json();

// 2. 获取仪表盘数据
const dashboardResponse = await fetch('/api/v1/dashboard/personal', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const dashboard = await dashboardResponse.json();

// 3. 触发数据分析
const analysisResponse = await fetch('/api/v1/analysis/tasks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '教学质量分析',
    dataSourceIds: [1],
    ruleIds: [1, 2, 3],
    parameters: {
      dateRange: {
        startDate: '2025-10-01',
        endDate: '2025-11-01'
      }
    }
  })
});

const { data: { taskId } } = await analysisResponse.json();

// 4. 获取分析结果
const resultResponse = await fetch(`/api/v1/analysis/results/${taskId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await resultResponse.json();
```

---

**文档版本**: V1.0
**创建日期**: 2025-11-23
**最后更新**: 2025-11-23
**审批状态**: 待审批
**维护责任人**: API架构师团队