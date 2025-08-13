import React, { useMemo, useCallback } from 'react';
import TaskCard from './TaskCard';
import { SkeletonLoader } from '../ui';
import { useGetUserGoals } from '../../hooks/useGoals';
import { useUserId } from '../../hooks/redux/useAppConfig';
import type { TaskResponse, TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum } from '../../client/models';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: TaskResponse[];
  isLoading: boolean;
  loadingTaskId?: number | null;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  loadingTaskId
}) => {
  // ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE THIS POINT
  const userId = useUserId();
  const { data: goals = [] } = useGetUserGoals(userId);
  
  // Memoized utility functions for TaskCard
  const formatDate = useCallback((date: string | null) => {
    if (!date) return null;
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  }, []);

  /**
   * Format a duration value expressed in minutes into a compact human-readable string.
   *
   * - Interprets the input as minutes (not seconds)
   * - Floors fractional values to whole minutes
   * - Clamps negatives to 0
   * - Returns null for null/undefined/NaN/Infinity
   *
   * Examples:
   * - 0 -> "0m"
   * - 45 -> "45m"
   * - 90 -> "1h 30m"
   *
   * @param duration Minutes to format. May be null.
   * @returns A formatted string like "1h 30m" or "45m", or null if invalid.
   */
  const formatDuration = useCallback((duration: number | null) => {
    if (duration == null || !Number.isFinite(duration)) return null;
    const totalMinutes = Math.max(0, Math.floor(duration));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  // Memoize the task cards to prevent unnecessary re-renders
  const taskCards = useMemo(() => {
    return tasks.map((task) => (
      <TaskCard
        key={task.task_id}
        task={task}
        goals={goals}
        formatDate={formatDate}
        formatDuration={formatDuration}
        loadingTaskId={loadingTaskId}
      />
    ));
  }, [tasks, goals, formatDate, formatDuration, loadingTaskId]);

  // CONDITIONAL RENDERING AFTER ALL HOOKS
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonLoader key={index} className="h-32" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {taskCards}
    </div>
  );
};

export default React.memo(TaskList);
