import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { LoadingSpinner, SkeletonLoader, ErrorMessage } from '../components/ui';
import { useGetUserGoals, useCreateGoal } from '../hooks/useGoals';
import { useUserId } from '../contexts/AppContext';
import type { GoalResponse } from '../client/models';

const Goals: React.FC = () => {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalType, setNewGoalType] = useState<'Yearly' | 'Quarterly' | 'Monthly' | 'Weekly'>('Monthly');
  const [newGoalPriority, setNewGoalPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const userId = useUserId();

  const { data: goals, isLoading, error } = useGetUserGoals(userId);
  const createGoalMutation = useCreateGoal();

  const handleCreateGoal = async () => {
    if (!newGoalTitle.trim()) return;

    try {
      await createGoalMutation.mutateAsync({
        description: newGoalTitle,
        type: newGoalType,
        priority: newGoalPriority,
        phase: 'Research', // Default phase
        user_id: userId,
      });

      setNewGoalTitle('');
      setNewGoalDescription('');
      setNewGoalType('Monthly');
      setNewGoalPriority('Medium');
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Goals</h1>
        <div className="grid gap-4">
          <SkeletonLoader count={3} className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Goals</h1>
        <ErrorMessage message="Failed to load goals. Please try again." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Goals</h1>

      {/* Create Goal Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Goal title"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
            />
            <Textarea
              placeholder="Goal description (optional)"
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  value={newGoalType}
                  onChange={(e) => setNewGoalType(e.target.value as 'Yearly' | 'Quarterly' | 'Monthly' | 'Weekly')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Yearly">Yearly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <select
                  value={newGoalPriority}
                  onChange={(e) => setNewGoalPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <Button
              onClick={handleCreateGoal}
              disabled={createGoalMutation.isPending || !newGoalTitle.trim()}
              className="w-full"
            >
              {createGoalMutation.isPending ? <LoadingSpinner size="small" /> : 'Create Goal'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid gap-4">
        {goals && goals.length > 0 ? (
          goals.map((goal: GoalResponse) => (
            <Card key={goal.goal_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{goal.description}</h3>
                    {goal.deadline && (
                      <p className="text-sm text-gray-600 mb-2">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline">{goal.type}</Badge>
                      <Badge variant={goal.priority === 'High' ? 'destructive' : 'secondary'}>
                        {goal.priority}
                      </Badge>
                      <Badge variant="outline">{goal.phase}</Badge>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.completion_percentage || 0}% complete</span>
                  </div>
                  <Progress value={goal.completion_percentage || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No goals found. Create your first goal above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;