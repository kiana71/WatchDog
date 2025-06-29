// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { ClientsProvider } from './context/ClientsContext';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import ClientList from './components/Dashboard/ClientList';
import OrganizationManagement from './components/Dashboard/OrganizationManagement';

// Create a Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // blue-500
    },
    secondary: {
      main: '#6b7280', // gray-500
    },
    background: {
      default: '#1f2937', // gray-800
      paper: '#111827', // gray-900
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Create a light theme variant
const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6', // blue-500
    },
    secondary: {
      main: '#6b7280', // gray-500
    },
    background: {
      default: '#f3f4f6', // gray-100
      paper: '#ffffff', // white
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  // You can add logic here to switch between themes based on user preference
  const currentTheme = theme; // or lightTheme

  return (
    <MuiThemeProvider theme={currentTheme}>
      <ThemeProvider>
        <ClientsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<ClientList />} />
                <Route path="organization" element={<OrganizationManagement />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ClientsProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;