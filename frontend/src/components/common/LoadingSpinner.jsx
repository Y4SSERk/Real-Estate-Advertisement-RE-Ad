import React from 'react';
import './styles/LoadingSpinner.css';

/**
 * LoadingSpinner component for displaying a loading state
 * @param {string} message - Optional message to display with the spinner
 * @returns {JSX.Element} - A loading spinner component
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <i className="fas fa-spinner fa-spin"></i>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
