/* ============================================================
   ECKEL ELECTRIC — script.js
   Nav scroll shadow, mobile menu, smooth scroll,
   floating call button, scroll reveal, form validation
   ============================================================ */

'use strict';

// ── NAV SCROLL SHADOW ─────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── MOBILE MENU ───────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── SMOOTH SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── FLOATING CALL BUTTON ──────────────────────────────────
// Appears after user scrolls 500px past the top
const floatCall = document.getElementById('floatCall');
if (floatCall) {
  const onScroll = () => {
    const visible = window.scrollY > 500;
    floatCall.classList.toggle('is-visible', visible);
    floatCall.setAttribute('aria-hidden', String(!visible));
    floatCall.tabIndex = visible ? 0 : -1;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // check on load
}

// ── SCROLL REVEAL ─────────────────────────────────────────
// Respects prefers-reduced-motion for accessibility
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // fire once per element
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });
} else {
  // If reduced motion preferred, make everything visible immediately
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    el.classList.add('is-visible');
  });
}

// ── QUOTE FORM VALIDATION ─────────────────────────────────
const quoteForm = document.getElementById('quoteForm');

if (quoteForm) {

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous error states
    quoteForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    quoteForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Validate: Name
    const nameEl  = document.getElementById('q-name');
    const nameErr = document.getElementById('q-name-error');
    if (!nameEl.value.trim()) {
      nameErr.textContent = 'Please enter your name.';
      nameEl.classList.add('error');
      isValid = false;
    }

    // Validate: Phone (must be at least 10 digits)
    const phoneEl  = document.getElementById('q-phone');
    const phoneErr = document.getElementById('q-phone-error');
    const digits   = phoneEl.value.trim().replace(/\D/g, '');
    if (!phoneEl.value.trim()) {
      phoneErr.textContent = 'Please enter your phone number.';
      phoneEl.classList.add('error');
      isValid = false;
    } else if (digits.length < 10) {
      phoneErr.textContent = 'Please enter a valid 10-digit phone number.';
      phoneEl.classList.add('error');
      isValid = false;
    }

    // Validate: Service dropdown
    const serviceEl  = document.getElementById('q-service');
    const serviceErr = document.getElementById('q-service-error');
    if (!serviceEl.value) {
      serviceErr.textContent = 'Please select the service you need.';
      serviceEl.classList.add('error');
      isValid = false;
    }

    if (isValid) {
      // Show success state
      const btn = quoteForm.querySelector('button[type="submit"]');
      btn.textContent = "Request Sent! We'll Be in Touch ✓";
      btn.disabled = true;
      btn.style.background = '#16a34a';
      btn.style.borderColor = '#16a34a';

      setTimeout(() => {
        quoteForm.reset();
        btn.textContent = 'Send My Request →';
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 5000);
    } else {
      // Scroll to first error
      const firstError = quoteForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });

  // Live validation: clear error on input change
  ['q-name', 'q-phone', 'q-service'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        const errEl = document.getElementById(`${id}-error`);
        if (errEl) errEl.textContent = '';
      });
    }
  });
}
