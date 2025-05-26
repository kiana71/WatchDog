import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const ScreenshotImg = ({ client }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

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
            <Camera size={16} className={`text-blue-600 dark:text-blue-300 ${loading ? 'animate-spin' : ''}`} />
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
          <>
            <img
              src={`data:image/${screenshot.format};base64,${screenshot.image}`}
              alt={`Screenshot from ${new Date(screenshot.timestamp).toLocaleString()}`}
              className="w-full h-full object-contain"
            />
            {loading && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-lg p-1">
                <RefreshCw size={16} className="animate-spin text-white" />
              </div>
            )}
          </>
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
    </div>
  );
};

export default ScreenshotImg;
