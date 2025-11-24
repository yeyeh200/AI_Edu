// Advanced logging service with structured logging and analytics

import errorHandler, { LogLevel, LogEntry } from './errorHandler';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  version?: string;
  environment?: string;
  buildTime?: string;
}

export interface AnalyticsEvent {
  eventName: string;
  category: string;
  action?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: string;
  userId?: string;
  sessionId: string;
  tags?: Record<string, string>;
}

class Logger {
  private static instance: Logger;
  private context: LogContext = {};
  private eventQueue: AnalyticsEvent[] = [];
  private metricsQueue: PerformanceMetric[] = [];
  private maxQueueSize = 100;

  private constructor() {
    this.initializeContext();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private initializeContext() {
    this.context = {
      sessionId: errorHandler.getStats().sessionId,
      version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString(),
    };
  }

  // Context management
  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context };
  }

  getContext(): LogContext {
    return { ...this.context };
  }

  clearContext() {
    this.context = {
      sessionId: errorHandler.getStats().sessionId,
      version: this.context.version,
      environment: this.context.environment,
      buildTime: this.context.buildTime,
    };
  }

  // Structured logging methods
  private logWithStructure(level: LogLevel, message: string, data?: any, context?: Partial<LogContext>) {
    const fullContext = { ...this.context, ...context };

    const enrichedData = {
      ...data,
      context: fullContext,
      performance: this.getPerformanceContext(),
    };

    errorHandler.log(level, message, enrichedData, fullContext.component);
  }

  debug(message: string, data?: any, context?: Partial<LogContext>) {
    this.logWithStructure(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: any, context?: Partial<LogContext>) {
    this.logWithStructure(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: any, context?: Partial<LogContext>) {
    this.logWithStructure(LogLevel.WARN, message, data, context);
  }

  error(message: string, data?: any, context?: Partial<LogContext>) {
    this.logWithStructure(LogLevel.ERROR, message, data, context);
  }

  fatal(message: string, data?: any, context?: Partial<LogContext>) {
    this.logWithStructure(LogLevel.FATAL, message, data, context);
  }

  // User interaction logging
  logUserInteraction(action: string, details?: any) {
    this.info(`User interaction: ${action}`, details, {
      category: 'user-interaction',
      action,
    });
  }

  // API call logging
  logApiCall(method: string, url: string, status: number, duration: number, details?: any) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API ${method} ${url} - ${status}`;

    this.logWithStructure(level, message, {
      method,
      url,
      status,
      duration,
      success: status < 400,
      ...details,
    }, {
      category: 'api-call',
      action: `${method} ${url}`,
    });
  }

  // Component lifecycle logging
  logComponentLifecycle(component: string, action: 'mount' | 'unmount' | 'update', details?: any) {
    this.debug(`Component ${action}: ${component}`, details, {
      category: 'component-lifecycle',
      action,
      component,
    });
  }

  // Feature usage tracking
  logFeatureUsage(feature: string, action: string, details?: any) {
    this.info(`Feature usage: ${feature} - ${action}`, details, {
      category: 'feature-usage',
      action,
    });

    // Also track as analytics event
    this.trackEvent('feature_usage', 'engagement', action, feature, undefined, details);
  }

  // Performance logging
  logPerformanceMetric(name: string, value: number, unit: PerformanceMetric['unit'] = 'ms', tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      userId: this.context.userId,
      sessionId: this.context.sessionId!,
      tags,
    };

    this.metricsQueue.push(metric);

    // Prevent queue from growing too large
    if (this.metricsQueue.length > this.maxQueueSize) {
      this.metricsQueue = this.metricsQueue.slice(-this.maxQueueSize);
    }

    // Also log as structured log
    this.info(`Performance metric: ${name} = ${value} ${unit}`, {
      name,
      value,
      unit,
      tags,
    }, {
      category: 'performance',
      action: 'metric-recorded',
    });
  }

  // Analytics event tracking
  trackEvent(eventName: string, category: string, action?: string, label?: string, value?: number, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      eventName,
      category,
      action,
      label,
      value,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.context.userId,
      sessionId: this.context.sessionId!,
    };

    this.eventQueue.push(event);

    // Prevent queue from growing too large
    if (this.eventQueue.length > this.maxQueueSize) {
      this.eventQueue = this.eventQueue.slice(-this.maxQueueSize);
    }

    // Also log as structured log
    this.debug(`Analytics event: ${eventName}`, {
      category,
      action,
      label,
      value,
      properties,
    }, {
      category: 'analytics',
      action: 'event-tracked',
    });
  }

  // Error logging with context
  logError(error: Error, context?: Partial<LogContext>) {
    errorHandler.handleError({
      message: error.message,
      stack: error.stack,
      component: context?.component,
      action: context?.action,
      additionalData: context,
    });
  }

  // Get performance context
  private getPerformanceContext() {
    if (typeof performance === 'undefined') return {};

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return {};

    return {
      // Navigation timing
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: this.getMetricFromEntry('paint', 'first-paint'),
      firstContentfulPaint: this.getMetricFromEntry('paint', 'first-contentful-paint'),

      // Memory usage (if available)
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      } : undefined,
    };
  }

  private getMetricFromEntry(type: string, name: string): number | undefined {
    const entries = performance.getEntriesByType(type);
    const entry = entries.find(e => e.name === name);
    return entry ? entry.startTime : undefined;
  }

  // Flush queues
  async flushAnalyticsEvents() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-add to queue for retry
      this.eventQueue.unshift(...events);
    }
  }

  async flushPerformanceMetrics() {
    if (this.metricsQueue.length === 0) return;

    const metrics = [...this.metricsQueue];
    this.metricsQueue = [];

    try {
      await fetch('/api/analytics/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      });
    } catch (error) {
      console.warn('Failed to send performance metrics:', error);
      // Re-add to queue for retry
      this.metricsQueue.unshift(...metrics);
    }
  }

  async flushAll() {
    await Promise.all([
      this.flushAnalyticsEvents(),
      this.flushPerformanceMetrics(),
    ]);
  }

  // Statistics and utilities
  getStats() {
    return {
      context: this.context,
      eventQueueSize: this.eventQueue.length,
      metricsQueueSize: this.metricsQueue.length,
    };
  }

  clearQueues() {
    this.eventQueue = [];
    this.metricsQueue = [];
  }
}

// Create and export singleton instance
const logger = Logger.getInstance();

// Export convenience functions
export const {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
  fatal: logFatal,
  logUserInteraction,
  logApiCall,
  logComponentLifecycle,
  logFeatureUsage,
  logPerformanceMetric,
  trackEvent,
  setLogContext,
  getLogContext,
  clearLogContext,
} = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
  logUserInteraction: logger.logUserInteraction.bind(logger),
  logApiCall: logger.logApiCall.bind(logger),
  logComponentLifecycle: logger.logComponentLifecycle.bind(logger),
  logFeatureUsage: logger.logFeatureUsage.bind(logger),
  logPerformanceMetric: logger.logPerformanceMetric.bind(logger),
  trackEvent: logger.trackEvent.bind(logger),
  setLogContext: logger.setContext.bind(logger),
  getLogContext: logger.getContext.bind(logger),
  clearLogContext: logger.clearContext.bind(logger),
};

// React Hook for logging
export const useLogger = (componentName: string) => {
  React.useEffect(() => {
    logger.setContext({ component: componentName });

    return () => {
      logger.logComponentLifecycle(componentName, 'unmount');
    };
  }, [componentName]);

  React.useEffect(() => {
    logger.logComponentLifecycle(componentName, 'mount');
  }, []);

  const logPerformance = React.useCallback((name: string, value: number, unit?: PerformanceMetric['unit']) => {
    logger.logPerformanceMetric(`${componentName}_${name}`, value, unit, { component: componentName });
  }, [componentName]);

  const logFeature = React.useCallback((feature: string, action: string, details?: any) => {
    logger.logFeatureUsage(feature, action, { component: componentName, ...details });
  }, [componentName]);

  return {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    fatal: logger.fatal.bind(logger),
    logPerformance,
    logFeature,
    logUserInteraction: logger.logUserInteraction.bind(logger),
    logApiCall: logger.logApiCall.bind(logger),
    trackEvent: logger.trackEvent.bind(logger),
    setContext: logger.setContext.bind(logger),
  };
};

export default logger;