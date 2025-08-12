import React from 'react';
import { Monitor, Wifi, Tag, Clock, Cpu, Server, Globe, HardDrive, Layers, Zap } from 'lucide-react';

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

  const formatMemory = (memoryInMB) => {
    if (memoryInMB >= 1024) {
      return `${(memoryInMB / 1024).toFixed(1)} GB`;
    }
    return `${memoryInMB} MB`;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <h3 className="font-medium text-lg mb-4 flex items-center text-gray-900 dark:text-white gap-2">
        <Monitor className="text-gray-700 dark:text-gray-300" size={20} />
        System Information
      </h3>
      
      <div className="space-y-4">
        {/* Network Information */}
        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-6 mb-2">Network</h4>
        
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
            <span className="font-medium">Local IP</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.ipAddress}</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Globe size={16} className="text-gray-500" />
            <span className="font-medium">Public IP</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.publicIpAddress || 'Not available'}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Server size={16} className="text-gray-500" />
            <span className="font-medium">MAC Address</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.macAddress || 'Not available'}</div>
        </div>
        
        {/* System Information */}
        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-6 mb-2">System</h4>
        
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
            <span className="font-medium">Build Number</span>
          </div>
          <div className="text-gray-900 dark:text-white">{client.buildNumber || 'Not available'}</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Cpu size={16} className="text-gray-500" />
            <span className="font-medium">Windows Edition</span>
          </div>
          <div className="text-gray-900 dark:text-white">
            {client.detailedOsInfo?.productName || 'Not available'}
          </div>
        </div>

        <div className="flex flex-col mb-2 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Cpu size={16} className="text-gray-500" />
            <span className="font-medium">CPU</span>
          </div>
          <div className="text-gray-900 dark:text-white pl-6">{client.cpu || 'Not available'}</div>
        </div>

        <div className="flex flex-col mb-2 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Layers size={16} className="text-gray-500" />
            <span className="font-medium">Memory</span>
          </div>
          <div className="text-gray-900 dark:text-white pl-6">{client.totalMemory ? formatMemory(client.totalMemory) : 'Not available'}</div>
        </div>

        <div className="flex flex-col py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
            <HardDrive size={16} className="text-gray-500" />
            <span className="font-medium">Storage</span>
          </div>
        
          <div className="text-gray-900 dark:text-white pl-6">
            {client.storage ? (
              <div className="space-y-1">
                {Array.isArray(client.storage) ? (
                  client.storage.map((drive, index) => (
                    <div key={index} className="text-sm">
                      {drive.mount} {drive.type} {drive.total}GB ({drive.free}GB free, {drive.usage}% used)
                    </div>
                  ))
                ) : (
                  `${client.storage.type} ${client.storage.total}GB (${client.storage.free}GB free)`
                )}
              </div>
            ) : (
              'Not available'
            )}
          </div>
        </div>

        <div className="flex flex-col mb-2 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Zap size={16} className="text-gray-500" />
            <span className="font-medium">Graphics</span>
          </div>
          <div className="text-gray-900 dark:text-white pl-6">{client.graphicsCard || 'Not available'}</div>
        </div>
        
        {/* Watchdog Information */}
        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-6 mb-2">Watchdog</h4>
        
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
            {(client.connected !== undefined ? client.connected : client.isOnline)
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