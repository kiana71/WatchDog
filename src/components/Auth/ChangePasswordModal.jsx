import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
  Box,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { passwordApi } from '../../services/passwordApi';

const ChangePasswordModal = ({ open, onClose }) => {
  const { changePassword } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update password strength for new password field
    if (name === 'newPassword') {
      const strength = passwordApi.validatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const strength = passwordApi.validatePasswordStrength(formData.newPassword);
      if (!strength.isValid) {
        newErrors.newPassword = strength.feedback[0] || 'Password is too weak';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (!passwordApi.passwordsMatch(formData.newPassword, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is different from current
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: '', type: 'error' });

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        setAlert({
          show: true,
          message: 'Password changed successfully!',
          type: 'success'
        });

        // Reset form and close modal after short delay
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setAlert({
          show: true,
          message: result.error || 'Failed to change password. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'An unexpected error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    // Reset form state
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setAlert({ show: false, message: '', type: 'error' });
    setPasswordStrength({ score: 0, feedback: [] });
    setLoading(false);
    
    onClose();
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return 'error';
    if (passwordStrength.score <= 2) return 'warning';
    if (passwordStrength.score <= 3) return 'info';
    return 'success';
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>🔒</span>
          <Typography variant="h6">Change Password</Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Alert */}
          {alert.show && (
            <Alert 
              severity={alert.type} 
              sx={{ mb: 3 }}
              onClose={() => setAlert({ show: false, message: '', type: 'error' })}
            >
              {alert.message}
            </Alert>
          )}

          {/* Current Password Field */}
          <TextField
            fullWidth
            name="currentPassword"
            label="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={handleChange}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span>🔑</span>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    <span>{showCurrentPassword ? '🙈' : '👁️'}</span>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete="current-password"
            disabled={loading}
          />

          {/* New Password Field */}
          <TextField
            fullWidth
            name="newPassword"
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span>🔒</span>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    <span>{showNewPassword ? '🙈' : '👁️'}</span>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete="new-password"
            disabled={loading}
          />

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Password Strength:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(passwordStrength.score / 5) * 100}
                color={getPasswordStrengthColor()}
                sx={{ mt: 0.5, mb: 1 }}
              />
              {passwordStrength.feedback.length > 0 && (
                <Typography variant="caption" color={getPasswordStrengthColor()}>
                  {passwordStrength.feedback[0]}
                </Typography>
              )}
            </Box>
          )}

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span>🔒</span>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    <span>{showConfirmPassword ? '🙈' : '👁️'}</span>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            autoComplete="new-password"
            disabled={loading}
          />

          {/* Security Tips */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              💡 Password Security Tips:
            </Typography>
            <Typography variant="caption" component="div">
              • Use at least 8 characters
            </Typography>
            <Typography variant="caption" component="div">
              • Include uppercase and lowercase letters
            </Typography>
            <Typography variant="caption" component="div">
              • Add numbers and special characters
            </Typography>
            <Typography variant="caption" component="div">
              • Avoid common words or personal information
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <span>🔒</span>}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordModal; 