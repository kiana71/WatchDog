import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

/**
 * Header component for client detail page
 * @param {Object} props - Component props
 * @param {Object} props.client - Client data
 * @param {function} props.onBack - Function to call when back button is clicked
 */
const ClientHeader = ({ client, onBack }) => {
  if (!client) return null;

  return (
    <div className="flex justify-between items-start">
      <div>
        <button 
          onClick={onBack}
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
    </div>
  );
};

export default ClientHeader; 