// Mock data for the Real Estate Advertisement application
// This provides sample data when the backend API is not available

export const mockProperties = [
  {
    id: '1',
    title: 'Modern Apartment in Casablanca',
    description: 'Beautiful modern apartment with sea view in the heart of Casablanca. This property features high-quality finishes, an open floor plan, and abundant natural light. Perfect for professionals or small families looking for comfort and convenience.',
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
    user: {
      id: '1',
      username: 'yasser',
      name: 'Yasser Khattabi',
      email: 'yasser@example.com',
      phone: '+212612345678'
    }
  },
  {
    id: '2',
    title: 'Traditional Riad in Marrakech',
    description: 'Authentic riad with beautiful courtyard and pool in the Medina of Marrakech. This property preserves traditional Moroccan architecture while offering modern comforts. Features include intricate tilework, carved wood details, and a rooftop terrace with views of the Atlas Mountains.',
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
    user: {
      id: '2',
      username: 'zineb',
      name: 'Zineb Alaoui',
      email: 'zineb@example.com',
      phone: '+212698765432'
    }
  },
  {
    id: '3',
    title: 'Luxury Villa in Tangier',
    description: 'Stunning villa with panoramic views of the Mediterranean Sea in Tangier. This exceptional property offers luxury living with high ceilings, marble floors, and a private garden with swimming pool. Perfect for those seeking privacy and elegance.',
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
    user: {
      id: '1',
      username: 'yasser',
      name: 'Yasser Khattabi',
      email: 'yasser@example.com',
      phone: '+212612345678'
    }
  },
  {
    id: '4',
    title: 'Cozy Apartment in Rabat',
    description: 'Comfortable apartment in a quiet neighborhood of Rabat. This well-maintained property offers a practical layout, modern kitchen, and is close to schools, shops, and public transportation. Ideal for first-time buyers or investors.',
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
    user: {
      id: '2',
      username: 'zineb',
      name: 'Zineb Alaoui',
      email: 'zineb@example.com',
      phone: '+212698765432'
    }
  },
  {
    id: '5',
    title: 'Modern House in Agadir',
    description: 'Beautiful modern house with garden near the beach in Agadir. This contemporary property features an open concept design, large windows, and quality finishes throughout. The outdoor space includes a landscaped garden and terrace perfect for entertaining.',
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
    user: {
      id: '1',
      username: 'yasser',
      name: 'Yasser Khattabi',
      email: 'yasser@example.com',
      phone: '+212612345678'
    }
  },
  {
    id: '6',
    title: 'Apartment for Rent in Fez',
    description: 'Furnished apartment for rent in the new city of Fez. This well-appointed property comes fully furnished with modern amenities and is located in a secure building with elevator. Close to universities, shopping centers, and public transportation.',
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
    user: {
      id: '2',
      username: 'zineb',
      name: 'Zineb Alaoui',
      email: 'zineb@example.com',
      phone: '+212698765432'
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
    bio: 'Real estate investor and property developer with over 5 years of experience in the Moroccan market. Specializing in luxury properties and modern apartments.',
    role: 'user',
    properties: ['1', '3', '5']
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
