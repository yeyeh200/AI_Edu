-- 数据采集与日志相关表

CREATE TABLE IF NOT EXISTS collection_tasks (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  data_type VARCHAR(64) NOT NULL,
  schedule VARCHAR(128) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  status VARCHAR(32) NOT NULL,
  record_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_collection_tasks_data_type ON collection_tasks (data_type);
CREATE INDEX IF NOT EXISTS idx_collection_tasks_status ON collection_tasks (status);

CREATE TABLE IF NOT EXISTS collection_logs (
  id VARCHAR(64) PRIMARY KEY,
  task_id VARCHAR(64) NOT NULL,
  task_name VARCHAR(255) NOT NULL,
  level VARCHAR(16) NOT NULL,
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_collection_logs_task_id ON collection_logs (task_id);
CREATE INDEX IF NOT EXISTS idx_collection_logs_level ON collection_logs (level);

-- 数据质量检查结果（简化）
CREATE TABLE IF NOT EXISTS data_quality_reports (
  id VARCHAR(64) PRIMARY KEY,
  data_type VARCHAR(64) NOT NULL,
  passed BOOLEAN NOT NULL,
  issues JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quality_reports_data_type ON data_quality_reports (data_type);
