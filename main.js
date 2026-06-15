// ── THEME RESTORE (no flash) ──
(function () {
  var t = localStorage.getItem('theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
})();

// ── THEME TOGGLE ──
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';

  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);

  document.getElementById('themeIcon').className    = isDark ? 'bi bi-sun-fill'  : 'bi bi-moon-fill';
  document.getElementById('themeLabel').textContent = isDark ? 'Dark' : 'Light';
}

// ── SYNC BUTTON STATE ON LOAD ──
document.addEventListener('DOMContentLoaded', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const icon   = document.getElementById('themeIcon');
  const label  = document.getElementById('themeLabel');
  if (icon)  icon.className    = isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
  if (label) label.textContent = isDark ? 'Light' : 'Dark';

  // ── SMOOTH SCROLL ──
  const NAV_HEIGHT = 64;
  document.querySelectorAll('a.nav-link-item').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT, behavior: 'smooth' });
    });
  });

  // ── SKILLS TABS ──
  document.querySelectorAll('.skills-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.skills-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.skills-panel').forEach(p => p.classList.add('d-none'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) panel.classList.remove('d-none');
    });
  });
});