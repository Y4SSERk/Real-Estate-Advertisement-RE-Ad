import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { propertyService } from '../services/api';
import PropertyDetails from '../components/properties/PropertyDetails';
import PropertyGallery from '../components/properties/PropertyGallery';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch property details directly without using the custom hook
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        const data = await propertyService.getPropertyById(id);
        setPropertyData(data);
        
        // Log property owner information for debugging
        if (data.user) {
          console.log('Property Owner Info:', {
            id: data.user.id,
            username: data.user.username,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone
          });
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        if (error.response && error.response.status === 404) {
          setErrorMessage('Property not found');
        } else {
          setErrorMessage('Failed to fetch property details. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="container">
        <LoadingSpinner message="Loading property details..." />
      </div>
    );
  }

  // Show error message if there was an error fetching the data
  if (errorMessage) {
    return (
      <div className="container">
        <ErrorMessage 
          message={errorMessage} 
          linkTo="/search" 
          linkText="Back to Properties" 
        />
      </div>
    );
  }

  // Show error message if property data is not available
  if (!propertyData) {
    return (
      <div className="container">
        <ErrorMessage 
          message="Property not found." 
          linkTo="/search" 
          linkText="Back to Properties" 
        />
      </div>
    );
  }

  return (
    <div className="property-details-page">
      <div className="container">
        
        {/* Property Status - Moved to top */}
        <div className="property-status-banner">
          <span className={`status-badge ${propertyData.status}`}>
            {propertyData.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className="property-price">{formatPrice(propertyData.price)}</span>
        </div>
        
        {/* Property Gallery */}
        <PropertyGallery images={propertyData.images || []} />
        
        {/* Property Details */}
        <PropertyDetails property={propertyData} />
        
        <div className="property-content">
          {/* Property Main Content */}
          <div className="property-main">
            {/* Location Card */}
            <div className="location-card">
              <div className="card-section">
                <h3>Location</h3>
                <div className="location-info">
                  <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> {propertyData.address || 'Not specified'}</p>
                  <p><i className="fas fa-city"></i> <strong>City:</strong> {propertyData.city || 'Not specified'}</p>
                  <p><i className="fas fa-flag"></i> <strong>Country:</strong> Morocco</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Property Details Sidebar */}
          <div className="property-sidebar">
            <div className="property-details-card">
              <h3>Property Details</h3>
              <ul className="property-details-list">
                <li>
                  <span className="detail-label">Property ID:</span>
                  <span className="detail-value">{propertyData.id}</span>
                </li>
                <li>
                  <span className="detail-label">Property Type:</span>
                  <span className="detail-value">{propertyData.property_type.replace('_', ' ')}</span>
                </li>
                {/* Status removed as requested */}
                <li>
                  <span className="detail-label">Surface Area:</span>
                  <span className="detail-value">{propertyData.surface_area} m²</span>
                </li>
                <li>
                  <span className="detail-label">Bedrooms:</span>
                  <span className="detail-value">{propertyData.bedrooms}</span>
                </li>
                <li>
                  <span className="detail-label">Bathrooms:</span>
                  <span className="detail-value">{propertyData.bathrooms}</span>
                </li>
                <li>
                  <span className="detail-label">Rooms:</span>
                  <span className="detail-value">{propertyData.rooms}</span>
                </li>
                <li>
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{propertyData.city}</span>
                </li>
                <li>
                  <span className="detail-label">Listed On:</span>
                  <span className="detail-value">{new Date(propertyData.created_at).toLocaleDateString()}</span>
                </li>
              </ul>
              
              <div className="property-actions">
                <Link to="/search" className="btn btn-primary btn-block">
                  <i className="fas fa-search"></i> Browse More Properties
                </Link>
              </div>
            </div>
            
            {/* Agent Info - Removed contact form */}
            <div className="agent-card">
              <h3>Property Owner</h3>
              <div className="agent-info">
                <div className="agent-icon">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="agent-details">
                  <h4>{propertyData.user ? propertyData.user.name : 'Property Owner'}</h4>
                  <p>Real Estate Owner</p>
                  <div className="agent-contact-info">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>{propertyData.user && propertyData.user.email ? propertyData.user.email : 'Email not available'}</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>{propertyData.user && propertyData.user.phone ? propertyData.user.phone : 'Phone not available'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailsPage;
