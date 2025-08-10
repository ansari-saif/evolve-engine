import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LoadingSpinner, ErrorMessage } from '../ui';
import { useGetUserTodayTasks, useCompleteTask } from '../../hooks/useTasks';
import { useUserId } from '../../contexts/AppContext';
import confetti from 'canvas-confetti';
import type { TaskResponse } from '../../client/models';
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
  const { data: tasks, isLoading, error } = useGetUserTodayTasks(userId);
  const completeTaskMutation = useCompleteTask();

  const handleCompleteTask = async (taskId: number) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
      setCompletedTasks(prev => new Set(prev).add(taskId));
      
      // Trigger confetti effect with brand colors
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#EC4899', '#22C55E', '#8B5CF6']
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Target className="w-5 h-5 text-primary" />
          Today's Tasks
          <Badge variant="secondary" className="ml-auto text-xs bg-primary/10 text-primary border-primary/20">
            {pendingTasks.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Clock className="w-4 h-4 text-warning" />
                Pending Tasks
                <span className="text-xs text-muted-foreground font-normal">({pendingTasks.length})</span>
              </h3>
              <div className="space-y-3">
                {pendingTasks.map((task: TaskResponse) => (
                  <div
                    key={task.task_id}
                    className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:bg-surface/70 hover:border-border hover:shadow-elegant"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getPriorityIcon(task.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-relaxed">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge 
                              variant={getPriorityVariant(task.priority)}
                              className="text-xs font-medium"
                            >
                              {task.priority}
                            </Badge>
                            {task.deadline && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCompleteTask(task.task_id)}
                      disabled={completeTaskMutation.isPending}
                      size="sm"
                      variant="outline"
                      className="ml-4 flex-shrink-0 bg-surface/80 backdrop-blur-sm border-border hover:bg-success/10 hover:border-success/30 hover:text-success transition-all duration-300"
                    >
                      {completeTaskMutation.isPending ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Complete
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
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <CheckCircle className="w-4 h-4 text-success" />
                Completed Tasks
                <span className="text-xs text-muted-foreground font-normal">({completedTasksList.length})</span>
              </h3>
              <div className="space-y-3">
                {completedTasksList.map((task: TaskResponse) => (
                  <div
                    key={task.task_id}
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-xl border border-success/20 transition-all duration-300"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-through text-success/80 leading-relaxed">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="default" className="bg-success text-success-foreground text-xs font-medium">
                              <Sparkles className="w-3 h-3 mr-1" />
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
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No tasks for today!</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
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