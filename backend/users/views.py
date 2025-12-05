from django.shortcuts import render # type: ignore

# Create your views here.
from rest_framework import viewsets # type: ignore
from .serializer import UserSerializer, UserProfileSerializer
from .models import Users
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer


class UserProfile(generics.RetrieveUpdateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]