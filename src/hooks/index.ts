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
  useGenerateJobMetricsForUser,
  useUpdateFinancialMetrics,
  useAnalyzeMetricsWithAi,
} from './useJobMetrics';

export { useChatCompletion } from './useChat';

// Export existing hooks
export { useNotification } from './use-notification';
export { useIsMobile } from './use-mobile';
export { useToast } from './use-toast';
