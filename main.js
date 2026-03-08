// ── HEADER ELEVATION ON SCROLL ──────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('elevated', window.scrollY > 10);
}, { passive: true });


// ── MOBILE MENU ──────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navEl      = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
  const open = menuToggle.classList.toggle('open');
  navEl.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-list a').forEach(a => {
  a.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    navEl.classList.remove('open');
    document.body.style.overflow = '';
  });
});


// ── SCROLL REVEAL ────────────────────────────
const revealEls = document.querySelectorAll('[data-reveal], .exp-row, .t-card, .skill-card, .project-card');

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  // stagger siblings in grids
  if (!el.style.transitionDelay) {
    const parent = el.parentElement;
    const siblings = [...parent.children].filter(c => c === el || c.matches('[data-reveal], .exp-row, .t-card, .skill-card, .project-card'));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 0.07}s`;
  }
  io.observe(el);
});


// ── ACTIVE NAV LINK ──────────────────────────
const sections = document.querySelectorAll('section[id], .hero');
const navLinks  = document.querySelectorAll('.nav-list a:not(.nav-btn)');

const sectionIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id || 'top';
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--teal)' : '';
    });
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionIO.observe(s));


// ── SMOOTH COUNTER ANIMATION ─────────────────
function animateCount(el, to, decimals, suffix, duration = 1200) {
  if (el._counted) return;
  el._counted = true;
  const start = performance.now();
  requestAnimationFrame(function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = eased * to;
    el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  });
}

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    // Hero card stats
    e.target.querySelectorAll('.ps-item strong').forEach(el => {
      const txt = el.textContent.trim();
      if (txt === '3.7')   animateCount(el, 3.7, 1, '');
      if (txt === '500+')  animateCount(el, 500, 0, '+');
      if (txt === '30K+')  animateCount(el, 30,  0, 'K+');
    });
  });
}, { threshold: 0.5 });

const heroCard = document.querySelector('.hero-card');
if (heroCard) counterIO.observe(heroCard);
