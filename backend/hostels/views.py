from django.shortcuts import render # type: ignore warning
from rest_framework import viewsets # type: ignore warning
from .models import Hostel
from .serializers import HostelSerializer
from accounts.permissions import IsAdminOrCoAdmin
from rest_framework.response import Response # type: ignore warning

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