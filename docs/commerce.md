# Commerce architecture notes

## Digital vs. physical product detection — temporary

A product is treated as a digital/STL product if it has the tag **`digital`**
(case-sensitive, exact match). This is checked in:

- `snippets/card-product.liquid` (`eh_is_digital`) — swaps the card image for
  the branded `eh-stl-cover`
- `sections/main-product.liquid` — swaps the whole media gallery for
  `eh-stl-cover` on the product page
- `snippets/buy-buttons.liquid` — digital-aware button label (currently
  "Add to cart" for both physical and digital, same as Dawn's default —
  see the note below)
- `sections/main-cart-items.liquid`, `sections/cart-notification-product.liquid`
  — "Digital product" line-item descriptor

**Also temporary, and layered on top of the tag check**: none of the
digital-product copy currently promises instant/automatic delivery,
because Shopify Digital Downloads isn't installed yet — see
`LAUNCH-BLOCKERS.md`. The button used to say "Buy & download" and the
cart descriptor used to say "Digital · Instant download"; both were
softened during final QA once nothing was actually being delivered on
purchase. Every site this touched has a `LAUNCH BLOCKER` comment showing
the one-line revert once Digital Downloads is connected
(`buy-buttons.liquid`, `eh-stl-cover.liquid`'s badge default, both cart
descriptors, `main-product.liquid`'s download-info card, and two FAQ
answers in `templates/index.json`/`templates/page.faq.json`).

**This is explicitly temporary.** A tag is a shallow signal — it says nothing
about license terms, formats, or print notes, and nothing stops a merchant
from mistagging a product. It was chosen because it requires zero store
configuration to start using and doesn't block this build.

**Migration path**: replace the tag check with a metafield (e.g.
`product.metafields.custom.is_digital`, a boolean, or infer digital-ness from
the presence of the `custom.license`/`custom.formats` metafields below) once
Digital Downloads and the real fulfillment flow are set up. Every place that
checks `product.tags contains 'digital'` is a single, isolated `if`
condition — none of them assume a tag is the only possible signal, so
swapping the condition to a metafield check is a one-line change per file,
not a re-architecture. Physical products are unaffected either way: the
check is additive (`if digital … else … normal physical rendering`), so a
product that doesn't match the digital condition — by tag today, by
metafield later — always falls through to ordinary physical-product
rendering untouched.

## Required product metafields (digital/STL products)

None of these exist in the store yet — create them in Shopify Admin
(Settings → Custom data → Products) before a digital product page can show
real license/format/print-note content. Until then, each renders a labeled
specimen fallback (see `sections/main-product.liquid`, `eh_digital_download`
and `eh_digital_license` blocks).

| Metafield | Namespace.key | Type | Notes |
|---|---|---|---|
| License | `custom.license` | Multi-line text (plain) | Personal-use/commercial terms. Rendered with `newline_to_br`, so plain text with real line breaks displays correctly — no need for a Rich text field. `everhaven.license` (a dedicated namespace) is an equally valid choice if you'd rather keep EverHaven-specific fields out of `custom` — pick one and use it consistently across every digital product. |
| Formats | `custom.formats` | Single line text | e.g. "STL, STEP" |
| Print notes | `custom.print_notes` | Multi-line text (plain) | Layer height, orientation notes, etc. — also rendered with `newline_to_br`. |

No metafield values are invented anywhere in the theme code — every one of
these renders its specimen/placeholder state until the merchant sets a real
value.

## Digital Downloads app

Required for actual file delivery on STL products — not installed (per
Step 07 instructions: "do not install apps"). Tracked as a future launch
dependency in `LAUNCH-BLOCKERS.md`, not built into the theme's logic; the
digital PDP and cart render correctly regardless of whether it's installed,
so installing it later requires no theme changes.

## Collection low-count editorial mode

`collection.products_count < 4` (exact expression, per the Handoff) switches
`sections/main-collection-product-grid.liquid` from Dawn's standard
grid+facets+pagination to alternating editorial rows
(`snippets/eh-collection-editorial-row.liquid`), driven by the real
`collection.products` — not a manually curated block list. Facets/sorting
UI stays available and functional at any count; only the *results* rendering
changes. `collection.products_count == 0` and `>= 4` render Dawn's own
existing grid/empty-state logic, untouched.
