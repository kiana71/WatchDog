// Authentication utility functions for token management and validation

export const authUtils = {
  /**
   * Store authentication token in localStorage
   * @param {string} token - JWT token to store
   */
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Store user data in localStorage
   * @param {Object} user - User data object to store
   */
  setUser: (user) => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  /**
   * Get stored authentication token
   * @returns {string|null} JWT token or null if not found
   */
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  /**
   * Get stored user data
   * @returns {Object|null} User data object or null if not found
   */
  getUser: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Clear all authentication data from localStorage
   */
  clearAuthData: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  /**
   * Check if user is authenticated by validating token
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated: () => {
    const token = authUtils.getToken();
    if (!token) return false;

    try {
      // Decode JWT to check expiration (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        // Token expired, clear storage
        authUtils.clearAuthData();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      authUtils.clearAuthData();
      return false;
    }
  },

  /**
   * Get authorization headers for API requests
   * @returns {Object} Headers object with Authorization header
   */
  getAuthHeaders: () => {
    const token = authUtils.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  /**
   * Decode JWT token payload (without verification)
   * @param {string} token - JWT token to decode
   * @returns {Object|null} Decoded payload or null if invalid
   */
  decodeToken: (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  },

  /**
   * Get token expiration time
   * @returns {Date|null} Expiration date or null if no token/invalid
   */
  getTokenExpiration: () => {
    const token = authUtils.getToken();
    if (!token) return null;

    const payload = authUtils.decodeToken(token);
    return payload?.exp ? new Date(payload.exp * 1000) : null;
  },

  /**
   * Check if token will expire within specified minutes
   * @param {number} minutes - Minutes to check ahead (default: 5)
   * @returns {boolean} True if token expires soon
   */
  isTokenExpiringSoon: (minutes = 5) => {
    const expiration = authUtils.getTokenExpiration();
    if (!expiration) return false;

    const warningTime = new Date(Date.now() + (minutes * 60 * 1000));
    return expiration <= warningTime;
  },
}; 