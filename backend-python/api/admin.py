from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
import api.models as api_models
# Register your models here.

@admin.register(api_models.User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username','email', 'role', 'is_active', 'is_staff']
    search_fields = ['username']
    list_filter = ['role', 'is_active', 'is_staff', 'email']
    ordering = ['username']  # Specify the field for ordering
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "user_permissions",
                    "role",
                ),
            },
        ),
        (
            "Important dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

@admin.register(api_models.Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'address']
    search_fields = ['name', 'address']

@admin.register(api_models.Gateway)
class GatewayAdmin(admin.ModelAdmin):
    list_display = ['company','gateway_name','antenna_diameter','location_name','latitude','longitude','status','created_at']
    search_fields = ['company','gateway_name','antenna_diameter','location_name','latitude','longitude','status','created_at']
