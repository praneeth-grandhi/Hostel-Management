from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomUserLoginView, RegisterUserView # CustomAdminLoginView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', CustomUserLoginView.as_view(), name='login'),
    # path('admin-login/', CustomAdminLoginView.as_view(), name='admin_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

