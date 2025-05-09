import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import { api } from '../../services/api';

export const DashboardContext = React.createContext({
  clients: [],
  loading: false,
  refreshClient: () => {},
  rebootClient: () => {}
});

const DashboardLayout = () => {
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
    <DashboardContext.Provider value={{ clients, loading, refreshClient, rebootClient }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;