import { useState, useEffect } from 'react';
import PropertyForm from './PropertyForm';
import './styles/PropertyStyles.css';

function PropertyCRUD({ showFormDirectly = false }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(showFormDirectly);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Fetch all properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch properties from the API
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

  // Handle form submission (create or update)
  const handleFormSubmit = (submittedProperty) => {
    if (propertyToEdit) {
      // Update existing property in the state
      setProperties(prevProperties => 
        prevProperties.map(property => 
          property.id === submittedProperty.id ? submittedProperty : property
        )
      );
    } else {
      // Add new property to the state
      setProperties(prevProperties => [...prevProperties, submittedProperty]);
    }
    
    // Reset form state
    setShowForm(false);
    setPropertyToEdit(null);
  };

  // Open form for editing a property
  const handleEdit = (property) => {
    setPropertyToEdit(property);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Show delete confirmation dialog
  const confirmDelete = (property) => {
    setDeleteConfirmation(property);
  };

  // Cancel delete operation
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Delete a property
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/properties/${id}/`, {
        method: 'DELETE',
        // Include credentials if you're using session authentication
        // credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      
      // Remove property from state
      setProperties(prevProperties => 
        prevProperties.filter(property => property.id !== id)
      );
      
      // Close confirmation dialog
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Error deleting property:', error);
      setError('Failed to delete property. Please try again later.');
    }
  };

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get cover image or placeholder
  const getCoverImage = (property) => {
    if (property.images && property.images.length > 0) {
      // Find cover image or use first image
      const coverImage = property.images.find(img => img.is_cover) || property.images[0];
      return coverImage.image;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };
  
  // Log property data to help debug image issues
  useEffect(() => {
    if (properties.length > 0) {
      console.log('Property data:', properties);
      if (properties[0].images) {
        console.log('First property images:', properties[0].images);
      }
    }
  }, [properties]);

  return (
    <div className="property-crud-container">
      <div className="crud-header">
        <h1>Property Management</h1>
        <button 
          className="add-property-btn"
          onClick={() => {
            setPropertyToEdit(null);
            setShowForm(true);
          }}
        >
          Add New Property
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <PropertyForm 
          propertyToEdit={propertyToEdit}
          onFormSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setPropertyToEdit(null);
          }}
        />
      ) : (
        <>
          {loading ? (
            <div className="loading">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="no-properties">
              <p>No properties found. Add your first property!</p>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map(property => (
                <div key={property.id} className="property-card">
                  <div className="property-image">
                    <img src={getCoverImage(property)} alt={property.title} />
                    <div className="property-status">{property.status.replace('_', ' ')}</div>
                  </div>
                  
                  <div className="property-content">
                    <h3>{property.title}</h3>
                    <p className="property-location">{property.city}, {property.address}</p>
                    <p className="property-price">{formatPrice(property.price)}</p>
                    
                    <div className="property-features">
                      <span>{property.surface_area} m²</span>
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                    </div>
                    
                    <div className="property-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(property)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => confirmDelete(property)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{deleteConfirmation.title}"?</p>
            <p className="delete-warning">This action cannot be undone.</p>
            
            <div className="delete-modal-actions">
              <button 
                className="cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={() => handleDelete(deleteConfirmation.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyCRUD;
