-- 创建数据采集记录表
-- 记录数据采集任务的历史和状态

-- 数据采集记录表
CREATE TABLE data_collections (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 关联信息
    data_source_id BIGINT NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,

    -- 任务信息
    task_name VARCHAR(200) NOT NULL,
    task_type VARCHAR(50) NOT NULL DEFAULT 'incremental' CHECK (task_type IN ('full', 'incremental', 'manual')),
    collection_method VARCHAR(50) NOT NULL DEFAULT 'api' CHECK (collection_method IN ('api', 'file', 'manual')),

    -- 状态信息
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    -- 结果统计
    record_count INTEGER NOT NULL DEFAULT 0,
    success_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    duplicate_count INTEGER NOT NULL DEFAULT 0,

    -- 时间信息
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,

    -- 错误信息
    error_message TEXT,
    error_details JSONB,

    -- 元数据
    metadata JSONB NOT NULL DEFAULT '{}',
    collection_params JSONB NOT NULL DEFAULT '{}',

    -- 审计字段
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX idx_data_collections_data_source_id ON data_collections(data_source_id);
CREATE INDEX idx_data_collections_status ON data_collections(status);
CREATE INDEX idx_data_collections_task_type ON data_collections(task_type);
CREATE INDEX idx_data_collections_started_at ON data_collections(started_at);
CREATE INDEX idx_data_collections_completed_at ON data_collections(completed_at);
CREATE INDEX idx_data_collections_created_by ON data_collections(created_by);
CREATE INDEX idx_data_collections_created_at ON data_collections(created_at);

-- 添加表注释
COMMENT ON TABLE data_collections IS '数据采集记录表 - 记录所有数据采集任务的详细信息';
COMMENT ON COLUMN data_collections.id IS '采集记录唯一标识';
COMMENT ON COLUMN data_collections.data_source_id IS '数据源ID';
COMMENT ON COLUMN data_collections.task_name IS '采集任务名称';
COMMENT ON COLUMN data_collections.task_type IS '采集任务类型：full-全量，incremental-增量，manual-手动';
COMMENT ON COLUMN data_collections.collection_method IS '采集方式：api-API接口，file-文件导入，manual-手动录入';
COMMENT ON COLUMN data_collections.status IS '采集状态：pending-待执行，processing-进行中，completed-已完成，failed-失败，cancelled-已取消';
COMMENT ON COLUMN data_collections.progress_percentage IS '采集进度百分比';
COMMENT ON COLUMN data_collections.record_count IS '采集记录总数';
COMMENT ON COLUMN data_collections.success_count IS '成功处理记录数';
COMMENT ON COLUMN data_collections.error_count IS '错误记录数';
COMMENT ON COLUMN data_collections.duplicate_count IS '重复记录数';
COMMENT ON COLUMN data_collections.started_at IS '开始时间';
COMMENT ON COLUMN data_collections.completed_at IS '完成时间';
COMMENT ON COLUMN data_collections.duration_seconds IS '执行耗时（秒）';
COMMENT ON COLUMN data_collections.error_message IS '错误消息';
COMMENT ON COLUMN data_collections.error_details IS '错误详细信息（JSON格式）';
COMMENT ON COLUMN data_collections.metadata IS '采集元数据（JSON格式）';
COMMENT ON COLUMN data_collections.collection_params IS '采集参数（JSON格式）';
COMMENT ON COLUMN data_collections.created_at IS '创建时间';
COMMENT ON COLUMN data_collections.updated_at IS '更新时间';
COMMENT ON COLUMN data_collections.created_by IS '创建人ID';
COMMENT ON COLUMN data_collections.updated_by IS '更新人ID';

-- 创建更新时间触发器
CREATE TRIGGER update_data_collections_updated_at
    BEFORE UPDATE ON data_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();