import React from 'react';
import { ChevronDown, ChevronRight, MapPin, Plus, Trash2 } from 'lucide-react';
import ClientList from './ClientList';

const SiteSection = ({ 
  site, 
  orgName,
  isExpanded, 
  isEditing, 
  onToggle, 
  onEdit, 
  onSave, 
  onAddSite, 
  onDelete, 
  onRemoveClient,
  orgId 
}) => {
  return (
    <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center space-x-3 flex-1">
          <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <MapPin className="text-green-500 dark:text-green-400" size={16} />
          
          {isEditing ? (
            <input
              type="text"
              defaultValue={site.name}
              className="font-medium bg-transparent border-b border-green-500 focus:outline-none dark:text-white"
              onBlur={(e) => onSave(site.id, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSave(site.id, e.target.value)}
              autoFocus
            />
          ) : (
            <span 
              className="font-medium dark:text-white cursor-pointer hover:text-green-600"
              onClick={() => onEdit(site.id)}
            >
              {site.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {site.clients.length} clients
          </span>
          <button 
            onClick={() => onAddSite(orgId)}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="Add Site"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => onDelete(site, orgName)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <ClientList 
          clients={site.clients} 
          onRemoveClient={onRemoveClient} 
          siteId={site.id} 
        />
      )}
    </div>
  );
};

export default SiteSection; 