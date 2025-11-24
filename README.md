# AI助评系统

基于人工智能技术的智能教学评价平台，通过数据驱动的方式，实现对教师教学质量、课堂教学质量的科学评估。

## 项目概述

AI助评系统是一个现代化的教学评价管理平台，旨在：

- 🎯 **核心业务**：实现"数据集成 → AI分析 → 结果可视化"的完整业务闭环
- 🤖 **智能分析**：基于规则引擎的多维度教学质量评价
- 📊 **数据可视化**：直观的仪表盘和报表展示
- 🔐 **权限管理**：支持管理员和教师两种角色的权限控制

## 技术栈

### 前端
- **React 18+** - 现代化的UI框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **Zustand** - 轻量级状态管理
- **Recharts** - 数据可视化图表库
- **Vite** - 快速的构建工具

### 后端
- **Deno** - 现代化的JavaScript运行时
- **Hono** - 轻量级的Web框架
- **PostgreSQL** - 强大的关系型数据库
- **Supabase** - 开箱即用的后端服务
- **JWT** - 无状态身份认证

### 部署
- **Docker** - 容器化部署
- **Nginx** - 反向代理和负载均衡
- **Docker Compose** - 多容器编排

## 项目结构

```
ai-evaluation-system/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/       # React组件
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API服务
│   │   ├── stores/          # 状态管理
│   │   ├── types/           # TypeScript类型
│   │   └── utils/           # 工具函数
│   ├── public/              # 静态资源
│   └── tests/               # 测试文件
├── backend/                 # 后端应用
│   ├── src/
│   │   ├── routes/          # 路由定义
│   │   ├── services/        # 业务服务
│   │   ├── repositories/    # 数据仓储
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # 数据模型
│   │   └── utils/           # 工具函数
│   └── tests/               # 测试文件
├── deployment/              # 部署配置
│   └── docker/              # Docker配置
├── database/                # 数据库相关
│   ├── migrations/          # 数据库迁移
│   └── seeds/               # 初始数据
├── docs/                    # 项目文档
│   ├── 01需求分析文档/       # 需求分析
│   └── 02设计文档_MVP/       # MVP设计文档
└── scripts/                 # 脚本文件
```

## 快速开始

### 环境要求

- Node.js 18+
- Deno 1.38+
- PostgreSQL 15+
- Docker & Docker Compose (可选)

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd ai-evaluation-system
```

2. **安装依赖**

前端：
```bash
cd frontend
npm install
```

后端：
```bash
cd backend
# Deno会自动安装依赖
```

3. **配置环境变量**

后端环境变量：
```bash
cd backend
cp .env.example .env
# 编辑.env文件，配置数据库等信息
```

4. **启动数据库**

使用Docker启动PostgreSQL：
```bash
docker-compose -f deployment/docker/docker-compose.yml up postgres -d
```

5. **运行数据库迁移**
```bash
cd database
# 执行迁移脚本
```

6. **启动应用**

前端：
```bash
cd frontend
npm run dev
# 访问 http://localhost:3000
```

后端：
```bash
cd backend
deno task dev
# 访问 http://localhost:8000
```

### Docker部署

1. **构建并启动所有服务**
```bash
docker-compose -f deployment/docker/docker-compose.yml up -d
```

2. **访问应用**
- 前端：http://localhost:3000
- 后端API：http://localhost:8000
- 数据库：localhost:5432

## 默认账号

系统预设了以下账号用于测试：

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 教师 | teacher | teacher123 |

## 核心功能

### 🔐 用户认证
- JWT无状态认证
- 角色权限控制（管理员/教师）
- 会话管理和自动登出

### 📊 数据集成
- 职教云API对接
- 数据采集和质量控制
- 增量数据同步

### 🤖 AI分析引擎
- 可配置的评价规则
- 多维度指标计算
- 批量分析处理

### 📈 可视化展示
- 实时仪表盘
- 多种图表类型
- 报表导出功能

## 开发规范

### 代码风格
- 前端使用ESLint + Prettier
- 后端使用Deno内置的linter和formatter
- 提交前必须通过代码检查

### Git工作流
- 主分支：`main`
- 开发分支：`develop`
- 功能分支：`feature/功能名称`
- 修复分支：`hotfix/问题描述`

### 测试要求
- 单元测试覆盖率 ≥ 80%
- 集成测试覆盖核心业务流程
- 端到端测试覆盖主要用户场景

## API文档

详细的API文档请参考：[API接口规范](./docs/02设计文档_MVP/04-API设计/01-API接口规范.md)

## 部署指南

详细的部署指南请参考：[部署架构设计](./docs/02设计文档_MVP/08-部署设计/01-部署架构设计.md)

## 开发工作流程

为了确保开发质量和一致性，我们制定了详细的[开发工作流程规则](./开发工作流程规则.md)，请严格遵循。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系我们

- 项目团队：教务处信息技术中心
- 邮箱：[联系邮箱]
- 问题反馈：[Issues页面]

---

**注意**：这是一个MVP（最小可行产品）版本，专注于核心业务流程的验证。更多功能将在后续版本中逐步完善。