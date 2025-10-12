/* Account Register — Vanilla JS with Backend Integration */

import { apiRegister } from './api.js';

const STORE_KEY = "IAA_accounts_v1"; // accounts (user or artist) - legacy fallback

const form = document.getElementById("artist-form");
const idInput = document.getElementById("artist-id");
const nameInput = document.getElementById("name");
const nationInput = document.getElementById("nation");
const regionSelect = document.getElementById("region");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const profileImageInput = document.getElementById("profileImage");
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
nameInput.addEventListener("input", applyNameValidity);
nameInput.addEventListener("blur", ()=>{applyNameValidity(); if(!nameInput.checkValidity()) nameInput.reportValidity();});
emailInput.addEventListener("input", applyEmailValidity);
emailInput.addEventListener("blur", ()=>{applyEmailValidity(); if(!emailInput.checkValidity()) emailInput.reportValidity();});
passwordInput.addEventListener("input", applyPasswordValidity);
passwordInput.addEventListener("blur", ()=>{applyPasswordValidity(); if(!passwordInput.checkValidity()) passwordInput.reportValidity();});

// Removed renderList function as accounts are now shown on the account page

function escapeHtml(str) {
  return String(str).replace(/[&<>\"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
  }[s]));
}

// Removed openView function as accounts are now shown on the account page

// Removed fillForm function as editing is now done on the account page

// Removed removeAccount function as account management is now on the account page

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  applyNameValidity(); applyEmailValidity(); applyPasswordValidity();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  // Disable form while submitting
  const submitBtn = document.getElementById("saveBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading...";

  try {
    // Upload profile picture if provided
    let imageUrl = 'assets/img/user-avatar.png'; // Default
    
    if (profileImageInput.files && profileImageInput.files.length > 0) {
      submitBtn.textContent = "Uploading profile picture...";
      
      const formData = new FormData();
      formData.append('profile_image', profileImageInput.files[0]);
      
      const uploadResponse = await fetch('/cycle3/backend/upload-profile.php', {
        method: 'POST',
        body: formData
      });
      
      const uploadResult = await uploadResponse.json();
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Profile picture upload failed');
      }
      
      imageUrl = uploadResult.data.path;
    }
    
    submitBtn.textContent = "Submitting...";

    const userData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      role: roleSelect.value,
      region: regionSelect.value,
      nation: nationInput.value.trim(),
      imageUrl: imageUrl,
      bio: bioInput.value.trim()
    };

    // Register via backend API
    const user = await apiRegister(userData);
    
    // Also save to localStorage for backwards compatibility
    const acc = {
      id: user.id,
      ...userData,
      status: "pending",
      artworks: []
    };
    const list = loadAccounts();
    list.push(acc);
    saveAccounts(list);

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = "login-success";
    successMessage.innerHTML = `
      <p>Registration successful! Your account is pending admin approval.</p>
      <p>Redirecting to login page...</p>
    `;
    successMessage.style.cssText = "background: #8dc891; color: white; padding: var(--space-md); border-radius: var(--border-radius); margin-bottom: var(--space-md); text-align: center;";
    
    const formCard = document.querySelector(".form-card");
    if (formCard) {
      formCard.insertBefore(successMessage, formCard.firstChild);
    }
    
    form.reset();
    idInput.value = "";
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);
    
    const errorMessage = document.createElement("div");
    errorMessage.className = "login-error";
    errorMessage.textContent = "Registration failed: " + (error.message || "Unknown error. Please try again.");
    errorMessage.style.cssText = "background: #e06c75; color: white; padding: var(--space-md); border-radius: var(--border-radius); margin-bottom: var(--space-md); text-align: center;";
    
    const formCard = document.querySelector(".form-card");
    if (formCard) {
      formCard.insertBefore(errorMessage, formCard.firstChild);
      
      setTimeout(() => {
        errorMessage.remove();
      }, 5000);
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
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

document.addEventListener("DOMContentLoaded", () => {});

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 31
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
