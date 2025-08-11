import React, { useState, useMemo, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SkeletonLoader, ErrorMessage } from '../components/ui';
import { TaskCard, CreateTaskDialog, BulkCreateDialog, EditTaskDialog, TaskFilters, GenerateDailyTasksDialog, type CreateTaskDialogRef } from '../components/tasks';
import { useGetUserTasks, useCreateTask, useUpdateTask, useCompleteTask, useDeleteTask, useCreateBulkTasks } from '../hooks/useTasks';
import { useGetUserGoals } from '../hooks/useGoals';
import { useUserId } from '../contexts/AppContext';
import { formatDateIST, getCurrentISOStringIST } from '../utils/timeUtils';
import { Button } from '../components/ui/button';
import { Sparkles } from 'lucide-react';
import { useAiService } from '../hooks/useAiService';
import { useToast } from '../hooks/use-toast';
import type { TaskResponse, TaskCreate, TaskUpdate, TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum, PhaseEnum } from '../client/models';
import type { TaskFilter } from '../types/app';

const Tasks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilter>({
    status: 'All',
    priority: 'All',
    energy: 'All',
    goal: 'All'
  });

  const createTaskDialogRef = useRef<CreateTaskDialogRef>(null);

  const userId = useUserId();

  // Data fetching
  const { data: tasks, isLoading, error } = useGetUserTasks(userId);
  const { data: goals } = useGetUserGoals(userId);
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const completeTaskMutation = useCompleteTask();
  const deleteTaskMutation = useDeleteTask();
  const createBulkTasksMutation = useCreateBulkTasks();
  
  // AI Service
  const { generateDailyTasks } = useAiService();
  const { toast } = useToast();

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    const filtered = tasks.filter(task => {
      if (filters.status !== 'All' && task.completion_status !== filters.status) return false;
      if (filters.priority !== 'All' && task.priority !== filters.priority) return false;
      if (filters.energy !== 'All' && task.energy_required !== filters.energy) return false;
      if (filters.goal !== 'All' && task.goal_id !== filters.goal) return false;
      return true;
    });

    // Sort by priority, then by scheduled date, then by creation date
    const sorted = [...filtered].sort((a, b) => {
      const priorityOrder = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
      const aPriority = priorityOrder[a.priority || 'Medium'];
      const bPriority = priorityOrder[b.priority || 'Medium'];
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      if (a.scheduled_for_date && b.scheduled_for_date) {
        return new Date(a.scheduled_for_date).getTime() - new Date(b.scheduled_for_date).getTime();
      }
      
      return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
    });

    return sorted;
  }, [tasks, filters]);

  // Group tasks by status for tabs
  const taskGroups = useMemo(() => {
    const groups = {
      all: filteredTasks,
      pending: filteredTasks.filter(t => t.completion_status === 'Pending'),
      'in-progress': filteredTasks.filter(t => t.completion_status === 'In Progress'),
      completed: filteredTasks.filter(t => t.completion_status === 'Completed')
    };
    return groups;
  }, [filteredTasks]);

  const handleCreateTask = async (task: TaskCreate) => {
    try {
      await createTaskMutation.mutateAsync({
        ...task,
        user_id: userId,
      });
    } catch (error) {
      try {
        console.error('Failed to create task:', error instanceof Error ? error.message : 'Unknown error');
      } catch (logError) {
        console.error('Failed to create task: (Error logging failed)');
      }
    }
  };

  const handleBulkCreateTasks = async (tasks: TaskCreate[]) => {
    try {
      // Create tasks sequentially to avoid overwhelming the API
      for (const task of tasks) {
        await createTaskMutation.mutateAsync({
          ...task,
          user_id: userId,
        });
      }
    } catch (error) {
      try {
        console.error('Failed to create bulk tasks:', error instanceof Error ? error.message : 'Unknown error');
      } catch (logError) {
        console.error('Failed to create bulk tasks: (Error logging failed)');
      }
    }
  };

  const handleUpdateTask = async (taskId: number, updates: TaskUpdate) => {
    try {
      await updateTaskMutation.mutateAsync({ id: taskId, data: updates });
      setEditingTask(null);
    } catch (error) {
      try {
        console.error('Failed to update task:', error instanceof Error ? error.message : 'Unknown error');
      } catch (logError) {
        console.error('Failed to update task: (Error logging failed)');
      }
    }
  };

  const handleStatusChange = async (taskId: number, status: CompletionStatusEnum) => {
    const updates: TaskUpdate = { completion_status: status };
    
    if (status === 'In Progress') {
      updates.started_at = getCurrentISOStringIST();
    } else if (status === 'Completed') {
      updates.completed_at = getCurrentISOStringIST();
    }

    await handleUpdateTask(taskId, updates);
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
    } catch (error) {
      try {
        console.error('Failed to complete task:', error instanceof Error ? error.message : 'Unknown error');
      } catch (logError) {
        console.error('Failed to complete task: (Error logging failed)');
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      try {
        console.error('Failed to delete task:', error instanceof Error ? error.message : 'Unknown error');
      } catch (logError) {
        console.error('Failed to delete task: (Error logging failed)');
      }
    }
  };

  const handleOpenGenerateDialog = () => {
    setGenerateDialogOpen(true);
  };

  const handleGenerateTasks = async (params: { energyLevel: number; currentPhase: PhaseEnum | null }) => {
    try {
      // Call the AI service to generate tasks
      const response = await generateDailyTasks.mutateAsync({
        user_id: userId,
        energy_level: params.energyLevel,
        current_phase: params.currentPhase || undefined
      });

      // Convert the AI response to TaskCreate objects
      const taskCreateObjects: TaskCreate[] = response.map((taskData: Record<string, unknown>) => {
        // Map AI response fields to TaskCreate structure
        const description = String(taskData.description || taskData.title || 'Generated Task');
        const priority = taskData.priority ? String(taskData.priority) : 'Medium';
        const energyRequired = taskData.energy_required ? String(taskData.energy_required) : 'Medium';
        const estimatedDuration = taskData.estimated_duration ? Number(taskData.estimated_duration) : null;
        const scheduledForDate = taskData.scheduled_for_date ? String(taskData.scheduled_for_date) : null;

        return {
          description,
          priority: priority as TaskPriorityEnum,
          completion_status: 'Pending',
          energy_required: energyRequired as EnergyRequiredEnum,
          estimated_duration: estimatedDuration,
          scheduled_for_date: scheduledForDate,
          user_id: userId,
          goal_id: null,
          ai_generated: true
        };
      });

      // Use bulk create to save the generated tasks
      await createBulkTasksMutation.mutateAsync({
        tasks: taskCreateObjects
      });

      // Show success notification
      toast({
        title: "Tasks Generated Successfully",
        description: `Generated ${taskCreateObjects.length} daily tasks based on your energy level and phase.`,
      });

      // Close the dialog
      setGenerateDialogOpen(false);
    } catch (error) {
      // Log error safely
      try {
        console.error('Failed to generate daily tasks:', error instanceof Error ? error.message : 'Unknown error');
      } catch (logError) {
        console.error('Failed to generate daily tasks: (Error logging failed)');
      }
      
      toast({
        title: "Failed to Generate Tasks",
        description: "There was an error generating your daily tasks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: TaskPriorityEnum): "destructive" | "secondary" | "outline" | "default" => {
    switch (priority) {
      case 'Urgent': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: CompletionStatusEnum): "destructive" | "secondary" | "outline" | "default" => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getEnergyColor = (energy: EnergyRequiredEnum): "destructive" | "secondary" | "outline" | "default" => {
    switch (energy) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string | null) => {
    return formatDateIST(dateString);
  };

  const formatDuration = (minutes: number | null) => {
    if (minutes === null || minutes === undefined) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <SkeletonLoader className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          <SkeletonLoader count={3} className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>
        <ErrorMessage message="Failed to load tasks. Please try again." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleOpenGenerateDialog}
            disabled={generateDailyTasks.isPending || createBulkTasksMutation.isPending}
            className="flex items-center gap-2"
          >
            {generateDailyTasks.isPending || createBulkTasksMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Daily Tasks
              </>
            )}
          </Button>
          <BulkCreateDialog
            goals={goals}
            onCreateTasks={handleBulkCreateTasks}
            isLoading={createTaskMutation.isPending}
          />
          <CreateTaskDialog
            ref={createTaskDialogRef}
            goals={goals}
            onCreateTask={handleCreateTask}
            isLoading={createTaskMutation.isPending}
          />
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        setFilters={setFilters}
        goals={goals}
      />

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'pending' | 'in-progress' | 'completed')}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({taskGroups.all.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({taskGroups.pending.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({taskGroups['in-progress'].length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({taskGroups.completed.length})</TabsTrigger>
        </TabsList>

        {(['all', 'pending', 'in-progress', 'completed'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-4">
              {taskGroups[tab].length > 0 ? (
                taskGroups[tab].map((task: TaskResponse) => (
                  <TaskCard
                    key={task.task_id}
                    task={task}
                    goals={goals || []}
                    onStatusChange={handleStatusChange}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    onEdit={setEditingTask}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                    getEnergyColor={getEnergyColor}
                    formatDate={formatDate}
                    formatDuration={formatDuration}
                    isLoading={completeTaskMutation.isPending || deleteTaskMutation.isPending}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No tasks found. Create your first task above!</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Task Dialog */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          goals={goals || []}
          onSave={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          isLoading={updateTaskMutation.isPending}
        />
      )}

      {/* Generate Daily Tasks Dialog */}
      <GenerateDailyTasksDialog
        open={generateDialogOpen}
        onClose={() => setGenerateDialogOpen(false)}
        onGenerate={handleGenerateTasks}
        isLoading={generateDailyTasks.isPending || createBulkTasksMutation.isPending}
      />
    </div>
  );
};

export default Tasks;