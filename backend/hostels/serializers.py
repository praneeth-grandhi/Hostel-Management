from rest_framework import serializers # type: ignore warning
from .models import Hostel

#  Hostel Serializer
class HostelSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.first_name', read_only=True)
    class Meta:
        model = Hostel
        fields = [
            'id', 
            'name', 
            'address',
            'rooms', 
            'floors', 
            'business_hours',
            'description',
            'amenities',
            'gst_number',
            'fssai_license',
            'owner',
            'owner_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'owner_name', 'created_at', 'updated_at']