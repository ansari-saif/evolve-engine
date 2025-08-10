// Export all hooks for easy importing
export { 
  useTasks,
  useGetTasks,
  useGetTask,
  useGetUserTasks,
  useGetUserPendingTasks,
  useGetUserTodayTasks,
  useCreateTask,
  useUpdateTask,
  useCompleteTask,
  useDeleteTask,
  useCreateBulkTasks,
} from './useTasks';

export { 
  useGoals,
  useGetGoals,
  useGetGoal,
  useGetUserGoals,
  useGetUserPendingGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
} from './useGoals';

export { 
  useProgressLogs,
  useGetProgressLogs,
  useGetProgressLog,
  useGetProgressLogsByDateRange,
  useGetUserProgressLogs,
  useGetUserRecentProgressLogs,
  useGetUserProgressStats,
  useCreateProgressLog,
  useUpdateProgressLog,
  useDeleteProgressLog,
  useGenerateProgressLog,
} from './useProgressLogs';

export { 
  useDayLogs,
  useGetDayLog,
  useGetUserDayLogs,
  useGetUserDayLogByDate,
  useGetUserDayLogsByDateRange,
  useGetUserDayLogStats,
  useCreateDayLog,
  useUpdateDayLog,
  useDeleteDayLog,
  useCreateBulkDayLogs,
  useGenerateDayLog,
} from './useDayLogs';

export { useAiService } from './useAiService';

export { 
  useJobMetrics,
  useGetJobMetrics,
  useGetJobMetric,
  useGetUserJobMetrics,
  useGetFinancialAnalysis,
  useCreateJobMetric,
  useUpdateJobMetric,
  useDeleteJobMetric,
  useGenerateJobMetrics,
  useUpdateFinancialMetrics,
  useAnalyzeMetricsWithAi,
} from './useJobMetrics';

export { 
  useUsers,
  useGetUsers,
  useGetUser,
  useGetUserProfile,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from './useUsers';

export { 
  useAiContext,
  useGetAiContext,
  useGetAiContextByUser,
  useCreateAiContext,
  useUpdateAiContext,
  useDeleteAiContext,
} from './useAiContext';

export { 
  useLogs,
  useGetLogs,
  useGetLog,
  useCreateLog,
} from './useLogs';

export { 
  usePrompts,
  useGetUserPrompts,
  useGetPrompt,
  useCreatePrompt,
  useUpdatePrompt,
} from './usePrompts';

// Error handling hooks
export { useErrorHandler } from './useErrorHandler';
export { useQueryErrorHandler } from './useQueryErrorHandler';

export { useChatCompletion, useUserPrompts } from './useChat';

// Export existing hooks
export { useNotification } from './use-notification';
export { useIsMobile } from './use-mobile';
export { useToast } from './use-toast';
