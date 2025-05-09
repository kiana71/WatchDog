import React from 'react';
import { RefreshCw, Image } from 'lucide-react';

const ScreenshotViewer = ({ 
  screenshot, 
  isOnline,
  refreshing,
  onRefresh,
  lastUpdated
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Image className="text-blue-500" size={20} />
          Current Display
        </h3>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            disabled={!isOnline || refreshing}
            className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
      </div>
      <div className="relative">
      {screenshot ? (
        <img 
          src={screenshot} 
          alt="Screen capture" 
          className="w-full h-auto"
        />
      ) : (
        <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500">
          No screenshot available
        </div>
      )}
      
        {!isOnline && (
          <div className="absolute top-0 left-0 right-0 bg-orange-500 bg-opacity-80 text-white p-2 text-center">
            Client Offline
            <div className="text-xs">Screenshot may be outdated</div>
          </div>
        )}
        
        {refreshing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 flex items-center gap-3">
              <RefreshCw size={20} className="text-blue-500 animate-spin" />
              <span>Capturing new screenshot...</span>
            </div>
          </div>
        )}
        
        {lastUpdated && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
            Last captured: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenshotViewer;