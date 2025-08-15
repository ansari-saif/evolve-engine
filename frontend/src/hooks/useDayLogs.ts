import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { DayLogsService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { DayLogResponse, DayLogCreate, DayLogUpdate, DayLogBulkCreate } from '../client/models';

// Individual query hooks
export const useGetDayLog = (id: number): UseQueryResult<DayLogResponse, Error> => {
  return useQuery({
    queryKey: ['dayLogs', id],
    queryFn: async () => {
      const response = await DayLogsService.getDayLogDayLogsLogIdGet({ logId: id });
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetUserDayLogs = (userId: string, limit: number = 10, skip: number = 0): UseQueryResult<DayLogResponse[], Error> => {
  return useQuery({
    queryKey: ['dayLogs', 'user', userId, limit, skip],
    queryFn: async () => {
      const response = await DayLogsService.getUserDayLogsDayLogsUserUserIdGet({ userId, limit, skip });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetUserDayLogByDate = (userId: string, date: string): UseQueryResult<DayLogResponse, Error> => {
  return useQuery({
    queryKey: ['dayLogs', 'user', userId, 'date', date],
    queryFn: async () => {
      const response = await DayLogsService.getUserDayLogByDateDayLogsUserUserIdDateDateGet({ userId, date });
      return response;
    },
    enabled: !!userId && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetUserDayLogsByDateRange = (
  userId: string, 
  startDate: string, 
  endDate: string, 
  location?: string
): UseQueryResult<DayLogResponse[], Error> => {
  return useQuery({
    queryKey: ['dayLogs', 'user', userId, 'range', startDate, endDate, location],
    queryFn: async () => {
      const response = await DayLogsService.getUserDayLogsByDateRangeDayLogsUserUserIdRangeGet({ 
        userId, 
        startDate, 
        endDate, 
        location 
      });
      return response;
    },
    enabled: !!userId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetUserDayLogStats = (userId: string): UseQueryResult<unknown, Error> => {
  return useQuery({
    queryKey: ['dayLogs', 'user', userId, 'stats'],
    queryFn: async () => {
      const response = await DayLogsService.getUserDayLogStatsDayLogsUserUserIdStatsGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

// Mutation hooks
export const useCreateDayLog = (): UseMutationResult<DayLogResponse, Error, DayLogCreate, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (logData: DayLogCreate) => {
      const response = await DayLogsService.createDayLogEndpointDayLogsPost({ requestBody: logData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayLogs'] });
    },
    onError: (error) => {
      console.error('Failed to create day log:', getErrorMessage(error));
    },
  });
};

export const useUpdateDayLog = (): UseMutationResult<DayLogResponse, Error, { id: number; data: DayLogUpdate }, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DayLogUpdate }) => {
      const response = await DayLogsService.updateDayLogEndpointDayLogsLogIdPatch({ 
        logId: id, 
        requestBody: data 
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dayLogs'] });
      queryClient.invalidateQueries({ queryKey: ['dayLogs', variables.id] });
    },
    onError: (error) => {
      console.error('Failed to update day log:', getErrorMessage(error));
    },
  });
};

export const useDeleteDayLog = (): UseMutationResult<void, Error, number, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await DayLogsService.deleteDayLogEndpointDayLogsLogIdDelete({ logId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayLogs'] });
    },
    onError: (error) => {
      console.error('Failed to delete day log:', getErrorMessage(error));
    },
  });
};

export const useCreateBulkDayLogs = (): UseMutationResult<DayLogResponse[], Error, DayLogBulkCreate, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (logsData: DayLogBulkCreate) => {
      const response = await DayLogsService.createBulkDayLogsEndpointDayLogsBulkPost({ requestBody: logsData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayLogs'] });
    },
    onError: (error) => {
      console.error('Failed to create bulk day logs:', getErrorMessage(error));
    },
  });
};

export const useGenerateDayLog = (): UseMutationResult<DayLogResponse, Error, { userId: string; dateValue?: string }, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, dateValue }: { userId: string; dateValue?: string }) => {
      const response = await DayLogsService.generateDayLogDayLogsGenerateUserIdPost({ userId, dateValue });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayLogs'] });
    },
    onError: (error) => {
      console.error('Failed to generate day log:', getErrorMessage(error));
    },
  });
};

// Main hook that returns all the individual hooks
export const useDayLogs = () => {
  return {
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
  };
};
