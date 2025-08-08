import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Divider,
} from '@mui/material';
// Temporarily removed @mui/icons-material imports
// import {
//   Visibility,
//   VisibilityOff,
//   Email,
//   Lock,
//   Person,jj
//   Monitor,
// } from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { emailApi } from '../../services/emailApi';
import Logo from '../img/SignCast Master Logo on dark_Medium.png'
const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });

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

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailApi.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      const result = await signup({
        username: formData.username,
        email: formData.email,
      });

      if (result.success) {
        setAlert({
          show: true,
          message: result.message || 'Account created successfully! Please check your email for verification instructions and your password.',
          type: 'success'
        });
        
        // Redirect to login after successful signup
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setAlert({
          show: true,
          message: result.error || 'Signup failed. Please try again.',
          type: 'error'
        });
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
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
              We'll send you a secure password via email
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

          {/* Signup Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Username Field */}
            <TextField
              fullWidth
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span>👤</span>
                  </InputAdornment>
                ),
              }}
              autoComplete="username"
              autoFocus
            />

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
            />

            {/* Signup Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Divider sx={{ my: 2 }} />

            {/* Sign In Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  to="/login" 
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
                    Sign in
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

export default SignupPage;