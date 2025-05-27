import React, { useState } from 'react';
import './styles/ContactForm.css';

/**
 * ContactForm component for property inquiries and general contact
 * @param {Object} props - Component props
 * @param {string} props.title - Form title
 * @param {string} props.subtitle - Form subtitle or description
 * @param {Function} props.onSubmit - Form submit handler
 * @param {Object} props.propertyInfo - Optional property information for inquiries
 * @returns {JSX.Element} - A contact form component
 */
const ContactForm = ({ title, subtitle, onSubmit, propertyInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: propertyInfo ? `I am interested in ${propertyInfo.title}` : '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');
    
    try {
      await onSubmit(formData);
      setFormSuccess('Your message has been sent successfully. We will get back to you soon!');
      // Reset form if successful
      if (!propertyInfo) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setFormData(prev => ({
          ...prev,
          message: `I am interested in ${propertyInfo.title}`
        }));
      }
    } catch (error) {
      setFormError(error.message || 'Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form-header">
        <h3>{title || 'Contact Us'}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      
      {formSuccess && (
        <div className="form-success">
          <i className="fas fa-check-circle"></i>
          <p>{formSuccess}</p>
        </div>
      )}
      
      {formError && (
        <div className="form-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{formError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div className="input-group">
            <i className="fas fa-phone"></i>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <div className="input-group">
            <i className="fas fa-comment-alt"></i>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              rows="4"
              required
            ></textarea>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Sending...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i> Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
