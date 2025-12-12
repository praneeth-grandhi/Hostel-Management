from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()

# ✅ Registration Serializer - Accept all User model fields
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8, required=False)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'country_code',
            'country',
            'city',
            'state',
            'zip_code',
            'password',
            'confirm_password',
            'role'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'phone_number': {'required': False, 'allow_blank': True},
            'address': {'required': False, 'allow_blank': True},
            'country_code': {'required': False, 'allow_blank': True},
            'country': {'required': False, 'allow_blank': True},
            'city': {'required': False, 'allow_blank': True},
            'state': {'required': False, 'allow_blank': True},
            'zip_code': {'required': False, 'allow_blank': True},
            'role': {'required': False, 'allow_blank': True},
        }
    
    def validate(self, data):
        confirm_password = data.get('confirm_password')
        password = data.get('password')
        if confirm_password and password != confirm_password:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        username = validated_data.get('username', validated_data.get('email'))
        validated_data['username'] = username
        password = validated_data.pop('password')
        

        
        user = User(**validated_data)
        user.set_password(password)
        # Set role based on input
        if validated_data.get('role') == 'admin':
            user.role = 'admin'
        else:
            user.role = 'user'
        user.save()
        return user


# ✅ Custom JWT Token Serializer (SAME JWT LOGIC)
class CustomUserTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ Custom claims inside JWT
        token['username'] = user.username
        token['role'] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # ✅ Custom data in login response
        data['user'] = {
            'role': self.user.role,
        }

        return data


# class AdminRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, min_length=6)
#     phone_number = serializers.CharField(required=False, allow_blank=True)
#     address = serializers.CharField(required=False, allow_blank=True)
#     role = serializers.CharField(required=False, allow_blank=True)

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'password', 'phone_number', 'address', 'role']

#     def create(self, validated_data):
#         password = validated_data.pop('password')
#         phone_number = validated_data.pop('phone_number', '')
#         address = validated_data.pop('address', '')
#         role = validated_data.pop('role', '')

#         user = User.objects.create_user(
#             username=validated_data['username'],
#             password=password,
#         )

#         admin = Admin.objects.create(
#             user=user,
#             phone_number=phone_number,
#             address=address,
#             role=role or 'super-admin',
#         )

#         admin.save()
#         # admin = Admin(**validated_data)
#         # admin.set_password(password)
#         # admin.role = 'admin'
#         # admin.save()
#         return admin

# ✅ Custom JWT Token Serializer for Admin
# class CustomAdminTokenObtainPairSerializer(TokenObtainPairSerializer):

#     @classmethod
#     def get_token(cls, admin):
#         token = super().get_token(admin)

#         # ✅ Custom claims inside JWT
#         token['username'] = admin.username
#         token['role'] = admin.role

#         return token

#     def validate(self, attrs):
#         data = super().validate(attrs)

#         # ✅ Custom data in login response
#         data['admin'] = {
#             'role': self.admin.role,
#         }

#         return data

