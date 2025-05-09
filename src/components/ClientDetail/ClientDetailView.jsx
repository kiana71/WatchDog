import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Monitor, Clock, Wifi, Tag, Power, Image } from 'lucide-react';
import { api } from '../../services/api';
import StatusBadge from '../common/StatusBadge';
import ScreenshotViewer from './ScreenshotViewer';
import SystemInfo from './SystemInfo';

const ClientDetailView = () => {
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
      await api.requestScreenshot(client.id);
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
      await api.rebootClient(client.id);
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
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <button 
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold inline-flex items-center">
            {client.name}
            <StatusBadge status={client.isOnline ? 'online' : 'offline'} className="ml-3" />
          </h1>
          <div className="text-sm text-gray-500 mt-1">
            <Clock size={14} className="inline mr-1" />
            <span>
              Last seen: {new Date(client.lastSeen).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRefreshScreenshot}
            disabled={refreshing || !client.isOnline}
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Screenshot'}
          </button>
          <button 
            onClick={handleReboot}
            disabled={rebooting || !client.isOnline}
            className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50"
          >
            <Power size={16} className="mr-2" />
            {rebooting ? 'Rebooting...' : 'Reboot'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScreenshotViewer 
          screenshot={client.screenshot}
          isOnline={client.isOnline}
          lastUpdated={client.lastSeen}
        />
        <div className="space-y-6">
          <SystemInfo client={client} />
          {/* Recent Actions */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Recent Actions
              </h2>
            </div>
            <div className="space-y-3">
              {actions.length === 0 ? (
                <p className="text-gray-500">No recent actions for this client.</p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {actions.map(action => (
                    <li key={action.id} className="py-3">
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <span className="font-medium">
                            {action.type === 'reboot' && 'Reboot'}
                            {action.type === 'screenshot' && 'Screenshot'}
                            {action.type === 'update' && 'Update'}
                          </span>
                          <span className="text-gray-500">
                            {new Date(action.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          action.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          action.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {action.status}
                        </span>
                      </div>
                      {action.result && (
                        <p className="mt-1 text-sm text-gray-500">
                          {action.result}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailView;