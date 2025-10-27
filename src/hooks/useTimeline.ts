import { useState, useCallback, useMemo } from 'react';
import { ViewMode, TimelineState } from '@/types/timeline.types';
import { VIEW_MODE_CONFIG } from '@/constants/timeline.constants';

export const useTimeline = (initialDate: Date = new Date()) => {
  const [state, setState] = useState<TimelineState>({
    viewMode: 'week',
    startDate: new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
    endDate: new Date(initialDate.getFullYear(), initialDate.getMonth() + 3, 0),
    pixelsPerDay: VIEW_MODE_CONFIG.week.pixelsPerUnit / 7, // 80px per week / 7 days
    selectedTaskId: null,
    hoveredTaskId: null,
  });

  const setViewMode = useCallback((viewMode: ViewMode) => {
    setState(prev => ({
      ...prev,
      viewMode,
      pixelsPerDay: calculatePixelsPerDay(viewMode),
    }));
  }, []);

  const calculatePixelsPerDay = (viewMode: ViewMode): number => {
    const config = VIEW_MODE_CONFIG[viewMode];
    switch (viewMode) {
      case 'day':
        return config.pixelsPerUnit; // 40px per day
      case 'week':
        return config.pixelsPerUnit / 7; // 80px per week / 7 days
      case 'month':
        return config.pixelsPerUnit / 30; // 120px per month / ~30 days
      default:
        return 40;
    }
  };

  const zoomIn = useCallback(() => {
    setState(prev => {
      if (prev.viewMode === 'month') {
        return { ...prev, viewMode: 'week', pixelsPerDay: VIEW_MODE_CONFIG.week.pixelsPerUnit / 7 };
      }
      if (prev.viewMode === 'week') {
        return { ...prev, viewMode: 'day', pixelsPerDay: VIEW_MODE_CONFIG.day.pixelsPerUnit };
      }
      return prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => {
      if (prev.viewMode === 'day') {
        return { ...prev, viewMode: 'week', pixelsPerDay: VIEW_MODE_CONFIG.week.pixelsPerUnit / 7 };
      }
      if (prev.viewMode === 'week') {
        return { ...prev, viewMode: 'month', pixelsPerDay: VIEW_MODE_CONFIG.month.pixelsPerUnit / 30 };
      }
      return prev;
    });
  }, []);

  const scrollToToday = useCallback(() => {
    const today = new Date();
    setState(prev => ({
      ...prev,
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 2, 0),
    }));
  }, []);

  const setDateRange = useCallback((startDate: Date, endDate: Date) => {
    setState(prev => ({
      ...prev,
      startDate,
      endDate,
    }));
  }, []);

  const setSelectedTask = useCallback((taskId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedTaskId: taskId,
    }));
  }, []);

  const setHoveredTask = useCallback((taskId: string | null) => {
    setState(prev => ({
      ...prev,
      hoveredTaskId: taskId,
    }));
  }, []);

  const canZoomIn = useMemo(() => state.viewMode !== 'day', [state.viewMode]);
  const canZoomOut = useMemo(() => state.viewMode !== 'month', [state.viewMode]);

  return {
    ...state,
    setViewMode,
    zoomIn,
    zoomOut,
    scrollToToday,
    setDateRange,
    setSelectedTask,
    setHoveredTask,
    canZoomIn,
    canZoomOut,
  };
};

