/* ============================================================
   UP LIKE 7 BARBER SHOP — script.js
   Handles: nav scroll shadow, mobile menu, form validation
   ============================================================ */

'use strict';

// ── NAV: Add shadow on scroll ──────────────────────────────
const nav = document.getElementById('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── MOBILE MENU TOGGLE ────────────────────────────────────
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

// ── SMOOTH SCROLL (fallback for older browsers) ───────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── FORM VALIDATION ───────────────────────────────────────
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    contactForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Validate name
    const nameInput  = document.getElementById('name');
    const nameError  = document.getElementById('name-error');
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      nameInput.classList.add('error');
      isValid = false;
    }

    // Validate phone
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const phoneVal   = phoneInput.value.trim().replace(/\D/g, '');
    if (!phoneInput.value.trim()) {
      phoneError.textContent = 'Please enter your phone number.';
      phoneInput.classList.add('error');
      isValid = false;
    } else if (phoneVal.length < 10) {
      phoneError.textContent = 'Please enter a valid phone number.';
      phoneInput.classList.add('error');
      isValid = false;
    }

    // Validate message
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please tell us what you need.';
      messageInput.classList.add('error');
      isValid = false;
    }

    if (isValid) {
      // Form is valid — show confirmation (replace with real submission logic)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Message Sent! ✓';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Reset after 4 seconds
      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      }, 4000);
    } else {
      // Scroll to first error
      const firstError = contactForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });

  // Clear individual field error on input
  ['name', 'phone', 'message'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = document.getElementById(`${id}-error`);
        if (errorEl) errorEl.textContent = '';
      });
    }
  });
}
