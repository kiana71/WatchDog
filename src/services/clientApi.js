import { API_BASE_URL } from './api';

export const clientApi = {
  // Get all unassigned clients
  getUnassignedClients: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/client-assignments/unassigned`);
      if (!response.ok) {
        throw new Error('Failed to fetch unassigned clients');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching unassigned clients:', error);
      throw error;
    }
  },

  // Assign a client to a site
  assignClientToSite: async (clientId, siteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/client-assignments/site/${siteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to assign client: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error assigning client:', error);
      throw error;
    }
  },

  // Remove a client from a site
  removeClientFromSite: async (clientId, siteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/client-assignments/site/${siteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, remove: true }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove client');
      }
      return await response.json();
    } catch (error) {
      console.error('Error removing client:', error);
      throw error;
    }
  },

  // Get all clients for a site
  getSiteClients: async (siteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/client-assignments/site/${siteId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch site clients');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching site clients:', error);
      throw error;
    }
  }
}; 