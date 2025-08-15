import * as React from 'react';
import { cn } from '@/lib/utils';
import { clampPct } from '../../utils/progress';

export type ShinyProgressHeaderProps = {
  className?: string;
  tasksCompleted: number;
  tasksPlanned: number;
  moodScore: number; // 0-100
  energyLevel: number; // 0-100
  focusScore: number; // 0-100
  title?: string;
  subtitle?: string;
  date?: string;
  daysRemaining?: number;
};

export function ShinyProgressHeader({
  className,
  tasksCompleted,
  tasksPlanned,
  moodScore,
  energyLevel,
  focusScore,
  title,
  subtitle,
  daysRemaining,
}: ShinyProgressHeaderProps) {
  const completion = clampPct(
    tasksPlanned > 0 ? (tasksCompleted / tasksPlanned) * 100 : (tasksCompleted > 0 ? 100 : 0)
  );
  const mood = clampPct(moodScore);
  const energy = clampPct(energyLevel);
  const focus = clampPct(focusScore);

  return (
    <header
      className={cn(
        'group relative w-full overflow-hidden rounded-2xl p-4 sm:p-6',
        // Elegant glass effect
        'bg-gradient-to-br from-white/5 via-slate-800/20 to-slate-900/10 backdrop-blur-2xl',
        'border border-white/10 shadow-lg',
        // Subtle hover effect
        'transition-all duration-300 hover:shadow-xl hover:border-white/20',
        className,
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground/90 mb-1">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-foreground/70">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Days left */}
          <div className="flex flex-col items-end text-right">
            <div className="text-sm sm:text-base font-medium text-foreground/90">
              {Math.abs(daysRemaining)} days left
            </div>
          </div>
        </div>

        {/* Main progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-foreground/80">
            <span className="font-medium">Overall Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/60">Completion</span>
              <span className="font-semibold text-foreground/90">
                {Math.round(completion)}%
              </span>
            </div>
          </div>
          
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 transition-all duration-1000 ease-out"
              style={{ width: `${completion}%` }}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            label="Mood"
            value={mood}
            icon="😊"
            color="from-secondary to-secondary/80"
          />
          <MetricCard
            label="Energy"
            value={energy}
            icon="⚡"
            color="from-warning to-warning/80"
          />
          <MetricCard
            label="Focus"
            value={focus}
            icon="🎯"
            color="from-success to-success/80"
          />
        </div>
      </div>
    </header>
  );
}

function MetricCard({ 
  label, 
  value, 
  icon, 
  color 
}: { 
  label: string; 
  value: number; 
  icon: string; 
  color: string;
}) {
  return (
    <div className="group relative p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label={label}>
            {icon}
          </span>
          <span className="text-sm font-medium text-foreground/85">
            {label}
          </span>
        </div>
        <span className="text-sm font-bold text-foreground/95">
          {Math.round(value)}%
        </span>
      </div>
      
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
            color
          )}
          style={{ width: `${value}%` }}
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </div>
  );
}
