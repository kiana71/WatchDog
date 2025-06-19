import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Building2, MapPin, Users, UserPlus } from 'lucide-react';

const OrganizationStats = ({ organizations = [], unassignedClients = [] }) => {
  // Calculate total sites and clients with null checks
  const totalSites = organizations?.reduce((acc, org) => 
    acc + (org.sites?.length || 0), 0) || 0;
    
  const totalClients = organizations?.reduce((acc, org) => 
    acc + (org.sites?.reduce((siteAcc, site) => 
      siteAcc + (site.clients?.length || 0), 0) || 0), 0) || 0;

  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Paper className="p-4">
        <Box className="flex items-center space-x-3">
          <Building2 className="text-blue-600 dark:text-blue-400" size={24} />
          <Box>
            <Typography variant="h6" className="text-gray-700 dark:text-gray-300">
              Total Organizations
            </Typography>
            <Typography variant="h4" className="text-blue-600 dark:text-blue-400">
              {organizations?.length || 0}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper className="p-4">
        <Box className="flex items-center space-x-3">
          <MapPin className="text-green-600 dark:text-green-400" size={24} />
          <Box>
            <Typography variant="h6" className="text-gray-700 dark:text-gray-300">
              Total Sites
            </Typography>
            <Typography variant="h4" className="text-green-600 dark:text-green-400">
              {totalSites}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper className="p-4">
        <Box className="flex items-center space-x-3">
          <Users className="text-purple-600 dark:text-purple-400" size={24} />
          <Box>
            <Typography variant="h6" className="text-gray-700 dark:text-gray-300">
              Total Assigned Clients
            </Typography>
            <Typography variant="h4" className="text-purple-600 dark:text-purple-400">
              {totalClients}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper className="p-4">
        <Box className="flex items-center space-x-3">
          <UserPlus className="text-orange-600 dark:text-orange-400" size={24} />
          <Box>
            <Typography variant="h6" className="text-gray-700 dark:text-gray-300">
              Unassigned Clients
            </Typography>
            <Typography variant="h4" className="text-orange-600 dark:text-orange-400">
              {unassignedClients?.length || 0}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrganizationStats; 