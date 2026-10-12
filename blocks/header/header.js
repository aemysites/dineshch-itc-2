import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import toSymbolIcon from '../../scripts/svg-symbol.js';
import ICONS from './header-icons.js';

/**
 * Netlify site header — template-slotted from the gated prototype (parts/header.html).
 * Content comes from the authored /nav document; each section carries a section-metadata
 * `style` naming its role: announcement, brand, compact, menu, panel (one per menu item
 * without a link, in order), actions, search. Authored nodes are MOVED into the template;
 * the chrome around them (toggles, dialog controls, icons) is UI generated here.
 * Link ids (mainNav-*, main-nav-*, nav-*, cta-*) are derived from the authored link text so
 * the GTM click rules that key off them keep matching.
 */

const DESKTOP = window.matchMedia('(width >= 1085px)');
const NAV_ICONS = ['claude', 'codex', 'cursor', 'astro', 'tan-stack', 'next-js', 'wordpress', 'react'];
const ID_ALIASES = { 'log-in': 'login' };

export function slugify(text) {
  return (text || '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const idSlug = (text) => {
  const s = slugify(text);
  return ID_ALIASES[s] || s;
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v === true ? '' : v);
  });
  node.append(...children.filter((c) => c !== null && c !== undefined));
  return node;
}

/* icons the source renders through astro-icon (<symbol id="ai:*"> + <use>) */
const SYMBOL_ICONS = ['close', 'search', 'menu', 'chevron', ...NAV_ICONS];

function icon(name) {
  const tpl = document.createElement('template');
  tpl.innerHTML = ICONS[name] || '';
  const svg = tpl.content.firstElementChild;
  return SYMBOL_ICONS.includes(name) ? toSymbolIcon(svg) : svg;
}

/** the source's quick-search icons carry a stray ";" text node (it is part of each link's
 * text content there); kept so the dialog's link text matches */
function searchIcon(name) {
  const svg = icon(name);
  if (svg) svg.append(';');
  return svg;
}

const hidden = (text) => el('span', { class: 'visually-hidden' }, text);

/** wrap the element's own text nodes into a span (presentation refinement, nodes are moved) */
function wrapText(node, attrs) {
  const span = el('span', attrs);
  [...node.childNodes].forEach((n) => span.append(n));
  node.append(span);
  return span;
}

/** the pipeline wraps list-item content in <p> on live (#98) — unwrap it */
function unwrapListParagraphs(root) {
  root.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
}

/** a section-metadata block the pipeline did not fold (older render) still names the role */
function foldSectionMetadata(fragment) {
  fragment.querySelectorAll('.section .section-metadata').forEach((meta) => {
    const section = meta.closest('.section');
    [...meta.children].forEach((row) => {
      const [key, value] = [...row.children].map((c) => c.textContent.trim().toLowerCase());
      if (key === 'style' && value) {
        value.split(/[\s,]+/).filter(Boolean).forEach((v) => section.classList.add(v));
      }
    });
    const wrapper = meta.parentElement;
    meta.remove();
    if (wrapper && !wrapper.children.length && wrapper !== section) wrapper.remove();
  });
}

function sectionOf(fragment, role) {
  return fragment.querySelector(`.section.${role}`);
}

function contentOf(section) {
  if (!section) return [];
  const wrappers = section.querySelectorAll(':scope > .default-content-wrapper');
  const nodes = [];
  (wrappers.length ? [...wrappers] : [section]).forEach((w) => nodes.push(...w.children));
  return nodes.filter((n) => !n.matches('.section-metadata, .metadata'));
}

function buildAnnouncement(section) {
  const p = contentOf(section).find((n) => n.matches('p'));
  if (!p) return null;
  const link = p.querySelector('a');
  const bar = el('div', { class: 'announcement-bar', 'data-href': link ? link.href : null });
  bar.hidden = true;
  if (link) {
    link.classList.add('announcement-bar-link');
    link.id = 'cta-header-announcementBar';
    const lead = [];
    let n = p.firstChild;
    while (n && n !== link) {
      lead.push(n);
      n = n.nextSibling;
    }
    if (lead.length) {
      const span = el('span');
      span.append(...lead);
      p.prepend(span, ' ');
    }
  }
  const close = el(
    'button',
    { class: 'close', id: 'cta-header-announcementBar-close', type: 'reset' },
    hidden('Close announcement bar'),
    ' ',
    icon('close'),
  );
  close.addEventListener('click', (e) => {
    e.preventDefault();
    bar.hidden = true;
    document.documentElement.dataset.announcementState = 'hidden';
  });
  bar.append(p, close);
  return bar;
}

