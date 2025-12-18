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
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    def __str__(self):
        return self.username

class CoAdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coadmin_profile')
    super_admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='co_admins')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'super_admin')

    def __str__(self):
        return f"{self.user.email} - {self.super_admin.email}"