/**
 * Date utility functions for timeline calculations
 */

import { format, addDays, addWeeks, addMonths, startOfDay, differenceInDays } from 'date-fns';
import { ViewMode } from '@/types/timeline.types';
import { MS_PER_DAY } from '@/constants/timeline.constants';

/**
 * Format a date for display based on view mode
 */
export const formatDateForViewMode = (date: Date, viewMode: ViewMode): string => {
  switch (viewMode) {
    case 'day':
      return format(date, 'EEE dd');
    case 'week':
      return `Week ${getWeekNumber(date)}`;
    case 'month':
      return format(date, 'MMM yyyy');
    default:
      return format(date, 'MMM dd, yyyy');
  }
};

/**
 * Format a date for tooltips and details
 */
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

/**
 * Get week number of the year
 */
export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * Calculate the number of days between two dates
 */
export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  return differenceInDays(endDate, startDate);
};

/**
 * Calculate the number of milliseconds between two dates
 */
export const getMsBetween = (startDate: Date, endDate: Date): number => {
  return endDate.getTime() - startDate.getTime();
};

/**
 * Add time units to a date based on view mode
 */
export const addTimeUnit = (date: Date, units: number, viewMode: ViewMode): Date => {
  switch (viewMode) {
    case 'day':
      return addDays(date, units);
    case 'week':
      return addWeeks(date, units);
    case 'month':
      return addMonths(date, units);
    default:
      return date;
  }
};

/**
 * Normalize a date to the start of the day
 */
export const normalizeDate = (date: Date): Date => {
  return startOfDay(date);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Convert days to milliseconds
 */
export const daysToMs = (days: number): number => {
  return days * MS_PER_DAY;
};

/**
 * Convert milliseconds to days
 */
export const msToDays = (ms: number): number => {
  return ms / MS_PER_DAY;
};

/**
 * Clamp a date between min and max dates
 */
export const clampDate = (date: Date, minDate: Date, maxDate: Date): Date => {
  if (date < minDate) return minDate;
  if (date > maxDate) return maxDate;
  return date;
};

