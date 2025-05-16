import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Download, AppWindow, X, AlertCircle } from 'lucide-react';

const DownloadModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setError(null);
    const baseUrl = import.meta.env.VITE_RELEASE_URL;
    
    if (!baseUrl) {
      setError('Release URL not configured. Please contact your administrator.');
      return;
    }

    // Use only the Windows installer filename
    const fileName = 'Digital-Signage-Watchdog-Setup-1.0.0.exe';
    const downloadUrl = `${baseUrl}/${fileName}`;
    
    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      // First check if the file exists with improved CORS handling
      const response = await fetch(downloadUrl, { 
        method: 'HEAD',
        mode: 'cors',
        credentials: 'include', // Include credentials if the server requires authentication
        headers: {}
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`The requested file (${fileName}) was not found on the server.`);
        } else if (response.status === 403) {
          throw new Error('Access to the download file is forbidden. Please check your permissions.');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in and try again.');
        } else if (response.status === 0) {
          throw new Error('Unable to access the download server. This may be due to CORS restrictions or the server being unavailable.');
        } else {
          throw new Error(`Server error (HTTP ${response.status}). Please try again later.`);
        }
      }
     
      // If the HEAD request succeeds, create a temporary anchor and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setError('Unable to connect to the download server. This might be due to CORS restrictions or network issues. Please try again later or contact support.');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again later or contact support.');
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex justify-between items-center border-b pb-3 mb-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center gap-2">
                    <Download className="text-blue-500" size={20} />
                    Download Digital Signage Watchdog
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-300">Download Error</p>
                      <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Windows Installation */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <AppWindow className="text-blue-500" size={24} />
                      <h3 className="text-xl font-medium">Windows Installation</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center h-12 gap-2 px-4 py-0 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Download size={12} />
                        Download for Windows
                      </button>
                      <div className="text-gray-700 dark:text-gray-300">
                        <p className="font-medium mb-2">Installation steps:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Run the downloaded installer (.exe file)</li>
                          <li>Follow the installation wizard</li>
                          <li>The application will start automatically after installation</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Important Note</h4>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                      After installation, the Digital Signage Watchdog will run in the background and appear in your system tray. It will automatically monitor your system and maintain a connection with the dashboard.
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DownloadModal;