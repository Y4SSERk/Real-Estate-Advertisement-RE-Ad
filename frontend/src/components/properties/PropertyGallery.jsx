import React, { useState, useEffect, useCallback, memo } from 'react';
import './styles/PropertyGallery.css';

// Image placeholder component for lazy loading
const LazyImage = memo(({ src, alt, onLoad }) => {
  const [loaded, setLoaded] = useState(false);
  
  const handleLoad = useCallback(() => {
    setLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);
  
  return (
    <div className={`lazy-image-container ${loaded ? 'loaded' : ''}`}>
      {!loaded && <div className="image-placeholder"></div>}
      <img 
        src={src} 
        alt={alt} 
        loading="lazy" 
        onLoad={handleLoad} 
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
});

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
        <LazyImage 
          src={activeImage.image} 
          alt="Property" 
        />
      </div>
      
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`thumbnail ${activeImage.id === img.id ? 'active' : ''}`}
              onClick={() => setActiveImage(img)}
            >
              <LazyImage 
                src={img.image} 
                alt={`Property thumbnail ${index + 1}`} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
