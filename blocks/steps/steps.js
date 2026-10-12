/**
 * steps — "How it works": section head, three illustrated steps and the explainer
 * video (lite-youtube facade: poster until clicked, then the nocookie embed).
 *
 * Decode tier: reconstructive for the step group (one unit per row holding a
 * heading), template-slotted for the head and the video. Schema:
 * stardust/eds-schema/index.json (section 3).
 * Authored: the section head (eyebrow <p>, <h2>, lede <p>) as default content
 * before the block (reabsorbed — EW8; leading head rows inside the block are the
 * fallback); one row per step: <picture> | <h3> + <p>. The video is DEFAULT CONTENT
 * after the block (an embed URL is never authored inside a block — D1): the poster
 * <p><picture></p> and a <p><a href="https://www.youtube.com/watch?v=…">Play</a></p>;
 * the block reabsorbs that trailing wrapper (a video row inside the block also works).
 */

const YT = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/;

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
const media = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));

// Section head: the default content right before the block (EW8), else leading rows.
function takeHead(block) {
  const wrapper = block.parentElement && block.parentElement.previousElementSibling;
  if (wrapper && wrapper.classList.contains('default-content-wrapper')) {
    const kids = [...wrapper.children];
    wrapper.remove();
    return kids;
  }
  const out = [];
  [...block.children].some((row) => {
    if (row.querySelector('picture, img, a')) return true;
    out.push(...row.querySelectorAll(':scope > div > *'));
    row.remove();
    return false;
  });
  return out;
}

function buildHead(nodes, center) {
  const head = el('div', `n-heading-block ntl-flow${center ? ' n-heading-block-center' : ''}`);
  const heading = nodes.find(isHeading);
  const hIdx = heading ? nodes.indexOf(heading) : -1;
  nodes.forEach((n, i) => {
    if (n === heading) head.append(wrapNode(n, 'n-heading-block-heading h1'));
    else if (i < hIdx) head.append(wrapNode(n, 'eyebrow n-heading-block-eyebrow'));
    else head.append(wrapNode(n, 'n-heading-block-text'));
  });
  return head;
}

function buildVideo(nodes) {
  const link = nodes.flatMap((n) => (n.tagName === 'A' ? [n] : [...n.querySelectorAll('a')]))
    .find((a) => YT.test(a.href));
  const id = link.href.match(YT)[1];
  const wrap = el('div', 'n-youtube-video');
  const lyt = el('div', 'lite-youtube', { 'data-videoid': id, 'data-params': 'rel=0' });
  const posterNode = nodes.find((n) => n.matches('picture, img') || n.querySelector('picture, img'));
  if (posterNode) lyt.append(wrapNode(posterNode, 'lyt-poster'));
  link.classList.add('lyt-playbtn');
  link.setAttribute('role', 'button');
  // the play label and any other authored text stay in the DOM, visually hidden
  nodes.filter((n) => n !== posterNode).forEach((n) => lyt.append(wrapNode(n, 'lyt-playbtn-host')));
  wrap.append(lyt, el('div', 'n-youtube-video-play-icon', { 'aria-hidden': 'true' }));

  const activate = (e) => {
    if (e) e.preventDefault();
    if (lyt.classList.contains('lyt-activated')) return;
    const params = new URLSearchParams(lyt.dataset.params || '');
    params.set('autoplay', '1');
    params.set('playsinline', '1');
    const iframe = el('iframe', '', {
      title: 'Play',
      allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
      allowfullscreen: '',
      src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`,
    });
    lyt.classList.add('lyt-activated');
    lyt.append(iframe);
    iframe.focus();
  };
  lyt.addEventListener('click', activate);
  link.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') activate(e);
  });
  return wrap;
}

function buildStep(row) {
  const item = el('div', 'n-step-item');
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  nodes.forEach((n) => {
    const m = media(n);
    if (m && !n.textContent.trim()) {
      const img = m.tagName === 'IMG' ? m : m.querySelector('img');
      const frame = el('div', 'n-section-image n-section-image-svg', {
        role: 'img',
        'aria-label': (img && img.getAttribute('alt')) || '',
      });
      frame.append(n);
      item.append(wrapNode(frame, 'n-step-image-wrap'));
    } else if (isHeading(n)) {
      item.append(wrapNode(n, 'n-step-heading'));
    } else {
      item.append(wrapNode(n, 'n-step-text'));
    }
  });
  return item;
}

export default async function decorate(block) {
  const headNodes = takeHead(block);
  const section = el('div', 'n-page-section ntl-breakout how-it-works');
  section.id = 'section-get-started';
  if (headNodes.length) section.append(buildHead(headNodes, false));

  const group = el('div', 'n-step-group');
  const tail = [];
  [...block.children].forEach((row) => {
    const isVideo = [...row.querySelectorAll('a')].some((a) => YT.test(a.href));
    if (isVideo) tail.push(buildVideo([...row.querySelectorAll(':scope > div > *')]));
    else if (row.querySelector('h1, h2, h3, h4, h5, h6')) group.append(buildStep(row));
    else tail.push(...row.querySelectorAll(':scope > div > *'));
  });
  const after = block.parentElement && block.parentElement.nextElementSibling;
  if (after && after.classList.contains('default-content-wrapper')
    && [...after.querySelectorAll('a')].some((a) => YT.test(a.href))) {
    tail.push(buildVideo([...after.children]));
    after.remove();
  }
  section.append(group, ...tail);
  block.replaceChildren(section);
}
