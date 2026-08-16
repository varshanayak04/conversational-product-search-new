const API = '';

/* ── Photos ── */
const PHOTOS = {
    'running shoes': ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80'],
    'walking shoes': ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80'],
    'mobiles': ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80', 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80'],
    'watches': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80', 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=600&q=80', 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80', 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80'],
    'laptops': ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80'],
};
const CAT_COVERS = {
    'running shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70',
    'mobiles': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&q=70',
    'watches': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=80&q=70',
    'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&q=70',
};

const photoCache = {}, photoIdx = {};
function photoFor(p) {
    if (photoCache[p.id]) return photoCache[p.id];
    const cat = p.category || 'running shoes';
    const arr = PHOTOS[cat] || PHOTOS['running shoes'];
    if (!photoIdx[cat]) photoIdx[cat] = 0;
    const url = arr[photoIdx[cat] % arr.length]; photoIdx[cat]++; photoCache[p.id] = url; return url;
}

let S = {
    view: 'home', query: '',
    categories: [], trending: [], recommended: [], history: [],
    results: [], resultMeta: null,
    loadingHome: true, loadingResults: false, error: null,
    cart: [], wishlist: [],
    activeTab: 'home',
};
window.allCatalog = [];
const HK = 'ss_hist', WK = 'ss_wish';
const getHist = () => { try { return JSON.parse(localStorage.getItem(HK)) || [] } catch { return [] } };
const addHist = q => { let h = getHist().filter(i => i !== q); h.unshift(q); h = h.slice(0, 12); localStorage.setItem(HK, JSON.stringify(h)); return h; };
const rmHist = q => { const h = getHist().filter(i => i !== q); localStorage.setItem(HK, JSON.stringify(h)); return h; };
const clrHist = () => { localStorage.removeItem(HK); return []; };
const getWish = () => { try { return JSON.parse(localStorage.getItem(WK)) || [] } catch { return [] } };
const saveWish = arr => { localStorage.setItem(WK, JSON.stringify(arr)); };

async function apiFetch(url, opts) {
    const r = await fetch(url, opts);
    if (!r.ok) { const b = await r.json().catch(() => ({})); throw new Error(b.error || `HTTP ${r.status}`); }
    return r.json();
}

const fmt = p => p == null ? '' : '₹' + Number(p).toLocaleString('en-IN');
function stars(r) {
    r = Math.round(r * 2) / 2; let s = '';
    for (let i = 1; i <= 5; i++) { if (i <= r) s += '★'; else if (i - .5 === r) s += '½'; else s += '☆'; } return s;
}

/* ── Haptic ── */
function haptic(ms = 10) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (_) { } }

