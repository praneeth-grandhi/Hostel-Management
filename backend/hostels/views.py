from django.shortcuts import render # type: ignore warning
from rest_framework import generics, viewsets # type: ignore warning
from .models import Hostel
from .serializers import HostelSerializer
from accounts.permissions import IsAdminUser

# Create your views here.
class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [IsAdminUser]  # Only admins can access
    lookup_field = 'id'
    
    def get_queryset(self):
        # Admins see only their own hostels
        return Hostel.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically set owner to the authenticated admin user
        serializer.save(owner=self.request.user)
