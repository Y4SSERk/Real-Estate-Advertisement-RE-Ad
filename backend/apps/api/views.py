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
            
            # Check if username or email already exists
            if User.objects.filter(username=data['username']).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=data['email']).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create new user
            user = User.objects.create(
                username=data['username'],
                email=data['email'],
                password=make_password(data['password']),  # Hash the password
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                phone=data.get('phone', '')
            )
            
            # Return user data (excluding password)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Error creating user: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    """Login a user"""
    if request.method == 'POST':
        try:
            data = request.data
            username = data.get('username')
            password = data.get('password')
            
            # For demo purposes, just return a success response with user data
            # In a real app, you would verify credentials and generate a token
            User = get_user_model()
            
            try:
                user = User.objects.get(username=username)
                # In a real app, you would check the password here
                # if not check_password(password, user.password):
                #     return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
                
                serializer = UserSerializer(user)
                return Response(serializer.data)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            print(f"Error logging in: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)