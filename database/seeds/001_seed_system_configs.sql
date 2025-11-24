-- 插入系统配置初始化数据
-- 为MVP系统提供默认配置

-- 插入系统基础配置
INSERT INTO system_configs (category, config_key, config_value, default_value, name, description, data_type, is_public, is_editable) VALUES
-- 系统基础配置
('system', 'system_name', '"AI助评系统"', '"AI助评系统"', '系统名称', '系统显示名称', 'string', TRUE, TRUE),
('system', 'system_version', '"1.0.0"', '"1.0.0"', '系统版本', '当前系统版本号', 'string', TRUE, FALSE),
('system', 'system_description', '"基于人工智能技术的智能教学评价平台"', '"基于人工智能技术的智能教学评价平台"', '系统描述', '系统功能描述', 'string', TRUE, TRUE),

-- 用户认证配置
('auth', 'session_timeout', '86400', '86400', '会话超时时间', '用户会话超时时间（秒）', 'number', FALSE, TRUE),
('auth', 'password_min_length', '8', '8', '密码最小长度', '用户密码最小长度要求', 'number', FALSE, TRUE),
('auth', 'password_require_uppercase', 'true', 'true', '密码要求大写字母', '密码是否需要包含大写字母', 'boolean', FALSE, TRUE),
('auth', 'password_require_lowercase', 'true', 'true', '密码要求小写字母', '密码是否需要包含小写字母', 'boolean', FALSE, TRUE),
('auth', 'password_require_numbers', 'true', 'true', '密码要求数字', '密码是否需要包含数字', 'boolean', FALSE, TRUE),
('auth', 'max_login_attempts', '5', '5', '最大登录尝试次数', '登录失败最大尝试次数', 'number', FALSE, TRUE),
('auth', 'login_lockout_duration', '900', '900', '登录锁定时长', '登录锁定持续时间（秒）', 'number', FALSE, TRUE),

-- 数据采集配置
('data_collection', 'default_sync_interval', '3600', '3600', '默认同步间隔', '数据采集默认同步间隔（秒）', 'number', FALSE, TRUE),
('data_collection', 'max_retry_attempts', '3', '3', '最大重试次数', '数据采集失败最大重试次数', 'number', FALSE, TRUE),
('data_collection', 'retry_delay', '1000', '1000', '重试延迟时间', '数据采集重试间隔时间（毫秒）', 'number', FALSE, TRUE),
('data_collection', 'batch_size', '1000', '1000', '批处理大小', '数据采集批处理记录数', 'number', FALSE, TRUE),
('data_collection', 'timeout_seconds', '30', '30', '请求超时时间', '数据采集请求超时时间（秒）', 'number', FALSE, TRUE),

-- AI分析配置
('analysis', 'default_weight_scheme', '{"teaching_method": 0.3, "content_quality": 0.25, "student_engagement": 0.25, "innovation": 0.2}', '{"teaching_method": 0.3, "content_quality": 0.25, "student_engagement": 0.25, "innovation": 0.2}', '默认权重方案', '各评价维度的默认权重分配', 'json', FALSE, TRUE),
('analysis', 'passing_score', '60', '60', '及格分数', '评价结果及格分数线', 'number', FALSE, TRUE),
('analysis', 'excellent_score', '90', '90', '优秀分数', '评价结果优秀分数线', 'number', FALSE, TRUE),
('analysis', 'max_concurrent_analysis', '5', '5', '最大并发分析数', '同时进行的AI分析任务最大数量', 'number', FALSE, TRUE),
('analysis', 'analysis_timeout', '300', '300', '分析超时时间', '单次AI分析任务超时时间（秒）', 'number', FALSE, TRUE),

-- 报表配置
('report', 'max_export_records', '10000', '10000', '最大导出记录数', '单次报表导出最大记录数', 'number', FALSE, TRUE),
('report', 'export_timeout', '120', '120', '导出超时时间', '报表生成和导出超时时间（秒）', 'number', FALSE, TRUE),
('report', 'supported_formats', '["pdf", "excel"]', '["pdf", "excel"]', '支持导出格式', '系统支持的报表导出格式', 'array', TRUE, FALSE),

-- UI显示配置
('ui', 'page_size', '20', '20', '默认分页大小', '列表页面默认分页大小', 'number', TRUE, TRUE),
('ui', 'max_page_size', '100', '100', '最大分页大小', '列表页面最大分页大小', 'number', TRUE, TRUE),
('ui', 'theme_mode', '"light"', '"light"', '界面主题', '系统界面主题模式', 'string', TRUE, TRUE),
('ui', 'language', '"zh-CN"', '"zh-CN"', '界面语言', '系统界面显示语言', 'string', TRUE, TRUE),

-- 性能配置
('performance', 'cache_ttl_user', '3600', '3600', '用户信息缓存时间', '用户信息缓存TTL（秒）', 'number', FALSE, TRUE),
('performance', 'cache_ttl_analysis', '7200', '7200', '分析结果缓存时间', '分析结果缓存TTL（秒）', 'number', FALSE, TRUE),
('performance', 'cache_ttl_config', '86400', '86400', '配置信息缓存时间', '系统配置缓存TTL（秒）', 'number', FALSE, TRUE),
('performance', 'rate_limit_window', '900', '900', '限流时间窗口', 'API限流时间窗口（秒）', 'number', FALSE, TRUE),
('performance', 'rate_limit_max_requests', '100', '100', '限流最大请求数', '时间窗口内最大请求数', 'number', FALSE, TRUE),

-- 安全配置
('security', 'enable_cors', 'true', 'true', '启用CORS', '是否启用跨域资源共享', 'boolean', FALSE, TRUE),
('security', 'allowed_origins', '["http://localhost:3000", "http://localhost:5173"]', '["http://localhost:3000", "http://localhost:5173"]', '允许的CORS源', '允许跨域访问的源列表', 'array', FALSE, TRUE),
('security', 'enable_https_redirect', 'false', 'false', '启用HTTPS重定向', '是否强制HTTPS访问', 'boolean', FALSE, TRUE),
('security', 'upload_max_file_size', '10485760', '10485760', '上传文件大小限制', '文件上传最大大小（字节）', 'number', FALSE, TRUE),

-- 日志配置
('logging', 'log_level', '"info"', '"info"', '日志级别', '系统日志记录级别', 'string', FALSE, TRUE),
('logging', 'enable_activity_log', 'true', 'true', '启用活动日志', '是否记录用户活动日志', 'boolean', FALSE, TRUE),
('logging', 'log_retention_days', '90', '90', '日志保留天数', '系统日志保留天数', 'number', FALSE, TRUE),
('logging', 'enable_audit_log', 'true', 'true', '启用审计日志', '是否记录关键操作审计日志', 'boolean', FALSE, TRUE),

-- 通知配置
('notification', 'enable_email', 'false', 'false', '启用邮件通知', '是否启用邮件通知功能', 'boolean', FALSE, TRUE),
('notification', 'enable_system', 'true', 'true', '启用系统通知', '是否启用系统内通知', 'boolean', FALSE, TRUE),
('notification', 'notification_retention_days', '30', '30', '通知保留天数', '系统通知保留天数', 'number', FALSE, TRUE);

-- 插入预设评价规则分类配置
INSERT INTO system_configs (category, config_key, config_value, default_value, name, description, data_type, is_public, is_editable) VALUES
('evaluation_rules', 'rule_categories', '[
  {"key": "teaching_method", "name": "教学方法", "description": "教学方法的创新性和有效性"},
  {"key": "content_quality", "name": "内容质量", "description": "课程内容的完整性和先进性"},
  {"key": "student_engagement", "name": "学生参与", "description": "学生课堂参与度和互动情况"},
  {"key": "innovation", "name": "教学创新", "description": "教学模式和方法的创新性"},
  {"key": "course_design", "name": "课程设计", "description": "课程设计的合理性和科学性"},
  {"key": "assessment", "name": "考核评价", "description": "考核方式的科学性和公平性"}
]', '[
  {"key": "teaching_method", "name": "教学方法", "description": "教学方法的创新性和有效性"},
  {"key": "content_quality", "name": "内容质量", "description": "课程内容的完整性和先进性"},
  {"key": "student_engagement", "name": "学生参与", "description": "学生课堂参与度和互动情况"},
  {"key": "innovation", "name": "教学创新", "description": "教学模式和方法的创新性"},
  {"key": "course_design", "name": "课程设计", "description": "课程设计的合理性和科学性"},
  {"key": "assessment", "name": "考核评价", "description": "考核方式的科学性和公平性"}
]', '评价规则分类', '评价规则的分类定义', 'json', TRUE, FALSE);

-- 插入默认的评价规则配置
INSERT INTO system_configs (category, config_key, config_value, default_value, name, description, data_type, is_public, is_editable) VALUES
('evaluation_rules', 'default_grade_levels', '[
  {"level": "A", "name": "优秀", "min_score": 90, "max_score": 100, "description": "教学效果突出，达到优秀水平"},
  {"level": "B", "name": "良好", "min_score": 80, "max_score": 89, "description": "教学效果良好，达到较高水平"},
  {"level": "C", "name": "中等", "min_score": 70, "max_score": 79, "description": "教学效果中等，达到基本要求"},
  {"level": "D", "name": "及格", "min_score": 60, "max_score": 69, "description": "教学效果一般，基本达到要求"},
  {"level": "F", "name": "不及格", "min_score": 0, "max_score": 59, "description": "教学效果不足，需要改进"}
]', '[
  {"level": "A", "name": "优秀", "min_score": 90, "max_score": 100, "description": "教学效果突出，达到优秀水平"},
  {"level": "B", "name": "良好", "min_score": 80, "max_score": 89, "description": "教学效果良好，达到较高水平"},
  {"level": "C", "name": "中等", "min_score": 70, "max_score": 79, "description": "教学效果中等，达到基本要求"},
  {"level": "D", "name": "及格", "min_score": 60, "max_score": 69, "description": "教学效果一般，基本达到要求"},
  {"level": "F", "name": "不及格", "min_score": 0, "max_score": 59, "description": "教学效果不足，需要改进"}
]', '默认等级划分', '评价结果的等级划分标准', 'json', TRUE, FALSE);