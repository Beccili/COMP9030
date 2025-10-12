/**
 * API Adapter Layer for Backend Integration
 * Maps between frontend data structures and backend PHP API
 */

// Backend API base URL - adjust based on your server setup
// PHP server running from 'src' folder on port 8080
const API_BASE = window.location.protocol === 'file:' 
  ? 'http://localhost:8080'  // For file:// access
  : '/cycle3/backend';        // Absolute path from server root (src/)

// Session management
const getSessionId = () => localStorage.getItem('atlas_session_id') || '';
const setSessionId = (id) => localStorage.setItem('atlas_session_id', id);
const clearSessionId = () => localStorage.removeItem('atlas_session_id');

// Common headers
const jsonHeaders = { 'Content-Type': 'application/json' };

// Helper to handle API responses
async function handleResponse(response) {
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

// ===== DATA MAPPING HELPERS =====

/**
 * Convert backend artwork to frontend format
 */
export function fromServerArtwork(serverArt) {
  return {
    id: serverArt.id,
    title: serverArt.title,
    artist: serverArt.artist || 'Unknown Artist', // Artist name from backend
    artistId: serverArt.submitted_by || '',
    artistInfo: serverArt.artistInfo || '', // Artist bio from backend
    type: serverArt.artType,
    period: serverArt.period,
    region: serverArt.region,
    sensitive: !!serverArt.sensitive,
    address: serverArt.address || '',
    intro: serverArt.description || '',
    status: serverArt.status,
    date: serverArt.submitted_at?.slice(0, 10) || '',
    submitted: serverArt.submitted_at?.slice(0, 10) || '',
    // Pass through optional fields
    location: serverArt.location || '',
    country: serverArt.country || 'AU',
    theme: serverArt.theme || '',
    nature: serverArt.nature || '',
    booth: serverArt.booth || '',
    tags: serverArt.tags || [],
    coords: serverArt.coords || null,
    artworkImages: Array.isArray(serverArt.images) 
      ? serverArt.images.map(img => {
          const filename = typeof img === 'string' ? img : (img.name || '');
          // If filename doesn't include path, prepend assets/img/
          const fullPath = filename.includes('/') ? filename : `assets/img/${filename}`;
          return { name: fullPath };
        })
      : [],
    submitter: serverArt.submitted_by
  };
}

/**
 * Convert frontend artwork to backend format
 */
export function toServerArtwork(frontendArt, artistName = '') {
  return {
    title: frontendArt.title,
    artist: artistName || frontendArt.artist || '',
    artType: frontendArt.type,
    period: frontendArt.period,
    region: frontendArt.region,
    sensitive: !!frontendArt.sensitive,
    address: frontendArt.sensitive ? null : (frontendArt.address?.trim() || null),
    coords: frontendArt.sensitive ? null : (frontendArt.coords || null),
    description: frontendArt.intro || '',
    images: (frontendArt.artworkImages || []).map(img => 
      typeof img === 'string' ? img : (img.name || '')
    ).filter(Boolean)
  };
}

/**
 * Convert backend user to frontend format
 */
export function fromServerUser(serverUser) {
  // Map backend status to frontend status
  const statusMap = {
    'approved': 'active',
    'pending': 'pending',
    'inactive': 'inactive'
  };
  
  return {
    id: serverUser.id,
    name: serverUser.name,
    email: serverUser.email,
    role: serverUser.role,
    region: serverUser.region || '',
    nation: serverUser.nation || '',
    bio: serverUser.bio || '',
    status: statusMap[serverUser.status] || serverUser.status,
    created: serverUser.created_at?.slice(0, 10) || '',
    gender: serverUser.gender || '',
    phone: serverUser.phone || '',
    dob: serverUser.dob || '',
    imageUrl: serverUser.imageUrl || ''
  };
}

/**
 * Convert frontend user status to backend status
 */
export function toServerStatus(frontendStatus) {
  const statusMap = {
    'active': 'approved',
    'pending': 'pending',
    'inactive': 'inactive'
  };
  return statusMap[frontendStatus] || frontendStatus;
}

// ===== AUTHENTICATION API =====

/**
 * Login user
 */
export async function apiLogin(username, password) {
  const response = await fetch(`${API_BASE}/auth.php?action=login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ username, password })
  });
  
  const data = await handleResponse(response);
  const { user, session_id } = data.data;
  
  // Store session
  setSessionId(session_id);
  localStorage.setItem('atlas_user', JSON.stringify(user));
  localStorage.setItem('atlas_logged_in', 'true');
  
  return { user, session_id };
}

/**
 * Logout user
 */
export async function apiLogout() {
  const sessionId = getSessionId();
  if (!sessionId) return;
  
  try {
    await fetch(`${API_BASE}/auth.php?action=logout&session_id=${sessionId}`, {
      method: 'POST',
      headers: jsonHeaders
    });
  } finally {
    // Clear local session regardless of API response
    clearSessionId();
    localStorage.removeItem('atlas_user');
    localStorage.removeItem('atlas_logged_in');
  }
}

/**
 * Register new user
 */
export async function apiRegister(userData) {
  const response = await fetch(`${API_BASE}/auth.php?action=register`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      region: userData.region || '',
      nation: userData.nation || '',
      bio: userData.bio || '',
      imageUrl: userData.imageUrl || ''
    })
  });
  
  const data = await handleResponse(response);
  return data.data.user;
}

/**
 * Verify current session
 */
export async function apiVerifySession() {
  const sessionId = getSessionId();
  if (!sessionId) {
    throw new Error('No session found');
  }
  
  const response = await fetch(`${API_BASE}/auth.php?action=verify&session_id=${sessionId}`);
  const data = await handleResponse(response);
  
  return data.data;
}

/**
 * Update user profile
 */
export async function apiUpdateProfile(userData) {
  const sessionId = getSessionId();
  if (!sessionId) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE}/auth.php?action=update_profile&session_id=${sessionId}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password || undefined,
      region: userData.region || '',
      nation: userData.nation || '',
      bio: userData.bio || '',
      imageUrl: userData.imageUrl || ''
    })
  });
  
  const data = await handleResponse(response);
  
  // Update localStorage with new user data
  localStorage.setItem('atlas_user', JSON.stringify(data.data.user));
  
  return data.data.user;
}

// ===== ARTWORKS API =====

/**
 * Get all artworks with optional filters
 */
export async function getArtworks(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.artType) params.append('artType', filters.artType);
  if (filters.region) params.append('region', filters.region);
  if (filters.period) params.append('period', filters.period);
  // Include status even if empty string (to get all artworks)
  if ('status' in filters) params.append('status', filters.status);
  
  const queryString = params.toString();
  const url = `${API_BASE}/artworks.php${queryString ? '?' + queryString : ''}`;
  
  const response = await fetch(url);
  const data = await handleResponse(response);
  
  return data.data.map(fromServerArtwork);
}

/**
 * Get single artwork by ID
 */
export async function getArtwork(id) {
  const response = await fetch(`${API_BASE}/artworks.php?id=${encodeURIComponent(id)}`);
  const data = await handleResponse(response);
  return fromServerArtwork(data.data);
}

/**
 * Create new artwork (requires authentication)
 */
export async function createArtwork(artworkData, artistName = '') {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const serverData = toServerArtwork(artworkData, artistName);
  
  const response = await fetch(`${API_BASE}/artworks.php?session_id=${sessionId}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(serverData)
  });
  
  const data = await handleResponse(response);
  return fromServerArtwork(data.data);
}

