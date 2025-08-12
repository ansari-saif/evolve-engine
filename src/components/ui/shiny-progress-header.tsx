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
};

export function ShinyProgressHeader({
  className,
  tasksCompleted,
  tasksPlanned,
  moodScore,
  energyLevel,
  focusScore,
  title = 'Today\'s Progress',
  subtitle,
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
        'group relative w-full overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5',
        // Brand-compliant glass effect
        'border border-white/20 bg-gradient-to-br from-white/10 via-slate-800/30 to-slate-900/20 backdrop-blur-xl backdrop-saturate-150',
        // Brand shadows
        'shadow-[0_8px_32px_rgba(99,102,241,0.15)] ring-1 ring-inset ring-white/20',
        // Touch-friendly interactions
        'transition-all duration-300 active:scale-[0.98] sm:hover:shadow-[0_12px_40px_rgba(99,102,241,0.25)]',
        className,
      )}
    >
      {/* Brand-compliant specular highlight */}
      <span 
        aria-hidden 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_20%_10%,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.05)_40%,rgba(255,255,255,0)_70%)]" 
      />

      <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
        {/* Compact header section */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground/90 truncate">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-foreground/70 truncate">
              {subtitle ?? `${tasksCompleted}/${tasksPlanned} tasks`}
            </p>
          </div>
          
          {/* Compact completion badge */}
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {Math.round(completion)}%
            </div>
            <div className="text-xs text-foreground/60">
              Complete
            </div>
          </div>
        </div>

        {/* Compact main progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm text-foreground/80">
            <span className="font-medium">Progress</span>
            <span className="font-semibold text-foreground/90">
              {tasksCompleted}/{tasksPlanned}
            </span>
          </div>
          
          <div className="relative h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-white/10">
            {/* Brand-compliant underglow */}
            <span 
              aria-hidden 
              className="pointer-events-none absolute -bottom-1 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-primary/20 blur-md" 
            />

            {/* Track */}
            <span 
              aria-hidden 
              className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20" 
            />

            {/* Brand-compliant fill */}
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 shadow-[0_2px_8px_rgba(99,102,241,0.3)] transition-all duration-700 ease-out"
              style={{ width: `${completion}%` }}
            >
              {/* Inner highlight */}
              <span 
                aria-hidden 
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent" 
              />
            </div>
          </div>
        </div>

        {/* Compact micro-bars */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <MiniBar 
            label="Mood" 
            value={mood} 
            tint="from-secondary via-secondary/90 to-secondary/80"
            icon="😊"
          />
          <MiniBar 
            label="Energy" 
            value={energy} 
            tint="from-warning via-warning/90 to-warning/80"
            icon="⚡"
          />
          <MiniBar 
            label="Focus" 
            value={focus} 
            tint="from-success via-success/90 to-success/80"
            icon="🎯"
          />
        </div>
      </div>
    </header>
  );
}

function MiniBar({ 
  label, 
  value, 
  tint, 
  icon 
}: { 
  label: string; 
  value: number; 
  tint: string; 
  icon: string;
}) {
  return (
    <div className="group/bar flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm sm:text-base" role="img" aria-label={label}>
            {icon}
          </span>
          <span className="text-xs sm:text-sm font-medium text-foreground/85 truncate">
            {label}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-bold text-foreground/95">
          {Math.round(value)}%
        </span>
      </div>
      
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        {/* Track */}
        <span 
          aria-hidden 
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20" 
        />
        
        {/* Brand-compliant fill */}
        <div
          className={cn(
            'relative h-full rounded-full bg-gradient-to-r shadow-sm transition-all duration-700 ease-out',
            tint
          )}
          style={{ width: `${value}%` }}
        >
          {/* Inner highlight */}
          <span 
            aria-hidden 
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent" 
          />
        </div>
      </div>
    </div>
  );
}
