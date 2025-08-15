import type { TaskPriorityEnum, CompletionStatusEnum, EnergyRequiredEnum } from '../client/models';

export class TaskStylingService {
  static getPriorityBorderColor(priority: TaskPriorityEnum): string {
    switch (priority) {
      case 'Urgent': return 'border-l-destructive';
      case 'High': return 'border-l-warning';
      case 'Medium': return 'border-l-primary';
      case 'Low': return 'border-l-success';
      default: return 'border-l-primary';
    }
  }

  static getPriorityBadgeClasses(priority: TaskPriorityEnum): string {
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
  }

  static getStatusBadgeClasses(status: CompletionStatusEnum): string {
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
  }

  static getEnergyBadgeClasses(energy: EnergyRequiredEnum): string {
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
  }
}
