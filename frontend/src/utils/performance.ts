// Performance monitoring utilities
export const performanceMetrics = {
  // Track component render times
  componentRender: (componentName: string, startTime: number) => {
    const renderTime = performance.now() - startTime;
    if (renderTime > 16) { // Longer than one frame at 60fps
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  },

  // Track API call performance
  apiCall: (endpoint: string, startTime: number) => {
    const duration = performance.now() - startTime;
    if (duration > 1000) { // Longer than 1 second
      console.warn(`Slow API call detected for ${endpoint}: ${duration.toFixed(2)}ms`);
    }
  },

  // Track user interactions
  userInteraction: (action: string, startTime: number) => {
    const duration = performance.now() - startTime;
    if (duration > 100) { // Longer than 100ms
      console.warn(`Slow interaction detected for ${action}: ${duration.toFixed(2)}ms`);
    }
  },

  // Track bundle size (if available)
  getBundleSize: () => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
        return {
          transferSize: navEntry.transferSize,
          decodedBodySize: navEntry.decodedBodySize,
          domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
          loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
        };
      }
    }
    return null;
  },

  // Track memory usage (if available)
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  },

  // Track Core Web Vitals
  trackWebVitals: () => {
    if ('web-vitals' in window) {
      // This would be implemented with the web-vitals library
      console.log('Web Vitals tracking available');
    }
  },

  // Debounce function for performance
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for performance
  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// Performance observer for long tasks
export const observeLongTasks = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`, entry);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Long task observation not supported');
    }
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  observeLongTasks();
  performanceMetrics.trackWebVitals();
  
  // Log initial performance metrics
  const bundleSize = performanceMetrics.getBundleSize();
  const memoryUsage = performanceMetrics.getMemoryUsage();
  
  if (bundleSize) {
    console.log('Bundle size metrics:', bundleSize);
  }
  
  if (memoryUsage) {
    console.log('Memory usage:', memoryUsage);
  }
};
