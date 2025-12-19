from django.urls import path, include # type: ignore warning
from rest_framework.routers import DefaultRouter # type: ignore warning
from .views import HostelViewSet, RoomViewSet

router = DefaultRouter()
router.register(r'hostels', HostelViewSet, basename='hostel')
router.register(r'rooms', RoomViewSet, basename='room')