/**
 * Update artwork (requires authentication)
 */
export async function updateArtwork(id, artworkData, artistName = '') {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const serverData = toServerArtwork(artworkData, artistName);
  
  const response = await fetch(
    `${API_BASE}/artworks.php?id=${encodeURIComponent(id)}&session_id=${sessionId}`,
    {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(serverData)
    }
  );
  
  const data = await handleResponse(response);
  return fromServerArtwork(data.data);
}

/**
 * Delete artwork (admin only)
 */
export async function deleteArtwork(id) {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(
    `${API_BASE}/artworks.php?id=${encodeURIComponent(id)}&session_id=${sessionId}`,
    {
      method: 'DELETE',
      headers: jsonHeaders
    }
  );
  
  await handleResponse(response);
}

// ===== ADMIN API =====

/**
 * Get all users (admin only)
 */
export async function adminGetUsers() {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(`${API_BASE}/admin.php?action=users&session_id=${sessionId}`);
  const data = await handleResponse(response);
  
  return data.data.map(fromServerUser);
}

/**
 * Get pending artworks (admin only)
 */
export async function adminGetPendingArtworks() {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(
    `${API_BASE}/admin.php?action=pending_artworks&session_id=${sessionId}`
  );
  const data = await handleResponse(response);
  
  return data.data.map(fromServerArtwork);
}

/**
 * Get system statistics (admin only)
 */
export async function adminGetStats() {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(`${API_BASE}/admin.php?action=stats&session_id=${sessionId}`);
  const data = await handleResponse(response);
  
  return data.data;
}

/**
 * Approve user (admin only)
 */
export async function adminApproveUser(userId) {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(
    `${API_BASE}/admin.php?action=approve_user&session_id=${sessionId}`,
    {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ user_id: userId })
    }
  );
  
  const data = await handleResponse(response);
  return fromServerUser(data.data);
}

/**
 * Approve artwork (admin only)
 */
