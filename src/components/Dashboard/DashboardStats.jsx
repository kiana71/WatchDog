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
  const onlineCount = clients.filter(client => client.connected !== undefined ? client.connected : client.isOnline).length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
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
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="Refresh Data"
      >
        <RefreshCw className="text-gray-600 dark:text-gray-300" size={20} />
      </button>
    </div>
  );
};

export default DashboardStats; 