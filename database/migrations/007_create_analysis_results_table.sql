-- 创建分析结果表
-- 存储AI分析引擎的评价结果，支持MVP的结果可视化功能

-- 分析结果表
CREATE TABLE analysis_results (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 分析基本信息
    analysis_name VARCHAR(200) NOT NULL,
    analysis_type VARCHAR(50) NOT NULL DEFAULT 'teacher' CHECK (analysis_type IN ('teacher', 'course', 'class', 'system')),
    analysis_period VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20),
    semester VARCHAR(50),

    -- 评价对象
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('teacher', 'course', 'class')),
    target_id BIGINT NOT NULL,
    target_name VARCHAR(200) NOT NULL,

    -- 关联信息
    teacher_id BIGINT REFERENCES teachers(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id) ON DELETE SET NULL,

    -- 总体评分
    overall_score DECIMAL(8,2) NOT NULL DEFAULT 0.00 CHECK (overall_score >= 0),
    max_score DECIMAL(8,2) NOT NULL DEFAULT 100.00 CHECK (max_score > 0),
    score_level VARCHAR(20) CHECK (score_level IN ('excellent', 'good', 'satisfactory', 'needs_improvement', 'poor')),
    percentile_rank DECIMAL(5,2) CHECK (percentile_rank BETWEEN 0 AND 100),
    grade VARCHAR(10),

    -- 详细评分（JSON格式存储各维度得分）
    dimension_scores JSONB NOT NULL DEFAULT '{}',
    rule_scores JSONB NOT NULL DEFAULT '{}',
    metric_scores JSONB NOT NULL DEFAULT '{}',

    -- 对比数据
    historical_average DECIMAL(8,2),
    peer_average DECIMAL(8,2),
    department_average DECIMAL(8,2),
    benchmark_score DECIMAL(8,2),

    -- 改进建议
    strengths JSONB NOT NULL DEFAULT '[]',
    weaknesses JSONB NOT NULL DEFAULT '[]',
    suggestions JSONB NOT NULL DEFAULT '[]',
    action_items JSONB NOT NULL DEFAULT '[]',

    -- 分析配置
    analysis_config JSONB NOT NULL DEFAULT '{}',
    used_rules JSONB NOT NULL DEFAULT '[]',
    weighting_config JSONB NOT NULL DEFAULT '{}',

    -- 质量评价
    data_quality_score DECIMAL(5,2) DEFAULT 0.00 CHECK (data_quality_score BETWEEN 0 AND 100),
    confidence_level DECIMAL(5,2) DEFAULT 95.00 CHECK (confidence_level BETWEEN 0 AND 100),
    reliability_score DECIMAL(5,2) DEFAULT 0.00 CHECK (reliability_score BETWEEN 0 AND 100),

    -- 状态信息
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'reviewed', 'published', 'archived')),
    is_final BOOLEAN NOT NULL DEFAULT FALSE,
    is_appealed BOOLEAN NOT NULL DEFAULT FALSE,

    -- 时间信息
    analysis_started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    analysis_completed_at TIMESTAMP,
    review_started_at TIMESTAMP,
    review_completed_at TIMESTAMP,
    published_at TIMESTAMP,

    -- 审计信息
    reviewer_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    approver_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    appeal_reason TEXT,
    appeal_result TEXT,

    -- 元数据
    metadata JSONB NOT NULL DEFAULT '{}',
    external_reference VARCHAR(100),

    -- 审计字段
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX idx_analysis_results_analysis_type ON analysis_results(analysis_type);
CREATE INDEX idx_analysis_results_target_type ON analysis_results(target_type);
CREATE INDEX idx_analysis_results_target_id ON analysis_results(target_id);
CREATE INDEX idx_analysis_results_teacher_id ON analysis_results(teacher_id);
CREATE INDEX idx_analysis_results_course_id ON analysis_results(course_id);
CREATE INDEX idx_analysis_results_overall_score ON analysis_results(overall_score);
CREATE INDEX idx_analysis_results_score_level ON analysis_results(score_level);
CREATE INDEX idx_analysis_results_percentile_rank ON analysis_results(percentile_rank);
CREATE INDEX idx_analysis_results_status ON analysis_results(status);
CREATE INDEX idx_analysis_results_is_final ON analysis_results(is_final);
CREATE INDEX idx_analysis_results_analysis_period ON analysis_results(analysis_period);
CREATE INDEX idx_analysis_results_academic_year ON analysis_results(academic_year);
CREATE INDEX idx_analysis_results_semester ON analysis_results(semester);
CREATE INDEX idx_analysis_results_reviewer_id ON analysis_results(reviewer_id);
CREATE INDEX idx_analysis_results_created_by ON analysis_results(created_by);
CREATE INDEX idx_analysis_results_created_at ON analysis_results(created_at);

-- 复合索引
CREATE INDEX idx_analysis_results_target_period ON analysis_results(target_type, target_id, analysis_period);
CREATE INDEX idx_analysis_results_teacher_period ON analysis_results(teacher_id, analysis_period);

