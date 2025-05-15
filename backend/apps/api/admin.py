from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Property, PropertyImage
from apps.users.models import User  # Import your custom User model

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    readonly_fields = ('image_preview',)
    fields = ('image', 'image_preview', 'is_cover')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]
    list_display = ('title', 'property_type', 'city', 'price', 'status', 'user_link', 'is_active')
    list_filter = ('property_type', 'status', 'is_active', 'city')
    search_fields = ('title', 'description', 'city', 'address')
    raw_id_fields = ('user',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'user', 'price', 'is_active')
        }),
        ('Property Details', {
            'fields': ('property_type', 'status', 'surface_area', 'rooms', 'bedrooms', 'bathrooms', 'furnished')
        }),
        ('Location', {
            'fields': ('city', 'address', 'postal_code', 'latitude', 'longitude')
        }),
    )
    
    def user_link(self, obj):
        if obj.user:
            # Change 'auth_user_change' to 'users_user_change' to match your custom User model
            url = reverse("admin:users_user_change", args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.username)
        return "-"
    user_link.short_description = 'User'
    user_link.admin_order_field = 'user'