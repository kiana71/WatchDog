import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2 } from 'lucide-react';

/**
 * Tab navigation component for switching between Dashboard and Organization views
 */
const TabNavigation = () => {
  const tabClass = ({ isActive }) =>
    `inline-flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
      isActive
        ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
    }`;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav className="-mb-px flex space-x-8">
        <NavLink to="/dashboard" className={tabClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/organization" className={tabClass}>
          <Building2 size={18} />
          Organization
        </NavLink>
      </nav>
    </div>
  );
};

export default TabNavigation; 