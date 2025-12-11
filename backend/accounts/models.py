from django.contrib.auth.models import AbstractUser,User
from django.db import models

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    role = models.CharField(max_length=20, default='user')

    def __str__(self):
        return self.username
