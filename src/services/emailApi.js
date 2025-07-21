// Email verification and management API service

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://signcast-watchdog-91d66c3ccf16.herokuapp.com/api';

export const emailApi = {
  /**
   * Verify email with token (called from email link)
   * @param {string} token - Verification token from email
   * @returns {Promise<Object>} Verification response
   */
  verifyEmail: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to verify email');
      }

      return data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  /**
   * Resend verification email (if needed in the future)
   * Note: This endpoint would need to be implemented in the backend
   * @param {string} email - User email to resend verification to
   * @returns {Promise<Object>} Resend response
   */
  resendVerificationEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to resend verification email');
      }

      return data;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if email format is valid
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Check if email domain is from a common provider
   * @param {string} email - Email to check
   * @returns {boolean} True if from common domain
   */
  isCommonEmailDomain: (email) => {
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'icloud.com', 'aol.com', 'protonmail.com'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return commonDomains.includes(domain);
  },

  /**
   * Extract token from URL parameters
   * @param {string} url - URL to extract token from
   * @returns {string|null} Extracted token or null
   */
  extractTokenFromUrl: (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('token');
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  },

  /**
   * Check if error indicates verification is required
   * @param {Error} error - Error object to check
   * @returns {boolean} True if verification required
   */
  isVerificationRequired: (error) => {
    const message = error?.message?.toLowerCase() || '';
    return message.includes('verify') || 
           message.includes('verification') ||
           message.includes('email before logging');
  }
}; 