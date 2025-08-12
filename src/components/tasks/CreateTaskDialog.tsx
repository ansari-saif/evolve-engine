import React, { useState, FormEvent, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { LoadingSpinner } from '../ui';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { getTodayDateIST, dateToISTString } from '../../utils/timeUtils';
import type { TaskCreate, TaskPriorityEnum, EnergyRequiredEnum } from '../../client/models';
import type { GoalResponse } from '../../client/models';

interface CreateTaskDialogProps {
  goals: GoalResponse[] | undefined;
  onCreateTask: (task: TaskCreate) => Promise<void>;
  isLoading: boolean;
}

export interface CreateTaskDialogRef {
  open: () => void;
  close: () => void;
}

const CreateTaskDialog = forwardRef<CreateTaskDialogRef, CreateTaskDialogProps>(({
  goals,
  onCreateTask,
  isLoading
}, ref) => {
  const [showDialog, setShowDialog] = useState(false);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    open: () => setShowDialog(true),
    close: () => setShowDialog(false)
  }));

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowDialog(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Get today's date in YYYY-MM-DD format for default (IST)
  const getTodayDate = () => {
    return getTodayDateIST();
  };

  const [newTask, setNewTask] = useState<Partial<TaskCreate>>({
    description: '',
    priority: 'Medium',
    completion_status: 'Pending',
    energy_required: 'Medium',
    estimated_duration: null,
    scheduled_for_date: getTodayDate(), // Default to today's date
    goal_id: null
  });

  const handleCreateTask = async () => {
    if (!newTask.description?.trim()) return;

    try {
      await onCreateTask(newTask as TaskCreate);
      setNewTask({
        description: '',
        priority: 'Medium',
        completion_status: 'Pending',
        energy_required: 'Medium',
        estimated_duration: null,
        scheduled_for_date: getTodayDate(), // Reset to today's date
        goal_id: null
      });
      setShowDialog(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleCreateTask();
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Task
          <span className="ml-2 text-xs opacity-60">⌘K</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" aria-describedby="create-task-description">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <p id="create-task-description" className="text-sm text-muted-foreground">
            Add a new task to your list. Fill in the details below to create a task with priority, energy level, and optional scheduling.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-description" className="text-sm font-medium">Description *</label>
            <Input
              id="task-description"
              name="description"
              placeholder="What needs to be done?"
              value={newTask.description || ''}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={newTask.priority} onValueChange={(value: TaskPriorityEnum) => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Energy Required</label>
              <Select value={newTask.energy_required} onValueChange={(value: EnergyRequiredEnum) => setNewTask({ ...newTask, energy_required: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Estimated Duration (minutes)</label>
              <Input
                type="number"
                placeholder="30"
                value={newTask.estimated_duration || ''}
                onChange={(e) => setNewTask({ ...newTask, estimated_duration: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Goal (optional)</label>
              <Select value={newTask.goal_id?.toString() || 'none'} onValueChange={(value) => setNewTask({ ...newTask, goal_id: value === 'none' ? null : parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Goal</SelectItem>
                  {goals?.map(goal => (
                    <SelectItem key={goal.goal_id} value={goal.goal_id.toString()}>
                      {goal.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Schedule for Date (optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTask.scheduled_for_date ? format(new Date(newTask.scheduled_for_date), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newTask.scheduled_for_date ? (() => {
                    const [year, month, day] = newTask.scheduled_for_date.split('-').map(Number);
                    return new Date(year, month - 1, day);
                  })() : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setNewTask({ ...newTask, scheduled_for_date: dateToISTString(date) });
                    } else {
                      setNewTask({ ...newTask, scheduled_for_date: null });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !newTask.description?.trim()}
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

CreateTaskDialog.displayName = 'CreateTaskDialog';

export default CreateTaskDialog;
