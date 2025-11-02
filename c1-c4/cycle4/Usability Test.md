# COMP9030 Cycle 4 Usability Test
# Evaluation Report

## Introduction
The **Indigenous Art Atlas (IAA)** is a purpose-built web platform designed to document, visualise, and disseminate information about Indigenous artworks — including traditional, contemporary and culturally significant installations — within their geographical and cultural contexts.

From a developer’s perspective, the core objectives were:

1. Provide a robust, user‑centric interactive experience  
2. Support accurate and respectful cultural representation  
3. Facilitate sustainable, non‑commercial educational access  

---

## Functional Overview

### ✅ Interactive Map View
- Spatial map interface displaying artwork markers
- Clicking markers reveals artwork metadata, cultural provenance & historical significance  
- Emphasises connection between art, land, and culture  

> _Homepage text: “Click on the markers to discover Indigenous artworks in their geographical context.”_

### ✅ Search Functionality
- Users can search artworks, artists, and locations by filters or keywords
- Supports academic, community and casual exploration

### ✅ User Registration & Login
- Enables user accounts for future features (contributions, moderation, preferences)

### ✅ Featured Artworks
- Highlights culturally significant artworks on homepage
- Enhances storytelling and user engagement

### ✅ About, Guidelines & Ethics Pages
- Communicates mission, cultural respect principles & usage guidelines  
- Ensures ethical handling of sensitive Indigenous cultural content

---

## Design Purpose & Rationale

### ✨ Cultural Respect & Protocols
- Acknowledgment of Country displayed prominently
- Ethical guidelines and non‑commercial framing maintained

### 🎓 Educational & Community‑Driven Aim
- Prioritises accessibility and long‑term cultural sustainability
- Designed for community, artists and researchers

### 🧩 Scalability & Robustness
- Modular front‑end and back‑end components  
- Support for future multilingual, content and user‑generated expansion

### 📍 Location‑Based Storytelling
- Map‑based navigation emphasises land‑art connection
- Zoom & interactive markers allow exploration

### 👥 Accessibility & User Engagement
- Clear navigation (Map, Search, About Us, Register, Login)
- Featured content and call‑to‑actions to increase engagement

---

## Platform Purpose Summary

The Indigenous Art Atlas aims to:

- Document Indigenous artworks within land‑based cultural context  
- Provide respectful learning access and cultural acknowledgement  
- Support community involvement and educational use  
- Maintain ethical and non‑commercial values  
- Provide a scalable and user‑friendly platform

---

## Usability Testing

### ✅ Evaluation Tasks
1. Register new user  
2. Update personal information  
3. Admin user management  
4. Artist submits artwork  
5. Admin reviews artwork  
6. Artist edits/deletes approved artwork  
7. User reports artwork  
8. Admin handles reports  
9. View artworks via map  
10. Search artworks  
11. Bookmark artwork  

---

## Specific Test Scenarios

### **1. Register a New User**
**Purpose:** To evaluate whether new visitors can successfully create an account without assistance.  

**Participant:** Tian Yuan (Tim) and tester (group member)
- Role: User and Admin played by system moderator (group member) 
- Number:2 

**Pre‑conditions:**  
- User is not logged in 
- User does not have an existing account

**Steps:**  
- Navigate to the homepage. 
- Click “Register” in the navigation menu. 
- Fill in required registration fields (name, email, password, etc.). 
- Submit the registration form. 
- Attempt login using newly created credentials.

**Expected Results:**  
- Form accepts valid inputs 
- User receives success feedback (e.g., “Registration successful”) 
- User can log in immediately after registration

**Success Indicators:**  
- Task completed without errors 
- Completion time ≤ 1 minute 
- User expresses confidence about registration process 
- User updates personal information 
- Admin manages registered users 
- Artist submits artwork information 

---

### **2. User Updates Personal Information**
**Participant:** Tian Yuan (Tim) 
- Role: User 
- Number:1 

**Purpose:** To examine user ability to locate, edit, and successfully update their personal 
profile details. 

