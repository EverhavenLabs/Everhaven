# Launch Blockers

Tracked here, not on the storefront. Review and clear every item before production launch.

## Open

- **Quote form has no real backend.** `assets/eh-quote-form.js`, function `submitQuoteForm()`, is a stub that always "succeeds" without sending anything. No form app or endpoint has been chosen yet (deliberately deferred — Shopify's native contact form can't accept file attachments). Replace `submitQuoteForm()` with a real request to the approved form app or backend endpoint before launch. See the integration-boundary comment directly above that function for the exact contract (field names, multipart/form-data requirement, resolve/reject expectations).

- **Shipping, Privacy, and Terms of Service have no confirmed content at all.** Checked every approved Design-Reference file and this project's own documentation: **zero** confirmed statements exist for these three (no shipping terms, no privacy practices, no legal terms). Nothing was invented to fill the gap.

- **Returns has *some* confirmed operational terms — but not a complete policy.** Six specific points were approved and are now live on `templates/page.returns.json` (via `eh-policy-header`'s "confirmed terms" callout, styled distinctly from the specimen badge so the two can't be mistaken for each other):
  1. Returns accepted within 14 days.
  2. Items must be unused and undamaged.
  3. The customer pays return shipping unless the item arrived damaged or incorrect.
  4. Original shipping charges are nonrefundable.
  5. Damaged or incorrect orders must be reported within 7 days and include photos.
  6. Contact email: support@everhaven.design.

  **Confirmed** (the 6 points above, exact wording, live in the theme). **Still needs operational confirmation**: whether `support@everhaven.design` is also the general Contact-page/business email (only confirmed so far *for returns reporting*), how returns are physically processed (drop-off, mail-back label, etc. — not stated), whether "damaged or incorrect" needs any evidence beyond photos. **Still needs legal review**: everything a complete returns/refund policy conventionally also covers that was *not* approved — restocking fees, cancellations, warranties, international returns, and how this interacts with digital/STL products (no digital refund terms exist at all — do not assume the 6 points above apply to digital products). None of that has been drafted; do not draft it automatically.

  For Shipping/Privacy/Terms, two separate systems still need real content before launch, and they are legally distinct — see §14 "Native Shopify policies vs. custom informational pages" in `PROJECT-HANDOFF.md`:
  1. Shopify's **native** policy records (Admin → Settings → Policies) — Shipping, Refund, Privacy, Terms of Service, and (if used) Subscription policy. These drive the footer's native policy-links row and checkout's policy links. The Refund policy record can be populated from the 6 confirmed Returns points once transcribed by whoever has Admin access — that transcription is an Admin data-entry task, not a theme-code task, and is still open.
  2. The **custom** `page.policy`/`page.returns` templates' body content (edited per-Page in Admin's Page content editor) — currently empty beyond the confirmed-terms callout, not a substitute for #1.
  **This needs real legal/business review, not a copy-paste of generic boilerplate.**

## Store-configuration dependencies (not blockers, but required before the affected pages work)

- Git repo history: local `shopify-theme` branch is intentionally unrelated to `origin/main`'s existing static-site history — do not push until you've decided how the two should reconcile.
- `main-menu` and `footer` navigation menus need real links (Shop/Services/Capabilities/About, etc.) created in Admin → Online Store → Navigation.
- The "Get a Quote" page needs to be created in Admin with template `page.quote` assigned, before `templates/page.quote.json` is reachable at a real URL.
- Enter real text for each policy in Admin → Settings → Policies (native Shopify policies — see above; the Refund policy can start from the 6 confirmed Returns points, transcribed and expanded with real legal review). Until this is done, Dawn's footer (`show_policy: true`) simply won't show links for whichever policies are still blank — this is Dawn's own correct, non-broken default behavior, not a bug.
- Create the Shipping, Privacy, and Terms **Pages** in Admin and assign the `policy` template to each (fully generic/specimen — no confirmed content). Create the Returns **Page** and assign the `returns` template (has the 6 confirmed points built in). Write remaining body content via the Page editor for all four — separate from the native policy records above; see `PROJECT-HANDOFF.md` §14.
- No confirmed *general* business contact info exists: no phone, physical address, or response-time commitment anywhere in the approved source, and `support@everhaven.design` is confirmed only in the returns-reporting context so far — confirm whether it doubles as the general Contact-page address before using it there. Don't fill the remaining gaps with placeholders that look real.
- Digital Downloads app still not installed — STL license/format/print-note metafields (`docs/commerce.md`) and any digital-product refund/licensing policy language both depend on real decisions here first. The 6 confirmed Returns points do not mention digital products; do not assume they apply there.
