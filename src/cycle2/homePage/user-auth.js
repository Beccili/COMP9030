// ===== USER AUTHENTICATION MANAGEMENT =====

// User session management
class UserAuth {
  constructor() {
    this.user = null;
    this.isLoggedIn = false;
    this.init();
  }

  init() {
    this.checkSession();
    this.setupEventListeners();
    this.updateUI();
  }

  checkSession() {
    try {
      const isLoggedIn = localStorage.getItem("atlas_logged_in") === "true";
      const userData = localStorage.getItem("atlas_user");

      if (isLoggedIn && userData) {
        this.user = JSON.parse(userData);
        this.isLoggedIn = true;
        console.log("User session found:", this.user.displayName);
      } else {
        this.clearSession();
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      this.clearSession();
    }
  }

  clearSession() {
    this.user = null;
    this.isLoggedIn = false;
    localStorage.removeItem("atlas_user");
    localStorage.removeItem("atlas_logged_in");
  }

  logout() {
    this.clearSession();
    this.updateUI();

    // Show logout confirmation
    this.showLogoutMessage();

    console.log("User logged out successfully");
  }

  showLogoutMessage() {
    // Create temporary logout message
    const message = document.createElement("div");
    message.className = "logout-message";
    message.textContent = "You have been logged out successfully";
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--elev-2);
      color: var(--text);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      font-size: var(--font-size-sm);
      border: 1px solid var(--accent);
    `;

    document.body.appendChild(message);

    // Remove message after 3 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 3000);
  }

  getUserInitials(displayName) {
    if (!displayName) return "U";

    const names = displayName.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    } else if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return "U";
  }

  updateUI() {
    const loginSection = document.getElementById("login-section");
    const userSection = document.getElementById("user-section");
    const userDisplayName = document.getElementById("user-display-name");
    const userAvatarInitials = document.getElementById("user-avatar-initials");
    const userAvatarImage = document.getElementById("user-avatar-image");

    if (this.isLoggedIn && this.user) {
      // Show user section, hide login section
      if (loginSection) loginSection.style.display = "none";
      if (userSection) userSection.style.display = "block";

      // Update user information
      if (userDisplayName) {
        userDisplayName.textContent =
          this.user.displayName || this.user.username;
      }

      if (userAvatarInitials) {
        userAvatarInitials.textContent = this.getUserInitials(
          this.user.displayName || this.user.username
        );
      }

      // Handle avatar image
      if (userAvatarImage) {
        if (this.user.avatar) {
          userAvatarImage.src = this.user.avatar;
          userAvatarImage.style.display = "block";
          if (userAvatarInitials && userAvatarInitials.parentElement) {
            userAvatarInitials.parentElement.style.display = "none";
          }
        } else {
          userAvatarImage.style.display = "none";
          if (userAvatarInitials && userAvatarInitials.parentElement) {
            userAvatarInitials.parentElement.style.display = "flex";
          }
        }
      }
    } else {
      // Show login section, hide user section
      if (loginSection) loginSection.style.display = "block";
      if (userSection) userSection.style.display = "none";
    }
  }

  setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", (e) => {
      if (e.key === "atlas_logged_in" || e.key === "atlas_user") {
        this.checkSession();
        this.updateUI();
      }
    });

    // Listen for custom login events
    window.addEventListener("userLoggedIn", (e) => {
      this.checkSession();
      this.updateUI();
    });
  }

  // Public method to check if user is logged in
  isUserLoggedIn() {
    return this.isLoggedIn;
  }

  // Public method to get current user
  getCurrentUser() {
    return this.user;
  }
}

// Initialize user authentication when DOM is loaded
let userAuth;

document.addEventListener("DOMContentLoaded", function () {
  userAuth = new UserAuth();

  // Make userAuth available globally for debugging
  window.userAuth = userAuth;

  console.log("User authentication system initialized");
});

// Export for use in other modules if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = UserAuth;
}
