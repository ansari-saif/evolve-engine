import type { TaskResponse, TaskUpdate } from '../client/models';
import type { TimeTrackingData, TimeTrackingState } from '../utils/timeTracking';
import { TasksService } from '../client/services';
import { timeTrackingService } from './timeTrackingService';

// Queue for offline operations
interface PendingOperation {
  id: string;
  taskId: number;
  type: 'update' | 'sync';
  data: TimeTrackingData;
  timestamp: number;
  retryCount: number;
}

export class TimeTrackingPersistenceService {
  private static instance: TimeTrackingPersistenceService;
  private pendingOperations: PendingOperation[] = [];
  private syncQueue: Set<number> = new Set();
  private isOnline: boolean = navigator.onLine;
  private syncInterval: number | null = null;

  private constructor() {
    this.initializeFromStorage();
    this.setupNetworkListeners();
    this.startSyncInterval();
  }

  public static getInstance(): TimeTrackingPersistenceService {
    if (!TimeTrackingPersistenceService.instance) {
      TimeTrackingPersistenceService.instance = new TimeTrackingPersistenceService();
    }
    return TimeTrackingPersistenceService.instance;
  }

  /**
   * Initialize service by loading pending operations from localStorage
   */
  private initializeFromStorage(): void {
    try {
      const stored = localStorage.getItem('evolve_pending_operations');
      if (stored) {
        this.pendingOperations = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load pending operations:', error);
      this.pendingOperations = [];
    }
  }

  /**
   * Save pending operations to localStorage
   */
  private savePendingOperations(): void {
    try {
      localStorage.setItem('evolve_pending_operations', JSON.stringify(this.pendingOperations));
    } catch (error) {
      console.error('Failed to save pending operations:', error);
    }
  }

  /**
   * Setup network status listeners
   */
  private setupNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processPendingOperations();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  /**
   * Start periodic sync interval
   */
  private startSyncInterval(): void {
    if (typeof window !== 'undefined') {
      this.syncInterval = window.setInterval(() => {
        if (this.isOnline && this.syncQueue.size > 0) {
          this.syncActiveTimers();
        }
      }, 30000); // Sync every 30 seconds
    }
  }

  /**
   * Stop sync interval
   */
  private stopSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Persist time tracking data to server
   */
  public async persistTimeTracking(taskId: number, timeData: TimeTrackingData): Promise<boolean> {
    try {
      if (!this.isOnline) {
        // Queue for later if offline
        this.queueOperation(taskId, timeData);
        return true;
      }

      // Convert to TaskUpdate format
      const taskUpdate: TaskUpdate = {
        actual_duration: timeData.timeSpentMinutes,
        started_at: timeData.startedAt,
        completion_status: timeData.isTrackingActive ? 'In Progress' : 'Pending'
      };

      // Update task on server
      await TasksService.updateTaskTasksTaskIdPut({
        taskId,
        requestBody: taskUpdate
      });

      return true;
    } catch (error) {
      console.error('Failed to persist time tracking:', error);
      // Queue for retry
      this.queueOperation(taskId, timeData);
      return false;
    }
  }

  /**
   * Queue operation for later processing
   */
  private queueOperation(taskId: number, timeData: TimeTrackingData): void {
    const operation: PendingOperation = {
      id: `${taskId}-${Date.now()}-${Math.random()}`,
      taskId,
      type: 'update',
      data: timeData,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.pendingOperations.push(operation);
    this.savePendingOperations();
  }

  /**
   * Process pending operations when back online
   */
  private async processPendingOperations(): Promise<void> {
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operations) {
      try {
        if (operation.retryCount >= 3) {
          console.warn('Max retries reached for operation:', operation.id);
          continue;
        }

        const success = await this.persistTimeTracking(operation.taskId, operation.data);
        if (!success) {
          operation.retryCount++;
          this.pendingOperations.push(operation);
        }
      } catch (error) {
        console.error('Failed to process pending operation:', error);
        operation.retryCount++;
        this.pendingOperations.push(operation);
      }
    }

    this.savePendingOperations();
  }

  /**
   * Sync active timers with server
   */
  public async syncActiveTimers(): Promise<void> {
    const activeStates = timeTrackingService.getAllActiveStates();
    
    for (const state of activeStates) {
      if (this.syncQueue.has(state.taskId)) {
        continue; // Already queued for sync
      }

      this.syncQueue.add(state.taskId);
      
      try {
        const timeData: TimeTrackingData = {
          timeSpentMinutes: timeTrackingService.getCurrentTimeSpent(state.taskId),
          startedAt: new Date(state.startTime).toISOString(),
          isTrackingActive: state.isActive
        };

        await this.persistTimeTracking(state.taskId, timeData);
        this.syncQueue.delete(state.taskId);
      } catch (error) {
        console.error('Failed to sync timer for task:', state.taskId, error);
        this.syncQueue.delete(state.taskId);
      }
    }
  }

  /**
   * Load time tracking data from server
   */
  public async loadTimeTrackingData(taskId: number): Promise<TimeTrackingData | null> {
    try {
      const task = await TasksService.readTaskTasksTaskIdGet({ taskId });
      
      return {
        timeSpentMinutes: task.actual_duration || 0,
        startedAt: task.started_at,
        isTrackingActive: task.completion_status === 'In Progress'
      };
    } catch (error) {
      console.error('Failed to load time tracking data:', error);
      return null;
    }
  }

  /**
   * Resolve conflicts between local and server data
   */
  public async resolveConflict(taskId: number, localData: TimeTrackingData, serverData: TimeTrackingData): Promise<TimeTrackingData> {
    // Simple conflict resolution: use the higher time value
    const resolvedData: TimeTrackingData = {
      timeSpentMinutes: Math.max(localData.timeSpentMinutes, serverData.timeSpentMinutes),
      startedAt: localData.startedAt || serverData.startedAt,
      isTrackingActive: localData.isTrackingActive || serverData.isTrackingActive
    };

    // Persist resolved data
    await this.persistTimeTracking(taskId, resolvedData);
    
    return resolvedData;
  }

  /**
   * Get pending operations count
   */
  public getPendingOperationsCount(): number {
    return this.pendingOperations.length;
  }

  /**
   * Get sync queue size
   */
  public getSyncQueueSize(): number {
    return this.syncQueue.size;
  }

  /**
   * Check if service is online
   */
  public isOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Clean up service
   */
  public cleanup(): void {
    this.stopSyncInterval();
    this.pendingOperations = [];
    this.syncQueue.clear();
    this.savePendingOperations();
  }
}

// Export singleton instance
export const timeTrackingPersistence = TimeTrackingPersistenceService.getInstance();
