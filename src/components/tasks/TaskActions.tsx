import React from 'react';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

interface TaskActionsProps {
  onCreateTask: () => void;
  onGenerateTasks: () => void;
  onCreateBulk: () => void;
  onClearToasts?: () => void;
  isLoading?: boolean;
}

/**
 * TaskActions component for task action buttons
 * Follows Single Responsibility Principle by handling only action buttons
 */
export const TaskActions: React.FC<TaskActionsProps> = ({
  onCreateTask,
  onGenerateTasks,
  onCreateBulk,
  onClearToasts,
  isLoading = false,
}) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button onClick={onCreateTask} disabled={isLoading}>
        Create Task
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onGenerateTasks}
        disabled={isLoading}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generate Tasks
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onCreateBulk}
        disabled={isLoading}
      >
        Bulk Create
      </Button>
      
      {onClearToasts && (
        <Button 
          variant="outline" 
          onClick={onClearToasts}
          className="text-destructive hover:text-destructive/80"
        >
          Clear Toasts
        </Button>
      )}
    </div>
  );
};
