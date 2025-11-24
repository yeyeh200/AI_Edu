-- 创建活动日志表
-- 支持MVP中的系统监控和审计功能

-- 活动日志表
CREATE TABLE activity_logs (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 活动信息
    activity_type VARCHAR(50) NOT NULL,
    activity_name VARCHAR(200) NOT NULL,
    description TEXT,

    -- 用户信息
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(100),
    user_role VARCHAR(20),

    -- 请求信息
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10),
    request_url TEXT,
    request_parameters JSONB DEFAULT '{}',

    -- 资源信息
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    resource_name VARCHAR(200),

    -- 操作结果
    status VARCHAR(20) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failure', 'warning')),
    result_message TEXT,
    error_code VARCHAR(50),
    error_details JSONB DEFAULT '{}',

    -- 时间信息
    activity_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duration_ms INTEGER,

    -- 系统信息
    session_id VARCHAR(100),
    correlation_id VARCHAR(100),
    trace_id VARCHAR(100),

    -- 元数据
    metadata JSONB DEFAULT '{}',

    -- 外部系统
    external_system VARCHAR(50),
    external_ref VARCHAR(200)
);

-- 创建索引
CREATE INDEX idx_activity_logs_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_logs_activity_name ON activity_logs(activity_name);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_username ON activity_logs(username);
CREATE INDEX idx_activity_logs_user_role ON activity_logs(user_role);
CREATE INDEX idx_activity_logs_ip_address ON activity_logs(ip_address);
CREATE INDEX idx_activity_logs_status ON activity_logs(status);
CREATE INDEX idx_activity_logs_resource_type ON activity_logs(resource_type);
CREATE INDEX idx_activity_logs_resource_id ON activity_logs(resource_id);
CREATE INDEX idx_activity_logs_activity_time ON activity_logs(activity_time);
CREATE INDEX idx_activity_logs_session_id ON activity_logs(session_id);
CREATE INDEX idx_activity_logs_correlation_id ON activity_logs(correlation_id);
CREATE INDEX idx_activity_logs_external_system ON activity_logs(external_system);

-- 复合索引（用于常见的查询组合）
CREATE INDEX idx_activity_logs_user_time ON activity_logs(user_id, activity_time DESC);
CREATE INDEX idx_activity_logs_type_time ON activity_logs(activity_type, activity_time DESC);
CREATE INDEX idx_activity_logs_status_time ON activity_logs(status, activity_time DESC);

-- 添加表注释
COMMENT ON TABLE activity_logs IS '活动日志表 - 记录系统用户操作和系统活动';
COMMENT ON COLUMN activity_logs.id IS '日志唯一标识';
COMMENT ON COLUMN activity_logs.activity_type IS '活动类型：login-登录，logout-登出，data_collection-数据采集，analysis-分析，system_config-系统配置';
COMMENT ON COLUMN activity_logs.activity_name IS '活动名称';
COMMENT ON COLUMN activity_logs.description IS '活动描述';
COMMENT ON COLUMN activity_logs.user_id IS '用户ID';
COMMENT ON COLUMN activity_logs.username IS '用户名';
COMMENT ON COLUMN activity_logs.user_role IS '用户角色';
COMMENT ON COLUMN activity_logs.ip_address IS 'IP地址';
COMMENT ON COLUMN activity_logs.user_agent IS '用户代理';
COMMENT ON COLUMN activity_logs.request_method IS '请求方法';
COMMENT ON COLUMN activity_logs.request_url IS '请求URL';
COMMENT ON COLUMN activity_logs.request_parameters IS '请求参数（JSON格式）';
COMMENT ON COLUMN activity_logs.resource_type IS '资源类型';
COMMENT ON COLUMN activity_logs.resource_id IS '资源ID';
COMMENT ON COLUMN activity_logs.resource_name IS '资源名称';
COMMENT ON COLUMN activity_logs.status IS '操作状态：success-成功，failure-失败，warning-警告';
COMMENT ON COLUMN activity_logs.result_message IS '结果消息';
COMMENT ON COLUMN activity_logs.error_code IS '错误代码';
COMMENT ON COLUMN activity_logs.error_details IS '错误详情（JSON格式）';
COMMENT ON COLUMN activity_logs.activity_time IS '活动时间';
COMMENT ON COLUMN activity_logs.duration_ms IS '操作耗时（毫秒）';
COMMENT ON COLUMN activity_logs.session_id IS '会话ID';
COMMENT ON COLUMN activity_logs.correlation_id IS '关联ID';
COMMENT ON COLUMN activity_logs.trace_id IS '追踪ID';
COMMENT ON COLUMN activity_logs.metadata IS '元数据（JSON格式）';
COMMENT ON COLUMN activity_logs.external_system IS '外部系统名称';
COMMENT ON COLUMN activity_logs.external_ref IS '外部系统引用';

-- 创建分区表（按时间分区，提高大数据量下的查询性能）
-- 这里先不创建分区，等数据量增长后再考虑
-- CREATE TABLE activity_logs_y2024m01 PARTITION OF activity_logs
--     FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');