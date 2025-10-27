import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { TimelineTask, TaskPosition } from '@/types/timeline.types';
import { formatTaskTitle, createTaskAriaLabel, formatDateRange } from '@/utils/formatting.utils';
import { formatDate } from '@/utils/date.utils';

interface TaskBarProps {
  task: TimelineTask;
  position: TaskPosition;
  onDragStart: (taskId: string, startX: number, startY: number, initialLeft: number, rowId: string) => void;
  onResizeStart: (taskId: string, edge: 'left' | 'right', startX: number, width: number, left: number) => void;
  onClick: (task: TimelineTask) => void;
  onHover: (taskId: string | null) => void;
  isSelected?: boolean;
  isDragging?: boolean;
  isResizing?: boolean;
  dragOffset?: { x: number; y: number };
  resizePreview?: { left: number; width: number } | null;
}

export const TaskBar: React.FC<TaskBarProps> = React.memo(({
  task,
  position,
  onDragStart,
  onResizeStart,
  onClick,
  onHover,
  isSelected = false,
  isDragging = false,
  isResizing = false,
  dragOffset = { x: 0, y: 0 },
  resizePreview = null,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const actualPosition = isDragging
    ? { ...position, left: position.left + dragOffset.x, top: position.top + dragOffset.y }
    : resizePreview || position;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    // Check if clicking on resize handle
    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle-left')) {
      e.stopPropagation();
      onResizeStart(task.id, 'left', e.clientX, position.width, position.left);
      return;
    }
    if (target.classList.contains('resize-handle-right')) {
      e.stopPropagation();
      onResizeStart(task.id, 'right', e.clientX, position.width, position.left);
      return;
    }

    // Start dragging
    e.stopPropagation();
    onDragStart(task.id, e.clientX, e.clientY, position.left, task.rowId);
  }, [task, position, onDragStart, onResizeStart]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isDragging && !isResizing) {
      e.stopPropagation();
      onClick(task);
    }
  }, [task, onClick, isDragging, isResizing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(task);
    }
  }, [task, onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setShowTooltip(true);
    onHover(task.id);
  }, [task.id, onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setShowTooltip(false);
    onHover(null);
  }, [onHover]);

  const backgroundColor = task.color || '#0ea5e9';
  const displayTitle = formatTaskTitle(task.title, actualPosition.width - 40);

  if (task.isMilestone) {
    return (
      <>
        <div
          className={clsx(
            'absolute flex items-center justify-center cursor-pointer transition-all',
            isDragging && 'opacity-70 z-50',
            isSelected && 'ring-2 ring-primary-500 ring-offset-2',
            isHovering && !isDragging && 'scale-110'
          )}
          style={{
            left: `${actualPosition.left}px`,
            top: `${actualPosition.top}px`,
            width: '24px',
            height: '24px',
            transform: 'rotate(45deg)',
            backgroundColor,
          }}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="button"
          tabIndex={0}
          aria-label={createTaskAriaLabel(task.title, task.startDate, task.endDate, task.progress)}
          onKeyDown={handleKeyDown}
        />
        {showTooltip && !isDragging && (
          <div
            className="absolute z-50 px-2 py-1 text-xs text-white bg-neutral-900 rounded shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              left: `${actualPosition.left + 30}px`,
              top: `${actualPosition.top}px`,
            }}
          >
            <div className="font-medium">{task.title}</div>
            <div className="text-neutral-300">{formatDate(task.startDate)}</div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={clsx(
          'absolute rounded shadow-sm cursor-move hover:shadow-lg transition-all',
          isDragging && 'opacity-70 z-50',
          isResizing && 'opacity-70',
          isSelected && 'ring-2 ring-primary-500 ring-offset-1',
          !isDragging && !isResizing && 'hover:brightness-110'
        )}
        style={{
          left: `${actualPosition.left}px`,
          width: `${actualPosition.width}px`,
          top: `${actualPosition.top}px`,
          height: `${actualPosition.height}px`,
          backgroundColor,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={createTaskAriaLabel(task.title, task.startDate, task.endDate, task.progress)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between h-full px-2">
          <span className="text-xs font-medium text-white truncate">
            {displayTitle}
          </span>
          {actualPosition.width > 60 && (
            <span className="text-xs text-white opacity-75 ml-2">
              {task.progress}%
            </span>
          )}
        </div>

        {/* Progress bar overlay */}
        {task.progress > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-white opacity-40 rounded-b"
            style={{ width: `${task.progress}%` }}
          />
        )}

        {/* Resize handles */}
        {!isDragging && !isResizing && (
          <>
            <div
              className="resize-handle-left absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white opacity-0 hover:opacity-50 transition-opacity"
              onMouseDown={handleMouseDown}
            />
            <div
              className="resize-handle-right absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white opacity-0 hover:opacity-50 transition-opacity"
              onMouseDown={handleMouseDown}
            />
          </>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && !isDragging && !isResizing && (
        <div
          className="absolute z-50 px-3 py-2 text-xs text-white bg-neutral-900 rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: `${actualPosition.left}px`,
            top: `${actualPosition.top - 50}px`,
          }}
        >
          <div className="font-medium">{task.title}</div>
          <div className="text-neutral-300">{formatDateRange(task.startDate, task.endDate)}</div>
          <div className="text-neutral-300">Progress: {task.progress}%</div>
          {task.assignee && <div className="text-neutral-300">Assigned: {task.assignee}</div>}
        </div>
      )}
    </>
  );
});

TaskBar.displayName = 'TaskBar';

