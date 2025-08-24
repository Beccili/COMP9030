# Indigenous Art Atlas — User Personas

> Community-driven database for tracking and sharing Indigenous art across cave art, contemporary gallery pieces, and public installations. This document captures two primary personas to guide UX and development decisions.

---

## Persona 1 — Aunty Margaret Wirrinyga

> **“Our art carries our stories.”**

![Aunty Margaret Wirrinyga – photo placeholder](docs/images/persona-aunty-margaret.jpg "Add a respectful photo with community consent (placeholder)")

### Snapshot
| Field | Detail |
|---|---|
| Role | Community Elder; cultural custodian |
| Gender | Female |
| Age | 58 |
| Education | High School; lifelong cultural learning via Elders |
| Location | Regional Northern Territory |
| Family | Children and grandchildren; active in oral storytelling |
| Transport | Toyota LandCruiser (community trips) |
| Favorite Drink | Bush tea |
| Hobbies | Painting with ochre; bush cooking |

### Hardware & Software
- Phone: **Samsung A52 (Android)**
- Laptop: Uses daughter’s **Windows 10** laptop occasionally
- Digital literacy: **Limited** — prefers simple UIs, large buttons, and audio support

### “Grab‑ability” Items
- Woven basket she made as a girl  
- Community radio, daily listener  
- Loves bush tucker cooking  
- Paints with ochre and natural pigments  

### Goals & Needs
- **Share and protect cultural art** for younger generations
- **Simple, low-friction uploads** (photo + audio narration)
- **Granular access controls** (e.g., “Community Only”, time-limited or location‑sensitive content)
- **Cultural protocol prompts** and consent reminders during upload

### Behaviors
- Travels to remote art sites with nieces/nephews
- Captures photos and **voice stories** on phone; needs easy batch upload
- Prefers **guided workflows** over complex navigation

### Pain Points & Risks
- Fear of **misuse of sacred knowledge** or site locations
- **Complex navigation** and **inappropriate tags**
- Low connectivity in remote areas; needs **offline‑first capture** with later sync

### Values & Personality
- **Observant, patient, protective** of community knowledge  
- Values **respect, community input, cultural sensitivity**  
- **Pet peeve:** Outsiders misrepresenting Indigenous art without consent

### Story (Context of Use)
Aunty Margaret documents weathering cave paintings and narrates oral histories. She will upload photos with **audio stories** and apply **“Community Only”** visibility. The Atlas should **teach, protect, and respect**—not merely archive.

### Design Implications
- Upload wizard with **audio narration** support and **protocol checklists**
- **Role‑based access** and **content visibility** controls (Public / Community / Private)
- **Consent & attribution** fields, plus **warning banners** for sensitive content
- **Offline capture → queued sync** for low‑connectivity workflows
- **Large, high‑contrast UI**, clear iconography, multilingual support

---

## Persona 2 — Jack Thompson

> **“I want to learn respectfully and contribute meaningfully.”**

![Jack Thompson – photo placeholder](docs/images/persona-jack-thompson.jpg "Add a professional headshot with consent (placeholder)")

### Snapshot
| Field | Detail |
|---|---|
| Role | Academic researcher; gallery collaborator |
| Gender | Male |
| Age | 29 |
| Education | Master’s in Museum & Heritage Studies |
| Location | Melbourne |
| Household | Lives with partner |
| Transport | Subaru Outback |
| Favorite Drink | Flat White |
| Hobbies | Photography, sketching, travel exhibitions |

### Hardware & Software
- Phone: **iPhone 14 Pro**
- Laptop: **MacBook Pro (2022)**
- Tools: Academic databases, **digital mapping** / GIS tools
- Digital literacy: **High**, confident with data and metadata standards

### Goals & Needs
- **Advanced search & filters** (location, artist, medium, time period, permissions)
- **Metadata‑rich records**, citations, and export for academic use
- Clear **permissions/ownership** badges; respect for **restricted entries**
- **Community collaboration** features (contact artists, request access)

### Behaviors
- Prepares exhibition proposals; researches **public murals** and installations
- Downloads **high‑quality images** and metadata **where permitted**
- Avoids restricted content; seeks **transparent access rationale**

### Pain Points & Risks
- Dislikes “**tokenistic**” exhibitions or research without Indigenous voices
- Needs **trusted provenance**, **clear consent**, and **proper attribution**
- Risk of **over‑exposure** of locations if permissions are unclear

### Values & Personality
- **Curious, analytical, culturally sensitive**
- Values **collaboration, transparency, cultural consent**
- **Pet peeve:** Research or curation that **overlooks Indigenous voices**

### Story (Context of Use)
Jack searches urban Indigenous murals by **location and artist**, exports permitted images with metadata, and sees **clear notices on restricted records**. Transparency and community control reinforce trust and ethical use.

### Design Implications
- **Faceted search** (permissions, custodians, location radius, media type)
- **Provenance & licensing** panels with **community ownership** and contact info
- **Cite‑this‑record** helpers (BibTeX/APA/Harvard), **export JSON/CSV**
- **Request‑access** workflow routed to custodians; activity logs for accountability

---

## Cross‑Persona Requirements

1. **Cultural Protocols by Design**  
   - Consent prompts, ownership fields, and visibility defaults
   - Sensitive‑content banners; **watermarking / blur** options for sacred material

2. **Access & Governance**  
   - Roles: Elder / Artist / Researcher / Public  
   - **Content visibility tiers** and **audit trails**

3. **Connectivity & Performance**  
   - Offline capture, queueing, and conflict resolution  
   - Image compression, resumable uploads

4. **Safety & Integrity**  
   - Location fuzzing (for sacred sites)  
   - Copyright, attribution, and takedown process

5. **Usability**  
   - Plain‑language UI, assistive text, and audio prompts  
   - Clear empty‑state examples and step‑by‑step upload flows

---

## File Notes

- Image links are **placeholders**. Replace with **repository-local assets** (e.g., `docs/images/...`) before merging.
- This Markdown is formatted for **GitHub rendering** and can be added as `USER_PERSONAS.md` in the project root or `/docs/`.
- Please review with community stakeholders before publishing any real names or photos.
