-- 示例基础数据种子，支持仪表盘与分析

-- 教师
INSERT INTO teachers (id, name, employeeId, email, is_active, created_at, updated_at)
SELECT 't1', '示例教师A', 'E001', 'teacherA@example.com', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE id = 't1');

INSERT INTO teachers (id, name, employeeId, email, is_active, created_at, updated_at)
SELECT 't2', '示例教师B', 'E002', 'teacherB@example.com', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM teachers WHERE id = 't2');

-- 课程
INSERT INTO courses (id, name, code, credits, teacher_id, semester, year, is_active, created_at, updated_at)
SELECT 'c1', '示例课程一', 'C001', 3, 't1', '2025-秋', 2025, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = 'c1');

INSERT INTO courses (id, name, code, credits, teacher_id, semester, year, is_active, created_at, updated_at)
SELECT 'c2', '示例课程二', 'C002', 2, 't2', '2025-秋', 2025, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = 'c2');

-- 评价记录
INSERT INTO evaluation_records (id, teacher_id, course_id, student_id, overall_score, dimension_scores, comments, evaluation_date, created_at, updated_at)
SELECT 'er1', 't1', 'c1', 's1', 85, '{"teaching_attitude":82,"teaching_content":84,"teaching_method":80,"teaching_effect":88,"teaching_ethics":90}', '讲解清晰', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM evaluation_records WHERE id = 'er1');

INSERT INTO evaluation_records (id, teacher_id, course_id, student_id, overall_score, dimension_scores, comments, evaluation_date, created_at, updated_at)
SELECT 'er2', 't2', 'c2', 's2', 78, '{"teaching_attitude":76,"teaching_content":80,"teaching_method":74,"teaching_effect":79,"teaching_ethics":85}', '互动较好', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM evaluation_records WHERE id = 'er2');

-- 考试成绩
INSERT INTO exam_scores (id, exam_id, exam_name, student_id, course_id, score, total_score, percentage, exam_date, created_at, updated_at)
SELECT 'es1', 'midterm', '期中考试', 's1', 'c1', 88, 100, 0.88, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM exam_scores WHERE id = 'es1');

INSERT INTO exam_scores (id, exam_id, exam_name, student_id, course_id, score, total_score, percentage, exam_date, created_at, updated_at)
SELECT 'es2', 'midterm', '期中考试', 's2', 'c2', 72, 100, 0.72, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM exam_scores WHERE id = 'es2');
