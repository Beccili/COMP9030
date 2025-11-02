# COMP9030 Cycle 4 Usability Test
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