// src/components/Dashboard/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;