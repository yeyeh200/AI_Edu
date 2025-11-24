import { load } from 'https://deno.land/std@0.208.0/dotenv/mod.ts'

// 加载环境变量
await load({
  allowEmptyValues: true,
  export: true,
})

export const config = {
  app: {
    name: 'AI助评系统',
    version: '1.0.0',
    environment: Deno.env.get('NODE_ENV') || 'development',
    port: parseInt(Deno.env.get('PORT') || '8000'),
  },

  database: {
    host: Deno.env.get('DB_HOST') || 'localhost',
    port: parseInt(Deno.env.get('DB_PORT') || '5432'),
    name: Deno.env.get('DB_NAME') || 'ai_evaluation',
    user: Deno.env.get('DB_USER') || 'postgres',
    password: Deno.env.get('DB_PASSWORD') || 'password',
    ssl: Deno.env.get('DB_SSL') === 'true',
    connectionTimeout: 30000,
    maxConnections: 5, // further reduced pool size
  },

  jwt: {
    secret: Deno.env.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: '24h',
    expiresInNumber: 24 * 60 * 60, // 24小时，以秒为单位
    issuer: 'ai-evaluation-system',
    audience: 'ai-evaluation-users',
  },

  cors: {
    origins: Deno.env.get('CORS_ORIGINS')?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
  },

  redis: {
    host: Deno.env.get('REDIS_HOST') || 'localhost',
    port: parseInt(Deno.env.get('REDIS_PORT') || '6379'),
    password: Deno.env.get('REDIS_PASSWORD'),
    db: parseInt(Deno.env.get('REDIS_DB') || '0'),
  },

  // 职教云API配置
  zhijiaoyun: {
    baseUrl: Deno.env.get('ZJIJAOYUN_BASE_URL') || 'https://api.zhijiaoyun.com',
    apiKey: Deno.env.get('ZJIJAOYUN_API_KEY') || '',
    apiSecret: Deno.env.get('ZJIJAOYUN_API_SECRET') || '',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // 文件上传配置
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
    uploadPath: './uploads',
  },

  // 日志配置
  logging: {
    level: Deno.env.get('LOG_LEVEL') || 'info',
    format: 'json',
    file: {
      enabled: Deno.env.get('LOG_FILE_ENABLED') === 'true',
      path: Deno.env.get('LOG_FILE_PATH') || './logs/app.log',
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    },
  },

  // 缓存配置
  cache: {
    ttl: {
      user: 3600, // 1小时
      session: 86400, // 24小时
      data: 1800, // 30分钟
      analysis: 7200, // 2小时
    },
  },

  // 分页配置
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // 安全配置
  security: {
    bcryptRounds: 12,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 最大请求数
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  },
}

// 数据库连接字符串
export const databaseUrl = `postgresql://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}${config.database.ssl ? '?sslmode=require' : ''}`

// 验证必需的环境变量
export function validateConfig(): void {
  const requiredEnvVars = []

  if (config.app.environment === 'production') {
    requiredEnvVars.push(
      'JWT_SECRET',
      'DB_PASSWORD',
      'ZJIJAOYUN_API_KEY',
      'ZJIJAOYUN_API_SECRET',
    )
  }

  const missingVars = requiredEnvVars.filter(varName => !Deno.env.get(varName))

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

// 在生产环境中验证配置
if (config.app.environment === 'production') {
  validateConfig()
}