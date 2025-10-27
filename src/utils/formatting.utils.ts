/**
 * Formatting utilities for display and presentation
 */

/**
 * Format progress percentage
 */
export const formatProgress = (progress: number): string => {
  return `${Math.round(progress)}%`;
};

/**
 * Format duration in days
 */
export const formatDuration = (startDate: Date, endDate: Date): string => {
  const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return diff === 1 ? '1 day' : `${diff} days`;
};

/**
 * Format date range
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const end = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${start} - ${end}`;
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format task title for display
 */
export const formatTaskTitle = (title: string, maxWidth: number): string => {
  // Approximate character width (adjust based on font)
  const avgCharWidth = 7;
  const maxChars = Math.floor(maxWidth / avgCharWidth);
  return truncate(title, maxChars);
};

/**
 * Get color for task based on progress
 */
export const getProgressColor = (progress: number): string => {
  if (progress === 0) return '#94a3b8'; // Gray
  if (progress < 50) return '#f59e0b'; // Amber
  if (progress < 100) return '#3b82f6'; // Blue
  return '#10b981'; // Green
};

/**
 * Get contrast color (black or white) based on background
 */
export const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate a random color
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Create ARIA label for task
 */
export const createTaskAriaLabel = (
  title: string,
  startDate: Date,
  endDate: Date,
  progress: number
): string => {
  const start = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const end = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return `${title}. From ${start} to ${end}. Progress: ${progress}%. Press Enter to edit.`;
};

/**
 * Create ARIA label for row
 */
export const createRowAriaLabel = (label: string, taskCount: number): string => {
  return `${label} timeline. ${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}.`;
};

