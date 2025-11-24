import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';

interface RealTimeDataOptions<T> {
  queryKey: string[];
  fetchFn: () => Promise<T>;
  wsChannel?: string;
  wsMessageType?: string;
  enabled?: boolean;
  refetchInterval?: number;
  onUpdate?: (data: T, previousData: T | undefined) => void;
  onError?: (error: Error) => void;
}

interface UseRealTimeDataReturn<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  lastUpdated: Date | null;
  refresh: () => void;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useRealTimeData = <T>(
  options: RealTimeDataOptions<T>
): UseRealTimeDataReturn<T> => {
  const {
    queryKey,
    fetchFn,
    wsChannel,
    wsMessageType,
    enabled = true,
    refetchInterval,
    onUpdate,
    onError,
  } = options;

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const previousDataRef = useRef<T | undefined>();

  // WebSocket connection
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === wsMessageType && message.data) {
        const newData = message.data as T;
        onUpdate?.(newData, previousDataRef.current);
        previousDataRef.current = newData;
        setLastUpdated(new Date());
      }
    },
  });

  // React Query for data fetching
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<T>({
    queryKey,
    queryFn: async () => {
      try {
        const result = await fetchFn();
        previousDataRef.current = data;
        setLastUpdated(new Date());
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        onError?.(error);
        throw error;
      }
    },
    enabled,
    refetchInterval: isConnected ? undefined : refetchInterval, // Disable polling when WebSocket is connected
  });

  // Subscribe to WebSocket updates
  const subscribe = useCallback(() => {
    if (wsChannel && sendMessage) {
      sendMessage({
        type: 'subscribe',
        channel: wsChannel,
      });
    }
  }, [wsChannel, sendMessage]);

  // Unsubscribe from WebSocket updates
  const unsubscribe = useCallback(() => {
    if (wsChannel && sendMessage) {
      sendMessage({
        type: 'unsubscribe',
        channel: wsChannel,
      });
    }
  }, [wsChannel, sendMessage]);

  // Auto-subscribe when connected
  useEffect(() => {
    if (isConnected && wsChannel) {
      subscribe();
    }
  }, [isConnected, wsChannel, subscribe]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return {
    data,
    isLoading,
    error: error as Error | null,
    isConnected,
    lastUpdated,
    refresh: refetch,
    subscribe,
    unsubscribe,
  };
};

// Specialized hooks for common real-time data needs
export const useRealTimeStats = () => {
  return useRealTimeData({
    queryKey: ['dashboard-stats'],
    fetchFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    },
    wsChannel: 'dashboard-stats',
    wsMessageType: 'stats_update',
    refetchInterval: 30000, // Fallback to 30-second polling
  });
};

export const useRealTimeEvaluations = (filters?: any) => {
  return useRealTimeData({
    queryKey: ['evaluations', filters],
    fetchFn: async () => {
      const params = new URLSearchParams(filters || {});
      const response = await fetch(`/api/evaluations?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch evaluations');
      }
      return response.json();
    },
    wsChannel: 'evaluations',
    wsMessageType: 'evaluation_update',
    refetchInterval: 60000, // Fallback to 1-minute polling
  });
};

export const useRealTimeAnalytics = (timeRange?: string) => {
  return useRealTimeData({
    queryKey: ['analytics', timeRange],
    fetchFn: async () => {
      const params = new URLSearchParams({ timeRange: timeRange || 'semester' });
      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return response.json();
    },
    wsChannel: 'analytics',
    wsMessageType: 'analytics_update',
    refetchInterval: 300000, // Fallback to 5-minute polling
  });
};

// Hook for real-time data aggregation and calculations
export const useRealTimeAggregator = <T>(
  sourceQuery: UseRealTimeDataReturn<T[]>,
  aggregator: (data: T[]) => any,
  dependencies: any[] = []
) => {
  const [aggregatedData, setAggregatedData] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (sourceQuery.data) {
      setIsCalculating(true);
      try {
        const result = aggregator(sourceQuery.data);
        setAggregatedData(result);
      } catch (error) {
        console.error('Aggregation error:', error);
      } finally {
        setIsCalculating(false);
      }
    }
  }, [sourceQuery.data, ...dependencies]);

  return {
    data: aggregatedData,
    isLoading: sourceQuery.isLoading || isCalculating,
    error: sourceQuery.error,
    isConnected: sourceQuery.isConnected,
    lastUpdated: sourceQuery.lastUpdated,
  };
};

// Hook for real-time data diffing and change detection
export const useRealTimeDiff = <T>(
  sourceQuery: UseRealTimeDataReturn<T>,
  compareFn: (current: T | undefined, previous: T | undefined) => any,
  dependencies: any[] = []
) => {
  const [diff, setDiff] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const previousDataRef = useRef<T | undefined>();

  useEffect(() => {
    if (sourceQuery.data !== undefined) {
      try {
        const changes = compareFn(sourceQuery.data, previousDataRef.current);
        setDiff(changes);
        setHasChanges(Object.keys(changes || {}).length > 0);
        previousDataRef.current = sourceQuery.data;
      } catch (error) {
        console.error('Diff calculation error:', error);
      }
    }
  }, [sourceQuery.data, ...dependencies]);

  return {
    diff,
    hasChanges,
    clearChanges: () => {
      setDiff(null);
      setHasChanges(false);
    },
  };
};

// Hook for throttling real-time updates
export const useThrottledRealTimeData = <T>(
  options: RealTimeDataOptions<T> & { throttleMs?: number }
) => {
  const { throttleMs = 1000, ...realTimeOptions } = options;
  const [throttledData, setThrottledData] = useState<T | undefined>(null);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const realTimeQuery = useRealTimeData<T>(realTimeOptions);

  useEffect(() => {
    if (realTimeQuery.data !== undefined) {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }

      throttleTimeoutRef.current = setTimeout(() => {
        setThrottledData(realTimeQuery.data);
      }, throttleMs);
    }

    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [realTimeQuery.data, throttleMs]);

  return {
    ...realTimeQuery,
    data: throttledData,
  };
};

export default {
  useRealTimeData,
  useRealTimeStats,
  useRealTimeEvaluations,
  useRealTimeAnalytics,
  useRealTimeAggregator,
  useRealTimeDiff,
  useThrottledRealTimeData,
};