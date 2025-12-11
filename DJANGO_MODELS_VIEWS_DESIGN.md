# Django Models & Views Design Guide for Hostel Management System

## 📋 Overview

This guide explains all the models and views you need for a complete hostel management system. We'll cover:
- **Models** (Database schemas)
- **Serializers** (API data format converters)
- **Views** (API endpoints)
- **URLs** (Route mappings)

---

## 🗄️ PART 1: MODELS (Database Schema)

Models are Python classes that represent database tables. Each model field becomes a column in the table.

### 1️⃣ **Users Model** ✅ (Already Created)

**Purpose:** Stores guest/user information for registration and bookings.

```python
class Users(models.Model):
    # Basic Info
    first_name = CharField(max_length=30)
    last_name = CharField(max_length=30)
    email = EmailField(unique=True)
    phone = CharField(max_length=15, unique=True)
    
    # International
    country_code = CharField(max_length=5)
    country = CharField(max_length=50)
    
    # Address
    address = TextField()
    city = CharField(max_length=50)
    state = CharField(max_length=50)
    pincode = CharField(max_length=10)
    
    # Security
    password = CharField(max_length=128)  # Auto-encrypted
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**Key Points:**
- `unique=True` → Only one user per email/phone
- `auto_now_add=True` → Automatically set on creation (never changes)
- `auto_now=True` → Automatically updated on every save
- Password is auto-encrypted via `make_password()`

---

### 2️⃣ **Admin Model** ⚠️ (Partially Created - Needs Uncommenting)

**Purpose:** Stores admin/owner information. Has TWO roles: superadmin and co-admin.

```python
class Admin(models.Model):
    ROLE_CHOICES = [
        ('superadmin', 'Super Admin'),
        ('coadmin', 'Co-Admin'),
    ]
    
    # Basic Info
    first_name = CharField(max_length=30)
    last_name = CharField(max_length=30)
    email = EmailField(unique=True)
    phone = CharField(max_length=15, unique=True)
    country_code = CharField(max_length=5)
    secondary_phone = CharField(max_length=15, blank=True)  # Optional
    
    # Profile Info
    display_name = CharField(max_length=100, blank=True)
    bio = TextField(blank=True)
    
    # Address
    address = TextField(blank=True)
    city = CharField(max_length=50, blank=True)
    state = CharField(max_length=50, blank=True)
    country = CharField(max_length=50, blank=True)
    pincode = CharField(max_length=10, blank=True)
    
    # KYC Documents (for verification)
    aadhar_number = CharField(max_length=12, blank=True, unique=True)
    pan_number = CharField(max_length=10, blank=True, unique=True)
    gst_number = CharField(max_length=15, blank=True, unique=True)
    fssai_number = CharField(max_length=20, blank=True, unique=True)
    
    # Security & Role
    password = CharField(max_length=128)  # Auto-encrypted
    role = CharField(max_length=10, choices=ROLE_CHOICES, default='superadmin')
    
    # Co-Admin tracking: who created this co-admin
    created_by = ForeignKey(
        'Admin',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='co_admins_created'
    )
    
    # Timestamps & Status
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    is_active = BooleanField(default=True)
```

**Key Concepts:**
- **ForeignKey** → Creates a relationship (many-to-one). One superadmin can create many co-admins.
- **`related_name='co_admins_created'`** → Allows reverse lookup: `admin.co_admins_created.all()`
- **`on_delete=models.SET_NULL`** → If creator is deleted, co-admin stays but creator becomes null
- **ROLE_CHOICES** → Restricts values to only 'superadmin' or 'coadmin'

---

### 3️⃣ **Hostel Model** ❌ (Needs to be Uncommented & Enhanced)

**Purpose:** Stores hostel/property information. Each hostel is owned by ONE superadmin.

```python
class Hostel(models.Model):
    # Basic Info
    name = CharField(max_length=100)
    address = TextField()
    city = CharField(max_length=50)
    state = CharField(max_length=50)
    country = CharField(max_length=50)
    pincode = CharField(max_length=10)
    
    # Contact Info
    contact_phone = CharField(max_length=15)
    contact_email = EmailField()
    
    # Property Info
    total_rooms = IntegerField()
    floors = IntegerField()
    business_hours = CharField(max_length=50, blank=True)  # e.g., "09:00 - 21:00"
    description = TextField(blank=True)
    amenities = TextField(blank=True)  # e.g., "WiFi,Laundry,Meals,Parking"
    
    # Business Info (NEW - from AdminRegister)
    gst_number = CharField(max_length=15, blank=True)
    fssai_number = CharField(max_length=20, blank=True)
    
    # Ownership (Many-to-One: Many hostels → One superadmin)
    owner = ForeignKey(
        Admin,
        on_delete=models.CASCADE,
        related_name='hostels',
        limit_choices_to={'role': 'superadmin'}
    )
    
    # Timestamps & Status
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    is_active = BooleanField(default=True)
```

**Key Concepts:**
- **`limit_choices_to={'role': 'superadmin'}`** → Only superadmins can own hostels
- **One superadmin → Many hostels** (one-to-many)
- **Each hostel → One superadmin** (many-to-one)
- **`on_delete=models.CASCADE`** → If admin is deleted, all their hostels are deleted too

---

### 4️⃣ **Room Model** (Optional but Recommended)

**Purpose:** Stores individual room information within each hostel.

```python
class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ('single', 'Single'),
        ('double', 'Double'),
        ('dorm', 'Dorm'),
    ]
    
    # Room Info
    room_number = CharField(max_length=20)
    room_type = CharField(max_length=10, choices=ROOM_TYPE_CHOICES)
    capacity = IntegerField()  # Number of beds
    price_per_night = DecimalField(max_digits=8, decimal_places=2)
    
    # Amenities
    has_ac = BooleanField(default=False)
    has_wifi = BooleanField(default=True)
    description = TextField(blank=True)
    
    # Ownership
    hostel = ForeignKey(
        Hostel,
        on_delete=models.CASCADE,
        related_name='rooms'
    )
    
    is_available = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
