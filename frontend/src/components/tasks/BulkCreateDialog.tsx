import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { LoadingSpinner } from '../ui';
import { CalendarIcon, Upload, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { getTodayDateIST, dateToISTString } from '../../utils/timeUtils';
import type { TaskCreate, TaskPriorityEnum, EnergyRequiredEnum } from '../../client/models';
import type { GoalResponse } from '../../client/models';

interface BulkCreateDialogProps {
  goals: GoalResponse[] | undefined;
  onCreateTasks: (tasks: TaskCreate[]) => Promise<void>;
  isLoading: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const BulkCreateDialog: React.FC<BulkCreateDialogProps> = ({
  goals,
  onCreateTasks,
  isLoading,
  open,
  onOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open !== 'undefined';
  const showDialog = isControlled ? Boolean(open) : internalOpen;
  const setShowDialog = onOpenChange ?? setInternalOpen;
  const [bulkTasksText, setBulkTasksText] = useState('');
  const [showShortcutFeedback, setShowShortcutFeedback] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Global shortcut: Cmd/Ctrl+Shift+K to open dialog
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isOpenShortcut = (event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'k';
      if (isOpenShortcut) {
        event.preventDefault();
        setShowDialog(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Autofocus textarea when dialog opens
  useEffect(() => {
    if (showDialog) {
      const id = window.setTimeout(() => textareaRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [showDialog]);
  
  // Get today's date in YYYY-MM-DD format for default (IST)
  const getTodayDate = () => {
    return getTodayDateIST();
  };

  const [bulkTaskDefaults, setBulkTaskDefaults] = useState<Partial<TaskCreate>>({
    priority: 'Medium',
    completion_status: 'Pending',
    energy_required: 'Medium',
    estimated_duration: null,
    scheduled_for_date: getTodayDate(), // Default to today's date
    goal_id: null
  });

  const handleBulkCreateTasks = async () => {
    if (!bulkTasksText.trim()) return;

    const taskLines = bulkTasksText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (taskLines.length === 0) return;

    try {
      const tasksToCreate = taskLines.map(description => ({
        ...bulkTaskDefaults,
        description: description.trim()
      } as TaskCreate));

      await onCreateTasks(tasksToCreate);

      setBulkTasksText('');
      setBulkTaskDefaults({
        priority: 'Medium',
        completion_status: 'Pending',
        energy_required: 'Medium',
        estimated_duration: null,
        scheduled_for_date: getTodayDate(), // Reset to today's date
        goal_id: null
      });
      setShowDialog(false);
    } catch (error) {
      // Error is handled by the caller
    }
  };



  const handleCopyBulkTemplate = () => {
    const template = `Task 1 description
Task 2 description
Task 3 description
Another important task
Quick task to complete`;
    setBulkTasksText(template);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      
      // Show visual feedback
      setShowShortcutFeedback(true);
      
      // Hide feedback after animation
      setTimeout(() => {
        setShowShortcutFeedback(false);
      }, 300);
      
      // Trigger task creation
      handleBulkCreateTasks();
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Bulk Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]" aria-describedby="bulk-create-description">
        <DialogHeader>
          <DialogTitle>Bulk Create Tasks</DialogTitle>
          <p id="bulk-create-description" className="text-sm text-muted-foreground">
            Create multiple tasks at once. Enter task descriptions separated by new lines, and they will be created with the selected settings.
          </p>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Task Descriptions (one per line)</label>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleCopyBulkTemplate}
              >
                <Copy className="w-4 h-4 mr-1" />
                Load Template
              </Button>
              <span className="text-xs text-muted-foreground">
                {bulkTasksText.split('\n').filter(line => line.trim().length > 0).length} tasks ready
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                💡 Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter to create tasks
              </span>
            </div>
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Enter task descriptions, one per line...
Example:
Review project requirements
Set up development environment
Create initial database schema
Write API documentation"
                value={bulkTasksText}
                onChange={(e) => setBulkTasksText(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`min-h-[200px] font-mono text-sm transition-all duration-200 ${
                  showShortcutFeedback ? 'ring-2 ring-green-500 ring-opacity-50 bg-green-50' : ''
                }`}
              />
              {showShortcutFeedback && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium animate-pulse">
                    Creating tasks...
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-3">Default Settings for All Tasks</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={bulkTaskDefaults.priority} onValueChange={(value: TaskPriorityEnum) => setBulkTaskDefaults({ ...bulkTaskDefaults, priority: value })}>
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
                <Select value={bulkTaskDefaults.energy_required} onValueChange={(value: EnergyRequiredEnum) => setBulkTaskDefaults({ ...bulkTaskDefaults, energy_required: value })}>
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

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">Estimated Duration (minutes)</label>
                <Input
                  type="number"
                  placeholder="30"
                  value={bulkTaskDefaults.estimated_duration || ''}
                  onChange={(e) => setBulkTaskDefaults({ ...bulkTaskDefaults, estimated_duration: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Goal (optional)</label>
                <Select value={bulkTaskDefaults.goal_id?.toString() || 'none'} onValueChange={(value) => setBulkTaskDefaults({ ...bulkTaskDefaults, goal_id: value === 'none' ? null : parseInt(value) })}>
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

            <div className="mt-4">
              <label className="text-sm font-medium">Scheduled Date (optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bulkTaskDefaults.scheduled_for_date ? format(new Date(bulkTaskDefaults.scheduled_for_date), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                  mode="single"
                  selected={bulkTaskDefaults.scheduled_for_date ? (() => {
                    const [year, month, day] = bulkTaskDefaults.scheduled_for_date.split('-').map(Number);
                    return new Date(year, month - 1, day);
                  })() : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setBulkTaskDefaults({ ...bulkTaskDefaults, scheduled_for_date: dateToISTString(date) });
                    } else {
                      setBulkTaskDefaults({ ...bulkTaskDefaults, scheduled_for_date: null });
                    }
                  }}
                  initialFocus
                />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkCreateTasks}
              disabled={isLoading || !bulkTasksText.trim()}
            >
              {isLoading ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                `Create ${bulkTasksText.split('\n').filter(line => line.trim().length > 0).length} Tasks`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkCreateDialog;
