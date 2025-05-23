import React, { useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const ScreenshotImg = ({ client }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScreenshots = async () => {
    try {
      console.log('Fetching screenshots for client:', client.computerName);
      setLoading(true);
      setError(null);
      const screenshots = await api.getClientScreenshots(client.computerName);
      console.log('Received screenshots:', screenshots);
      if (screenshots.length > 0) {
        setScreenshot(screenshots[0]);
      } else {
        console.log('No screenshots found');
      }
    } catch (err) {
      console.error('Error fetching screenshots:', err);
      setError('Failed to fetch screenshot');
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
      console.log('Waiting 2 seconds before fetching...');
      setTimeout(fetchScreenshots, 2000);
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
        </h3>
        <button
          onClick={requestScreenshot}
          disabled={loading}
          className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          title="Take Screenshot"
        >
          <Camera size={16} className={`text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-500 dark:text-red-400 mb-2">
          {error}
        </div>
      )}

      <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
          </div>
        ) : screenshot ? (
          <img
            src={`data:image/${screenshot.format};base64,${screenshot.image}`}
            alt={`Screenshot from ${new Date(screenshot.timestamp).toLocaleString()}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={24} className="text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenshotImg;
