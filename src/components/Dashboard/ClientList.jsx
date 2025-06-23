import React, { useState, useEffect } from 'react';
import { useClients } from '../../context/ClientsContext';
import ClientListView from './ClientListView';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import ClientDetailSlideOver from './ClientDetailSlideOver';
import DownloadModal from './DownloadModal';
import Search from './Search';
import Organization from './Organization';
import Site from './Site';
import { organizationApi } from '../../services/organizationApi';
import { Monitor } from 'lucide-react';

/**
 * Main dashboard component displaying client list and stats
 */

const ClientList = () => {
  const { clients, loading, restartClient, shutdownClient } = useClients();
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  // Organization and site filtering state
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);

  // Load organizations on component mount
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoadingOrganizations(true);
        const orgsData = await organizationApi.getOrganizations();
        setOrganizations(orgsData);
      } catch (error) {
        console.error('Failed to load organizations:', error);
      } finally {
        setLoadingOrganizations(false);
      }
    };

    loadOrganizations();
  }, []);

  // Filter clients based on selected organization and site
  useEffect(() => {
    if (!clients || clients.length === 0) {
      setFilteredClients([]);
      return;
    }

    let filtered = [...clients];

    // If no organization is selected, show all clients (including unassigned)
    if (!selectedOrganization) {
      setFilteredClients(filtered);
      return;
    }

    // Filter by organization
    const selectedOrg = organizations.find(org => org._id === selectedOrganization);
    if (selectedOrg) {
      // Get all clients assigned to any site in this organization
      const assignedClientIds = new Set();
    
      selectedOrg.sites.forEach(site => {
        if (site.clients && site.clients.length > 0) {
          site.clients.forEach(client => {
            assignedClientIds.add(client._id || client.id);
          });
        }
      });

      // Filter clients that are assigned to this organization
      filtered = clients.filter(client => 
        assignedClientIds.has(client._id || client.id)
      );

      // Filter by specific site
      if (selectedSite && selectedSite !== '') {
        const targetSite = selectedOrg.sites.find(site => site._id === selectedSite);
        if (targetSite && targetSite.clients) {
          const siteClientIds = targetSite.clients.map(client => client._id || client.id);
          filtered = filtered.filter(client => 
            siteClientIds.includes(client._id || client.id)
          );
        }
      }
    }

    setFilteredClients(filtered);
  }, [clients, selectedOrganization, selectedSite, organizations]);

  // Handle organization change
  const handleOrganizationChange = (orgId) => {
    setSelectedOrganization(orgId);
    setSelectedSite(''); // Reset site selection when organization changes
  };

  // Handle site change
  const handleSiteChange = (siteId) => {
    setSelectedSite(siteId);
  };

  // Get sites for selected organization
  const getSitesForOrganization = () => {
    if (!selectedOrganization) return [];
    const selectedOrg = organizations.find(org => org._id === selectedOrganization);
    return selectedOrg ? selectedOrg.sites : [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  // Find the selected client using either id or _id
  const selectedClient = filteredClients.find(client => (client.id || client._id) === selectedClientId);
  
  return (
    <div className="relative">
      <div className="mb-6">
        <DashboardHeader onDownloadClick={() => setIsDownloadModalOpen(true)} />
        <DashboardStats clients={filteredClients} />
        <div className="flex gap-4 items-center">
          <Search/>
          <Organization 
            organizations={organizations}
            selectedOrganization={selectedOrganization}
            onOrganizationChange={handleOrganizationChange}
            loading={loadingOrganizations}
          />
          <Site 
            sites={getSitesForOrganization()}
            selectedSite={selectedSite}
            onSiteChange={handleSiteChange}
            disabled={!selectedOrganization}
          />
        </div>
       
      </div>

      <ClientListView
        clients={filteredClients}
        onRestart={restartClient}
        onShutdown={shutdownClient}
        onClientSelect={setSelectedClientId}
      />

      <ClientDetailSlideOver
        client={selectedClient}
        isOpen={!!selectedClientId}
        onClose={() => setSelectedClientId(null)}
      /> 

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};

export default ClientList;