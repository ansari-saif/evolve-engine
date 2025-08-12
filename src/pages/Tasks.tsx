import React, { useMemo, useRef } from 'react';
import { SkeletonLoader, ErrorMessage } from '../components/ui';
import { 
  CreateTaskDialog, 
  BulkCreateDialog, 
  EditTaskDialog, 
  TaskFilters, 
  GenerateDailyTasksDialog, 
  type CreateTaskDialogRef 
} from '../components/tasks';
import { TaskList } from '../components/tasks/TaskList';
import { TaskTabs } from '../components/tasks/TaskTabs';
import { TaskActions } from '../components/tasks/TaskActions';
import { useGetUserTasks } from '../hooks/useTasks';
import { useGetUserGoals } from '../hooks/useGoals';
import { useUserId } from '../hooks/redux/useAppConfig';
import { useTaskFiltering } from '../hooks/useTaskFiltering';
import { useTaskSorting } from '../hooks/useTaskSorting';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { useTaskState } from '../hooks/useTaskState';
import { useAiService } from '../hooks/useAiService';
import type { TaskResponse, TaskCreate, PhaseEnum, TaskPriorityEnum, EnergyRequiredEnum } from '../client/models';
import type { GeneratedTask } from '../store/types';

/**
 * Tasks page component
 * Refactored to follow SOLID principles by using custom hooks and smaller components
 */
const Tasks: React.FC = () => {
  const createTaskDialogRef = useRef<CreateTaskDialogRef>(null);
  const userId = useUserId();

  // Custom hooks for different concerns
  const taskState = useTaskState();
  const { data: tasks, isLoading, error } = useGetUserTasks(userId);
  const { data: goals } = useGetUserGoals(userId);
  const { generateDailyTasks } = useAiService();
  const taskOperations = useTaskOperations(userId);

  // Filter and sort tasks
  const filteredTasks = useTaskFiltering(tasks, taskState.filters);
  const sortedTasks = useTaskSorting(filteredTasks);

  // Group tasks by status for tabs
  const taskGroups = useMemo(() => ({
    all: sortedTasks,
    pending: sortedTasks.filter(t => t.completion_status === 'Pending'),
    'in-progress': sortedTasks.filter(t => t.completion_status === 'In Progress'),
    completed: sortedTasks.filter(t => t.completion_status === 'Completed')
  }), [sortedTasks]);

  // Event handlers
  const handleCreateTask = async (task: TaskCreate) => {
    await taskOperations.createTask(task);
  };

  const handleTaskComplete = async (taskId: number) => {
    taskState.setTaskLoading(taskId);
    await taskOperations.completeTask(taskId);
    taskState.setTaskLoading(null);
  };

  const handleTaskEdit = (task: TaskResponse) => {
    taskState.startEditing(task);
  };

  const handleTaskDelete = async (taskId: number) => {
    taskState.setTaskLoading(taskId);
    await taskOperations.deleteTask(taskId);
    taskState.setTaskLoading(null);
  };

  const handleGenerateTasks = async (params: { energyLevel: number; currentPhase: PhaseEnum | null }): Promise<GeneratedTask[]> => {
    try {
      const response = await generateDailyTasks.mutateAsync({
        user_id: userId,
        energy_level: params.energyLevel,
        current_phase: params.currentPhase || undefined
      });
      
      // Convert AI response to GeneratedTask objects
      const generatedTasks: GeneratedTask[] = response.map((taskData: Record<string, unknown>) => ({
        description: String(taskData.description || taskData.title || 'Generated Task'),
        priority: String(taskData.priority || 'Medium'),
        energy_required: String(taskData.energy_required || 'Medium'),
        estimated_duration: taskData.estimated_duration ? Number(taskData.estimated_duration) : undefined,
        goal_id: taskData.goal_id ? Number(taskData.goal_id) : undefined,
      }));

      return generatedTasks;
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      throw error;
    }
  };

  const handleCreateGeneratedTasks = async (generatedTasks: GeneratedTask[]) => {
    try {
      // Convert the generated tasks to TaskCreate objects
      const taskCreateObjects: TaskCreate[] = generatedTasks.map((taskData) => ({
        description: taskData.description,
        priority: (taskData.priority as TaskPriorityEnum) || 'Medium',
        completion_status: 'Pending',
        energy_required: (taskData.energy_required as EnergyRequiredEnum) || 'Medium',
        estimated_duration: taskData.estimated_duration || null,
        scheduled_for_date: null,
        user_id: userId,
        goal_id: taskData.goal_id || null,
        ai_generated: true
      }));

      await taskOperations.createBulkTasks(taskCreateObjects);
    } catch (error) {
      console.error('Failed to create generated tasks:', error);
    }
  };

  // Error handling
  if (error) {
    return <ErrorMessage message="Failed to load tasks" />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      {/* Task Actions */}
      <TaskActions
        onCreateTask={() => createTaskDialogRef.current?.open()}
        onGenerateTasks={taskState.openGenerateDialog}
        onCreateBulk={() => {/* Handle bulk create */}}
        isLoading={taskOperations.isLoading.create}
      />

      {/* Task Filters */}
      <TaskFilters
        filters={taskState.filters}
        setFilters={taskState.updateFilters}
        goals={goals || []}
      />

      {/* Task Tabs and List */}
      <TaskTabs
        activeTab={taskState.activeTab}
        onTabChange={taskState.handleTabChange}
        taskGroups={taskGroups}
      >
        {(tasks) => (
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onTaskComplete={handleTaskComplete}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            loadingTaskId={taskState.loadingTaskId}
          />
        )}
      </TaskTabs>

      {/* Dialogs */}
      <CreateTaskDialog
        ref={createTaskDialogRef}
        onCreateTask={handleCreateTask}
        goals={goals || []}
        isLoading={taskOperations.isLoading.create}
      />

      <EditTaskDialog
        task={taskState.editingTask}
        onCancel={taskState.stopEditing}
        onSave={(taskId, updates) => taskOperations.updateTask(taskId, updates)}
        goals={goals || []}
        isLoading={taskOperations.isLoading.update}
      />

      <GenerateDailyTasksDialog
        open={taskState.generateDialogOpen}
        onClose={taskState.closeGenerateDialog}
        onGenerate={handleGenerateTasks}
        onCreateTasks={handleCreateGeneratedTasks}
        isLoading={taskOperations.isLoading.bulkCreate}
      />

      <BulkCreateDialog
        onCreateTasks={taskOperations.createBulkTasks}
        goals={goals || []}
        isLoading={taskOperations.isLoading.bulkCreate}
      />
    </div>
  );
};

export default Tasks;