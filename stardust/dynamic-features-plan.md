# Dynamic features — plan (home page)

| phase | deliverables | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| interactive (self) | header menus + drawer, hero prompt UI, logo ticker, tabs, copy buttons, lite-youtube | blocks keep source ids (`cta-*`, `nav-*`) for GTM click rules | motion-observe/compare per archetype; published-origin gate 1440+360 | none | in recreate + deploy |
| forms | newsletter UI rebuilt; submission interim (no backend wired) | form block with email field | dynamics-check form presence | HubSpot form id | S |
| tags | `scripts/martech.js` from `stardust/martech-contract.json`, every part disabled | `martech-scaffold.mjs` before deploy | `dynamics-check.mjs` martech feature: `/` requests no route/CMP host | enable CMP + routes | S |
| search / assistant | static (button kept) | — | — | revisit at rollout | — |
