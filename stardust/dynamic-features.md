<!-- stardust provenance: skill=stardust:replica · phase=preserve-direction (dynamics Phases 1–3) · 2026-10-11 · input stardust/current/_dynamics.json, stardust/dynamics/dynamic-features.generated-plan.json · hands-off -->
# Dynamic features — https://www.netlify.com/ (home page only)

## Listings contract
none — the migrated scope is one page with no listing blocks.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | header-menus | header mega-menus (Platform, Solutions, Developers, Resources), mobile hamburger drawer, announcement-bar close | M | 1/1 | rebuild-native | self | pending | chrome-interaction | none (header contract is the spec) | generated #14 |
| 2 | hero-prompt | hero prompt box / dropzone (Astro island: textarea + "Add Netlify to your coding agent" copy button) | CR | 1/1 | rebuild-native | self | pending | client-only | prompt submit target stays app.netlify.com (link-out) | `.n-dropzone.dz-hero` |
| 3 | logo-ticker | auto-scrolling customer logo ticker | CR | 1/1 | client-only | self | pending | css-animation | none | `.n-ticker` |
| 4 | use-case-tabs | 5-tab "For every kind of web app" panel with code samples + copy buttons | CR | 1/1 | client-only | self | pending | tabs | none | `n-tabs.n-tabbed-content` |
| 5 | cli-copy | copy-to-clipboard on CLI snippet | CR | 1/1 | client-only | self | pending | client-only | none | `.n-cli-copy-btn` |
| 6 | youtube | lite-youtube "What is Netlify" video (poster, click-to-load iframe) | V | 1/1 | embed-passthrough | self | pending | embed-passthrough | none (public YouTube id) | generated #28, `lite-youtube` |
| 7 | newsletter-form | footer newsletter form (HubSpot form 52611e5e…, email + hidden utm, reCAPTCHA) | F | 1/1 | rebuild-native | needs-backend | pending | forms | production backend: HubSpot portal/form id + field mapping — interim: UI rebuilt, submit posts to HubSpot only when the owner enables it | generated #11–13 |
| 8 | site-search | header search toggle (Pagefind index on source) | S | 1/1 | static-snapshot | self | pending | search-index-backed | undecided — revisit at rollout (one-page corpus; button kept, results page not built) | generated #10 (`/pagefind/` 404 on target) |
| 9 | consent | OneTrust CMP (domain script 5dec0507…) | T | 1/1 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | CMP domain-script reuse on the new host — `stardust/martech-handoff.md` | generated #15 |
| 10 | tags | GTM-T7WNFLD (+ GA4 G-X2FMMZSSS9, HubSpot tracking, LinkedIn/Twitter/ads pixels, Segment, error RUM — all injected by GTM or inline) | T | 1/1 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | which tags run on the new host; route enabled by owner — contract off | generated #1–7, #16–25 |
| 11 | tm-mounts | tag-manager-injected mounts (`data-ads-portal-id`, HubSpot web interactives) | T | 1/1 | embed-passthrough | needs-credential | scaffolded-awaiting-owner | embed-passthrough | vendor account ids stay the owner's | generated #26–27 |
| 12 | datalayer | `dataLayer` global + Astro hydration | A/CR | 1/1 | static-snapshot | self | pending | read-settings | none — same global name kept for GTM | generated #8–9 |
| 13 | account | Log in / Sign up / avatar slot (app.netlify.com) | X | 1/1 | static-snapshot | needs-backend | pending | link-out | auth lives on app.netlify.com; links kept, avatar slot shows the logged-out state | generated #29 |
| 14 | ask-netlify | floating "Ask Netlify" assistant button | CR | 1/1 | static-snapshot | needs-backend | pending | embed-passthrough | assistant backend is the owner's; undecided — revisit at rollout | `.ask-netlify-button` |

## Decision batch
One message to the owner (hands-off: each recorded as a named assumption, interim tier ships):
- **Backend:** HubSpot newsletter form id/portal for the new host (#7) · Ask Netlify assistant (#14).
- **Business:** OneTrust domain-script reuse on the new host (#9) · which GTM/GA/pixel tags run on the new host (#10, #11) — all scaffolded OFF in `stardust/martech-contract.json`.
- **Search:** whether a site search index is built for the new host (#8).

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none (hands-off never writes decided-out) | — |

## Rollout B2 verification (2026-10-11)
Fresh evidence: `dynamics-detect.mjs --urls https://www.netlify.com/ --reach stardust/current` → `stardust/.work/rollout/dynamics-fresh/_dynamics.json` (29 findings: 32 third-party hosts, 8 first-party API, 1 form, 5 triggers, 3 media, 0 client-rendered); `dynamics-plan.mjs --target-origin https://main--928837cf--aemcoder.aem.page --martech stardust/martech --migrated stardust/migrated --out stardust/dynamics`.
- Same 29 finding ids as the Phase 2 capture (order only differs) → **no new rows**; all 14 curated rows keep their disposition.
- Host-bound: 1/1 — `/pagefind/pagefind-entry.json` 404 on target (already row 8, site-search).
- `--migrated` marks 3 generated rows delivered-by-capture (#14 submenu toggles, #25 linkedin link, #29 app.netlify.com login): markup presence only — curated rows 1 (header-menus, rebuild-native) and 13 (account, static-snapshot links) unchanged.
- Still open, interim ships (not a C-deliver blocker): row 8 site-search (button kept, no results page), row 14 ask-netlify (static button); martech 0/1 routes enabled, contract OFF.
