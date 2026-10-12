# Learnings

- 2026-10-11 · rollout C-deliver · `flex-flow: var(--x, initial) wrap` is invalid at computed time when
  the fallback is used (→ `nowrap`); keep `flex-direction` and `flex-wrap` as separate longhands.
- 2026-10-11 · rollout C-final · content-diff matched live link text ";Go to docs;" — inline SVGs on the
  source carry a stray `;` text node; parity needs it mirrored or the CTA reads MISSING.
- 2026-10-11 · rollout D2 · a closed `<dialog>` that keeps `aria-modal="true"` reads as open to
  dynamics-check; set `aria-modal` only while open.
- 2026-10-11 · rollout G · under `require-trusted-types-for 'script'`, injecting JSON-LD needs its own
  `createScript` policy; carry the graph as a `JSON-LD` metadata row.
- 2026-10-11 · rollout gate-all · `gate-all.mjs` selects `state.json` pages with status `deployed`;
  a replica run whose lifecycle stops at `migrated` passes a deployed-state copy via `--state`.
