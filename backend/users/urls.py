from django.urls import path, include # type: ignore
from .routers import userRoute
from .views import UserProfile

urlpatterns = [
    path('', include(userRoute.urls)),
    path('user-profile/<int:id>', UserProfile.as_view())
]