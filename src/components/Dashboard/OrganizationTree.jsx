import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import OrganizationCard from './organizations/OrganizationCard';
import UnassignedClients from './organizations/UnassignedClients';
import ConfirmDialog from '../common/ConfirmDialog';
import { clientApi } from '../../services/clientApi';
import { organizationApi } from '../../services/organizationApi';

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
  unassignedClients,
  setUnassignedClients,
  isCreatingOrg
}) => {
  const [expandedSites, setExpandedSites] = useState({});
  const [editingSite, setEditingSite] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  const toggleOrganization = (orgId) => {
    setExpandedOrgs(prev => ({ ...prev, [orgId]: !prev[orgId] }));
  };

  const toggleSite = (siteId) => {
    setExpandedSites(prev => ({ ...prev, [siteId]: !prev[siteId] }));
  };

  const generateUniqueSiteName = (orgId) => {
    const baseName = 'New Site';
    const org = (organizations || []).find(org => org._id === orgId);
    if (!org || !org.sites) return baseName;
    
    const existingNames = (org.sites || []).map(site => site.name);
    
    // Find the highest number suffix
    let counter = 1;
    while (existingNames.includes(`${baseName} ${counter}`)) {
      counter++;
    }
    
    return `${baseName} ${counter}`;
  };

  const handleAddSite = async (orgId) => {
    try {
      const newSite = {
        name: generateUniqueSiteName(orgId),
        organizationId: orgId,
        clients: []
      };
      
      const createdSite = await organizationApi.createSite(orgId, newSite);
      setOrganizations(prev => organizationApi.addSiteToOrganization(prev, orgId, createdSite));
      
      showSuccess('Site created successfully');
      setExpandedSites(prev => ({ ...prev, [createdSite._id]: true }));
      setEditingSite(createdSite._id);
    } catch (error) {
      showError(error.message || 'Failed to create site');
    }
  };

  const handleRemoveClient = async (clientId, siteId) => {
    try {
      await clientApi.removeClientFromSite(clientId, siteId);
      
      // Find the client being removed
      const clientToRemove = (organizations || [])
        .flatMap(org => (org.sites || []))
        .flatMap(site => (site.clients || []))
        .find(client => client._id === clientId);
      
      if (clientToRemove) {
        // Add client back to unassigned list
        setUnassignedClients(prev => [...(prev || []), clientToRemove]);
        
        // Remove client from organization state
        setOrganizations(prev => 
          (prev || []).map(org => ({
            ...org,
            sites: (org.sites || []).map(site => {
              if (site._id === siteId) {
                return {
                  ...site,
                  clients: ((site.clients || []).filter(client => client._id !== clientId))
                };
              }
              return site;
            })
          }))
        );
      }
      
      showSuccess('Client moved to unassigned');
    } catch (error) {
      showError('Failed to remove client');
    }
  };

  const handleAssignClient = async (clientId, assignmentValue) => {
    if (!assignmentValue || assignmentValue === 'Assign to...') return;

    try {
      console.log('Assigning client:', { clientId, assignmentValue });
      const [orgId, siteId] = assignmentValue.split('-');
      console.log('Parsed assignment:', { orgId, siteId });
      
      // Find the client being assigned
      const clientToAssign = (unassignedClients || []).find(client => client._id === clientId);
      if (!clientToAssign) {
        throw new Error('Client not found in unassigned list');
      }
      
      await clientApi.assignClientToSite(clientId, siteId);
      
      // Remove client from unassigned list
      setUnassignedClients(prev => (prev || []).filter(client => client._id !== clientId));
      
      // Update organization state to show the client in the assigned site
      setOrganizations(prev => organizationApi.addClientToSite((prev || []), orgId, siteId, clientToAssign));
      
      showSuccess('Client assigned successfully');
    } catch (error) {
      console.error('Assignment error details:', error);
      showError(`Failed to assign client: ${error.message}`);
    }
  };

  const handleSaveOrganization = async (orgId, field, value) => {
    try {
      const orgToUpdate = (organizations || []).find(org => org._id === orgId);
      if (!orgToUpdate) throw new Error('Organization not found');

      const updatedOrg = await organizationApi.updateOrganization(orgId, {
        ...orgToUpdate,
        [field]: value
      });
      
      setOrganizations(prev => organizationApi.updateOrganizationInList((prev || []), updatedOrg));
      showSuccess(`Organization ${field} updated successfully`);
      setEditingOrg(null);
    } catch (error) {
      showError(`Failed to update organization ${field}`);
    }
  };

  const handleSaveSite = async (siteId, name) => {
    try {
      const updatedSite = await organizationApi.updateSite(siteId, { name });
      setOrganizations(prev => organizationApi.updateSiteInOrganization(prev, updatedSite.organization, siteId, updatedSite));
      showSuccess('Site name updated successfully');
      setEditingSite(null);
    } catch (error) {
      showError('Failed to update site name');
    }
  };

  const handleDeleteOrganization = (org) => {
    const totalSites = org.sites?.length || 0;
    const totalClients = (org.sites || []).reduce((acc, site) => acc + (site.clients?.length || 0), 0);

    setConfirmDialog({
      isOpen: true,
      title: `Delete "${org.name}"?`,
      message: 'This action cannot be undone.',
      details: [
        { icon: '✗', text: `Delete ${totalSites} sites` },
        { icon: '📤', text: `Move ${totalClients} clients to unassigned` }
      ],
      onConfirm: () => deleteOrganization(org._id)
    });
  };

  const deleteOrganization = async (orgId) => {
    try {
      const orgToDelete = (organizations || []).find(org => org._id === orgId);
      if (!orgToDelete) throw new Error('Organization not found');

      const allClients = ((orgToDelete.sites || []).flatMap(site => (site.clients || [])));
      setUnassignedClients(prev => [...(prev || []), ...allClients]);

      await organizationApi.deleteOrganization(orgId);
      setOrganizations(prev => organizationApi.removeOrganizationFromList((prev || []), orgId));
      
      showSuccess('Organization deleted successfully');
      setConfirmDialog({ isOpen: false });
    } catch (error) {
      showError(error.message || 'Failed to delete organization');
    }
  };

  const handleDeleteSite = (site, orgName) => {
    const clientCount = site.clients?.length || 0;

    setConfirmDialog({
      isOpen: true,
      title: `Delete "${site.name}" site?`,
      message: `This will remove the site from ${orgName}.`,
      details: [{ icon: '📤', text: `Move ${clientCount} clients to unassigned` }],
      onConfirm: () => deleteSite(site._id, site.organization)
    });
  };

  const deleteSite = async (siteId, orgId) => {
    try {
      const siteToDelete = (organizations || [])
        .find(org => org._id === orgId)
        ?.sites?.find(site => site._id === siteId);

      if (!siteToDelete) throw new Error('Site not found');

      // Ensure clients is always an array before spreading
      const clientsToMove = siteToDelete.clients || [];
      setUnassignedClients(prev => [...(prev || []), ...clientsToMove]);
      
      await organizationApi.deleteSite(siteId);
      setOrganizations(prev => organizationApi.removeSiteFromOrganization((prev || []), orgId, siteId));
      
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
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchUnassignedClients();
  }, []);

  return (
    <div className="space-y-4">
      {(organizations || []).map(org => (
        <OrganizationCard
          key={org._id}
          org={org}
          isExpanded={expandedOrgs[org._id]}
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
        disabled={isCreatingOrg}
        className={`w-full p-4 border-2 border-dashed rounded-lg transition-colors ${
          isCreatingOrg 
            ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:border-blue-500 dark:hover:border-blue-400'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          {isCreatingOrg ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
              <span>Creating Organization...</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Add New Organization</span>
            </>
          )}
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