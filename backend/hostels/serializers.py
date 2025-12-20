from rest_framework import serializers # type: ignore warning
from .models import Hostel, Room
from django.contrib.auth import get_user_model # type: ignore warning

User = get_user_model()


# Public Hostel Serializer (for homepage - no sensitive data)
class PublicHostelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hostel
        fields = [
            'id', 
            'name', 
            'rooms', 
            'floors', 
            'city',
            'address',
            'state',
            'country',
            'zip_code',
            'contact_phone',
            'contact_email',
            'business_hours',
            'description',
            'amenities',
            'hostel_type',
            'food_provided',
            'category',
            'price_single',
            'price_double',
            'price_triple',
        ]


#  Hostel Serializer
class HostelSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.first_name', read_only=True)
    class Meta:
        model = Hostel
        fields = [
            'id', 
            'name', 
            'rooms', 
            'floors', 
            'city',
            'address',
            'state',
            'country',
            'zip_code',
            'contact_phone',
            'contact_email',
            'business_hours',
            'description',
            'amenities',
            'hostel_type',
            'food_provided',
            'category',
            'price_single',
            'price_double',
            'price_triple',
            'owner_id_proof',
            'property_proof',
            'trade_license',
            'police_verification',
            'police_verification_reference',
            'gst_number',
            'fssai_license',
            'owner',
            'owner_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'owner_name', 'created_at', 'updated_at']


# Room Serializer
class RoomSerializer(serializers.ModelSerializer):
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)
    # Transform features to match frontend format
    features = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = [
            'id',
            'hostel',
            'hostel_name',
            'room_code',
            'floor',
            'sharing_type',
            'rent',
            'status',
            'is_maintenance',
            'has_ac',
            'has_tv',
            'has_water_heater',
            'features',  # Computed field for frontend compatibility
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'hostel_name', 'features', 'created_at', 'updated_at']
    
    def get_features(self, obj):
        """Return features in frontend-compatible format"""
        return {
            'ac': obj.has_ac,
            'tv': obj.has_tv,
            'waterHeater': obj.has_water_heater,
        }
    
    def to_internal_value(self, data):
        """Handle features object from frontend"""
        # Extract features if provided as nested object
        if 'features' in data and isinstance(data.get('features'), dict):
            features = data.pop('features')
            data['has_ac'] = features.get('ac', False)
            data['has_tv'] = features.get('tv', False)
            data['has_water_heater'] = features.get('waterHeater', False)
        return super().to_internal_value(data)