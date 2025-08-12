import { performanceMetrics } from '../utils/performance';

export const useTaskInteractions = () => {
  const handleAction = (action: string, callback: () => void) => {
    const startTime = performance.now();
    callback();
    performanceMetrics.userInteraction(action, startTime);
  };

  // Touch-friendly interaction handlers - prevent cursor movement
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
  };

  // Mouse interaction handlers - prevent cursor movement
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default mouse behavior
    (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default mouse behavior
    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
  };

  return {
    handleAction,
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
  };
};
