from django.urls import path  
from .views import get_properties, property_detail, register_user, login_user

urlpatterns = [  
    path('properties/', get_properties),
    path('properties/<int:pk>/', property_detail),
    path('register/', register_user),
    path('login/', login_user),
]