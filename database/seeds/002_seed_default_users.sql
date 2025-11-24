-- 插入默认用户数据
-- 为MVP系统创建预设的管理员和教师账户

-- 首先创建密码哈希函数（PostgreSQL版本兼容）
CREATE OR REPLACE FUNCTION password_hash(password TEXT) RETURNS TEXT AS $$
BEGIN
    -- 这里使用简单的哈希，实际生产环境应该使用更安全的哈希算法
    -- 注意：这是一个示例，生产环境中应该使用bcrypt等安全哈希算法
    RETURN encode(digest(password, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- 插入默认管理员账户
INSERT INTO users (
    username,
    email,
    password_hash,
    name,
    role,
    is_active,
    is_verified,
    created_by
) VALUES (
    'admin',
    'admin@aievaluation.edu.cn',
    password_hash('admin123'), -- 实际生产环境应使用安全哈希
    '系统管理员',
    'admin',
    TRUE,
    TRUE,
    1 -- 系统创建者ID
);

-- 插入默认教师账户
INSERT INTO users (
    username,
    email,
    password_hash,
    name,
    role,
    is_active,
    is_verified,
    created_by
) VALUES (
    'teacher',
    'teacher@aievaluation.edu.cn',
    password_hash('teacher123'), -- 实际生产环境应使用安全哈希
    '张老师',
    'teacher',
    TRUE,
    TRUE,
    1 -- 系统创建者ID
);

-- 插入更多测试教师账户
INSERT INTO users (
    username,
    email,
    password_hash,
    name,
    role,
    is_active,
    is_verified,
    created_by
) VALUES
(
    'wang_teacher',
    'wang@aievaluation.edu.cn',
    password_hash('wang123'),
    '王老师',
    'teacher',
    TRUE,
    TRUE,
    1
),
(
    'li_teacher',
    'li@aievaluation.edu.cn',
    password_hash('li123'),
    '李老师',
    'teacher',
    TRUE,
    TRUE,
    1
),
(
    'chen_teacher',
    'chen@aievaluation.edu.cn',
    password_hash('chen123'),
    '陈老师',
    'teacher',
    TRUE,
    TRUE,
    1
),
(
    'zhang_teacher',
    'zhang@aievaluation.edu.cn',
    password_hash('zhang123'),
    '张老师',
    'teacher',
    TRUE,
    TRUE,
    1
);

-- 插入测试教师详细信息到教师表
INSERT INTO teachers (
    teacher_code,
    name,
    gender,
    phone,
    email,
    title,
    department,
    position,
    hire_date,
    years_of_service,
    education,
    major,
    teaching_years,
    status,
    is_full_time,
    user_id,
    created_by
) VALUES
(
    'T001',
    '系统管理员',
    'male',
    '13800138000',
    'admin@aievaluation.edu.cn',
    '系统架构师',
    '信息技术中心',
    '系统管理员',
    CURRENT_DATE - INTERVAL '5 years',
    5,
    '硕士',
    '计算机科学与技术',
    5,
    'active',
    TRUE,
    (SELECT id FROM users WHERE username = 'admin'),
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'T002',
    '张老师',
    'male',
    '13800138001',
    'teacher@aievaluation.edu.cn',
    '副教授',
    '计算机学院',
    '教师',
    CURRENT_DATE - INTERVAL '10 years',
    10,
    '博士',
    '软件工程',
    10,
    'active',
    TRUE,
    (SELECT id FROM users WHERE username = 'teacher'),
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'T003',
    '王老师',
    'female',
    '13800138002',
    'wang@aievaluation.edu.cn',
    '讲师',
    '信息工程学院',
    '教师',
    CURRENT_DATE - INTERVAL '8 years',
    8,
    '硕士',
    '人工智能',
    8,
    'active',
    TRUE,
    (SELECT id FROM users WHERE username = 'wang_teacher'),
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'T004',
    '李老师',
    'male',
    '13800138003',
    'li@aievaluation.edu.cn',
    '教授',
    '管理学院',
    '教师',
    CURRENT_DATE - INTERVAL '15 years',
    15,
    '博士',
    '管理科学与工程',
    15,
    'active',
    TRUE,
    (SELECT id FROM users WHERE username = 'li_teacher'),
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'T005',
    '陈老师',
    'female',
    '13800138004',
    'chen@aievaluation.edu.cn',
    '副教授',
    '外语学院',
    '教师',
    CURRENT_DATE - INTERVAL '12 years',
    12,
    '硕士',
    '英语语言文学',
    12,
    'active',
    TRUE,
    (SELECT id FROM users WHERE username = 'chen_teacher'),
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'T006',
    '张老师',
    'male',
    '13800138005',
    'zhang@aievaluation.edu.cn',
    '讲师',
    '理学院',
    '教师',
    CURRENT_DATE - INTERVAL '6 years',
    6,
    '硕士',
    '应用数学',
    6,
    'active',
    TRUE,
    (SELECT id FROM users WHERE username = 'zhang_teacher'),
    (SELECT id FROM users WHERE username = 'admin')
);

-- 插入示例课程数据
INSERT INTO courses (
    course_code,
    name,
    course_type,
    credits,
    total_hours,
    theory_hours,
    practice_hours,
    description,
    objectives,
    teacher_id,
    semester,
    academic_year,
    start_date,
    end_date,
    max_students,
    current_students,
    department,
    major,
    grade_level,
    status,
    created_by
) VALUES
(
    'CS101',
    '数据结构与算法',
    'required',
    4.0,
    64,
    48,
    16,
    '计算机专业核心课程，介绍基本的数据结构和算法设计',
    '掌握常用数据结构和算法，具备程序设计能力',
    (SELECT id FROM teachers WHERE teacher_code = 'T002'),
    '2024春季',
    '2023-2024',
    '2024-02-26',
    '2024-06-30',
    50,
    45,
    '计算机学院',
    '计算机科学与技术',
    '大二',
    'active',
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'CS201',
    '人工智能导论',
    'elective',
    3.0,
    48,
    32,
    16,
    '人工智能基础理论和应用技术入门课程',
    '了解AI基本概念，掌握基础AI技术应用',
    (SELECT id FROM teachers WHERE teacher_code = 'T003'),
    '2024春季',
    '2023-2024',
    '2024-02-26',
    '2024-06-30',
    40,
    35,
    '信息工程学院',
    '人工智能',
    '大三',
    'active',
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'MG101',
    '管理学原理',
    'required',
    3.0,
    48,
    40,
    8,
    '管理学基本理论和方法课程',
    '掌握管理学基本原理，具备管理思维能力',
    (SELECT id FROM teachers WHERE teacher_code = 'T004'),
    '2024春季',
    '2023-2024',
    '2024-02-26',
    '2024-06-30',
    60,
    55,
    '管理学院',
    '工商管理',
    '大一',
    'active',
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'EN201',
    '高级英语听说',
    'required',
    2.0,
    32,
    16,
    16,
    '英语听说能力提升课程',
    '提高英语听说交际能力，满足专业学习需求',
    (SELECT id FROM teachers WHERE teacher_code = 'T005'),
    '2024春季',
    '2023-2024',
    '2024-02-26',
    '2024-06-30',
    30,
    28,
    '外语学院',
    '英语专业',
    '大二',
    'active',
    (SELECT id FROM users WHERE username = 'admin')
),
(
    'MA201',
    '离散数学',
    'required',
    3.0,
    48,
    48,
    0,
    '数学专业基础理论课程',
    '掌握离散数学基本概念和方法',
    (SELECT id FROM teachers WHERE teacher_code = 'T006'),
    '2024春季',
    '2023-2024',
    '2024-02-26',
    '2024-06-30',
    45,
    42,
    '理学院',
    '数学与应用数学',
    '大二',
    'active',
    (SELECT id FROM users WHERE username = 'admin')
);

-- 添加表注释说明
COMMENT ON TABLE users IS '用户表 - 存储系统用户账号信息';
COMMENT ON TABLE teachers IS '教师表 - 存储教师详细信息';
COMMENT ON TABLE courses IS '课程表 - 存储课程基本信息';

-- 记录初始化数据的活动日志
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
    '用户数据初始化',
    '初始化系统默认用户和教师数据',
    (SELECT id FROM users WHERE username = 'admin'),
    'admin',
    'admin',
    'success',
    '{"created_users": 6, "created_teachers": 6, "created_courses": 5}'
);

-- 清理密码哈希函数（实际生产环境应该保留并使用更安全的函数）
-- DROP FUNCTION IF EXISTS password_hash(TEXT);