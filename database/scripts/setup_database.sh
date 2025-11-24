#!/bin/bash

# AI助评系统数据库初始化脚本
# 用于创建数据库和初始化基础数据

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    echo "AI助评系统数据库初始化脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help              显示此帮助信息"
    echo "  -d, --database DB_NAME   指定数据库名称 (默认: ai_evaluation)"
    echo "  -u, --user USER         指定数据库用户 (默认: postgres)"
    echo "  -p, --password PASS     指定数据库密码 (默认: postgres123)"
    echo "  -H, --host HOST         指定数据库主机 (默认: localhost)"
    echo "  -P, --port PORT         指定数据库端口 (默认: 5432)"
    echo "  --dry-run               仅显示将要执行的SQL，不实际执行"
    echo "  --migrate-only          仅执行数据库迁移，不执行种子数据"
    echo "  --seed-only             仅执行种子数据，不执行迁移"
    echo ""
    echo "示例:"
    echo "  $0                                    # 使用默认设置初始化数据库"
    echo "  $0 -d mydb -u myuser -p mypass       # 使用自定义设置"
    echo "  $0 --dry-run                         # 预览SQL脚本"
}

# 默认数据库连接参数
DB_NAME="ai_evaluation"
DB_USER="postgres"
DB_PASSWORD="postgres123"
DB_HOST="localhost"
DB_PORT="5432"
DRY_RUN=false
MIGRATE_ONLY=false
SEED_ONLY=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--database)
            DB_NAME="$2"
            shift 2
            ;;
        -u|--user)
            DB_USER="$2"
            shift 2
            ;;
        -p|--password)
            DB_PASSWORD="$2"
            shift 2
            ;;
        -H|--host)
            DB_HOST="$2"
            shift 2
            ;;
        -P|--port)
            DB_PORT="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --migrate-only)
            MIGRATE_ONLY=true
            shift
            ;;
        --seed-only)
            SEED_ONLY=true
            shift
            ;;
        *)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 检查PostgreSQL是否安装
if ! command -v psql &> /dev/null; then
    log_error "PostgreSQL客户端(psql)未安装，请先安装PostgreSQL"
    exit 1
fi

# 检查是否需要显示帮助
if [ "$DRY_RUN" = true ]; then
    log_info "预览模式 - 仅显示将要执行的SQL文件"
    echo ""
fi

# 构建数据库连接字符串
export PGPASSWORD="$DB_PASSWORD"
DB_CONNECTION="postgresql://$DB_USER@$DB_HOST:$DB_PORT"

log_info "开始数据库初始化..."
log_info "数据库: $DB_NAME"
log_info "用户: $DB_USER"
log_info "主机: $DB_HOST:$DB_PORT"
echo ""

# 检查数据库连接
log_info "检查数据库连接..."
if ! psql "$DB_CONNECTION/postgres" -c "\l" > /dev/null 2>&1; then
    log_error "无法连接到PostgreSQL服务器，请检查连接参数"
    exit 1
fi
log_success "数据库连接成功"

# 创建数据库（如果不存在）
log_info "检查并创建数据库..."
DB_EXISTS=$(psql "$DB_CONNECTION/postgres" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null | tr -d ' ')

if [ "$DB_EXISTS" != "1" ]; then
    log_info "创建数据库: $DB_NAME"
    if [ "$DRY_RUN" = false ]; then
        psql "$DB_CONNECTION/postgres" -c "CREATE DATABASE $DB_NAME WITH ENCODING='UTF8' LC_COLLATE='C' LC_CTYPE='C';"
        if [ $? -eq 0 ]; then
            log_success "数据库创建成功"
        else
            log_error "数据库创建失败"
            exit 1
        fi
    else
        log_info "[预览] CREATE DATABASE $DB_NAME WITH ENCODING='UTF8' LC_COLLATE='C' LC_CTYPE='C';"
    fi
else
    log_info "数据库 $DB_NAME 已存在"
fi

# 切换到目标数据库
TARGET_DB_CONNECTION="postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"

