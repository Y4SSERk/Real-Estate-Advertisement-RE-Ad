import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}/`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Property not found');
          } else {
            throw new Error('Failed to fetch property details');
          }
        }
        
        const data = await response.json();
        setProperty(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    try {
      // In a real app, you would send this data to your backend
      // const response = await fetch('http://127.0.0.1:8000/api/inquiries/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     property_id: id,
      //     ...contactFormData
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit inquiry');
      // }
      
      // For demo purposes, we'll just simulate a successful submission
      setFormSubmitted(true);
      setFormError(null);
      setContactFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Reset form submission status after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setFormError('Failed to submit your inquiry. Please try again later.');
    }
  };

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <Link to="/properties" className="btn btn-primary">Back to Properties</Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>Property not found.</p>
          <Link to="/properties" className="btn btn-primary">Back to Properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="property-details-page">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / 
          <Link to="/properties">Properties</Link> / 
          <span>{property.title}</span>
        </div>
        
        {/* Property Header */}
        <div className="property-header">
          <div className="property-title">
            <h1>{property.title}</h1>
            <p className="property-address">
              <i className="fas fa-map-marker-alt"></i> {property.city}, {property.address}
            </p>
          </div>
          <div className="property-price">
            <h2>{formatPrice(property.price)}</h2>
            <span className="property-status">{property.status.replace('_', ' ')}</span>
          </div>
        </div>
        
        {/* Property Gallery */}
        <div className="property-gallery">
          <div className="main-image">
            {property.images && property.images.length > 0 ? (
              <img 
                src={property.images[activeImage].image} 
                alt={`${property.title} - Image ${activeImage + 1}`} 
              />
            ) : (
              <img 
                src="https://via.placeholder.com/800x500?text=No+Image+Available" 
                alt="No image available" 
              />
            )}
          </div>
          
          {property.images && property.images.length > 1 && (
            <div className="thumbnail-gallery">
              {property.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image.image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="property-content">
          {/* Property Details */}
          <div className="property-main">
            {/* Features */}
            <div className="property-features">
              <div className="feature">
                <i className="fas fa-ruler-combined"></i>
                <span>{property.surface_area} m²</span>
                <p>Surface Area</p>
              </div>
              <div className="feature">
                <i className="fas fa-bed"></i>
                <span>{property.bedrooms}</span>
                <p>Bedrooms</p>
              </div>
              <div className="feature">
                <i className="fas fa-bath"></i>
                <span>{property.bathrooms}</span>
                <p>Bathrooms</p>
              </div>
              <div className="feature">
                <i className="fas fa-warehouse"></i>
                <span>{property.property_type}</span>
                <p>Property Type</p>
              </div>
              <div className="feature">
                <i className="fas fa-calendar-alt"></i>
                <span>{new Date(property.created_at).getFullYear()}</span>
                <p>Year Built</p>
              </div>
            </div>
            
            {/* Description */}
            <div className="property-description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>
            
            {/* Amenities */}
            <div className="property-amenities">
              <h3>Amenities</h3>
              <ul className="amenities-list">
                {property.has_parking && (
                  <li><i className="fas fa-parking"></i> Parking</li>
                )}
                {property.has_garden && (
                  <li><i className="fas fa-leaf"></i> Garden</li>
                )}
                {property.has_pool && (
                  <li><i className="fas fa-swimming-pool"></i> Swimming Pool</li>
                )}
                {property.has_balcony && (
                  <li><i className="fas fa-door-open"></i> Balcony</li>
                )}
                {property.has_garage && (
                  <li><i className="fas fa-warehouse"></i> Garage</li>
                )}
                {property.has_elevator && (
                  <li><i className="fas fa-arrow-alt-circle-up"></i> Elevator</li>
                )}
                {property.has_security && (
                  <li><i className="fas fa-shield-alt"></i> Security</li>
                )}
                {property.has_air_conditioning && (
                  <li><i className="fas fa-snowflake"></i> Air Conditioning</li>
                )}
                {property.has_heating && (
                  <li><i className="fas fa-temperature-high"></i> Heating</li>
                )}
                {property.has_furnished && (
                  <li><i className="fas fa-couch"></i> Furnished</li>
                )}
              </ul>
            </div>
            
            {/* Location */}
            <div className="property-location">
              <h3>Location</h3>
              <div className="map-placeholder">
                <img 
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${property.city},Morocco&zoom=14&size=600x300&key=YOUR_API_KEY`} 
                  alt="Property location map" 
                />
                <p className="map-notice">For demonstration purposes only. Replace with actual Google Maps API in production.</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="property-sidebar">
            <div className="contact-form-card">
              <h3>Interested in this property?</h3>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              
              {formSubmitted ? (
                <div className="form-success">
                  <i className="fas fa-check-circle"></i>
                  <p>Thank you! Your inquiry has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  {formError && (
                    <div className="form-error">
                      <i className="fas fa-exclamation-circle"></i>
                      <p>{formError}</p>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={contactFormData.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={contactFormData.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={contactFormData.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="4" 
                      value={contactFormData.message} 
                      onChange={handleInputChange} 
                      required 
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary btn-block">
                    Send Inquiry
                  </button>
                </form>
              )}
              
              <div className="contact-info">
                <p><i className="fas fa-phone"></i> +212 522 123 456</p>
                <p><i className="fas fa-envelope"></i> info@realestate.ma</p>
              </div>
            </div>
            
            {/* Agent Info */}
            <div className="agent-card">
              <h3>Property Agent</h3>
              <div className="agent-info">
                <img src="https://via.placeholder.com/100x100" alt="Agent" className="agent-image" />
                <div className="agent-details">
                  <h4>John Doe</h4>
                  <p>Senior Real Estate Agent</p>
                  <p><i className="fas fa-phone"></i> +212 522 123 456</p>
                  <p><i className="fas fa-envelope"></i> john@realestate.ma</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Properties Section */}
        <section className="similar-properties">
          <h2>Similar Properties</h2>
          <div className="similar-properties-container">
            <div className="property-placeholder">
              <div className="placeholder-image"></div>
              <div className="placeholder-content">
                <div className="placeholder-title"></div>
                <div className="placeholder-text"></div>
                <div className="placeholder-price"></div>
              </div>
            </div>
            <div className="property-placeholder">
              <div className="placeholder-image"></div>
              <div className="placeholder-content">
                <div className="placeholder-title"></div>
                <div className="placeholder-text"></div>
                <div className="placeholder-price"></div>
              </div>
            </div>
            <div className="property-placeholder">
              <div className="placeholder-image"></div>
              <div className="placeholder-content">
                <div className="placeholder-title"></div>
                <div className="placeholder-text"></div>
                <div className="placeholder-price"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PropertyDetailsPage;
