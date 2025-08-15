import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { TaskResponse, GoalResponse } from '../../client/models';
import type { TaskFilter } from '../../types/app';

// Composite selectors for task filtering
export const selectFilteredTasks = createSelector(
  [
    (state: RootState) => state.tasks?.tasks || [],
    (state: RootState) => state.taskFilters || { status: 'All', priority: 'All', energy: 'All', goal: 'All' }
  ],
  (tasks: TaskResponse[], filters: TaskFilter) => {
    return tasks.filter(task => {
      // Filter by status
      if (filters.status !== 'All' && task.completion_status !== filters.status) {
        return false;
      }
      
      // Filter by priority
      if (filters.priority !== 'All' && task.priority !== filters.priority) {
        return false;
      }
      
      // Filter by energy level
      if (filters.energy !== 'All' && task.energy_required !== filters.energy) {
        return false;
      }
      
      // Filter by goal
      if (filters.goal !== 'All' && task.goal_id !== filters.goal) {
        return false;
      }
      
      return true;
    });
  }
);

// Composite selectors for goal filtering
export const selectFilteredGoals = createSelector(
  [
    (state: RootState) => state.goals?.goals || [],
    (state: RootState) => state.goalFilters || { type: 'All', priority: 'All', phase: 'All' }
  ],
  (goals: GoalResponse[], filters: { type: string; priority: string; phase: string }) => {
    return goals.filter(goal => {
      // Filter by type
      if (filters.type !== 'All' && goal.type !== filters.type) {
        return false;
      }
      
      // Filter by priority
      if (filters.priority !== 'All' && goal.priority !== filters.priority) {
        return false;
      }
      
      // Filter by phase
      if (filters.phase !== 'All' && goal.phase !== filters.phase) {
        return false;
      }
      
      return true;
    });
  }
);

// Composite selectors for user preferences
export const selectUserPreferences = createSelector(
  [
    (state: RootState) => state.appConfig.config,
    (state: RootState) => state.appConfig.userId
  ],
  (config, userId) => ({
    userId,
    theme: config.theme || 'light',
    language: config.language || 'en',
    notifications: config.notifications || true,
    autoSave: config.autoSave || true,
    timezone: config.timezone || 'UTC'
  })
);

// Composite selectors for UI state combinations
export const selectUIState = createSelector(
  [
    (state: RootState) => state.ui.toasts,
    (state: RootState) => state.ui.loadingStates,
    (state: RootState) => state.ui.modals,
    (state: RootState) => state.ui.sidebar
  ],
  (toasts, loadingStates, modals, sidebar) => ({
    hasActiveToasts: toasts.some(toast => toast.open),
    activeToastCount: toasts.filter(toast => toast.open).length,
    isLoading: Object.values(loadingStates).some(loading => loading),
    hasOpenModals: Object.values(modals).some(modal => modal),
    sidebarOpen: sidebar.isOpen,
    sidebarActiveTab: sidebar.activeTab
  })
);

// Composite selector for task statistics
export const selectTaskStatistics = createSelector(
  [
    (state: RootState) => state.tasks?.tasks || [],
    selectFilteredTasks
  ],
  (allTasks, filteredTasks) => {
    const totalTasks = allTasks.length;
    const pendingTasks = allTasks.filter(task => task.completion_status === 'Pending').length;
    const inProgressTasks = allTasks.filter(task => task.completion_status === 'In Progress').length;
    const completedTasks = allTasks.filter(task => task.completion_status === 'Completed').length;
    const filteredCount = filteredTasks.length;
    
    return {
      total: totalTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
      completed: completedTasks,
      filtered: filteredCount,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  }
);

// Composite selector for goal statistics
export const selectGoalStatistics = createSelector(
  [
    (state: RootState) => state.goals?.goals || []
  ],
  (goals) => {
    const totalGoals = goals.length;
    const researchGoals = goals.filter(goal => goal.phase === 'Research').length;
    const planningGoals = goals.filter(goal => goal.phase === 'Planning').length;
    const executionGoals = goals.filter(goal => goal.phase === 'Execution').length;
    const reviewGoals = goals.filter(goal => goal.phase === 'Review').length;
    
    return {
      total: totalGoals,
      research: researchGoals,
      planning: planningGoals,
      execution: executionGoals,
      review: reviewGoals
    };
  }
);

// Composite selector for application state summary
export const selectAppStateSummary = createSelector(
  [
    selectTaskStatistics,
    selectGoalStatistics,
    selectUIState,
    selectUserPreferences
  ],
  (taskStats, goalStats, uiState, userPrefs) => ({
    tasks: taskStats,
    goals: goalStats,
    ui: uiState,
    user: userPrefs,
    hasActiveWork: taskStats.inProgress > 0 || goalStats.execution > 0,
    needsAttention: taskStats.pending > 5 || goalStats.research > 3
  })
);
