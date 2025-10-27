/**
 * Dependency calculation utilities for task relationships
 */

import { TimelineTask, DependencyLine, TaskPosition } from '@/types/timeline.types';

/**
 * Calculate dependency line coordinates between two tasks
 */
export const calculateDependencyLine = (
  fromTask: TimelineTask,
  toTask: TimelineTask,
  fromPosition: TaskPosition,
  toPosition: TaskPosition
): DependencyLine => {
  // Start from end of predecessor task (right edge, middle height)
  const x1 = fromPosition.left + fromPosition.width;
  const y1 = fromPosition.top + fromPosition.height / 2;

  // End at start of dependent task (left edge, middle height)
  const x2 = toPosition.left;
  const y2 = toPosition.top + toPosition.height / 2;

  return {
    x1,
    y1,
    x2,
    y2,
    fromTaskId: fromTask.id,
    toTaskId: toTask.id,
  };
};

/**
 * Calculate SVG path for dependency line with proper routing
 */
export const calculateDependencyPath = (line: DependencyLine): string => {
  const { x1, y1, x2, y2 } = line;
  
  // If tasks are on different rows, create a stepped path
  if (Math.abs(y2 - y1) > 5) {
    const midX = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  }
  
  // If tasks are on the same row, create a curved path
  const curveOffset = 20;
  return `M ${x1} ${y1} C ${x1 + curveOffset} ${y1}, ${x2 - curveOffset} ${y2}, ${x2} ${y2}`;
};

/**
 * Get all direct dependencies for a task
 */
export const getTaskDependencies = (
  taskId: string,
  tasks: Record<string, TimelineTask>
): string[] => {
  const task = tasks[taskId];
  return task?.dependencies || [];
};

/**
 * Get all tasks that depend on this task (reverse dependencies)
 */
export const getDependentTasks = (
  taskId: string,
  tasks: Record<string, TimelineTask>
): string[] => {
  return Object.values(tasks)
    .filter(task => task.dependencies?.includes(taskId))
    .map(task => task.id);
};

/**
 * Get all tasks in a dependency chain (recursive)
 */
export const getDependencyChain = (
  taskId: string,
  tasks: Record<string, TimelineTask>,
  visited: Set<string> = new Set()
): string[] => {
  if (visited.has(taskId)) {
    return []; // Prevent circular dependencies
  }

  visited.add(taskId);
  const dependencies = getTaskDependencies(taskId, tasks);
  const chain = [taskId];

  dependencies.forEach(depId => {
    chain.push(...getDependencyChain(depId, tasks, visited));
  });

  return chain;
};

/**
 * Check if there would be a circular dependency
 */
export const wouldCreateCircularDependency = (
  taskId: string,
  newDependencyId: string,
  tasks: Record<string, TimelineTask>
): boolean => {
  const chain = getDependencyChain(newDependencyId, tasks);
  return chain.includes(taskId);
};

/**
 * Validate dependency relationships
 */
export const validateDependency = (
  fromTaskId: string,
  toTaskId: string,
  tasks: Record<string, TimelineTask>
): { valid: boolean; error?: string } => {
  // Can't depend on itself
  if (fromTaskId === toTaskId) {
    return { valid: false, error: 'Task cannot depend on itself' };
  }

  // Check if tasks exist
  if (!tasks[fromTaskId] || !tasks[toTaskId]) {
    return { valid: false, error: 'Task not found' };
  }

  // Check for circular dependencies
  if (wouldCreateCircularDependency(toTaskId, fromTaskId, tasks)) {
    return { valid: false, error: 'Would create circular dependency' };
  }

  // Check if dependency already exists
  const existingDeps = getTaskDependencies(toTaskId, tasks);
  if (existingDeps.includes(fromTaskId)) {
    return { valid: false, error: 'Dependency already exists' };
  }

  return { valid: true };
};

/**
 * Calculate critical path (longest path of dependencies)
 */
export const calculateCriticalPath = (
  tasks: Record<string, TimelineTask>
): string[] => {
  const taskArray = Object.values(tasks);
  let longestPath: string[] = [];
  let maxDuration = 0;

  taskArray.forEach(task => {
    const chain = getDependencyChain(task.id, tasks);
    const duration = chain.reduce((sum, taskId) => {
      const t = tasks[taskId];
      return sum + (t.endDate.getTime() - t.startDate.getTime());
    }, 0);

    if (duration > maxDuration) {
      maxDuration = duration;
      longestPath = chain;
    }
  });

  return longestPath;
};

/**
 * Get all dependency lines for rendering
 */
export const getAllDependencyLines = (
  tasks: Record<string, TimelineTask>,
  positions: Map<string, TaskPosition>
): DependencyLine[] => {
  const lines: DependencyLine[] = [];

  Object.values(tasks).forEach(task => {
    const dependencies = task.dependencies || [];
    const toPosition = positions.get(task.id);

    if (!toPosition) return;

    dependencies.forEach(depId => {
      const fromTask = tasks[depId];
      const fromPosition = positions.get(depId);

      if (fromTask && fromPosition) {
        lines.push(calculateDependencyLine(fromTask, task, fromPosition, toPosition));
      }
    });
  });

  return lines;
};

