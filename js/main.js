const COMPONENTS = ['navbar', 'hero', 'projetos', 'sobre', 'contato', 'footer'];

async function loadComponents() {
  await Promise.all(
    COMPONENTS.map(async (name) => {
      const slot = document.getElementById(name);
      if (!slot) return;
      // no-cache revalida antes de reusar: evita servir HTML antigo junto de CSS novo após um deploy
      const res = await fetch(`components/${name}.html`, { cache: 'no-cache' });
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

function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Fecha ao escolher um destino, ao tocar fora ou com Esc
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Ao voltar para o desktop o painel não pode continuar "aberto"
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
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
  initNavToggle();
  initSmoothAnchors();
  initScrollReveal();
  initCopyEmail();
}

init();
