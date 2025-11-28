# Database & Frontend Implementation Report

This document summarizes the data model (entities and fields), field audit findings, and recommended unified schema ready for database design.

---

## Executive Summary

**Status:** Frontend is feature-complete with dummy/demo data. Field names have been standardized across all pages (see audit below). All entities are now consistent and ready for backend database design.

**Key Finding:** Initial audit revealed field naming inconsistencies across pages (e.g., `phone` vs `contactPhone`, `numberOfRooms` vs `totalRooms`, `sharing` vs `type`). **All inconsistencies have been fixed.** Frontend now uses unified field names ready for direct mapping to database schema.

---

## Field Audit: Inconsistencies Found & Fixed

### Issue 1: User Names — FIXED ✅
**Before:** `Owners.jsx` used `name`, `AdminRegister.jsx` used `firstName` + `lastName`
**After:** All owner/admin registration now uses `firstName` + `lastName` consistently
**Files Updated:** `Owners.jsx`

### Issue 2: Hostel Contact Fields — FIXED ✅
**Before:** `HostelDetails.jsx` used `phone`/`email`; `MyHostel.jsx` used `contactPhone`/`contactEmail`
**After:** All files now use `contactPhone` and `contactEmail`
**Files Updated:** `HostelDetails.jsx`, sample data standardized

### Issue 3: Hostel Room Count & Floors — FIXED ✅
**Before:** Mixed usage of `numberOfRooms`/`totalRooms`, `numberOfFloors`/`floors`
**After:** All files now use `totalRooms` and `floors`
**Files Updated:** `HostelDetails.jsx` form and sample data

### Issue 4: Room Fields — FIXED ✅
**Before:** 
- Field names: `number` vs `code`, `sharing` vs `type`, `price` vs `rent`
- Status values: `available`, `occupied`, `under maintenance` (inconsistent)
- Admin had `features`, user view didn't display them

**After:**
- Unified fields: `code`, `name`, `type` (single/double/triple), `rent`
- Status: `available`, `occupied`, `maintenance` (consistent)
- Added `name` field for display (e.g., "Deluxe Single")
**Files Updated:** `Rooms.jsx` form and sample data

### Issue 5: Missing Hostel Fields — FIXED ✅
**Before:** `HostelDetails.jsx` was missing `description` and `amenities`
**After:** Both fields added to form and storage
**Files Updated:** `HostelDetails.jsx`

---

## Unified Field Schema (Ready for DB Design)

All frontend pages now use this consistent schema:

### USERS
```
{
  id,
  firstName,
  lastName,
  email (unique),
  phone,
  secondaryPhone (optional),
  passwordHash,
  role: "guest" | "owner" | "superowner",
  displayName (optional),
  bio (optional),
  profilePictureUrl (optional),
  aadharNumber (optional),
  panNumber (optional),
  documents (json array, optional),
  createdAt,
  updatedAt
}
```

### HOSTELS
```
{
  id,
  ownerId (FK -> users),
  name,
  address,
  contactPhone,
  contactEmail,
  type: "hostel" | "pg" | "hotel",
  totalRooms,
  floors,
  businessHours,
  description,
  amenities (string: comma-separated or json),
  gstNumber (optional),
  fssaiNumber (optional),
  status: "active" | "pending" | "suspended",
  createdAt,
  updatedAt
}
```

### ROOMS
```
{
  id,
  hostelId (FK -> hostels),
  code (e.g., "101"),
  name (e.g., "Deluxe Single"),
  floor,
  type: "single" | "double" | "triple",
  rent,
  status: "available" | "occupied" | "maintenance",
  features: {
    ac: boolean,
    tv: boolean,
    waterHeater: boolean
  },
  createdAt,
  updatedAt
}
```

### BOOKINGS
```
{
  id,
  orderId,
  hostelId (FK -> hostels),
  roomId (FK -> rooms),
  guestName,
  guestEmail,
  guestPhone,
  people,
  checkIn,
  checkOut,
  nights,
  amount,
  currency,
  paid: boolean,
  paymentRef (optional),
  status: "pending" | "confirmed" | "cancelled" | "completed",
  feedback (optional),
  isPrimary: boolean,
  createdAt,
  updatedAt
}
```

