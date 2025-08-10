import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { LoadingSpinner } from '../ui';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import type { TaskCreate, TaskPriorityEnum, EnergyRequiredEnum } from '../../client/models';
import type { GoalResponse } from '../../client/models';

interface CreateTaskDialogProps {
  goals: GoalResponse[] | undefined;
  onCreateTask: (task: TaskCreate) => Promise<void>;
  isLoading: boolean;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  goals,
  onCreateTask,
  isLoading
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TaskCreate>>({
    description: '',
    priority: 'Medium',
    completion_status: 'Pending',
    energy_required: 'Medium',
    estimated_duration: null,
    scheduled_for_date: null,
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
        scheduled_for_date: null,
        goal_id: null
      });
      setShowDialog(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Description *</label>
            <Input
              placeholder="What needs to be done?"
              value={newTask.description || ''}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
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
                  selected={newTask.scheduled_for_date ? new Date(newTask.scheduled_for_date) : undefined}
                  onSelect={(date) => setNewTask({ ...newTask, scheduled_for_date: date?.toISOString().split('T')[0] || null })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              disabled={isLoading || !newTask.description?.trim()}
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Create Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
