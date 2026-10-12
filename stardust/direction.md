---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-11T15:57:52Z
  againstInput: https://www.netlify.com/
  mode: bounded-single
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/prototypes/tokens.css
    - stardust/current/_computed-styles.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.netlify.com/,
promoted verbatim (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-11T15:57:52Z)

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link audit decision (E2, 2026-10-11)
Scope is the single home page (bounded-single run). Every other netlify.com target linked from the
page, nav or footer (/pricing, /blog, /platform, /solutions/*, docs, … — 40 distinct paths) is
SCOPE EXTENSION outside the declared cap, so it stays repointed to the source site as an absolute
`https://www.netlify.com/…` link. `localize-links --check`: 0 localizable left. Rendered page on
aem.live at 1440 + 360: 74 unique hrefs, 74 × 200; the only on-origin targets are `/` and `/#main`.