export async function adminApproveArtwork(artworkId) {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(
    `${API_BASE}/admin.php?action=approve_artwork&session_id=${sessionId}`,
    {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ artwork_id: artworkId })
    }
  );
  
  const data = await handleResponse(response);
  return fromServerArtwork(data.data);
}

/**
 * Reject artwork (admin only)
 */
export async function adminRejectArtwork(artworkId, reason = '') {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(
    `${API_BASE}/admin.php?action=reject_artwork&session_id=${sessionId}`,
    {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ 
        artwork_id: artworkId,
        reason: reason
      })
    }
  );
  
  const data = await handleResponse(response);
  return fromServerArtwork(data.data);
}

/**
 * Update user (admin only) - will be added to backend in Phase 2
 */
export async function adminUpdateUser(userId, userData) {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(
    `${API_BASE}/admin.php?action=update_user&session_id=${sessionId}`,
    {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ 
        user_id: userId,
        ...userData
      })
    }
  );
  
  const data = await handleResponse(response);
  return fromServerUser(data.data);
}

/**
 * Set user status (admin only) - will be added to backend in Phase 2
 */
export async function adminSetUserStatus(userId, status) {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  // Convert frontend status to backend status
  const backendStatus = toServerStatus(status);
  
  const response = await fetch(
    `${API_BASE}/admin.php?action=set_user_status&session_id=${sessionId}`,
    {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ 
        user_id: userId,
        status: backendStatus
      })
    }
  );
  
  const data = await handleResponse(response);
  return fromServerUser(data.data);
}

/**
 * Update artwork status (for flagging, etc.)
 */
export async function updateArtworkStatus(id, status) {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(
    `${API_BASE}/artworks.php?id=${encodeURIComponent(id)}&session_id=${sessionId}`,
    {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify({ status })
    }
  );
  
  const data = await handleResponse(response);
  return fromServerArtwork(data.data);
}

// ===== REPORTS API =====

/**
 * Get all reports (admin only)
 */
export async function getReports(status = 'all') {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const params = new URLSearchParams({ session_id: sessionId });
  if (status) params.append('status', status);
  
  const response = await fetch(`${API_BASE}/reports.php?${params.toString()}`);
  const data = await handleResponse(response);
  
  return data.data;
}

/**
 * Submit a report (public)
 */
export async function submitReport(reportData) {
  const response = await fetch(`${API_BASE}/reports.php`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(reportData)
  });
  
  const data = await handleResponse(response);
  return data.data;
}

/**
 * Update report (admin only - for reviewing)
 */
export async function updateReport(reportId, updates) {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error('Authentication required');
  
  const response = await fetch(
    `${API_BASE}/reports.php?id=${encodeURIComponent(reportId)}&session_id=${sessionId}`,
    {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(updates)
    }
  );
  
  const data = await handleResponse(response);
  return data.data;
}

// ===== LIKES API =====

/**
 * Check if user has liked an artwork
 */
export async function checkLike(artworkId) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return { liked: false };
  }
  
  const response = await fetch(`${API_BASE}/likes.php?session_id=${sessionId}&artwork_id=${artworkId}`);
  const data = await handleResponse(response);
  return data.data;
}

/**
 * Like an artwork
 */
export async function likeArtwork(artworkId) {
  const sessionId = getSessionId();
  if (!sessionId) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE}/likes.php?session_id=${sessionId}`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ artwork_id: artworkId })
  });
  
  const data = await handleResponse(response);
  return data.data;
}

/**
 * Unlike an artwork
 */
export async function unlikeArtwork(artworkId) {
  const sessionId = getSessionId();
  if (!sessionId) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE}/likes.php?session_id=${sessionId}&artwork_id=${artworkId}`, {
    method: 'DELETE'
  });
  
  const data = await handleResponse(response);
  return data.data;
}

/**
 * Get all likes for current user
 */
export async function getUserLikes() {
  const sessionId = getSessionId();
  if (!sessionId) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE}/likes.php?session_id=${sessionId}`);
  const data = await handleResponse(response);
  return data.data;
}

// Export all functions as default object for easier importing
export default {
  // Auth
  apiLogin,
  apiLogout,
  apiRegister,
  apiVerifySession,
  
  // Artworks
  getArtworks,
  getArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  updateArtworkStatus,
  
  // Admin
  adminGetUsers,
  adminGetPendingArtworks,
  adminGetStats,
  adminApproveUser,
  adminApproveArtwork,
  adminRejectArtwork,
  adminUpdateUser,
  adminSetUserStatus,
  
  // Reports
  getReports,
  submitReport,
  updateReport,
  
  // Likes
  checkLike,
  likeArtwork,
  unlikeArtwork,
  getUserLikes,
  
  // Helpers
  fromServerArtwork,
  toServerArtwork,
  fromServerUser,
  toServerStatus,
  getSessionId
};
