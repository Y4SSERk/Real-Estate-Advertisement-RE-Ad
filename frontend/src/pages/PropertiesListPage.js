import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './PropertiesListPage.css';

function PropertiesListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    propertyType: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    status: ''
  });
  const [sortOption, setSortOption] = useState('newest');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query parameters on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialFilters = { ...filters };
    
    if (queryParams.has('type')) {
      initialFilters.propertyType = queryParams.get('type');
    }
    
    if (queryParams.has('status')) {
      initialFilters.status = queryParams.get('status');
    }
    
    if (queryParams.has('min_price')) {
      initialFilters.priceMin = queryParams.get('min_price');
    }
    
    if (queryParams.has('max_price')) {
      initialFilters.priceMax = queryParams.get('max_price');
    }
    
    if (queryParams.has('bedrooms')) {
      initialFilters.bedrooms = queryParams.get('bedrooms');
    }
    
    if (queryParams.has('bathrooms')) {
      initialFilters.bathrooms = queryParams.get('bathrooms');
    }
    
    if (queryParams.has('sort')) {
      setSortOption(queryParams.get('sort'));
    }
    
    setFilters(initialFilters);
  }, [location.search]);
  
  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/properties/');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  // Filter and sort properties
  const getFilteredAndSortedProperties = () => {
    let filteredProperties = [...properties];
    
    // Apply filters
    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(
        property => property.property_type === filters.propertyType
      );
    }
    
    if (filters.status) {
      filteredProperties = filteredProperties.filter(
        property => property.status === filters.status
      );
    }
    
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(
        property => property.price >= parseInt(filters.priceMin)
      );
    }
    
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(
        property => property.price <= parseInt(filters.priceMax)
      );
    }
    
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(
        property => property.bedrooms >= parseInt(filters.bedrooms)
      );
    }
    
    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(
        property => property.bathrooms >= parseInt(filters.bathrooms)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price_low':
        filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filteredProperties.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filteredProperties.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      default:
        filteredProperties.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return filteredProperties;
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    
    if (filters.propertyType) {
      queryParams.set('type', filters.propertyType);
    }
    
    if (filters.status) {
      queryParams.set('status', filters.status);
    }
    
    if (filters.priceMin) {
      queryParams.set('min_price', filters.priceMin);
    }
    
    if (filters.priceMax) {
      queryParams.set('max_price', filters.priceMax);
    }
    
    if (filters.bedrooms) {
      queryParams.set('bedrooms', filters.bedrooms);
    }
    
    if (filters.bathrooms) {
      queryParams.set('bathrooms', filters.bathrooms);
    }
    
    queryParams.set('sort', sortOption);
    
    navigate(`/properties?${queryParams.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      propertyType: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      status: ''
    });
    setSortOption('newest');
    navigate('/properties');
  };
  
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const filteredAndSortedProperties = getFilteredAndSortedProperties();
  
  return (
    <div className="properties-list-page">
      <div className="page-header">
        <div className="container">
          <h1>Browse Properties</h1>
          <p>Find your perfect property from our extensive listings</p>
        </div>
      </div>
      
      <div className="container">
        <div className="properties-grid-container">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-card">
              <h3>Filter Properties</h3>
              
              <div className="filter-group">
                <label>Property Type</label>
                <select 
                  name="propertyType" 
                  value={filters.propertyType} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="office">Office</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Status</label>
                <select 
                  name="status" 
                  value={filters.status} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="for_sale">For Sale</option>
                  <option value="for_rent">For Rent</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input 
                    type="number" 
                    name="priceMin" 
                    placeholder="Min" 
                    value={filters.priceMin} 
                    onChange={handleFilterChange}
                  />
                  <span>to</span>
                  <input 
                    type="number" 
                    name="priceMax" 
                    placeholder="Max" 
                    value={filters.priceMax} 
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              
              <div className="filter-group">
                <label>Bedrooms</label>
                <select 
                  name="bedrooms" 
                  value={filters.bedrooms} 
                  onChange={handleFilterChange}
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
                <label>Bathrooms</label>
                <select 
                  name="bathrooms" 
                  value={filters.bathrooms} 
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              <div className="filter-actions">
                <button 
                  className="btn-apply" 
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
                <button 
                  className="btn-reset" 
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </aside>
          
          {/* Properties Grid */}
          <div className="properties-content">
            <div className="properties-header">
              <div className="properties-count">
                <p><strong>{filteredAndSortedProperties.length}</strong> properties found</p>
              </div>
              
              <div className="properties-sort">
                <label>Sort by:</label>
                <select 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price (Low to High)</option>
                  <option value="price_high">Price (High to Low)</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading properties...</p>
              </div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : filteredAndSortedProperties.length === 0 ? (
              <div className="no-properties">
                <i className="fas fa-search"></i>
                <h3>No properties found</h3>
                <p>Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <div className="properties-grid">
                {filteredAndSortedProperties.map(property => (
                  <Link to={`/properties/${property.id}`} key={property.id} className="property-card">
                    <div className="property-image">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0].image} alt={property.title} />
                      ) : (
                        <img src="https://via.placeholder.com/300x200?text=No+Image" alt="No image available" />
                      )}
                      <div className="property-status">{property.status.replace('_', ' ')}</div>
                    </div>
                    
                    <div className="property-content">
                      <h3>{property.title}</h3>
                      <p className="property-location">{property.city}, {property.address}</p>
                      <p className="property-price">{formatPrice(property.price)}</p>
                      
                      <div className="property-features">
                        <span><i className="fas fa-ruler-combined"></i> {property.surface_area} m²</span>
                        <span><i className="fas fa-bed"></i> {property.bedrooms} bed</span>
                        <span><i className="fas fa-bath"></i> {property.bathrooms} bath</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesListPage;
