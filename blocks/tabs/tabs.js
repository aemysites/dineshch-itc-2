/**
 * tabs — "Use cases": section head, an accessible tab set (one panel per use case:
 * title, text, checklist, CTA beside a code example with a copy button) and the
 * stat row under it.
 *
 * Decode tier: reconstructive (repeat groups: tabs, stats); the panel inner layout is
 * template-slotted. Schema: stardust/eds-schema/index.json (section 7).
 * Authored: the section head (eyebrow <p>, <h2>, lede <p>) as default content before
 * the block (reabsorbed — EW8). One row per tab: label <p> | <h3>, text <p>, <ul>,
 * CTA <p><strong><a> | code title <p> whose link points at the sample in the repo
 * (/blocks/tabs/samples/<slug>.txt — code lives in the repo, David's Model D15), or an
 * authored <pre><code>. One row per stat (a row with no heading and no code): value <p>
 * | label <p>.
 * @ew-exempt <pre> code sample — fetched from the code origin (D15), not authored text
 * Tabs are <div role="tab"> so the authored label stays editable (EW7); hidden panels
 * stay in the DOM (uniform height, editable once their tab is opened).
 * Generated UI only: tab icons (ICONS below, keyed by the label slug), copy button.
 * Source ids (GTM) kept: tab/panel ids mv404t22-tab-N / -panel-N, CTA ids via CTA_IDS.
 */

/* Decorative tab icons lifted from the source (currentColor), keyed by tab label slug. */
const ICONS = {
  'ai-apps': '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.35719 8.55288L4.1323 7.37465L4.11719 6.9591L5.3723 5.7518L5.8043 5.76634L7.02919 6.94457L7.04341 7.36011L5.78919 8.56656L5.35719 8.55288ZM10.2354 8.55288L9.01052 7.37465L8.9963 6.9591L10.2496 5.7518L10.6825 5.76634L11.9083 6.94457L11.9216 7.36011L10.6674 8.56656L10.2354 8.55288Z" fill="var(--color-icon)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M9.14578 0.268479V1.67329H12.1733C13.1881 1.67329 14.1613 2.06098 14.8789 2.7511C15.5965 3.44122 15.9998 4.37725 16 5.35334V9.03338C16 10.0096 15.5968 10.9459 14.8792 11.6362C14.1616 12.3265 13.1882 12.7143 12.1733 12.7143H3.82667C2.81177 12.7143 1.83844 12.3265 1.1208 11.6362C0.403165 10.9459 0 10.0096 0 9.03338V5.35334C0.000235712 4.37725 0.403505 3.44122 1.12112 2.7511C1.83873 2.06098 2.81193 1.67329 3.82667 1.67329H7.05778V0.268479L7.31822 0H8.88356L9.14578 0.268479ZM3.82667 3.68005C2.86667 3.68005 2.08711 4.42991 2.08711 5.35334V9.03338C2.08711 9.95682 2.86578 10.7067 3.82667 10.7067H12.1733C13.1333 10.7067 13.9129 9.95767 13.9129 9.03338V5.35334C13.9129 4.42991 13.1342 3.68005 12.1733 3.68005H8.89067L8.88444 3.68689H7.32L7.31378 3.68005H3.82667Z" fill="var(--color-icon)"></path></svg>',
  'marketing-sites': '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM6.09113 13.1597C5.31106 11.815 4.83018 10.3105 4.69 8.75H2.55071C2.82829 10.7858 4.21989 12.4672 6.09113 13.1597ZM2.55071 7.25H4.69C4.83018 5.68946 5.31106 4.18496 6.09113 2.84029C4.21989 3.53281 2.82829 5.21418 2.55071 7.25ZM13.4493 8.75C13.1717 10.786 11.7799 12.4674 9.90846 13.1599C10.6886 11.8152 11.1695 10.3106 11.3097 8.75H13.4493ZM13.4493 7.25C13.1717 5.21403 11.7799 3.53257 9.90846 2.84013C10.6886 4.18485 11.1695 5.6894 11.3097 7.25H13.4493ZM7.99984 13.3282C6.99464 11.9949 6.37093 10.4119 6.19703 8.75H9.80265C9.62875 10.4119 9.00503 11.9949 7.99984 13.3282ZM6.19703 7.25H9.80265C9.62875 5.58811 9.00503 4.00511 7.99984 2.67183C6.99464 4.00511 6.37093 5.58811 6.19703 7.25Z" fill="var(--color-icon)"></path></svg>',
  'saas-apps': '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.40039 3.7278L3.40043 4.67185L3.52839 4.79981L4.47244 4.79985L4.60039 4.67191L4.60035 3.72785L4.47239 3.5999L3.52834 3.59985L3.40039 3.7278Z" fill="var(--color-icon)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M1 5.9364L2.21788 7.19995H13.7821L15 5.9364V2.46351L13.7821 1.19995H2.21788L1 2.46351V5.9364ZM2.85544 2.69995H5.14456L5.5 3.06872V5.33119L5.14456 5.69995H2.85544L2.5 5.33119V3.06872L2.85544 2.69995ZM7 2.69995V5.69995H13.1446L13.5 5.33119V3.06872L13.1446 2.69995H7Z" fill="var(--color-icon)"></path><path d="M3.40039 11.3278L3.40043 12.2719L3.52839 12.3998L4.47244 12.3999L4.60039 12.2719L4.60035 11.3279L4.47239 11.1999L3.52834 11.1999L3.40039 11.3278Z" fill="var(--color-icon)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M1 13.5364L2.21788 14.8H13.7821L15 13.5364V10.0635L13.7821 8.79995H2.21788L1 10.0635V13.5364ZM2.85544 10.3H5.14456L5.5 10.6687V12.9312L5.14456 13.3H2.85544L2.5 12.9312V10.6687L2.85544 10.3ZM7 10.3V13.3H13.1446L13.5 12.9312V10.6687L13.1446 10.3H7Z" fill="var(--color-icon)"></path></svg>',
  ecommerce: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM6.09113 13.1597C5.31106 11.815 4.83018 10.3105 4.69 8.75H2.55071C2.82829 10.7858 4.21989 12.4672 6.09113 13.1597ZM2.55071 7.25H4.69C4.83018 5.68946 5.31106 4.18496 6.09113 2.84029C4.21989 3.53281 2.82829 5.21418 2.55071 7.25ZM13.4493 8.75C13.1717 10.786 11.7799 12.4674 9.90846 13.1599C10.6886 11.8152 11.1695 10.3106 11.3097 8.75H13.4493ZM13.4493 7.25C13.1717 5.21403 11.7799 3.53257 9.90846 2.84013C10.6886 4.18485 11.1695 5.6894 11.3097 7.25H13.4493ZM7.99984 13.3282C6.99464 11.9949 6.37093 10.4119 6.19703 8.75H9.80265C9.62875 10.4119 9.00503 11.9949 7.99984 13.3282ZM6.19703 7.25H9.80265C9.62875 5.58811 9.00503 4.00511 7.99984 2.67183C6.99464 4.00511 6.37093 5.58811 6.19703 7.25Z" fill="var(--color-icon)"></path></svg>',
  'internal-tools': '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.17772 0.75H3.81066L5 1.93934L6.18934 0.75H7.82228L8 0.934382V2.06562L7.82228 2.25H6.81066L5.75 3.31066V12.6893L6.81066 13.75H7.82228L8 13.9344V15.0656L7.82228 15.25H6.18934L5 14.0607L3.81066 15.25H2.17772L2 15.0656V13.9344L2.17772 13.75H3.18934L4.25 12.6893V12.25H1L0.25 11.5V4.5L1 3.75H4.25V3.31066L3.18934 2.25H2.17772L2 2.06562V0.934382L2.17772 0.75ZM4.25 10.75V5.25H1.75V10.75H4.25Z" fill="var(--color-icon)"></path><path d="M14.25 10.75V5.25H7.95043L7.75 5.06249V3.93751L7.95043 3.75H15L15.75 4.5V11.5L15 12.25H7.95043L7.75 12.0625V10.9375L7.95043 10.75H14.25Z" fill="var(--color-icon)"></path></svg>',
};

const ID_PREFIX = 'mv404t22';
const CTA_IDS = {
  'explore ai gateway': 'cta-primitives-ai',
  'marketing sites on netlify': 'cta-primitives-marketing',
  'explore platform primitives': 'cta-primitives-saas',
  'ecommerce on netlify': 'cta-primitives-ecommerce',
  'internal apps on netlify': 'cta-primitives-internal',
};
const COPY_ICONS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="copy-icon" aria-hidden="true"><path d="M18 3c0-1.657-1.343-3-3-3v0h-12c-1.657 0-3 1.343-3 3v0 12c0 1.657 1.343 3 3 3v0h12c1.657 0 3-1.343 3-3v0zM15 1.5c0.828 0 1.5 0.672 1.5 1.5v0 12c0 0.828-0.672 1.5-1.5 1.5v0h-12c-0.828 0-1.5-0.672-1.5-1.5v0-12c0-0.828 0.672-1.5 1.5-1.5v0zM21 7.5c0.828 0 1.5 0.672 1.5 1.5v0 12c0 0.828-0.672 1.5-1.5 1.5v0h-12c-0.828 0-1.5-0.672-1.5-1.5v0-1.5h-1.5v1.5c0 1.657 1.343 3 3 3v0h12c1.657 0 3-1.343 3-3v0-12c0-1.657-1.343-3-3-3v0h-1.5v1.5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="check-icon" aria-hidden="true"><path d="M22.942 6.582l-13.778 13.778c-0.156 0.156-0.371 0.253-0.609 0.253s-0.453-0.097-0.609-0.253v0l-6.028-6.028c-0.156-0.156-0.252-0.371-0.252-0.609 0-0.476 0.386-0.862 0.862-0.862 0.238 0 0.453 0.096 0.609 0.252v0l5.418 5.42 13.168-13.169c0.156-0.156 0.371-0.252 0.609-0.252 0.476 0 0.862 0.386 0.862 0.862 0 0.238-0.096 0.453-0.252 0.609v0z"/></svg>';

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
const SAMPLE = /\/samples\/[\w-]+\.txt$/;
const hrefPath = (a) => (a.getAttribute('href') || '').replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0];
const sampleLink = (n) => [...n.querySelectorAll('a')].find((a) => SAMPLE.test(hrefPath(a)));
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
  const head = el('div', 'n-heading-block ntl-flow');
  const heading = nodes.find(isHeading);
  const hIdx = heading ? nodes.indexOf(heading) : -1;
  nodes.forEach((n, i) => {
    if (n === heading) head.append(wrapNode(n, 'n-heading-block-heading h1'));
    else if (i < hIdx) head.append(wrapNode(n, 'eyebrow n-heading-block-eyebrow'));
    else head.append(wrapNode(n, 'n-heading-block-text'));
  });
  return head;
}

