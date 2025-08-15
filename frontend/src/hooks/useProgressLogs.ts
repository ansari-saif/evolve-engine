import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { ProgressLogsService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { ProgressLogResponse, ProgressLogCreate, ProgressLogUpdate } from '../client/models';

// Individual query hooks
export const useGetProgressLogs = (): UseQueryResult<ProgressLogResponse[], Error> => {
  return useQuery({
    queryKey: ['progressLogs'],
    queryFn: async () => {
      const response = await ProgressLogsService.readProgressLogsProgressLogsGet();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetProgressLog = (id: number): UseQueryResult<ProgressLogResponse, Error> => {
  return useQuery({
    queryKey: ['progressLogs', id],
    queryFn: async () => {
      const response = await ProgressLogsService.readProgressLogProgressLogsLogIdGet({ logId: id });
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetProgressLogsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['progressLogs', 'dateRange', startDate, endDate],
    queryFn: async () => {
      const response = await ProgressLogsService.readProgressLogsProgressLogsGet({
        startDate,
        endDate,
      });
      return response;
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserProgressLogs = (userId: string): UseQueryResult<ProgressLogResponse[], Error> => {
  return useQuery({
    queryKey: ['progressLogs', 'user', userId],
    queryFn: async () => {
      const response = await ProgressLogsService.getUserProgressLogsProgressLogsUserUserIdGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserRecentProgressLogs = (userId: string, days: number = 7): UseQueryResult<ProgressLogResponse[], Error> => {
  return useQuery({
    queryKey: ['progressLogs', 'user', userId, 'recent', days],
    queryFn: async () => {
      const response = await ProgressLogsService.getUserRecentProgressLogsProgressLogsUserUserIdRecentGet({ userId, days });
      return response;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetUserProgressStats = (userId: string, days: number = 30): UseQueryResult<Record<string, unknown>, Error> => {
  return useQuery({
    queryKey: ['progressLogs', 'user', userId, 'stats', days],
    queryFn: async () => {
      const response = await ProgressLogsService.getUserProgressStatsProgressLogsUserUserIdStatsGet({ userId, days });
      return response;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hooks
export const useCreateProgressLog = (): UseMutationResult<ProgressLogResponse, Error, ProgressLogCreate, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (logData: ProgressLogCreate) => {
      const response = await ProgressLogsService.createProgressLogProgressLogsPost({ requestBody: logData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressLogs'] });
    },
    onError: (error) => {
      console.error('Failed to create progress log:', getErrorMessage(error));
    },
  });
};

export const useUpdateProgressLog = (): UseMutationResult<ProgressLogResponse, Error, { id: number; data: ProgressLogUpdate }, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProgressLogUpdate }) => {
      const response = await ProgressLogsService.updateProgressLogProgressLogsLogIdPut({ 
        logId: id, 
        requestBody: data 
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progressLogs'] });
      queryClient.invalidateQueries({ queryKey: ['progressLogs', variables.id] });
    },
    onError: (error) => {
      console.error('Failed to update progress log:', getErrorMessage(error));
    },
  });
};

export const useDeleteProgressLog = (): UseMutationResult<void, Error, number, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await ProgressLogsService.deleteProgressLogProgressLogsLogIdDelete({ logId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressLogs'] });
    },
    onError: (error) => {
      console.error('Failed to delete progress log:', getErrorMessage(error));
    },
  });
};

export const useGenerateProgressLog = (): UseMutationResult<ProgressLogResponse, Error, { userId: string; date?: string }, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, date }: { userId: string; date?: string }) => {
      const response = await ProgressLogsService.generateProgressLogProgressLogsGenerateUserIdPost({ userId, date });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressLogs'] });
    },
    onError: (error) => {
      console.error('Failed to generate progress log:', getErrorMessage(error));
    },
  });
};

// Main hook that returns all the individual hooks
export const useProgressLogs = () => {
  return {
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
  };
};
