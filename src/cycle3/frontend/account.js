/* Account Page — View and manage user account */

const STORE_KEY = "IAA_accounts_v1"; // accounts (user or artist)

// Get the current logged-in user's account
function getCurrentAccount() {
  try {
    // First check if user is logged in
    const isLoggedIn = localStorage.getItem("atlas_logged_in") === "true";
    const userData = localStorage.getItem("atlas_user");
    
    if (!isLoggedIn || !userData) {
      return null;
    }
    
    const loggedInUser = JSON.parse(userData);
    
    // Try to find the account by email
    const accounts = JSON.parse(localStorage.getItem(STORE_KEY)) || [];
    const userAccount = accounts.find(acc => acc.email === loggedInUser.email);
    
    if (userAccount) {
      return userAccount;
    }
    
    // If no account exists but user is logged in (mocked login),
    // create a mock account from the logged-in user data
    return {
      id: 'mock_' + Date.now(),
      name: loggedInUser.displayName || loggedInUser.username || 'Test User',
      email: loggedInUser.email || 'test@example.com',
      role: 'artist',
      status: 'approved',
      region: 'NSW',
      nation: 'Kaurna',
      imageUrl: loggedInUser.avatar || '',
      bio: 'Contemporary Indigenous artist from Kaurna country, exploring traditional themes through modern mediums. My work focuses on the connection between ancestral knowledge and contemporary expression.',
      artworks: ['detail.html?id=vincent-namatjira-portrait', 'detail.html?id=kaylene-whiskey-tv']
    };
  } catch {
    return null;
  }
}

// Load artwork entries from common data
const artEntries = (window.AppData && window.AppData.artEntries) || [];

// Populate account information
function populateAccountInfo() {
  const account = getCurrentAccount();
  
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
  if (avatar && account.imageUrl) {
    avatar.src = account.imageUrl;
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
  
  if (account.role === 'artist') {
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
function populateArtworks(account) {
  const artworksGrid = document.getElementById('artworks-grid');
  const emptyState = document.getElementById('artworks-empty');
  
  // For demo purposes, we'll show some sample artworks for artists
  // In a real app, this would be linked to actual submitted artworks
  if (account.artworks && account.artworks.length > 0) {
    // Show actual artworks if they exist
    artworksGrid.innerHTML = '';
    emptyState.style.display = 'none';
    
    // This would normally fetch the actual artwork data
    // For now, we'll just show the links
    account.artworks.forEach(artworkUrl => {
      const card = createArtworkCard({
        title: 'Submitted Artwork',
        artist: account.name,
        url: artworkUrl
      });
      artworksGrid.appendChild(card);
    });
  } else if (account.role === 'artist' && account.status === 'approved') {
    // Show sample artworks for approved artists (demo)
    artworksGrid.innerHTML = '';
    emptyState.style.display = 'none';
    
    // Get first 3 artworks from common data as samples
    const sampleArtworks = artEntries.slice(0, 3);
    sampleArtworks.forEach(artwork => {
      const card = createArtworkCard({
        id: artwork.id,
        title: artwork.title,
        artist: account.name, // Use the account holder's name
        description: artwork.description,
        artType: artwork.artType,
        period: artwork.period,
        region: artwork.region,
        images: artwork.images
      });
      artworksGrid.appendChild(card);
    });
  } else {
    // Show empty state
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
document.addEventListener('DOMContentLoaded', () => {
  // Handle edit account button
  const editBtn = document.getElementById('edit-account-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // Redirect to register page for editing
      // In a real app, we might pass the account ID or pre-fill the form
      window.location.href = 'register.html';
    });
  }
  
  populateAccountInfo();
  console.log('Account page initialized');
});

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 8
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
