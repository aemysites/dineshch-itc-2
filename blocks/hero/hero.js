/**
 * hero — homepage prompt hero (dark): headline, lede, two CTAs, the "add Netlify to
 * your coding agent" copy command and the drag-and-drop deploy zone.
 *
 * Decode tier: template-slotted. Schema: stardust/eds-schema/index.json (section 1).
 * Authored (one cell, flat siblings, any order of rows):
 *   <h1> headline · <p> lede · CTA paragraphs (<strong><a> primary, <em><a> secondary)
 *   · <p> agent label (link-free, after the CTAs) · <p><code>command</code></p>
 * Generated UI only: the copy-button chrome (dots canvas, chevron, copy/check icons)
 * and the dropzone illustration (/blocks/hero/dropzone.svg, decorative, aria-hidden).
 * Source ids (GTM): kept through CTA_IDS, keyed by the authored link text.
 */

const CTA_IDS = {
  'start building': { id: 'cta-hero-get-started', blank: true },
  'request a demo': { id: 'cta-hero-contact-sales', blank: true },
};

const CHEVRON = '<svg width="0.63em" height="1em" aria-hidden="true" class="icon homepage-hero-agent-cta-chevron"><symbol id="ai:fa6-solid:chevron-right" viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256L73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></symbol><use href="#ai:fa6-solid:chevron-right"></use></svg>';
const COPY = '<svg width="1em" height="1em" aria-hidden="true" class="icon homepage-hero-agent-cta-copy"><symbol id="ai:local:copy" viewBox="0 0 24 24"><path fill="currentColor" d="M18 3a3 3 0 0 0-3-3H3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3zm-3-1.5A1.5 1.5 0 0 1 16.5 3v12a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 15V3A1.5 1.5 0 0 1 3 1.5zm6 6A1.5 1.5 0 0 1 22.5 9v12a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 21v-1.5H6V21a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-1.5v1.5z"></path></symbol><use href="#ai:local:copy"></use></svg>';
const CHECK = '<svg width="0.88em" height="1em" aria-hidden="true" class="icon homepage-hero-agent-cta-check"><symbol id="ai:fa6-solid:check" viewBox="0 0 448 512"><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7l233.4-233.3c12.5-12.5 32.8-12.5 45.3 0z"></path></symbol><use href="#ai:fa6-solid:check"></use></svg>';

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

const text = (n) => (n ? n.textContent.trim() : '');

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    out.push(...cell.children);
  });
  return out;
}

function buildAgentCta(codePara) {
  const btn = el('div', 'button secondary homepage-hero-agent-cta is-animated', {
    role: 'button',
    tabindex: '0',
    'aria-label': `Copy command: ${text(codePara)}`,
  });
  const canvas = el('canvas', 'homepage-hero-agent-cta-dots', { 'aria-hidden': 'true' });
  btn.append(canvas);
  btn.insertAdjacentHTML('beforeend', CHEVRON);
  btn.append(wrapNode(codePara, 'homepage-hero-agent-cta-text'));
  const stack = el('span', 'homepage-hero-agent-cta-icon-stack');
  stack.innerHTML = COPY + CHECK;
  btn.append(stack);

  let timer;
  const run = async () => {
    if (!(await copyText(text(codePara)))) return;
    btn.classList.add('is-copied');
    clearTimeout(timer);
    timer = setTimeout(() => btn.classList.remove('is-copied'), 2000);
  };
  btn.addEventListener('click', run);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      run();
    }
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.fillStyle = getComputedStyle(canvas).color;
      const step = 6;
      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    canvas.addEventListener('animationstart', draw, { once: true });
  }
  return btn;
}

function buildDropzone() {
  const dz = el('div', 'n-dropzone is-bare dz-hero', {
    'data-state': 'idle',
    role: 'button',
    tabindex: '0',
    'aria-busy': 'false',
    'aria-label': 'Drop a site folder or zip here to deploy it, or press Enter to browse for files',
  });
  const content = el('div', 'n-dropzone-content');
  // placeholder keeps the 630×373 box until the illustration arrives (no CLS)
  content.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="630" height="373" fill="none" viewBox="0 0 630 373" aria-hidden="true"></svg><span class="dz-hero-spinner" aria-hidden="true"></span>';
  const input = el('input', '', { type: 'file', hidden: '', multiple: '' });
  dz.append(content, input);

  const base = (window.hlx && window.hlx.codeBasePath) || '';
  fetch(`${base}/blocks/hero/dropzone.svg`)
    .then((r) => (r.ok ? r.text() : ''))
    .then((svgText) => {
      if (!svgText) return;
      const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
      const svg = doc.documentElement;
      if (svg && svg.nodeName === 'svg') {
        content.firstElementChild.replaceWith(document.importNode(svg, true));
      }
    })
    .catch(() => {});

  const browse = () => input.click();
  dz.addEventListener('click', browse);
  dz.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      browse();
    }
  });
  let depth = 0;
  dz.addEventListener('dragenter', (e) => {
    e.preventDefault();
    depth += 1;
    dz.classList.add('is-active');
  });
  dz.addEventListener('dragover', (e) => e.preventDefault());
  dz.addEventListener('dragleave', () => {
    depth = Math.max(0, depth - 1);
    if (!depth) dz.classList.remove('is-active');
  });
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    depth = 0;
    dz.classList.remove('is-active');
  });
  return dz;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ctas = nodes.filter((n) => n.tagName === 'P' && n.querySelector('a'));
  const codePara = nodes.find((n) => n.tagName === 'P' && n.querySelector('code') && !n.querySelector('a'));
  const plain = nodes.filter((n) => n.tagName === 'P' && !n.querySelector('a, code, picture, img'));
  const hIdx = heading ? nodes.indexOf(heading) : -1;
  const lastCta = ctas.length ? nodes.indexOf(ctas[ctas.length - 1]) : -1;
  const at = (n) => nodes.indexOf(n);
  const lede = plain.find((p) => at(p) > hIdx && (lastCta < 0 || at(p) < lastCta));
  const label = plain.find((p) => p !== lede && nodes.indexOf(p) > lastCta);
  const consumed = new Set([heading, lede, label, codePara, ...ctas]);

  const section = el('div', 'n-page-section ntl-breakout n-page-hero-graphic homepage-hero', { 'data-theme': 'dark' });
  const grid = el('div', 'n-page-hero-graphic-container ntl-flex-grid');
  const head = el('div', 'n-heading-block ntl-flow');
  if (heading) head.append(wrapNode(heading, 'n-heading-block-heading h1'));
  if (lede) head.append(wrapNode(lede, 'n-heading-block-text'));

  const actions = el('div', 'n-heading-block-ctas ntl-cluster');
  ctas.forEach((p) => {
    const a = p.querySelector('a');
    const meta = CTA_IDS[text(a).toLowerCase()];
    if (meta) {
      a.id = meta.id;
      if (meta.blank) a.target = '_blank';
    }
    actions.append(p);
  });
  if (label) actions.append(wrapNode(label, 'homepage-hero-agent-cta-label'));
  if (codePara) actions.append(buildAgentCta(codePara));
  head.append(actions);

  // leftovers: any authored element no slot consumed stays visible (never dropped)
  nodes.filter((n) => !consumed.has(n)).forEach((n) => head.append(n));

  grid.append(head, buildDropzone());
  section.append(grid);
  block.replaceChildren(section);
}
