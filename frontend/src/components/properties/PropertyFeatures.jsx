import React from 'react';
import './styles/PropertyFeatures.css';

/**
 * PropertyFeatures component for displaying property amenities
 * @param {Object} property - The property object containing amenities data
 * @returns {JSX.Element} - A component displaying property amenities
 */
const PropertyFeatures = ({ property }) => {
  // Define the amenities with their corresponding icons
  const amenities = [
    { key: 'has_parking', icon: 'fa-parking', label: 'Parking' },
    { key: 'has_garden', icon: 'fa-leaf', label: 'Garden' },
    { key: 'has_pool', icon: 'fa-swimming-pool', label: 'Swimming Pool' },
    { key: 'has_balcony', icon: 'fa-door-open', label: 'Balcony' },
    { key: 'has_garage', icon: 'fa-warehouse', label: 'Garage' },
    { key: 'has_elevator', icon: 'fa-arrow-alt-circle-up', label: 'Elevator' },
    { key: 'has_security', icon: 'fa-shield-alt', label: 'Security' },
    { key: 'has_air_conditioning', icon: 'fa-snowflake', label: 'Air Conditioning' },
    { key: 'has_heating', icon: 'fa-temperature-high', label: 'Heating' },
    { key: 'has_furnished', icon: 'fa-couch', label: 'Furnished' }
  ];

  // Filter amenities that the property has
  const availableAmenities = amenities.filter(amenity => property[amenity.key]);

  return (
    <div className="property-amenities">
      <h3>Amenities</h3>
      {availableAmenities.length > 0 ? (
        <ul className="amenities-list">
          {availableAmenities.map((amenity, index) => (
            <li key={index}>
              <i className={`fas ${amenity.icon}`}></i> {amenity.label}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-amenities">No amenities listed for this property.</p>
      )}
    </div>
  );
};

export default PropertyFeatures;
