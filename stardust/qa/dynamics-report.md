# Dynamics parity check — https://main--928837cf--aemcoder.aem.live — 2026-10-11T18:38:01.578Z

Replayed 16 checks over 15 features · pass 16 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header mega-menus (Platform, Solutions, Developers, Resources), mobile drawer, announcement close | M | done | dom-count | PASS | 4 × header .submenu-toggle[aria-controls] (min 4) |  |
| header mega-menus (Platform, Solutions, Developers, Resources), mobile drawer, announcement close | M | done | dom-count | PASS | 44 × header .submenu a[href] (min 40) |  |
| header mega-menus (Platform, Solutions, Developers, Resources), mobile drawer, announcement close | M | done | dom-count | PASS | 1 × header .nav-toggle[aria-controls='main-menu'] (min 1) |  |
| hero prompt box / dropzone + 'Add Netlify to your coding agent' copy button | CR | done | dom-count | PASS | 1 × .hero .n-dropzone.dz-hero (min 1) |  |
| hero prompt box / dropzone + 'Add Netlify to your coding agent' copy button | CR | done | dom-count | PASS | 1 × .hero .homepage-hero-agent-cta (min 1) |  |
| auto-scrolling customer logo ticker | CR | done | dom-count | PASS | 20 × .logo-ticker img (min 10) |  |
| 5-tab 'For every kind of web app' panel with code samples + copy buttons | CR | done | dom-count | PASS | 5 × .tabs [role=tab] (min 5) |  |
| 5-tab 'For every kind of web app' panel with code samples + copy buttons | CR | done | dom-count | PASS | 5 × .tabs [role=tabpanel] (min 5) |  |
| copy-to-clipboard on CLI snippet | CR | done | dom-count | PASS | 1 × button.n-cli-copy-btn (min 1) |  |
| lite-youtube 'What is Netlify' video (poster, click-to-load iframe) | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 19 (ok) | www.youtube-nocookie.com:200×15 fonts.gstatic.com:200×3 www.google.com:200×1 rr1---sn-o097znzd.googlevideo.com:200×1 yt3.ggpht.com:200×2 i.ytimg.com:200×3 www.gstatic.com:200×1 rr2---sn-a5msenes.googlevideo.com:200×2 www.youtube-nocookie.com:204×4 jnn-pa.googleapis.com:200×1 |
| footer newsletter form (HubSpot form 52611e5e…, email + hidden utm, reCAPTCHA) | F | scaffolded-awaiting-owner | dom-count | PASS | 1 × footer form.hs-form input[name=email][required] (min 1) |  |
| header search toggle + quick-search dialog (Pagefind index on source) | S | interim | click-dialog | PASS | dialog 600px · heading "Ask Netlify AI" · 1 fields · Escape closes: true |  |
| dataLayer global + Astro hydration | A/CR | done | no-page-errors | PASS | none on 1 page(s) |  |
| Log in / Sign up / avatar slot (app.netlify.com) | X | done | dom-count | PASS | 8 × a[href*='app.netlify.com'] (min 2) |  |
| floating 'Ask Netlify' assistant button | CR | interim | click-dialog | PASS | dialog 800px · heading "Ask Netlify AI" · 2 fields · Escape closes: true |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (2 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- OneTrust CMP (domain script 5dec0507…) (T) — scaffolded-awaiting-owner · owner: reuse of OneTrust domain-script 5dec0507-5e89-4bb4-8f2d-0872be7dd9dd on the new host (stardust/martech-handoff.md)
- GTM-T7WNFLD (+ GA4, HubSpot tracking, LinkedIn/Twitter/ads pixels, Segment, RUM via GTM) (T) — scaffolded-awaiting-owner · owner: which tags run on the new host — enable routes in stardust/martech-contract.json
- tag-manager-injected mounts (data-ads-portal-id, HubSpot web interactives) (T) — scaffolded-awaiting-owner · owner: vendor account ids stay the owner's
