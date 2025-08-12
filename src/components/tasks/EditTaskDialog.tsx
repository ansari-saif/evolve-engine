import React, { useState, FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { LoadingSpinner } from '../ui';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { dateToISTString } from '../../utils/timeUtils';
import type { TaskResponse, TaskUpdate, TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum } from '../../client/models';
import type { GoalResponse } from '../../client/models';

interface EditTaskDialogProps {
  task: TaskResponse;
  goals: GoalResponse[];
  onSave: (taskId: number, updates: TaskUpdate) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  task,
  goals,
  onSave,
  onCancel,
  isLoading
}) => {
  const [updates, setUpdates] = useState<Partial<TaskUpdate>>({
    description: task.description,
    priority: task.priority,
    completion_status: task.completion_status,
    energy_required: task.energy_required,
    estimated_duration: task.estimated_duration,
    scheduled_for_date: task.scheduled_for_date,
    goal_id: task.goal_id
  });

  const handleSave = () => {
    onSave(task.task_id, updates as TaskUpdate);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-task-description" className="text-sm font-medium">Description</label>
            <Input
              id="edit-task-description"
              name="description"
              value={updates.description || ''}
              onChange={(e) => setUpdates({ ...updates, description: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={updates.priority || 'Medium'} onValueChange={(value: TaskPriorityEnum) => setUpdates({ ...updates, priority: value })}>
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
              <label className="text-sm font-medium">Status</label>
              <Select value={updates.completion_status || 'Pending'} onValueChange={(value: CompletionStatusEnum) => setUpdates({ ...updates, completion_status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Energy Required</label>
              <Select value={updates.energy_required || 'Medium'} onValueChange={(value: EnergyRequiredEnum) => setUpdates({ ...updates, energy_required: value })}>
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
            
            <div>
              <label className="text-sm font-medium">Estimated Duration (minutes)</label>
              <Input
                type="number"
                value={updates.estimated_duration || ''}
                onChange={(e) => setUpdates({ ...updates, estimated_duration: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Goal</label>
              <Select value={updates.goal_id?.toString() || 'none'} onValueChange={(value) => setUpdates({ ...updates, goal_id: value === 'none' ? null : parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Goal</SelectItem>
                  {goals.map(goal => (
                    <SelectItem key={goal.goal_id} value={goal.goal_id.toString()}>
                      {goal.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Schedule for Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {updates.scheduled_for_date ? format(new Date(updates.scheduled_for_date), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                  mode="single"
                  selected={updates.scheduled_for_date ? (() => {
                    const [year, month, day] = updates.scheduled_for_date.split('-').map(Number);
                    return new Date(year, month - 1, day);
                  })() : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setUpdates({ ...updates, scheduled_for_date: dateToISTString(date) });
                    } else {
                      setUpdates({ ...updates, scheduled_for_date: null });
                    }
                  }}
                  initialFocus
                />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
