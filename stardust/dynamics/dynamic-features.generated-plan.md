<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-11T16:24:43.457Z · input stardust/.work/rollout/dynamics-fresh/_dynamics.json (1 pages, 29 findings) · target probe https://main--928837cf--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-api-hubapi-com | A | unknown third-party host api.hubapi.com | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-cta-service-cms2-hubspot-com | A | unknown third-party host cta-service-cms2.hubspot.com | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-cdn-segment-com | A | unknown third-party host cdn.segment.com | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-grsm-io | A | unknown third-party host grsm.io | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-partnerlinks-io | A | unknown third-party host partnerlinks.io | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-api-segment-io | A | unknown third-party host api.segment.io | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 9 | cr-client-framework-astro | CR | client framework astro | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 10 | d-first-party-data-file-get-pagefind-pagefind-entry-json | D | first-party data file GET /pagefind/pagefind-entry.json | 1/1 (reach 3/1) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 11 | f-form-backend-hubspot-forms | F | form backend: HubSpot forms | 1/1 | rebuild-native | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 12 | f-form-protection-captcha-antibot | F | form protection: captcha / antibot | 1/1 | rebuild-native | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 13 | f-form-hsform-52611e5e-cc55-4960-bf4a-a2adb36291f6-52611e5e- | F | form "hsForm_52611e5e-cc55-4960-bf4a-a2adb36291f6_52611e5e-cc55-4960-bf4a-a2adb36291f6-0" → third-party forms.hsforms.com (2 fields, tokens: g-recaptcha-response) | 1/1 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 14 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 1/1 (reach 4/1) | rebuild-native | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "Toggle platform submenu" |
| 15 | t-consent-onetrust | T | consent: OneTrust | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 16 | t-unknown-third-party-host-js-hsadspixel-net | T | unknown third-party host js.hsadspixel.net | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-marketing-hubspot-tracking | T | marketing: HubSpot tracking | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-rum-error-monitoring | T | RUM: error monitoring | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-track-hubspot-com | T | unknown third-party host track.hubspot.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-unknown-third-party-host-static-ads-twitter-com | T | unknown third-party host static.ads-twitter.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-analytics-twitter-com | T | unknown third-party host analytics.twitter.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 1/1 | embed-passthrough | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.linkedin.com" |
| 26 | t-third-party-mount-div-data-ads-portal-id-tag-manager-injec | T | third-party mount <div data-ads-portal-id> (tag-manager-injected widget) | 1/1 | embed-passthrough | needs-credential | pending | embed-passthrough | vendor account ids stay the owner's |  |
| 27 | t-third-party-mount-div-data-astro-exec-tag-manager-injected | T | third-party mount <div data-astro-exec> (tag-manager-injected widget) | 1/1 | embed-passthrough | needs-credential | pending | embed-passthrough | vendor account ids stay the owner's |  |
| 28 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 1/1 | embed-passthrough | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 29 | x-sign-in-account-links | X | sign-in / account links | 1/1 | decided-out | needs-backend | delivered-by-capture | decided-out | auth / commerce on the new host? | output already carries "https://app.netlify.com/login" |

## Triage

- **Ships autonomously (reproducibility `self`):** 3 row(s) — read-settings, settled-dom-snapshot, sheet-sync.
- **One owner decision batch:** 23 row(s) — inspect the XHR, add a vendor row · production backend (vendor form id + field mapping) · production endpoint; interim capture ships now · CMP domain script reuse on the new host · which tags run on the new host; property ids · vendor account ids stay the owner's.
- **Already delivered by the capture pipeline:** 3 row(s) — no work.
- **Host-bound on the target:** 1 of 1 probed API paths — the off-origin data work.
- **Martech:** OneTrust · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 11
- **detect** — 8
- **forms** — 3
- **embeds** — 3
- **capture** — 1
- **data** — 1
- **interactive** — 1
- **register** — 1
