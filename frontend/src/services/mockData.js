// Mock data for the Real Estate Advertisement application
// This provides sample data when the backend API is not available

export const mockProperties = [
  {
    id: '1',
    title: 'Authentic Riad in the Heart of the Medina',
    description: 'Exquisite traditional riad located in the historic Medina, featuring authentic Moroccan architecture with modern amenities. This stunning property includes a central courtyard with fountain, intricate tilework, carved cedar wood ceilings, and a rooftop terrace with panoramic views.',
    price: 2300000,
    surface_area: 200,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 2,
    city: 'Marrakech',
    address: '27 Derb El Ferrane, Medina',
    property_type: 'riad',
    status: 'for_sale',
    featured: true,
    created_at: '2023-05-15T10:30:00Z',
    updated_at: '2023-05-15T10:30:00Z',
    images: [
      { id: '101', image_url: 'https://images.unsplash.com/photo-1527359443443-84a48aec73d2' },
      { id: '102', image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' },
    ],
    user: {
      id: '1',
      username: 'yasser',
      name: 'Yasser Khattabi',
      email: 'yasser@example.com',
      phone: '+212612345678'
    }
  },
];

// Mock users data
export const mockUsers = [
  {
    id: '1',
    username: 'yasser',
    name: 'Yasser Khattabi',
    email: 'yasser@example.com',
    phone: '+212612345678',
    bio: 'Real estate investor and property developer with over 5 years of experience in the Moroccan market. Specializing in luxury properties and traditional riads.',
    role: 'user',
    properties: ['1']
  },
  {
    id: '2',
    username: 'zineb',
    name: 'Zineb Alaoui',
    email: 'zineb@example.com',
    phone: '+212698765432',
    bio: 'Interior designer and real estate consultant helping clients find their perfect homes. Passionate about traditional Moroccan architecture and modern design.',
    role: 'user',
    properties: ['2', '4', '6']
  }
];
