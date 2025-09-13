// ===== Constants =====
const TYPE_OPTIONS = ['Portrait','Painting','Installation','Sound Installation','Glass Installation','Cave Art','Mural','Gallery Piece','Rock Painting','Sculpture'];
const REGION_OPTIONS = ['All regions','NSW','VIC','QLD','SA','WA','NT','TAS','ACT'];
const PERIOD_OPTIONS = ['ancient','modern'];

// ===== State =====
const state = {
  route: location.hash.slice(1) || 'dashboard',
  selection: { artworkId: null },
  editing: { artworkId: null, draft: null },
  filters: {
    search: '',
    artworks: { text:'', region:'', type:'', sensitive:'', period:'' },
    users: { text:'', role:'' },
    queue: { text:'' }
  },
  data: {
    users: [
      { id:'u_vincent', name:'Vincent Namatjira', email:'vincent@iap.demo', role:'artist', region:'SA', status:'active', created:'2025-09-05', gender:'male', phone:'', dob:'1983-01-01' },
      { id:'u_kaylene', name:'Kaylene Whiskey', email:'kaylene@iap.demo', role:'artist', region:'SA', status:'active', created:'2025-09-05', gender:'female', phone:'', dob:'1976-01-01' },
      { id:'u_tony', name:'Tony Albert', email:'tony@iap.demo', role:'artist', region:'QLD', status:'active', created:'2025-09-05', gender:'male', phone:'', dob:'1981-01-01' },
      { id:'u_megan', name:'Megan Cope', email:'megan@iap.demo', role:'artist', region:'QLD', status:'active', created:'2025-09-05', gender:'female', phone:'', dob:'1982-01-01' },
      { id:'u_yhonnie', name:'Yhonnie Scarce', email:'yhonnie@iap.demo', role:'artist', region:'SA', status:'active', created:'2025-09-05', gender:'female', phone:'', dob:'1973-01-01' },
      { id:'u_user1', name:'Alex Guest', email:'alex@iap.demo', role:'user', region:'VIC', status:'active', created:'2025-09-06', gender:'', phone:'', dob:'' },
      { id:'u_admin1', name:'Site Admin', email:'admin@iap.demo', role:'admin', region:'SA', status:'active', created:'2025-09-01', gender:'', phone:'', dob:'' },
    ],
    artworks: [
      { id:'a_2001', title:'Karlu Karlu petroglyph', theme:'Ancestral stories', date:'2025-08-31', nature:'rock art', type:'Rock Painting', country:'AU', location:'Tennant Creek, NT', submitter:'u_vincent', artistId:'u_vincent', status:'pending', tags:['rock','ancestral'], booth:'B12', submitted:'2025-08-31', region:'NT', sensitive:true, address:'', period:'ancient', intro:'Petroglyph site associated with ancestral stories.' },
      { id:'a_2002', title:'Ngarrindjeri weaving – basket', theme:'Weaving tradition', date:'2025-08-20', nature:'weaving', type:'Sculpture', country:'AU', location:'Adelaide SA museum', submitter:'u_kaylene', artistId:'u_kaylene', status:'approved', tags:['weaving','museum'], booth:'A03', submitted:'2025-08-20', region:'SA', sensitive:false, address:'North Terrace, Adelaide SA', period:'modern', intro:'Basket weaving representing living cultural practice.' },
      { id:'a_2003', title:'Street mural – Kaurna welcome', theme:'Welcome to Country', date:'2025-08-22', nature:'mural', type:'Mural', country:'AU', location:'Rundle St, Adelaide', submitter:'u_tony', artistId:'u_tony', status:'flagged', tags:['public','contemporary'], booth:'Outdoor-07', submitted:'2025-08-22', region:'SA', sensitive:false, address:'Rundle St, Adelaide SA', period:'modern', intro:'Public mural acknowledging Kaurna Country.' },
      { id:'a_vincent_2020', title:'Stand Strong for Who You Are', theme:'Identity & history', date:'2020-01-01', nature:'painting', type:'Portrait', country:'AU', location:'Indulkana, APY Lands SA', submitter:'u_vincent', artistId:'u_vincent', status:'approved', tags:['portrait','contemporary'], booth:'V01', submitted:'2025-09-05', region:'SA', sensitive:false, address:'Indulkana, APY Lands', period:'modern', intro:'Bold contemporary portrait engaging with identity and history.' },
      { id:'a_kaylene_2017', title:'Kaylene TV', theme:'Pop & Anangu culture', date:'2017-01-01', nature:'painting', type:'Painting', country:'AU', location:'Indulkana, APY Lands SA', submitter:'u_kaylene', artistId:'u_kaylene', status:'approved', tags:['pop','female-icons'], booth:'K01', submitted:'2025-09-05', region:'SA', sensitive:false, address:'Indulkana, APY Lands', period:'modern', intro:'Pop-inflected painting blending Anangu culture with global icons.' },
      { id:'a_tony_2008', title:'Sorry', theme:'Aboriginalia & apology', date:'2008-02-13', nature:'installation', type:'Installation', country:'AU', location:'Brisbane QLD / Sydney NSW', submitter:'u_tony', artistId:'u_tony', status:'approved', tags:['installation','text'], booth:'T01', submitted:'2025-09-05', region:'QLD', sensitive:false, address:'GOMA Brisbane', period:'modern', intro:'Installation interrogating Aboriginalia and national apology.' },
      { id:'a_megan_2020', title:'Untitled Death Song', theme:'Ecology & mining legacy', date:'2020-01-01', nature:'sound sculpture', type:'Sound Installation', country:'AU', location:'Minjerribah QLD / Melbourne VIC', submitter:'u_megan', artistId:'u_megan', status:'approved', tags:['sound','sculpture'], booth:'M01', submitted:'2025-09-05', region:'QLD', sensitive:false, address:'Minjerribah QLD', period:'modern', intro:'Site-responsive sound work on ecologies and mining.' },
      { id:'a_yhonnie_2015', title:'Thunder Raining Poison', theme:'Memory & nuclear tests', date:'2015-01-01', nature:'glass installation', type:'Glass Installation', country:'AU', location:'SA / VIC', submitter:'u_yhonnie', artistId:'u_yhonnie', status:'approved', tags:['glass','installation'], booth:'Y01', submitted:'2025-09-05', region:'SA', sensitive:false, address:'Melbourne VIC', period:'modern', intro:'Hand-blown glass installation reflecting on nuclear tests.' },
    ],
    reports: [
      { id:'r_3001', artwork:'a_2003', type:'cultural_sensitivity', detail:'Caption uses non-approved terminology', created:'2025-09-02', status:'open' },
      { id:'r_3002', artwork:'a_2002', type:'ip_consent', detail:'Missing consent verification doc', created:'2025-08-24', status:'open' },
    ],
    reservations: [],
    audit: []
  }
};

