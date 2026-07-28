# Shopify Admin Setup — Ordered Checklist

This is a setup guide, not a record of anything already done. Nothing on
this list has been executed — every Admin action here requires you (or
whoever holds Admin access) to click through it yourself. Work top to
bottom; later steps generally depend on earlier ones.

Cross-references: `docs/metaobjects.md` (metaobject field specs),
`docs/commerce.md` (product metafields, digital-tag convention),
`LAUNCH-BLOCKERS.md` (what must be resolved before going live),
`PROJECT-HANDOFF.md` (why things are built the way they are).

---

## 1. Upload or connect the theme

- Via Shopify CLI: `shopify theme push` from this project's root (only the
  standard theme folders — see "What NOT to upload" at the bottom).
- Via Admin: Online Store → Themes → Add theme → Upload zip file. Zip only
  `assets/ config/ layout/ locales/ sections/ snippets/ templates/` —
  **not** `Design-Reference/`, `docs/`, or the root `.md` files.
- Do not publish yet — work in the theme preview until the launch checklist
  (`PRE-LAUNCH-CHECKLIST.md`) is clear.

## 2. Create the required Pages

Online Store → Pages → Add page, for each of:
- Get a Quote
- Services (overview)
- Capabilities
- About
- FAQ
- Contact
- Shop (landing)
- Custom 3D Printing, Rapid Prototyping, Product Design Support,
  Small-Batch Manufacturing, Replacement Parts, File Preparation & Print
  Optimization (6 individual service pages)
- Shipping, Privacy, Terms of Service (3 generic policy-info pages)
- Returns (1 dedicated policy-info page — see step 9)

## 3. Assign templates

For each Page above, in its Page editor's "Theme template" field, assign
the matching template:

| Page | Template |
|---|---|
| Get a Quote | `page.quote` |
| Services | `page.services` |
| Capabilities | `page.capabilities` |
| About | `page.about` |
| FAQ | `page.faq` |
| Contact | `page.contact` |
| Shop | `page.shop` |
| Each of the 6 service pages | `page.service` |
| Shipping / Privacy / Terms | `page.policy` |
| Returns | `page.returns` (has the 6 confirmed return terms built in — do not use the generic `page.policy` template for this one) |

## 4. Create navigation menus

Online Store → Navigation:
- Create/edit **Main menu**: Shop, Services, Capabilities, About, plus
  whatever else you want in primary nav.
