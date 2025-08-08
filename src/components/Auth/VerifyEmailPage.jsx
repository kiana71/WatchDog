import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Logo from '../img/SignCast Master Logo on dark_Medium.png';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setAlert({
        show: true,
        message: 'Invalid verification link. No token provided.',
        type: 'error'
      });
      setVerificationStatus('error');
      setLoading(false);
      return;
    }

    handleVerification(token);
  }, [searchParams]);

  const handleVerification = async (token) => {
    try {
      setLoading(true);
      setAlert({
        show: true,
        message: 'Verifying your email address...',
        type: 'info'
      });

      const result = await verifyEmail(token);

      if (result.success) {
        setAlert({
          show: true,
          message: 'Email verified successfully! You can now log in with your credentials.',
          type: 'success'
        });
        setVerificationStatus('success');
        
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              verificationSuccess: true,
              message: 'Email verified successfully! You can now log in.'
            }
          });
        }, 3000);
      } else {
        setAlert({
          show: true,
          message: result.error || 'Email verification failed. Please try again or contact support.',
          type: 'error'
        });
        setVerificationStatus('error');
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'An unexpected error occurred. Please try again later.',
        type: 'error'
      });
      setVerificationStatus('error');
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
          maxWidth: 500,
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
          <img className='w-40 m-auto' src={Logo}/>
            <Typography variant="h6" gutterBottom>
              Email Verification
            </Typography>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Verifying your email address...
              </Typography>
            </Box>
          )}

          {/* Alert Messages */}
          {alert.show && (
            <Alert 
              severity={alert.type} 
              sx={{ mb: 3 }}
              onClose={() => setAlert({ show: false, message: '', type: 'info' })}
            >
              {alert.message}
            </Alert>
          )}

          {/* Success State */}
          {!loading && verificationStatus === 'success' && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'success.main' }}>
                ✅ Verification Complete!
              </Typography>
              <Typography variant="body1" paragraph>
                Your email has been successfully verified. You can now log in to your WatchDog account and change your password if you want.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Redirecting to login page in a few seconds...
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/login"
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </Box>
          )}

          {/* Error State */}
          {!loading && verificationStatus === 'error' && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'error.main' }}>
                ❌ Verification Failed
              </Typography>
              <Typography variant="body1" paragraph>
                We couldn't verify your email address. This could be because:
              </Typography>
              <Box component="ul" sx={{ textAlign: 'left', mb: 3, pl: 2 }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  The verification link has expired
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  The link has already been used
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  The token is invalid or corrupted
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/signup"
                >
                  Create New Account
                </Button>
                <Button
                  variant="text"
                  component={Link}
                  to="/login"
                >
                  Try to Login Anyway
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyEmailPage; 