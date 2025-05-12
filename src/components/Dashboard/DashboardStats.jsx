import React from 'react';
import { Activity, Monitor } from 'lucide-react';

/**
 * Component to display dashboard statistics
 * @param {Object} props - Component props
 * @param {Array} props.clients - List of clients
 */
const DashboardStats = ({ clients = [] }) => {
  const onlineCount = clients.filter(client => client.isOnline).length;

  return (
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
  );
};

export default DashboardStats; 