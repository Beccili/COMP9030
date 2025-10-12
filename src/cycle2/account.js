/* Account Page — View and manage user account with backend integration */

import api from './api.js';

const STORE_KEY = "IAA_accounts_v1"; // accounts (legacy)

// Get the current user from backend session
async function getCurrentAccount() {
  try {
    const sessionId = localStorage.getItem('atlas_session_id');
    if (!sessionId) {
      return null;
    }
    
    const sessionData = await api.apiVerifySession();
    const user = sessionData.user;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      region: user.region || '',
      nation: user.nation || '',
      imageUrl: user.imageUrl || '',
      bio: user.bio || '',
      username: user.username
    };
  } catch (error) {
    console.error('Failed to get current account:', error);
    return null;
  }
}

// Populate account information
async function populateAccountInfo() {
  const account = await getCurrentAccount();
  
  if (!account) {
    // No account found, redirect to login (but prevent infinite loop)
    if (!sessionStorage.getItem('redirecting_to_login')) {
      sessionStorage.setItem('redirecting_to_login', 'true');
      alert("Please log in to view your account.");
      window.location.href = "login.html";
    }
    return;
  }
  
  // Clear the redirect flag if we have an account
  sessionStorage.removeItem('redirecting_to_login');

  // Populate basic information with null checks
  const nameEl = document.getElementById('account-name');
  if (nameEl) nameEl.textContent = account.name || '-';
  
  const emailEl = document.getElementById('account-email');
  if (emailEl) emailEl.textContent = account.email || '-';
  
  const roleEl = document.getElementById('account-role');
  if (roleEl) roleEl.textContent = account.role ? account.role.toUpperCase() : 'USER';
  
  // Set status badge
  const statusBadge = document.getElementById('account-status-badge');
  if (statusBadge) {
    if (account.status === 'approved') {
      statusBadge.textContent = 'Approved';
      statusBadge.className = 'status-badge status-approved';
    } else {
      statusBadge.textContent = 'Pending Approval';
      statusBadge.className = 'status-badge status-pending';
    }
  }
  
  // Set avatar
  const avatar = document.getElementById('account-avatar');
  if (avatar) {
    avatar.src = account.imageUrl || 'assets/img/user-avatar.png';
  }
  
  // Show optional fields if they have values
  if (account.nation) {
    const nationRow = document.getElementById('nation-row');
    const nationText = document.getElementById('account-nation');
    if (nationRow) nationRow.style.display = 'flex';
    if (nationText) nationText.textContent = account.nation;
  }
  
  if (account.region) {
    const regionRow = document.getElementById('region-row');
    const regionText = document.getElementById('account-region');
    if (regionRow) regionRow.style.display = 'flex';
    if (regionText) regionText.textContent = account.region;
  }
  
  if (account.bio) {
    const bioRow = document.getElementById('bio-row');
    const bioText = document.getElementById('account-bio');
    if (bioRow) bioRow.style.display = 'flex';
    if (bioText) bioText.textContent = account.bio;
  }
  
  // Show/hide artist-specific features
  const submitArtworkBtn = document.getElementById('submit-artwork-btn');
  const artworksSection = document.getElementById('artworks-section');
  
  if (account.role === 'artist' || account.role === 'admin') {
    // Show artwork submission button (only if approved)
    if (submitArtworkBtn && account.status === 'approved') {
      submitArtworkBtn.style.display = 'inline-block';
    }
    
    // Show artworks section
    if (artworksSection) {
      artworksSection.style.display = 'block';
      populateArtworks(account);
    }
  } else {
    // Hide artist-specific features for regular users
    if (submitArtworkBtn) submitArtworkBtn.style.display = 'none';
    if (artworksSection) artworksSection.style.display = 'none';
  }
}

// Populate artworks for artist accounts
async function populateArtworks(account) {
  const artworksGrid = document.getElementById('artworks-grid');
  const emptyState = document.getElementById('artworks-empty');
  
  try {
    // Load artworks submitted by this user from backend
    const allArtworks = await api.getArtworks({ status: 'all' });
    const userArtworks = allArtworks.filter(a => a.submitter === account.id || a.artistId === account.id);
    
    if (userArtworks.length > 0) {
      artworksGrid.innerHTML = '';
      emptyState.style.display = 'none';
      
      userArtworks.forEach(artwork => {
        const card = createArtworkCard({
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          description: artwork.intro,
          artType: artwork.type,
          period: artwork.period,
          region: artwork.region,
          status: artwork.status,
          images: artwork.artworkImages && artwork.artworkImages.length > 0
            ? artwork.artworkImages.map(img => img.name || img)
            : ['assets/img/art01.png']
        });
        artworksGrid.appendChild(card);
      });
    } else {
      // Show empty state
    artworksGrid.innerHTML = '';
      emptyState.style.display = 'block';
    }
  } catch (error) {
    console.error('Failed to load artworks:', error);
    artworksGrid.innerHTML = '';
    emptyState.style.display = 'block';
  }
}

