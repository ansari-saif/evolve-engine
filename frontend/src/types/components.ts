import type { TaskResponse, GoalResponse } from '../client/models';
import type { TaskFilter } from './app';

/**
 * TaskCard component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface TaskCardProps {
  task: TaskResponse;
  onComplete?: (taskId: number) => void;
  onEdit?: (task: TaskResponse) => void;
  onDelete?: (taskId: number) => void;
  isLoading?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * TaskForm component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface TaskFormProps {
  initialData?: Partial<TaskResponse>;
  goals?: GoalResponse[];
  onSubmit: (data: Partial<TaskResponse>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  validation?: {
    errors: Record<string, string>;
    warnings: Record<string, string>;
  };
  className?: string;
}

/**
 * TaskFilter component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface TaskFilterProps {
  filters: TaskFilter;
  onFiltersChange: (filters: TaskFilter) => void;
  goals?: GoalResponse[];
  onSearchChange?: (searchTerm: string) => void;
  showSearch?: boolean;
  showAdvanced?: boolean;
  className?: string;
}

/**
 * TaskList component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface TaskListProps {
  tasks: TaskResponse[];
  isLoading?: boolean;
  onTaskComplete?: (taskId: number) => void;
  onTaskEdit?: (task: TaskResponse) => void;
  onTaskDelete?: (taskId: number) => void;
  loadingTaskId?: number | null;
  emptyState?: React.ReactNode;
  className?: string;
}

/**
 * TaskTabs component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface TaskTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  taskGroups: Record<string, TaskResponse[]>;
  children: (tasks: TaskResponse[]) => React.ReactNode;
  className?: string;
}

/**
 * TaskActions component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface TaskActionsProps {
  onCreateTask?: () => void;
  onGenerateTasks?: () => void;
  onCreateBulk?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * GoalCard component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface GoalCardProps {
  goal: GoalResponse;
  onEdit?: (goal: GoalResponse) => void;
  onDelete?: (goalId: number) => void;
  onAdvancePhase?: (goalId: number) => void;
  isLoading?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * GoalForm component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface GoalFormProps {
  initialData?: Partial<GoalResponse>;
  onSubmit: (data: Partial<GoalResponse>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  validation?: {
    errors: Record<string, string>;
    warnings: Record<string, string>;
  };
  className?: string;
}

/**
 * Dialog component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Modal component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Toast component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duration?: number;
  className?: string;
}

/**
 * Loading component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface LoadingProps {
  isLoading: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'dots';
  className?: string;
}

/**
 * Error component props interface
 * Follows Interface Segregation Principle by being focused and specific
 */
export interface ErrorProps {
  error: Error | string;
  onRetry?: () => void;
  showDetails?: boolean;
  variant?: 'inline' | 'page' | 'toast';
  className?: string;
}
