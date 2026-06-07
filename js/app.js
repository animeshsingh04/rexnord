/* ===== INIT ===== */
(function () {
  // Auth guard — redirect to login (one level up from /dashboard/)
  const user = JSON.parse(sessionStorage.getItem('rexnord_user') || 'null');
  if (!user) { window.location.href = '../'; return; }

  // Theme
  const savedTheme = localStorage.getItem('rexnord_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Populate user info
  const initials = user.initials || getInitials(user.name);
  document.getElementById('profileInitials').textContent = initials;
  document.getElementById('ddAvatar').textContent = initials;
  document.getElementById('ddName').textContent = user.name;
  document.getElementById('ddRole').textContent = user.role || 'Employee';
  document.getElementById('drawerAvatar').textContent = initials;
  document.getElementById('drawerName').textContent = user.name;
  document.getElementById('drawerRole').textContent = user.role || 'Employee';
  document.getElementById('greetName').textContent = user.name.split(' ')[0];
  document.getElementById('profileAvatarBig').textContent = initials;
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileRoleText').textContent = (user.role || 'Employee') + ' · Rexnord';
  document.getElementById('profileUsername').textContent = user.username || 'test';

  // Render holiday cards
  renderUpcomingHolidays('all');
  renderHolidayTable('all');

  // Ask input — submit on Enter (not Shift+Enter)
  const askInput = document.getElementById('askInput');
  askInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAsk(); }
  });
  document.getElementById('askSubmitBtn').addEventListener('click', submitAsk);

  // *** FIX: attach click handlers to all desktop nav links ***
  document.querySelectorAll('.nav-link[data-section]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      navigate(this.dataset.section);
    });
  });

  // Close profile dropdown and apps dropdown on outside click
  document.addEventListener('click', function (e) {
    const dd = document.getElementById('profileDropdown');
    const btn = document.getElementById('profileBtn');
    if (dd.classList.contains('open') && !dd.contains(e.target) && e.target !== btn) {
      dd.classList.remove('open');
    }
  });
})();

/* ===== HELPERS ===== */
function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// "Monday" → "Mon", works for all English day names via first 3 chars
function shortDay(fullDay) { return fullDay.slice(0, 3); }

function getDayOfWeek(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'long' });
}

function getDateNum(dateStr) {
  return new Date(dateStr).getDate();
}

/* ===== NAVIGATION ===== */
let currentSection = 'home';

