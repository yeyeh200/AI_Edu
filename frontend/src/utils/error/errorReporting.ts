// Advanced error reporting and analytics system

import { ErrorInfo, LogLevel } from './errorHandler';
import { logger } from './logger';
import apiClient from '../api/apiClient';

export interface ErrorReport {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  component?: string;
  action?: string;
  additionalData?: any;
  context: ErrorContext;
  environment: string;
  version: string;
  buildTime?: string;
}

export interface ErrorContext {
  browser: {
    name: string;
    version: string;
    os: string;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    screen: {
      width: number;
      height: number;
      colorDepth: number;
    };
    memory?: number;
    connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
    };
  };
  performance: {
    loadTime?: number;
    domContentLoaded?: number;
    memoryUsage?: {
      used: number;
      total: number;
      limit: number;
    };
  };
  session: {
    duration: number;
    pageViews: number;
    errorsCount: number;
    lastActivity: string;
  };
}

export interface ErrorAggregation {
  total: number;
  byLevel: Record<LogLevel, number>;
  byComponent: Record<string, number>;
  byAction: Record<string, number>;
  uniqueUsers: number;
  affectedSessions: number;
  timeRange: {
    start: string;
    end: string;
  };
}

class ErrorReporting {
  private static instance: ErrorReporting;
  private sessionStartTime: number;
  private pageViews: number = 0;
  private errorsInSession: number = 0;
  private lastActivityTime: number;
  private isReporting = false;
  private reportQueue: ErrorReport[] = [];
  private maxReportQueueSize = 50;

  private constructor() {
    this.sessionStartTime = Date.now();
    this.lastActivityTime = Date.now();
    this.initializeContext();
    this.setupActivityTracking();
  }

  static getInstance(): ErrorReporting {
    if (!ErrorReporting.instance) {
      ErrorReporting.instance = new ErrorReporting();
    }
    return ErrorReporting.instance;
  }

  private initializeContext() {
    // Track page views
    this.trackPageView();

    // Track session start
    logger.info('Error reporting session started', {
      sessionId: this.getSessionId(),
      startTime: new Date(this.sessionStartTime).toISOString(),
    });
  }

