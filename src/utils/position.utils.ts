/**
 * Position calculation utilities for timeline rendering
 */

import { TimelineTask, TimeScaleItem, TaskPosition, ViewMode } from '@/types/timeline.types';
import { MS_PER_DAY, LAYOUT } from '@/constants/timeline.constants';
import { getDaysBetween, addTimeUnit } from './date.utils';

/**
 * Calculate pixel position from date
 */
export const calculatePosition = (
  date: Date,
  startDate: Date,
  pixelsPerDay: number
): number => {
  const daysSinceStart = getDaysBetween(startDate, date);
  return Math.round(daysSinceStart * pixelsPerDay);
};

/**
 * Calculate duration in pixels
 */
export const calculateDuration = (
  startDate: Date,
  endDate: Date,
  pixelsPerDay: number
): number => {
  const durationDays = getDaysBetween(startDate, endDate);
  return Math.max(Math.round(durationDays * pixelsPerDay), 20); // Minimum width of 20px
};

/**
 * Calculate date from pixel position
 */
export const calculateDateFromPosition = (
  position: number,
  startDate: Date,
  pixelsPerDay: number
): Date => {
  const days = Math.round(position / pixelsPerDay);
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Calculate complete task position including top offset for row
 */
export const calculateTaskPosition = (
  task: TimelineTask,
  viewStartDate: Date,
  pixelsPerDay: number,
  rowIndex: number
): TaskPosition => {
  const left = calculatePosition(task.startDate, viewStartDate, pixelsPerDay);
  const width = calculateDuration(task.startDate, task.endDate, pixelsPerDay);
  const top = rowIndex * LAYOUT.ROW_HEIGHT + LAYOUT.TASK_BAR_PADDING;
  const height = task.isMilestone ? LAYOUT.TASK_BAR_MILESTONE_HEIGHT : LAYOUT.TASK_BAR_HEIGHT;

  return { left, width, top, height };
};

/**
 * Generate time scale labels and positions
 */
export const generateTimeScale = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode,
  pixelsPerUnit: number
): TimeScaleItem[] => {
  const scale: TimeScaleItem[] = [];
  let current = new Date(startDate);
  let position = 0;

  while (current <= endDate) {
    const label = formatLabelForViewMode(current, viewMode);
    scale.push({
      date: new Date(current),
      label,
      position,
    });

    current = addTimeUnit(current, 1, viewMode);
    position += pixelsPerUnit;
  }

  return scale;
};

/**
 * Format label based on view mode
 */
const formatLabelForViewMode = (date: Date, viewMode: ViewMode): string => {
  switch (viewMode) {
    case 'day':
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    case 'week':
      return `Week ${getWeekNumber(date)}`;
    case 'month':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    default:
      return date.toLocaleDateString();
  }
};

/**
 * Get week number (helper function)
 */
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * Calculate total timeline width
 */
export const calculateTimelineWidth = (
  startDate: Date,
  endDate: Date,
  pixelsPerDay: number
): number => {
  return calculateDuration(startDate, endDate, pixelsPerDay);
};

/**
 * Snap position to grid (for dragging)
 */
export const snapToGrid = (position: number, gridSize: number): number => {
  return Math.round(position / gridSize) * gridSize;
};

/**
 * Check if two task positions overlap
 */
export const doTasksOverlap = (pos1: TaskPosition, pos2: TaskPosition): boolean => {
  const horizontalOverlap = 
    (pos1.left < pos2.left + pos2.width) && 
    (pos1.left + pos1.width > pos2.left);
  
  const verticalOverlap = 
    (pos1.top < pos2.top + pos2.height) && 
    (pos1.top + pos1.height > pos2.top);

  return horizontalOverlap && verticalOverlap;
};

/**
 * Calculate row index from Y position
 */
export const getRowIndexFromY = (y: number): number => {
  return Math.floor(y / LAYOUT.ROW_HEIGHT);
};

/**
 * Get position of "today" indicator
 */
export const getTodayPosition = (startDate: Date, pixelsPerDay: number): number => {
  const today = new Date();
  return calculatePosition(today, startDate, pixelsPerDay);
};