function navigate(section) {
  // Hide all sections
  document.querySelectorAll('.section-page').forEach(el => el.classList.remove('active'));
  // Show target
  const target = document.getElementById('section-' + section);
  if (target) target.classList.add('active');
  currentSection = section;

  // Update desktop nav
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });

  // Update drawer links
  document.querySelectorAll('.drawer-link').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });

  // Update bottom nav
  document.querySelectorAll('.bottom-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });

  // Close profile dropdown
  document.getElementById('profileDropdown').classList.remove('open');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== THEME ===== */
document.getElementById('themeToggle').addEventListener('click', function () {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('rexnord_theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (theme === 'dark') {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  } else {
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  }
}

/* ===== PROFILE DROPDOWN ===== */
document.getElementById('profileBtn').addEventListener('click', function (e) {
  e.stopPropagation();
  document.getElementById('profileDropdown').classList.toggle('open');
});

/* ===== HAMBURGER / DRAWER ===== */
document.getElementById('hamburgerBtn').addEventListener('click', openDrawer);

function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== AUTH ===== */
function logout() {
  sessionStorage.removeItem('rexnord_user');
  window.location.href = '../';
}

/* ===== HOLIDAY RENDERING — UPCOMING (Home card) ===== */
function renderUpcomingHolidays(filter) {
  const container = document.getElementById('upcomingHolidayList');
  if (!container) return;
  const today = new Date();

  let list = [];
  if (filter === 'all' || filter === 'restricted') {
    HOLIDAYS_2026.restricted.forEach(h => list.push({ ...h, type: 'restricted' }));
  }
  if (filter === 'all' || filter === 'floating') {
    HOLIDAYS_2026.floating.forEach(h => list.push({ ...h, type: 'floating' }));
  }

  // Sort by date, only upcoming
  list = list
    .filter(h => new Date(h.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  if (!list.length) {
    container.innerHTML = '<div style="color:var(--text-muted);font-size:14px;padding:12px 0;">No upcoming holidays.</div>';
    return;
  }

  // Group by month
  const grouped = {};
  list.forEach(h => {
    if (!grouped[h.month]) grouped[h.month] = [];
    grouped[h.month].push(h);
  });

  let html = '';
  Object.entries(grouped).forEach(([month, items]) => {
    html += `<div class="holiday-month">${month}</div>`;
    items.forEach(h => {
      const badgeClass = h.type === 'restricted' ? 'badge-restricted' : 'badge-floating';
      const badgeLabel = h.type === 'restricted' ? 'Restricted' : 'Floating';
      html += `
        <div class="holiday-item">
          <div class="holiday-date">${getDateNum(h.date)}</div>
          <div class="holiday-info">
            <div class="holiday-name">${h.name}</div>
            <div class="holiday-day">${h.day}</div>
          </div>
          <span class="badge ${badgeClass}">${badgeLabel}</span>
        </div>`;
    });
  });

  container.innerHTML = html;
}


function filterHolidays(type, btn) {
  document.querySelectorAll('.holiday-tab[data-tab]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderUpcomingHolidays(type);
}

/* ===== HOLIDAY RENDERING — FULL TABLE ===== */
function renderHolidayTable(filter) {
  const tbody = document.getElementById('holidayTableBody');
  if (!tbody) return;
  const today = new Date();

  let list = [];
  if (filter === 'all' || filter === 'restricted') {
    HOLIDAYS_2026.restricted.forEach(h => list.push({ ...h, type: 'restricted' }));
  }
  if (filter === 'all' || filter === 'floating') {
    HOLIDAYS_2026.floating.forEach(h => list.push({ ...h, type: 'floating' }));
  }

  list.sort((a, b) => new Date(a.date) - new Date(b.date));

  let html = '';
  list.forEach((h, i) => {
    const isPast = new Date(h.date) < today;
    const badgeClass = h.type === 'restricted' ? 'badge-restricted' : 'badge-floating';
    const badgeLabel = h.type === 'restricted' ? 'Restricted' : 'Floating';
    html += `
      <tr style="${isPast ? 'opacity:0.45;' : ''}">
        <td style="color:var(--text-muted);font-size:12px;">${i + 1}</td>
        <td><strong>${formatShortDate(h.date)}</strong></td>
        <td style="color:var(--text-secondary);">${h.day}</td>
        <td>${h.name}${isPast ? ' <span style="font-size:11px;color:var(--text-muted);">(passed)</span>' : ''}</td>
        <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
      </tr>`;
  });

  tbody.innerHTML = html;
}

function filterHolidayTable(type, btn) {
  document.querySelectorAll('[data-htab]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderHolidayTable(type);
}

/* ===== ASK ANYTHING ===== */
function submitAsk() {
  const input = document.getElementById('askInput');
  const query = input.value.trim();
  if (!query) return;

  const answer = getHolidayAnswer(query);
  const responseEl = document.getElementById('aiResponse');
  const bodyEl = document.getElementById('aiResponseBody');

  bodyEl.innerHTML = answer;
  responseEl.classList.add('show');
  input.value = '';
  input.focus();
}

/* ===== DEEP LINKING ===== */
function deepLink(appScheme, webUrl, appName) {
  showToast('Opening ' + appName + '...');

  // Try app scheme first, fall back to web
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  let opened = false;
  const timer = setTimeout(function () {
    document.body.removeChild(iframe);
    if (!opened) {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
  }, 800);

  iframe.onload = function () {
    opened = true;
    clearTimeout(timer);
    document.body.removeChild(iframe);
  };

  try {
    iframe.src = appScheme;
    window.location.href = appScheme;
  } catch (e) {
    clearTimeout(timer);
    document.body.removeChild(iframe);
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
}

function openApp(type) {
  const urls = {
    hrms: 'https://dashboard.crazehq.com/',
    payslip: 'https://dashboard.crazehq.com/'
  };
  const url = urls[type] || 'https://dashboard.crazehq.com/';
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ===== SHARE MODAL ===== */
function openShareModal() {
  document.getElementById('shareModal').classList.add('open');
}

function closeModal() {
  document.getElementById('shareModal').classList.remove('open');
}

// Close modal on overlay click
document.getElementById('shareModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

function getShareMessage() {
  const custom = document.getElementById('shareMsg').value.trim();
  return custom || 'Hi, sharing this from Rexnord Employee Portal';
}

function shareViaWhatsApp() {
  const msg = encodeURIComponent(getShareMessage());
  const waApp = 'whatsapp://send?text=' + msg;
  const waWeb = 'https://wa.me/?text=' + msg;

  closeModal();
  showToast('Opening WhatsApp...');

  // Try native app first
  const start = Date.now();
  window.location.href = waApp;
  setTimeout(function () {
    if (Date.now() - start < 2000) {
      window.open(waWeb, '_blank', 'noopener,noreferrer');
    }
  }, 1000);
}

function shareViaMaps() {
  closeModal();
  showToast('Opening Google Maps...');
  const mapsApp = 'comgooglemaps://';
  const mapsWeb = 'https://maps.google.com';
  deepLink(mapsApp, mapsWeb, 'Google Maps');
}

function shareViaEmail() {
  const msg = encodeURIComponent(getShareMessage());
  closeModal();
  window.location.href = 'mailto:?subject=From Rexnord Portal&body=' + msg;
}

function copyLink() {
  const text = getShareMessage() + ' — ' + window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied to clipboard!');
  }
  closeModal();
}

/* ===== TOAST ===== */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}
