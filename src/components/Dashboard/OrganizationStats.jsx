import React from 'react';
import { Building2, Settings, Users } from 'lucide-react';

const OrganizationStats = ({ organizations }) => {
  const totalOrgs = organizations.length;
  const totalSites = organizations.reduce((acc, org) => acc + org.sites.length, 0);
  const totalAssignedClients = organizations.reduce((acc, org) => 
    acc + org.sites.reduce((siteAcc, site) => siteAcc + site.clients.length, 0), 0
  );
//explain sum functions
  const stats = [
    { icon: Building2, label: 'Organizations', value: totalOrgs, color: 'blue' },
    { icon: Settings, label: 'Sites', value: totalSites, color: 'green' },
    { icon: Users, label: 'Assigned Clients', value: totalAssignedClients, color: 'purple' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Icon className={`text-${color}-500 dark:text-${color}-400 mr-3`} size={24} />
            <div>
              <h3 className="text-lg font-semibold dark:text-white">{label}</h3>
              <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationStats; 