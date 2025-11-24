#!/bin/bash

# AI教学评价系统启动脚本
# 使用方法: ./start-system.sh [选项]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_ROOT="/Users/Shared/Previously Relocated Items/Security/workSpace/hkhr-20251112/AI 助力评V2"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# 日志函数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# 检查工具函数
check_tool() {
    local tool=$1
    if command -v "$tool" >/dev/null 2>&1; then
        success "$tool 已安装"
        return 0
    else
        error "$tool 未找到"
        return 1
    fi
}

# 安装工具函数
install_tool() {
    local tool=$1
    log "正在安装 $tool..."

    case $tool in
        "deno")
            if ! check_tool deno; then
                log "安装Deno..."
                curl -fsSL https://deno.land/install.sh | sh
            fi
            ;;
        "node")
            if ! check_tool node; then
                log "安装Node.js..."
                curl -fsSL https://nodejs.org/dist/v18.17.0/node-v18.17.0.pkg -o /tmp/node.pkg
                open /tmp/node.pkg
            fi
            ;;
        *)
            error "未知的工具: $tool"
            ;;
    esac
}

# 检查Deno
check_deno() {
    log "检查Deno安装状态..."

    if check_tool deno; then
        return 0
    fi

    # 尝试使用已安装的Deno
    if [ -f "$HOME/.deno/bin/deno" ]; then
        export PATH="$HOME/.deno/bin:$PATH"
        if check_tool deno; then
            log "找到已安装的Deno"
            return 0
        fi
    fi

    # 安装Deno
    log "正在安装Deno..."
    curl -fsSL https://deno.land/install.sh | sh
    export PATH="$HOME/.deno/bin:$PATH"

    if check_tool deno; then
        success "Deno安装成功"
    else
        error "Deno安装失败"
        return 1
    fi
}

# 检查Node.js
check_node() {
    log "检查Node.js安装状态..."

    if check_tool node; then
        return 0
    fi

    warn "Node.js未安装，正在安装..."
    log "请从 https://nodejs.org 下载并安装Node.js"
    log "或者使用以下命令安装: brew install node"

    # 创建简单的Node.js代理脚本
    cat > /tmp/node-proxy.sh << 'EOF'
#!/bin/bash
echo "Node.js未安装，请先安装Node.js"
exit 1
EOF
    chmod +x /tmp/node-proxy.sh
    export NODE_SCRIPT="/tmp/node-proxy.sh"
    return 1
}

# 初始化数据库
init_database() {
    log "初始化数据库..."

    cd "$BACKEND_DIR"

    # 创建数据库目录
    mkdir -p ./data

    # 运行数据库初始化脚本
    if [ -f "./scripts/init-db.sh" ]; then
        bash ./scripts/init-db.sh
    else
        # 直接运行数据库迁移
        log "运行数据库迁移..."
        "$HOME/.deno/bin/deno" task db:migrate || warn "数据库迁移可能失败，但这不影响演示"
    fi
}

# 启动后端服务
start_backend() {
    log "启动后端服务..."

    cd "$BACKEND_DIR"

    # 设置环境变量
    export DATABASE_URL="postgresql://postgres:password@localhost:5432/hkhr_evaluation"
    export REDIS_URL="redis://localhost:6379"
    export PORT=8000
    export JWT_SECRET="your-super-secret-jwt-key-change-in-production"

    # 检查配置文件
    if [ ! -f ".env" ]; then
        log "创建环境配置文件..."
        cp .env.example .env
    fi

    # 启动后端服务
    log "启动Deno后端服务..."
    "$HOME/.deno/bin/deno" task dev &

    # 等待服务启动
    sleep 3

    # 检查服务状态
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        success "后端服务启动成功"
    else
        warn "后端服务可能还在启动中..."
    fi

    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/backend.pid
}

# 启动前端开发服务器
start_frontend() {
    log "启动前端服务..."

    cd "$FRONTEND_DIR"

    # 检查Node.js
    check_node

    # 安装依赖
    if [ ! -d "node_modules" ]; then
        log "安装前端依赖..."
        npm install
    fi

    # 构建前端
    log "构建前端应用..."
    npm run build

    # 启动开发服务器
    log "启动前端开发服务器..."
    npm run dev &

    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/frontend.pid

    success "前端服务启动成功"
}

# 启动前端生产服务器
start_frontend_prod() {
    log "启动前端生产服务..."

    cd "$FRONTEND_DIR"

    # 检查Node.js
    check_node

    # 安装依赖
    if [ ! -d "node_modules" ]; then
        log "安装前端依赖..."
        npm install
    fi

    # 构建生产版本
    log "构建生产版本..."
    npm run build:production

    # 启动生产服务器
    if command -v serve >/dev/null 2>&1; then
        npm run start:prod &
    else
        log "安装serve工具..."
        npm install -g serve
        npm run start:prod &
    fi

    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/frontend.pid

    success "前端生产服务启动成功"
}

