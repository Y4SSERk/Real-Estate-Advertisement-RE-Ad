import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import './styles/PropertyCard.css';

// Lazy loading image component
const LazyCardImage = memo(({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);
  
  if (error) {
    return (
      <div className="no-image">
        <i className="fas fa-home"></i>
        <span>No Image</span>
      </div>
    );
  }
  
  return (
    <div className="lazy-card-image">
      {!loaded && <div className="card-image-placeholder"></div>}
      <img 
        src={src} 
        alt={alt} 
        loading="lazy" 
        onLoad={handleLoad} 
        onError={handleError}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
});

/**
 * PropertyCard component for displaying property information in a card format
 * @param {Object} property - The property object containing all property details
 * @returns {JSX.Element} - A card component displaying property information
 */
const PropertyCard = ({ property }) => {
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="property-card">
      <div className="property-card-header">
        <div className="property-image">
          {property.images && property.images.length > 0 ? (
            <LazyCardImage src={property.images[0].image} alt={property.title} />
          ) : (
            <div className="no-image">
              <i className="fas fa-home"></i>
              <span>No Image</span>
            </div>
          )}
        </div>
        <span className={`property-status ${property.status}`}>
          {property.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        <div className="property-quick-actions">
          <Link to={`/properties/${property.id}`} className="quick-action-btn view" title="View Property">
            <i className="fas fa-eye"></i>
          </Link>
        </div>
      </div>
      
      <div className="property-card-body">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{property.city}, {property.address}</span>
        </div>
        
        <div className="property-price">
          {formatPrice(property.price)}
        </div>
        
        <div className="property-features">
          <div className="feature">
            <i className="fas fa-ruler-combined"></i>
            <span>{property.surface_area} m²</span>
          </div>
          {property.bedrooms > 0 && (
            <div className="feature">
              <i className="fas fa-bed"></i>
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="feature">
              <i className="fas fa-bath"></i>
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
        </div>
        
        <div className="property-meta">
          <div className="property-type">
            <i className="fas fa-home"></i>
            <span>{property.property_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
          <div className="property-date">
            <i className="fas fa-calendar-alt"></i>
            <span>{new Date(property.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="property-card-footer">
        <Link to={`/properties/${property.id}`} className="action-btn view">
          <i className="fas fa-info-circle"></i> View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
