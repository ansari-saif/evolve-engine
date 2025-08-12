import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LoadingSpinner, ErrorMessage } from '../ui';
import { useGetUserTodayTasks, useCompleteTask } from '../../hooks/useTasks';
import { useUserId } from '../../contexts/AppContext';
import confetti from 'canvas-confetti';
import type { TaskResponse } from '../../client/models';
import { tokens } from '../../theme';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Target, 
  CheckCircle,
  AlertCircle,
  Zap,
  Sparkles
} from 'lucide-react';

const TodaysTasks: React.FC = () => {
  const userId = useUserId();
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const { data: tasks, isLoading, error } = useGetUserTodayTasks(userId);
  const completeTaskMutation = useCompleteTask();

  const handleCompleteTask = async (taskId: number) => {
    setLoadingTaskId(taskId);
    try {
      await completeTaskMutation.mutateAsync(taskId);
      setCompletedTasks(prev => new Set(prev).add(taskId));
      
      // Trigger confetti effect with brand colors using design tokens
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
          tokens.colors.primary.DEFAULT,
          tokens.colors.secondary.DEFAULT,
          tokens.colors.success.DEFAULT,
          tokens.colors.accent.DEFAULT
        ]
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'Medium':
        return <Target className="w-4 h-4 text-warning" />;
      case 'Low':
        return <Clock className="w-4 h-4 text-primary" />;
      default:
        return <Target className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Target className="w-5 h-5 text-primary" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner message="Loading tasks..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Target className="w-5 h-5 text-primary" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage message="Failed to load today's tasks" />
        </CardContent>
      </Card>
    );
  }

  const pendingTasks = tasks?.filter((task: TaskResponse) => 
    task.completion_status !== 'Completed' && !completedTasks.has(task.task_id)
  ) || [];

  const completedTasksList = tasks?.filter((task: TaskResponse) => 
    task.completion_status === 'Completed' || completedTasks.has(task.task_id)
  ) || [];

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-card">
      <CardHeader className="pb-2 sm:pb-3 lg:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg font-semibold text-foreground">
          <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary" />
          Today's Tasks
          <Badge variant="secondary" className="ml-auto text-[10px] sm:text-xs bg-primary/10 text-primary border-primary/20 px-1.5 py-0.5">
            {pendingTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                Pending Tasks
                <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">({pendingTasks.length})</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {pendingTasks.map((task: TaskResponse) => (
                  <div
                    key={task.task_id}
                    className="group flex items-center justify-between p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-border/50 bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:bg-surface/70 hover:border-border hover:shadow-elegant"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getPriorityIcon(task.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                            <Badge 
                              variant={getPriorityVariant(task.priority)}
                              className="text-[10px] sm:text-xs font-medium px-1.5 py-0.5"
                            >
                              {task.priority}
                            </Badge>
                          
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCompleteTask(task.task_id)}
                      disabled={loadingTaskId === task.task_id}
                      size="sm"
                      variant="outline"
                      className="ml-2 sm:ml-3 lg:ml-4 flex-shrink-0 bg-surface/80 backdrop-blur-sm border-border hover:bg-success/10 hover:border-success/30 hover:text-success transition-all duration-300 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs"
                    >
                      {loadingTaskId === task.task_id ? (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                          <span className="hidden sm:inline">Complete</span>
                          <span className="sm:hidden">✓</span>
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasksList.length > 0 && (
            <div>
              <h3 className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                Completed Tasks
                <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">({completedTasksList.length})</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {completedTasksList.map((task: TaskResponse) => (
                  <div
                    key={task.task_id}
                    className="group flex items-center justify-between p-2.5 sm:p-3 lg:p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg sm:rounded-xl border border-success/20 transition-all duration-300"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium line-through text-success/80 leading-relaxed">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                            <Badge variant="default" className="bg-success text-success-foreground text-[10px] sm:text-xs font-medium px-1.5 py-0.5">
                              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                              Completed
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {pendingTasks.length === 0 && completedTasksList.length === 0 && (
            <div className="text-center py-8 sm:py-10 lg:py-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground mb-1 sm:mb-2">No tasks for today!</h3>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto">
                You're all caught up. Great job staying on top of your tasks!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysTasks;