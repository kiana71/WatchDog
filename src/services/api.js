import { mockClients, mockActions } from './mockData';

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

  // Send reboot command to a client
  rebootClient: async (id) => {
    await delay(1000);
    const client = mockClients.find(c => c.id === id);
    if (!client) {
      throw new Error('Client not found');
    }
    
    // Create a new action
    const action = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: id,
      type: 'reboot',
      status: client.isOnline ? 'completed' : 'failed',
      timestamp: new Date().toISOString(),
      result: client.isOnline ? 'Success' : 'Client offline',
    };
    
    return action;
  },

  // Request a new screenshot from a client
  requestScreenshot: async (id) => {
    await delay(1500);
    const client = mockClients.find(c => c.id === id);
    if (!client) {
      throw new Error('Client not found');
    }
    
    // Create a new action
    const action = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: id,
      type: 'screenshot',
      status: client.isOnline ? 'completed' : 'failed',
      timestamp: new Date().toISOString(),
      result: client.isOnline ? 'Success' : 'Client offline',
    };
    
    // Update the client's screenshot if online
    if (client.isOnline) {
      client.screenshot = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg`;
      client.lastSeen = new Date().toISOString();
    }
    
    return action;
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
};