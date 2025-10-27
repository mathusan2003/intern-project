import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { TimelineTask } from '@/types/timeline.types';
import { Button } from '@/components/primitives/Button';
import { Slider } from '@/components/primitives/Slider';
import { formatDate } from '@/utils/date.utils';
import { format } from 'date-fns';

interface TaskDetailSidebarProps {
  task: TimelineTask | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<TimelineTask>) => void;
  onDelete?: (taskId: string) => void;
  allTasks: Record<string, TimelineTask>;
}

export const TaskDetailSidebar: React.FC<TaskDetailSidebarProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  allTasks,
}) => {
  const [editedTask, setEditedTask] = useState<Partial<TimelineTask>>({});

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        startDate: task.startDate,
        endDate: task.endDate,
        progress: task.progress,
        assignee: task.assignee,
        description: task.description,
        color: task.color,
      });
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!task) return null;

  const handleSave = () => {
    if (editedTask.title && editedTask.startDate && editedTask.endDate) {
      onUpdate(task.id, editedTask);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
      onClose();
    }
  };

  const formatDateForInput = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const parseDateFromInput = (dateString: string): Date => {
    return new Date(dateString);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="complementary"
        aria-label="Task details"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-neutral-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Task Title */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-neutral-700 mb-2">
              Task Name
            </label>
            <input
              id="task-title"
              type="text"
              value={editedTask.title || ''}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter task name"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-neutral-700 mb-2">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={editedTask.startDate ? formatDateForInput(editedTask.startDate) : ''}
                onChange={(e) => setEditedTask({ ...editedTask, startDate: parseDateFromInput(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-neutral-700 mb-2">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={editedTask.endDate ? formatDateForInput(editedTask.endDate) : ''}
                onChange={(e) => setEditedTask({ ...editedTask, endDate: parseDateFromInput(e.target.value) })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Progress */}
          <div>
            <Slider
              label="Progress"
              value={editedTask.progress || 0}
              onChange={(value) => setEditedTask({ ...editedTask, progress: value })}
              min={0}
              max={100}
              step={5}
              showValue={true}
            />
          </div>

          {/* Assignee */}
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-neutral-700 mb-2">
              Assignee
            </label>
            <input
              id="assignee"
              type="text"
              value={editedTask.assignee || ''}
              onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter assignee name"
            />
          </div>

          {/* Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-neutral-700 mb-2">
              Color
            </label>
            <input
              id="color"
              type="color"
              value={editedTask.color || '#0ea5e9'}
              onChange={(e) => setEditedTask({ ...editedTask, color: e.target.value })}
              className="w-full h-10 border border-neutral-300 rounded-lg cursor-pointer"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter task description"
            />
          </div>

          {/* Task Info */}
          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Task Information</h3>
            <div className="text-xs text-neutral-600 space-y-1">
              <div>
                <span className="font-medium">ID:</span> {task.id}
              </div>
              <div>
                <span className="font-medium">Created:</span> {formatDate(task.startDate)}
              </div>
              {task.dependencies && task.dependencies.length > 0 && (
                <div>
                  <span className="font-medium">Dependencies:</span> {task.dependencies.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex gap-3">
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex-1"
          >
            Save Changes
          </Button>
          {onDelete && (
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};

