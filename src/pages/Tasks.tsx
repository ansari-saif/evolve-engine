import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { LoadingSpinner, SkeletonLoader, ErrorMessage } from '../components/ui';
import { useGetUserTasks, useCreateTask, useCompleteTask } from '../hooks/useTasks';
import { useUserId } from '../contexts/AppContext';
import type { TaskResponse } from '../client/models';

const Tasks: React.FC = () => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const userId = useUserId();

  const { data: tasks, isLoading, error } = useGetUserTasks(userId);
  const createTaskMutation = useCreateTask();
  const completeTaskMutation = useCompleteTask();

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      await createTaskMutation.mutateAsync({
        description: newTaskTitle,
        priority: newTaskPriority,
        user_id: userId,
      });

      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('Medium');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>
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
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>

      {/* Create Task Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Textarea
              placeholder="Task description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                variant={newTaskPriority === 'Low' ? 'default' : 'outline'}
                onClick={() => setNewTaskPriority('Low')}
              >
                Low
              </Button>
              <Button
                variant={newTaskPriority === 'Medium' ? 'default' : 'outline'}
                onClick={() => setNewTaskPriority('Medium')}
              >
                Medium
              </Button>
              <Button
                variant={newTaskPriority === 'High' ? 'default' : 'outline'}
                onClick={() => setNewTaskPriority('High')}
              >
                High
              </Button>
            </div>
            <Button
              onClick={handleCreateTask}
              disabled={createTaskMutation.isPending || !newTaskTitle.trim()}
              className="w-full"
            >
              {createTaskMutation.isPending ? <LoadingSpinner size="small" /> : 'Create Task'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="grid gap-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task: TaskResponse) => (
            <Card key={task.task_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{task.description}</h3>
                    {task.deadline && (
                      <p className="text-sm text-gray-600 mb-2">
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'}>
                        {task.priority}
                      </Badge>
                      <Badge variant={task.completion_status === 'Completed' ? 'default' : 'outline'}>
                        {task.completion_status}
                      </Badge>
                    </div>
                  </div>
                  {task.completion_status !== 'Completed' && (
                    <Button
                      onClick={() => handleCompleteTask(task.task_id)}
                      disabled={completeTaskMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      {completeTaskMutation.isPending ? <LoadingSpinner size="small" /> : 'Complete'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found. Create your first task above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;