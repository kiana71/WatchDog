import React from 'react';
import Toast from './Toast';

/**
 * Container component for managing multiple toast notifications
 */
const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => onRemoveToast(toast.id)}
          duration={0} // Let the container manage the duration
        />
      ))}
    </div>
  );
};

export default ToastContainer; 