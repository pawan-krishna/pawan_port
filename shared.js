/* ============================================
   SHARED JS — All pages
   Features: active nav, mobile menu, reveal, stagger, theme toggle
   ============================================ */

/* ---- Active nav link ---- */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
}
setActiveNav();

/* ---- Mobile hamburger ---- */
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Theme Toggle ---- */
const THEME_KEY = 'pkv-theme';
const toggleInput = document.getElementById('themeToggleInput');

// Apply saved theme on load (before paint)
function applyTheme(isLight) {
  document.body.classList.toggle('light', isLight);
  if (toggleInput) toggleInput.checked = isLight;
}

// Load saved preference
const saved = localStorage.getItem(THEME_KEY);
applyTheme(saved === 'light');

// Listen for toggle changes
if (toggleInput) {
  toggleInput.addEventListener('change', () => {
    const isLight = toggleInput.checked;
    applyTheme(isLight);
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  });
}

/* ---- Scroll reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Stagger children ---- */
document.querySelectorAll('.stagger-parent').forEach(parent => {
  parent.querySelectorAll('.stagger-child').forEach((child, i) => {
    child.dataset.delay = i * 70;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});
