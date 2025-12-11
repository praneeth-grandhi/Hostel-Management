# Django Models & Views Guide for Hostel Management System

## Overview
For a complete hostel management system, you need **4 main models** and corresponding **ViewSets/Views** to handle all operations.

---

## PART 1: MODELS (Database Structure)

### Model 1: **Users** (Guest/Regular Users) ✅ EXISTS
**Purpose:** For guests who book hostels

**Fields:**
```python
- id (auto)
- first_name (CharField, max 30)
- last_name (CharField, max 30)
- email (EmailField, unique)
- phone (CharField, max 15, unique)
- country_code (CharField, max 5)
- address (TextField)
- city (CharField, max 50)
- state (CharField, max 50)
- country (CharField, max 50)
- pincode (CharField, max 10)
- password (CharField, encrypted via make_password)
```

**Current Status:** ✅ COMPLETE in your codebase

---

### Model 2: **Admin** (Hostel Owners/Managers) ⚠️ PARTIAL
**Purpose:** For hostel owners who manage properties

**Current Fields (minimal):**
```python
- id (auto)
- first_name, last_name, email, phone
- password (encrypted)
- role (superadmin or coadmin)
```

**MISSING Fields (commented out - need to uncomment):**
```python
# International
- country_code (CharField, max 5)
- secondary_phone (CharField, max 15)

# Profile
- display_name (CharField, max 100)
- bio (TextField)

# Address
- address (TextField)
- city, state, country (CharField, max 50)
- pincode (CharField, max 10)

# KYC Documents (for super admin verification)
- aadhar_number (CharField, max 12, unique)
- pan_number (CharField, max 10, unique)
- gst_number (CharField, max 15, unique)
- fssai_number (CharField, max 20, unique)

# Relationships
- created_by (ForeignKey to Admin - tracks who created this co-admin)

# Timestamps & Status
- created_at (DateTimeField, auto_now_add)
- updated_at (DateTimeField, auto_now)
- is_active (BooleanField, default True)
```

**Current Status:** ⚠️ NEED TO UNCOMMENT FIELDS

---

### Model 3: **Hostel** ❌ NEEDS CREATION
**Purpose:** Hostel/PG properties owned by admins

**Fields to Create:**
```python
# Basic Info
- id (auto)
- name (CharField, max 100)
- address (TextField)
- city, state, country (CharField, max 50)
- pincode (CharField, max 10)

# Contact Info
- contact_phone (CharField, max 15)
- contact_email (EmailField)

# Property Details
- total_rooms (IntegerField)
- floors (IntegerField)
- business_hours (CharField, max 50, optional)
- description (TextField, optional)
- amenities (TextField - comma-separated)

# Documents & Compliance
- gst_number (CharField, max 15, optional)
- fssai_number (CharField, max 20, optional)

# Owner Relationship (CRITICAL)
- owner (ForeignKey to Admin)
  → ONE admin can own MANY hostels
  → ONE hostel has ONE admin owner
  → Only superadmins can own hostels

# Timestamps & Status
- created_at (DateTimeField, auto_now_add)
- updated_at (DateTimeField, auto_now)
- is_active (BooleanField, default True)
```

**Current Status:** ❌ COMPLETELY COMMENTED OUT - NEED TO UNCOMMENT & ENABLE

---

### Model 4: **Room** ❌ NEEDS CREATION
**Purpose:** Individual rooms in a hostel

**Fields to Create:**
```python
# Basic Info
- id (auto)
- room_number (CharField, max 10)
- room_type (CharField) - choices: "single", "double", "dorm", "private"
- description (TextField, optional)

# Capacity & Pricing
- capacity (IntegerField) - how many people
- price_per_night (DecimalField)

# Room Status
- is_available (BooleanField, default True)
- floor_number (IntegerField)

# Amenities
- amenities (TextField - comma-separated)

# Relationship to Hostel
- hostel (ForeignKey to Hostel)
  → ONE hostel has MANY rooms
  → ONE room belongs to ONE hostel
  → Delete rooms when hostel is deleted (CASCADE)

# Timestamps
- created_at (DateTimeField, auto_now_add)
- updated_at (DateTimeField, auto_now)
```

**Current Status:** ❌ DOESN'T EXIST - NEW MODEL NEEDED

---

### Model 5: **Booking** ❌ NEEDS CREATION (Optional but Recommended)
**Purpose:** Track guest bookings

**Fields:**
```python
# Basic Info
- id (auto)
- booking_reference (CharField, unique)

# Relationships
- guest (ForeignKey to Users)
- room (ForeignKey to Room)
- hostel (ForeignKey to Hostel)

# Dates
- check_in_date (DateField)
- check_out_date (DateField)
- number_of_nights (IntegerField)

# Pricing
- price_per_night (DecimalField)
- total_price (DecimalField)

# Status
- status (CharField) - choices: "pending", "confirmed", "checked_in", "completed", "cancelled"

# Timestamps
- created_at (DateTimeField, auto_now_add)
- updated_at (DateTimeField, auto_now)
```

