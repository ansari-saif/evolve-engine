import { APP_CONFIG } from '@/config/app';

// Root State Type
export interface RootState {
  appConfig: AppConfigState;
  dialog: DialogState;
  ui: UIState;
  optimisticUpdates: OptimisticUpdatesState;
  form: FormState;
  navigation: NavigationState;
}

// App Config Slice Types
export interface AppConfigState {
  userId: string;
  config: typeof APP_CONFIG;
}

// Dialog Slice Types
export interface DialogState {
  currentState: DialogStateEnum;
  energyLevel: number;
  currentPhase: string | null;
  generatedTasks: GeneratedTask[];
  editedTasks: EditableGeneratedTask[];
  isGenerating: boolean;
  isCreating: boolean;
  isSuccess: boolean;
  generationError: string | null;
  creationError: string | null;
  formErrors: { energy?: string; phase?: string };
}

export enum DialogStateEnum {
  INITIAL = 'INITIAL',
  PREVIEW = 'PREVIEW',
  SUCCESS = 'SUCCESS'
}

export interface GeneratedTask {
  description: string;
  priority: string;
  energy_required: string;
  estimated_duration?: number;
  goal_id?: number;
}

export interface EditableGeneratedTask extends GeneratedTask {
  id: string;
  isEditing?: boolean;
}

// UI Slice Types
export interface UIState {
  toasts: ToastState[];
  loadingStates: Record<string, boolean>;
  modals: Record<string, boolean>;
  sidebar: {
    isOpen: boolean;
    activeTab: string;
  };
}

export interface ToastState {
  id: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  open: boolean;
  variant?: 'default' | 'destructive';
}

// Optimistic Updates Slice Types
export interface OptimisticUpdatesState {
  optimisticTasks: OptimisticTask[];
  pendingOperations: Record<string, PendingOperation>;
}

export interface OptimisticTask {
  task_id: number;
  description: string;
  priority: string;
  completion_status: string;
  energy_required: string;
  estimated_duration?: number;
  actual_duration: number | null;
  scheduled_for_date?: string;
  started_at: string | null;
  completed_at: string | null;
  goal_id?: number;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
  isOptimistic: boolean;
  originalData?: unknown;
  createdAt: number;
}

export interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'task' | 'goal' | 'diary';
  entityId: number;
  timestamp: number;
  data?: unknown;
}

// Form Slice Types
export interface FormState {
  forms: Record<string, FormData>;
  validationErrors: Record<string, Record<string, string>>;
  isSubmitting: Record<string, boolean>;
}

export interface FormData {
  values: Record<string, unknown>;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
}

// Navigation Slice Types
export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  navigationHistory: string[];
  breadcrumbs: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}

// Action Payload Types
export interface SetEnergyLevelPayload {
  energyLevel: number;
}

export interface SetCurrentPhasePayload {
  phase: string | null;
}

export interface SetGeneratedTasksPayload {
  tasks: GeneratedTask[];
}

export interface SetEditedTasksPayload {
  tasks: EditableGeneratedTask[];
}

export interface SetFormErrorsPayload {
  errors: { energy?: string; phase?: string };
}

export interface AddToastPayload {
  toast: Omit<ToastState, 'id'>;
}

export interface UpdateToastPayload {
  id: string;
  updates: Partial<ToastState>;
}

export interface AddOptimisticTaskPayload {
  task: OptimisticTask;
}

export interface ConfirmTaskPayload {
  taskId: number;
  confirmedTask: unknown;
}

export interface SetFormDataPayload {
  formId: string;
  data: Partial<FormData>;
}

export interface SetValidationErrorsPayload {
  formId: string;
  errors: Record<string, string>;
}

export interface NavigatePayload {
  route: string;
}

// Selector Return Types
export type AppConfigSelector = AppConfigState;
export type DialogSelector = DialogState;
export type UISelector = UIState;
export type OptimisticUpdatesSelector = OptimisticUpdatesState;
export type FormSelector = FormState;
export type NavigationSelector = NavigationState;

// Utility Types
export type LoadingStateKey = 'tasks' | 'goals' | 'diary' | 'statistics' | 'chat';
export type ModalKey = 'createTask' | 'createGoal' | 'settings' | 'profile';
