import { useAuthStore } from '@/stores/authStore'

export function Header() {
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              AI助评系统
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {user?.role === 'admin' ? '管理员' : '教师'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              退出
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}