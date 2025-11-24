# AI分析引擎API文档

## 概述

AI分析引擎提供教学评价的核心AI分析功能，支持单教师分析、批量分析、规则管理等。

## 基础信息

- **基础路径**: `/api/ai-analysis`
- **认证方式**: JWT Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## API接口

### 1. 配置管理

#### 获取分析配置

```http
GET /api/ai-analysis/config
```

**权限要求**: 需要登录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "defaultWeights": [
      {
        "dimension": "teaching_attitude",
        "weight": 0.2,
        "enabled": true
      }
    ],
    "aiSettings": {
      "enableML": true,
      "modelVersion": "1.0",
      "confidenceThreshold": 0.7
    }
  }
}
```

#### 更新分析配置

```http
PUT /api/ai-analysis/config
```

**权限要求**: 管理员

**请求体**:
```json
{
  "aiSettings": {
    "enableML": true,
    "modelVersion": "1.1",
    "confidenceThreshold": 0.8
  }
}
```

### 2. 教师分析

#### 单教师分析

```http
POST /api/ai-analysis/analyze/teacher
```

**权限要求**: 需要登录

**请求体**:
```json
{
  "teacherId": "teacher_001",
  "timeWindow": {
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "type": "semester"
  },
  "ruleIds": ["teaching_effectiveness_core"]
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "analysis_123",
    "teacherId": "teacher_001",
    "teacherInfo": {
      "id": "teacher_001",
      "name": "张老师",
      "employeeId": "T001"
    },
    "overallScore": 85.5,
    "overallLevel": "good",
    "dimensionResults": [
      {
        "dimension": "teaching_effect",
        "score": 88.0,
        "level": "good",
        "weight": 0.25,
        "contribution": 22.0
      }
    ],
    "insights": {
      "strengths": ["课堂互动积极"],
      "weaknesses": ["作业反馈及时性有待提升"],
      "recommendations": ["建议增加在线答疑时间"]
    }
  }
}
```

#### 批量分析

```http
POST /api/ai-analysis/analyze/batch
```

**权限要求**: 管理员

**请求体**:
```json
{
  "name": "学期教学评价分析",
  "scope": {
    "teacherIds": ["teacher_001", "teacher_002"],
    "courseIds": ["course_001"]
  },
  "timeWindow": {
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "type": "semester"
  },
  "rules": ["teaching_effectiveness_core"],
  "options": {
    "includeComparisons": true,
    "includeTrends": true,
    "confidenceThreshold": 0.7
  }
}
```

#### 分析预览

```http
POST /api/ai-analysis/preview
```

**权限要求**: 需要登录

**请求体**: 与单教师分析相同

**响应示例**:
```json
{
  "success": true,
  "data": {
    "estimatedScore": 85.2,
    "estimatedLevel": "good",
    "estimatedTime": 2500,
    "dataQuality": 0.85,
    "confidenceLevel": 0.78
  }
}
```

### 3. 分析结果管理

#### 获取结果列表

```http
GET /api/ai-analysis/results?page=1&pageSize=20&teacherId=teacher_001
```

**权限要求**: 需要登录

**查询参数**:
- `page`: 页码 (默认: 1)
- `pageSize`: 每页大小 (默认: 20, 最大: 100)
- `teacherId`: 教师ID (可选)
- `courseId`: 课程ID (可选)
- `level`: 评价等级 (可选)
- `timeWindow`: 时间窗口 (可选)

#### 获取单个结果

```http
GET /api/ai-analysis/results/:resultId
```

**权限要求**: 需要登录

#### 导出结果

```http
POST /api/ai-analysis/export/:resultId
```

**权限要求**: 需要登录

**请求体**:
```json
{
  "format": "pdf",
  "includeDetails": true
}
```

### 4. 分析任务管理

#### 获取任务列表

```http
GET /api/ai-analysis/tasks?page=1&pageSize=20
```

**权限要求**: 需要登录

#### 获取任务详情

```http
GET /api/ai-analysis/tasks/:taskId
```

**权限要求**: 需要登录

#### 取消任务

```http
POST /api/ai-analysis/tasks/:taskId/cancel
```

**权限要求**: 管理员

### 5. 分析规则管理

#### 获取规则列表

```http
GET /api/ai-analysis/rules
```

**权限要求**: 需要登录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": "teaching_effectiveness_core",
        "name": "核心教学效果评估",
        "type": "teaching_effectiveness",
        "category": "core",
        "enabled": true,
        "priority": 1,
        "conditions": [
          {
            "metric": "evaluation_average_score",
            "operator": ">=",
            "value": 80,
            "weight": 0.4
          }
        ]
      }
    ]
  }
}
```

#### 创建规则

```http
POST /api/ai-analysis/rules
```

**权限要求**: 管理员

