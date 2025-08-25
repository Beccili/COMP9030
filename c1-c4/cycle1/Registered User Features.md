# Registered User Features (General Public & Artists - Login Required)

## 1. User Registration & Login System
- Secure registration form:
  - Fields: username, email, password (with confirmation)
  - Password must be hashed before storage (e.g., `password_hash()` in PHP)
- Secure login form
- PHP-based session management for maintaining login state
- Users can choose their role during registration:
  - General Public
  - Artist (or apply to be an Artist later)

## 2. Submit New Art Entry
- Accessible only to logged-in users
- Multi-step or multi-section form including:

### a. Art Details
- Title
- Detailed description
- Select from pre-defined Art Type and Period categories
- Add Condition/Quality notes

### b. Artist Information
- Option to credit a known artist (if distinct from submitter)
- Artists can link submissions to their own profile

### c. Location Details
- Interactive map picker (Leaflet.js) to drop a pin and get latitude/longitude
- Text fields for descriptive location notes (e.g., "Near the old bridge", "Inside Gallery X")
- Location Sensitivity Flag:
  - Checkbox/dropdown to indicate culturally sensitive/private land
  - Flags submission for admin review and potentially masks exact coordinates publicly

### d. Image Uploads
- Allow multiple image files (JPEG, PNG)
- Server-side validation for file type and size
- Images stored on server with paths saved in database
- Client-side JavaScript validation for all required fields before submission

## 3. Manage My Submissions
- User dashboard showing all art entries submitted by the logged-in user
- Display approval status for each submission:
  - Pending Review
  - Approved
  - Rejected
- Ability to Edit (update text details, change images) or Delete submissions

## 4. Artist Profile (for 'Artist' user type)
- Update bio and optionally provide public contact information
- Profile page lists all art entries submitted or attributed to the artist

## 5. Report Content
- Mechanism on each art detail page for logged-in users to report inappropriate or inaccurate content
- Submits report to admin panel