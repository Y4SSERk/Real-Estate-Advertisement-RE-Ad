import React from 'react';
import './styles/PropertyFilters.css';

/**
 * PropertyFilters component for filtering properties
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Function to handle filter changes
 * @param {Function} onApplyFilters - Function to handle search submission
 * @param {Function} onResetFilters - Function to clear all filters
 * @returns {JSX.Element} - A component with property filter controls
 */
const PropertyFilters = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => {
  // Property type options
  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'office', label: 'Office' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' }
  ];

  // Status options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'for_sale', label: 'For Sale' },
    { value: 'for_rent', label: 'For Rent' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' }
  ];

  return (
    <div className="property-filters">
      <div className="filters-header">
        <h3>Filter Properties</h3>
        <button 
          className="clear-filters-btn" 
          onClick={onResetFilters}
          type="button"
        >
          <i className="fas fa-times"></i> Clear Filters
        </button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        onApplyFilters();
      }}>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <div className="input-with-icon">
              <i className="fas fa-search"></i>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search || ''}
                onChange={onFilterChange}
                placeholder="Search by title, address..."
              />
            </div>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="property_type">Property Type</label>
            <select
              id="property_type"
              name="property_type"
              value={filters.property_type || ''}
              onChange={onFilterChange}
            >
              {propertyTypes.map((type, index) => (
                <option key={index} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status || ''}
              onChange={onFilterChange}
            >
              {statusOptions.map((status, index) => (
                <option key={index} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="min_price">Min Price</label>
            <div className="input-with-icon">
              <i className="fas fa-dollar-sign"></i>
              <input
                type="number"
                id="min_price"
                name="min_price"
                value={filters.min_price || ''}
                onChange={onFilterChange}
                placeholder="Min Price"
                min="0"
              />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="max_price">Max Price</label>
            <div className="input-with-icon">
              <i className="fas fa-dollar-sign"></i>
              <input
                type="number"
                id="max_price"
                name="max_price"
                value={filters.max_price || ''}
                onChange={onFilterChange}
                placeholder="Max Price"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={filters.bedrooms || ''}
              onChange={onFilterChange}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="bathrooms">Bathrooms</label>
            <select
              id="bathrooms"
              name="bathrooms"
              value={filters.bathrooms || ''}
              onChange={onFilterChange}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="city">City</label>
            <div className="input-with-icon">
              <i className="fas fa-city"></i>
              <input
                type="text"
                id="city"
                name="city"
                value={filters.city || ''}
                onChange={onFilterChange}
                placeholder="City"
              />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="min_area">Min Area (m²)</label>
            <div className="input-with-icon">
              <i className="fas fa-ruler-combined"></i>
              <input
                type="number"
                id="min_area"
                name="min_area"
                value={filters.min_area || ''}
                onChange={onFilterChange}
                placeholder="Min Area"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i> Search Properties
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilters;
