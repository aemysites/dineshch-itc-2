# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.netlify.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** OneTrust · `data-domain-script` = `5dec0507-5e89-4bb4-8f2d-0872be7dd9dd`
- **Model `per-tag` (read by the model, not parsed):** the source loads the tag manager ungated and gates each tag inside it by consent group. Keep it: leave every route `category` null.
  - google-tag-manager rule Consent-gated tag (tag 802) checks `C0002` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- **Categories** (default rule set of 5 geo rule sets — the CMP applies them, nothing to port): `C0003` Functional Cookies (active) · `C0005` Social Media Cookies (active) · `C0001` Strictly Necessary Cookies (always active) · `C0002` Performance Cookies (active) · `C0004` Targeting Cookies (active)

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| google-tag-manager | Google Tag Manager | `https://www.googletagmanager.com/gtm.js?id=GTM-T7WNFLD` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): marketing: HubSpot tracking · marketing: ad / retargeting pixel.

## Rewrite before go-live

These read the old URLs or DOM and will not match the migrated pages:
- google-tag-manager rule GA4 event click (tag 621) — paths `/` — selectors `[id^=cta-]`, `[id^=nav-]`, `#cta-hero-getstartedforfree`, `#mainNav-signup`, `#cta-hero-requestDemo`, `#nav-contact-requestDemo` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- google-tag-manager rule GA4 Hubspot Form Submit / generate_lead (tags 662, 733) — paths `*` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- google-tag-manager rule Google tag (tag 647) — paths `*` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- google-tag-manager rule Consent-gated tag (tag 802) — paths `*` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- google-tag-manager rule GA4 video_* events (tag 740) — paths `*` — selectors `lite-youtube / YouTube embeds` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)

## Data layer

The source pages expose `dataLayer`; keep the same global names.
google-tag-manager (read by the model, not parsed) rules fire on data-layer pushes; the migrated pages must push the same events: `gtm.click` (1) · `gtm.linkClick` (1) · `hubspot-form-success` (1) · `gtm.load` (1) · `OneTrustGroupsUpdated` (1) · `gtm.video` (1).
Data elements read these data-layer paths: `window.OnetrustActiveGroups / dataLayer`, `dataLayer push on hubspot-form-success`.
Rules in Google Tag Manager were not parsed. Read each library listed in `martech/tags.json` and record its rules and data elements in the contract's `tagNotes`, keyed by tag manager, each citing where it was read (`from`); until then their triggers and events come from the tagging plan.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.

- google-tag-manager rule GA4 event click (tag 621) — listens for `gtm.click`, `gtm.linkClick` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- google-tag-manager rule GA4 Hubspot Form Submit / generate_lead (tags 662, 733) — listens for `hubspot-form-success` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- google-tag-manager rule Google tag (tag 647) — listens for `gtm.load` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- google-tag-manager rule Consent-gated tag (tag 802) — listens for `OneTrustGroupsUpdated` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)
- google-tag-manager rule GA4 video_* events (tag 740) — listens for `gtm.video` — read by the model at stardust/martech/tags/www.googletagmanager.com-gtm-GTM-T7WNFLD.js resource.tags/rules (extracted by stardust/.work/gtm-extract.cjs)

## Tag-manager notes (read by the model, not parsed)

**google-tag-manager:** 111 tags / 48 rules in container GTM-T7WNFLD; click tracking keys off element ids prefixed cta- and nav- — the migrated blocks keep the source ids on CTAs and nav links.,Several tags are __paused in the container; they stay paused.

Confirm everything read by the model against the owner's tagging plan.
