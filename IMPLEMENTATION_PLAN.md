# Hostel Management - New Registration & Dashboard Plan

## Overview
Change from registering admin + hostel together in one form, to a two-step process:
1. Register as admin only (simple form)
2. Create hostel after login (in empty dashboard)
3. Wait for verification
4. Get email confirmation → dashboard updates

---

## STEP-BY-STEP IMPLEMENTATION PLAN

### **STEP 1: Update Admin Registration Form** ⏳ (Frontend)

**What to do:**
- Open `frontend/src/pages/MainWebsite/AdminRegister.jsx`
- Remove all hostel-related fields from the form
- Keep only these admin/user fields:
  - First Name, Last Name
  - Email, Phone Number
  - Country Code, Address
  - Country, City, State, Zip Code
  - Password, Confirm Password
  - Terms & Conditions checkbox (agree)

**Expected outcome:**
- AdminRegister form is now simple and clean
- Only collects admin information
- No hostel fields visible
- Success message: "Login to continue" (instead of showing hostel summary)

**Files to change:**
- `frontend/src/pages/MainWebsite/AdminRegister.jsx`

---

### **STEP 2: Create Hostel Registration Form** ⏳ (Frontend)

**What to do:**
- Create a new file: `frontend/src/components/HostelRegistrationForm.jsx`
- This form will collect hostel information only:
  - Hostel Name
  - Hostel Address
  - City, State, Country, Zip Code
  - Contact Phone
  - Total Rooms, Floors
  - Business Hours
  - GST Number (optional)
  - FSSAI License (optional)
  - Submit button

**Expected outcome:**
- New reusable form component ready to use
- Can be displayed in admin dashboard
- Can be displayed in a modal or inline

**Files to create:**
- `frontend/src/components/HostelRegistrationForm.jsx`

---

### **STEP 3: Update Admin Dashboard - Empty State** ⏳ (Frontend)

**What to do:**
- Open `frontend/src/pages/AdminDashboard/AdminDashboard.jsx`
- Add empty state display:
  - Grey text in center saying: "No hostels yet"
  - Large **"+"** button below the text
  - When user clicks **"+"**, show the HostelRegistrationForm

**Expected outcome:**
- Dashboard shows empty state on first login
- User can click **"+"** button to open hostel form
- Form appears in modal or same page (your choice)
- After user fills and submits form, show message: "Well get back to you after verifying details."

**Files to change:**
- `frontend/src/pages/AdminDashboard/AdminDashboard.jsx`

---

### **STEP 4: Add Hostel Status Field** ⏳ (Backend)

**What to do:**
- Open `backend/hostels/models.py`
- Add a new field to the Hostel model:
  ```python
  status = models.CharField(
      max_length=20,
      choices=[
          ('pending_verification', 'Pending Verification'),
          ('verified', 'Verified'),
          ('rejected', 'Rejected'),
      ],
      default='pending_verification'
  )
  ```

**Expected outcome:**
- Hostel model now tracks verification status
- Every new hostel starts as "pending_verification"
- Can be changed to "verified" or "rejected" by staff

**Files to change:**
- `backend/hostels/models.py`

**After changes:**
- Run migration: `python manage.py makemigrations`
- Run migration: `python manage.py migrate`

---

### **STEP 5: Create Hostel Creation API Endpoint** ⏳ (Backend)

**What to do:**
- Open `backend/hostels/serializers.py`
- Create a new serializer called `HostelCreateSerializer`:
  - Accept all hostel fields (name, address, city, state, country, zip_code, contact_phone, rooms, floors, business_hours, gst_number, fssai_license)
  - In the `create()` method, set `owner = current logged-in user`
  - Set `status = 'pending_verification'`

**Expected outcome:**
- Serializer validates hostel data
- Creates hostel with owner and status automatically

**Files to change:**
- `backend/hostels/serializers.py`

---

### **STEP 6: Create Hostel Creation View** ⏳ (Backend)

**What to do:**
- Open `backend/hostels/views.py`
- Create a new view called `CreateHostelView`:
  - Extend `generics.CreateAPIView`
  - Use `HostelCreateSerializer`
  - Require authentication (only logged-in admins can create)
  - Return success message: "Hostel registered. Awaiting verification."

**Expected outcome:**
- API endpoint ready to receive hostel creation requests
- Only authenticated users can create hostels
- Response includes hostel details and status

**Files to change:**
- `backend/hostels/views.py`

---

### **STEP 7: Add Hostel URL Endpoint** ⏳ (Backend)

**What to do:**
- Open `backend/hostels/urls.py`
- Add new URL pattern:
  ```python
  path('', CreateHostelView.as_view(), name='create_hostel')  # POST /api/hostels/
  ```

**Expected outcome:**
- Endpoint `POST /api/hostels/` is now available
- Frontend can send hostel data to this endpoint

**Files to change:**
- `backend/hostels/urls.py`

---

### **STEP 8: Create Frontend API Function for Hostel Creation** ⏳ (Frontend)

