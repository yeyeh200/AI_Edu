import { Hono, Context, Next } from 'hono'
import * as logger from 'logger'
import { config } from '@/config/config.ts'
import { errorHandler } from '@/middleware/error.ts'
import { notFoundHandler } from '@/middleware/notFound.ts'
import { cors } from 'hono/middleware'
import { secureHeaders } from 'hono/middleware'

// 处理 BigInt 序列化
// @ts-ignore
; (BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

// 导入路由
import { authRoutes } from '@/routes/auth.ts'
import { zhijiaoyunRoutes } from '@/routes/zhijiaoyun.ts'
import { dataCollectionRoutes } from '@/routes/dataCollection.ts'
import { dataCleaningRoutes } from '@/routes/dataCleaning.ts'
import { aiAnalysisRoutes } from '@/routes/aiAnalysis.ts'
import { evaluationMetricsRoutes } from '@/routes/evaluationMetrics.ts'
import { analysisRoutes } from '@/routes/analysis.ts'
import { dataRoutes } from '@/routes/data.ts'
import { dashboardRoutes } from '@/routes/dashboard.ts'
import { systemRoutes } from '@/routes/system.ts'
import { reportsRoutes } from '@/routes/reports.ts'
import teachers from '@/routes/teachers.ts'

const app = new Hono()

// 全局中间件
app.use('*', async (c: Context, next: Next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  logger.info(`${c.req.method} ${c.req.url} - ${c.res.status} - ${duration}ms`)
})
app.use('*', cors({
  origin: config.cors.origins,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
app.use('*', secureHeaders())

// 健康检查
app.get('/health', (c: Context) => {
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

// API路由（兼容 /api 与版本化 /v1 前缀）
app.route('/api/auth', authRoutes)
app.route('/api/zhijiaoyun', zhijiaoyunRoutes)
app.route('/api/data-collection', dataCollectionRoutes)
app.route('/api/data-cleaning', dataCleaningRoutes)
app.route('/api/ai-analysis', aiAnalysisRoutes)
app.route('/api/evaluation-metrics', evaluationMetricsRoutes)
app.route('/api/analysis', analysisRoutes)
app.route('/api/data', dataRoutes)
app.route('/api/dashboard', dashboardRoutes)
app.route('/api/system', systemRoutes)
app.route('/api/reports', reportsRoutes)
app.route('/api/teachers', teachers)

app.route('/v1/auth', authRoutes)
app.route('/v1/zhijiaoyun', zhijiaoyunRoutes)
app.route('/v1/data-collection', dataCollectionRoutes)
app.route('/v1/data-cleaning', dataCleaningRoutes)
app.route('/v1/ai-analysis', aiAnalysisRoutes)
app.route('/v1/evaluation-metrics', evaluationMetricsRoutes)
app.route('/v1/analysis', analysisRoutes)
app.route('/v1/data', dataRoutes)
app.route('/v1/dashboard', dashboardRoutes)
app.route('/v1/system', systemRoutes)
app.route('/v1/reports', reportsRoutes)
app.route('/v1/teachers', teachers)

// 错误处理中间件
app.notFound(notFoundHandler)
app.onError(errorHandler)

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
