from django.urls import path  
from .views import hello_world, get_properties, create_property

urlpatterns = [  
    path('hello/', hello_world),  
    path('properties/', get_properties),
    path('properties/create/', create_property, name='create_property'),
]