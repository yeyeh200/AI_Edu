# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

始终用中文输出思考过程和回答

## Project Overview

AI助评系统 (AI Evaluation System) - An intelligent teaching evaluation platform that implements "data integration → AI analysis → result visualization" workflow.

**Architecture**: Full-stack application with React frontend and Deno/Hono backend
**Database**: PostgreSQL with Supabase integration
**Core Business Flow**: Data Integration → AI Analysis → Result Visualization
**Key Stakeholders**: Administrators, Teachers, Students
**Development Phase**: MVP focused on core functionality validation

## Development Commands

### Frontend (React + Vite)
```bash
cd frontend

# Development
npm run dev                # Start dev server (http://localhost:5173)
npm run build             # Build for production
npm run preview           # Preview production build

# Code Quality
npm run lint              # ESLint check
npm run lint:fix          # Auto-fix ESLint issues
npm run format            # Prettier formatting
npm run type-check        # TypeScript type checking

# Testing
npm run test              # Run unit tests
npm run test:coverage     # Run tests with coverage
npm run test:integration  # Integration tests
npm run test:e2e          # End-to-end tests with Playwright

# Build Variants
npm run build:staging     # Staging environment build
npm run build:production  # Production environment build
```

### Backend (Deno + Hono)
```bash
cd backend

# Development
deno task dev             # Start with hot reload
deno task start           # Start production server
deno task check           # Type checking

# Testing
deno task test            # Run unit tests
deno task test:coverage   # Run tests with coverage

# Individual Module Tests
deno task test:auth              # Authentication tests
deno task test:zhijiaoyun        # Zhijiaoyun integration tests
deno task test:dataCollection    # Data collection tests
deno task test:aiAnalysis        # AI analysis tests
```

### System Operations
```bash
# Start entire system
./start-system.sh        # Start all services (frontend + backend + database)
./start-system.sh status # Check system status

# Database
cd database
./scripts/migrate.sh     # Run database migrations
./scripts/setup_database.sh # Setup database schema

# Docker deployment
docker-compose up -d     # Start all services with Docker
```

## Architecture Overview

### Directory Structure
```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API integration layer
│   │   ├── stores/          # Zustand state management
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── tests/               # Frontend test suite
│   └── deployment/          # Frontend deployment configs
├── backend/                 # Deno + Hono backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic layer
│   │   ├── repositories/    # Data access layer
│   │   ├── middleware/      # Request middleware
│   │   └── models/          # Data models
│   └── tests/               # Backend test suite
├── database/                # Database schema and migrations
│   ├── migrations/          # SQL migration files
│   └── scripts/             # Database utility scripts
└── docs/                    # Comprehensive documentation
    ├── 00原始数据表/         # Original data specifications
    ├── 01需求分析文档/       # Requirements analysis
    └── 设计文档_MVP/         # MVP design documents
```

### Key Architectural Patterns

**Frontend Architecture:**
- **State Management**: Zustand for global state, React Query for server state
- **Routing**: React Router with lazy loading for performance
- **UI Framework**: Tailwind CSS with custom component library
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: Axios with centralized API configuration

**Backend Architecture:**
- **Framework**: Hono for fast, lightweight API development
- **Authentication**: JWT-based stateless authentication
- **Database**: PostgreSQL with type-safe query patterns
- **External Integrations**: Modular service architecture for Zhijiaoyun, etc.
- **Error Handling**: Centralized error middleware with structured responses

### Data Flow Architecture
1. **Data Integration Layer**: Collects data from Zhijiaoyun,教务系统, 竞赛系统
2. **Data Processing**: ETL pipelines with quality control and validation
3. **AI Analysis Engine**: Rule-based evaluation with configurable metrics
4. **Visualization Layer**: Real-time dashboards and exportable reports

## Core Business Workflows

### MVP Core Functionality
The system implements these essential workflows:

1. **User Authentication Flow**
   - Simple authentication with preset accounts (admin/admin123, teacher/teacher123)
   - Role-based access control (Administrator vs Teacher views)

2. **Data Integration Flow**
   - External API integration (Zhijiaoyun platform)
   - Data quality validation and error handling
   - Incremental synchronization mechanisms

3. **AI Analysis Flow**
   - Configurable evaluation rules engine
   - Multi-dimensional quality metrics calculation
   - Batch processing capabilities

4. **Result Visualization Flow**
   - Real-time dashboard with multiple chart types
   - Report generation and export functionality
   - Responsive design for different screen sizes

