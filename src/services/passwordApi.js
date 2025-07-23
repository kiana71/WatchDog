// Password management API service

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://signcast-watchdog-91d66c3ccf16.herokuapp.com/api';

export const passwordApi = {
  /**
   * Request password reset email
   * @param {string} email - User email address
   * @returns {Promise<Object>} Password reset response
   */
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to send reset email');
      }

      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Change user password (requires authentication)
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Password change response
   */
  changePassword: async (passwordData) => {
    try {
      // Import authUtils dynamically to avoid circular dependency
      const { authUtils } = await import('./authUtils');
      const headers = {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      };

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to change password');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Reset password using token from email
   * @param {string} token - Reset token from email
   * @returns {Promise<Object>} Password reset response
   */
  resetPassword: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password?token=${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to reset password');
      }

      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Reset password with user-chosen new password
   * @param {string} token - Reset token from email
   * @param {string} newPassword - User's chosen new password
   * @returns {Promise<Object>} Password reset response
   */
  resetPasswordWithNew: async (token, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to reset password');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Reset password with new error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with score and feedback
   */
  validatePasswordStrength: (password) => {
    const result = {
      score: 0,
      feedback: [],
      isValid: false,
    };

    if (!password) {
      result.feedback.push('Password is required');
      return result;
    }

    // Length check
    if (password.length >= 8) {
      result.score += 1;
    } else {
      result.feedback.push('Password must be at least 8 characters long');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Password must contain at least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Password must contain at least one lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Password must contain at least one number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Password must contain at least one special character');
    }

    // Determine if password is valid (score 3+ is acceptable)
    result.isValid = result.score >= 3;

    if (result.isValid && result.feedback.length === 0) {
      result.feedback.push('Password strength is good');
    }

    return result;
  },

  /**
   * Check if passwords match
   * @param {string} password - Original password
   * @param {string} confirmPassword - Confirmation password
   * @returns {boolean} True if passwords match
   */
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },
};