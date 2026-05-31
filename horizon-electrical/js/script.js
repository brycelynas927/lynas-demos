// Form submit
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = quoteForm.querySelector('button[type="submit"]');
    btn.textContent = 'Quote Request Sent!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = 'Send Quote Request';
      btn.style.background = '';
      quoteForm.reset();
    }, 3000);
  });
}
