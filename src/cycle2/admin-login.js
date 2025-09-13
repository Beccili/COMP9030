// ===== ADMIN LOGIN FUNCTIONALITY =====

// Test admin data
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

function authenticateAdmin(username, password) {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const admin = TEST_ADMINS[username.toLowerCase()];
      if (admin && admin.password === password) {
        resolve({ success: true, admin: admin });
      } else {
        resolve({
          success: false,
          message: "Invalid administrator credentials",
        });
      }
    }, 1200);
  });
}

function saveAdminSession(admin) {
  // Save admin data to localStorage
  const adminData = {
    username: admin.username,
    displayName: admin.displayName,
    role: admin.role,
    permissions: admin.permissions,
    loginTime: new Date().toISOString(),
  };

  localStorage.setItem("atlas_admin", JSON.stringify(adminData));
  localStorage.setItem("atlas_admin_logged_in", "true");
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

  // Redirect after a short delay
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
  // Check if admin is already logged in
  const isLoggedIn = localStorage.getItem("atlas_admin_logged_in") === "true";
  const adminData = localStorage.getItem("atlas_admin");

  if (isLoggedIn && adminData) {
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
      localStorage.removeItem("atlas_admin_logged_in");
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

  console.log("Admin login page initialized successfully");
});
