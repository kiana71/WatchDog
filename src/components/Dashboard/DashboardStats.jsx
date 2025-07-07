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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center">
          <Monitor className="text-blue-500 dark:text-blue-400 mr-2" size={20} />
          <span className="text-gray-600 dark:text-gray-300">
            Total Clients: <span className="font-semibold">{clients.length}</span>
          </span>
        </div>
        <div className="flex items-center">
          <Activity className="text-green-500 dark:text-green-400 mr-2" size={20} />
          <span className="text-gray-600 dark:text-gray-300">
            Online: <span className="font-semibold">{onlineCount}</span> / {clients.length}
          </span>
        </div>
      </div>
      <button
        onClick={refreshClients}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors self-start sm:self-auto"
        title="Refresh Data"
      >
        <RefreshCw className="text-gray-600 dark:text-gray-300" size={20} />
      </button>
    </div>
  );
};

export default DashboardStats; 