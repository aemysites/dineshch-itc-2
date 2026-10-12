import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import toSymbolIcon from '../../scripts/svg-symbol.js';
import ICONS from './footer-icons.js';

/**
 * Netlify site footer — template-slotted from the gated prototype (parts/footer.html).
 * Content comes from the authored /footer document; each section carries a section-metadata
 * `style` naming its role: top (logo link + social list), columns (h2 + list per column),
 * newsletter (heading), legal (link list + copyright). Authored nodes are MOVED into the
 * template; the newsletter form, cookie-settings and theme controls and the floating
 * Ask Netlify button are UI generated here (the form has no backend wired).
 * Link ids (cta-footer-*, cta-legal-footer-*) derive from the authored text (GTM click rules).
 * The mobile <details> accordions are presentational clones of the authored columns (EW4).
 */

function slugify(text) {
  return (text || '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v === true ? '' : v);
  });
  node.append(...children.filter((c) => c !== null && c !== undefined));
  return node;
}

/* every footer icon but the logo is an astro-icon on the source (<symbol id="ai:*"> + <use>) */
function icon(name) {
  const tpl = document.createElement('template');
  tpl.innerHTML = ICONS[name] || '';
  const svg = tpl.content.firstElementChild;
  return name === 'logo' ? svg : toSymbolIcon(svg);
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
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

function contentOf(fragment, role) {
  const section = fragment.querySelector(`.section.${role}`);
  if (!section) return [];
  const wrappers = section.querySelectorAll(':scope > .default-content-wrapper');
  const nodes = [];
  (wrappers.length ? [...wrappers] : [section]).forEach((w) => nodes.push(...w.children));
  return nodes.filter((n) => !n.matches('.section-metadata, .metadata'));
}

function hideText(a) {
  const span = el('span', { class: 'visually-hidden' });
  span.append(...a.childNodes);
  a.append(span);
}

function buildTop(nodes) {
  const top = el('div', { class: 'wrapper footer-top l-cluster' });
  const logoP = nodes.find((n) => n.matches('p') && n.querySelector('a'));
  if (logoP) {
    const a = logoP.querySelector('a');
    a.id = 'cta-footer-netlifyLogo';
    hideText(a);
    const logo = icon('logo');
    a.append(' ', logo);
    logoP.classList.add('footer-logo-wrapper');
    top.append(logoP);
  }
  const social = nodes.find((n) => n.matches('ul'));
  if (social) {
    unwrapListParagraphs(social);
    social.classList.add('social', 'l-cluster');
    social.setAttribute('role', 'list');
    social.querySelectorAll(':scope > li > a').forEach((a) => {
      const s = slugify(a.textContent);
      a.id = `cta-footer-${s}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      hideText(a);
      const svg = icon(s);
      if (svg) a.prepend(svg, ' ');
    });
    top.append(social);
  }
  return top;
}

function buildColumns(nodes) {
  const nav = el('nav', { class: 'footer-nav', 'aria-label': 'Footer' });
  let heading = null;
  nodes.forEach((node) => {
    if (node.matches('h2, h3, h4')) {
      heading = node;
      return;
    }
    if (!node.matches('ul')) return;
    const col = slugify(heading ? heading.textContent : '');
    unwrapListParagraphs(node);
    node.classList.add('l-stack', 'l-stack-xs');
    node.setAttribute('role', 'list');
    node.querySelectorAll(':scope > li > a').forEach((a) => {
      a.id = `cta-footer-${col}-${slugify(a.textContent)}`;
    });
    if (heading) heading.classList.add('text-0', 'font-bold', 'tracking-tight');

    // narrow (< 750px): a presentational <details> clone of the authored column
    const summary = el('summary');
    if (heading) summary.append(stripInstrumentation(heading.cloneNode(true)), ' ');
    summary.append(icon('chevron'));
    const list = stripInstrumentation(node.cloneNode(true));
    list.querySelectorAll('a[id]').forEach((a) => {
      a.id = a.id.replace(/^cta-footer-/, 'cta-footer-sm-');
    });
    const narrow = el('details', { class: 'section l-stack', 'data-variant': 'narrow' }, summary, list);

    // wide: the authored heading + list, moved
    const wide = el('section', { class: 'section l-stack', 'data-variant': 'wide' }, heading, node);
    nav.append(narrow, wide);
    heading = null;
  });
  return nav;
}

function buildNewsletter(nodes) {
  const section = el('section', { class: 'newsletter-form l-stack l-stack-small l-center' });
  const heading = nodes.find((n) => n.matches('h2, h3, p'));
  if (heading) {
    heading.classList.add('text-0');
    section.append(heading);
  }
  const input = el('input', {
    class: 'hs-input',
    id: 'newsletter-email',
    name: 'email',
    type: 'email',
    inputmode: 'email',
    autocomplete: 'email',
    required: true,
  });
  const form = el(
    'form',
    {
      class: 'hs-form l-cluster',
      action: '',
      method: 'post',
      'data-form': 'hubspot-52611e5e-cc55-4960-bf4a-a2adb36291f6',
    },
    el(
      'div',
      { class: 'hs-form-field' },
      el(
        'label',
        { for: 'newsletter-email' },
        el('span', {}, 'Email'),
        el('span', { class: 'hs-form-required' }, '*'),
      ),
      input,
    ),
    el(
      'div',
      { class: 'hs-submit' },
      el('input', {
        class: 'button button-primary', type: 'submit', value: 'Subscribe', 'data-type': 'primary',
      }),
    ),
  );
  // no backend is wired for the signup (dynamics decision) — keep the UI, never post
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reportValidity();
  });
  section.append(form);
  return section;
}

function buildLegal(nodes) {
  const row = el('div', { class: 'wrapper footer-legal l-cluster' });
  const list = nodes.find((n) => n.matches('ul'));
  if (list) {
    unwrapListParagraphs(list);
    list.classList.add('legal', 'l-cluster');
    list.setAttribute('role', 'list');
    list.querySelectorAll(':scope > li > a').forEach((a) => {
      a.id = `cta-legal-footer-${slugify(a.textContent)}`;
    });
    const cookies = el(
      'button',
      { id: 'cta-legal-footer-cookie-settings-toggle', type: 'button', 'data-type': 'reset' },
      'Cookie Settings',
    );
    cookies.addEventListener('click', () => {
      if (window.OneTrust && typeof window.OneTrust.ToggleInfoDisplay === 'function') {
        window.OneTrust.ToggleInfoDisplay();
      }
    });
    list.append(el('li', {}, cookies));
    row.append(list);
  }
  nodes.filter((n) => n.matches('p')).forEach((p) => {
    p.classList.add('copyright');
    row.append(p);
  });
  return row;
}

function buildThemeSelect() {
  const root = document.documentElement;
  const select = el(
    'select',
    { id: 'site-theme-select' },
    el('option', { value: '', selected: true }, 'System'),
    el('option', { value: 'dark' }, 'Dark'),
    el('option', { value: 'light' }, 'Light'),
  );
  if (root.dataset.theme) select.value = root.dataset.theme;
  select.addEventListener('change', () => {
    if (select.value) root.dataset.theme = select.value;
    else delete root.dataset.theme;
  });
  return el(
    'label',
    { class: 'theme-switcher site-theme-select' },
    el('span', { class: 'visually-hidden' }, 'Site theme'),
    select,
  );
}

function buildAskButton() {
  return el(
    'div',
    { class: 'ask-netlify-button' },
    el(
      'button',
      {
        class: 'button visible',
        id: 'cta-ask-netlify-chat',
        type: 'button',
        'data-type': 'primary',
        'data-ntl-search-toggle': 'ask',
      },
      icon('ask-netlify'),
      ' Ask Netlify',
    ),
  );
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  foldSectionMetadata(fragment);

  const footer = el(
    'div',
    { class: 'site-footer l-breakout l-stack' },
    buildTop(contentOf(fragment, 'top')),
    buildColumns(contentOf(fragment, 'columns')),
    buildNewsletter(contentOf(fragment, 'newsletter')),
    buildLegal(contentOf(fragment, 'legal')),
    buildThemeSelect(),
  );
  block.replaceChildren(footer, buildAskButton());
}
