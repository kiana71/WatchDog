import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Create the context
const ClientsContext = createContext({
  clients: [],
  loading: false,
  restartClient: () => {},
  shutdownClient: () => {},
  refreshClients: () => {}
});

// Custom hook for using the context
export const useClients = () => useContext(ClientsContext);

// Provider component
export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const data = await api.getClients();
      
      // Calculate isOnline status for each client
      const clientsWithStatus = data.map(client => {
        const connectionStatus = client.connected !== undefined ? client.connected : client.isOnline;
        const lastSeen = new Date(client.lastSeen);
        const now = new Date();
        const timeDiff = (now - lastSeen) / 1000; // difference in seconds
        
        // Consider client offline if:
        // 1. They are marked as disconnected OR
        // 2. Their lastSeen is more than 10 seconds ago (matching server logic)
        const isOffline = !connectionStatus || timeDiff > 10;
        
        return {
          ...client,
          isOnline: !isOffline
        };
      });
      
      setClients(clientsWithStatus);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();

    // Refresh more frequently to catch disconnections sooner
    const interval = setInterval(() => {
      fetchClients();
    }, 2000);  // 2000 milliseconds = 2 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshClients = async () => {
    setLoading(true);
    try {
      // Get current clients data
      const data = await api.getClients();
      
      // Update lastSeen only for clients that were active in the last 30 seconds
      const updatedClients = await Promise.all(
        data.map(async (client) => {
          const clientId = client.id || client._id;
          const lastSeen = new Date(client.lastSeen);
          const now = new Date();
          const timeDiff = (now - lastSeen) / 1000; // difference in seconds
          
          // Check if client is currently connected
          const isConnected = client.connected !== undefined ? client.connected : client.isOnline;
          
          // Only update lastSeen if client is connected AND was active in last 30 seconds
          if (isConnected && timeDiff <= 30) {
            const updateData = { lastSeen: now.toISOString() };
            await api.updateClient(clientId, updateData);
            return { 
              ...client, 
              lastSeen: updateData.lastSeen,
              isOnline: true
            };
          }
          
          // For offline clients, keep their original lastSeen
          return {
            ...client,
            isOnline: false
          };
        })
      );
      
      setClients(updatedClients);
    } catch (error) {
      console.error('Failed to refresh clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const restartClient = async (id) => {
    try {
      // First, signal the client to restart
      await api.restartClient(id);
      
      // Determine the property based on API or database scheme
      const onlineProperty = api.useMockData ? 'isOnline' : 'connected';
      
      // Use updateClient to set the client offline with updated lastSeen
      const updateData = { lastSeen: new Date().toISOString() };
      updateData[onlineProperty] = false;
      await api.updateClient(id, updateData);
      
      // Update local state to reflect the change immediately
      setClients(prev => 
        prev.map(client => {
          const clientId = client.id || client._id;
          if (clientId === id) {
            const updatedClient = { ...client, lastSeen: new Date().toISOString() };
            updatedClient[onlineProperty] = false;
            return updatedClient;
          }
          return client;
        })
      );
      
      // Simulate the client coming back online after a delay
      setTimeout(async () => {
        // Use updateClient to set the client back online
        const updateData = {};
        updateData[onlineProperty] = true;
        await api.updateClient(id, updateData);
        
        // Get the updated client data
        const updatedClient = await api.getClient(id);
        
        // Update only this client in the state
        if (updatedClient) {
          setClients(prev => 
            prev.map(client => {
              const clientId = client.id || client._id;
              return clientId === id ? updatedClient : client;
            })
          );
        }
      }, 5000);
    } catch (error) {
      console.error('Failed to restart client:', error);
    }
  };

  const shutdownClient = async (id) => {
    try {
      // Send shutdown command to the client
      await api.shutdownClient(id);
      
      // Determine the property based on API or database scheme
      const onlineProperty = api.useMockData ? 'isOnline' : 'connected';
      
      // Use updateClient to set the client offline permanently with updated lastSeen
      const updateData = { lastSeen: new Date().toISOString() };
      updateData[onlineProperty] = false;
      await api.updateClient(id, updateData);
      
      // Update local state to reflect the change immediately
      setClients(prev => 
        prev.map(client => {
          const clientId = client.id || client._id;
          if (clientId === id) {
            const updatedClient = { ...client, lastSeen: new Date().toISOString() };
            updatedClient[onlineProperty] = false;
            return updatedClient;
          }
          return client;
        })
      );
      
      // No automatic return to online state - stays offline until user turns it back on
    } catch (error) {
      console.error('Failed to shut down client:', error);
    }
  };

  return (
    <ClientsContext.Provider value={{ clients, loading, restartClient, shutdownClient, refreshClients }}>
      {children}
    </ClientsContext.Provider>
  );
};