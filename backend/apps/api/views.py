from rest_framework.decorators import api_view  
from rest_framework.response import Response  
from rest_framework import status
from .models import Property, PropertyImage
from apps.users.models import User
from .serializer import PropertySerializer, PropertyImageSerializer, UserSerializer

@api_view(['GET', 'POST'])
def get_properties(request):  
    if request.method == 'GET':
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