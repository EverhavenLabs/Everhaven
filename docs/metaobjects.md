# Metaobject architecture — Services

These definitions do not exist in the store yet. They must be created in
Shopify Admin (Settings → Custom data → Metaobjects) — or via the Admin
GraphQL API — before the fields below actually hold content. The theme
code in `sections/eh-service-detail.liquid` is written against this exact
structure and will render a graceful specimen/empty state until it does.

This introduces the `capability` metaobject now because the service-detail
template genuinely needs one centralized set of capability labels shared
across six pages — the condition Step 03's approval set for moving off
blocks. The homepage's `eh-capability-strip` section is untouched and
stays block-based; unifying it to also read from `capability` is an easy
later consolidation, not required now.

## 1. `service`

The main entry — one per service (six total: Custom 3D printing, Rapid
prototyping, Product design support, Small-batch manufacturing,
Replacement parts, File preparation & print optimization).

| Field key | Type | Notes |
|---|---|---|
| `internal_name` | Single line text | Admin-only reference, e.g. "Custom 3D Printing — service entry" |
| `title` | Single line text | Public title, e.g. "Custom 3D printing" |
| `eyebrow` | Single line text | Breadcrumb-style label shown above the hero heading |
| `hero_heading` | Single line text | e.g. "Made to your spec. Not off a shelf." |
| `hero_supporting_copy` | Rich text | Hero paragraph |
| `hero_image` | File (image) | Real photo once available |
| `hero_image_brief` | Single line text | Shot brief shown by `eh-image-slot` while `hero_image` is empty |
| `scope_cards` | List of metaobjects → `service_scope_item` | "What this covers" grid, 3–6 cards |
| `process_step1_body_override` | Rich text, optional | Blank = use the global "Describe" body copy |
| `process_step2_body_override` | Rich text, optional | Blank = use the global "Quote" body copy |
| `process_step3_body_override` | Rich text, optional | Blank = use the global "Make" body copy |
| `process_step4_body_override` | Rich text, optional | Blank = use the global "Deliver" body copy |
| `starting_points` | List of metaobjects → `service_starting_point` | "Any of these is enough" rows |
| `capabilities` | List of metaobjects → `capability` | Relevant capability pills for this service |
| `faq_items` | List of metaobjects → `service_faq_item` | Service-specific FAQ (separate from the site-wide FAQ) |
| `closing_cta_heading` | Single line text, optional | Blank = generic "Tell us what you're making." |
| `closing_cta_body` | Rich text, optional | Blank = generic closing copy |
| `seo_title` | Single line text, optional | Overrides the page's title tag when set (see theme.liquid) |
| `seo_description` | Multi-line text (plain), optional | Overrides the meta description when set — kept plain since it's an attribute value, not rendered HTML |

Publish/visibility is Shopify's own built-in metaobject entry status
(Draft/Active) — no custom field needed for it.

Process step **titles** are never overridden — "Describe / Quote / Make /
Deliver" stay identical across every service, matching the approved
design; only the body copy under each title varies per service where the
design genuinely differs (see `EverHaven Service Pages.dc.html`).

## 2. `service_scope_item`

| Field key | Type |
|---|---|
| `title` | Single line text |
| `body` | Rich text |

## 3. `service_starting_point`

| Field key | Type |
|---|---|
| `key` | Single line text (short label, e.g. "3D MODEL") |
| `description` | Single line text |

## 4. `service_faq_item`

| Field key | Type |
|---|---|
| `question` | Single line text |
| `answer` | Rich text |

## 5. `capability`

| Field key | Type |
|---|---|
| `label` | Single line text, e.g. "FDM 3D PRINTING" |

## Page → metaobject connection

Each of the six services gets a real Shopify Page (Admin → Online Store →
Pages), template set to **`page.service`** (the one shared
`templates/page.service.json` file — not six separate templates). Every
one of those six pages uses the *same* template file, so the template
itself can't hold page-specific settings; instead, each Page gets a
metafield:

- Namespace/key: `custom.service`
- Type: **Metaobject reference**, validated to the `service` definition

Set that metafield, on each Page, to point at that page's corresponding
`service` metaobject entry. `sections/eh-service-detail.liquid` reads
`page.metafields.custom.service.value` to know which entry to render.

A section-level metaobject picker setting is also available as an
override/fallback, purely for previewing the template in the Theme Editor
before the six real pages and their metafields are set up — production
pages should rely on the page metafield, not the section setting, so all
six pages can share the one template file correctly.

## Service-card and cross-page links — intentionally blank, not predicted

`templates/page.services.json`'s six service cards, and
`sections/eh-service-detail.liquid`'s breadcrumb ("Services") and
"All capabilities →" links, are all left blank rather than guessing a
future Shopify Page handle (e.g. `/pages/custom-3d-printing`). Guessed
handles would silently break if the real page ends up titled differently.

Each of these is a normal `url` setting, independently editable in the
Theme Editor right now:

- Services overview → six-services section → each card block's link
- Service-detail section → "Services overview link" and "Capabilities
  page link" settings

**After creating the six service Pages, the Services overview Page, and
the Capabilities Page in Admin, go back and set each of these links to
point at the real page.** Nothing renders broken in the meantime — the
cards and links just point nowhere (`#`) until connected.

If the service metaobject architecture later grows a direct Page
reference (Shopify supports metaobject fields that reference a Page),
these links could migrate to being derived automatically from the linked
service entry instead of set by hand per card — that would drop straight
into the existing card markup without changing the visual section at all.