### Key Data Entities
- **Users**: Administrative users and teaching staff
- **Courses**: Course information with enrollment data
- **Evaluations**: Teaching quality assessments
- **Metrics**: Calculated quality indicators
- **Reports**: Generated analysis outputs

## Development Guidelines

### Workflow Requirements (Critical)
Before starting any development task:
1. **Ask clarifying questions**: Understand business goals, current progress, and required documentation
2. **Read core documents**: Check requirements and architecture documents in `docs/设计文档_MVP/`
3. **Consistency check**: Ensure implementation matches design specifications

### Quality Standards
- **Code Quality**: TypeScript strict mode, ESLint + Prettier formatting
- **Test Coverage**: Minimum 80% unit test coverage
- **Documentation**: All APIs documented, complex logic commented
- **Performance**: Response times under 2 seconds, optimized bundle sizes

### Integration Patterns
- Use TypeScript interfaces for all data contracts
- Implement proper error boundaries in React components
- Follow REST API conventions for backend endpoints
- Maintain separation of concerns between layers

## Documentation References

### Essential Documents (Always Read First)
- `docs/01需求分析文档/AI助评应用软件需求规格说明书(SRS).md` - System requirements
- `docs/设计文档_MVP/01-需求与范围/01-MVP需求规格说明书.md` - MVP scope definition
- `docs/设计文档_MVP/02-架构设计/01-系统架构设计.md` - Technical architecture
- `docs/设计文档_MVP/04-API设计/01-API接口规范.md` - API specifications

### Design Documentation
- `docs/设计文档_MVP/05-UI设计/01-UI设计规范.md` - UI/UX guidelines
- `docs/设计文档_MVP/07-测试设计/01-测试策略设计.md` - Testing strategy
- `docs/设计文档_MVP/08-部署设计/01-部署架构设计.md` - Deployment architecture

### Data Specifications
- `docs/00原始数据表/` - Original data table specifications from all source systems
- `docs/01需求分析文档/用户故事/` - Detailed user stories and acceptance criteria

## Testing Strategy

### Test Organization
- **Unit Tests**: Component-level testing with Vitest/Testing Library
- **Integration Tests**: API endpoint and service layer testing
- **E2E Tests**: Critical user workflows with Playwright
- **Performance Tests**: Load testing for concurrent users

### Test Data Management
- Use test fixtures for consistent test data
- Mock external API responses for reliable testing
- Database transactions rolled back after each test

## Deployment Configuration

### Environment Setup
- **Development**: Local development with hot reload
- **Staging**: Pre-production environment with production-like data
- **Production**: Containerized deployment with Docker

### Docker Configuration
- Multi-stage builds for optimized production images
- Environment-specific configurations via environment variables
- Health checks and graceful shutdown handling

---
*Remember: This is an MVP project focused on core workflow validation. Prioritize working features over comprehensive scope.*

## 核心工作流程规则

### 🔥 开发任务启动三步法（必须严格遵守）

1. **询问通用问题**
   - "您需要我完成什么任务？"
   - "这个任务要达成的业务目标是什么？"
   - "当前进行到哪一步了？"
   - "我需要先阅读哪些文档来了解完整背景？"

2. **查阅核心文档**（按顺序执行）
   - `docs/设计文档_MVP/01-需求与范围/01-MVP需求规格说明书.md`
   - `docs/设计文档_MVP/02-架构设计/01-系统架构设计.md`
   - 根据任务类型查阅专项设计文档

3. **一致性检查**
   - 功能一致性：实现功能是否与需求规格一致？
   - 架构一致性：实现方案是否符合系统架构？
   - 接口一致性：API是否与接口规范一致？
   - UI一致性：界面是否与设计规范一致？

## 关键设计决策

### MVP范围策略
- ✅ **专注核心业务流程**: 数据集成 → AI分析 → 结果可视化
- ❌ **暂不实现**: 复杂用户管理、权限系统、组织架构
- ✅ **简化用户认证**: 使用预设账户（admin/teacher）

### 技术架构
- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Deno + Hono + PostgreSQL + Supabase
- **部署**: Docker容器化 + CI/CD
- **AI服务**: 集成外部AI分析服务

## 文档依赖关系

@开发工作流程规则.md
@开发实施检查清单.md
@开发工作流程速查卡.md