function buildLogo(section) {
  const p = contentOf(section).find((n) => n.querySelector('a'));
  const a = p ? p.querySelector('a') : el('a', { href: '/' }, 'Go to homepage');
  a.classList.add('site-logo');
  a.id = 'mainNav-netlifyLogo';
  wrapText(a, { class: 'visually-hidden' });
  a.append(' ', icon('logo'));
  if (p) {
    p.classList.add('site-logo-wrapper');
    return p;
  }
  return a;
}

function buildCompact(section) {
  const ul = contentOf(section).find((n) => n.matches('ul'))
    || el('ul');
  unwrapListParagraphs(ul);
  ul.classList.add('menu');
  ul.dataset.variant = 'compact';
  ul.setAttribute('role', 'list');
  ul.querySelectorAll(':scope > li > a').forEach((a) => {
    const s = idSlug(a.textContent);
    a.id = `main-nav-compact-${s}`;
    if (/\/(login|signup)\b/.test(a.href)) a.dataset.authHide = '';
    else if (/\/contact\b/.test(a.href)) a.dataset.authShow = '';
  });
  const search = el(
    'button',
    { class: 'site-search-toggle', id: 'main-nav-compact-search', type: 'button' },
    hidden('Search'),
    ' ',
    icon('search'),
  );
  ul.prepend(el('li', {}, search));
  ul.append(el('li', {}, el('div', { class: 'auth-nav-slot' })));
  return ul;
}

/** split a panel section into the prototype's columns: a new column at each <h3>, and at a
 * paragraph that follows a list (the closing promo) */
function buildPanel(section, slug) {
  const panel = el('div', { class: 'submenu', id: `${slug}-submenu` });
  let col = null;
  let sawList = false;
  contentOf(section).forEach((node) => {
    if (!col || node.matches('h3') || (sawList && node.matches('p'))) {
      col = el('div', { class: 'section l-stack' });
      panel.append(col);
      sawList = false;
    }
    if (node.matches('ul')) {
      sawList = true;
      unwrapListParagraphs(node);
      node.classList.add('l-stack');
      node.setAttribute('role', 'list');
      node.querySelectorAll(':scope > li').forEach((li) => {
        const a = li.querySelector('a');
        if (!a) return;
        const s = slugify(a.textContent);
        a.id = `nav-${s}`;
        if (NAV_ICONS.includes(s)) li.prepend(icon(s), ' ');
      });
    }
    col.append(node);
  });
  return panel;
}

function buildMenu(section, panels) {
  const ul = contentOf(section).find((n) => n.matches('ul')) || el('ul');
  unwrapListParagraphs(ul);
  ul.classList.add('menu');
  ul.id = 'main-menu';
  ul.setAttribute('role', 'list');
  let panelIndex = 0;
  let searchAnchor = null;
  [...ul.children].forEach((li) => {
    const a = li.querySelector(':scope > a');
    if (a) {
      const s = idSlug(a.textContent);
      a.id = `main-nav-${s}`;
      if (/\/(login|signup)\b/.test(a.href)) a.dataset.authHide = '';
      if (s === 'contact' && !searchAnchor) searchAnchor = li;
      return;
    }
    const s = slugify(li.textContent);
    li.classList.add('has-submenu');
    wrapText(li, { id: `main-nav-${s}` });
    const toggle = el(
      'button',
      {
        class: 'submenu-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': `${s}-submenu`,
      },
      hidden(`Toggle ${s.replace(/-/g, ' ')} submenu`),
      ' ',
      icon('chevron'),
    );
    li.append(toggle);
    const panelSection = panels[panelIndex];
    panelIndex += 1;
    if (panelSection) li.append(buildPanel(panelSection, s));
  });
  const search = el(
    'li',
    { class: 'nav-search' },
    el(
      'button',
      { class: 'site-search-toggle', id: 'cta-main-nav-search', type: 'button' },
      hidden('Search'),
      ' ',
      icon('search'),
    ),
  );
  if (searchAnchor) searchAnchor.before(search);
  else ul.append(search);
  return ul;
}