// ===== Routes =====
const routes = [
  { key:'dashboard', label:'Dashboard', icon:'🏠', view: Dashboard },
  { key:'queue',     label:'Review Queue', icon:'🗂️', view: ReviewQueue },
  { key:'artworks',  label:'Artworks', icon:'🖼️', view: Artworks },
  { key:'users',     label:'Users', icon:'👥', view: Users },
  { key:'reports',   label:'Reports', icon:'🚩', view: Reports },
  { key:'category',  label:'Category', icon:'🏷️', view: Category },
  { key:'settings',  label:'Settings', icon:'⚙️', view: Settings },
];

function renderNav(){
  const nav = document.getElementById('nav');
  nav.innerHTML = routes.map(r=>`<a href="#${r.key}" class="${state.route===r.key?'active':''}">${r.icon}<span>${r.label}</span></a>`).join('');
}
function routeTo(hash){ state.route = hash || 'dashboard'; render(); }
window.addEventListener('hashchange', ()=> routeTo(location.hash.slice(1)));

// ===== Utilities =====
const $  = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
const fmtDate = d => new Date(d).toLocaleDateString();
const safe = (v, fallback='') => (v ?? fallback);
const toast = (msg) => { const el = document.createElement('div'); el.className = 'msg'; el.textContent = msg; $('#toast').appendChild(el); setTimeout(()=> el.remove(), 2000); };
const openModal = (title, contentHTML) => { $('#modalTitle').textContent = title; $('#modalContent').innerHTML = contentHTML; $('#modal').classList.add('show'); }
const closeModal = ()=> $('#modal').classList.remove('show');
function focusMain(){ setTimeout(()=> $('#app').focus(), 0); }
function deepClone(o){ return JSON.parse(JSON.stringify(o)); }

