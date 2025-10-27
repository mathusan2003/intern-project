import type { Meta, StoryObj } from '@storybook/react';
import { TimelineView } from './TimelineView';
import { sampleRows, sampleTasks, emptyRows, emptyTasks, createLargeDataset } from './sampleData';
import { TimelineViewProps } from './TimelineView.types';
import '../../../src/styles/globals.css';

const meta = {
  title: 'Timeline/TimelineView',
  component: TimelineView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fully interactive Timeline/Gantt View component for visualizing project tasks with dependencies, drag-and-drop, and resource allocation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    viewMode: {
      control: { type: 'select' },
      options: ['day', 'week', 'month'],
      description: 'Time scale view mode',
    },
    onTaskUpdate: { action: 'taskUpdated' },
    onTaskMove: { action: 'taskMoved' },
    onTaskClick: { action: 'taskClicked' },
    onTaskDelete: { action: 'taskDeleted' },
  },
} satisfies Meta<typeof TimelineView>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default timeline with sample tasks showing various states and progress levels.
 */
export const Default: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2025, 1, 15),
    viewMode: 'week',
  },
};

/**
 * Empty timeline state with no tasks.
 * Demonstrates the empty state UI when no tasks are present.
 */
export const Empty: Story = {
  args: {
    rows: emptyRows,
    tasks: emptyTasks,
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2025, 1, 15),
    viewMode: 'week',
  },
};

/**
 * Timeline showing task dependencies with connecting lines.
 * Hover over tasks to highlight dependency chains.
 */
export const WithDependencies: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2025, 1, 15),
    viewMode: 'week',
  },
  parameters: {
    docs: {
      description: {
        story: 'Task 2 (Integration Testing) depends on Task 1 (UI Component Development) and Task 3 (API Development). Task 6 (Launch milestone) depends on Task 2.',
      },
    },
  },
};

/**
 * Day view mode showing daily time scale.
 * Best for detailed, short-term planning.
 */
export const DayView: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 31),
    viewMode: 'day',
  },
};

/**
 * Week view mode showing weekly time scale.
 * Balanced view for medium-term planning.
 */
export const WeekView: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2025, 1, 15),
    viewMode: 'week',
  },
};

/**
 * Month view mode showing monthly time scale.
 * Best for high-level, long-term planning.
 */
export const MonthView: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2024, 10, 1),
    endDate: new Date(2025, 3, 30),
    viewMode: 'month',
  },
};

/**
 * Large dataset with 30+ tasks across multiple rows.
 * Tests performance and virtualization with many tasks.
 */
export const LargeDataset: Story = {
  args: {
    ...createLargeDataset(10, 5),
    startDate: new Date(2024, 11, 1),
    endDate: new Date(2025, 2, 31),
    viewMode: 'week',
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with 50 tasks across 10 rows. Component should handle this smoothly with optimized rendering.',
      },
    },
  },
};

/**
 * Interactive demo with full functionality.
 * Try dragging tasks, resizing them, clicking for details, and using zoom controls.
 */
export const Interactive: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2025, 1, 15),
    viewMode: 'week',
  },
  parameters: {
    docs: {
      description: {
        story: `Interactive features:
- **Drag & Drop**: Click and drag task bars to move them
- **Resize**: Drag the left or right edge of a task to change its duration
- **Click**: Click a task to open the detail sidebar
- **Zoom**: Use + and - keys or toolbar buttons to change view modes
- **Today**: Click "Today" button to scroll to current date`,
      },
    },
  },
};

/**
 * Mobile-responsive view demonstrating layout adaptation.
 * View this story in different viewport sizes using Storybook's viewport addon.
 */
export const MobileView: Story = {
  args: {
    rows: sampleRows.slice(0, 3),
    tasks: Object.fromEntries(
      Object.entries(sampleTasks).slice(0, 4)
    ),
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 31),
    viewMode: 'week',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Timeline adapts to smaller screens with narrower left panel and optimized touch interactions.',
      },
    },
  },
};

/**
 * Accessibility demonstration with keyboard navigation.
 * Use Tab to navigate, Enter to select, +/- to zoom, and Arrow keys to move between tasks.
 */
export const Accessibility: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2025, 1, 15),
    viewMode: 'week',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-visible',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        story: `Accessibility features:
- **Keyboard Navigation**: Tab through interactive elements
- **ARIA Labels**: Screen reader support for all tasks and rows
- **Focus Indicators**: Clear visual focus states
- **Keyboard Shortcuts**: 
  - \`Tab\`: Navigate between elements
  - \`Enter\`/\`Space\`: Select/activate task
  - \`+\`/\`-\`: Zoom in/out
  - \`Escape\`: Close modals/sidebars`,
      },
    },
  },
};

/**
 * Milestone markers demonstration.
 * Milestones are displayed as diamond shapes at specific dates.
 */
export const WithMilestones: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2025, 1, 15),
    viewMode: 'week',
  },
  parameters: {
    docs: {
      description: {
        story: 'Task 6 is a milestone (diamond shape) representing the product launch date.',
      },
    },
  },
};

/**
 * Today indicator showing current date line.
 * The red vertical line marks today's date on the timeline.
 */
export const TodayIndicator: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
    viewMode: 'week',
  },
  parameters: {
    docs: {
      description: {
        story: 'A red vertical line with "Today" label marks the current date on the timeline.',
      },
    },
  },
};

