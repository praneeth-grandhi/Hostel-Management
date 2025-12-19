from .routers import router
from django.urls import path, include  # type: ignore warning
from .views import public_hostel_list, public_hostel_detail

urlpatterns = [
    # Public endpoints MUST come before router (no auth required)
    path('hostels/public/', public_hostel_list, name='public-hostel-list'),
    path('hostels/public/<int:hostel_id>/', public_hostel_detail, name='public-hostel-detail'),
    # Router URLs (authenticated)
    path('', include(router.urls)),
]