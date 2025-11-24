import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { performanceMonitor } from '@/utils/performance/monitor';

// Hook for debouncing expensive operations
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Hook for throttling operations
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
};

// Hook for lazy loading components with performance monitoring
export const useLazyLoad = <T>(
  loader: () => Promise<{ default: T }>,
  options: {
    rootMargin?: string;
    threshold?: number;
    preloadDelay?: number;
  } = {}
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLElement>();

  const { rootMargin = '100px', threshold = 0.1, preloadDelay = 200 } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadComponent();
          }
        });
      },
      { rootMargin, threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const loadComponent = useCallback(async () => {
    if (loading || Component) return;

    setLoading(true);
    const startTime = performance.now();

    try {
      performanceMonitor.recordMetric('lazy-load-start', 0, 'custom');

      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, preloadDelay));

      const module = await loader();
      setComponent(module.default);

      const duration = performance.now() - startTime;
      performanceMonitor.recordMetric('lazy-load-complete', duration, 'custom');
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loader, loading, Component, preloadDelay]);

  return { Component, loading, error, elementRef };
};

// Hook for virtualizing long lists
export const useVirtualization = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { start: startIndex, end: endIndex };
  }, [items.length, itemHeight, containerHeight, scrollTop, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  const getItemStyle = useCallback((index: number) => {
    return {
      position: 'absolute' as const,
      top: visibleRange.start * itemHeight + (index - visibleRange.start) * itemHeight,
      left: 0,
      right: 0,
      height: itemHeight,
    };
  }, [itemHeight, visibleRange.start]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    getItemStyle,
    handleScroll,
    startIndex: visibleRange.start,
  };
};

// Hook for memory optimization with cleanup
export const useMemoryOptimization = () => {
  const cacheRef = useRef(new Map());
  const maxSizeRef = useRef(100);

  const get = useCallback(<T>(key: string): T | undefined => {
    return cacheRef.current.get(key);
  }, []);

  const set = useCallback(<T>(key: string, value: T) => {
    const cache = cacheRef.current;

    // Implement LRU eviction
    if (cache.size >= maxSizeRef.current) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, value);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Clear cache on unmount
  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  return { get, set, clear };
};

// Hook for optimizing image loading
export const useOptimizedImage = (src: string, options: {
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
} = {}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { placeholder = '', threshold = 0.1, rootMargin = '100px' } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
          }
        });
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const loadImage = useCallback(() => {
    if (!src) return;

    const img = new Image();
    const startTime = performance.now();

    img.onload = () => {
      setImageSrc(src);
      setLoading(false);

      const duration = performance.now() - startTime;
      performanceMonitor.recordMetric('image-load', duration, 'custom', { src });
    };

    img.onerror = () => {
      setError(new Error(`Failed to load image: ${src}`));
      setLoading(false);
    };

    img.src = src;
  }, [src]);

  return { imageSrc, loading, error, imgRef };
};

// Hook for bundle size monitoring
export const useBundleSizeMonitor = () => {
  const [bundleInfo, setBundleInfo] = useState<{
    totalSize: number;
    chunkSizes: Record<string, number>;
    loadedChunks: string[];
  }>({
    totalSize: 0,
    chunkSizes: {},
    loadedChunks: [],
  });

  useEffect(() => {
    const updateBundleInfo = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

        let totalSize = 0;
        const chunkSizes: Record<string, number> = {};
        const loadedChunks: string[] = [];

        entries.forEach((entry) => {
          if (entry.name.includes('.js') || entry.name.includes('.css')) {
            const size = entry.transferSize || 0;
            totalSize += size;

            const chunkName = entry.name.split('/').pop() || '';
            chunkSizes[chunkName] = size;
            loadedChunks.push(chunkName);
          }
        });

        setBundleInfo({ totalSize, chunkSizes, loadedChunks });

        // Monitor large bundles
        const largeBundles = Object.entries(chunkSizes)
          .filter(([_, size]) => size > 50000) // 50KB threshold
          .map(([name, size]) => ({ name, size }));

        if (largeBundles.length > 0) {
          performanceMonitor.recordMetric(
            'large-bundles-detected',
            largeBundles.length,
            'custom',
            { bundles: largeBundles }
          );
        }
      }
    };

    // Initial load
    updateBundleInfo();

    // Monitor new chunks
    const observer = new PerformanceObserver((list) => {
      updateBundleInfo();
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      // PerformanceObserver might not be available
      console.warn('Performance observer not available:', error);
    }

    return () => observer.disconnect();
  }, []);

  return bundleInfo;
};

// Hook for network performance monitoring
export const useNetworkPerformance = () => {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false,
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });

        performanceMonitor.recordMetric(
          'network-connection-type',
          0,
          'custom',
          { type: connection.effectiveType }
        );
      }
    };

    updateNetworkInfo();

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkInfo);

      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  const isSlowNetwork = useMemo(() => {
    return networkInfo.effectiveType === 'slow-2g' ||
           networkInfo.effectiveType === '2g' ||
           networkInfo.saveData;
  }, [networkInfo]);

  return { networkInfo, isSlowNetwork };
};

// Hook for preloading critical resources
export const usePreloadResources = (resources: string[]) => {
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadResource = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;

      // Determine resource type
      if (url.includes('.css')) {
        link.as = 'style';
      } else if (url.includes('.js')) {
        link.as = 'script';
      } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url)) {
        link.as = 'image';
      } else if (/\.(woff|woff2|ttf|eot)$/i.test(url)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }

      link.onload = () => {
        setPreloadedResources(prev => new Set([...prev, url]));
      };

      document.head.appendChild(link);
    };

    // Preload on idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        resources.forEach(preloadResource);
      });
    } else {
      // Fallback
      setTimeout(() => {
        resources.forEach(preloadResource);
      }, 2000);
    }
  }, [resources]);

  return { preloadedResources };
};

// Combined performance optimization hook
export const usePerformanceOptimization = () => {
  const memoryOptimization = useMemoryOptimization();
  const bundleMonitor = useBundleSizeMonitor();
  const networkPerformance = useNetworkPerformance();

  return {
    ...memoryOptimization,
    bundleInfo: bundleMonitor,
    networkInfo: networkPerformance,
    isSlowNetwork: networkPerformance.isSlowNetwork,
  };
};

export default usePerformanceOptimization;