import React from 'react';

const ClientName = ({ client }) => {
  // Add null/undefined check for client prop
  if (!client) {
    return (
      <div className="mb-2">
        <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
          Client Name:
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // Display custom client name if available, otherwise show N/A
  const displayName = client.clientName || 'N/A';
  const isCustomName = !!client.clientName;
  
  return (
    <div className="mb-2">
      <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
        Client Name:
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {displayName}
        </span>
        {isCustomName && (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
            Custom
          </span>
        )}
      </div>
      {/* {isCustomName && client.computerName && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Computer: {client.computerName}
        </p>
      )} */}
    </div>
  );
};

export default ClientName;


