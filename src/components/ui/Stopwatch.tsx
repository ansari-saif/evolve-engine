import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export interface StopwatchProps {
  /** Initial time in seconds */
  initialTime?: number;
  /** Whether the stopwatch should start automatically */
  autoStart?: boolean;
  /** Callback when time changes */
  onTimeChange?: (timeInSeconds: number) => void;
  /** Callback when stopwatch starts */
  onStart?: () => void;
  /** Callback when stopwatch pauses */
  onPause?: () => void;
  /** Callback when stopwatch resets */
  onReset?: () => void;
  /** Whether to show controls */
  showControls?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether the stopwatch is disabled */
  disabled?: boolean;
  /** Whether the stopwatch is in display-only mode (no internal timer management) */
  displayOnly?: boolean;
  /** Time format: 'HH:MM:SS' or 'MM:SS:MS' */
  timeFormat?: 'HH:MM:SS' | 'MM:SS:MS';
}

export const Stopwatch: React.FC<StopwatchProps> = React.memo(({
  initialTime = 0,
  autoStart = false,
  onTimeChange,
  onStart,
  onPause,
  onReset,
  showControls = true,
  className = '',
  size = 'medium',
  disabled = false,
  displayOnly = false,
  timeFormat = 'MM:SS:MS'
}) => {
  const [time, setTime] = useState(autoStart ? 0 : initialTime);
  const [isRunning, setIsRunning] = useState(autoStart && !displayOnly);
  const [startTime, setStartTime] = useState<number | null>((autoStart && !displayOnly) ? Date.now() : null);
  const [pausedTime, setPausedTime] = useState(autoStart ? 0 : initialTime);
  const animationFrameRef = useRef<number>();

  // Format time based on the specified format
  const formatTime = useCallback((seconds: number): string => {
    if (timeFormat === 'HH:MM:SS') {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      // MM:SS:MS format
      const totalSeconds = Math.floor(seconds);
      const minutes = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      const milliseconds = Math.floor((seconds - totalSeconds) * 1000);
      
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
    }
  }, [timeFormat]);

  // Update time using requestAnimationFrame for better performance
  const updateTime = useCallback(() => {
    if (isRunning && startTime !== null) {
      const currentTime = (Date.now() - startTime) / 1000 + pausedTime;
      setTime(currentTime);
      
      if (onTimeChange) {
        onTimeChange(currentTime);
      }
      
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else if (isRunning && startTime === null) {
      // Handle case where isRunning is true but startTime is null
      setStartTime(Date.now());
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, [isRunning, startTime, pausedTime, onTimeChange]);

  // Start the stopwatch
  const handleStart = useCallback(() => {
    if (disabled) return;
    
    setIsRunning(true);
    setStartTime(Date.now());
    setTime(0); // Reset to zero when starting
    setPausedTime(0); // Reset paused time to zero
    
    if (onStart) {
      onStart();
    }
  }, [disabled, onStart]);

  // Pause the stopwatch
  const handlePause = useCallback(() => {
    if (disabled) return;
    
    setIsRunning(false);
    setPausedTime(time);
    setStartTime(null);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (onPause) {
      onPause();
    }
  }, [disabled, time, onPause]);

  // Reset the stopwatch
  const handleReset = useCallback(() => {
    if (disabled) return;
    
    setIsRunning(false);
    setTime(initialTime);
    setPausedTime(initialTime);
    setStartTime(null);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (onReset) {
      onReset();
    }
    
    if (onTimeChange) {
      onTimeChange(initialTime);
    }
  }, [disabled, initialTime, onReset, onTimeChange]);

  // Toggle between start and pause
  const handleToggle = useCallback(() => {
    if (isRunning) {
      handlePause();
    } else {
      handleStart();
    }
  }, [isRunning, handleStart, handlePause]);

  // Start update loop when running (only when not in display-only mode)
  useEffect(() => {
    if (displayOnly) return;
    
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, updateTime, displayOnly]);

  // Update time when initialTime changes
  useEffect(() => {
    if (displayOnly) {
      // In display-only mode, always update time from initialTime
      setTime(initialTime);
    } else if (!isRunning) {
      setTime(initialTime);
      setPausedTime(initialTime);
    }
  }, [initialTime, isRunning, displayOnly]);

  // Handle autoStart prop changes (only when not in display-only mode)
  useEffect(() => {
    if (displayOnly) return;
    
    if (autoStart && !isRunning) {
      // Start the stopwatch when autoStart becomes true
      setIsRunning(true);
      setStartTime(Date.now());
      setTime(0); // Reset to zero when auto-starting
      setPausedTime(0); // Reset paused time to zero
      if (onStart) {
        onStart();
      }
    } else if (!autoStart && isRunning) {
      // Stop the stopwatch when autoStart becomes false
      setIsRunning(false);
      setPausedTime(time);
      setStartTime(null);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (onPause) {
        onPause();
      }
    }
  }, [autoStart, isRunning, time, onStart, onPause, displayOnly]);

  // Size-based styling
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const buttonSize = {
    small: 'sm',
    medium: 'default',
    large: 'lg'
  } as const;

  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      role="timer"
      aria-label={`Stopwatch showing ${formatTime(time)}`}
      aria-live="polite"
    >
      <div 
        className={`font-mono font-bold ${sizeClasses[size]} ${
          disabled ? 'text-muted-foreground' : 'text-foreground'
        }`}
        aria-label={`Time: ${formatTime(time)}`}
      >
        {formatTime(time)}
      </div>
      
      {showControls && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size={buttonSize[size]}
            onClick={handleToggle}
            disabled={disabled}
            aria-label={isRunning ? 'Pause stopwatch' : 'Start stopwatch'}
            className="h-8 w-8 p-0"
          >
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size={buttonSize[size]}
            onClick={handleReset}
            disabled={disabled || (time === initialTime && !isRunning)}
            aria-label="Reset stopwatch"
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
});

Stopwatch.displayName = 'Stopwatch';
