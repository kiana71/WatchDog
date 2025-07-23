import React, { useState } from 'react';
import { Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import ChangePasswordModal from '../Auth/ChangePasswordModal';

const Header = ({ title = 'Digital Signage Watchdog' }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // User menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Change password modal state
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = () => {
    handleUserMenuClose();
    setChangePasswordOpen(true);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = (user) => {
    if (!user) return 'U';
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Left side - Logo and title */}
          <div className="flex items-center">
            <Monitor className="text-blue-500 dark:text-blue-400 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
          </div>

          {/* Right side - Theme toggle and user menu */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <Box>
                <IconButton
                  onClick={handleUserMenuClick}
                  sx={{ p: 0 }}
                  aria-controls={open ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40,
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {getUserInitials(user)}
                  </Avatar>
                </IconButton>

                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      minWidth: 200,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* User Info */}
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.is_verified ? '✅ Verified' : '⚠️ Not Verified'}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Menu Items */}
                  <MenuItem onClick={handleChangePassword}>
                    <span style={{ marginRight: '8px' }}>🔒</span>
                    Change Password
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>
                    <span style={{ marginRight: '8px' }}>🚪</span>
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              /* Show login button if not authenticated */
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
};

export default Header;