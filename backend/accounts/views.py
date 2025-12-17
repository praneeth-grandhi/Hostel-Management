from rest_framework import generics
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserRegistrationSerializer, CustomUserTokenObtainPairSerializer # CustomAdminTokenObtainPairSerializer
from .serializers import AdminWithHostelSerializer
from rest_framework.permissions import AllowAny

User = get_user_model()


# ✅ Register API
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

# ✅ Custom JWT Login API
class CustomUserLoginView(TokenObtainPairView):
    serializer_class = CustomUserTokenObtainPairSerializer


# Register Admin together with Hostel
class RegisterAdminWithHostelView(generics.CreateAPIView):
    queryset = None
    serializer_class = AdminWithHostelSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

# class RegisterAdminView(generics.CreateAPIView):
#     queryset = Admin.objects.all()
#     serializer_class = AdminRegistrationSerializer

# # ✅ Custom JWT Login API for Admin
# class CustomAdminLoginView(TokenObtainPairView):
#     serializer_class = CustomAdminTokenObtainPairSerializer