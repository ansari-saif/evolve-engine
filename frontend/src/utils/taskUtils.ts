import type { TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum } from '../client/models';
import { formatDateIST } from './timeUtils';

/**
 * Utility functions for task formatting and styling
 * Follows Single Responsibility Principle by handling only task-related utilities
 */

/**
 * Format duration in minutes to human-readable format
 */
export const formatDuration = (duration: number | null): string | null => {
  if (duration === null || duration === undefined) return null;
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format date for display
 */
export const formatDate = (date: string | null): string | null => {
  if (!date) return null;
  return formatDateIST(date);
};

/**
 * Get priority color variant for badges
 */
export const getPriorityColor = (priority: TaskPriorityEnum): "destructive" | "secondary" | "outline" | "default" => {
  switch (priority) {
    case 'Urgent': return 'destructive';
    case 'High': return 'default';
    case 'Medium': return 'secondary';
    case 'Low': return 'outline';
    default: return 'secondary';
  }
};

/**
 * Get status color variant for badges
 */
export const getStatusColor = (status: CompletionStatusEnum): "destructive" | "secondary" | "outline" | "default" => {
  switch (status) {
    case 'Completed': return 'default';
    case 'In Progress': return 'default';
    case 'Pending': return 'secondary';
    case 'Cancelled': return 'destructive';
    default: return 'secondary';
  }
};

/**
 * Get energy color variant for badges
 */
export const getEnergyColor = (energy: EnergyRequiredEnum): "destructive" | "secondary" | "outline" | "default" => {
  switch (energy) {
    case 'High': return 'destructive';
    case 'Medium': return 'default';
    case 'Low': return 'secondary';
    default: return 'secondary';
  }
};

/**
 * Get priority border color for task cards
 */
export const getPriorityBorderColor = (priority: TaskPriorityEnum): string => {
  switch (priority) {
    case 'Urgent': return 'border-l-destructive';
    case 'High': return 'border-l-warning';
    case 'Medium': return 'border-l-primary';
    case 'Low': return 'border-l-success';
    default: return 'border-l-primary';
  }
};

/**
 * Get priority badge classes for styling
 */
export const getPriorityBadgeClasses = (priority: TaskPriorityEnum): string => {
  switch (priority) {
    case 'Urgent': 
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'High':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'Medium':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Low':
      return 'bg-success/10 text-success border-success/20';
    default:
      return 'bg-primary/10 text-primary border-primary/20';
  }
};

/**
 * Get status badge classes for styling
 */
export const getStatusBadgeClasses = (status: CompletionStatusEnum): string => {
  switch (status) {
    case 'Completed': 
      return 'bg-success/10 text-success border-success/20';
    case 'In Progress':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Pending':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'Cancelled':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-warning/10 text-warning border-warning/20';
  }
};

/**
 * Get energy badge classes for styling
 */
export const getEnergyBadgeClasses = (energy: EnergyRequiredEnum): string => {
  switch (energy) {
    case 'High': 
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Medium':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'Low':
      return 'bg-success/10 text-success border-success/20';
    default:
      return 'bg-warning/10 text-warning border-warning/20';
  }
};
