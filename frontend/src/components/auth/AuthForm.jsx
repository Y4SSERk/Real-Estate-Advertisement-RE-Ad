import React from 'react';
import { Link } from 'react-router-dom';
import './styles/AuthForm.css';

/**
 * AuthForm component for login and registration forms
 * @param {Object} props - Component props
 * @param {string} props.title - Form title
 * @param {string} props.buttonText - Submit button text
 * @param {Function} props.onSubmit - Form submit handler
 * @param {Array} props.fields - Array of field objects with name, type, label, etc.
 * @param {string} props.error - Error message to display
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.redirectText - Text for the redirect link
 * @param {string} props.redirectLink - Path for the redirect link
 * @param {string} props.redirectLinkText - Text for the redirect link
 * @returns {JSX.Element} - A form component for authentication
 */
const AuthForm = ({
  title,
  buttonText,
  onSubmit,
  fields,
  error,
  isLoading,
  redirectText,
  redirectLink,
  redirectLinkText
}) => {
  return (
    <div className="auth-form-container">
      <div className="auth-form-wrapper">
        <h2>{title}</h2>
        
        {error && (
          <div className="auth-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={onSubmit} className="auth-form">
          {fields.map((field, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={field.name}>{field.label}</label>
              <div className="input-group">
                {field.icon && <i className={`fas ${field.icon}`}></i>}
                <input
                  type={field.type || 'text'}
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  required={field.required !== false}
                  autoComplete={field.autoComplete}
                />
              </div>
              {field.error && <div className="field-error">{field.error}</div>}
            </div>
          ))}
          
          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              buttonText
            )}
          </button>
        </form>
        
        <div className="auth-redirect">
          <p>
            {redirectText} <Link to={redirectLink}>{redirectLinkText}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
