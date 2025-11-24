// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  password_hash: string
  role: 'admin' | 'teacher'
  name: string
  avatar?: string
  is_active: boolean
  last_login_at?: Date
  created_at: Date
  updated_at: Date
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: 'admin' | 'teacher'
  name: string
  avatar?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>
  token: string
  expires_in: number
}

// 数据源相关类型
export interface DataSource {
  id: string
  name: string
  type: 'zhijiaoyun' | 'manual'
  status: 'active' | 'inactive' | 'error'
  config: Record<string, any>
  last_sync_at?: Date
  created_by: string
  created_at: Date
  updated_at: Date
}

// 数据采集相关类型
export interface DataCollection {
  id: string
  data_source_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  record_count: number
  error_message?: string
  started_at: Date
  completed_at?: Date
  metadata: Record<string, any>
  created_by: string
  created_at: Date
}

// 评价规则相关类型
export interface EvaluationRule {
  id: string
  name: string
  description: string
  category: string
  weight: number
  conditions: RuleCondition[]
  is_active: boolean
  created_by: string
  created_at: Date
  updated_at: Date
}

export interface RuleCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains'
  value: any
  logical_operator?: 'and' | 'or'
}

// 分析结果相关类型
export interface AnalysisResult {
  id: string
  teacher_id: string
  course_id?: string
  class_id?: string
  period: string
  overall_score: number
  max_score: number
  scores: AnalysisScore[]
  suggestions: string[]
  metadata: Record<string, any>
  created_at: Date
}

export interface AnalysisScore {
  rule_id: string
  rule_name: string
  score: number
  max_score: number
  details: Record<string, any>
}

// 课程相关类型
export interface Course {
  id: string
  name: string
  code: string
  description?: string
  credits: number
  teacher_id: string
  semester: string
  year: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// 班级相关类型
export interface Class {
  id: string
  name: string
  code: string
  teacher_id: string
  student_count: number
  semester: string
  year: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// 学生相关类型
export interface Student {
  id: string
  name: string
  student_id: string
  class_id: string
  email?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

// 学习活动数据类型
export interface LearningActivity {
  id: string
  student_id: string
  course_id: string
  activity_type: 'assignment' | 'quiz' | 'discussion' | 'attendance' | 'exam'
  activity_name: string
  score?: number
  max_score?: number
  completed_at: Date
  duration?: number // 分钟
  metadata: Record<string, any>
  created_at: Date
}

// 系统配置相关类型
export interface SystemConfig {
  id: string
  category: string
  key: string
  value: any
  description: string
  type: 'string' | 'number' | 'boolean' | 'json'
  is_public: boolean
  updated_by: string
  created_at: Date
  updated_at: Date
}

// 报表相关类型
export interface Report {
  id: string
  name: string
  type: 'teacher' | 'course' | 'class' | 'system'
  format: 'pdf' | 'excel'
  status: 'generating' | 'completed' | 'failed'
  file_path?: string
  generated_at?: Date
  parameters: Record<string, any>
  created_by: string
  created_at: Date
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

// 查询参数类型
export interface PaginationParams {
  page: number
  page_size: number
}

export interface FilterParams {
  search?: string
  status?: string
  role?: string
  date_range?: {
    start: string
    end: string
  }
  [key: string]: any
}

export interface SortParams {
  sort_by: string
  sort_order: 'asc' | 'desc'
}

export interface QueryParams extends PaginationParams, FilterParams, SortParams {}

// 数据库查询选项
export interface QueryOptions {
  select?: string[]
  where?: Record<string, any>
  orderBy?: Record<string, 'asc' | 'desc'>
  limit?: number
  offset?: number
  join?: Record<string, any>
}

// 错误类型
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
  stack?: string
}

// 中间件类型
export interface AuthContext {
  user: Omit<User, 'password_hash'>
  token: string
}

export interface RequestContext {
  requestId: string
  userId?: string
  userRole?: string
  timestamp: Date
  method: string
  url: string
}

// 事件类型
export interface EventData {
  type: string
  payload: Record<string, any>
  timestamp: Date
  user_id?: string
  metadata?: Record<string, any>
}

// 统计数据类型
export interface DashboardStats {
  total_teachers: number
  total_courses: number
  total_students: number
  total_analysis_results: number
  average_score: number
  data_collection_status: {
    active: number
    inactive: number
    error: number
  }
  recent_activities: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'data_collection' | 'analysis_completed' | 'user_login' | 'system_config'
  description: string
  user_id?: string
  metadata: Record<string, any>
  created_at: Date
}

// 数据验证类型
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

// 任务类型
export interface Task {
  id: string
  type: 'data_collection' | 'analysis' | 'report_generation'
  status: 'pending' | 'running' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high'
  parameters: Record<string, any>
  result?: any
  error_message?: string
  started_at?: Date
  completed_at?: Date
  created_by: string
  created_at: Date
}

// 日志类型
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  timestamp: Date
  context: Record<string, any>
  request_id?: string
  user_id?: string
}

// 缓存类型
export interface CacheOptions {
  ttl?: number // 秒
  tags?: string[]
}

// 文件上传类型
export interface FileUpload {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
}

// 导出类型定义
export type {
  User as UserType,
  DataSource as DataSourceType,
  DataCollection as DataCollectionType,
  EvaluationRule as EvaluationRuleType,
  AnalysisResult as AnalysisResultType,
  Course as CourseType,
  Class as ClassType,
  Student as StudentType,
  LearningActivity as LearningActivityType,
  SystemConfig as SystemConfigType,
  Report as ReportType,
}