import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { GoalsService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { GoalResponse, GoalCreate, GoalUpdate } from '../client/models';

// Individual query hooks
export const useGetGoals = (): UseQueryResult<GoalResponse[], Error> => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await GoalsService.readGoalsGoalsGet();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetGoal = (id: number): UseQueryResult<GoalResponse, Error> => {
  return useQuery({
    queryKey: ['goals', id],
    queryFn: async () => {
      const response = await GoalsService.readGoalGoalsGoalIdGet({ goalId: id });
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserGoals = (userId: string): UseQueryResult<GoalResponse[], Error> => {
  return useQuery({
    queryKey: ['goals', 'user', userId],
    queryFn: async () => {
      const response = await GoalsService.getUserGoalsGoalsUserUserIdGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserPendingGoals = (userId: string): UseQueryResult<GoalResponse[], Error> => {
  return useQuery({
    queryKey: ['goals', 'user', userId, 'pending'],
    queryFn: async () => {
      const response = await GoalsService.getUserPendingGoalsGoalsUserUserIdPendingGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutation hooks
export const useCreateGoal = (): UseMutationResult<GoalResponse, Error, GoalCreate, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (goalData: GoalCreate) => {
      const response = await GoalsService.createGoalGoalsPost({ requestBody: goalData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (error) => {
      console.error('Failed to create goal:', getErrorMessage(error));
    },
  });
};

export const useUpdateGoal = (): UseMutationResult<GoalResponse, Error, { id: number; data: GoalUpdate }, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: GoalUpdate }) => {
      const response = await GoalsService.updateGoalGoalsGoalIdPut({ 
        goalId: id, 
        requestBody: data 
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals', variables.id] });
    },
    onError: (error) => {
      console.error('Failed to update goal:', getErrorMessage(error));
    },
  });
};

export const useDeleteGoal = (): UseMutationResult<void, Error, number, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await GoalsService.deleteGoalGoalsGoalIdDelete({ goalId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (error) => {
      console.error('Failed to delete goal:', getErrorMessage(error));
    },
  });
};

// Main hook that returns all the individual hooks
export const useGoals = () => {
  return {
    useGetGoals,
    useGetGoal,
    useGetUserGoals,
    useGetUserPendingGoals,
    useCreateGoal,
    useUpdateGoal,
    useDeleteGoal,
  };
};
