/* Account Register — Vanilla JS, localStorage only */

const STORE_KEY = "IAA_accounts_v1"; // accounts (user or artist)

const form = document.getElementById("artist-form");
const idInput = document.getElementById("artist-id");
const nameInput = document.getElementById("name");
const nationInput = document.getElementById("nation");
const regionSelect = document.getElementById("region");
const emailInput = document.getElementById("email");
const imageInput = document.getElementById("imageUrl");
const bioInput = document.getElementById("bio");
const roleSelect = document.getElementById("role");

const listEl = document.getElementById("artist-list");
const viewDialog = document.getElementById("viewDialog");
const viewBody = document.getElementById("viewBody");

const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const submitArtworkBtn = document.getElementById("submitArtworkBtn");

function loadAccounts() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch { return []; }
}

function saveAccounts(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

function uid() { return "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36); }


// Derive a human-friendly label from a detail page URL (e.g., detail.html?id=sorry -> "Sorry")
function prettyLabelFromArtworkUrl(u){
  try{
    const url = new URL(u, location.href);
    let slug = url.searchParams.get("id");
    if(!slug){
      const last = url.pathname.split("/").filter(Boolean).pop() || "";
      slug = last.replace(/\.[a-z0-9]+$/i, "");
    }
    if(!slug) return "Artwork";
    let words = slug
      .replace(/[_\-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(w => w.length ? w[0].toUpperCase() + w.slice(1) : w);
    const ACR = new Set(["nsw","vic","qld","sa","wa","nt","tas","act","tv"]);
    words = words.map(w => ACR.has(w.toLowerCase()) ? w.toUpperCase() : w);
    return words.join(" ");
  }catch(e){ return "Artwork"; }
}
/* ----- Validations ----- */
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidUrl(v){ try { new URL(v); return true; } catch { return false; } }
function applyNameValidity(){
  const v = nameInput.value.trim();
  if (!v) nameInput.setCustomValidity("Please enter the artist name.");
  else nameInput.setCustomValidity("");
}
function applyEmailValidity(){
  const v = emailInput.value.trim();
  if (!v) emailInput.setCustomValidity("Inappropriate email format!");
  else if (!isValidEmail(v)) emailInput.setCustomValidity("Inappropriate email format!");
  else emailInput.setCustomValidity("");
}
function applyUrlValidity(){
  const i = imageInput.value.trim();
  if (i && !isValidUrl(i)) imageInput.setCustomValidity("Inappropriate URL format!"); else imageInput.setCustomValidity("");
}
nameInput.addEventListener("input", applyNameValidity);
nameInput.addEventListener("blur", ()=>{applyNameValidity(); if(!nameInput.checkValidity()) nameInput.reportValidity();});
emailInput.addEventListener("input", applyEmailValidity);
emailInput.addEventListener("blur", ()=>{applyEmailValidity(); if(!emailInput.checkValidity()) emailInput.reportValidity();});
imageInput.addEventListener("input", applyUrlValidity);
imageInput.addEventListener("blur", ()=>{applyUrlValidity(); if(!imageInput.checkValidity()) imageInput.reportValidity();});

function renderList() {
  const accounts = loadAccounts();
  listEl.innerHTML = "";
  if (accounts.length === 0) {
    listEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:var(--space-2xl)">
      No accounts yet. Use the form above to add one.
    </div>`;
    return;
  }

  accounts.forEach(acc => {
    const card = document.createElement("div");
    card.className = "artist-card";
    card.setAttribute("role", "listitem");

    const cover = document.createElement("img");
    cover.className = "artist-cover";
    cover.alt = `${acc.name} profile image`;
    cover.loading = "lazy";
    cover.src = acc.imageUrl || "assets/img/user-avatar.png";
    cover.onerror = () => { cover.src = "assets/img/user-avatar.png"; };

    const statusClass = acc.status === "approved" ? "status-approved" : "status-pending";
    const statusText = acc.status === "approved" ? "Approved" : "Pending Approval";

    const body = document.createElement("div");
    body.className = "artist-content";
    body.innerHTML = `
      <h3 class="artist-title">${acc.name}</h3>
      <p class="artist-sub">${acc.role ? acc.role.toUpperCase() : "USER"} 
        <span class="status-badge ${statusClass}">${statusText}</span>
      </p>
      <p class="subtle">${acc.email ? acc.email : ""}</p>
      ${acc.bio?`<p style="margin-top:var(--space-sm);color:var(--muted);line-height:1.6">${escapeHtml(acc.bio).slice(0,180)}${acc.bio.length>180?"…":""}</p>`:""}
      <div style="margin-top:var(--space-sm)">
        ${acc.nation?`<span class="tag">${escapeHtml(acc.nation)}</span>`:""}
        ${acc.region?`<span class="tag">${escapeHtml(acc.region)}</span>`:""}
      </div>
      ${acc.role === "artist" && acc.artworks && acc.artworks.length ? `
        <div style="margin-top:var(--space-md)">
          <strong>Published Artworks:</strong>
          <div class="links-list">${acc.artworks.map(u=>`<a class="footer-link" href="${u}" target="_blank" rel="noopener">${prettyLabelFromArtworkUrl(u)}</a>`).join("")}</div>
        </div>` : ""}
      <div class="card-actions">
        <button class="btn btn-secondary" type="button" aria-label="View" data-act="view">View</button>
        <button class="btn btn-secondary" type="button" aria-label="Edit" data-act="edit">Edit</button>
        <button class="btn btn-report"   type="button" aria-label="Delete" data-act="del">Delete</button>
        ${acc.role==="artist" && acc.status==="approved" ? `<a class="btn btn-secondary" href="artwork-submit.html">Submit Artwork</a>` : ""}
      </div>
    `;

    body.addEventListener("click", (e) => {
      const btn = e.target.closest("button,a.btn");
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === "view")      openView(acc);
      else if (act === "edit") fillForm(acc);
      else if (act === "del")  removeAccount(acc.id);
    });

    card.appendChild(cover);
    card.appendChild(body);
    listEl.appendChild(card);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>\"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
  }[s]));
}

function openView(a) {
  const statusClass = a.status === "approved" ? "status-approved" : "status-pending";
  const statusText = a.status === "approved" ? "Approved" : "Pending Approval";
  const artLinks = (a.role==="artist" && a.artworks && a.artworks.length)
    ? `<div style="margin-top:var(--space-md)"><strong>Published Artworks</strong><div class="links-list">${a.artworks.map(u=>`<a class="footer-link" href="${u}" target="_blank" rel="noopener">${prettyLabelFromArtworkUrl(u)}</a>`).join("")}</div></div>`
    : "";
  viewBody.innerHTML = `
    <div style="display:grid;grid-template-columns:160px 1fr;gap:var(--space-lg)">
      <img src="${a.imageUrl || "assets/img/user-avatar.png"}" alt="${a.name}" style="width:160px;height:160px;object-fit:cover;border-radius:var(--border-radius);border:1px solid var(--elev-2)"/>
      <div>
        <p><strong>Name:</strong> ${a.name}</p>
        <p><strong>Role:</strong> ${a.role ? a.role.toUpperCase():"USER"} <span class="status-badge ${statusClass}">${statusText}</span></p>
        ${a.nation?`<p><strong>Nation/Language:</strong> ${a.nation}</p>`:""}
        ${a.region?`<p><strong>Region:</strong> ${a.region}</p>`:""}
        ${a.email?`<p><strong>Email:</strong> ${a.email}</p>`:""}
        ${a.bio?`<div style="margin-top:var(--space-md)"><strong>Bio</strong><p style="color:var(--muted);line-height:1.7;margin-top:var(--space-xs)">${escapeHtml(a.bio)}</p></div>`:""}
        ${artLinks}
      </div>
    </div>
  `;
  if (typeof viewDialog.showModal === "function") viewDialog.showModal(); else alert("Dialog: " + a.name);
}

function fillForm(a) {
  idInput.value = a.id;
  nameInput.value = a.name || "";
  emailInput.value = a.email || "";
  roleSelect.value = a.role || "user";
  regionSelect.value = a.region || "";
  nationInput.value = a.nation || "";
  imageInput.value = a.imageUrl || "";
  bioInput.value = a.bio || "";
  nameInput.focus();
  document.getElementById("saveBtn").textContent = "Update";
}

function removeAccount(id) {
  if (!confirm("Delete this account?")) return;
  const accounts = loadAccounts().filter(a => a.id !== id);
  saveAccounts(accounts);
  renderList();
  form.reset();
  idInput.value = "";
  document.getElementById("saveBtn").textContent = "Save";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  applyNameValidity(); applyEmailValidity(); applyUrlValidity();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const acc = {
    id: idInput.value || uid(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    role: roleSelect.value,
    region: regionSelect.value,
    nation: nationInput.value.trim(),
    imageUrl: imageInput.value.trim(),
    bio: bioInput.value.trim(),
    status: "pending",      // Admin will set to "approved" on review
    artworks: []            // Admin can add published artwork links later
  };

  const list = loadAccounts();
  const idx = list.findIndex(a => a.id === acc.id);
  if (idx >= 0) {
    // Preserve server/admin-managed fields if present
    const prev = list[idx];
    acc.status = prev.status || acc.status;
    acc.artworks = Array.isArray(prev.artworks) ? prev.artworks : [];
    list[idx] = acc;
  } else {
    list.push(acc);
  }
  saveAccounts(list);

  renderList();
  form.reset();
  idInput.value = "";
  document.getElementById("saveBtn").textContent = "Save";
});

resetBtn.addEventListener("click", () => {
  form.reset(); idInput.value = "";
  document.getElementById("saveBtn").textContent = "Save";
});

exportBtn && exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(loadAccounts(), null, 2);
  const blob = new Blob([data], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "accounts.json"; a.click();
  URL.revokeObjectURL(url);
});

importFile && importFile.addEventListener("change", async (e) => {
  const file = e.target.files?.[0]; if (!file) return;
  const text = await file.text();
  try {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error("Bad JSON");
    saveAccounts(arr); renderList();
  } catch {
    alert("Invalid JSON file.");
  } finally {
    importFile.value = "";
  }
});

/* Disable top-level submission button when not eligible (not artist or not approved) */
function updateSubmitBtnState(){
  const id = idInput.value;
  const list = loadAccounts();
  const found = list.find(a=>a.id===id);
  const eligible = found && found.role==="artist" && found.status==="approved";
  submitArtworkBtn.classList.toggle("btn-disabled", !eligible);
  submitArtworkBtn.setAttribute("aria-disabled", String(!eligible));
}
form.addEventListener("input", updateSubmitBtnState);
document.addEventListener("DOMContentLoaded", () => { renderList(); updateSubmitBtnState(); });
