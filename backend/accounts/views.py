from rest_framework import generics # type: ignore warning
from rest_framework.views import APIView # type: ignore warning
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser # type: ignore warning
from django.contrib.auth import get_user_model # type: ignore warning
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore warning
from .serializers import UserRegistrationSerializer, CustomUserTokenObtainPairSerializer, AdminWithHostelSerializer, CoAdminProfileSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated # type: ignore warning
from rest_framework.response import Response # type: ignore warning
from rest_framework import status # type: ignore warning
from .models import CoAdminProfile

User = get_user_model()


class UserPermissionsView(APIView):
    """Returns current user's role and basic info - frontend decides what to show."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'role': user.role,  # 'admin', 'coadmin', or 'user'
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })


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

    def perform_create(self, serializer):
        serializer.save()

#Register co-admin
class CoAdminListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CoAdminProfileSerializer
    
    def get_queryset(self):
        # Return co-admins created by this super-admin
        return User.objects.filter(
            coadmin_profile__super_admin=self.request.user
        )
    
    def list(self, request):
        queryset = self.get_queryset()
        data = [{
            'id': u.id,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'email': u.email,
            'created_at': u.coadmin_profile.created_at,
        } for u in queryset]
        return Response(data)

class CoAdminDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(
            coadmin_profile__super_admin=self.request.user
        )
    
    def destroy(self, request, pk):
        try:
            user = self.get_queryset().get(pk=pk)
            user.delete()  # This also deletes CoAdminProfile (CASCADE)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'Co-admin not found'}, status=404)


class CoAdminUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(
            coadmin_profile__super_admin=self.request.user
        )
    
    def update(self, request, pk):
        try:
            user = self.get_queryset().get(pk=pk)
            
            # Update fields
            user.first_name = request.data.get('first_name', user.first_name)
            user.last_name = request.data.get('last_name', user.last_name)
            
            # Update email if provided and different
            new_email = request.data.get('email')
            if new_email and new_email != user.email:
                if User.objects.filter(email=new_email).exclude(pk=pk).exists():
                    return Response({'error': 'Email already in use'}, status=400)
                user.email = new_email
                user.username = new_email
            
            # Update password if provided
            new_password = request.data.get('password')
            if new_password:
                user.set_password(new_password)
            
            user.save()
            
            return Response({
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'created_at': user.coadmin_profile.created_at,
            })
        except User.DoesNotExist:
            return Response({'error': 'Co-admin not found'}, status=404)

# Additional view to get and update user profile
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserRegistrationSerializer  # Reuse registration serializer for validation
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        """GET method to fetch current user profile"""
        user = self.get_object()
        return Response({
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone_number': user.phone_number,
            'address': user.address,
            'country_code': user.country_code,
            'country': user.country,
            'city': user.city,
            'state': user.state,
            'zip_code': user.zip_code,
            'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
            'role': user.role,
        })

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        
        # Update fields
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.phone_number = request.data.get('phone_number', user.phone_number)
        user.address = request.data.get('address', user.address)
        user.country_code = request.data.get('country_code', user.country_code)
        user.country = request.data.get('country', user.country)
        user.city = request.data.get('city', user.city)
        user.state = request.data.get('state', user.state)
        user.zip_code = request.data.get('zip_code', user.zip_code)

        # Handle profile picture upload
        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']

        # Update email if provided and different
        new_email = request.data.get('email')
        if new_email and new_email != user.email:
            if User.objects.filter(email=new_email).exclude(pk=user.pk).exists():
                return Response({'error': 'Email already in use'}, status=400)
            user.email = new_email
            user.username = new_email

        # Update password if provided
        new_password = request.data.get('password')
        if new_password:
            user.set_password(new_password)

        user.save()

        return Response({
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone_number': user.phone_number,
            'address': user.address,
            'country_code': user.country_code,
            'country': user.country,
            'city': user.city,
            'state': user.state,
            'zip_code': user.zip_code,
            'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
            'role': user.role,
        })


class ChangePasswordView(APIView):
    """Change user password - requires current password verification"""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        # Validate inputs
        if not current_password:
            return Response({'error': 'Current password is required'}, status=400)
        if not new_password:
            return Response({'error': 'New password is required'}, status=400)
        if len(new_password) < 8:
            return Response({'error': 'New password must be at least 8 characters'}, status=400)

        # Verify current password
        if not user.check_password(current_password):
            return Response({'error': 'Current password is incorrect'}, status=400)

        # Check new password is different
        if current_password == new_password:
            return Response({'error': 'New password must be different from current password'}, status=400)

        # Set new password
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'})


class UserSearchView(APIView):
    """Search for users by phone number or email - Admin/CoAdmin only."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Only admins and coadmins can search users
        if not getattr(user, 'role', None) in ['admin', 'coadmin']:
            return Response({'error': 'Permission denied'}, status=403)

        query = request.query_params.get('query', '').strip()
        if not query:
            return Response({'error': 'Search query is required'}, status=400)

        # Search by phone number or email
        from django.db.models import Q
        users = User.objects.filter(
            Q(phone_number__icontains=query) | Q(email__icontains=query)
        ).exclude(role__in=['admin', 'coadmin'])[:10]  # Limit results, exclude admins

        results = [{
            'id': u.id,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'email': u.email,
            'phone_number': u.phone_number,
        } for u in users]

        return Response({'users': results})


class SendOTPView(APIView):
    """Send OTP to user for verification - Admin/CoAdmin only.
    
    In demo mode, this just returns success without actually sending an OTP.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        # Only admins and coadmins can send OTP
        if not getattr(user, 'role', None) in ['admin', 'coadmin']:
            return Response({'error': 'Permission denied'}, status=403)

        user_id = request.data.get('user_id')
        phone = request.data.get('phone')
        email = request.data.get('email')

        if not user_id and not phone and not email:
            return Response({'error': 'user_id, phone, or email is required'}, status=400)

        # In demo mode, we just return success
        # In production, this would integrate with an SMS/Email OTP service
        return Response({
            'success': True,
            'message': 'OTP sent successfully (demo mode - use any 6-digit code)'
        })


class VerifyOTPView(APIView):
    """Verify OTP for user - Admin/CoAdmin only.
    
    In demo mode, this accepts ANY value for OTP verification.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        # Only admins and coadmins can verify OTP
        if not getattr(user, 'role', None) in ['admin', 'coadmin']:
            return Response({'error': 'Permission denied'}, status=403)

        user_id = request.data.get('user_id')
        otp = request.data.get('otp')

        if not otp:
            return Response({'error': 'OTP is required'}, status=400)

        # In demo mode, accept ANY OTP value
        # In production, this would validate against a stored OTP
        
        # If user_id provided, return user data
        target_user = None
        if user_id:
            try:
                target_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                pass

        response_data = {
            'success': True,
            'message': 'OTP verified successfully',
            'verified': True,
        }

        if target_user:
            response_data['user'] = {
                'id': target_user.id,
                'first_name': target_user.first_name,
                'last_name': target_user.last_name,
                'email': target_user.email,
                'phone_number': target_user.phone_number,
            }

        return Response(response_data)