import React from 'react';
import { ChevronDown, ChevronRight, Building2, Plus, Trash2 } from 'lucide-react';
import SiteSection from './SiteSection';

const OrganizationCard = ({ 
  org, 
  isExpanded, 
  editingOrg, 
  expandedSites,
  editingSite,
  onToggleOrg, 
  onEditOrg, 
  onSaveOrg, 
  onDeleteOrg,
  onToggleSite,
  onEditSite,
  onSaveSite,
  onAddSite,
  onDeleteSite,
  onRemoveClient
}) => {
  const totalClients = org.sites?.reduce((acc, site) => 
    acc + (site.clients?.length || 0), 0) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1">
            <button 
              onClick={() => onToggleOrg(org._id)} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            <Building2 className="text-blue-500 dark:text-blue-400" size={20} />
    
            <div className="flex-1">
              {editingOrg === `${org._id}-name` ? (
                <input
                  type="text"
                  defaultValue={org.name}
                  className="text-lg font-semibold bg-transparent border-b border-blue-500 focus:outline-none dark:text-white"
                  onBlur={(e) => onSaveOrg(org._id, 'name', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSaveOrg(org._id, 'name', e.target.value)}
                  autoFocus
                />
              ) : (
                <h3 
                  className="text-lg font-semibold dark:text-white cursor-pointer hover:text-blue-600"
                  onClick={() => onEditOrg(`${org._id}-name`)}
                >
                  {org.name}
                </h3>
              )}
              
              {editingOrg === `${org._id}-description` ? (
                <textarea
                  defaultValue={org.description}
                  className="text-sm text-gray-600 dark:text-gray-400 bg-transparent border border-blue-500 rounded px-2 py-1 focus:outline-none mt-1 w-full"
                  onBlur={(e) => onSaveOrg(org._id, 'description', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSaveOrg(org._id, 'description', e.target.value);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <p 
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600"
                  onClick={() => onEditOrg(`${org._id}-description`)}
                >
                  {org.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {org.sites?.length || 0} sites, {totalClients} clients
            </span>
            <button
              onClick={() => onDeleteOrg(org)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              title="Delete Organization"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {org.sites?.map(site => (
            <SiteSection
              key={site._id}
              site={site}
              orgName={org.name}
              orgId={org._id}
              isExpanded={expandedSites[site._id]}
              isEditing={editingSite === site._id}
              onToggle={() => onToggleSite(site._id)}
              onEdit={onEditSite}
              onSave={onSaveSite}
              onDelete={onDeleteSite}
              onRemoveClient={onRemoveClient}
            />
          ))}
          
          <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            <button 
              onClick={() => onAddSite(org._id)}
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              <Plus size={16} />
              <span>Add Site</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationCard; 