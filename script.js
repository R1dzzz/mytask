// FILTER
function filterCat(cat, btn) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.category').forEach(c => {
    c.style.display = (cat === 'all' || c.id === 'cat-' + cat) ? '' : 'none';
  });
  const q = document.getElementById('searchInput').value.trim();
  if (q) applySearch(q.toLowerCase());
}

// SEARCH
function handleSearch() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  applySearch(q);
}
function applySearch(q) {
  let vis = 0;
  document.querySelectorAll('.app-card').forEach(card => {
    if (card.closest('.category').style.display === 'none') { card.classList.add('hidden'); return; }
    const match = !q || (card.dataset.name || '').includes(q) || card.innerText.toLowerCase().includes(q);
    card.classList.toggle('hidden', !match);
    if (match) vis++;
  });
  document.getElementById('noResults').classList.toggle('show', vis === 0 && q !== '');
}

// SCROLL REVEAL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.app-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(18px)';
  card.style.transition = `opacity .4s ease ${i * 0.035}s, transform .4s ease ${i * 0.035}s, border-color .3s, box-shadow .3s, background .3s`;
  obs.observe(card);
});
