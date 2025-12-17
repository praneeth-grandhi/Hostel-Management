from django.urls import path # type: ignore warning
from rest_framework_simplejwt.views import TokenRefreshView # type: ignore warning
from .views import CustomUserLoginView, RegisterUserView # CustomAdminLoginView
from .views import RegisterAdminWithHostelView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('admin-register/', RegisterAdminWithHostelView.as_view(), name='admin_register'),
    path('login/', CustomUserLoginView.as_view(), name='login'),
    # path('admin-login/', CustomAdminLoginView.as_view(), name='admin_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

