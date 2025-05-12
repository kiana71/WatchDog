import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useClients } from '../../context/ClientsContext';
import ClientHeader from './ClientHeader';
import ClientActions from './ClientActions';
import SystemInfo from './SystemInfo';
import ActionsList from './ActionsList';

/**
 * Component for detailed client view page
 */
const ClientDetailView = () => {
  const { restartClient, shutdownClient } = useClients();
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const [shuttingDown, setShuttingDown] = useState(false);

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

  const handleRestart = async () => {
    if (!client) return;
    
    try {
      setRestarting(true);
      await restartClient(client.id);
      const updatedClient = await api.getClient(client.id);
      if (updatedClient) {
        setClient(updatedClient);
      }
    } catch (error) {
      console.error('Error restarting client:', error);
    } finally {
      setRestarting(false);
    }
  };

  const handleShutdown = async () => {
    if (!client) return;
    
    try {
      setShuttingDown(true);
      await shutdownClient(client.id);
      // Set the client offline
      setClient(prev => prev ? { ...prev, isOnline: false } : null);
      
      // No automatic return to online state - client stays offline until manually turned on
      setTimeout(() => {
        setShuttingDown(false);
      }, 2000);
    } catch (error) {
      console.error('Error shutting down client:', error);
      setShuttingDown(false);
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
          restarting={restarting}
          shuttingDown={shuttingDown}
          onRestart={handleRestart}
          onShutdown={handleShutdown}
        />
      </div>

      <div className="space-y-6">
        <SystemInfo client={client} />
        <ActionsList actions={actions} />
      </div>
    </div>
  );
};

export default ClientDetailView;