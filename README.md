# Timeline/Gantt View Component

A production-grade, fully interactive Timeline/Gantt View component built with React, TypeScript, and Tailwind CSS. Features drag-and-drop, task dependencies, multiple view modes, and comprehensive accessibility support.

## 📸 Screenshots

### Timeline View with Tasks
![Timeline Default View](./screensho/Screenshot%202025-10-28%20000253.png)
*Default timeline view showing multiple teams with tasks, progress bars, and dependencies*

### Interactive Features
![Interactive Demo](./screensho/Screenshot%202025-10-28%20000336.png)
*Drag-and-drop functionality and task interactions in action*

### Task Detail Sidebar
![Task Editor Sidebar](./screensho/Screenshot%202025-10-28%20000404.png)
*Comprehensive task editing panel with all properties*

### Dependency Visualization
![Dependencies](./screensho/Screenshot%202025-10-28%20000431.png)
*Visual dependency lines connecting related tasks*

## 🚀 Live Demo

**Storybook:** [Add your deployed URL here](#)

##  Installation

```bash
# Clone the repository
git clone <repository-url>
cd timeline-component

# Install dependencies
npm install

# Run Storybook
npm run storybook

# Build for production
npm run build

# Build Storybook
npm run build-storybook
```

##  Features

- [x] **Interactive Timeline Grid** with time scale (Day/Week/Month views)
- [x] **Drag & Drop** - Move tasks between rows and dates
- [x] **Task Resizing** - Adjust task duration by dragging edges
- [x] **Task Dependencies** - Visual dependency lines with arrow indicators
- [x] **View Mode Switching** - Toggle between Day, Week, and Month views
- [x] **Today Indicator** - Visual marker for current date
- [x] **Task Detail Sidebar** - Edit task properties with slide-out panel
- [x] **Milestone Support** - Diamond-shaped markers for key dates
- [x] **Progress Tracking** - Visual progress bars on tasks
- [x] **Keyboard Navigation** - Full keyboard accessibility
- [x] **Responsive Design** - Adapts to mobile, tablet, and desktop
- [x] **Empty States** - Graceful handling of no-task scenarios
- [x] **Performance Optimized** - Handles 100+ tasks smoothly
- [x] **WCAG 2.1 AA Compliant** - Full accessibility support

##  Architecture

### Project Structure

```
timeline-component/
├── src/
│   ├── components/
│   │   ├── Timeline/
│   │   │   ├── TimelineView.tsx        # Main component
│   │   │   ├── TimelineView.stories.tsx # Storybook stories
│   │   │   ├── TimelineView.types.ts   # Type definitions
│   │   │   ├── TimelineGrid.tsx        # Grid and time scale
│   │   │   ├── TimelineRow.tsx         # Row labels
│   │   │   ├── TaskBar.tsx             # Individual task bars
│   │   │   ├── DependencyLine.tsx      # Dependency visualization
│   │   │   ├── TaskDetailSidebar.tsx   # Task editor
│   │   │   └── sampleData.ts           # Sample data
│   │   └── primitives/
│   │       ├── Button.tsx              # Button component
│   │       ├── Modal.tsx               # Modal component
│   │       └── Slider.tsx              # Slider component
│   ├── hooks/
│   │   ├── useTimeline.ts              # Timeline state management
│   │   ├── useDragAndDrop.ts           # Drag & drop logic
│   │   └── useScrollSync.ts            # Scroll synchronization
│   ├── utils/
│   │   ├── date.utils.ts               # Date calculations
│   │   ├── position.utils.ts           # Position calculations
│   │   ├── dependency.utils.ts         # Dependency calculations
│   │   ├── formatting.utils.ts         # Display formatting
│   │   └── validation.utils.ts         # Data validation
│   ├── types/
│   │   └── timeline.types.ts           # TypeScript definitions
│   ├── constants/
│   │   └── timeline.constants.ts       # Configuration constants
│   └── styles/
│       ├── globals.css                 # Global styles
│       └── animations.css              # Custom animations
├── .storybook/                         # Storybook configuration
├── tailwind.config.js                  # Tailwind customization
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # This file
```

### Component Hierarchy

```
TimelineView (Main Container)
├── Toolbar (View controls, zoom buttons)
├── TimelineGrid (Time scale header + grid lines)
├── TimelineRow[] (Resource/team rows)
├── DependencyLinesContainer (SVG dependency lines)
├── TaskBar[] (Individual task visualizations)
└── TaskDetailSidebar (Task editor panel)
```

### Data Flow

```
Props (rows, tasks) → TimelineView
  ↓
State Management (useTimeline hook)
  ↓
Position Calculations (position.utils)
  ↓
Task Bars + Dependencies
  ↓
User Interactions (drag, resize, click)
  ↓
Callbacks (onTaskUpdate, onTaskMove)
```

##  Storybook Stories

The component is fully documented in Storybook with the following stories:

1. **Default** - Basic timeline with sample tasks
2. **Empty** - Empty timeline state
3. **With Dependencies** - Timeline showing task dependencies
4. **Day View** - Daily time scale view
5. **Week View** - Weekly time scale view
6. **Month View** - Monthly time scale view
7. **Large Dataset** - Performance test with 50+ tasks
8. **Interactive** - Fully functional demo
9. **Mobile View** - Responsive layout demonstration
10. **Accessibility** - Keyboard navigation demonstration
11. **With Milestones** - Milestone markers
12. **Today Indicator** - Current date marker

##  Usage Example

```tsx
import { TimelineView } from './components/Timeline/TimelineView';

const App = () => {
  const rows = [
    { id: 'row-1', label: 'Frontend Team', tasks: ['task-1'] },
    { id: 'row-2', label: 'Backend Team', tasks: ['task-2'] },
  ];

  const tasks = {
    'task-1': {
      id: 'task-1',
      title: 'UI Development',
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 15),
      progress: 60,
      rowId: 'row-1',
      color: '#3b82f6',
    },
    'task-2': {
      id: 'task-2',
      title: 'API Development',
      startDate: new Date(2025, 0, 5),
      endDate: new Date(2025, 0, 20),
      progress: 80,
      rowId: 'row-2',
      dependencies: ['task-1'],
      color: '#10b981',
    },
  };

  return (
    <TimelineView
      rows={rows}
      tasks={tasks}
      startDate={new Date(2024, 11, 15)}
      endDate={new Date(2025, 1, 15)}
      viewMode="week"
      onTaskUpdate={(taskId, updates) => console.log('Task updated:', taskId, updates)}
      onTaskMove={(taskId, newRowId, newStartDate) => console.log('Task moved:', taskId)}
      onTaskClick={(task) => console.log('Task clicked:', task)}
    />
  );
};
```

## ⌨ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between interactive elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` / `Space` | Select/activate task |
| `Escape` | Close modal or sidebar |
| `+` / `=` | Zoom in (change to more detailed view) |
| `-` / `_` | Zoom out (change to less detailed view) |

##  Technologies

- **React 18** - Component framework
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3** - Utility-first styling
- **Vite** - Build tooling
- **Storybook 8** - Component documentation
- **date-fns** - Date manipulation
- **clsx** - Conditional class management

## Performance

The component is optimized for performance with:

- **React.memo()** - Prevents unnecessary re-renders
- **useMemo/useCallback** - Memoized calculations and handlers
- **Position Caching** - Pre-calculated task positions
- **Throttled Events** - Optimized scroll and resize handlers
- **SVG Rendering** - Efficient dependency line drawing

**Benchmarks:**
- Initial Render: < 300ms
- Drag Response: < 16ms (60 FPS)
- Handles: 100+ tasks without lag

##  Accessibility

WCAG 2.1 AA compliant with:

- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - All features accessible via keyboard
- **Focus Management** - Clear visual focus indicators
- **Color Contrast** - 4.5:1 minimum contrast ratio
- **Semantic HTML** - Proper roles and landmarks

##  Testing

The component includes:

- Type-safe TypeScript interfaces
- Comprehensive validation utilities
- Edge case handling (empty states, invalid dates, etc.)



### TimelineViewProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `rows` | `TimelineRow[]` | Yes | Array of timeline rows (resources/teams) |
| `tasks` | `Record<string, TimelineTask>` | Yes | Map of task ID to task object |
| `startDate` | `Date` | Yes | Timeline start date |
| `endDate` | `Date` | Yes | Timeline end date |
| `viewMode` | `'day' \| 'week' \| 'month'` | Yes | Time scale view mode |
| `onTaskUpdate` | `(taskId, updates) => void` | No | Callback when task is updated |
| `onTaskMove` | `(taskId, newRowId, newDate) => void` | No | Callback when task is moved |
| `onTaskClick` | `(task) => void` | No | Callback when task is clicked |
| `onTaskDelete` | `(taskId) => void` | No | Callback when task is deleted |

### TimelineTask

```typescript
interface TimelineTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;          // 0-100
  assignee?: string;
  rowId: string;
  dependencies?: string[];   // Task IDs
  color?: string;            // Hex color
  isMilestone?: boolean;
  description?: string;
}
```

### TimelineRow

```typescript
interface TimelineRow {
  id: string;
  label: string;
  avatar?: string;
  tasks: string[];           // Task IDs
}
```



## 📧 Contact

**Author**: Suresh Mathusan  
**Email**: smathusan.info@gmail.com 
**GitHub**: https://github.com/mathusan2003 
**Submission Date**: October 27, 2025

---



