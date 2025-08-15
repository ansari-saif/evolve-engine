import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { LogService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { LogResponse, LogCreate } from '../client/models';

// Individual query hooks
export const useGetLogs = (limit: number = 10, skip: number = 0): UseQueryResult<LogResponse[], Error> => {
  return useQuery({
    queryKey: ['logs', limit, skip],
    queryFn: async () => {
      const response = await LogService.listLogsEndpointLogGet({ limit, skip });
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetLog = (logId: number): UseQueryResult<LogResponse, Error> => {
  return useQuery({
    queryKey: ['logs', logId],
    queryFn: async () => {
      const response = await LogService.getLogEndpointLogLogIdGet({ logId });
      return response;
    },
    enabled: !!logId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useCreateLog = (): UseMutationResult<LogResponse, Error, LogCreate, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (logData: LogCreate) => {
      const response = await LogService.createLogEndpointLogPost({ requestBody: logData });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['logs', data.log_id] });
    },
    onError: (error) => {
      console.error('Failed to create log:', getErrorMessage(error));
    },
  });
};

// Main hook that returns all the individual hooks
export const useLogs = () => {
  return {
    useGetLogs,
    useGetLog,
    useCreateLog,
  };
};
