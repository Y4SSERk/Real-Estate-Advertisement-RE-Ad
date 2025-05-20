import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PropertyForm from '../PropertyForm';
import './AdminPage.css';

function AdminPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');

  // Fetch all properties
  useEffect(() => {
    fetchProperties();
  }, []);

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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="admin-page">
        <div className="container">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <p>Manage your real estate listings</p>
          </div>

          {/* Admin Tabs */}
          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              <i className="fas fa-building"></i> Properties
            </button>
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i> Users
            </button>
            <button 
              className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <i className="fas fa-envelope"></i> Messages
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i> Settings
            </button>
          </div>

          {/* Properties Tab Content */}
          {activeTab === 'properties' && (
            <div className="tab-content">
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
                  <div className="admin-actions">
                    <button 
                      className="add-btn"
                      onClick={() => {
                        setPropertyToEdit(null);
                        setShowForm(true);
                      }}
                    >
                      <i className="fas fa-plus"></i> Add New Property
                    </button>
                    
                    <div className="search-box">
                      <input type="text" placeholder="Search properties..." />
                      <button><i className="fas fa-search"></i></button>
                    </div>
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  {loading ? (
                    <div className="loading-spinner">
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Loading properties...</p>
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="no-properties">
                      <p>No properties found. Add your first property!</p>
                    </div>
                  ) : (
                    <div className="properties-table-container">
                      <table className="properties-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Location</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {properties.map(property => (
                            <tr key={property.id}>
                              <td>{property.id}</td>
                              <td className="property-image-cell">
                                {property.images && property.images.length > 0 ? (
                                  <img src={property.images[0].image} alt={property.title} />
                                ) : (
                                  <div className="no-image">No Image</div>
                                )}
                              </td>
                              <td>{property.title}</td>
                              <td>{property.property_type.replace('_', ' ')}</td>
                              <td>
                                <span className={`status-badge ${property.status}`}>
                                  {property.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td>{formatPrice(property.price)}</td>
                              <td>{property.city}</td>
                              <td>{formatDate(property.created_at)}</td>
                              <td className="actions-cell">
                                <button 
                                  className="edit-btn"
                                  onClick={() => handleEdit(property)}
                                  title="Edit"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="view-btn"
                                  onClick={() => window.open(`/properties/${property.id}`, '_blank')}
                                  title="View"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="delete-btn"
                                  onClick={() => confirmDelete(property)}
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
                </>
              )}
            </div>
          )}

          {/* Other Tabs Content (Placeholders) */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="placeholder-content">
                <i className="fas fa-users"></i>
                <h2>User Management</h2>
                <p>This feature is coming soon. You'll be able to manage users, permissions, and roles.</p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="tab-content">
              <div className="placeholder-content">
                <i className="fas fa-envelope"></i>
                <h2>Message Center</h2>
                <p>This feature is coming soon. You'll be able to view and respond to inquiries from potential clients.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="placeholder-content">
                <i className="fas fa-cog"></i>
                <h2>Settings</h2>
                <p>This feature is coming soon. You'll be able to configure your account and application preferences.</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </Layout>
  );
}

export default AdminPage;
