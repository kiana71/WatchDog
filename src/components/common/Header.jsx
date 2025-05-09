import React from 'react';
import { Monitor } from 'lucide-react';

const Header = ({ title = 'Digital Signage Watchdog' }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Monitor className="text-blue-500 dark:text-blue-400 mr-2" size={24} />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
        </div>
        <div className="flex items-center">
          <button className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="font-medium">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;