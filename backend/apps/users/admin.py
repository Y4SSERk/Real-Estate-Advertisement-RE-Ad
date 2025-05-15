from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'phone',
        'role',  # Added role to list display
        'is_active',
        'is_staff',
        'date_joined_short'
    )
    
    list_filter = (
        'is_active',
        'is_staff',
        'is_superuser',
        'role',  # Added role to filters
        'date_joined'
    )
    
    search_fields = (
        'username',
        'email',
        'first_name',
        'last_name',
        'phone'
    )
    
    list_editable = ('is_active', 'role')  # Made role editable in list view
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {
            'fields': (
                'first_name',
                'last_name',
                'email',
                'phone',
                'role'  # Added role to edit form
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions'
            )
        }),
        ('Important Dates', {
            'fields': (
                'last_login',
                'date_joined',
                'created_at',
                'updated_at'
            )
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'email',
                'password1',
                'password2',
                'first_name',
                'last_name',
                'phone',
                'role',  # Added role to create form
                'is_active',
                'is_staff'
            ),
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')  # Make these fields read-only
    
    def date_joined_short(self, obj):
        return obj.date_joined.strftime("%Y-%m-%d")
    date_joined_short.short_description = 'Joined'
    date_joined_short.admin_order_field = 'date_joined'

admin.site.register(User, CustomUserAdmin)