import React from 'react';

interface TaskStopwatchProps {
  formattedTime: string;
}

export const TaskStopwatch: React.FC<TaskStopwatchProps> = ({ formattedTime }) => {
  return (
    <div className="flex items-center gap-2 p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
      <div className="text-primary font-mono text-xs sm:text-sm">
        {formattedTime}
      </div>
      <span className="text-xs sm:text-sm text-primary font-medium">Task in progress</span>
    </div>
  );
};