function buildActions(section) {
  return contentOf(section).filter((n) => n.matches('p') && n.querySelector('a')).map((p) => {
    const a = p.querySelector('a');
    a.classList.add('button');
    a.dataset.type = 'primary';
    const auth = /\/signup\b/.test(a.href) ? 'authHide' : 'authShow';
    a.id = auth === 'authHide' ? 'signup' : 'go-to-dashboard';
    a.dataset[auth] = '';
    p.dataset[auth] = '';
    p.classList.add('nav-action');
    return p;
  });
}

const SEARCH_ICON_BY_HREF = [
  [/docs\.netlify\.com/, 'docs'],
  [/answers\.netlify\.com/, 'forums'],
  [/\/support\b/, 'support'],
  [/\/contact\/sales\b/, 'demo'],
];

function searchLinkParts(label, excerpt, leadIcon) {
  const title = el('p', { class: 'n-search-link-title' }, label);
  const body = el('div', { class: 'n-search-link-body' }, title, excerpt);
  return [
    el('span', { class: 'n-search-link-icon' }, searchIcon(leadIcon)),
    body,
    el('div', { class: 'n-search-link-icon' }, searchIcon('caret-right')),
  ];
}

/* the "Ask Netlify AI" state's opening prompts, as the source renders them (the AI chat
 * service itself is host-bound and not replicated: the state is markup only) */
const ASK_QUESTIONS = [
  'How do I deploy an app to Netlify using AI?',
  'How does Netlify simplify my CI/CD pipeline?',
  'How does Netlify help improve my site’s Core Web Vitals?',
  'What are the benefits of using Netlify with a headless CMS?',
  'What are the benefits of hosting on Netlify’s edge network?',
];

