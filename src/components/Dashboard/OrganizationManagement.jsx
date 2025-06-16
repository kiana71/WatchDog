import React, { useState } from 'react';
import OrganizationHeader from './OrganizationHeader';
import OrganizationStats from './OrganizationStats';
import OrganizationTree from './OrganizationTree';
import ToastContainer from '../common/ToastContainer';
import { useToast } from '../../hooks/useToast';

/**
 * Organization Management component for managing organizations and sites
 */
const OrganizationManagement = () => {
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Move organizations state to parent
  const [organizations, setOrganizations] = useState([
    {
      id: 'org1',
      name: 'Acme Corp',
      description: 'Main corporate organization',
      sites: [
        {
          id: 'site1',
          name: 'Headquarters',
          organizationId: 'org1',
          clients: [
            { id: 'client1', computerName: 'PC-HQ-001', name: 'Reception Display' },
            { id: 'client2', computerName: 'PC-HQ-002', name: 'Lobby Screen' }
          ]
        },
        {
          id: 'site2', 
          name: 'Branch Office 1',
          organizationId: 'org1',
          clients: [
            { id: 'client3', computerName: 'PC-BR1-001', name: 'Main Display' }
          ]
        }
      ]
    },
    {
      id: 'org2',
      name: 'Tech Solutions',
      description: 'Technology services division',
      sites: [
        {
          id: 'site3',
          name: 'Development Center',
          organizationId: 'org2',
          clients: [
            { id: 'client4', computerName: 'PC-DEV-001', name: 'Dev Display' }
          ]
        }
      ]
    }
  ]);

  const [expandedOrgs, setExpandedOrgs] = useState({});
  const [editingOrg, setEditingOrg] = useState(null);

  // Generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add new organization
  const handleAddOrganization = async () => {
    try {
      const newOrg = {
        id: `org_${generateId()}`,
        name: 'New Organization',
        description: 'Click to edit description',
        sites: []
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add to organizations state
      setOrganizations(prev => [...prev, newOrg]);
      
      // Auto-expand and edit the new organization
      setExpandedOrgs(prev => ({ ...prev, [newOrg.id]: true }));
      //explain expand
      setEditingOrg(`${newOrg.id}-name`);
      
      showSuccess('Organization created successfully');
    } catch (error) {
      showError('Failed to create organization');
    }
  };

  return (
    <div className="space-y-6">
      <OrganizationHeader onAddOrganization={handleAddOrganization} />
      
      <OrganizationStats organizations={organizations} />

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
      />

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default OrganizationManagement; 