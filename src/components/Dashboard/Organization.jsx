import React from 'react';

const Organization = ({ organizations = [], selectedOrganization, onOrganizationChange }) => {
  const handleChange = (e) => {
    onOrganizationChange?.(e.target.value);
  };

  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Organization:
      </label>
      <select
        value={selectedOrganization || ''}
        onChange={handleChange}
        className="w-48 px-3 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors text-gray-900 dark:text-white text-sm cursor-pointer"
      >
        <option value="">All Organizations</option>
        {organizations.map((organization) => (
          <option key={organization._id} value={organization._id}>
            {organization.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Organization;