/* ── Stars canvas ── */
function initStars() {
    const c = document.getElementById('star-canvas'); if (!c) return;
    const ctx = c.getContext('2d'); let W, H, pts;
    function resize() {
        W = c.width = window.innerWidth; H = c.height = window.innerHeight;
        const count = W < 640 ? 50 : 120;
        pts = Array.from({ length: count }, () => ({
            x: Math.random() * W, y: Math.random() * H, r: Math.random() * .9 + .2,
            a: Math.random(), da: (Math.random() - .5) * .006
        }));
    }
    function draw() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
            p.a = Math.max(.05, Math.min(1, p.a + p.da));
            if (p.a <= .05 || p.a >= 1) p.da *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.a * .7})`; ctx.fill();
        }); requestAnimationFrame(draw);
    }
    resize(); window.addEventListener('resize', resize); draw();
}

/* ── Voice Search ── */
let voiceRecog = null, voiceActive = false;

function startVoiceSearch() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast('🎙️ Voice not supported in this browser'); return; }
    haptic(15);
    document.getElementById('voice-overlay').classList.add('active');
    document.getElementById('mic-btn').classList.add('listening');
    document.getElementById('voice-status').textContent = 'Listening…';
    voiceActive = true;
    voiceRecog = new SR();
    voiceRecog.lang = 'en-IN';
    voiceRecog.continuous = false;
    voiceRecog.interimResults = true;
    voiceRecog.onresult = e => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        document.getElementById('voice-status').textContent = transcript || 'Listening…';
        if (e.results[e.results.length - 1].isFinal) {
            stopVoiceSearch();
            document.getElementById('search-input').value = transcript;
            runSearch(transcript);
        }
    };
    voiceRecog.onerror = () => {
        stopVoiceSearch();
        showToast("🎙️ Couldn't hear you. Try again!");
    };
    voiceRecog.onend = () => { if (voiceActive) stopVoiceSearch(); };
    voiceRecog.start();
}

function stopVoiceSearch() {
    voiceActive = false;
    if (voiceRecog) { try { voiceRecog.stop(); } catch (_) { } voiceRecog = null; }
    document.getElementById('voice-overlay').classList.remove('active');
    document.getElementById('mic-btn').classList.remove('listening');
}

/* ── Wishlist ── */
function isWished(id) { return S.wishlist.includes(id); }

function toggleWishlist(id, fromEl) {
    haptic(12);
    if (isWished(id)) {
        S.wishlist = S.wishlist.filter(x => x !== id);
        showToast('Removed from wishlist');
    } else {
        S.wishlist.push(id);
        showToast('❤️ Added to wishlist!');
        if (fromEl) fireHeartBurst(fromEl);
    }
    saveWish(S.wishlist);
    updateWishlistBadge();
    document.querySelectorAll(`.card-heart[data-id="${id}"]`).forEach(btn => {
        btn.classList.toggle('liked', isWished(id));
    });
    const mbtn = document.getElementById('modal-wish-btn');
    if (mbtn && mbtn.dataset.id === id) mbtn.classList.toggle('liked', isWished(id));
}

function fireHeartBurst(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const emojis = ['❤️', '💜', '💙', '✨', '💖', '🌸'];
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('span');
        p.className = 'heart-particle';
        p.textContent = emojis[i % emojis.length];
        const angle = (i / 8) * Math.PI * 2;
        const dist = 50 + Math.random() * 30;
        p.style.cssText = `left:${cx}px;top:${cy}px;--tx:translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px)`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
    }
}

function updateWishlistBadge() {
    const b = document.getElementById('wishlist-badge');
    if (!b) return;
    if (S.wishlist.length) { b.textContent = S.wishlist.length; b.classList.remove('hidden'); }
    else { b.classList.add('hidden'); }
}

function renderWishlist() {
    const items = S.wishlist.map(id => window.allCatalog.find(p => p.id === id)).filter(Boolean);
    const m = document.getElementById('main');
    if (!items.length) {
        m.innerHTML = `<div class="wishlist-empty fadein">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <div class="state-title" style="color:var(--muted)">No saved items yet</div>
            <p>Double-tap any product or tap ❤️ to save it here</p>
        </div>`;
        return;
    }
    m.innerHTML = `<div style="padding-top:12px"><div class="section-title">❤️ Your Wishlist (${items.length})</div>
        <div class="grid fadein">${items.map(p => cardHTML(p, true)).join('')}</div></div>`;
}

/* ── Double-tap to like ── */
const tapTimers = {};
function handleCardTap(id, el) {
    if (tapTimers[id]) {
        clearTimeout(tapTimers[id]);
        delete tapTimers[id];
        haptic(20);
        if (!isWished(id)) {
            toggleWishlist(id, el);
            const dh = document.createElement('div');
            dh.className = 'dbl-heart';
            dh.textContent = '❤️';
            el.style.position = 'relative';
            el.appendChild(dh);
            setTimeout(() => dh.remove(), 700);
        }
    } else {
        tapTimers[id] = setTimeout(() => {
            delete tapTimers[id];
            openModal(id);
        }, 250);
    }
}

/* ── Card HTML ── */
function cardHTML(p) {
    const wished = isWished(p.id);
    return `<div class="card fadein" onclick="handleCardTap('${p.id}', this)">
    <div class="card-img-wrap">
      <span class="card-badge">${p.category || ''}</span>
      <img class="card-img" src="${photoFor(p)}" alt="${p.name}" loading="lazy"/>
      <button class="card-heart${wished ? ' liked' : ''}" data-id="${p.id}" 
        onclick="event.stopPropagation();toggleWishlist('${p.id}',this)">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
    <div class="card-body">
      <div class="card-name">${p.name}</div>
      <div class="card-brand">${p.brand || ''}</div>
      <div class="card-price">${fmt(p.price)}</div>
      <div class="card-rating"><span class="stars">${stars(p.rating || 0)}</span> ${p.rating || ''}</div>
    </div>
  </div>`;
}

function skelRow(n = 5) { return Array(n).fill(`<div class="skel skel-card"></div>`).join(''); }

function prodRowHTML(title, prods, loading) {
    return `<div class="prod-row fadein"><div class="section-title">${title}</div><div class="prod-scroll">${loading ? skelRow() : prods.length ? prods.map(p => cardHTML(p)).join('') : '<p style="color:var(--muted);padding:20px 0">Nothing here yet</p>'}</div></div>`;
}

function renderHome() {
    document.getElementById('main').innerHTML = `
    ${S.history.length ? `<div class="history fadein">${S.history.map(q => `<div class="hist-chip" onclick="runSearch('${q.replace(/'/g, "\\'")}')">🕐 ${q}<button class="hist-rm" onclick="event.stopPropagation();doRmHist('${q.replace(/'/g, "\\'")}')">✕</button></div>`).join('')}<button class="clear-btn" onclick="doClearHist()">Clear all</button></div>` : ''}
    ${!S.history.length ? `<div class="examples fadein">${['running shoes under ₹5000', 'budget smartphones under 15000', 'noise cancelling headphones', 'waterproof watches for men'].map(e => `<div class="ex-chip" onclick="runSearch('${e}')">${e}</div>`).join('')}</div>` : ''}
    <div class="hero fadein"><div class="hero-in"><div class="hero-badge">✨ AI-Powered Search</div><div class="hero-title">Find anything — just ask.</div><div class="hero-sub">Search the way you talk. No filters needed.</div><div class="hero-cta" onclick="document.getElementById('search-input').focus()">Try it now &rarr;</div></div></div>
    ${S.loadingHome ? `<div class="prod-row"><div class="section-title">Shop by category</div><div class="cat-scroll">${skelRow(6)}</div></div>` : `<div class="prod-row fadein"><div class="section-title">Shop by category</div><div class="cat-scroll">${S.categories.map(c => `<div class="cat-pill" onclick="openCategory('${c.key}','${c.label}')"><img class="cat-img" src="${CAT_COVERS[c.key] || CAT_COVERS['mobiles']}" loading="lazy"/><span class="cat-label">${c.label}</span></div>`).join('')}</div></div>`}
    ${prodRowHTML('Recommended for you', S.recommended, S.loadingHome)}
    ${prodRowHTML('🔥 Trending now', S.trending, S.loadingHome)}`;
}

function renderResults() {
    const { results, resultMeta, loadingResults, error, view, query } = S;
    const qLabel = view === 'category' ? `Category: <strong>${resultMeta?.query || ''}</strong>` : `<strong>${results.length}</strong> results for &ldquo;${resultMeta?.query || query}&rdquo;`;
    document.getElementById('main').innerHTML = `
    <button class="back-btn" onclick="goHome()">← Back</button>
    ${loadingResults ? `<div class="state"><div class="spinner"></div><div class="state-title">Thinking…</div></div>` :
            error ? `<div class="fadein" style="padding:20px;color:var(--red)">⚠️ ${error}</div>` :
                `<div class="fadein"><div class="result-meta">${qLabel}</div><div class="grid">${results.map(p => cardHTML(p)).join('')}</div></div>`}`;
}

async function loadHome() {
    S.loadingHome = true; S.history = getHist(); S.wishlist = getWish(); renderHome();
    try {
        const [catR, trendR, allR] = await Promise.all([
            apiFetch(`${API}/api/categories`),
            apiFetch(`${API}/api/trending?limit=10`),
            apiFetch(`${API}/api/products?limit=100`)
        ]);
        window.allCatalog = allR.results || [];
        S.categories = catR.categories || []; S.trending = trendR.results || [];
        if (S.history.length) {
            try { const r = await apiFetch(`${API}/api/recommend`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ history: S.history, limit: 10 }) }); S.recommended = r.results || []; } catch (_) { }
        }
    } catch (e) { } finally { S.loadingHome = false; renderHome(); updateWishlistBadge(); }
}

async function runSearch(qArg) {
    const q = (typeof qArg === 'string' ? qArg : S.query).trim();
    if (!q) return;
    haptic(10);
    S.query = q; document.getElementById('search-input').value = q; document.getElementById('search-dropdown').classList.add('hidden');
    S.view = 'search'; S.loadingResults = true; S.error = null; S.results = []; renderResults();
    switchTab('home', false);
    try {
        const d = await apiFetch(`${API}/api/search`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) });
        S.results = d.results || []; S.resultMeta = d; S.history = addHist(q);
    } catch (e) { S.error = e.message; } finally { S.loadingResults = false; renderResults(); }
}

async function openCategory(key, label) {
    haptic(10);
    S.view = 'category'; S.loadingResults = true; S.error = null; S.results = []; S.resultMeta = { query: label }; renderResults();
    try { const d = await apiFetch(`${API}/api/products?category=${encodeURIComponent(key)}&limit=40`); S.results = d.results || []; } catch (e) { S.error = e.message; } finally { S.loadingResults = false; renderResults(); }
}

function goHome() { S.view = 'home'; S.query = ''; document.getElementById('search-input').value = ''; renderHome(); }
function doRmHist(q) { S.history = rmHist(q); renderHome(); }
function doClearHist() { S.history = clrHist(); renderHome(); }
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

function switchTab(tab, withHaptic = true) {
    if (withHaptic) haptic(8);
    S.activeTab = tab;
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    const tabEl = document.getElementById(`tab-${tab}`);
    if (tabEl) tabEl.classList.add('active');
    document.getElementById('chat-drawer').classList.remove('open');
    if (tab === 'home') { if (S.view !== 'home') goHome(); else renderHome(); }
    else if (tab === 'search') { document.getElementById('search-input').focus(); if (S.view === 'home') renderHome(); }
    else if (tab === 'wishlist') { S.view = 'wishlist'; renderWishlist(); }
    else if (tab === 'chat') {
        document.getElementById('chat-drawer').classList.add('open');
        document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
        if (tabEl) tabEl.classList.add('active');
    }
}

function doLiveSearch(e) {
    const val = e.target.value.toLowerCase().trim();
    const dd = document.getElementById('search-dropdown');
    if (!val) { dd.classList.add('hidden'); return; }
    let matches = window.allCatalog.filter(p =>
        p.name.toLowerCase().includes(val) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(val))) ||
        (p.category && p.category.toLowerCase().includes(val))
    ).slice(0, 5);
    if (!matches.length) {
        dd.innerHTML = `<div class="sd-item"><div class="sd-info"><div class="sd-title" style="color:var(--muted)">No matches</div></div></div>`;
    } else {
        dd.innerHTML = matches.map(p => `
      <div class="sd-item" onclick="openModal('${p.id}'); document.getElementById('search-dropdown').classList.add('hidden');">
        <img class="sd-img" src="${photoFor(p)}" alt="">
        <div class="sd-info">
          <div class="sd-title">${p.name}</div>
          <div class="sd-cat">${p.category || ''} &middot; ${p.brand || ''}</div>
        </div>
        <div class="sd-price">${fmt(p.price)}</div>
      </div>
    `).join('');
    }
    dd.classList.remove('hidden');
}

/* ── 3D Viewer ── */
let viewerState = { isDragging: false, startX: 0, currentY: 0, angle: 0, autoSpin: false, animFrame: null };

function init3DViewer(imgUrl) {
    const wrap = document.querySelector('.viewer-wrap');
    if (!wrap) return;
    const cube = wrap.querySelector('.viewer-cube');
    if (!cube) return;
    wrap.querySelectorAll('.cube-face img').forEach(img => img.src = imgUrl);
    viewerState.angle = 0; viewerState.autoSpin = true;
    startAutoSpin(cube);
    wrap.addEventListener('pointerdown', e => {
        viewerState.isDragging = true; viewerState.startX = e.clientX;
        stopAutoSpin(); wrap.setPointerCapture(e.pointerId);
    });
    wrap.addEventListener('pointermove', e => {
        if (!viewerState.isDragging) return;
        const dx = e.clientX - viewerState.startX;
        viewerState.startX = e.clientX;
        viewerState.angle += dx * 0.5;
        cube.style.transform = `rotateY(${viewerState.angle}deg) rotateX(-10deg)`;
    });
    wrap.addEventListener('pointerup', () => { viewerState.isDragging = false; });
}

function startAutoSpin(cube) {
    viewerState.autoSpin = true;
    function spin() {
        if (!viewerState.autoSpin) return;
        viewerState.angle += 0.4;
        if (cube) cube.style.transform = `rotateY(${viewerState.angle}deg) rotateX(-10deg)`;
        viewerState.animFrame = requestAnimationFrame(spin);
    }
    spin();
}

function stopAutoSpin() {
    viewerState.autoSpin = false;
    if (viewerState.animFrame) cancelAnimationFrame(viewerState.animFrame);
}

function toggleAutoSpin() {
    const cube = document.querySelector('.viewer-cube');
    const btn = document.getElementById('spin-btn');
    if (viewerState.autoSpin) { stopAutoSpin(); btn.textContent = '▶'; }
    else { startAutoSpin(cube); btn.textContent = '⏸'; }
}

const DUMMY_LNAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
const DUMMY_FNAMES = ['Alex', 'Sam', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Jamie'];
function getFakeReviews(rating) {
    return Array.from({ length: 2 }).map((_, i) => {
        let r = Math.min(5, Math.max(1, rating + (Math.random() * 1.5 - 0.75))); r = Math.round(r);
        let title = r >= 4 ? "Excellent purchase, highly recommend!" : (r === 3 ? "It's okay, does the job." : "Not what I expected.");
        let text = r >= 4 ? "Absolutely exceeded my expectations. Premium build quality, great value for money!" : (r === 3 ? "Decent for the price, could improve in some areas." : "Disappointed. The pictures looked better than real life.");
        let name = DUMMY_FNAMES[Math.floor(Math.random() * DUMMY_FNAMES.length)] + " " + DUMMY_LNAMES[Math.floor(Math.random() * DUMMY_LNAMES.length)];
        return { name, rating: r, title, text };
    });
}

function openModal(id) {
    document.getElementById('search-dropdown').classList.add('hidden');
    const p = window.allCatalog.find(x => x.id === id) || S.results.find(x => x.id === id);
    if (!p) return;
    haptic(8);
    stopAutoSpin();
    const imgUrl = photoFor(p);
    const revs = getFakeReviews(p.rating || 4);
    const revHTML = revs.map(r => `
    <div class="review-item fadein">
      <div class="rev-header"><div class="rev-avatar">${r.name.charAt(0)}</div><div class="rev-name">${r.name}</div></div>
      <div class="rev-rating">${stars(r.rating)}</div>
      <div class="rev-title">${r.title}</div>
      <div class="rev-text">${r.text}</div>
    </div>`).join('');

    const wished = isWished(p.id);
    const tpl = document.getElementById('modal-tpl');
    tpl.querySelector('.modal-wrap').innerHTML = `
    <button class="modal-close" onclick="closeModal()">✕</button>
    <div class="view-toggle-row">
      <button class="view-tab active" id="view-tab-3d" onclick="setViewMode('3d','${p.id}','${imgUrl}')">🔄 3D View</button>
      <button class="view-tab" id="view-tab-flat" onclick="setViewMode('flat','${p.id}','${imgUrl}')">📷 Photo</button>
    </div>
    <div class="viewer-wrap" id="viewer-wrap-3d">
      <div class="viewer-scene">
        <div class="viewer-cube">
          <div class="cube-face face-front"><img src="${imgUrl}" alt=""/></div>
          <div class="cube-face face-back"><img src="${imgUrl}" alt=""/></div>
          <div class="cube-face face-right"><img src="${imgUrl}" alt=""/></div>
          <div class="cube-face face-left"><img src="${imgUrl}" alt=""/></div>
        </div>
      </div>
      <div class="viewer-hint">👆 Drag to rotate</div>
      <div class="viewer-controls">
        <button class="viewer-btn" id="spin-btn" onclick="toggleAutoSpin()">⏸</button>
      </div>
    </div>
    <div class="flat-img-wrap" id="viewer-wrap-flat" style="display:none">
      <img class="modal-img" src="${imgUrl}" alt="${p.name}"/>
    </div>
    <div class="modal-body">
      <div class="modal-name">${p.name}</div>
      <div class="modal-price">${fmt(p.price)}</div>
      <div class="modal-actions">
        <button class="btn-cart" onclick="addToCart('${p.id}')">🛒 Add to Cart</button>
        <button class="btn-wish${wished ? ' liked' : ''}" id="modal-wish-btn" data-id="${p.id}" onclick="toggleWishlist('${p.id}',this)">
          ${wished ? '❤️' : '🤍'}
        </button>
        <button class="btn-share" onclick="shareProduct('${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
      </div>
      <div class="reviews-section">
        <div class="section-title">Customer Reviews</div>
        ${revHTML}
      </div>
    </div>`;
    tpl.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => init3DViewer(imgUrl), 50);
}

function setViewMode(mode, id, imgUrl) {
    document.getElementById('view-tab-3d').classList.toggle('active', mode === '3d');
    document.getElementById('view-tab-flat').classList.toggle('active', mode === 'flat');
    document.getElementById('viewer-wrap-3d').style.display = mode === '3d' ? '' : 'none';
    document.getElementById('viewer-wrap-flat').style.display = mode === 'flat' ? '' : 'none';
    if (mode === '3d') { setTimeout(() => init3DViewer(imgUrl), 50); } else { stopAutoSpin(); }
}

function closeModal() {
    stopAutoSpin();
    document.getElementById('modal-tpl').classList.remove('open');
    document.body.style.overflow = '';
}

function shareProduct(id) {
    haptic(12);
    const p = window.allCatalog.find(x => x.id === id) || S.results.find(x => x.id === id);
    if (!p) return;
    const text = `Check out ${p.name} for ${fmt(p.price)} on ShopSense!`;
    if (navigator.share) navigator.share({ title: p.name, text, url: window.location.href }).catch(() => { });
    else showToast('✅ Link copied!');
}

function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.classList.add('active');
    const ctx = canvas.getContext('2d');
    const colors = ['#7C3AED', '#3B82F6', '#EC4899', '#4ADE80', '#FBBF24', '#F87171', '#fff'];
    const particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width, y: -20, r: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - .5) * 6, vy: Math.random() * 4 + 3,
        rot: Math.random() * 360, rotV: (Math.random() - .5) * 8,
        shape: Math.random() > .5 ? 'rect' : 'circle', w: Math.random() * 12 + 6, h: Math.random() * 6 + 4, opacity: 1,
    }));
    let frame, done = false;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = 0;
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += .08; p.rot += p.rotV;
            if (p.y > canvas.height + 20) return;
            alive++; p.opacity = Math.max(0, 1 - (p.y / (canvas.height * .9)));
            ctx.save(); ctx.globalAlpha = p.opacity; ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color;
            if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); }
            else { ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
            ctx.restore();
        });
        if (alive > 0 && !done) frame = requestAnimationFrame(draw);
        else { canvas.classList.remove('active'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }
    draw();
    setTimeout(() => { done = true; cancelAnimationFrame(frame); canvas.classList.remove('active'); ctx.clearRect(0, 0, canvas.width, canvas.height); }, 4000);
}

function toggleCart() {
    haptic(8);
    const isC = document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
    if (isC) updateCartUI();
}
function addToCart(id) {
    S.cart.push(id); closeModal(); updateCartUI(); haptic(20);
    const p = window.allCatalog.find(x => x.id === id);
    showToast(`✓ ${p ? p.name : 'Item'} added to cart!`);
}
function rmCartItem(idx) { S.cart.splice(idx, 1); updateCartUI(); haptic(10); }
function updateCartUI() {
    document.getElementById('cart-badge').textContent = S.cart.length;
    const body = document.getElementById('cart-body');
    if (!S.cart.length) {
        body.innerHTML = `<div style="text-align:center;color:var(--muted);margin-top:40px;font-size:40px">🛒<br><br><span style="font-size:14px">Your cart is empty</span></div>`;
        document.getElementById('cart-total').textContent = '₹0'; return;
    }
    let total = 0;
    body.innerHTML = S.cart.map((id, index) => {
        const p = window.allCatalog.find(x => x.id === id) || { name: 'Unknown', price: 0, id }; total += p.price;
        return `<div class="cart-item fadein"><img src="${photoFor(p)}" alt=""><div class="cart-info"><div class="cart-title">${p.name}</div><div class="cart-price">${fmt(p.price)}</div><button class="cart-rm" onclick="rmCartItem(${index})">Remove</button></div></div>`;
    }).join('');
    document.getElementById('cart-total').textContent = fmt(total);
}
function openPayment() {
    if (!S.cart.length) return showToast('Cart is empty!');
    haptic(30); toggleCart(); document.getElementById('payment-modal').classList.add('open');
    fireConfetti();
}

function sendChat() {
    const inp = document.getElementById('chat-input');
    const val = inp.value.trim(); if (!val) return;
    inp.value = ''; haptic(8);
    const cb = document.getElementById('chat-body');
    const uDiv = document.createElement('div');
    uDiv.className = 'chat-msg user fadein'; uDiv.textContent = val; cb.appendChild(uDiv);
    cb.scrollTo(0, cb.scrollHeight);
    setTimeout(() => {
        const bDiv = document.createElement('div'); bDiv.className = 'chat-msg bot fadein';
        let matches = window.allCatalog.filter(p =>
            p.name.toLowerCase().includes(val.toLowerCase()) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(val.toLowerCase())))
        ).slice(0, 2);
        if (matches.length > 0) {
            bDiv.innerHTML = `I found some items for "<strong>${val}</strong>":`;
            matches.forEach(m => {
                bDiv.innerHTML += `<div class="chat-mini-card" onclick="openModal('${m.id}')">
                <img src="${photoFor(m)}"><div>
                <div style="font-weight:700;font-size:12px;color:var(--text)">${m.name}</div>
                <div style="font-size:12px;color:var(--green)">${fmt(m.price)}</div></div></div>`;
            });
        } else {
            runSearch(val); bDiv.textContent = `Searching for "${val}" with AI — check the main screen!`;
        }
        cb.appendChild(bDiv); cb.scrollTo(0, cb.scrollHeight);
    }, 700);
}

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    S.wishlist = getWish(); updateWishlistBadge();
    const inp = document.getElementById('search-input');
    inp.addEventListener('keyup', e => { if (e.key === 'Enter') runSearch(); else doLiveSearch(e); });
    document.addEventListener('click', e => { if (!e.target.closest('.search-wrapper')) document.getElementById('search-dropdown').classList.add('hidden'); });
    document.getElementById('search-btn').addEventListener('click', () => runSearch(inp.value));
    loadHome();

    const svgDef = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDef.style.cssText = 'position:absolute;width:0;height:0';
    svgDef.innerHTML = `<defs><linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs>`;
    document.body.appendChild(svgDef);
});
