import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, GripVertical, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import './TaskList.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { GeneratedTask, TaskPriority, EnergyLevel, EditableGeneratedTask } from './DialogStateManager';

interface TaskErrors {
  description?: string;
  priority?: string;
  energy_required?: string;
  estimated_duration?: string;
}

interface EditableTaskListProps {
  tasks: EditableGeneratedTask[];
  onTasksChange: (tasks: EditableGeneratedTask[]) => void;
}

// Type-safe validation functions
const validateDescription = (value: string): string | null => {
  if (!value.trim()) {
    return 'Description cannot be empty';
  }
  if (value.length > 500) {
    return 'Description must be less than 500 characters';
  }
  return null;
};

const validatePriority = (value: string): value is TaskPriority => {
  const validPriorities: readonly TaskPriority[] = ['Urgent', 'High', 'Medium', 'Low'] as const;
  return validPriorities.includes(value as TaskPriority);
};

const validatePriorityWithError = (value: string): string | null => {
  if (!validatePriority(value)) {
    return 'Priority must be one of: Urgent, High, Medium, Low';
  }
  return null;
};

const validateEnergyRequired = (value: string): value is EnergyLevel => {
  const validEnergyLevels: readonly EnergyLevel[] = ['High', 'Medium', 'Low'] as const;
  return validEnergyLevels.includes(value as EnergyLevel);
};

const validateEnergyRequiredWithError = (value: string): string | null => {
  if (!validateEnergyRequired(value)) {
    return 'Energy level must be one of: High, Medium, Low';
  }
  return null;
};

const validateDuration = (value: number | undefined): string | null => {
  if (value !== undefined && value !== null) {
    if (value <= 0) {
      return 'Duration must be greater than 0';
    }
    if (value > 1440) { // 24 hours in minutes
      return 'Duration cannot exceed 24 hours';
    }
  }
  return null;
};

// Sortable Task Row Component
interface SortableTaskRowProps {
  task: EditableGeneratedTask;
  index: number;
  onTaskChange: (index: number, field: keyof EditableGeneratedTask, value: string | number) => void;
  onTaskBlur: (index: number, field: keyof EditableGeneratedTask) => void;
  onDeleteTask: (index: number) => void;
  formatDuration: (minutes?: number) => string;
}

// Mobile expandable state
interface TaskRowState {
  isExpanded: boolean;
}

