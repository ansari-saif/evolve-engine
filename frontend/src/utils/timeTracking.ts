import type { TaskResponse, TaskUpdate, CompletionStatusEnum } from '../client/models';

export interface TimeTrackingState {
  taskId: number;
  isActive: boolean;
  startTime: number; // Unix timestamp when timer started
  accumulatedTime: number; // Total time in minutes (including previous sessions)
}

export interface TimeTrackingData {
  timeSpentMinutes: number;
  startedAt: string | null;
  isTrackingActive: boolean;
}

/**
 * Maps time tracking data to existing Task model fields
 */
export const mapTimeTrackingToTaskFields = (timeData: TimeTrackingData): Partial<TaskUpdate> => {
  return {
    actual_duration: timeData.timeSpentMinutes,
    started_at: timeData.startedAt,
    completion_status: timeData.isTrackingActive ? 'In Progress' : 'Pending'
  };
};

/**
 * Extracts time tracking data from existing Task model fields
 */
export const extractTimeTrackingFromTask = (task: TaskResponse): TimeTrackingData => {
  return {
    timeSpentMinutes: task.actual_duration || 0,
    startedAt: task.started_at,
    isTrackingActive: task.completion_status === 'In Progress'
  };
};

/**
 * Calculate elapsed time in minutes from start time to now
 */
export const calculateElapsedMinutes = (startTime: number): number => {
  const now = Date.now();
  const elapsedMs = now - startTime;
  return Math.floor(elapsedMs / (1000 * 60)); // Convert to minutes
};

/**
 * Calculate elapsed time in seconds from start time to now
 */
export const calculateElapsedSeconds = (startTime: number): number => {
  const now = Date.now();
  const elapsedMs = now - startTime;
  return elapsedMs / 1000; // Convert to seconds
};

/**
 * Calculate total time spent including accumulated time (in minutes)
 */
export const calculateTotalTimeSpent = (accumulatedTime: number, startTime: number): number => {
  if (!startTime) return accumulatedTime;
  return accumulatedTime + calculateElapsedMinutes(startTime);
};

/**
 * Calculate total time spent including accumulated time (in seconds)
 */
export const calculateTotalTimeSpentInSeconds = (accumulatedTimeInMinutes: number, startTime: number): number => {
  if (!startTime) return accumulatedTimeInMinutes * 60;
  return (accumulatedTimeInMinutes * 60) + calculateElapsedSeconds(startTime);
};

/**
 * Format time in HH:MM:SS format
 */
export const formatTimeDisplay = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = 0; // We're tracking in minutes, so seconds are always 0
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Validate time tracking data
 */
export const validateTimeTrackingData = (timeData: TimeTrackingData): boolean => {
  return (
    typeof timeData.timeSpentMinutes === 'number' &&
    timeData.timeSpentMinutes >= 0 &&
    (timeData.startedAt === null || typeof timeData.startedAt === 'string') &&
    typeof timeData.isTrackingActive === 'boolean'
  );
};

// localStorage persistence utilities
const STORAGE_KEY_PREFIX = 'evolve_time_tracking_';

/**
 * Save time tracking state to localStorage
 */
export const saveTimeTrackingState = (taskId: number, state: TimeTrackingState): void => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${taskId}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save time tracking state:', error);
  }
};

/**
 * Load time tracking state from localStorage
 */
export const loadTimeTrackingState = (taskId: number): TimeTrackingState | null => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${taskId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const state = JSON.parse(stored) as TimeTrackingState;
    
    // Validate the loaded state
    if (
      typeof state.taskId === 'number' &&
      typeof state.isActive === 'boolean' &&
      typeof state.startTime === 'number' &&
      typeof state.accumulatedTime === 'number'
    ) {
      return state;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load time tracking state:', error);
    return null;
  }
};

/**
 * Remove time tracking state from localStorage
 */
export const removeTimeTrackingState = (taskId: number): void => {
  try {
    const key = `${STORAGE_KEY_PREFIX}${taskId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove time tracking state:', error);
  }
};

/**
 * Get all active time tracking states
 */
export const getAllTimeTrackingStates = (): TimeTrackingState[] => {
  const states: TimeTrackingState[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const taskId = parseInt(key.replace(STORAGE_KEY_PREFIX, ''), 10);
        const state = loadTimeTrackingState(taskId);
        if (state && state.isActive) {
          states.push(state);
        }
      }
    }
  } catch (error) {
    console.error('Failed to get all time tracking states:', error);
  }
  
  return states;
};

/**
 * Clear all time tracking states (useful for cleanup)
 */
export const clearAllTimeTrackingStates = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear all time tracking states:', error);
  }
};