# 执行数据库迁移（除非指定了--seed-only）
if [ "$SEED_ONLY" = false ]; then
    log_info "开始执行数据库迁移..."

    # 获取迁移文件列表
    MIGRATION_FILES=$(find "$(dirname "$0")/../migrations" -name "*.sql" | sort -V)
    MIGRATION_COUNT=$(echo "$MIGRATION_FILES" | wc -l)

    log_info "找到 $MIGRATION_COUNT 个迁移文件"

    for migration_file in $MIGRATION_FILES; do
        migration_name=$(basename "$migration_file" .sql)
        log_info "执行迁移: $migration_name"

        if [ "$DRY_RUN" = false ]; then
            psql "$TARGET_DB_CONNECTION" -f "$migration_file"
            if [ $? -eq 0 ]; then
                log_success "迁移 $migration_name 执行成功"
            else
                log_error "迁移 $migration_name 执行失败"
                exit 1
            fi
        else
            echo "----------------------------------------------------------------------"
            echo "文件: $migration_file"
            echo "----------------------------------------------------------------------"
            cat "$migration_file"
            echo ""
            echo "----------------------------------------------------------------------"
        fi
    done

    log_success "数据库迁移完成"
fi

# 执行种子数据（除非指定了--migrate-only）
if [ "$MIGRATE_ONLY" = false ]; then
    log_info "开始执行种子数据..."

    # 获取种子文件列表
    SEED_FILES=$(find "$(dirname "$0")/../seeds" -name "*.sql" | sort -V)
    SEED_COUNT=$(echo "$SEED_FILES" | wc -l)

    log_info "找到 $SEED_COUNT 个种子数据文件"

    for seed_file in $SEED_FILES; do
        seed_name=$(basename "$seed_file" .sql)
        log_info "执行种子数据: $seed_name"

        if [ "$DRY_RUN" = false ]; then
            psql "$TARGET_DB_CONNECTION" -f "$seed_file"
            if [ $? -eq 0 ]; then
                log_success "种子数据 $seed_name 执行成功"
            else
                log_error "种子数据 $seed_name 执行失败"
                exit 1
            fi
        else
            echo "----------------------------------------------------------------------"
            echo "文件: $seed_file"
            echo "----------------------------------------------------------------------"
            cat "$seed_file"
            echo ""
            echo "----------------------------------------------------------------------"
        fi
    done

    log_success "种子数据执行完成"
fi

# 验证数据库结构
if [ "$DRY_RUN" = false ]; then
    log_info "验证数据库结构..."

    # 检查表数量
    TABLE_COUNT=$(psql "$TARGET_DB_CONNECTION" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'" 2>/dev/null | tr -d ' ')
    log_success "数据库表数量: $TABLE_COUNT"

    # 显示创建的表
    log_info "已创建的表:"
    psql "$TARGET_DB_CONNECTION" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;" 2>/dev/null

    # 显示用户数据
    log_info "默认用户:"
    psql "$TARGET_DB_CONNECTION" -c "SELECT username, name, role, is_active FROM users ORDER BY role, username;" 2>/dev/null

    # 显示教师数据
    log_info "教师信息:"
    psql "$TARGET_DB_CONNECTION" -c "SELECT teacher_code, name, title, department FROM teachers ORDER BY teacher_code;" 2>/dev/null

    # 显示课程数据
    log_info "课程信息:"
    psql "$TARGET_DB_CONNECTION" -c "SELECT course_code, name, credits, department FROM courses ORDER BY course_code;" 2>/dev/null

    # 显示评价规则
    log_info "评价规则:"
    psql "$TARGET_DB_CONNECTION" -c "SELECT code, name, category, weight, is_active FROM evaluation_rules ORDER BY category, priority;" 2>/dev/null
fi

log_success "数据库初始化完成！"
echo ""
log_info "数据库连接信息:"
log_info "  主机: $DB_HOST:$DB_PORT"
log_info "  数据库: $DB_NAME"
log_info "  用户: $DB_USER"
echo ""
log_info "✅ 预设账户已创建完成:"
echo ""
log_info "👑 管理员账户:"
log_info "  用户名: admin"
log_info "  密码: admin123"
log_info "  权限: 系统超级管理员"
echo ""
log_info "👨‍🏫 教师账户:"
log_info "  用户名: teacher     | 密码: teacher123 | 姓名: 张老师"
log_info "  用户名: wang_teacher | 密码: wang123   | 姓名: 王老师"
log_info "  用户名: li_teacher   | 密码: li123     | 姓名: 李老师"
log_info "  用户名: chen_teacher | 密码: chen123   | 姓名: 陈老师"
log_info "  用户名: zhang_teacher| 密码: zhang123  | 姓名: 张老师"
echo ""
log_warning "⚠️  安全提醒: 这是开发环境密码，生产环境请务必修改！"
echo ""
log_info "下一步:"
log_info "  1. 启动后端服务: cd backend && deno task dev"
log_info "  2. 启动前端服务: cd frontend && npm run dev"
log_info "  3. 访问系统: http://localhost:3000"