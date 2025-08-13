import React, { ReactNode, useState, useCallback } from 'react';
import type { TaskResponse, GoalResponse } from '../../client/models';

interface DataProviderProps<T> {
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  children: (props: DataProviderRenderProps<T>) => ReactNode;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

interface DataProviderRenderProps<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  count: number;
  refresh: () => void;
  loadMore: () => void;
  hasMore: boolean;
  // Utility functions
  filter: (predicate: (item: T) => boolean) => T[];
  sort: (comparator: (a: T, b: T) => number) => T[];
  find: (predicate: (item: T) => boolean) => T | undefined;
  findIndex: (predicate: (item: T) => boolean) => number;
}

export function DataProvider<T>({
  data,
  isLoading = false,
  error = null,
  children,
  onRefresh,
  onLoadMore,
  hasMore = false,
}: DataProviderProps<T>) {
  const [localData, setLocalData] = useState<T[]>(data);

  const refresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  const loadMore = useCallback(() => {
    onLoadMore?.();
  }, [onLoadMore]);

  const filter = useCallback((predicate: (item: T) => boolean) => {
    return localData.filter(predicate);
  }, [localData]);

  const sort = useCallback((comparator: (a: T, b: T) => number) => {
    return [...localData].sort(comparator);
  }, [localData]);

  const find = useCallback((predicate: (item: T) => boolean) => {
    return localData.find(predicate);
  }, [localData]);

  const findIndex = useCallback((predicate: (item: T) => boolean) => {
    return localData.findIndex(predicate);
  }, [localData]);

  const renderProps: DataProviderRenderProps<T> = {
    data: localData,
    isLoading,
    error,
    isEmpty: localData.length === 0,
    count: localData.length,
    refresh,
    loadMore,
    hasMore,
    filter,
    sort,
    find,
    findIndex,
  };

  return <>{children(renderProps)}</>;
}

// Specialized data providers for common use cases
export function TaskDataProvider({
  data,
  isLoading,
  error,
  children,
  onRefresh,
  onLoadMore,
  hasMore,
}: Omit<DataProviderProps<TaskResponse>, 'children'> & {
  children: (props: DataProviderRenderProps<TaskResponse> & {
    // Task-specific utilities
    getTasksByStatus: (status: string) => TaskResponse[];
    getTasksByPriority: (priority: string) => TaskResponse[];
    getTasksByGoal: (goalId: number) => TaskResponse[];
    getOverdueTasks: () => TaskResponse[];
    getCompletedTasks: () => TaskResponse[];
  }) => ReactNode;
}) {
  return (
    <DataProvider
      data={data}
      isLoading={isLoading}
      error={error}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
    >
      {(baseProps) => {
        const getTasksByStatus = (status: string) => 
          baseProps.filter((task: TaskResponse) => task.completion_status === status);
        
        const getTasksByPriority = (priority: string) => 
          baseProps.filter((task: TaskResponse) => task.priority === priority);
        
        const getTasksByGoal = (goalId: number) => 
          baseProps.filter((task: TaskResponse) => task.goal_id === goalId);
        
        const getOverdueTasks = () => 
          baseProps.filter((task: TaskResponse) => {
            if (!task.scheduled_for_date) return false;
            return new Date(task.scheduled_for_date) < new Date();
          });
        
        const getCompletedTasks = () => 
          baseProps.filter((task: TaskResponse) => task.completion_status === 'Completed');

        return children({
          ...baseProps,
          getTasksByStatus,
          getTasksByPriority,
          getTasksByGoal,
          getOverdueTasks,
          getCompletedTasks,
        });
      }}
    </DataProvider>
  );
}

export function GoalDataProvider({
  data,
  isLoading,
  error,
  children,
  onRefresh,
  onLoadMore,
  hasMore,
}: Omit<DataProviderProps<GoalResponse>, 'children'> & {
  children: (props: DataProviderRenderProps<GoalResponse> & {
    // Goal-specific utilities
    getGoalsByStatus: (status: string) => GoalResponse[];
    getGoalsByType: (type: string) => GoalResponse[];
    getActiveGoals: () => GoalResponse[];
    getCompletedGoals: () => GoalResponse[];
  }) => ReactNode;
}) {
  return (
    <DataProvider
      data={data}
      isLoading={isLoading}
      error={error}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
    >
      {(baseProps) => {
        const getGoalsByStatus = (status: string) => 
          baseProps.filter((goal: GoalResponse) => goal.status === status);
        
        const getGoalsByType = (type: string) => 
          baseProps.filter((goal: GoalResponse) => goal.type === type);
        
        const getActiveGoals = () => 
          baseProps.filter((goal: GoalResponse) => goal.status === 'Active');
        
        const getCompletedGoals = () => 
          baseProps.filter((goal: GoalResponse) => goal.status === 'Completed');

        return children({
          ...baseProps,
          getGoalsByStatus,
          getGoalsByType,
          getActiveGoals,
          getCompletedGoals,
        });
      }}
    </DataProvider>
  );
}
