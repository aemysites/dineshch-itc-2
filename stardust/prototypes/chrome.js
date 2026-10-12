// chrome.js — minimal header/footer behaviour for the Netlify home replica.
// Submenus open on hover/focus via CSS (>= 1085px); the toggle buttons add click/keyboard control
// (and are the only way to expand on the compact nav). Hamburger toggles the mobile drawer.
// Announcement close hides the bar. Footer accordions are native <details>.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  if (!header) return;

  // announcement bar
  const bar = header.querySelector('.announcement-bar');
  const close = bar && bar.querySelector('.close');
  if (close) {
    close.addEventListener('click', (e) => {
      e.preventDefault();
      bar.hidden = true;
      root.dataset.announcementState = 'hidden';
    });
  }

  // submenus
  const toggles = [...header.querySelectorAll('.submenu-toggle')];
  const closeAll = (except) => toggles.forEach((t) => { if (t !== except) t.setAttribute('aria-expanded', 'false'); });
  toggles.forEach((t) => {
    t.addEventListener('click', () => {
      const open = t.getAttribute('aria-expanded') === 'true';
      closeAll(t);
      t.setAttribute('aria-expanded', String(!open));
    });
    const li = t.closest('li');
    if (li) {
      li.addEventListener('mouseleave', () => {
        if (window.matchMedia('(min-width: 1085px)').matches) t.setAttribute('aria-expanded', 'false');
      });
      li.addEventListener('focusout', (e) => {
        if (!li.contains(e.relatedTarget) && window.matchMedia('(min-width: 1085px)').matches) {
          t.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = toggles.find((t) => t.getAttribute('aria-expanded') === 'true');
    if (open) { open.setAttribute('aria-expanded', 'false'); open.focus(); }
  });
  document.addEventListener('click', (e) => { if (!header.contains(e.target)) closeAll(); });

  // mobile drawer
  const burger = header.querySelector('.nav-toggle');
  if (burger) {
    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      if (open) root.setAttribute('data-site-nav-open', '');
      else root.removeAttribute('data-site-nav-open');
    };
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    window.matchMedia('(min-width: 1085px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
  }
  // quick-search dialog (static: links only, nothing is sent over the network)
  const dlg = document.getElementById('site-search');
  if (dlg && typeof dlg.showModal === 'function') {
    const input = dlg.querySelector('.n-search-input');
    const open = (state = 'search') => {
      dlg.dataset.state = state;
      if (!dlg.open) dlg.showModal();
      if (input) input.focus();
    };
    document.querySelectorAll('.site-search-toggle, [data-ntl-search-toggle]').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        open(b.dataset.ntlSearchToggle === 'ask' ? 'ask' : 'search');
      });
    });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dlg.open) dlg.close(); else open();
      }
    });
    // backdrop click: the click lands on the <dialog> itself, outside its content box
    dlg.addEventListener('click', (e) => {
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dlg.close();
    });
    dlg.addEventListener('close', () => { dlg.dataset.state = 'search'; });
    const clear = dlg.querySelector('.n-search-input-clear');
    if (clear && input) clear.addEventListener('click', () => { input.value = ''; input.focus(); });
    const ask = dlg.querySelector('[data-search-action=ask]');
    if (ask) ask.addEventListener('click', () => { dlg.dataset.state = 'ask'; if (input) input.focus(); });
    const theme = dlg.querySelector('[data-search-action=theme]');
    if (theme) {
      theme.addEventListener('click', () => {
        const dark = root.dataset.theme === 'dark'
          || (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        root.dataset.theme = dark ? 'light' : 'dark';
      });
    }
  }
})();
