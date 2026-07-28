# EverHaven Shopify Theme — Project Handoff

Source of truth for the current state of the codebase. If a future session's
context gets compacted, read this file first, then the docs it links to,
before touching anything: `docs/metaobjects.md`, `docs/commerce.md`,
`LAUNCH-BLOCKERS.md`, `SHOPIFY-ADMIN-SETUP.md`, `PRE-LAUNCH-CHECKLIST.md`.

**Design authority**: `Design-Reference/` (visual truth) and
`Design-Reference/EverHaven Handoff Package.dc.html` (architecture truth).
This document describes what's actually been *built* against that authority
— it does not replace it.

**Base theme**: Dawn 15.5.0, unmodified except where explicitly listed below.
**Git**: local branch `shopify-theme`, deliberately unrelated history from
`origin/main` (which holds an old static-site build — see git log). Nothing
has been committed or pushed from this work yet.

---

## 1. Do not rewrite Dawn commerce from scratch

This is the single most important rule for anyone continuing this build.
Every commerce feature — variants, cart math, quantity rules, facets/sort,
predictive search, quick-add, localization, customer accounts — is Dawn's
own, untouched. All customization has been **additive**: new block types
appended to existing schemas, new `{% elsif %}` branches next to Dawn's
original conditions, new CSS classes alongside Dawn's own. When extending
this theme further, find the smallest possible addition to Dawn's existing
file rather than replacing its logic. See `docs/commerce.md` for the
specific pattern used for physical/digital product branching.

---

## 2. Phases completed

| Phase | Content |
|---|---|
| Foundation + global chrome | Design tokens (`assets/everhaven.css`), fonts, header/footer/announcement bar, account-icon gating |
| Shared component system | 15 `eh-*` sections + 7 `eh-*` snippets (list below; count includes `eh-policy-header`, added during the supporting-pages phase) |
| Homepage | `templates/index.json` |
| Get a Quote page | `templates/page.quote.json`, `eh-quote-form.liquid`, `assets/eh-quote-form.js` |
| Services (overview + reusable detail) | `templates/page.services.json`, `templates/page.service.json`, `eh-service-detail.liquid`, `service` metaobject architecture |
| Commerce | Shop landing, collection count-adaptive layout, physical + digital PDP, cart (page + drawer-notification), search |
| Capabilities page | `templates/page.capabilities.json` — no new section needed |
| About / general FAQ / Contact | `templates/page.about.json`, `templates/page.faq.json`, `templates/page.contact.json` |
| Supporting pages, policies, 404 | `templates/page.policy.json`, `templates/page.returns.json` (dedicated — carries 6 confirmed Returns terms), `eh-policy-header.liquid`, long-form `.rte`/`.shopify-policy__*` styling, restyled `main-404.liquid` — see §14 |
| Final code QA + Admin setup plan | Full theme audit (this pass), 2 real bugs found and fixed (§15), non-promissory digital-delivery copy pass (§16), `SHOPIFY-ADMIN-SETUP.md`, `PRE-LAUNCH-CHECKLIST.md` |

**Not yet built**: order-status customizations, any app installation, the
quote-form backend, live metaobject entries in the store, and — separately
from theme work entirely, since it isn't code — the actual policy text
itself (§14).

---

## 3. Theme architecture

- All custom sections/snippets are prefixed `eh-` per the project's naming
  rule; everything else in `sections/`/`snippets/` is stock Dawn (or Dawn
  additively modified — see §5).
- Design tokens (color, type, spacing, radius, motion) live in
  `assets/everhaven.css` as CSS custom properties, applied on top of Dawn's
  own CSS variable system rather than replacing it.
- Shared building blocks (`eh-section-header`, `eh-image-slot`, `eh-icon`)
  are snippets, not sections — they carry no schema of their own; the
  *calling* section's schema is what's editable in the Theme Editor.
