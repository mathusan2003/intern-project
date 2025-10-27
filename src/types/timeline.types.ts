/**
 * Core type definitions for the Timeline/Gantt View component
 */

export interface TimelineTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  assignee?: string;
  rowId: string; // which row/resource this belongs to
  dependencies?: string[]; // IDs of tasks this depends on
  color?: string;
  isMilestone?: boolean;
  description?: string;
}

export interface TimelineRow {
  id: string;
  label: string;
  avatar?: string;
  tasks: string[]; // task IDs assigned to this row
}

export type ViewMode = 'day' | 'week' | 'month';

export interface TimelineViewProps {
  rows: TimelineRow[];
  tasks: Record<string, TimelineTask>;
  startDate: Date;
  endDate: Date;
  viewMode: ViewMode;
  onTaskUpdate?: (taskId: string, updates: Partial<TimelineTask>) => void;
  onTaskMove?: (taskId: string, newRowId: string, newStartDate: Date) => void;
  onTaskClick?: (task: TimelineTask) => void;
  onTaskDelete?: (taskId: string) => void;
}

export interface TaskPosition {
  left: number;
  width: number;
  top: number;
  height: number;
}

export interface DependencyLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fromTaskId: string;
  toTaskId: string;
}

export interface TimeScaleItem {
  date: Date;
  label: string;
  position: number;
}

export interface DragState {
  isDragging: boolean;
  taskId: string | null;
  startX: number;
  startY: number;
  initialLeft: number;
  initialRowId: string | null;
}

export interface ResizeState {
  isResizing: boolean;
  taskId: string | null;
  edge: 'left' | 'right' | null;
  startX: number;
  initialWidth: number;
  initialLeft: number;
}

export interface TimelineState {
  viewMode: ViewMode;
  startDate: Date;
  endDate: Date;
  pixelsPerDay: number;
  selectedTaskId: string | null;
  hoveredTaskId: string | null;
}

