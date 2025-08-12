import { useState, useEffect, useMemo } from 'react';

interface UseTaskStopwatchProps {
  taskId: number;
  completionStatus: string;
  startedAt: string | null;
}

export const useTaskStopwatch = ({ taskId, completionStatus, startedAt }: UseTaskStopwatchProps) => {
  const [showStopwatch, setShowStopwatch] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Show stopwatch when task is in progress
  useEffect(() => {
    if (completionStatus === 'In Progress') {
      setShowStopwatch(true);
    } else {
      setShowStopwatch(false);
    }
  }, [completionStatus]);

  // Real-time stopwatch update (every 100ms for smooth display)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showStopwatch && startedAt) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 100); // Update every 100ms for smooth millisecond display
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showStopwatch, startedAt]);

  // Calculate elapsed time with millisecond precision
  const elapsedTime = useMemo(() => {
    if (!startedAt || completionStatus !== 'In Progress') {
      return 0;
    }
    const startTime = new Date(startedAt).getTime();
    return currentTime - startTime;
  }, [startedAt, completionStatus, currentTime]);

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
