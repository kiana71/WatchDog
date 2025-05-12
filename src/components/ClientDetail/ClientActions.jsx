import React from 'react';
import { RotateCw, Power } from 'lucide-react';

/**
 * Component for client action buttons (refresh, reboot)
 * @param {Object} props - Component props
 * @param {boolean} props.isOnline - Whether the client is online
 * @param {boolean} props.restarting - Whether a restart operation is in progress
 * @param {boolean} props.shuttingDown - Whether a shutdown operation is in progress
 * @param {function} props.onRestart - Function to call when restart button is clicked
 * @param {function} props.onShutdown - Function to call when shutdown button is clicked
 */
const ClientActions = ({
  isOnline = false,
  restarting = false,
  shuttingDown = false,
  onRestart,
  onShutdown,
}) => {
  return (
    <div className="flex space-x-3">
      <button 
        onClick={onRestart}
        disabled={restarting || !isOnline}
        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50"
      >
        <RotateCw size={16} className={`mr-2 ${restarting ? 'animate-spin' : ''}`} />
        {restarting ? 'Restarting...' : 'Restart Computer'}
      </button>
      <button 
        onClick={onShutdown}
        disabled={shuttingDown || !isOnline}
        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50"
      >
        <Power size={16} className="mr-2" />
        {shuttingDown ? 'Shutting Down...' : 'Shutdown'}
      </button>
    </div>
  );
};

export default ClientActions; 