import { apiClient } from '@/utils/apiClient'
import { ApiResponse } from '@/types'

export interface TimeWindow {
    startDate: string
    endDate: string
    type: 'day' | 'week' | 'month' | 'semester' | 'year'
}

export interface AnalysisRequest {
    teacherId: string
    timeWindow: TimeWindow
    ruleIds?: string[]
}

export interface DimensionResult {
    dimension: string
    score: number | null
    level: string
    metrics: any[]
    weight: number
    contribution: number | null
    details: {
        strengths: string[]
        weaknesses: string[]
        recommendations: string[]
    }
}

export interface AnalysisResult {
    id: string
    teacherId: string
    teacherInfo: {
        id: string
        name: string
    }
    timeWindow: TimeWindow
    overallScore: number | null
    overallLevel: string
    dimensionResults: DimensionResult[]
    metrics: any[]
    summary: {
        totalStudents: number
        responseRate: number
        dataCompleteness: number
        confidenceLevel: number
    }
    insights: {
        strengths: string[]
        weaknesses: string[]
        recommendations: string[]
        trends: any[]
    }
    comparisons: any
    metadata: any
}

export interface AnalysisRule {
    id: string
    name: string
    description: string
    type: string
    category: string
    enabled: boolean
    priority: number
    conditions: any[]
    weights: any[]
    thresholds: any
    parameters: any
    createdAt: string
    updatedAt: string
}

export const aiAnalysisService = {
    // 分析教师
    async analyzeTeacher(request: AnalysisRequest): Promise<ApiResponse<AnalysisResult>> {
        const response = await apiClient.post<ApiResponse<AnalysisResult>>(
            '/ai-analysis/analyze/teacher',
            request
        )
        return response.data
    },

    // 获取分析规则列表
    async getAnalysisRules(): Promise<ApiResponse<{ rules: AnalysisRule[] }>> {
        const response = await apiClient.get<ApiResponse<{ rules: AnalysisRule[] }>>(
            '/ai-analysis/rules'
        )
        return response.data
    },

    // 获取分析配置
    async getAnalysisConfig(): Promise<ApiResponse<any>> {
        const response = await apiClient.get<ApiResponse<any>>(
            '/ai-analysis/config'
        )
        return response.data
    },

    // 批量分析
    async batchAnalyze(request: {
        teacherIds: string[]
        timeWindow: TimeWindow
        ruleIds?: string[]
    }): Promise<ApiResponse<any>> {
        const response = await apiClient.post<ApiResponse<any>>(
            '/ai-analysis/analyze/batch',
            request
        )
        return response.data
    },
}
