# AI教学评价系统 - 生产环境部署指南

## 概述

本文档描述了AI教学评价系统前端应用的生产环境部署流程，包括Kubernetes、Docker和云平台部署。

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                           │
├─────────────────────────────────────────────────────────────┤
│                      Ingress                               │
│              (nginx + SSL termination)                      │
├─────────────────────────────────────────────────────────────┤
│                  Kubernetes Cluster                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Pod 1     │  │   Pod 2     │  │   Pod 3     │        │
│  │ (Frontend)  │  │ (Frontend)  │  │ (Frontend)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Services & APIs                          │
├─────────────────────────────────────────────────────────────┤
│                     Database                               │
├─────────────────────────────────────────────────────────────┤
│                  Monitoring & Logging                        │
└─────────────────────────────────────────────────────────────┘
```

## 环境要求

### Kubernetes集群要求
- Kubernetes版本 >= 1.20
- 至少3个worker节点
- 节点配置：2 CPU, 4GB RAM
- 存储容量：至少20GB

### 网络要求
- Load Balancer支持
- Ingress Controller (nginx)
- SSL证书管理 (cert-manager)
- DNS配置

### 安全要求
- RBAC权限配置
- 网络策略配置
- Pod Security Policies
- 镜像安全扫描

## 部署方式

### 1. Kubernetes部署 (推荐)

#### 前提条件
- kubectl命令行工具已安装
- 集群访问权限已配置
- Docker镜像已推送到镜像仓库

#### 部署步骤

1. **克隆代码仓库**
```bash
git clone https://github.com/hkhr-project/ai-evaluation.git
cd ai-evaluation/frontend
```

2. **配置环境变量**
```bash
# 复制环境配置模板
cp .env.example .env.production

# 编辑配置文件
vim .env.production
```

3. **构建Docker镜像**
```bash
# 构建生产镜像
docker build -t ghcr.io/hkhr-project/ai-evaluation-frontend:latest .

# 推送镜像到仓库
docker push ghcr.io/hkhr-project/ai-evaluation-frontend:latest
```

4. **部署到Kubernetes**
```bash
# 使用部署脚本
./scripts/deploy-k8s.sh production

# 或者手动部署
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment-prod.yaml
```

5. **验证部署**
```bash
# 检查Pod状态
kubectl get pods -n hkhr-evaluation-production

# 检查服务状态
kubectl get services -n hkhr-evaluation-production

# 检查Ingress状态
kubectl get ingress -n hkhr-evaluation-production

# 运行健康检查
./scripts/deploy-k8s.sh production --health-only
```

### 2. Docker Compose部署

#### 部署步骤

1. **克隆代码仓库**
```bash
git clone https://github.com/hkhr-project/ai-evaluation.git
cd ai-evaluation/frontend
```

2. **构建应用**
```bash
npm run build:production
```

3. **部署应用**
```bash
# 生产环境部署
docker-compose -f docker-compose.prod.yml up -d

# 检查状态
docker-compose -f docker-compose.prod.yml ps
```

### 3. Terraform部署

#### 前提条件
- Terraform >= 1.0
- terraform-provider-kubernetes
- AWS/GCP/Azure CLI工具

#### 部署步骤

1. **初始化Terraform**
```bash
cd terraform
terraform init
```

2. **配置变量**
```bash
cp terraform.tfvars.example terraform.tfvars
vim terraform.tfvars
```

3. **规划部署**
```bash
terraform plan
```

4. **执行部署**
```bash
terraform apply
```

5. **验证部署**
```bash
terraform output
```

## 配置管理

### 环境变量配置

#### 生产环境变量 (.env.production)
```bash
# 应用配置
VITE_APP_NAME=AI教学评价系统
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.hkhr-evaluation.com
VITE_WS_URL=wss://api.hkhr-evaluation.com

# 功能开关
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_SERVICE_WORKER=true

# 第三方服务
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```

### Kubernetes配置

#### ConfigMap配置
- Nginx配置
- 应用配置
- 环境变量

#### Secrets配置
- SSL证书
- API密钥
- 数据库凭据

### 监控配置

#### Prometheus指标
```yaml
# ServiceMonitor配置
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: hkhr-evaluation-frontend-metrics
spec:
  selector:
    matchLabels:
      app: hkhr-evaluation-frontend
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

