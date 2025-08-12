import type { ProgressLogResponse } from '../client/models';

/**
 * Progress statistics returned by the API
 */
export interface ProgressStats {
  avg_mood_score: number;
  avg_energy_level: number;
  avg_focus_score: number;
  completion_rate: number;
  total_logs: number;
  days_analyzed: number;
}

/**
 * Progress data structure for UI components
 */
export interface ProgressData {
  tasksCompleted: number;
  tasksPlanned: number;
  moodScore: number; // 0-100 percentage
  energyLevel: number; // 0-100 percentage
  focusScore: number; // 0-100 percentage
}

/**
 * Extended progress log with additional UI-specific fields
 */
export interface ExtendedProgressLog extends ProgressLogResponse {
  completionPercentage?: number;
  moodPercentage?: number;
  energyPercentage?: number;
  focusPercentage?: number;
}

/**
 * Progress trend information
 */
export interface ProgressTrend {
  current: number;
  average: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}
