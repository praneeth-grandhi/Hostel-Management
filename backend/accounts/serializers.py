from rest_framework import serializers # type: ignore warning
from django.contrib.auth import get_user_model # type: ignore warning
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore warning


User = get_user_model()

from hostels.models import Hostel
from django.db import transaction # type: ignore warning


# Serializer to create User (admin) + Hostel atomically
class AdminWithHostelSerializer(serializers.Serializer):
    # User fields
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(required=True)
    country_code = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    country = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    state = serializers.CharField(required=True)
    zip_code = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, min_length=8, required=True)
    confirm_password = serializers.CharField(write_only=True, min_length=8, required=True)

    # Hostel fields
    name = serializers.CharField(required=True)
    hostel_address = serializers.CharField(required=True)
    hostel_city = serializers.CharField(required=True)
    hostel_state = serializers.CharField(required=True)
    hostel_country = serializers.CharField(required=True)
    hostel_zip_code = serializers.CharField(required=True)
    contact_phone = serializers.CharField(required=False, allow_blank=True)
    rooms = serializers.IntegerField(required=True)
    floors = serializers.IntegerField(required=True)
    business_hours = serializers.CharField(required=False, allow_blank=True)
    hostel_type = serializers.CharField(required=False, allow_blank=True)
    food_provided = serializers.BooleanField(default=False)
    owner_id_proof = serializers.FileField(required=False, allow_null=True)
    property_proof = serializers.FileField(required=False, allow_null=True)
    trade_license = serializers.FileField(required=False, allow_null=True)
    police_verification = serializers.BooleanField(default=False)
    police_verification_reference = serializers.CharField(required=False, allow_blank=True)
    gst_number = serializers.CharField(required=False, allow_blank=True)
    fssai_license = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.pop('confirm_password', None)
        if password != confirm_password:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})

        email = data.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'Email already registered'})

        return data

    @transaction.atomic
    def create(self, validated_data):
        # Create user
        # Ensure we capture the email and password before popping other fields
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        # Required user fields that must be present in validated_data
        required_user_fields = [
            'first_name', 'last_name', 'phone_number', 'country_code',
            'address', 'country', 'city', 'state', 'zip_code'
        ]

        missing = []
        user_values = {}
        for field in required_user_fields:
            val = validated_data.pop(field, None)
            if val is None or (isinstance(val, str) and val.strip() == ''):
                missing.append(field)
            else:
                user_values[field] = val

        if missing:
            raise serializers.ValidationError({f'missing_fields': f'Missing required fields: {", ".join(missing)}'})

        user_data = {
            'first_name': user_values.get('first_name'),
            'last_name': user_values.get('last_name'),
            'email': email,
            'phone_number': user_values.get('phone_number'),
            'country_code': user_values.get('country_code'),
            'address': user_values.get('address'),
            'country': user_values.get('country'),
            'city': user_values.get('city'),
            'state': user_values.get('state'),
            'zip_code': user_values.get('zip_code'),
            'password': password,
            'role': 'admin',
            'username': email,
        }

        user = User.objects.create_user(**user_data)

        # Create hostel
        hostel_data = {
            'name': validated_data.pop('name'),
            'address': validated_data.pop('hostel_address'),
            'city': validated_data.pop('hostel_city'),
            'state': validated_data.pop('hostel_state'),
            'country': validated_data.pop('hostel_country'),
            'zip_code': validated_data.pop('hostel_zip_code'),
            'contact_phone': validated_data.pop('contact_phone', ''),
            'rooms': validated_data.pop('rooms'),
            'floors': validated_data.pop('floors'),
            'business_hours': validated_data.pop('business_hours', ''),
            'hostel_type': validated_data.pop('hostel_type', ''),
            'food_provided': validated_data.pop('food_provided', False),
            'owner_id_proof': validated_data.pop('owner_id_proof', None),
            'property_proof': validated_data.pop('property_proof', None),
            'trade_license': validated_data.pop('trade_license', None),
            'police_verification': validated_data.pop('police_verification', False),
            'police_verification_reference': validated_data.pop('police_verification_reference', ''),
            'gst_number': validated_data.pop('gst_number', ''),
            'fssai_license': validated_data.pop('fssai_license', ''),
            'owner': user,
        }
        hostel = Hostel.objects.create(**hostel_data)

        return {'user': user, 'hostel': hostel}

    def to_representation(self, instance):
        """
        Override to_representation to handle the dict response from create().
        instance will be {'user': user_obj, 'hostel': hostel_obj}
        """
        if isinstance(instance, dict) and 'user' in instance and 'hostel' in instance:
            user = instance['user']
            hostel = instance['hostel']
            return {
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone_number': user.phone_number,
                    'country_code': user.country_code,
                    'address': user.address,
                    'country': user.country,
                    'city': user.city,
                    'state': user.state,
                    'zip_code': user.zip_code,
                    'role': user.role,
                },
                'hostel': {
                    'id': hostel.id,
                    'name': hostel.name,
                    'address': hostel.address,
                    'city': hostel.city,
                    'state': hostel.state,
                    'country': hostel.country,
                    'zip_code': hostel.zip_code,
                    'contact_phone': hostel.contact_phone,
                    'rooms': hostel.rooms,
                    'floors': hostel.floors,
                    'business_hours': hostel.business_hours,
                    'hostel_type': hostel.hostel_type,
                    'food_provided': hostel.food_provided,
                    'owner_id': hostel.owner_id,
                }
            }
        # Fallback for other cases
        return super().to_representation(instance)

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

