# Journal — replica of https://www.netlify.com/

## Extract — bounded single-page capture of the home page (2026-10-11)
- `crawl.mjs --max 1 --dynamics`: 1/1 captured headless (no bot wall), HTTP 200, 1440×7585 screenshot; vision check ok.
- Dynamic reach: 8 same-site data endpoints, hydrated (Astro islands), OneTrust consent (`#onetrust-accept-btn-handler`).
- Fonts are OFL (Figtree display, Instrument Sans text, Martian Mono code) — 7 subsetted woff2 self-hostable; 8 source stylesheets and 15 media files harvested.
- Style census at 1440 and 360 → `_computed-styles.json`. Bounded run: no descriptive synthesis (Phase 2 takes bounded-single branch).

## Preserve direction — bounded-single spec, empty register, dynamics triaged (2026-10-11)
- Bounded branch: PRODUCT.md / DESIGN.md / DESIGN.json synthesized from the captured page JSON + the lifted `:root` (tokens.css, 530 lines verbatim from the source stylesheet); provenance `bounded-single`. DESIGN.json added to `.hlxignore`.
- Register empty — pure replica. No target breakpoints.
- Dynamics: detect 29 findings → curated 14 rows in `stardust/dynamic-features.md` (every row has a disposition; self: menus, prompt UI, ticker, tabs, copy, video). Martech: OneTrust + GTM-T7WNFLD carried over OFF (`stardust/martech-contract.json`, tagNotes from the GTM library: click events key off `cta-*` / `nav-*` ids → the build keeps source ids).

## Recreate — home archetype authored and converged in 3 rounds (2026-10-11)
- canon.css = the source's @layer variables/reset/composition lifted verbatim (+ self-hosted OFL fonts); sections re-authored in three parallel parts (chrome / upper / lower), assembled by `stardust/prototypes/assemble.mjs`.
- Every section height equal to live at 1440 and 360 (anchor.mjs: doc 7585 / 10778 both sides).
- Round 1: 0.46% / 5.72%, 18 🔴 (hidden quick-search dialog missing) → added dialog, required-asterisk colour, Ask Netlify floating button. Round 2–3: 0.10% / 4.27%, 1 justified 🔴 ("Help" astro-slot granularity), chrome parity quiet, crops 100%.
- Motion: 13 parity / 0 missing / 0 extra after renaming the header scroll-shadow keyframes to the source name.

## Source-fidelity gate — index passes at 1440 and 360, approved hands-off (2026-10-11)
- 1440: pixel 0.10%, Δh 0, content-diff 1 justified 🔴 (astro-slot "Help" granularity), visual flags 0, chrome parity quiet, crops 100%, clipped 0, overflow ok.
- 360: pixel 4.27%, Δh 5 (live stitch artefact; DOM 10778 = 10778), same justified 🔴, crops 100%, clipped 0, overflow ok.
- Prototype table (gate-all --stage prototype): 1440 0.13% PASS, 360 4.26% PASS. Cap row: 7/7 modules equal; wrapper row justified by measure.mjs Δ0 at 2560.

## Render — index archetype placed into stardust/migrated (2026-10-11)
Rollout A found no `stardust/migrated/` (inventory.mjs exit 1), so the prerequisite migrate render ran first: `migrate.mjs render index` → `stardust/migrated/index.html` (branch A, tier archetype; 29 assets, 7 sections; 95 "broken" internal links are pages outside the 1-page scope, left for E2). Sidecar `modules[]` was empty; recorded from the 7 sections: hero, logo-ticker, steps, cards, switchback, testimonial, tabs. State advanced approved → migrated.

## A-inventory — 1 page, 1 template, DA coordinates filled (2026-10-11)
`inventory.mjs --site-url https://www.netlify.com/ --state stardust/state.json` → coverage/pages.json (index → path `/`, template `index`, 7 blocks, pending), coverage/templates.json (index:1), rollout.json. Filled site.da.org=aemcoder, site.da.site / site.site=928837cf, site.da.ref=main, site.liveHost=main--928837cf--aemcoder.aem.live. The root `/` is delivered by the `index` document.

