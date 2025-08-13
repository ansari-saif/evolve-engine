import { useState, useEffect } from 'react';

export interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  renderTime: number;
  networkRequests: number;
}

export const usePerformanceMonitoring = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    networkRequests: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) return;

    // Simulate performance monitoring
    const interval = setInterval(() => {
      setPerformanceMetrics({
        loadTime: Math.random() * 1000 + 200,
        memoryUsage: Math.random() * 50 + 20,
        renderTime: Math.random() * 16 + 8,
        networkRequests: Math.floor(Math.random() * 10) + 2
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const resetMetrics = () => {
    setPerformanceMetrics({
      loadTime: 0,
      memoryUsage: 0,
      renderTime: 0,
      networkRequests: 0
    });
  };

  const getPerformanceStatus = (): 'excellent' | 'good' | 'warning' | 'critical' => {
    const { loadTime, memoryUsage, renderTime } = performanceMetrics;
    
    if (loadTime < 300 && memoryUsage < 30 && renderTime < 12) return 'excellent';
    if (loadTime < 500 && memoryUsage < 50 && renderTime < 16) return 'good';
    if (loadTime < 1000 && memoryUsage < 80 && renderTime < 20) return 'warning';
    return 'critical';
  };

  return {
    performanceMetrics,
    isMonitoring,
    toggleMonitoring,
    resetMetrics,
    getPerformanceStatus,
  };
};
