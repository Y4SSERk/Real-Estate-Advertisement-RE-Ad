import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/properties/');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        // Get the 6 most recent properties
        const featured = data.slice(0, 6);
        setFeaturedProperties(featured);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Property in Morocco</h1>
          <p>Browse thousands of properties for sale and rent across the country</p>
          <div className="hero-buttons">
            <Link to="/search" className="btn btn-primary">
              <i className="fas fa-search"></i> Search Properties
            </Link>
            <Link to="/add-property" className="btn btn-secondary">
              <i className="fas fa-plus"></i> Create Property Listing
            </Link>
          </div>
          
          <div className="hero-search">
            <form onSubmit={(e) => {
              e.preventDefault();
              const searchInput = e.target.querySelector('input').value;
              window.location.href = `/search?searchTerm=${encodeURIComponent(searchInput)}`;
            }}>
              <input 
                type="text" 
                placeholder="Search by city, address, or property type..." 
                className="hero-search-input"
              />
              <button type="submit" className="hero-search-btn">
                <i className="fas fa-search"></i> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="property-types-section">
        <div className="container">
          <h2 className="section-title">Browse by Property Type</h2>
          <div className="property-types-grid">
            <Link to="/search?type=apartment" className="property-type-card">
              <div className="property-type-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3>Apartments</h3>
              <p>Find modern apartments in prime locations</p>
            </Link>
            
            <Link to="/search?type=house" className="property-type-card">
              <div className="property-type-icon">
                <i className="fas fa-home"></i>
              </div>
              <h3>Houses</h3>
              <p>Discover family homes with space and comfort</p>
            </Link>
            
            <Link to="/search?type=villa" className="property-type-card">
              <div className="property-type-icon">
                <i className="fas fa-hotel"></i>
              </div>
              <h3>Villas</h3>
              <p>Explore luxury villas with premium amenities</p>
            </Link>
            
            <Link to="/search?type=riad" className="property-type-card">
              <div className="property-type-icon">
                <i className="fas fa-archway"></i>
              </div>
              <h3>Riads</h3>
              <p>Discover traditional Moroccan houses with interior gardens</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Status Section */}
      <section className="property-status-section">
        <div className="container">
          <h2 className="section-title">Browse by Status</h2>
          <div className="property-status-grid">
            <Link to="/search?status=for_sale" className="property-status-card">
              <div className="property-status-icon">
                <i className="fas fa-tag"></i>
              </div>
              <h3>For Sale</h3>
              <p>Properties available for purchase</p>
            </Link>
            
            <Link to="/search?status=for_rent" className="property-status-card">
              <div className="property-status-icon">
                <i className="fas fa-key"></i>
              </div>
              <h3>For Rent</h3>
              <p>Properties available for rental</p>
            </Link>
            
            <Link to="/search?status=sold" className="property-status-card">
              <div className="property-status-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Recently Sold</h3>
              <p>View recently sold properties</p>
            </Link>
            
            <Link to="/search?status=rented" className="property-status-card">
              <div className="property-status-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Recently Rented</h3>
              <p>View recently rented properties</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-properties-section">
        <div className="container">
          <h2 className="section-title">Featured Properties</h2>
          
          {loading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading properties...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="featured-properties-grid">
              {featuredProperties.map(property => (
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
          
          <div className="view-all-btn-container">
            <Link to="/search" className="btn btn-primary">View All Properties</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
