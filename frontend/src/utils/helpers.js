/**
 * Helper utility functions for the Real Estate Advertisement application
 */

/**
 * Format price as currency
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: 'MAD')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = 'MAD') => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(price);
};

/**
 * Format date to a readable string
 * @param {string} dateString - The date string to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Capitalize first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get file extension from a file name
 * @param {string} filename - The file name
 * @returns {string} - The file extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Check if a file is an image based on its extension
 * @param {string} filename - The file name
 * @returns {boolean} - True if the file is an image
 */
export const isImageFile = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
};

/**
 * Convert file size in bytes to a human-readable format
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Human-readable file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create URL query string from an object of parameters
 * @param {Object} params - The parameters object
 * @returns {string} - URL query string
 */
export const createQueryString = (params) => {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

/**
 * Parse URL query string into an object
 * @param {string} queryString - The query string to parse
 * @returns {Object} - Parsed parameters object
 */
export const parseQueryString = (queryString) => {
  if (!queryString || queryString === '?') return {};
  
  const query = queryString.startsWith('?') 
    ? queryString.substring(1) 
    : queryString;
    
  return query
    .split('&')
    .reduce((params, param) => {
      const [key, value] = param.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      return params;
    }, {});
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if the email is valid
 */
export const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if the phone number is valid
 */
export const isValidPhone = (phone) => {
  // Basic validation for international phone numbers
  const re = /^\+?[0-9]{10,15}$/;
  return re.test(String(phone).replace(/\s+/g, ''));
};

/**
 * Get current viewport dimensions
 * @returns {Object} - Object with width and height properties
 */
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
};

/**
 * Check if the device is mobile based on viewport width
 * @param {number} breakpoint - The mobile breakpoint in pixels
 * @returns {boolean} - True if the device is mobile
 */
export const isMobileDevice = (breakpoint = 768) => {
  return getViewportDimensions().width < breakpoint;
};

/**
 * Scroll to element by ID with smooth behavior
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Offset from the top in pixels
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

/**
 * Scroll to top of the page with smooth behavior
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
