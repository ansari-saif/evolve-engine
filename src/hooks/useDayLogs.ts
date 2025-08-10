import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DayLogsService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { DayLogResponse, DayLogCreate, DayLogUpdate, DayLogBulkCreate } from '../client/models';

// Individual query hooks
export const useGetDayLog = (id: number) => {
  return useQuery({
    queryKey: ['dayLogs', id],
    queryFn: async () => {
      const response = await DayLogsService.getDayLogDayLogsLogIdGet({ logId: id });
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserDayLogs = (userId: string) => {
  return useQuery({
    queryKey: ['dayLogs', 'user', userId],
    queryFn: async () => {
      const response = await DayLogsService.getUserDayLogsDayLogsUserUserIdGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserDayLogByDate = (userId: string, date: string) => {
  return useQuery({
    queryKey: ['dayLogs', 'user', userId, 'date', date],
    queryFn: async () => {
      const response = await DayLogsService.getUserDayLogByDateDayLogsUserUserIdDateDateGet({ 
        userId, 
        date 
      });
      return response;
    },
    enabled: !!userId && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserDayLogsByDateRange = (userId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['dayLogs', 'user', userId, 'dateRange', startDate, endDate],
    queryFn: async () => {
      const response = await DayLogsService.getUserDayLogsByDateRangeDayLogsUserUserIdRangeGet({ 
        userId, 
        startDate, 
        endDate 
      });
      return response;
    },
    enabled: !!userId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserDayLogStats = (userId: string) => {
  return useQuery({
    queryKey: ['dayLogs', 'user', userId, 'stats'],
    queryFn: async () => {
      const response = await DayLogsService.getUserDayLogStatsDayLogsUserUserIdStatsGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hooks
export const useCreateDayLog = () => {
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

export const useUpdateDayLog = () => {
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

export const useDeleteDayLog = () => {
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

export const useCreateBulkDayLogs = () => {
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

export const useGenerateDayLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, dateValue }: { userId: string; dateValue?: string }) => {
      const response = await DayLogsService.generateDayLogDayLogsGenerateUserIdPost({ 
        userId, 
        dateValue 
      });
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