// Create an artwork card element
function createArtworkCard(artwork) {
  const card = document.createElement('div');
  card.className = 'artwork-card';
  
  // Get image source
  const imageSrc = artwork.images && artwork.images[0] 
    ? (window.Utils && window.Utils.asset ? window.Utils.asset(artwork.images[0]) : artwork.images[0])
    : 'assets/img/art01.png';
  
  // Determine status badge
  let statusBadge = '';
  if (artwork.status === 'pending') {
    statusBadge = '<span class="status-badge status-pending">Pending Review</span>';
  } else if (artwork.status === 'approved') {
    statusBadge = '<span class="status-badge status-approved">Approved</span>';
  } else if (artwork.status === 'rejected') {
    statusBadge = '<span class="status-badge" style="color:#e06c75;border-color:#e06c7533;">Rejected</span>';
  }
  
  // Action buttons for pending artworks
  const actionButtons = artwork.status === 'pending' ? `
    <div class="artwork-actions" style="display:flex;gap:var(--space-sm);margin-top:var(--space-sm)">
      <button class="btn btn-secondary" style="font-size:var(--font-size-sm);padding:var(--space-xs) var(--space-sm)" onclick="editArtwork('${artwork.id}', event)">Edit</button>
      <button class="btn btn-secondary" style="font-size:var(--font-size-sm);padding:var(--space-xs) var(--space-sm);color:#e06c75;border-color:#e06c75" onclick="deleteArtwork('${artwork.id}', event)">Delete</button>
    </div>
  ` : '';
  
  card.innerHTML = `
    <img src="${imageSrc}" alt="${artwork.title}" class="artwork-image" 
         onerror="this.src='assets/img/art01.png'">
    <div class="artwork-content">
      <h3 class="artwork-title">${artwork.title} ${statusBadge}</h3>
      <p class="artwork-artist">by ${artwork.artist}</p>
      ${artwork.description ? `<p style="color:var(--muted);font-size:var(--font-size-sm);margin-top:var(--space-xs)">${artwork.description.substring(0, 100)}...</p>` : ''}
      <div class="artwork-tags">
        ${artwork.artType ? `<span class="artwork-tag">${artwork.artType}</span>` : ''}
        ${artwork.period ? `<span class="artwork-tag">${artwork.period}</span>` : ''}
        ${artwork.region ? `<span class="artwork-tag">${artwork.region}</span>` : ''}
      </div>
      ${actionButtons}
    </div>
  `;
  
  // Add click handler to view artwork details (only on the image, not buttons)
  const img = card.querySelector('.artwork-image');
  const title = card.querySelector('.artwork-title');
  
  if (artwork.id) {
    img.style.cursor = 'pointer';
    title.style.cursor = 'pointer';
    
    const viewHandler = () => {
      window.location.href = `detail.html?id=${artwork.id}`;
    };
    
    img.onclick = viewHandler;
    title.onclick = viewHandler;
  }
  
  return card;
}

// Edit artwork - redirect to artwork-submit page in edit mode
window.editArtwork = function(artworkId, event) {
  event.stopPropagation(); // Prevent card click
  window.location.href = `artwork-submit.html?edit=true&id=${artworkId}`;
};

// Delete artwork
window.deleteArtwork = async function(artworkId, event) {
  event.stopPropagation(); // Prevent card click
  
  if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
    return;
  }
  
  try {
    await api.deleteArtwork(artworkId);
    
    // Show success notification
    showNotification('success', 'Artwork Deleted', 'Your artwork has been deleted successfully.');
    
    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (error) {
    console.error('Delete failed:', error);
    showNotification('error', 'Delete Failed', error.message || 'Failed to delete artwork. Please try again.');
  }
};

// Notification function
function showNotification(type, title, message) {
  const overlay = document.createElement('div');
  overlay.className = 'notification-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;animation:fadeIn 0.2s ease';
  
  const popup = document.createElement('div');
  popup.className = `notification-popup notification-${type}`;
  popup.style.cssText = 'background:var(--elev-1);padding:var(--space-xl);border-radius:var(--border-radius-lg);max-width:500px;width:90%;box-shadow:var(--shadow-xl);animation:slideUp 0.3s ease;text-align:center';
  
  const icon = type === 'success' ? '✅' : '❌';
  const titleColor = type === 'success' ? '#8dc891' : '#e06c75';
  
  popup.innerHTML = `
    <div style="font-size:48px;margin-bottom:var(--space-md)">${icon}</div>
    <h3 style="font-size:var(--font-size-xl);font-weight:600;margin-bottom:var(--space-sm);color:${titleColor}">${title}</h3>
    <p style="color:var(--muted);margin-bottom:var(--space-lg)">${message}</p>
    <button class="btn btn-primary" onclick="this.closest('.notification-overlay').remove()">OK</button>
  `;
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Auto close after 3 seconds
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.remove();
    }
  }, 3000);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `;
  if (!document.querySelector('style[data-notification-styles]')) {
    style.setAttribute('data-notification-styles', 'true');
    document.head.appendChild(style);
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  // Handle edit account button
  const editBtn = document.getElementById('edit-account-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // Redirect to register page in edit mode
      window.location.href = 'register.html?edit=true';
    });
  }
  
  await populateAccountInfo();
});

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 8
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
