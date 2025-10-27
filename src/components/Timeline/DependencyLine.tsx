import React from 'react';
import { DependencyLine as DependencyLineType } from '@/types/timeline.types';
import { calculateDependencyPath } from '@/utils/dependency.utils';
import { DEPENDENCY_LINE_COLOR } from '@/constants/timeline.constants';

interface DependencyLineProps {
  line: DependencyLineType;
  isHighlighted?: boolean;
}

export const DependencyLine: React.FC<DependencyLineProps> = React.memo(({
  line,
  isHighlighted = false,
}) => {
  const path = calculateDependencyPath(line);

  return (
    <g className="dependency-line">
      <path
        d={path}
        stroke={isHighlighted ? '#3b82f6' : DEPENDENCY_LINE_COLOR}
        strokeWidth={isHighlighted ? 2.5 : 2}
        fill="none"
        markerEnd="url(#arrowhead)"
        className="transition-all"
        opacity={isHighlighted ? 1 : 0.6}
      />
    </g>
  );
});

DependencyLine.displayName = 'DependencyLine';

interface DependencyLinesContainerProps {
  lines: DependencyLineType[];
  highlightedTaskIds?: Set<string>;
  width: number;
  height: number;
}

export const DependencyLinesContainer: React.FC<DependencyLinesContainerProps> = React.memo(({
  lines,
  highlightedTaskIds,
  width,
  height,
}) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      width={width}
      height={height}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill={DEPENDENCY_LINE_COLOR}
          />
        </marker>
        <marker
          id="arrowhead-highlighted"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="#3b82f6"
          />
        </marker>
      </defs>
      {lines.map((line, index) => {
        const isHighlighted = highlightedTaskIds?.has(line.fromTaskId) || highlightedTaskIds?.has(line.toTaskId);
        return (
          <DependencyLine
            key={`${line.fromTaskId}-${line.toTaskId}-${index}`}
            line={line}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </svg>
  );
});

DependencyLinesContainer.displayName = 'DependencyLinesContainer';

