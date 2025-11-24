# 评价指标计算API文档

## 概述

评价指标计算模块提供教学评价的核心计算功能，支持多维度评价、统计分析、权重分配和结果计算。

## 基础信息

- **基础路径**: `/api/evaluation-metrics`
- **认证方式**: JWT Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 核心功能

- 多维度评价指标计算
- 统计分析和数据处理
- 权重配置和管理
- 批量计算和任务管理
- 结果验证和质量控制

## API接口

### 1. 指标管理

#### 获取指标列表

```http
GET /api/evaluation-metrics/metrics
```

**权限要求**: 需要登录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": "teaching_attitude_preparation",
        "name": "教学态度-备课充分",
        "displayName": "备课充分程度",
        "description": "教师课前准备工作的充分性和系统性",
        "category": "input",
        "dimension": "teaching_attitude",
        "dataType": "numeric",
        "weight": 0.25,
        "enabled": true,
        "range": {
          "min": 0,
          "max": 100
        }
      }
    ]
  }
}
```

#### 创建评价指标

```http
POST /api/evaluation-metrics/metrics
```

**权限要求**: 管理员

**请求体**:
```json
{
  "name": "教学效果-学习成果",
  "displayName": "学生学习成果",
  "description": "学生对课程知识的掌握程度",
  "category": "outcome",
  "dimension": "teaching_effect",
  "dataType": "numeric",
  "scale": "ratio",
  "range": {
    "min": 0,
    "max": 100
  },
  "weight": 0.3,
  "enabled": true,
  "source": "student_evaluation"
}
```

### 2. 权重配置

#### 获取权重配置列表

```http
GET /api/evaluation-metrics/weights
```

**权限要求**: 需要登录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "weightConfigs": [
      {
        "id": "default_weight_config",
        "name": "默认权重配置",
        "strategy": "expert_judgment",
        "dimensions": [
          {
            "dimension": "teaching_attitude",
            "weight": 0.15,
            "description": "教学态度包括备课充分、责任心等"
          },
          {
            "dimension": "teaching_content",
            "weight": 0.25,
            "description": "教学内容包括准确性、深度广度等"
          }
        ],
        "totalWeight": 1.0,
        "isDefault": true
      }
    ]
  }
}
```

#### 创建权重配置

```http
POST /api/evaluation-metrics/weights
```

**权限要求**: 管理员

**请求体**:
```json
{
  "name": "重点课程权重配置",
  "description": "适用于重点课程的权重分配",
  "strategy": "expert_judgment",
  "dimensions": [
    {
      "dimension": "teaching_content",
      "weight": 0.35,
      "description": "重点课程重视教学内容"
    },
    {
      "dimension": "teaching_effect",
      "weight": 0.35,
      "description": "重点课程重视教学效果"
    }
  ],
  "totalWeight": 1.0
}
```

### 3. 计算配置

#### 获取计算配置列表

```http
GET /api/evaluation-metrics/configs
```

**权限要求**: 需要登录

#### 创建计算配置

```http
POST /api/evaluation-metrics/configs
```

**权限要求**: 管理员

### 4. 评价计算

#### 单个评价计算

```http
POST /api/evaluation-metrics/calculate
```

**权限要求**: 需要登录

**请求体**:
```json
{
  "evaluateeId": "teacher_001",
  "evaluateeType": "teacher",
  "timeWindow": {
    "startDate": "2024-01-01",
    "endDate": "2024-06-30"
  },
  "aggregationLevel": "individual",
  "weightingStrategy": "expert_judgment",
  "calculationMethod": "weighted_average",
  "configId": "default_calculation_config"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "eval_123",
    "evaluateeId": "teacher_001",
    "evaluateeType": "teacher",
    "overallScore": 85.5,
    "overallLevel": "good",
    "dimensionResults": [
      {
        "dimension": "teaching_attitude",
        "score": 88.0,
        "level": "good",
        "weight": 0.15,
        "contribution": 13.2
      },
      {
        "dimension": "teaching_content",
        "score": 82.5,
        "level": "good",
        "weight": 0.25,
        "contribution": 20.6
      }
    ],
    "metricResults": [
      {
        "metricId": "teaching_attitude_preparation",
        "metricName": "教学态度-备课充分",
        "rawValue": 85,
        "normalizedValue": 0.85,
        "weightedValue": 0.2125,
        "score": 85.0,
        "level": "good",
        "confidence": 0.85,
        "sampleSize": 25,
        "validity": true
      }
    ],
    "summary": {
      "totalMetrics": 20,
      "validMetrics": 19,
      "responseRate": 0.85,
      "dataCompleteness": 0.92,
      "reliability": 0.88
    },
    "insights": {
      "keyStrengths": ["备课充分", "表达清晰"],
      "improvementAreas": ["互动频率"],
      "recommendations": ["增加课堂互动环节"]
    }
  }
}
```

