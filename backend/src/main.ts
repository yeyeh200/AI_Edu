import { Hono } from 'hono'
import * as logger from 'logger'
// import { config } from '@/config/config'
// import { authMiddleware } from '@/middleware/auth'
// import { errorHandler } from '@/middleware/error'
// import { notFoundHandler } from '@/middleware/notFound'

// // 导入路由
// import { authRoutes } from '@/routes/auth'
// import { zhijiaoyunRoutes } from '@/routes/zhijiaoyun'
// import { dataCollectionRoutes } from '@/routes/dataCollection'
// import { dataCleaningRoutes } from '@/routes/dataCleaning'
// import { aiAnalysisRoutes } from '@/routes/aiAnalysis'
// import { evaluationMetricsRoutes } from '@/routes/evaluationMetrics'
// import { dataRoutes } from '@/routes/data'
// import { analysisRoutes } from '@/routes/analysis'
// import { dashboardRoutes } from '@/routes/dashboard'
// import { systemRoutes } from '@/routes/system'

const app = new Hono()

// 全局中间件
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  logger.info(`${c.req.method} ${c.req.url} - ${c.res.status} - ${duration}ms`)
})
// app.use('*', cors({
//   origin: config.cors.origins,
//   credentials: true,
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowHeaders: ['Content-Type', 'Authorization'],
// }))
// app.use('*', secureHeaders())

// 健康检查
app.get('/health', (c) => {
  return c.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: 'development',
    },
  })
})

// API路由 - 暂时禁用
// app.route('/api/auth', authRoutes)
// app.route('/api/zhijiaoyun', zhijiaoyunRoutes)
// app.route('/api/data-collection', dataCollectionRoutes)
// app.route('/api/data-cleaning', dataCleaningRoutes)
// app.route('/api/ai-analysis', aiAnalysisRoutes)
// app.route('/api/evaluation-metrics', evaluationMetricsRoutes)
// app.route('/api/data', dataRoutes)
// app.route('/api/analysis', analysisRoutes)
// app.route('/api/dashboard', dashboardRoutes)
// app.route('/api/system', systemRoutes)

// 错误处理中间件 - 暂时禁用
// app.notFound(notFoundHandler)
// app.onError(errorHandler)

// 启动服务器
const port = 8000
console.log(`🚀 AI助评系统后端服务启动成功`)
console.log(`📍 服务地址: http://localhost:${port}`)
console.log(`🌍 环境: development`)
console.log(`📊 版本: 1.0.0`)

Deno.serve({
  port,
  onListen: () => {
    console.log(`Server is running on port ${port}`)
  },
}, app.fetch)

export default app