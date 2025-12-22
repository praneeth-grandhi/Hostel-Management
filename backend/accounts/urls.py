from django.urls import path # type: ignore warning
from rest_framework_simplejwt.views import TokenRefreshView # type: ignore warning
from .views import (
    ChangePasswordView, CoAdminDeleteView, CoAdminListCreateView, CoAdminUpdateView,
    CustomUserLoginView, RegisterUserView, RegisterAdminWithHostelView, 
    UserPermissionsView, UserProfileView, UserSearchView, SendOTPView, VerifyOTPView
)

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('admin-register/', RegisterAdminWithHostelView.as_view(), name='admin_register'),
    path('login/', CustomUserLoginView.as_view(), name='login'),
    path('me/permissions/', UserPermissionsView.as_view(), name='user-permissions'),
    path('me/profile/', UserProfileView.as_view(), name='user-profile-update'),
    path('me/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('co-admins/', CoAdminListCreateView.as_view(), name='co-admin-list-create'),
    path('co-admins/<int:pk>/', CoAdminDeleteView.as_view(), name='co-admin-delete'),
    path('co-admins/<int:pk>/update/', CoAdminUpdateView.as_view(), name='co-admin-update'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # User search and OTP endpoints for admin booking flow
    path('search/', UserSearchView.as_view(), name='user-search'),
    path('otp/send/', SendOTPView.as_view(), name='send-otp'),
    path('otp/verify/', VerifyOTPView.as_view(), name='verify-otp'),
]

