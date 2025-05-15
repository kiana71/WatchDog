import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Create the context
const ClientsContext = createContext({
  clients: [],
  loading: false,
  restartClient: () => {},
  shutdownClient: () => {}
});

// Custom hook for using the context
export const useClients = () => useContext(ClientsContext);

// Provider component
export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await api.getClients();
        setClients(data);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();

    // Simulate periodic updates - in a real app, this would be WebSockets
    const interval = setInterval(() => {
      fetchClients();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
    <ClientsContext.Provider value={{ clients, loading, restartClient, shutdownClient }}>
      {children}
    </ClientsContext.Provider>
  );
};
