/*
 * Inline chrome icons in the source's astro-icon form: the first use of an icon carries
 * <symbol id="ai:local:NAME"> plus <use href="#ai:local:NAME">; every later use is a bare
 * <use>. Ids follow the svg's data-icon ("simple-icons:claude" -> "ai:simple-icons:claude").
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const emitted = new Set();

export default function toSymbolIcon(svg) {
  const name = svg && svg.dataset.icon;
  if (!name) return svg;
  const id = name.includes(':') ? `ai:${name}` : `ai:local:${name}`;
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#${id}`);
  if (emitted.has(id) || document.getElementById(id)) {
    svg.replaceChildren(use);
    return svg;
  }
  emitted.add(id);
  const symbol = document.createElementNS(SVG_NS, 'symbol');
  symbol.id = id;
  symbol.setAttribute('viewBox', svg.getAttribute('viewBox'));
  symbol.append(...svg.childNodes);
  svg.replaceChildren(symbol, use);
  return svg;
}
