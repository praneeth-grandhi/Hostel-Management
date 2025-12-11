from .routers import router
from django.urls import path, include # type: ignore warning

urlpatterns = [
    path('', include(router.urls)),
]