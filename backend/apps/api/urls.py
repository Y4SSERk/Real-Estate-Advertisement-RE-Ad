from django.urls import path  
from .views import get_properties, create_property

urlpatterns = [  
    path('properties/', get_properties),
    path('properties/create/', create_property, name='create_property'),
]