import React from 'react';
import StatusBadge from '../common/StatusBadge';
import ClientActionButtons from './ClientActionButtons';

/**
 * Component to display a single client row in the table
 * @param {Object} props - Component props
 * @param {Object} props.client - Client data
 * @param {function} props.onClick - Function to call when row is clicked
 * @param {function} props.onRestart - Function to call when restart button is clicked
 * @param {function} props.onShutdown - Function to call when shutdown button is clicked
 */
const ClientTableRow = ({ client, onClick, onRestart, onShutdown }) => {
  return (
    <tr 
      onClick={() => onClick(client.id)}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={client.isOnline ? 'online' : 'offline'} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {client.name || 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {client.computerName}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {client.ipAddress}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(client.lastSeen).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ClientActionButtons
          isOnline={client.isOnline}
          clientId={client.id}
          onRestart={onRestart}
          onShutdown={onShutdown}
        />
      </td>
    </tr>
  );
};

export default ClientTableRow; 