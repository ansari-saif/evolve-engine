import type { TaskResponse, TaskUpdate } from '../client/models';
import type { TimeTrackingState, TimeTrackingData } from '../utils/timeTracking';
import {
  mapTimeTrackingToTaskFields,
  extractTimeTrackingFromTask,
  calculateElapsedMinutes,
  calculateTotalTimeSpent,
  calculateTotalTimeSpentInSeconds,
  saveTimeTrackingState,
  loadTimeTrackingState,
  removeTimeTrackingState,
  validateTimeTrackingData
} from '../utils/timeTracking';
import { timeTrackingPersistence } from './timeTrackingPersistence';

// Event types for the Observer pattern
export interface TimeTrackingEvent {
  type: 'start' | 'stop' | 'pause' | 'resume' | 'update';
  taskId: number;
  data?: TimeTrackingData | TimeTrackingState;
}

export type TimeTrackingEventListener = (event: TimeTrackingEvent) => void;

export class TimeTrackingService {
  private static instance: TimeTrackingService;
  private activeTimers: Map<number, TimeTrackingState> = new Map();
  private listeners: TimeTrackingEventListener[] = [];
  private updateInterval: number | null = null;
  private lastUpdateTime: number = performance.now();
  private isPageVisible: boolean = true;

  private constructor() {
    this.initializeFromStorage().catch(error => {
      console.error('Failed to initialize time tracking service:', error);
    });
    this.setupPageVisibilityListener();
    this.startUpdateInterval();
  }

  public static getInstance(): TimeTrackingService {
    if (!TimeTrackingService.instance) {
      TimeTrackingService.instance = new TimeTrackingService();
    }
    return TimeTrackingService.instance;
  }

  /**
   * Initialize service by loading active timers from localStorage
   */
  private async initializeFromStorage(): Promise<void> {
    try {
      // Load any existing active timers from localStorage
      const activeStates = this.getAllActiveStates();
      activeStates.forEach(state => {
        this.activeTimers.set(state.taskId, state);
      });

      // Sync with server data for active timers
      await this.syncWithServerData();
    } catch (error) {
      console.error('Failed to initialize time tracking service:', error);
    }
  }

  /**
   * Sync local data with server data for active timers
   */
  private async syncWithServerData(): Promise<void> {
    const activeStates = this.getAllActiveStates();
    
    for (const state of activeStates) {
      try {
        const serverData = await timeTrackingPersistence.loadTimeTrackingData(state.taskId);
        if (serverData) {
          // Resolve any conflicts
          const localData = {
            timeSpentMinutes: this.getCurrentTimeSpent(state.taskId),
            startedAt: new Date(state.startTime).toISOString(),
            isTrackingActive: state.isActive
          };

          const resolvedData = await timeTrackingPersistence.resolveConflict(
            state.taskId,
            localData,
            serverData
          );

          // Update local state with resolved data
          const updatedState: TimeTrackingState = {
            ...state,
            accumulatedTime: resolvedData.timeSpentMinutes,
            isActive: resolvedData.isTrackingActive
          };

          this.activeTimers.set(state.taskId, updatedState);
          saveTimeTrackingState(state.taskId, updatedState);
        }
      } catch (error) {
        console.error('Failed to sync with server data for task:', state.taskId, error);
      }
    }
  }

