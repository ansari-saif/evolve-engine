import { useMutation, useQuery } from '@tanstack/react-query';
import { PromptsService } from '../client';
import type { PromptCreate, PromptResponse } from '../client/models';

export type AskArgs = { prompt: string; userId: string };
export type AskResult = PromptResponse;

/**
 * useChatCompletion
 * - Encapsulates the chat completion using the PromptsService.
 * - Uses the proper CreatePromptPromptsPost type structure.
 */
export function useChatCompletion() {
  const mutation = useMutation<AskResult, Error, AskArgs>({
    mutationFn: async ({ prompt, userId }) => {
      const promptData: PromptCreate = {
        user_id: userId,
        prompt_text: prompt,
      };

      const response = await PromptsService.createPromptPromptsPost({
        requestBody: promptData,
      });
      
      return response;
    },
  });

  return {
    ask: mutation.mutateAsync,
    isPending: mutation.isPending,
    ...mutation,
  };
}

/**
 * useUserPrompts
 * - Fetches all prompts for a specific user using GetUserPromptsPromptsUserUserIdGet.
 * - Returns the prompts sorted by creation date (newest first).
 */
export function useUserPrompts(userId: string) {
  return useQuery<PromptResponse[], Error>({
    queryKey: ['userPrompts', userId],
    queryFn: async () => {
      const response = await PromptsService.getUserPromptsPromptsUserUserIdGet({ userId });
      // Sort by creation date, newest first
      return response.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
