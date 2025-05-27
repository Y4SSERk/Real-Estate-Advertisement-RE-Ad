import React, { useState, useEffect } from 'react';
import './styles/PropertyGallery.css';

/**
 * PropertyGallery component for displaying property images in a gallery format
 * @param {Array} images - Array of image objects
 * @returns {JSX.Element} - A gallery component for property images
 */
const PropertyGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(null);

  // Update active image when images prop changes
  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0]);
    } else {
      setActiveImage(null);
    }
  }, [images]);

  // Handle case where there are no images
  if (!images || images.length === 0) {
    return (
      <div className="property-gallery">
        <div className="gallery-main no-images">
          <i className="fas fa-home"></i>
          <p>No images available for this property</p>
        </div>
      </div>
    );
  }

  // Handle case where activeImage is not set yet
  if (!activeImage) {
    return (
      <div className="property-gallery">
        <div className="gallery-main loading-gallery">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="property-gallery">
      <div className="gallery-main">
        <img src={activeImage.image} alt="Property" />
      </div>
      
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`thumbnail ${activeImage.id === img.id ? 'active' : ''}`}
              onClick={() => setActiveImage(img)}
            >
              <img src={img.image} alt={`Property thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