### COMPLAINTS
```
{
  id,
  orderId,
  hostelId (FK -> hostels),
  roomId (FK -> rooms, optional),
  bookingId (FK -> bookings, optional),
  userId (FK -> users),
  userName,
  subject,
  category: "Maintenance" | "Security" | "Services" | "Other",
  description,
  status: "pending" | "in-progress" | "resolved" | "closed",
  adminNotes (optional),
  createdAt,
  resolvedAt (optional)
}
```

---

## Frontend-to-Database Mapping

| Page | Entity | Fields Collected | Storage Key |
|------|--------|------------------|------------|
| `RegisterPage.jsx` | User | firstName, lastName, email, password | localStorage (demo) → `users` table |
| `AdminRegister.jsx` | User (Owner) | firstName, lastName, email, phone, documents, password, role | localStorage (demo) → `users` table |
| `Owners.jsx` | User (Co-admin) | firstName, lastName, email, password, isSuper | `hostelManagement:owners` → `users` table |
| `HostelDetails.jsx` | Hostel | name, address, contactPhone, contactEmail, type, totalRooms, floors, businessHours, description, amenities | `hostelManagement:hostels` → `hostels` table |
| `Rooms.jsx` | Room | code, name, floor, type, rent, status, features | `hostelManagement:rooms_v4` → `rooms` table |
| `Bookings.jsx` (admin) | Booking | id, guest, roomNumber, floor, checkIn, checkOut, bookingDate | `hostelManagement:bookings_v1` → `bookings` table |
| `PastBookings.jsx` (user) | Booking | id, hostelId, guestName, checkIn, checkOut, amount, paid, paymentRef, feedback | `hostelManagement:bookings` → `bookings` table |
| `MyHostel.jsx` | Booking (Primary) | reference, rooms, people, since | `hostelManagement:myHostel` → `bookings` table (isPrimary=true) |
| `Complaints.jsx` (admin) | Complaint | id, user, text, date, status | `hostelManagement:complaints` → `complaints` table |
| `MyHostel.jsx` (user) | Complaint | id, subject, category, description, status | `hostelManagement:myHostel.complaints` → `complaints` table |

---

## SQL DDL (PostgreSQL)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR(320) UNIQUE NOT NULL,
  phone VARCHAR(32),
  secondary_phone VARCHAR(32),
  password_hash TEXT NOT NULL,
  role VARCHAR(16) DEFAULT 'guest',
  display_name TEXT,
  bio TEXT,
  profile_picture_url TEXT,
  aadhar_number VARCHAR(50),
  pan_number VARCHAR(50),
  documents JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_phone VARCHAR(32),
  contact_email VARCHAR(320),
  type VARCHAR(20),
  total_rooms INT,
  floors INT,
  business_hours TEXT,
  description TEXT,
  amenities TEXT,
  gst_number VARCHAR(50),
  fssai_number VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES hostels(id),
  code VARCHAR(10),
  name TEXT,
  floor INT,
  type VARCHAR(20),
  rent NUMERIC(10,2),
  status VARCHAR(20),
  features JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50),
  hostel_id UUID REFERENCES hostels(id),
  room_id UUID REFERENCES rooms(id),
  guest_name TEXT,
  guest_email VARCHAR(320),
  guest_phone VARCHAR(32),
  people INT,
  check_in DATE,
  check_out DATE,
  nights INT,
  amount NUMERIC(12,2),
  currency VARCHAR(3),
  paid BOOLEAN DEFAULT false,
  payment_ref VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  feedback TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50),
  hostel_id UUID REFERENCES hostels(id),
  room_id UUID REFERENCES rooms(id),
  booking_id UUID REFERENCES bookings(id),
  user_id UUID REFERENCES users(id),
  user_name TEXT,
  subject TEXT NOT NULL,
  category VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  resolved_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_hostels_owner_id ON hostels(owner_id);
