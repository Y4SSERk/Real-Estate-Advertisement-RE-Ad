import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyPropertiesPage.css';

function MyPropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    forSale: 0,
    forRent: 0,
    sold: 0,
    rented: 0
  });

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(loggedInUser));
    fetchMyProperties();
  }, [navigate]);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      if (!loggedInUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }
      
      // Fetch properties from the backend API
      const response = await fetch(`http://localhost:8000/api/properties/?user=${loggedInUser.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setProperties(data);
      
      // Calculate property statistics
      const stats = {
        total: data.length,
        forSale: data.filter(p => p.status === 'for_sale').length,
        forRent: data.filter(p => p.status === 'for_rent').length,
        sold: data.filter(p => p.status === 'sold').length,
        rented: data.filter(p => p.status === 'rented').length
      };
      setStats(stats);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to fetch properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/properties/${deleteId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update the UI by removing the deleted property
      setProperties(prevProperties => {
        const updatedProperties = prevProperties.filter(property => property.id !== deleteId);
        
        // Update stats
        const deletedProperty = prevProperties.find(property => property.id === deleteId);
        if (deletedProperty) {
          setStats(prev => ({
            ...prev,
            total: prev.total - 1,
            [deletedProperty.status === 'for_sale' ? 'forSale' : 
              deletedProperty.status === 'for_rent' ? 'forRent' : 
              deletedProperty.status === 'sold' ? 'sold' : 'rented']: 
              prev[deletedProperty.status === 'for_sale' ? 'forSale' : 
                deletedProperty.status === 'for_rent' ? 'forRent' : 
                deletedProperty.status === 'sold' ? 'sold' : 'rented'] - 1
          }));
        }
        
        return updatedProperties;
      });
      
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting property:', error);
      // Show error message
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get property status label
  const getStatusLabel = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Get property type label
  const getPropertyTypeLabel = (type) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="my-properties-page">
      <div className="container">
        <div className="page-header">
          <h1>My Properties</h1>
          <p>Manage your real estate listings</p>
        </div>
        
        {!loading && !error && properties.length > 0 && (
          <div className="property-stats">
            <div className="stat-card total">
              <div className="stat-icon">
                <i className="fas fa-home"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Properties</p>
              </div>
            </div>
            <div className="stat-card for-sale">
              <div className="stat-icon">
                <i className="fas fa-tag"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.forSale}</h3>
                <p>For Sale</p>
              </div>
            </div>
            <div className="stat-card for-rent">
              <div className="stat-icon">
                <i className="fas fa-key"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.forRent}</h3>
                <p>For Rent</p>
              </div>
            </div>
            <div className="stat-card sold">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.sold + stats.rented}</h3>
                <p>Sold/Rented</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="my-properties-actions">
          <Link to="/add-property" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Property
          </Link>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading your properties...</p>
            </div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : properties.length === 0 ? (
          <div className="no-properties">
            <div className="no-properties-content">
              <i className="fas fa-home"></i>
              <h2>No Properties Yet</h2>
              <p>You haven't added any properties yet. Start by adding your first property.</p>
              <Link to="/add-property" className="btn btn-primary">Add Your First Property</Link>
            </div>
          </div>
        ) : (
          <div className="properties-grid-container">
            <div className="properties-grid">
              {properties.map(property => (
                <div key={property.id} className="property-card">
                  <div className="property-card-header">
                    <div className="property-image">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0].image} alt={property.title} />
                      ) : (
                        <div className="no-image">
                          <i className="fas fa-home"></i>
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <span className={`property-status ${property.status}`}>
                      {getStatusLabel(property.status)}
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
                        <span>{getPropertyTypeLabel(property.property_type)}</span>
                      </div>
                      <div className="property-date">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{new Date(property.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="property-card-footer">
                    <Link to={`/edit-property/${property.id}`} className="action-btn edit">
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDeleteClick(property.id)}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button className="close-btn" onClick={cancelDelete}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p>Are you sure you want to delete this property? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cancelDelete}>
                <i className="fas fa-times"></i> Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <i className="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPropertiesPage;
