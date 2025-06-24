import React from 'react';

const Site = ({ 
  sites = [], 
  selectedSite, 
  onSiteChange, 
  disabled = false 
}) => {
  const handleChange = (e) => {
    onSiteChange?.(e.target.value);
  };

  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Site:
      </label>
      <select
        value={selectedSite || ''}
        onChange={handleChange}
        disabled={disabled}
        className="w-48 px-3 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors text-gray-900 dark:text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">
          {disabled ? 'Select Organization' : 'All Sites'}
        </option>
        {sites.map((site) => (
          <option key={site._id} value={site._id}>
            {site.name} ({site.clients?.length || 0} clients)
          </option>
        ))}
      </select>
    </div>
  );
};

export default Site;