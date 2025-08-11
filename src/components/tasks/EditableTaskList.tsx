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

interface GeneratedTask {
  description: string;
  priority: string;
  energy_required: string;
  estimated_duration?: number;
  scheduled_for_date?: string;
  errors?: {
    description?: string;
    priority?: string;
    energy_required?: string;
    estimated_duration?: string;
  };
}

interface EditableTaskListProps {
  tasks: GeneratedTask[];
  onTasksChange: (tasks: GeneratedTask[]) => void;
}

// Validation functions
const validateDescription = (value: string): string | null => {
  if (!value.trim()) {
    return 'Description cannot be empty';
  }
  if (value.length > 500) {
    return 'Description must be less than 500 characters';
  }
  return null;
};

const validatePriority = (value: string): string | null => {
  const validPriorities = ['Urgent', 'High', 'Medium', 'Low'];
  if (!validPriorities.includes(value)) {
    return 'Priority must be one of: Urgent, High, Medium, Low';
  }
  return null;
};

const validateEnergyRequired = (value: string): string | null => {
  const validEnergyLevels = ['High', 'Medium', 'Low'];
  if (!validEnergyLevels.includes(value)) {
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
  task: GeneratedTask;
  index: number;
  onTaskChange: (index: number, field: keyof GeneratedTask, value: string | number) => void;
  onTaskBlur: (index: number, field: keyof GeneratedTask) => void;
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
      className={`task-card ${task.errors && Object.keys(task.errors).length > 0 ? 'border-destructive/50 bg-destructive/5' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      {/* Task Header */}
      <div className="task-header">
        <div className="task-drag-handle" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="task-number">#{index + 1}</div>
        <div className="task-badges">
          <Badge variant={task.priority === 'Urgent' ? 'destructive' : task.priority === 'High' ? 'default' : 'secondary'}>
            {task.priority}
          </Badge>
          <Badge variant={task.energy_required === 'High' ? 'destructive' : task.energy_required === 'Medium' ? 'default' : 'secondary'}>
            {task.energy_required} Energy
          </Badge>
          {task.estimated_duration && (
            <Badge variant="outline">
              {formatDuration(task.estimated_duration)}
            </Badge>
          )}
        </div>
        <button
          className="delete-task-button"
          onClick={() => onDeleteTask(index)}
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Task Content */}
      <div className="task-content">
        {/* Description */}
        <div className="task-field">
          <label className="field-label">Description</label>
          <Textarea
            value={task.description}
            onChange={(e) => onTaskChange(index, 'description', e.target.value)}
            onBlur={() => onTaskBlur(index, 'description')}
            placeholder="Enter task description..."
            className={`field-input ${task.errors?.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            maxLength={500}
            rows={3}
          />
          {task.errors?.description && (
            <div className="field-error">
              <AlertCircle className="h-3 w-3" />
              {task.errors.description}
            </div>
          )}
        </div>

        {/* Task Properties */}
        <div className="task-properties">
          <div className="property-group">
            <div className="task-field">
              <label className="field-label">Priority</label>
              <Select
                value={task.priority}
                onValueChange={(value) => onTaskChange(index, 'priority', value)}
                onOpenChange={(open) => {
                  if (!open) onTaskBlur(index, 'priority');
                }}
              >
                <SelectTrigger className={`field-input ${task.errors?.priority ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
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
                <div className="field-error">
                  <AlertCircle className="h-3 w-3" />
                  {task.errors.priority}
                </div>
              )}
            </div>

            <div className="task-field">
              <label className="field-label">Energy Required</label>
              <Select
                value={task.energy_required}
                onValueChange={(value) => onTaskChange(index, 'energy_required', value)}
                onOpenChange={(open) => {
                  if (!open) onTaskBlur(index, 'energy_required');
                }}
              >
                <SelectTrigger className={`field-input ${task.errors?.energy_required ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              {task.errors?.energy_required && (
                <div className="field-error">
                  <AlertCircle className="h-3 w-3" />
                  {task.errors.energy_required}
                </div>
              )}
            </div>

            <div className="task-field">
              <label className="field-label">Duration (minutes)</label>
              <Input
                type="number"
                value={task.estimated_duration || ''}
                onChange={(e) => onTaskChange(index, 'estimated_duration', e.target.value ? parseInt(e.target.value) : undefined)}
                onBlur={() => onTaskBlur(index, 'estimated_duration')}
                placeholder="Enter duration..."
                min="1"
                max="1440"
                className={`field-input ${task.errors?.estimated_duration ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {task.estimated_duration && !task.errors?.estimated_duration && (
                <p className="field-hint">
                  {formatDuration(task.estimated_duration)}
                </p>
              )}
              {task.errors?.estimated_duration && (
                <div className="field-error">
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
  const [editedTasks, setEditedTasks] = useState<GeneratedTask[]>(tasks);

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

  const validateTask = (task: GeneratedTask): GeneratedTask => {
    const errors: GeneratedTask['errors'] = {};
    
    const descriptionError = validateDescription(task.description);
    if (descriptionError) errors.description = descriptionError;
    
    const priorityError = validatePriority(task.priority);
    if (priorityError) errors.priority = priorityError;
    
    const energyError = validateEnergyRequired(task.energy_required);
    if (energyError) errors.energy_required = energyError;
    
    const durationError = validateDuration(task.estimated_duration);
    if (durationError) errors.estimated_duration = durationError;
    
    return { ...task, errors };
  };

  const handleTaskChange = (index: number, field: keyof GeneratedTask, value: string | number) => {
    const updatedTasks = [...editedTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value,
      errors: { ...updatedTasks[index].errors } // Preserve other errors
    };
    
    // Clear the specific field error when user starts editing
    if (updatedTasks[index].errors) {
      const fieldKey = field as 'description' | 'priority' | 'energy_required' | 'estimated_duration';
      delete updatedTasks[index].errors[fieldKey];
    }
    
    setEditedTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  const handleTaskBlur = (index: number, field: keyof GeneratedTask) => {
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
