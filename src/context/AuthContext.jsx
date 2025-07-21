import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { authUtils } from '../services/authUtils';
import { passwordApi } from '../services/passwordApi';
import { emailApi } from '../services/emailApi';

// Create the authentication context
const AuthContext = createContext({
  // Authentication state
  user: null,
  isAuthenticated: false,
  loading: true,
  
  // Authentication methods
  login: () => {},
  logout: () => {},
  signup: () => {},
  
  // Password management
  changePassword: () => {},
  forgotPassword: () => {},
  
  // Email verification
  verifyEmail: () => {},
  
  // Utility methods
  refreshAuth: () => {},
});

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state on app startup
  useEffect(() => {
    initializeAuth();
  }, []);

  // Set up token expiration checking
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        // Check if token is expiring soon (within 5 minutes)
        if (authUtils.isTokenExpiringSoon(5)) {
          console.warn('Token expiring soon. Consider implementing refresh token logic.');
        }
        
        // Check if token is expired
        if (!authUtils.isAuthenticated()) {
          console.log('Token expired, logging out user');
          handleLogout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  /**
   * Initialize authentication state from stored token
   */
  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check if user has valid stored authentication
      if (authUtils.isAuthenticated()) {
        const userData = authUtils.getUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data, clear everything
          authUtils.clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      authUtils.clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login result
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      const response = await authApi.login(credentials);
      
      if (response.token && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, data: response };
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed',
        needsVerification: emailApi.isVerificationRequired(error)
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * User signup
   * @param {Object} userData - Registration data
   * @param {string} userData.email - User email
   * @param {string} userData.username - Username
   * @returns {Promise<Object>} Signup result
   */
  const signup = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authApi.signup(userData);
      
      return { 
        success: true, 
        data: response,
        message: 'Account created successfully! Please check your email for verification instructions.'
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Signup failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * User logout
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  };

  /**
   * Handle logout state cleanup
   */
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authUtils.clearAuthData();
  };

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Change password result
   */
  const changePassword = async (passwordData) => {
    try {
      const response = await passwordApi.changePassword(passwordData);
      return { 
        success: true, 
        data: response,
        message: 'Password changed successfully!'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to change password' 
      };
    }
  };

  /**
   * Request password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Forgot password result
   */
  const forgotPassword = async (email) => {
    try {
      const response = await passwordApi.forgotPassword(email);
      return { 
        success: true, 
        data: response,
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send reset email' 
      };
    }
  };

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Verification result
   */
  const verifyEmail = async (token) => {
    try {
      const response = await emailApi.verifyEmail(token);
      
      // If verification includes user data, update the current user
      if (response.user) {
        setUser(response.user);
        authUtils.setUser(response.user);
      }
      
      return { 
        success: true, 
        data: response,
        message: 'Email verified successfully!'
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return { 
        success: false, 
        error: error.message || 'Email verification failed' 
      };
    }
  };

  /**
   * Refresh authentication state
   */
  const refreshAuth = async () => {
    await initializeAuth();
  };

  /**
   * Get current authentication status and user info
   * @returns {Object} Current auth state
   */
  const getAuthState = () => ({
    user,
    isAuthenticated,
    loading,
    token: authUtils.getToken(),
    tokenExpiration: authUtils.getTokenExpiration(),
    isTokenExpiringSoon: authUtils.isTokenExpiringSoon(),
  });

  // Context value
  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    
    // Methods
    login,
    logout,
    signup,
    changePassword,
    forgotPassword,
    verifyEmail,
    refreshAuth,
    getAuthState,
    
    // Utility access
    authUtils,
    passwordApi,
    emailApi,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 