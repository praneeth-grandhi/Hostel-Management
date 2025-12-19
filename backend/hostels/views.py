from django.shortcuts import render # type: ignore warning
from rest_framework import viewsets, status, serializers as drf_serializers # type: ignore warning
from rest_framework.decorators import api_view, permission_classes # type: ignore warning
from rest_framework.permissions import AllowAny # type: ignore warning
from .models import Hostel, Room
from .serializers import HostelSerializer, PublicHostelSerializer, RoomSerializer
from accounts.permissions import IsAdminOrCoAdmin
from rest_framework.response import Response # type: ignore warning


# Public API views (no authentication required)
@api_view(['GET'])
@permission_classes([AllowAny])
def public_hostel_list(request):
    """List all hostels for public viewing (homepage)"""
    hostels = Hostel.objects.all()
    serializer = PublicHostelSerializer(hostels, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_hostel_detail(request, hostel_id):
    """Get single hostel details for public viewing"""
    try:
        hostel = Hostel.objects.get(id=hostel_id)
        serializer = PublicHostelSerializer(hostel)
        return Response(serializer.data)
    except Hostel.DoesNotExist:
        return Response({'error': 'Hostel not found'}, status=status.HTTP_404_NOT_FOUND)


# Create your views here.
class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [IsAdminOrCoAdmin]  # Allow both admin and co-admin
    lookup_field = 'id'
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'admin':
            # Super-admin sees their own hostels
            return Hostel.objects.filter(owner=user)
        elif user.role == 'coadmin':
            # Co-admin sees their super-admin's hostels
            try:
                profile = user.coadmin_profile
                return Hostel.objects.filter(owner=profile.super_admin)
            except:
                return Hostel.objects.none()
        else:
            return Hostel.objects.none()
    
    def perform_create(self, serializer):
        # Automatically set owner to the authenticated admin user
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.role == 'coadmin':
            return Response({'error': 'Co-admins cannot create hostels'}, status=403)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.role == 'coadmin':
            return Response({'error': 'Co-admins cannot edit hostels'}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role == 'coadmin':
            return Response({'error': 'Co-admins cannot delete hostels'}, status=403)
        return super().destroy(request, *args, **kwargs)


class RoomViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing rooms within hostels.
    - Admin can CRUD rooms for their own hostels
    - Co-admin can CRUD rooms for their super-admin's hostels
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrCoAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        user = self.request.user
        hostel_id = self.request.query_params.get('hostel_id')
        
        # Get allowed hostels based on user role
        if user.role == 'admin':
            allowed_hostels = Hostel.objects.filter(owner=user)
        elif user.role == 'coadmin':
            try:
                profile = user.coadmin_profile
                allowed_hostels = Hostel.objects.filter(owner=profile.super_admin)
            except:
                return Room.objects.none()
        else:
            return Room.objects.none()
        
        # Filter rooms by allowed hostels
        rooms = Room.objects.filter(hostel__in=allowed_hostels)
        
        # Further filter by specific hostel if provided
        if hostel_id:
            rooms = rooms.filter(hostel_id=hostel_id)
        
        return rooms.order_by('floor', 'room_code')
    
    def perform_create(self, serializer):
        """Validate that the hostel belongs to the user and room/floor limits are not exceeded"""
        hostel = serializer.validated_data.get('hostel')
        floor = serializer.validated_data.get('floor')
        user = self.request.user
        
        # Verify ownership
        if user.role == 'admin':
            if hostel.owner != user:
                raise drf_serializers.ValidationError({'hostel': 'You can only add rooms to your own hostels'})
        elif user.role == 'coadmin':
            try:
                profile = user.coadmin_profile
                if hostel.owner != profile.super_admin:
                    raise drf_serializers.ValidationError({'hostel': 'You can only add rooms to your assigned hostels'})
            except:
                raise drf_serializers.ValidationError({'hostel': 'Invalid co-admin profile'})
        
        # Validate floor limit - floor number cannot exceed declared floors
        if hostel.floors and floor > hostel.floors:
            raise drf_serializers.ValidationError({
                'floor': f'Floor {floor} exceeds the declared limit of {hostel.floors} floors for this hostel. Update the hostel details to increase the floor limit.'
            })
        
        # Validate room count limit - total rooms cannot exceed declared rooms
        current_room_count = Room.objects.filter(hostel=hostel).count()
        if hostel.rooms and current_room_count >= hostel.rooms:
            raise drf_serializers.ValidationError({
                'hostel': f'This hostel has reached its room limit of {hostel.rooms}. You have {current_room_count} rooms. Update the hostel details to increase the room limit.'
            })
        
        serializer.save()
    
    def update(self, request, *args, **kwargs):
        """Ensure room belongs to user's allowed hostels before update"""
        room = self.get_object()
        if room not in self.get_queryset():
            return Response({'error': 'You cannot edit this room'}, status=403)
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Ensure room belongs to user's allowed hostels before delete"""
        room = self.get_object()
        if room not in self.get_queryset():
            return Response({'error': 'You cannot delete this room'}, status=403)
        return super().destroy(request, *args, **kwargs)