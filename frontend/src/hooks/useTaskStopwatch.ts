import { useState, useEffect, useMemo } from 'react';

interface UseTaskStopwatchProps {
  taskId: number;
  completionStatus: string;
  startedAt: string | null;
}

export const useTaskStopwatch = ({ taskId, completionStatus, startedAt }: UseTaskStopwatchProps) => {
  const [showStopwatch, setShowStopwatch] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [localStartTime, setLocalStartTime] = useState<number | null>(null);

  // Show stopwatch when task is in progress and handle start time
  useEffect(() => {
    console.log('Stopwatch effect:', { taskId, completionStatus, startedAt, showStopwatch });
    
    if (completionStatus === 'In Progress') {
      setShowStopwatch(true);
      
      // If startedAt is available, use it; otherwise use current time
      if (startedAt) {
        const startTime = new Date(startedAt).getTime();
        console.log('Using startedAt:', startedAt, '->', startTime);
        setLocalStartTime(startTime);
      } else {
        // If no startedAt but status is 'In Progress', use current time
        const currentTime = Date.now();
        console.log('No startedAt, using current time:', currentTime);
        setLocalStartTime(currentTime);
      }
    } else {
      console.log('Task not in progress, hiding stopwatch');
      setShowStopwatch(false);
      setLocalStartTime(null);
    }
  }, [completionStatus, startedAt, taskId]);

  // Real-time stopwatch update (every 200ms for smooth display)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    console.log('Stopwatch interval effect:', { showStopwatch, localStartTime });
    
    if (showStopwatch && localStartTime) {
      console.log('Starting stopwatch interval');
      interval = setInterval(() => {
        const now = Date.now();
        console.log('Stopwatch tick:', now, 'elapsed:', now - localStartTime);
        setCurrentTime(now);
      }, 200); // Update every 200ms for better performance while maintaining smooth display
    }
    
    return () => {
      if (interval) {
        console.log('Clearing stopwatch interval');
        clearInterval(interval);
      }
    };
  }, [showStopwatch, localStartTime]);

  // Calculate elapsed time with millisecond precision
  const elapsedTime = useMemo(() => {
    if (!localStartTime || completionStatus !== 'In Progress') {
      return 0;
    }
    const elapsed = currentTime - localStartTime;
    console.log('Calculated elapsed time:', elapsed, 'ms');
    return elapsed;
  }, [localStartTime, completionStatus, currentTime]);

  // Format elapsed time as HH:MM:SS.mm
  const formattedTime = useMemo(() => {
    const hours = Math.floor(elapsedTime / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((elapsedTime % 60000) / 1000).toString().padStart(2, '0');
    const centiseconds = Math.floor((elapsedTime % 1000) / 10).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}.${centiseconds}`;
  }, [elapsedTime]);

  return {
    showStopwatch,
    elapsedTime,
    formattedTime,
  };
};
