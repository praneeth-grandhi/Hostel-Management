from rest_framework import serializers # type: ignore warning
from .models import Hostel
from django.contrib.auth import get_user_model # type: ignore warning

User = get_user_model()

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
            'business_hours',
            'description',
            'amenities',
            'hostel_type',
            'food_provided',
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