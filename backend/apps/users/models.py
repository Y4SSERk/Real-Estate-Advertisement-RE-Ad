from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('agent', 'Agent'),
        ('individual', 'Individual'),
    ]
    
    # Additional fields
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='individual'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"