import type { ProgressStats, ProgressData } from '../types/progress';
import type { ProgressLogResponse } from '../client/models';

/**
 * Utility functions for progress tracking and data conversion
 */

/**
 * Convert a 1-10 scale score to a 0-100 percentage
 * @param score - Score on a 1-10 scale
 * @returns Percentage value (0-100)
 */
export const toPercentage = (score: number): number => {
  if (typeof score !== 'number' || isNaN(score)) return 0;
  return Math.max(0, Math.min(100, (score / 10) * 100));
};

/**
 * Clamp a percentage value between 0 and 100
 * @param value - Any number value
 * @returns Clamped percentage (0-100)
 */
export const clampPct = (value: number): number => {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
};

/**
 * Calculate completion percentage from completed and planned tasks
 * @param completed - Number of completed tasks
 * @param planned - Number of planned tasks
 * @returns Completion percentage (0-100)
 */
export const calculateCompletionPercentage = (completed: number, planned: number): number => {
  if (planned <= 0) return completed > 0 ? 100 : 0;
  return clampPct((completed / planned) * 100);
};

/**
 * Type guard to check if the API response matches our expected structure
 */
const isProgressStats = (data: unknown): data is ProgressStats => {
  if (!data || typeof data !== 'object') return false;
  const stats = data as Record<string, unknown>;
  return (
    typeof stats.avg_mood_score === 'number' &&
    typeof stats.avg_energy_level === 'number' &&
    typeof stats.avg_focus_score === 'number' &&
    typeof stats.completion_rate === 'number'
  );
};

/**
 * Extract progress data from API response with fallbacks
 * @param progressStats - Progress statistics from API
 * @param recentLogs - Recent progress logs from API
 * @param fallbackProgress - Fallback progress calculation
 * @returns Processed progress data
 */
export const extractProgressData = (
  progressStats: unknown,
  recentLogs: ProgressLogResponse[] | null | undefined,
  fallbackProgress: number
): ProgressData => {
  const defaults: ProgressData = {
    tasksCompleted: Math.round((fallbackProgress / 100) * 10),
    tasksPlanned: 10,
    moodScore: 72,
    energyLevel: 65,
    focusScore: 78,
  };

  // Type-safe extraction of progress stats
  const stats = isProgressStats(progressStats) ? progressStats : null;
  const recentLog = recentLogs?.[0];

  return {
    // Use recent log for current mood/energy/focus, fallback to averages
    moodScore: toPercentage(recentLog?.mood_score || stats?.avg_mood_score || 7.2),
    energyLevel: toPercentage(recentLog?.energy_level || stats?.avg_energy_level || 6.5),
    focusScore: toPercentage(recentLog?.focus_score || stats?.avg_focus_score || 7.8),
    // Calculate task completion from recent logs or use defaults
    tasksCompleted: recentLog?.tasks_completed || Math.round((fallbackProgress / 100) * 10),
    tasksPlanned: recentLog?.tasks_planned || 10,
  };
};
