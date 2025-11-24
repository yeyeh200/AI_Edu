/**
 * 职教云API相关类型定义
 */

// 职教云API响应基础结构
export interface ZhijiaoyunApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
  requestId: string
}

// 职教云用户信息
export interface ZhijiaoyunUser {
  userId: string
  username: string
  realName: string
  email: string
  phone: string
  avatar?: string
  departmentId: string
  departmentName: string
  role: string // 'teacher' | 'student' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  createTime: string
  lastLoginTime?: string
}

// 职教云课程信息
export interface ZhijiaoyunCourse {
  courseId: string
  courseCode: string
  courseName: string
  description?: string
  teacherId: string
  teacherName: string
  departmentId: string
  departmentName: string
  category: string
  credits: number
  totalHours: number
  theoryHours: number
  practiceHours: number
  semester: string
  academicYear: string
  startTime: string
  endTime: string
  maxStudents: number
  currentStudents: number
  status: 'active' | 'inactive' | 'completed'
  createTime: string
  updateTime: string
}

// 职教云班级信息
export interface ZhijiaoyunClass {
  classId: string
  className: string
  courseId: string
  courseName: string
  teacherId: string
  teacherName: string
  studentCount: number
  maxStudents: number
  schedule: ClassSchedule[]
  status: 'active' | 'inactive'
  createTime: string
}

export interface ClassSchedule {
  dayOfWeek: number // 1-7 (周一到周日)
  startTime: string // "09:00"
  endTime: string   // "10:30"
  classroom: string
}

// 学生出勤记录
export interface ZhijiaoyunAttendance {
  attendanceId: string
  classId: string
  studentId: string
  studentName: string
  date: string
  startTime: string
  endTime: string
  status: 'present' | 'absent' | 'late' | 'early_leave'
  checkInTime?: string
  checkOutTime?: string
  remark?: string
}

// 作业/任务信息
export interface ZhijiaoyunAssignment {
  assignmentId: string
  courseId: string
  courseName: string
  title: string
  description: string
  type: 'homework' | 'quiz' | 'exam' | 'project'
  totalScore: number
  startTime: string
  endTime: string
  submitCount: number
  totalCount: number
  status: 'draft' | 'published' | 'closed'
  createTime: string
}

// 学生作业提交记录
export interface ZhijiaoyunSubmission {
  submissionId: string
  assignmentId: string
  studentId: string
  studentName: string
  content: string
  attachments?: string[]
  submitTime: string
  score?: number
  feedback?: string
  status: 'submitted' | 'graded' | 'late'
}

// 考试成绩
export interface ZhijiaoyunExamScore {
  scoreId: string
  examId: string
  examName: string
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  totalScore: number
  studentScore: number
  rank?: number
  rankCount?: number
  passStatus: 'pass' | 'fail' | 'excellent'
  examTime: string
  createTime: string
}

// 学生评价数据
export interface ZhijiaoyunEvaluation {
  evaluationId: string
  studentId: string
  studentName: string
  teacherId: string
  teacherName: string
  courseId: string
  courseName: string
  type: 'teaching_quality' | 'course_content' | 'learning_effectiveness'
  dimension: string
  score: number
  comment?: string
  evaluateTime: string
  status: 'active' | 'inactive'
}

// 教学活动数据
export interface ZhijiaoyunTeachingActivity {
  activityId: string
  courseId: string
  courseName: string
  teacherId: string
  teacherName: string
  type: 'lecture' | 'discussion' | 'experiment' | 'practice' | 'seminar'
  title: string
  description?: string
  duration: number // 分钟
  participantCount: number
  startTime: string
  endTime: string
  materials?: string[]
  status: 'scheduled' | 'ongoing' | 'completed'
  createTime: string
}

// API请求参数
export interface ZhijiaoyunApiParams {
  [key: string]: any
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface DateRangeParams {
  startDate?: string
  endDate?: string
}

// 用户查询参数
export interface UserQueryParams extends PaginationParams {
  keyword?: string
  role?: string
  departmentId?: string
  status?: string
}

// 课程查询参数
export interface CourseQueryParams extends PaginationParams {
  keyword?: string
  teacherId?: string
  departmentId?: string
  semester?: string
  academicYear?: string
  status?: string
}

// 考勤查询参数
export interface AttendanceQueryParams extends PaginationParams, DateRangeParams {
  classId?: string
  studentId?: string
  status?: string
}

// 成绩查询参数
export interface ScoreQueryParams extends PaginationParams, DateRangeParams {
  courseId?: string
  studentId?: string
  examType?: string
}

// API错误类型
export interface ZhijiaoyunApiError {
  code: number
  message: string
  details?: any
}

// 数据同步状态
export interface SyncStatus {
  lastSyncTime: string
  syncType: 'full' | 'incremental'
  totalRecords: number
  successRecords: number
  failedRecords: number
  errors?: string[]
}

// 数据统计信息
export interface ZhijiaoyunStatistics {
  userCount: {
    total: number
    teachers: number
    students: number
    admins: number
  }
  courseCount: {
    total: number
    active: number
    completed: number
  }
  attendanceRate: number
  averageScore: number
  evaluationScore: number
}