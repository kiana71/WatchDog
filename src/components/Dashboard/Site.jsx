import React from 'react';

const Site = ({ selectedSite, onSiteChange }) => {
  const testSites = [
    { id: 'all', name: 'All Sites' }
  ];

  // const handleChange = (e) => {
  //   onSiteChange?.(e.target.value);
  // };

  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Site:
      </label>
      <select
        // value={selectedSite || 'all'}
        // onChange={handleChange}
        className="w-48 px-3 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors text-gray-900 dark:text-white text-sm cursor-pointer"
      >
        {testSites.map((site) => (
          <option key={site.id} value={site.id}>
            {site.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Site;