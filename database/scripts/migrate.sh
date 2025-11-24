#!/bin/bash

# 数据库迁移管理脚本
# 用于管理数据库迁移的执行和回滚

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

show_help() {
    echo "数据库迁移管理脚本"
    echo ""
    echo "用法: $0 <命令> [选项]"
    echo ""
    echo "命令:"
    echo "  up                     执行所有待执行的迁移"
    echo "  up <迁移文件名>         执行指定的迁移文件"
    echo "  down                   回滚最后一次迁移"
    echo "  down <版本号>           回滚到指定版本"
    echo "  status                 显示迁移状态"
    echo "  create <迁移文件名>     创建新的迁移文件"
    echo "  list                   列出所有迁移文件"
    echo ""
    echo "选项:"
    echo "  -d, --database DB_NAME 指定数据库名称"
    echo "  -u, --user USER         指定数据库用户"
    echo "  -p, --password PASS     指定数据库密码"
    echo "  -H, --host HOST         指定数据库主机"
    echo "  -P, --port PORT         指定数据库端口"
    echo "  --dry-run              预览操作，不实际执行"
    echo ""
    echo "示例:"
    echo "  $0 up                          # 执行所有迁移"
    echo "  $0 up 002_create_tables.sql     # 执行特定迁移"
    echo "  $0 down                        # 回滚最后迁移"
    echo "  $0 status                      # 查看迁移状态"
    echo "  $0 create 003_add_column.sql    # 创建新迁移文件"
}

# 默认参数
DB_NAME="ai_evaluation"
DB_USER="postgres"
DB_PASSWORD="postgres123"
DB_HOST="localhost"
DB_PORT="5432"
DRY_RUN=false

# 解析命令行参数
COMMAND=""
MIGRATION_FILE=""
VERSION=""

while [[ $# -gt 0 ]]; do
    case $1 in
        up|down|status|create|list)
            COMMAND="$1"
            shift
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
        -h|--help)
            show_help
            exit 0
            ;;
        *.sql)
            MIGRATION_FILE="$1"
            shift
            ;;
        *)
            if [ "$COMMAND" = "down" ] && [[ "$1" =~ ^[0-9]+$ ]]; then
                VERSION="$1"
            else
                log_error "未知参数: $1"
                show_help
                exit 1
            fi
            shift
            ;;
    esac
done

# 检查命令
if [ -z "$COMMAND" ]; then
    log_error "请指定命令"
    show_help
    exit 1
fi

# 构建连接字符串
export PGPASSWORD="$DB_PASSWORD"
DB_CONNECTION="postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
MIGRATIONS_DIR="$(dirname "$0")/../migrations"

# 创建迁移表（如果不存在）
ensure_migration_table() {
    log_info "确保迁移表存在..."

    local create_table_sql="
    CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) NOT NULL UNIQUE,
        migration_name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    "

    if [ "$DRY_RUN" = false ]; then
        psql "$DB_CONNECTION" -c "$create_table_sql" > /dev/null 2>&1
    fi
}

# 获取已执行的迁移
get_executed_migrations() {
    psql "$DB_CONNECTION" -tAc "SELECT version FROM schema_migrations ORDER BY version" 2>/dev/null | tr -d ' ' || echo ""
}

# 获取所有迁移文件
get_all_migrations() {
    find "$MIGRATIONS_DIR" -name "*.sql" | sort -V | xargs -I {} basename {} .sql
}

# 获取待执行的迁移
get_pending_migrations() {
    local executed=$(get_executed_migrations)
    local all=$(get_all_migrations)

    for migration in $all; do
        if ! echo "$executed" | grep -q "^$migration$"; then
            echo "$migration"
        fi
    done
}

# 执行单个迁移
execute_migration() {
    local migration_file="$1"
    local migration_name=$(basename "$migration_file" .sql)

    log_info "执行迁移: $migration_name"

    if [ "$DRY_RUN" = true ]; then
        log_info "[预览] 将执行: $migration_file"
        return 0
    fi

    # 执行迁移文件
    if psql "$DB_CONNECTION" -f "$migration_file"; then
        # 记录迁移执行
        psql "$DB_CONNECTION" -c "INSERT INTO schema_migrations (version, migration_name) VALUES ('$migration_name', '$migration_name');" > /dev/null
        log_success "迁移 $migration_name 执行成功"
        return 0
    else
        log_error "迁移 $migration_name 执行失败"
        return 1
    fi
}