**请求体**:
```json
{
  "name": "自定义教学效果规则",
  "type": "teaching_effectiveness",
  "category": "custom",
  "enabled": true,
  "priority": 5,
  "conditions": [
    {
      "metric": "exam_pass_rate",
      "operator": ">=",
      "value": 85,
      "weight": 0.5
    }
  ],
  "weights": [
    {
      "dimension": "teaching_effect",
      "weight": 0.4,
      "enabled": true
    }
  ],
  "thresholds": {
    "excellent": 95,
    "good": 85,
    "average": 75,
    "poor": 60
  }
}
```

#### 更新规则

```http
PUT /api/ai-analysis/rules/:ruleId
```

**权限要求**: 管理员

#### 删除规则

```http
DELETE /api/ai-analysis/rules/:ruleId
```

**权限要求**: 管理员

### 6. 性能监控

#### 获取性能指标

```http
GET /api/ai-analysis/performance
```

**权限要求**: 需要登录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalAnalyses": 150,
    "averageProcessingTime": 2350,
    "successRate": 98.5,
    "cacheHitRate": 75.2,
    "activeTasks": 2,
    "queuedTasks": 0
  }
}
```

### 7. 指标查询

#### 获取可用指标

```http
GET /api/ai-analysis/metrics
```

**权限要求**: 需要登录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "name": "evaluation_average_score",
        "displayName": "平均评价分数",
        "unit": "分",
        "description": "学生对教师的综合评价平均分",
        "category": "evaluation",
        "type": "numeric"
      }
    ]
  }
}
```

### 8. 系统维护

#### 清理缓存

```http
POST /api/ai-analysis/maintenance/cleanup-cache
```

**权限要求**: 管理员

#### 获取分析模板

```http
GET /api/ai-analysis/templates
```

**权限要求**: 需要登录

## 数据类型

### 时间窗口 (TimeWindow)

```typescript
interface TimeWindow {
  startDate: string    // 开始日期 YYYY-MM-DD
  endDate: string      // 结束日期 YYYY-MM-DD
  type: 'semester' | 'quarter' | 'month' | 'year' | 'custom'
}
```

### 分析规则类型 (AnalysisRuleType)

```typescript
enum AnalysisRuleType {
  TEACHING_EFFECTIVENESS = 'teaching_effectiveness',
  STUDENT_ENGAGEMENT = 'student_engagement',
  KNOWLEDGE_MASTERY = 'knowledge_mastery',
  COMPLETION_RATE = 'completion_rate',
  IMPROVEMENT_TREND = 'improvement_trend',
  PEER_COMPARISON = 'peer_comparison'
}
```

### 评价等级

- `excellent`: 优秀 (≥90分)
- `good`: 良好 (≥80分)
- `average`: 一般 (≥70分)
- `poor`: 较差 (<70分)

### 操作符

```typescript
enum ComparisonOperator {
  GREATER_THAN = '>',
  LESS_THAN = '<',
  EQUAL = '==',
  GREATER_EQUAL = '>=',
  LESS_EQUAL = '<=',
  NOT_EQUAL = '!='
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| GET_CONFIG_FAILED | 获取配置失败 |
| UPDATE_CONFIG_FAILED | 更新配置失败 |
| ANALYZE_TEACHER_FAILED | 教师分析失败 |
| CREATE_BATCH_ANALYSIS_FAILED | 创建批量分析失败 |
| RULE_NOT_FOUND | 规则不存在 |
| CREATE_RULE_FAILED | 创建规则失败 |
| UPDATE_RULE_FAILED | 更新规则失败 |
| DELETE_RULE_FAILED | 删除规则失败 |
| TASK_NOT_FOUND | 任务不存在 |
| CANNOT_CANCEL_TASK | 无法取消任务 |
| RESULT_NOT_FOUND | 结果不存在 |

## 使用示例

### JavaScript/TypeScript

```typescript
// 单教师分析
const response = await fetch('/api/ai-analysis/analyze/teacher', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    teacherId: 'teacher_001',
    timeWindow: {
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      type: 'semester'
    }
  })
})

const result = await response.json()
console.log('分析结果:', result.data)
```

### Python

```python
import requests

# 批量分析
response = requests.post('/api/ai-analysis/analyze/batch',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    },
    json={
        'name': '学期评价分析',
        'scope': {
            'teacherIds': ['teacher_001', 'teacher_002']
        },
        'timeWindow': {
            'startDate': '2024-01-01',
            'endDate': '2024-06-30',
            'type': 'semester'
        },
        'rules': ['teaching_effectiveness_core']
    }
)

result = response.json()
print('批量分析任务:', result['data'])
```

## 注意事项

1. **性能考虑**: 大规模批量分析可能需要较长时间，建议异步处理
2. **数据质量**: 分析结果的准确性依赖于数据质量，低质量数据会影响置信水平
3. **缓存策略**: 相同参数的分析结果会被缓存24小时
4. **并发限制**: 同时运行的批量分析任务数量有限制
5. **权限控制**: 管理员功能需要管理员权限

## 版本历史

- v1.0.0: 初始版本，支持基础分析功能
- v1.1.0: 添加批量分析和缓存优化
- v1.2.0: 增强规则管理和性能监控

## 技术支持

如有技术问题，请联系开发团队或查看系统日志。