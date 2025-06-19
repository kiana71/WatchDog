import { API_BASE_URL } from './api';

export const organizationApi = {
  // Get all organizations
  getOrganizations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch organizations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },

  // Create a new organization
  createOrganization: async (organization) => {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organization),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create organization');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  // Update an organization
  updateOrganization: async (id, organization) => {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organization),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update organization');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  // Delete an organization
  deleteOrganization: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete organization');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  },

  // Get sites for an organization
  getOrganizationSites: async (organizationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/organization/${organizationId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch organization sites');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching organization sites:', error);
      throw error;
    }
  },

  // Create a new site
  createSite: async (organizationId, site) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/organization/${organizationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(site),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create site');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating site:', error);
      throw error;
    }
  },

  // Update a site
  updateSite: async (siteId, site) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${siteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(site),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update site');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating site:', error);
      throw error;
    }
  },

  // Delete a site
  deleteSite: async (siteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${siteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete site');
      }
    } catch (error) {
      console.error('Error deleting site:', error);
      throw error;
    }
  },

  // Helper functions for state management
  updateOrganizationInList: (organizations, updatedOrg) => {
    return organizations.map(org => 
      org._id === updatedOrg._id ? updatedOrg : org
    );
  },

  removeOrganizationFromList: (organizations, orgId) => {
    return organizations.filter(org => org._id !== orgId);
  },

  addSiteToOrganization: (organizations, orgId, newSite) => {
    return organizations.map(org => 
      org._id === orgId 
        ? { ...org, sites: [...(org.sites || []), newSite] }
        : org
    );
  },

  updateSiteInOrganization: (organizations, orgId, siteId, updatedSite) => {
    return organizations.map(org => {
      if (org._id === orgId) {
        return {
          ...org,
          sites: org.sites.map(site => 
            site._id === siteId ? updatedSite : site
          )
        };
      }
      return org;
    });
  },

  removeSiteFromOrganization: (organizations, orgId, siteId) => {
    return organizations.map(org => {
      if (org._id === orgId) {
        return {
          ...org,
          sites: org.sites.filter(site => site._id !== siteId)
        };
      }
      return org;
    });
  },

  // Add client to a site in organization state
  addClientToSite: (organizations, orgId, siteId, client) => {
    return organizations.map(org => {
      if (org._id === orgId) {
        return {
          ...org,
          sites: org.sites.map(site => {
            if (site._id === siteId) {
              return {
                ...site,
                clients: [...(site.clients || []), client]
              };
            }
            return site;
          })
        };
      }
      return org;
    });
  }
}; 