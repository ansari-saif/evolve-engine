import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { performanceMetrics } from '../utils/performance';

interface CacheStrategy {
  // Prefetch related data when user views a specific item
  prefetchRelated: boolean;
  // Keep frequently accessed data in memory longer
  keepFrequent: boolean;
  // Preload next page of data
  preloadNextPage: boolean;
  // Cache user preferences and settings
  cachePreferences: boolean;
}

export const useAdvancedCaching = (strategy: CacheStrategy = {
  prefetchRelated: true,
  keepFrequent: true,
  preloadNextPage: true,
  cachePreferences: true,
}) => {
  const { userId } = useAppContext();
  const queryClient = useQueryClient();
  const accessCountRef = useRef<Map<string, number>>(new Map());
  const lastAccessRef = useRef<Map<string, number>>(new Map());

  // Track data access patterns
  const trackAccess = useCallback((queryKey: string[]) => {
    const key = queryKey.join(':');
    const currentCount = accessCountRef.current.get(key) || 0;
    accessCountRef.current.set(key, currentCount + 1);
    lastAccessRef.current.set(key, Date.now());
  }, []);

  // Prefetch related data when viewing a task
  const prefetchRelatedData = useCallback(async (taskId: number) => {
    if (!strategy.prefetchRelated || !userId) return;

    const startTime = performance.now();

    try {
      // Prefetch task details
      await queryClient.prefetchQuery({
        queryKey: ['tasks', taskId],
        queryFn: async () => {
          const response = await fetch(`/api/v1/tasks/${taskId}`);
          return response.json();
        },
        staleTime: 5 * 60 * 1000,
      });

      // Prefetch related goals
      await queryClient.prefetchQuery({
        queryKey: ['goals', 'user', userId],
        queryFn: async () => {
          const response = await fetch(`/api/v1/goals/user/${userId}`);
          return response.json();
        },
        staleTime: 10 * 60 * 1000,
      });

      performanceMetrics.apiCall('prefetch-related-data', startTime);
      console.log('✅ Prefetched related data for task', taskId);
    } catch (error) {
      console.warn('⚠️ Failed to prefetch related data:', error);
    }
  }, [strategy.prefetchRelated, userId, queryClient]);

  // Preload next page of data
  const preloadNextPage = useCallback(async (currentPage: number, pageSize: number = 10) => {
    if (!strategy.preloadNextPage || !userId) return;

    const startTime = performance.now();

    try {
      await queryClient.prefetchQuery({
        queryKey: ['tasks', 'user', userId, 'page', currentPage + 1],
        queryFn: async () => {
          const response = await fetch(
            `/api/v1/tasks/user/${userId}?page=${currentPage + 1}&size=${pageSize}`
          );
          return response.json();
        },
        staleTime: 2 * 60 * 1000,
      });

      performanceMetrics.apiCall('preload-next-page', startTime);
      console.log('✅ Preloaded next page', currentPage + 1);
    } catch (error) {
      console.warn('⚠️ Failed to preload next page:', error);
    }
  }, [strategy.preloadNextPage, userId, queryClient]);

  // Cache user preferences
  const cacheUserPreferences = useCallback(async () => {
    if (!strategy.cachePreferences || !userId) return;

    const startTime = performance.now();

    try {
      await queryClient.prefetchQuery({
        queryKey: ['user', userId, 'preferences'],
        queryFn: async () => {
          const response = await fetch(`/api/v1/users/${userId}/preferences`);
          return response.json();
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
      });

      performanceMetrics.apiCall('cache-user-preferences', startTime);
      console.log('✅ Cached user preferences');
    } catch (error) {
      console.warn('⚠️ Failed to cache user preferences:', error);
    }
  }, [strategy.cachePreferences, userId, queryClient]);

  // Intelligent cache cleanup based on access patterns
  const cleanupCache = useCallback(() => {
    if (!strategy.keepFrequent) return;

    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Remove rarely accessed data older than 1 hour
    for (const [key, lastAccess] of lastAccessRef.current.entries()) {
      const accessCount = accessCountRef.current.get(key) || 0;
      
      if (lastAccess < oneHourAgo && accessCount < 3) {
        // Remove from cache
        const queryKey = key.split(':');
        queryClient.removeQueries({ queryKey });
        accessCountRef.current.delete(key);
        lastAccessRef.current.delete(key);
      }
    }

    // Remove very old data regardless of access count
    for (const [key, lastAccess] of lastAccessRef.current.entries()) {
      if (lastAccess < oneDayAgo) {
        const queryKey = key.split(':');
        queryClient.removeQueries({ queryKey });
        accessCountRef.current.delete(key);
        lastAccessRef.current.delete(key);
      }
    }

    console.log('🧹 Cleaned up cache based on access patterns');
  }, [strategy.keepFrequent, queryClient]);

  // Set up periodic cache cleanup
  useEffect(() => {
    if (!strategy.keepFrequent) return;

    const cleanupInterval = setInterval(cleanupCache, 30 * 60 * 1000); // Every 30 minutes

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [strategy.keepFrequent, cleanupCache]);

  // Initialize caching on mount
  useEffect(() => {
    if (userId) {
      cacheUserPreferences();
    }
  }, [userId, cacheUserPreferences]);

  return {
    trackAccess,
    prefetchRelatedData,
    preloadNextPage,
    cacheUserPreferences,
    cleanupCache,
    accessCounts: accessCountRef.current,
    lastAccess: lastAccessRef.current,
  };
};