  /**
   * Setup Page Visibility API listener to handle tab switching
   */
  private setupPageVisibilityListener(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isPageVisible = !document.hidden;
        if (this.isPageVisible) {
          // Page became visible, update last update time
          this.lastUpdateTime = performance.now();
        }
      });
    }
  }

  /**
   * Start the update interval for accurate time tracking
   */
  private startUpdateInterval(): void {
    if (typeof window !== 'undefined') {
      this.updateInterval = window.setInterval(() => {
        if (this.isPageVisible && this.activeTimers.size > 0) {
          this.emitUpdateEvents();
        }
      }, 100); // Update every 100ms for smoother display
    }
  }

  /**
   * Stop the update interval
   */
  private stopUpdateInterval(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Emit update events for all active timers
   */
  private emitUpdateEvents(): void {
    this.activeTimers.forEach((state, taskId) => {
      if (state.isActive) {
        this.emitEvent({
          type: 'update',
          taskId,
          data: state
        });
      }
    });
  }

  /**
   * Emit an event to all listeners
   */
  private emitEvent(event: TimeTrackingEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in time tracking event listener:', error);
      }
    });
  }

  /**
   * Add an event listener for time tracking events
   */
  public addEventListener(listener: TimeTrackingEventListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove an event listener
   */
  public removeEventListener(listener: TimeTrackingEventListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Start time tracking for a task
   */
  public startTracking(taskId: number, task: TaskResponse, resetToZero: boolean = false): TimeTrackingState {
    // Stop any existing timer for this task
    this.stopTracking(taskId);

    // Stop any other active timers (single active task constraint)
    const otherActiveTimers = Array.from(this.activeTimers.entries())
      .filter(([id, state]) => id !== taskId && state.isActive);
    
    // Stop all other active timers
    otherActiveTimers.forEach(async ([otherTaskId, state]) => {
      await this.stopTracking(otherTaskId);
    });

    const now = performance.now();
    const existingData = extractTimeTrackingFromTask(task);
    
    const state: TimeTrackingState = {
      taskId,
      isActive: true,
      startTime: now,
      accumulatedTime: resetToZero ? 0 : existingData.timeSpentMinutes
    };

    this.activeTimers.set(taskId, state);
    saveTimeTrackingState(taskId, state);

    // Emit start event
    this.emitEvent({
      type: 'start',
      taskId,
      data: state
    });

    return state;
  }

  /**
   * Stop time tracking for a task
   */
  public async stopTracking(taskId: number): Promise<TimeTrackingData | null> {
    const state = this.activeTimers.get(taskId);
    if (!state || !state.isActive) {
      return null;
    }

    // Calculate total time spent
    const totalTimeSpent = calculateTotalTimeSpent(state.accumulatedTime, state.startTime);
    
    // Create time tracking data
    const timeData: TimeTrackingData = {
      timeSpentMinutes: totalTimeSpent,
      startedAt: new Date(state.startTime).toISOString(),
      isTrackingActive: false
    };

    // Validate the data
    if (!validateTimeTrackingData(timeData)) {
      console.error('Invalid time tracking data generated');
      return null;
    }

    // Remove from active timers
    this.activeTimers.delete(taskId);
    removeTimeTrackingState(taskId);

    // Persist to server
    await timeTrackingPersistence.persistTimeTracking(taskId, timeData);

    // Emit stop event
    this.emitEvent({
      type: 'stop',
      taskId,
      data: timeData
    });

    return timeData;
  }

  /**
   * Pause time tracking for a task (accumulates time but doesn't stop)
   */
  public async pauseTracking(taskId: number): Promise<TimeTrackingData | null> {
    const state = this.activeTimers.get(taskId);
    if (!state || !state.isActive) {
      return null;
    }

    // Calculate accumulated time including current session
    const totalTimeSpent = calculateTotalTimeSpent(state.accumulatedTime, state.startTime);
    
    // Update state to paused
    const updatedState: TimeTrackingState = {
      ...state,
      isActive: false,
      accumulatedTime: totalTimeSpent
    };

    this.activeTimers.set(taskId, updatedState);
    saveTimeTrackingState(taskId, updatedState);

    const timeData = {
      timeSpentMinutes: totalTimeSpent,
      startedAt: new Date(state.startTime).toISOString(),
      isTrackingActive: false
    };

    // Persist to server
    await timeTrackingPersistence.persistTimeTracking(taskId, timeData);

    // Emit pause event
    this.emitEvent({
      type: 'pause',
      taskId,
      data: timeData
    });

    return timeData;
  }

  /**
   * Resume time tracking for a task
   */
  public resumeTracking(taskId: number): TimeTrackingState | null {
    const state = this.activeTimers.get(taskId);
    if (!state) {
      return null;
    }

    const now = performance.now();
    const updatedState: TimeTrackingState = {
      ...state,
      isActive: true,
      startTime: now
    };

    this.activeTimers.set(taskId, updatedState);
    saveTimeTrackingState(taskId, updatedState);

    // Emit resume event
    this.emitEvent({
      type: 'resume',
      taskId,
      data: updatedState
    });

    return updatedState;
  }

  /**
   * Get current time tracking state for a task
   */
  public getTrackingState(taskId: number): TimeTrackingState | null {
    return this.activeTimers.get(taskId) || null;
  }

  /**
   * Get current time spent for a task (including active session) in minutes
   */
  public getCurrentTimeSpent(taskId: number): number {
    const state = this.activeTimers.get(taskId);
    if (!state) {
      return 0;
    }

    return calculateTotalTimeSpent(state.accumulatedTime, state.startTime);
  }

  /**
   * Get current time spent for a task (including active session) in seconds
   */
  public getCurrentTimeSpentInSeconds(taskId: number): number {
    const state = this.activeTimers.get(taskId);
    if (!state) {
      return 0;
    }

    return calculateTotalTimeSpentInSeconds(state.accumulatedTime, state.startTime);
  }

  /**
   * Get all active tracking states
   */
  public getAllActiveStates(): TimeTrackingState[] {
    return Array.from(this.activeTimers.values()).filter(state => state.isActive);
  }

  /**
   * Convert time tracking data to TaskUpdate for API calls
   */
  public toTaskUpdate(timeData: TimeTrackingData): Partial<TaskUpdate> {
    return mapTimeTrackingToTaskFields(timeData);
  }

  /**
   * Extract time tracking data from a task response
   */
  public fromTaskResponse(task: TaskResponse): TimeTrackingData {
    return extractTimeTrackingFromTask(task);
  }

  /**
   * Update time spent for a task (manual override)
   */
  public async updateTimeSpent(taskId: number, minutes: number): Promise<boolean> {
    const state = this.activeTimers.get(taskId);
    if (!state) {
      return false;
    }

    const updatedState: TimeTrackingState = {
      ...state,
      accumulatedTime: minutes
    };

    this.activeTimers.set(taskId, updatedState);
    saveTimeTrackingState(taskId, updatedState);

    // Persist to server
    await timeTrackingPersistence.persistTimeTracking(taskId, {
      timeSpentMinutes: minutes,
      startedAt: new Date(updatedState.startTime).toISOString(),
      isTrackingActive: updatedState.isActive
    });

    // Emit update event
    this.emitEvent({
      type: 'update',
      taskId,
      data: updatedState
    });

    return true;
  }

  /**
   * Check if a task is currently being tracked
   */
  public isTracking(taskId: number): boolean {
    const state = this.activeTimers.get(taskId);
    return state?.isActive || false;
  }

  /**
   * Check if any other task is currently being tracked
   */
  public isOtherTaskTracking(excludeTaskId: number): boolean {
    return Array.from(this.activeTimers.entries())
      .some(([taskId, state]) => taskId !== excludeTaskId && state.isActive);
  }

  /**
   * Get the ID of the currently active task (if any)
   */
  public getActiveTaskId(): number | null {
    const activeEntry = Array.from(this.activeTimers.entries())
      .find(([_, state]) => state.isActive);
    return activeEntry ? activeEntry[0] : null;
  }

  /**
   * Get formatted time display for a task
   */
  public getFormattedTime(taskId: number): string {
    const totalMinutes = this.getCurrentTimeSpent(taskId);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }

  /**
   * Clean up all timers (useful for logout or app shutdown)
   */
  public cleanup(): void {
    this.stopUpdateInterval();
    this.activeTimers.clear();
    this.listeners = [];
    // Note: localStorage cleanup is handled by the utility functions
  }
}

// Export singleton instance
export const timeTrackingService = TimeTrackingService.getInstance();
