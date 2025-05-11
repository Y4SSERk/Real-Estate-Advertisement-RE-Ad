from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator

User = get_user_model()

class Property(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ('apartment', 'Apartment'),                     # Self-contained unit in a multi-story building
        ('studio', 'Studio'),                           # Small one-room apartment with kitchenette and bathroom
        ('duplex', 'Duplex'),                           # Two-floor apartment connected by internal stairs
        ('triplex', 'Triplex'),                         # Three-floor apartment connected by internal stairs
        ('penthouse', 'Penthouse'),                     # Luxury apartment on the top floor of a building
        ('house', 'House'),                             # Standalone residential building, typically with a yard or garden
        ('villa', 'Villa'),                             # Large, luxurious house often in a rural or semi-rural area
        ('riad', 'Riad'),                               # Traditional Moroccan house with an interior garden or courtyard
        ('urban_land', 'Urban Land'),                   # Land in a city or urban area, suitable for development
        ('agricultural_land', 'Agricultural Land'),     # Land suitable for farming or agricultural use
        ('farm_ranch', 'Farm / Ranch'),                 # Large area of land used for agriculture or livestock
        ('office', 'Office'),                           # Commercial space for business operations
        ('shop', 'Shop / Commercial Space'),            # Retail space for selling goods or services
        ('warehouse', 'Warehouse / Storage'),           # Large building for storing goods or materials
        ('factory', 'Factory'),                         # Industrial building for manufacturing or production
        ('restaurant', 'Restaurant / Café'),            # Establishment serving food and drinks
        ('hotel', 'Hotel / Guesthouse'),                # Establishment providing lodging and meals
        ('building', 'Building'),                       # General term for a structure, can be residential or commercial
        ('showroom', 'Showroom'),                       # Space for displaying products or services
        ('parking', 'Parking / Garage'),                # Designated area for parking vehicles
    ]
    
    STATUS_CHOICES = [
        ('for_sale', 'For Sale'),
        ('for_rent', 'For Rent'),
        ('sold', 'Sold'),
        ('rented', 'Rented'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    
    # Property Details
    surface_area = models.PositiveIntegerField(help_text="Area in square meters")
    rooms = models.PositiveIntegerField()
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    furnished = models.BooleanField(default=False)
    property_type = models.CharField(
        max_length=50,
        choices=PROPERTY_TYPE_CHOICES
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='for_sale'
    )
    
    # Location Information
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    
    # Metadata
    published_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='properties'
    )
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Properties"
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['price']),
            models.Index(fields=['property_type']),
            models.Index(fields=['city']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.get_property_type_display()}) - {self.city}"

class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(
        upload_to='property_images/',
        help_text="Upload property photos"
    )
    is_cover = models.BooleanField(
        default=False,
        help_text="Set as cover image"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_cover', 'created_at']
    
    def __str__(self):
        return f"Image for {self.property.title}"