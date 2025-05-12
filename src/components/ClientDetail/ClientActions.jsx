import React from 'react';
import { RefreshCw, Power } from 'lucide-react';

/**
 * Component for client action buttons (refresh, reboot)
 * @param {Object} props - Component props
 * @param {boolean} props.isOnline - Whether the client is online
 * @param {boolean} props.refreshing - Whether a refresh operation is in progress
 * @param {boolean} props.rebooting - Whether a reboot operation is in progress
 * @param {function} props.onRefresh - Function to call when refresh button is clicked
 * @param {function} props.onReboot - Function to call when reboot button is clicked
 */
const ClientActions = ({
  isOnline = false,
  refreshing = false,
  rebooting = false,
  onRefresh,
  onReboot,
}) => {
  return (
    <div className="flex space-x-3">
      <button 
        onClick={onRefresh}
        disabled={refreshing || !isOnline}
        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50"
      >
        <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        {refreshing ? 'Refreshing...' : 'Refresh Screenshot'}
      </button>
      <button 
        onClick={onReboot}
        disabled={rebooting || !isOnline}
        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50"
      >
        <Power size={16} className="mr-2" />
        {rebooting ? 'Rebooting...' : 'Reboot'}
      </button>
    </div>
  );
};

export default ClientActions; 