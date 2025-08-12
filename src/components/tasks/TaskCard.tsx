import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

import { Play, CheckCircle, Edit, Trash2, Calendar as CalendarIcon2, Clock, Target, Zap } from 'lucide-react';
import type { TaskResponse, TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum } from '../../client/models';
import type { GoalResponse } from '../../client/models';

import { cardHover, buttonScale } from '../../utils/animations';
import { useTaskStopwatch } from '../../hooks/useTaskStopwatch';
import { useTaskInteractions } from '../../hooks/useTaskInteractions';
import { TaskStylingService } from '../../utils/taskStyling';
import { TaskStopwatch } from './TaskStopwatch';

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
  loadingTaskId: number | null;
}

const TaskCard = React.memo(({
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
  loadingTaskId
}: TaskCardProps) => {
  const linkedGoal = goals.find(g => g.goal_id === task.goal_id);
  
  // SOLID: Single Responsibility - Extract stopwatch logic
  const stopwatchProps = {
    taskId: task.task_id,
    completionStatus: task.completion_status,
    startedAt: task.started_at,
  };
  
  const { showStopwatch, formattedTime } = useTaskStopwatch(stopwatchProps);

  // SOLID: Single Responsibility - Extract interaction logic
  const { handleAction, handleTouchStart, handleTouchEnd, handleMouseDown, handleMouseUp } = useTaskInteractions();

  return (
    <motion.div
      variants={cardHover}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      style={{ willChange: 'transform, opacity' }}
    >
      <Card className={`bg-card shadow-sm hover:shadow-lg transition-all duration-200 border-l-4 ${TaskStylingService.getPriorityBorderColor(task.priority || 'Medium')} hover:border-l-opacity-80 border border-border/50 select-none`}>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-foreground pr-2">{task.description}</h3>
                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                  {task.completion_status !== 'Completed' && (
                    <>
                      <motion.div variants={buttonScale} whileHover="hover" whileTap="tap">
                        <Button
                          onClick={() => {
                            handleAction('start-task', () => {
                              onStatusChange(task.task_id, 'In Progress');
                            });
                          }}
                          onTouchStart={handleTouchStart}
                          onTouchEnd={handleTouchEnd}
                          onMouseDown={handleMouseDown}
                          onMouseUp={handleMouseUp}
                          disabled={loadingTaskId === task.task_id || task.completion_status === 'In Progress'}
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 min-h-[32px] sm:min-h-[36px] w-8 sm:w-9 h-8 sm:h-9 p-0 touch-manipulation select-none"
                          title="Start task"
                        >
                          {loadingTaskId === task.task_id ? (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </motion.div>
                      <motion.div variants={buttonScale} whileHover="hover" whileTap="tap">
                        <Button
                          onClick={() => handleAction('complete-task', () => onComplete(task.task_id))}
                          onTouchStart={handleTouchStart}
                          onTouchEnd={handleTouchEnd}
                          onMouseDown={handleMouseDown}
                          onMouseUp={handleMouseUp}
                          disabled={loadingTaskId === task.task_id}
                          variant="ghost"
                          size="sm"
                          className="text-success hover:text-success/80 hover:bg-success/10 min-h-[32px] sm:min-h-[36px] w-8 sm:w-9 h-8 sm:h-9 p-0 touch-manipulation select-none"
                        >
                          {loadingTaskId === task.task_id ? (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </motion.div>
                    </>
                  )}
                  <motion.div variants={buttonScale} whileHover="hover" whileTap="tap">
                    <Button
                      onClick={() => handleAction('edit-task', () => onEdit(task))}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted min-h-[32px] sm:min-h-[36px] w-8 sm:w-9 h-8 sm:h-9 p-0 touch-manipulation select-none"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </motion.div>
                  <motion.div variants={buttonScale} whileHover="hover" whileTap="tap">
                    <Button
                      onClick={() => handleAction('delete-task', () => onDelete(task.task_id))}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      disabled={loadingTaskId === task.task_id}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 min-h-[32px] sm:min-h-[36px] w-8 sm:w-9 h-8 sm:h-9 p-0 touch-manipulation select-none"
                    >
                      {loadingTaskId === task.task_id ? (
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Stopwatch for tasks in progress */}
              <AnimatePresence mode="wait">
                {showStopwatch && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeOut",
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.25 }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-primary/20 shadow-sm">
                      <motion.div 
                        className="w-2 h-2 bg-primary rounded-full mr-2"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                      <TaskStopwatch formattedTime={formattedTime} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge 
                  variant="outline"
                  className={`font-medium text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 ${TaskStylingService.getPriorityBadgeClasses(task.priority || 'Medium')}`}
                >
                  {task.priority || 'Medium'}
                </Badge>
                <Badge 
                  variant="outline"
                  className={`font-medium text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 ${TaskStylingService.getStatusBadgeClasses(task.completion_status || 'Pending')}`}
                >
                  {task.completion_status || 'Pending'}
                </Badge>
                <Badge 
                  variant="outline"
                  className={`font-medium text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 ${TaskStylingService.getEnergyBadgeClasses(task.energy_required || 'Medium')}`}
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
}, (prevProps, nextProps) => {
  return prevProps.task.task_id === nextProps.task.task_id &&
         prevProps.task.completion_status === nextProps.task.completion_status &&
         prevProps.task.started_at === nextProps.task.started_at &&
         prevProps.loadingTaskId === nextProps.loadingTaskId;
});

export default TaskCard;
