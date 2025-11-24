import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Analysis } from '@/pages/Analysis'
import { Reports } from '@/pages/Reports'
import { System } from '@/pages/System'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

function App() {
  const { user, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // 未登录用户只能访问登录页
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // 已登录用户的路由
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/reports" element={<Reports />} />

        {/* 只有管理员可以访问系统管理 */}
        {user.role === 'admin' && (
          <Route path="/system" element={<System />} />
        )}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App