import { useState, useCallback } from 'react';
import type { TaskResponse } from '../client/models';
import type { TaskFilter } from '../types/app';

/**
 * Custom hook for task state management
 * Follows Single Responsibility Principle by handling only state management concerns
 */
export const useTaskState = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  
  // Editing state
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  
  // Dialog states
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  
  // Loading states
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<TaskFilter>({
    status: 'All',
    priority: 'All',
    energy: 'All',
    goal: 'All',
    searchTerm: ''
  });

  // Tab management
  const handleTabChange = useCallback((tab: 'all' | 'pending' | 'in-progress' | 'completed') => {
    setActiveTab(tab);
  }, []);

  // Editing management
  const startEditing = useCallback((task: TaskResponse) => {
    setEditingTask(task);
  }, []);

  const stopEditing = useCallback(() => {
    setEditingTask(null);
  }, []);

  // Dialog management
  const openGenerateDialog = useCallback(() => {
    setGenerateDialogOpen(true);
  }, []);

  const closeGenerateDialog = useCallback(() => {
    setGenerateDialogOpen(false);
  }, []);

  // Loading management
  const setTaskLoading = useCallback((taskId: number | null) => {
    setLoadingTaskId(taskId);
  }, []);

  // Filter management
  const updateFilters = useCallback((newFilters: Partial<TaskFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: 'All',
      priority: 'All',
      energy: 'All',
      goal: 'All',
      searchTerm: ''
    });
  }, []);

  return {
    // State
    activeTab,
    editingTask,
    generateDialogOpen,
    loadingTaskId,
    filters,
    
    // Actions
    handleTabChange,
    startEditing,
    stopEditing,
    openGenerateDialog,
    closeGenerateDialog,
    setTaskLoading,
    updateFilters,
    resetFilters,
  };
};
