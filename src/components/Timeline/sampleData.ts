import { TimelineRow, TimelineTask } from './TimelineView.types';

// Sample rows
export const sampleRows: TimelineRow[] = [
  { id: 'row-1', label: 'Frontend Team', tasks: ['task-1', 'task-2'] },
  { id: 'row-2', label: 'Backend Team', tasks: ['task-3', 'task-4'] },
  { id: 'row-3', label: 'Design Team', tasks: ['task-5'] },
  { id: 'row-4', label: 'QA Team', tasks: ['task-6'] },
];

// Sample tasks
export const sampleTasks: Record<string, TimelineTask> = {
  'task-1': {
    id: 'task-1',
    title: 'UI Component Development',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 15),
    progress: 60,
    assignee: 'Frontend Team',
    rowId: 'row-1',
    dependencies: [],
    color: '#3b82f6',
    isMilestone: false,
    description: 'Build reusable UI components for the dashboard',
  },
  'task-2': {
    id: 'task-2',
    title: 'Integration Testing',
    startDate: new Date(2025, 0, 16),
    endDate: new Date(2025, 0, 25),
    progress: 0,
    assignee: 'Frontend Team',
    rowId: 'row-1',
    dependencies: ['task-1', 'task-3'],
    color: '#3b82f6',
    isMilestone: false,
    description: 'Test integration between frontend and backend',
  },
  'task-3': {
    id: 'task-3',
    title: 'API Development',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 14),
    progress: 80,
    assignee: 'Backend Team',
    rowId: 'row-2',
    dependencies: [],
    color: '#10b981',
    isMilestone: false,
    description: 'Develop RESTful API endpoints',
  },
  'task-4': {
    id: 'task-4',
    title: 'Database Schema',
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 0, 20),
    progress: 100,
    assignee: 'Backend Team',
    rowId: 'row-2',
    dependencies: [],
    color: '#10b981',
    isMilestone: false,
    description: 'Design and implement database schema',
  },
  'task-5': {
    id: 'task-5',
    title: 'Design System Update',
    startDate: new Date(2025, 0, 5),
    endDate: new Date(2025, 0, 12),
    progress: 100,
    assignee: 'Design Team',
    rowId: 'row-3',
    dependencies: [],
    color: '#f59e0b',
    isMilestone: false,
    description: 'Update design system with new components',
  },
  'task-6': {
    id: 'task-6',
    title: 'Launch',
    startDate: new Date(2025, 0, 26),
    endDate: new Date(2025, 0, 26),
    progress: 0,
    assignee: 'QA Team',
    rowId: 'row-4',
    dependencies: ['task-2'],
    color: '#ef4444',
    isMilestone: true,
    description: 'Product launch milestone',
  },
};

// Large dataset for testing performance
export const createLargeDataset = (rowCount: number, tasksPerRow: number) => {
  const rows: TimelineRow[] = [];
  const tasks: Record<string, TimelineTask> = {};

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const teams = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];

  for (let i = 0; i < rowCount; i++) {
    const rowId = `row-${i}`;
    const taskIds: string[] = [];

    for (let j = 0; j < tasksPerRow; j++) {
      const taskId = `task-${i}-${j}`;
      taskIds.push(taskId);

      const startDay = j * 7;
      const duration = 3 + Math.floor(Math.random() * 10);

      tasks[taskId] = {
        id: taskId,
        title: `Task ${i + 1}.${j + 1}`,
        startDate: new Date(2025, 0, 1 + startDay),
        endDate: new Date(2025, 0, 1 + startDay + duration),
        progress: Math.floor(Math.random() * 101),
        assignee: `Team ${teams[i % teams.length]}`,
        rowId,
        dependencies: j > 0 ? [`task-${i}-${j - 1}`] : [],
        color: colors[i % colors.length],
        isMilestone: false,
      };
    }

    rows.push({
      id: rowId,
      label: `Team ${teams[i % teams.length]} - Group ${i + 1}`,
      tasks: taskIds,
    });
  }

  return { rows, tasks };
};

// Empty dataset
export const emptyRows: TimelineRow[] = [
  { id: 'row-1', label: 'Frontend Team', tasks: [] },
  { id: 'row-2', label: 'Backend Team', tasks: [] },
  { id: 'row-3', label: 'Design Team', tasks: [] },
];

export const emptyTasks: Record<string, TimelineTask> = {};

