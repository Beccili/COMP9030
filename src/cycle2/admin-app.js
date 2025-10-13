// ===== Import Admin API =====
import adminAPI from './admin-api.js';

// ===== Constants =====
const TYPE_OPTIONS = ['Portrait', 'Painting', 'Installation', 'Sound Installation', 'Glass Installation', 'Cave Art', 'Mural', 'Gallery Piece', 'Rock Painting', 'Sculpture'];
const REGION_OPTIONS = ['All regions', 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'NT', 'TAS', 'ACT'];
const PERIOD_OPTIONS = ['ancient', 'modern'];

// ===== State =====
const state = {
  route: location.hash.slice(1) || 'dashboard',
  selection: { artworkId: null },
  editing: { artworkId: null, draft: null },
  filters: {
    search: '',
    artworks: { text: '', region: '', type: '', sensitive: '', period: '' },
    users: { text: '', role: '' }
  },
  data: {
    users: [],
    artworks: [],
    reports: [],
    reservations: [],
    audit: []
  }
};

// ===== Routes =====
const routes = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠', view: Dashboard },
  { key: 'artworks', label: 'Artworks', icon: '🖼️', view: Artworks },
  { key: 'users', label: 'Users', icon: '👥', view: Users },
  { key: 'reports', label: 'Reports', icon: '🚩', view: Reports },
];

function renderNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = routes.map(r => `<a href="#${r.key}" class="${state.route === r.key ? 'active' : ''}">${r.icon}<span>${r.label}</span></a>`).join('');
}
function routeTo(hash) { state.route = hash || 'dashboard'; render(); }
window.addEventListener('hashchange', () => routeTo(location.hash.slice(1)));

// ===== Utilities =====
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
const fmtDate = d => new Date(d).toLocaleDateString();
const safe = (v, fallback = '') => (v ?? fallback);
const toast = (msg) => { const el = document.createElement('div'); el.className = 'msg'; el.textContent = msg; $('#toast').appendChild(el); setTimeout(() => el.remove(), 2000); };
const openModal = (title, contentHTML) => { $('#modalTitle').textContent = title; $('#modalContent').innerHTML = contentHTML; $('#modal').classList.add('show'); }
const closeModal = () => $('#modal').classList.remove('show');
function focusMain() { setTimeout(() => $('#app').focus(), 0); }
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function userName(id) { const u = state.data.users.find(u => u.id === id); return u ? u.name : (id || 'Unknown'); }
function artTitle(id) { const a = state.data.artworks.find(a => a.id === id); return a ? (a.location ? `${a.title} (${a.location})` : a.title) : id; }
function short(s, n = 90) { if (!s) return ''; return s.length > n ? s.slice(0, n - 1) + '…' : s; }

// ===== Filter setters =====
let artFilterTimeout = null;
function setArtFilter(key, val) { 
  state.filters.artworks[key] = val;
  
  // Debounce text input to avoid losing focus
  if (key === 'text') {
    clearTimeout(artFilterTimeout);
    artFilterTimeout = setTimeout(() => {
      render();
    }, 300);
  } else {
    render();
  }
}
function setUserFilter(key, val) { state.filters.users[key] = val; render(); }

// ===== Views =====
function Dashboard() {
  const totalArtworks = state.data.artworks.length;
  const totalUsers = state.data.users.length;
  const openReports = state.data.reports.filter(r => r.status === 'open').length;
  return `
    <section class="section">
      <h2>Overview</h2>
      <div class="grid cols-3">
        ${Card('All Artworks', totalArtworks, 'info')}
        ${Card('All Users', totalUsers, 'info')}
        ${Card('Open Reports', openReports, openReports > 0 ? 'danger' : 'ok')}
      </div>
    </section>
  `;
}


