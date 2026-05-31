/* ==========================================================
   THE WORTLEY TABLE — script.js
   ========================================================== */

/* ----------------------------------------------------------
   1. MOBILE NAV TOGGLE
   ---------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ----------------------------------------------------------
   2. STICKY NAV SHADOW ON SCROLL
   ---------------------------------------------------------- */
const nav = document.getElementById('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });
}

/* ----------------------------------------------------------
   3. SMOOTH SCROLL FOR ANCHOR LINKS
      (Supplements CSS scroll-behavior for older browsers
      and links that need offset for the sticky nav.)
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = nav ? nav.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  });
});

/* ----------------------------------------------------------
   4. SCROLL-TRIGGERED FADE-IN (IntersectionObserver)
      Targets elements with class "fade-in"
      Adds class "visible" when they enter the viewport.
   ---------------------------------------------------------- */
const fadeTargets = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window && fadeTargets.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  fadeTargets.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   5. FORM VALIDATION
      Checks required fields before submit.
      Highlights empty fields, prevents submission.
   ---------------------------------------------------------- */
const reserveForm = document.getElementById('reserveForm');

if (reserveForm) {
  reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredFields = reserveForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      // Clear previous error state
      field.classList.remove('error');

      const value = field.value.trim();
      if (!value) {
        field.classList.add('error');
        isValid = false;
      }

      // Basic email format check
      if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          field.classList.add('error');
          isValid = false;
        }
      }
    });

    if (isValid) {
      // Demo site — no backend. Show a confirmation message.
      const submitBtn = reserveForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Request Received — We\'ll be in touch!';
      submitBtn.disabled = true;
      submitBtn.classList.add('btn--confirmed');

      // Reset after 5 seconds so the user can try again
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn--confirmed');
        reserveForm.reset();
      }, 5000);
    } else {
      // Scroll to the first error
      const firstError = reserveForm.querySelector('.error');
      if (firstError) {
        firstError.focus();
      }
    }
  });

  // Remove error class on input so feedback is immediate
  reserveForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });
}
