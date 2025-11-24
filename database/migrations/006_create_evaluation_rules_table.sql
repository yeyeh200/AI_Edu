-- 创建评价规则表
-- 支持MVP中的AI分析引擎功能

-- 评价规则表
CREATE TABLE evaluation_rules (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 基础信息
    name VARCHAR(200) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT,

    -- 规则配置
    rule_type VARCHAR(50) NOT NULL DEFAULT 'formula' CHECK (rule_type IN ('formula', 'condition', 'threshold', 'scoring', 'ranking')),
    rule_config JSONB NOT NULL DEFAULT '{}',
    rule_expression TEXT,

    -- 评价维度
    dimension VARCHAR(100),
    sub_dimension VARCHAR(100),
    weight DECIMAL(5,2) NOT NULL DEFAULT 1.00 CHECK (weight > 0),

    -- 评分标准
    max_score DECIMAL(8,2) NOT NULL DEFAULT 100.00 CHECK (max_score > 0),
    scoring_criteria JSONB,
    grade_levels JSONB,

    -- 条件配置
    conditions JSONB NOT NULL DEFAULT '[]',
    logic_operator VARCHAR(10) NOT NULL DEFAULT 'AND' CHECK (logic_operator IN ('AND', 'OR')),

    -- 数据要求
    data_sources JSONB NOT NULL DEFAULT '[]',
    data_fields JSONB NOT NULL DEFAULT '[]',
    time_range VARCHAR(50),

    -- 状态信息
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,

    -- 优先级和排序
    priority INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,

    -- 适用范围
    applicable_teachers JSONB NOT NULL DEFAULT '[]',
    applicable_courses JSONB NOT NULL DEFAULT '[]',
    applicable_departments JSONB NOT NULL DEFAULT '[]',

    -- 统计信息
    usage_count INTEGER NOT NULL DEFAULT 0,
    success_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMP,

    -- 外部关联
    template_id BIGINT,

    -- 审计字段
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX idx_evaluation_rules_code ON evaluation_rules(code);
CREATE INDEX idx_evaluation_rules_name ON evaluation_rules(name);
CREATE INDEX idx_evaluation_rules_category ON evaluation_rules(category);
CREATE INDEX idx_evaluation_rules_rule_type ON evaluation_rules(rule_type);
CREATE INDEX idx_evaluation_rules_dimension ON evaluation_rules(dimension);
CREATE INDEX idx_evaluation_rules_is_active ON evaluation_rules(is_active);
CREATE INDEX idx_evaluation_rules_is_system ON evaluation_rules(is_system);
CREATE INDEX idx_evaluation_rules_priority ON evaluation_rules(priority);
CREATE INDEX idx_evaluation_rules_template_id ON evaluation_rules(template_id);
CREATE INDEX idx_evaluation_rules_created_by ON evaluation_rules(created_by);
CREATE INDEX idx_evaluation_rules_created_at ON evaluation_rules(created_at);

-- 添加表注释
COMMENT ON TABLE evaluation_rules IS '评价规则表 - 定义教学评价的规则和算法';
COMMENT ON COLUMN evaluation_rules.id IS '规则唯一标识';
COMMENT ON COLUMN evaluation_rules.name IS '规则名称';
COMMENT ON COLUMN evaluation_rules.code IS '规则编码（唯一）';
COMMENT ON COLUMN evaluation_rules.category IS '规则分类';
COMMENT ON COLUMN evaluation_rules.description IS '规则描述';
COMMENT ON COLUMN evaluation_rules.rule_type IS '规则类型：formula-公式，condition-条件，threshold-阈值，scoring-评分，ranking-排名';
COMMENT ON COLUMN evaluation_rules.rule_config IS '规则配置（JSON格式）';
COMMENT ON COLUMN evaluation_rules.rule_expression IS '规则表达式';
COMMENT ON COLUMN evaluation_rules.dimension IS '评价维度';
COMMENT ON COLUMN evaluation_rules.sub_dimension IS '子维度';
COMMENT ON COLUMN evaluation_rules.weight IS '权重';
COMMENT ON COLUMN evaluation_rules.max_score IS '最高分值';
COMMENT ON COLUMN evaluation_rules.scoring_criteria IS '评分标准（JSON格式）';
COMMENT ON COLUMN evaluation_rules.grade_levels IS '等级划分（JSON格式）';
COMMENT ON COLUMN evaluation_rules.conditions IS '条件列表（JSON格式）';
COMMENT ON COLUMN evaluation_rules.logic_operator IS '逻辑操作符：AND-与，OR-或';
COMMENT ON COLUMN evaluation_rules.data_sources IS '数据源要求（JSON格式）';
COMMENT ON COLUMN evaluation_rules.data_fields IS '数据字段要求（JSON格式）';
COMMENT ON COLUMN evaluation_rules.time_range IS '时间范围要求';
COMMENT ON COLUMN evaluation_rules.is_active IS '是否激活';
COMMENT ON COLUMN evaluation_rules.is_system IS '是否系统规则';
COMMENT ON COLUMN evaluation_rules.version IS '版本号';
COMMENT ON COLUMN evaluation_rules.priority IS '优先级';
COMMENT ON COLUMN evaluation_rules.sort_order IS '排序顺序';
COMMENT ON COLUMN evaluation_rules.applicable_teachers IS '适用教师（JSON格式）';
COMMENT ON COLUMN evaluation_rules.applicable_courses IS '适用课程（JSON格式）';
COMMENT ON COLUMN evaluation_rules.applicable_departments IS '适用部门（JSON格式）';
COMMENT ON COLUMN evaluation_rules.usage_count IS '使用次数';
COMMENT ON COLUMN evaluation_rules.success_count IS '成功执行次数';
COMMENT ON COLUMN evaluation_rules.last_used_at IS '最后使用时间';
COMMENT ON COLUMN evaluation_rules.template_id IS '关联的评价模板ID';
COMMENT ON COLUMN evaluation_rules.created_at IS '创建时间';
COMMENT ON COLUMN evaluation_rules.updated_at IS '更新时间';
COMMENT ON COLUMN evaluation_rules.created_by IS '创建人ID';
COMMENT ON COLUMN evaluation_rules.updated_by IS '更新人ID';

-- 创建更新时间触发器
CREATE TRIGGER update_evaluation_rules_updated_at
    BEFORE UPDATE ON evaluation_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();