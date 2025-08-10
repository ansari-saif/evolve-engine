import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { PromptsService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { PromptResponse, PromptCreate, PromptUpdate } from '../client/models';

// Individual query hooks
export const useGetUserPrompts = (userId: string): UseQueryResult<PromptResponse[], Error> => {
  return useQuery({
    queryKey: ['prompts', 'user', userId],
    queryFn: async () => {
      const response = await PromptsService.getUserPromptsPromptsUserUserIdGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPrompt = (promptId: string): UseQueryResult<PromptResponse, Error> => {
  return useQuery({
    queryKey: ['prompts', promptId],
    queryFn: async () => {
      const response = await PromptsService.getPromptPromptsPromptIdGet({ promptId });
      return response;
    },
    enabled: !!promptId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useCreatePrompt = (): UseMutationResult<PromptResponse, Error, PromptCreate, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (promptData: PromptCreate) => {
      const response = await PromptsService.createPromptPromptsPost({ requestBody: promptData });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts', data.prompt_id] });
      queryClient.invalidateQueries({ queryKey: ['prompts', 'user', data.user_id] });
    },
    onError: (error) => {
      console.error('Failed to create prompt:', getErrorMessage(error));
    },
  });
};

export const useUpdatePrompt = (): UseMutationResult<PromptResponse, Error, { promptId: string; data: PromptUpdate }, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ promptId, data }: { promptId: string; data: PromptUpdate }) => {
      const response = await PromptsService.updatePromptPromptsPromptIdPatch({ 
        promptId, 
        requestBody: data 
      });
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts', variables.promptId] });
      queryClient.invalidateQueries({ queryKey: ['prompts', 'user', data.user_id] });
    },
    onError: (error) => {
      console.error('Failed to update prompt:', getErrorMessage(error));
    },
  });
};

// Main hook that returns all the individual hooks
export const usePrompts = () => {
  return {
    useGetUserPrompts,
    useGetPrompt,
    useCreatePrompt,
    useUpdatePrompt,
  };
};
