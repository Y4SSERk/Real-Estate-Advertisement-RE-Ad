import React from 'react';
import './styles/PropertyDetails.css';

/**
 * PropertyDetails component for displaying detailed property information
 * @param {Object} property - The property object containing all property details
 * @returns {JSX.Element} - A component displaying detailed property information
 */
const PropertyDetails = ({ property }) => {
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="property-details">
      <div className="property-header">
        <div className="property-title-section">
          <h1>{property.title}</h1>
          <div className="property-location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{property.city}, {property.address}</span>
          </div>
        </div>
        <div className="property-price-section">
          <div className="property-price">{formatPrice(property.price)}</div>
          {/* Property status removed as requested - keeping only the status at the top of the page */}
        </div>
      </div>

      <div className="property-meta-info">
        <div className="meta-item">
          <i className="fas fa-calendar-alt"></i>
          <span>Listed on {formatDate(property.created_at)}</span>
        </div>
        <div className="meta-item">
          <i className="fas fa-home"></i>
          <span>
            {property.property_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
        <div className="meta-item">
          <i className="fas fa-id-card"></i>
          <span>Property ID: {property.id}</span>
        </div>
      </div>

      <div className="property-specs">
        <div className="spec-item">
          <i className="fas fa-ruler-combined"></i>
          <span className="spec-value">{property.surface_area}</span>
          <span className="spec-label">Square Meters</span>
        </div>
        {property.bedrooms > 0 && (
          <div className="spec-item">
            <i className="fas fa-bed"></i>
            <span className="spec-value">{property.bedrooms}</span>
            <span className="spec-label">{property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          </div>
        )}
        {property.bathrooms > 0 && (
          <div className="spec-item">
            <i className="fas fa-bath"></i>
            <span className="spec-value">{property.bathrooms}</span>
            <span className="spec-label">{property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
          </div>
        )}
        {property.floors > 0 && (
          <div className="spec-item">
            <i className="fas fa-layer-group"></i>
            <span className="spec-value">{property.floors}</span>
            <span className="spec-label">{property.floors === 1 ? 'Floor' : 'Floors'}</span>
          </div>
        )}
      </div>

      <div className="property-description">
        <h3>Description</h3>
        <div className="description-content">
          {property.description}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
