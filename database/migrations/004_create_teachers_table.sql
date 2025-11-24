-- 创建教师表
-- 存储教师基本信息，支持MVP的教师评价功能

-- 教师表
CREATE TABLE teachers (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 基础信息
    teacher_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    birth_date DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar VARCHAR(500),

    -- 职业信息
    title VARCHAR(100),
    department VARCHAR(200),
    position VARCHAR(100),
    hire_date DATE,
    years_of_service INTEGER,

    -- 学术信息
    education VARCHAR(100),
    major VARCHAR(200),
    degree VARCHAR(100),
    research_direction TEXT,

    -- 教学信息
    teaching_years INTEGER,
    main_courses TEXT,
    teaching_style TEXT,

    -- 状态信息
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retired', 'leave')),
    is_full_time BOOLEAN NOT NULL DEFAULT TRUE,

    -- 系统关联
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,

    -- 外部系统ID
    external_id VARCHAR(100),
    external_system VARCHAR(50),

    -- 审计字段
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX idx_teachers_teacher_code ON teachers(teacher_code);
CREATE INDEX idx_teachers_name ON teachers(name);
CREATE INDEX idx_teachers_department ON teachers(department);
CREATE INDEX idx_teachers_status ON teachers(status);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_teachers_external_id ON teachers(external_id, external_system);
CREATE INDEX idx_teachers_created_at ON teachers(created_at);

-- 添加表注释
COMMENT ON TABLE teachers IS '教师表 - 存储教师基本信息和职业信息';
COMMENT ON COLUMN teachers.id IS '教师唯一标识';
COMMENT ON COLUMN teachers.teacher_code IS '教师编号（唯一）';
COMMENT ON COLUMN teachers.name IS '教师姓名';
COMMENT ON COLUMN teachers.gender IS '性别';
COMMENT ON COLUMN teachers.birth_date IS '出生日期';
COMMENT ON COLUMN teachers.phone IS '联系电话';
COMMENT ON COLUMN teachers.email IS '邮箱地址';
COMMENT ON COLUMN teachers.avatar IS '头像URL';
COMMENT ON COLUMN teachers.title IS '职称';
COMMENT ON COLUMN teachers.department IS '所属部门';
COMMENT ON COLUMN teachers.position IS '职位';
COMMENT ON COLUMN teachers.hire_date IS '入职日期';
COMMENT ON COLUMN teachers.years_of_service IS '服务年限';
COMMENT ON COLUMN teachers.education IS '学历';
COMMENT ON COLUMN teachers.major IS '专业';
COMMENT ON COLUMN teachers.degree IS '学位';
COMMENT ON COLUMN teachers.research_direction IS '研究方向';
COMMENT ON COLUMN teachers.teaching_years IS '教龄';
COMMENT ON COLUMN teachers.main_courses IS '主要授课课程';
COMMENT ON COLUMN teachers.teaching_style IS '教学风格';
COMMENT ON COLUMN teachers.status IS '教师状态：active-在职，inactive-不在职，retired-退休，leave-离职';
COMMENT ON COLUMN teachers.is_full_time IS '是否全职';
COMMENT ON COLUMN teachers.user_id IS '关联的用户账号ID';
COMMENT ON COLUMN teachers.external_id IS '外部系统ID';
COMMENT ON COLUMN teachers.external_system IS '外部系统名称';
COMMENT ON COLUMN teachers.created_at IS '创建时间';
COMMENT ON COLUMN teachers.updated_at IS '更新时间';
COMMENT ON COLUMN teachers.created_by IS '创建人ID';
COMMENT ON COLUMN teachers.updated_by IS '更新人ID';

-- 创建更新时间触发器
CREATE TRIGGER update_teachers_updated_at
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();