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
  
  card.innerHTML = `
    <img src="${imageSrc}" alt="${artwork.title}" class="artwork-image" 
         onerror="this.src='assets/img/art01.png'">
    <div class="artwork-content">
      <h3 class="artwork-title">${artwork.title}</h3>
      <p class="artwork-artist">by ${artwork.artist}</p>
      ${artwork.description ? `<p style="color:var(--muted);font-size:var(--font-size-sm);margin-top:var(--space-xs)">${artwork.description.substring(0, 100)}...</p>` : ''}
      <div class="artwork-tags">
        ${artwork.artType ? `<span class="artwork-tag">${artwork.artType}</span>` : ''}
        ${artwork.period ? `<span class="artwork-tag">${artwork.period}</span>` : ''}
        ${artwork.region ? `<span class="artwork-tag">${artwork.region}</span>` : ''}
      </div>
    </div>
  `;
  
  // Add click handler to view artwork details
  if (artwork.id) {
    card.style.cursor = 'pointer';
    card.onclick = () => {
      window.location.href = `detail.html?id=${artwork.id}`;
    };
  } else if (artwork.url) {
    card.style.cursor = 'pointer';
    card.onclick = () => {
      window.open(artwork.url, '_blank');
    };
  }
  
  return card;
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