### 核心设计文档
@docs/设计文档_MVP/01-需求与范围/01-MVP需求规格说明书.md
@docs/设计文档_MVP/02-架构设计/01-系统架构设计.md
@docs/设计文档_MVP/04-API设计/01-API接口规范.md
@docs/设计文档_MVP/05-UI设计/01-UI设计规范.md
@docs/设计文档_MVP/07-测试设计/01-测试策略设计.md
@docs/设计文档_MVP/08-部署设计/01-部署架构设计.md

## 里程碑验证标准

### 里程碑1：核心功能开发完成
- [ ] **数据集成模块**: Excel/CSV上传 → 解析 → 存储 → 错误处理
- [ ] **AI分析模块**: 外部AI服务集成 → 多维度分析 → 结果存储
- [ ] **结果可视化模块**: 图表展示 → 数据导出 → 响应式适配
- [ ] **用户认证模块**: 预设登录 → 会话管理 → 权限控制

### 里程碑2：前后端集成
- [ ] **API集成**: 接口调用 → 错误处理 → 数据传输 → 性能
- [ ] **用户界面**: 页面渲染 → 交互流程 → 用户体验 → 兼容性

### 里程碑3：MVP功能验证
- [ ] **完整业务流程**: 登录 → 上传 → 分析 → 展示 → 导出
- [ ] **性能验证**: 响应时间 → 并发处理 → 资源使用

## AI缺陷预防措施（关键记忆）

### 防失忆机制
- 📝 **开发日志制度**: 每个开发步骤完成后记录
- 📸 **状态快照**: 每个里程碑完成后保存
- 🔄 **定期回顾**: 定期回顾设计文档和当前实现

### 防急于完成任务机制
- 🎯 **目标重述确认**: 开发前重述任务目标和业务价值
- ⏰ **进度检查**: 每30分钟检查一次进度与目标的对齐
- 🏆 **质量优先**: 坚持质量优先于进度

### 防经验主义机制
- 📊 **事实依据验证**: 每个决策都要有文档或测试依据
- 📖 **设计文档优先**: 严格遵循设计文档，不随意改动
- 👥 **用户需求验证**: 所有功能都要回溯到用户需求

## 基于证据的决策框架

### 证据收集
1. **文档证据**: 当前实现与设计文档的对比、已完成功能的测试报告
2. **测试证据**: 单元测试覆盖率、集成测试结果、用户验收测试结果
3. **用户证据**: 用户反馈数据、使用行为分析、性能监控数据

### 决策流程
1. **证据收集** → 2. **证据评估** → 3. **差距分析** → 4. **决策制定**

## 紧急情况处理

### 发现与设计文档冲突时
1. ⛔ **立即停止**当前开发
2. 📝 **记录冲突点**：具体哪里与文档不一致
3. 🔍 **分析原因**：为什么会出现冲突
4. ❓ **寻求确认**：是否需要修改设计或实现
5. 📄 **文档更新**：如需修改设计，先更新文档再继续

### 发现理解错误时
1. ✅ **承认错误**：明确承认理解偏差
2. 🔄 **重新确认**：重新确认任务目标和要求
3. 🔧 **方案调整**：根据正确理解调整实现方案
4. 📊 **影响评估**：评估错误理解对已有工作的影响
5. ✅ **修正实施**：修正错误的实现

## 质量标准

### 代码质量
- 命名规范符合项目标准
- 代码结构清晰，注释充分
- 没有重复代码，易于测试
- 模块化程度高，耦合度低

### 测试质量
- 单元测试覆盖率 ≥ 80%
- 集成测试覆盖主要流程
- 端到端测试覆盖核心业务
- 性能测试通过

### 文档质量
- API文档完整准确
- 代码注释充分
- 架构图清晰
- 部署文档详细

## 成功标准

### MVP成功标志
- ✅ 核心业务流程完整实现（数据集成→AI分析→结果可视化）
- ✅ 所有功能与设计文档一致
- ✅ 通过所有里程碑验证
- ✅ 满足所有验收标准
- ✅ 用户验收测试通过

### 开发成功标志
- ✅ 严格按照工作流程执行
- ✅ 没有偏离设计文档
- ✅ 所有检查项都通过验证
- ✅ 开发日志完整
- ✅ 代码质量达标

## 重要提醒

**这三个工作流程文档是确保MVP开发成功的保障，必须严格遵守：**

1. **开发工作流程规则.md** - 完整的规则和机制
2. **开发实施检查清单.md** - 详细的操作检查清单
3. **开发工作流程速查卡.md** - 快速参考指南

**记住：宁可慢一点，也要做对！严格遵守工作流程是成功的关键！**

---

*最后更新时间：2025-11-23*
*版本：v1.0*