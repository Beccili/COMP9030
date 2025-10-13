/**
 * Admin-specific API module
 * Uses separate session storage from public site
 * Allows simultaneous login as different users on public site vs admin dashboard
 */

// Backend API base URL
const API_BASE = window.location.protocol === 'file:' 
  ? 'http://localhost:8080'
  : '/cycle3/backend';

// Admin-specific session management (isolated from public session)
const getAdminSessionId = () => localStorage.getItem('atlas_admin_session_id') || '';
const setAdminSessionId = (id) => localStorage.setItem('atlas_admin_session_id', id);
const clearAdminSessionId = () => localStorage.removeItem('atlas_admin_session_id');

const getAdminUser = () => {
  const data = localStorage.getItem('atlas_admin');
  return data ? JSON.parse(data) : null;
};
const setAdminUser = (user) => localStorage.setItem('atlas_admin', JSON.stringify(user));
const clearAdminUser = () => localStorage.removeItem('atlas_admin');

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

// ===== ADMIN AUTHENTICATION =====

/**
 * Admin login - validates that user is admin
 */
export async function adminLogin(username, password) {
  const response = await fetch(`${API_BASE}/auth.php?action=login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ username, password })
  });
  
  const data = await handleResponse(response);
  const { user, session_id } = data.data;
  
  // Validate admin role
  if (user.role !== 'admin') {
    throw new Error('Admin access required. This account is not an administrator.');
  }
  
  // Store admin session (separate from public session)
  setAdminSessionId(session_id);
  setAdminUser(user);
  
  return { user, session_id };
}

/**
 * Admin logout
 */
export async function adminLogout() {
  const sessionId = getAdminSessionId();
  if (!sessionId) return;
  
  try {
    await fetch(`${API_BASE}/auth.php?action=logout&session_id=${sessionId}`, {
      method: 'POST',
      headers: jsonHeaders
    });
  } finally {
    clearAdminSessionId();
    clearAdminUser();
  }
}

/**
 * Verify admin session
 */
export async function verifyAdminSession() {
  const sessionId = getAdminSessionId();
  if (!sessionId) {
    throw new Error('No admin session found');
  }
  
  const response = await fetch(`${API_BASE}/auth.php?action=verify&session_id=${sessionId}`);
  const data = await handleResponse(response);
  
  if (data.data.user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return data.data;
}

// Import regular API for data operations
import api from './api.js';

/**
 * Get artworks using admin session
 */
export async function adminGetArtworks(filters = {}) {
  // Override to use admin session
  const adminSessionId = getAdminSessionId();
  const originalGetSession = api.getSessionId;
  api.getSessionId = () => adminSessionId;
  
  try {
    return await api.getArtworks(filters);
  } finally {
    api.getSessionId = originalGetSession;
  }
}

// Export admin API with proper session handling
export default {
  // Admin Auth
  adminLogin,
  adminLogout,
  verifyAdminSession,
  getAdminSessionId,
  getAdminUser,
  
  // Admin operations (use admin session)
  adminGetUsers: async () => {
    const sessionId = getAdminSessionId();
    const response = await fetch(`${API_BASE}/admin.php?action=users&session_id=${sessionId}`);
    const data = await handleResponse(response);
    return data.data.map(api.fromServerUser);
  },
  
  adminGetArtworks: async (filters = {}) => {
    const sessionId = getAdminSessionId();
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.artType) params.append('artType', filters.artType);
    if (filters.region) params.append('region', filters.region);
    if (filters.period) params.append('period', filters.period);
    if ('status' in filters) params.append('status', filters.status);
    
    const queryString = params.toString();
    const url = `${API_BASE}/artworks.php${queryString ? '?' + queryString : ''}`;
    
    const response = await fetch(url);
    const data = await handleResponse(response);
    return data.data.map(api.fromServerArtwork);
  },
  
  adminGetReports: async (status = 'all') => {
    const sessionId = getAdminSessionId();
    const params = new URLSearchParams({ session_id: sessionId });
    if (status) params.append('status', status);
    
    const response = await fetch(`${API_BASE}/reports.php?${params.toString()}`);
    const data = await handleResponse(response);
    return data.data;
  },
  
  adminApproveArtwork: async (artworkId) => {
    const sessionId = getAdminSessionId();
    const response = await fetch(
      `${API_BASE}/admin.php?action=approve_artwork&session_id=${sessionId}`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ artwork_id: artworkId })
      }
    );
    const data = await handleResponse(response);
    return api.fromServerArtwork(data.data);
  },
  
  adminRejectArtwork: async (artworkId, reason = '') => {
    const sessionId = getAdminSessionId();
    const response = await fetch(
      `${API_BASE}/admin.php?action=reject_artwork&session_id=${sessionId}`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ artwork_id: artworkId, reason })
      }
    );
    const data = await handleResponse(response);
    return api.fromServerArtwork(data.data);
  },
  
  adminUpdateArtwork: async (id, artworkData, artistName = '') => {
    const sessionId = getAdminSessionId();
    const serverData = api.toServerArtwork(artworkData, artistName);
    
    const response = await fetch(
      `${API_BASE}/artworks.php?id=${encodeURIComponent(id)}&session_id=${sessionId}`,
      {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify(serverData)
      }
    );
    const data = await handleResponse(response);
    return api.fromServerArtwork(data.data);
  },
  
  adminUpdateArtworkStatus: async (id, status) => {
    const sessionId = getAdminSessionId();
    const response = await fetch(
      `${API_BASE}/artworks.php?id=${encodeURIComponent(id)}&session_id=${sessionId}`,
      {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify({ status })
      }
    );
    const data = await handleResponse(response);
    return api.fromServerArtwork(data.data);
  },
  
  adminUpdateUser: async (userId, userData) => {
    const sessionId = getAdminSessionId();
    const response = await fetch(
      `${API_BASE}/admin.php?action=update_user&session_id=${sessionId}`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ user_id: userId, ...userData })
      }
    );
    const data = await handleResponse(response);
    return api.fromServerUser(data.data);
  },
  
  adminSetUserStatus: async (userId, status) => {
    const sessionId = getAdminSessionId();
    const backendStatus = api.toServerStatus(status);
    
    const response = await fetch(
      `${API_BASE}/admin.php?action=set_user_status&session_id=${sessionId}`,
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ user_id: userId, status: backendStatus })
      }
    );
    const data = await handleResponse(response);
    return api.fromServerUser(data.data);
  },
  
  adminUpdateReport: async (reportId, updates) => {
    const sessionId = getAdminSessionId();
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
};
/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 35
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
