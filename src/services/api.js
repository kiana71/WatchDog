import { mockClients, mockActions } from './mockData';
// Import exec only on the server side (using comment to avoid browser errors)
// import { exec } from 'child_process';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
// Get all clients
  getClients: async () => {
    await delay(800);
    return [...mockClients];
  },

  // Get a specific client by ID
  getClient: async (id) => {
    await delay(600);
    return mockClients.find(client => client.id === id);
  },
 
  // Update client fields
  updateClient: async (id, fields) => {
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
  },

  // Get recent actions for a client
  getClientActions: async (clientId) => {
    await delay(600);
    return mockActions.filter(action => action.clientId === clientId);
  },

  // Get all actions
  getAllActions: async () => {
    await delay(700);
    return [...mockActions];
  },

  // Restart a client computer
  restartClient: async (id) => {
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
    
    // For Windows - commented out to avoid browser issues
    // In a real application, this would be executed on the server or Electron app
    // exec('shutdown /r /t 5', (error) => {
    //   if (error) console.error('Restart error:', error);
    // });
    
    return action;
  },

  // Shutdown a client computer
  shutdownClient: async (id) => {
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
    
    // For Windows - commented out to avoid browser issues
    // In a real application, this would be executed on the server or Electron app
    // exec('shutdown /s /t 5', (error) => {
    //   if (error) console.error('Shutdown error:', error);
    // });
    
    return action;
  },
};