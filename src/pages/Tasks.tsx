import React, { useRef, Suspense, lazy } from 'react';
import { SkeletonLoader, ErrorMessage } from '../components/ui';
import { 
  CreateTaskDialog, 
  TaskFilters, 
  type CreateTaskDialogRef 
} from '../components/tasks';
import TaskList from '../components/tasks/TaskList';

// Lazy load heavy components
const BulkCreateDialog = lazy(() => import('../components/tasks/BulkCreateDialog'));
const EditTaskDialog = lazy(() => import('../components/tasks/EditTaskDialog'));
const GenerateDailyTasksDialog = lazy(() => import('../components/tasks/GenerateDailyTasksDialog'));
import { TaskTabs } from '../components/tasks/TaskTabs';
import { TaskActions } from '../components/tasks/TaskActions';
import { useGetUserGoals } from '../hooks/useGoals';
import { useUserId } from '../hooks/redux/useAppConfig';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { useTaskUi } from '../hooks/redux/useTaskUi';
import { useVisibleTasks } from '../hooks/useVisibleTasks';
import { useAiService } from '../hooks/useAiService';
import { useToasts } from '../hooks/redux/useToasts';
import type { TaskCreate, PhaseEnum, TaskPriorityEnum, EnergyRequiredEnum } from '../client/models';
import type { GeneratedTask } from '../store/types';

/**
 * Tasks page component
 * Refactored to follow SOLID principles by using custom hooks and smaller components
 */
const Tasks: React.FC = () => {
  const createTaskDialogRef = useRef<CreateTaskDialogRef>(null);
  const userId = useUserId();

  // Custom hooks for different concerns
  const taskUi = useTaskUi();
  const { taskGroups, isLoading, error } = useVisibleTasks();
  const { data: goals } = useGetUserGoals(userId);
  const { generateDailyTasks } = useAiService();
  const taskOperations = useTaskOperations(userId);
  const { clearToasts } = useToasts();

  // taskGroups provided by useVisibleTasks

  // Event handlers
  const handleCreateTask = async (task: TaskCreate) => {
    await taskOperations.createTask(task);
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
    <div className="container mx-auto p-6 space-y-6 text-foreground">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      {/* Task Actions */}
      <TaskActions
        onCreateTask={() => createTaskDialogRef.current?.open()}
        onGenerateTasks={taskUi.openGenerate}
        onCreateBulk={() => {/* Handle bulk create */}}
        onClearToasts={clearToasts}
        isLoading={taskOperations.isLoading.create}
      />

      {/* Task Filters */}
      <TaskFilters
        filters={taskUi.filters}
        setFilters={taskUi.updateFilters}
        goals={goals || []}
      />

      {/* Task Tabs and List */}
      <TaskTabs
        activeTab={taskUi.activeTab}
        onTabChange={taskUi.handleTabChange}
        taskGroups={taskGroups}
      >
        {(tasks) => (
          <TaskList />
        )}
      </TaskTabs>

      {/* Dialogs */}
      <CreateTaskDialog
        ref={createTaskDialogRef}
        onCreateTask={handleCreateTask}
        goals={goals || []}
        isLoading={taskOperations.isLoading.create}
      />

      {taskUi.editingTask && (
        <Suspense fallback={<div>Loading dialog...</div>}>
          <EditTaskDialog
            task={taskUi.editingTask}
            onCancel={taskUi.endEditing}
            onSave={async (taskId, updates) => {
              try {
                await taskOperations.updateTask(taskId, updates);
                taskUi.endEditing(); // Close dialog after successful update
              } catch (error) {
                // Error is already handled by taskOperations.updateTask
                // Dialog will stay open so user can fix the error
              }
            }}
            goals={goals || []}
            isLoading={taskOperations.isLoading.update}
          />
        </Suspense>
      )}

      {taskUi.generateDialogOpen && (
        <Suspense fallback={<div>Loading dialog...</div>}>
          <GenerateDailyTasksDialog
            open={taskUi.generateDialogOpen}
            onClose={taskUi.closeGenerate}
            onGenerate={handleGenerateTasks}
            onCreateTasks={handleCreateGeneratedTasks}
            isLoading={taskOperations.isLoading.bulkCreate}
          />
        </Suspense>
      )}

      <Suspense fallback={<div>Loading dialog...</div>}>
        <BulkCreateDialog
          onCreateTasks={taskOperations.createBulkTasks}
          goals={goals || []}
          isLoading={taskOperations.isLoading.bulkCreate}
        />
      </Suspense>
    </div>
  );
};

export default Tasks;