#### 批量计算

```http
POST /api/evaluation-metrics/calculate/batch
```

**权限要求**: 管理员

**请求体**:
```json
{
  "name": "学期教师批量评价",
  "description": "对全体教师进行学期教学质量评价",
  "targetIds": ["teacher_001", "teacher_002", "teacher_003"],
  "targetType": "teacher",
  "timeWindow": {
    "startDate": "2024-01-01",
    "endDate": "2024-06-30"
  },
  "configId": "default_calculation_config"
}
```

#### 计算预览

```http
POST /api/evaluation-metrics/preview
```

**权限要求**: 需要登录

**请求体**: 与单个评价计算相同

**响应示例**:
```json
{
  "success": true,
  "data": {
    "estimatedScore": 82.5,
    "estimatedLevel": "good",
    "estimatedTime": 5000,
    "dataQuality": 0.88,
    "sampleSize": 28,
    "confidenceLevel": 0.82,
    "dimensions": [
      {
        "name": "teaching_attitude",
        "weight": 0.15,
        "estimatedScore": 85.0
      }
    ]
  }
}
```

### 5. 结果管理

#### 获取计算结果列表

```http
GET /api/evaluation-metrics/results?page=1&pageSize=20&evaluateeType=teacher
```

**权限要求**: 需要登录

**查询参数**:
- `page`: 页码 (默认: 1)
- `pageSize`: 每页大小 (默认: 20, 最大: 100)
- `evaluateeId`: 评价对象ID (可选)
- `evaluateeType`: 评价对象类型 (可选)
- `timeWindow`: 时间窗口 (可选)
- `level`: 评价等级 (可选)
- `dimension`: 评价维度 (可选)

#### 获取单个计算结果

```http
GET /api/evaluation-metrics/results/:resultId
```

**权限要求**: 需要登录

#### 导出计算结果

```http
POST /api/evaluation-metrics/export/:resultId
```

**权限要求**: 需要登录

**请求体**:
```json
{
  "format": "pdf",
  "includeDetails": true
}
```

### 6. 批量计算任务

#### 获取批量计算任务列表

```http
GET /api/evaluation-metrics/tasks?page=1&pageSize=20
```

**权限要求**: 需要登录

#### 获取批量计算任务详情

```http
GET /api/evaluation-metrics/tasks/:taskId
```

**权限要求**: 需要登录

### 7. 辅助功能

#### 获取计算方法列表

```http
GET /api/evaluation-metrics/methods
```

