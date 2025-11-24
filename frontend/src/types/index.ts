// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'teacher'
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  expiresIn: number
}

// 认证状态
export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

// 分页类型
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 数据采集相关类型
export interface DataSource {
  id: string
  name: string
  type: 'zhijiaoyun' | 'manual'
  status: 'active' | 'inactive' | 'error'
  lastSyncTime?: string
  config: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface DataCollection {
  id: string
  dataSourceId: string
  recordCount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  errorMessage?: string
  startTime: string
  endTime?: string
  metadata: Record<string, any>
}

// 分析相关类型
export interface EvaluationRule {
  id: string
  name: string
  description: string
  category: string
  weight: number
  conditions: RuleCondition[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RuleCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains'
  value: any
  logicalOperator?: 'and' | 'or'
}

export interface AnalysisResult {
  id: string
  teacherId: string
  courseId?: string
  classId?: string
  period: string
  overallScore: number
  scores: {
    ruleId: string
    ruleName: string
    score: number
    maxScore: number
    details: Record<string, any>
  }[]
  suggestions: string[]
  createdAt: string
}

// 仪表盘相关类型
export interface DashboardMetrics {
  totalTeachers: number
  totalCourses: number
  totalStudents: number
  totalAnalysisResults: number
  averageScore: number
  dataCollectionStatus: {
    active: number
    inactive: number
    error: number
  }
  recentActivities: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'data_collection' | 'analysis_completed' | 'user_login' | 'system_config'
  description: string
  timestamp: string
  userId?: string
  metadata?: Record<string, any>
}

// 图表数据类型
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
  metadata?: Record<string, any>
}

export interface TimeSeriesDataPoint {
  timestamp: string
  value: number
  category?: string
}

// 报表相关类型
export interface Report {
  id: string
  name: string
  type: 'teacher' | 'course' | 'class' | 'system'
  format: 'pdf' | 'excel'
  status: 'generating' | 'completed' | 'failed'
  generatedAt?: string
  downloadUrl?: string
  parameters: Record<string, any>
  createdBy: string
  createdAt: string
}

// 系统配置类型
export interface SystemConfig {
  id: string
  category: string
  key: string
  value: any
  description: string
  type: 'string' | 'number' | 'boolean' | 'json'
  isPublic: boolean
  updatedBy: string
  updatedAt: string
}

// 筛选和查询参数类型
export interface FilterParams {
  search?: string
  status?: string
  role?: string
  dateRange?: {
    start: string
    end: string
  }
  [key: string]: any
}

export interface SortParams {
  field: string
  order: 'asc' | 'desc'
}

// 表单相关类型
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: (value: any) => string | undefined
  }
}

// 通知相关类型
export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    url: string
  }
}

// 路由相关类型
export interface RouteConfig {
  path: string
  name: string
  component: React.ComponentType
  icon?: React.ComponentType
  roles?: ('admin' | 'teacher')[]
  children?: RouteConfig[]
}

// 组件Props类型
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// 错误类型
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// 加载状态类型
export interface LoadingState {
  isLoading: boolean
  message?: string
}

// 模态框类型
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}