# 回滚迁移
rollback_migration() {
    local version="$1"

    log_info "回滚到版本: $version"

    if [ "$DRY_RUN" = true ]; then
        log_info "[预览] 将删除版本 $version 之后的迁移记录"
        return 0
    fi

    # 删除指定版本之后的迁移记录
    psql "$DB_CONNECTION" -c "DELETE FROM schema_migrations WHERE version > '$version';"
    log_success "已回滚到版本 $version"
}

# 创建新迁移文件
create_migration() {
    local migration_name="$1"

    if [ -z "$migration_name" ]; then
        log_error "请指定迁移文件名"
        exit 1
    fi

    # 确保文件名包含时间戳前缀
    if [[ ! "$migration_name" =~ ^[0-9]{3} ]]; then
        local timestamp=$(date +%Y%m%d_%H%M%S)
        migration_name="${timestamp}_${migration_name}"
    fi

    # 确保文件扩展名是.sql
    if [[ ! "$migration_name" =~ \.sql$ ]]; then
        migration_name="${migration_name}.sql"
    fi

    local migration_file="$MIGRATIONS_DIR/$migration_name"

    if [ -f "$migration_file" ]; then
        log_error "迁移文件已存在: $migration_file"
        exit 1
    fi

    # 创建迁移文件模板
    cat > "$migration_file" << EOF
-- Migration: $migration_name
-- Created: $(date '+%Y-%m-%d %H:%M:%S')
-- Description:

-- Add your migration SQL here

-- Don't forget to update the migration history
-- The migration system will automatically track this file
EOF

    log_success "迁移文件已创建: $migration_file"
    log_info "请编辑文件并添加迁移SQL语句"
}

# 显示迁移状态
show_status() {
    log_info "迁移状态:"
    echo ""

    local executed=$(get_executed_migrations)
    local pending=$(get_pending_migrations)

    echo "已执行的迁移 ($({ #executed })):"
    if [ -n "$executed" ]; then
        echo "$executed" | sed 's/^/  - /'
    else
        echo "  (无)"
    fi

    echo ""
    echo "待执行的迁移 ($({ #pending })):"
    if [ -n "$pending" ]; then
        echo "$pending" | sed 's/^/  - /'
    else
        echo "  (无)"
    fi

    echo ""
    echo "所有迁移文件 ($({ #all := $(get_all_migrations | wc -l); echo $all })):"
    get_all_migrations | sed 's/^/  - /'
}

# 列出所有迁移文件
list_migrations() {
    log_info "所有迁移文件:"
    echo ""

    get_all_migrations | while read migration; do
        local file="$MIGRATIONS_DIR/${migration}.sql"
        local status="pending"

        if echo "$(get_executed_migrations)" | grep -q "^$migration$"; then
            status="executed"
        fi

        echo "  - $migration ($status)"
    done
}

# 主逻辑
case "$COMMAND" in
    up)
        ensure_migration_table

        if [ -n "$MIGRATION_FILE" ]; then
            # 执行特定迁移
            if [ -f "$MIGRATIONS_DIR/$MIGRATION_FILE" ]; then
                execute_migration "$MIGRATIONS_DIR/$MIGRATION_FILE"
            else
                log_error "迁移文件不存在: $MIGRATION_FILE"
                exit 1
            fi
        else
            # 执行所有待执行的迁移
            local pending=$(get_pending_migrations)
            if [ -n "$pending" ]; then
                log_info "发现 $({ #pending := $(echo "$pending" | wc -l); echo $pending }) 个待执行的迁移"

                for migration in $pending; do
                    execute_migration "$MIGRATIONS_DIR/${migration}.sql"
                done

                log_success "所有待执行迁移已完成"
            else
                log_info "没有待执行的迁移"
            fi
        fi
        ;;
    down)
        ensure_migration_table

        if [ -n "$VERSION" ]; then
            rollback_migration "$VERSION"
        else
            # 回滚最后一次迁移
            local last_migration=$(psql "$DB_CONNECTION" -tAc "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1" 2>/dev/null | tr -d ' ')

            if [ -n "$last_migration" ]; then
                rollback_migration "$last_migration"
            else
                log_info "没有已执行的迁移可以回滚"
            fi
        fi
        ;;
    status)
        ensure_migration_table
        show_status
        ;;
    create)
        create_migration "$MIGRATION_FILE"
        ;;
    list)
        list_migrations
        ;;
    *)
        log_error "未知命令: $COMMAND"
        show_help
        exit 1
        ;;
esac