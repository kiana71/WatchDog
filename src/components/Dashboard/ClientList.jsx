import React, { useContext, useState } from 'react';
import { DashboardContext } from './DashboardLayout';
import ClientListView from './ClientListView';
import { Activity, Monitor, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ClientDetailSlideOver from './ClientDetailSlideOver';
import DownloadModal from './DownloadModal';

const ClientList = () => {
  const { clients, loading, refreshClient, rebootClient } = useContext(DashboardContext);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  const onlineCount = clients.filter(client => client.isOnline).length;
  const selectedClient = clients.find(client => client.id === selectedClientId);
  
  return (
    <div className="relative">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white">Dashboard</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download size={16} />
              Download Watchdog
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <Monitor className="text-blue-500 dark:text-blue-400 mr-2" size={20} />
            <span className="text-gray-600 dark:text-gray-300">
              Total Clients: <span className="font-semibold">{clients.length}</span>
            </span>
          </div>
          <div className="flex items-center">
            <Activity className="text-green-500 dark:text-green-400 mr-2" size={20} />
            <span className="text-gray-600 dark:text-gray-300">
              Online: <span className="font-semibold">{onlineCount}</span> / {clients.length}
            </span>
          </div>
        </div>
      </div>

      <ClientListView
        clients={clients}
        onRefresh={refreshClient}
        onReboot={rebootClient}
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