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
        throw new Error(data.message || 'Failed to verify email');
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
        throw new Error(data.message || 'Failed to resend verification email');
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
   * Check if email domain is commonly used (basic check)
   * @param {string} email - Email to check
   * @returns {boolean} True if domain appears to be legitimate
   */
  isCommonEmailDomain: (email) => {
    if (!emailApi.isValidEmail(email)) return false;

    const domain = email.split('@')[1].toLowerCase();
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'icloud.com', 'aol.com', 'live.com', 'msn.com',
      'protonmail.com', 'zoho.com', 'mail.com'
    ];

    return commonDomains.includes(domain) || domain.includes('.edu') || domain.includes('.org');
  },

  /**
   * Extract verification token from URL (for verification page)
   * @param {string} url - URL containing the token parameter
   * @returns {string|null} Token if found, null otherwise
   */
  extractTokenFromUrl: (url = window.location.href) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('token');
    } catch (error) {
      console.error('Error extracting token from URL:', error);
      return null;
    }
  },

  /**
   * Check if verification is required based on backend response
   * @param {Object} errorResponse - Error response from API
   * @returns {boolean} True if error indicates email verification needed
   */
  isVerificationRequired: (errorResponse) => {
    const message = errorResponse?.message?.toLowerCase() || '';
    return message.includes('verify') || 
           message.includes('verification') || 
           message.includes('not verified') ||
           errorResponse?.code === 'EMAIL_NOT_VERIFIED';
  },
}; 