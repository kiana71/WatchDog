import React from 'react';
import { api } from '../../services/api';
import EditableField from '../common/EditableField';
import ScreenshotViewer from './ScreenshotViewer';
import SystemInfo from './SystemInfo';

/**
 * Component to display client quick view in a slide-over panel
 * @param {Object} props - Component props
 * @param {Object} props.client - Client data to display
 * @param {function} props.onClientUpdated - Function to call when client is updated
 */
const ClientQuickView = ({ client, onClientUpdated }) => {
  if (!client) return null;

  const handleNameSave = async (newName) => {
    try {
      await api.updateClient(client.id, { name: newName });
      if (onClientUpdated) {
        onClientUpdated();
      }
    } catch (error) {
      console.error('Failed to update client name:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-4 sm:px-6 -mt-3">
        <EditableField
          value={client.name}
          onSave={handleNameSave}
          displayComponent={
            <span className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {client.name}
            </span>
          }
        />
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mt-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Last seen: {new Date(client.lastSeen).toLocaleString()}
          </h3>
        </div>
      </div>
      <ScreenshotViewer
        screenshot={client.screenshot}
        isOnline={client.isOnline}
        lastUpdated={client.lastSeen}
      />
      <SystemInfo client={client} />
    </div>
  );
};

export default ClientQuickView; 