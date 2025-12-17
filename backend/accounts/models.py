from django.contrib.auth.models import AbstractUser # type: ignore warning
from django.db import models # type: ignore warning

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    country_code = models.CharField(max_length=5, blank=True)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, default='user')

    def __str__(self):
        return self.username
