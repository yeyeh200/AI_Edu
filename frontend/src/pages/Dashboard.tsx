export function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">教师总数</h3>
          <p className="text-3xl font-bold text-gray-900">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">课程总数</h3>
          <p className="text-3xl font-bold text-gray-900">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">学生总数</h3>
          <p className="text-3xl font-bold text-gray-900">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">分析结果</h3>
          <p className="text-3xl font-bold text-gray-900">-</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">欢迎使用AI助评系统</h2>
        <p className="text-gray-600">
          系统正在开发中，更多功能即将上线...
        </p>
      </div>
    </div>
  )
}