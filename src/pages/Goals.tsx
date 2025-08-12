import React, { useState, useEffect } from 'react';
import { useDebouncedSearch } from '../hooks/use-debounced-search';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { LoadingSpinner, SkeletonLoader, ErrorMessage, SkeletonGoalList } from '../components/ui';
import { useGetUserGoals, useCreateGoal } from '../hooks/useGoals';
import { useUserId } from '../contexts/AppContext';
import { performanceMetrics } from '../utils/performance';
import type { GoalResponse } from '../client/models';

const Goals: React.FC = () => {
  const startTime = performance.now();
  
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalType, setNewGoalType] = useState<'Yearly' | 'Quarterly' | 'Monthly' | 'Weekly'>('Monthly');
  const [newGoalPriority, setNewGoalPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const { searchTerm, debouncedSearchTerm, handleSearchChange, clearSearch } = useDebouncedSearch(300);

  const userId = useUserId();

  const { data: goals, isLoading, error } = useGetUserGoals(userId);
  const createGoalMutation = useCreateGoal();

  // Performance tracking
  useEffect(() => {
    performanceMetrics.componentRender('Goals', startTime);
  }, [startTime]);

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
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Goals</h1>
        <SkeletonGoalList count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Goals</h1>
        <ErrorMessage message="Failed to load goals. Please try again." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6" role="main" aria-labelledby="goals-heading">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6" id="goals-heading">Goals</h1>

      {/* Search Goals */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full p-2 sm:p-3 border-2 border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Create Goal Form */}
      <Card className="mb-4 sm:mb-6 border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/30 transition-colors">
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg flex items-center gap-2">
            <span className="text-primary">✨</span>
            Create New Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">Goal Title *</label>
              <Input
                placeholder="Enter your goal title..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="text-xs sm:text-sm border-2 focus:border-primary"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">Description (Optional)</label>
              <Textarea
                placeholder="Describe your goal in detail..."
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                rows={2}
                className="text-xs sm:text-sm border-2 focus:border-primary resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Goal Type</label>
                <div className="relative">
                  <select
                    value={newGoalType}
                    onChange={(e) => setNewGoalType(e.target.value as 'Yearly' | 'Quarterly' | 'Monthly' | 'Weekly')}
                    className="w-full p-2 sm:p-2.5 border-2 border-input bg-background text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="Yearly">📅 Yearly</option>
                    <option value="Quarterly">📊 Quarterly</option>
                    <option value="Monthly">📆 Monthly</option>
                    <option value="Weekly">📅 Weekly</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium text-muted-foreground">Priority</label>
                <div className="relative">
                  <select
                    value={newGoalPriority}
                    onChange={(e) => setNewGoalPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full p-2 sm:p-2.5 border-2 border-input bg-background text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleCreateGoal}
              disabled={createGoalMutation.isPending || !newGoalTitle.trim()}
              className="w-full text-xs sm:text-sm py-2.5 sm:py-3 min-h-[40px] sm:min-h-[44px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {createGoalMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🚀</span>
                  <span>Create Goal</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid gap-3 sm:gap-4">
        {goals && goals.length > 0 ? (
          goals
            .filter((goal: GoalResponse) => 
              !debouncedSearchTerm || 
              goal.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
            .map((goal: GoalResponse) => (
            <Card key={goal.goal_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2">{goal.description}</h3>
                    {goal.deadline && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0.5">{goal.type}</Badge>
                      <Badge variant={goal.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px] sm:text-xs px-1.5 py-0.5">
                        {goal.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0.5">{goal.phase}</Badge>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.completion_percentage || 0}% complete</span>
                  </div>
                  <Progress value={goal.completion_percentage || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-xs sm:text-sm text-gray-500">No goals found. Create your first goal above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;