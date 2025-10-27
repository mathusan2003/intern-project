/**
 * Validation utilities for timeline data
 */

import { TimelineTask, TimelineRow } from '@/types/timeline.types';

/**
 * Validate task data
 */
export const validateTask = (task: Partial<TimelineTask>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!task.id) {
    errors.push('Task ID is required');
  }

  if (!task.title || task.title.trim() === '') {
    errors.push('Task title is required');
  }

  if (!task.startDate) {
    errors.push('Start date is required');
  }

  if (!task.endDate) {
    errors.push('End date is required');
  }

  if (task.startDate && task.endDate && task.startDate > task.endDate) {
    errors.push('Start date must be before end date');
  }

  if (task.progress !== undefined && (task.progress < 0 || task.progress > 100)) {
    errors.push('Progress must be between 0 and 100');
  }

  if (!task.rowId) {
    errors.push('Row ID is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate row data
 */
export const validateRow = (row: Partial<TimelineRow>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!row.id) {
    errors.push('Row ID is required');
  }

  if (!row.label || row.label.trim() === '') {
    errors.push('Row label is required');
  }

  if (!row.tasks) {
    errors.push('Tasks array is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate date range
 */
export const validateDateRange = (
  startDate: Date,
  endDate: Date
): { valid: boolean; error?: string } => {
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }

  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }

  if (startDate >= endDate) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  return { valid: true };
};

/**
 * Validate progress value
 */
export const validateProgress = (progress: number): boolean => {
  return typeof progress === 'number' && progress >= 0 && progress <= 100;
};

/**
 * Validate color hex code
 */
export const validateColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

/**
 * Sanitize task title
 */
export const sanitizeTitle = (title: string): string => {
  return title.trim().slice(0, 200); // Max 200 characters
};

/**
 * Check if task is within timeline bounds
 */
export const isTaskWithinBounds = (
  task: TimelineTask,
  timelineStart: Date,
  timelineEnd: Date
): boolean => {
  return task.startDate >= timelineStart && task.endDate <= timelineEnd;
};

/**
 * Check if task overlaps with date range
 */
export const doesTaskOverlapRange = (
  task: TimelineTask,
  rangeStart: Date,
  rangeEnd: Date
): boolean => {
  return task.startDate <= rangeEnd && task.endDate >= rangeStart;
};

/**
 * Validate task dependencies
 */
export const validateDependencies = (
  taskId: string,
  dependencies: string[],
  allTasks: Record<string, TimelineTask>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  dependencies.forEach(depId => {
    if (depId === taskId) {
      errors.push('Task cannot depend on itself');
    }

    if (!allTasks[depId]) {
      errors.push(`Dependency task "${depId}" not found`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Check if string is valid ID
 */
export const isValidId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0 && id.length <= 100;
};

