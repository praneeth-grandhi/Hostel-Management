from django.db import models # type: ignore warning
from accounts.models import User # type: ignore warning


# Create your models here.
class Hostel(models.Model):
    name = models.CharField(max_length=50)
    address = models.TextField()
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    contact_phone = models.CharField(max_length=15, blank=True)
    contact_email = models.EmailField(blank=True)
    rooms = models.IntegerField()
    floors = models.IntegerField()
    business_hours = models.CharField(max_length=100, blank=True, default='')
    description = models.TextField(blank=True, null=True, default=None)
    amenities = models.TextField(blank=True, null=True, default=None)
    
    # Verification & Document Fields
    hostel_type = models.CharField(
        max_length=20,
        choices=[('pg', 'PG'), ('hostel', 'Hostel'), ('hotel', 'Hotel')],
        blank=True
    )
    food_provided = models.BooleanField(default=False)
    owner_id_proof = models.FileField(upload_to='media/documents/id_proof/', blank=True, null=True)
    property_proof = models.FileField(upload_to='media/documents/property_proof/', blank=True, null=True)
    trade_license = models.FileField(upload_to='media/documents/trade_license/', blank=True, null=True)
    police_verification = models.BooleanField(default=False)
    police_verification_reference = models.CharField(max_length=100, blank=True)
    
    # Registration Numbers
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
    

class Room(models.Model):
    """Room model - one hostel can have multiple rooms"""
    
    SHARING_TYPE_CHOICES = [
        ('single', 'Single'),
        ('double', 'Double'),
        ('triple', 'Triple'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
    ]
    
    hostel = models.ForeignKey(
        Hostel, 
        on_delete=models.CASCADE, 
        related_name='hostel_rooms'
    )
    room_code = models.CharField(max_length=20)  # e.g., "101", "A-201"
    floor = models.IntegerField(default=1)
    sharing_type = models.CharField(
        max_length=10, 
        choices=SHARING_TYPE_CHOICES, 
        default='single'
    )
    rent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(
        max_length=15, 
        choices=STATUS_CHOICES,
        default='available'
    )
    is_maintenance = models.BooleanField(default=False)  # Separate from availability status
    
    # Features stored as JSON-like boolean fields
    has_ac = models.BooleanField(default=False)
    has_tv = models.BooleanField(default=False)
    has_water_heater = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['hostel', 'room_code']  # Room code must be unique per hostel
        ordering = ['floor', 'room_code']
    
    def __str__(self):
        return f"Room {self.room_code} - {self.hostel.name}"