import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useClients } from '../../context/ClientsContext';
import ClientHeader from './ClientHeader';
import ClientActions from './ClientActions';
import ScreenshotViewer from './ScreenshotViewer';
import SystemInfo from './SystemInfo';
import ActionsList from './ActionsList';

/**
 * Component for detailed client view page
 */
const ClientDetailView = () => {
  const { refreshClient, rebootClient } = useClients();
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rebooting, setRebooting] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const clientData = await api.getClient(id);
        if (clientData) {
          setClient(clientData);
          const actionsData = await api.getClientActions(id);
          setActions(actionsData);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const handleRefreshScreenshot = async () => {
    if (!client) return;
    
    try {
      setRefreshing(true);
      await refreshClient(client.id);
      const updatedClient = await api.getClient(client.id);
      if (updatedClient) {
        setClient(updatedClient);
      }
    } catch (error) {
      console.error('Error refreshing screenshot:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleReboot = async () => {
    if (!client) return;
    
    try {
      setRebooting(true);
      await rebootClient(client.id);
      // For demo purposes, simulate the client going offline briefly
      setClient(prev => prev ? { ...prev, isOnline: false } : null);
      
      // Then simulate it coming back online after a delay
      setTimeout(async () => {
        const updatedClient = await api.getClient(client.id);
        if (updatedClient) {
          setClient(updatedClient);
        }
        setRebooting(false);
      }, 5000);
    } catch (error) {
      console.error('Error rebooting client:', error);
      setRebooting(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Client not found</h2>
        <button 
          onClick={handleBack}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <ClientHeader client={client} onBack={handleBack} />
        <ClientActions 
          isOnline={client.isOnline}
          refreshing={refreshing}
          rebooting={rebooting}
          onRefresh={handleRefreshScreenshot}
          onReboot={handleReboot}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScreenshotViewer 
          screenshot={client.screenshot}
          isOnline={client.isOnline}
          lastUpdated={client.lastSeen}
        />
        <div className="space-y-6">
          <SystemInfo client={client} />
          <ActionsList actions={actions} />
        </div>
      </div>
    </div>
  );
};

export default ClientDetailView;