-- 插入默认评价规则
-- 为MVP系统创建基础的评价规则

-- 插入教学方法评价规则
INSERT INTO evaluation_rules (
    name,
    code,
    category,
    description,
    rule_type,
    rule_config,
    dimension,
    weight,
    max_score,
    scoring_criteria,
    grade_levels,
    conditions,
    data_sources,
    data_fields,
    is_active,
    is_system,
    priority,
    created_by
) VALUES
(
    '教学方法多样性',
    'RULE_TEACH_METHOD_001',
    'teaching_method',
    '评估教师教学方法的多样性和创新性',
    'scoring',
    '{
        "calculation_method": "weighted_average",
        "factors": [
            {"name": "method_diversity", "weight": 0.4, "description": "教学方法种类"},
            {"name": "innovation_level", "weight": 0.3, "description": "创新程度"},
            {"name": "student_engagement", "weight": 0.3, "description": "学生参与度"}
        ]
    }',
    '教学方法',
    25.0,
    100.0,
    '{
        "excellent": {
            "range": [90, 100],
            "description": "教学方法丰富多样，具有很强的创新性，学生参与度极高"
        },
        "good": {
            "range": [80, 89],
            "description": "教学方法较为多样，具有一定的创新性，学生参与度较高"
        },
        "satisfactory": {
            "range": [70, 79],
            "description": "教学方法基本满足要求，创新性一般，学生参与度中等"
        },
        "needs_improvement": {
            "range": [60, 69],
            "description": "教学方法单一，缺乏创新，学生参与度偏低"
        },
        "poor": {
            "range": [0, 59],
            "description": "教学方法单一陈旧，无创新性，学生参与度很低"
        }
    }',
    '[
        {"level": "A", "min_score": 90, "max_score": 100, "grade": "优秀"},
        {"level": "B", "min_score": 80, "max_score": 89, "grade": "良好"},
        {"level": "C", "min_score": 70, "max_score": 79, "grade": "中等"},
        {"level": "D", "min_score": 60, "max_score": 69, "grade": "及格"},
        {"level": "F", "min_score": 0, "max_score": 59, "grade": "不及格"}
    ]',
    '[
        {
            "field": "teaching_methods",
            "operator": "contains",
            "value": ["lecture", "discussion", "group_work", "case_study", "project_based"]
        }
    ]',
    '["teaching_evaluation", "student_feedback", "classroom_observation"]',
    '["method_types", "innovation_indicators", "engagement_metrics", "participation_rate"]',
    TRUE,
    TRUE,
    1,
    (SELECT id FROM users WHERE username = 'admin')
),
(
    '教学内容质量',
    'RULE_CONTENT_001',
    'content_quality',
    '评估课程教学内容的完整性、先进性和实用性',
    'scoring',
    '{
        "calculation_method": "weighted_average",
        "factors": [
            {"name": "content_completeness", "weight": 0.3, "description": "内容完整性"},
            {"name": "knowledge_currency", "weight": 0.3, "description": "知识先进性"},
            {"name": "practical_relevance", "weight": 0.2, "description": "实用性"},
            {"name": "structure_logic", "weight": 0.2, "description": "结构逻辑性"}
        ]
    }',
    '内容质量',
    25.0,
    100.0,
    '{
        "excellent": {
            "range": [90, 100],
            "description": "内容完整系统，知识前沿先进，实用性强，结构逻辑清晰"
        },
        "good": {
            "range": [80, 89],
            "description": "内容较为完整，知识较为先进，具有较强实用性"
        },
        "satisfactory": {
            "range": [70, 79],
            "description": "内容基本完整，知识基本够用，具有实用性"
        },
        "needs_improvement": {
            "range": [60, 69],
            "description": "内容不够完整，知识相对陈旧，实用性一般"
        },
        "poor": {
            "range": [0, 59],
            "description": "内容严重缺失，知识陈旧过时，缺乏实用性"
        }
    }',
    '[
        {"level": "A", "min_score": 90, "max_score": 100, "grade": "优秀"},
        {"level": "B", "min_score": 80, "max_score": 89, "grade": "良好"},
        {"level": "C", "min_score": 70, "max_score": 79, "grade": "中等"},
        {"level": "D", "min_score": 60, "max_score": 69, "grade": "及格"},
        {"level": "F", "min_score": 0, "max_score": 59, "grade": "不及格"}
    ]',
    '[
        {
            "field": "content_coverage",
            "operator": "gte",
            "value": 0.8
        }
    ]',
    '["curriculum_design", "course_materials", "knowledge_mapping"]',
    '["content_modules", "knowledge_points", "practical_cases", "reference_materials"]',
    TRUE,
    TRUE,
    2,
    (SELECT id FROM users WHERE username = 'admin')
),
(
    '学生参与度',
    'RULE_ENGAGEMENT_001',
    'student_engagement',
    '评估学生在课堂中的参与程度和互动质量',
    'scoring',
    '{
        "calculation_method": "weighted_average",
        "factors": [
            {"name": "attendance_rate", "weight": 0.2, "description": "出勤率"},
            {"name": "participation_frequency", "weight": 0.3, "description": "参与频率"},
            {"name": "interaction_quality", "weight": 0.3, "description": "互动质量"},
            {"name": "learning_motivation", "weight": 0.2, "description": "学习动机"}
        ]
    }',
    '学生参与',
    25.0,
    100.0,
    '{
        "excellent": {
            "range": [90, 100],
            "description": "学生出勤率高，积极参与课堂讨论，互动质量很好"
        },
        "good": {
            "range": [80, 89],
            "description": "学生出勤率较高，能够参与课堂活动，互动质量良好"
        },
        "satisfactory": {
            "range": [70, 79],
            "description": "学生出勤率一般，部分学生参与课堂，互动质量中等"
        },
        "needs_improvement": {
            "range": [60, 69],
            "description": "学生出勤率偏低，参与度不足，互动质量一般"
        },
        "poor": {
            "range": [0, 59],
            "description": "学生出勤率很低，基本不参与课堂，互动质量差"
        }
    }',
    '[
        {"level": "A", "min_score": 90, "max_score": 100, "grade": "优秀"},
        {"level": "B", "min_score": 80, "max_score": 89, "grade": "良好"},
        {"level": "C", "min_score": 70, "max_score": 79, "grade": "中等"},
        {"level": "D", "min_score": 60, "max_score": 69, "grade": "及格"},
        {"level": "F", "min_score": 0, "max_score": 59, "grade": "不及格"}
    ]',
    '[
        {
            "field": "student_feedback",
            "operator": "avg",
            "value": 70
        }
    ]',
    '["classroom_management", "student_feedback", "learning_analytics"]',
    '["attendance_records", "participation_logs", "interaction_data", "feedback_scores"]',
    TRUE,
    TRUE,
    3,
    (SELECT id FROM users WHERE username = 'admin')
),
(
    '教学创新能力',
    'RULE_INNOVATION_001',
    'innovation',
    '评估教师在教学过程中的创新意识和实践',
    'scoring',
    '{
        "calculation_method": "weighted_average",
        "factors": [
            {"name": "technology_integration", "weight": 0.3, "description": "技术整合"},
            {"name": "pedagogical_innovation", "weight": 0.3, "description": "教学法创新"},
            {"name": "assessment_innovation", "weight": 0.2, "description": "考核创新"},
            {"name": "resource_development", "weight": 0.2, "description": "资源开发"}
        ]
    }',
    '教学创新',
    25.0,
    100.0,
    '{
        "excellent": {
            "range": [90, 100],
            "description": "在教学各环节都有显著创新，效果突出"
        },
        "good": {
            "range": [80, 89],
            "description": "在多个教学环节有创新，效果良好"
        },
        "satisfactory": {
            "range": [70, 79],
            "description": "在部分教学环节有创新尝试，效果尚可"
        },
        "needs_improvement": {
            "range": [60, 69],
            "description": "创新意识较弱，创新实践较少"
        },
        "poor": {
            "range": [0, 59],
            "description": "缺乏创新意识，教学方法保守陈旧"
        }
    }',
    '[
        {"level": "A", "min_score": 90, "max_score": 100, "grade": "优秀"},
        {"level": "B", "min_score": 80, "max_score": 89, "grade": "良好"},
        {"level": "C", "min_score": 70, "max_score": 79, "grade": "中等"},
        {"level": "D", "min_score": 60, "max_score": 69, "grade": "及格"},
        {"level": "F", "min_score": 0, "max_score": 59, "grade": "不及格"}
    ]',
    '[
        {
            "field": "innovation_projects",
            "operator": "count",
            "value": 1
        }
    ]',
    '["teaching_development", "innovation_projects", "peer_review"]',
    '["innovation_cases", "technology_usage", "new_methods", "resource_materials"]',
    TRUE,
    TRUE,
    4,
    (SELECT id FROM users WHERE username = 'admin')
);

