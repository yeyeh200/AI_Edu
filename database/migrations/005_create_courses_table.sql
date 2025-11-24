-- 创建课程表
-- 存储课程基本信息，支持MVP的课程评价功能

-- 课程表
CREATE TABLE courses (
    -- 主键
    id BIGSERIAL PRIMARY KEY,

    -- 基础信息
    course_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    course_type VARCHAR(50) NOT NULL DEFAULT 'required' CHECK (course_type IN ('required', 'elective', 'professional', 'general')),
    credits DECIMAL(3,1) NOT NULL DEFAULT 1.0 CHECK (credits > 0),
    total_hours INTEGER NOT NULL DEFAULT 32 CHECK (total_hours > 0),
    theory_hours INTEGER NOT NULL DEFAULT 32 CHECK (theory_hours >= 0),
    practice_hours INTEGER NOT NULL DEFAULT 0 CHECK (practice_hours >= 0),

    -- 课程描述
    description TEXT,
    objectives TEXT,
    content TEXT,
    prerequisites TEXT,
    textbooks TEXT,

    -- 开课信息
    teacher_id BIGINT NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
    semester VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE,
    end_date DATE,
    schedule_info TEXT,

    -- 学生信息
    max_students INTEGER DEFAULT 50 CHECK (max_students > 0),
    current_students INTEGER DEFAULT 0 CHECK (current_students >= 0),
    department VARCHAR(200),
    major VARCHAR(200),
    grade_level VARCHAR(20),

    -- 状态信息
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'cancelled')),

    -- 评价信息
    is_evaluated BOOLEAN NOT NULL DEFAULT TRUE,
    evaluation_type VARCHAR(50) DEFAULT 'comprehensive' CHECK (evaluation_type IN ('comprehensive', 'peer', 'student', 'expert')),

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
CREATE INDEX idx_courses_course_code ON courses(course_code);
CREATE INDEX idx_courses_name ON courses(name);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_courses_semester ON courses(semester);
CREATE INDEX idx_courses_academic_year ON courses(academic_year);
CREATE INDEX idx_courses_department ON courses(department);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_is_evaluated ON courses(is_evaluated);
CREATE INDEX idx_courses_external_id ON courses(external_id, external_system);
CREATE INDEX idx_courses_created_at ON courses(created_at);

-- 添加表注释
COMMENT ON TABLE courses IS '课程表 - 存储课程基本信息和开课安排';
COMMENT ON COLUMN courses.id IS '课程唯一标识';
COMMENT ON COLUMN courses.course_code IS '课程编号（唯一）';
COMMENT ON COLUMN courses.name IS '课程名称';
COMMENT ON COLUMN courses.name_en IS '课程英文名称';
COMMENT ON COLUMN courses.course_type IS '课程类型：required-必修，elective-选修，professional-专业，general-通识';
COMMENT ON COLUMN courses.credits IS '学分';
COMMENT ON COLUMN courses.total_hours IS '总学时';
COMMENT ON COLUMN courses.theory_hours IS '理论学时';
COMMENT ON COLUMN courses.practice_hours IS '实践学时';
COMMENT ON COLUMN courses.description IS '课程描述';
COMMENT ON COLUMN courses.objectives IS '课程目标';
COMMENT ON COLUMN courses.content IS '课程内容';
COMMENT ON COLUMN courses.prerequisites IS '先修课程';
COMMENT ON COLUMN courses.textbooks IS '教材信息';
COMMENT ON COLUMN courses.teacher_id IS '任课教师ID';
COMMENT ON COLUMN courses.semester IS '学期';
COMMENT ON COLUMN courses.academic_year IS '学年';
COMMENT ON COLUMN courses.start_date IS '开课日期';
COMMENT ON COLUMN courses.end_date IS '结课日期';
COMMENT ON COLUMN courses.schedule_info IS '上课安排信息';
COMMENT ON COLUMN courses.max_students IS '最大学生数';
COMMENT ON COLUMN courses.current_students IS '当前学生数';
COMMENT ON COLUMN courses.department IS '开课院系';
COMMENT ON COLUMN courses.major IS '专业';
COMMENT ON COLUMN courses.grade_level IS '年级层次';
COMMENT ON COLUMN courses.status IS '课程状态：active-进行中，inactive-未开始，completed-已完成，cancelled-已取消';
COMMENT ON COLUMN courses.is_evaluated IS '是否参与评价';
COMMENT ON COLUMN courses.evaluation_type IS '评价类型：comprehensive-综合评价，peer-同行评价，student-学生评价，expert-专家评价';
COMMENT ON COLUMN courses.external_id IS '外部系统ID';
COMMENT ON COLUMN courses.external_system IS '外部系统名称';
COMMENT ON COLUMN courses.created_at IS '创建时间';
COMMENT ON COLUMN courses.updated_at IS '更新时间';
COMMENT ON COLUMN courses.created_by IS '创建人ID';
COMMENT ON COLUMN courses.updated_by IS '更新人ID';

-- 创建更新时间触发器
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();