**What to do:**
- Open `frontend/src/Data/request.js`
- Add new function:
  ```javascript
  export const CREATE_HOSTEL = async (hostelData) => {
    return axios.post('/api/hostels/', hostelData)
  }
  ```

**Expected outcome:**
- Frontend can easily call the hostel creation API

**Files to change:**
- `frontend/src/Data/request.js`

---

### **STEP 9: Connect Hostel Form to API** ⏳ (Frontend)

**What to do:**
- Open `frontend/src/components/HostelRegistrationForm.jsx`
- In the form submission handler:
  - Call `CREATE_HOSTEL(formData)`
  - On success: Show message "Well get back to you after verifying details."
  - On error: Show error message to user
  - Close the form modal

**Expected outcome:**
- When user submits hostel form, data is sent to backend
- Success/error message is displayed

**Files to change:**
- `frontend/src/components/HostelRegistrationForm.jsx`

---

### **STEP 10: Update Dashboard to Show Hostel List** ⏳ (Frontend)

**What to do:**
- Open `frontend/src/pages/AdminDashboard/AdminDashboard.jsx`
- After hostel creation, fetch and display hostel list
- Show hostel details based on status:
  - If status = "pending_verification": Show "⏳ Verification in progress..."
  - If status = "verified": Show full hostel details and allow editing
  - If status = "rejected": Show "❌ Rejected. Please contact support."

**Expected outcome:**
- Dashboard shows hostel list (if any)
- Empty state shown if no hostels
- User can see status of their hostels

**Files to change:**
- `frontend/src/pages/AdminDashboard/AdminDashboard.jsx`

---

### **STEP 11: Backend Verification System** ⏳ (Backend - Optional for Phase 1)

**What to do:**
- Create a Django admin interface or management command to verify hostels
- Staff can review pending hostels and change status to "verified" or "rejected"
- When status changes, trigger email notification

**Expected outcome:**
- Staff can approve/reject hostel registrations
- Emails are sent to admins about their hostel status

**Files to change:**
- `backend/hostels/admin.py` (for Django admin)
- `backend/hostels/signals.py` (for email trigger - optional)

---

### **STEP 12: Email Notification on Verification** ⏳ (Backend - Optional for Phase 1)

**What to do:**
- When staff changes hostel status to "verified", send email to admin
- Email content:
  ```
  Subject: Hostel Registered Successfully
  
  Hi [Admin Name],
  
  Your hostel "[Hostel Name]" has been verified successfully.
  You can now access your admin dashboard to manage bookings and rooms.
  
  Login here: [Dashboard URL]
  ```

**Expected outcome:**
- Admin receives email confirmation
- Admin logs in and sees active hostel in dashboard

**Files to change/create:**
- `backend/hostels/signals.py` (optional)
- Email template file

---

## Summary of Changes

| Step | File/Component | Type | Priority |
|------|---|---|---|
| 1 | AdminRegister.jsx | Frontend | High |
| 2 | HostelRegistrationForm.jsx | Frontend | High |
| 3 | AdminDashboard.jsx | Frontend | High |
| 4 | hostels/models.py | Backend | High |
| 5 | hostels/serializers.py | Backend | High |
| 6 | hostels/views.py | Backend | High |
| 7 | hostels/urls.py | Backend | High |
| 8 | request.js | Frontend | High |
| 9 | HostelRegistrationForm.jsx | Frontend | High |
| 10 | AdminDashboard.jsx | Frontend | Medium |
| 11 | hostels/admin.py | Backend | Low (Phase 2) |
| 12 | Email system | Backend | Low (Phase 2) |

---

## Order to Implement

**Phase 1 (Core Flow) - Steps 1-10:**
1. Simplify admin registration form
2. Create hostel form
3. Update dashboard UI
4. Add status field to hostel
5. Create API serializer
6. Create API view
7. Add URL routing
8. Create API function (frontend)
9. Connect form to API
10. Show hostel list in dashboard

**Phase 2 (Verification) - Steps 11-12:**
- Backend verification system
- Email notifications

---

## Expected User Experience After Implementation

1. **Day 1 - Registration:**
   - User registers as admin (simple form)
   - Receives login credentials

2. **Day 1 - Dashboard:**
   - Admin logs in
   - Sees empty dashboard with "No hostels yet"
   - Clicks **"+"** button

3. **Day 1 - Hostel Creation:**
   - Hostel form opens
   - Admin fills hostel details
   - Submits form
   - Gets message: "Well get back to you after verifying details."
   - Sees hostel in dashboard with status: "⏳ Verification in progress..."

4. **Day 2-3 - Verification (Backend):**
   - Staff reviews hostel details
   - Changes status to "verified" or "rejected"

5. **Day 3 - Confirmation:**
   - Admin receives email: "Hostel registered successfully"
   - Admin logs in
   - Sees hostel with status: "✅ Verified"
   - Can now manage bookings, rooms, etc.

---

## Notes

- Keep it simple at first (Phase 1)
- Add verification email system later (Phase 2)
- Can add document uploads and advanced features in future phases
- Use same AdminDashboard component for all hostel management
