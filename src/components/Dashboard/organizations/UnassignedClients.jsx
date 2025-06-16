import React from 'react';
import { Monitor } from 'lucide-react';

const UnassignedClients = ({ clients, organizations, onAssignClient }) => {
  const getAssignmentOptions = () => {
    const options = [{ value: '', label: 'Assign to...' }];
    
    organizations.forEach(org => {
      org.sites.forEach(site => {
        options.push({
          value: `${org.id}-${site.id}`,
          label: `${org.name} → ${site.name}`
        });
      });
    });
    
    return options;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold dark:text-white flex items-center">
          <Monitor className="text-gray-500 dark:text-gray-400 mr-2" size={20} />
          Unassigned Clients ({clients.length})
        </h3>
      </div>
      <div className="p-4 space-y-2">
        {clients.map(client => (
          <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="flex items-center space-x-3">
              <Monitor className="text-gray-500 dark:text-gray-400" size={16} />
              <div>
                <span className="font-medium dark:text-white">{client.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({client.computerName})</span>
              </div>
            </div>
            <select
              onChange={(e) => onAssignClient(client.id, e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white"
              defaultValue=""
            >
              {getAssignmentOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnassignedClients; 