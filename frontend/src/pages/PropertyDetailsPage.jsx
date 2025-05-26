import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);


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
        // Log property owner information for debugging
        if (data.user) {
          console.log('Property Owner Info:', {
            id: data.user.id,
            username: data.user.username,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone
          });
        }
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
        
        {/* Property Header */}
        <div className="property-header">
          <div className="property-title">
            <h1>{property.title}</h1>
            <p className="property-address">
              <i className="fas fa-map-marker-alt"></i> {property.city}, {property.address}
            </p>
            <div className="property-badges">
              <span className="property-type"><i className="fas fa-home"></i> {property.property_type.replace('_', ' ').charAt(0).toUpperCase() + property.property_type.replace('_', ' ').slice(1)}</span>
              <span className="property-date"><i className="fas fa-calendar-alt"></i> Listed on {new Date(property.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="property-price">
            <h2>{formatPrice(property.price)}</h2>
            {property.status === 'for_rent' && <span className="price-period">/ month</span>}
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
            <div className="gallery-controls">
              {property.images && property.images.length > 1 && (
                <>
                  <button 
                    className="gallery-control prev" 
                    onClick={() => setActiveImage(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
                    aria-label="Previous image"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className="gallery-control next" 
                    onClick={() => setActiveImage(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
                    aria-label="Next image"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>
            {property.images && property.images.length > 0 && (
              <div className="image-counter">
                {activeImage + 1} / {property.images.length}
              </div>
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
                <i className="fas fa-door-open"></i>
                <span>{property.rooms}</span>
                <p>Rooms</p>
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
              {property.floors > 0 && (
                <div className="feature">
                  <i className="fas fa-building"></i>
                  <span>{property.floors}</span>
                  <p>Floors</p>
                </div>
              )}
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
            
            {/* Amenities and Location Card */}
            <div className="amenities-location-card">
              <div className="card-section">
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
              
              <div className="card-section">
                <h3>Location</h3>
                <div className="location-info">
                  <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> sidi bobo</p>
                  <p><i className="fas fa-city"></i> <strong>City:</strong> casablanca</p>
                  <p><i className="fas fa-flag"></i> <strong>Country:</strong> Morocco</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Property Details Sidebar */}
          <div className="property-sidebar">
            <div className="property-details-card">
              <h3>Property Details</h3>
              <ul className="property-details-list">
                <li>
                  <span className="detail-label">Property ID:</span>
                  <span className="detail-value">{property.id}</span>
                </li>
                <li>
                  <span className="detail-label">Property Type:</span>
                  <span className="detail-value">{property.property_type.replace('_', ' ')}</span>
                </li>
                <li>
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">{property.status.replace('_', ' ')}</span>
                </li>
                <li>
                  <span className="detail-label">Surface Area:</span>
                  <span className="detail-value">{property.surface_area} m²</span>
                </li>
                <li>
                  <span className="detail-label">Bedrooms:</span>
                  <span className="detail-value">{property.bedrooms}</span>
                </li>
                <li>
                  <span className="detail-label">Bathrooms:</span>
                  <span className="detail-value">{property.bathrooms}</span>
                </li>
                <li>
                  <span className="detail-label">Rooms:</span>
                  <span className="detail-value">{property.rooms}</span>
                </li>
                <li>
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{property.city}</span>
                </li>
                <li>
                  <span className="detail-label">Listed On:</span>
                  <span className="detail-value">{new Date(property.created_at).toLocaleDateString()}</span>
                </li>
              </ul>
              
              <div className="property-actions">
                <Link to="/search" className="btn btn-primary btn-block">
                  <i className="fas fa-search"></i> Browse More Properties
                </Link>
              </div>
            </div>
            
            {/* Agent Info */}
            <div className="agent-card">
              <h3>Property Owner</h3>
              <div className="agent-info">
                <div className="agent-icon">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="agent-details">
                  <h4>{property.user ? property.user.name : 'Property Owner'}</h4>
                  <p>Real Estate Owner</p>
                  <div className="agent-contact-info">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>{property.user && property.user.email ? property.user.email : 'Email not available'}</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>{property.user && property.user.phone ? property.user.phone : 'Phone not available'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* No similar properties section as requested */}
      </div>
    </div>
  );
}

export default PropertyDetailsPage;
