from rest_framework import generics
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserRegistrationSerializer, CustomUserTokenObtainPairSerializer # CustomAdminTokenObtainPairSerializer

User = get_user_model()
Admin = get_user_model()


# ✅ Register API
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

# ✅ Custom JWT Login API
class CustomUserLoginView(TokenObtainPairView):
    serializer_class = CustomUserTokenObtainPairSerializer

# class RegisterAdminView(generics.CreateAPIView):
#     queryset = Admin.objects.all()
#     serializer_class = AdminRegistrationSerializer

# # ✅ Custom JWT Login API for Admin
# class CustomAdminLoginView(TokenObtainPairView):
#     serializer_class = CustomAdminTokenObtainPairSerializer