import React from 'react';
import { ChevronDown, ChevronRight, Settings, Trash2 } from 'lucide-react';

const SiteSection = ({
  site,
  orgName,
  orgId,
  isExpanded,
  isEditing,
  onToggle,
  onEdit,
  onSave,
  onDelete,
  onRemoveClient
}) => {
  return (
    <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button 
            onClick={onToggle} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          
          <Settings className="text-green-500 dark:text-green-400" size={20} />
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                defaultValue={site.name}
                className="text-base font-medium bg-transparent border-b border-green-500 focus:outline-none dark:text-white"
                onBlur={(e) => onSave(site._id, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSave(site._id, e.target.value)}
                autoFocus
              />
            ) : (
              <h4 
                className="text-base font-medium dark:text-white cursor-pointer hover:text-green-600"
                onClick={() => onEdit(site._id)}
              >
                {site.name}
              </h4>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {site.clients?.length || 0} clients
          </span>
          <button
            onClick={() => onDelete(site, orgName)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            title="Delete Site"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && site.clients?.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
          {site.clients.map((client) => (
            <div 
              key={client._id}
              className="flex flex-col justify-between h-48 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <span>
                  <svg width="16" height="16" style={{ marginRight: 4 }}>
                    <circle cx="8" cy="8" r="8" fill={client.connected ? '#10b981' : '#ef4444'} />
                  </svg>
                </span>
                <span className="text-base font-semibold dark:text-white">{client.name}</span>
              </div>
              <div className="text-md text-gray-500 dark:text-gray-300 mb-1">
                <span className="font-medium">{client.computerName}</span>
              </div>
              <div className="flex items-center gap-2 text-md mb-2">
                <span style={{ color: client.connected ? '#10b981' : '#ef4444' }}>
                  {client.connected ? 'Online' : 'Offline'}
                </span>
                {client.lastSeen && (
                  <span className="text-gray-400">
                    • Last seen: {new Date(client.lastSeen).toLocaleString()}
                  </span>
                )}
              </div>
              <button
                onClick={() => onRemoveClient(client._id, site._id)}
                className="self-end mt-auto px-3 py-1 text-md rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteSection; 