# EDS conversion log

## Publish decision (2026-10-11)
Publish: decided by the run owner before the run. Every delivered page, the redirects sheet and the chrome documents (nav, footer and locale variants) go live on the aem.live origin (deploy-batch.mjs without --no-publish).

## C0 foundation (2026-10-11)

**Foundation files** (frozen, `stardust/rollout/foundation-freeze.json`, 22 files): `styles/styles.css`,
`styles/fonts.css`, `styles/lazy-styles.css` (stock), `fonts/*.woff2` (7), `head.html` (stock),
`scripts/{aem,scripts,martech,consent-check,consented}.js`, `blocks/header/*`, `blocks/footer/*`.
Outside the freeze: `icons/{chevron,chevron-dark,check-circle,check-circle-dark,checklist-check}.svg`
(the canon's data-URI icons as files), `favicon.ico` (captured source icon), `content/nav.html`,
`content/footer.html`, `.hlxignore` (+`content/`), `.eslintignore` (+`stardust/`, `content/`).

**styles.css** — generated from `stardust/prototypes/canon.css` (one-off generator in
`stardust/.work/c0/gen-styles.mjs`): the three source cascade layers kept (`@layer variables, reset,
composition, blocks`); the variables layer pruned to the transitive closure of every custom property
the prototype references (454 kept, 922 declarations dropped; light + dark themes kept); composition
rules for classes the prototype never uses dropped; source keyframes / `.a-fade-in` (unused) dropped.
Value normalisations, all exact: `color(srgb k/255 …)` → hex; duplicate custom properties inside one
block collapsed to the last (the one that wins). The EDS structural layer is unlayered after the canon
(body gate, chrome reservation, section scaffold, buttons, EW edit-mode repaint), so block CSS (also
unlayered, as in the prototype) keeps out-ranking the canon exactly as in the gated prototype.

**Renames cluster agents must use** (lint: kebab-case custom properties / keyframes):
`--step--1` → `--step-minus-1`, `--step--2` → `--step-minus-2`; private `--_x` → `--local-x`
(canon composition: `--local-full`, `--local-content`, `--local-popout`, `--local-feature`,
`--local-gap-default`). `.text--1/.text--2` utilities are not shipped (unused).

**Cap model** — DESIGN.json `containerMaxWidth` 1280: every capped box is a breakout-grid content
column inside a full-bleed section (the `shell` entry is `#section-primitives > n-tabs`, a module);
so the cap rides the canon breakout grids (`--ntl-page-content-max-width: 80rem`), exposed as
`--max-width`, and `main` is NOT capped (a `main { max-width }` would clip the full-bleed section
grounds at > 1280 px). `main > .section` has no margins (blocks paint their own section);
`.default-content-wrapper` is capped at `--max-width` + gutters for prose sections.

**Fonts** — Instrument Sans (+italic), Figtree, Martian Mono 400–700: SIL OFL 1.1, the prototype's
own woff2 (source unicode-range subsets kept) self-hosted under `fonts/`, declared in
`styles/fonts.css`. Metric-matched fallbacks in styles.css, second in each stack:
`instrument-sans-fallback` (size-adjust 104.02 %, ascent 93.25 %, descent 24.03 %) and
`figtree-fallback` (99.41 % / 95.57 % / 25.15 %), computed with fontTools against Liberation Sans
(Arial metrics). Martian Mono is not metric-matched (eyebrows / small mono labels only). No font
lines in `head.html`; no licensing alert needed (all OFL).

**Reservation** — `header { position: sticky; top: 0; z-index: 1; height: var(--nav-height) }`;
`--nav-height: calc(clamp(90px, 15vw, 122px) * 0.4082 + 24px)` = the prototype's fluid header row
(logo 512:209 + 2 × 12 px): 73.8 px at 1440, 60.7 px at 360, measured equal on the build. The host
`<header>` carries the sticky behaviour (a sticky `.site-header` inside the host would not stick).

**Buttons** — the source `.button` system (Figtree 700, pill, 2 px border, teal primary,
secondary = translucent, accent = outline) scoped to `main a.button` / `main button.button` so it
never fights the chrome's own button rules.

**Decode tiers**
- header — Template-slotted. `/nav` sections by section-metadata `style`: `announcement`, `brand`,
  `compact`, `menu`, `panel` ×4 (one per menu item without a link, in order), `actions`, `search`.
  Authored `<p>/<ul>/<li>/<a>/<h3>` are MOVED into the prototype DOM; paragraph hosts of the logo and
  CTAs get `display: contents`. Panels split into columns at each `<h3>` and at a `<p>` following a
  list. Generated UI only: submenu toggles, hamburger, search toggles, skip link, the quick-search
  dialog chrome (Ask Netlify AI, Actions/Toggle theme, key tips); the dialog's Help links are authored.
- footer — Template-slotted; columns are a repeat group (segment on `<h2>`). `/footer` sections:
  `top` (logo link + social list), `columns`, `newsletter` (heading), `legal` (list + copyright).
  The < 750 px `<details>` accordions are presentational clones (EW4, `stripInstrumentation`); the
  authored nodes live in the wide columns. Generated UI: newsletter form (no backend; submit only
  validates), Cookie Settings button (calls OneTrust only when present), theme select, Ask Netlify.
- Source ids are derived in block JS from the authored link text (camelCase split + kebab):
  `mainNav-netlifyLogo`, `main-nav-*`, `main-nav-compact-*`, `nav-*`, `cta-main-nav-search`,
  `signup`, `go-to-dashboard`, `cta-header-announcementBar(-close)`, `cta-footer-*`,
  `cta-footer-sm-*`, `cta-legal-footer-*`, `cta-ask-netlify-chat`; one alias `log-in` → `login`.
  Rendered id set == prototype id set at 1440 and 360 (0 missing, 0 extra).
- Decorative icons (logo SVGs, social, framework/agent icons, dialog icons) are lifted verbatim into
  `blocks/*/(header|footer)-icons.js`, keyed by name / link slug — theme-aware `currentColor` SVG,
  not editorial imagery, so not DA media.
- A `foldSectionMetadata()` fallback applies the `style` classes client-side if a render ever
  leaves the section-metadata block in place (the live pipeline folds it — verified on .plain.html).

**Martech** — `martech-scaffold.mjs`: `scripts/martech.js` written from the contract, no CMP, 0
routes enabled; hooks `loadConsent()` in `loadEager()` and `loadTags()` in `loadDelayed()`.

**Deploy** — `/nav`, `/footer` (Robots noindex metadata): sanitise → davids-model-lint PASS →
delivery-lint 0 P0/P1 → `deploy-batch.mjs` (ledger `stardust/deploy/ledger-foundation.json`):
both live. `.plain.html` 200 on aem.page and aem.live, section classes folded, metadata stripped.

**Checks** — `npm run lint` clean (no breakpoint target in DESIGN.json, so `lint:breakpoints` not
added). Harness vs prototype: header band 100 % (1440, 360), footer 100 % (1440, 360), open
mega-menus 99.7–99.8 %, search dialog 99.9 %, mobile drawer 99.85 %. Published origin (header and
footer rendered on the `/footer` chrome-document page, no content page exists yet): header band
100 % at 1440 and 360, footer 100 % / 99.79 %, 0 page errors. The shell gate proper (pixel at both
widths, chrome-compare vs www.netlify.com) is deferred to the archetype unit: `/` (index) is not
delivered yet (404).

## C-archetype landing — index (2026-10-11)

Page `index` → DA document `/index` (served at `/`), 7 blocks + 3 default-content section heads.
Schema: `stardust/eds-schema/index.json` (section-schema of the gated prototype).

**Decode tiers**
- hero — Template-slotted. One cell: `<h1>`, lede `<p>`, CTA paragraphs (`<strong>`/`<em>` links),
  agent label `<p>`, `<p><code>` command. Generated UI only: copy-command chrome (dots canvas,
  source `<symbol>` icons; a `div[role=button]` so the authored command stays editable, EW7) and the
  drop zone (illustration `blocks/hero/dropzone.svg`, decorative, fetched + inlined behind a
  630×373 placeholder). Replaces the boilerplate hero.
- logo-ticker — Reconstructive (repeat group: one item per authored image). Marquee copy is a
  presentational clone (aria-hidden, alt="", stripInstrumentation). restoreAtDelivery honoured:
  CSS `scroll-x` 50 s infinite, verified running on aem.live (transform advancing).
- steps — Reconstructive for the step group (one row per step: picture | h3 + p), template-slotted
  head and video. Head = default content reabsorbed (EW8); the YouTube link + poster are default
  content AFTER the block (D1: no embed URL inside a block), reabsorbed into the lite-youtube facade.
- cards — Reconstructive (one row per card; single-cell fallback segments on the link paragraph).
  Card title authored as `<p>` (the source renders a styled `<div>`; an `<h3>` is a ROLE SWAP 🔴).
  CLI snippet authored `<pre><code>`. Icons lifted verbatim (source `<symbol>`), keyed by CTA id.
  Replaces the boilerplate cards.
- switchback — Reconstructive (one panel per row: copy cell | image cell; mirrored on index rhythm).
- testimonial — Template-slotted (quote `<p>` → generated `<blockquote>` with CSS quote marks,
  author / title `<p>`s).
- tabs — Reconstructive (tab rows: label | body | code title; stat rows: value | label), panel inner
  layout template-slotted. Tabs are `div[role=tab]` (EW7). Tab/panel ids `mv404t22-tab-N/-panel-N`.

**Source ids (GTM)** kept via per-block maps keyed by the authored link text: `cta-hero-get-started`,
`cta-hero-contact-sales`, `cta-start-{agent,import,cli,drop}`, `cta-platform-explore`,
`cta-primitives-{ai,marketing,saas,ecommerce,internal}`; unknown labels derive `cta-<block>-<slug>`.

**Decisions**
- Code samples (5 use-case examples) live in the repo as the source's pre-highlighted markup,
  `blocks/tabs/samples/<tab-slug>.txt`, referenced by the authored code-title link (David's Model
  D15: the HTML sample tripped the lint 🔴; one model for all five). Cost: ai-readability code
  score 73 % (430 rendered tabs words not in served HTML) — residual.
- Media (DA, scope `index`, ledger `stardust/deploy/media-ledger.json`): 10 logo SVGs (pure vector,
  < 40 KB); step illustrations (inline SVG in the source, one 78 KB) rasterized from the served
  prototype at DPR 3 (PNG); switchback SVGs (45–91 KB > 40 KB pipeline limit) rasterized at 2x —
  the block halves the intrinsic size; video poster PNG.
- `/index` metadata: Title + Description from the prototype head.
- Lints: davids-model-lint PASS (0 🔴; 🟡 hero/testimonial bespoke widgets, tabs D3 3-vs-2 cells
  — tab rows vs stat rows, SVG advisory); delivery-lint 0 P0/P1; localize-links --check PASS;
  media-reconcile 17 hosted; block-roundtrip --ew exit 0 (87/87 editable); qa-gate 29 ok, 2 fail
  = schema artifact (all 7 schema sections share the class `n-page-section`, so the ticker's 10 and
  the tabs' 5 units are asserted against the hero block). `npm run lint` clean.
- Scoped override (foundation request filed): `.switchback .n-switchback { flex-wrap: wrap }` —
  styles.css folds the canon sidebar into an invalid `flex-flow: var(--x, initial) wrap`.
- Switchback / tabs titles: wrapper carries `--step-3` (the source h3's composition size beats .h5/.h4).

## Redirects (D-site, 2026-10-11)
The source root `https://www.netlify.com/` answers 200 and is delivered as the root `index` document
(`/` 200 on aem.page and aem.live), so no redirect row is needed: `stardust/redirects.tsv` carries the
header only and no `/redirects.json` sheet is published (an empty sheet would add nothing).
`/nav` and `/footer` carry `Robots: noindex` and are live; served sitemap 1 = assembled 1.
