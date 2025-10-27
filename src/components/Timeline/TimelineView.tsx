import React, { useState, useMemo, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { TimelineViewProps, TimelineTask, TaskPosition, DependencyLine } from './TimelineView.types';
import { TimelineGrid } from './TimelineGrid';
import { TimelineRow } from './TimelineRow';
import { TaskBar } from './TaskBar';
import { DependencyLinesContainer } from './DependencyLine';
import { TaskDetailSidebar } from './TaskDetailSidebar';
import { Button } from '@/components/primitives/Button';
import { useTimeline } from '@/hooks/useTimeline';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useScrollSync } from '@/hooks/useScrollSync';
import { calculateTaskPosition, calculateTimelineWidth } from '@/utils/position.utils';
import { getAllDependencyLines } from '@/utils/dependency.utils';
import { LAYOUT } from '@/constants/timeline.constants';

export const TimelineView: React.FC<TimelineViewProps> = ({
  rows,
  tasks,
  startDate: initialStartDate,
  endDate: initialEndDate,
  viewMode: initialViewMode,
  onTaskUpdate,
  onTaskMove,
  onTaskClick,
  onTaskDelete,
}) => {
  const {
    viewMode,
    pixelsPerDay,
    selectedTaskId,
    hoveredTaskId,
    setViewMode,
    zoomIn,
    zoomOut,
    setSelectedTask,
    setHoveredTask,
    canZoomIn,
    canZoomOut,
  } = useTimeline(initialStartDate);

  const [localTasks, setLocalTasks] = useState(tasks);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Sync external changes
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode, setViewMode]);

  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const timelineWidth = useMemo(
    () => calculateTimelineWidth(startDate, endDate, pixelsPerDay),
    [startDate, endDate, pixelsPerDay]
  );

  const timelineHeight = useMemo(
    () => rows.length * LAYOUT.ROW_HEIGHT,
    [rows.length]
  );

  // Calculate task positions
  const taskPositions = useMemo(() => {
    const positions = new Map<string, TaskPosition>();
    
    rows.forEach((row, rowIndex) => {
      row.tasks.forEach(taskId => {
        const task = localTasks[taskId];
        if (task) {
          const position = calculateTaskPosition(task, startDate, pixelsPerDay, rowIndex);
          positions.set(taskId, position);
        }
      });
    });

    return positions;
  }, [rows, localTasks, startDate, pixelsPerDay]);

  // Calculate dependency lines
  const dependencyLines = useMemo(() => {
    return getAllDependencyLines(localTasks, taskPositions);
  }, [localTasks, taskPositions]);

  // Drag and drop
  const {
    dragState,
    resizeState,
    startDrag,
    updateDrag,
    endDrag,
    startResize,
    updateResize,
    endResize,
  } = useDragAndDrop({
    pixelsPerDay,
    viewStartDate: startDate,
    onTaskMove: (taskId, newRowId, newStartDate) => {
      const task = localTasks[taskId];
      if (!task) return;

      const duration = task.endDate.getTime() - task.startDate.getTime();
      const newEndDate = new Date(newStartDate.getTime() + duration);

      const updatedTask = {
        ...task,
        rowId: newRowId,
        startDate: newStartDate,
        endDate: newEndDate,
      };

      setLocalTasks(prev => ({ ...prev, [taskId]: updatedTask }));
      onTaskMove?.(taskId, newRowId, newStartDate);
    },
    onTaskResize: (taskId, newStartDate, newEndDate) => {
      const task = localTasks[taskId];
      if (!task) return;

      const updatedTask = {
        ...task,
        startDate: newStartDate,
        endDate: newEndDate,
      };

      setLocalTasks(prev => ({ ...prev, [taskId]: updatedTask }));
      onTaskUpdate?.(taskId, { startDate: newStartDate, endDate: newEndDate });
    },
    rows,
  });

  // Scroll synchronization
  const { headerRef, bodyRef, scrollToToday: scrollToTodayPos } = useScrollSync();

  // Mouse move handler for drag/resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        updateDrag(e.clientX, e.clientY);
      } else if (resizeState.isResizing) {
        updateResize(e.clientX);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (dragState.isDragging) {
        endDrag(e.clientX, e.clientY);
      } else if (resizeState.isResizing && resizeState.taskId) {
        const task = localTasks[resizeState.taskId];
        if (task) {
          endResize(e.clientX, task.startDate, task.endDate);
        }
      }
    };

    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState, updateDrag, updateResize, endDrag, endResize, localTasks]);

  // Handle task click
  const handleTaskClick = useCallback((task: TimelineTask) => {
    setSelectedTask(task.id);
    setSidebarOpen(true);
    onTaskClick?.(task);
  }, [setSelectedTask, onTaskClick]);

  // Handle task update from sidebar
  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<TimelineTask>) => {
    const task = localTasks[taskId];
    if (!task) return;

    const updatedTask = { ...task, ...updates };
    setLocalTasks(prev => ({ ...prev, [taskId]: updatedTask }));
    onTaskUpdate?.(taskId, updates);
  }, [localTasks, onTaskUpdate]);

  // Handle task delete
  const handleTaskDelete = useCallback((taskId: string) => {
    const newTasks = { ...localTasks };
    delete newTasks[taskId];
    setLocalTasks(newTasks);
    onTaskDelete?.(taskId);
  }, [localTasks, onTaskDelete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        if (canZoomIn) {
          e.preventDefault();
          zoomIn();
        }
      } else if (e.key === '-' || e.key === '_') {
        if (canZoomOut) {
          e.preventDefault();
          zoomOut();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, canZoomIn, canZoomOut]);

  const currentDragOffset = dragState.isDragging ? updateDrag(0, 0) : null;
  const currentResizePreview = resizeState.isResizing ? updateResize(0) : null;

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-neutral-900">Timeline View</h1>
          
          {/* View Mode Selector */}
          <div className="flex rounded-lg border border-neutral-300 overflow-hidden">
            {(['day', 'week', 'month'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={clsx(
                  'px-4 py-1.5 text-sm font-medium transition-colors',
                  viewMode === mode
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                )}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={!canZoomOut}
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={!canZoomIn}
            aria-label="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => scrollToTodayPos(0, 800)}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Grid and Header */}
        <div ref={headerRef} className="overflow-x-auto overflow-y-hidden">
          <TimelineGrid
            startDate={startDate}
            endDate={endDate}
            viewMode={viewMode}
            pixelsPerDay={pixelsPerDay}
            timelineWidth={timelineWidth}
            timelineHeight={timelineHeight}
          />
        </div>

        {/* Timeline Body */}
        <div ref={bodyRef} className="overflow-auto flex-1" style={{ height: 'calc(100% - 50px)' }}>
          <div className="relative">
            {/* Rows */}
            {rows.map((row, index) => (
              <TimelineRow
                key={row.id}
                row={row}
                index={index}
                timelineWidth={timelineWidth}
              />
            ))}

            {/* Task Bars Layer */}
            <div
              className="absolute top-0 pointer-events-none"
              style={{
                left: `${LAYOUT.LEFT_PANEL_WIDTH}px`,
                width: `${timelineWidth}px`,
                height: `${timelineHeight}px`,
              }}
            >
              {/* Dependency Lines */}
              <DependencyLinesContainer
                lines={dependencyLines}
                highlightedTaskIds={hoveredTaskId ? new Set([hoveredTaskId]) : undefined}
                width={timelineWidth}
                height={timelineHeight}
              />

              {/* Task Bars */}
              <div className="pointer-events-auto">
                {Object.values(localTasks).map(task => {
                  const position = taskPositions.get(task.id);
                  if (!position) return null;

                  const isDraggingThis = dragState.taskId === task.id;
                  const isResizingThis = resizeState.taskId === task.id;

                  return (
                    <TaskBar
                      key={task.id}
                      task={task}
                      position={position}
                      onDragStart={(taskId, startX, startY, initialLeft, rowId) =>
                        startDrag(taskId, startX, startY, initialLeft, rowId)
                      }
                      onResizeStart={(taskId, edge, startX, width, left) =>
                        startResize(taskId, edge, startX, width, left)
                      }
                      onClick={handleTaskClick}
                      onHover={setHoveredTask}
                      isSelected={selectedTaskId === task.id}
                      isDragging={isDraggingThis}
                      isResizing={isResizingThis}
                      dragOffset={isDraggingThis && currentDragOffset ? { x: currentDragOffset.newLeft - position.left, y: currentDragOffset.deltaY } : undefined}
                      resizePreview={isResizingThis && currentResizePreview ? currentResizePreview : undefined}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {Object.keys(localTasks).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-neutral-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No tasks yet</h3>
              <p className="text-neutral-500">Add some tasks to get started with your timeline.</p>
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Sidebar */}
      <TaskDetailSidebar
        task={selectedTaskId ? localTasks[selectedTaskId] : null}
        isOpen={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        allTasks={localTasks}
      />
    </div>
  );
};

