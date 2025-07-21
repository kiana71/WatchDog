import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Collapse,
  IconButton,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../Auth/ChangePasswordModal';

const PasswordChangePrompt = () => {
  const { user, isAuthenticated } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  useEffect(() => {
    // Show prompt if user is authenticated and recently created
    // We can assume they're using temp password if account is very new
    if (isAuthenticated && user) {
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      // Show prompt if account is less than 1 day old and user hasn't dismissed it
      const promptDismissed = localStorage.getItem(`password-prompt-dismissed-${user._id}`);
      
      if (accountAge < oneDayInMs && !promptDismissed) {
        setShowPrompt(true);
      }
    }
  }, [isAuthenticated, user]);

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember that user dismissed this prompt
    if (user) {
      localStorage.setItem(`password-prompt-dismissed-${user._id}`, 'true');
    }
  };

  const handleChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const handleModalClose = () => {
    setChangePasswordOpen(false);
    // If they successfully changed password, dismiss the prompt
    setShowPrompt(false);
    if (user) {
      localStorage.setItem(`password-prompt-dismissed-${user._id}`, 'true');
    }
  };

  if (!showPrompt || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Collapse in={showPrompt}>
        <Box sx={{ mb: 3 }}>
          <Alert
            severity="info"
            action={
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleChangePassword}
                  variant="outlined"
                  sx={{ minWidth: 'auto' }}
                >
                  Change Password
                </Button>
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleDismiss}
                >
                  <span>✕</span>
                </IconButton>
              </Box>
            }
          >
            <AlertTitle>🔑 Secure Your Account</AlertTitle>
            You're currently using a temporary password from your verification email. 
            For better security, we recommend changing it to a password of your choice.
          </Alert>
        </Box>
      </Collapse>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default PasswordChangePrompt; 