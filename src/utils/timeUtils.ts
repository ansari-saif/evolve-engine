// Time utilities for IST (India Standard Time) handling
// Time utilities for consistent date handling in local timezone
import { format } from 'date-fns';

/**
 * Get current date in IST timezone
 */
export const getCurrentDateIST = (): Date => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  return new Date(now.getTime() + istOffset);
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDateIST = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  
  return dateString;
};

/**
 * Convert a date string to IST Date object
 */
export const parseDateIST = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // Create date in IST by adding offset
  const localDate = new Date(year, month - 1, day);
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(localDate.getTime() + istOffset);
};

/**
 * Format date for display with proper comparison
 */
export const formatDateIST = (dateString: string | null): string | null => {
  if (!dateString) return null;
  
  // Parse the date string
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create dates for comparison in local timezone
  const taskDate = new Date(year, month - 1, day);
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Get yesterday and tomorrow
  const yesterday = new Date(todayDate.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(todayDate.getTime() + 24 * 60 * 60 * 1000);
  
  
  // Compare dates by components (year, month, day) instead of timestamps
  if (taskDate.getFullYear() === todayDate.getFullYear() && 
      taskDate.getMonth() === todayDate.getMonth() && 
      taskDate.getDate() === todayDate.getDate()) {
    return 'Today';
  }
  
  if (taskDate.getFullYear() === tomorrow.getFullYear() && 
      taskDate.getMonth() === tomorrow.getMonth() && 
      taskDate.getDate() === tomorrow.getDate()) {
    return 'Tomorrow';
  }
  
  if (taskDate.getFullYear() === yesterday.getFullYear() && 
      taskDate.getMonth() === yesterday.getMonth() && 
      taskDate.getDate() === yesterday.getDate()) {
    return 'Yesterday';
  }
  
  // For other dates, format normally
  return format(taskDate, 'MMM dd, yyyy');
};

/**
 * Convert a Date object to date string (YYYY-MM-DD)
 */
export const dateToISTString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get current timestamp in IST
 */
export const getCurrentTimestampIST = (): number => {
  return getCurrentDateIST().getTime();
};

/**
 * Get current date as ISO string in IST
 */
export const getCurrentISOStringIST = (): string => {
  const now = new Date();
  
  // Get local time components (which should be IST if you're in India)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  const istISOString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  

  
  return istISOString;
};

/**
 * Check if a date is today in IST
 */
export const isTodayIST = (dateString: string): boolean => {
  const taskDate = parseDateIST(dateString);
  const today = getCurrentDateIST();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return taskDate.getTime() === todayDate.getTime();
};

/**
 * Check if a date is tomorrow in IST
 */
export const isTomorrowIST = (dateString: string): boolean => {
  const taskDate = parseDateIST(dateString);
  const today = getCurrentDateIST();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrow = new Date(todayDate.getTime() + 24 * 60 * 60 * 1000);
  return taskDate.getTime() === tomorrow.getTime();
};

/**
 * Check if a date is yesterday in IST
 */
export const isYesterdayIST = (dateString: string): boolean => {
  const taskDate = parseDateIST(dateString);
  const today = getCurrentDateIST();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterday = new Date(todayDate.getTime() - 24 * 60 * 60 * 1000);
  return taskDate.getTime() === yesterday.getTime();
};
