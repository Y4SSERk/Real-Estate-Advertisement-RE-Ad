import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would send this data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit the form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for any inquiries or assistance</p>
        </div>

        <div className="contact-container">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Our Contact Information</h2>
            <div className="contact-info-container">
              <div className="contact-info-item">
                <div className="icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="details">
                  <h3>Address</h3>
                  <p>123 Real Estate Avenue</p>
                  <p>Casablanca, Morocco</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="details">
                  <h3>Phone</h3>
                  <p>+212 522 123 456</p>
                  <p>+212 661 789 012</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="details">
                  <h3>Email</h3>
                  <p>info@realestate.ma</p>
                  <p>support@realestate.ma</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="details">
                  <h3>Working Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="social-media">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            {submitted ? (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="contact-form-container">
                {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name*</label>
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
                    
                    <div className="form-group">
                      <label htmlFor="email">Email*</label>
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
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject">Subject*</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Message subject"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message*</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Type your message here..."
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        
        {/* Map Section */}
        <div className="map-section">
          <h2>Find Us on the Map</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.72692390436!2d-7.669386687426657!3d33.57240299168905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Office Location"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-container">
            <div className="faq-item">
              <h3>How do I schedule a property viewing?</h3>
              <p>You can schedule a property viewing by contacting us through this form, calling our office, or using the contact form on any specific property listing page.</p>
            </div>
            
            <div className="faq-item">
              <h3>What documents do I need to rent a property?</h3>
              <p>Typically, you'll need identification documents, proof of income, employment verification, and references from previous landlords.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you handle property management?</h3>
              <p>Yes, we offer comprehensive property management services including tenant screening, rent collection, maintenance coordination, and regular inspections.</p>
            </div>
            
            <div className="faq-item">
              <h3>How long does the buying process take?</h3>
              <p>The buying process typically takes 30-90 days from offer acceptance to closing, depending on financing, inspections, and other factors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
