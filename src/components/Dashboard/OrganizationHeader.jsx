import React from 'react';
import { Plus } from 'lucide-react';

const OrganizationHeader = ({ onAddOrganization }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold dark:text-white">Organization Management</h2>
      <button 
        onClick={onAddOrganization}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Plus size={16} />
        New Organization
      </button>
    </div>
  );
};

export default OrganizationHeader;