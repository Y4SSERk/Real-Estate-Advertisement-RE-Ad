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
      // In a real app, you would call your API to delete the property
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the UI by removing the deleted property
      setProperties(prevProperties => 
        prevProperties.filter(property => property.id !== deleteId)
      );
      
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

  return (
    <div className="my-properties-page">
      <div className="container">
        <div className="page-header">
          <h1>My Properties</h1>
          <p>Manage your real estate listings</p>
        </div>
        
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
          <div className="properties-table-container">
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Views</th>
                  <th>Inquiries</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id}>
                    <td className="property-info">
                      <div className="property-thumbnail">
                        {property.images && property.images.length > 0 ? (
                          <img src={property.images[0].image} alt={property.title} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                      <div className="property-details">
                        <h3>{property.title}</h3>
                        <p className="property-location">
                          <i className="fas fa-map-marker-alt"></i> {property.city}, {property.address}
                        </p>
                        <div className="property-specs">
                          <span><i className="fas fa-ruler-combined"></i> {property.surface_area} m²</span>
                          {property.bedrooms > 0 && (
                            <span><i className="fas fa-bed"></i> {property.bedrooms}</span>
                          )}
                          {property.bathrooms > 0 && (
                            <span><i className="fas fa-bath"></i> {property.bathrooms}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${property.status}`}>
                        {property.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="price">{formatPrice(property.price)}</td>
                    <td className="views">
                      <i className="fas fa-eye"></i> {property.views}
                    </td>
                    <td className="inquiries">
                      <i className="fas fa-envelope"></i> {property.inquiries}
                    </td>
                    <td className="date">
                      {new Date(property.created_at).toLocaleDateString()}
                    </td>
                    <td className="actions">
                      <Link to={`/properties/${property.id}`} className="btn-icon" title="View">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/edit-property/${property.id}`} className="btn-icon" title="Edit">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDeleteClick(property.id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <p>Are you sure you want to delete this property? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPropertiesPage;
