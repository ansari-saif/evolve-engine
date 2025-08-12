import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppConfig } from './redux/useAppConfig';
import { performanceMetrics } from '../utils/performance';

interface PreloadConfig {
  enabled: boolean;
  idleDelay: number; // milliseconds to wait before considering user idle
  preloadTasks: boolean;
  preloadGoals: boolean;
}

export const useAiPreloading = (config: PreloadConfig = {
  enabled: true,
  idleDelay: 30000, // 30 seconds
  preloadTasks: true,
  preloadGoals: false,
}) => {
  const { userId } = useAppConfig();
  const queryClient = useQueryClient();
  const idleTimeoutRef = useRef<NodeJS.Timeout>();
  const isPreloadingRef = useRef(false);

  // Preload tomorrow's tasks
  const preloadTomorrowTasks = useCallback(async () => {
    if (!userId || isPreloadingRef.current) return;

    const startTime = performance.now();
    isPreloadingRef.current = true;

    try {
      // Prefetch tomorrow's tasks query
      await queryClient.prefetchQuery({
        queryKey: ['tasks', 'user', userId, 'tomorrow'],
        queryFn: async () => {
          // This would call the actual API endpoint for tomorrow's tasks
          // For now, we'll just prefetch the existing today's tasks as a placeholder
          const response = await fetch(`/api/v1/tasks/user/${userId}/today`);
          return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      performanceMetrics.apiCall('preload-tomorrow-tasks', startTime);
      console.log('✅ Preloaded tomorrow\'s tasks');
    } catch (error) {
      console.warn('⚠️ Failed to preload tomorrow\'s tasks:', error);
    } finally {
      isPreloadingRef.current = false;
    }
  }, [userId, queryClient]);

  // Preload user goals
  const preloadGoals = useCallback(async () => {
    if (!userId || isPreloadingRef.current) return;

    const startTime = performance.now();
    isPreloadingRef.current = true;

    try {
      // Prefetch goals query
      await queryClient.prefetchQuery({
        queryKey: ['goals', 'user', userId],
        queryFn: async () => {
          const response = await fetch(`/api/v1/goals/user/${userId}`);
          return response.json();
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
      });

      performanceMetrics.apiCall('preload-goals', startTime);
      console.log('✅ Preloaded user goals');
    } catch (error) {
      console.warn('⚠️ Failed to preload goals:', error);
    } finally {
      isPreloadingRef.current = false;
    }
  }, [userId, queryClient]);

  // Handle user activity
  const handleUserActivity = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    // Set up idle timeout
    idleTimeoutRef.current = setTimeout(() => {
      if (config.enabled && !isPreloadingRef.current) {
        console.log('🔄 User idle, starting preloading...');
        
        if (config.preloadTasks) {
          preloadTomorrowTasks();
        }
        
        if (config.preloadGoals) {
          preloadGoals();
        }
      }
    }, config.idleDelay);
  }, [config, preloadTomorrowTasks, preloadGoals]);

  // Set up activity listeners
  useEffect(() => {
    if (!config.enabled) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Initial setup
    handleUserActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [config.enabled, handleUserActivity]);

  // Preload on component mount if user is already idle
  useEffect(() => {
    if (config.enabled && userId) {
      const checkAndPreload = () => {
        if (config.preloadTasks) {
          preloadTomorrowTasks();
        }
        if (config.preloadGoals) {
          preloadGoals();
        }
      };

      // Small delay to avoid blocking initial render
      const timer = setTimeout(checkAndPreload, 1000);
      return () => clearTimeout(timer);
    }
  }, [config.enabled, userId, config.preloadTasks, config.preloadGoals, preloadTomorrowTasks, preloadGoals]);

  return {
    preloadTomorrowTasks,
    preloadGoals,
    isPreloading: isPreloadingRef.current,
  };
};
