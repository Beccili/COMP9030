// ===== Boot log =====
console.log("main.js loaded");

// ===== Config =====
const API_BASE = '../api/'; 
let sessionId = null;

// ===== Tiny helpers =====
const $ = (sel) => document.querySelector(sel);
function toast(msg, type = 'info') {
  console[type === 'error' ? 'error' : 'log'](`[toast:${type}] ${msg}`);
  const el = $('#loginState');
  if (el) el.textContent = msg;
}
const getSavedSession = () => localStorage.getItem('admin_session');
function saveSession(id) {
  sessionId = id;
  localStorage.setItem('admin_session', id);
  const cu = $('#currentUser');
  if (cu) cu.textContent = 'admin';
}
function clearSession() {
  sessionId = null;
  localStorage.removeItem('admin_session');
  const cu = $('#currentUser');
  if (cu) cu.textContent = 'not logged in';
}

// ===== Core fetchers =====

async function apiGet(pathWithQuery) {
  const sid = sessionId || getSavedSession();
  if (!sid) throw new Error('Admin login required');
  const url = `${API_BASE}${pathWithQuery}&session_id=${encodeURIComponent(sid)}`;
  const res = await fetch(url);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { success: false, message: text || 'Invalid JSON' }; }
  if (!res.ok || json.success === false) throw new Error(json.message || `HTTP ${res.status}`);
  return json;
}


async function apiDo(pathWithQuery) {
  const sid = sessionId || localStorage.getItem('admin_session');
  if (!sid) throw new Error('Admin login required');


  const idMatch1 = pathWithQuery.match(/[?&]id=([^&]+)/);
  const idMatch2 = pathWithQuery.match(/[?&]artwork_id=([^&]+)/);
  const artId = idMatch2 ? decodeURIComponent(idMatch2[1]) :
               idMatch1 ? decodeURIComponent(idMatch1[1]) : null;

  const actionMatch = pathWithQuery.match(/action=([^&]+)/);
  const action = actionMatch ? decodeURIComponent(actionMatch[1]) : null;


  const postUrl = `${API_BASE}admin.php?action=${encodeURIComponent(action)}&session_id=${encodeURIComponent(sid)}`;
  let res = await fetch(postUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    
    body: JSON.stringify({ id: artId, artwork_id: artId })
  });
  let txt = await res.text();
  let json;
  try { json = JSON.parse(txt); } catch { json = { success:false, message:txt || 'Invalid JSON' }; }
  if (res.ok && json.success !== false) return json;

 
  const getUrl = `${API_BASE}${pathWithQuery}&session_id=${encodeURIComponent(sid)}`;
  res = await fetch(getUrl);
  txt = await res.text();
  try { json = JSON.parse(txt); } catch { json = { success:false, message:txt || 'Invalid JSON' }; }
  if (!res.ok || json.success === false) throw new Error(json.message || `HTTP ${res.status}`);
  return json;
}

// ===== Auth =====
async function doLogin() {
  const u = $('#loginUsername')?.value?.trim() || '';
  const p = $('#loginPassword')?.value || '';
  try {
    toast('Logging in…');
    const res = await fetch(API_BASE + 'auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    const json = await res.json();
    console.log('login response:', json);
    const sid = json.session_id || json?.data?.session_id;
    if (json.success && sid) {
      saveSession(sid);
      toast('Login successful');
      await loadAll();
    } else {
      throw new Error(json.message || 'Login failed');
    }
  } catch (e) {
    toast(e.message || 'Login failed', 'error');
  }
}

async function doLogout() {
  clearSession();
  toast('Logged out');
 
  $('#totalUsers').textContent = '–';
  $('#pendingArtworks').textContent = '–';
  $('#approvedArtworks').textContent = '–';
  $('#userTable tbody').innerHTML = '';
  $('#artworkTable tbody').innerHTML = '';
}

// ===== Data loaders =====
async function loadStats() {
  const r = await apiGet('admin.php?action=stats');
  const d = r.data || {};
  $('#totalUsers').textContent = d.total_users ?? '0';
  $('#pendingArtworks').textContent = d.pending_artworks ?? '0';
  $('#approvedArtworks').textContent = d.approved_artworks ?? '0';
}

async function loadUsers() {
  const r = await apiGet('admin.php?action=users');
  const list = r.data || [];
  const tbody = $('#userTable tbody');
  tbody.innerHTML = '';
  list.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.username ?? ''}</td>
      <td>${u.email ?? ''}</td>
      <td>${u.role ?? ''}</td>
      <td>${u.status ?? ''}</td>
      <td>${u.created_at ?? ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadPendingArtworks() {
  const r = await apiGet('admin.php?action=pending_artworks');
  const list = r.data || [];
  const tbody = $('#artworkTable tbody');
  tbody.innerHTML = '';
  list.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.id ?? ''}</td>
      <td>${a.title ?? ''}</td>
      <td>${a.artist ?? ''}</td>
      <td><span class="status ${a.status || ''}">${a.status ?? ''}</span></td>
      <td class="row-actions">
        <button class="ok"     data-act="approve" data-id="${a.id}">Approve</button>
        <button class="ghost"  data-act="flag"    data-id="${a.id}">Flag</button>
        <button class="danger" data-act="reject"  data-id="${a.id}">Reject</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


async function loadAll() {
  await Promise.allSettled([loadStats(), loadUsers(), loadPendingArtworks()]);
}

// ===== Global wiring =====
document.addEventListener('DOMContentLoaded', () => {
  // 顶部按钮
  $('#loginBtn')?.addEventListener('click', doLogin);
  $('#logoutBtn')?.addEventListener('click', doLogout);
  $('#refreshUsers')?.addEventListener('click', loadUsers);
  $('#refreshPending')?.addEventListener('click', loadPendingArtworks);

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;

    const id = btn.dataset.id;
    const act = btn.dataset.act;
    const endpoints = {
  approve: `admin.php?action=approve_artwork&artwork_id=${encodeURIComponent(id)}`,
  flag:    `admin.php?action=flag_artwork&artwork_id=${encodeURIComponent(id)}`,
  reject:  `admin.php?action=reject_artwork&artwork_id=${encodeURIComponent(id)}`
};

    try {
      btn.disabled = true;
      console.log('[ACTION]', act, id);
      const resp = await apiDo(endpoints[act]); // GET→失败再POST
      toast(resp.message || `${act} success`);
      await Promise.allSettled([loadStats(), loadPendingArtworks()]);
    } catch (err) {
      console.error(err);
      toast(err.message || `${act} failed`, 'error');
    } finally {
      btn.disabled = false;
    }
  });

 
  const sid = getSavedSession();
  if (sid) {
    saveSession(sid);
    loadAll().catch(e => {
      console.error(e);
      toast('Session invalid, please login again', 'error');
      clearSession();
    });
  } else {
    toast('Admin login required', 'error');
  }
});

