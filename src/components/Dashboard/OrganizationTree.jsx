import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import OrganizationCard from './organizations/OrganizationCard';
import UnassignedClients from './organizations/UnassignedClients';
import ConfirmDialog from '../common/ConfirmDialog';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { clientApi } from '../../services/clientApi';

/**
 * Organization tree component with hierarchical structure
 */
const OrganizationTree = ({ 
  organizations, 
  setOrganizations, 
  expandedOrgs, 
  setExpandedOrgs, 
  editingOrg, 
  setEditingOrg, 
  onAddOrganization,
  showSuccess,
  showError,
  onClientSelect
}) => {
  const [unassignedClients, setUnassignedClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedSites, setExpandedSites] = useState({});
  const [editingSite, setEditingSite] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const toggleOrganization = (orgId) => {
    setExpandedOrgs(prev => ({ ...prev, [orgId]: !prev[orgId] }));
  };

  const toggleSite = (siteId) => {
    setExpandedSites(prev => ({ ...prev, [siteId]: !prev[siteId] }));
  };

  const handleAddSite = async (orgId) => {
    try {
      const newSite = {
        id: `site_${generateId()}`,
        name: 'New Site',
        organizationId: orgId,
        clients: []
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrganizations(prev => 
        prev.map(org => 
          org.id === orgId ? { ...org, sites: [...org.sites, newSite] } : org
        )
      );
      
      showSuccess('Site created successfully');
      setExpandedSites(prev => ({ ...prev, [newSite.id]: true }));
      setEditingSite(newSite.id);
    } catch (error) {
      showError('Failed to create site');
    }
  };

  const handleRemoveClient = async (clientId, siteId) => {
    try {
      await clientApi.removeClientFromSite(clientId, siteId);
      
      // Update organizations state
      setOrganizations(prev => 
        prev.map(org => ({
          ...org,
          sites: org.sites.map(site => {
            if (site.id === siteId) {
              return { ...site, clients: site.clients.filter(client => client._id !== clientId) };
            }
            return site;
          })
        }))
      );

      // Refresh unassigned clients
      await fetchUnassignedClients();
      showSuccess('Client moved to unassigned');
    } catch (error) {
      showError('Failed to remove client');
    }
  };

  const handleAssignClient = async (clientId, assignmentValue) => {
    if (!assignmentValue || assignmentValue === 'Assign to...') return;

    try {
      const [orgId, siteId] = assignmentValue.split('-');
      await clientApi.assignClientToSite(clientId, siteId);
      
      // Update local state
      setUnassignedClients(prev => prev.filter(client => client._id !== clientId));
      
      // Update organizations state to show the client in the assigned site
      setOrganizations(prev => 
        prev.map(org => {
          if (org.id === orgId) {
            return {
              ...org,
              sites: org.sites.map(site => {
                if (site.id === siteId) {
                  const clientToAssign = unassignedClients.find(c => c._id === clientId);
                  return { ...site, clients: [...site.clients, clientToAssign] };
                }
                return site;
              })
            };
          }
          return org;
        })
      );

      showSuccess('Client assigned successfully');
    } catch (error) {
      showError('Failed to assign client');
    }
  };

  const handleSaveOrganization = async (orgId, field, value) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrganizations(prev => 
        prev.map(org => 
          org.id === orgId ? { ...org, [field]: value } : org
        )
      );
      
      showSuccess(`Organization ${field} updated successfully`);
      setEditingOrg(null);
    } catch (error) {
      showError(`Failed to update organization ${field}`);
    }
  };

  const handleSaveSite = async (siteId, name) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrganizations(prev => 
        prev.map(org => ({
          ...org,
          sites: org.sites.map(site => 
            site.id === siteId ? { ...site, name } : site
          )
        }))
      );
      
      showSuccess('Site name updated successfully');
      setEditingSite(null);
    } catch (error) {
      showError('Failed to update site name');
    }
  };

  const handleDeleteOrganization = (org) => {
    const totalSites = org.sites.length;
    const totalClients = org.sites.reduce((acc, site) => acc + site.clients.length, 0);

    setConfirmDialog({
      isOpen: true,
      title: `Delete "${org.name}"?`,
      message: 'This action cannot be undone.',
      details: [
        { icon: '✗', text: `Delete ${totalSites} sites` },
        { icon: '📤', text: `Move ${totalClients} clients to unassigned` }
      ],
      onConfirm: () => deleteOrganization(org.id)
    });
  };

  const deleteOrganization = async (orgId) => {
    try {
      const orgToDelete = organizations.find(org => org.id === orgId);
      if (orgToDelete) {
        const allClients = orgToDelete.sites.flatMap(site => site.clients);
        setUnassignedClients(prev => [...prev, ...allClients]);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      setOrganizations(prev => prev.filter(org => org.id !== orgId));
      showSuccess('Organization deleted successfully');
      setConfirmDialog({ isOpen: false });
    } catch (error) {
      showError('Failed to delete organization');
    }
  };

  const handleDeleteSite = (site, orgName) => {
    const clientCount = site.clients.length;

    setConfirmDialog({
      isOpen: true,
      title: `Delete "${site.name}" site?`,
      message: `This will remove the site from ${orgName}.`,
      details: [{ icon: '📤', text: `Move ${clientCount} clients to unassigned` }],
      onConfirm: () => deleteSite(site.id)
    });
  };

  const deleteSite = async (siteId) => {
    try {
      let clientsToMove = [];
      setOrganizations(prev => {
        const newOrgs = prev.map(org => ({
          ...org,
          sites: org.sites.filter(site => {
            if (site.id === siteId) {
              clientsToMove = site.clients;
              return false;
            }
            return true;
          })
        }));
        return newOrgs;
      });

      setUnassignedClients(prev => [...prev, ...clientsToMove]);
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Site deleted successfully');
      setConfirmDialog({ isOpen: false });
    } catch (error) {
      showError('Failed to delete site');
    }
  };

  const fetchUnassignedClients = async () => {
    try {
      const data = await clientApi.getUnassignedClients();
      setUnassignedClients(data);
    } catch (error) {
      console.error('Error fetching unassigned clients:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnassignedClients();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="space-y-4">
      {organizations.map(org => (
        <OrganizationCard
          key={org.id}
          org={org}
          isExpanded={expandedOrgs[org.id]}
          editingOrg={editingOrg}
          expandedSites={expandedSites}
          editingSite={editingSite}
          onToggleOrg={toggleOrganization}
          onEditOrg={setEditingOrg}
          onSaveOrg={handleSaveOrganization}
          onDeleteOrg={handleDeleteOrganization}
          onToggleSite={toggleSite}
          onEditSite={setEditingSite}
          onSaveSite={handleSaveSite}
          onAddSite={handleAddSite}
          onDeleteSite={handleDeleteSite}
          onRemoveClient={handleRemoveClient}
        />
      ))}

      <button 
        onClick={onAddOrganization}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <div className="flex items-center justify-center space-x-2">
          <Plus size={20} />
          <span>Add New Organization</span>
        </div>
      </button>

      <UnassignedClients 
        clients={unassignedClients}
        organizations={organizations}
        onAssignClient={handleAssignClient}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        details={confirmDialog.details}
      />
    </div>
  );
};

export default OrganizationTree; 