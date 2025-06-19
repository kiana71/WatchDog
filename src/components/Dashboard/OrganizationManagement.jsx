import React, { useState, useEffect } from 'react';
import OrganizationHeader from './OrganizationHeader';
import OrganizationStats from './OrganizationStats';
import OrganizationTree from './OrganizationTree';
import ToastContainer from '../common/ToastContainer';
import { useToast } from '../../hooks/useToast';
import { organizationApi } from '../../services/organizationApi';
import { clientApi } from '../../services/clientApi';

/**
 * Organization Management component for managing organizations and sites
 */
const OrganizationManagement = () => {
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [organizations, setOrganizations] = useState([]);
  const [unassignedClients, setUnassignedClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrgs, setExpandedOrgs] = useState({});
  const [editingOrg, setEditingOrg] = useState(null);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orgsData, unassignedData] = await Promise.all([
        organizationApi.getOrganizations(),
        clientApi.getUnassignedClients()
      ]);
      setOrganizations(orgsData);
      setUnassignedClients(unassignedData);
    } catch (error) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateUniqueOrgName = () => {
    const baseName = 'New Organization';
    const existingNames = organizations.map(org => org.name);
    
    // Find the highest number suffix
    let counter = 1;
    while (existingNames.includes(`${baseName} ${counter}`)) {
      counter++;
    }
    
    return `${baseName} ${counter}`;
  };

  const handleAddOrganization = async () => {
    if (isCreatingOrg) return; // Prevent multiple clicks
    
    try {
      setIsCreatingOrg(true);
      const newOrg = {
        name: generateUniqueOrgName(),
        description: 'N/A'
      };

      const createdOrg = await organizationApi.createOrganization(newOrg);
      
      // Update organizations state with the new organization
      setOrganizations(prev => [...prev, createdOrg]);
      
      // Expand the new organization
      setExpandedOrgs(prev => ({ ...prev, [createdOrg._id]: true }));
      
      // Set editing state for the new organization
      setEditingOrg(`${createdOrg._id}-name`);
      
      showSuccess('Organization created successfully');
    } catch (error) {
      showError(error.message || 'Failed to create organization');
    } finally {
      setIsCreatingOrg(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrganizationHeader onAddOrganization={handleAddOrganization} />
      
      <OrganizationStats 
        organizations={organizations} 
        unassignedClients={unassignedClients}
      />

      <OrganizationTree 
        organizations={organizations}
        setOrganizations={setOrganizations}
        expandedOrgs={expandedOrgs}
        setExpandedOrgs={setExpandedOrgs}
        editingOrg={editingOrg}
        setEditingOrg={setEditingOrg}
        onAddOrganization={handleAddOrganization}
        showSuccess={showSuccess}
        showError={showError}
        unassignedClients={unassignedClients}
        setUnassignedClients={setUnassignedClients}
        isCreatingOrg={isCreatingOrg}
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default OrganizationManagement; 