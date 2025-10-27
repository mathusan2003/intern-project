import React from 'react';
import clsx from 'clsx';
import { TimelineRow as TimelineRowType } from '@/types/timeline.types';
import { LAYOUT } from '@/constants/timeline.constants';
import { createRowAriaLabel, getInitials } from '@/utils/formatting.utils';

interface TimelineRowProps {
  row: TimelineRowType;
  index: number;
  timelineWidth: number;
}

export const TimelineRow: React.FC<TimelineRowProps> = React.memo(({
  row,
  index,
  timelineWidth,
}) => {
  const backgroundColor = index % 2 === 0 ? 'bg-neutral-50' : 'bg-white';
  
  return (
    <div
      className={clsx('flex border-b border-neutral-200', backgroundColor)}
      style={{ height: `${LAYOUT.ROW_HEIGHT}px` }}
      role="region"
      aria-label={createRowAriaLabel(row.label, row.tasks.length)}
    >
      {/* Left panel - Row label */}
      <div
        className="flex items-center px-4 border-r border-neutral-200 bg-white sticky left-0 z-10"
        style={{ width: `${LAYOUT.LEFT_PANEL_WIDTH}px`, minWidth: `${LAYOUT.LEFT_PANEL_WIDTH}px` }}
      >
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          {row.avatar ? (
            <img
              src={row.avatar}
              alt={row.label}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium">
              {getInitials(row.label)}
            </div>
          )}
          
          {/* Label */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-neutral-900 truncate">
              {row.label}
            </div>
            <div className="text-xs text-neutral-500">
              {row.tasks.length} {row.tasks.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Timeline grid */}
      <div
        className="relative"
        style={{ width: `${timelineWidth}px`, minWidth: `${timelineWidth}px` }}
      >
        {/* Grid lines will be rendered by TimelineGrid */}
      </div>
    </div>
  );
});

TimelineRow.displayName = 'TimelineRow';