function userName(id){ const u = state.data.users.find(u=>u.id===id);return u?u.name:id; }
function artTitle(id){ const a = state.data.artworks.find(a=>a.id===id);return a?`${a.title} (${a.location})`:id; }
function short(s, n=90){ if(!s) return ''; return s.length>n? s.slice(0,n-1)+'…': s; }

// ===== Filter setters =====
function setArtFilter(key, val){ state.filters.artworks[key] = val; render(); }
function setUserFilter(key, val){ state.filters.users[key] = val; render(); }
function setQueueFilter(val){ state.filters.queue.text = val; render(); }

// ===== Views =====
function Dashboard(){
  const pending = state.data.artworks.filter(a=>a.status==='pending').length;
  const flagged = state.data.artworks.filter(a=>a.status==='flagged').length;
  const openReports = state.data.reports.filter(r=>r.status==='open').length;
  return `
    <section class="section">
      <h2>Overview</h2>
      <div class="grid cols-3">
        ${Card('Pending Reviews', pending, 'info')}
        ${Card('Flagged Items', flagged, 'warn')}
        ${Card('Open Reports', openReports, 'danger')}
      </div>
    </section>
    <section class="section">
      <h2>Guidelines</h2>
      <div class="empty">Centre cultural safety: verify community permissions; avoid sacred site geo-precision; respect naming protocols.</div>
    </section>
  `;
}