-- 添加表注释
COMMENT ON TABLE analysis_results IS '分析结果表 - 存储AI分析的评价结果和建议';
COMMENT ON COLUMN analysis_results.id IS '分析结果唯一标识';
COMMENT ON COLUMN analysis_results.analysis_name IS '分析名称';
COMMENT ON COLUMN analysis_results.analysis_type IS '分析类型：teacher-教师评价，course-课程评价，class-班级评价，system-系统评价';
COMMENT ON COLUMN analysis_results.analysis_period IS '分析周期';
COMMENT ON COLUMN analysis_results.academic_year IS '学年';
COMMENT ON COLUMN analysis_results.semester IS '学期';
COMMENT ON COLUMN analysis_results.target_type IS '评价对象类型';
COMMENT ON COLUMN analysis_results.target_id IS '评价对象ID';
COMMENT ON COLUMN analysis_results.target_name IS '评价对象名称';
COMMENT ON COLUMN analysis_results.teacher_id IS '教师ID';
COMMENT ON COLUMN analysis_results.course_id IS '课程ID';
COMMENT ON COLUMN analysis_results.overall_score IS '总体得分';
COMMENT ON COLUMN analysis_results.max_score IS '最高分值';
COMMENT ON COLUMN analysis_results.score_level IS '评分等级：excellent-优秀，good-良好，satisfactory-满意，needs_improvement-需改进，poor-差';
COMMENT ON COLUMN analysis_results.percentile_rank IS '百分位排名';
COMMENT ON COLUMN analysis_results.grade IS '等级评定';
COMMENT ON COLUMN analysis_results.dimension_scores IS '维度评分（JSON格式）';
COMMENT ON COLUMN analysis_results.rule_scores IS '规则评分（JSON格式）';
COMMENT ON COLUMN analysis_results.metric_scores IS '指标评分（JSON格式）';
COMMENT ON COLUMN analysis_results.historical_average IS '历史平均分';
COMMENT ON COLUMN analysis_results.peer_average IS '同行平均分';
COMMENT ON COLUMN analysis_results.department_average IS '部门平均分';
COMMENT ON COLUMN analysis_results.benchmark_score IS '基准分数';
COMMENT ON COLUMN analysis_results.strengths IS '优势分析（JSON格式）';
COMMENT ON COLUMN analysis_results.weaknesses IS '不足分析（JSON格式）';
COMMENT ON COLUMN analysis_results.suggestions IS '改进建议（JSON格式）';
COMMENT ON COLUMN analysis_results.action_items IS '行动计划（JSON格式）';
COMMENT ON COLUMN analysis_results.analysis_config IS '分析配置（JSON格式）';
COMMENT ON COLUMN analysis_results.used_rules IS '使用的规则（JSON格式）';
COMMENT ON COLUMN analysis_results.weighting_config IS '权重配置（JSON格式）';
COMMENT ON COLUMN analysis_results.data_quality_score IS '数据质量评分';
COMMENT ON COLUMN analysis_results.confidence_level IS '置信水平';
COMMENT ON COLUMN analysis_results.reliability_score IS '可靠性评分';
COMMENT ON COLUMN analysis_results.status IS '结果状态：draft-草稿，completed-已完成，reviewed-已审核，published-已发布，archived-已归档';
COMMENT ON COLUMN analysis_results.is_final IS '是否最终结果';
COMMENT ON COLUMN analysis_results.is_appealed IS '是否申诉';
COMMENT ON COLUMN analysis_results.analysis_started_at IS '分析开始时间';
COMMENT ON COLUMN analysis_results.analysis_completed_at IS '分析完成时间';
COMMENT ON COLUMN analysis_results.review_started_at IS '审核开始时间';
COMMENT ON COLUMN analysis_results.review_completed_at IS '审核完成时间';
COMMENT ON COLUMN analysis_results.published_at IS '发布时间';
COMMENT ON COLUMN analysis_results.reviewer_id IS '审核人ID';
COMMENT ON COLUMN analysis_results.approver_id IS '批准人ID';
COMMENT ON COLUMN analysis_results.appeal_reason IS '申诉原因';
COMMENT ON COLUMN analysis_results.appeal_result IS '申诉结果';
COMMENT ON COLUMN analysis_results.metadata IS '元数据（JSON格式）';
COMMENT ON COLUMN analysis_results.external_reference IS '外部参考号';
COMMENT ON COLUMN analysis_results.created_at IS '创建时间';
COMMENT ON COLUMN analysis_results.updated_at IS '更新时间';
COMMENT ON COLUMN analysis_results.created_by IS '创建人ID';
COMMENT ON COLUMN analysis_results.updated_by IS '更新人ID';

-- 创建更新时间触发器
CREATE TRIGGER update_analysis_results_updated_at
    BEFORE UPDATE ON analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();