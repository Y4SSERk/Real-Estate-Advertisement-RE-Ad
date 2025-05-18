from django.urls import path  
from .views import get_properties, property_detail

urlpatterns = [  
    path('properties/', get_properties),
    path('properties/<int:pk>/', property_detail),
]