**Current Status:** ❌ DOESN'T EXIST - NICE TO HAVE

---

## PART 2: SERIALIZERS (Data Validation & Conversion)

### Serializers to Create/Update:

```python
# 1. UserSerializer ✅ EXISTS
class UserSerializer(serializers.ModelSerializer)
  → For user registration & profile

# 2. AdminSerializer ⚠️ EXISTS BUT INCOMPLETE
class AdminSerializer(serializers.ModelSerializer)
  → For admin registration
  → Need to add all fields: gst_number, fssai_number, etc.

# 3. HostelSerializer ❌ NEW
class HostelSerializer(serializers.ModelSerializer)
  → For creating/updating hostels
  → Includes owner validation
  → Read-only for owner field (auto-set from logged-in admin)

# 4. RoomSerializer ❌ NEW
class RoomSerializer(serializers.ModelSerializer)
  → For room CRUD operations
  → Validation: capacity > 0, price_per_night > 0

# 5. BookingSerializer ❌ NEW
class BookingSerializer(serializers.ModelSerializer)
  → For booking operations
  → Validation: check_out > check_in, room available

# 6. ListHostelsSerializer (Read-Only) ❌ NEW
class ListHostelsSerializer(serializers.ModelSerializer)
  → For listing hostels (without sensitive admin data)
  → Include owner name only, not password/email
```

---

## PART 3: VIEWS/VIEWSETS (API Endpoints)

### View 1: **UsersViewSet** ✅ PARTIAL EXISTS
**Current Endpoints:**
```
GET    /api/users/                    → List all users
POST   /api/users/                    → Create user
GET    /api/users/<id>/               → Get user
PUT    /api/users/<id>/               → Update user
DELETE /api/users/<id>/               → Delete user
```

**Needed Improvements:**
- Add custom actions like `/api/users/<id>/change-password/`
- Add search/filter capabilities

---

### View 2: **UserProfile** ✅ PARTIAL EXISTS
**Current Endpoints:**
```
GET    /api/profile/<id>/             → Get user profile
PUT    /api/profile/<id>/             → Update profile
```

**Needed:**
- Should be a `RetrieveUpdateAPIView` ✅ (already is)
- Add permission check (user can only update their own)

---

### View 3: **AdminViewSet** ❌ NEW - NEEDS CREATION
**Endpoints Needed:**
```
POST   /api/admin/register/           → Create admin + hostel
GET    /api/admin/                    → List all admins (superusers only)
GET    /api/admin/<id>/               → Get admin details
PUT    /api/admin/<id>/               → Update admin profile
DELETE /api/admin/<id>/               → Delete admin
```

**Special Features:**
- Registration should create both Admin + first Hostel
- Validate: Only superadmin can create co-admins
- Permission: Only own profile or superadmin can update

---

### View 4: **HostelViewSet** ❌ NEW - NEEDS CREATION
**Endpoints Needed:**
```
GET    /api/hostels/                  → List all hostels (public)
POST   /api/hostels/                  → Create hostel (admin only)
GET    /api/hostels/<id>/             → Get hostel details
PUT    /api/hostels/<id>/             → Update hostel (owner only)
DELETE /api/hostels/<id>/             → Delete hostel (owner only)
GET    /api/hostels/<id>/rooms/       → List rooms in hostel
```

**Permissions:**
```python
- List/Retrieve: AllowAny (public)
- Create: IsAuthenticated + is_superadmin_or_owner
- Update: IsAuthenticated + is_owner_only
- Delete: IsAuthenticated + is_owner_only
```

---

### View 5: **RoomViewSet** ❌ NEW - NEEDS CREATION
**Endpoints Needed:**
```
GET    /api/hostels/<hostel_id>/rooms/              → List rooms in hostel
POST   /api/hostels/<hostel_id>/rooms/              → Add room to hostel
GET    /api/rooms/<id>/                             → Get room details
PUT    /api/rooms/<id>/                             → Update room
DELETE /api/rooms/<id>/                             → Delete room
GET    /api/rooms/<id>/availability/                → Check availability
```

**Permissions:**
```python
- List/Retrieve: AllowAny
- Create/Update/Delete: IsAuthenticated + is_hostel_owner
```

---

