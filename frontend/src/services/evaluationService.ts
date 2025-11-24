import { apiClient } from '@/utils/apiClient'
import { ApiResponse } from '@/types'

export interface EvaluationMetric {
    id: string
    name: string
    displayName: string
    description?: string
    category: string
    dimension: string
    dataType: string
    scale: string
    unit?: string
    range: {
        min: number
        max: number
    }
    calculationMethod: string
    aggregationMethod: string
    weight: number
    enabled: boolean
    required: boolean
    source: string
    validationRules: any[]
    createdAt: string
    updatedAt: string
}

export const evaluationService = {
    // 获取评价指标列表
    async getMetrics(): Promise<ApiResponse<{ metrics: EvaluationMetric[] }>> {
        const response = await apiClient.get<ApiResponse<{ metrics: EvaluationMetric[] }>>(
            '/evaluation-metrics/metrics'
        )
        return response.data
    },

    // 计算评价指标
    async calculateMetrics(request: {
        evaluateeId: string
        evaluateeType: 'teacher' | 'course' | 'class'
        timeWindow: {
            startDate: string
            endDate: string
        }
        aggregationLevel?: string
        weightingStrategy?: string
        calculationMethod?: string
    }): Promise<ApiResponse<any>> {
        const response = await apiClient.post<ApiResponse<any>>(
            '/evaluation-metrics/calculate',
            request
        )
        return response.data
    },

    // 获取权重配置
    async getWeightConfigs(): Promise<ApiResponse<any>> {
        const response = await apiClient.get<ApiResponse<any>>(
            '/evaluation-metrics/weights'
        )
        return response.data
    },

    // 获取计算配置
    async getCalculationConfigs(): Promise<ApiResponse<any>> {
        const response = await apiClient.get<ApiResponse<any>>(
            '/evaluation-metrics/configs'
        )
        return response.data
    },
}
