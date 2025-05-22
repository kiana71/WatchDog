import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const ScreenshotImg = ({ client }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScreenshots = async () => {
    try {
      setLoading(true);
      setError(null);
      const screenshots = await api.getClientScreenshots(client.computerName);
      if (screenshots.length > 0) {
        setScreenshot(screenshots[0]);
      }
    } catch (err) {
      setError('Failed to fetch screenshot');
      console.error('Error fetching screenshots:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestScreenshot = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.requestClientScreenshot(client.computerName);
      // Wait a moment for the screenshot to be taken and uploaded
      setTimeout(fetchScreenshots, 2000);
    } catch (err) {
      setError('Failed to request screenshot');
      console.error('Error requesting screenshot:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (client) {
      requestScreenshot();
    }
  }, [client]);

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
          title="Refresh Screenshot"
        >
          <RefreshCw size={16} className={`text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
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