**Pre‑conditions:**  
- User has an existing account 
- User is logged in

**Steps:**  
- Log in to the website. 
- Click the User profile icon to navigate to “My Profile” 
- Click the “Edit” button to profile information (e.g., display name, bio, email 
preferences). 
- Fill in the information on the new page and Save changes. 
- Refresh the page to confirm persistent updates. 

**Expected Results:**  
- User can find profile settings easily 
- System accepts valid edits & stores them 
- Visible confirmation message (e.g., “Profile updated successfully”) 
- Changes persist after refresh 

**Success Indicators:**  
- Completion time ≤ 1.5 minutes 
- No help required 
- User states they feel confident editing their profile

---

### **3. Admin Manages Registered Users**
**Participant:** Tian Yuan (Tim) and tester (group member)
- Role: User (provide information and account) and Admin(Played by group member) 
- Number:2 

**Purpose:** To test whether administrative users can locate, view, and manage registered user 
accounts effectively.   

**Pre‑conditions:** Admin user is logged in 
- Website has existing registered users   

**Steps:**  
- Log in as an admin. 
- Navigate to admin dashboard. 
- Open “Users” 
- View a list of users. 
- Select a user and perform an action (e.g., view details / edit role / remove user). 
- Confirm the changes. 

**Expected Results:**  
- Admin dashboard displays user list clearly 
- Admin can successfully edit or remove a user 
- System provides confirmation feedback 
- Updated user status reflects correctly in list

**Success Indicators:**  
- Completion time ≤ 2 minutes 
- Admin navigates without confusion 
- Changes apply in real-time & persist

---

### **4. Artist Submits Artwork**
**Participant:** Tian Yuan (Tim) and Admin tester.
- Role: Artist (changed by different roles of account) and Admin who responsible for compliance review of the content of artworks. 
- Number:2 

**Purpose:** To evaluate clarity and usability of the artwork submission workflow for artist users.  

**Pre‑conditions:** Artist account exists and is logged in

**Steps:**  
- Log in as an artist user. In this case,  
- Navigate to “Artwork information submission form.” 
- Enter artwork details (title, description, cultural context, location, image). 
- Submit the form. 
- View confirmation and verify artwork appears in pending/published list (based on 
platform rule).   

**Expected Results:**  
- Form fields are clear and complete 
- Artwork successfully submitted without error 
- Artist receives confirmation message 
- Artwork appears in submission list / awaits admin approval 

**Success Indicators:**  
- Completion time ≤ 3 minutes 

- Minimal hesitation during input 

- User reports clear understanding of submission fields 


**Appendices:**


![questionnaire](images1/questionnaire.png)





---

_File created based on evaluation script and system objectives._  




## Recommendations 

### 1) Summary of Findings 

