import React from 'react';

const StatusBadge = ({ 
  status = 'offline', 
  pulseAnimation = true,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const isOnline = status === 'online';
  const statusColor = isOnline ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex">
        <div className={`${sizeClasses[size]} ${statusColor} rounded-full`}></div>
        {isOnline && pulseAnimation && (
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
        )}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default StatusBadge;