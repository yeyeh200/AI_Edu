-- 创建职教云数据采集相关表
-- 这些表用于存储从职教云平台采集的教学数据

-- 1. 出勤记录表
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGSERIAL PRIMARY KEY,
    attendance_id VARCHAR(100) UNIQUE NOT NULL,
    class_id VARCHAR(100),
    student_id VARCHAR(100),
    student_name VARCHAR(100),
    course_id VARCHAR(100),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'early_leave')),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendance_class ON attendance_records(class_id);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_attendance_status ON attendance_records(status);

COMMENT ON TABLE attendance_records IS '出勤记录表 - 存储学生出勤数据';

-- 2. 作业表
CREATE TABLE IF NOT EXISTS assignments (
    id BIGSERIAL PRIMARY KEY,
    assignment_id VARCHAR(100) UNIQUE NOT NULL,
    course_id VARCHAR(100),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assignment_type VARCHAR(50),
    total_score DECIMAL(5,2),
    deadline TIMESTAMP,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignment_course ON assignments(course_id);
CREATE INDEX idx_assignment_deadline ON assignments(deadline);

COMMENT ON TABLE assignments IS '作业表 - 存储作业信息';

-- 3. 作业提交记录表
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id BIGSERIAL PRIMARY KEY,
    submission_id VARCHAR(100) UNIQUE NOT NULL,
    assignment_id VARCHAR(100) NOT NULL,
    student_id VARCHAR(100) NOT NULL,
    student_name VARCHAR(100),
    content TEXT,
    file_url VARCHAR(500),
    submit_time TIMESTAMP,
    score DECIMAL(5,2),
    feedback TEXT,
    graded_by VARCHAR(100),
    graded_at TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('submitted', 'graded', 'late', 'missing')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submission_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submission_student ON assignment_submissions(student_id);
CREATE INDEX idx_submission_status ON assignment_submissions(status);

COMMENT ON TABLE assignment_submissions IS '作业提交记录表 - 存储学生作业提交情况';

-- 4. 考试成绩表
CREATE TABLE IF NOT EXISTS exam_scores (
    id BIGSERIAL PRIMARY KEY,
    score_id VARCHAR(100) UNIQUE NOT NULL,
    exam_id VARCHAR(100),
    exam_name VARCHAR(200),
    course_id VARCHAR(100),
    student_id VARCHAR(100) NOT NULL,
    student_name VARCHAR(100),
    score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    rank INTEGER,
    exam_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exam_score_course ON exam_scores(course_id);
CREATE INDEX idx_exam_score_student ON exam_scores(student_id);
CREATE INDEX idx_exam_score_exam ON exam_scores(exam_id);
CREATE INDEX idx_exam_score_date ON exam_scores(exam_date);

COMMENT ON TABLE exam_scores IS '考试成绩表 - 存储学生考试成绩';

-- 5. 学生评价表
CREATE TABLE IF NOT EXISTS student_evaluations (
    id BIGSERIAL PRIMARY KEY,
    evaluation_id VARCHAR(100) UNIQUE NOT NULL,
    teacher_id VARCHAR(100),
    teacher_name VARCHAR(100),
    course_id VARCHAR(100),
    student_id VARCHAR(100),
    student_name VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    evaluation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evaluation_teacher ON student_evaluations(teacher_id);
CREATE INDEX idx_evaluation_course ON student_evaluations(course_id);
CREATE INDEX idx_evaluation_student ON student_evaluations(student_id);
CREATE INDEX idx_evaluation_date ON student_evaluations(evaluation_date);

COMMENT ON TABLE student_evaluations IS '学生评价表 - 存储学生对教师和课程的评价';

-- 6. 教学活动表
CREATE TABLE IF NOT EXISTS teaching_activities (
    id BIGSERIAL PRIMARY KEY,
    activity_id VARCHAR(100) UNIQUE NOT NULL,
    teacher_id VARCHAR(100),
    teacher_name VARCHAR(100),
    course_id VARCHAR(100),
    activity_type VARCHAR(50),
    activity_name VARCHAR(200),
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration INTEGER, -- 分钟
    participant_count INTEGER,
    status VARCHAR(20) CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_teacher ON teaching_activities(teacher_id);
CREATE INDEX idx_activity_course ON teaching_activities(course_id);
CREATE INDEX idx_activity_type ON teaching_activities(activity_type);
CREATE INDEX idx_activity_status ON teaching_activities(status);
CREATE INDEX idx_activity_start ON teaching_activities(start_time);

COMMENT ON TABLE teaching_activities IS '教学活动表 - 存储教师教学活动记录';

-- 7. 班级信息表
CREATE TABLE IF NOT EXISTS classes (
    id BIGSERIAL PRIMARY KEY,
    class_id VARCHAR(100) UNIQUE NOT NULL,
    class_name VARCHAR(200) NOT NULL,
    course_id VARCHAR(100),
    teacher_id VARCHAR(100),
    semester VARCHAR(50),
    academic_year VARCHAR(20),
    student_count INTEGER DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_class_course ON classes(course_id);
CREATE INDEX idx_class_teacher ON classes(teacher_id);
CREATE INDEX idx_class_semester ON classes(semester);
CREATE INDEX idx_class_status ON classes(status);

COMMENT ON TABLE classes IS '班级信息表 - 存储班级基本信息';

-- 添加触发器以自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignment_submissions_updated_at BEFORE UPDATE ON assignment_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_scores_updated_at BEFORE UPDATE ON exam_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_evaluations_updated_at BEFORE UPDATE ON student_evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teaching_activities_updated_at BEFORE UPDATE ON teaching_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
