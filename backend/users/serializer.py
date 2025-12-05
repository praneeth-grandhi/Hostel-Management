from rest_framework import serializers # type: ignore
from .models import Users

# Serializers define the API representation --> Users [Registration].
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'password', 'country_code', 'address', 'city', 'state', 'country', 'pincode']
        extra_kwargs = {
            'password': {'write_only': True}
        }


# Serializers define the API representation of UserProfile.
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'country_code', 'address', 'city', 'state', 'country', 'pincode']

