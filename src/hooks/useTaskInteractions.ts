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
    e.stopPropagation(); // Stop event bubbling
    (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
    (e.currentTarget as HTMLElement).style.userSelect = 'none';
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Stop event bubbling
    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
    (e.currentTarget as HTMLElement).style.userSelect = 'auto';
  };

  // Mouse interaction handlers - prevent cursor movement
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default mouse behavior
    e.stopPropagation(); // Stop event bubbling
    (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
    (e.currentTarget as HTMLElement).style.userSelect = 'none';
    (e.currentTarget as HTMLElement).style.cursor = 'pointer';
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default mouse behavior
    e.stopPropagation(); // Stop event bubbling
    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
    (e.currentTarget as HTMLElement).style.userSelect = 'auto';
    (e.currentTarget as HTMLElement).style.cursor = 'default';
  };

  return {
    handleAction,
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
  };
};
