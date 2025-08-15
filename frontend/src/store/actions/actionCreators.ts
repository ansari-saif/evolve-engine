import { createAction } from '@reduxjs/toolkit';
import type { TaskUpdate, GoalUpdate, TaskCreate, GoalCreate } from '../../client/models';
import type { TaskFilter } from '../../types/app';

// Action creator for task updates with complex payload
export const updateTaskWithMetadata = createAction<{
  taskId: number;
  updates: TaskUpdate;
  metadata: {
    updatedBy: string;
    timestamp: string;
    reason?: string;
    previousState?: Partial<TaskUpdate>;
  };
}>('tasks/updateWithMetadata');

// Action creator for goal updates with complex payload
export const updateGoalWithMetadata = createAction<{
  goalId: number;
  updates: GoalUpdate;
  metadata: {
    updatedBy: string;
    timestamp: string;
    reason?: string;
    previousState?: Partial<GoalUpdate>;
  };
}>('goals/updateWithMetadata');

// Action creator for form submissions with validation
export const submitFormWithValidation = createAction<{
  formId: string;
  data: Record<string, unknown>;
  validation: {
    isValid: boolean;
    errors: Record<string, string>;
    warnings: Record<string, string>;
  };
  metadata: {
    submittedBy: string;
    timestamp: string;
    formType: string;
  };
}>('forms/submitWithValidation');

// Action creator for navigation changes with history
export const navigateWithHistory = createAction<{
  route: string;
  history: {
    previousRoute: string;
    navigationType: 'push' | 'replace' | 'back';
    timestamp: string;
  };
  metadata: {
    triggeredBy: string;
    context?: string;
  };
}>('navigation/navigateWithHistory');

// Action creator for bulk task operations
export const bulkTaskOperation = createAction<{
  operation: 'create' | 'update' | 'delete' | 'complete';
  tasks: Array<{
    id?: number;
    data?: TaskCreate | TaskUpdate;
    metadata?: {
      reason?: string;
      priority?: string;
    };
  }>;
  metadata: {
    initiatedBy: string;
    timestamp: string;
    batchId: string;
  };
}>('tasks/bulkOperation');

// Action creator for bulk goal operations
export const bulkGoalOperation = createAction<{
  operation: 'create' | 'update' | 'delete';
  goals: Array<{
    id?: number;
    data?: GoalCreate | GoalUpdate;
    metadata?: {
      reason?: string;
      priority?: string;
    };
  }>;
  metadata: {
    initiatedBy: string;
    timestamp: string;
    batchId: string;
  };
}>('goals/bulkOperation');

// Action creator for filter updates with persistence
export const updateFiltersWithPersistence = createAction<{
  filterType: 'task' | 'goal';
  filters: TaskFilter | Record<string, string>;
  persistence: {
    saveToStorage: boolean;
    storageKey: string;
    expiration?: string;
  };
  metadata: {
    updatedBy: string;
    timestamp: string;
    reason?: string;
  };
}>('filters/updateWithPersistence');

// Action creator for UI state changes with analytics
export const updateUIStateWithAnalytics = createAction<{
  component: string;
  action: string;
  state: Record<string, unknown>;
  analytics: {
    eventName: string;
    properties: Record<string, unknown>;
    userId: string;
  };
  metadata: {
    timestamp: string;
    sessionId?: string;
  };
}>('ui/updateWithAnalytics');

// Action creator for error handling with context
export const handleErrorWithContext = createAction<{
  error: Error | string;
  context: {
    component: string;
    action: string;
    state: Record<string, unknown>;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: {
    userId: string;
    timestamp: string;
    sessionId?: string;
    userAgent?: string;
  };
}>('errors/handleWithContext');

// Action creator for performance monitoring
export const trackPerformance = createAction<{
  metric: string;
  value: number;
  unit: string;
  context: {
    component: string;
    action: string;
    phase: 'start' | 'end' | 'error';
  };
  metadata: {
    userId: string;
    timestamp: string;
    sessionId?: string;
  };
}>('performance/track');
