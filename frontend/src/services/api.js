import axios from 'axios';
import { mockProperties, mockUsers } from './mockData';

// Flag to use mock data when backend is unavailable
const USE_MOCK_DATA = true;

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add request interceptor for authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication Services
export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await API.post('/auth/login/', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  // Register user
  register: async (userData) => {
    const response = await API.post('/auth/register/', userData);
    return response.data;
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    const response = await API.get('/users/me/');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    const response = await API.put('/users/me/', userData);
    return response.data;
  },
  
  // Change password
  changePassword: async (passwordData) => {
    const response = await API.post('/users/change-password/', passwordData);
    return response.data;
  },
};

// Property Services
export const propertyService = {
  // Get all properties with optional filters
  getProperties: async (filters = {}) => {
    try {
      if (USE_MOCK_DATA) {
        console.log('Using mock data for properties');
        // Apply filters to mock data
        let filteredProperties = [...mockProperties];
        
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredProperties = filteredProperties.filter(property => 
            property.title.toLowerCase().includes(searchTerm) ||
            property.description.toLowerCase().includes(searchTerm) ||
            property.city.toLowerCase().includes(searchTerm) ||
            property.address.toLowerCase().includes(searchTerm)
          );
        }
        
        if (filters.property_type) {
          filteredProperties = filteredProperties.filter(property => 
            property.property_type === filters.property_type
          );
        }
        
        if (filters.status) {
          filteredProperties = filteredProperties.filter(property => 
            property.status === filters.status
          );
        }
        
        return filteredProperties;
      }
      
      const response = await API.get('/properties/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Fallback to mock data if API call fails
      return mockProperties;
    }
  },
  
  // Get property by ID
  getPropertyById: async (id) => {
    try {
      if (USE_MOCK_DATA) {
        console.log('Using mock data for property details');
        const property = mockProperties.find(p => p.id === id);
        if (!property) {
          throw new Error('Property not found');
        }
        return property;
      }
      
      const response = await API.get(`/properties/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching property details:', error);
      // Fallback to mock data if API call fails
      const property = mockProperties.find(p => p.id === id);
      if (!property) {
        throw new Error('Property not found');
      }
      return property;
    }
  },
  
  // Get featured properties
  getFeaturedProperties: async () => {
    try {
      if (USE_MOCK_DATA) {
        console.log('Using mock data for featured properties');
        return mockProperties.filter(p => p.featured);
      }
      
      const response = await API.get('/properties/featured/');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      // Fallback to mock data if API call fails
      return mockProperties.filter(p => p.featured);
    }
  },
  
  // Create new property
  createProperty: async (propertyData) => {
    try {
      if (USE_MOCK_DATA) {
        console.log('Using mock data for creating property');
        // Simulate creating a property with mock data
        const newProperty = {
          id: String(mockProperties.length + 1),
          ...propertyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          images: [],
          user: mockUsers[0] // Default to first user
        };
        
        return newProperty;
      }
      
      const response = await API.post('/properties/', propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },
  
  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      if (USE_MOCK_DATA) {
        console.log('Using mock data for updating property');
        // Find the property to update
        const propertyIndex = mockProperties.findIndex(p => p.id === id);
        if (propertyIndex === -1) {
          throw new Error('Property not found');
        }
        
        // Create updated property
        const updatedProperty = {
          ...mockProperties[propertyIndex],
          ...propertyData,
          updated_at: new Date().toISOString()
        };
        
        return updatedProperty;
      }
      
      const response = await API.put(`/properties/${id}/`, propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },
  
  // Delete property
  deleteProperty: async (id) => {
    try {
      if (USE_MOCK_DATA) {
        console.log('Using mock data for deleting property');
        // Check if property exists
        const propertyIndex = mockProperties.findIndex(p => p.id === id);
        if (propertyIndex === -1) {
          throw new Error('Property not found');
        }
        
        return { success: true, message: 'Property deleted successfully' };
      }
      
      const response = await API.delete(`/properties/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },
  
  // Upload property images
  uploadPropertyImages: async (id, images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    
    const response = await API.post(`/properties/${id}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Delete property image
  deletePropertyImage: async (propertyId, imageId) => {
    const response = await API.delete(`/properties/${propertyId}/images/${imageId}/`);
    return response.data;
  },
};

// Contact Services
export const contactService = {
  // Send contact message
  sendContactMessage: async (messageData) => {
    const response = await API.post('/contact/', messageData);
    return response.data;
  },
  
  // Send property inquiry
  sendPropertyInquiry: async (propertyId, inquiryData) => {
    const response = await API.post(`/properties/${propertyId}/inquiries/`, inquiryData);
    return response.data;
  },
};

// User Property Services
export const userPropertyService = {
  // Get user's properties
  getUserProperties: async () => {
    const response = await API.get('/users/properties/');
    return response.data;
  },
  
  // Get user's favorite properties
  getFavoriteProperties: async () => {
    const response = await API.get('/users/favorites/');
    return response.data;
  },
  
  // Add property to favorites
  addToFavorites: async (propertyId) => {
    const response = await API.post(`/users/favorites/${propertyId}/`);
    return response.data;
  },
  
  // Remove property from favorites
  removeFromFavorites: async (propertyId) => {
    const response = await API.delete(`/users/favorites/${propertyId}/`);
    return response.data;
  },
};

// Legacy function for backward compatibility
export const fetchData = async () => {  
  const res = await axios.get('http://localhost:8000/api/hello/');  
  return res.data;  
};