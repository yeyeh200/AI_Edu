import { QueryCache, MutationCache, QueryClient } from '@tanstack/react-query'
import { errorHandler } from './errorHandler'

// 创建查询缓存配置
export const queryCache = new QueryCache({
  onError: (error, query) => {
    // 使用统一错误处理器处理查询错误
    const apiError = errorHandler.handleApiError(error)

    // 对于静默查询，不显示错误消息
    const isSilentQuery = query.meta?.silent === true
    if (!isSilentQuery) {
      errorHandler.showError(apiError)
    }

    // 记录查询失败的详细信息
    console.group('🔍 Query Error Details')
    console.error('Query Key:', query.queryKey)
    console.error('Processed Error:', apiError)
    console.error('Original Error:', error)
    console.groupEnd()
  },
  onSuccess: (data, query) => {
    // 记录查询成功的信息（仅在开发环境下）
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Query Success: ${query.queryKey[0]}`, { data, queryKey: query.queryKey })
    }
  },
})

// 创建变更缓存配置
export const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    // 使用统一错误处理器处理变更错误
    const apiError = errorHandler.handleApiError(error)

    // 对于静默变更，不显示错误消息
    const isSilentMutation = mutation.meta?.silent === true
    if (!isSilentMutation) {
      errorHandler.showError(apiError)
    }

    // 记录变更失败的详细信息
    console.group('🔄 Mutation Error Details')
    console.error('Mutation Key:', mutation.mutationKey)
    console.error('Variables:', variables)
    console.error('Processed Error:', apiError)
    console.error('Original Error:', error)
    console.groupEnd()
  },
  onSuccess: (data, variables, context, mutation) => {
    // 记录变更成功的信息（仅在开发环境下）
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Mutation Success: ${mutation.mutationKey?.[0] || 'Unknown'}`, {
        data,
        variables,
        mutationKey: mutation.mutationKey
      })
    }
  },
})

// 创建 React Query 客户端实例
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 重试配置
      retry: (failureCount, error: any) => {
        // 对于 4xx 错误不重试
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        // 对于 5xx 错误最多重试 2 次
        if (error?.response?.status >= 500) {
          return failureCount < 2
        }
        // 网络错误最多重试 3 次
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 失败后不重新获取，除非手动触发
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      // 缓存时间：5分钟
      staleTime: 5 * 60 * 1000,
      // 缓存保留时间：10分钟
      gcTime: 10 * 60 * 1000,
      // 网络状态变化时的重试
      refetchOnMount: 'always',
      // 错误边界
      useErrorBoundary: (error) => {
        // 对于 5xx 错误使用错误边界
        return error?.response?.status >= 500
      },
    },
    mutations: {
      // 变更默认不重试
      retry: false,
      // 错误边界
      useErrorBoundary: (error) => {
        // 对于 5xx 错误使用错误边界
        return error?.response?.status >= 500
      },
    },
  },
  queryCache,
  mutationCache,
})

// 查询配置辅助函数
export const createQueryOptions = <T = any>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: {
    silent?: boolean
    retry?: number | boolean
    staleTime?: number
    enabled?: boolean
  } = {}
) => ({
  queryKey,
  queryFn,
  meta: {
    silent: options.silent || false,
  },
  retry: options.retry,
  staleTime: options.staleTime,
  enabled: options.enabled,
})

// 变更配置辅助函数
export const createMutationOptions = <T = any, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    silent?: boolean
    onSuccess?: (data: T, variables: V) => void
    onError?: (error: any, variables: V) => void
    onSettled?: () => void
  } = {}
) => ({
  mutationFn,
  meta: {
    silent: options.silent || false,
  },
  onSuccess: options.onSuccess,
  onError: (error: any, variables: V) => {
    const apiError = errorHandler.handleApiError(error)
    options.onError?.(apiError, variables)
  },
  onSettled: options.onSettled,
})

// 查询状态监控
export const setupQueryMonitoring = () => {
  // 监控查询缓存状态
  queryCache.subscribe((event) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query Cache Event:', {
        type: event.type,
        query: event.query,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // 监控变更缓存状态
  mutationCache.subscribe((event) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Mutation Cache Event:', {
        type: event.type,
        mutation: event.mutation,
        timestamp: new Date().toISOString(),
      })
    }
  })
}

// 清除所有缓存
export const clearAllCache = () => {
  queryClient.clear()
  console.log('🧹 All query cache cleared')
}

// 清除特定查询缓存
export const clearQueryCache = (queryKey: string[]) => {
  queryClient.invalidateQueries({ queryKey })
  console.log(`🧹 Query cache cleared for: ${queryKey.join('.')}`)
}

// 预加载查询
export const prefetchQuery = <T = any>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: {
    staleTime?: number
    onSuccess?: (data: T) => void
  } = {}
) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options.staleTime,
    onSuccess: options.onSuccess,
  })
}

// 获取查询数据（从缓存）
export const getQueryData = <T = any>(queryKey: string[]): T | undefined => {
  return queryClient.getQueryData<T>(queryKey)
}

// 设置查询数据（到缓存）
export const setQueryData = <T = any>(queryKey: string[], data: T): void => {
  queryClient.setQueryData(queryKey, data)
}

// 取消查询
export const cancelQuery = async (queryKey: string[]) => {
  await queryClient.cancelQueries({ queryKey })
  console.log(`❌ Query cancelled: ${queryKey.join('.')}`)
}