import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Stopwatch } from '../ui/Stopwatch';

import { Play, Pause, CheckCircle, Edit, Trash2, Calendar as CalendarIcon2, Clock, Target, Zap } from 'lucide-react';
import { format } from 'date-fns';
import type { TaskResponse, TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum } from '../../client/models';
import type { GoalResponse } from '../../client/models';

import { fadeInUp, scaleIn } from '../../utils/animations';

interface TaskCardProps {
  task: TaskResponse;
  goals: GoalResponse[];
  onStatusChange: (taskId: number, status: CompletionStatusEnum) => void;
  onComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: TaskResponse) => void;
  getPriorityColor: (priority: TaskPriorityEnum) => "destructive" | "secondary" | "outline" | "default";
  getStatusColor: (status: CompletionStatusEnum) => "destructive" | "secondary" | "outline" | "default";
  getEnergyColor: (energy: EnergyRequiredEnum) => "destructive" | "secondary" | "outline" | "default";
  formatDate: (date: string | null) => string | null;
  formatDuration: (duration: number | null) => string | null;
  isLoading: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  goals,
  onStatusChange,
  onComplete,
  onDelete,
  onEdit,
  getPriorityColor,
  getStatusColor,
  getEnergyColor,
  formatDate,
  formatDuration,
  isLoading
}) => {
  const linkedGoal = goals.find(g => g.goal_id === task.goal_id);
  const [showStopwatch, setShowStopwatch] = useState(false);

  // Memoize the initial time calculation to prevent infinite re-renders
  const initialTime = useMemo(() => {
    if (task.started_at) {
      return Math.floor((Date.now() - new Date(task.started_at).getTime()) / 1000);
    }
    return 0;
  }, [task.started_at]);

  // Show stopwatch when task is in progress
  useEffect(() => {
    if (task.completion_status === 'In Progress') {
      setShowStopwatch(true);
    } else {
      setShowStopwatch(false);
    }
  }, [task.completion_status]);

  const getPriorityBorderColor = (priority: TaskPriorityEnum) => {
    switch (priority) {
      case 'Urgent': return 'border-l-destructive';
      case 'High': return 'border-l-warning';
      case 'Medium': return 'border-l-primary';
      case 'Low': return 'border-l-success';
      default: return 'border-l-primary';
    }
  };

  return (
    <motion.div
      animate={{
        scale: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${getPriorityBorderColor(task.priority || 'Medium')}`}>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 pr-2">{task.description}</h3>
                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                  {task.completion_status !== 'Completed' && (
                    <>
                      <Button
                        onClick={() => {
                          // Start the task
                          onStatusChange(task.task_id, 'In Progress');
                        }}
                        disabled={isLoading || task.completion_status === 'In Progress'}
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 min-h-[32px] sm:min-h-[36px] w-8 sm:w-9 h-8 sm:h-9 p-0"
                        title="Start task"
                      >
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        onClick={() => onComplete(task.task_id)}
                        disabled={isLoading}
                        variant="ghost"
                        size="sm"
                        className="text-success hover:text-success/80 hover:bg-success/10 min-h-[32px] sm:min-h-[36px] w-8 sm:w-9 h-8 sm:h-9 p-0"
                      >
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => onEdit(task)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted min-h-[32px] sm:min-h-[36px] w-8 sm:w-9 h-8 sm:h-9 p-0"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(task.task_id)}
                    disabled={isLoading}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 min-h-[32px] sm:min-h-[36px] w-8 sm:w-9 h-8 sm:h-9 p-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              {/* Stopwatch for tasks in progress */}
              {showStopwatch && (
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Stopwatch
                    initialTime={initialTime}
                    displayOnly={false}
                    size="small"
                    timeFormat="HH:MM:SS:MS"
                    className="text-primary font-mono text-xs sm:text-sm"
                    autoStart={true}
                  />
                </div>
              )}



              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge 
                  variant="outline"
                  className={`font-medium text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 ${
                    task.priority === 'Urgent' 
                      ? 'bg-destructive/10 text-destructive border-destructive/20' 
                      : task.priority === 'High'
                      ? 'bg-warning/10 text-warning border-warning/20'
                      : task.priority === 'Medium'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-success/10 text-success border-success/20'
                  }`}
                >
                  {task.priority || 'Medium'}
                </Badge>
                <Badge 
                  variant="outline"
                  className={`font-medium text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 ${
                    task.completion_status === 'Completed' 
                      ? 'bg-success/10 text-success border-success/20' 
                      : task.completion_status === 'In Progress'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : task.completion_status === 'Pending'
                      ? 'bg-warning/10 text-warning border-warning/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}
                >
                  {task.completion_status || 'Pending'}
                </Badge>
                <Badge 
                  variant="outline"
                  className={`font-medium text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 ${
                    task.energy_required === 'High' 
                      ? 'bg-destructive/10 text-destructive border-destructive/20' 
                      : task.energy_required === 'Medium'
                      ? 'bg-warning/10 text-warning border-warning/20'
                      : 'bg-success/10 text-success border-success/20'
                  }`}
                >
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                  {task.energy_required || 'Medium'}
                </Badge>
                {task.ai_generated && (
                  <Badge variant="outline" className="font-medium text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 bg-secondary/10 text-secondary border-secondary/20">
                    <span className="mr-1">🤖</span>
                    AI Generated
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                {task.scheduled_for_date && (
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <CalendarIcon2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    {formatDate(task.scheduled_for_date)}
                  </div>
                )}
                {task.estimated_duration && (
                  <div className="flex items-center gap-1 text-success bg-success/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    Est: {formatDuration(task.estimated_duration)}
                  </div>
                )}
                {task.actual_duration !== null && task.actual_duration !== undefined && (
                  <div className="flex items-center gap-1 text-secondary bg-secondary/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    Actual: {formatDuration(task.actual_duration)}
                  </div>
                )}
                {linkedGoal && (
                  <div className="flex items-center gap-1 text-warning bg-warning/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                    {linkedGoal.description}
                  </div>
                )}
              </div>


            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
