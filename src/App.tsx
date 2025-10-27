import React from 'react';
import { TimelineView } from './components/Timeline/TimelineView';
import { sampleRows, sampleTasks } from './components/Timeline/sampleData';
import './styles/globals.css';

function App() {
  return (
    <div className="h-screen">
      <TimelineView
        rows={sampleRows}
        tasks={sampleTasks}
        startDate={new Date(2024, 11, 15)}
        endDate={new Date(2025, 1, 15)}
        viewMode="week"
        onTaskUpdate={(taskId, updates) => {
          console.log('Task updated:', taskId, updates);
        }}
        onTaskMove={(taskId, newRowId, newStartDate) => {
          console.log('Task moved:', taskId, 'to row:', newRowId, 'at:', newStartDate);
        }}
        onTaskClick={(task) => {
          console.log('Task clicked:', task);
        }}
        onTaskDelete={(taskId) => {
          console.log('Task deleted:', taskId);
        }}
      />
    </div>
  );
}

export default App;