```

---

### 5️⃣ **Booking Model** (Optional but Recommended)

**Purpose:** Stores user bookings for rooms.

```python
class Booking(models.Model):
    BOOKING_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    # Who booked
    guest = ForeignKey(Users, on_delete=models.CASCADE, related_name='bookings')
    
    # What they booked
    room = ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    
    # Booking Details
    check_in_date = DateField()
    check_out_date = DateField()
    number_of_guests = IntegerField()
    total_price = DecimalField(max_digits=10, decimal_places=2)
    status = CharField(max_length=15, choices=BOOKING_STATUS_CHOICES, default='pending')
    
    # Special requests
    special_requests = TextField(blank=True)
    
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

---

## 🔄 Model Relationships Summary

```
Users (Guests)
  └─ One user → Many bookings

Admin (Owners)
  ├─ One superadmin → Many hostels
  ├─ One superadmin → Many co-admins (via created_by)
  └─ One co-admin → created by one superadmin

Hostel
  ├─ One hostel → One superadmin (owner)
  └─ One hostel → Many rooms

Room
  ├─ One room → One hostel
  └─ One room → Many bookings

Booking
  ├─ One booking → One guest
  └─ One booking → One room
```

---

## 🔌 PART 2: SERIALIZERS (API Data Formatters)

Serializers convert Python models to JSON and vice versa.

### Why Serializers?

```
Database (Python objects)
         ↓
    Serializer
         ↓
    API Response (JSON)
```

### Current Serializers ✅

```python
class UserSerializer(ModelSerializer):
    """For user registration and listing"""
    class Meta:
        model = Users
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 
                  'password', 'country_code', 'address', 'city', 'state', 
                  'country', 'pincode']
        extra_kwargs = {'password': {'write_only': True}}

class AdminSerializer(ModelSerializer):
    """For admin registration"""
    class Meta:
        model = Admin
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 
                  'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}
```

### New Serializers Needed ⚠️