**权限要求**: 需要登录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "name": "weighted_average",
        "displayName": "加权平均",
        "description": "根据权重计算加权平均值",
        "适用场景": "不同指标有不同重要性的情况",
        "advantages": ["考虑权重", "更加灵活"],
        "limitations": ["权重确定困难"]
      }
    ]
  }
}
```

#### 获取聚合级别列表

```http
GET /api/evaluation-metrics/aggregation-levels
```

**权限要求**: 需要登录

#### 获取权重策略列表

```http
GET /api/evaluation-metrics/weighting-strategies
```

**权限要求**: 需要登录

#### 验证计算配置

```http
POST /api/evaluation-metrics/validate-config
```

**权限要求**: 需要登录

#### 获取计算统计

```http
GET /api/evaluation-metrics/statistics
```

**权限要求**: 需要登录

## 数据类型

### 评价对象类型
- `teacher`: 教师
- `course`: 课程
- `class`: 班级

### 聚合级别
- `individual`: 个人级别
- `class`: 班级级别
- `course`: 课程级别
- `department`: 院系级别
- `school`: 学校级别
- `system`: 系统级别

### 权重策略
- `equal`: 等权重
- `expert_judgment`: 专家判断
- `statistical`: 统计方法
- `ahp`: 层次分析法
- `entropy`: 熵权法
- `pca`: 主成分分析
- `ml`: 机器学习

### 计算方法
- `average`: 算术平均
- `weighted_average`: 加权平均
- `median`: 中位数
- `mode`: 众数
- `std_dev`: 标准差
- `variance`: 方差
- `percentile`: 百分位数
- `z_score`: Z分数
- `t_score`: T分数
- `normalization`: 标准化
- `min_max_scaling`: 最小-最大缩放
- `robust_scaling`: 鲁棒缩放

### 评价等级
- `excellent`: 优秀 (≥90分)
- `good`: 良好 (≥80分)
- `average`: 一般 (≥70分)
- `poor`: 较差 (<70分)

## 计算流程

### 1. 数据收集
- 从多种数据源收集评价数据
- 包括学生评价、考试成绩、出勤记录等
- 数据预处理和质量检查

### 2. 数据验证
- 范围检查：确保数据在合理范围内
- 完整性检查：处理缺失值
- 一致性检查：验证数据格式统一
- 质量评估：基于数据源和质量评分

### 3. 指标计算
- 根据配置的计算方法计算各指标
- 数据标准化处理
- 异常值检测和处理
- 置信度计算

### 4. 权重聚合
- 按维度聚合指标结果
- 应用权重配置
- 计算维度分数和总体分数

### 5. 结果分析
- 确定评价等级
- 生成洞察和建议
- 执行比较分析
- 计算统计分布

### 6. 质量控制
- 可靠性分析
- 效度验证
- 公平性检查
- 结果验证

## 错误码

| 错误码 | 说明 |
|--------|------|
| GET_METRICS_FAILED | 获取指标失败 |
| CREATE_METRIC_FAILED | 创建指标失败 |
| GET_WEIGHTS_FAILED | 获取权重配置失败 |
| CREATE_WEIGHT_CONFIG_FAILED | 创建权重配置失败 |
| CALCULATE_FAILED | 评价计算失败 |
| CREATE_BATCH_CALCULATION_FAILED | 创建批量计算失败 |
| RESULT_NOT_FOUND | 计算结果不存在 |
| TASK_NOT_FOUND | 批量任务不存在 |
| VALIDATE_CONFIG_FAILED | 配置验证失败 |
| EXPORT_FAILED | 导出失败 |

## 使用示例

### JavaScript/TypeScript

```typescript
// 单个教师评价计算
const response = await fetch('/api/evaluation-metrics/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    evaluateeId: 'teacher_001',
    evaluateeType: 'teacher',
    timeWindow: {
      startDate: '2024-01-01',
      endDate: '2024-06-30'
    },
    weightingStrategy: 'expert_judgment',
    calculationMethod: 'weighted_average'
  })
})

const result = await response.json()
console.log('评价结果:', result.data)
```

### Python

```python
import requests

# 批量评价计算
response = requests.post('/api/evaluation-metrics/calculate/batch',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    },
    json={
        'name': '学期评价',
        'targetIds': ['teacher_001', 'teacher_002'],
        'targetType': 'teacher',
        'timeWindow': {
            'startDate': '2024-01-01',
            'endDate': '2024-06-30'
        }
    }
)

result = response.json()
print('批量计算任务:', result['data'])
```

## 注意事项

1. **数据质量**: 计算结果的准确性依赖于数据质量，低质量数据会影响结果可靠性
2. **权重配置**: 权重配置对结果影响重大，建议谨慎设置
3. **样本量**: 确保有足够的样本量进行计算，避免样本过小导致的偏差
4. **时间窗口**: 合理设置评价时间窗口，确保数据的时效性
5. **计算性能**: 大规模批量计算可能需要较长时间，建议异步处理

## 统计方法说明

### 基础统计量
- **平均值**: 数据的算术平均
- **中位数**: 排序后的中间值，不受极端值影响
- **标准差**: 衡量数据离散程度
- **百分位数**: 如P25、P75等，描述数据分布

### 数据标准化
- **Z分数**: (值 - 平均值) / 标准差
- **最小-最大缩放**: (值 - 最小值) / (最大值 - 最小值)
- **鲁棒缩放**: 使用中位数和四分位距，对异常值不敏感

### 异常值检测
- **IQR方法**: 基于1.5倍四分位距
- **Z分数方法**: 基于3个标准差
- **处理方式**: 移除、调整或标记

## 性能优化建议

1. **数据缓存**: 缓存常用的计算结果
2. **批量处理**: 合并多个计算请求
3. **异步计算**: 长时间计算任务异步执行
4. **增量更新**: 只重新计算变更的部分
5. **预计算**: 提前计算常用的统计量

## 版本历史

- v1.0.0: 初始版本，支持基础评价计算
- v1.1.0: 添加批量计算和高级统计分析
- v1.2.0: 增强权重配置和验证功能
- v1.3.0: 优化性能和添加更多统计算法

## 技术支持

如有技术问题，请联系开发团队或查看系统日志获取详细错误信息。