import React from 'react';

/**
 * Component to display a list of client actions
 * @param {Object} props - Component props
 * @param {Array} props.actions - List of actions to display
 */
const ActionsList = ({ actions = [] }) => {
  return (
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
                      {action.type === 'restart' && 'Restart Computer'}
                      {action.type === 'shutdown' && 'Shutdown'}
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
  );
};

export default ActionsList; 