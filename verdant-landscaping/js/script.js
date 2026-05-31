/* =============================================
   VERDANT LANDSCAPING — script.js
   ============================================= */

// ── Nav: always scrolled (dark) since hero has a photo ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  // stays dark always; could remove the .scrolled class logic if not needed
  nav.classList.toggle('scrolled', window.scrollY >= 0);
}, { passive: true });

// ── Hamburger toggle ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close nav on any link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close nav when clicking outside
document.addEventListener('click', e => {
  if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height')) || 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ── Fade-in on scroll ──
const fadeObserver = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── Stagger service cards ──
document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

// ── Contact form ──
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));

    // Required fields
    ['name', 'email'].forEach(id => {
      const field = document.getElementById(id);
      if (!field || !field.value.trim()) {
        if (field) field.classList.add('error');
        valid = false;
      }
    });

    // Email format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (!valid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // DEMO: show success state (in production, replace with fetch() to Formspree/EmailJS)
    form.style.display = 'none';
    if (formSuccess) formSuccess.classList.add('show');
  });

  // Clear error state on input
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });
}
