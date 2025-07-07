import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const ScreenshotImg = ({ client }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch screenshot when component mounts or client changes
  useEffect(() => {
    if (client?.computerName) {
      fetchScreenshot();
    }
  }, [client?.computerName]);

  const fetchScreenshot = async () => {
    try {
      console.log('Fetching screenshot for client:', client.computerName);
      setLoading(true);
      setError(null);
      
      // Use the new single screenshot API
      const screenshot = await api.getClientScreenshot(client.computerName);
      console.log('Received screenshot:', screenshot ? 'Found' : 'None');

      if (screenshot) {
        setScreenshot(screenshot);
        setLastFetch(new Date());
      } else {
        console.log('No screenshot found for this client');
        setScreenshot(null);
      }
    } catch (err) {
      console.error('Error fetching screenshot:', err);
      if (err.message.includes('404')) {
        setError('No screenshot available yet');
        setScreenshot(null);
      } else {
        setError('Failed to fetch screenshot');
      }
    } finally {
      setLoading(false);
    }
  };

  const requestScreenshot = async () => {
    try {
      console.log('Requesting screenshot for client:', client.computerName);
      setLoading(true);
      setError(null);
      const response = await api.requestClientScreenshot(client.computerName);
      console.log('Screenshot request response:', response);
      
      // Wait a moment for the screenshot to be taken and uploaded
      console.log('Waiting 3 seconds before fetching...');
      setTimeout(fetchScreenshot, 3000);
    } catch (err) {
      console.error('Error requesting screenshot:', err);
      setError('Failed to request screenshot');
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Screenshot
          {screenshot && lastFetch && (
            <span className="ml-2 text-xs text-gray-400">
              {new Date(screenshot.timestamp).toLocaleString()}
            </span>
          )}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={fetchScreenshot}
            disabled={loading}
            className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
            title="Refresh Screenshot"
          >
            <RefreshCw size={16} className={`text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={requestScreenshot}
            disabled={loading}
            className="p-1 rounded-lg bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 disabled:opacity-50"
            title="Take New Screenshot"
          >
           {/* <Camera size={16} className={`text-blue-600 dark:text-blue-300 ${loading ? 'animate-spin' : ''}`} /> */}
            <Camera size={16} className={`text-blue-600 dark:text-blue-300 ${loading ? 'text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 dark:text-red-400 mb-2">
          {error}
        </div>
      )}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        {loading && !screenshot ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
          </div>
        ) : screenshot ? (
          <div
            className="relative w-full h-full cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
          >
            
            <img
              src={`data:image/${screenshot.format};base64,${screenshot.image}`}
              alt={`Screenshot from ${new Date(screenshot.timestamp).toLocaleString()}`}
              className="w-full h-full object-contain"
            />
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-lg font-semibold">Click to view</span>
            </div>
            {loading && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-lg p-1">
                <RefreshCw size={16} className="animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera size={32} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No screenshot available
              <br />
              <span className="text-xs">Click camera to take one</span>
            </p>
          </div>
        )}
      </div>
      {/* Modal for viewing screenshot */}
      {isModalOpen && screenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full h-full flex items-center justify-center p-0"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking the image
          >
            <button
              className="absolute top-10 right-44 text-white bg-red-100 bg-opacity-50 rounded-full w-10 h-10 p-2 hover:bg-opacity-80 focus:outline-none z-10"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={`data:image/${screenshot.format};base64,${screenshot.image}`}
              alt={`Screenshot from ${new Date(screenshot.timestamp).toLocaleString()}`}
              className="max-w-[95vw] max-h-[90vh] w-auto h-auto rounded-lg shadow-lg object-contain mx-auto"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-gray-200 text-xs bg-black bg-opacity-40 px-2 py-1 rounded">
              {new Date(screenshot.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotImg;
