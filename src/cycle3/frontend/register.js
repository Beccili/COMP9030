/* Account Register — Vanilla JS, localStorage only */

const STORE_KEY = "IAA_accounts_v1"; // accounts (user or artist)

const form = document.getElementById("artist-form");
const idInput = document.getElementById("artist-id");
const nameInput = document.getElementById("name");
const nationInput = document.getElementById("nation");
const regionSelect = document.getElementById("region");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const imageInput = document.getElementById("imageUrl");
const bioInput = document.getElementById("bio");
const roleSelect = document.getElementById("role");

// Removed list elements as we're not showing accounts on this page anymore

const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

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
function applyPasswordValidity(){
  const v = passwordInput.value;
  if (!v) passwordInput.setCustomValidity("Please enter a password.");
  else if (v.length < 6) passwordInput.setCustomValidity("Password must be at least 6 characters.");
  else passwordInput.setCustomValidity("");
}
function applyUrlValidity(){
  const i = imageInput.value.trim();
  if (i && !isValidUrl(i)) imageInput.setCustomValidity("Inappropriate URL format!"); else imageInput.setCustomValidity("");
}
nameInput.addEventListener("input", applyNameValidity);
nameInput.addEventListener("blur", ()=>{applyNameValidity(); if(!nameInput.checkValidity()) nameInput.reportValidity();});
emailInput.addEventListener("input", applyEmailValidity);
emailInput.addEventListener("blur", ()=>{applyEmailValidity(); if(!emailInput.checkValidity()) emailInput.reportValidity();});
passwordInput.addEventListener("input", applyPasswordValidity);
passwordInput.addEventListener("blur", ()=>{applyPasswordValidity(); if(!passwordInput.checkValidity()) passwordInput.reportValidity();});
imageInput.addEventListener("input", applyUrlValidity);
imageInput.addEventListener("blur", ()=>{applyUrlValidity(); if(!imageInput.checkValidity()) imageInput.reportValidity();});

// Removed renderList function as accounts are now shown on the account page

function escapeHtml(str) {
  return String(str).replace(/[&<>\"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
  }[s]));
}

// Removed openView function as accounts are now shown on the account page

// Removed fillForm function as editing is now done on the account page

// Removed removeAccount function as account management is now on the account page

form.addEventListener("submit", (e) => {
  e.preventDefault();
  applyNameValidity(); applyEmailValidity(); applyPasswordValidity(); applyUrlValidity();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const acc = {
    id: idInput.value || uid(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,  // In real app, this should be hashed
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

  // Redirect to account page after successful registration
  alert("Account created successfully! Redirecting to account page...");
  setTimeout(() => {
    window.location.href = "account.html";
  }, 1500);
  form.reset();
  idInput.value = "";
  document.getElementById("saveBtn").textContent = "Submit";
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

document.addEventListener("DOMContentLoaded", () => { 
  console.log("Register page initialized");
});

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 31
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