- Create/edit a **Footer** menu (handle must be `footer` to match
  `footer-group.json`'s two link-list blocks, labeled "Explore" and "Work
  with us" in the theme): include Shop/Services/Capabilities/About in one,
  Get a Quote/FAQ/Contact in the other, or split however you prefer.

## 5. Assign header/footer menus

- Theme Editor → Header section → Menu setting → select your Main menu.
- Theme Editor → Footer section → the two `link_list` blocks ("Explore",
  "Work with us") each have their own Menu setting — point both at your
  Footer menu (or two different menus if you want them to differ).

## 6. Create the service metaobject definitions

Settings → Custom data → Metaobjects → Add definition. Create **five**,
field-for-field per `docs/metaobjects.md`:
- `service` (main entry type)
- `service_scope_item`
- `service_starting_point`
- `service_faq_item`
- `capability`

Get the field types, keys, and reference relationships exactly right —
`docs/metaobjects.md` has the full table for each.

## 7. Create service entries

Content → Metaobjects → `service` → Add entry. Create one entry per
service (Custom 3D Printing, Rapid Prototyping, Product Design Support,
Small-Batch Manufacturing, Replacement Parts, File Prep & Print
Optimization), filling in hero copy, scope cards, starting points,
capability references, FAQ references, and closing CTA per the approved
Design-Reference content for each service.

## 8. Create the Page → service metafield

Settings → Custom data → Pages → Add definition:
- Namespace/key: `custom.service`
- Type: Metaobject reference, validated to the `service` metaobject
- (This is what connects a specific Shopify Page to a specific `service`
  metaobject entry — see `docs/metaobjects.md` for why this mechanism was
  chosen over a per-page template.)

## 9. Connect each service Page

For each of the 6 service Pages created in step 2, open its metafields
section in the Page editor and set the new `custom.service` metafield to
point at the matching metaobject entry from step 7.

## 10. Create product metafields

Settings → Custom data → Products → Add definition, three fields (see
`docs/commerce.md` for exact types):
- `custom.license` (multi-line text)
- `custom.formats` (single line text)
- `custom.print_notes` (multi-line text)

## 11. Tag digital products temporarily

Until a dedicated metafield replaces it (see `docs/commerce.md`), every
STL/digital product needs the exact tag `digital` (lowercase, no
variations) for the theme to show the branded STL treatment, correct cart
behavior, and correct buy-button label.

## 12. Create collections

At minimum: an "All" or "Physical products" collection and a "Digital
files" / STL collection, matching the two tiles on the Shop landing page.
Add whatever category collections you want (Functional, Best sellers, New
arrivals, etc. — referenced as optional "quick link" tiles).

## 13. Select homepage products

Theme Editor → Home page → "Featured products" section → set each of the
3 product blocks to a real product. Works correctly with 0, 1, 2, or 3
selected (see `PROJECT-HANDOFF.md`), but shouldn't stay at 0 for launch.

## 14. Select shop collections

Theme Editor → Shop page → "Shop landing" section → set the "Physical
products" and "Digital STL files" tile blocks to your real collections
from step 12, and the quick-link blocks likewise. Also set the "New &
noteworthy" section's collection (defaults to "All").

## 15. Select empty-cart merchandising

Theme Editor → Cart page → "Cart items" section → up to 3 product blocks
under "Empty-cart product." These only show when the cart is empty.

## 16. Select 404 merchandising

Theme Editor → 404 page → set the optional "Merchandising collection" if
you want product suggestions on the 404 page; leave blank to omit that
grid entirely (nothing breaks either way).

## 17. Upload photography

Every `image_picker`/`eh-image-slot` field across every page currently
shows a placeholder with its approved shot brief. Replace each in the
Theme Editor as real photography becomes available — see
`PROJECT-HANDOFF.md` §11 for the full specimen-content inventory and
Handoff §G for the shot list.

## 18. Replace specimen content

Work through every visible "SPECIMEN CONTENT," "PLACEHOLDER," and similar
badge across the site (Homepage FAQ/featured content, Service FAQs,
Capabilities Equipment/Build-volume, About's founder story, general FAQ's
several categories) and replace with real content, then turn off each
section's "show specimen badge" setting once its content is real. Don't
turn off a badge before the content behind it is actually real.

## 19. Enter native Shopify policies

Settings → Policies → enter real text for Shipping, Refund, Privacy, and
Terms of Service. **The Refund policy can start from the 6 confirmed
Returns terms already in the theme** (`templates/page.returns.json`) —
transcribe them, then have them reviewed/expanded by whoever handles your
legal review; don't publish them as a complete policy without that review.
See `LAUNCH-BLOCKERS.md` for the exact confirmed wording and what's still
missing.

## 20. Connect quote links

Every "Get a quote" button/link across the theme is currently blank by
design (no predicted Page handle was guessed). Once the Get a Quote Page
exists (step 2), go through the Theme Editor on each page
(Home/About/Services/Capabilities/FAQ/product pages/404) and set each
quote-related URL setting to point at it.

## 21. Configure customer accounts

Settings → Customer accounts. The theme supports "accounts optional" per
the approved Handoff; the account icon in the header is hidden by default
(`eh_show_account_icon` setting) regardless of this choice — flip that
setting on in Theme Editor → Header if/when you want the icon visible.

## 22. Configure search

Settings → Search & discovery. Predictive search is a theme setting
already enabled by default (Dawn's own `predictive_search_enabled`); no
theme changes needed here, just confirm it matches your preference.

## 23. Configure checkout and shipping

Settings → Shipping and delivery: set up your actual shipping zones/rates.
Settings → Checkout: configure as needed. Nothing in the theme assumes
particular shipping rates or zones.

## 24. Configure taxes

Settings → Taxes and duties, per your actual tax obligations. The theme's
cart footer already displays Dawn's native tax-inclusive/exclusive
messaging correctly based on whatever you configure here — no theme
changes needed.

## 25. Connect the future quote form solution

Not yet chosen (deliberately deferred — see `LAUNCH-BLOCKERS.md`). Once a
form app or custom endpoint is selected: replace the stub in
`assets/eh-quote-form.js`'s `submitQuoteForm()` function per the
integration-boundary comment directly above it. This is a code change, not
an Admin action — flagged here so it isn't missed in the launch sequence.

## 26. Connect Shopify Digital Downloads

Apps → find and install "Digital Downloads" (free, by Shopify). Configure
it against your digital/STL products. Once connected, also: (a) revert
`snippets/eh-stl-cover.liquid`'s badge default from `'DIGITAL FILE'` back
to `'INSTANT DOWNLOAD'`, and (b) restore the "Buy & download" button label
in `snippets/buy-buttons.liquid` — both were temporarily softened because
this app wasn't connected yet (see `LAUNCH-BLOCKERS.md`).

## 27. Test notifications and emails

Settings → Notifications: review/customize the order confirmation, quote
(once connected), and contact-form emails. Send yourself a real test order
and a real test contact submission before launch.

## 28. Domain connection considerations

Settings → Domains, whenever you're ready to point a real domain at this
store. Not required to finish theme work, but plan the timing around
launch — DNS propagation can take time.

## 29. Final storefront preview

Use the Theme Editor's preview and the theme's preview URL to click
through every page on desktop, tablet, and mobile widths before removing
the password. Cross-reference `PRE-LAUNCH-CHECKLIST.md`.

## 30. Remove storefront password only after launch blockers are resolved

Online Store → Preferences → Password protection. Do not disable this
until every item in `LAUNCH-BLOCKERS.md` is resolved and
`PRE-LAUNCH-CHECKLIST.md`'s Blocker/Required items are all checked off.
