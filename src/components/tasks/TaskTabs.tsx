import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { TaskResponse } from '../../client/models';

interface TaskTabsProps {
  activeTab: 'all' | 'pending' | 'in-progress' | 'completed';
  onTabChange: (tab: 'all' | 'pending' | 'in-progress' | 'completed') => void;
  taskGroups: {
    all: TaskResponse[];
    pending: TaskResponse[];
    'in-progress': TaskResponse[];
    completed: TaskResponse[];
  };
  children: (tasks: TaskResponse[]) => React.ReactNode;
}

/**
 * TaskTabs component for managing task tabs
 * Follows Single Responsibility Principle by handling only tab management
 */
export const TaskTabs: React.FC<TaskTabsProps> = ({
  activeTab,
  onTabChange,
  taskGroups,
  children,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'all' | 'pending' | 'in-progress' | 'completed')}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">
          All ({taskGroups.all.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({taskGroups.pending.length})
        </TabsTrigger>
        <TabsTrigger value="in-progress">
          In Progress ({taskGroups['in-progress'].length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({taskGroups.completed.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        {children(taskGroups.all)}
      </TabsContent>
      
      <TabsContent value="pending" className="mt-6">
        {children(taskGroups.pending)}
      </TabsContent>
      
      <TabsContent value="in-progress" className="mt-6">
        {children(taskGroups['in-progress'])}
      </TabsContent>
      
      <TabsContent value="completed" className="mt-6">
        {children(taskGroups.completed)}
      </TabsContent>
    </Tabs>
  );
};
