import React from 'react';
import { Activity, Monitor, RefreshCw } from 'lucide-react';
import { useClients } from '../../context/ClientsContext';

/**
 * Component to display dashboard statistics
 * @param {Object} props - Component props
 * @param {Array} props.clients - List of clients
 */
const DashboardStats = ({ clients = [] }) => {
  const { refreshClients } = useClients();
  
  // Debug logging
  // console.log('All clients:', clients.map(client => ({
  //   computerName: client.computerName,
  //   connected: client.connected,
  //   isOnline: client.isOnline,
  //   lastSeen: client.lastSeen
  // })));
  
  // Calculate online clients using the same logic as ClientsContext
  const onlineCount = clients.filter(client => {
    const connectionStatus = client.connected !== undefined ? client.connected : client.isOnline;
    const lastSeen = new Date(client.lastSeen);
    const now = new Date();
    const timeDiff = (now - lastSeen) / 1000; // difference in seconds
    const isOffline = !connectionStatus || timeDiff > 10;
    return !isOffline;
  }).length;

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-6 mb-4">
      <div className="flex items-center gap-2 sm:gap-6 flex-1 min-w-0">
        <div className="flex items-center min-w-0">
          <Monitor className="text-blue-500 dark:text-blue-400 mr-1 sm:mr-2 flex-shrink-0" size={18} />
          <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base truncate">
            Total: <span className="font-semibold">{clients.length}</span>
          </span>
        </div>
        <div className="flex items-center min-w-0">
          <Activity className="text-green-500 dark:text-green-400 mr-1 sm:mr-2 flex-shrink-0" size={18} />
          <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base truncate">
            Online: <span className="font-semibold">{onlineCount}</span>
          </span>
        </div>
      </div>
      <button
        onClick={refreshClients}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
        title="Refresh Data"
      >
        <RefreshCw className="text-gray-600 dark:text-gray-300" size={18} />
      </button>
    </div>
  );
};

export default DashboardStats; 