## B-block — 7 distinct module blocks, all converted on index (2026-10-11)
blocks.mjs → coverage/blocks.json: 7 module blocks (edsBlockName = id): hero, logo-ticker, steps, cards, switchback, testimonial, tabs; 0 chrome rows (header/footer come from the C0 foundation unit, not the module sidecar). plan.mjs → plan.json: one representative page, `index` (rep, pending) convert all 7, reuse none.

## B2-dynamic — inventory re-verified, no new findings (2026-10-11)
Fresh dynamics-detect on https://www.netlify.com/ (scratch out stardust/.work/rollout/dynamics-fresh/) reproduced the same 29 findings; dynamics-plan against the aem.page target (+ --migrated, --martech) refreshed stardust/dynamics/dynamic-features.generated-plan.* and martech-contract.json provenance. Host-bound 1/1 (pagefind 404, row 8); 3 rows delivered-by-capture (markup presence). Every curated row in dynamic-features.md keeps a disposition; verification section appended. Open owner items (search, Ask Netlify, martech enable) ship at interim tier and do not block C-deliver.

## C-deliver foundation — canon styles, fonts, header/footer blocks, chrome docs live (2026-10-11)
C0 foundation unit. styles.css generated from the prototype canon (source layers kept, variables
pruned to the 454-token closure, exact hex for 8-bit colours, `--step--N` → `--step-minus-N`,
`--_x` → `--local-x`); EDS structural layer unlayered after it; content cap carried by the breakout
grids (main not capped). OFL fonts self-hosted with metric-matched fallbacks. Header and footer
re-implemented as template-slotted blocks fed from `/nav` and `/footer` (section-metadata roles),
source GTM ids derived from link text (id set identical to the prototype). Martech scaffolded (all
off). Lint clean; pushed to main; `/nav` + `/footer` preview and live 200. Harness and published
header/footer bands 99.8–100 % vs the prototype. Shell gate (chrome-compare vs live) deferred to
the archetype unit — no root page yet. Foundation frozen (22 files). Details: eds-conversion-log.md.

## C-deliver archetype landing — index live at `/`, gated on the published origin (2026-10-11)
Seven blocks authored from the gated prototype (hero, logo-ticker, steps, cards, switchback,
testimonial, tabs; boilerplate hero/cards replaced), content/index.html generated verbatim from the
prototype parts, 17 media uploaded to DA (`media/index/`). Chain: lint → localize → delivery-lint →
media-reconcile → davids-model-lint → sanitise → block-roundtrip --ew + qa-gate (harness via
`aem up`, stopped) → deploy-batch (ledger-archetype-landing.json) → `/` 200 on aem.page and aem.live.
Published gate: pub1 1440 5.35 % Δh −57 (step-image descender, CLI code box, switchback h3 size);
pub1 360 12.71 % Δh −399 (switchback never wrapped: foundation `flex-flow` bug, scoped override);
pub2 1440 1.23 % Δh −1, 360 3.88 % Δh +3 (live stitch +5 known), main-region 🔴 0, clip 0, overflow ok.
24 structural 🔴 remain, all header/footer (icon symbol ids, search-dialog help links, Help role
swap) — foundation requests filed with chrome-compare (14 errors). Header/footer crop 100 % /
100 % (1440), 100 % / 99.71 % (360). gate-all PASS at both widths (3.68 % / 5.92 %); coverage
updated. Residual: ai-readability 73 % (code samples ship from the repo by D15).

## C-deliver final — foundation requests applied once, roster gated, C-deliver closed (2026-10-11)
cluster-landing recorded with 0 siblings (single-page scope). C-final: freeze check, then the four
queued requests applied once — `.ntl-sidebar-left` longhands restored (switchback override removed);
header/footer icons back to `<symbol id="ai:local:*">` + `<use>`; dialog Help links and CTA present
at load; drawer panels populated (48 links), mega-menu heights matched, "Ask Netlify AI" state and a
chrome-link typeahead (site search stays host-bound). chrome-compare 14 → 2 errors (search-dialog
crop framing only). Re-gate pub3: 1440 1.23 % Δh −1, 360 3.89 % Δh +3, content-diff 1 🔴 (Help
role, justified). Foundation refrozen (23 files). gate-all (--skip-existing --recapture-eds, via
the deployed-state copy): 1/1 PASS 1440 3.72 % / 360 5.91 %, clip 0, MISSING/HIDDEN 0; coverage
updated.

