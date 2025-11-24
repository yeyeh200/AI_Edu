import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginRequest, AuthResponse } from '@/types'
import { authService } from '@/services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateUser: (user: User) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (username: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authService.login({ username, password })

          if (response.success && response.data) {
            const { user, token } = response.data
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            throw new Error(response.message || '登录失败')
          }
        } catch (error: any) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        const { token } = get()
        try {
          if (token) {
            await authService.logout(token)
          }
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isAuthenticated: false, isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          const response = await authService.getCurrentUser(token)

          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            // Token无效，清除认证状态
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch (error) {
          console.error('Auth check error:', error)
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      updateUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)