#### 日志配置
```yaml
# Fluentd配置
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/nginx/access.log
      pos_file /var/log/fluentd/access.log.pos
      tag nginx.access
      format nginx
    </source>
```

## 安全配置

### SSL/TLS配置
```bash
# 使用cert-manager自动管理SSL证书
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.8.0/cert-manager.yaml

# 配置Let's Encrypt证书颁发者
kubectl apply -f k8s/cert-manager/
```

### 网络策略
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: hkhr-evaluation-frontend-netpol
spec:
  podSelector:
    matchLabels:
      app: hkhr-evaluation-frontend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: hkhr-evaluation-backend
```

### Pod安全策略
```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: hkhr-evaluation-frontend-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

## 监控和告警

### 应用监控
- Prometheus指标收集
- Grafana仪表盘
- 自定义业务指标

### 基础设施监控
- 节点资源使用率
- Pod健康状态
- 服务可用性

### 日志管理
- 结构化日志收集
- 集中式日志存储
- 日志分析和告警

### 告警配置
```yaml
# PrometheusRule配置
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: hkhr-evaluation-frontend-alerts
spec:
  groups:
  - name: frontend.rules
    rules:
    - alert: FrontendHighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
      for: 10m
      labels:
        severity: warning
      annotations:
        summary: "High error rate detected"
        description: "Frontend error rate is {{ $value }} errors per second"
```

## 备份和恢复

### 数据备份
- 用户数据备份
- 配置文件备份
- 数据库备份

### 灾难恢复
- 多区域部署
- 自动故障转移
- 数据恢复流程

## 性能优化

### 应用层优化
- 代码分割和懒加载
- 图片压缩和优化
- CDN加速
- 缓存策略

### 基础设施优化
- 节点资源调优
- 网络优化
- 存储优化

### 监控优化
- 性能指标监控
- 用户行为分析
- APM工具集成

## 故障排除

### 常见问题

#### Pod启动失败
```bash
# 查看Pod事件
kubectl describe pod <pod-name> -n hkhr-evaluation-production

# 查看Pod日志
kubectl logs <pod-name> -n hkhr-evaluation-production
```

#### 服务访问问题
```bash
# 测试服务连接
kubectl exec -it <pod-name> -n hkhr-evaluation-production -- curl http://localhost:8080/health

# 检查网络策略
kubectl get networkpolicy -n hkhr-evaluation-production
```

#### Ingress配置问题
```bash
# 检查Ingress状态
kubectl describe ingress hkhr-evaluation-frontend-ingress -n hkhr-evaluation-production

# 检查Ingress Controller日志
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

### 调试工具
- kubectl命令行工具
- Kubernetes Dashboard
- 应用日志分析
- 性能分析工具

## 部署脚本

### 自动化部署脚本
```bash
#!/bin/bash
# production-deploy.sh

# 设置环境变量
export ENVIRONMENT=production
export DOCKER_IMAGE=ghcr.io/hkhr-project/ai-evaluation-frontend
export IMAGE_TAG=v1.0.0

# 执行部署
./scripts/deploy-k8s.sh $ENVIRONMENT --image $DOCKER_IMAGE --tag $IMAGE_TAG

# 验证部署
./scripts/deploy-k8s.sh $ENVIRONMENT --health-only
```

### 回滚脚本
```bash
#!/bin/bash
# rollback.sh

# 回滚到上一个版本
kubectl rollout undo deployment/hkhr-evaluation-frontend -n hkhr-evaluation-production

# 检查回滚状态
kubectl rollout status deployment/hkhr-evaluation-frontend -n hkhr-evaluation-production
```

## 维护和更新

### 滚动更新
- 零停机部署
- 金丝雀发布
- 蓝绿部署

### 版本管理
- Git标签管理
- Docker镜像版本控制
- Kubernetes版本控制

### 定期维护
- 依赖更新
- 安全补丁
- 性能优化

## 联系方式

- 技术支持邮箱：support@hkhr-evaluation.com
- 文档地址：https://docs.hkhr-evaluation.com
- 问题反馈：https://github.com/hkhr-project/ai-evaluation/issues

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。