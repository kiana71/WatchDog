import React from 'react';
import { RefreshCw, Power } from 'lucide-react';

/**
 * Component for displaying client action buttons (restart and shutdown)
 * @param {Object} props - Component props
 * @param {boolean} props.isOnline - Whether the client is online
 * @param {string} props.clientId - The ID of the client
 * @param {function} props.onRestart - Function to call when restart button is clicked
 * @param {function} props.onShutdown - Function to call when shutdown button is clicked
 */
const ClientActionButtons = ({ isOnline, clientId, onRestart, onShutdown }) => {
  return (
    <div className="flex items-center space-x-3 text-left">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Are you sure you want to restart this computer?')) {
            onRestart(clientId);
          }
        }}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
        title="Restart Computer"
      >
        <RefreshCw size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Are you sure you want to shutdown this computer?')) {
            onShutdown(clientId);
          }
        }}
        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
        disabled={!isOnline}
        title="Shutdown Computer"
      >
        <Power size={16}/>
      </button>
    </div>
  );
};

export default ClientActionButtons; 