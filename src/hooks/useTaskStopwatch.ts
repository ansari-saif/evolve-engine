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
    if (completionStatus === 'In Progress') {
      setShowStopwatch(true);
      
      // If startedAt is available, use it; otherwise use current time
      if (startedAt) {
        setLocalStartTime(new Date(startedAt).getTime());
      } else {
        // If no startedAt but status is 'In Progress', use current time
        setLocalStartTime(Date.now());
      }
    } else {
      setShowStopwatch(false);
      setLocalStartTime(null);
    }
  }, [completionStatus, startedAt]);

  // Real-time stopwatch update (every 100ms for smooth display)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showStopwatch && localStartTime) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 200); // Update every 200ms for better performance while maintaining smooth display
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showStopwatch, localStartTime]);

  // Calculate elapsed time with millisecond precision
  const elapsedTime = useMemo(() => {
    if (!localStartTime || completionStatus !== 'In Progress') {
      return 0;
    }
    return currentTime - localStartTime;
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