  private setupActivityTracking() {
    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const updateActivity = () => {
      this.lastActivityTime = Date.now();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushReports();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.flushReports(true);
    });
  }

  private getSessionId(): string {
    return logger.getStats().sessionId || 'unknown';
  }

  private trackPageView() {
    this.pageViews++;
    this.lastActivityTime = Date.now();
  }

  // Create error report
  createErrorReport(errorInfo: ErrorInfo): ErrorReport {
    this.errorsInSession++;

    return {
      id: this.generateReportId(),
      timestamp: errorInfo.timestamp,
      level: this.determineLogLevel(errorInfo),
      message: errorInfo.message,
      stack: errorInfo.stack,
      userAgent: errorInfo.userAgent,
      url: errorInfo.url,
      userId: errorInfo.userId,
      sessionId: errorInfo.sessionId,
      component: errorInfo.component,
      action: errorInfo.action,
      additionalData: errorInfo.additionalData,
      context: this.getErrorContext(),
      environment: process.env.NODE_ENV || 'unknown',
      version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0',
      buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : undefined,
    };
  }

  private determineLogLevel(errorInfo: ErrorInfo): LogLevel {
    const message = errorInfo.message.toLowerCase();

    if (message.includes('critical') || message.includes('fatal')) {
      return LogLevel.FATAL;
    }
    if (message.includes('error') || message.includes('exception')) {
      return LogLevel.ERROR;
    }
    if (message.includes('warning') || message.includes('deprecated')) {
      return LogLevel.WARN;
    }

    return LogLevel.ERROR; // Default to ERROR for safety
  }

  private getErrorContext(): ErrorContext {
    return {
      browser: this.getBrowserInfo(),
      device: this.getDeviceInfo(),
      performance: this.getPerformanceInfo(),
      session: this.getSessionInfo(),
    };
  }

  private getBrowserInfo() {
    const ua = navigator.userAgent;
    const browserData = this.parseUserAgent(ua);

    return {
      name: browserData.name,
      version: browserData.version,
      os: browserData.os,
    };
  }

  private getDeviceInfo() {
    const connection = (navigator as any).connection;
    const memory = (performance as any).memory;

    return {
      type: this.getDeviceType(),
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
      },
      memory: memory?.usedJSHeapSize,
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      } : undefined,
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.screen.width;
    const maxMobileWidth = 768;
    const maxTabletWidth = 1024;

    if (width <= maxMobileWidth) return 'mobile';
    if (width <= maxTabletWidth) return 'tablet';
    return 'desktop';
  }

  private getPerformanceInfo() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const memory = (performance as any).memory;

    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : undefined,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.navigationStart : undefined,
      memoryUsage: memory ? {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      } : undefined,
    };
  }

  private getSessionInfo() {
    const now = Date.now();
    const sessionDuration = now - this.sessionStartTime;
    const timeSinceLastActivity = now - this.lastActivityTime;

    return {
      duration: sessionDuration,
      pageViews: this.pageViews,
      errorsCount: this.errorsInSession,
      lastActivity: new Date(this.lastActivityTime).toISOString(),
      timeSinceLastActivity,
    };
  }

  private parseUserAgent(ua: string) {
    // Simple user agent parsing (in production, use a proper library like ua-parser-js)
    let name = 'Unknown';
    let version = 'Unknown';
    let os = 'Unknown';

    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      name = 'Chrome';
      const match = ua.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Firefox')) {
      name = 'Firefox';
      const match = ua.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      name = 'Safari';
      const match = ua.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Edg')) {
      name = 'Edge';
      const match = ua.match(/Edg\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    }

    // OS detection
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';

    return { name, version, os };
  }

  private generateReportId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Report error
  async reportError(errorInfo: ErrorInfo): Promise<void> {
    if (this.isReporting) {
      return;
    }

    const report = this.createErrorReport(errorInfo);

    // Add to queue
    this.reportQueue.push(report);

    // Prevent queue from growing too large
    if (this.reportQueue.length > this.maxReportQueueSize) {
      this.reportQueue = this.reportQueue.slice(-this.maxReportQueueSize);
    }

    // Log locally
    logger.error('Error reported', { reportId: report.id, message: report.message });

    // Try to send immediately for critical errors
    if (report.level >= LogLevel.ERROR) {
      await this.flushReports();
    }
  }

  // Flush reports to server
  async flushReports(isSync = false): Promise<void> {
    if (this.isReporting || this.reportQueue.length === 0) {
      return;
    }

    this.isReporting = true;
    const reports = [...this.reportQueue];
    this.reportQueue = [];

    try {
      await this.sendReports(reports, isSync);
      logger.debug(`Successfully sent ${reports.length} error reports`);
    } catch (error) {
      logger.warn('Failed to send error reports', { error, reportCount: reports.length });
      // Re-add to queue for retry
      this.reportQueue.unshift(...reports);
    } finally {
      this.isReporting = false;
    }
  }

  private async sendReports(reports: ErrorReport[], isSync = false): Promise<void> {
    if (isSync && 'sendBeacon' in navigator) {
      // Use sendBeacon for sync requests
      const success = navigator.sendBeacon(
        '/api/errors/reports',
        JSON.stringify({ reports })
      );
      if (!success) {
        throw new Error('sendBeacon failed');
      }
      return;
    }

    await apiClient.post('/errors/reports', { reports }, {
      timeout: isSync ? 1000 : 10000,
      skipErrorHandler: true,
    });
  }

  // Get error analytics
  async getErrorAnalytics(timeRange?: { start: string; end: string }): Promise<ErrorAggregation> {
    try {
      const response = await apiClient.get('/errors/analytics', {
        params: timeRange,
        skipErrorHandler: true,
      });
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch error analytics', { error });
      return this.getEmptyAggregation();
    }
  }

  private getEmptyAggregation(): ErrorAggregation {
    return {
      total: 0,
      byLevel: {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 0,
        [LogLevel.WARN]: 0,
        [LogLevel.ERROR]: 0,
        [LogLevel.FATAL]: 0,
      },
      byComponent: {},
      byAction: {},
      uniqueUsers: 0,
      affectedSessions: 0,
      timeRange: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
    };
  }

  // Performance error tracking
  trackPerformanceError(metric: string, value: number, threshold: number) {
    if (value > threshold) {
      this.reportError({
        message: `Performance threshold exceeded: ${metric}`,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getSessionId(),
        component: 'performance',
        action: 'threshold-exceeded',
        additionalData: {
          metric,
          value,
          threshold,
          exceededBy: value - threshold,
        },
      });
    }
  }

  // Memory leak detection
  trackMemoryUsage() {
    const memory = (performance as any).memory;
    if (!memory) return;

    const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

    if (usageRatio > 0.8) { // 80% threshold
      this.reportError({
        message: 'High memory usage detected',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getSessionId(),
        component: 'memory',
        action: 'high-usage',
        additionalData: {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          usageRatio: Math.round(usageRatio * 100),
        },
      });
    }
  }

  // Get reporting statistics
  getStats() {
    return {
      sessionStartTime: new Date(this.sessionStartTime).toISOString(),
      pageViews: this.pageViews,
      errorsInSession: this.errorsInSession,
      queueSize: this.reportQueue.length,
      lastActivityTime: new Date(this.lastActivityTime).toISOString(),
      timeSinceLastActivity: Date.now() - this.lastActivityTime,
    };
  }

  // Clear queues
  clearQueues() {
    this.reportQueue = [];
  }
}

// Create singleton instance
const errorReporting = ErrorReporting.getInstance();

// Export convenience functions
export const reportError = errorReporting.reportError.bind(errorReporting);
export const flushErrorReports = errorReporting.flushReports.bind(errorReporting);
export const getErrorAnalytics = errorReporting.getErrorAnalytics.bind(errorReporting);
export const trackPerformanceError = errorReporting.trackPerformanceError.bind(errorReporting);
export const trackMemoryUsage = errorReporting.trackMemoryUsage.bind(errorReporting);

export default errorReporting;