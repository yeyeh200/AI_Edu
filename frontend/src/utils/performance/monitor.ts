// Performance monitoring utilities
import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  // Core Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte

  // Custom metrics
  routeChangeTime?: number;
  componentRenderTime?: number;
  apiResponseTime?: number;
  memoryUsage?: number;
  bundleSize?: number;

  // User experience metrics
  firstRenderTime?: number;
  interactiveTime?: number;
  errorCount?: number;
  retryCount?: number;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  type: 'navigation' | 'render' | 'api' | 'user-interaction' | 'custom';
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private entries: PerformanceEntry[] = [];
  private observers: PerformanceObserver[] = [];
  private config = {
    enableDetailedLogging: process.env.NODE_ENV === 'development',
    maxEntries: 1000,
    reportInterval: 30000, // 30 seconds
    apiEndpoint: '/api/performance/metrics',
  };

  constructor() {
    this.initializeObservers();
    this.startPeriodicReporting();
  }

  // Initialize performance observers
  private initializeObservers() {
    try {
      // Observe navigation timing
      if ('PerformanceObserver' in window) {
        const navObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);

        // Observe paint timing
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.FCP = entry.startTime;
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);

        // Observe largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.LCP = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // Observe first input delay
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.metrics.FID = (entry as any).processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Observe cumulative layout shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              this.metrics.CLS = clsValue;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      }

      // Monitor memory usage if available
      if ('memory' in performance) {
        setInterval(() => {
          const memory = (performance as any).memory;
          this.metrics.memoryUsage = memory.usedJSHeapSize;
        }, 5000);
      }

      // Monitor route changes
      this.monitorRouteChanges();

    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
    }
  }

  // Record navigation timing metrics
  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    this.metrics.TTFB = entry.responseStart - entry.requestStart;
    this.metrics.firstRenderTime = entry.loadEventEnd - entry.navigationStart;
    this.metrics.interactiveTime = entry.domContentLoadedEventEnd - entry.navigationStart;
  }

  // Monitor route changes using React Router or similar
  private monitorRouteChanges() {
    // This would be integrated with your routing library
    // For now, we'll monitor history changes
    let lastRouteChange = Date.now();

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      const now = Date.now();
      const routeChangeTime = now - lastRouteChange;
      lastRouteChange = now;

      // Record route change metric
      if (window.performanceMonitor) {
        window.performanceMonitor.recordMetric('route-change', routeChangeTime, 'custom', {
          from: location.pathname,
          to: args[2] as string,
        });
      }

      return originalPushState.apply(history, args);
    };
  }

  // Record custom performance metrics
  recordMetric(name: string, duration: number, type: PerformanceEntry['type'] = 'custom', metadata?: Record<string, any>) {
    const entry: PerformanceEntry = {
      name,
      startTime: Date.now() - duration,
      duration,
      type,
      metadata,
    };

    this.entries.push(entry);

    // Keep entries under limit
    if (this.entries.length > this.config.maxEntries) {
      this.entries = this.entries.slice(-this.config.maxEntries);
    }

    // Update specific metrics
    switch (name) {
      case 'api-response':
        this.metrics.apiResponseTime = duration;
        break;
      case 'component-render':
        this.metrics.componentRenderTime = Math.max(this.metrics.componentRenderTime || 0, duration);
        break;
    }

    if (this.config.enableDetailedLogging) {
      console.debug(`[Performance] ${name}: ${duration}ms`, metadata);
    }
  }

  // Measure API response time
  async measureApiCall<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      this.recordMetric(`api-${name}`, duration, 'api', { success: true });
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric(`api-${name}`, duration, 'api', { success: false, error: String(error) });
      throw error;
    }
  }

  // Measure component render time
  measureComponentRender(componentName: string, renderFn: () => void) {
    const startTime = performance.now();
    renderFn();
    const duration = performance.now() - startTime;
    this.recordMetric(`component-${componentName}`, duration, 'render');
  }

  // Get current performance metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get performance entries
  getEntries(type?: PerformanceEntry['type']): PerformanceEntry[] {
    if (type) {
      return this.entries.filter(entry => entry.type === type);
    }
    return [...this.entries];
  }

  // Analyze performance and provide insights
  analyzePerformance() {
    const insights: string[] = [];

    // Core Web Vitals analysis
    if (this.metrics.LCP && this.metrics.LCP > 2500) {
      insights.push(`Largest Contentful Paint (${this.metrics.LCP.toFixed(0)}ms) is slower than recommended (2500ms)`);
    }

    if (this.metrics.FID && this.metrics.FID > 100) {
      insights.push(`First Input Delay (${this.metrics.FID.toFixed(0)}ms) is higher than recommended (100ms)`);
    }

    if (this.metrics.CLS && this.metrics.CLS > 0.1) {
      insights.push(`Cumulative Layout Shift (${this.metrics.CLS.toFixed(3)}) is higher than recommended (0.1)`);
    }

    if (this.metrics.TTFB && this.metrics.TTFB > 600) {
      insights.push(`Time to First Byte (${this.metrics.TTFB.toFixed(0)}ms) is slower than recommended (600ms)`);
    }

    // Custom metrics analysis
    const apiEntries = this.getEntries('api');
    const avgApiResponseTime = apiEntries.reduce((sum, entry) => sum + entry.duration, 0) / apiEntries.length;
    if (avgApiResponseTime > 1000) {
      insights.push(`Average API response time (${avgApiResponseTime.toFixed(0)}ms) is high`);
    }

    // Memory analysis
    if (this.metrics.memoryUsage && this.metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      insights.push(`Memory usage (${(this.metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB) is high`);
    }

    return insights;
  }

  // Generate performance report
  generateReport() {
    const metrics = this.getMetrics();
    const insights = this.analyzePerformance();

    return {
      timestamp: new Date().toISOString(),
      metrics,
      insights,
      summary: {
        status: insights.length === 0 ? 'good' : insights.length <= 2 ? 'fair' : 'poor',
        score: Math.max(0, 100 - insights.length * 10),
      },
      recommendations: this.generateRecommendations(insights),
    };
  }

  // Generate performance recommendations
  private generateRecommendations(insights: string[]): string[] {
    const recommendations: string[] = [];

    insights.forEach(insight => {
      if (insight.includes('LCP')) {
        recommendations.push('Optimize images and lazy load content to improve LCP');
      }
      if (insight.includes('FID')) {
        recommendations.push('Minimize JavaScript execution time to improve FID');
      }
      if (insight.includes('CLS')) {
        recommendations.push('Specify dimensions for images and embeds to reduce CLS');
      }
      if (insight.includes('API response time')) {
        recommendations.push('Implement API caching and optimize server response times');
      }
      if (insight.includes('Memory usage')) {
        recommendations.push('Check for memory leaks and optimize component cleanup');
      }
    });

    return recommendations;
  }

  // Send metrics to server
  private async reportMetrics() {
    try {
      const report = this.generateReport();

      if (report.summary.status !== 'good') {
        await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        });
      }
    } catch (error) {
      console.warn('Failed to report performance metrics:', error);
    }
  }

  // Start periodic reporting
  private startPeriodicReporting() {
    setInterval(() => {
      this.reportMetrics();
    }, this.config.reportInterval);
  }

  // Cleanup observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create global instance
declare global {
  interface Window {
    performanceMonitor: PerformanceMonitor;
  }
}

export const performanceMonitor = new PerformanceMonitor();
window.performanceMonitor = performanceMonitor;

// React Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [componentName]);

  const recordRender = useCallback((renderFn: () => void) => {
    performanceMonitor.measureComponentRender(componentName, renderFn);
  }, [componentName]);

  return {
    metrics,
    recordRender,
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    measureApiCall: performanceMonitor.measureApiCall.bind(performanceMonitor),
  };
};

export default performanceMonitor;