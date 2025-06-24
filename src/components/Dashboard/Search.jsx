import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = ({value , onChange}) => {
    return (
        <form className="relative">
            <div className="relative" onSubmit={e => e.preventDefault()}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={value}
                    onChange={onChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                />
            </div>
        </form>
    );
};

export default Search;
