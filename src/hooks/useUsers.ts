import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { UsersService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { UserResponse, UserCreate, UserUpdate } from '../client/models';

// Individual query hooks
export const useGetUsers = (limit: number = 100, skip: number = 0): UseQueryResult<UserResponse[], Error> => {
  return useQuery({
    queryKey: ['users', limit, skip],
    queryFn: async () => {
      const response = await UsersService.readUsersUsersGet({ limit, skip });
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUser = (telegramId: string): UseQueryResult<UserResponse, Error> => {
  return useQuery({
    queryKey: ['users', telegramId],
    queryFn: async () => {
      const response = await UsersService.readUserUsersTelegramIdGet({ telegramId });
      return response;
    },
    enabled: !!telegramId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserProfile = (telegramId: string): UseQueryResult<UserResponse, Error> => {
  return useQuery({
    queryKey: ['users', telegramId, 'profile'],
    queryFn: async () => {
      const response = await UsersService.getUserProfileUsersTelegramIdProfileGet({ telegramId });
      return response;
    },
    enabled: !!telegramId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useCreateUser = (): UseMutationResult<UserResponse, Error, UserCreate, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: UserCreate) => {
      const response = await UsersService.createUserUsersPost({ requestBody: userData });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', data.telegram_id] });
    },
    onError: (error) => {
      console.error('Failed to create user:', getErrorMessage(error));
    },
  });
};

export const useUpdateUser = (): UseMutationResult<UserResponse, Error, { telegramId: string; data: UserUpdate }, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ telegramId, data }: { telegramId: string; data: UserUpdate }) => {
      const response = await UsersService.updateUserUsersTelegramIdPut({ 
        telegramId, 
        requestBody: data 
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.telegramId] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.telegramId, 'profile'] });
    },
    onError: (error) => {
      console.error('Failed to update user:', getErrorMessage(error));
    },
  });
};

export const useDeleteUser = (): UseMutationResult<void, Error, string, unknown> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (telegramId: string) => {
      await UsersService.deleteUserUsersTelegramIdDelete({ telegramId });
    },
    onSuccess: (_, telegramId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', telegramId] });
      queryClient.invalidateQueries({ queryKey: ['users', telegramId, 'profile'] });
    },
    onError: (error) => {
      console.error('Failed to delete user:', getErrorMessage(error));
    },
  });
};

// Main hook that returns all the individual hooks
export const useUsers = () => {
  return {
    useGetUsers,
    useGetUser,
    useGetUserProfile,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
  };
};
