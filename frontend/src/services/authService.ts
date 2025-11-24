import { apiClient } from '@/utils/apiClient'
import { LoginRequest, AuthResponse, User, ApiResponse } from '@/types'

export const authService = {
  // 登录
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return response.data
  },

  // 登出
  async logout(token: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  },

  // 获取当前用户信息
  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  // 刷新token
  async refreshToken(token: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  },

  // 修改密码
  async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(
      '/auth/change-password',
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  },
}