import profile
from django.db import models # type: ignore
from django.contrib.auth.models import make_password # type: ignore

# Create your models here.
class Users(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    # profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    country_code = models.CharField(max_length=5, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    password = models.CharField(max_length=128)

    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"


class Admin(models.Model):
    ROLE_CHOICES = [
        ('superadmin', 'Super Admin'),
        ('coadmin', 'Co-Admin'),
    ]

    # Basic info
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    country_code = models.CharField(max_length=5, blank=True)
    secondary_phone = models.CharField(max_length=15, blank=True)
    
    # Profile info
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    # profile_picture = models.ImageField(upload_to='admin_pics/', null=True, blank=True)
    
    # Address
    address = models.TextField(blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    
    # KYC Documents (Super Admin only)
    aadhar_number = models.CharField(max_length=12, blank=True, unique=True)
    pan_number = models.CharField(max_length=10, blank=True, unique=True)
    gst_number = models.CharField(max_length=15, blank=True, unique=True)
    fssai_number = models.CharField(max_length=20, blank=True, unique=True)
    # Document files stored as URLs or file paths
    # aadhar_file = models.FileField(upload_to='documents/aadhar/', null=True, blank=True)
    # pan_file = models.FileField(upload_to='documents/pan/', null=True, blank=True)
    # proof_of_address_file = models.FileField(upload_to='documents/address/', null=True, blank=True)
    
    # Security
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='superadmin')
    
    # # Created by (for co-admins, who created them)
    # created_by = models.ForeignKey(
    #     'Admin',
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name='co_admins_created'
    # )

    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role}) - {self.email}"

    class Meta:
        verbose_name = "Admin"
        verbose_name_plural = "Admins"


class Hostel(models.Model):
    HOSTEL_TYPE_CHOICES = [
        ('hostel', 'Hostel'),
        ('pg', 'PG'),
        ('hotel', 'Hotel'),
    ]

    # Basic Info
    name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    pincode = models.CharField(max_length=10)
    
    # Contact Info
    contact_phone = models.CharField(max_length=15)
    contact_email = models.EmailField()
    
    # Property Info
    hostel_type = models.CharField(max_length=10, choices=HOSTEL_TYPE_CHOICES, default='hostel')
    total_rooms = models.IntegerField()
    floors = models.IntegerField()
    business_hours = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    amenities = models.TextField(blank=True)  # Comma-separated or JSON
    
    # Owner (Super Admin who owns this hostel)
    # Each hostel has exactly ONE super admin owner
    # But one super admin can own MULTIPLE hostels
    owner = models.ForeignKey(
        Admin,
        on_delete=models.CASCADE,
        related_name='hostels',
        limit_choices_to={'role': 'superadmin'}
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Status
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.city}"

    class Meta:
        verbose_name = "Hostel"
        verbose_name_plural = "Hostels"