import React from 'react';
import ClientTableRow from './ClientTableRow';

/**
 * Component to display the client list as a table
 * @param {Object} props - Component props
 * @param {Array} props.clients - List of clients to display
 * @param {function} props.onRestart - Function to handle restart button click
 * @param {function} props.onShutdown - Function to handle shutdown button click
 * @param {function} props.onClientSelect - Function to handle client selection
 */
const ClientListView = ({
  clients = [],
  onRestart,
  onShutdown,
  onClientSelect,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
              Computer Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
              IP Address
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
              Last Seen
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {clients.map((client) => (
            <ClientTableRow
              key={client.id || client._id}
              client={client}
              onClick={onClientSelect}
              onRestart={onRestart}
              onShutdown={onShutdown}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientListView;