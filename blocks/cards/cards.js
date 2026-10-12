/**
 * cards — "Start your way": section head + a grid of workflow cards (icon, title,
 * text, optional CLI snippet with a copy button, action link).
 *
 * Decode tier: reconstructive (repeat group). Schema: stardust/eds-schema/index.json
 * (section 4). Authored: the section head (eyebrow <p>, <h2>, lede <p>) as default
 * content before the block (reabsorbed — EW8); one row per card, its parts as flat
 * siblings: title <p> (or <h3>), text <p>, optional <pre><code> command, link <p>.
 * A single-cell authored grid is segmented on the link paragraphs (each card ends
 * with its link). The title stays a <p>: the source renders it as a styled <div>
 * (content-diff role parity).
 * Generated UI only: decorative icons (ICONS below, keyed by the CTA id), the
 * action-link arrow and the snippet copy button. Source ids (GTM) via CTA_IDS.
 */

/* Decorative card icons lifted from the source (theme-aware currentColor), keyed by CTA id. */
const ICONS = {
  'cta-start-agent': '<svg width="1em" height="1em" aria-hidden="true" slot="icon" class="icon"><symbol id="ai:local:agent-runners" viewBox="0 0 16 16"><g fill="currentColor"><path d="M5.68 9.925 4.607 8.85l-.013-.379 1.1-1.1.38.012 1.075 1.075.012.38-1.1 1.1zm4.28 0L8.886 8.85l-.013-.379 1.1-1.1.38.012 1.075 1.075.012.38-1.1 1.1z"></path><path fill-rule="evenodd" d="M9.004 2.52v1.296h2.658a3.19 3.19 0 0 1 3.19 3.192v3.356a3.19 3.19 0 0 1-3.19 3.19H4.337a3.19 3.19 0 0 1-3.19-3.19V7.008a3.19 3.19 0 0 1 3.19-3.192h2.836V2.52l.23-.245h1.372zM4.337 5.316a1.69 1.69 0 0 0-1.69 1.692v3.356c0 .934.757 1.69 1.69 1.69h7.325a1.69 1.69 0 0 0 1.69-1.69V7.008c0-.934-.757-1.692-1.69-1.692z" clip-rule="evenodd"></path></g></symbol><use href="#ai:local:agent-runners"></use></svg>',
  'cta-start-import': '<svg width="1em" height="1em" aria-hidden="true" slot="icon" class="icon"><symbol id="ai:local:code-branch" viewBox="0 0 640 640"><path fill="currentColor" d="M176 176c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32m80-32c0 35.8-23.5 66.1-56 76.3V296h184c30.9 0 56-25.1 56-56v-19.7c-32.5-10.2-56-40.5-56-76.3 0-44.2 35.8-80 80-80s80 35.8 80 80c0 35.8-23.5 66.1-56 76.3V240c0 57.4-46.6 104-104 104H200v75.7c32.5 10.2 56 40.5 56 76.3 0 44.2-35.8 80-80 80s-80-35.8-80-80c0-35.8 23.5-66.1 56-76.3V220.4c-32.5-10.3-56-40.6-56-76.4 0-44.2 35.8-80 80-80s80 35.8 80 80m240 0c0-17.7-14.3-32-32-32s-32 14.3-32 32 14.3 32 32 32 32-14.3 32-32M176 528c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32"></path></symbol><use href="#ai:local:code-branch"></use></svg>',
  'cta-start-cli': '<svg width="1em" height="1em" aria-hidden="true" slot="icon" class="icon"><symbol id="ai:local:square-terminal" viewBox="0 0 640 640"><path fill="currentColor" d="M480 144c8.8 0 16 7.2 16 16v320c0 8.8-7.2 16-16 16H160c-8.8 0-16-7.2-16-16V160c0-8.8 7.2-16 16-16zM160 96c-35.3 0-64 28.7-64 64v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64zm39 127c-9.4 9.4-9.4 24.6 0 33.9l63 63-63 63c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0zm113 177c-13.3 0-24 10.7-24 24s10.7 24 24 24h112c13.3 0 24-10.7 24-24s-10.7-24-24-24z"></path></symbol><use href="#ai:local:square-terminal"></use></svg>',
  'cta-start-drop': '<svg width="1em" height="1em" aria-hidden="true" slot="icon" class="icon"><symbol id="ai:local:cloud-arrow-up" viewBox="0 0 640 640"><path fill="currentColor" d="M272 96c-88.4 0-160 71.6-160 160 0 4.9.2 9.8.7 14.6C64.9 294 32 343.1 32 400c0 79.5 64.5 144 144 144h304c70.7 0 128-57.3 128-128 0-49.9-28.5-93-70.1-114.2 4-11.9 6.1-24.6 6.1-37.8 0-66.3-53.7-120-120-120-11.5 0-22.7 1.6-33.3 4.7C361.4 116.4 319.1 96 272 96M160 256c0-61.9 50.1-112 112-112 37.7 0 71 18.6 91.3 47.1 6.7 9.5 19.3 12.8 29.8 7.8 9.3-4.4 19.7-6.9 30.8-6.9 39.8 0 72 32.2 72 72 0 14.1-4 27.2-11 38.3-4.1 6.5-4.8 14.6-2 21.7s9 12.5 16.5 14.3c34.8 8.7 60.5 40.2 60.5 77.6 0 44.2-35.8 80-80 80h-304c-53 0-96-43-96-96 0-42.7 27.9-79 66.6-91.4 11.8-3.8 18.8-16 16.1-28.1-1.8-7.9-2.7-16.1-2.7-24.5zm177 7c-9.4-9.4-24.6-9.4-33.9 0l-64 64c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l23-23V424c0 13.3 10.7 24 24 24s24-10.7 24-24v-86.1l23 23c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-64-64z"></path></symbol><use href="#ai:local:cloud-arrow-up"></use></svg>',
};

const CTA_IDS = {
  'build now': 'cta-start-agent',
  'import a project': 'cta-start-import',
  'get started with cli': 'cta-start-cli',
  'try netlify drop': 'cta-start-drop',
};

const ARROW = '<span class="n-action-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" role="presentation"><g stroke="currentColor" stroke-linecap="square" stroke-width="1.564"><path stroke-linejoin="round" d="M3.417 10.556 9.4 4.572"></path><path d="M9.88 9.381V4.093H4.59"></path></g></svg></span>';
const COPY = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

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

function takeHead(block) {
  const wrapper = block.parentElement && block.parentElement.previousElementSibling;
  if (wrapper && wrapper.classList.contains('default-content-wrapper')) {
    const kids = [...wrapper.children];
    wrapper.remove();
    return kids;
  }
  return [];
}

function buildHead(nodes) {
  const head = el('div', 'n-heading-block ntl-flow n-heading-block-center');
  const heading = nodes.find(isHeading);
  const hIdx = heading ? nodes.indexOf(heading) : -1;
  nodes.forEach((n, i) => {
    if (n === heading) head.append(wrapNode(n, 'n-heading-block-heading h1'));
    else if (i < hIdx) head.append(wrapNode(n, 'eyebrow n-heading-block-eyebrow'));
    else head.append(wrapNode(n, 'n-heading-block-text'));
  });
  return head;
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function buildCard(nodes) {
  const card = el('div', 'n-card ntl-flow');
  const linkP = nodes.find((n) => n.querySelector && n.querySelector('a'));
  const a = linkP ? linkP.querySelector('a') : null;
  const label = a ? a.textContent.trim().toLowerCase() : '';
  const id = CTA_IDS[label] || (a ? `cta-start-${slug(label)}` : '');
  if (a) {
    a.id = id;
    a.classList.remove('button', 'primary', 'secondary', 'accent');
  }
  const icon = el('div', 'n-card-icon');
  if (ICONS[id]) icon.innerHTML = ICONS[id];
  card.append(icon);

  let titled = false;
  nodes.forEach((n) => {
    if (n === linkP) return;
    if (n.tagName === 'PRE') return;
    if (!titled && (isHeading(n) || n.tagName === 'P')) {
      card.append(wrapNode(n, 'n-card-headline'));
      titled = true;
    } else {
      card.append(wrapNode(n, 'n-card-paragraph'));
    }
  });
  const pre = nodes.find((n) => n.tagName === 'PRE');
  if (pre) {
    const cli = el('div', 'n-cli-copy');
    const btn = el('button', 'n-cli-copy-btn', { type: 'button', 'aria-label': 'Copy to clipboard' });
    btn.innerHTML = COPY;
    btn.addEventListener('click', async () => {
      if (await copyText(pre.textContent.trim())) {
        btn.setAttribute('aria-label', 'Copied');
        setTimeout(() => btn.setAttribute('aria-label', 'Copy to clipboard'), 2000);
      }
    });
    cli.append(pre, btn);
    card.append(cli);
  }
  if (linkP) {
    const link = wrapNode(linkP, 'n-card-link');
    linkP.classList.remove('button-wrapper');
    a.insertAdjacentHTML('beforeend', ARROW);
    card.append(link);
  }
  return card;
}

function segment(block) {
  const rows = [...block.children];
  const units = rows.map((row) => [...row.querySelectorAll(':scope > div > *')]);
  if (units.length > 1) return units.filter((u) => u.length);
  // one flattened cell: each card ends with its link paragraph
  const out = [];
  let cur = [];
  (units[0] || []).forEach((n) => {
    cur.push(n);
    if (n.tagName === 'P' && n.querySelector('a')) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
}

export default async function decorate(block) {
  const headNodes = takeHead(block);
  const section = el('div', 'n-page-section ntl-breakout start-your-way');
  section.id = 'section-start-your-way';
  if (headNodes.length) section.append(buildHead(headNodes));
  const grid = el('div', 'n-grid');
  segment(block).forEach((unit) => grid.append(buildCard(unit)));
  section.append(grid);
  block.replaceChildren(section);
}
