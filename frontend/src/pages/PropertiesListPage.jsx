import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQueryParams } from '../utils/hooks';
import { formatPrice } from '../utils/helpers';
import { propertyService } from '../services/api';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilters from '../components/properties/PropertyFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './PropertiesListPage.css';

function PropertiesListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Search input reference for focus
  const searchInputRef = useRef(null);
  
  // Use our custom hook for query parameters
  const {
    filters,
    handleFilterChange,
    setFilterValue,
    setMultipleFilters,
    clearFilters
  } = useQueryParams({
    status: '',
    property_type: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    search: '',
    sort: 'newest'
  });
  
  // Get sort option from filters
  const sortOption = filters.sort || 'newest';
  
  // Toggle filters visibility (for mobile)
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Convert our filters to API parameters
        const apiParams = {};
        
        if (filters.status) apiParams.status = filters.status;
        if (filters.property_type) apiParams.property_type = filters.property_type;
        if (filters.min_price) apiParams.min_price = filters.min_price;
        if (filters.max_price) apiParams.max_price = filters.max_price;
        if (filters.bedrooms) apiParams.bedrooms = filters.bedrooms;
        if (filters.bathrooms) apiParams.bathrooms = filters.bathrooms;
        if (filters.city) apiParams.city = filters.city;
        if (filters.search) apiParams.search = filters.search;
        
        console.log('Fetching properties with filters:', apiParams);
        
        // Use our propertyService to fetch properties
        const data = await propertyService.getProperties(apiParams);
        console.log('Properties loaded:', data.length);
        
        // Calculate pagination
        const totalItems = data.length;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
        
        setProperties(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [filters, itemsPerPage]);
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Trigger a search with current filters
    setCurrentPage(1); // Reset to first page when searching
    
    // If we have a search input ref, blur it to hide mobile keyboard
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };
  
  // Handle sort change
  const handleSortChange = (value) => {
    setFilterValue('sort', value);
  };
  
  // Reset filters
  const resetFilters = () => {
    clearFilters();
    navigate('/search');
  };
  
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  // Filter and sort properties
  const getFilteredProperties = () => {
    let filtered = [...properties];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(property => property.status === filters.status);
    }
    
    if (filters.type) {
      filtered = filtered.filter(property => property.property_type === filters.type);
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
    }
    
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }
    
    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.bathrooms));
    }
    
    if (filters.city) {
      filtered = filtered.filter(property => property.city === filters.city);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return filtered;
  };
  
  const filteredProperties = getFilteredProperties();
  
  // List of Moroccan cities for the filter
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir', 
    'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'El Jadida', 'Safi', 
    'Mohammedia', 'Khouribga', 'Beni Mellal', 'Nador', 'Taza', 
    'Settat', 'Berrechid', 'Khemisset', 'Guelmim', 'Laayoune', 
    'Dakhla', 'Essaouira', 'Ifrane', 'Chefchaouen', 'Ouarzazate', 
    'Taroudant', 'Errachidia', 'Al Hoceima', 'Larache', 'Ksar El Kebir',
    'Tiznit', 'Sidi Slimane', 'Sidi Kacem', 'Midelt', 'Azrou', 'Zagora'
  ];
  
  return (
    <div className="properties-list-page">
      <div className="container">
        {/* Page Header with Search Bar */}
        <div className="page-header">
          <h1>Browse Properties</h1>
          <p>Find your dream property from our extensive listings</p>
          
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-container">
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search by location, property name, or keywords..."
                value={filters.search || ''}
                onChange={(e) => setFilterValue('search', e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>

        <div className="properties-container">
          {/* Filter Toggle Button (Mobile) */}
          <button className="filter-toggle-btn" onClick={toggleFilters}>
            <i className="fas fa-filter"></i> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div className="properties-layout">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="filters-sidebar">
                <PropertyFilters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onApplyFilters={() => {/* Filters are applied automatically */}}
                  onResetFilters={resetFilters}
                />
              </div>
            )}
            
            {/* Properties Content */}
            <div className="properties-content">
              <div className="properties-header">
                <div className="properties-count">
                  <p><strong>{filteredProperties.length}</strong> properties found</p>
                </div>
                
                <div className="sort-options">
                  <label><i className="fas fa-sort"></i> Sort by:</label>
                  <select 
                    className="sort-select"
                    value={sortOption} 
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_low">Price (Low to High)</option>
                    <option value="price_high">Price (High to Low)</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <LoadingSpinner message="Loading properties..." />
              ) : error ? (
                <ErrorMessage 
                  message={error} 
                  linkTo="/" 
                  linkText="Return to Home" 
                />
              ) : filteredProperties.length === 0 ? (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>No properties found</h3>
                  <p>Try adjusting your filters to see more results</p>
                  <button className="btn btn-primary" onClick={resetFilters}>Reset Filters</button>
                </div>
              ) : (
                <div className="properties-grid">
                  {filteredProperties.map(property => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      showFullDetails={true}
                    />
                  ))}
                </div>
              )}
              
              {/* Pagination will be added later */}
              {!loading && !error && filteredProperties.length > 0 && (
                <div className="pagination-placeholder">
                  <p>Showing all {filteredProperties.length} results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesListPage;
