# Pre-Launch Checklist

Categorized so it's clear what actually stops launch versus what's just
good practice. Cross-references: `LAUNCH-BLOCKERS.md` (detail on each
blocker), `SHOPIFY-ADMIN-SETUP.md` (how to do the Admin-side items),
`docs/commerce.md`, `docs/metaobjects.md`, `PROJECT-HANDOFF.md`.

Legend: **Blocker** (launch cannot happen honestly with this unresolved) ·
**Required** (needed for a complete, functioning store, but not an
active false-promise/safety issue) · **Recommended** (should happen soon
after launch if not before) · **Optional later** (nice-to-have, no urgency).

---

## Blocker

- [ ] Quote form has a working backend — `submitQuoteForm()` in
      `assets/eh-quote-form.js` is currently a non-functional stub. No
      submissions are sent anywhere today.
- [ ] Spam protection is wired into whichever quote-form backend is chosen
      (Handoff requires this; not possible to add until the backend exists).
- [ ] Real file uploads on the quote form are confirmed working end-to-end
      with the chosen backend (the dropzone UI works today; nothing behind
      it receives a file yet).
- [ ] Shopify Digital Downloads is installed and connected, **or** digital
      products are removed/hidden from the storefront until it is — do not
      let customers purchase a digital product with no delivery mechanism.
- [ ] Once Digital Downloads is connected: revert `eh-stl-cover.liquid`'s
      badge default to `INSTANT DOWNLOAD` and restore "Buy & download" in
      `buy-buttons.liquid` (both were temporarily softened — see
      `LAUNCH-BLOCKERS.md`).
- [ ] Digital-product license language exists and is legally reviewed — the
      digital PDP's License card currently shows a specimen/pending badge
      whenever `custom.license` is blank.
- [ ] Digital-product refund policy is decided and stated somewhere — the 6
      confirmed Returns terms do **not** cover digital products; nothing
      fills that gap today.
- [ ] Native Shopify policies (Shipping, Refund, Privacy, Terms) have real,
      legally-reviewed text in Settings → Policies. Refund can start from
      the 6 confirmed Returns points but needs review before it's complete.
- [ ] Real service Pages exist, the `service`/`capability`/etc. metaobject
      definitions and entries are created, and each service Page's
      `custom.service` metafield is connected (§6–9 of
      `SHOPIFY-ADMIN-SETUP.md`) — without this, the 6 service-detail pages
      have nothing to render.
- [ ] Main and footer navigation menus exist with real links.
- [ ] Contact email is confirmed for general use (only confirmed so far for
      returns reporting: `support@everhaven.design` — confirm whether it
      doubles as the general contact address before publishing it there).

## Required before launch

- [ ] Real product data: titles, descriptions, prices, images for every
      product you intend to sell at launch.
- [ ] Product imagery uploaded for every physical product (object-on-set,
      macro, in-use, scale — per the approved photography shot list).
- [ ] Shipping configuration (zones, rates) set up in Settings.
- [ ] Taxes configured for your jurisdiction(s).
- [ ] Checkout tested end-to-end: a real test physical order, a real test
      digital order (once Digital Downloads is connected), and a real test
      **mixed** cart (one physical + one digital item) — confirm totals,
      the "digital product" line-item styling, and the no-shipping-language
      tax note for all-digital carts all behave correctly.
- [ ] Contact form tested: submit a real message and confirm it arrives
      (Shopify's native notification email) and the success state displays.
- [ ] Quote form tested **after** a backend is connected — the current stub
      is not a valid test of real submission behavior.
- [ ] Mobile testing across the actual site: nav drawer, quote form
      accordion behavior, cart, PDP sticky add-to-cart, all FAQ pages.
- [ ] Accessibility spot-check: keyboard-only pass through header, mobile
      drawer, quote form, FAQ accordions (all categories), cart, checkout
      entry point. Confirm visible focus rings throughout.
- [ ] Domain and DNS configured and verified.
- [ ] All storefront specimen badges either replaced with real content or
      consciously left visible (never silently removed while the content
      behind them is still fake).

## Recommended

- [ ] Equipment specifications (printer models/counts) — if you want the
      Capabilities page's Equipment section to say more than "pending,"
      confirm real specs and update that section.
- [ ] Build-volume/machine-envelope specifications — same as above.
- [ ] Founder story — About page's founder section is 100% placeholder
      today; a real first-person story from the actual founder replaces it.
- [ ] Response-time commitment for quotes/contact, if you want to state one
      (nothing currently promises a specific turnaround anywhere).
- [ ] Remaining FAQ specimen answers (prototypes/small-batch, replacement
      parts, design support, digital STL, shipping/returns categories on
      the general FAQ page) reviewed and finalized.
- [ ] Send a real test order confirmation and review the email template in
      Settings → Notifications.

## Optional later

- [ ] Analytics/consent tooling — only if and when you decide to add it;
      nothing in this theme currently includes any analytics or consent
      banner, by design (no apps installed per the build instructions).
- [ ] Consolidate the homepage's "Featured projects" section (currently
      disabled by default, fully specimen) once real project photography
      and case studies exist.
- [ ] Consider migrating the digital-product tag convention to a dedicated
      metafield (`docs/commerce.md` documents the exact migration path —
      it's a small, isolated change whenever you're ready).
- [ ] Consider migrating capability pills / FAQ entries from section blocks
      to the `capability`/`faq_item` metaobjects if a page ever needs
      single-source-of-truth content shared across many pages at once.
- [ ] Remove or archive development-only files before or shortly after
      launch: `Design-Reference/`, `docs/`, and the root-level `.md` files
      are reference material, not part of the functioning theme — see
      `PROJECT-HANDOFF.md`'s upload-package guidance for exactly what
      Shopify needs versus what it doesn't.
