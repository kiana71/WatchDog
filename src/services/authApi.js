// Core authentication API service
import { authUtils } from './authUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://signcast-watchdog-91d66c3ccf16.herokuapp.com/api';

export const authApi = {
  /**
   * User signup - creates new user account
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.username - Username
   * @returns {Promise<Object>} Signup response
   */
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create account');
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  /**
   * User login - authenticates user and returns JWT token
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with token and user data
   */
  login: async (credentials) => {
    try {
      console.log('🔐 authApi.login: Starting login request');
      console.log('📧 authApi.login: Email:', credentials.email);
      console.log('🌐 authApi.login: API URL:', `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📥 authApi.login: Response status:', response.status);
      console.log('📥 authApi.login: Response ok:', response.ok);

      const data = await response.json();
      console.log('📋 authApi.login: Response data:', data);

      if (!response.ok) {
        console.log('❌ authApi.login: Request failed with error:', data.error || data.message);
        throw new Error(data.error || data.message || 'Failed to login');
      }

      console.log('✅ authApi.login: Login successful');
      console.log('🔑 authApi.login: Token received:', !!data.token);
      console.log('👤 authApi.login: User received:', !!data.user);

      // Store token and user data using utility function
      if (data.token) {
        console.log('💾 authApi.login: Storing token and user data');
        authUtils.setToken(data.token);
        authUtils.setUser(data.user);
        console.log('✅ authApi.login: Data stored successfully');
      }

      return data;
    } catch (error) {
      console.error('💥 authApi.login: Error occurred:', error.message);
      console.error('💥 authApi.login: Full error:', error);
      throw error;
    }
  },

  /**
   * User logout - clears stored authentication data
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Get token before clearing it
      const token = authUtils.getToken();
      
      // Clear local storage first
      authUtils.clearAuthData();

      // Optional: Call backend logout endpoint for server-side cleanup
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure local storage is cleared even if server call fails
      authUtils.clearAuthData();
    }
  },

  /**
   * Check if user is currently authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated: () => {
    return authUtils.isAuthenticated();
  },

  /**
   * Get current user data
   * @returns {Object|null} User data object or null if not found
   */
  getCurrentUser: () => {
    return authUtils.getUser();
  },

  /**
   * Get authentication headers for API requests
   * @returns {Object} Headers object with Authorization header
   */
  getAuthHeaders: () => {
    return authUtils.getAuthHeaders();
  },
}; 