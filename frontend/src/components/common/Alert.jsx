import React, { useState, useEffect } from 'react';
import './styles/Alert.css';

/**
 * Alert component for displaying notifications and messages
 * @param {string} type - The type of alert (success, error, warning, info)
 * @param {string} message - The message to display
 * @param {boolean} dismissible - Whether the alert can be dismissed
 * @param {number} autoHideDuration - Duration in ms after which the alert will auto-hide (0 to disable)
 * @param {Function} onClose - Function to call when the alert is closed
 * @returns {JSX.Element} - An alert component
 */
const Alert = ({ 
  type = 'info', 
  message, 
  dismissible = true, 
  autoHideDuration = 0,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide the alert after specified duration
  useEffect(() => {
    if (autoHideDuration > 0 && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, isVisible]);

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // If not visible, don't render
  if (!isVisible) return null;

  // Get the appropriate icon based on alert type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
      default:
        return 'fa-info-circle';
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <i className={`fas ${getIcon()}`}></i>
        <p>{message}</p>
      </div>
      
      {dismissible && (
        <button className="alert-close" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default Alert;