-- 插入综合评价规则
INSERT INTO evaluation_rules (
    name,
    code,
    category,
    description,
    rule_type,
    rule_config,
    dimension,
    weight,
    max_score,
    scoring_criteria,
    grade_levels,
    conditions,
    data_sources,
    data_fields,
    is_active,
    is_system,
    priority,
    created_by
) VALUES
(
    '教学质量综合评价',
    'RULE_COMPREHENSIVE_001',
    'comprehensive',
    '基于多维度指标的综合教学质量评价',
    'formula',
    '{
        "formula": "SUM(rule_score * weight)",
        "dimensions": [
            {"name": "teaching_method", "weight": 0.25, "rule_code": "RULE_TEACH_METHOD_001"},
            {"name": "content_quality", "weight": 0.25, "rule_code": "RULE_CONTENT_001"},
            {"name": "student_engagement", "weight": 0.25, "rule_code": "RULE_ENGAGEMENT_001"},
            {"name": "innovation", "weight": 0.25, "rule_code": "RULE_INNOVATION_001"}
        ]
    }',
    '综合评价',
    100.0,
    100.0,
    '{
        "excellent": {
            "range": [90, 100],
            "description": "教学质量优秀，各维度均表现出色"
        },
        "good": {
            "range": [80, 89],
            "description": "教学质量良好，主要维度表现较好"
        },
        "satisfactory": {
            "range": [70, 79],
            "description": "教学质量达标，达到基本要求"
        },
        "needs_improvement": {
            "range": [60, 69],
            "description": "教学质量一般，需要改进提升"
        },
        "poor": {
            "range": [0, 59],
            "description": "教学质量较差，需要重点改进"
        }
    }',
    '[
        {"level": "A", "min_score": 90, "max_score": 100, "grade": "优秀"},
        {"level": "B", "min_score": 80, "max_score": 89, "grade": "良好"},
        {"level": "C", "min_score": 70, "max_score": 79, "grade": "中等"},
        {"level": "D", "min_score": 60, "max_score": 69, "grade": "及格"},
        {"level": "F", "min_score": 0, "max_score": 59, "grade": "不及格"}
    ]',
    '[
        {
            "field": "required_rules",
            "operator": "all_present",
            "value": ["RULE_TEACH_METHOD_001", "RULE_CONTENT_001", "RULE_ENGAGEMENT_001", "RULE_INNOVATION_001"]
        }
    ]',
    '["comprehensive_evaluation", "rule_results", "dimension_scores"]',
    '["all_rule_scores", "dimension_weights", "calculation_parameters"]',
    TRUE,
    TRUE,
    0,
    (SELECT id FROM users WHERE username = 'admin')
);

-- 记录初始化评价规则的活动日志
INSERT INTO activity_logs (
    activity_type,
    activity_name,
    description,
    user_id,
    username,
    user_role,
    status,
    metadata
) VALUES
(
    'system_init',
    '评价规则初始化',
    '初始化系统默认评价规则',
    (SELECT id FROM users WHERE username = 'admin'),
    'admin',
    'admin',
    'success',
    '{"created_rules": 5, "categories": 5, "system_rules": true}'
);