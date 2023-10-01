from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GatewayDetails, GatewayList, CustomLoginView, RegisterView, CompanyList,CompanyDetails
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # restframework simplejwt routes
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Login path
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    # Register path 
    path('register/', RegisterView.as_view(), name='register_user'),
    # List and CreateCompany 
    path('company/', CompanyList.as_view(), name='company_create'),
    # CRUD for Gateways
    path("company/<int:pk>", CompanyDetails.as_view(), name="crud_company_id"), 
    # List and Create Gateways
    path("gateways/", GatewayList.as_view(), name="list_gateways"),
    # CRUD for Gateways
    path("gateways/<int:pk>", GatewayDetails.as_view(), name="crud_gateway_id"), 
]