import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
//   Email,
//   Monitor,
//   ArrowBack,
// } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { emailApi } from '../../services/emailApi';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [emailSent, setEmailSent] = useState(false);

  // Disable highlight/focus border and make text white (including autofill), keep bg transparent
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
    // Make input text and caret white
    '& .MuiInputBase-input': {
      color: '#fff',
      caretColor: '#fff',
      backgroundColor: 'transparent',
    },
    // Also force native input background transparent
    '& input': {
      backgroundColor: 'transparent !important',
    },
    // Placeholder color
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
    // Autofill handling
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

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  // Validate email
  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    
    if (!emailApi.isValidEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return false;
    }

    setErrors({});
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: '', type: 'error' });

    if (!validateEmail()) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await forgotPassword(email);

      if (result.success) {
        setEmailSent(true);
        setAlert({
          show: true,
          message: result.message || 'Password reset email sent! Please check your inbox.',
          type: 'success'
        });
      } else {
        setAlert({
          show: true,
          message: result.error || 'Failed to send reset email. Please try again.',
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
            <Typography variant="h3" sx={{ mb: 2 }}>🐕</Typography>
            <Typography variant="h4" component="h1" gutterBottom>
              WatchDog
            </Typography>
            <Typography variant="h6" gutterBottom>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {emailSent 
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive reset instructions'
              }
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

          {!emailSent ? (
            /* Reset Form */
            <Box component="form" onSubmit={handleSubmit}>
              {/* Email Field */}
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                sx={noHighlightSx}
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

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Reset Email'}
              </Button>

              <Divider sx={{ my: 2 }} />

              {/* Back to Login Link */}
              <Box sx={{ textAlign: 'center' }}>
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
          ) : (
            /* Success State */
            <Box>
              <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 3 }}>
                We've sent password reset instructions to:
              </Typography>
              
              <Box 
                sx={{ 
                  bgcolor: 'action.hover', 
                  p: 2, 
                  borderRadius: 1, 
                  mb: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {email}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                Please check your email and follow the instructions to reset your password. 
                The reset link will expire in 1 hour for security reasons.
              </Typography>

              <Typography variant="body2" color="text.secondary" paragraph>
                Didn't receive the email? Check your spam folder or try again with a different email address.
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                    setAlert({ show: false, message: '', type: 'error' });
                  }}
                >
                  Try Different Email
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  component={Link}
                  to="/login"
                  startIcon={<span>←</span>}
                >
                  Back to Sign In
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage; 