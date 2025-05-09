import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import ClientList from './components/Dashboard/ClientList';
import ClientDetailView from './components/ClientDetail/ClientDetailView';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<ClientList />} />
            <Route path="client/:id" element={<ClientDetailView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 