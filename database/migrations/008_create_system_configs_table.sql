-- 创建系统配置表
-- 支持MVP中的系统管理功能

-- 系统配置表
CREATE TABLE system_configs (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 配置信息
    category VARCHAR(100) NOT NULL,
    config_key VARCHAR(200) NOT NULL,
    config_value JSONB NOT NULL,
    default_value JSONB,

    -- 描述信息
    name VARCHAR(200) NOT NULL,
    description TEXT,

    -- 配置类型
    data_type VARCHAR(50) NOT NULL DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json', 'array')),

    -- 控制信息
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,
    is_required BOOLEAN NOT NULL DEFAULT FALSE,

    -- 验证规则
    validation_rules JSONB DEFAULT '{}',
    allowed_values JSONB DEFAULT '[]',

    -- 版本控制
    version INTEGER NOT NULL DEFAULT 1,
    change_reason TEXT,

    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),

    -- 外部系统
    external_system VARCHAR(50),
    external_key VARCHAR(200),

    -- 审计字段
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 创建唯一约束
ALTER TABLE system_configs ADD CONSTRAINT uk_system_configs_category_key UNIQUE (category, config_key);

-- 创建索引
CREATE INDEX idx_system_configs_category ON system_configs(category);
CREATE INDEX idx_system_configs_config_key ON system_configs(config_key);
CREATE INDEX idx_system_configs_name ON system_configs(name);
CREATE INDEX idx_system_configs_data_type ON system_configs(data_type);
CREATE INDEX idx_system_configs_is_public ON system_configs(is_public);
CREATE INDEX idx_system_configs_is_editable ON system_configs(is_editable);
CREATE INDEX idx_system_configs_status ON system_configs(status);
CREATE INDEX idx_system_configs_external_system ON system_configs(external_system);
CREATE INDEX idx_system_configs_external_key ON system_configs(external_key);
CREATE INDEX idx_system_configs_created_by ON system_configs(created_by);
CREATE INDEX idx_system_configs_created_at ON system_configs(created_at);

-- 添加表注释
COMMENT ON TABLE system_configs IS '系统配置表 - 存储系统配置参数和设置';
COMMENT ON COLUMN system_configs.id IS '配置唯一标识';
COMMENT ON COLUMN system_configs.category IS '配置分类';
COMMENT ON COLUMN system_configs.config_key IS '配置键名';
COMMENT ON COLUMN system_configs.config_value IS '配置值（JSON格式）';
COMMENT ON COLUMN system_configs.default_value IS '默认值（JSON格式）';
COMMENT ON COLUMN system_configs.name IS '配置名称';
COMMENT ON COLUMN system_configs.description IS '配置描述';
COMMENT ON COLUMN system_configs.data_type IS '数据类型：string-字符串，number-数字，boolean-布尔值，json-JSON对象，array-数组';
COMMENT ON COLUMN system_configs.is_public IS '是否公开（是否对普通用户可见）';
COMMENT ON COLUMN system_configs.is_editable IS '是否可编辑';
COMMENT ON COLUMN system_configs.is_required IS '是否必需配置';
COMMENT ON COLUMN system_configs.validation_rules IS '验证规则（JSON格式）';
COMMENT ON COLUMN system_configs.allowed_values IS '允许的值（JSON格式）';
COMMENT ON COLUMN system_configs.version IS '版本号';
COMMENT ON COLUMN system_configs.change_reason IS '变更原因';
COMMENT ON COLUMN system_configs.status IS '状态：active-启用，inactive-禁用，deprecated-已弃用';
COMMENT ON COLUMN system_configs.external_system IS '外部系统名称';
COMMENT ON COLUMN system_configs.external_key IS '外部系统配置键';
COMMENT ON COLUMN system_configs.created_at IS '创建时间';
COMMENT ON COLUMN system_configs.updated_at IS '更新时间';
COMMENT ON COLUMN system_configs.created_by IS '创建人ID';
COMMENT ON COLUMN system_configs.updated_by IS '更新人ID';

-- 创建更新时间触发器
CREATE TRIGGER update_system_configs_updated_at
    BEFORE UPDATE ON system_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();