function buildAskChat(onBack) {
  const back = el(
    'button',
    {
      class: 'n-ask-button-back button', type: 'button', 'aria-label': 'Return to search',
    },
    searchIcon('caret-right'),
    'Search',
  );
  back.addEventListener('click', onBack);
  const input = el('input', {
    type: 'text', placeholder: 'Ask a question...', class: 'n-ask-input n-search-input',
  });
  const submit = el(
    'button',
    {
      type: 'submit', disabled: true, 'aria-label': 'Send message', class: 'n-ask-form-submit',
    },
    icon('arrow-right'),
  );
  const list = el('ul', { role: 'list', class: 'n-ask-question-list' });
  ASK_QUESTIONS.forEach((q, i) => {
    const btn = el(
      'button',
      { class: 'n-ask-question', type: 'button' },
      q,
      searchIcon('caret-right'),
    );
    btn.addEventListener('click', () => {
      input.value = q;
      submit.disabled = false;
      input.focus();
    });
    list.append(el('li', {
      class: 'n-ask-question-list-item', style: `animation-delay: ${(i + 1) / 10}s;`,
    }, btn));
  });
  const recaptcha = el(
    'div',
    { id: 'recaptcha', class: 'n-popover-container n-popover-top' },
    el(
      'span',
      { 'aria-describedby': 'recaptcha-popover', class: 'n-popover-trigger' },
      'protected by reCAPTCHA',
    ),
    el(
      'div',
      { id: 'recaptcha-popover', role: 'tooltip', class: 'n-popover' },
      el(
        'p',
        {},
        'This site is protected by reCAPTCHA and the Google ',
        el('a', { href: 'https://policies.google.com/privacy' }, 'Privacy Policy'),
        ' and ',
        el('a', { href: 'https://policies.google.com/terms' }, 'Terms of Service'),
        ' apply.',
      ),
    ),
  );
  const form = el('form', { class: 'n-ask-form n-search-input-wrapper' }, input, recaptcha, submit);
  input.addEventListener('input', () => {
    submit.disabled = !input.value.trim();
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  const chat = el(
    'div',
    { class: 'n-ask-chat-container' },
    back,
    el('div', { class: 'n-ask-conversation n-search-window' }, list),
    form,
  );
  chat.focusInput = () => input.focus();
  return chat;
}

/** typeahead: the header's and footer's own links whose text matches the term */
function searchSuggestions(term) {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  const seen = new Set();
  return [...document.querySelectorAll('header .submenu a[href], footer a[href]')]
    .filter((a) => {
      const text = a.textContent.trim();
      if (!text || seen.has(a.href) || !text.toLowerCase().includes(q)) return false;
      seen.add(a.href);
      return true;
    })
    .slice(0, 5);
}

function buildSearchDialog(section) {
  const dlg = el('dialog', {
    class: 'n-search-modal quick-search-modal',
    id: 'site-search',
    'data-state': 'search',
    'aria-label': 'Search',
  });
  const input = el('input', {
    type: 'text',
    id: 'site-search-input',
    name: 'search',
    placeholder: 'Search...',
    class: 'n-search-input',
    autocomplete: 'off',
  });
  const clear = el('button', { class: 'n-search-input-clear', type: 'button' }, 'Clear');
  const label = el(
    'label',
    { for: 'site-search-input', class: 'n-search-label' },
    hidden('Search'),
    el('div', { class: 'n-search-icon' }, searchIcon('search-glass')),
  );
  const links = el('div', { class: 'n-search-links' });
  const askLabel = el('span', { class: 'n-search-link-label' }, 'Ask Netlify AI');
  const ask = el(
    'button',
    { class: 'n-search-link', type: 'button', 'data-search-action': 'ask' },
    ...searchLinkParts(
      askLabel,
      el('p', { class: 'n-search-link-excerpt' }, 'Get instant answers, powered by AI'),
      'ask',
    ),
  );
  links.append(ask);
  const idle = [];
  contentOf(section).forEach((node) => {
    if (node.matches('h2, h3')) node.classList.add('n-search-heading');
    if (node.matches('ul')) {
      unwrapListParagraphs(node);
      node.setAttribute('role', 'list');
      node.querySelectorAll(':scope > li > a').forEach((a) => {
        a.classList.add('n-search-link');
        const found = SEARCH_ICON_BY_HREF.find(([re]) => re.test(a.href));
        const labelSpan = el('span', { class: 'n-search-link-label' });
        labelSpan.append(...a.childNodes);
        a.append(...searchLinkParts(labelSpan, null, found ? found[1] : 'docs'));
      });
    }
    idle.push(node);
  });
  const theme = el(
    'button',
    { class: 'n-search-link', type: 'button', 'data-search-action': 'theme' },
    ...searchLinkParts(el('span', { class: 'n-search-link-label' }, 'Toggle theme'), null, 'theme'),
  );
  idle.push(el('h2', { class: 'n-search-heading' }, 'Actions'), theme);
  const results = el('ul', { role: 'list', class: 'n-results-list', hidden: true });
  links.append(...idle, results);
  const key = (...keys) => el('span', { class: 'n-keyboard-key' }, ...keys.map((k) => el('span', {}, k)));
  const container = el(
    'div',
    { class: 'n-search-container' },
    el('div', { class: 'n-search-input-wrapper' }, label, input, clear),
    el('div', { class: 'n-search-window' }, links),
    el(
      'div',
      { class: 'n-search-footer' },
      el('p', { class: 'n-search-footer-tip' }, key('Esc'), 'to close'),
      el('p', { class: 'n-search-footer-tip' }, key('Tab'), el('span', {}, 'or'), key('↑', '↓'), 'to navigate'),
    ),
  );
  dlg.append(container);

  const root = document.documentElement;
  let chat = null;
  const setState = (state) => {
    dlg.dataset.state = state;
    if (state === 'ask') {
      if (!chat) {
        chat = buildAskChat(() => {
          setState('search');
          input.focus();
        });
        container.append(chat);
      }
      chat.focusInput();
    }
  };
  const showResults = () => {
    const term = input.value;
    const found = searchSuggestions(term);
    askLabel.replaceChildren('Ask Netlify AI');
    if (term.trim()) askLabel.append(': ', el('span', { class: 'n-search-term' }, term.trim()));
    results.replaceChildren(...found.map((a) => el(
      'li',
      { class: 'n-results-list-item' },
      el(
        'a',
        { href: a.href, class: 'n-search-link' },
        ...searchLinkParts(
          el('span', { class: 'n-search-link-label' }, a.textContent.trim()),
          null,
          'page-with-lines',
        ),
      ),
    )));
    results.hidden = !term.trim();
    idle.forEach((n) => { n.hidden = !!term.trim(); });
  };
  const open = (state = 'search') => {
    if (!dlg.open) {
      dlg.showModal();
      // only an open dialog is modal; a closed one must not match [aria-modal=true]
      dlg.setAttribute('aria-modal', 'true');
    }
    setState(state);
    if (state === 'search') input.focus();
  };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.site-search-toggle, [data-ntl-search-toggle]');
    if (!t || typeof dlg.showModal !== 'function') return;
    e.preventDefault();
    open(t.dataset.ntlSearchToggle === 'ask' ? 'ask' : 'search');
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dlg.open) dlg.close();
      else open();
    }
  });
  dlg.addEventListener('click', (e) => {
    if (e.target !== dlg) return;
    const r = dlg.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right
      && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dlg.close();
  });
  dlg.addEventListener('close', () => {
    dlg.removeAttribute('aria-modal');
    dlg.dataset.state = 'search';
  });
  input.addEventListener('input', showResults);
  clear.addEventListener('click', () => {
    input.value = '';
    showResults();
    input.focus();
  });
  ask.addEventListener('click', () => setState('ask'));
  theme.addEventListener('click', () => {
    const dark = root.dataset.theme === 'dark'
      || (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = dark ? 'light' : 'dark';
  });
  return dlg;
}

function wireMenus(header, burger) {
  const root = document.documentElement;
  const toggles = [...header.querySelectorAll('.submenu-toggle')];
  const closeAll = (except) => toggles.forEach((t) => {
    if (t !== except) t.setAttribute('aria-expanded', 'false');
  });
  // the drawer (< 1085px) lists every panel expanded, each an independent disclosure;
  // the desktop mega-menu starts closed and opens one panel at a time
  const syncToViewport = () => toggles.forEach((t) => {
    t.setAttribute('aria-expanded', String(!DESKTOP.matches));
  });
  syncToViewport();
  DESKTOP.addEventListener('change', syncToViewport);
  toggles.forEach((t) => {
    t.addEventListener('click', () => {
      const isOpen = t.getAttribute('aria-expanded') === 'true';
      if (DESKTOP.matches) closeAll(t);
      t.setAttribute('aria-expanded', String(!isOpen));
    });
    const li = t.closest('li');
    li.addEventListener('mouseleave', () => {
      if (DESKTOP.matches) t.setAttribute('aria-expanded', 'false');
    });
    li.addEventListener('focusout', (e) => {
      if (!li.contains(e.relatedTarget) && DESKTOP.matches) t.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !DESKTOP.matches) return;
    const open = toggles.find((t) => t.getAttribute('aria-expanded') === 'true');
    if (open) {
      open.setAttribute('aria-expanded', 'false');
      open.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (DESKTOP.matches && !header.contains(e.target)) closeAll();
  });

  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    if (open) root.setAttribute('data-site-nav-open', '');
    else root.removeAttribute('data-site-nav-open');
  };
  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  DESKTOP.addEventListener('change', (m) => {
    if (m.matches) setOpen(false);
  });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  foldSectionMetadata(fragment);

  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  const header = el('div', { class: 'site-header' });
  const announcement = buildAnnouncement(sectionOf(fragment, 'announcement'));
  const nav = el(
    'nav',
    { class: 'site-navigation', id: 'site-nav', 'aria-labelledby': 'site-nav-label' },
    el('h2', { class: 'visually-hidden', id: 'site-nav-label' }, 'Site navigation'),
  );
  nav.append(buildLogo(sectionOf(fragment, 'brand')));
  nav.append(el('a', { class: 'skip-to-content', href: '#main' }, 'Skip to content'));
  nav.append(buildCompact(sectionOf(fragment, 'compact')));
  const burger = el(
    'button',
    {
      class: 'nav-toggle',
      id: 'main-nav-compact-hamburger',
      type: 'button',
      'aria-expanded': 'false',
      'aria-controls': 'main-menu',
    },
    hidden('Toggle main menu'),
    ' ',
    icon('menu'),
  );
  nav.append(burger);
  const panels = [...fragment.querySelectorAll('.section.panel')];
  nav.append(buildMenu(sectionOf(fragment, 'menu'), panels));
  nav.append(...buildActions(sectionOf(fragment, 'actions')));
  nav.append(el('div', { class: 'auth-nav-slot auth-nav-desktop' }));

  const wrapper = el('section', { class: 'wrapper l-breakout' }, nav);
  wrapper.append(buildSearchDialog(sectionOf(fragment, 'search')));
  if (announcement) header.append(announcement);
  header.append(wrapper);

  block.replaceChildren(header);
  wireMenus(header, burger);
}
