// ===== ADMIN DASHBOARD FUNCTIONALITY =====

// Get artwork data from common-data.js
const adminArtworks = window.AppData?.artEntries || [];

// Dashboard state
let currentUser = null;
let filteredArtworks = [...adminArtworks];

// DOM Elements
let adminUserName;
let adminLogoutBtn;
let artworksTableBody;
let artworkSearch;
let artworkFilter;
let activityList;
let actionModal;
let modalTitle;
let modalBody;
let modalClose;

// Utility Functions
function checkAdminAuth() {
  const isLoggedIn = localStorage.getItem("atlas_admin_logged_in") === "true";
  const adminData = localStorage.getItem("atlas_admin");

  if (!isLoggedIn || !adminData) {
    // Redirect to admin login if not authenticated
    window.location.href = "admin-login.html";
    return false;
  }

  try {
    currentUser = JSON.parse(adminData);
    return true;
  } catch (error) {
    console.error("Error parsing admin data:", error);
    localStorage.removeItem("atlas_admin");
    localStorage.removeItem("atlas_admin_logged_in");
    window.location.href = "admin-login.html";
    return false;
  }
}

function updateUserInfo() {
  if (adminUserName && currentUser) {
    adminUserName.textContent = currentUser.displayName || currentUser.username;
  }
}

function handleLogout() {
  // Clear admin session
  localStorage.removeItem("atlas_admin");
  localStorage.removeItem("atlas_admin_logged_in");

  // Redirect to admin login
  window.location.href = "admin-login.html";
}

function getArtworkStatus(artwork) {
  if (artwork.sensitive) return "sensitive";
  if (artwork.id.includes("placeholder")) return "draft";
  return "published";
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "published":
      return "status-published";
    case "draft":
      return "status-draft";
    case "sensitive":
      return "status-sensitive";
    default:
      return "status-published";
  }
}

function getStatusText(status) {
  switch (status) {
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    case "sensitive":
      return "Sensitive";
    default:
      return "Published";
  }
}

