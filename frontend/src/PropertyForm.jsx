import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyStyles.css';

function PropertyForm({ propertyToEdit, onFormSubmit, onCancel }) {
  const navigate = useNavigate();
  // Initialize form state with default values or values from propertyToEdit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    surface_area: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    furnished: false,
    property_type: 'apartment',
    status: 'for_sale',
    city: '',
    address: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    is_active: true
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Property type options from Django model
  const propertyTypeOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'studio', label: 'Studio' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'triplex', label: 'Triplex' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'riad', label: 'Riad' },
    { value: 'urban_land', label: 'Urban Land' },
    { value: 'agricultural_land', label: 'Agricultural Land' },
    { value: 'farm_ranch', label: 'Farm / Ranch' },
    { value: 'office', label: 'Office' },
    { value: 'shop', label: 'Shop / Commercial Space' },
    { value: 'warehouse', label: 'Warehouse / Storage' },
    { value: 'factory', label: 'Factory' },
    { value: 'restaurant', label: 'Restaurant / Café' },
    { value: 'hotel', label: 'Hotel / Guesthouse' },
    { value: 'building', label: 'Building' },
    { value: 'showroom', label: 'Showroom' },
    { value: 'parking', label: 'Parking / Garage' }
  ];

  // Status options from Django model
  const statusOptions = [
    { value: 'for_sale', label: 'For Sale' },
    { value: 'for_rent', label: 'For Rent' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' }
  ];

  // If propertyToEdit is provided, populate the form with its values
  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        title: propertyToEdit.title || '',
        description: propertyToEdit.description || '',
        price: propertyToEdit.price || '',
        surface_area: propertyToEdit.surface_area || '',
        rooms: propertyToEdit.rooms || '',
        bedrooms: propertyToEdit.bedrooms || '',
        bathrooms: propertyToEdit.bathrooms || '',
        furnished: propertyToEdit.furnished || false,
        property_type: propertyToEdit.property_type || 'apartment',
        status: propertyToEdit.status || 'for_sale',
        city: propertyToEdit.city || '',
        address: propertyToEdit.address || '',
        postal_code: propertyToEdit.postal_code || '',
        latitude: propertyToEdit.latitude || '',
        longitude: propertyToEdit.longitude || '',
        is_active: propertyToEdit.is_active !== undefined ? propertyToEdit.is_active : true
      });
      
      // If we have images from the property to edit, we would handle them here
      // This would depend on how your API returns the images
    }
  }, [propertyToEdit]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const newImages = Array.from(e.target.files).filter(file => {
        if (!allowedTypes.includes(file.type)) {
          setError(`File type ${file.type} is not supported. Please use JPEG, PNG, GIF or WEBP.`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setError(`File ${file.name} is too large. Maximum size is 5MB.`);
          return false;
        }
        return true;
      });
      
      if (newImages.length > 0) {
        setImages(prevImages => [...prevImages, ...newImages]);
        setError(null); // Clear any previous errors if successful
      }
    }
  };

  // Remove an image from the selection
  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData with proper type conversion
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          // Convert boolean values to strings that Django can understand
          if (typeof formData[key] === 'boolean') {
            formDataToSend.append(key, formData[key] ? 'true' : 'false');
          } 
          // Make sure numeric fields are sent as numbers
          else if (['price', 'surface_area', 'rooms', 'bedrooms', 'bathrooms'].includes(key)) {
            const numValue = parseFloat(formData[key]);
            if (!isNaN(numValue)) {
              formDataToSend.append(key, numValue);
            }
          }
          // Special handling for latitude and longitude (max 3 digits before decimal point)
          else if (key === 'latitude' || key === 'longitude') {
            // Only include if it's a valid coordinate value
            if (formData[key]) {
              const numValue = parseFloat(formData[key]);
              if (!isNaN(numValue)) {
                // Ensure the value is within valid range for lat/long
                if (key === 'latitude' && Math.abs(numValue) <= 90) {
                  formDataToSend.append(key, numValue);
                } else if (key === 'longitude' && Math.abs(numValue) <= 180) {
                  formDataToSend.append(key, numValue);
                } else {
                  // Skip invalid values
                  console.warn(`Invalid ${key} value: ${numValue}`);
                }
              }
            }
          }
          // All other fields as strings
          else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      
      // Add images to FormData
      images.forEach((image, index) => {
        formDataToSend.append(`uploaded_images[${index}]`, image);
      });

      // Determine if we're creating a new property or updating an existing one
      const url = propertyToEdit 
        ? `http://127.0.0.1:8000/api/properties/${propertyToEdit.id}/` 
        : 'http://127.0.0.1:8000/api/properties/';
      
      const method = propertyToEdit ? 'PUT' : 'POST';
      
      // Log the FormData contents for debugging
      console.log('Submitting form with data:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
        // Don't set Content-Type header, let the browser set it with the boundary
        // for multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      const data = await response.json();
      setSuccess(true);
      
      // Call the onFormSubmit callback with the submitted data
      if (onFormSubmit) {
        onFormSubmit(data);
      }
      
      // Reset form if creating a new property
      if (!propertyToEdit) {
        setFormData({
          title: '',
          description: '',
          price: '',
          surface_area: '',
          rooms: '',
          bedrooms: '',
          bathrooms: '',
          furnished: false,
          property_type: 'apartment',
          status: 'for_sale',
          city: '',
          address: '',
          postal_code: '',
          latitude: '',
          longitude: '',
          is_active: true
        });
        setImages([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-container">
      <h2>{propertyToEdit ? 'Edit Property' : 'Add New Property'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Property {propertyToEdit ? 'updated' : 'created'} successfully!</div>}
      
      <div className="form-progress">
        <div className="progress-step active">1. Basic Info</div>
        <div className="progress-step">2. Property Details</div>
        <div className="progress-step">3. Location</div>
        <div className="progress-step">4. Images</div>
      </div>
      
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-section">
          <h3><i className="fas fa-info-circle"></i> Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price (DH)*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3><i className="fas fa-home"></i> Property Details</h3>
          
          <div className="form-group">
            <label htmlFor="surface_area">Surface Area (m²)*</label>
            <input
              type="number"
              id="surface_area"
              name="surface_area"
              value={formData.surface_area}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rooms">Rooms*</label>
              <input
                type="number"
                id="rooms"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms*</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms*</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="furnished"
              name="furnished"
              checked={formData.furnished}
              onChange={handleChange}
            />
            <label htmlFor="furnished">Furnished</label>
          </div>
          
          <div className="form-group">
            <label htmlFor="property_type">Property Type*</label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              required
            >
              {propertyTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status*</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h3><i className="fas fa-map-marker-alt"></i> Location Information</h3>
          
          <div className="form-group">
            <label htmlFor="city">City*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address*</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="postal_code">Postal Code</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="0.000001"
                min="-90"
                max="90"
                placeholder="e.g. 34.123456"
              />
              <small className="form-text">Value between -90 and 90 with max 3 digits before decimal</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="0.000001"
                min="-180"
                max="180"
                placeholder="e.g. -6.123456"
              />
              <small className="form-text">Value between -180 and 180 with max 3 digits before decimal</small>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3><i className="fas fa-images"></i> Images</h3>
          
          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <div className="file-upload-container">
              <div className="file-upload-box">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop images here or click to browse</p>
                <small>Supported formats: JPEG, PNG, GIF, WEBP (Max 5MB per file)</small>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="file-input"
                />
              </div>
            </div>
          </div>
          
          {images.length > 0 && (
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <label htmlFor="is_active">Active Listing</label>
        </div>
        
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel} 
              className="cancel-btn"
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Cancel'}
            </button>
          )}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> 
                Submitting...
              </>
            ) : propertyToEdit ? (
              <>
                <i className="fas fa-save"></i>
                Update Property
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                Create Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PropertyForm;
