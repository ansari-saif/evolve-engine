import { performanceMetrics } from './performance';

// Performance monitoring integration
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    // Observe long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              this.recordMetric('long-tasks', entry.duration);
              console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        console.warn('Long task observation not supported');
      }

      // Observe navigation timing
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('navigation-timing', navEntry.loadEventEnd - navEntry.loadEventStart);
            this.recordMetric('dom-content-loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
            this.recordMetric('first-byte', navEntry.responseStart - navEntry.requestStart);
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        console.warn('Navigation timing observation not supported');
      }

      // Observe resource timing
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.duration > 1000) {
              this.recordMetric('slow-resources', resourceEntry.duration);
              console.warn(`Slow resource: ${resourceEntry.name} took ${resourceEntry.duration.toFixed(2)}ms`);
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource timing observation not supported');
      }
    }
  }

  // Record a performance metric
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  // Get average metric value
  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // Get metric statistics
  getMetricStats(name: string) {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sorted = values.sort((a, b) => a - b);
    return {
      count: values.length,
      average: this.getAverageMetric(name),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
    };
  }

  // Track Core Web Vitals
  trackWebVitals() {
    if ('web-vitals' in window) {
      // This would integrate with the web-vitals library
      console.log('Web Vitals tracking available');
    } else {
      // Fallback to basic metrics
      this.trackBasicMetrics();
    }
  }

  private trackBasicMetrics() {
    // Track LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('lcp', entry.startTime);
            console.log(`LCP: ${entry.startTime.toFixed(2)}ms`);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observation not supported');
      }

      // Track FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('fid', entry.processingStart - entry.startTime);
            console.log(`FID: ${(entry.processingStart - entry.startTime).toFixed(2)}ms`);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observation not supported');
      }

      // Track CLS (Cumulative Layout Shift)
      try {
                 const clsObserver = new PerformanceObserver((list) => {
           let clsValue = 0;
           for (const entry of list.getEntries()) {
             const layoutShiftEntry = entry as { hadRecentInput: boolean; value: number };
             if (!layoutShiftEntry.hadRecentInput) {
               clsValue += layoutShiftEntry.value;
             }
           }
           this.recordMetric('cls', clsValue);
           console.log(`CLS: ${clsValue.toFixed(4)}`);
         });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }
  }

  // Track custom application metrics
  trackApplicationMetric(name: string, value: number) {
    this.recordMetric(`app-${name}`, value);
  }

  // Track user interactions
  trackUserInteraction(action: string, duration: number) {
    this.recordMetric(`interaction-${action}`, duration);
  }

  // Track API calls
  trackApiCall(endpoint: string, duration: number) {
    this.recordMetric(`api-${endpoint}`, duration);
  }

  // Generate performance report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {} as Record<string, unknown>,
      summary: {
        totalMetrics: this.metrics.size,
        totalObservations: Array.from(this.metrics.values()).reduce((sum, values) => sum + values.length, 0),
      },
    };

    for (const [name, values] of this.metrics.entries()) {
      report.metrics[name] = this.getMetricStats(name);
    }

    return report;
  }

  // Send performance data to analytics
  sendToAnalytics(data: unknown) {
    // This would integrate with your analytics service
    console.log('Performance data:', data);
    
    // Example: Send to Google Analytics
    if ('gtag' in window) {
      (window as { gtag: (event: string, action: string, data: unknown) => void }).gtag('event', 'performance_metrics', {
        event_category: 'performance',
        event_label: 'app_performance',
        value: data,
      });
    }
  }

  // Cleanup observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
