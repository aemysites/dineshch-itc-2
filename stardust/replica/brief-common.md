# Common brief — replica recreation of https://www.netlify.com/ (home)

You are re-authoring part of the live Netlify home page as CLEAN semantic HTML/CSS so it matches the
live page near pixel-perfect at 1440px and 360px viewports. This is RECREATION, not redesign:
no new palette/type/spacing/composition, no rewording, no "improvements". Never paste the live DOM
or port whole stylesheets; re-author markup cleanly and lift VALUES from the source CSS.

Project root: /workspace/928837cf (run every command from there). Prototype dir: stardust/prototypes/
- Served at http://localhost:8791/index-proposed.html (a server already runs; never start/stop servers).
- `node stardust/prototypes/assemble.mjs` rebuilds index-proposed.html from stardust/prototypes/parts/*.html.
  It links canon.css, chrome.css, top.css, bottom.css and chrome.js, top.js, bottom.js. Only edit YOUR files.
- canon.css = the source's own @layer variables/reset/composition lifted verbatim (tokens like
  --space-*, --color-*, --font-*, --step-*, utilities .ntl-flow, .ntl-cluster, .ntl-breakout, .button[data-type],
  reset, @font-face for Figtree / Instrument Sans / Martian Mono). Do not edit it; use its variables.
  Put your rules in `@layer blocks { … }` ONLY if you need them to lose to canon; normally write them unlayered.
- Media: stardust/prototypes/media/ (logos *.svg, switchback-1..3.svg, what-is-netlify-thumbnail.png, favicon.ico).
  Inline SVG illustrations/icons may be re-authored as inline <svg> taken from the captured DOM (an asset, not layout).
  Any url() must resolve to a local file — never hot-link www.netlify.com.

Evidence sources (in this order):
(a) CONTENT verbatim from the captured DOM `stardust/current/pages/index.html` and `stardust/current/pages/index.json`.
    Every heading, paragraph, list item, CTA label + href, alt text exactly as captured. Keep the source element ids on
    CTAs/links (e.g. id="cta-hero-get-started", ids starting cta- / nav- / main-nav- / mainNav-) — analytics rules key off them.
    Relative hrefs: make them absolute to https://www.netlify.com (e.g. href="https://www.netlify.com/pricing/") unless the
    captured href is already absolute.
(b) VALUES from the source stylesheets in stardust/current/assets/css/*.css (minified; component rules carry
    [data-astro-cid-*] attributes). Read them ONLY through:
      node stardust/scripts/replica/css-rules.mjs <sheet> '<selector regex>' [--media <re>] [--decl <re>] [--max n]
    Read captured HTML ONLY through:
      node stardust/scripts/replica/html-slice.mjs stardust/current/pages/index.html '<tag|.class|#id>' [--text] [--max-chars n]
      node stardust/.work/outline.cjs stardust/current/pages/index.html '<css selector>' <depth>   (structure outline)
    Never cat/sed whole sheets or the HTML (they are huge; context is the budget).
(c) GROUND TRUTH screenshots: stardust/replica/gates/index-1440/live.png (1440x7585) and
    stardust/replica/gates/index-360/live.png (360x~10780). View only CROPS: e.g.
      node -e "const {PNG}=require('pngjs');..."  is NOT needed — use
      node stardust/scripts/replica/crop-compare.mjs <live.png> <build.png> --y <px> --height <px> [--out <file>]
    (prints match % for a band and can write a side-by-side/diff crop you can Read). One crop per fact.
    Live section y-offsets (anchor probe):
      1440: header 0–74 · hero 74 h543 · logos 617 h69 · how-it-works(#section-get-started) 686 h1684 ·
            start-your-way 2370 h977 · platform(switchbacks) 3347 h1842 · testimonial 5189 h347 ·
            primitives(tabs+stats) 5536 h1141 · footer 6773 h716 · doc 7585
      360:  header 0–61 · hero 61 h737 · logos 798 h64 · how-it-works 862 h1826 · start-your-way 2688 h1673 ·
            platform 4361 h2878 · testimonial 7239 h433 · primitives 7672 h2049 · footer 9816 h865 · doc ~10780

Measuring (the ONLY live-vs-prototype instrument; never author your own Playwright probe):
  node stardust/scripts/replica/measure.mjs https://www.netlify.com/ --against http://localhost:8791/index-proposed.html \
     --selectors "<css>,<css>" --width 1440,360
  It prints rect + computed styles per selector per width and a delta line each. Use the same selectors on both sides
  (adopt the live class names on your elements where sensible, e.g. .n-step-heading, so one selector hits both).
  Capture the prototype full page for crop comparison with:
  node stardust/scripts/replica/stitch-shot.mjs http://localhost:8791/index-proposed.html /tmp/<you>-<w>.png --width <w>
  then crop-compare against the live png at your section's band.
HARD MACHINE LIMIT: run at most ONE browser-launching command at a time (measure / stitch-shot), in the foreground,
never in background, never in parallel tool calls. Never run gate.sh, never touch stardust/replica/gates/* files,
never kill processes, never npm install.

Method per section: 1) outline + content from capture, 2) lift exact values (font sizes incl. clamp(), line-heights,
letter-spacing, paddings, gaps, radii, borders, shadows, backgrounds, grid templates) at BOTH desktop and mobile
@media of the source (the source's own media queries — keep the same breakpoint values), 3) author, 4) measure at
1440 and 360 and fix deltas (heights within a few px per section are the goal; total section height drives the gate).
Respect computed `text-wrap`, `box-sizing`, fonts. Mobile 360 is its own pass: lift the source's mobile rules.
Behaviour you must re-implement minimally in your JS file (vanilla, no deps): only what is listed in your task.
Animations: honour prefers-reduced-motion like the source; the gate freezes animations.

Finish with a SHORT report (≤ 12 lines): files written, per-section measured height live vs proto at 1440 and 360,
known residuals. Do not paste code in the report.
