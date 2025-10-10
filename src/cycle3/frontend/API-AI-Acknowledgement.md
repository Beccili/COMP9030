# AI Acknowledgement — Indigenous Art Atlas (API Integration Cycle)

*Format inspired by the previously provided acknowledgement document.*

## AI Tool Used
- **Tool:** ChatGPT (GPT-5 Thinking, OpenAI)
- **Dates of use:** 2025-10-11 to present
- **Environment:** Frontend (HTML/CSS/JS), Backend (PHP + JSON data files)

## Scope & Intent of AI Assistance
AI was used to **accelerate frontend–backend integration**, create **modular client code** for the PHP API, and provide **testing/checklists**. All generated code and instructions were reviewed and adapted by me to meet functional and ethics requirements of the Indigenous Art Atlas project.

---

## Work I Completed Independently

1. **Project Context & Requirements**
   - Defined functional goals for user/artist registration, session handling, artwork submission, and admin review.
   - Chose technology stack: PHP + JSON storage; HTML/CSS/JS frontend.

2. **Backend Implementation**
   - Designed and implemented `auth.php`, `artworks.php`, `admin.php`, and JSON data structures (`users.json`, `sessions.json`, `artworks.json`).
   - Implemented request parsing, validation, access control (owner/admin), and REST-like responses.

3. **Data & Security**
   - Session issuance/verification, role checks, and basic input validation.
   - Admin review pipeline for pending accounts/artworks; only approved artworks exposed publicly.

4. **Frontend UX & Pages**
   - Built pages (`register.html`, `artwork-submit.html`, navigation/header, form layouts).
   - Designed form validations and sensitive-content flags (address rules).

---

## Limited AI Assistance

### A) API Client & Page Integration
AI produced a **drop-in API client** and page modules that call the real PHP endpoints (JSON over `fetch`).  
Delivered files:
- `api.js` — unified client for **auth**, **artworks**, and **admin** endpoints (session query param helper, JSON error handling, same-origin or configurable `API_BASE`).
- `register.js` — replaces localStorage mock; calls `POST /auth.php?action=register`.
- `artwork-submit.js` — replaces inline/localStorage logic; calls `POST /artworks.php?session_id=...`.
- Updated `register.html` / `artwork-submit.html` to load ES Modules and bind the forms.

**Design choices included:**
- Consistent `jsonFetch()` wrapper with HTTP + payload error normalization.
- `withSession()` helper to append `session_id` to protected routes.
- Non-blocking UI validation with native `setCustomValidity`.
- Text-only payload for artworks (current backend defers actual image upload).

### B) Testing Playbook & Troubleshooting
AI provided a **step-by-step verification checklist**:
- DevTools Network inspection (Headers/Payload/Response), cURL parity tests.
- CORS preflight handling snippet (PHP `OPTIONS` 204, allow headers/methods).
- Common failure matrix (no POST in Network, file:// vs http:// serving, module load failures, 401/403 without `session_id`, 415 content-type, etc.).

### C) Documentation & Refactoring Suggestions
- Clear English comments and function headers.
- Guidance to keep all comments/code in English to satisfy course/assessment rules.
- Suggested small refactors (centralized response helpers, validation patterns).

---

## Representative AI-Generated Code (Selected Excerpts)

**`api.js` – session helper & JSON fetch**
```javascript
export const session = {
  key: "IAA_session_id",
  get() { try { return localStorage.getItem(this.key) || ""; } catch { return ""; } },
  set(v) { try { localStorage.setItem(this.key, v || ""); } catch {} },
  clear() { try { localStorage.removeItem(this.key); } catch {} },
};

async function jsonFetch(path, { method = "GET", data, headers = {} } = {}) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: data !== undefined ? JSON.stringify(data) : undefined
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(()=>"")}`);
  const payload = await res.json().catch(()=>null);
  if (!payload || payload.success === false) throw new Error(payload?.message || "Request failed.");
  return payload.data ?? payload;
}
```

**`register.js` – call the real API**
```javascript
import { authApi } from "./api.js";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    role: roleSelect.value
  };
  try {
    await authApi.register(payload);
    alert("Registration successful! Your account needs admin approval.");
    window.location.href = "account.html";
  } catch (err) {
    alert("Registration failed: " + (err.message || "Unknown error"));
  }
});
```

**`artwork-submit.js` – protected POST with session**
```javascript
import { artworksApi, session } from "./api.js";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const sid = session.get();
  if (!sid) { note.textContent = "Please log in first."; note.style.display = "block"; return; }
  const payload = { title, artist, artType, period, region, description: desc, sensitive, address: address || null };
  try {
    await artworksApi.create(sid, payload);
    note.textContent = "Submitted! Your artwork is pending admin review.";
    note.style.display = "block";
    form.reset();
  } catch (err) {
    note.textContent = "Submission failed: " + (err.message || "Unknown error");
    note.style.display = "block";
  }
});
```

---

## My Responsibilities vs AI Contributions

| Area | My Work | AI Assistance |
|---|---|---|
| Backend architecture & PHP endpoints | ✅ | 🔹 Minor doc/format tips |
| JSON data design & access control | ✅ | — |
| Session logic & approvals | ✅ | — |
| Frontend pages & UX | ✅ | 🔹 Integration glue (modules & imports) |
| API client & error model | 🟨 (reviewed & adapted) | ✅ Primary draft |
| Testing & DevTools workflow | 🟨 (executed) | ✅ Checklist & cURL examples |
| CORS configuration hints | 🟨 (applied) | ✅ Snippets & guidance |

---

## How I Validated AI Output

1. **Static review:** Readability, comments, security assumptions (e.g., `session_id` in query params).
2. **Runtime checks:** DevTools Network → verified `POST /auth.php?action=register` and `POST /artworks.php?session_id=...` with correct JSON payloads and response handling.
3. **Negative tests:** Missing `session_id` (expect 401/403), failing validation (expect client-side block), CORS preflight (expect `OPTIONS` 204).
4. **Manual edits:** Adjusted base URL handling, ensured English-only comments, aligned fields with backend.

---

## Academic Integrity Statement

- I remain the **primary author** of the overall system design, backend logic, and final integration decisions.
- AI assistance was **limited to scaffolding client modules, documentation, and test procedures**; all code was **reviewed, tested, and, where necessary, modified** by me before submission.
- This statement transparently describes the **nature and extent** of AI involvement for assessors and collaborators.

## References
- OpenAI. *ChatGPT — GPT-5 Thinking*. Used for code scaffolding, integration guidance, and testing checklists.
- Project materials & prior acknowledgement format (provided by me).

---

*Prepared by: [Jiacheng Lu]*
*Date: 2025-10-11*