```python
class AdminProfileSerializer(ModelSerializer):
    """For admin profile (with all fields)"""
    class Meta:
        model = Admin
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 
                  'country_code', 'secondary_phone', 'display_name', 'bio',
                  'address', 'city', 'state', 'country', 'pincode',
                  'aadhar_number', 'pan_number', 'gst_number', 'fssai_number',
                  'role', 'is_active', 'created_at', 'updated_at']

class HostelSerializer(ModelSerializer):
    """For hostel CRUD operations"""
    owner_name = SerializerMethodField()  # Show owner name instead of ID
    
    class Meta:
        model = Hostel
        fields = ['id', 'name', 'address', 'city', 'state', 'country', 
                  'pincode', 'contact_phone', 'contact_email', 'total_rooms',
                  'floors', 'business_hours', 'description', 'amenities',
                  'gst_number', 'fssai_number', 'owner', 'owner_name',
                  'is_active', 'created_at', 'updated_at']
    
    def get_owner_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}"

class RoomSerializer(ModelSerializer):
    """For room CRUD operations"""
    class Meta:
        model = Room
        fields = ['id', 'room_number', 'room_type', 'capacity', 
                  'price_per_night', 'has_ac', 'has_wifi', 'description',
                  'hostel', 'is_available', 'created_at']

class BookingSerializer(ModelSerializer):
    """For booking CRUD operations"""
    guest_name = SerializerMethodField()
    room_details = RoomSerializer(source='room', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'guest', 'guest_name', 'room', 'room_details',
                  'check_in_date', 'check_out_date', 'number_of_guests',
                  'total_price', 'status', 'special_requests', 
                  'created_at', 'updated_at']
    
    def get_guest_name(self, obj):
        return f"{obj.guest.first_name} {obj.guest.last_name}"
```

---

## 🌐 PART 3: VIEWS (API Endpoints)

Views handle API requests and return responses. Use `ViewSets` for standard CRUD operations.

### Current Views ✅

```python
class UsersViewSet(viewsets.ModelViewSet):
    """User CRUD: GET /api/users/, POST /api/users/, etc."""
    queryset = Users.objects.all()
    serializer_class = UserSerializer

class AdminProfile(generics.RetrieveUpdateAPIView):
    """Get/Update admin profile: GET/PUT /api/admin-profile/<id>/"""
    queryset = Users.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAuthenticated]
```

### New Views Needed ⚠️

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

# ============ ADMIN VIEWS ============

class AdminViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD Operations
    
    Endpoints:
    - POST   /api/admins/              → Create admin (registration)
    - GET    /api/admins/              → List all admins (superadmin only)
    - GET    /api/admins/<id>/         → Get single admin
    - PUT    /api/admins/<id>/         → Update admin
    - DELETE /api/admins/<id>/         → Delete admin
    - POST   /api/admins/<id>/promote/ → Promote co-admin to superadmin
    """
    queryset = Admin.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        """Custom registration endpoint"""
        # Validate and create admin
        # Auto-encrypt password
        # Return token for authentication
        pass
    
    @action(detail=True, methods=['post'])
    def promote_to_superadmin(self, request, pk=None):
        """Promote co-admin to superadmin"""
        admin = self.get_object()
        if admin.role != 'coadmin':
            return Response({'error': 'Only co-admins can be promoted'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        admin.role = 'superadmin'
        admin.save()
        return Response({'message': 'Promoted to superadmin'})


# ============ HOSTEL VIEWS ============

class HostelViewSet(viewsets.ModelViewSet):
    """
    Hostel CRUD Operations
    
    Endpoints:
    - POST   /api/hostels/           → Create hostel
    - GET    /api/hostels/           → List hostels
    - GET    /api/hostels/<id>/      → Get single hostel
    - PUT    /api/hostels/<id>/      → Update hostel
    - DELETE /api/hostels/<id>/      → Delete hostel
    - GET    /api/hostels/<id>/rooms/ → Get rooms in hostel
    """
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        """Auto-set owner to current user"""
        serializer.save(owner=self.request.user.admin)
    
    def get_queryset(self):
        """Filter hostels by owner (users only see their hostels)"""
        user = self.request.user
        if hasattr(user, 'admin'):
            return Hostel.objects.filter(owner=user.admin)
        return Hostel.objects.none()
    
    @action(detail=True, methods=['get'])
    def rooms(self, request, pk=None):
        """Get all rooms in a hostel"""
        hostel = self.get_object()
        rooms = hostel.rooms.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)


# ============ ROOM VIEWS ============

class RoomViewSet(viewsets.ModelViewSet):
    """
    Room CRUD Operations
    
    Endpoints:
    - POST   /api/rooms/      → Create room
    - GET    /api/rooms/      → List rooms
    - PUT    /api/rooms/<id>/ → Update room
    - DELETE /api/rooms/<id>/ → Delete room
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        """Ensure room belongs to user's hostel"""
        hostel_id = self.request.data.get('hostel')
        hostel = Hostel.objects.get(id=hostel_id)
        # Verify user owns this hostel
        if hostel.owner != self.request.user.admin:
            return Response({'error': 'Not authorized'}, 
                          status=status.HTTP_403_FORBIDDEN)
        serializer.save()


