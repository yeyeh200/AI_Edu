CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  table_name VARCHAR(128) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  status VARCHAR(32) NOT NULL,
  progress INTEGER DEFAULT 0,
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  issues_found INTEGER DEFAULT 0,
  issues_resolved INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  warnings JSONB DEFAULT '[]'::jsonb,
  configuration JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INTEGER
);

CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_status ON cleaning_tasks (status);
