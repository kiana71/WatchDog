import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { passwordApi } from '../../services/passwordApi';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get token from URL
  const token = searchParams.get('token');

  // Form state
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // UI state
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  // Disable highlight/focus border, keep bg transparent, and make input text white
  const noHighlightSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'transparent',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'divider',
      },
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'divider',
      },
      '&.Mui-focused': {
        backgroundColor: 'transparent',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'divider',
      },
    },
    '& .MuiInputBase-input': {
      color: '#fff',
      caretColor: '#fff',
      backgroundColor: 'transparent',
    },
    '& input': {
      backgroundColor: 'transparent !important',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(255,255,255,0.6)',
      opacity: 1,
    },
    '& .MuiInputBase-input::-webkit-input-placeholder': {
      color: 'rgba(255,255,255,0.6)',
      opacity: 1,
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'text.secondary',
    },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px transparent inset',
      boxShadow: '0 0 0 1000px transparent inset',
      WebkitTextFillColor: '#fff',
      transition: 'background-color 5000s ease-in-out 0s',
      backgroundColor: 'transparent !important',
    },
    '& input:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 1000px transparent inset',
      boxShadow: '0 0 0 1000px transparent inset',
      WebkitTextFillColor: '#fff',
      transition: 'background-color 5000s ease-in-out 0s',
      backgroundColor: 'transparent !important',
    },
    '& input:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 1000px transparent inset',
      boxShadow: '0 0 0 1000px transparent inset',
      WebkitTextFillColor: '#fff',
      transition: 'background-color 5000s ease-in-out 0s',
      backgroundColor: 'transparent !important',
    },
  };

  // Check if token is present
  useEffect(() => {
    if (!token) {
      setAlert({
        show: true,
        message: 'Invalid or missing reset token. Please request a new password reset.',
        type: 'error'
      });
    }
  }, [token]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: '', type: 'error' });

    if (!token) {
      setAlert({
        show: true,
        message: 'Invalid reset token. Please request a new password reset.',
        type: 'error'
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const result = await passwordApi.resetPasswordWithNew(token, formData.newPassword);

      if (result.success) {
        setAlert({
          show: true,
          message: 'Password reset successful! Redirecting to login...',
          type: 'success'
        });

        // Redirect to login after success
        setTimeout(() => {
          navigate('/login', {
            state: {
              passwordResetSuccess: true,
              message: 'Password reset successful! You can now log in with your new password.'
            }
          });
        }, 2000);
      } else {
        setAlert({
          show: true,
          message: result.error || 'Failed to reset password. The link may have expired.',
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

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return 'error';
    if (passwordStrength.score <= 2) return 'warning';
    if (passwordStrength.score <= 3) return 'info';
    return 'success';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>🐕</Typography>
            <Typography variant="h4" component="h1" gutterBottom>
              WatchDog
            </Typography>
            <Typography variant="h6" gutterBottom>
              Set New Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a new password for your account
            </Typography>
          </Box>

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

          {/* Reset Password Form */}
          <Box component="form" onSubmit={handleSubmit}>
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
              sx={noHighlightSx}
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
              inputProps={{
                style: {
                  backgroundColor: 'transparent',
                  WebkitBoxShadow: '0 0 0 1000px transparent inset',
                  boxShadow: '0 0 0 1000px transparent inset',
                  WebkitTextFillColor: '#fff',
                  color: '#fff',
                  caretColor: '#fff',
                },
              }}
              autoComplete="new-password"
              disabled={loading || !token}
              autoFocus
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
              sx={noHighlightSx}
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
              inputProps={{
                style: {
                  backgroundColor: 'transparent',
                  WebkitBoxShadow: '0 0 0 1000px transparent inset',
                  boxShadow: '0 0 0 1000px transparent inset',
                  WebkitTextFillColor: '#fff',
                  color: '#fff',
                  caretColor: '#fff',
                },
              }}
              autoComplete="new-password"
              disabled={loading || !token}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !token}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>

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

            {/* Back to Login Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link 
                to="/login" 
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>←</span>
                <Typography variant="body2" color="primary">
                  Back to Sign In
                </Typography>
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPasswordPage; 