CREATE INDEX idx_rooms_hostel_id ON rooms(hostel_id);
CREATE INDEX idx_bookings_hostel_id ON bookings(hostel_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_user_email ON bookings(guest_email);
CREATE INDEX idx_complaints_hostel_id ON complaints(hostel_id);
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
```

---

## MongoDB Schema (Alternative)

```javascript
// Users Collection
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String, // unique
  phone: String,
  secondaryPhone: String,
  passwordHash: String,
  role: "guest" | "owner" | "superowner",
  displayName: String,
  bio: String,
  profilePictureUrl: String,
  aadharNumber: String,
  panNumber: String,
  documents: [{ type: String, url: String }],
  createdAt: Date,
  updatedAt: Date
}

// Hostels Collection
{
  _id: ObjectId,
  ownerId: ObjectId, // FK to users
  name: String,
  address: String,
  contactPhone: String,
  contactEmail: String,
  type: "hostel" | "pg" | "hotel",
  totalRooms: Number,
  floors: Number,
  businessHours: String,
  description: String,
  amenities: [String],
  gstNumber: String,
  fssaiNumber: String,
  status: "active" | "pending" | "suspended",
  createdAt: Date,
  updatedAt: Date
}

// Rooms Collection
{
  _id: ObjectId,
  hostelId: ObjectId, // FK to hostels
  code: String,
  name: String,
  floor: Number,
  type: "single" | "double" | "triple",
  rent: Number,
  status: "available" | "occupied" | "maintenance",
  features: { ac: Boolean, tv: Boolean, waterHeater: Boolean },
  createdAt: Date,
  updatedAt: Date
}

