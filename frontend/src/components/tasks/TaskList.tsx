import React, { useMemo } from 'react';
import TaskCard from './TaskCard';
import { SkeletonLoader } from '../ui';
import { useGetUserGoals } from '../../hooks/useGoals';
import { useUserId } from '../../hooks/redux/useAppConfig';
import type { TaskResponse, TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum } from '../../client/models';
import { useVisibleTasks } from '../../hooks/useVisibleTasks';
import { useSelector } from 'react-redux';
import { selectLoadingTaskId } from '../../store/selectors/taskUiSelectors';

const TaskList: React.FC = () => {
  // ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE THIS POINT
  const userId = useUserId();
  const { data: goals = [] } = useGetUserGoals(userId);
  const { visibleTasks, isLoading } = useVisibleTasks();
  const loadingTaskId = useSelector(selectLoadingTaskId);
  
  // Memoize the task cards to prevent unnecessary re-renders
  const taskCards = useMemo(() => {
    return visibleTasks.map((task) => (
      <TaskCard
        key={task.task_id}
        task={task}
        goals={goals}
        loadingTaskId={loadingTaskId}
      />
    ));
  }, [visibleTasks, goals, loadingTaskId]);

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

  if (visibleTasks.length === 0) {
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
