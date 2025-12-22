from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Booking, Complaint
from .serializers import BookingSerializer, ComplaintSerializer


class BookingViewSet(viewsets.ModelViewSet):
	"""ViewSet for bookings.

	- Admins and coadmins see all bookings.
	- Regular users only see their own bookings.
	- Non-admin users may modify only their own bookings.
	"""
	queryset = Booking.objects.all()
	serializer_class = BookingSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		user = self.request.user
		hostel_id = self.request.query_params.get('hostel_id')
		
		if user and user.is_authenticated and getattr(user, 'role', None) in ['admin', 'coadmin']:
			queryset = Booking.objects.all()
		else:
			queryset = Booking.objects.filter(user=user)
		
		# Filter by hostel if provided
		if hostel_id:
			queryset = queryset.filter(hostel_id=hostel_id)
		
		return queryset.select_related('room', 'hostel')

	def perform_create(self, serializer):
		user = self.request.user
		# Allow admins to create for any user by passing `user` in payload.
		if user and getattr(user, 'role', None) in ['admin', 'coadmin']:
			booking = serializer.save()
		else:
			booking = serializer.save(user=user)
		
		# Mark the room as occupied when booking is created
		if booking.room and booking.status == 'active':
			booking.room.status = 'occupied'
			booking.room.save()

	def perform_update(self, serializer):
		# Prevent non-admins from updating other users' bookings
		user = self.request.user
		instance = serializer.instance
		if not getattr(user, 'role', None) in ['admin', 'coadmin'] and instance.user != user:
			raise PermissionDenied('You do not have permission to modify this booking.')
		serializer.save()

	def destroy(self, request, *args, **kwargs):
		# Prevent non-admins from deleting other users' bookings
		instance = self.get_object()
		user = request.user
		if not getattr(user, 'role', None) in ['admin', 'coadmin'] and instance.user != user:
			raise PermissionDenied('You do not have permission to delete this booking.')
		
		# Mark room as available when booking is deleted
		if instance.room:
			instance.room.status = 'available'
			instance.room.save()
		
		return super().destroy(request, *args, **kwargs)

	@action(detail=True, methods=['post'])
	def checkout(self, request, pk=None):
		"""Mark a booking as checked out / completed.

		Sets `status` to 'completed' and `check_out_date` to today if not already set.
		Also marks the room as available again.
		Only the booking owner or admins can checkout.
		"""
		booking = self.get_object()
		user = request.user
		if not getattr(user, 'role', None) in ['admin', 'coadmin'] and booking.user != user:
			raise PermissionDenied('You do not have permission to checkout this booking.')

		from django.utils import timezone
		today = timezone.now().date()
		booking.status = 'completed'
		if not booking.check_out_date:
			booking.check_out_date = today
		booking.save()
		
		# Mark room as available when checkout happens
		if booking.room:
			booking.room.status = 'available'
			booking.room.save()
		
		serializer = self.get_serializer(booking)
		return Response(serializer.data, status=status.HTTP_200_OK)

# Complaint ViewSet
class ComplaintViewSet(viewsets.ModelViewSet):
    """
    Users: see and create their own complaints
    Admins: see all complaints for their hostels, can update status/response
    """
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        hostel_id = self.request.query_params.get('hostel_id')
        
        if getattr(user, 'role', None) in ['admin', 'coadmin']:
            # Admins see all complaints (filtered by hostel if provided)
            queryset = Complaint.objects.all()
            if hostel_id:
                queryset = queryset.filter(hostel_id=hostel_id)
        else:
            # Regular users see only their own complaints
            queryset = Complaint.objects.filter(user=user)
        
        return queryset.select_related('user', 'hostel', 'room', 'booking')
    
    def perform_create(self, serializer):
        user = self.request.user
        
        # Find user's active booking to auto-link hostel and room
        active_booking = Booking.objects.filter(user=user, status='active').first()
        
        if active_booking:
            serializer.save(
                user=user,
                hostel=active_booking.hostel,
                room=active_booking.room,
                booking=active_booking
            )
        else:
            # No active booking - reject
            raise serializers.ValidationError("You must have an active booking to submit a complaint.")