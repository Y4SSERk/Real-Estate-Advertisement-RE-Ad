import React from 'react';
import { Link } from 'react-router-dom';
import './styles/ErrorMessage.css';

/**
 * ErrorMessage component for displaying error states
 * @param {string} message - The error message to display
 * @param {string} linkTo - Optional path to link back to
 * @param {string} linkText - Optional text for the link button
 * @returns {JSX.Element} - An error message component
 */
const ErrorMessage = ({ message, linkTo, linkText }) => {
  return (
    <div className="error-message">
      <i className="fas fa-exclamation-circle"></i>
      <p>{message}</p>
      {linkTo && (
        <Link to={linkTo} className="btn btn-primary">
          {linkText || 'Go Back'}
        </Link>
      )}
    </div>
  );
};

export default ErrorMessage;
