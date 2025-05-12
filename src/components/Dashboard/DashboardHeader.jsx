import React from 'react';
import { Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Dashboard header component with title and action buttons
 * @param {Object} props - Component props
 * @param {function} props.onDownloadClick - Function to handle download button click
 */
const DashboardHeader = ({ onDownloadClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold dark:text-white">Dashboard</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={onDownloadClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download size={16} />
          Download Watchdog
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader; 