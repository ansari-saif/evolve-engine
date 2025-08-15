// Import the actual types from the generated client
import type {
  TaskResponse,
  TaskCreate,
  TaskUpdate,
  GoalResponse,
  GoalCreate,
  GoalUpdate,
  ProgressLogResponse,
  ProgressLogCreate,
  ProgressLogUpdate,
  DayLogResponse,
  DayLogCreate,
  DayLogUpdate,
  JobMetricsResponse,
  JobMetricsCreate,
  JobMetricsUpdate,
  DailyTasksRequest,
  MotivationRequest,
  DeadlineReminderRequest,
  WeeklyAnalysisRequest,
  PhaseTransitionRequest,
  GoalsAnalysisRequest,
  CareerTransitionRequest,
} from '../client/models';

// Re-export the types for convenience
export type {
  TaskResponse,
  TaskCreate,
  TaskUpdate,
  GoalResponse,
  GoalCreate,
  GoalUpdate,
  ProgressLogResponse,
  ProgressLogCreate,
  ProgressLogUpdate,
  DayLogResponse,
  DayLogCreate,
  DayLogUpdate,
  JobMetricsResponse,
  JobMetricsCreate,
  JobMetricsUpdate,
  DailyTasksRequest,
  MotivationRequest,
  DeadlineReminderRequest,
  WeeklyAnalysisRequest,
  PhaseTransitionRequest,
  GoalsAnalysisRequest,
  CareerTransitionRequest,
};

// Error Types
export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export interface ErrorResponse {
  message: string;
  status: number;
  details?: unknown;
}
