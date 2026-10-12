/**
 * logo-ticker — trust bar: customer logos scrolling as an infinite marquee.
 *
 * Decode tier: reconstructive (repeat group). Schema: stardust/eds-schema/index.json
 * (section 2). Authored: one logo image per row (or all images in one cell) — every
 * <picture>/<img> in the block becomes one ticker item, in authored order.
 * The marquee needs a second copy of the set: a presentational clone (aria-hidden,
 * stripInstrumentation — EW4). captureState restoreAtDelivery: the marquee keeps
 * animating (CSS, 50 s loop; paused only under prefers-reduced-motion).
 */

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

export default async function decorate(block) {
  const media = [...block.querySelectorAll('picture, img')]
    .filter((m) => m.tagName === 'PICTURE' || !m.closest('picture'));
  const leftovers = [...block.querySelectorAll(':scope > div > div > :is(h1, h2, h3, h4, h5, h6, p, ul, ol)')]
    .filter((n) => !n.querySelector('picture, img'));

  const section = el('div', 'n-page-section ntl-breakout');
  section.id = 'section-logos';
  const ticker = el('div', 'n-ticker');
  const content = el('div', 'n-ticker-content');
  media.forEach((m) => {
    const item = el('div', 'n-trust-bar-ticker-item');
    const inner = el('div', 'n-trust-bar-ticker-item-content');
    inner.append(m);
    item.append(inner);
    content.append(item);
  });
  const clone = stripInstrumentation(content.cloneNode(true));
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('img').forEach((img) => img.setAttribute('alt', ''));
  ticker.append(content, clone);
  section.append(ticker);
  leftovers.forEach((n) => section.append(n));
  block.replaceChildren(section);
}
