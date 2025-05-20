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
            <Link to="/properties?status=for_sale" className="btn btn-primary">Buy Property</Link>
            <Link to="/properties?status=for_rent" className="btn btn-secondary">Rent Property</Link>
          </div>
          
          <div className="hero-search">
            <input 
              type="text" 
              placeholder="Search by city, address, or property type..." 
              className="hero-search-input"
            />
            <Link to="/search" className="hero-search-btn">
              <i className="fas fa-search"></i> Search
            </Link>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="property-types-section">
        <div className="container">
          <h2 className="section-title">Browse by Property Type</h2>
          <div className="property-types-grid">
            <Link to="/properties?type=apartment" className="property-type-card">
              <div className="property-type-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3>Apartments</h3>
              <p>Find modern apartments in prime locations</p>
            </Link>
            
            <Link to="/properties?type=house" className="property-type-card">
              <div className="property-type-icon">
                <i className="fas fa-home"></i>
              </div>
              <h3>Houses</h3>
              <p>Discover family homes with space and comfort</p>
            </Link>
            
            <Link to="/properties?type=villa" className="property-type-card">
              <div className="property-type-icon">
                <i className="fas fa-hotel"></i>
              </div>
              <h3>Villas</h3>
              <p>Explore luxury villas with premium amenities</p>
            </Link>
            
            <Link to="/properties?type=office" className="property-type-card">
              <div className="property-type-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <h3>Commercial</h3>
              <p>Find the perfect space for your business</p>
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
            <Link to="/properties" className="btn btn-primary">View All Properties</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose RE-Ad?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-search-location"></i>
              </div>
              <h3>Wide Selection</h3>
              <p>Browse thousands of properties across Morocco to find your perfect match</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Trusted Platform</h3>
              <p>All listings are verified to ensure you get accurate information</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3>Best Deals</h3>
              <p>Find properties at competitive prices with no hidden fees</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>Expert Support</h3>
              <p>Our team is ready to assist you throughout your property journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Dream Property?</h2>
            <p>Start your search today and discover the perfect property in Morocco</p>
            <Link to="/properties" className="btn btn-primary">Explore Properties</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
