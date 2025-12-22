from .models import Booking, BookingOccupant, Complaint
from rest_framework import serializers # type: ignore warning

from accounts.models import User

class BookingOccupantSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)

	class Meta:
		model = BookingOccupant
		fields = ['id', 'name', 'phone', 'email', 'created_at']
		read_only_fields = ['created_at']

class BookingSerializer(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)
	booking_reference = serializers.CharField(read_only=True)
	user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
	occupants = BookingOccupantSerializer(many=True, required=False)
	
	# Read-only fields for display
	room_code = serializers.CharField(source='room.room_code', read_only=True)
	room_floor = serializers.IntegerField(source='room.floor', read_only=True)
	hostel_name = serializers.CharField(source='hostel.name', read_only=True)

	class Meta:
		model = Booking
		fields = [
			'id', 'booking_reference', 'user', 'room', 'hostel',
			'room_code', 'room_floor', 'hostel_name',
			'check_in_date', 'check_out_date', 'rent_amount', 'status',
			'is_verified', 'verified_at', 'notes', 'created_at', 'updated_at',
			'occupants'
		]
		read_only_fields = ['booking_reference', 'created_at', 'updated_at']

	def create(self, validated_data):
		occupants_data = validated_data.pop('occupants', [])
		request = self.context.get('request')
		# If user not provided, default to request.user
		user = validated_data.pop('user', None)
		if user is None and request is not None and request.user and request.user.is_authenticated:
			validated_data['user'] = request.user
		elif user is not None:
			validated_data['user'] = user

		booking = Booking.objects.create(**validated_data)

		for occ in occupants_data:
			BookingOccupant.objects.create(booking=booking, **occ)

		return booking

	def update(self, instance, validated_data):
		occupants_data = validated_data.pop('occupants', None)
		# Update simple fields
		for attr, value in validated_data.items():
			setattr(instance, attr, value)
		instance.save()

		# If occupants provided, replace existing occupants with provided list
		if occupants_data is not None:
			instance.occupants.all().delete()
			for occ in occupants_data:
				BookingOccupant.objects.create(booking=instance, **occ)

		return instance

class ComplaintSerializer(serializers.ModelSerializer):
	user_name = serializers.SerializerMethodField()
	user_email = serializers.EmailField(source='user.email', read_only=True)
	hostel_name = serializers.CharField(source='hostel.name', read_only=True)
	room_code = serializers.CharField(source='room.room_code', read_only=True)
	
	class Meta:
		model = Complaint
		fields = [
			'id', 'user', 'user_name', 'user_email',
			'hostel', 'hostel_name', 'room', 'room_code', 'booking',
			'category', 'title', 'description',
			'status', 'created_at', 'updated_at'
		]
		read_only_fields = ['user', 'hostel', 'room', 'booking', 'created_at', 'updated_at']
	
	def get_user_name(self, obj):
		if obj.user:
			name = f"{obj.user.first_name} {obj.user.last_name}".strip()
			return name or obj.user.username
		return "Unknown"