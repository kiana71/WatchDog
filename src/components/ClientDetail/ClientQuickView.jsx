import React from 'react';
import { api } from '../../services/api';
import EditableField from '../common/EditableField';
import SystemInfo from './SystemInfo';
import ScreenshotImg from './ScreenshotImg';
import ClientName from './ClientName';
/**
 * Component to display client quick view in a slide-over panel
 * @param {Object} props - Component props
 * @param {Object} props.client - Client data to display
 * @param {function} props.onClientUpdated - Function to call when client is updated
 */
const ClientQuickView = ({ client, onClientUpdated }) => {
  if (!client) return null;

  // Use either id or _id for MongoDB compatibility
  const clientId = client.id || client._id;

  // Determine if client is online based on connected property or isOnline
  const isOnline = client.connected !== undefined ? client.connected : client.isOnline;

  const handleNameSave = async (newName) => {
    try {
      await api.updateClient(clientId, { name: newName });
    } catch (error) {
      console.error('Failed to update client name:', error);
      throw error;
    }
  };

  const handleDescriptionSave = async (newDescription) => {
    try {
      await api.updateClient(clientId, { description: newDescription });
    } catch (error) {
      console.error('Failed to update client description:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-4 sm:px-6 -mt-3">
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Name:</span>
          <EditableField
            value={client.name}
            onSave={handleNameSave}
            displayComponent={
              <span className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {client.name || 'N/A'}
              </span>
            }
          />
        </div>
        
        <div className="mt-4">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Description:</span>
          <EditableField
            value={client.description}
            onSave={handleDescriptionSave}
            className="max-w-md"
            inputProps={{ 
              placeholder: "Add a description...",
              className: "w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white",
              as: "textarea",
              rows: 3
            }}
            displayComponent={
              <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                {client.description || 'N/A'}
              </div>
            }
          />
        </div>
        <div className=" mt-4">
        <ClientName client={client}/>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mt-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Last seen: {new Date(client.lastSeen).toLocaleString()}
          </h3>
        </div>
      
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mt-4">
          <ScreenshotImg client={client}/>
        </div>
      </div>
      <SystemInfo client={client}/>
    </div>
  );
};

export default ClientQuickView; 