- Where a component might eventually need `h1` (i.e., it could be the first
  section on a page), it exposes a `heading_tag` setting (`h1`/`h2`,
  default `h2`). Added to `eh-hero-split`, `eh-icon-cards`, `eh-faq` as the
  need arose — check for this setting before assuming a new page's hero
  needs a new component.

### Custom sections (`sections/eh-*.liquid`)
`eh-hero-split` · `eh-path-cards` · `eh-icon-cards` · `eh-process-steps` ·
`eh-capability-strip` · `eh-featured-editorial` · `eh-featured-products` ·
`eh-featured-projects` · `eh-principles` · `eh-cta-dark` · `eh-faq` ·
`eh-quote-form` · `eh-service-detail` · `eh-shop-landing` · `eh-policy-header`

### Custom snippets (`snippets/eh-*.liquid`)
`eh-section-header` · `eh-image-slot` · `eh-icon` · `eh-stl-cover` ·
`eh-made-by-everhaven` · `eh-confirmation-card` · `eh-collection-editorial-row`

### Custom JS assets
`assets/eh-quote-form.js` (quote form validation/dropzone/confirmation —
see §7) · `assets/eh-faq-accordion.js` (shared single-open accordion
custom element, used by every `eh-faq` instance and the inline FAQ markup
on `eh-service-detail` — **created** during the Services phase when the
accordion was extracted from an inline `{% javascript %}` block into this
shared file; **modified** twice since, not re-created: once during the
supporting-pages phase to fix a duplicate-`class`-declaration bug that
surfaced when a page renders many `eh-faq` instances at once (e.g. the
general FAQ page's 9 categories), and again during final QA to actually
load the `<script>` tag itself only once per page — see "Single-load
script architecture" below; that first fix made re-execution *safe*, this
one makes re-execution *not happen at all*)

**Single-load script architecture**: `eh-faq-accordion.js` is included via
one `<script src>` tag in `layout/theme.liquid`, not from inside
`eh-faq.liquid`/`eh-service-detail.liquid` themselves. Both sections used
to emit their own tag, which meant a page rendering the section many times
(again, the 9-category FAQ page) produced that many identical `<script>`
tags — wasteful, and the reason the duplicate-declaration bug above existed
in the first place. Loading it once from the layout guarantees exactly one
tag regardless of how many `eh-faq`/`eh-service-detail` instances a page
has; the custom element's own `customElements.get()` guard remains as a
second, independent layer of defense (e.g. against a future Theme Editor
reload of the layout itself), but no longer has to protect against
multiple copies on one page load. `eh-quote-form.js` was deliberately left
as a per-section include: it appears exactly once, on one page
(`page.quote.json`), today — moving it would solve a problem that doesn't
currently exist. Its internal registration is still defensively guarded
(§15) in case a merchant ever adds a second quote-form section to a page.

---

## 4. Templates created

`index.json` · `page.quote.json` · `page.service.json` · `page.services.json` ·
`page.capabilities.json` · `page.about.json` · `page.faq.json` ·
`page.contact.json` (modified from Dawn's default) · `page.shop.json` ·
`product.digital.json` · `product.json` (modified) · `cart.json` (modified) ·
`page.policy.json` (generic/specimen — shared by Shipping/Privacy/Terms) ·
`page.returns.json` (dedicated — carries the 6 confirmed Returns points;
see §14) · `404.json` (modified from Dawn's default)

---

## 5. Modified Dawn files (all additive — see inline comments in each file)

| File | What changed |
|---|---|
| `layout/theme.liquid` | `<title>`/meta-description override from a linked `service` metaobject's SEO fields, scoped to `template.suffix == 'service'` only, with a verified fallback chain (see comment block in the file) |
| `sections/header.liquid` | Added `eh_show_account_icon` setting (default off), ANDed with Dawn's own `shop.customer_accounts_enabled` check |
| `snippets/header-drawer.liquid` | Same account-icon gate, mobile drawer |
| `sections/header-group.json` | `eh_show_account_icon: false` |
| `snippets/card-product.liquid` | Digital-product branch (STL cover) — see §6 |
| `sections/main-product.liquid` | 3 new block types (`eh_made_by_everhaven`, `eh_digital_download`, `eh_digital_license`); gallery swapped for `eh-stl-cover` only when the product is digital |
| `snippets/buy-buttons.liquid` | "Buy & download" label for digital products only |
| `sections/main-cart-items.liquid` | Digital line-item descriptor + STL micro-cover; new `product` blocks for empty-cart merchandising, rendered inside Dawn's own empty-state markup so it stays correct under Dawn's AJAX cart refresh |
| `sections/main-cart-footer.liquid` | All-digital carts get a shipping-free tax note instead of Dawn's "shipping calculated at checkout" copy |
| `sections/cart-notification-product.liquid` | Same digital treatment as the cart page, in the popup — no JS touched |
| `sections/main-collection-product-grid.liquid` | New `elsif collection.products_count > 0 and < 4` branch (editorial rows); Dawn's `== 0` and `>= 4` branches untouched |
| `sections/contact-form.liquid` | Added optional Subject/Order-number fields (same pattern as Dawn's own Phone field); made Name + Message `required`/`aria-required` (Shopify's native form only enforces Email) |
| `sections/main-404.liquid` | Rebuilt from Dawn's near-empty stock version (which had no schema at all): brand styling, editable CTA button blocks, optional native search form, optional merchandising from a merchant-selected collection — nothing hardcoded |
| `templates/product.json`, `templates/cart.json`, `templates/page.contact.json`, `templates/404.json` | Wired the above new blocks/sections in |

---

## 6. Temporary digital-product architecture

Full detail: **`docs/commerce.md`**. Summary: a product is "digital" if it
has the tag `digital` — checked independently in 6 places (`card-product`,
`main-product`, `buy-buttons`, `main-cart-items`, `main-cart-footer`,
`cart-notification-product`), each a single additive `if`. Migrating to a
metafield later is a one-line change per file, not a re-architecture.
Required digital-product metafields (`custom.license`, `custom.formats`,
`custom.print_notes`) are documented there too — none exist in the store
yet; every reference renders a specimen fallback until they're set.

---

## 7. Quote-form backend integration boundary

Full detail: **`LAUNCH-BLOCKERS.md`** and the comment block directly above
`submitQuoteForm()` in `assets/eh-quote-form.js`. Summary: the quote form
is fully built, validated, and interactive, but submission is a stub that
never sends anything — no form app or endpoint has been chosen (Shopify's
native contact form can't take file attachments, so this needs an app or a
custom endpoint). **This is a launch blocker, not a bug.**

---

## 8. Metaobjects and metafields

Full detail: **`docs/metaobjects.md`** (`service`, `service_scope_item`,
`service_starting_point`, `service_faq_item`, `capability` — field-by-field)
and **`docs/commerce.md`** (product metafields for digital products).

None of these definitions exist in the live store yet — they're documented
specs for Admin-side setup, not files that create themselves. The
`eh-service-detail` section and `eh-capability-strip`/capability-referencing
content all render sensible fallback/specimen states in the meantime (see
§10), so the theme is fully previewable before any of this is configured.

**Deliberately not centralized further**: capability pills (`eh-capability-strip`)
and FAQ entries (`eh-faq`) remain block-based everywhere, including on this
step's new pages. Per the standing decision from the Services phase: don't
force content into metaobjects until a page *genuinely* requires shared
centralized data across many pages simultaneously. Re-evaluate if that
threshold is crossed later.

---

## 9. Launch blockers

Full list: **`LAUNCH-BLOCKERS.md`**. Headline item: the quote-form backend
(§7). Everything else there is Admin-side configuration, not code.

---

## 10. Admin-side setup still required (not code — cannot be done from theme files)

- Create the `service`, `service_scope_item`, `service_starting_point`,
  `service_faq_item`, and `capability` metaobject **definitions** (Settings
  → Custom data), matching `docs/metaobjects.md` field-for-field
- Create the `custom.service` **page metafield definition** (metaobject
  reference to `service`), and the `custom.license` / `custom.formats` /
  `custom.print_notes` **product metafield definitions**, per `docs/commerce.md`
- Create the actual Shopify Pages (Get a Quote, Services, Capabilities,
  About, FAQ, Contact, and the 6 individual service pages) and assign the
  matching templates (`page.quote`, `page.services`, `page.capabilities`,
  `page.about`, `page.faq`, `page.contact`, `page.service` ×6)
- Wire every cross-page link that's currently blank in the JSON templates
  (service card links, capabilities links, quote links) once those Pages
  exist — deliberately left unset rather than guessing handles; see
  `docs/metaobjects.md` for the full list of what needs connecting
  and where
- Create `main-menu` / footer navigation with real links
- Install Shopify Digital Downloads (for STL fulfillment) — not installed
- Choose and install/configure the quote-form backend (§7) — not chosen
- Tag digital products `digital` (or migrate to the metafield first — §6)
- Fix the git history divergence between local `shopify-theme` and
  `origin/main` before ever pushing (see git log — two unrelated histories)
- Enter real policy text in Admin → Settings → Policies, and create the
  Shipping/Returns/Privacy/Terms Pages with the `policy` template assigned
  — see §14 for the full picture and why these are two separate systems
- Connect the 404 page's CTA button links and (optionally) its
  merchandising collection once the relevant pages/collections exist

---

## 11. Known specimen content (visible on-storefront labels — do not remove until replaced with real content)

- Homepage: featured products, featured projects (section disabled by
  default), FAQ answers
- Get a Quote: none (copy is fully approved/final)
- Services: individual service FAQ answers, capability-detail FAQ
- Capabilities: Equipment and Build-volume sections (no real specs exist
  anywhere in the source — clearly labeled, not implied as confirmed), FAQ
  answers
- About: the entire founder-story section (explicitly placeholder in the
  approved design itself), workshop photo (placeholder shot brief)
- General FAQ: prototypes/small-batch, replacement parts, design support,
  digital STL, and shipping/returns categories all carry specimen badges;
  quote/files/materials/physical-products categories are fully confirmed
- Contact: email address and response-time commitment both explicitly
  marked pending/uncommitted
- All PDP photography, digital product license/formats/print-notes: specimen
  until real product data and metafields exist
- **Shipping, Privacy, Terms**: 100% specimen — see §14. Nothing beyond an
  eyebrow, a "LAST UPDATED · Pending" line, and a "PLACEHOLDER — NEEDS REAL
  POLICY & LEGAL REVIEW" badge. No policy statement of any kind exists
  anywhere in the approved source material for these three, so none was
  written into the theme.
- **Returns**: partially confirmed, not fully specimen. Six specific
  operational points are approved and live in `templates/page.returns.json`
  (14-day window, unused/undamaged condition, who pays return shipping,
  original-shipping nonrefundable, 7-day damaged/incorrect reporting with
  photos, and the contact email `support@everhaven.design`) — rendered in a
  visually distinct "CONFIRMED" callout, deliberately styled differently
  from the specimen badge so the two can never be mistaken for each other.
  Everything a complete returns policy conventionally also covers beyond
  those 6 points (restocking fees, cancellations, warranties, international
  returns, digital/STL product refund terms) is **not** confirmed and was
  **not** drafted — the specimen badge on that page covers exactly that
  remaining gap. See §14 and `LAUNCH-BLOCKERS.md` for the full breakdown.
- 404 page: copy is approved (from the Supporting Pages design), but its
  CTA links and optional merchandising collection are unset by default —
  see §14/Theme Editor controls.

---

## 12. Future migration paths

- Digital-tag → dedicated metafield (§6)
- Block-based capability pills / FAQ → `capability`/`faq_item` metaobjects,
  if/when a page genuinely needs single-source-of-truth content across many
  pages (§8)
- Service-card links (Services overview, service-detail breadcrumb/capability
  links) → derived automatically from a direct Page reference on the
  `service` metaobject, instead of manually set per-card URLs, once that
  metaobject field is added
- Quote-form stub → real backend (§7, §9)

---

## 13. Load-bearing files — treat with care

Deleting, renaming, or restructuring any of these breaks multiple pages at
once (not an exhaustive list, but the highest-blast-radius ones):

- `assets/everhaven.css` — every custom section depends on its tokens/classes
- `snippets/eh-section-header.liquid`, `snippets/eh-image-slot.liquid`,
  `snippets/eh-icon.liquid` — depended on by nearly every `eh-*` section
- `assets/eh-faq-accordion.js` — loaded by every `eh-faq` instance and the
  inline FAQ-style markup elsewhere; removing it silently breaks the
  single-open accordion behavior (native `<details>` would still work, just
  without the enforced single-open rule)
- `sections/eh-hero-split.liquid`, `sections/eh-icon-cards.liquid` — reused
  across Home, Services, Service-detail, Capabilities, About, and Contact;
  a breaking schema change here cascades to six-plus templates
- `snippets/card-product.liquid`, `sections/main-product.liquid` — the
  physical/digital branching point; see §6 before touching either
- `docs/commerce.md`, `docs/metaobjects.md`, `LAUNCH-BLOCKERS.md` — the
  authoritative specs this file links to rather than duplicates

---

## 14. Native Shopify policies vs. custom informational pages

**Nothing in this section is legal advice, and nothing here should be
treated as a finished policy.** It documents where policy content lives
in the theme and what's still missing — the actual legal/business review
is separate work, tracked as an open item in `LAUNCH-BLOCKERS.md`.

There are **two distinct systems** here — don't conflate them:

1. **Shopify's native policies** (Admin → Settings → Policies: Shipping,
   Refund, Privacy, Terms of Service, and Subscription if used). These are
   Shopify's own official policy records — they power `shop.shipping_policy`,
   `shop.refund_policy`, `shop.privacy_policy`, `shop.terms_of_service`,
   drive the checkout's own policy links, and are what Dawn's footer links
   to natively via its existing `show_policy: true` setting (already
   enabled in `footer-group.json` — this required no theme code at all;
   Dawn's stock footer only shows a link for whichever policies actually
   have text entered, and silently omits the rest). **No theme file can
   create or edit these — the text must be entered directly in Admin.**
2. **Custom informational pages** (`templates/page.policy.json` and
   `templates/page.returns.json`): a merchant-editable, plain-language
   companion page — eyebrow + "last updated" line + an optional
   customer-facing summary callout + specimen badge (`eh-policy-header.liquid`)
   above Dawn's own `main-page.liquid` section, which renders whatever the
   merchant writes into that specific Page's body content in Admin. This
   is where a friendlier, FAQ-adjacent explanation could live *alongside*
   (never *instead of*) the official policy record in #1.

   **Two template files, not one**, because Returns is no longer fully
   generic:
   - `page.policy.json` — Shipping, Privacy, Terms. Fully generic,
     specimen-only, no confirmed content exists for any of these three.
   - `page.returns.json` — dedicated, because it carries 6 *actually
     confirmed* operational points (see §11) as `summary_point` blocks
     on `eh-policy-header`. These render in a distinctly-shaped callout —
     a solid-bordered card with a check icon and the label "Returns at a
     glance" (both editable) — that cannot be confused with the specimen
     badge below it, which still covers everything else a returns policy
     conventionally needs that wasn't approved. This block was originally
     built with a green "CONFIRMED" label; that read as internal
     project-status language rather than customer-facing copy, so it was
     replaced with plain Graphite & Signal styling and ordinary storefront
     wording — the distinction between "settled" and "still pending" now
     comes from shape, icon, and wording, not color, so it holds up for
     colorblind readers too.
   - `eh-policy-header.liquid`'s `summary_point` block type is generic
     (any policy page could use it if/when it gets its own approved
     terms) — it isn't Returns-specific in code, only in current usage.

**Current state**: Shipping/Privacy/Terms remain fully empty — no policy
text, official or plain-language, exists anywhere in the approved
Design-Reference or this project's documentation for any of the three.
Returns has the 6 confirmed points above; everything beyond them (return
mechanics, restocking fees, cancellations, warranties, international
returns, and — importantly — digital/STL product refund terms, which are
not covered by the 6 points and were not assumed) remains unconfirmed and
undrafted. The Supporting Pages design itself shows this exact template
with a "PLACEHOLDER — NEEDS REAL POLICY & LEGAL REVIEW" badge and a
literal "Section heading" / generic body placeholder for the parts that
are still pending — confirming that gap is expected and approved-as-pending,
not an oversight. Nothing beyond the 6 confirmed points was invented to
fill it (no processing/transit time, no privacy or data-retention claim,
no governing law — see `LAUNCH-BLOCKERS.md` for the full excluded list).

**Long-form content styling**: `.rte` (Dawn's existing rich-text class,
already used by `main-page`, product/collection descriptions, and blog
content) and Shopify's native `.shopify-policy__*` classes now share one
styling treatment in `assets/everhaven.css` — 720px measure, Archivo
headings at h2/h3 scale, styled lists/tables/links, a basic `@media print`
rule. Both native policy pages and the custom `page.policy` template read
consistently once real content exists in either.

**404 page** (`sections/main-404.liquid`, `templates/404.json`): rebuilt
from Dawn's near-empty stock version. Copy ("This page doesn't exist." /
"Like a part that never got printed...") is the approved Supporting Pages
copy. CTA buttons are editable blocks (2 shipped, links unset — connect
once Shop/Quote pages exist), the search form uses Shopify's native
`routes.search_url`, and the optional merchandising grid needs a
merchant-selected collection (`collection` setting, blank by default) —
with none set, the grid simply doesn't render; nothing is hardcoded, and
any digital/STL products in that collection get their branded card
automatically through the existing `card-product` reuse.

**Still needed before these are real** (Admin-side, not code):
- Enter actual text for each native policy (Settings → Policies) — Refund
  policy can start from the 6 confirmed Returns points, but still needs
  real legal review before it's complete
- Create the Shipping/Privacy/Terms Pages, assign the `policy` template
  (fully generic, nothing confirmed yet)
- Create the Returns Page, assign the `returns` template (confirmed points
  built in), and write any additional plain-language body content
- Decide whether Privacy/Terms custom pages are needed at all, or whether
  linking straight to the native policy (`shop.privacy_policy.url` /
  `shop.terms_of_service.url`) is sufficient — both are supported; nothing
  in the theme forces the custom page to exist
- Confirm whether `support@everhaven.design` (confirmed for returns
  reporting) is also the general contact/business email before using it
  on the Contact page or anywhere else — not yet confirmed for that
  broader use
- Confirm real response-time commitment before it appears anywhere — none
  exists today (§11)

---

## 15. Final QA pass — Dawn safety audit + real bugs found and fixed

Full audit performed across every section, snippet, template, and JS
asset. Two genuine bugs were found (not stylistic issues) and fixed:

1. **Duplicate custom-element registration SyntaxError.** Both
   `assets/eh-faq-accordion.js` and `assets/eh-quote-form.js` declared a
   bare top-level `class` and only guarded the `customElements.define()`
   call, not the class declaration itself. Classic (non-module) `<script>`
   tags share one global lexical scope, so when a section renders its own
   `<script src>` tag multiple times on one page — which happens today on
   the general FAQ page (9 `eh-faq` instances → 9 identical script tags) —
   the 2nd+ occurrence threw `SyntaxError: Identifier has already been
   declared`. Fixed by moving the class declaration *inside* the
   `if (!customElements.get(...))` guard in both files, so re-execution is
   a no-op. `eh-quote-form.js` was fixed defensively (only one quote-form
   section exists per page today, but nothing stops a merchant from adding
   a second one in the Theme Editor). **Follow-up during final pre-commit
   QA**: rather than stop at "safe to repeat," `eh-faq-accordion.js`'s
   `<script>` tag was moved out of `eh-faq.liquid`/`eh-service-detail.liquid`
   entirely and into a single include in `layout/theme.liquid`, so the
   9-instance FAQ page now emits exactly one script tag instead of nine
   (see "Single-load script architecture" in §3). `eh-quote-form.js` stayed
   a per-section include — it only ever has one real instance per page, so
   there was no duplicate-tag problem to solve there, only the
   already-fixed defensive guard.
2. **`eh-shop-landing.liquid` had zero `<h1>` elements.** It rendered its
   heading via `eh-section-header` without ever passing `heading_tag`, so
   it silently defaulted to `h2` — meaning the Shop page had no page-level
   heading at all. Fixed the same way as `eh-icon-cards`/`eh-faq` before
   it: added a `heading_tag` (h1/h2, default h2) setting, and set it to
   `h1` in `templates/page.shop.json`.

**Dawn files modified** (all additive; none rewrite existing Dawn logic —
see §1). Risk assessed as Low unless noted:

| File | Why modified | Merge risk |
|---|---|---|
| `layout/theme.liquid` | SEO title/description override from a linked `service` metaobject, scoped to `template.suffix == 'service'` | Low — isolated block, doesn't touch Dawn's own title logic beyond variable substitution |
| `sections/header.liquid` | Account-icon visibility gate (ANDed with Dawn's own check) | Low |
| `snippets/header-drawer.liquid` | Same gate, mobile | Low |
| `sections/header-group.json` | One setting default | Low |
| `snippets/card-product.liquid` | Digital-product branch (STL cover swap) | Low — single additive `if`, physical path untouched |
| `sections/main-product.liquid` | 3 new block types, gallery swap for digital products | **Medium** — largest/most actively-developed Dawn file touched; new block types are self-contained `{% case %}` arms (Dawn's own extension pattern), gallery swap is one wrapping if/else. See "candidates to extract" below. |
| `snippets/buy-buttons.liquid` | Digital-aware label (now reverted to Dawn's default — see §16) | Low |
| `sections/main-cart-items.liquid` | Digital descriptor/cover, empty-cart merchandising blocks | Medium — added a `blocks` array to a section that previously had none; a future Dawn update adding its own blocks here could need manual reconciliation |
| `sections/main-cart-footer.liquid` | All-digital-cart tax-note branch | Low — new branch runs *before* Dawn's untouched original, which still fully owns the `else` |
| `sections/cart-notification-product.liquid` | Same digital treatment, popup | Low |
| `sections/main-collection-product-grid.liquid` | Low-count (1–3) editorial branch | Low — new `elsif`, Dawn's `== 0` and `>= 4` bodies are byte-for-byte original |
| `sections/contact-form.liquid` | Optional Subject/Order-number fields, required Name/Message | Low |
| `sections/main-404.liquid` | Full rebuild — Dawn's stock version had no schema at all | Low risk of literal conflict (little to conflict with); high likelihood a future Dawn 404 redesign supersedes this rather than merges with it — review on next Dawn upgrade |
| `templates/product.json`, `templates/cart.json`, `templates/404.json`, `templates/page.contact.json` | Wired new blocks/sections into Dawn's default templates | Low |

**Candidates to extract into snippets** (identified, not acted on — no
correctness/accessibility/performance issue forces this, so it wasn't done
per this step's own instruction not to refactor for style alone):
`main-product.liquid`'s three `eh_digital_download`/`eh_digital_license`/
`eh_made_by_everhaven` block bodies could each move into their own
snippet, shrinking that file's diff against future Dawn versions. Worth
doing before the *next* Dawn upgrade, not urgent now.

**Deliberate choice that reduces upgrade risk further**: no brand tokens
were ever added to `config/settings_schema.json` or `settings_data.json`
— everything lives in `assets/everhaven.css` as CSS custom properties
layered on Dawn's own variable system. This keeps Dawn's actual settings
schema completely untouched, which is one less file to reconcile on
upgrade.

---

## 16. Non-promissory digital-delivery language

Shopify Digital Downloads isn't installed (§9), so as of this pass, no
digital product actually delivers a file on purchase. Several pieces of
copy previously implied instant/automatic delivery and were temporarily
softened — all documented inline with `LAUNCH BLOCKER` comments at each
site, all reversible in one line once the app is connected:

- `snippets/buy-buttons.liquid`: digital products now show Dawn's normal
  "Add to cart" instead of "Buy & download"
- `snippets/eh-stl-cover.liquid`: badge parameter now defaults to
  `DIGITAL FILE` instead of `INSTANT DOWNLOAD` (still fully brand-styled —
  only the words changed, not the approved visual system)
- `sections/main-cart-items.liquid`, `sections/cart-notification-product.liquid`:
  line-item descriptor now reads "Digital product" instead of "Digital ·
  Instant download"
- `sections/main-product.liquid`: the Download info card now says "This is
  a digital file" instead of "delivered instantly," plus an unconditional
  "DIGITAL DELIVERY SETUP PENDING" badge (separate from the existing
  formats/print-notes badge, which only shows when those metafields are
  blank)
- `templates/index.json`, `templates/page.faq.json`: the two FAQ answers
  about digital downloads no longer say "instant"

All six are tracked as a single **Blocker** item in
`PRE-LAUNCH-CHECKLIST.md`, with the exact revert instructions in
`LAUNCH-BLOCKERS.md`.

---

## 17. What NOT to upload to Shopify

The project folder root also contains files that exist for development
context, not for the live theme. Only these are a real Shopify theme:

```
assets/  config/  layout/  locales/  sections/  snippets/  templates/
```

**Belongs in Git, not in the Shopify upload package** — `Design-Reference/`
(the original design source — reference material, not theme code),
`docs/` (internal architecture notes), and the root-level `.md` files
(`PROJECT-HANDOFF.md`, `LAUNCH-BLOCKERS.md`, `SHOPIFY-ADMIN-SETUP.md`,
`PRE-LAUNCH-CHECKLIST.md`, this file), plus `.gitignore` itself. None of
these affect the storefront if accidentally included in an upload (Shopify
ignores unrecognized top-level folders), but they add dead weight and
expose internal notes unnecessarily. `shopify theme push` via CLI already
handles this correctly by convention; a manual zip-and-upload through
Admin needs to be built by hand from just the 7 folders below.

**Never belongs in Git at all** — `.claude/settings.local.json` (this
session's local Claude Code tool permissions; not theme-related, contains
local machine file paths, was never staged). Covered by `.gitignore`
(`.claude/`), along with `.vscode/`/`.idea/`/`*.bak`/`*.tmp` added
preemptively in case an editor ever drops config files here later —
none of those exist in the repo today either.

**Actual theme files that must be uploaded** (395 files across the 7
folders, verified during final QA):

```
assets/  config/  layout/  locales/  sections/  snippets/  templates/
```

**No temporary generation scripts exist inside this repo** — verified
during final QA. The Node scripts used during development (to generate
large JSON templates programmatically and avoid hand-escaping errors,
and to run the repo-wide validation sweeps referenced throughout this
document) were all written to the session's external scratchpad
directory, never inside this project, so there was nothing to delete
before committing.