## D-site — root resolves, sitemap verified, no redirects needed (2026-10-11)
assemble.mjs: 1 url; `--verify-origin` aem.live exit 0 (served 1 = assembled 1, chrome documents
excluded by their noindex rows). `/` 200 on aem.page and aem.live (root `index` document). Source
root answers 200, so the redirects sheet has no rows; `redirects.tsv` holds the header only.

## D2-dynamic — 14 parity rows, 16/16 checks pass, martech verified (2026-10-11)
`stardust/dynamics/parity.json`: 14 curated features (9 dom-count, 2 click-dialog, 1 video-plays,
1 no-page-errors; consent/tags/newsletter `scaffolded-awaiting-owner`, site search host-bound —
`/pagefind/` 404, dialog only). dynamics-check on aem.live: 14/2 → header `aria-modal` set only
while the search dialog is open (4dc344b) → 16 PASS / 0 FAIL. Martech: `/scripts/martech.js` 200,
all contract parts off, no tag/CMP host requested. Foundation refrozen after the header fix.

## E-full-site — 1/1 verified, ticker restored at delivery (2026-10-11)
verify.mjs on aem.live: 1 checked, 1 verified, 0 failed (gate table PASS at 1440 + 360 already in
coverage). Render check: the one `restoreAtDelivery` entry (logo ticker marquee) animates on the
published origin at 1440 and 360 (`scroll-x`, x advancing).

## E2-link-audit — 74/74 hrefs answer 200, out-of-scope targets repointed to source (2026-10-11)
`localize-links --check` PASS (0 localizable); all other netlify.com paths are scope extension and
stay absolute to the source (decision in `direction.md`). Rendered hrefs on aem.live (1440 + 360):
74 unique, all 200; on-origin targets `/` and `/#main` only; no 404.

## F-optimize — health 90, P1 0, one P2 routed to G (2026-10-11)
optimize.mjs on aem.live: 1 page, health 90/100, open P1 0 / P2 1 / P3 0, source parity 0. The
P2 is `ai-search/jsonld`: the source ships an Organization + WebSite JSON-LD graph the delivered
page lacks — platform-migration fixability, carried to G-aem. Gate PASS (no open P1).

## G-aem — source JSON-LD carried over, health 100 (2026-10-11)
autofix-aem: 1 candidate, manual (eds-jsonld). The source's Organization/WebSite/WebPage/
BreadcrumbList/SoftwareApplication graph is carried verbatim as a `JSON-LD` metadata row on the
index document; `scripts.js` `loadJsonLd()` validates it and moves it into an ld+json script through
a dedicated Trusted Types policy (the CSP requires TT for scripts). Re-deployed `/index` (live);
rendered graph 5 nodes, 0 page errors. optimize re-run: health 100, open 0 (P2 jsonld fixed);
verify 1/1.

## H-report — summary written, five learnings recorded (2026-10-11)
`stardust/rollout/report.md`: 1/1 page live, 1 template, 7 blocks, gates and quality all passing,
owner decisions listed (martech parts, newsletter backend, host-bound search). `stardust/learnings.md`
created with five entries.

## I-dashboard — dashboard built (2026-10-11)
dashboard.mjs: 1 page identified · prototyped · deployed · optimised → `stardust/rollout/dashboard/`.

## Handoff close — header contract recorded, run complete (2026-10-11)
`chrome/header-contract.json` = the source exploration (www.netlify.com, 1440 + 360); build re-explored
on aem.live; chrome-compare (replica profile): 2 errors / 12 warnings / 0 decided. The 2 errors are the
search dialog's open-state crop (42.8 % / 84.5 %): the source crop is framed from the viewport origin
and includes the blurred page around the panel (1012×640 vs the panel's 600×514); the panel's contents
match item for item. Left open for the owner (no owner decision fabricated). Runner done-check:
complete, no gaps. Dashboard, report and learnings in place.
