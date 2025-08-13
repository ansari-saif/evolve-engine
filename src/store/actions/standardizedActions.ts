import { createAction } from '@reduxjs/toolkit';
import type { TaskUpdate, GoalUpdate, TaskCreate, GoalCreate } from '../../client/models';
import type { TaskFilter } from '../../types/app';

// Type definitions for action payloads
interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface DialogData {
  [key: string]: unknown;
}

interface FormData {
  [key: string]: unknown;
}

interface OptimisticUpdateData {
  [key: string]: unknown;
}

// UI Domain Actions
export const uiToastAdd = createAction<{ toast: Toast }>('ui/toast/add');
export const uiToastUpdate = createAction<{ id: string; updates: Partial<Toast> }>('ui/toast/update');
export const uiToastDismiss = createAction<string>('ui/toast/dismiss');
export const uiToastRemove = createAction<string>('ui/toast/remove');
export const uiToastClearAll = createAction('ui/toast/clearAll');

export const uiLoadingSet = createAction<{ key: string; isLoading: boolean }>('ui/loading/set');
export const uiLoadingClear = createAction<string>('ui/loading/clear');
export const uiLoadingClearAll = createAction('ui/loading/clearAll');

export const uiModalOpen = createAction<string>('ui/modal/open');
export const uiModalClose = createAction<string>('ui/modal/close');
export const uiModalToggle = createAction<string>('ui/modal/toggle');
export const uiModalCloseAll = createAction('ui/modal/closeAll');

export const uiSidebarOpen = createAction('ui/sidebar/open');
export const uiSidebarClose = createAction('ui/sidebar/close');
export const uiSidebarToggle = createAction('ui/sidebar/toggle');
export const uiSidebarSetTab = createAction<string>('ui/sidebar/setTab');

// Task Domain Actions
export const taskCreate = createAction<TaskCreate>('task/create');
export const taskUpdate = createAction<{ id: number; updates: TaskUpdate }>('task/update');
export const taskDelete = createAction<number>('task/delete');
export const taskComplete = createAction<number>('task/complete');
export const taskStart = createAction<number>('task/start');
export const taskPause = createAction<number>('task/pause');

export const taskBulkCreate = createAction<TaskCreate[]>('task/bulkCreate');
export const taskBulkUpdate = createAction<{ tasks: Array<{ id: number; updates: TaskUpdate }> }>('task/bulkUpdate');
export const taskBulkDelete = createAction<number[]>('task/bulkDelete');
export const taskBulkComplete = createAction<number[]>('task/bulkComplete');

// Goal Domain Actions
export const goalCreate = createAction<GoalCreate>('goal/create');
export const goalUpdate = createAction<{ id: number; updates: GoalUpdate }>('goal/update');
export const goalDelete = createAction<number>('goal/delete');

export const goalBulkCreate = createAction<GoalCreate[]>('goal/bulkCreate');
export const goalBulkUpdate = createAction<{ goals: Array<{ id: number; updates: GoalUpdate }> }>('goal/bulkUpdate');
export const goalBulkDelete = createAction<number[]>('goal/bulkDelete');

// Form Domain Actions
export const formSetValues = createAction<{ formId: string; values: FormData }>('form/setValues');
export const formSetErrors = createAction<{ formId: string; errors: Record<string, string> }>('form/setErrors');
export const formClear = createAction<string>('form/clear');
export const formSubmit = createAction<{ formId: string; data: FormData }>('form/submit');

// Navigation Domain Actions
export const navigationSetRoute = createAction<string>('navigation/setRoute');
export const navigationSetPreviousRoute = createAction<string>('navigation/setPreviousRoute');
export const navigationPush = createAction<string>('navigation/push');
export const navigationReplace = createAction<string>('navigation/replace');
export const navigationBack = createAction('navigation/back');

// Dialog Domain Actions
export const dialogOpen = createAction<{ dialogId: string; data?: DialogData }>('dialog/open');
export const dialogClose = createAction<string>('dialog/close');
export const dialogSetData = createAction<{ dialogId: string; data: DialogData }>('dialog/setData');

// App Config Domain Actions
export const appConfigSetUserId = createAction<string>('appConfig/setUserId');
export const appConfigSetApiBaseUrl = createAction<string>('appConfig/setApiBaseUrl');
export const appConfigSetWebSocketUrl = createAction<string>('appConfig/setWebSocketUrl');
export const appConfigUpdate = createAction<Record<string, unknown>>('appConfig/update');

