import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useRealtimeClients } from '../hooks/useRealtimeClients';

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
      
      // Trust the server's connected status - don't override it with lastSeen calculations
      const clientsWithStatus = data.map(client => {
        // Use the server's connected status directly
        const isOnline = client.connected !== undefined ? client.connected : false;
        
        return {
          ...client,
          isOnline: isOnline
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

    // Reduce polling frequency since we have real-time updates for disconnects
    // Keep some polling for initial data and reconnection scenarios
    const interval = setInterval(() => {
      fetchClients();
    },2000);  // 10 seconds instead of 2 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshClients = async () => {
    setLoading(true);
    try {
      // Get current clients data
      const data = await api.getClients();
      
      // Trust the server's connected status - don't override with client-side calculations
      const updatedClients = data.map(client => {
        return {
          ...client,
          isOnline: client.connected !== undefined ? client.connected : false
        };
      });
      
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

  // Handle real-time client status changes
  const handleClientStatusChange = (statusData) => {
    setClients(prevClients => {
      return prevClients.map(client => {
        if (client.computerName === statusData.computerName) {
          return {
            ...client,
            connected: statusData.status === 'connected',
            isOnline: statusData.status === 'connected',
            lastSeen: statusData.timestamp,
            lastDisconnected: statusData.status === 'disconnected' ? statusData.timestamp : client.lastDisconnected
          };
        }
        return client;
      });
    });
  };

  // Set up real-time connection
  useRealtimeClients(handleClientStatusChange);

  return (
    <ClientsContext.Provider value={{ clients, loading, restartClient, shutdownClient, refreshClients }}>
      {children}
    </ClientsContext.Provider>
  );
};