**Admin reliability risks (Tasks #3, #5, #8)**: The Admin page fails to load on some computers, blocking user management, artwork approvals, and report handling. 

**Artist workflow friction (Tasks #4, #6)**: Uploading images requires a “Command” key + “click" to select multiple images; this is difficult for non-technical users. 

**Discovery gaps for end-users (Tasks #9, #10, #11**): The home page lacks “Recently Added”; only “Recommended” is shown, reducing freshness and trust. Map viewing works, but location precision is limited without latitude/longitude (artists must enter coordinates manually). 

**Performance & state clarity (cross-cutting)**: Refresh is slow and first renders default config before user content appears, causing confusion and repeated waits. 

**Content deployment gap (non-task supporting)**: “About Us” is not on cloud, leading to inconsistencies between environments. 

### 2) Key Usability Issues & Severity 

| Issue | Impacted Tasks | Severity | Why it matters |
|---|---:|:--:|---|
| Admin page fails to load on some devices | #3 #5 #8 | **Critical** | Blocks core governance: approvals, user roles, report triage. |
| Manual latitude/longitude entry | #4 #9 | **High** | Artists mis-locate works; users can’t find precise locations. |
| No “Recently Added” on home | #9 #10 #11 | **High** | Low freshness & discoverability; hurts engagement and trust. |
| Multi-image upload requires keyboard modifier | #4 #6 | **Medium** | Non-technical users fail or give up; higher task time and errors. |
| Slow refresh + default state flashes before user content | Cross | **Medium** | Perceived slowness; users misinterpret data/state. |
| “About Us” not deployed to cloud | (supporting) | **Low** | Inconsistent narrative/branding; does not block core tasks. |
 

### 3) Root-Cause Analysis 
**Admin not loading**: The admin bundle is too large with no code-splitting; CORS/Service Worker cache conflicts; missing environment variables on specific machines. 

**Manual latitude/longitude entry**: No geocoding/coordinate picker; external map SDKs are restricted; no internal gazetteer to resolve addresses into coordinates. 

**No “Recently Added”**: The backend lacks an “ORDER BY created_at DESC” query/API. 

**Multi-image upload requires a modifier key**: The frontend relies only on the current selection of <input type="file" multiple> and does not accumulate previously selected files in code; as a result, on the second selection the browser replaces input.files with the new file set. The backend endpoint also treats uploads for the same artwork as “replace” rather than “append”. 

**Slow refresh with default-first flash**: The free-tier CDN has limited cache-hit conditions—narrow rules and excessive forwarded parameters cause “cache fragmentation.” 

**“About Us” not on cloud**: The static content is not included in CI/CD. 

### 4） suggestions

**Immediate fixes： highest impact + moderate effort**

#### 1) Fix Admin reliability (Owners: Frontend + DevOps) — Critical 
**Implementation**: Align browserslist/build targets and use “@babel/preset-env” with “core-js” to polyfill on demand for core APIs to cover mainstream and older browser versions. 

**Acceptance criteria**: Pass a compatibility test matrix (Windows 10/11: latest two versions of Chrome/Edge; macOS: latest two versions of Safari/Chrome; optional Firefox ESR). In these environments the page loads and core actions work. 

#### 2) Add a “Recently Added” section on the homepage (Owners: Backend + Frontend) — High 

**Implementation**: Without breaking the existing recommendation logic, add or extend a listing API to support creation-time sorting. 

**Acceptance criteria**: An artwork appears within ≤ 1 minute after approval; the block renders stably. 

#### 3) Provide a latitude/longitude capture UX (Owners: Frontend + Backend) — High 
**Implementation**: When external services are allowed: Support address → latitude/longitude geocoding in the form, with a small map for fine-tuning the pin. 
When external libraries are restricted: Offer a clickable coordinate picker (simplified basemap/SVG grid), or a hierarchical place picker backed by an internal gazetteer (CSV) to derive latitude/longitude. 

**Acceptance criteria**: ≥ 90% of new submissions include valid coordinates; the map detail shows the precise location consistent with the submission. 

**Next iteration: high impact + low-to-moderate effort** 

#### 4) Improve multi-image upload visibility & usability (Owner: Frontend) — Medium 
**Implementation**: Support drag-and-drop, an explicit “Add more images” button, and show “n selected”. 

**Acceptance criteri**: Images can be added in multiple rounds without overwriting previously selected files. 

#### 5) Improve perceived speed (Owner: Frontend) — Medium 
**Implementation**: Add skeleton loaders; configure ETag/Cache-Control and local caching for user lists/favorites. 

**Acceptance criteria**: Time to usable decreases; users no longer report “default content flashes before my content.” 

#### 6) Set up CI/CD and cloud hosting for “About Us” (Owners: DevOps/Content) — Low 
**Implementation**: Include the static content in the pipeline; add version and last-updated metadata. 

**Acceptance criteria**: Consistent content across all environments. 

**Optional changes: risk reduction** 

#### 7) Admin diagnostics mode (Owner: Frontend) — Low/Medium 
On load failure, show environment/network self-checks and provide a lightweight degraded mode. 

#### 8) Artist bulk actions (Owner: Frontend) — Medium 
Support batch edit/delete for approved works; provide confirmation and undo. 
