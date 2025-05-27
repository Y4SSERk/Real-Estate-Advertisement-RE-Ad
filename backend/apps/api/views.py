from rest_framework.decorators import api_view  
from rest_framework.response import Response  
from rest_framework import status
from .models import Property, PropertyImage
from apps.users.models import User
from .serializer import PropertySerializer, PropertyImageSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

@api_view(['GET', 'POST'])
def get_properties(request):  
    if request.method == 'GET':
        # Check if user filter is provided
        user_id = request.query_params.get('user', None)
        
        # Filter properties by user if user_id is provided
        if user_id:
            properties = Property.objects.filter(user_id=user_id)
        else:
            properties = Property.objects.all()
            
        serializer = PropertySerializer(properties, many=True, context={'request': request})  
        return Response(serializer.data)
    elif request.method == 'POST':
        print("POST data:", request.data)
        serializer = PropertySerializer(data=request.data, context={'request': request})  
        if serializer.is_valid():  
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED)  
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def property_detail(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        serializer = PropertySerializer(property, context={'request': request})
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        print("PUT data:", request.data)
        serializer = PropertySerializer(property, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        property.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def register_user(request):
    """Register a new user"""
    if request.method == 'POST':
        try:
            data = request.data
            User = get_user_model()
            
            # Validate required fields
            required_fields = ['username', 'email', 'password']
            for field in required_fields:
                if field not in data or not data[field]:
                    return Response(
                        {'error': f'{field} is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Check if username or email already exists
            if User.objects.filter(username=data['username']).exists():
                return Response(
                    {'error': 'Username already exists'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if User.objects.filter(email=data['email']).exists():
                return Response(
                    {'error': 'Email already exists'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create new user with create_user method to ensure proper setup
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],  # create_user will hash the password automatically
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                phone=data.get('phone', '')
            )
            
            # Ensure the user is active and saved
            user.is_active = True
            user.save()
            
            # Return user data (excluding password)
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
            
        except KeyError as e:
            return Response(
                {'error': f'Missing required field: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Error creating user: {e}")
            return Response(
                {'error': f'Registration failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['POST'])
def login_user(request):
    """Login a user"""
    if request.method == 'POST':
        try:
            data = request.data
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return Response(
                    {'error': 'Username and password are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the user model and authenticate
            User = get_user_model()
            
            # Try to authenticate by username
            from django.contrib.auth import authenticate
            user = authenticate(username=username, password=password)
            
            # If authentication by username fails, try by email
            if user is None:
                try:
                    # Find user by email
                    email_user = User.objects.get(email=username)
                    # Try to authenticate with found username
                    user = authenticate(username=email_user.username, password=password)
                except User.DoesNotExist:
                    pass
            
            if user is not None:
                # Authentication successful
                serializer = UserSerializer(user)
                return Response({
                    'user': serializer.data,
                    'message': 'Login successful'
                })
            else:
                # Authentication failed
                return Response(
                    {'error': 'Invalid credentials'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            print(f"Error logging in: {e}")
            return Response(
                {'error': f'Login failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )