-- 创建数据源表
-- 支持MVP中的职教云数据集成

-- 数据源表
CREATE TABLE data_sources (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 基础信息
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'zhijiaoyun' CHECK (type IN ('zhijiaoyun', 'manual', 'api')),
    description TEXT,

    -- 状态信息
    status VARCHAR(20) NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
    last_sync_at TIMESTAMP,
    last_error TEXT,
    sync_count INTEGER NOT NULL DEFAULT 0,

    -- 配置信息
    config JSONB NOT NULL DEFAULT '{}',

    -- 审计字段
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX idx_data_sources_type ON data_sources(type);
CREATE INDEX idx_data_sources_status ON data_sources(status);
CREATE INDEX idx_data_sources_last_sync_at ON data_sources(last_sync_at);
CREATE INDEX idx_data_sources_created_by ON data_sources(created_by);
CREATE INDEX idx_data_sources_created_at ON data_sources(created_at);

-- 添加表注释
COMMENT ON TABLE data_sources IS '数据源表 - 管理外部数据源连接配置';
COMMENT ON COLUMN data_sources.id IS '数据源唯一标识';
COMMENT ON COLUMN data_sources.name IS '数据源名称';
COMMENT ON COLUMN data_sources.type IS '数据源类型：zhijiaoyun-职教云，manual-手动，api-其他API';
COMMENT ON COLUMN data_sources.description IS '数据源描述';
COMMENT ON COLUMN data_sources.status IS '数据源状态：active-活跃，inactive-未激活，error-错误';
COMMENT ON COLUMN data_sources.last_sync_at IS '最后同步时间';
COMMENT ON COLUMN data_sources.last_error IS '最后同步错误信息';
COMMENT ON COLUMN data_sources.sync_count IS '同步次数统计';
COMMENT ON COLUMN data_sources.config IS '数据源配置信息（JSON格式）';
COMMENT ON COLUMN data_sources.created_at IS '创建时间';
COMMENT ON COLUMN data_sources.updated_at IS '更新时间';
COMMENT ON COLUMN data_sources.created_by IS '创建人ID';
COMMENT ON COLUMN data_sources.updated_by IS '更新人ID';

-- 创建更新时间触发器
CREATE TRIGGER update_data_sources_updated_at
    BEFORE UPDATE ON data_sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();