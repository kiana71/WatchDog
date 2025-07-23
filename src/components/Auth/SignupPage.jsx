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
  IconButton,
  Divider,
  LinearProgress,
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
import { passwordApi } from '../../services/passwordApi';
import Logo from '../img/SignCast Master Logo on dark_Medium.png'
const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Update password strength for password field
    if (name === 'password') {
      const strength = passwordApi.validatePasswordStrength(value);
      setPasswordStrength(strength);
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

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const strength = passwordApi.validatePasswordStrength(formData.password);
      if (!strength.isValid) {
        newErrors.password = strength.feedback[0] || 'Password is too weak';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!passwordApi.passwordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
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
          message: result.message || 'Account created successfully! Please check your email for verification instructions.',
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
              autoComplete="new-password"
            />

            {/* Password Strength Indicator */}
            {formData.password && (
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
              label="Confirm Password"
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