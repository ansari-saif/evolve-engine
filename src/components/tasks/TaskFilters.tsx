import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={filters.status} onValueChange={(value: CompletionStatusEnum | 'All') => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select value={filters.priority} onValueChange={(value: TaskPriorityEnum | 'All') => setFilters({ ...filters, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Energy</label>
            <Select value={filters.energy} onValueChange={(value: EnergyRequiredEnum | 'All') => setFilters({ ...filters, energy: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Energy Levels</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Goal</label>
            <Select value={filters.goal.toString()} onValueChange={(value) => setFilters({ ...filters, goal: value === 'All' ? 'All' : parseInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Goals</SelectItem>
                {goals?.map(goal => (
                  <SelectItem key={goal.goal_id} value={goal.goal_id.toString()}>
                    {goal.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
