// Clippers & Co. — script.js
// Handles: nav scroll, mobile menu, form validation

// ── NAV SCROLL SHADOW ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── MOBILE NAV TOGGLE ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── FORM VALIDATION ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();

    if (!name) {
      alert('Please enter your name.');
      return;
    }
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    // Replace with real form handler (e.g. Formspree) before going live
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Request Sent! ✓';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  });
}