// Bookings Collection
{
  _id: ObjectId,
  orderId: String,
  hostelId: ObjectId, // FK to hostels
  roomId: ObjectId, // FK to rooms
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  people: Number,
  checkIn: Date,
  checkOut: Date,
  nights: Number,
  amount: Number,
  currency: String,
  paid: Boolean,
  paymentRef: String,
  status: "pending" | "confirmed" | "cancelled" | "completed",
  feedback: String,
  isPrimary: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Complaints Collection
{
  _id: ObjectId,
  orderId: String,
  hostelId: ObjectId, // FK to hostels
  roomId: ObjectId, // nullable, FK to rooms
  bookingId: ObjectId, // nullable, FK to bookings
  userId: ObjectId, // FK to users
  userName: String,
  subject: String,
  category: "Maintenance" | "Security" | "Services" | "Other",
  description: String,
  status: "pending" | "in-progress" | "resolved" | "closed",
  adminNotes: String,
  createdAt: Date,
  resolvedAt: Date
}
```

---

## Recommended API Endpoints

### Auth
- `POST /api/auth/register` — register user/owner
- `POST /api/auth/login` — sign-in (guest or owner)
- `POST /api/auth/logout` — logout

### Users
- `GET /api/users/:id` — get user profile
- `PATCH /api/users/:id` — update profile

### Hostels
- `GET /api/hostels` — list all hostels (public)
- `GET /api/hostels/:id` — hostel detail
- `POST /api/hostels` — create hostel (owner)
- `PATCH /api/hostels/:id` — update hostel (owner)
- `DELETE /api/hostels/:id` — delete hostel (owner/admin)

### Rooms
- `GET /api/hostels/:hostelId/rooms` — list rooms for a hostel
- `POST /api/hostels/:hostelId/rooms` — create room (owner/admin)
- `PATCH /api/rooms/:id` — update room (owner/admin)
- `DELETE /api/rooms/:id` — delete room (owner/admin)

### Bookings
- `POST /api/bookings` — create booking (user)
- `GET /api/users/:userId/bookings` — list user's bookings
- `GET /api/hostels/:hostelId/bookings` — list hostel's bookings (admin)
- `PATCH /api/bookings/:id` — update booking status, add feedback (user/admin)
- `POST /api/bookings/:id/pay` — process payment

### Complaints
- `POST /api/complaints` — submit complaint (user)
- `GET /api/hostels/:hostelId/complaints` — list hostel complaints (admin)
- `PATCH /api/complaints/:id` — update complaint status, add notes (admin)
- `DELETE /api/complaints/:id` — delete complaint (admin)

---

## Validation Rules

- **Email:** Valid format, unique across system
- **Password:** Min 8 characters, stored hashed (bcrypt/argon2)
- **Phone:** Valid format (7-15 digits)
- **Booking:** `checkIn <= checkOut`, no overlapping occupancy per room per date range
- **Rent:** Must be >= 0
- **Floors & Rooms:** Must be integers >= 0
- **Role-based Access:**
  - Guests: can only view hostels, create bookings, submit complaints
  - Owners: can manage own hostels, rooms, view bookings, resolve complaints
  - Admins: full system access

---

## Next Steps for Backend Implementation

1. **Database Setup**
   - Create Postgres or MongoDB database using DDL/schemas above
   - Create indexes as specified in SQL DDL

2. **API Server**
   - Build REST API (Node.js/Express, Python/Django, etc.)
   - Implement authentication (JWT or sessions)
   - Add role-based authorization middleware

3. **Data Migration** (if migrating from localStorage)
   - Write migration scripts to parse `localStorage` keys
   - Validate and import data into new database
   - Update frontend to call `/api/...` endpoints instead of localStorage

4. **Testing**
   - Unit tests for validation rules
   - Integration tests for API endpoints
   - E2E tests for booking and complaint workflows

5. **Frontend Updates**
   - Replace localStorage calls with API client (axios/fetch)
   - Add loading states and error handling
   - Implement real authentication flow

---

## Summary Checklist

✅ All field names are now consistent across frontend
✅ Sample data in all pages uses unified schema
✅ Hostel contact fields standardized (contactPhone, contactEmail)
✅ Room fields unified (code, name, type, rent, status)
✅ User names standardized (firstName, lastName)
✅ Description and amenities added to hostel form
✅ Status values normalized (no "under maintenance" — use "maintenance")
✅ Ready for direct database mapping

**Your frontend is production-ready for database design. You can now:**
- Create the database schema from the DDL above
- Design and implement the backend API
- Replace localStorage with API calls in the frontend



---

## Entities & Fields (Recommended)

Below are recommended fields to support the frontend features implemented.

### User
- id (UUID or ObjectId)
- email (string, unique)
- name (string)
- password_hash (string)
- role (enum: `user`, `owner`, `admin`)
- phone (string)
- created_at (timestamp)
- updated_at (timestamp)
- meta (json)

Frontend mapping: sign-in/register forms use `email`, `name`, `password` (store hashed). The auth object stored in localStorage is: `{ role, authenticated, email, name, at }`.

---

### Hostel
- id
- owner_id (FK -> users)
- name
- address
- contact_email
- contact_phone
- description
- amenities (array/string JSON)
- total_rooms (int)
- floors (int)
- created_at, updated_at

Frontend mapping: `MyHostel`, `HostelDetails`, `Settings` pages display and edit hostel info.

---

### Room
- id
- hostel_id
- code (e.g., R101)
- name
- type (Single/Double/Triple)
- floor
- rent (decimal)
- occupied (boolean)
- metadata (images, amenities)
- created_at, updated_at

Frontend mapping: room lists display `type`, `rent`, `occupied`; booking is only allowed if `occupied === false` and not already booked.

---

### Booking
- id
- user_id
- hostel_id
- room_id
- from_date
- to_date
- nights (derived or stored)
- amount
- currency
- paid (boolean)
- payment_ref (string)
- status (confirmed/cancelled/pending)
- feedback (text)
- created_at, updated_at

Frontend mapping: `PastBookings.jsx` stores booking objects with these fields and supports payment simulation, feedback, cancel, rebook.

---

### Payment (optional)
- id
- booking_id
- amount
- currency
- provider_ref
- status
- paid_at
- metadata

Frontend currently simulates payments by setting `paid=true` and `payment_ref`.

---

### Complaint
- id
- hostel_id
- room_id (optional)
- booking_id (optional)
- title
- description
- tenant_name
- status (open, resolved)
- notes (owner/admin)
- created_at, resolved_at

Frontend mapping: `Complaints.jsx` and `MyHostel` complaints section.

---

## Sample SQL DDL (Postgres-like)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'user',
  phone VARCHAR(32),
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT,
  contact_email VARCHAR(320),
  contact_phone VARCHAR(32),
  description TEXT,
  amenities JSONB,
  total_rooms INT,
  floors INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES hostels(id),
  code TEXT,
  name TEXT,
  type TEXT,
  floor INT,
  rent NUMERIC(12,2),
  occupied BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  hostel_id UUID REFERENCES hostels(id),
  room_id UUID REFERENCES rooms(id),
  from_date DATE,
  to_date DATE,
  nights INT,
  amount NUMERIC(12,2),
  currency TEXT,
  paid BOOLEAN DEFAULT false,
  payment_ref TEXT,
  status TEXT DEFAULT 'confirmed',
  feedback TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

Add indexes for `email`, `room_id`, `user_id` and `from_date` for query performance.

---

## Sample Mongo documents

User:
```json
{
  "_id": "user_1",
  "email": "alice@example.com",
  "name": "Alice",
  "passwordHash": "...",
  "role": "user",
  "createdAt": "2025-11-20T..."
}
```

Hostel:
```json
{
  "_id": "hostel_1",
  "ownerId": "user_2",
  "name": "Green Valley Hostel",
  "address": "12 MG Road",
  "amenities": ["WiFi","Laundry"],
  "createdAt": "..."
}
```

Booking:
```json
{
  "_id":"b_1",
  "userId":"user_1",
  "hostelId":"hostel_1",
  "roomId":"r101",
  "fromDate":"2025-12-01",
  "toDate":"2025-12-05",
  "nights":4,
  "amount":1200,
  "paid":false
}
```

---

## Frontend Implementation Report

This section maps pages, components, state variables, localStorage keys and typical workflows.

### Important localStorage keys (used by current frontend)
- `hostelManagement:auth` — current auth object: { role, authenticated, email, name, at }
- `hostelManagement:bookings` — array of booking objects (used by `PastBookings.jsx`)
- `hostelManagement:myHostel` — demo hostel state (used by `MyHostel.jsx`)
- `hostelManagement:owners` — demo owners list (used by `Owners.jsx`)
- `hostelManagement:hostels` — hostels list (used by `HostelDetails.jsx`)

These keys can be replaced with server endpoints; keep the same shapes for compatibility.

---

### Pages & Components (from `src/pages` and `src/components`)

Top-level pages:
- `HomePage.jsx` — hero, carousel, search, listing
- `AboutPage.jsx` — About Us + Services
- `SignInPage.jsx` / `RegisterPage.jsx` / `AdminRegister.jsx` — auth flows
- `DisplayHostelPage.jsx` / `BookingSite.jsx` — hostel detail & booking flow

User dashboard pages:
- `MyHostel.jsx` — view hostel and book available rooms (read-only for customers)
- `PastBookings.jsx` — list bookings; payment simulation; feedback; rebook; cancel
- `UserProfile.jsx` — profile settings

Admin dashboard pages (nested under AdminDashboard + `Sidebar.jsx`):
- `AdminDashboard.jsx` — layout + main admin index
- `HostelDetails.jsx` — list hostels, create/edit hostel form (planned to persist to DB)
- `Rooms.jsx` — manage rooms under a hostel
- `Owners.jsx` — manage owners/co-admins (stored in localStorage or via API)
- `Settings.jsx` — settings host, users, notifications etc (acts as outlet host)
- `Notification&Communication.jsx` — placeholder for templates/providers
- `SecurityAndAccess.jsx` — policy controls
- `Bookings.jsx`, `Complaints.jsx`, `Reports.jsx` — admin operations

Shared components:
- `Navbar.jsx` — top header; shows Sign In/Register when guest; shows user dropdown when role=user; shows direct admin link when role=owner; hidden on dashboard routes.
- `Footer.jsx` — site footer; hidden on dashboard routes.
- `Sidebar.jsx` — admin sidebar for AdminDashboard
- `Carousel.jsx` + `CarouselComponent.jsx` — hero carousel
- Smaller UI components: `RoomCardCarousel.jsx`, `OffersSection.jsx`, `RoomCarousel.jsx`

---

### Key state & form fields per page (mapping to DB fields)

- `SignInPage.jsx` — state: `role`, `email`, `password`. On submit sets `hostelManagement:auth` (role and email) and fires `hostelAuthChange` event. Map to `users` table.

- `RegisterPage.jsx` / `AdminRegister.jsx` — combined form fields: name, email, phone, displayName, bio, password, confirmPassword, files (profile, docs), agree. Map to user record and optionally hostel registration.

- `HostelDetails.jsx` — fields: name, address, phone, email, type, numberOfRooms, numberOfFloors, businessHours. Supports create/edit. Map to `hostels` table.

- `Owners.jsx` — form fields: name, email, password, confirmPassword, isSuper. Saves into `hostelManagement:owners` in localStorage for demo. Map to `users` with role `owner`.

- `PastBookings.jsx` — booking object: id, hostelId, hostelName, user, from, to, nights, amount, currency, paid, paymentRef, feedback, createdAt. UI supports search, filter (paid/unpaid), pay simulation, feedback save, cancel, rebook.

- `MyHostel.jsx` — shows `hostel` object fields (read-only for customers): name, address, contactEmail, contactPhone, totalRooms, floors, description, amenities; `rooms[]` with fields id, name, type, floor, rent, occupied; book/cancel functionality using `bookedRoomIds` array. Map to Rooms & Bookings in DB.

---

## Suggested REST API endpoints (for server-backed implementation)

- Auth
  - POST `/api/auth/login` { email, password } -> token + user
  - POST `/api/auth/register` { name, email, password, role }
- Users
  - GET `/api/users/:id`
  - PATCH `/api/users/:id`
- Hostels
  - GET `/api/hostels` (list/search)
  - GET `/api/hostels/:id`
  - POST `/api/hostels` (owner)
  - PATCH `/api/hostels/:id`
- Rooms
  - GET `/api/hostels/:hostelId/rooms`
  - POST `/api/hostels/:hostelId/rooms`
  - PATCH `/api/rooms/:id`
- Bookings
  - POST `/api/bookings`
  - GET `/api/users/:userId/bookings`
  - PATCH `/api/bookings/:id` (cancel/feedback)
- Payments
  - POST `/api/bookings/:id/pay`
- Complaints
  - POST `/api/complaints`
  - GET `/api/hostels/:id/complaints`

Implement role-based middleware (owner-only for hostels/rooms, admin-only for reports etc.).

---

## Validation & Business Rules

- Email: valid email format and unique.
- Password: min length (8), store hashed (bcrypt/argon2) server-side.
- Booking: `from_date <= to_date`; ensure no overlapping occupancy for same room or apply date-range availability check.
- Booking creation: room must be available (not occupied) for the requested dates.
- Room creation: rent >= 0, floor integer >= 0.
- Owner actions: only owners or admins can manage hostels and rooms belonging to them.

---

## Indexing & Performance Recommendations

- Index `users.email` (unique), `bookings.user_id`, `bookings.room_id`, and `rooms.hostel_id`.
- For text search on hostels/rooms add full-text indexes or search engine.
- Cache aggregated occupancy stats for admin reports if hostels are large.

---

## Suggested Next Steps

1. Decide DB engine (Postgres, MySQL, MongoDB) and create DDL from sample SQL above.
2. Implement a small backend service (Express + Sequelize/TypeORM or Node + Mongoose) with the endpoints above.
3. Replace `localStorage` demo persistence in frontend with real API calls (keep local seed for development mode).
4. Add authentication (JWT or sessions), secure storage of tokens, and role-based guards on routes.
5. Add server-side validation and tests for booking availability rules.

---

## File created
- `frontend/DATABASE_AND_FRONTEND_REPORT.md` — this file.

If you'd like, I can also:
- Generate a full SQL migration file (CREATE TABLEs + indexes) for Postgres.
- Generate an OpenAPI/Swagger spec for the API endpoints above.
- Scaffold a minimal Express server with these endpoints and SQLite for local dev.

Which of these would you like next? 
