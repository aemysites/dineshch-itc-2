/**
 * switchback — "Platform": alternating dark panels (copy + list beside an
 * illustration), every other panel mirrored.
 *
 * Decode tier: reconstructive (repeat group, one panel per row). Schema:
 * stardust/eds-schema/index.json (section 5).
 * Authored, per row: copy cell (eyebrow <p> before the <h3>, text <p>, <ul>,
 * optional link <p>) | image cell (<picture>). Cells may come in either order and
 * may be flattened into one cell — the panel is classified by content. Mirroring
 * (n-switchback-reversed) follows the source rhythm by index: panels 1, 3, … reversed.
 * Illustrations are authored at 2x (retina PNG): the block halves the intrinsic size,
 * so a 952×788 upload renders at the source's 476×394.
 * Generated UI only: the action-link arrow. Source ids (GTM) via CTA_IDS.
 */

const CTA_IDS = {
  'explore the platform': 'cta-platform-explore',
};

const ARROW = '<span class="n-action-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" aria-hidden="true"><g stroke="currentColor" stroke-linecap="square" stroke-width="1.564"><path stroke-linejoin="round" d="M3.417 10.556 9.4 4.572"/><path d="M9.88 9.381V4.093H4.59"/></g></svg></span>';

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

function wrapNode(node, className) {
  const w = el('div', className);
  w.append(node);
  return w;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function buildPanel(row, index) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const panel = el('div', `n-switchback ntl-sidebar-left item${index % 2 === 0 ? ' n-switchback-reversed' : ''}`, { 'data-theme': 'dark' });
  const content = el('div', 'n-switchback-content ntl-flow');
  const mediaBox = el('div', 'n-switchback-media');
  const heading = nodes.find(isHeading);
  const hIdx = heading ? nodes.indexOf(heading) : -1;
  nodes.forEach((n, i) => {
    const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (pic && !n.textContent.trim()) {
      mediaBox.append(n);
    } else if (n === heading) {
      content.append(wrapNode(n, 'n-switchback-heading h5'));
    } else if (n.tagName === 'UL' || n.tagName === 'OL') {
      content.append(wrapNode(n, 'n-switchback-list'));
    } else if (n.tagName === 'P' && n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()) {
      const a = n.querySelector('a');
      const label = a.textContent.trim().toLowerCase();
      a.id = CTA_IDS[label] || `cta-platform-${slug(label)}`;
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      n.classList.remove('button-wrapper');
      a.insertAdjacentHTML('beforeend', ARROW);
      content.append(wrapNode(n, 'n-switchback-cta'));
    } else if (i < hIdx) {
      content.append(wrapNode(n, 'eyebrow'));
    } else {
      content.append(wrapNode(n, 'text'));
    }
  });
  panel.append(content, mediaBox);
  return panel;
}

function halveRetina(img) {
  const apply = () => {
    const w = Number(img.getAttribute('width')) || img.naturalWidth;
    const h = Number(img.getAttribute('height')) || img.naturalHeight;
    if (!w || !h) return false;
    img.style.width = `${Math.round(w / 2)}px`;
    img.style.aspectRatio = `${w} / ${h}`;
    return true;
  };
  if (!apply()) img.addEventListener('load', apply, { once: true });
}

export default async function decorate(block) {
  const section = el('div', 'n-page-section ntl-breakout');
  section.id = 'section-platform';
  const group = el('div', 'n-switchback-group');
  [...block.children].forEach((row, i) => group.append(buildPanel(row, i)));
  group.querySelectorAll('.n-switchback-media img').forEach(halveRetina);
  section.append(group);
  block.replaceChildren(section);
}
