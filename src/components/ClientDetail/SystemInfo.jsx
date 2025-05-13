import React from 'react';
import { Monitor, Wifi, Tag, Clock, Cpu, Server } from 'lucide-react';

const SystemInfo = ({ client }) => {
  const formatUptime = (hours) => {
    if (hours < 24) {
      return `${Math.floor(hours)} hours, ${Math.floor((hours % 1) * 60)} minutes`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} days, ${Math.floor(remainingHours)} hours`;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <h3 className="font-medium text-lg mb-4 flex items-center text-white gap-2">
        <Monitor className="text-white" size={20} />
        System Information
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Tag size={16} className="text-gray-500" />
            <span className="font-medium">Computer Name</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.computerName}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Wifi size={16} className="text-gray-500" />
            <span className="font-medium">IP Address</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.ipAddress}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Server size={16} className="text-gray-500" />
            <span className="font-medium">MAC Address</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.macAddress || 'Not available'}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Cpu size={16} className="text-gray-500" />
            <span className="font-medium">OS</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.osName || 'Not available'}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Tag size={16} className="text-gray-500" />
            <span className="font-medium">Watchdog Version</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.version}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Clock size={16} className="text-gray-500" />
            <span className="font-medium">Uptime</span>
          </div>
          <div className="text-gray-900 dark:text-white">
            {client.isOnline 
              ? formatUptime(client.uptimeHours)
              : 'Offline'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;