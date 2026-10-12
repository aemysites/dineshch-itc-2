# Rollout report — www.netlify.com → AEM Edge Delivery (2026-10-11)

| | |
|---|---|
| **Pages** | 1 delivered / 1 in scope (home page `/`, root `index` document), live on aem.page + aem.live |
| **Templates** | 1 (landing) — archetype gated, 0 siblings (bounded-single run) |
| **Blocks** | 7 page blocks (hero, logo-ticker, steps, cards, switchback, testimonial, tabs) + header, footer |
| **Quality** | published gate 1440 1.23 % Δh −1 / 360 3.89 % Δh +3; gate-all 1/1 PASS (3.72 % / 5.91 %); clip 0; content MISSING/HIDDEN 0; optimize health 100, open 0; links 74/74 200; dynamics 16/16 PASS; martech carried over, all parts off |
| **To deliver** | nothing in scope. Owner decisions: turn on consent (OneTrust) and tags (GTM) in `stardust/martech-contract.json`; newsletter submission (HubSpot) awaiting owner; site search is host-bound (pagefind) |

Out-of-scope netlify.com targets (40 paths) link to the source site (decision in `stardust/direction.md`).
Residuals: search-dialog crop framing in chrome-compare (2 errors, dialog visually equivalent);
"Help" heading role swap in content-diff (justified); AI-chat answers are a host-bound service.
