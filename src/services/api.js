import { mockClients, mockActions } from './mockData';
// Import exec only on the server side (using comment to avoid browser errors)
// import { exec } from 'child_process';

// Handle environment variables safely for different bundlers
const getEnv = (key, defaultValue) => {
  // For Vite
  if (import.meta && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // For Create React App
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  // Check for window.__ENV__ (sometimes used for runtime env vars)
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }
  
  return defaultValue;
};

// IMPORTANT: Hardcode API URL for now to force connection to Heroku
const API_BASE_URL = 'https://signcast-watchdog-91d66c3ccf16.herokuapp.com/api';

// Original dynamic URL (commented out for now)
// const API_BASE_URL = getEnv('VITE_API_URL', 'https://signcast-watchdog-91d66c3ccf16.herokuapp.com/api');

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to determine if we should use mock data
const useMockData = () => {
  // ALWAYS use real API with Heroku deployment
  return false;
  
  // In development without proper env setup, default to mock data
  // This code is now unreachable but kept for reference
  const useMock = getEnv('VITE_USE_MOCK_API', 'false');
  console.log('Using mock data:', useMock);
  return useMock === 'true';
};

export const api = {
  // Flag to indicate if we're using mock data
  useMockData: useMockData(),

  // Get all clients
  getClients: async () => {
    if (useMockData()) {
      await delay(800);
      return [...mockClients];
    }
    
    try {
      console.log('Fetching clients from:', `${API_BASE_URL}/clients`);
      const response = await fetch(`${API_BASE_URL}/clients`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get a specific client by ID
  getClient: async (id) => {
    if (useMockData()) {
      await delay(600);
      return mockClients.find(client => client.id === id);
    }
    
    try {
      console.log('Fetching client details from:', `${API_BASE_URL}/clients/${id}`);
      const response = await fetch(`${API_BASE_URL}/clients/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },
 
  // Update client fields
  updateClient: async (clientId, fields) => {
    // Handle both id and _id fields
    const id = clientId || (fields && (fields.id || fields._id));
    
    if (!id) {
      console.error('No client ID provided for update');
      throw new Error('Client ID is required');
    }
    
    console.log(`Updating client ${id} with fields:`, fields);
    
    if (useMockData()) {
      await delay(600);
      const clientIndex = mockClients.findIndex(c => c.id === id);
      if (clientIndex === -1) {
        throw new Error('Client not found');
      }

      mockClients[clientIndex] = {
        ...mockClients[clientIndex],
        ...fields
      };

      return mockClients[clientIndex];
    }
    
    try {
      console.log(`Sending PATCH request to: ${API_BASE_URL}/clients/${id}`);
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Update failed with status ${response.status}:`, errorText);
        throw new Error(`Update failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Update successful, received:', result);
      return result;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Get recent actions for a client
  getClientActions: async (clientId) => {
    if (useMockData()) {
      await delay(600);
      return mockActions.filter(action => action.clientId === clientId);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}/actions`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching actions for client ${clientId}:`, error);
      return []; // Return empty array on error to avoid breaking the UI
    }
  },

  // Get all actions
  getAllActions: async () => {
    if (useMockData()) {
      await delay(700);
      return [...mockActions];
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/actions`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all actions:', error);
      return []; // Return empty array on error to avoid breaking the UI
    }
  },

  // Restart a client computer
  restartClient: async (id) => {
    if (useMockData()) {
      await delay(1000); // Simulate network delay
      const client = mockClients.find(c => c.id === id);
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Create a new action
      const action = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: id,
        type: 'restart',
        status: client.isOnline ? 'completed' : 'failed',
        timestamp: new Date().toISOString(),
        result: client.isOnline ? 'Success' : 'Client offline',
      };
      
      return action;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reboot' }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error restarting client:', error);
      throw error;
    }
  },

  // Shutdown a client computer
  shutdownClient: async (id) => {
    if (useMockData()) {
      await delay(1000); // Simulate network delay
      const client = mockClients.find(c => c.id === id);
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Create a new action
      const action = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: id,
        type: 'shutdown',
        status: client.isOnline ? 'completed' : 'failed',
        timestamp: new Date().toISOString(),
        result: client.isOnline ? 'Success' : 'Client offline',
      };
      
      return action;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'shutdown' }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error shutting down client:', error);
      throw error;
    }
  },
};