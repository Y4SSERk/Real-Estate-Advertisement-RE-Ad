import { useState, useEffect, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, capitalizeWords, formatDate } from '../utils/helpers';
import { propertyService } from '../services/api';
import PropertyCard from '../components/properties/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './HomePage.css';

// Memoized PropertyCard to prevent unnecessary re-renders
const MemoizedPropertyCard = memo(PropertyCard);

function HomePage() {
  // Use state instead of useFetch hook for better performance
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Memoized fetch function to prevent unnecessary re-renders
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await propertyService.getFeaturedProperties();
      // If the API doesn't return featured properties, get the 6 most recent ones
      if (!data || data.length === 0) {
        const allProperties = await propertyService.getProperties();
        setFeaturedProperties(allProperties.slice(0, 6));
      } else {
        setFeaturedProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

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
            <LoadingSpinner message="Loading featured properties..." />
          ) : error ? (
            <ErrorMessage message={error} linkTo="/search" linkText="Browse All Properties" />
          ) : (
            <div className="featured-properties-grid">
              {featuredProperties && featuredProperties.map(property => (
                <MemoizedPropertyCard 
                  key={property.id} 
                  property={property} 
                />
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
