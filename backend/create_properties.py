import os
import django
import random
from datetime import datetime, timedelta
from decimal import Decimal

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Import models after Django setup
from django.contrib.auth import get_user_model
from apps.api.models import Property, PropertyImage

User = get_user_model()

# Function to create users if they don't exist
def create_users():
    users = []
    
    # Create Yasser user if doesn't exist
    try:
        yasser = User.objects.get(username='yasser')
        print("User Yasser already exists")
    except User.DoesNotExist:
        yasser = User.objects.create_user(
            username='yasser',
            email='yasser@example.com',
            password='password123',
            first_name='Yasser',
            last_name='Khattabi',
            phone='+212612345678',
            role='user'
        )
        print("Created user Yasser")
    users.append(yasser)
    
    # Create Zineb user if doesn't exist
    try:
        zineb = User.objects.get(username='zineb')
        print("User Zineb already exists")
    except User.DoesNotExist:
        zineb = User.objects.create_user(
            username='zineb',
            email='zineb@example.com',
            password='password123',
            first_name='Zineb',
            last_name='Alaoui',
            phone='+212698765432',
            role='user'
        )
        print("Created user Zineb")
    users.append(zineb)
    
    return users

# Sample property data
def create_properties(users):
    # Moroccan cities
    cities = [
        'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir', 
        'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'El Jadida', 'Essaouira'
    ]
    
    # Property types
    property_types = [
        'apartment', 'house', 'villa', 'riad', 'studio', 'duplex', 
        'penthouse', 'office', 'shop'
    ]
    
    # Property statuses
    statuses = ['for_sale', 'for_rent']
    
    # Sample property descriptions
    descriptions = [
        "This beautiful property offers modern amenities in a prime location. Featuring spacious rooms, abundant natural light, and high-quality finishes throughout. Perfect for families or professionals seeking comfort and convenience.",
        
        "Elegant property in a prestigious neighborhood with stunning views. The interior boasts premium materials, contemporary design, and state-of-the-art appliances. An exceptional opportunity for discerning buyers.",
        
        "Charming property with character and history, recently renovated to combine traditional elements with modern comforts. Located in a vibrant area with excellent access to shops, restaurants, and cultural attractions.",
        
        "Luxurious property offering exceptional comfort and privacy. The thoughtful layout maximizes space and functionality, while the premium fixtures and fittings ensure a sophisticated living experience.",
        
        "Bright and airy property in a sought-after location, featuring an open floor plan and quality craftsmanship. The property benefits from excellent natural light and a practical layout ideal for modern living.",
        
        "Stunning property with panoramic views in an exclusive area. This exceptional home combines elegant architecture with practical living spaces, creating the perfect balance of luxury and comfort.",
        
        "Contemporary property designed with attention to detail and quality materials. The versatile spaces can be adapted to various lifestyles, making this an ideal home for those seeking both style and functionality.",
        
        "Unique property with distinctive character in a prime setting. The thoughtful design maximizes the use of space while creating a warm and inviting atmosphere throughout.",
        
        "Impressive property offering exceptional value in a developing area. With spacious rooms and quality construction, this represents an excellent opportunity for both living and investment."
    ]
    
    # Property features
    property_data = [
        {
            "title": "Modern Apartment in City Center",
            "property_type": "apartment",
            "rooms": 4,
            "bedrooms": 2,
            "bathrooms": 1,
            "surface_area": 85,
            "furnished": True,
            "price_range": (800000, 1200000)  # For sale
        },
        {
            "title": "Luxury Villa with Pool",
            "property_type": "villa",
            "rooms": 8,
            "bedrooms": 4,
            "bathrooms": 3,
            "surface_area": 350,
            "furnished": True,
            "price_range": (3500000, 5000000)  # For sale
        },
        {
            "title": "Traditional Riad in Medina",
            "property_type": "riad",
            "rooms": 6,
            "bedrooms": 3,
            "bathrooms": 2,
            "surface_area": 200,
            "furnished": True,
            "price_range": (2000000, 3000000)  # For sale
        },
        {
            "title": "Cozy Studio Apartment",
            "property_type": "studio",
            "rooms": 1,
            "bedrooms": 1,
            "bathrooms": 1,
            "surface_area": 45,
            "furnished": True,
            "price_range": (4500, 7000)  # For rent (monthly)
        },
        {
            "title": "Family House with Garden",
            "property_type": "house",
            "rooms": 5,
            "bedrooms": 3,
            "bathrooms": 2,
            "surface_area": 180,
            "furnished": False,
            "price_range": (1500000, 2500000)  # For sale
        },
        {
            "title": "Spacious Duplex in Residential Area",
            "property_type": "duplex",
            "rooms": 5,
            "bedrooms": 3,
            "bathrooms": 2,
            "surface_area": 150,
            "furnished": False,
            "price_range": (1200000, 1800000)  # For sale
        },
        {
            "title": "Penthouse with Panoramic Views",
            "property_type": "penthouse",
            "rooms": 4,
            "bedrooms": 2,
            "bathrooms": 2,
            "surface_area": 120,
            "furnished": True,
            "price_range": (2000000, 3000000)  # For sale
        },
        {
            "title": "Commercial Office Space",
            "property_type": "office",
            "rooms": 3,
            "bedrooms": 0,
            "bathrooms": 1,
            "surface_area": 80,
            "furnished": False,
            "price_range": (8000, 12000)  # For rent (monthly)
        },
        {
            "title": "Retail Shop in Shopping District",
            "property_type": "shop",
            "rooms": 2,
            "bedrooms": 0,
            "bathrooms": 1,
            "surface_area": 65,
            "furnished": False,
            "price_range": (7000, 10000)  # For rent (monthly)
        },
        {
            "title": "Renovated Apartment Near Beach",
            "property_type": "apartment",
            "rooms": 3,
            "bedrooms": 2,
            "bathrooms": 1,
            "surface_area": 90,
            "furnished": True,
            "price_range": (900000, 1400000)  # For sale
        },
        {
            "title": "Elegant Villa in Gated Community",
            "property_type": "villa",
            "rooms": 7,
            "bedrooms": 4,
            "bathrooms": 3,
            "surface_area": 300,
            "furnished": True,
            "price_range": (3000000, 4500000)  # For sale
        },
        {
            "title": "Charming Riad with Courtyard",
            "property_type": "riad",
            "rooms": 5,
            "bedrooms": 3,
            "bathrooms": 2,
            "surface_area": 180,
            "furnished": True,
            "price_range": (1800000, 2800000)  # For sale
        },
        {
            "title": "Modern House in Quiet Neighborhood",
            "property_type": "house",
            "rooms": 6,
            "bedrooms": 3,
            "bathrooms": 2,
            "surface_area": 200,
            "furnished": False,
            "price_range": (1700000, 2600000)  # For sale
        },
        {
            "title": "Luxury Apartment with Terrace",
            "property_type": "apartment",
            "rooms": 4,
            "bedrooms": 2,
            "bathrooms": 2,
            "surface_area": 110,
            "furnished": True,
            "price_range": (1300000, 1900000)  # For sale
        },
        {
            "title": "Furnished Apartment for Rent",
            "property_type": "apartment",
            "rooms": 3,
            "bedrooms": 2,
            "bathrooms": 1,
            "surface_area": 85,
            "furnished": True,
            "price_range": (5500, 8000)  # For rent (monthly)
        }
    ]
    
    # Create properties
    properties_created = 0
    
    for i, prop_data in enumerate(property_data):
        # Alternate between users
        user = users[i % len(users)]
        
        # Determine status (for_sale or for_rent based on price range)
        status = 'for_sale' if prop_data["price_range"][0] > 100000 else 'for_rent'
        
        # Generate random price within range
        price = random.randint(prop_data["price_range"][0], prop_data["price_range"][1])
        
        # Random city
        city = random.choice(cities)
        
        # Random address
        street_number = random.randint(1, 100)
        streets = ["Mohammed V Avenue", "Hassan II Street", "Independence Avenue", 
                  "Al Massira Street", "Al Andalus Boulevard", "Zerktouni Boulevard", 
                  "Anfa Road", "Al Farabi Street", "Ibn Sina Avenue", "Al Moutanabbi Street"]
        address = f"{street_number} {random.choice(streets)}"
        
        # Random postal code
        postal_code = f"{random.randint(10000, 99999)}"
        
        # Random coordinates (approximate for Morocco)
        latitude = random.uniform(27.6666, 35.9166)
        longitude = random.uniform(-13.1666, -1.0000)
        
        # Random description
        description = random.choice(descriptions)
        
        # Random dates within the last year
        days_ago = random.randint(1, 365)
        published_date = datetime.now() - timedelta(days=days_ago)
        
        # Create the property
        try:
            property = Property.objects.create(
                title=f"{prop_data['title']} in {city}",
                description=description,
                price=Decimal(str(price)),
                surface_area=prop_data["surface_area"],
                rooms=prop_data["rooms"],
                bedrooms=prop_data["bedrooms"],
                bathrooms=prop_data["bathrooms"],
                furnished=prop_data["furnished"],
                property_type=prop_data["property_type"],
                status=status,
                city=city,
                address=address,
                postal_code=postal_code,
                latitude=Decimal(str(latitude)),
                longitude=Decimal(str(longitude)),
                published_at=published_date,
                user=user,
                is_active=True
            )
            
            print(f"Created property: {property.title} (Owner: {user.username})")
            properties_created += 1
            
        except Exception as e:
            print(f"Error creating property: {e}")
    
    return properties_created

if __name__ == "__main__":
    print("Creating users...")
    users = create_users()
    
    print("\nCreating properties...")
    num_properties = create_properties(users)
    
    print(f"\nCreated {num_properties} properties successfully!")
    print("You can now log in with the following credentials:")
    print("Username: yasser, Password: password123")
    print("Username: zineb, Password: password123")
