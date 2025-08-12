import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Filter } from 'lucide-react';
import type { CompletionStatusEnum, TaskPriorityEnum, EnergyRequiredEnum } from '../../client/models';
import type { GoalResponse } from '../../client/models';
import type { TaskFilter } from '../../types/app';

interface TaskFiltersProps {
  filters: TaskFilter;
  setFilters: (filters: TaskFilter) => void;
  goals: GoalResponse[] | undefined;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  setFilters,
  goals
}) => {
  const handleStatusChange = (value: string) => {
    setFilters({ 
      ...filters, 
      status: value as CompletionStatusEnum | 'All'
    });
  };

  const handlePriorityChange = (value: string) => {
    setFilters({ 
      ...filters, 
      priority: value as TaskPriorityEnum | 'All'
    });
  };

  const handleEnergyChange = (value: string) => {
    setFilters({ 
      ...filters, 
      energy: value as EnergyRequiredEnum | 'All'
    });
  };

  const handleGoalChange = (value: string) => {
    setFilters({ 
      ...filters, 
      goal: value === 'All' ? 'All' : parseInt(value, 10)
    });
  };

  return (
    <div className="bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Filter Tasks</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div>
          <label className="text-xs font-medium mb-1 block text-foreground/80">Status</label>
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8 text-xs bg-background/80 border-border/60 hover:bg-background/90">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">All</SelectItem>
              <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
              <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
              <SelectItem value="Completed" className="text-xs">Completed</SelectItem>
              <SelectItem value="Cancelled" className="text-xs">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-xs font-medium mb-1 block text-foreground/80">Priority</label>
          <Select value={filters.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="h-8 text-xs bg-background/80 border-border/60 hover:bg-background/90">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">All</SelectItem>
              <SelectItem value="Urgent" className="text-xs">Urgent</SelectItem>
              <SelectItem value="High" className="text-xs">High</SelectItem>
              <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
              <SelectItem value="Low" className="text-xs">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-xs font-medium mb-1 block text-foreground/80">Energy</label>
          <Select value={filters.energy} onValueChange={handleEnergyChange}>
            <SelectTrigger className="h-8 text-xs bg-background/80 border-border/60 hover:bg-background/90">
              <SelectValue placeholder="All Energy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">All</SelectItem>
              <SelectItem value="High" className="text-xs">High</SelectItem>
              <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
              <SelectItem value="Low" className="text-xs">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-xs font-medium mb-1 block text-foreground/80">Goal</label>
          <Select value={filters.goal.toString()} onValueChange={handleGoalChange}>
            <SelectTrigger className="h-8 text-xs bg-background/80 border-border/60 hover:bg-background/90">
              <SelectValue placeholder="All Goals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">All</SelectItem>
              {goals?.map((goal) => (
                <SelectItem key={goal.goal_id} value={goal.goal_id.toString()} className="text-xs">
                  {goal.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;