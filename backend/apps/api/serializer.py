from rest_framework import serializers
from .models import Property, PropertyImage
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    phone = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'name']
    
    def get_name(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        return obj.username

class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = PropertyImage
        fields = '__all__'
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(
            max_length=5242880,  # 5MB max
            allow_empty_file=False,
            use_url=False,
            error_messages={
                'invalid_image': 'Upload a valid image (JPEG, PNG, GIF, WEBP). The file you uploaded was either not an image or a corrupted image.',
                'empty': 'The submitted file is empty.',
                'max_length': 'The image file is too large. Maximum size is 5MB.'
            }
        ),
        write_only=True,
        required=False
    )
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, required=False, source='user')
    
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'published_at')
        # Make all fields optional for easier form handling
        extra_kwargs = {
            'title': {'required': True},
            'description': {'required': True},
            'price': {'required': True},
            'surface_area': {'required': True},
            'rooms': {'required': True},
            'bedrooms': {'required': True},
            'bathrooms': {'required': True},
            'property_type': {'required': True},
            'status': {'required': True},
            'city': {'required': True},
            'address': {'required': True},
            'latitude': {'required': False},
            'longitude': {'required': False},
            'postal_code': {'required': False},
            'is_active': {'required': False},
            'furnished': {'required': False},
            'user': {'required': False}
        }
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # Get the user from the form data if provided
        user_id = self.context.get('request').data.get('user_id') if self.context.get('request') else None
        
        if user_id:
            try:
                # Use the user ID from the form data
                validated_data['user'] = User.objects.get(id=user_id)
                print(f"Using user ID from form data: {user_id}")
            except User.DoesNotExist:
                print(f"User with ID {user_id} not found")
        
        # If user is still not set, try to get from request.user
        if 'user' not in validated_data:
            request = self.context.get('request')
            if request and hasattr(request, 'user') and request.user.is_authenticated:
                validated_data['user'] = request.user
                print(f"Using authenticated user: {request.user.username} (ID: {request.user.id})")
        
        # Print validated data for debugging
        print("Creating property with data:", validated_data)
        print("User for this property:", validated_data.get('user', 'No user provided'))
        
        try:
            property = Property.objects.create(**validated_data)
            
            for image in uploaded_images:
                PropertyImage.objects.create(property=property, image=image)
                
            return property
        except Exception as e:
            print(f"Error creating property: {e}")
            raise
    
    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # Print validated data for debugging
        print("Updating property with data:", validated_data)
        
        try:
            # Update property fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            
            # Add new images
            for image in uploaded_images:
                PropertyImage.objects.create(property=instance, image=image)
                
            return instance
        except Exception as e:
            print(f"Error updating property: {e}")
            raise
