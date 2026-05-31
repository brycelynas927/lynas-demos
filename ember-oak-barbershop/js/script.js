// Sticky nav
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Form submit
const bookForm = document.getElementById('bookForm');
if (bookForm) {
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = bookForm.querySelector('button[type="submit"]');
    btn.textContent = 'Request Sent!';
    btn.style.background = '#4ade80';
    btn.style.color = '#0e0b08';
    setTimeout(() => {
      btn.textContent = 'Send Booking Request';
      btn.style.background = '';
      btn.style.color = '';
      bookForm.reset();
    }, 3000);
  });
}
