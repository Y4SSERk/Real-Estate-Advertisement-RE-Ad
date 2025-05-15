from rest_framework.decorators import api_view  
from rest_framework.response import Response  
from rest_framework import status
from .models import Property, PropertyImage
from apps.users.models import User
from .serializer import PropertySerializer, PropertyImageSerializer, UserSerializer

@api_view(['GET'])
def get_properties(request):  
    properties = Property.objects.all()  
    serializer = PropertySerializer(properties, many=True)  
    return Response(serializer.data)

@api_view(['POST'])
def create_property(request):  
    serializer = PropertySerializer(data=request.data)  
    if serializer.is_valid():  
        serializer.save()  
        return Response(serializer.data, status=status.HTTP_201_CREATED)  
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)