# ============ BOOKING VIEWS ============

class BookingViewSet(viewsets.ModelViewSet):
    """
    Booking CRUD Operations
    
    Endpoints:
    - POST   /api/bookings/               → Create booking
    - GET    /api/bookings/               → List bookings
    - GET    /api/bookings/my-bookings/   → My bookings (guest)
    - PUT    /api/bookings/<id>/          → Update booking
    - POST   /api/bookings/<id>/cancel/   → Cancel booking
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """Get current user's bookings"""
        bookings = Booking.objects.filter(guest=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        if booking.status == 'completed':
            return Response({'error': 'Cannot cancel completed booking'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        booking.status = 'cancelled'
        booking.save()
        return Response({'message': 'Booking cancelled'})
```

---

## 🛣️ PART 4: URL ROUTING

Map URLs to views in `urls.py`:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UsersViewSet)
router.register(r'admins', views.AdminViewSet)
router.register(r'hostels', views.HostelViewSet)
router.register(r'rooms', views.RoomViewSet)
router.register(r'bookings', views.BookingViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
```

**This automatically creates:**
```
POST   /api/users/              → Create user
GET    /api/users/              → List users
GET    /api/users/1/            → Get user 1
PUT    /api/users/1/            → Update user 1
DELETE /api/users/1/            → Delete user 1

(Same for admins, hostels, rooms, bookings)
```

---

## 📊 COMPLETE CHECKLIST

### Models
- ✅ Users (Guest Registration)
- ⚠️ Admin (Owner Registration) - Uncomment & enhance
- ❌ Hostel - Create from template
- ❌ Room - Create (optional but recommended)
- ❌ Booking - Create (optional)

### Serializers
- ✅ UserSerializer
- ✅ AdminSerializer (basic)
- ⚠️ AdminProfileSerializer - Create (full profile)
- ❌ HostelSerializer - Create
- ❌ RoomSerializer - Create
- ❌ BookingSerializer - Create

### Views
- ✅ UsersViewSet
- ⚠️ AdminProfile (convert to AdminViewSet)
- ❌ AdminViewSet - Create
- ❌ HostelViewSet - Create
- ❌ RoomViewSet - Create
- ❌ BookingViewSet - Create

### URLs
- ⚠️ Need to add new routes for all viewsets

---

## 🚀 NEXT STEPS (In Order)

1. **Uncomment & complete Admin model** - Add all fields
2. **Create Hostel model** - From template provided
3. **Create serializers** - AdminProfileSerializer, HostelSerializer
4. **Create/update views** - AdminViewSet, HostelViewSet
5. **Update URLs** - Add all routes
6. **Optional: Create Room & Booking models** - For advanced features

---

## 💡 Key Django Concepts

| Concept | Meaning | Example |
|---------|---------|---------|
| **Model** | Database table | `class Users` |
| **Field** | Column in table | `email = EmailField()` |
| **ForeignKey** | Link to another table | `owner = ForeignKey(Admin)` |
| **Serializer** | Converts to/from JSON | `class UserSerializer` |
| **ViewSet** | CRUD operations | `ModelViewSet` |
| **Router** | Auto-generates URLs | `router.register()` |
| **Permission** | Access control | `[IsAuthenticated]` |

---

## 📚 Resources

- Django Models: https://docs.djangoproject.com/en/4.0/topics/db/models/
- DRF ViewSets: https://www.django-rest-framework.org/api-guide/viewsets/
- DRF Serializers: https://www.django-rest-framework.org/api-guide/serializers/

---

**Would you like me to help you implement any of these components?**
