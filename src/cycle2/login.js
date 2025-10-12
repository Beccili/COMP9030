// ===== LOGIN FUNCTIONALITY =====

// Import API functions
import { apiLogin } from './api.js';

// DOM Elements
let loginForm;
let usernameInput;
let passwordInput;
let loginBtn;
let fillTestBtn;
let generalError;

// Utility Functions
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}

function clearAllErrors() {
  clearError("username-error");
  clearError("password-error");
  clearError("general-error");
}

function setLoadingState(isLoading) {
  if (loginBtn) {
    loginBtn.disabled = isLoading;
    if (isLoading) {
      loginBtn.classList.add("loading");
    } else {
      loginBtn.classList.remove("loading");
    }
  }
}

function validateForm() {
  let isValid = true;
  clearAllErrors();

  // Validate username
  const username = usernameInput?.value.trim();
  if (!username) {
    showError("username-error", "Username is required");
    isValid = false;
  } else if (username.length < 3) {
    showError("username-error", "Username must be at least 3 characters long");
    isValid = false;
  }

  // Validate password
  const password = passwordInput?.value;
  if (!password) {
    showError("password-error", "Password is required");
    isValid = false;
  } else if (password.length < 6) {
    showError("password-error", "Password must be at least 6 characters long");
    isValid = false;
  }

  return isValid;
}

async function authenticateUser(username, password) {
  try {
    const result = await apiLogin(username, password);
    return { 
      success: true, 
      user: {
        username: result.user.username,
        displayName: result.user.name,
        avatar: result.user.imageUrl || 'assets/img/user-avatar.png',
        email: result.user.email,
        role: result.user.role
      }
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message || "Invalid username or password" 
    };
  }
}

function saveUserSession(user) {
  // Save user data to localStorage
  const userData = {
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    email: user.email,
    role: user.role,
    loginTime: new Date().toISOString(),
  };

  localStorage.setItem("atlas_user", JSON.stringify(userData));
  localStorage.setItem("atlas_logged_in", "true");
}

function redirectAfterLogin() {
  // Get redirect URL from query params or default to homepage
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get("redirect") || "home.html";

  // Show success message briefly before redirect
  const successMessage = document.createElement("div");
  successMessage.className = "login-success";
  successMessage.textContent = "Login successful! Redirecting...";

  const formContainer = document.querySelector(".login-form-container");
  if (formContainer) {
    formContainer.insertBefore(successMessage, formContainer.firstChild);
  }

  // Redirect after a short delay
  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 1500);
}

async function handleLogin(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  setLoadingState(true);
  clearAllErrors();

  try {
    const result = await authenticateUser(username, password);

    if (result.success) {
      saveUserSession(result.user);
      redirectAfterLogin();
    } else {
      showError("general-error", result.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    showError(
      "general-error",
      "An error occurred during login. Please try again."
    );
  } finally {
    setLoadingState(false);
  }
}

function fillTestCredentials() {
  if (usernameInput && passwordInput) {
    usernameInput.value = "testartist";
    passwordInput.value = "password123";

    // Clear any existing errors
    clearAllErrors();

    // Focus on the login button
    if (loginBtn) {
      loginBtn.focus();
    }
  }
}

function checkExistingLogin() {
  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem("atlas_logged_in") === "true";
  const userData = localStorage.getItem("atlas_user");

  if (isLoggedIn && userData) {
    try {
      const user = JSON.parse(userData);
      // Show message that user is already logged in
      const loginHeader = document.querySelector(".login-header");
      if (loginHeader) {
        const alreadyLoggedMessage = document.createElement("div");
        alreadyLoggedMessage.className = "login-success";
        alreadyLoggedMessage.innerHTML = `
          <p>You are already logged in as <strong>${user.displayName}</strong>.</p>
          <p><a href="home.html" style="color: white; text-decoration: underline;">Return to Homepage</a></p>
        `;
        loginHeader.appendChild(alreadyLoggedMessage);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data
      localStorage.removeItem("atlas_user");
      localStorage.removeItem("atlas_logged_in");
    }
  }
}

function initializeEventListeners() {
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Fill test credentials button
  if (fillTestBtn) {
    fillTestBtn.addEventListener("click", fillTestCredentials);
  }

  // Clear errors on input
  if (usernameInput) {
    usernameInput.addEventListener("input", () => clearError("username-error"));
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", () => clearError("password-error"));
  }

  // Enter key support for test credentials button
  if (fillTestBtn) {
    fillTestBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fillTestCredentials();
      }
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  loginForm = document.getElementById("loginForm");
  usernameInput = document.getElementById("username");
  passwordInput = document.getElementById("password");
  loginBtn = document.getElementById("loginBtn");
  fillTestBtn = document.getElementById("fillTestBtn");
  generalError = document.getElementById("general-error");

  // Check if user is already logged in
  checkExistingLogin();

  // Initialize event listeners
  initializeEventListeners();

  // Focus on username input
  if (usernameInput && !localStorage.getItem("atlas_logged_in")) {
    usernameInput.focus();
  }

});

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 28
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
