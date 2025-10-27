/**
 * Constants for the Timeline component
 */

import type { ViewMode } from '@/types/timeline.types';

// Time scale configuration
export const VIEW_MODE_CONFIG: Record<ViewMode, {
  pixelsPerUnit: number;
  columnWidth: number;
  labelFormat: string;
}> = {
  day: {
    pixelsPerUnit: 40,
    columnWidth: 40,
    labelFormat: 'EEE dd', // Mon 24
  },
  week: {
    pixelsPerUnit: 80,
    columnWidth: 80,
    labelFormat: "'Week' w", // Week 43
  },
  month: {
    pixelsPerUnit: 120,
    columnWidth: 120,
    labelFormat: 'MMM yyyy', // Oct 2024
  },
};

// Layout constants
export const LAYOUT = {
  ROW_HEIGHT: 60,
  TASK_BAR_HEIGHT: 32,
  TASK_BAR_MILESTONE_HEIGHT: 24,
  TASK_BAR_PADDING: 8,
  LEFT_PANEL_WIDTH: 200,
  LEFT_PANEL_WIDTH_TABLET: 150,
  TIME_HEADER_HEIGHT: 50,
  RESIZE_HANDLE_WIDTH: 8,
} as const;

// Colors
export const DEFAULT_TASK_COLOR = '#0ea5e9';
export const TODAY_INDICATOR_COLOR = '#ef4444';
export const DEPENDENCY_LINE_COLOR = '#94a3b8';

// Animation durations (ms)
export const ANIMATION = {
  SIDEBAR_SLIDE: 300,
  FADE_IN: 200,
  DRAG_SNAP: 150,
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  ZOOM_IN: ['+', '='],
  ZOOM_OUT: ['-', '_'],
  DELETE: ['Delete', 'Backspace'],
  ESCAPE: ['Escape'],
  ENTER: ['Enter'],
  SPACE: [' '],
} as const;

// Time constants
export const MS_PER_DAY = 1000 * 60 * 60 * 24;
export const DAYS_PER_WEEK = 7;
export const MONTHS_PER_YEAR = 12;

