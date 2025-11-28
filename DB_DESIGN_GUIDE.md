# Database Design Guide - Hostel Management System

A comprehensive guide for implementing the backend database schema with field mappings, ER diagrams, and step-by-step instructions.

---

## Table of Contents

1. [Overview](#overview)
2. [ER Diagram](#er-diagram)
3. [Entity Definitions](#entity-definitions)
4. [Field Mappings](#field-mappings)
5. [SQL Implementation (PostgreSQL)](#sql-implementation-postgresql)
6. [MongoDB Implementation (Alternative)](#mongodb-implementation-alternative)
7. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
8. [API Endpoints](#api-endpoints)
9. [Validation Rules](#validation-rules)
10. [Relationships & Constraints](#relationships--constraints)

---

## Overview

The Hostel Management System consists of **5 core entities**:

1. **USERS** - Guests, Owners, and Admins
2. **HOSTELS** - Hostel/PG properties
3. **ROOMS** - Individual rooms in hostels
4. **BOOKINGS** - Room reservations by guests
5. **COMPLAINTS** - Issues raised by guests or admins

### Key Principles
- ✅ All field names are standardized (unified across frontend and database)
- ✅ UUIDs for primary keys (scalable and secure)
- ✅ Timestamps for audit trails
- ✅ Proper foreign key relationships
- ✅ Optimized indexes for common queries

---

## ER Diagram

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ firstName       │
│ lastName        │
│ email (UNIQUE)  │
│ phone           │
│ passwordHash    │
│ role            │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │ (1)
         │
    (1)  │    (N)
┌────────▼────────────────────┐
│      HOSTELS                │
├─────────────────────────────┤
│ id (PK)                     │
│ ownerId (FK -> users)       │
│ name                        │
│ address                     │
│ contactPhone                │
│ contactEmail                │
│ type                        │
│ totalRooms                  │
│ floors                      │
│ description                 │
│ amenities                   │
│ status                      │
│ createdAt                   │
│ updatedAt                   │
└────────┬──────────┬─────────┘
         │ (1)      │ (1)
         │          │
    (1)  │          │    (1)
    ─────┘          └─────┐
    │                      │
    │ (N)              (N) │
┌───▼──────────┐   ┌──────▼────────┐
│    ROOMS     │   │   BOOKINGS    │
├──────────────┤   ├───────────────┤
│ id (PK)      │   │ id (PK)       │
│ hostelId(FK) │   │ hostelId(FK)  │
│ code         │   │ roomId(FK)    │
│ name         │   │ guestName     │
│ floor        │   │ guestEmail    │
│ type         │   │ guestPhone    │
│ rent         │   │ people        │
│ status       │   │ checkIn       │
│ features     │   │ checkOut      │
│ createdAt    │   │ nights        │
│ updatedAt    │   │ amount        │
│              │   │ paid          │
│              │   │ paymentRef    │
│              │   │ status        │
│              │   │ isPrimary     │
└──────────────┘   │ createdAt     │
     (1)           │ updatedAt     │
      │            └───┬──────────┘
      │ (N)            │ (1)
      │                │
      │                │ (N)
      │            ┌───▼─────────────┐
      │            │   COMPLAINTS    │
      │            ├─────────────────┤
      │            │ id (PK)         │
      │            │ hostelId(FK)    │
      │            │ roomId(FK)      │
      │            │ bookingId(FK)   │
      │            │ userId(FK)      │
      │            │ subject         │
      │            │ category        │
      │            │ description     │
      │            │ status          │
      │            │ adminNotes      │
      │            │ createdAt       │
      │            │ resolvedAt      │
      └────────────└─────────────────┘

LEGEND:
  (1) = One
  (N) = Many
  FK  = Foreign Key
  PK  = Primary Key
```

---

## Entity Definitions

### 1. USERS (Accounts & Authentication)

**Purpose:** Store user accounts for guests, owners, and administrators

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| id | UUID | ✅ | ✅ | Primary key |
| firstName | TEXT | ✅ | ❌ | First name of user |
| lastName | TEXT | ✅ | ❌ | Last name of user |
| email | VARCHAR(320) | ✅ | ✅ | Email address (unique) |
| phone | VARCHAR(32) | ❌ | ❌ | Primary phone number |
| secondaryPhone | VARCHAR(32) | ❌ | ❌ | Secondary phone number |
| passwordHash | TEXT | ✅ | ❌ | Bcrypt hashed password |
| role | VARCHAR(16) | ✅ | ❌ | `guest` \| `owner` \| `superowner` |
| displayName | TEXT | ❌ | ❌ | Display name (optional override) |
| bio | TEXT | ❌ | ❌ | User bio/profile info |
| profilePictureUrl | TEXT | ❌ | ❌ | URL to profile picture |
| aadharNumber | VARCHAR(50) | ❌ | ❌ | Aadhar ID (India) |
| panNumber | VARCHAR(50) | ❌ | ❌ | PAN ID (India) |
| documents | JSONB | ❌ | ❌ | Array of document URLs |
| createdAt | TIMESTAMP | ✅ | ❌ | Account creation timestamp |
| updatedAt | TIMESTAMP | ✅ | ❌ | Last update timestamp |

---

### 2. HOSTELS (Property Management)

**Purpose:** Store hostel/PG property information

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| id | UUID | ✅ | ✅ | Primary key |
| ownerId | UUID (FK) | ✅ | ❌ | References users.id |
| name | TEXT | ✅ | ❌ | Name of hostel |
| address | TEXT | ✅ | ❌ | Full address |
| contactPhone | VARCHAR(32) | ✅ | ❌ | Contact phone number |
| contactEmail | VARCHAR(320) | ✅ | ❌ | Contact email address |
| type | VARCHAR(20) | ✅ | ❌ | `hostel` \| `pg` \| `hotel` |
| totalRooms | INT | ✅ | ❌ | Total number of rooms |
| floors | INT | ✅ | ❌ | Number of floors |
| businessHours | TEXT | ❌ | ❌ | Operating hours (e.g., "9 AM - 6 PM") |
| description | TEXT | ❌ | ❌ | Detailed description |
| amenities | TEXT/JSONB | ❌ | ❌ | Comma-separated or JSON array |
| gstNumber | VARCHAR(50) | ❌ | ❌ | GST registration number |
| fssaiNumber | VARCHAR(50) | ❌ | ❌ | FSSAI registration (if applicable) |
| status | VARCHAR(20) | ✅ | ❌ | `active` \| `pending` \| `suspended` |
| createdAt | TIMESTAMP | ✅ | ❌ | Creation timestamp |
| updatedAt | TIMESTAMP | ✅ | ❌ | Last update timestamp |

---

### 3. ROOMS (Room Inventory)

**Purpose:** Store individual room records

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| id | UUID | ✅ | ✅ | Primary key |
| hostelId | UUID (FK) | ✅ | ❌ | References hostels.id |
| code | VARCHAR(10) | ✅ | ❌ | Room code (e.g., "101", "202") |
| name | TEXT | ✅ | ❌ | Room name (e.g., "Deluxe Single") |
| floor | INT | ✅ | ❌ | Floor number |
| type | VARCHAR(20) | ✅ | ❌ | `single` \| `double` \| `triple` |
| rent | NUMERIC(10,2) | ✅ | ❌ | Room rent per night |
| status | VARCHAR(20) | ✅ | ❌ | `available` \| `occupied` \| `maintenance` |
| features | JSONB | ❌ | ❌ | JSON: {ac, tv, waterHeater, wifi} |
| createdAt | TIMESTAMP | ✅ | ❌ | Creation timestamp |
| updatedAt | TIMESTAMP | ✅ | ❌ | Last update timestamp |

---

### 4. BOOKINGS (Reservations)

**Purpose:** Store room booking records

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| id | UUID | ✅ | ✅ | Primary key |
| orderId | VARCHAR(50) | ✅ | ✅ | Booking reference (e.g., "BK-2025-001") |
| hostelId | UUID (FK) | ✅ | ❌ | References hostels.id |
| roomId | UUID (FK) | ✅ | ❌ | References rooms.id |
| guestName | TEXT | ✅ | ❌ | Name of guest |
| guestEmail | VARCHAR(320) | ✅ | ❌ | Guest email address |
| guestPhone | VARCHAR(32) | ✅ | ❌ | Guest phone number |
| people | INT | ✅ | ❌ | Number of people |
| checkIn | DATE | ✅ | ❌ | Check-in date |
| checkOut | DATE | ✅ | ❌ | Check-out date |
| nights | INT | ✅ | ❌ | Number of nights |
| amount | NUMERIC(12,2) | ✅ | ❌ | Total booking amount |
| currency | VARCHAR(3) | ✅ | ❌ | Currency code (e.g., "INR") |
| paid | BOOLEAN | ✅ | ❌ | Payment status (true/false) |
| paymentRef | VARCHAR(100) | ❌ | ❌ | Payment transaction reference |
| status | VARCHAR(20) | ✅ | ❌ | `pending` \| `confirmed` \| `cancelled` \| `completed` |
| feedback | TEXT | ❌ | ❌ | Guest feedback/review |
| isPrimary | BOOLEAN | ✅ | ❌ | Is primary booking for user |
| createdAt | TIMESTAMP | ✅ | ❌ | Creation timestamp |
| updatedAt | TIMESTAMP | ✅ | ❌ | Last update timestamp |

---

### 5. COMPLAINTS (Issue Management)

**Purpose:** Track guest and admin complaints/issues

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| id | UUID | ✅ | ✅ | Primary key |
| orderId | VARCHAR(50) | ❌ | ❌ | Associated booking reference |
| hostelId | UUID (FK) | ✅ | ❌ | References hostels.id |
| roomId | UUID (FK) | ❌ | ❌ | References rooms.id (optional) |
| bookingId | UUID (FK) | ❌ | ❌ | References bookings.id (optional) |
| userId | UUID (FK) | ✅ | ❌ | References users.id (complaint raiser) |
| userName | TEXT | ✅ | ❌ | Name of complaint raiser |
| subject | TEXT | ✅ | ❌ | Complaint subject/title |
| category | VARCHAR(50) | ✅ | ❌ | `Maintenance` \| `Security` \| `Services` \| `Other` |
| description | TEXT | ✅ | ❌ | Detailed description |
| status | VARCHAR(20) | ✅ | ❌ | `pending` \| `in-progress` \| `resolved` \| `closed` |
| adminNotes | TEXT | ❌ | ❌ | Admin resolution notes |
| createdAt | TIMESTAMP | ✅ | ❌ | Complaint filing timestamp |
| resolvedAt | TIMESTAMP | ❌ | ❌ | Resolution timestamp |

---

## Field Mappings

### Frontend → Database Field Mapping

#### Register Page (Guest User)
| Frontend Field | Database Field | Table | Notes |
|---|---|---|---|
| name (first) | firstName | users | First name |
| name (last) | lastName | users | Last name |
| email | email | users | Unique identifier |
| password | passwordHash | users | Must be bcrypt hashed |

#### Admin Register Page (Owner)
| Frontend Field | Database Field | Table | Notes |
|---|---|---|---|
| firstName | firstName | users | Owner's first name |
| lastName | lastName | users | Owner's last name |
| email | email | users | Unique identifier |
| phone | phone | users | Contact number |
| documents | documents | users | JSONB array |
| password | passwordHash | users | Must be bcrypt hashed |
| role | role | users | Set to "owner" or "superowner" |

#### Hostel Details Page
| Frontend Field | Database Field | Table | Notes |
|---|---|---|---|
| name | name | hostels | Hostel name |
| address | address | hostels | Full address |
| contactPhone | contactPhone | hostels | Contact phone |
| contactEmail | contactEmail | hostels | Contact email |
| type | type | hostels | hostel/pg/hotel |
| totalRooms | totalRooms | hostels | Number of rooms |
| floors | floors | hostels | Number of floors |
| businessHours | businessHours | hostels | Operating hours |
| description | description | hostels | Hostel description |
| amenities | amenities | hostels | Comma-separated list |

#### Rooms Page
| Frontend Field | Database Field | Table | Notes |
|---|---|---|---|
| code | code | rooms | Room code (101, 202, etc) |
| name | name | rooms | Room name/title |
| floor | floor | rooms | Floor number |
| type | type | rooms | single/double/triple |
| rent | rent | rooms | Price per night |
| status | status | rooms | available/occupied/maintenance |
| features.ac | features.ac | rooms | Boolean in JSONB |
| features.tv | features.tv | rooms | Boolean in JSONB |
| features.waterHeater | features.waterHeater | rooms | Boolean in JSONB |

#### Bookings Page
| Frontend Field | Database Field | Table | Notes |
|---|---|---|---|
| id | id | bookings | Booking ID |
| reference | orderId | bookings | Booking reference |
| hostelId | hostelId | bookings | FK to hostels |
| roomId | roomId | bookings | FK to rooms |
| guestName | guestName | bookings | Guest name |
| guestEmail | guestEmail | bookings | Guest email |
| guestPhone | guestPhone | bookings | Guest phone |
| people | people | bookings | Number of guests |
| checkIn | checkIn | bookings | Check-in date |
| checkOut | checkOut | bookings | Check-out date |
| nights | nights | bookings | Night count |
| amount | amount | bookings | Total amount |
| paid | paid | bookings | Payment status |
| paymentRef | paymentRef | bookings | Payment reference |
| status | status | bookings | pending/confirmed/etc |

#### Complaints Page
| Frontend Field | Database Field | Table | Notes |
|---|---|---|---|
| id | id | complaints | Complaint ID |
| subject | subject | complaints | Complaint title |
| category | category | complaints | Category enum |
| description | description | complaints | Detailed description |
| status | status | complaints | pending/in-progress/resolved |
| userId | userId | complaints | FK to users |
| userName | userName | complaints | Complaint raiser name |

---

## SQL Implementation (PostgreSQL)

### Prerequisites
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hostel_management;
```

### Complete SQL Schema

```sql
-- Switch to the database
\c hostel_management;

-- Create USERS table
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

-- Create HOSTELS table
CREATE TABLE hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_phone VARCHAR(32) NOT NULL,
  contact_email VARCHAR(320) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('hostel', 'pg', 'hotel')),
  total_rooms INT NOT NULL,
  floors INT NOT NULL,
  business_hours TEXT,
  description TEXT,
  amenities TEXT,
  gst_number VARCHAR(50),
  fssai_number VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create ROOMS table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  name TEXT NOT NULL,
  floor INT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'double', 'triple')),
  rent NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  features JSONB DEFAULT '{"ac": false, "tv": false, "waterHeater": false}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(hostel_id, code)
);

-- Create BOOKINGS table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) UNIQUE NOT NULL,
  hostel_id UUID NOT NULL REFERENCES hostels(id),
  room_id UUID NOT NULL REFERENCES rooms(id),
  guest_name TEXT NOT NULL,
  guest_email VARCHAR(320) NOT NULL,
  guest_phone VARCHAR(32) NOT NULL,
  people INT NOT NULL CHECK (people > 0),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INT NOT NULL CHECK (nights > 0),
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) DEFAULT 'INR',
  paid BOOLEAN DEFAULT false,
  payment_ref VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  feedback TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create COMPLAINTS table
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50),
  hostel_id UUID NOT NULL REFERENCES hostels(id),
  room_id UUID REFERENCES rooms(id),
  booking_id UUID REFERENCES bookings(id),
  user_id UUID NOT NULL REFERENCES users(id),
  user_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Maintenance', 'Security', 'Services', 'Other')),
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  resolved_at TIMESTAMP
);

-- Create Indexes for Performance

-- USERS table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- HOSTELS table indexes
CREATE INDEX idx_hostels_owner_id ON hostels(owner_id);
CREATE INDEX idx_hostels_status ON hostels(status);
CREATE INDEX idx_hostels_type ON hostels(type);

-- ROOMS table indexes
CREATE INDEX idx_rooms_hostel_id ON rooms(hostel_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_floor ON rooms(floor);

-- BOOKINGS table indexes
CREATE INDEX idx_bookings_hostel_id ON bookings(hostel_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_order_id ON bookings(order_id);
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_check_out ON bookings(check_out);
CREATE INDEX idx_bookings_status ON bookings(status);

-- COMPLAINTS table indexes
CREATE INDEX idx_complaints_hostel_id ON complaints(hostel_id);
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);
```

### Sample Data Insertion

```sql
-- Insert a test user
INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
VALUES ('John', 'Doe', 'john@example.com', '+91-9876543210', '$2b$10$...', 'owner');

-- Get the user ID
SELECT id FROM users WHERE email = 'john@example.com';

-- Insert a hostel (replace 'user_id' with actual ID)
INSERT INTO hostels (owner_id, name, address, contact_phone, contact_email, type, total_rooms, floors, description, amenities, status)
VALUES (
  'user_id',
  'Green Valley Hostel',
  '123 Main Street, City',
  '+91-1234567890',
  'green@hostel.com',
  'hostel',
  50,
  5,
  'Modern hostel with great amenities',
  'WiFi, AC, Hot Water, Gym, Food',
  'active'
);

-- Get the hostel ID
SELECT id FROM hostels WHERE name = 'Green Valley Hostel';

-- Insert rooms (replace 'hostel_id' with actual ID)
INSERT INTO rooms (hostel_id, code, name, floor, type, rent, status, features)
VALUES
  ('hostel_id', '101', 'Deluxe Single', 1, 'single', 1500.00, 'available', '{"ac": true, "tv": true, "waterHeater": true}'),
  ('hostel_id', '102', 'Premium Double', 1, 'double', 2500.00, 'available', '{"ac": true, "tv": true, "waterHeater": true}'),
  ('hostel_id', '201', 'Economy Triple', 2, 'triple', 3000.00, 'occupied', '{"ac": false, "tv": false, "waterHeater": true}');
```

---

## MongoDB Implementation (Alternative)

If using MongoDB instead of PostgreSQL:

```javascript
// Create collections
db.createCollection("users");
db.createCollection("hostels");
db.createCollection("rooms");
db.createCollection("bookings");
db.createCollection("complaints");

// Users Collection
db.users.insertOne({
  _id: ObjectId(),
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+91-9876543210",
  passwordHash: "$2b$10$...",
  role: "owner",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.hostels.createIndex({ ownerId: 1 });
db.rooms.createIndex({ hostelId: 1 });
db.bookings.createIndex({ hostelId: 1, roomId: 1 });
db.complaints.createIndex({ hostelId: 1, userId: 1 });
```

---

## Step-by-Step Implementation Guide

### Phase 1: Database Setup (Week 1)

#### Step 1.1: Choose Database Technology
- [ ] Decide between PostgreSQL (SQL) or MongoDB (NoSQL)
- [ ] PostgreSQL recommended for: Strong relationships, transactions, easier migrations
- [ ] MongoDB recommended for: High flexibility, horizontal scaling, nested documents

#### Step 1.2: Set Up Database Server
```bash
# PostgreSQL setup
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
psql -U postgres

# Create database and user
CREATE DATABASE hostel_management;
CREATE USER hostel_admin WITH PASSWORD 'secure_password';
ALTER ROLE hostel_admin SET client_encoding TO 'utf8';
ALTER ROLE hostel_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE hostel_admin SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE hostel_management TO hostel_admin;
\q
```

#### Step 1.3: Run SQL Schema
```bash
# Connect to database as hostel_admin
psql -U hostel_admin -d hostel_management -f schema.sql

# Verify tables created
\dt  # List tables
```

### Phase 2: Backend Setup (Week 2)

#### Step 2.1: Create Backend Project
```bash
# Initialize Node.js project
cd hostel-management/backend
npm init -y

# Install dependencies
npm install express dotenv cors bcryptjs jsonwebtoken pg
npm install --save-dev nodemon
```

#### Step 2.2: Set Up Environment Variables
```bash
# Create .env file
echo "
DATABASE_URL=postgresql://hostel_admin:secure_password@localhost:5432/hostel_management
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
" > .env
```

#### Step 2.3: Create Database Connection
```javascript
// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
```

### Phase 3: API Development (Week 3-4)

#### Step 3.1: User Management APIs
- [ ] POST `/api/users/register` - Register new user
- [ ] POST `/api/users/login` - User login
- [ ] POST `/api/users/verify` - Verify JWT token
- [ ] GET `/api/users/:id` - Get user profile
- [ ] PUT `/api/users/:id` - Update user profile

#### Step 3.2: Hostel Management APIs
- [ ] POST `/api/hostels` - Create new hostel
- [ ] GET `/api/hostels` - List all hostels
- [ ] GET `/api/hostels/:id` - Get hostel details
- [ ] PUT `/api/hostels/:id` - Update hostel
- [ ] DELETE `/api/hostels/:id` - Delete hostel
- [ ] GET `/api/hostels/:id/rooms` - List rooms in hostel

#### Step 3.3: Room Management APIs
- [ ] POST `/api/hostels/:hostelId/rooms` - Add room
- [ ] GET `/api/hostels/:hostelId/rooms` - List rooms
- [ ] PUT `/api/rooms/:id` - Update room
- [ ] DELETE `/api/rooms/:id` - Delete room

#### Step 3.4: Booking APIs
- [ ] POST `/api/bookings` - Create booking
- [ ] GET `/api/bookings` - List bookings
- [ ] GET `/api/bookings/:id` - Get booking details
- [ ] PUT `/api/bookings/:id` - Update booking status
- [ ] DELETE `/api/bookings/:id` - Cancel booking

#### Step 3.5: Complaints APIs
- [ ] POST `/api/complaints` - File complaint
- [ ] GET `/api/complaints` - List complaints
- [ ] GET `/api/complaints/:id` - Get complaint details
- [ ] PUT `/api/complaints/:id` - Update complaint status
- [ ] PUT `/api/complaints/:id/resolve` - Resolve complaint

### Phase 4: Frontend Integration (Week 5)

#### Step 4.1: Replace localStorage with API Calls
Update components to use fetch/axios instead of localStorage:

```javascript
// Example: Replace localStorage with API
// BEFORE (localStorage)
const rooms = JSON.parse(localStorage.getItem('hostelManagement:rooms_v4') || '[]')

// AFTER (API)
const [rooms, setRooms] = useState([])
useEffect(() => {
  fetch('/api/hostels/:hostelId/rooms')
    .then(res => res.json())
    .then(data => setRooms(data))
}, [hostelId])
```

#### Step 4.2: Update Authentication
```javascript
// Replace btoa() with proper JWT
// BEFORE (insecure)
const auth = { email, password: btoa(password) }

// AFTER (secure JWT)
const response = await fetch('/api/users/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
const { token } = await response.json()
localStorage.setItem('token', token)
```

#### Step 4.3: Add API Base URL
```javascript
// utils/api.js
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export const apiCall = (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  })
}
```

---

## API Endpoints

### Authentication
```
POST   /api/users/register          - Register new user
POST   /api/users/login             - User login
POST   /api/users/verify            - Verify JWT token
POST   /api/users/logout            - User logout
```

### Users
```
GET    /api/users/:id               - Get user profile
PUT    /api/users/:id               - Update user profile
DELETE /api/users/:id               - Delete user account
GET    /api/users                   - List all users (admin only)
```

### Hostels
```
POST   /api/hostels                 - Create hostel
GET    /api/hostels                 - List all hostels
GET    /api/hostels/:id             - Get hostel details
PUT    /api/hostels/:id             - Update hostel
DELETE /api/hostels/:id             - Delete hostel
GET    /api/hostels/:id/rooms       - List rooms in hostel
GET    /api/hostels/:id/bookings    - List bookings for hostel
```

### Rooms
```
POST   /api/hostels/:hostelId/rooms - Create room
GET    /api/hostels/:hostelId/rooms - List rooms
GET    /api/rooms/:id               - Get room details
PUT    /api/rooms/:id               - Update room
DELETE /api/rooms/:id               - Delete room
GET    /api/rooms/:id/availability  - Check room availability
```

### Bookings
```
POST   /api/bookings                - Create booking
GET    /api/bookings                - List bookings (filtered)
GET    /api/bookings/:id            - Get booking details
PUT    /api/bookings/:id            - Update booking
DELETE /api/bookings/:id            - Cancel booking
PUT    /api/bookings/:id/confirm    - Confirm booking
PUT    /api/bookings/:id/complete   - Mark as completed
```

### Complaints
```
POST   /api/complaints              - File complaint
GET    /api/complaints              - List complaints
GET    /api/complaints/:id          - Get complaint details
PUT    /api/complaints/:id          - Update complaint
PUT    /api/complaints/:id/resolve  - Resolve complaint
DELETE /api/complaints/:id          - Delete complaint
```

---

## Validation Rules

### USERS
- ✅ Email must be valid and unique
- ✅ Password must be minimum 8 characters
- ✅ Phone must be valid format (10+ digits)
- ✅ firstName and lastName required
- ✅ Role must be one of: guest, owner, superowner

### HOSTELS
- ✅ Name must be 3-100 characters
- ✅ Address must be 5-200 characters
- ✅ contactPhone and contactEmail required
- ✅ Type must be: hostel, pg, or hotel
- ✅ totalRooms > 0 and ≤ 500
- ✅ floors > 0 and ≤ 20
- ✅ Status must be: active, pending, or suspended
- ✅ Owner must exist and be verified

### ROOMS
- ✅ Code must be unique per hostel (e.g., "101")
- ✅ Floor must be ≥ 1 and ≤ hostel.floors
- ✅ Type must be: single, double, or triple
- ✅ Rent must be > 0
- ✅ Status must be: available, occupied, or maintenance
- ✅ Room.hostelId must reference existing hostel

### BOOKINGS
- ✅ checkOut date > checkIn date
- ✅ Nights calculated as: (checkOut - checkIn) / 24 hours
- ✅ Amount > 0
- ✅ Guest name, email, phone required
- ✅ People > 0 and ≤ room capacity
- ✅ Room must be available on checkIn/checkOut dates
- ✅ Status must be: pending, confirmed, cancelled, or completed

### COMPLAINTS
- ✅ Subject 5-100 characters
- ✅ Description 10-500 characters
- ✅ Category must be: Maintenance, Security, Services, or Other
- ✅ Status must be: pending, in-progress, resolved, or closed
- ✅ userId must reference existing user

---

## Relationships & Constraints

### Foreign Key Relationships

```
USERS (1) ──────────── (N) HOSTELS
  └─ One user can own multiple hostels

HOSTELS (1) ──────────── (N) ROOMS
  └─ One hostel has multiple rooms

HOSTELS (1) ──────────── (N) BOOKINGS
  └─ One hostel receives multiple bookings

ROOMS (1) ──────────── (N) BOOKINGS
  └─ One room can have multiple bookings (different dates)

BOOKINGS (1) ──────────── (N) COMPLAINTS
  └─ One booking can have multiple complaints

USERS (1) ──────────── (N) COMPLAINTS
  └─ One user can file multiple complaints

HOSTELS (1) ──────────── (N) COMPLAINTS
  └─ One hostel can have multiple complaints
```

### Cascade Delete Rules

```
DELETE user → DELETE related hostels → DELETE related rooms → DELETE related bookings/complaints
DELETE hostel → DELETE related rooms → DELETE related bookings/complaints
DELETE booking → DELETE related complaints
```

### Data Integrity Constraints

```sql
-- Check constraints
ALTER TABLE rooms ADD CHECK (floor >= 1);
ALTER TABLE rooms ADD CHECK (rent > 0);
ALTER TABLE bookings ADD CHECK (people > 0);
ALTER TABLE bookings ADD CHECK (check_out > check_in);
ALTER TABLE hostels ADD CHECK (total_rooms > 0);
ALTER TABLE hostels ADD CHECK (floors > 0);
```

---

## Implementation Checklist

### Database Layer
- [ ] PostgreSQL/MongoDB installed and configured
- [ ] Database created with proper credentials
- [ ] Schema created with all tables/collections
- [ ] Indexes created for performance
- [ ] Sample data inserted for testing

### Backend Layer
- [ ] Node.js server initialized
- [ ] Database connection configured
- [ ] Authentication module implemented
- [ ] User management APIs implemented
- [ ] Hostel management APIs implemented
- [ ] Room management APIs implemented
- [ ] Booking system APIs implemented
- [ ] Complaint system APIs implemented
- [ ] Error handling and validation implemented
- [ ] API documentation generated (Swagger/OpenAPI)

### Frontend Layer
- [ ] localStorage replaced with API calls
- [ ] Authentication integrated with JWT
- [ ] All pages updated to use live API data
- [ ] Error handling and loading states added
- [ ] API base URL configuration added
- [ ] Environment variables configured

### Testing & Deployment
- [ ] Unit tests written
- [ ] Integration tests completed
- [ ] API endpoints tested (Postman/Insomnia)
- [ ] Frontend tested in browser
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Deployed to production

---

## Quick Start Commands

```bash
# PostgreSQL Setup
sudo apt-get install postgresql
sudo systemctl start postgresql
psql -U postgres
CREATE DATABASE hostel_management;
\c hostel_management
\i /path/to/schema.sql

# Backend Setup
cd backend
npm install
npm install express pg bcryptjs jsonwebtoken dotenv cors
npm install --save-dev nodemon
echo "DATABASE_URL=postgresql://user:password@localhost:5432/hostel_management" > .env
npm start

# Frontend Update (in React component)
const [rooms, setRooms] = useState([])
useEffect(() => {
  fetch('/api/hostels/:hostelId/rooms')
    .then(res => res.json())
    .then(data => setRooms(data))
}, [])
```

---

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Express Guide](https://expressjs.com/)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [React Data Fetching](https://react.dev/learn/synchronizing-with-effects)
- [Postman API Testing](https://www.postman.com/api-platform/)

---

**Last Updated:** November 27, 2025
**Version:** 1.0
**Database Designer:** Hostel Management Team
