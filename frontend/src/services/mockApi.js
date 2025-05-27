// Mock API service for development and testing
import { v4 as uuidv4 } from 'uuid';

// Sample property data
const mockProperties = [
  {
    id: '1',
    title: 'Modern Apartment in Casablanca',
    description: 'Beautiful modern apartment with sea view in the heart of Casablanca.',
    price: 1200000,
    surface_area: 120,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    city: 'Casablanca',
    address: '123 Ocean Drive',
    property_type: 'apartment',
    status: 'for_sale',
    featured: true,
    created_at: '2023-05-15T10:30:00Z',
    updated_at: '2023-05-15T10:30:00Z',
    images: [
      { id: '101', image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267' },
      { id: '102', image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688' },
    ],
  },
  {
    id: '2',
    title: 'Traditional Riad in Marrakech',
    description: 'Authentic riad with beautiful courtyard and pool in the Medina of Marrakech.',
    price: 3500000,
    surface_area: 250,
    rooms: 6,
    bedrooms: 4,
    bathrooms: 3,
    city: 'Marrakech',
    address: '45 Medina Street',
    property_type: 'riad',
    status: 'for_sale',
    featured: true,
    created_at: '2023-06-20T14:15:00Z',
    updated_at: '2023-06-20T14:15:00Z',
    images: [
      { id: '201', image_url: 'https://images.unsplash.com/photo-1527359443443-84a48aec73d2' },
      { id: '202', image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' },
    ],
  },
  {
    id: '3',
    title: 'Luxury Villa in Tangier',
    description: 'Stunning villa with panoramic views of the Mediterranean Sea in Tangier.',
    price: 5800000,
    surface_area: 450,
    rooms: 8,
    bedrooms: 5,
    bathrooms: 4,
    city: 'Tangier',
    address: '78 Mediterranean Boulevard',
    property_type: 'villa',
    status: 'for_sale',
    featured: true,
    created_at: '2023-07-05T09:45:00Z',
    updated_at: '2023-07-05T09:45:00Z',
    images: [
      { id: '301', image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914' },
      { id: '302', image_url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83' },
    ],
  },
  {
    id: '4',
    title: 'Cozy Apartment in Rabat',
    description: 'Comfortable apartment in a quiet neighborhood of Rabat.',
    price: 850000,
    surface_area: 85,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    city: 'Rabat',
    address: '12 Peace Street',
    property_type: 'apartment',
    status: 'for_sale',
    featured: false,
    created_at: '2023-08-10T11:20:00Z',
    updated_at: '2023-08-10T11:20:00Z',
    images: [
      { id: '401', image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb' },
      { id: '402', image_url: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28' },
    ],
  },
  {
    id: '5',
    title: 'Modern House in Agadir',
    description: 'Beautiful modern house with garden near the beach in Agadir.',
    price: 2300000,
    surface_area: 200,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 2,
    city: 'Agadir',
    address: '56 Beach Avenue',
    property_type: 'house',
    status: 'for_sale',
    featured: false,
    created_at: '2023-09-15T13:40:00Z',
    updated_at: '2023-09-15T13:40:00Z',
    images: [
      { id: '501', image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6' },
      { id: '502', image_url: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126' },
    ],
  },
  {
    id: '6',
    title: 'Apartment for Rent in Fez',
    description: 'Furnished apartment for rent in the new city of Fez.',
    price: 5000,
    surface_area: 90,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    city: 'Fez',
    address: '34 New City Street',
    property_type: 'apartment',
    status: 'for_rent',
    featured: true,
    created_at: '2023-10-20T16:25:00Z',
    updated_at: '2023-10-20T16:25:00Z',
    images: [
      { id: '601', image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2' },
      { id: '602', image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858' },
    ],
  },
];

// Mock user data
const mockUsers = [
  {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+212612345678',
    role: 'user',
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    phone: '+212698765432',
    role: 'admin',
  },
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Property Services
export const mockPropertyService = {
  // Get all properties with optional filters
  getProperties: async (filters = {}) => {
    await delay(500); // Simulate network delay
    
    let filteredProperties = [...mockProperties];
    
    // Apply filters
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      filteredProperties = filteredProperties.filter(property => 
        property.title.toLowerCase().includes(searchTermLower) ||
        property.description.toLowerCase().includes(searchTermLower) ||
        property.city.toLowerCase().includes(searchTermLower) ||
        property.address.toLowerCase().includes(searchTermLower)
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
    
    if (filters.min_price) {
      filteredProperties = filteredProperties.filter(property => 
        property.price >= Number(filters.min_price)
      );
    }
    
    if (filters.max_price) {
      filteredProperties = filteredProperties.filter(property => 
        property.price <= Number(filters.max_price)
      );
    }
    
    return filteredProperties;
  },
  
  // Get property by ID
  getPropertyById: async (id) => {
    await delay(300);
    const property = mockProperties.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return property;
  },
  
  // Get featured properties
  getFeaturedProperties: async () => {
    await delay(400);
    return mockProperties.filter(p => p.featured);
  },
  
  // Create new property
  createProperty: async (propertyData) => {
    await delay(600);
    const newProperty = {
      id: uuidv4(),
      ...propertyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [],
    };
    mockProperties.push(newProperty);
    return newProperty;
  },
  
  // Update property
  updateProperty: async (id, propertyData) => {
    await delay(500);
    const index = mockProperties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const updatedProperty = {
      ...mockProperties[index],
      ...propertyData,
      updated_at: new Date().toISOString(),
    };
    
    mockProperties[index] = updatedProperty;
    return updatedProperty;
  },
  
  // Delete property
  deleteProperty: async (id) => {
    await delay(400);
    const index = mockProperties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    mockProperties.splice(index, 1);
    return { success: true };
  },
};

// Export mock services to replace the real API during development
export default {
  propertyService: mockPropertyService,
};
