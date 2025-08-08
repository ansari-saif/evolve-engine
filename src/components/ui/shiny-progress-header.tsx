import * as React from 'react';
import { cn } from '@/lib/utils';

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

function clampPct(n: number) {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

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
        'relative w-full overflow-hidden rounded-2xl p-4 sm:p-5',
        // Glass base
        'border border-white/40 bg-gradient-to-b from-white/40 via-cyan-200/15 to-cyan-200/5 backdrop-blur-2xl backdrop-saturate-150',
        // Shadows / ring
        'shadow-[0_20px_60px_rgba(0,200,255,0.18)] ring-1 ring-inset ring-white/40',
        className,
      )}
    >
      {/* Specular sweep */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_10%_0%,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_60%)]" />
      {/* Shimmer stripe */}
      <span aria-hidden className="pointer-events-none absolute -left-16 top-0 h-full w-16 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:translate-x-[130%]" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground/90 drop-shadow">{title}</h2>
            <p className="text-xs sm:text-sm text-foreground/70">
              {subtitle ?? `${tasksCompleted}/${tasksPlanned} tasks • ${Math.round(completion)}% complete`}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-foreground/80">
            <Badge label="Mood" value={mood} />
            <Badge label="Energy" value={energy} />
            <Badge label="Focus" value={focus} />
          </div>
        </div>

        {/* Main completion bar */}
        <div className="relative h-3 sm:h-3.5 w-full overflow-hidden rounded-full bg-white/15">
          {/* caustic underglow */}
          <span aria-hidden className="pointer-events-none absolute -bottom-1 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-white/30 blur-md" />

          {/* track inner ring */}
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />

          {/* fill */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-500 shadow-[0_6px_16px_rgba(0,200,255,0.35)]"
            style={{ width: `${completion}%` }}
          />

          {/* glossy overlay */}
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent" />

          {/* animated glint */}
          <span aria-hidden className="pointer-events-none absolute -left-10 top-0 h-full w-8 rotate-12 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-700 [animation:glint_2s_ease_infinite]" />
        </div>

        {/* Micro-bars */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <MiniBar label="Mood" value={mood} tint="from-fuchsia-300 via-pink-300 to-rose-400" />
          <MiniBar label="Energy" value={energy} tint="from-amber-300 via-yellow-300 to-orange-400" />
          <MiniBar label="Focus" value={focus} tint="from-emerald-300 via-teal-300 to-cyan-400" />
        </div>
      </div>
    </header>
  );
}

function Badge({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/20 px-2 py-1 text-[10px] sm:text-xs backdrop-blur">
      <span className="opacity-80">{label}</span>
      <span className="font-semibold text-foreground/90">{Math.round(value)}%</span>
    </span>
  );
}

function MiniBar({ label, value, tint }: { label: string; value: number; tint: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px] sm:text-xs text-foreground/80">
        <span>{label}</span>
        <span className="font-semibold text-foreground/90">{Math.round(value)}%</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/15">
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/25" />
        <div
          className={cn('h-full rounded-full bg-gradient-to-r', tint)}
          style={{ width: `${value}%` }}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </div>
  );
}

// keyframes via tailwind arbitrary property
// @keyframes glint { 0% { transform: translateX(-60%); opacity: 0 } 20% { opacity: 1 } 100% { transform: translateX(260%); opacity: 0 } }
// Using the arbitrary property syntax [animation:...] above to avoid adding to tailwind config.
