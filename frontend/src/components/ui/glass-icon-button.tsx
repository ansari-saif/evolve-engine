import * as React from 'react';
import { cn } from '@/lib/utils';

export type GlassIconButtonProps = {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  title?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * GlassIconButton
 * - Reusable glassmorphism, water-drop style circular icon button used app-wide.
 * - Keeps all layering and effects encapsulated.
 */
export const GlassIconButton = React.forwardRef<HTMLButtonElement, GlassIconButtonProps>(
  ({ children, className, ariaLabel, title, disabled, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={title ?? ariaLabel}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          // Base size/layout
          'group relative inline-flex h-12 w-12 items-center justify-center rounded-full',
          // Glass look
          'border border-white/50 bg-gradient-to-b from-white/50 via-cyan-200/20 to-cyan-200/10 text-foreground',
          'shadow-[0_14px_40px_rgba(0,200,255,0.25)] backdrop-blur-3xl backdrop-saturate-150',
          // Interactions
          'transition hover:from-white/60 hover:via-cyan-200/25 hover:to-cyan-200/15 hover:scale-105 hover:-translate-y-0.5 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60',
          className,
        )}
        {...props}
      >
        {/* droplet specular highlight */}
        <span aria-hidden className="pointer-events-none absolute top-1 left-1 h-3 w-3 rounded-full bg-white/80 blur-[1px]" />
        {/* vertical light streak */}
        <span aria-hidden className="pointer-events-none absolute top-2 right-3 h-6 w-2 rounded-full bg-white/50 blur-[2px] rotate-12 opacity-80" />
        {/* inner refraction ring */}
        <span aria-hidden className="pointer-events-none absolute inset-[2px] rounded-full ring-1 ring-cyan-200/30" />
        {/* inner concave shadow */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),inset_0_-10px_16px_rgba(0,0,0,0.18)]" />
        {/* bottom caustic (light pool) */}
        <span aria-hidden className="pointer-events-none absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-white/25 blur-md" />
        {/* ripple on press */}
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/30 opacity-0 transition-all duration-300 ease-out group-active:opacity-60 group-active:h-20 group-active:w-20" />
        {/* shimmer on hover */}
        <span aria-hidden className="pointer-events-none absolute -left-10 top-0 h-full w-8 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-28" />

        {/* Icon slot */}
        <span className="relative z-10 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
          {children}
        </span>
      </button>
    );
  }
);
GlassIconButton.displayName = 'GlassIconButton';
