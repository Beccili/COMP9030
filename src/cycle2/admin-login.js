// ===== ADMIN LOGIN FUNCTIONALITY =====

// Import admin-specific API module
import adminAPI from './admin-api.js';

// Test admin data (legacy)
const TEST_ADMINS = {
  admin: {
    username: "admin",
    password: "admin123",
    displayName: "System Administrator",
    role: "admin",
    permissions: [
      "manage_artworks",
      "manage_users",
      "view_analytics",
      "system_settings",
    ],
  },
};

// DOM Elements
let adminLoginForm;
let adminUsernameInput;
let adminPasswordInput;
let adminLoginBtn;
let fillAdminTestBtn;
let adminGeneralError;

// Utility Functions
function showAdminError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function clearAdminError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}

function clearAllAdminErrors() {
  clearAdminError("admin-username-error");
  clearAdminError("admin-password-error");
  clearAdminError("admin-general-error");
}

function setAdminLoadingState(isLoading) {
  if (adminLoginBtn) {
    adminLoginBtn.disabled = isLoading;
    if (isLoading) {
      adminLoginBtn.classList.add("loading");
    } else {
      adminLoginBtn.classList.remove("loading");
    }
  }
}

function validateAdminForm() {
  let isValid = true;
  clearAllAdminErrors();

  // Validate username
  const username = adminUsernameInput?.value.trim();
  if (!username) {
    showAdminError(
      "admin-username-error",
      "Administrator username is required"
    );
    isValid = false;
  } else if (username.length < 3) {
    showAdminError(
      "admin-username-error",
      "Username must be at least 3 characters long"
    );
    isValid = false;
  }

  // Validate password
  const password = adminPasswordInput?.value;
  if (!password) {
    showAdminError(
      "admin-password-error",
      "Administrator password is required"
    );
    isValid = false;
  } else if (password.length < 6) {
    showAdminError(
      "admin-password-error",
      "Password must be at least 6 characters long"
    );
    isValid = false;
  }

  return isValid;
}

async function authenticateAdmin(username, password) {
  try {
    const result = await adminAPI.adminLogin(username, password);
    return {
      success: true,
      admin: {
        username: result.user.username,
        displayName: result.user.name,
        avatar: result.user.imageUrl || 'assets/img/user-avatar.png',
        email: result.user.email,
        role: result.user.role,
        permissions: ["manage_artworks", "manage_users", "view_analytics"]
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Invalid administrator credentials"
    };
  }
}

function saveAdminSession(admin) {
  // Session is already saved by adminAPI.adminLogin() to:
  // - atlas_admin_session_id
  // - atlas_admin
  // This is separate from the public site session (atlas_session_id, atlas_user)
}

function redirectToAdminDashboard() {
  // Show success message briefly before redirect
  const successMessage = document.createElement("div");
  successMessage.className = "admin-login-success";
  successMessage.textContent =
    "Authentication successful! Redirecting to dashboard...";

  const formContainer = document.querySelector(".admin-login-form-container");
  if (formContainer) {
    formContainer.insertBefore(successMessage, formContainer.firstChild);
  }

  // Redirect after a short delay to the actual admin dashboard
  setTimeout(() => {
    window.location.href = "admin-dashboard.html";
  }, 1500);
}

async function handleAdminLogin(event) {
  event.preventDefault();

  if (!validateAdminForm()) {
    return;
  }

  const username = adminUsernameInput.value.trim();
  const password = adminPasswordInput.value;

  setAdminLoadingState(true);
  clearAllAdminErrors();

  try {
    const result = await authenticateAdmin(username, password);

    if (result.success) {
      saveAdminSession(result.admin);
      redirectToAdminDashboard();
    } else {
      showAdminError("admin-general-error", result.message);
    }
  } catch (error) {
    console.error("Admin login error:", error);
    showAdminError(
      "admin-general-error",
      "An error occurred during authentication. Please try again."
    );
  } finally {
    setAdminLoadingState(false);
  }
}

function fillAdminTestCredentials() {
  if (adminUsernameInput && adminPasswordInput) {
    adminUsernameInput.value = "admin";
    adminPasswordInput.value = "admin123";

    // Clear any existing errors
    clearAllAdminErrors();

    // Focus on the login button
    if (adminLoginBtn) {
      adminLoginBtn.focus();
    }
  }
}

function checkExistingAdminLogin() {
  // Check if admin is already logged in via admin session
  const adminSessionId = localStorage.getItem("atlas_admin_session_id");
  const adminData = localStorage.getItem("atlas_admin");

  if (adminSessionId && adminData) {
    try {
      const admin = JSON.parse(adminData);
      // Show message that admin is already logged in
      const adminHeader = document.querySelector(".admin-login-page-title");
      if (adminHeader) {
        const alreadyLoggedMessage = document.createElement("div");
        alreadyLoggedMessage.className = "admin-login-success";
        alreadyLoggedMessage.innerHTML = `
          <p>You are already logged in as <strong>${admin.displayName}</strong>.</p>
          <p><a href="admin-dashboard.html" style="color: white; text-decoration: underline;">Go to Dashboard</a></p>
        `;
        adminHeader.appendChild(alreadyLoggedMessage);
      }
    } catch (error) {
      console.error("Error parsing admin data:", error);
      // Clear invalid data
      localStorage.removeItem("atlas_admin");
      localStorage.removeItem("atlas_admin_session_id");
    }
  }
}

function initializeAdminEventListeners() {
  // Admin login form submission
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", handleAdminLogin);
  }

  // Fill test credentials button
  if (fillAdminTestBtn) {
    fillAdminTestBtn.addEventListener("click", fillAdminTestCredentials);
  }

  // Clear errors on input
  if (adminUsernameInput) {
    adminUsernameInput.addEventListener("input", () =>
      clearAdminError("admin-username-error")
    );
  }

  if (adminPasswordInput) {
    adminPasswordInput.addEventListener("input", () =>
      clearAdminError("admin-password-error")
    );
  }

  // Enter key support for test credentials button
  if (fillAdminTestBtn) {
    fillAdminTestBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fillAdminTestCredentials();
      }
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  adminLoginForm = document.getElementById("adminLoginForm");
  adminUsernameInput = document.getElementById("admin-username");
  adminPasswordInput = document.getElementById("admin-password");
  adminLoginBtn = document.getElementById("adminLoginBtn");
  fillAdminTestBtn = document.getElementById("fillAdminTestBtn");
  adminGeneralError = document.getElementById("admin-general-error");

  // Check if admin is already logged in
  checkExistingAdminLogin();

  // Initialize event listeners
  initializeAdminEventListeners();

  // Focus on username input
  if (adminUsernameInput && !localStorage.getItem("atlas_admin_logged_in")) {
    adminUsernameInput.focus();
  }
});

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 11
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
