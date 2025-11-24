import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  HomeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  DatabaseIcon,
} from '@heroicons/react/24/outline'

export function Sidebar() {
  const { user } = useAuthStore()
  const location = useLocation()

  const navigation = [
    {
      name: '仪表盘',
      href: '/dashboard',
      icon: HomeIcon,
      current: location.pathname === '/dashboard',
    },
    {
      name: '数据管理',
      href: '/data',
      icon: DatabaseIcon,
      current: location.pathname === '/data',
    },
    {
      name: 'AI分析',
      href: '/analysis',
      icon: ChartBarIcon,
      current: location.pathname === '/analysis',
    },
    {
      name: '报表中心',
      href: '/reports',
      icon: DocumentTextIcon,
      current: location.pathname === '/reports',
    },
  ]

  // 只有管理员才能看到系统管理
  if (user?.role === 'admin') {
    navigation.push({
      name: '系统管理',
      href: '/system',
      icon: Cog6ToothIcon,
      current: location.pathname === '/system',
    })
  }

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-lg font-semibold text-gray-900">导航菜单</h2>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      item.current
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}