const SortableTaskRow: React.FC<SortableTaskRowProps> = ({
  task,
  index,
  onTaskChange,
  onTaskBlur,
  onDeleteTask,
  formatDuration,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `task-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card p-3 sm:p-6 ${task.errors && Object.keys(task.errors).length > 0 ? 'border-destructive/50 bg-destructive/5' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      {/* Task Header - Compact Single Line */}
      <div className="task-header flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 p-2 bg-muted/10 rounded-lg border border-muted/20 overflow-hidden">
        {/* Drag handle */}
        <div 
          className="task-drag-handle flex-shrink-0 p-1 rounded-md hover:bg-muted/30 transition-colors cursor-grab active:cursor-grabbing" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>

        {/* Task number */}
        <div className="task-number text-xs font-semibold text-muted-foreground bg-background px-1.5 py-0.5 rounded border shadow-sm flex-shrink-0">
          #{index + 1}
        </div>

        {/* Badges */}
        <div className="task-badges flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
          <Badge 
            variant={task.priority === 'Urgent' ? 'destructive' : task.priority === 'High' ? 'default' : 'secondary'} 
            className="text-xs px-1.5 py-0.5 font-medium flex-shrink-0"
          >
            {task.priority}
          </Badge>
          <Badge 
            variant={task.energy_required === 'High' ? 'destructive' : task.energy_required === 'Medium' ? 'default' : 'secondary'} 
            className="text-xs px-1.5 py-0.5 font-medium flex-shrink-0"
          >
            {task.energy_required}
          </Badge>
          {task.estimated_duration && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 font-medium flex-shrink-0">
              {formatDuration(task.estimated_duration)}
            </Badge>
          )}
        </div>

        {/* Delete button */}
        <button
          className="delete-task-button flex-shrink-0 p-1 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={() => onDeleteTask(index)}
          aria-label="Delete task"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Task Content */}
      <div className="task-content space-y-3 sm:space-y-4">
        {/* Description */}
        <div className="task-field">
          <label className="field-label text-xs sm:text-sm font-medium mb-1 sm:mb-2">Description</label>
          <Textarea
            value={task.description}
            onChange={(e) => onTaskChange(index, 'description', e.target.value)}
            onBlur={() => onTaskBlur(index, 'description')}
            placeholder="Enter task description..."
            className={`field-input text-xs sm:text-sm p-2 sm:p-3 ${task.errors?.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            maxLength={500}
            rows={2}
          />
          {task.errors?.description && (
            <div className="field-error text-xs p-2 mt-1">
              <AlertCircle className="h-3 w-3" />
              {task.errors.description}
            </div>
          )}
        </div>

        {/* Task Properties - Single Row Layout */}
        <div className="task-properties">
          <div className="property-group flex flex-row gap-2 sm:gap-3">
            <div className="task-field flex-1 min-w-0">
              <label className="field-label text-xs sm:text-sm font-medium mb-1">Priority</label>
              <Select
                value={task.priority}
                onValueChange={(value) => onTaskChange(index, 'priority', value)}
                onOpenChange={(open) => {
                  if (!open) onTaskBlur(index, 'priority');
                }}
              >
                <SelectTrigger className={`field-input text-xs sm:text-sm h-8 sm:h-10 ${task.errors?.priority ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              {task.errors?.priority && (
                <div className="field-error text-xs p-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {task.errors.priority}
                </div>
              )}
            </div>

            <div className="task-field flex-1 min-w-0">
              <label className="field-label text-xs sm:text-sm font-medium mb-1">Energy</label>
              <Select
                value={task.energy_required}
                onValueChange={(value) => onTaskChange(index, 'energy_required', value)}
                onOpenChange={(open) => {
                  if (!open) onTaskBlur(index, 'energy_required');
                }}
              >
                <SelectTrigger className={`field-input text-xs sm:text-sm h-8 sm:h-10 ${task.errors?.energy_required ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              {task.errors?.energy_required && (
                <div className="field-error text-xs p-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {task.errors.energy_required}
                </div>
              )}
            </div>

            <div className="task-field flex-1 min-w-0">
              <label className="field-label text-xs sm:text-sm font-medium mb-1">Duration (min)</label>
              <Input
                type="number"
                value={task.estimated_duration || ''}
                onChange={(e) => onTaskChange(index, 'estimated_duration', e.target.value ? parseInt(e.target.value) : undefined)}
                onBlur={() => onTaskBlur(index, 'estimated_duration')}
                placeholder="Enter..."
                min="1"
                max="1440"
                className={`field-input text-xs sm:text-sm h-8 sm:h-10 ${task.errors?.estimated_duration ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {task.estimated_duration && !task.errors?.estimated_duration && (
                <p className="field-hint text-xs mt-1">
                  {formatDuration(task.estimated_duration)}
                </p>
              )}
              {task.errors?.estimated_duration && (
                <div className="field-error text-xs p-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {task.errors.estimated_duration}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditableTaskList: React.FC<EditableTaskListProps> = ({ tasks, onTasksChange }) => {
  const [editedTasks, setEditedTasks] = useState<EditableGeneratedTask[]>(tasks);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update local state when props change
  useEffect(() => {
    setEditedTasks(tasks);
  }, [tasks]);

  const validateTask = (task: EditableGeneratedTask): EditableGeneratedTask => {
    const errors: TaskErrors = {};
    
    const descriptionError = validateDescription(task.description);
    if (descriptionError) errors.description = descriptionError;
    
    const priorityError = validatePriorityWithError(task.priority);
    if (priorityError) errors.priority = priorityError;
    
    const energyError = validateEnergyRequiredWithError(task.energy_required);
    if (energyError) errors.energy_required = energyError;
    
    const durationError = validateDuration(task.estimated_duration);
    if (durationError) errors.estimated_duration = durationError;
    
    return {
      ...task,
      errors: Object.keys(errors).length > 0 ? errors : undefined
    };
  };

  // Type-safe field keys for task updates
  type TaskFieldKey = 'description' | 'priority' | 'energy_required' | 'estimated_duration' | 'scheduled_for_date';
  
  const handleTaskChange = (index: number, field: TaskFieldKey, value: string | number) => {
    const updatedTasks = [...editedTasks];
    const currentTask = updatedTasks[index];
    
    // Type-safe field update
    const updatedTask: EditableGeneratedTask = {
      ...currentTask,
      [field]: value as any, // Type assertion needed due to union type
      errors: currentTask.errors ? { ...currentTask.errors } : undefined
    };
    
    // Clear the specific field error when user starts editing
    if (updatedTask.errors && field in updatedTask.errors) {
      delete updatedTask.errors[field as keyof TaskErrors];
    }
    
    updatedTasks[index] = updatedTask;
    setEditedTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  const handleTaskBlur = (index: number, field: keyof EditableGeneratedTask) => {
    const updatedTasks = [...editedTasks];
    const validatedTask = validateTask(updatedTasks[index]);
    updatedTasks[index] = validatedTask;
    
    setEditedTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = editedTasks.filter((_, i) => i !== index);
    setEditedTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[1]);
      const newIndex = parseInt(over!.id.toString().split('-')[1]);
      
      const reorderedTasks = arrayMove(editedTasks, oldIndex, newIndex);
      setEditedTasks(reorderedTasks);
      onTasksChange(reorderedTasks);
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Not set';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const hasValidationErrors = editedTasks.some(task => 
    task.errors && Object.keys(task.errors).length > 0
  );

  if (editedTasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tasks to display</p>
      </div>
    );
  }

  return (
    <div className="editable-task-list">
      {/* Task Cards with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={editedTasks.map((_, index) => `task-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="task-cards-container">
            {editedTasks.map((task, index) => (
              <SortableTaskRow
                key={`task-${index}`}
                task={task}
                index={index}
                onTaskChange={handleTaskChange}
                onTaskBlur={handleTaskBlur}
                onDeleteTask={handleDeleteTask}
                formatDuration={formatDuration}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Summary */}
      <div className="task-summary">
        <div className="summary-info">
          <span className="task-count">
            {editedTasks.length} task{editedTasks.length !== 1 ? 's' : ''} ready to create
          </span>
          {hasValidationErrors && (
            <span className="error-count">
              • {editedTasks.filter(t => t.errors && Object.keys(t.errors).length > 0).length} with errors
            </span>
          )}
        </div>
        <div className="summary-badges">
          {editedTasks.length > 0 && (
            <>
              <Badge variant="outline">
                {editedTasks.filter(t => t.priority === 'Urgent' || t.priority === 'High').length} High Priority
              </Badge>
              <Badge variant="outline">
                {editedTasks.filter(t => t.energy_required === 'High').length} High Energy
              </Badge>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableTaskList;