function truncateText(text, maxLength = 50) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function renderArtworksTable() {
  if (!artworksTableBody) return;

  artworksTableBody.innerHTML = "";

  filteredArtworks.forEach((artwork, index) => {
    const status = getArtworkStatus(artwork);
    const statusClass = getStatusBadgeClass(status);
    const statusText = getStatusText(status);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="artwork-info">
          <img src="${window.Utils.asset(artwork.images[0])}" alt="${
      artwork.title
    }" class="artwork-thumbnail" 
               onerror="this.src='${window.Utils.asset(
                 "assets/img/art01.png"
               )}'">
          <div class="artwork-details">
            <h4>${truncateText(artwork.title, 30)}</h4>
            <p>${truncateText(artwork.description, 40)}</p>
          </div>
        </div>
      </td>
      <td>${artwork.artist}</td>
      <td>${artwork.artType}</td>
      <td>${artwork.region}</td>
      <td>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </td>
      <td>
        <div class="table-actions">
          <button class="action-btn-small" onclick="editArtwork('${
            artwork.id
          }')" title="Edit">✏️</button>
          <button class="action-btn-small" onclick="viewArtwork('${
            artwork.id
          }')" title="View">👁️</button>
          <button class="action-btn-small" onclick="deleteArtwork('${
            artwork.id
          }')" title="Delete">🗑️</button>
        </div>
      </td>
    `;

    artworksTableBody.appendChild(row);
  });
}

function filterArtworks() {
  const searchTerm = artworkSearch?.value.toLowerCase() || "";
  const filterType = artworkFilter?.value || "";

  filteredArtworks = adminArtworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchTerm) ||
      artwork.artist.toLowerCase().includes(searchTerm) ||
      artwork.description.toLowerCase().includes(searchTerm);

    const matchesFilter = !filterType || artwork.artType === filterType;

    return matchesSearch && matchesFilter;
  });

  renderArtworksTable();
}

function renderRecentActivity() {
  if (!activityList) return;

  const activities = [
    {
      icon: "🎨",
      text: "New artwork 'Stand Strong for Who You Are' was added by Vincent Namatjira",
      time: "2 hours ago",
    },
    {
      icon: "👤",
      text: "User 'art_historian' registered and verified their account",
      time: "4 hours ago",
    },
    {
      icon: "⭐",
      text: "Artwork 'Kaylene TV' was featured on the homepage",
      time: "6 hours ago",
    },
    {
      icon: "🔒",
      text: "Artwork 'Sorry' was marked as sensitive content",
      time: "1 day ago",
    },
    {
      icon: "📊",
      text: "Monthly analytics report generated successfully",
      time: "2 days ago",
    },
    {
      icon: "👥",
      text: "10 new users joined the platform this week",
      time: "3 days ago",
    },
  ];

  activityList.innerHTML = "";

  activities.forEach((activity) => {
    const activityItem = document.createElement("div");
    activityItem.className = "activity-item";
    activityItem.innerHTML = `
      <div class="activity-icon">${activity.icon}</div>
      <div class="activity-content">
        <p class="activity-text">${activity.text}</p>
        <p class="activity-time">${activity.time}</p>
      </div>
    `;

    activityList.appendChild(activityItem);
  });
}

function showModal(title, content) {
  if (modalTitle) modalTitle.textContent = title;
  if (modalBody) modalBody.innerHTML = content;
  if (actionModal) actionModal.style.display = "flex";
}

function hideModal() {
  if (actionModal) actionModal.style.display = "none";
}

function handleQuickAction(action) {
  switch (action) {
    case "add-artwork":
      showModal(
        "Add New Artwork",
        `
        <p>Add new artwork functionality would be implemented here.</p>
        <p>This would include:</p>
        <ul>
          <li>Upload artwork images</li>
          <li>Enter artwork details (title, artist, description)</li>
          <li>Set location and cultural sensitivity</li>
          <li>Configure artwork metadata</li>
        </ul>
        <p><em>This is a demo interface.</em></p>
      `
      );
      break;
    case "manage-users":
      showModal(
        "Manage Users",
        `
        <p>User management functionality would include:</p>
        <ul>
          <li>View all registered users (156 total)</li>
          <li>Approve/reject user registrations</li>
          <li>Manage user permissions and roles</li>
          <li>View user activity and contributions</li>
        </ul>
        <p><em>This is a demo interface.</em></p>
      `
      );
      break;
    case "view-reports":
      showModal(
        "Analytics & Reports",
        `
        <p>Analytics dashboard would show:</p>
        <ul>
          <li>Monthly page views: 2,400</li>
          <li>Most popular artworks</li>
          <li>User engagement metrics</li>
          <li>Geographic distribution of visitors</li>
          <li>Search queries and trends</li>
        </ul>
        <p><em>This is a demo interface.</em></p>
      `
      );
      break;
    case "site-settings":
      showModal(
        "Site Settings",
        `
        <p>System configuration options:</p>
        <ul>
          <li>Site metadata and SEO settings</li>
          <li>Cultural sensitivity guidelines</li>
          <li>User registration settings</li>
          <li>Content moderation policies</li>
          <li>Backup and maintenance</li>
        </ul>
        <p><em>This is a demo interface.</em></p>
      `
      );
      break;
    default:
      showModal(
        "Action",
        `<p>Action "${action}" would be implemented here.</p>`
      );
  }
}

// Global functions for artwork actions
window.editArtwork = function (artworkId) {
  const artwork = adminArtworks.find((a) => a.id === artworkId);
  if (artwork) {
    showModal(
      `Edit: ${artwork.title}`,
      `
      <p>Edit artwork functionality would include:</p>
      <ul>
        <li>Update artwork details</li>
        <li>Modify images and descriptions</li>
        <li>Change cultural sensitivity settings</li>
        <li>Update location information</li>
      </ul>
      <p><strong>Artwork:</strong> ${artwork.title}</p>
      <p><strong>Artist:</strong> ${artwork.artist}</p>
      <p><em>This is a demo interface.</em></p>
    `
    );
  }
};

window.viewArtwork = function (artworkId) {
  const artwork = adminArtworks.find((a) => a.id === artworkId);
  if (artwork) {
    window.open(
      `${window.Utils.page("detail.html")}?id=${artworkId}`,
      "_blank"
    );
  }
};

window.deleteArtwork = function (artworkId) {
  const artwork = adminArtworks.find((a) => a.id === artworkId);
  if (artwork) {
    showModal(
      `Delete: ${artwork.title}`,
      `
      <p>Are you sure you want to delete this artwork?</p>
      <p><strong>Title:</strong> ${artwork.title}</p>
      <p><strong>Artist:</strong> ${artwork.artist}</p>
      <p style="color: #ff6b6b; font-weight: bold;">⚠️ This action cannot be undone!</p>
      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
        <button onclick="hideModal()" style="padding: 8px 16px; background: var(--elev-2); border: 1px solid var(--elev-2); border-radius: 4px; color: var(--text); cursor: pointer;">Cancel</button>
        <button onclick="confirmDelete('${artworkId}')" style="padding: 8px 16px; background: #ff6b6b; border: 1px solid #ff6b6b; border-radius: 4px; color: white; cursor: pointer;">Delete</button>
      </div>
    `
    );
  }
};

window.confirmDelete = function (artworkId) {
  // In a real implementation, this would make an API call to delete the artwork
  console.log(`Deleting artwork: ${artworkId}`);
  hideModal();

  // Show success message (demo)
  showModal(
    "Success",
    `
    <p style="color: #4caf50;">✅ Artwork has been deleted successfully.</p>
    <p><em>In a real implementation, the artwork would be removed from the database.</em></p>
  `
  );

  setTimeout(hideModal, 2000);
};

function initializeEventListeners() {
  // Logout button
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", handleLogout);
  }

  // Search and filter
  if (artworkSearch) {
    artworkSearch.addEventListener(
      "input",
      window.Utils.debounce(filterArtworks, 300)
    );
  }

  if (artworkFilter) {
    artworkFilter.addEventListener("change", filterArtworks);
  }

  // Quick action buttons
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const action = e.currentTarget.getAttribute("data-action");
      handleQuickAction(action);
    });
  });

  // Modal close
  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  // Close modal on overlay click
  if (actionModal) {
    actionModal.addEventListener("click", (e) => {
      if (e.target === actionModal) {
        hideModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      actionModal &&
      actionModal.style.display === "flex"
    ) {
      hideModal();
    }
  });
}

// Make hideModal available globally
window.hideModal = hideModal;

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  // Check admin authentication
  if (!checkAdminAuth()) {
    return; // Will redirect to login
  }

  // Get DOM elements
  adminUserName = document.getElementById("admin-user-name");
  adminLogoutBtn = document.getElementById("admin-logout-btn");
  artworksTableBody = document.getElementById("artworks-table-body");
  artworkSearch = document.getElementById("artwork-search");
  artworkFilter = document.getElementById("artwork-filter");
  activityList = document.getElementById("activity-list");
  actionModal = document.getElementById("action-modal");
  modalTitle = document.getElementById("modal-title");
  modalBody = document.getElementById("modal-body");
  modalClose = document.getElementById("modal-close");

  // Initialize UI
  updateUserInfo();
  renderArtworksTable();
  renderRecentActivity();

  // Initialize event listeners
  initializeEventListeners();

  console.log("Admin dashboard initialized successfully");
  console.log(`Loaded ${adminArtworks.length} artworks for management`);
});