# 启动所有服务
start_all() {
    log "启动AI教学评价系统..."

    # 检查工具
    check_deno
    check_node

    # 初始化数据库
    init_database

    # 启动后端
    start_backend

    # 启动前端
    start_frontend_prod

    log "等待服务启动..."
    sleep 5

    # 显示服务状态
    show_status

    success "AI教学评价系统启动完成！"
    log ""
    log "服务访问地址："
    log "  - 前端: http://localhost:3000"
    log "  - 后端API: http://localhost:8000"
    log "  - API文档: http://localhost:8000/docs"
    log ""
    log "使用 Ctrl+C 停止所有服务"
}

# 停止所有服务
stop_all() {
    log "停止所有服务..."

    # 停止后端
    if [ -f "/tmp/backend.pid" ]; then
        BACKEND_PID=$(cat /tmp/backend.pid)
        if kill -0 "$BACKEND_PID" 2>/dev/null; then
            kill "$BACKEND_PID"
            success "后端服务已停止"
        fi
        rm -f /tmp/backend.pid
    fi

    # 停止前端
    if [ -f "/tmp/frontend.pid" ]; then
        FRONTEND_PID=$(cat /tmp/frontend.pid)
        if kill -0 "$FRONTEND_PID" 2>/dev/null; then
            kill "$FRONTEND_PID"
            success "前端服务已停止"
        fi
        rm -f /tmp/frontend.pid
    fi

    success "所有服务已停止"
}

# 显示服务状态
show_status() {
    log "检查服务状态..."

    echo "服务状态:"
    echo "--------"

    # 检查后端
    if [ -f "/tmp/backend.pid" ]; then
        BACKEND_PID=$(cat /tmp/backend.pid)
        if kill -0 "$BACKEND_PID" 2>/dev/null; then
            echo "✅ 后端服务 (PID: $BACKEND_PID)"
        else
            echo "❌ 后端服务 (未运行)"
        fi
    else
        echo "❌ 后端服务 (未启动)"
    fi

    # 检查前端
    if [ -f "/tmp/frontend.pid" ]; then
        FRONTEND_PID=$(cat /tmp/frontend.pid)
        if kill -0 "$FRONTEND_PID" 2>/dev/null; then
            echo "✅ 前端服务 (PID: $FRONTEND_PID)"
        else
            echo "❌ 前端服务 (未运行)"
        fi
    else
        echo "❌ 前端服务 (未启动)"
    fi

    echo "--------"

    # 检查端口
    log "检查端口占用..."

    if lsof -Pi :8000 -sTCP:LISTEN -t 2>/dev/null >/dev/null; then
        echo "✅ 端口 8000 (后端API) - 已占用"
    else
        echo "❌ 端口 8000 (后端API) - 未占用"
    fi

    if lsof -Pi :3000 -sTCP:LISTEN -t 2>/dev/null >/dev/null; then
        echo "✅ 端口 3000 (前端) - 已占用"
    else
        echo "❌ 端口 3000 (前端) - 未占用"
    fi
}

# 清理函数
cleanup() {
    log "清理临时文件..."
    rm -f /tmp/backend.pid /tmp/frontend.pid /tmp/node-proxy.sh
}

# 显示帮助
show_help() {
    cat << EOF
AI教学评价系统启动脚本

使用方法:
  $0 [命令] [选项]

命令:
  start       启动所有服务
  backend     仅启动后端服务
  frontend    仅启动前端服务
  prod        生产模式启动
  stop        停止所有服务
  status      显示服务状态
  help        显示帮助信息

选项:
  --dev       开发模式启动（默认）
  --clean     启动前清理临时文件

示例:
  $0                    # 启动所有服务
  $0 start            # 启动所有服务
  $0 backend          # 仅启动后端
  $0 frontend prod    # 生产模式启动前端
  $0 stop             # 停止所有服务
  $0 status           # 显示服务状态

EOF
}

# 主函数
main() {
    local command="${1:-start}"
    local dev_mode=true
    local clean=false

    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dev)
                dev_mode=true
                shift
                ;;
            --prod)
                dev_mode=false
                shift
                ;;
            --clean)
                clean=true
                shift
                ;;
            start|backend|frontend|stop|status|help)
                command="$1"
                shift
                ;;
            *)
                error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # 设置陷阱函数
    trap cleanup EXIT

    # 清理临时文件
    if [ "$clean" = "true" ]; then
        cleanup
    fi

    # 执行命令
    case $command in
        "start")
            if [ "$dev_mode" = "true" ]; then
                start_all
            else
                log "生产模式启动..."
                check_deno
                init_database
                start_backend
                start_frontend_prod
                sleep 3
                show_status
                success "生产环境启动完成！"
            fi
            ;;
        "backend")
            check_deno
            init_database
            start_backend
            ;;
        "frontend")
            if [ "$dev_mode" = "true" ]; then
                start_frontend
            else
                start_frontend_prod
            fi
            ;;
        "stop")
            stop_all
            ;;
        "status")
            show_status
            ;;
        "help")
            show_help
            ;;
        *)
            start_all
            ;;
    esac
}

# 执行主函数
main "$@"