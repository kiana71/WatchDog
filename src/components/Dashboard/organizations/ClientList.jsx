import React from 'react';
import { Monitor } from 'lucide-react';

const ClientList = ({ clients, onRemoveClient, siteId }) => {
  if (!clients.length) {
    return (
      <div className="mt-3 ml-6 text-sm text-gray-500 dark:text-gray-400">
        No clients assigned
      </div>
    );
  }

  return (
    <div className="mt-3 ml-6 space-y-2">
      {clients.map(client => (
        <div key={client.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
          <div className="flex items-center space-x-3">
            <Monitor className="text-purple-500 dark:text-purple-400" size={14} />
            <div>
              <span className="text-sm font-medium dark:text-white">{client.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({client.computerName})</span>
            </div>
          </div>
          <button 
            onClick={() => onRemoveClient(client.id, siteId)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ClientList; 