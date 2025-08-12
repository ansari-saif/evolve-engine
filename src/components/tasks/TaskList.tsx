import React from 'react';
import { TaskCard } from './TaskCard';
import { SkeletonLoader } from '../ui';
import type { TaskResponse } from '../../client/models';

interface TaskListProps {
  tasks: TaskResponse[];
  isLoading: boolean;
  onTaskComplete: (taskId: number) => void;
  onTaskEdit: (task: TaskResponse) => void;
  onTaskDelete: (taskId: number) => void;
  loadingTaskId: number | null;
}

/**
 * TaskList component for rendering a list of tasks
 * Follows Single Responsibility Principle by handling only task list rendering
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  loadingTaskId,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonLoader key={index} className="h-24" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.task_id}
          task={task}
          onComplete={onTaskComplete}
          onEdit={onTaskEdit}
          onDelete={onTaskDelete}
          isLoading={loadingTaskId === task.task_id}
        />
      ))}
    </div>
  );
};