// Filter Domain Actions
export const filterSetTaskFilters = createAction<TaskFilter>('filter/setTaskFilters');
export const filterSetGoalFilters = createAction<Record<string, unknown>>('filter/setGoalFilters');
export const filterClear = createAction<string>('filter/clear');
export const filterReset = createAction<string>('filter/reset');

// Optimistic Updates Domain Actions
export const optimisticUpdateAdd = createAction<{ operationId: string; data: OptimisticUpdateData }>('optimisticUpdate/add');
export const optimisticUpdateRemove = createAction<string>('optimisticUpdate/remove');
export const optimisticUpdateClear = createAction('optimisticUpdate/clear');

// Action Type Definitions for TypeScript
export type UIActionTypes = 
  | ReturnType<typeof uiToastAdd>
  | ReturnType<typeof uiToastUpdate>
  | ReturnType<typeof uiToastDismiss>
  | ReturnType<typeof uiToastRemove>
  | ReturnType<typeof uiToastClearAll>
  | ReturnType<typeof uiLoadingSet>
  | ReturnType<typeof uiLoadingClear>
  | ReturnType<typeof uiLoadingClearAll>
  | ReturnType<typeof uiModalOpen>
  | ReturnType<typeof uiModalClose>
  | ReturnType<typeof uiModalToggle>
  | ReturnType<typeof uiModalCloseAll>
  | ReturnType<typeof uiSidebarOpen>
  | ReturnType<typeof uiSidebarClose>
  | ReturnType<typeof uiSidebarToggle>
  | ReturnType<typeof uiSidebarSetTab>;

export type TaskActionTypes =
  | ReturnType<typeof taskCreate>
  | ReturnType<typeof taskUpdate>
  | ReturnType<typeof taskDelete>
  | ReturnType<typeof taskComplete>
  | ReturnType<typeof taskStart>
  | ReturnType<typeof taskPause>
  | ReturnType<typeof taskBulkCreate>
  | ReturnType<typeof taskBulkUpdate>
  | ReturnType<typeof taskBulkDelete>
  | ReturnType<typeof taskBulkComplete>;

export type GoalActionTypes =
  | ReturnType<typeof goalCreate>
  | ReturnType<typeof goalUpdate>
  | ReturnType<typeof goalDelete>
  | ReturnType<typeof goalBulkCreate>
  | ReturnType<typeof goalBulkUpdate>
  | ReturnType<typeof goalBulkDelete>;

export type FormActionTypes =
  | ReturnType<typeof formSetValues>
  | ReturnType<typeof formSetErrors>
  | ReturnType<typeof formClear>
  | ReturnType<typeof formSubmit>;

export type NavigationActionTypes =
  | ReturnType<typeof navigationSetRoute>
  | ReturnType<typeof navigationSetPreviousRoute>
  | ReturnType<typeof navigationPush>
  | ReturnType<typeof navigationReplace>
  | ReturnType<typeof navigationBack>;

export type DialogActionTypes =
  | ReturnType<typeof dialogOpen>
  | ReturnType<typeof dialogClose>
  | ReturnType<typeof dialogSetData>;

export type AppConfigActionTypes =
  | ReturnType<typeof appConfigSetUserId>
  | ReturnType<typeof appConfigSetApiBaseUrl>
  | ReturnType<typeof appConfigSetWebSocketUrl>
  | ReturnType<typeof appConfigUpdate>;

export type FilterActionTypes =
  | ReturnType<typeof filterSetTaskFilters>
  | ReturnType<typeof filterSetGoalFilters>
  | ReturnType<typeof filterClear>
  | ReturnType<typeof filterReset>;

export type OptimisticUpdateActionTypes =
  | ReturnType<typeof optimisticUpdateAdd>
  | ReturnType<typeof optimisticUpdateRemove>
  | ReturnType<typeof optimisticUpdateClear>;

// Combined action types
export type AppActionTypes =
  | UIActionTypes
  | TaskActionTypes
  | GoalActionTypes
  | FormActionTypes
  | NavigationActionTypes
  | DialogActionTypes
  | AppConfigActionTypes
  | FilterActionTypes
  | OptimisticUpdateActionTypes;
