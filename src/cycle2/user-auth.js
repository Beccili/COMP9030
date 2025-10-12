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

      // Hide Register nav button when logged in
      this.toggleRegisterButton(false);

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
        console.log('Setting avatar to:', this.user.avatar);
        if (this.user.avatar) {
          userAvatarImage.src = this.user.avatar;
          userAvatarImage.style.display = "block";
          if (userAvatarInitials && userAvatarInitials.parentElement) {
            userAvatarInitials.parentElement.style.display = "none";
          }
        } else {
          console.log('No avatar found, showing initials');
          userAvatarImage.style.display = "none";
          if (userAvatarInitials && userAvatarInitials.parentElement) {
            userAvatarInitials.parentElement.style.display = "flex";
          }
        }
      }

      // Make avatar clickable to go to account page
      this.setupAvatarClickHandler();
    } else {
      // Show login section, hide user section
      if (loginSection) loginSection.style.display = "block";
      if (userSection) userSection.style.display = "none";
      
      // Show Register nav button when not logged in
      this.toggleRegisterButton(true);
    }
  }

  toggleRegisterButton(show) {
    // Find all Register nav links
    const registerLinks = document.querySelectorAll('a.nav-link[href*="register"]');
    registerLinks.forEach(link => {
      // Find the parent li element
      const parentLi = link.closest('li');
      if (parentLi) {
        parentLi.style.display = show ? 'block' : 'none';
      }
    });

    // Also add/show Account link when logged in
    if (!show) {
      this.addAccountNavLink();
    } else {
      this.removeAccountNavLink();
    }
  }

  addAccountNavLink() {
    // Check if Account link already exists
    if (document.querySelector('.account-nav-item')) {
      return;
    }

    // Find the nav list
    const navList = document.querySelector('.nav-list');
    if (!navList) return;

    // Create Account nav item
    const accountLi = document.createElement('li');
    accountLi.className = 'account-nav-item';
    
    const accountLink = document.createElement('a');
    accountLink.href = "account.html";
    accountLink.className = 'nav-link';
    accountLink.textContent = 'Account';
    
    // Mark as active if on account page
    if (window.location.pathname.includes('account.html')) {
      accountLink.classList.add('nav-active');
    }
    
    accountLi.appendChild(accountLink);
    
    // Insert before the Register item or at the end
    const registerLinks = navList.querySelectorAll('a[href*="register"]');
    if (registerLinks.length > 0) {
      const registerLi = registerLinks[0].closest('li');
      if (registerLi && registerLi.parentNode === navList) {
        navList.insertBefore(accountLi, registerLi);
      } else {
        navList.appendChild(accountLi);
      }
    } else {
      navList.appendChild(accountLi);
    }
  }

  removeAccountNavLink() {
    // Remove the Account nav link when logged out
    const accountNavItems = document.querySelectorAll('.account-nav-item');
    accountNavItems.forEach(item => item.remove());
  }

  setupAvatarClickHandler() {
    const avatarContainer = document.querySelector(".avatar-container");
    if (avatarContainer && !avatarContainer.hasAttribute("data-click-handler")) {
      // Mark that we've added the handler to avoid duplicates
      avatarContainer.setAttribute("data-click-handler", "true");
      
      // Add cursor pointer style and title to indicate it's clickable
      avatarContainer.style.cursor = "pointer";
      avatarContainer.title = "Click to view account";
      
      // Add click event listener
      avatarContainer.addEventListener("click", (e) => {
        // Don't navigate if clicking the logout button
        if (e.target.closest("#logout-btn")) {
          return;
        }
        
        // Navigate to account page
        window.location.href = false 
          ? "../account.html" 
          : "account.html";
      });

      // Add hover effect
      avatarContainer.addEventListener("mouseenter", () => {
        avatarContainer.style.opacity = "0.8";
        avatarContainer.style.transform = "scale(1.05)";
        avatarContainer.style.transition = "all 0.2s ease";
      });
      
      avatarContainer.addEventListener("mouseleave", () => {
        avatarContainer.style.opacity = "1";
        avatarContainer.style.transform = "scale(1)";
      });
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
  // Prevent multiple initializations
  if (window.userAuth) {
    console.log("User authentication already initialized");
    return;
  }
  
  userAuth = new UserAuth();

  // Make userAuth available globally for debugging
  window.userAuth = userAuth;

  console.log("User authentication system initialized");
});

// Export for use in other modules if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = UserAuth;
}

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 22
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
