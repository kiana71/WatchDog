import React, { useState } from 'react';
import { useClients } from '../../context/ClientsContext';
import ClientListView from './ClientListView';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import ClientDetailSlideOver from './ClientDetailSlideOver';
import DownloadModal from './DownloadModal';

/**
 * Main dashboard component displaying client list and stats
 */
const ClientList = () => {
  const { clients, loading, restartClient, shutdownClient } = useClients();
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  // Find the selected client using either id or _id
  const selectedClient = clients.find(client => (client.id || client._id) === selectedClientId);
  
  return (
    <div className="relative">
      <div className="mb-6">
        <DashboardHeader onDownloadClick={() => setIsDownloadModalOpen(true)} />
        <DashboardStats clients={clients} />
      </div>

      <ClientListView

        clients={clients}
        onRestart={restartClient}
        onShutdown={shutdownClient}
        onClientSelect={setSelectedClientId}
      />

      <ClientDetailSlideOver
        client={selectedClient}
        isOpen={!!selectedClientId}
        onClose={() => setSelectedClientId(null)}
      /> 

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};

export default ClientList;