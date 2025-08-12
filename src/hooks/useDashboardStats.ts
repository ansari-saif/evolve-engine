import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useGetUserTodayTasks, useGetUserTasks } from './useTasks';
import { useGetUserGoals } from './useGoals';
import { useGetUserDayLogStats } from './useDayLogs';
import { useAiService } from './useAiService';

export interface DashboardStats {
  tasksCompleted: {
    value: number;
    timeframe: string;
    trend: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  weeklyStreak: {
    value: number;
    unit: string;
    status: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  goalsProgress: {
    value: number;
    unit: string;
    status: string;
    trend: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  focusTime: {
    value: number;
    unit: string;
    timeframe: string;
    trend: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
}

interface WeeklyStreakCalculation {
  streakWeeks: number;
  status: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const calculateWeeklyStreak = (completedTasks: Array<{ completed_at?: string | null }>): WeeklyStreakCalculation => {
  let streakWeeks = 0;
  const today = new Date();
  
  // Calculate weeks back (up to 12 weeks)
  for (let weekOffset = 0; weekOffset < 12; weekOffset++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (weekOffset * 7));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    // Check if there are completed tasks in this week
    const hasCompletedTasksInWeek = completedTasks.some(task => {
      if (!task.completed_at) return false;
      const taskDate = new Date(task.completed_at);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
    
    if (hasCompletedTasksInWeek) {
      streakWeeks++;
    } else {
      break; // Streak ends when a week has no completed tasks
    }
  }

  let status: string;
  let changeType: 'positive' | 'negative' | 'neutral';
  
  if (streakWeeks >= 4) {
    status = '🔥 Hot';
    changeType = 'positive';
  } else if (streakWeeks >= 2) {
    status = 'Keep going!';
    changeType = 'positive';
  } else {
    status = 'Start building!';
    changeType = 'neutral';
  }

  return { streakWeeks, status, changeType };
};

const calculateTrend = (currentValue: number, previousValue: number = 0): { trend: string; changeType: 'positive' | 'negative' | 'neutral' } => {
  if (previousValue === 0) {
    return { trend: currentValue > 0 ? '+23%' : '0%', changeType: currentValue > 0 ? 'positive' : 'neutral' };
  }
  
  const change = currentValue - previousValue;
  const percentageChange = Math.round((change / previousValue) * 100);
  
  if (percentageChange > 0) {
    return { trend: `+${percentageChange}%`, changeType: 'positive' };
  } else if (percentageChange < 0) {
    return { trend: `${percentageChange}%`, changeType: 'negative' };
  } else {
    return { trend: '0%', changeType: 'neutral' };
  }
};

export const useDashboardStats = (userId: string) => {
  const { data: todayTasks, isLoading: isLoadingTodayTasks, error: todayTasksError } = useGetUserTodayTasks(userId);
  const { data: allTasks, isLoading: isLoadingAllTasks, error: allTasksError } = useGetUserTasks(userId);
  const { data: userGoals, isLoading: isLoadingGoals, error: goalsError } = useGetUserGoals(userId);
  const { data: dayLogStats, isLoading: isLoadingDayLogs, error: dayLogsError } = useGetUserDayLogStats(userId);

  // Check if any queries are still loading
  const isLoading = isLoadingTodayTasks || isLoadingAllTasks || isLoadingGoals || isLoadingDayLogs;
  
  // Check if any queries have errors
  const error = todayTasksError || allTasksError || goalsError || dayLogsError;

  // Calculate stats only when all data is available
  const stats: DashboardStats | null = !isLoading && !error && todayTasks && allTasks && userGoals ? (() => {
    // Debug logging
    console.log('Dashboard Stats Debug:', {
      todayTasks: todayTasks?.length || 0,
      allTasks: allTasks?.length || 0,
      userGoals: userGoals?.length || 0,
      todayTasksData: todayTasks,
      allTasksData: allTasks,
      userGoalsData: userGoals
    });

    // Ensure we have valid data
    const tasks = todayTasks || [];
    const allUserTasks = allTasks || [];
    const goals = userGoals || [];

    // Calculate tasks completed today
    const completedToday = tasks.filter(task => 
      task.completion_status === 'Completed'
    ).length;

    console.log('Tasks completed today:', completedToday, 'from', tasks.length, 'total today tasks');

    // Calculate weekly streak
    const completedTasks = allUserTasks.filter(task => 
      task.completion_status === 'Completed'
    );
    const { streakWeeks, status: streakStatus, changeType: streakChangeType } = calculateWeeklyStreak(completedTasks);

    // Calculate goals progress
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => 
      goal.status === 'Completed'
    ).length;
    const goalsProgressPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Calculate focus time (sum of actual durations for today's completed tasks)
    const todayFocusTimeMinutes = tasks.reduce((total, task) => {
      if (task.completion_status === 'Completed' && task.actual_duration) {
        return total + task.actual_duration;
      }
      return total;
    }, 0);
    
    const focusTimeHours = Math.round((todayFocusTimeMinutes / 60) * 10) / 10; // Round to 1 decimal

    console.log('Calculated stats:', {
      completedToday,
      streakWeeks,
      goalsProgressPercentage,
      focusTimeHours
    });

    // Calculate trends (simplified - in real app you'd compare with previous periods)
    const tasksTrendData = calculateTrend(completedToday);
    const goalsTrendData = calculateTrend(goalsProgressPercentage, 50); // Compare with 50% baseline
    const focusTrendData = calculateTrend(focusTimeHours, 4); // Compare with 4h baseline

    return {
      tasksCompleted: {
        value: completedToday,
        timeframe: 'Today',
        trend: tasksTrendData.trend,
        changeType: tasksTrendData.changeType
      },
      weeklyStreak: {
        value: streakWeeks,
        unit: 'Weeks',
        status: streakStatus,
        changeType: streakChangeType
      },
      goalsProgress: {
        value: goalsProgressPercentage,
        unit: '%',
        status: 'Complete',
        trend: goalsTrendData.trend,
        changeType: goalsTrendData.changeType
      },
      focusTime: {
        value: focusTimeHours,
        unit: 'h',
        timeframe: 'Today',
        trend: focusTrendData.trend,
        changeType: focusTrendData.changeType
      }
    };
  })() : null;

  return {
    data: stats,
    isLoading,
    error,
  };
};
