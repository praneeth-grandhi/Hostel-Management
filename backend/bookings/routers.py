from rest_framework.routers import DefaultRouter # type: ignore warning
from .views import BookingViewSet, ComplaintViewSet
from django.urls import path, include # type: ignore warning

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'complaints', ComplaintViewSet, basename='complaint')