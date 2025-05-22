import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

/**
 * A reusable component for in-place editing of text values
 * @param {Object} props - Component props
 * @param {string} props.value - The current value to display/edit
 * @param {function} props.onSave - Function to call with new value when saving
 * @param {string} props.className - Additional classes for the container
 * @param {Object} props.inputProps - Additional props for the input element
 * @param {React.ReactNode} props.displayComponent - Custom component to display value (optional)
 */
const EditableField = ({
  value,
  onSave,
  className = '',
  inputProps = {},
  displayComponent = null,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setEditedValue(value || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedValue.trim() === '') return;

    try {
      setIsSaving(true);
      await onSave(editedValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save value:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValue(value || '');
  };

  if (isEditing) {
    // Determine if we should render a textarea or input
    const { as, ...restInputProps } = inputProps;
    const InputComponent = as === 'textarea' ? 'textarea' : 'input';
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <InputComponent 
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          disabled={isSaving}
          {...restInputProps}
        />
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50"
        >
          <Check size={16} className="text-green-600 dark:text-green-400"/>
        </button>
        <button 
          onClick={handleCancel}
          disabled={isSaving}
          className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50"
        >
          <X size={16} className="text-red-600 dark:text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {displayComponent || (
        <span className="text-gray-900 dark:text-white">
          {value || 'N/A'}
        </span>
      )}
      <button 
        onClick={handleEditClick}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Edit2 size={14} className="text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
};

export default EditableField; 