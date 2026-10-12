/**
 * testimonial — a single large pull quote with its author and role.
 *
 * Decode tier: template-slotted. Schema: stardust/eds-schema/index.json (section 6).
 * Authored (flat siblings, one or more rows): the quote (<blockquote> or the first
 * <p>), then the author name <p>, then the author title <p>. The quote marks are CSS
 * (open-quote / close-quote), never authored.
 */

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

export default async function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const quote = nodes.find((n) => n.tagName === 'BLOCKQUOTE') || nodes.find((n) => n.tagName === 'P');
  const rest = nodes.filter((n) => n !== quote);

  const section = el('div', 'n-page-section ntl-breakout');
  section.id = 'section-testimonial';
  const figure = el('figure', '', { 'data-blockquote-variant': 'testimonial' });
  const bq = quote && quote.tagName === 'BLOCKQUOTE' ? quote : el('blockquote');
  if (quote && quote !== bq) bq.append(quote);
  figure.append(bq);
  if (rest.length) {
    const cap = el('figcaption');
    const info = el('div', 'n-blockquote-author-info');
    rest.forEach((n, i) => {
      info.append(wrapNode(n, i === 0 ? 'n-blockquote-author' : 'n-blockquote-title'));
    });
    cap.append(info);
    figure.append(cap);
  }
  section.append(figure);
  block.replaceChildren(section);
}
