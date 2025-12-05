from rest_framework import routers # type: ignore
from .views import UsersViewSet

userRoute = routers.DefaultRoute

userRoute.register(r'users', UsersViewSet)