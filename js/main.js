const COMPONENTS = ['navbar', 'hero', 'projetos', 'sobre', 'contato', 'footer'];

async function loadComponents() {
  await Promise.all(
    COMPONENTS.map(async (name) => {
      const slot = document.getElementById(name);
      if (!slot) return;
      const res = await fetch(`components/${name}.html`);
      slot.innerHTML = await res.text();
    })
  );
}

function initSmoothAnchors() {
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

function initScrollReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  if (reduced) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => observer.observe(el));
}

function initCopyEmail() {
  const btn = document.getElementById('copy-email-btn');
  const label = document.getElementById('copy-email-label');
  if (!btn || !label) return;
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText('luizlopeszx1@gmail.com');
    label.textContent = 'copiado ✓';
    setTimeout(() => {
      label.textContent = 'copiar';
    }, 2000);
  });
}

async function init() {
  await loadComponents();
  initSmoothAnchors();
  initScrollReveal();
  initCopyEmail();
}

init();
