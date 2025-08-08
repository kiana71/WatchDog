import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
} from '@mui/material';
// Temporarily removed @mui/icons-material imports
// import {
//   Visibility,
//   VisibilityOff,
//   Email,
//   Lock,
//   Monitor,
// } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { emailApi } from '../../services/emailApi';
import Logo from '../img/SignCast Master Logo on dark_Medium.png';
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  // Get the intended destination (from ProtectedRoute redirect)
  const from = location.state?.from?.pathname || '/dashboard';

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });

  // Check if user came from successful email verification or password reset
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const resetStatus = urlParams.get('reset');
    
    if (location.state?.verificationSuccess) {
      setAlert({
        show: true,
        message: location.state.message || 'Email verified successfully! You can now log in.',
        type: 'success'
      });
      
      // Clear the state to prevent showing message again on refresh
      window.history.replaceState({}, document.title);
    } else if (location.state?.passwordResetSuccess) {
      setAlert({
        show: true,
        message: location.state.message || 'Password reset successful! You can now log in with your new password.',
        type: 'success'
      });
      
      // Clear the state to prevent showing message again on refresh
      window.history.replaceState({}, document.title);
    } else if (resetStatus === 'success') {
      setAlert({
        show: true,
        message: 'Password reset successful! Please check your email for your new password.',
        type: 'success'
      });
      
      // Clear the URL parameter
      window.history.replaceState({}, document.title, location.pathname);
    } else if (resetStatus === 'error') {
      setAlert({
        show: true,
        message: 'Password reset failed. The reset link may have expired. Please try again.',
        type: 'error'
      });
      
      // Clear the URL parameter
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state, location.search]);

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
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailApi.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const result = await login(formData);

      if (result.success) {
        setAlert({
          show: true,
          message: 'Login successful! Redirecting...',
          type: 'success'
        });
        
        // Redirect to intended destination or dashboard
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        if (result.needsVerification) {
          setAlert({
            show: true,
            message: 'Please verify your email address before logging in. Check your inbox for verification instructions.',
            type: 'warning'
          });
        } else {
          setAlert({
            show: true,
            message: result.error || 'Login failed. Please check your credentials.',
            type: 'error'
          });
        }
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'An unexpected error occurred. Please try again.',
        type: 'error'
      });
    }
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
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
          <img className='w-36 m-auto' src={Logo}/>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
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

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span>📧</span>
                  </InputAdornment>
                ),
              }}
              autoComplete="email"
              autoFocus
            />

            {/* Password Field */}
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
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
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <span>{showPassword ? '🙈' : '👁️'}</span>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              autoComplete="current-password"
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none' 
                }}
              >
                <Typography variant="body2" color="primary">
                  Forgot your password?
                </Typography>
              </Link>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/signupp" 
                  style={{ 
                    color: 'inherit', 
                    textDecoration: 'none' 
                  }}
                >
                  <Typography 
                    component="span" 
                    variant="body2" 
                    color="primary"
                    sx={{ fontWeight: 'medium' }}
                  >
                    Sign up
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage; 