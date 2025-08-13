import React from 'react';
import TaskCard from './TaskCard';
import { SkeletonLoader } from '../ui';
import type { TaskResponse, TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum } from '../../client/models';
import type { GoalResponse } from '../../client/models';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: TaskResponse[];
  goals?: GoalResponse[];
  isLoading: boolean;
  onTaskComplete: (taskId: number) => void;
  onTaskEdit: (task: TaskResponse) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskStatusChange: (taskId: number, status: CompletionStatusEnum) => void;
  loadingTaskId: number | null;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  goals = [],
  isLoading,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  onTaskStatusChange,
  loadingTaskId
}) => {
  // Utility functions for TaskCard
  const getPriorityColor = (priority: TaskPriorityEnum) => {
    switch (priority) {
      case 'Urgent': return 'destructive';
      case 'High': return 'secondary';
      case 'Medium': return 'default';
      case 'Low': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = (status: CompletionStatusEnum) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'outline';
    }
  };

  const getEnergyColor = (energy: EnergyRequiredEnum) => {
    switch (energy) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return null;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

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
      {tasks.map((task) => (
        <TaskCard
          key={task.task_id}
          task={task}
          goals={goals}
          onStatusChange={onTaskStatusChange}
          onComplete={onTaskComplete}
          onEdit={onTaskEdit}
          onDelete={onTaskDelete}
          getPriorityColor={getPriorityColor}
          getStatusColor={getStatusColor}
          getEnergyColor={getEnergyColor}
          formatDate={formatDate}
          formatDuration={formatDuration}
          loadingTaskId={loadingTaskId}
        />
      ))}
    </div>
  );
};

export default TaskList;
