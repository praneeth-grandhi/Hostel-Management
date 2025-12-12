from django.db import models
from accounts.models import User # type: ignore warning


# Create your models here.
class Hostel(models.Model):
    name = models.CharField(max_length=50)
    address = models.TextField()
    rooms = models.IntegerField()
    floors = models.IntegerField()
    business_hours = models.CharField(max_length=100, blank=True, default='')
    description = models.TextField(blank=True, null=True, default=None)
    amenities = models.TextField(blank=True, null=True, default=None)
    gst_number = models.CharField(max_length=50, blank=True, null=True, default=None)
    fssai_license = models.CharField(max_length=50, blank=True, null=True, default=None)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='hostels'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name