from django.db import models # type: ignore warning
from accounts.models import User
from hostels.models import Hostel, Room


class Booking(models.Model):
    """
    Main booking model - links a verified user to a room.
    For shared rooms (double/triple), additional occupants are stored in BookingOccupant.
    """
    
    # Reference number for easy tracking
    booking_reference = models.CharField(max_length=20, unique=True, editable=False)

    # Core relationships
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings',
        help_text="The primary booker (verified by OTP)"
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    hostel = models.ForeignKey(
        Hostel,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    # Booking details
    check_in_date = models.DateField()
    check_out_date = models.DateField(null=True, blank=True)  # Optional - ongoing stay
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Status tracking (accept any value)
    status = models.CharField(max_length=15, default='active')

    # Verification
    is_verified = models.BooleanField(default=False, help_text="OTP verification completed")
    verified_at = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Notes
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        # Auto-generate booking reference if not set
        if not self.booking_reference:
            import datetime
            import random
            prefix = self.hostel.name[:3].upper() if self.hostel else 'BKG'
            year = datetime.datetime.now().year
            random_num = random.randint(1000, 9999)
            self.booking_reference = f"{prefix}-{year}-{random_num}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.booking_reference} - {self.user.first_name} - Room {self.room.room_code}"


class BookingOccupant(models.Model):
    """
    Additional occupants for shared rooms (double/triple sharing).
    These do NOT need a user account - just name and phone for records.
    """
    booking = models.ForeignKey(
        Booking, 
        on_delete=models.CASCADE, 
        related_name='occupants'
    )
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.name} - Booking {self.booking.booking_reference}"

    def save(self, *args, **kwargs):
        # Auto-generate booking reference if not set
        if not self.booking_reference:
            import datetime
            import random
            prefix = self.booking.hostel.name[:3].upper() if self.booking.hostel else 'BKG'
            year = datetime.datetime.now().year
            random_num = random.randint(1000, 9999)
            self.booking_reference = f"{prefix}-{year}-{random_num}"
        super().save(*args, **kwargs)

class Complaint(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved')
    ]

    CATEGORY_CHOICES = [
        ('maintenance', 'Maintenance'),
        ('cleanliness', 'Cleanliness'),
        ('security', 'Security'),
        ('food', 'Food'),
        ('staff', 'Staff'),
        ('other', 'Other')
    ]

    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='complaints'
    )
    hostel = models.ForeignKey(
        'hostels.Hostel',
        on_delete=models.CASCADE,
        related_name='complaints'
    )
    room = models.ForeignKey(
        'hostels.Room',
        on_delete=models.CASCADE,
        related_name='complaints'
    )
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='complaints'
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.first_name} - {self.hostel.name}"