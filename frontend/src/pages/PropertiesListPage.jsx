import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './PropertiesListPage.css';

function PropertiesListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: queryParams.get('status') || '',
    type: queryParams.get('type') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    bedrooms: queryParams.get('bedrooms') || '',
    bathrooms: queryParams.get('bathrooms') || '',
    city: queryParams.get('city') || '',
    searchTerm: queryParams.get('searchTerm') || ''
  });
  
  // Search input reference for focus
  const searchInputRef = useRef(null);
  
  // Sort state
  const [sortOption, setSortOption] = useState(queryParams.get('sort') || 'newest');
  
  // Toggle filters visibility (for mobile)
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Get query parameters from URL
        const params = new URLSearchParams(location.search);
        let apiUrl = 'http://127.0.0.1:8000/api/properties/';
        
        // We'll handle filtering on the frontend for now, but in a real app
        // you could pass these parameters to the backend API
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [location.search]);
  
  // Apply filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters to URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.status) params.set('status', filters.status);
    if (filters.type) params.set('type', filters.type);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms);
    if (filters.city) params.set('city', filters.city);
    if (filters.searchTerm) params.set('searchTerm', filters.searchTerm);
    params.set('sort', sortOption);
    
    navigate(`/search?${params.toString()}`);
  };
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      searchTerm: ''
    });
    setSortOption('newest');
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
    
    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
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
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
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
                <div className="filter-card">
                  <h3>Filter Properties</h3>
                  
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
                    <label>Property Type</label>
                    <select 
                      name="type" 
                      value={filters.type} 
                      onChange={handleFilterChange}
                    >
                      <option value="">All Types</option>
                      <option value="apartment">Apartment</option>
                      <option value="studio">Studio</option>
                      <option value="duplex">Duplex</option>
                      <option value="triplex">Triplex</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="riad">Riad</option>
                      <option value="urban_land">Urban Land</option>
                      <option value="agricultural_land">Agricultural Land</option>
                      <option value="farm_ranch">Farm / Ranch</option>
                      <option value="office">Office</option>
                      <option value="shop">Shop / Commercial Space</option>
                      <option value="warehouse">Warehouse / Storage</option>
                      <option value="factory">Factory</option>
                      <option value="restaurant">Restaurant / Café</option>
                      <option value="hotel">Hotel / Guesthouse</option>
                      <option value="building">Building</option>
                      <option value="showroom">Showroom</option>
                      <option value="parking">Parking / Garage</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>City</label>
                    <select 
                      name="city" 
                      value={filters.city} 
                      onChange={handleFilterChange}
                    >
                      <option value="">All Cities</option>
                      {moroccanCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>Price Range</label>
                    <div className="price-range">
                      <input 
                        type="number" 
                        name="minPrice" 
                        placeholder="Min Price" 
                        value={filters.minPrice} 
                        onChange={handleFilterChange}
                      />
                      <span>to</span>
                      <input 
                        type="number" 
                        name="maxPrice" 
                        placeholder="Max Price" 
                        value={filters.maxPrice} 
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
              </div>
            )}
            
            {/* Properties Content */}
            <div className="properties-content">
              <div className="properties-header">
                <div className="properties-count">
                  <p><strong>{filteredProperties.length}</strong> properties found</p>
                </div>
                
                <div className="sort-options">
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
    </div>
  );
}

export default PropertiesListPage;
