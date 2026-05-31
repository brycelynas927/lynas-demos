/* ============================================================
   STERLING PLUMBING & DRAIN — script.js
   Nav, mobile menu, scroll reveal, floating CTA, form validation
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

  // Close on nav link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
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
// Appears after user scrolls 500px past the hero
const floatCall = document.getElementById('floatCall');
if (floatCall) {
  const onScroll = () => {
    const visible = window.scrollY > 500;
    floatCall.classList.toggle('is-visible', visible);
    floatCall.setAttribute('aria-hidden', String(!visible));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // check state immediately on load
}

// ── SCROLL REVEAL ─────────────────────────────────────────
// Skips animations if user prefers reduced motion
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
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });
}

// ── QUOTE FORM VALIDATION ─────────────────────────────────
const quoteForm = document.getElementById('quoteForm');

if (quoteForm) {

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    quoteForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    quoteForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Name
    const nameEl  = document.getElementById('q-name');
    const nameErr = document.getElementById('q-name-error');
    if (!nameEl.value.trim()) {
      nameErr.textContent = 'Please enter your name.';
      nameEl.classList.add('error');
      isValid = false;
    }

    // Phone
    const phoneEl  = document.getElementById('q-phone');
    const phoneErr = document.getElementById('q-phone-error');
    const digits   = phoneEl.value.trim().replace(/\D/g, '');
    if (!phoneEl.value.trim()) {
      phoneErr.textContent = 'Please enter your phone number.';
      phoneEl.classList.add('error');
      isValid = false;
    } else if (digits.length < 10) {
      phoneErr.textContent = 'Please enter a valid phone number (10 digits).';
      phoneEl.classList.add('error');
      isValid = false;
    }

    // Service type
    const serviceEl  = document.getElementById('q-service');
    const serviceErr = document.getElementById('q-service-error');
    if (!serviceEl.value) {
      serviceErr.textContent = 'Please select the type of service needed.';
      serviceEl.classList.add('error');
      isValid = false;
    }

    if (isValid) {
      const btn = quoteForm.querySelector('button[type="submit"]');
      btn.textContent = "Request Sent! We'll Call You Soon ✓";
      btn.disabled = true;

      setTimeout(() => {
        quoteForm.reset();
        btn.textContent = 'Send My Request';
        btn.disabled = false;
      }, 5000);
    } else {
      const firstError = quoteForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });

  // Clear errors on change
  ['q-name', 'q-phone', 'q-service'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        el.classList.remove('error');
        const errEl = document.getElementById(`${id}-error`);
        if (errEl) errEl.textContent = '';
      });
    }
  });
}
