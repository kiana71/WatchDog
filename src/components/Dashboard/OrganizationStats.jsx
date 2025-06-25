import React from 'react';
import { Building2, MapPin, Users, UserPlus } from 'lucide-react';

const OrganizationStats = ({ organizations = [], unassignedClients = [] }) => {
  // Calculate total sites and clients with null checks
  const totalSites = organizations?.reduce((acc, org) => 
    acc + (org.sites?.length || 0), 0) || 0;
    
  const totalClients = organizations?.reduce((acc, org) => 
    acc + (org.sites?.reduce((siteAcc, site) => 
      siteAcc + (site.clients?.length || 0), 0) || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <Building2 className="text-blue-600 dark:text-blue-400" size={24} />
          <div>
            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Organizations
            </h6>
            <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {organizations?.length || 0}
            </h4>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <MapPin className="text-green-600 dark:text-green-400" size={24} />
          <div>
            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Sites
            </h6>
            <h4 className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalSites}
            </h4>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <Users className="text-purple-600 dark:text-purple-400" size={24} />
          <div>
            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Assigned Clients
            </h6>
            <h4 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalClients}
            </h4>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <UserPlus className="text-orange-600 dark:text-orange-400" size={24} />
          <div>
            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Unassigned Clients
            </h6>
            <h4 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {unassignedClients?.length || 0}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationStats; 