function ReviewQueue(){
  const q = state.filters.queue.text.toLowerCase();
  const items = state.data.artworks.filter(a=>['pending','flagged'].includes(a.status)).filter(a=>
    !q || [a.title,a.type,a.location,(a.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)
  );
  return `
    <section class="section">
      <div class="toolbar">
        <input id="q" placeholder="Filter by title/type/tag…" aria-label="Filter queue" oninput="setQueueFilter(this.value)" />
        <button class="ghost" onclick="bulkApprove()">Bulk approve</button>
        <button class="ghost" onclick="bulkReject()">Bulk reject</button>
      </div>
      ${Table({
        columns:[
          { key:'title', label:'Title', render:(_,row)=>`<a href="#" onclick="selectArtwork('${row.id}');return false;">${row.title}</a>` },
          { key:'type', label:'Art Type' },
          { key:'location', label:'Location' },
          { key:'status', label:'Status', render: v=> statusPill(v) },
          { key:'tags', label:'Tags', render: tags=> tags.map(t=>`<span class=tag>${t}</span>`).join('') },
          { key:'actions', label:'', render: (_,row)=> RowActions(row) }
        ],
        rows: items
      })}
    </section>
  `;
}

function Artworks(){
  const f = state.filters.artworks;
  const text = (f.text || state.filters.search || '').toLowerCase();

  let items = state.data.artworks.filter(a=>{
    const hay = [a.title,a.type,a.location,a.region,userName(a.artistId),(a.tags||[]).join(' '),a.intro].join(' ').toLowerCase();
    return !text || hay.includes(text);
  }).filter(a=> !f.region || f.region==='All regions' || a.region===f.region)
    .filter(a=> !f.type || a.type===f.type)
    .filter(a=> !f.sensitive || String(a.sensitive)===f.sensitive)
    .filter(a=> !f.period || a.period===f.period);

  const sel = state.selection.artworkId && state.data.artworks.find(x=>x.id===state.selection.artworkId);

  const rowsHtml = items.map(row=>{
    const periodLabel = row.period ? (row.period[0].toUpperCase()+row.period.slice(1)) : '';
    const sensitiveCell = row.sensitive ? 'true' : (safe(row.address,'-'));
    return `<tr>
      <td><a href="#" onclick="selectArtwork('${row.id}');return false;">${row.title}</a></td>
      <td>${userName(row.artistId)}</td>
      <td>${row.type}</td>
      <td>${periodLabel}</td>
      <td>${row.region}</td>
      <td>${sensitiveCell}</td>
      <td>
      <textarea class="form-control" rows="2" 
        onchange="updateArtworkField('${row.id}','intro', this.value)">${safe(row.intro)}</textarea>
    </td>
      <td>${RowActions(row)}</td>
    </tr>`;
  }).join('');

  return `
    <section class="section">
      <div class="split">
        <div>
          <table role="table">
            <thead>
              <tr class="header-with-filters">
                <th>
                  <div class="th-inline">
                    <span class="th-label">Title</span>
                    <input class="form-control th-control" placeholder="Search…" value="${safe(f.text,'')}" oninput="setArtFilter('text', this.value)" />
                  </div>
                </th>
                <th><span class="th-label">Artist</span></th>
                <th>
                  <div class="th-inline">
                    <span class="th-label">Art Type</span>
                    <select class="form-control th-control" onchange="setArtFilter('type', this.value)">
                      <option value="">All</option>
                      ${TYPE_OPTIONS.map(t=>`<option ${f.type===t?'selected':''}>${t}</option>`).join('')}
                    </select>
                  </div>
                </th>
                <th>
                  <div class="th-inline">
                    <span class="th-label">Period</span>
                    <select class="form-control th-control" onchange="setArtFilter('period', this.value)">
                      <option value="">All</option>
                      <option value="ancient" ${f.period==='ancient'?'selected':''}>Ancient</option>
                      <option value="modern" ${f.period==='modern'?'selected':''}>Modern</option>
                    </select>
                  </div>
                </th>
                <th>
                  <div class="th-inline">
                    <span class="th-label">Region</span>
                    <select class="form-control th-control" onchange="setArtFilter('region', this.value)">
                      ${REGION_OPTIONS.map(r=>`<option ${f.region===r?'selected':''}>${r}</option>`).join('')}
                    </select>
                  </div>
                </th>
                <th>
                  <div class="th-inline">
                    <span class="th-label">Sensitive</span>
                    <select class="form-control th-control" onchange="setArtFilter('sensitive', this.value)">
                      <option value="">All</option>
                      <option value="true" ${f.sensitive==='true'?'selected':''}>true</option>
                      <option value="false" ${f.sensitive==='false'?'selected':''}>false</option>
                    </select>
                  </div>
                </th>
                <th><span class="th-label">Description</span></th>
                <th style="text-align:right"><button class="btn" onclick="newArtwork()">+ New</button></th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="8"><div class="empty">No data</div></td></tr>`}
            </tbody>
          </table>
        </div>

        <aside class="section detail" id="artDetailPanel">
          ${sel ? ArtworkDetail(sel) : `<div class="empty">Select an artwork to view & edit details.</div>`}
        </aside>
      </div>
    </section>
  `;
}

function Users(){
  const f = state.filters.users;
  const text = (f.text || state.filters.search || '').toLowerCase();
  const items = state.data.users.filter(u=>{
    const hay = [u.name,u.email,u.role,u.region].join(' ').toLowerCase();
    return (!text || hay.includes(text)) && (!f.role || u.role===f.role);
  });
  return `
    <section class="section">
      <div class="toolbar">
        <input id="filterUser" placeholder="Search name/email" oninput="setUserFilter('text', this.value)" />
        <select id="roleUser" onchange="setUserFilter('role', this.value)">
          <option value="">All roles</option>
          <option ${f.role==='artist'?'selected':''}>artist</option>
          <option ${f.role==='user'?'selected':''}>user</option>
          <option ${f.role==='admin'?'selected':''}>admin</option>
        </select>
        <button onclick="newUser()">Invite user</button>
      </div>
      ${Table({
        columns:[
          { key:'name',  label:'Full Name', render: (_,row)=> `<a href="#" onclick="openUser('${row.id}');return false;">${row.name}</a>` },
          { key:'email', label:'Contact Email' },
          { key:'role',  label:'Role', render: (_,row)=> roleSelect(row) },
          { key:'region',label:'Region / State', render: r => safe(r,'-') },
          // ✅ Newly added Status column (toggle active/inactive with modal on success)
          { key:'status', label:'Status', render: (_,row)=> statusSelect(row) },
          { key:'actions', label:'', render: (_,row)=> `<div class=actions>
              <button class="btn" onclick="toggleUser('${row.id}')">${row.status==='active'?'Deactivate':'Activate'}</button>
              <button class="btn danger" onclick="removeUser('${row.id}')">Remove</button>
            </div>` }
        ],
        rows: items
      })}
    </section>
  `;
}

function Reports(){
  const items = state.data.reports;
  return `
    <section class="section">
      <h2>Reports & Cultural Safety Flags</h2>
      ${Table({
        columns:[
          { key:'artwork', label:'Artwork', render: id=> artTitle(id) },
          { key:'type', label:'Type' },
          { key:'detail', label:'Detail' },
          { key:'created', label:'Date', render: d=> fmtDate(d) },
          { key:'status', label:'Status', render: s=> s==='open'?'<span class="pill warn">open</span>':'<span class="pill ok">closed</span>' },
          { key:'decision', label:'Decision', render: d=> d ? `<span class="pill ${d==='approved'?'ok':'danger'}">${d}</span>` : '' },
          { key:'actions', label:'', render: (_,row)=> row.status==='open' ? `<div class="actions">
              <button class="btn ok" onclick="reviewReport('${row.id}','approved')">Approve</button>
              <button class="btn danger" onclick="reviewReport('${row.id}','disapproved')">Disapprove</button>
            </div>` : '' }
        ],
        rows: items
      })}
    </section>
  `;
}

// merged Category page
function Category(){
  const auditItems = state.data.audit.slice(-200).reverse();
  return `
    <section class="section">
      <h2>Category</h2>
      <div class="empty" style="margin-bottom:12px">Add controlled vocabulary for respectful, accurate descriptions. Example tags: community-approved, restricted, sacred, public, weaving, mural, rock art.</div>
      <div class="toolbar">
        <input type="text" class="form-control" placeholder="New tag name (demo only)" />
        <button class="ghost btn" onclick="toast('Demo: Tag saved')">Save Tag</button>
      </div>
    </section>

    <section class="section">
      <h2>Audit Log</h2>
      ${auditItems.length ? Table({
        columns:[
          { key:'ts', label:'Time', render: d=> new Date(d).toLocaleString() },
          { key:'actor', label:'Actor', render: id=> userName(id) || id },
          { key:'action', label:'Action' },
          { key:'target', label:'Target' },
          { key:'meta', label:'Meta', render: m=> `<code>${m}</code>` },
        ],
        rows: auditItems
      }) : `<div class="empty">No audit entries yet.</div>`}
    </section>
  `;
}

function Settings(){
  return `
    <section class="section">
      <h2>Settings</h2>
      <div class="grid cols-2">
        <div class="section">
          <h3 style="margin-top:0">Privacy & Cultural Safety</h3>
          <label><input type="checkbox" checked /> Hide precise GPS for sacred/limited sites</label><br/>
          <label><input type="checkbox" checked /> Require consent doc upload for community IP</label><br/>
          <label><input type="checkbox" /> Enable two-reviewer approval</label>
        </div>
        <div class="section">
          <h3 style="margin-top:0">Content Policies</h3>
          <div class="empty">Store policy links, moderation rubric, glossary of acceptable terminology.</div>
        </div>
      </div>
    </section>
  `;
}

// ===== UI helpers =====
function Card(title, value, tone='info'){
  return `<div class="section" style="background:var(--card)">
    <div style="color:#a1a1aa;font-size:12px">${title}</div>
    <div style="font-size:28px;font-weight:800">${value}</div>
    <span class="pill ${tone}">${tone}</span>
  </div>`
}
function statusPill(v){ const map={pending:'warn',approved:'ok',flagged:'danger',rejected:'danger'};return `<span class="pill ${map[v]||'info'}">${v}</span>` }
function Table({columns, rows}){
  if(!rows.length) return `<div class="empty">No data</div>`;
  return `<table role="table">
    <thead><tr>${columns.map(c=>`<th scope="col">${c.label}</th>`).join('')}</tr></thead>
    <tbody>
      ${rows.map(r=>`<tr>${columns.map(c=>`<td>${(c.render?c.render(r[c.key], r):r[c.key]) ?? ''}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>`
}
function RowActions(row){
  return `<div class="actions">
    <button class="btn" onclick="selectArtwork('${row.id}')">Preview</button>
    <button class="btn ok" onclick="approve('${row.id}')">Approve</button>
    <button class="btn warn" onclick="flag('${row.id}')">Flag</button>
    <button class="btn danger" onclick="reject('${row.id}')">Reject</button>
  </div>`
}
function roleSelect(row){
  return `<select class="form-control" onchange="changeRole('${row.id}', this.value)">
    ${['artist','user','admin'].map(r=>`<option value="${r}" ${row.role===r?'selected':''}>${r}</option>`).join('')}
  </select>`
}

function statusSelect(row){
  return `<select class="form-control" onchange="changeUserStatus('${row.id}', this.value)">
    ${['active','inactive'].map(s=>`<option value="${s}" ${row.status===s?'selected':''}>${s}</option>`).join('')}
  </select>`
}

// ===== Artwork detail panel with Save/Cancel edit mode =====
function ArtworkDetail(a){
  const isEditing = state.editing.artworkId === a.id;
  if(!isEditing){
    return `
      <h3 class="title-xl">Artwork Details</h3>
      <div class="small-label">ID: ${a.id}</div>
      <div style="margin-top:8px"><strong>Region:</strong> ${safe(a.region,'-')}</div>
      <div><strong>Sensitive:</strong> ${a.sensitive}</div>
      <div><strong>Address:</strong> ${a.sensitive ? '(hidden)' : safe(a.address,'-')}</div>
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
  const artistOptions = state.data.users.filter(u=>u.role==='artist').map(u=>`<option value="${u.id}" ${d.artistId===u.id?'selected':''}>${u.name}</option>`).join('');
  return `
    <h3 class="title-xl">Edit Artwork</h3>
    <form id="artDetailForm">
      <div class="grid cols-2" style="margin-top:8px">
        <label>Region
          <select name="region" class="form-control" onchange="updateDraft('region', this.value)">
            ${REGION_OPTIONS.map(r=>`<option value="${r}" ${d.region===r?'selected':''}>${r}</option>`).join('')}
          </select>
        </label>
        <label>Sensitive (boolean)
          <select name="sensitive" class="form-control" onchange="updateDraft('sensitive', this.value)">
            <option value="true" ${d.sensitive?'selected':''}>true</option>
            <option value="false" ${!d.sensitive?'selected':''}>false</option>
          </select>
        </label>
      </div>

      <label style="display:block;margin-top:8px">Specific address (shown when not sensitive)
        <input name="address" class="form-control" ${d.sensitive?'disabled':''} value="${safe(d.address)}" onchange="updateDraft('address', this.value)" placeholder="Street / venue / coordinates" />
      </label>

      <div class="grid cols-2" style="margin-top:8px">
        <label>Artist
          <select name="artistId" class="form-control" onchange="updateDraft('artistId', this.value)">${artistOptions}</select>
        </label>
        <label>Art Type
          <select name="type" class="form-control" onchange="updateDraft('type', this.value)">
            ${TYPE_OPTIONS.map(t=>`<option ${d.type===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </label>
      </div>

      <div class="grid cols-2" style="margin-top:8px">
        <label>Period
          <select name="period" class="form-control" onchange="updateDraft('period', this.value)">
            ${PERIOD_OPTIONS.map(p=>`<option value="${p}" ${d.period===p?'selected':''}>${p[0].toUpperCase()+p.slice(1)}</option>`).join('')}
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
function log(action, target, meta=''){ state.data.audit.push({ ts:Date.now(), actor:'u_admin1', action, target, meta }); }
function approve(id){ const a = state.data.artworks.find(x=>x.id===id); if(!a) return; a.status='approved'; log('approve_artwork', id, a.title); toast('Approved: '+a.title); render(); }
function reject(id){ const a = state.data.artworks.find(x=>x.id===id); if(!a) return; a.status='rejected'; log('reject_artwork', id, a.title); toast('Rejected: '+a.title); render(); }
function flag(id){ const a = state.data.artworks.find(x=>x.id===id); if(!a) return; a.status='flagged'; log('flag_artwork', id, a.title); toast('Flagged: '+a.title); render(); }

function selectArtwork(id){ state.selection.artworkId = id; state.editing.artworkId=null; state.editing.draft=null; render(); }
function previewArtwork(id){
  const a = state.data.artworks.find(x=>x.id===id);
  if(!a) return;
  openModal('Preview – '+a.title, `
    <div><strong>Art Type:</strong> ${a.type}</div>
    <div><strong>Region:</strong> ${safe(a.region,'-')} | <strong>Sensitive:</strong> ${a.sensitive}</div>
    <div><strong>Address:</strong> ${a.sensitive ? '(hidden)' : safe(a.address,'-')}</div>
    <div><strong>Artist:</strong> ${userName(a.artistId)}</div>
    <div><strong>Period:</strong> ${a.period}</div>
    <div><strong>Description:</strong> ${safe(a.intro,'')}</div>
    <div class="empty" style="margin-top:12px">Image and map preview placeholder (no external libs). Consider <em>blurred</em> map for sensitive sites.</div>
  `);
}
function bulkApprove(){ state.data.artworks.filter(a=>['pending','flagged'].includes(a.status)).forEach(a=>{a.status='approved';log('approve_artwork', a.id)}); toast('Bulk approved'); render(); }
function bulkReject(){ state.data.artworks.filter(a=>['pending','flagged'].includes(a.status)).forEach(a=>{a.status='rejected';log('reject_artwork', a.id)}); toast('Bulk rejected'); render(); }

// Immediate update for single field (used by Description in view mode)
function updateArtworkField(id, field, value){
  const a = state.data.artworks.find(x=>x.id===id); if(!a) return;
  if(field==='sensitive'){ a.sensitive = (value==='true' || value===true); if(a.sensitive){ a.address=''; } }
  else { a[field] = value; }
  log('update_artwork_'+field, id, String(value));
  toast('Saved'); render();
}

// Edit mode helpers
function startEditArtwork(id){
  const a = state.data.artworks.find(x=>x.id===id); if(!a) return;
  state.editing.artworkId = id;
  state.editing.draft = deepClone(a);
  render();
}
function updateDraft(field, value){
  const d = state.editing.draft; if(!d) return;
  if(field==='sensitive'){ d.sensitive = (value==='true' || value===true); if(d.sensitive){ d.address=''; } }
  else { d[field] = value; }
  if(field==='sensitive') render();
}
function saveArtworkEdit(){
  const id = state.editing.artworkId; const d = state.editing.draft;
  if(!id || !d) return;
  const a = state.data.artworks.find(x=>x.id===id); if(!a) return;
  ['region','sensitive','address','artistId','type','period','date','intro'].forEach(k=> a[k] = d[k]);
  log('save_artwork_edit', id, JSON.stringify({region:a.region,sensitive:a.sensitive}));
  state.editing.artworkId = null; state.editing.draft = null;
  toast('Changes saved'); render();
}
function cancelArtworkEdit(){ state.editing.artworkId = null; state.editing.draft = null; toast('Changes discarded'); render(); }

function reviewReport(id, decision){
  const r = state.data.reports.find(x=>x.id===id); if(!r) return;
  openModal((decision==='approved'?'Approve':'Disapprove')+' Report', `
    <form id="reportReviewForm">
      <div class="empty" style="text-align:left;margin-bottom:8px">Please provide the rationale for this decision. This will be stored in the audit log.</div>
      <label class="visually-hidden" for="reason">Reason</label>
      <textarea id="reason" name="reason" rows="5" placeholder="Reason / cultural safety notes..." class="form-control" style="width:100%"></textarea>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
        <button type="button" class="btn" data-close>Cancel</button>
        <button class="btn ${decision==='approved'?'ok':'danger'}" type="submit">${decision==='approved'?'Approve':'Disapprove'}</button>
      </div>
    </form>
  `);

  $('#reportReviewForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const reason = new FormData(e.target).get('reason') || '';
    applyReportDecision(id, decision, reason);
    closeModal(); toast(`Report ${decision}`); render();
  });
}
function applyReportDecision(id, decision, note){
  const r = state.data.reports.find(x=>x.id===id); if(!r) return;
  r.status = 'closed'; r.decision = decision; r.note = note;
  log('review_report', id, JSON.stringify({decision, note}));
}

function openUser(id){
  const u = state.data.users.find(x=>x.id===id);
  if(!u) return;

  const roleSelectHTML = `<label>Role
    <select name="role" class="form-control">
      ${['artist','user','admin'].map(r=>`<option value="${r}" ${u.role===r?'selected':''}>${r}</option>`).join('')}
    </select>
  </label>`;

  const regionOptions = REGION_OPTIONS.filter(x=>x!=='All regions').map(r=>`<option value="${r}" ${u.region===r?'selected':''}>${r}</option>`).join('');

  const artistWorks = state.data.artworks.filter(a=>a.artistId===u.id);
  const worksHTML = u.role==='artist' ? `
    <div class="section" style="margin-top:12px">
      <h4 style="margin:0 0 8px 0">Artist works</h4>
      ${Table({
        columns:[
          { key:'title', label:'Title' },
          { key:'period', label:'Period', render:(p,row)=> `<select class="form-control" onchange="changeArtworkPeriod('${row.id}', this.value)">
            ${PERIOD_OPTIONS.map(x=>`<option value="${x}" ${row.period===x?'selected':''}>${x[0].toUpperCase()+x.slice(1)}</option>`).join('')}
          </select>` },
          { key:'status', label:'Status', render: s=> statusPill(s) }
        ],
        rows: artistWorks
      })}
    </div>` : '';

  openModal('User Profile – '+(u.name||u.id), `
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

  $('#userDetailForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const prevRole = u.role;
    u.name   = fd.get('name');
    u.email  = fd.get('email');
    u.role   = fd.get('role');
    u.region = fd.get('region');
    if(prevRole!==u.role) log('change_user_role', id, `${prevRole} -> ${u.role}`);
    log('update_user_profile', id, JSON.stringify({region:u.region}));
    closeModal(); toast('User updated'); render();
  });
}

function newUser(){
  const regionOptions = REGION_OPTIONS.filter(x=>x!=='All regions').map(r=>`<option value="${r}">${r}</option>`).join('');
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
  $('#userForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const id = 'u_' + (Math.random()*1e5|0);
    state.data.users.push({
      id,
      name: fd.get('name'),
      email: fd.get('email'),
      role: fd.get('role'),
      region: fd.get('region') || '',
      status: 'active',
      created: new Date().toISOString().slice(0,10)
    });
    log('invite_user', id);
    closeModal(); toast('Invitation sent'); render();
  });
}

function toggleUser(id){ const u = state.data.users.find(u=>u.id===id); if(!u) return; u.status = u.status==='active'?'inactive':'active'; log('toggle_user', id, u.status); toast('User '+(u.status==='active'?'activated':'deactivated')); render(); }
function removeUser(id){ const idx = state.data.users.findIndex(u=>u.id===id); if(idx<0) return; const name = state.data.users[idx].name; state.data.users.splice(idx,1); log('remove_user', id, name); toast('Removed '+name); render(); }
function changeRole(id, newRole){ const u = state.data.users.find(x=>x.id===id); if(!u) return; const prev = u.role; u.role = newRole; log('change_user_role', id, `${prev} -> ${newRole}`); toast('Role updated'); render(); }
function changeUserStatus(id, newStatus){ const u = state.data.users.find(x=>x.id===id); if(!u) return; const prev = u.status; u.status = newStatus; log('change_user_status', id, `${prev} -> ${newStatus}`); openModal('Status updated', `<div>User <strong>${u.name}</strong> is now <span class=\"pill ${newStatus==='active'?'ok':'warn'}\">${newStatus}</span>.</div>`); render(); }
function changeArtworkPeriod(artId, period){ const a = state.data.artworks.find(x=>x.id===artId); if(!a) return; a.period = period; log('update_artwork_period', artId, period); toast('Period updated'); render(); }

// ===== Render & Events =====
function render(){
  renderNav();
  const route = routes.find(r=>r.key===state.route) || routes[0];
  $('#app').innerHTML = route.view();
  document.title = `IAA Admin – ${route.label}`;
  focusMain();
}
$('#globalSearch').addEventListener('input', (e)=>{ state.filters.search = e.target.value.toLowerCase(); render(); });
document.addEventListener('click', (e)=>{ if(e.target.matches('[data-close]')) closeModal(); if(e.target.id==='modal') closeModal(); });

render();
