# Hostel Verification Form Implementation

## Overview
Created a comprehensive **HostelVerificationForm** component that collects documents and additional information needed for hostel verification before it becomes active.

## New Component: `HostelVerificationForm.jsx`

**Location:** `frontend/src/components/HostelVerificationForm.jsx`

### Features:

#### 1. **Hostel Type & Services Section**
- Hostel Type dropdown (PG / Hostel / Hotel)
- Food provided checkbox

#### 2. **Identity & Property Documents Section**
- **Owner Identity Proof** (Aadhaar/PAN) - Required file upload
- **Property Proof** (Electricity Bill/Lease Deed) - Required file upload
- **Trade License** (if available) - Optional file upload
- File preview showing uploaded filename and size
- Supported formats: PDF, JPG, PNG (max 5MB each)

#### 3. **Police Verification Section**
- Checkbox for police verification clearance
- Conditional field: Police Verification Reference (only shows if verified)
- Reference field becomes required when checkbox is selected

#### 4. **Registration Numbers Section**
- GST Number (optional)
- FSSAI License Number (optional)

### Component Props:
```javascript
<HostelVerificationForm 
  hostelData={hostelData}           // Hostel data from previous step
  onSubmitSuccess={handleSubmit}    // Callback when form is submitted
  onBack={handleBack}               // Callback to go back to hostel form
/>
```

---

## Backend Model Updates: `Hostel Model`

**Location:** `backend/hostels/models.py`

### New Fields Added:

```python
# Hostel Type & Services
hostel_type = CharField(choices=[('pg', 'PG'), ('hostel', 'Hostel'), ('hotel', 'Hotel')])
food_provided = BooleanField(default=False)

# Document Storage
owner_id_proof = FileField(upload_to='documents/id_proof/')
property_proof = FileField(upload_to='documents/property_proof/')
trade_license = FileField(upload_to='documents/trade_license/')

# Police Verification
police_verification = BooleanField(default=False)
police_verification_reference = CharField(max_length=100)

# Registration Numbers
gst_number = CharField(max_length=50)
fssai_license = CharField(max_length=50)

# Verification Status
is_verified = BooleanField(default=False)
```

---

## Backend Serializer Updates: `HostelSerializer`

**Location:** `backend/hostels/serializers.py`

### Added Fields to Serializer:
- `hostel_type`
- `food_provided`
- `owner_id_proof`
- `property_proof`
- `trade_license`
- `police_verification`
- `police_verification_reference`
- `gst_number`
- `fssai_license`
- `is_verified`

### Read-Only Fields:
- `is_verified` - Can only be changed by staff/admin panel

---

## Frontend Flow: AdminRegister.jsx

### Updated Registration Steps:
1. **Step 1 (form):** Admin account registration
2. **Step 2 (otp):** OTP verification
3. **Step 3 (hostel):** Basic hostel information
4. **Step 4 (verification):** ⭐ NEW - Documents and additional details
5. **Step 5 (post):** Success confirmation

### Updated Step Handler:
```javascript
const [step, setStep] = useState('form') 
// Now supports: 'form' | 'otp' | 'hostel' | 'verification' | 'post'
```

### New Handler Functions:
- `handleVerificationSubmit()` - Processes verification form submission
- `handleBackFromVerification()` - Navigates back to hostel form

### Success Message Updates:
- Shows hostel type and food service status
- Displays document submission confirmation
- Updated next steps mentioning document verification

---

## Database Migration Required

Run these commands to add new fields:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

---

## File Paths & Structure

```
frontend/src/
├── components/
│   ├── HostelRegistrationForm.jsx  (existing)
│   └── HostelVerificationForm.jsx  (NEW)
└── pages/MainWebsite/
    └── AdminRegister.jsx            (updated)

backend/
├── hostels/
│   ├── models.py                    (updated)
│   └── serializers.py               (updated)
└── media/
    └── documents/                   (directory for file storage)
        ├── id_proof/
        ├── property_proof/
        └── trade_license/
```

---

## User Experience Flow

### Registration Journey:
1. **Admin Registration:** User provides personal details and password
2. **OTP Verification:** Verify phone number
3. **Hostel Basics:** Enter hostel name, address, rooms, etc.
4. **Document Verification:** Upload all required documents and info
5. **Success:** See confirmation with all submitted data

### After Registration:
- Admin receives email confirmation
- Documents go to verification queue
- Dashboard shows hostel with "Pending Verification" status
- Once verified (is_verified=True), full dashboard access granted

---

## TODO - Backend Integration

1. **Create API Endpoint:** `PATCH /api/hostels/{id}/verify/`
   - Update hostel with verification documents
   - Handle file uploads

2. **Create Frontend API Function:** `UPDATE_HOSTEL_VERIFICATION()`
   - Send FormData with files to backend
   - Handle file upload progress

3. **Django Admin Configuration:**
   - Display is_verified field in hostel list
   - Create action to approve/reject hostels
   - Add email trigger on status change

4. **Email System:**
   - Send notification when documents received
   - Send approval/rejection email with reason

---

## Validation Rules

### Required Fields:
- Hostel Type
- Owner ID Proof (file)
- Property Proof (file)
- Police Verification Reference (if verified checkbox is selected)

### Optional Fields:
- Trade License
- GST Number
- FSSAI License
- Police Verification checkbox

### File Validation:
- Formats: PDF, JPG, PNG
- Max size: 5MB per file

---

## Security Notes

1. **File Upload Security:**
   - Store files in `media/documents/` directory
   - Validate file types on backend
   - Scan for malware (consider adding)

2. **Access Control:**
   - Only owner can upload documents
   - Only staff can approve verification
   - `is_verified` is read-only in API

3. **Data Privacy:**
   - Consider encrypting sensitive document storage
   - Implement access logs for admin viewing

---

## Next Steps

1. Run migrations to add fields to database
2. Create file upload endpoint in backend
3. Add `UPDATE_HOSTEL_VERIFICATION()` API function in frontend
4. Test complete registration flow end-to-end
5. Implement Django admin approval interface
6. Add email notification system
