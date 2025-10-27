import { useState, useCallback, useRef } from 'react';
import { DragState, ResizeState } from '@/types/timeline.types';
import { calculateDateFromPosition, getRowIndexFromY, snapToGrid } from '@/utils/position.utils';

interface UseDragAndDropProps {
  pixelsPerDay: number;
  viewStartDate: Date;
  onTaskMove?: (taskId: string, newRowId: string, newStartDate: Date) => void;
  onTaskResize?: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
  rows: Array<{ id: string }>;
}

export const useDragAndDrop = ({
  pixelsPerDay,
  viewStartDate,
  onTaskMove,
  onTaskResize,
  rows,
}: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    taskId: null,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialRowId: null,
  });

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    taskId: null,
    edge: null,
    startX: 0,
    initialWidth: 0,
    initialLeft: 0,
  });

  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Start dragging a task
  const startDrag = useCallback((
    taskId: string,
    startX: number,
    startY: number,
    initialLeft: number,
    rowId: string
  ) => {
    setDragState({
      isDragging: true,
      taskId,
      startX,
      startY,
      initialLeft,
      initialRowId: rowId,
    });
    dragOffsetRef.current = { x: 0, y: 0 };
  }, []);

  // Update drag position
  const updateDrag = useCallback((currentX: number, currentY: number) => {
    if (!dragState.isDragging) return null;

    const deltaX = currentX - dragState.startX;
    const deltaY = currentY - dragState.startY;

    dragOffsetRef.current = { x: deltaX, y: deltaY };

    return {
      newLeft: dragState.initialLeft + deltaX,
      deltaY,
    };
  }, [dragState]);

  // End dragging
  const endDrag = useCallback((currentX: number, currentY: number) => {
    if (!dragState.isDragging || !dragState.taskId || !dragState.initialRowId) {
      setDragState({
        isDragging: false,
        taskId: null,
        startX: 0,
        startY: 0,
        initialLeft: 0,
        initialRowId: null,
      });
      return;
    }

    const deltaX = currentX - dragState.startX;
    const deltaY = currentY - dragState.startY;

    // Calculate new position
    const newLeft = snapToGrid(dragState.initialLeft + deltaX, pixelsPerDay);
    const newStartDate = calculateDateFromPosition(newLeft, viewStartDate, pixelsPerDay);

    // Calculate new row
    const rowIndexDelta = Math.round(deltaY / 60); // LAYOUT.ROW_HEIGHT = 60
    const currentRowIndex = rows.findIndex(r => r.id === dragState.initialRowId);
    const newRowIndex = Math.max(0, Math.min(rows.length - 1, currentRowIndex + rowIndexDelta));
    const newRowId = rows[newRowIndex]?.id || dragState.initialRowId;

    // Call callback
    if (onTaskMove) {
      onTaskMove(dragState.taskId, newRowId, newStartDate);
    }

    setDragState({
      isDragging: false,
      taskId: null,
      startX: 0,
      startY: 0,
      initialLeft: 0,
      initialRowId: null,
    });
  }, [dragState, pixelsPerDay, viewStartDate, rows, onTaskMove]);

  // Start resizing
  const startResize = useCallback((
    taskId: string,
    edge: 'left' | 'right',
    startX: number,
    initialWidth: number,
    initialLeft: number
  ) => {
    setResizeState({
      isResizing: true,
      taskId,
      edge,
      startX,
      initialWidth,
      initialLeft,
    });
  }, []);

  // Update resize
  const updateResize = useCallback((currentX: number) => {
    if (!resizeState.isResizing) return null;

    const delta = currentX - resizeState.startX;

    if (resizeState.edge === 'left') {
      return {
        newLeft: resizeState.initialLeft + delta,
        newWidth: Math.max(40, resizeState.initialWidth - delta),
      };
    } else {
      return {
        newLeft: resizeState.initialLeft,
        newWidth: Math.max(40, resizeState.initialWidth + delta),
      };
    }
  }, [resizeState]);

  // End resizing
  const endResize = useCallback((currentX: number, taskStartDate: Date, taskEndDate: Date) => {
    if (!resizeState.isResizing || !resizeState.taskId) {
      setResizeState({
        isResizing: false,
        taskId: null,
        edge: null,
        startX: 0,
        initialWidth: 0,
        initialLeft: 0,
      });
      return;
    }

    const delta = currentX - resizeState.startX;

    let newStartDate = taskStartDate;
    let newEndDate = taskEndDate;

    if (resizeState.edge === 'left') {
      const newLeft = snapToGrid(resizeState.initialLeft + delta, pixelsPerDay);
      newStartDate = calculateDateFromPosition(newLeft, viewStartDate, pixelsPerDay);
    } else {
      const newWidth = Math.max(40, resizeState.initialWidth + delta);
      const snappedWidth = snapToGrid(newWidth, pixelsPerDay);
      const newRight = resizeState.initialLeft + snappedWidth;
      newEndDate = calculateDateFromPosition(newRight, viewStartDate, pixelsPerDay);
    }

    // Ensure start is before end
    if (newStartDate >= newEndDate) {
      setResizeState({
        isResizing: false,
        taskId: null,
        edge: null,
        startX: 0,
        initialWidth: 0,
        initialLeft: 0,
      });
      return;
    }

    // Call callback
    if (onTaskResize) {
      onTaskResize(resizeState.taskId, newStartDate, newEndDate);
    }

    setResizeState({
      isResizing: false,
      taskId: null,
      edge: null,
      startX: 0,
      initialWidth: 0,
      initialLeft: 0,
    });
  }, [resizeState, pixelsPerDay, viewStartDate, onTaskResize]);

  // Cancel drag or resize
  const cancel = useCallback(() => {
    setDragState({
      isDragging: false,
      taskId: null,
      startX: 0,
      startY: 0,
      initialLeft: 0,
      initialRowId: null,
    });
    setResizeState({
      isResizing: false,
      taskId: null,
      edge: null,
      startX: 0,
      initialWidth: 0,
      initialLeft: 0,
    });
  }, []);

  return {
    dragState,
    resizeState,
    startDrag,
    updateDrag,
    endDrag,
    startResize,
    updateResize,
    endResize,
    cancel,
    isDragging: dragState.isDragging,
    isResizing: resizeState.isResizing,
  };
};