### View 6: **BookingViewSet** ❌ NEW - NEEDS CREATION (Optional)
**Endpoints Needed:**
```
GET    /api/bookings/                 → List user's bookings
POST   /api/bookings/                 → Create booking
GET    /api/bookings/<id>/            → Get booking details
PUT    /api/bookings/<id>/            → Update booking
DELETE /api/bookings/<id>/            → Cancel booking
GET    /api/bookings/admin/           → Admin view of all bookings
```

---

## PART 4: PERMISSIONS (Authentication & Authorization)

### Permission Classes to Create:
```python
# 1. IsAdminOrReadOnly
→ Admins can create/edit
→ Others can only read

# 2. IsHostelOwner
→ Only the admin who owns the hostel can edit/delete
→ Check: request.user == hostel.owner

# 3. IsOwnProfileOrAdmin
→ Users can only view/edit their own profile
→ Superadmins can view all

# 4. IsActivated
→ Check if user/admin account is active (is_active=True)
```

---

## PART 5: URL ROUTING STRUCTURE

```python
# urls.py structure:

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Users endpoints
router.register(r'users', views.UsersViewSet, basename='users')

# Admin endpoints
router.register(r'admin', views.AdminViewSet, basename='admin')

# Hostel endpoints
router.register(r'hostels', views.HostelViewSet, basename='hostels')

# Room endpoints (nested under hostels)
router.register(r'rooms', views.RoomViewSet, basename='rooms')

# Booking endpoints (optional)
router.register(r'bookings', views.BookingViewSet, basename='bookings')

urlpatterns = [
    path('api/', include(router.urls)),
    
    # Special endpoints
    path('api/profile/<int:id>/', views.UserProfile.as_view(), name='user-profile'),
]
```

---

## QUICK SUMMARY TABLE

| Model | Status | Priority | Action |
|-------|--------|----------|--------|
| Users | ✅ Complete | - | No changes |
| Admin | ⚠️ Partial | HIGH | Uncomment fields in models.py |
| Hostel | ❌ Missing | HIGH | Uncomment in models.py |
| Room | ❌ Missing | HIGH | Create new model |
| Booking | ❌ Missing | MEDIUM | Create new model (optional) |

| Serializer | Status | Priority | Action |
|------------|--------|----------|--------|
| UserSerializer | ✅ Complete | - | No changes |
| AdminSerializer | ⚠️ Partial | HIGH | Add all fields |
| HostelSerializer | ❌ Missing | HIGH | Create |
| RoomSerializer | ❌ Missing | HIGH | Create |
| BookingSerializer | ❌ Missing | MEDIUM | Create |

| View | Status | Priority | Action |
|------|--------|----------|--------|
| UsersViewSet | ✅ Exists | MEDIUM | Add search/filter |
| UserProfile | ✅ Exists | MEDIUM | Add permission checks |
| AdminViewSet | ❌ Missing | HIGH | Create |
| HostelViewSet | ❌ Missing | HIGH | Create |
| RoomViewSet | ❌ Missing | HIGH | Create |
| BookingViewSet | ❌ Missing | MEDIUM | Create |

---

## IMPLEMENTATION ORDER (Recommended)

1. **Step 1:** Uncomment Admin model fields + update AdminSerializer
2. **Step 2:** Uncomment Hostel model + create HostelSerializer & HostelViewSet
3. **Step 3:** Create Room model + RoomSerializer & RoomViewSet
4. **Step 4:** Create Booking model + BookingSerializer & BookingViewSet (optional)
5. **Step 5:** Add permission classes
6. **Step 6:** Update URL routing
7. **Step 7:** Test all endpoints with Postman/curl

---

## Example Code Snippets

### Creating a ViewSet (Basic Template):
```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Hostel
from .serializers import HostelSerializer

class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    
    # Override permissions per action
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            return [AllowAny()]
        else:
            return [IsAuthenticated(), IsHostelOwner()]
    
    # Set owner automatically on creation
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.admin)
```

### Creating a Custom Permission:
```python
from rest_framework.permissions import BasePermission

class IsHostelOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
```

---

## Key Django Concepts

### 1. **Models** = Database tables
   - Define structure of data
   - Relationships (ForeignKey, ManyToMany)

### 2. **Serializers** = Data validators & converters
   - Convert model instances ↔ JSON
   - Validate incoming data

### 3. **Views/ViewSets** = API endpoints
   - Handle HTTP requests (GET, POST, PUT, DELETE)
   - Return JSON responses
   - ViewSet = Automatic routing + CRUD

### 4. **Permissions** = Access control
   - Who can do what
   - Applied at view level

### 5. **Routers** = URL generators
   - Automatically create URLs from ViewSets
   - RESTful URL patterns

---

## Next Steps
1. Start with **Step 1** - Uncomment Admin model fields
2. Create migrations: `python manage.py makemigrations`
3. Apply migrations: `python manage.py migrate`
4. Follow steps 2-6 for full implementation