function samplePre(link) {
  const pre = el('pre');
  const code = el('code');
  pre.append(code);
  const base = (window.hlx && window.hlx.codeBasePath) || '';
  const file = hrefPath(link).replace(/^.*\/blocks\//, '/blocks/');
  fetch(`${base}${file}`)
    .then((r) => (r.ok ? r.text() : ''))
    .then((markup) => {
      // trusted same-origin code asset: the source's pre-highlighted poimandres markup
      code.innerHTML = markup;
    })
    .catch(() => {});
  return pre;
}

function buildCodeBlock(pre) {
  const block = el('div', 'code-block no-frame show-copy-on-hover n-tabbed-content-code-block');
  const content = el('div', 'code-block-content');
  pre.classList.add('poimandres');
  pre.tabIndex = 0;
  const btn = el('button', 'copy-button', {
    type: 'button',
    'aria-label': 'Copy code to clipboard',
    'data-tooltip': 'Copy',
  });
  btn.innerHTML = COPY_ICONS;
  btn.addEventListener('click', async () => {
    const reset = (cls) => setTimeout(() => {
      btn.classList.remove(cls);
      btn.setAttribute('data-tooltip', 'Copy');
      btn.blur();
    }, 2000);
    try {
      await navigator.clipboard.writeText((pre.textContent || '').trim());
      btn.classList.add('copied');
      btn.setAttribute('data-tooltip', 'Copied!');
      reset('copied');
    } catch {
      btn.classList.add('error');
      btn.setAttribute('data-tooltip', 'Failed to copy!');
      reset('error');
    }
  });
  content.append(pre, btn);
  block.append(content);
  return block;
}

function parseTab(row) {
  const cells = [...row.children];
  const t = {
    label: null,
    sample: null,
    heading: null,
    texts: [],
    lists: [],
    ctas: [],
    codeTitle: null,
    pre: null,
    rest: [],
  };
  const all = cells.flatMap((c) => [...c.children].map((n) => ({ n, cell: c })));
  const hIdx = all.findIndex(({ n }) => isHeading(n));
  all.forEach(({ n, cell }, i) => {
    const codeCell = !!cell.querySelector('pre');
    const sample = n.tagName === 'P' ? sampleLink(n) : null;
    if (sample && !t.codeTitle) {
      t.codeTitle = n;
      t.sample = sample;
    } else if (i === hIdx) t.heading = n;
    else if (n.tagName === 'PRE') t.pre = n;
    else if (i < hIdx && !t.label) t.label = n;
    else if (codeCell && n.tagName === 'P' && !n.querySelector('a') && !t.codeTitle) t.codeTitle = n;
    else if (n.tagName === 'UL' || n.tagName === 'OL') t.lists.push(n);
    else if (n.tagName === 'P' && n.querySelector('a')
      && n.textContent.trim() === n.querySelector('a').textContent.trim()) t.ctas.push(n);
    else if (n.tagName === 'P') t.texts.push(n);
    else t.rest.push(n);
  });
  return t;
}

function buildTabs(tabRows, label) {
  const root = el('div', 'n-tabbed-content', { 'data-tabs': '' });
  const list = el('div', '', { role: 'tablist', 'aria-label': label || 'Tabs' });
  const group = el('div', 'n-tabpanel-group n-tabpanel-group-uniform-height ntl-stack n-tabpanel-group-no-padding');
  const tabs = [];
  const panels = [];
  tabRows.forEach((row, i) => {
    const t = parseTab(row);
    const on = i === 0;
    const tab = el('div', '', {
      role: 'tab',
      id: `${ID_PREFIX}-tab-${i}`,
      'aria-controls': `${ID_PREFIX}-panel-${i}`,
      'aria-selected': on ? 'true' : 'false',
      tabindex: on ? '0' : '-1',
    });
    const key = t.label ? slug(t.label.textContent) : '';
    if (ICONS[key]) tab.innerHTML = ICONS[key];
    if (t.label) tab.append(wrapNode(t.label, 'tab-label'));
    list.append(tab);
    tabs.push(tab);

    const panel = el('div', 'n-tabbed-content-panel', {
      role: 'tabpanel',
      id: `${ID_PREFIX}-panel-${i}`,
      'aria-labelledby': `${ID_PREFIX}-tab-${i}`,
    });
    if (!on) panel.hidden = true;
    const wrap = el('div', 'n-tabbed-content-wrapper n-tabbed-content-wrapper-split');
    const body = el('div', 'n-tabbed-content-body ntl-flow');
    if (t.heading) body.append(wrapNode(t.heading, 'n-tabbed-content-title h4'));
    t.texts.forEach((p) => body.append(wrapNode(p, 'n-tabbed-content-text')));
    t.lists.forEach((l) => body.append(wrapNode(l, 'n-tabbed-content-list')));
    t.rest.forEach((n) => body.append(n));
    if (t.ctas.length) {
      const ctas = el('div', 'n-tabbed-content-ctas');
      t.ctas.forEach((p) => {
        const a = p.querySelector('a');
        const name = a.textContent.trim().toLowerCase();
        a.id = CTA_IDS[name] || `cta-primitives-${slug(name)}`;
        a.target = '_blank';
        ctas.append(p);
      });
      body.append(ctas);
    }
    wrap.append(body);
    if (t.sample && !t.pre) {
      t.pre = samplePre(t.sample);
      t.sample.replaceWith(...t.sample.childNodes); // EW6: href read, title stays editable
    }
    if (t.pre || t.codeTitle) {
      const code = el('div', 'n-tabbed-content-code');
      if (t.codeTitle) code.append(wrapNode(t.codeTitle, 'n-tabbed-content-code-heading'));
      if (t.pre) code.append(buildCodeBlock(t.pre));
      wrap.append(code);
    }
    panel.append(wrap);
    group.append(panel);
    panels.push(panel);
  });

  const select = (tab, focus) => {
    tabs.forEach((x, i) => {
      const on = x === tab;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, true));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'Home') [next] = tabs;
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      else if (e.key === 'Enter' || e.key === ' ') next = tab;
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });
  root.append(list, group);
  return root;
}

function buildStats(statRows) {
  const row = el('div', 'n-stat-row');
  statRows.forEach((r) => {
    const nodes = [...r.querySelectorAll(':scope > div > *')];
    const item = el('div', 'n-stat-row-item');
    nodes.forEach((n, i) => item.append(wrapNode(n, i === 0 ? 'n-stat-row-value' : 'n-stat-row-label')));
    row.append(item);
  });
  return row;
}

export default async function decorate(block) {
  const headNodes = takeHead(block);
  const section = el('div', 'n-page-section ntl-breakout');
  section.id = 'section-primitives';
  const eyebrow = headNodes.find((n) => !isHeading(n));
  if (headNodes.length) section.append(buildHead(headNodes));

  const rows = [...block.children];
  const tabRows = rows.filter((r) => r.querySelector('h1, h2, h3, h4, h5, h6, pre') || sampleLink(r));
  const statRows = rows.filter((r) => !tabRows.includes(r) && r.textContent.trim());
  if (tabRows.length) section.append(buildTabs(tabRows, eyebrow ? eyebrow.textContent.trim() : ''));
  if (statRows.length) section.append(buildStats(statRows));
  block.replaceChildren(section);
}
