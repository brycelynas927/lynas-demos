/* ============================================================
   COPPER & THYME — script.js
   Nav scroll shadow, mobile menu, smooth scroll,
   open/closed indicator, floating CTA, scroll-reveal,
   reservation form validation
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

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

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

// ── OPEN / CLOSED STATUS ──────────────────────────────────
// Hours: Tue–Thu 5–9 PM | Fri–Sat 5–10 PM | Sun 10 AM–2 PM | Mon closed
function updateOpenStatus() {
  const el = document.getElementById('openStatus');
  if (!el) return;

  const now  = new Date();
  const day  = now.getDay();   // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const h    = now.getHours();
  const m    = now.getMinutes();
  const time = h + m / 60;    // e.g. 5:30 PM = 17.5

  let isOpen = false;

  if (day === 0) {
    // Sunday brunch: 10:00 AM – 2:00 PM
    isOpen = time >= 10 && time < 14;
  } else if (day >= 2 && day <= 4) {
    // Tue–Thu: 5:00 PM – 9:00 PM
    isOpen = time >= 17 && time < 21;
  } else if (day === 5 || day === 6) {
    // Fri–Sat: 5:00 PM – 10:00 PM
    isOpen = time >= 17 && time < 22;
  }
  // Monday (day 1) → always closed

  if (isOpen) {
    el.textContent = '● Open Now';
    el.classList.add('is-open');
    el.classList.remove('is-closed');
  } else {
    el.textContent = '○ Closed';
    el.classList.add('is-closed');
    el.classList.remove('is-open');
  }
}

updateOpenStatus();

// ── FLOATING RESERVE CTA ──────────────────────────────────
// Appears after the user scrolls 500px past the top (clears the hero)
const floatCta = document.getElementById('floatCta');

if (floatCta) {
  const onScroll = () => {
    const visible = window.scrollY > 500;
    floatCta.classList.toggle('is-visible', visible);
    floatCta.setAttribute('aria-hidden', String(!visible));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled
}

// ── SCROLL REVEAL (Intersection Observer) ─────────────────
// Watches .reveal and .reveal-stagger elements; adds .is-visible when
// they enter the viewport. Stops observing once revealed (one-shot).
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // fire once, then done
      }
    });
  }, {
    threshold: 0.12,   // trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px', // slight bottom offset so items don't pop in too early
  });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });
}

// ── RESERVATION FORM VALIDATION ───────────────────────────
const reserveForm = document.getElementById('reserveForm');

if (reserveForm) {

  // Set min date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    reserveForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    reserveForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Name
    const nameEl  = document.getElementById('res-name');
    const nameErr = document.getElementById('res-name-error');
    if (!nameEl.value.trim()) {
      nameErr.textContent = 'Please enter your name.';
      nameEl.classList.add('error');
      isValid = false;
    }

    // Phone
    const phoneEl  = document.getElementById('res-phone');
    const phoneErr = document.getElementById('res-phone-error');
    const digits   = phoneEl.value.trim().replace(/\D/g, '');
    if (!phoneEl.value.trim()) {
      phoneErr.textContent = 'Please enter your phone number.';
      phoneEl.classList.add('error');
      isValid = false;
    } else if (digits.length < 10) {
      phoneErr.textContent = 'Please enter a valid phone number.';
      phoneEl.classList.add('error');
      isValid = false;
    }

    // Guests
    const guestsEl  = document.getElementById('res-guests');
    const guestsErr = document.getElementById('res-guests-error');
    if (!guestsEl.value) {
      guestsErr.textContent = 'Please select a party size.';
      guestsEl.classList.add('error');
      isValid = false;
    }

    // Date
    const dateEl  = document.getElementById('res-date');
    const dateErr = document.getElementById('res-date-error');
    if (!dateEl.value) {
      dateErr.textContent = 'Please choose a preferred date.';
      dateEl.classList.add('error');
      isValid = false;
    }

    if (isValid) {
      const btn = reserveForm.querySelector('button[type="submit"]');
      btn.textContent = 'Request Sent! We\'ll Call to Confirm ✓';
      btn.disabled = true;
      btn.style.opacity = '0.75';

      setTimeout(() => {
        reserveForm.reset();
        btn.textContent = 'Request Reservation';
        btn.disabled = false;
        btn.style.opacity = '';
      }, 5000);
    } else {
      const firstError = reserveForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });

  // Clear errors on input
  ['res-name','res-phone','res-guests','res-date'].forEach(id => {
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
