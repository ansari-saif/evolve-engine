import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { GoalsService } from '../client';
import type { GoalResponse, GoalTypeEnum, StatusEnum } from '../client/models';

/**
 * Extended goal interface specifically for weekly goals
 */
export interface WeeklyGoal extends GoalResponse {
  type: GoalTypeEnum;
  status: StatusEnum;
  completion_percentage: number;
}

/**
 * Progress calculation result for weekly goals
 */
export interface WeeklyProgress {
  completed: number;
  total: number;
  percentage: number;
  goals: WeeklyGoal[];
}

/**
 * UI-friendly milestone representation for the WeeklyRoadmap component
 */
export interface WeeklyMilestone {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  date: string;
  description: string;
  completion_percentage: number;
}

/**
 * Hook to fetch and calculate weekly goals progress
 * 
 * @param userId - The user ID to fetch goals for
 * @returns Query result with weekly progress data including completion statistics
 * 
 * @example
 * ```tsx
 * const { data: progress, isLoading, error } = useWeeklyGoals(userId);
 * console.log(`${progress.completed}/${progress.total} goals completed`);
 * ```
 */
export const useWeeklyGoals = (userId: string): UseQueryResult<WeeklyProgress, Error> => {
  return useQuery({
    queryKey: ['goals', 'user', userId, 'weekly'],
    queryFn: async (): Promise<WeeklyProgress> => {
      const response = await GoalsService.getUserGoalsGoalsUserUserIdGet({ userId });
      
      // Filter for weekly goals only
      const weeklyGoals = response.filter(
        (goal): goal is WeeklyGoal => goal.type === 'Weekly'
      );

      // Calculate progress
      const completed = weeklyGoals.filter(g => g.status === 'Completed').length;
      const total = weeklyGoals.length;
      
      // Calculate average completion percentage for active goals
      const activeGoalsCompletion = weeklyGoals
        .filter(g => g.status === 'Active')
        .reduce((sum, g) => sum + (g.completion_percentage || 0), 0);
      
      const avgActiveCompletion = weeklyGoals.filter(g => g.status === 'Active').length > 0
        ? activeGoalsCompletion / weeklyGoals.filter(g => g.status === 'Active').length
        : 0;

      // Calculate overall percentage
      const percentage = total > 0 
        ? ((completed / total) * 100) + (avgActiveCompletion / total)
        : 0;

      return {
        completed,
        total,
        percentage: Math.min(percentage, 100), // Cap at 100%
        goals: weeklyGoals,
      };
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch weekly goals and convert them to UI-friendly milestones
 * 
 * @param userId - The user ID to fetch goals for
 * @returns Query result with weekly milestones formatted for the WeeklyRoadmap component
 * 
 * @example
 * ```tsx
 * const { data: milestones, isLoading, error } = useWeeklyMilestones(userId);
 * // milestones will be formatted for the WeeklyRoadmap component
 * ```
 */
export const useWeeklyMilestones = (userId: string): UseQueryResult<WeeklyMilestone[], Error> => {
  return useQuery({
    queryKey: ['goals', 'user', userId, 'weekly', 'milestones'],
    queryFn: async (): Promise<WeeklyMilestone[]> => {
      const response = await GoalsService.getUserGoalsGoalsUserUserIdGet({ userId });
      
      // Filter for weekly goals and convert to milestones
      const weeklyGoals = response.filter(goal => goal.type === 'Weekly');
      
      return weeklyGoals.map((goal, index) => {
        const status: WeeklyMilestone['status'] = 
          goal.status === 'Completed' ? 'completed' :
          goal.status === 'Active' ? 'in-progress' : 'pending';
        
        // Generate a date based on goal creation or deadline
        const date = goal.deadline 
          ? new Date(goal.deadline).toLocaleDateString('en-US', { weekday: 'short' })
          : ['Mon', 'Wed', 'Fri', 'Sun'][index % 4];
        
        return {
          id: goal.goal_id,
          title: goal.description.length > 30 
            ? goal.description.substring(0, 30) + '...' 
            : goal.description,
          status,
          date,
          description: goal.description,
          completion_percentage: goal.completion_percentage || 0,
        };
      });
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
