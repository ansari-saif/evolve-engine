import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { JobMetricsService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { JobMetricsResponse, JobMetricsCreate, JobMetricsUpdate } from '../client/models';

// Individual query hooks
export const useGetJobMetrics = () => {
  return useQuery({
    queryKey: ['jobMetrics'],
    queryFn: async () => {
      const response = await JobMetricsService.readJobMetricsJobMetricsGet();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetJobMetric = (id: number) => {
  return useQuery({
    queryKey: ['jobMetrics', id],
    queryFn: async () => {
      const response = await JobMetricsService.readJobMetricJobMetricsMetricIdGet({ metricId: id });
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserJobMetrics = (userId: string) => {
  return useQuery({
    queryKey: ['jobMetrics', 'user', userId],
    queryFn: async () => {
      const response = await JobMetricsService.getUserJobMetricsJobMetricsUserUserIdGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetFinancialAnalysis = (userId: string) => {
  return useQuery({
    queryKey: ['jobMetrics', 'user', userId, 'financial'],
    queryFn: async () => {
      const response = await JobMetricsService.getFinancialAnalysisJobMetricsUserUserIdAnalysisGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hooks
export const useCreateJobMetric = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (metricData: JobMetricsCreate) => {
      const response = await JobMetricsService.createJobMetricsJobMetricsPost({ requestBody: metricData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMetrics'] });
    },
    onError: (error) => {
      console.error('Failed to create job metric:', getErrorMessage(error));
    },
  });
};

export const useUpdateJobMetric = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: JobMetricsUpdate }) => {
      const response = await JobMetricsService.updateJobMetricsJobMetricsMetricIdPut({ 
        metricId: id, 
        requestBody: data 
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['jobMetrics', variables.id] });
    },
    onError: (error) => {
      console.error('Failed to update job metric:', getErrorMessage(error));
    },
  });
};

export const useDeleteJobMetric = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await JobMetricsService.deleteJobMetricsJobMetricsMetricIdDelete({ metricId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMetrics'] });
    },
    onError: (error) => {
      console.error('Failed to delete job metric:', getErrorMessage(error));
    },
  });
};

export const useGenerateJobMetricsForUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await JobMetricsService.generateJobMetricsForUserJobMetricsUserUserIdGeneratePost({ userId });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMetrics'] });
    },
    onError: (error) => {
      console.error('Failed to generate job metrics for user:', getErrorMessage(error));
    },
  });
};

export const useUpdateFinancialMetrics = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Record<string, unknown> }) => {
      const response = await JobMetricsService.updateFinancialMetricsJobMetricsUserUserIdFinancialPatch({ 
        userId, 
        requestBody: data 
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMetrics'] });
    },
    onError: (error) => {
      console.error('Failed to update financial metrics:', getErrorMessage(error));
    },
  });
};

export const useAnalyzeMetricsWithAi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (metricId: number) => {
      const response = await JobMetricsService.analyzeMetricsWithAiJobMetricsMetricIdAnalyzePost({ metricId });
      return response;
    },
    onSuccess: (_, metricId) => {
      queryClient.invalidateQueries({ queryKey: ['jobMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['jobMetrics', metricId] });
    },
    onError: (error) => {
      console.error('Failed to analyze metrics with AI:', getErrorMessage(error));
    },
  });
};

// Main hook that returns all the individual hooks
export const useJobMetrics = () => {
  return {
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
  };
};
