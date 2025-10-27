import React, { useMemo } from 'react';
import clsx from 'clsx';
import { ViewMode, TimeScaleItem } from '@/types/timeline.types';
import { generateTimeScale, getTodayPosition } from '@/utils/position.utils';
import { VIEW_MODE_CONFIG, LAYOUT, TODAY_INDICATOR_COLOR } from '@/constants/timeline.constants';
import { isToday as checkIsToday } from '@/utils/date.utils';

interface TimelineGridProps {
  startDate: Date;
  endDate: Date;
  viewMode: ViewMode;
  pixelsPerDay: number;
  timelineWidth: number;
  timelineHeight: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = React.memo(({
  startDate,
  endDate,
  viewMode,
  pixelsPerDay,
  timelineWidth,
  timelineHeight,
}) => {
  const config = VIEW_MODE_CONFIG[viewMode];
  
  const timeScale = useMemo(
    () => generateTimeScale(startDate, endDate, viewMode, config.columnWidth),
    [startDate, endDate, viewMode, config.columnWidth]
  );

  const todayPosition = useMemo(
    () => getTodayPosition(startDate, pixelsPerDay),
    [startDate, pixelsPerDay]
  );

  const showTodayIndicator = todayPosition >= 0 && todayPosition <= timelineWidth;

  return (
    <div className="relative">
      {/* Time scale header */}
      <div
        className="flex border-b border-neutral-300 bg-neutral-100 sticky top-0 z-20"
        style={{ height: `${LAYOUT.TIME_HEADER_HEIGHT}px` }}
      >
        {/* Left panel spacer */}
        <div
          className="border-r border-neutral-300 bg-neutral-50 sticky left-0 z-30"
          style={{ width: `${LAYOUT.LEFT_PANEL_WIDTH}px`, minWidth: `${LAYOUT.LEFT_PANEL_WIDTH}px` }}
        />

        {/* Time scale labels */}
        <div
          className="relative"
          style={{ width: `${timelineWidth}px`, minWidth: `${timelineWidth}px` }}
        >
          {timeScale.map((item: TimeScaleItem, index: number) => {
            const isToday = checkIsToday(item.date);
            
            return (
              <div
                key={index}
                className={clsx(
                  'absolute inset-y-0 flex items-center justify-center text-xs font-medium border-r border-neutral-200',
                  isToday ? 'text-error-600 bg-error-50' : 'text-neutral-700'
                )}
                style={{
                  left: `${item.position}px`,
                  width: `${config.columnWidth}px`,
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid lines and today indicator overlay */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${LAYOUT.LEFT_PANEL_WIDTH}px`,
          top: `${LAYOUT.TIME_HEADER_HEIGHT}px`,
          width: `${timelineWidth}px`,
          height: `${timelineHeight}px`,
        }}
      >
        {/* Vertical grid lines */}
        {timeScale.map((item: TimeScaleItem, index: number) => (
          <div
            key={index}
            className="absolute inset-y-0 w-px bg-neutral-200"
            style={{ left: `${item.position}px` }}
          />
        ))}

        {/* Today indicator */}
        {showTodayIndicator && (
          <div
            className="absolute inset-y-0 w-0.5 z-30"
            style={{
              left: `${todayPosition}px`,
              backgroundColor: TODAY_INDICATOR_COLOR,
            }}
          >
            <div
              className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium text-white rounded whitespace-nowrap"
              style={{ backgroundColor: TODAY_INDICATOR_COLOR }}
            >
              Today
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

TimelineGrid.displayName = 'TimelineGrid';

