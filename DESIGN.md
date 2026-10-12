---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-11T15:57:52Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/prototypes/tokens.css
---
# Design — Netlify home (current state, preserved)

Descriptive spec of https://www.netlify.com/ as captured on 2026-10-11. Values come from the
site's own stylesheet (`:root` tokens lifted verbatim into `stardust/prototypes/tokens.css`) and
the computed-style census; nothing here is a design decision.

- **Palette:** white canvas (#ffffff, #f6f6f7 secondary), text #353a3e, headings #181a1c, weak text
  #778089; primary button teal #32e6e2 (hover #8efbf7); brand blue #2e51ed; dark code/illustration
  panels #181a1c with #89ddff / #c792ea syntax colours.
- **Type:** Figtree 800 for display and headings (h1/h2 64px at 1440, line-height 1.1), Instrument
  Sans for text (1.5 line-height), Martian Mono for code and eyebrows.
- **Container:** 1280px content cap (measured, shell), centred.
- **Shape:** radii 2–30px scale, pill buttons 360px; cards white with #e9ebed borders.
- **Composition:** hero with prompt box; logo ticker; how-it-works step trio + video; 4-card grid;
  three dark switchback panels; testimonial; tabbed use-case panel with code; stat row.
