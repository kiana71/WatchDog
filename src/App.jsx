// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ClientsProvider } from './context/ClientsContext';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import ClientList from './components/Dashboard/ClientList';

function App() {
  return (
    <ThemeProvider>
      <ClientsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<ClientList />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ClientsProvider>
    </ThemeProvider>
  );
}

export default App;