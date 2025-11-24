CREATE TABLE IF NOT EXISTS evaluation_results (
  id VARCHAR(64) PRIMARY KEY,
  evaluatee_id VARCHAR(64) NOT NULL,
  evaluatee_type VARCHAR(32) NOT NULL,
  overall_score NUMERIC,
  level VARCHAR(32),
  dimensions JSONB DEFAULT '{}'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eval_results_evaluatee ON evaluation_results (evaluatee_id, evaluatee_type);
CREATE INDEX IF NOT EXISTS idx_eval_results_created ON evaluation_results (created_at);
