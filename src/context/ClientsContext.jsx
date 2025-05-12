import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Create the context
const ClientsContext = createContext({
  clients: [],
  loading: false,
  refreshClient: () => {},
  rebootClient: () => {}
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

  const refreshClient = async (id) => {
    try {
      await api.requestScreenshot(id);
      // Refresh the client data
      const updatedClients = await api.getClients();
      setClients(updatedClients);
    } catch (error) {
      console.error('Failed to refresh client:', error);
    }
  };

  const rebootClient = async (id) => {
    try {
      await api.rebootClient(id);
      // Simulate the client going offline temporarily after reboot
      setClients(prev => 
        prev.map(client => 
          client.id === id 
            ? { ...client, isOnline: false, lastSeen: new Date().toISOString() }
            : client
        )
      );
      // Simulate the client coming back online after a delay
      setTimeout(async () => {
        const updatedClients = await api.getClients();
        setClients(updatedClients);
      }, 5000);
    } catch (error) {
      console.error('Failed to reboot client:', error);
    }
  };

  return (
    <ClientsContext.Provider value={{ clients, loading, refreshClient, rebootClient }}>
      {children}
    </ClientsContext.Provider>
  );
};