function Artworks() {
  const f = state.filters.artworks;
  const text = (f.text || state.filters.search || '').toLowerCase();

  let items = state.data.artworks.filter(a => {
    const hay = [a.title, a.type, a.location, a.region, userName(a.artistId), (a.tags || []).join(' '), a.intro].join(' ').toLowerCase();
    return !text || hay.includes(text);
  }).filter(a => !f.region || f.region === 'All regions' || a.region === f.region)
    .filter(a => !f.type || a.type === f.type)
    .filter(a => !f.sensitive || String(a.sensitive) === f.sensitive)
    .filter(a => !f.period || a.period === f.period);

  const sel = null; // side detail panel removed; always use modal preview

  const rowsHtml = items.map(row => {
    const periodLabel = row.period ? (row.period[0].toUpperCase() + row.period.slice(1)) : '';
    const sensitiveCell = row.sensitive ? 'true' : 'false';
    const addressCell = row.sensitive ? '<em>Hidden (sensitive)</em>' : (safe(row.address, '-'));
    const artworkImagesCell = row.artworkImages
      ? `${row.artworkImages.length} image${row.artworkImages.length !== 1 ? 's' : ''}`
      : (row.artworkImage ? '1 image' : '-');
    return `<tr>
      <td><a href="#" onclick="previewArtwork('${row.id}');return false;">${row.title}</a></td>
      <td>${row.artist || userName(row.artistId)}</td>
      <td>${row.type}</td>
      <td>${periodLabel}</td>
      <td>${row.region}</td>
      <td>${sensitiveCell}</td>
      <td>${addressCell}</td>
      <td>${artworkImagesCell}</td>
      <td>${RowActions(row)}</td>
    </tr>`;
  }).join('');

  return `
    <section class="section">
      <div>
        <div style="overflow-x: auto;">
          <table role="table" style="min-width: 800px;">
            <thead>
              <tr class="header-with-filters">
                <th>
                  <div class="th-inline">
                    <span class="th-label">Title</span>
                    <input class="form-control th-control" placeholder="Search…" value="${safe(f.text, '')}" oninput="setArtFilter('text', this.value)" />
                  </div>
                </th>
                <th><span class="th-label">Artist</span></th>
                <th>
                  <div class="th-inline">
                    <span class="th-label">Type</span>
                    <select class="form-control th-control" onchange="setArtFilter('type', this.value)">
                      <option value="">All</option>
                      ${TYPE_OPTIONS.map(t => `<option ${f.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                  </div>
                </th>
                <th>
                  <div class="th-inline">
                    <span class="th-label">Period</span>
                    <select class="form-control th-control" onchange="setArtFilter('period', this.value)">
                      <option value="">All</option>
                      <option value="Ancient" ${f.period === 'Ancient' ? 'selected' : ''}>Ancient</option>
                      <option value="Contemporary" ${f.period === 'Contemporary' ? 'selected' : ''}>Contemporary</option>
                    </select>
                  </div>
                </th>
                <th>
                  <div class="th-inline">
                    <span class="th-label">Region</span>
                    <select class="form-control th-control" onchange="setArtFilter('region', this.value)">
                      ${REGION_OPTIONS.map(r => `<option ${f.region === r ? 'selected' : ''}>${r}</option>`).join('')}
                    </select>
                  </div>
                </th>
                <th>
                  <div class="th-inline">
                    <span class="th-label">Sensitive</span>
                    <select class="form-control th-control" onchange="setArtFilter('sensitive', this.value)">
                      <option value="">All</option>
                      <option value="true" ${f.sensitive === 'true' ? 'selected' : ''}>true</option>
                      <option value="false" ${f.sensitive === 'false' ? 'selected' : ''}>false</option>
                    </select>
                  </div>
                </th>
                <th><span class="th-label">Address</span></th>
                <th><span class="th-label">Images</span></th>
                <th style="text-align:right"><button class="btn" onclick="newArtwork()">+ New</button></th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="9"><div class="empty">No data</div></td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function Users() {
  const f = state.filters.users;
  const text = (f.text || state.filters.search || '').toLowerCase();
  const items = state.data.users.filter(u => {
    const hay = [u.name, u.email, u.role, u.region].join(' ').toLowerCase();
    return (!text || hay.includes(text)) && (!f.role || u.role === f.role);
  });
  return `
    <section class="section">
      <div class="toolbar">
        <input id="filterUser" placeholder="Search name/email" oninput="setUserFilter('text', this.value)" />
        <select id="roleUser" onchange="setUserFilter('role', this.value)">
          <option value="">All roles</option>
          <option ${f.role === 'artist' ? 'selected' : ''}>artist</option>
          <option ${f.role === 'user' ? 'selected' : ''}>user</option>
          <option ${f.role === 'admin' ? 'selected' : ''}>admin</option>
        </select>
        <button onclick="newUser()">Invite user</button>
      </div>
      ${Table({
    columns: [
      { key: 'name', label: 'Full Name', render: (_, row) => `<a href="#" onclick="openUser('${row.id}');return false;">${row.name}</a>` },
      { key: 'email', label: 'Contact Email' },
      { key: 'role', label: 'Role', render: (_, row) => roleSelect(row) },
      { key: 'region', label: 'Region / State', render: r => safe(r, '-') },
      { key: 'nation', label: 'Nation / Language Group', render: r => safe(r, '-') },
      { key: 'bio', label: 'Bio', render: b => b ? (b.length > 50 ? b.substring(0, 50) + '...' : b) : '-' },
      // ✅ Newly added Status column (toggle active/inactive with modal on success)
      { key: 'status', label: 'Status', render: (_, row) => statusSelect(row) },
      {
        key: 'actions', label: '', render: (_, row) => `<div class=actions>
              <button class="btn" onclick="toggleUser('${row.id}')">${row.status === 'active' ? 'Deactivate' : 'Approve'}</button>
              <button class="btn danger" onclick="removeUser('${row.id}')">Remove</button>
            </div>` }
    ],
    rows: items
  })}
    </section>
  `;
}

function Reports() {
  const items = state.data.reports;
  return `
    <section class="section">
      <h2>Reports & Cultural Safety Flags</h2>
      ${Table({
    columns: [
      { key: 'artwork', label: 'Artwork', render: id => artTitle(id) },
      { key: 'reason', label: 'Reason' },
      { key: 'detail', label: 'Additional Details' },
      { key: 'email', label: 'Reporter Email', render: e => safe(e, 'Anonymous') },
      { key: 'created', label: 'Date', render: d => fmtDate(d) },
      { key: 'status', label: 'Status', render: s => s === 'open' ? '<span class="pill warn">open</span>' : '<span class="pill ok">closed</span>' },
      { key: 'decision', label: 'Decision', render: d => d ? `<span class="pill ${d === 'approved' ? 'ok' : 'danger'}">${d}</span>` : '' },
      {
        key: 'actions', label: '', render: (_, row) => row.status === 'open' ? `<div class="actions">
              <button class="btn ok" onclick="reviewReport('${row.id}','approved')">Approve</button>
              <button class="btn danger" onclick="reviewReport('${row.id}','disapproved')">Disapprove</button>
            </div>` : ''
      }
    ],
    rows: items
  })}
    </section>
  `;
}

// merged Category page


// ===== UI helpers =====
function Card(title, value, tone = 'info') {
  return `<div class="section" style="background:var(--card)">
    <div style="color:#a1a1aa;font-size:12px">${title}</div>
    <div style="font-size:28px;font-weight:800">${value}</div>
    <span class="pill ${tone}">${tone}</span>
  </div>`
}
function statusPill(v) { const map = { pending: 'warn', approved: 'ok', flagged: 'danger', rejected: 'danger' }; return `<span class="pill ${map[v] || 'info'}">${v}</span>` }
function Table({ columns, rows }) {
  if (!rows.length) return `<div class="empty">No data</div>`;
  return `<table role="table">
    <thead><tr>${columns.map(c => `<th scope="col">${c.label}</th>`).join('')}</tr></thead>
    <tbody>
      ${rows.map(r => `<tr>${columns.map(c => `<td>${(c.render ? c.render(r[c.key], r) : r[c.key]) ?? ''}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>`
}
function RowActions(row) {
  const actions = [`<button class="btn" onclick="window.previewArtwork('${row.id}')">Preview</button>`];
  
  // Show Approve button only for pending/flagged artworks
  if (row.status === 'pending' || row.status === 'flagged') {
    actions.push(`<button class="btn ok" onclick="window.approve('${row.id}')">Approve</button>`);
  }
  
  // Show Flag button only for approved/pending artworks
  if (row.status === 'approved' || row.status === 'pending') {
    actions.push(`<button class="btn warn" onclick="window.flag('${row.id}')">Flag</button>`);
  }
  
  // Show Reject button only for pending/flagged artworks
  if (row.status === 'pending' || row.status === 'flagged') {
    actions.push(`<button class="btn danger" onclick="window.reject('${row.id}')">Reject</button>`);
  }
  
  return `<div class="actions">${actions.join('')}</div>`;
}
function roleSelect(row) {
  return `<select class="form-control" onchange="changeRole('${row.id}', this.value)">
    ${['artist', 'user', 'admin'].map(r => `<option value="${r}" ${row.role === r ? 'selected' : ''}>${r}</option>`).join('')}
  </select>`
}

function statusSelect(row) {
  // Frontend uses 'active' which maps to backend 'approved'
  const statuses = ['active', 'pending', 'inactive'];
  const statusLabels = { 'active': 'approved', 'pending': 'pending', 'inactive': 'inactive' };
  return `<select class="form-control" onchange="changeUserStatus('${row.id}', this.value)">
    ${statuses.map(s => `<option value="${s}" ${row.status === s ? 'selected' : ''}>${statusLabels[s]}</option>`).join('')}
  </select>`
}

// ===== Artwork detail panel with Save/Cancel edit mode =====
function ArtworkDetail(a) {
  const isEditing = state.editing.artworkId === a.id;
  if (!isEditing) {
    return `
      <h3 class="title-xl">Artwork Details</h3>
      <div class="small-label">ID: ${a.id}</div>
      <div style="margin-top:8px"><strong>Region:</strong> ${safe(a.region, '-')}</div>
      <div><strong>Sensitive:</strong> ${a.sensitive}</div>
      <div><strong>Address:</strong> ${a.sensitive ? '(hidden)' : safe(a.address, '-')}</div>
      <div><strong>Artist:</strong> ${userName(a.artistId)}</div>
      <div><strong>Art Type:</strong> ${a.type}</div>
      <div><strong>Period:</strong> ${a.period}</div>
      <label style="display:block;margin-top:8px">Description (Text)
        <textarea name="intro" rows="6" class="form-control" style="width:100%"
          onchange="updateArtworkField('${a.id}','intro', this.value)">${safe(a.intro)}</textarea>
      </label>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
        <button class="btn" type="button" onclick="previewArtwork('${a.id}')">Open modal preview</button>
        <button class="btn ok" type="button" onclick="startEditArtwork('${a.id}')">Edit</button>
      </div>
    `;
  }
  const d = state.editing.draft;
  const artistOptions = state.data.users.filter(u => u.role === 'artist').map(u => `<option value="${u.id}" ${d.artistId === u.id ? 'selected' : ''}>${u.name}</option>`).join('');
  return `
    <h3 class="title-xl">Edit Artwork</h3>
    <form id="artDetailForm">
      <div class="grid cols-2" style="margin-top:8px">
        <label>Region
          <select name="region" class="form-control" onchange="updateDraft('region', this.value)">
            ${REGION_OPTIONS.map(r => `<option value="${r}" ${d.region === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </label>
        <label>Sensitive (boolean)
          <select name="sensitive" class="form-control" onchange="updateDraft('sensitive', this.value)">
            <option value="true" ${d.sensitive ? 'selected' : ''}>true</option>
            <option value="false" ${!d.sensitive ? 'selected' : ''}>false</option>
          </select>
        </label>
      </div>

      <label style="display:block;margin-top:8px">Specific address (shown when not sensitive)
        <input name="address" class="form-control" ${d.sensitive ? 'disabled' : ''} value="${safe(d.address)}" onchange="updateDraft('address', this.value)" placeholder="Street / venue / coordinates" />
      </label>

      <div class="grid cols-2" style="margin-top:8px">
        <label>Artist
          <select name="artistId" class="form-control" onchange="updateDraft('artistId', this.value)">${artistOptions}</select>
        </label>
        <label>Art Type
          <select name="type" class="form-control" onchange="updateDraft('type', this.value)">
            ${TYPE_OPTIONS.map(t => `<option ${d.type === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </label>
      </div>

      <div class="grid cols-2" style="margin-top:8px">
        <label>Period
          <select name="period" class="form-control" onchange="updateDraft('period', this.value)">
            ${PERIOD_OPTIONS.map(p => `<option value="${p}" ${d.period === p ? 'selected' : ''}>${p[0].toUpperCase() + p.slice(1)}</option>`).join('')}
          </select>
        </label>
        <label>Date
          <input type="date" name="date" class="form-control" value="${d.date}" onchange="updateDraft('date', this.value)" />
        </label>
      </div>

      <label style="display:block;margin-top:8px">Description (作品的介绍)
        <textarea name="intro" rows="5" class="form-control" style="width:100%" onchange="updateDraft('intro', this.value)">${safe(d.intro)}</textarea>
      </label>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
        <button class="btn" type="button" onclick="cancelArtworkEdit()">Cancel</button>
        <button class="btn ok" type="button" onclick="saveArtworkEdit()">Save</button>
      </div>
    </form>
  `;
}

// --- Actions ---
function log(action, target, meta = '') { state.data.audit.push({ ts: Date.now(), actor: 'u_admin1', action, target, meta }); }

async function approve(id) { 
  const a = state.data.artworks.find(x => x.id === id); 
  if (!a) return; 
  try {
    await adminAPI.adminApproveArtwork(id);
    a.status = 'approved'; 
    log('approve_artwork', id, a.title); 
    toast('Approved: ' + a.title); 
    render();
  } catch (error) {
    console.error('Approve error:', error);
    toast('Error approving artwork: ' + error.message);
  }
}

async function reject(id) { 
  const a = state.data.artworks.find(x => x.id === id); 
  if (!a) return; 
  try {
    await adminAPI.adminRejectArtwork(id, 'Rejected by admin');
    a.status = 'rejected'; 
    log('reject_artwork', id, a.title); 
    toast('Rejected: ' + a.title); 
    render();
  } catch (error) {
    console.error('Reject error:', error);
    toast('Error rejecting artwork: ' + error.message);
  }
}

async function flag(id) { 
  const a = state.data.artworks.find(x => x.id === id); 
  if (!a) return; 
  try {
    await adminAPI.adminUpdateArtworkStatus(id, 'flagged');
    a.status = 'flagged'; 
    log('flag_artwork', id, a.title); 
    toast('Flagged: ' + a.title); 
    render();
  } catch (error) {
    console.error('Flag error:', error);
    toast('Error flagging artwork: ' + error.message);
  }
}

function selectArtwork(id) {
  // update selection and re-render UI
  state.selection.artworkId = id;
  state.editing.artworkId = null;
  state.editing.draft = null;
  render();
  // After the new DOM is painted, ensure the detail panel is visible
  setTimeout(() => {
    const panel = document.getElementById('artDetailPanel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }, 0);
}
function previewArtwork(id) {
  const a = state.data.artworks.find(x => x.id === id);
  if (!a) return;
  openModal('Preview – ' + a.title, `
    <div><strong>Art Type:</strong> ${a.type}</div>
    <div><strong>Region:</strong> ${safe(a.region, '-')} | <strong>Sensitive:</strong> ${a.sensitive}</div>
    <div><strong>Address:</strong> ${a.sensitive ? '(hidden)' : safe(a.address, '-')}</div>
    <div><strong>Artist:</strong> ${userName(a.artistId)}</div>
    <div><strong>Period:</strong> ${a.period}</div>
    <div><strong>Description:</strong> ${safe(a.intro, '')}</div>
  `);
}

// Immediate update for single field (used by Description in view mode)
async function updateArtworkField(id, field, value) {
  const a = state.data.artworks.find(x => x.id === id); if (!a) return;
  if (field === 'sensitive') { a.sensitive = (value === 'true' || value === true); if (a.sensitive) { a.address = ''; } }
  else { a[field] = value; }
  
  try {
    const artistName = userName(a.artistId);
    await adminAPI.adminUpdateArtwork(id, a, artistName);
    log('update_artwork_' + field, id, String(value));
    toast('Saved'); 
    render();
  } catch (error) {
    console.error('Update error:', error);
    toast('Error saving: ' + error.message);
  }
}

// Edit mode helpers
function startEditArtwork(id) {
  const a = state.data.artworks.find(x => x.id === id); if (!a) return;
  state.editing.artworkId = id;
  state.editing.draft = deepClone(a);
  render();
}
function updateDraft(field, value) {
  const d = state.editing.draft; if (!d) return;
  if (field === 'sensitive') { d.sensitive = (value === 'true' || value === true); if (d.sensitive) { d.address = ''; } }
  else { d[field] = value; }
  if (field === 'sensitive') render();
}
async function saveArtworkEdit() {
  const id = state.editing.artworkId; const d = state.editing.draft;
  if (!id || !d) return;
  const a = state.data.artworks.find(x => x.id === id); if (!a) return;
  
  try {
    const artistName = userName(d.artistId);
    await adminAPI.adminUpdateArtwork(id, d, artistName);
    ['region', 'sensitive', 'address', 'artistId', 'type', 'period', 'date', 'intro'].forEach(k => a[k] = d[k]);
    log('save_artwork_edit', id, JSON.stringify({ region: a.region, sensitive: a.sensitive }));
    state.editing.artworkId = null; state.editing.draft = null;
    toast('Changes saved'); 
    render();
  } catch (error) {
    console.error('Save error:', error);
    toast('Error saving changes: ' + error.message);
  }
}
function cancelArtworkEdit() { state.editing.artworkId = null; state.editing.draft = null; toast('Changes discarded'); render(); }

function reviewReport(id, decision) {
  const r = state.data.reports.find(x => x.id === id); if (!r) return;
  openModal((decision === 'approved' ? 'Approve' : 'Disapprove') + ' Report', `
    <form id="reportReviewForm">
      <div class="empty" style="text-align:left;margin-bottom:8px">Please provide the rationale for this decision. This will be stored in the audit log.</div>
      <label class="visually-hidden" for="reason">Reason</label>
      <textarea id="reason" name="reason" rows="5" placeholder="Reason / cultural safety notes..." class="form-control" style="width:100%"></textarea>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
        <button type="button" class="btn" data-close>Cancel</button>
        <button class="btn ${decision === 'approved' ? 'ok' : 'danger'}" type="submit">${decision === 'approved' ? 'Approve' : 'Disapprove'}</button>
      </div>
    </form>
  `);

  $('#reportReviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const reason = new FormData(e.target).get('reason') || '';
    try {
      await applyReportDecision(id, decision, reason);
      closeModal(); 
      toast(`Report ${decision}`); 
      render();
    } catch (error) {
      toast('Failed to update report: ' + error.message);
    }
  });
}
async function applyReportDecision(id, decision, note) {
  const r = state.data.reports.find(x => x.id === id); if (!r) return;
  try {
    await adminAPI.adminUpdateReport(id, { status: 'closed', decision, note });
    r.status = 'closed'; r.decision = decision; r.note = note;
    log('review_report', id, JSON.stringify({ decision, note }));
  } catch (error) {
    console.error('Failed to update report:', error);
    throw error;
  }
}

function openUser(id) {
  const u = state.data.users.find(x => x.id === id);
  if (!u) return;

  const roleSelectHTML = `<label>Role
    <select name="role" class="form-control">
      ${['artist', 'user', 'admin'].map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${r}</option>`).join('')}
    </select>
  </label>`;

  const regionOptions = REGION_OPTIONS.filter(x => x !== 'All regions').map(r => `<option value="${r}" ${u.region === r ? 'selected' : ''}>${r}</option>`).join('');

  const artistWorks = state.data.artworks.filter(a => a.artistId === u.id);
  const worksHTML = u.role === 'artist' ? `
    <div class="section" style="margin-top:12px">
      <h4 style="margin:0 0 8px 0">Artist works</h4>
      ${Table({
    columns: [
      { key: 'title', label: 'Title' },
      {
        key: 'period', label: 'Period', render: (p, row) => `<select class="form-control" onchange="changeArtworkPeriod('${row.id}', this.value)">
            ${PERIOD_OPTIONS.map(x => `<option value="${x}" ${row.period === x ? 'selected' : ''}>${x[0].toUpperCase() + x.slice(1)}</option>`).join('')}
          </select>` },
      { key: 'status', label: 'Status', render: s => statusPill(s) }
    ],
    rows: artistWorks
  })}
    </div>` : '';

  openModal('User Profile – ' + (u.name || u.id), `
    <form id="userDetailForm">
      <div class="grid cols-2">
        <label>Full Name
          <input name="name" value="${safe(u.name)}" required class="form-control"/>
        </label>
        <label>Contact Email
          <input type="email" name="email" value="${safe(u.email)}" required class="form-control"/>
        </label>
      </div>

      <div class="grid cols-2" style="margin-top:8px">
        ${roleSelectHTML}
        <label>Region / State
          <select name="region" class="form-control">
            ${regionOptions}
          </select>
        </label>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
        <button type="button" class="btn" data-close>Cancel</button>
        <button class="btn ok" type="submit">Save</button>
      </div>
    </form>
    ${worksHTML}
  `);

  $('#userDetailForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const prevRole = u.role;
    u.name = fd.get('name');
    u.email = fd.get('email');
    u.role = fd.get('role');
    u.region = fd.get('region');
    if (prevRole !== u.role) log('change_user_role', id, `${prevRole} -> ${u.role}`);
    log('update_user_profile', id, JSON.stringify({ region: u.region }));
    closeModal(); toast('User updated'); render();
  });
}

function newUser() {
  const regionOptions = REGION_OPTIONS.filter(x => x !== 'All regions').map(r => `<option value="${r}">${r}</option>`).join('');
  openModal('Invite User', `
    <form id="userForm">
      <div class="grid cols-2">
        <label>Full Name
          <input name="name" required class="form-control"/>
        </label>
        <label>Contact Email
          <input name="email" required type="email" class="form-control"/>
        </label>
      </div>
      <div class="grid cols-2" style="margin-top:8px">
        <label>Role
          <select name="role" class="form-control">
            <option>artist</option>
            <option>user</option>
            <option>admin</option>
          </select>
        </label>
        <label>Region / State
          <select name="region" class="form-control">
            ${regionOptions}
          </select>
        </label>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
        <button type="button" class="btn" onclick="closeModal()">Cancel</button>
        <button class="btn ok" type="submit">Invite</button>
      </div>
    </form>
  `);
  $('#userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const id = 'u_' + (Math.random() * 1e5 | 0);
    state.data.users.push({
      id,
      name: fd.get('name'),
      email: fd.get('email'),
      role: fd.get('role'),
      region: fd.get('region') || '',
      status: 'active',
      created: new Date().toISOString().slice(0, 10)
    });
    log('invite_user', id);
    closeModal(); toast('Invitation sent'); render();
  });
}

async function toggleUser(id) { 
  const u = state.data.users.find(u => u.id === id); 
  if (!u) return; 
  const newStatus = u.status === 'active' ? 'inactive' : 'active';
  try {
    await adminAPI.adminSetUserStatus(id, newStatus);
    u.status = newStatus; 
    log('toggle_user', id, u.status); 
    toast('User ' + (u.status === 'active' ? 'approved' : 'deactivated')); 
    render();
  } catch (error) {
    console.error('Toggle user error:', error);
    toast('Error updating user status: ' + error.message);
  }
}

function removeUser(id) { 
  const idx = state.data.users.findIndex(u => u.id === id); 
  if (idx < 0) return; 
  const name = state.data.users[idx].name; 
  state.data.users.splice(idx, 1); 
  log('remove_user', id, name); 
  toast('Removed ' + name); 
  render(); 
}

async function changeRole(id, newRole) { 
  const u = state.data.users.find(x => x.id === id); 
  if (!u) return; 
  const prev = u.role; 
  try {
    await adminAPI.adminUpdateUser(id, { role: newRole });
    u.role = newRole; 
    log('change_user_role', id, `${prev} -> ${newRole}`); 
    toast('Role updated'); 
    render();
  } catch (error) {
    console.error('Change role error:', error);
    toast('Error updating role: ' + error.message);
  }
}

async function changeUserStatus(id, newStatus) { 
  const u = state.data.users.find(x => x.id === id); 
  if (!u) return; 
  const prev = u.status; 
  try {
    await adminAPI.adminSetUserStatus(id, newStatus);
    u.status = newStatus; 
    log('change_user_status', id, `${prev} -> ${newStatus}`); 
    const statusPillClass = newStatus === 'active' ? 'ok' : (newStatus === 'pending' ? 'warn' : 'danger');
    const displayStatus = newStatus === 'active' ? 'approved' : newStatus;
    openModal('Status updated', `<div>User <strong>${u.name}</strong> is now <span class=\"pill ${statusPillClass}\">${displayStatus}</span>.</div>`); 
    render();
  } catch (error) {
    console.error('Change status error:', error);
    toast('Error updating status: ' + error.message);
  }
}

function changeArtworkPeriod(artId, period) { 
  const a = state.data.artworks.find(x => x.id === artId); 
  if (!a) return; 
  a.period = period; 
  log('update_artwork_period', artId, period); 
  toast('Period updated'); 
  render(); 
}

// ===== Data Initialization =====
async function initializeData() {
  try {
    // Check if admin is logged in
    const sessionId = adminAPI.getAdminSessionId();
    if (!sessionId) {
      console.warn('No admin session found, using test data');
      return;
    }

    // Verify admin session and get user
    const sessionData = await adminAPI.verifyAdminSession();
    const user = sessionData.user;
    
    if (user.role !== 'admin') {
      alert('Admin access required. Please use admin login.');
      window.location.href = 'admin-login.html';
      return;
    }

    // Load data from backend using admin session
    // Load users
    const users = await adminAPI.adminGetUsers();
    state.data.users = users;
    
    // Load all artworks (including pending for admin)
    const allArtworks = await adminAPI.adminGetArtworks({ status: 'all' });
    state.data.artworks = allArtworks;
    
    // Load reports
    const reports = await adminAPI.adminGetReports('all');
    state.data.reports = reports;
    
    // Update header with admin info
    const adminNameEl = document.getElementById('admin-user-name');
    if (adminNameEl) {
      adminNameEl.textContent = user.name || user.email || user.username;
    }
    
    toast('Data loaded from server');
    
    render();
  } catch (error) {
    console.error('Data initialization error:', error);
    console.warn('Using test data as fallback');
    toast('Using test data (backend not available)');
    render();
  }
}

// ===== Render & Events =====
function render() {
  renderNav();
  const route = routes.find(r => r.key === state.route) || routes[0];
  $('#app').innerHTML = route.view();
  document.title = `IAA Admin – ${route.label}`;
  focusMain();
}
$('#globalSearch').addEventListener('input', (e) => { state.filters.search = e.target.value.toLowerCase(); render(); });
document.addEventListener('click', (e) => { if (e.target.matches('[data-close]')) closeModal(); if (e.target.id === 'modal') closeModal(); });

// Initialize app with backend data
initializeData();

// ===== Export functions to global scope for onclick handlers =====
window.approve = approve;
window.reject = reject;
window.flag = flag;
window.previewArtwork = previewArtwork;
window.selectArtwork = selectArtwork;
window.startEditArtwork = startEditArtwork;
window.updateDraft = updateDraft;
window.saveArtworkEdit = saveArtworkEdit;
window.cancelArtworkEdit = cancelArtworkEdit;
window.updateArtworkField = updateArtworkField;
window.reviewReport = reviewReport;
window.openUser = openUser;
window.newUser = newUser;
window.toggleUser = toggleUser;
window.removeUser = removeUser;
window.changeRole = changeRole;
window.changeUserStatus = changeUserStatus;
window.changeArtworkPeriod = changeArtworkPeriod;
window.setArtFilter = setArtFilter;
window.setUserFilter = setUserFilter;
window.closeModal = closeModal;

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 36
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
