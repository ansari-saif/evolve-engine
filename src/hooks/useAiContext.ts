import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { AiContextService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { AIContextResponse, AIContextCreate, AIContextUpdate } from '../client/models';

// Individual query hooks
export const useGetAiContext = (contextId: number): UseQueryResult<AIContextResponse, Error> => {
  return useQuery({
    queryKey: ['aiContext', contextId],
    queryFn: async () => {
      const response = await AiContextService.getAiContextAiContextContextIdGet({ contextId });
      return response;
    },
    enabled: !!contextId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAiContextByUser = (userId: string): UseQueryResult<AIContextResponse, Error> => {
  return useQuery({
    queryKey: ['aiContext', 'user', userId],
    queryFn: async () => {
      const response = await AiContextService.getAiContextByUserAiContextUserUserIdGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useCreateAiContext = (): UseMutationResult<AIContextResponse, Error, AIContextCreate, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contextData: AIContextCreate) => {
      const response = await AiContextService.createAiContextAiContextPost({ requestBody: contextData });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['aiContext'] });
      queryClient.invalidateQueries({ queryKey: ['aiContext', data.context_id] });
      queryClient.invalidateQueries({ queryKey: ['aiContext', 'user', data.user_id] });
    },
    onError: (error) => {
      console.error('Failed to create AI context:', getErrorMessage(error));
    },
  });
};

export const useUpdateAiContext = (): UseMutationResult<AIContextResponse, Error, { contextId: number; data: AIContextUpdate }, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contextId, data }: { contextId: number; data: AIContextUpdate }) => {
      const response = await AiContextService.updateAiContextAiContextContextIdPut({ 
        contextId, 
        requestBody: data 
      });
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aiContext'] });
      queryClient.invalidateQueries({ queryKey: ['aiContext', variables.contextId] });
      queryClient.invalidateQueries({ queryKey: ['aiContext', 'user', data.user_id] });
    },
    onError: (error) => {
      console.error('Failed to update AI context:', getErrorMessage(error));
    },
  });
};

export const useDeleteAiContext = (): UseMutationResult<void, Error, number, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contextId: number) => {
      await AiContextService.deleteAiContextAiContextContextIdDelete({ contextId });
    },
    onSuccess: (_, contextId) => {
      queryClient.invalidateQueries({ queryKey: ['aiContext'] });
      queryClient.invalidateQueries({ queryKey: ['aiContext', contextId] });
    },
    onError: (error) => {
      console.error('Failed to delete AI context:', getErrorMessage(error));
    },
  });
};

// Main hook that returns all the individual hooks
export const useAiContext = () => {
  return {
    useGetAiContext,
    useGetAiContextByUser,
    useCreateAiContext,
    useUpdateAiContext,
    useDeleteAiContext,
  };
};
